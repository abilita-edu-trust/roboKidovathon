// The "Find your pathway" registration wizard: card questions, one per step (programme → how you join →
// activity or pathway → theme), then the form for those answers, then a review before sending. Used by the
// register page and, embedded, on the home page.
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Lock,
  MapPin,
  Pencil,
  Share2,
  Sparkles,
} from 'lucide-react';
import { fetchRegisteredSchools } from '../../lib/ideasService';
import { GRADE_GROUP_OPTIONS } from '../../data/vfiFacts';
import { ParticipationFees } from '../../components/ParticipationFees';
import { useSite, type Bilingual } from '../../context/SiteContext';
import { useT } from '../../content/useT';
import { pick } from '../../content/core';
import { useInnohackTracks } from '../../content/innohackContext';
import { ideasClosed } from '../../content/sections/innohack';
import type { ProgrammeTrack } from '../../content/sections/audienceJourneys';
import {
  TRACK_TABS,
  activityChoices,
  answerCard,
  formFor,
  hackTracks,
  isAnswered,
  isGreen,
  pathForTab,
  programmeOf,
  roleChoices,
  stepLabel,
  stepsFor,
  tabForPath,
  themeChoices,
  youngChallenges,
  type IntakeProgramTab,
  type RegisterPath,
  type StepKind,
  type TeamChoice,
} from './flow';
import { FORMS } from './forms';
import { UserFacingError, type FormCtx, type SubmitResult, type SummaryRow, type Values } from './ui';
import { challengeName, lookupTeamCode, normaliseCode, useYoungState } from '../../content/youngChallenges';
import { ChallengesClosed, ChoicesStep, TeamStep, choicesError, teamStepError } from './YoungSteps';
import { AccentContext, ACCENTS, ChoiceGroup, type Accent, type ChoiceItem } from './ChoiceCards';
import { ClassicChoiceCard } from './ClassicChoiceCard';
import { registerIcon } from './icons';

/** Young InnoHack with company challenges: the four steps people count (how you take part, choices, details, review). */
const YOUNG_STEPS: StepKind[] = ['team', 'choices', 'form', 'review'];

interface RegisterWizardProps {
  /** A form to open (a ?tab= link): the questions it answers are skipped; null starts at step 1. */
  initialTab?: IntakeProgramTab | null;
  onNavigateVoting?: () => void;
  /** Keep ?tab= in the address while a form is open, so a shared or reloaded link lands on it (the register page). */
  syncUrl?: boolean;
  /** 1 on the register page; 2 where the wizard is part of another page. */
  headingLevel?: 1 | 2;
  /** The line under "Find your pathway". */
  intro?: Bilingual;
}

const DEFAULT_INTRO: Bilingual = {
  en: 'Answer a few quick questions. Then you get the form that fits you, and a last check before you send it.',
  sv: 'Svara på några snabba frågor. Sedan får du formuläret som passar dig, och en sista kontroll innan du skickar.',
};

/** The wizard with its heading; the page around it (if any) is the caller's. */
export const RegisterWizard: React.FC<RegisterWizardProps> = ({
  initialTab = null,
  onNavigateVoting,
  syncUrl = false,
  headingLevel = 2,
  intro = DEFAULT_INTRO,
}) => {
  const site = useSite();
  const { lang, sv, L } = useT();
  const T = (b: Bilingual) => pick(b, lang);
  // The city in the visitor's language (Riga is "Rīga" in Latvian).
  const city = L(site.cityName, site.cityName);

  const programmes = site.intake.programmes;
  // Future InnoHack (vfi, IBK): the hackathon programme's tracks, with their texts from the Site CMS.
  const trackIds = hackTracks(programmes);
  const tracked = trackIds.length > 0;
  const cmsTracks = useInnohackTracks();
  const trackCards = trackIds.map((id) => cmsTracks.find((tr) => tr.id === id)).filter((tr): tr is ProgrammeTrack => !!tr);
  const trackOf = (id?: string) => trackCards.find((tr) => tr.id === id);
  // Kid InnoHack stays closed until the Site CMS opens it (the database refuses Kid ideas until then too).
  const kidOpen = trackOf('kid')?.registrationOpen === true;
  const accepts = (tab: IntakeProgramTab) =>
    (TRACK_TABS.includes(tab) ? tracked : true) &&
    (tab === 'build-play' ? !!site.intake.buildAndPlay : true) &&
    (!site.intake.tabs || site.intake.tabs.includes(tab));

  // Young InnoHack's company challenges, once the Admin Panel publishes them (vfi and IBK only). Until then the
  // list is empty and Young InnoHack keeps its general form.
  const youngSite = tracked ? (site.nav.homeRoute === 'ibk' ? 'ibk' : 'vfi') : null;
  const young = useYoungState(youngSite);
  const youngReady = young.ready;
  // Published challenges switch Young InnoHack to choices; the database decides whether registration is open.
  const challengeMode = young.challenges.length > 0;
  // vfi and IBK (SiteConfig.designV2) have the redesigned cards and wording; Riga, Eskilstuna and Växjö keep the
  // earlier ones (./classicCards, ./ClassicChoiceCard and the `v2 ? … : …` texts below), unchanged.
  const v2 = !!site.designV2;
  const withMode = (p: RegisterPath): RegisterPath => ({ ...p, challengeMode: challengeMode || undefined, v2: v2 || undefined });

  // Grade labels only name the programmes this site runs: esk has no hackathon (and so no
  // university level), vxo has no RoboKidovation (and so no grade 1–2 participant group).
  const offersHack = accepts('hackathon');
  const offersRobo = accepts('workshop') || accepts('demo') || accepts('association') || accepts('competition');
  const gradeOptions = useMemo(
    () =>
      GRADE_GROUP_OPTIONS.filter(
        (g) => (offersHack || !g.startsWith('University')) && (offersRobo || !g.startsWith('Årskurs 1–2')),
      ).map((g) => {
        let label = g;
        if (!offersRobo) label = label.replace(/RoboKido \w+ (\/|·) /, '');
        if (!offersHack) label = label.replace(/ \/ Hackathon \w+/, '');
        return label;
      }),
    [offersHack, offersRobo],
  );

  const ctxFor = (p: RegisterPath): FormCtx | null =>
    p.programme ? { site, language: sv ? 'sv' : 'en', lang, sv, L, path: withMode(p), programme: programmeOf(p.programme, programmes), gradeOptions } : null;
  const formKey = (p: RegisterPath) => {
    const f = formFor(p);
    return f ? `${f}|${p.role ?? ''}|${p.activity ?? ''}` : '';
  };
  /** Values for the form `p` leads to: what was typed so far plus that form's presets. */
  const withForm = (prev: Values, p: RegisterPath): Values => {
    const f = formFor(withMode(p));
    const c = ctxFor(p);
    const key = formKey(p);
    if (!f || !c || prev.__form === key) return prev;
    return { ...prev, ...FORMS[f].initial?.(c), consentAgreed: false, gdprAgreed: false, __form: key };
  };

  // Single-programme sites (vxo) skip step 1. A ?tab= link fills in the answers it implies
  // and opens the first question it leaves open (or the form).
  const basePath: RegisterPath = programmes.length === 1 ? { programme: programmes[0].id } : {};
  const [start] = useState(() => {
    const path = initialTab && accepts(initialTab) ? pathForTab(initialTab, programmes) : basePath;
    const steps = stepsFor(path, programmes);
    const index = steps.findIndex((k) => k === 'form' || k === 'review' || !isAnswered(k, path));
    return { path, index: Math.max(0, index) };
  });
  const [rawPath, setPath] = useState<RegisterPath>(start.path);
  // The answers, with whether Young InnoHack's company challenges are on (decided by the database, not the visitor).
  const path = withMode(rawPath);
  const [stepIndex, setStepIndex] = useState(start.index);
  const [values, setValues] = useState<Values>(() => withForm({}, start.path));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<SubmitResult | null>(null);
  // A team's invite link (?tab=young-innohack&join=CODE) fills in the code.
  const [joinParam] = useState(() =>
    initialTab === 'young-innohack' && typeof window !== 'undefined' ? normaliseCode(new URLSearchParams(window.location.search).get('join') ?? '') : '',
  );
  const modeApplied = useRef(false);
  const [showGdpr, setShowGdpr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [schools, setSchools] = useState<{ name: string; city: string }[]>([]);

  useEffect(() => {
    fetchRegisteredSchools().then(setSchools);
  }, []);

  // Once the challenges are in: a visitor on Young InnoHack moves to the first open question of the challenge steps,
  // and an invite link opens the team step with its team checked.
  useEffect(() => {
    if (!youngReady || !challengeMode || modeApplied.current) return;
    modeApplied.current = true;
    if (rawPath.programme !== 'hack' || rawPath.track !== 'young') return;
    const openFirst = (p: RegisterPath) => {
      const s = stepsFor(withMode(p), programmes);
      setStepIndex(Math.max(0, s.findIndex((k) => k === 'form' || k === 'review' || !isAnswered(k, withMode(p)))));
    };
    const base: RegisterPath = { ...rawPath, role: undefined };
    if (!joinParam) {
      setPath(base);
      openFirst(base);
      return;
    }
    lookupTeamCode(joinParam)
      .then((found) => {
        const next: RegisterPath = found
          ? { ...base, activity: 'participate', team: 'join', first: found.first_choice, second: found.second_choice }
          : { ...base, activity: 'participate', team: 'join' };
        setPath(next);
        setValues((prev) => ({
          ...prev,
          joinCode: joinParam,
          joinChecked: !!found,
          joinJoinable: !!found?.joinable,
          joinTeamName: found?.team ?? '',
        }));
        // The team step, with its team checked (or the code to correct).
        setStepIndex(Math.max(0, stepsFor(withMode(next), programmes).indexOf('team')));
      })
      .catch(() => {
        setPath(base);
        openFirst(base);
      });
  }, [youngReady, challengeMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps = stepsFor(path, programmes);
  const index = Math.min(stepIndex, steps.length - 1);
  const kind: StepKind = steps[index];
  const formId = formFor(path);
  const def = formId ? FORMS[formId] : null;
  const ctx = ctxFor(path);
  const programme = ctx?.programme ?? null;
  // Future InnoHack keeps the site's navy and yellow; other hackathons their green.
  const green = isGreen(path.programme) && !tracked;
  /** vfi and IBK's selection colour: RoboKidovation's Swedish blue, Future InnoHack's navy and yellow. */
  const accentOf = (p?: RegisterPath['programme']): Accent => (p === 'hack' || p === 'ideas' ? 'hack' : 'robo');
  const accent = accentOf(path.programme);
  // Kid InnoHack while it is closed: every step after the track explains that instead of asking.
  const kidBlocked = path.track === 'kid' && !kidOpen;
  // Young InnoHack's public ideas close with Kid's, on 1 December 2026 (its hackathon and mentor forms stay open).
  const youngIdeaClosed = path.programme === 'hack' && path.track === 'young' && path.activity === 'idea' && ideasClosed();
  const shownTrack = trackOf(path.track);
  // Build & Play is on the RoboKidovation final's day and at its venue (5 December 2026, MISV).
  const buildPlay = path.programme === 'robo' && path.activity === 'build-play';
  const shownDate = programme?.date;
  const shownVenue = programme?.venue;
  const accentBg = v2 ? ACCENTS[accent].bar : green ? 'bg-[#059669]' : 'bg-[#006AA7]';

  // Editing an answer clears the message about it (it described the answer as it was).
  const set = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError('');
  };
  const wizardRef = useRef<HTMLDivElement>(null);
  const formDomId = `register-form${useId()}`;
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  // ── Navigation ── With syncUrl the URL carries ?tab= only while a form is open, so a shared
  // or reloaded link lands on the same form.
  const syncTab = (tab: IntakeProgramTab | null) => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');
    window.history.replaceState(null, '', url.toString());
  };
  const scrollToWizard = () =>
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

  const goTo = (target: number, p: RegisterPath = path) => {
    p = withMode(p);
    const s = stepsFor(p, programmes);
    const i = Math.max(0, Math.min(target, s.length - 1));
    const atForm = s[i] === 'form' || s[i] === 'review';
    if (atForm) setValues((prev) => withForm(prev, p));
    setStepIndex(i);
    setError('');
    syncTab(atForm ? tabForPath(p) : null);
    scrollToWizard();
  };
  const goToKind = (k: StepKind) => {
    const i = steps.indexOf(k);
    if (i >= 0) goTo(i);
  };

  const choose = (next: RegisterPath) => {
    setPath(next);
    setError('');
  };
  // A new programme clears every answer; a new activity clears its theme (the lists differ).
  /** `advance`: a click moves on; an arrow key only changes the choice (keyboard users press Continue). */
  const chooseProgramme = (id: RegisterPath['programme'], advance = true) => {
    const nextPath: RegisterPath = id === path.programme ? path : { programme: id };
    choose(nextPath);
    // Future InnoHack: its tracks come straight after, scrolled into view.
    if (advance && id === 'hack' && tracked) goTo(stepsFor(nextPath, programmes).indexOf('track'), nextPath);
  };
  /** A track, then on to "How are you joining?". Kid keeps only its idea pathway; Young keeps an idea or squad answer from a link. */
  const chooseTrack = (id: NonNullable<RegisterPath['track']>, advance = true) => {
    if (id === 'kid' && !kidOpen) {
      setError(T(trackOf('kid')?.closedMessage ?? { en: 'Kid InnoHack opens soon.', sv: 'Kid InnoHack öppnar snart.' }));
      return;
    }
    const keep = id === 'young' && (path.activity === 'idea' || path.activity === 'participate');
    const nextPath: RegisterPath = {
      programme: 'hack',
      track: id,
      role: path.track === id && !(id === 'young' && challengeMode) ? path.role : undefined,
      activity: id === 'kid' ? 'kid-idea' : keep ? path.activity : undefined,
      theme: keep ? path.theme : undefined,
    };
    choose(nextPath);
    if (advance) goTo(stepsFor(nextPath, programmes).indexOf('track') + 1, nextPath);
  };
  const chooseRole = (id: RegisterPath['role']) => choose({ ...path, role: id });
  const chooseActivity = (id: RegisterPath['activity']) =>
    choose({ ...path, activity: id, theme: id === path.activity ? path.theme : undefined });
  const chooseTheme = (id: string) => choose({ ...path, theme: id });
  /** Joining takes the team's choices; switching to or from joining starts the choices again. */
  const chooseTeam = (t: TeamChoice) => {
    if (t === path.team) return;
    const fromOrToJoin = t === 'join' || path.team === 'join';
    choose({ ...path, team: t, ...(fromOrToJoin ? { first: undefined, second: undefined } : {}) });
    if (fromOrToJoin) setValues((prev) => ({ ...prev, joinChecked: false, joinTeamId: '', joinTeamName: '' }));
  };
  const setChoices = (first?: string, second?: string) => choose({ ...path, first, second });
  const byChallenge = (id?: string) => young.challenges.find((c) => c.id === id);
  // Published challenges but the switch off (or fewer than two): Young InnoHack's taking part is closed.
  const youngClosed = youngChallenges(path) && path.activity === 'participate' && !young.registrationOpen;

  const startOver = () => {
    setPath(basePath);
    setValues({});
    setDone(null);
    goTo(0, basePath);
  };
  const sendAnother = () => {
    setValues(withForm({}, path));
    setDone(null);
    const i = steps.indexOf('form');
    setStepIndex(i);
    setError('');
    syncTab(tabForPath(path));
    scrollToWizard();
  };

  const submit = async () => {
    if (!def || !ctx) return;
    if (!values.consentAgreed || !values.gdprAgreed) {
      setError(v2 ? L('Tick both boxes to send.', 'Kryssa i båda rutorna för att skicka.') : L('Please tick both boxes to confirm.', 'Kryssa i båda rutorna för att bekräfta.'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await def.submit(values, ctx);
      setDone(typeof res === 'string' ? { id: res } : res);
      scrollToWizard();
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err instanceof Error ? err.message : '';
      setError(
        err instanceof UserFacingError
          ? msg
          : /Too many requests/.test(msg)
          ? L(
              'Too many submissions from this email or network. Please try again in an hour.',
              'För många anmälningar från den här e-postadressen eller det här nätverket. Försök igen om en timme.',
            )
          : /too long|must be a web address|must be an uploaded file|could not be uploaded/.test(msg)
          ? msg
          : v2
          ? L('We couldn’t send this. Check your connection and try again.', 'Vi kunde inte skicka. Kontrollera anslutningen och försök igen.')
          : L('Something went wrong while submitting. Please try again.', 'Något gick fel vid inskickningen. Försök igen.'),
      );
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (kind === 'review') return void submit();
    if (kind === 'form') {
      const err = def && ctx ? def.validate?.(values, ctx) ?? '' : '';
      if (err) return setError(err);
      return goTo(index + 1);
    }
    if (kind === 'team') {
      if (youngClosed) return;
      const err = teamStepError(path.team, values, L);
      if (err) return setError(err);
    }
    if (kind === 'choices') {
      const err = choicesError(path.first, path.second, L);
      if (err) return setError(err);
    }
    if (!isAnswered(kind, path)) {
      return setError(
        kind === 'activity' && path.programme === 'hack' && path.activity
          ? L('Choose an area to continue.', 'Välj ett område för att fortsätta.')
          : L('Choose an option to continue.', 'Välj ett alternativ för att fortsätta.'),
      );
    }
    goTo(index + 1);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${site.ideasPath}?idea=${done?.id ?? ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Copy for each step ──
  const heading = (): { title: string; hint: string } => (v2 ? headingV2() : classicHeading());
  /** Riga, Eskilstuna and Växjö: the step texts as they were (their sites have no tracks or company challenges). */
  const classicHeading = (): { title: string; hint: string } => {
    const p = path.programme;
    switch (kind) {
      case 'programme':
        return {
          title: L('What would you like to join?', 'Vad vill du delta i?'),
          hint: L('Each programme has its own date and place. Choose one to see its steps.', 'Varje program har sitt eget datum och sin egen plats. Välj ett för att se stegen.'),
        };
      case 'role':
        if (p === 'community')
          return {
            title: L('How would you like to get involved?', 'Hur vill du engagera dig?'),
            hint: L('Choose how you would like to help or stay connected.', 'Välj hur du vill hjälpa till eller hålla kontakten.'),
          };
        return {
          title: L('How are you joining?', 'Hur deltar du?'),
          hint:
            p === 'hack'
              ? L('Choose who you represent. Next you register an idea or take part.', 'Välj vem du representerar. Sedan registrerar du en idé eller deltar.')
              : L('Choose who you are registering for. Next you choose a demo, a workshop or the competition.', 'Välj vem du anmäler. Sedan väljer du demonstration, workshop eller tävling.'),
        };
      case 'activity':
        return p === 'hack'
          ? {
              title: L('Register an idea or take part?', 'Registrera en idé eller delta?'),
              hint: L('Choose your pathway, then the area that interests you most.', 'Välj din väg och sedan det område som intresserar dig mest.'),
            }
          : {
              title: L('What would you like to do?', 'Vad vill du göra?'),
              hint: L(
                'A demo is a short introduction. A workshop is a hands-on learning session. Competition registration enters a team in the event.',
                'En demonstration är en kort introduktion. En workshop är ett praktiskt lärpass. Tävlingsanmälan anmäler ett lag till evenemanget.',
              ),
            };
      case 'theme':
        return {
          title: L('Which area is your idea about?', 'Vilket område handlar din idé om?'),
          hint: L('Pick the closest one. You describe your idea on the next step.', 'Välj det som passar bäst. Du beskriver idén i nästa steg.'),
        };
      case 'form':
        return def && ctx
          ? { title: def.title(ctx), hint: `${def.intro(ctx)} ${L('Fields marked * are required.', 'Fält markerade med * är obligatoriska.')}` }
          : { title: '', hint: '' };
      default:
        return {
          title: L('Check your details', 'Kontrollera dina uppgifter'),
          hint: L('Make sure everything is right, then send. Use Back or ✎ to change something.', 'Kontrollera att allt stämmer och skicka sedan. Använd Tillbaka eller ✎ för att ändra något.'),
        };
    }
  };
  /** vfi and IBK. */
  const headingV2 = (): { title: string; hint: string } => {
    const p = path.programme;
    switch (kind) {
      case 'programme':
        return {
          title: L('What would you like to join?', 'Vad vill du vara med i?'),
          hint: L('Each programme has its own day and place.', 'Varje program har sin egen dag och plats.'),
        };
      case 'track':
        return {
          title: L('Kid or Young InnoHack?', 'Kid eller Young InnoHack?'),
          hint: L(
            'Kid InnoHack is for grades 3–9 with an idea of their own. Young InnoHack is for gymnasium, university and working life.',
            'Kid InnoHack är för årskurs 3–9 med en egen idé. Young InnoHack är för gymnasiet, universitetet och arbetslivet.',
          ),
        };
      case 'role':
        if (p === 'hack' && path.track === 'kid')
          return {
            title: L('Who is sending the idea?', 'Vem skickar idén?'),
            hint: L('Each child’s parent or guardian confirms by email afterwards.', 'Varje barns förälder eller vårdnadshavare bekräftar via e-post efteråt.'),
          };
        if (p === 'community')
          return {
            title: L('How would you like to help?', 'Hur vill du hjälpa till?'),
            hint: L('Pick the one that fits you best.', 'Välj det som passar dig bäst.'),
          };
        return {
          title: L('Who are you signing up?', 'Vem anmäler du?'),
          hint:
            p === 'hack'
              ? L('Then you choose between an idea and taking part.', 'Sedan väljer du mellan en idé och att delta.')
              : L('Then you choose what to do: a demo, a workshop, the competition or Build & Play.', 'Sedan väljer du vad: en demo, en workshop, tävlingen eller Build & Play.'),
        };
      case 'activity':
        if (p === 'hack' && path.track === 'kid')
          return {
            title: L('Your idea', 'Din idé'),
            hint: L('Kid InnoHack has one way in: an idea for the selection on 5 December 2026.', 'Kid InnoHack har en väg in: en idé till urvalet den 5 december 2026.'),
          };
        if (youngChallenges(path))
          return {
            title: L('What would you like to do?', 'Vad vill du göra?'),
            hint: L('Take on a company challenge, put an idea to the public vote, or mentor the teams.', 'Anta en utmaning från ett företag, låt alla rösta på din idé eller bli mentor för lagen.'),
          };
        if (p === 'hack' && path.track === 'young')
          return {
            title: L('An idea, taking part or mentoring?', 'En idé, delta eller vara mentor?'),
            hint: L(
              'An idea goes to the public vote on its own. Taking part signs you up for the hackathon. Professionals can also mentor the teams.',
              'En idé går till den publika omröstningen för sig. Att delta anmäler dig till hackathonet. Yrkesverksamma kan också vara mentorer för lagen.',
            ),
          };
        return p === 'hack'
          ? {
              title: L('An idea or taking part?', 'En idé eller delta?'),
              hint: L('Choose one, then the area that interests you most.', 'Välj ett av dem och sedan det område som intresserar dig mest.'),
            }
          : {
              title: L('What would you like to do?', 'Vad vill du göra?'),
              hint: L(
                'A demo is a short show. A workshop is hands-on building. The competition is for teams.',
                'En demo är en kort visning. En workshop är att bygga på riktigt. Tävlingen är för lag.',
              ),
            };
      case 'team':
        return youngClosed
          ? {
              title: L('Registration opening soon', 'Anmälan öppnar snart'),
              hint: L(
                'These are the company challenges for Young InnoHack. When registration opens, you choose two of them, on your own or as a team.',
                'Här är företagens utmaningar i Young InnoHack. När anmälan öppnar väljer du två av dem, själv eller som lag.',
              ),
            }
          : {
              title: L('How will you take part?', 'Hur vill du delta?'),
              hint: L('You can be in one team. A team chooses its challenges together.', 'Du kan vara med i ett lag. Laget väljer sina utmaningar tillsammans.'),
            };
      case 'choices':
        return path.team === 'join'
          ? { title: L('Your team’s choices', 'Lagets val'), hint: '' }
          : {
              title: L('Choose two challenges', 'Välj två utmaningar'),
              hint: L(
                'Pick a first and a second choice. The organisers match every team with a challenge, using everyone’s choices and the places each company has. We can’t promise your first choice.',
                'Välj ett förstahands- och ett andrahandsval. Arrangörerna matchar varje lag med en utmaning utifrån allas val och hur många platser varje företag har. Vi kan inte lova ditt förstahandsval.',
              ),
            };
      case 'theme':
        return {
          title: L('What is your idea about?', 'Vad handlar din idé om?'),
          hint: L('Pick the closest one. You describe the idea next.', 'Välj det som ligger närmast. Du beskriver idén i nästa steg.'),
        };
      case 'form':
        return def && ctx
          ? { title: def.title(ctx), hint: `${def.intro(ctx)} ${L('Fields with * are required.', 'Fält med * måste fyllas i.')}` }
          : { title: '', hint: '' };
      default:
        return {
          title: L('Check and send', 'Kontrollera och skicka'),
          hint: L('Look it over. Use Back, or a choice above, to change something.', 'Titta igenom. Använd Tillbaka, eller ett val ovan, för att ändra något.'),
        };
    }
  };
  const { title, hint } = heading();

  /** The team answer in words, for the choices bar and the review. */
  function teamAnswer(): Bilingual {
    // Each answer names its own team: the one being created, or the one being joined (by code or from the list).
    if (path.team === 'create') {
      const name = String(values.teamName ?? '').trim().replace(/\s+/g, ' ');
      return { en: name ? `Starting ${name}` : 'Starting a team', sv: name ? `Startar ${name}` : 'Startar ett lag' };
    }
    if (path.team === 'join') {
      const name = String(values.joinTeamName ?? '').trim();
      return { en: name ? `Joining ${name}` : 'Joining a team', sv: name ? `Går med i ${name}` : 'Går med i ett lag' };
    }
    return { en: 'On my own', sv: 'På egen hand' };
  }

  // "Your choices": every answered question, each with a way back to it.
  const trackCrumb =
    shownTrack && steps.includes('track')
      ? [{ k: 'track', stepKind: 'track' as StepKind, card: { id: shownTrack.id, icon: shownTrack.id === 'kid' ? 'Lightbulb' : 'Rocket', title: shownTrack.label, desc: { en: '', sv: '' } } }]
      : [];
  const crumbs = [...trackCrumb, ...(['role', 'activity', 'theme'] as const)
    .map((k) => {
      const card = answerCard(k, path);
      const stepKind: StepKind = k === 'theme' && path.programme === 'hack' ? 'activity' : k;
      return card && steps.includes(stepKind) ? { k: k as string, stepKind, card } : null;
    })
    .filter((c): c is NonNullable<typeof c> => !!c),
    ...(path.team && steps.includes('team')
      ? [{ k: 'team', stepKind: 'team' as StepKind, card: { id: path.team, icon: path.team === 'individual' ? 'User' : 'Users', title: teamAnswer(), desc: { en: '', sv: '' } } }]
      : [])];

  const reviewRows = (): SummaryRow[] => {
    if (!def || !ctx || !programme) return [];
    const role = answerCard('role', path);
    const activity = answerCard('activity', path);
    const theme = answerCard('theme', path);
    const pathRows: SummaryRow[] = [
      [L('Programme', 'Program'), T(programme.title)],
      ...(shownTrack ? [[L('Track', 'Spår'), T(shownTrack.label)] as SummaryRow] : []),
      ...(shownTrack
        ? [[L('Dates', 'Datum'), T(shownTrack.dateLabel)] as SummaryRow, [L('Venue', 'Plats'), T(shownTrack.venue)] as SummaryRow]
        : [
            ...(shownDate ? [[L('Event date', 'Evenemangsdatum'), T(shownDate)] as SummaryRow] : []),
            ...(shownVenue ? [[L('Venue', 'Plats'), T(shownVenue)] as SummaryRow] : []),
          ]),
      ...(role ? [[path.programme === 'community' ? L('Getting involved as', 'Engagerar dig som') : L('Joining as', 'Deltar som'), T(role.title)] as SummaryRow] : []),
      ...(activity ? [[path.programme === 'hack' ? L('Pathway', 'Väg') : L('Activity', 'Aktivitet'), T(activity.title)] as SummaryRow] : []),
      ...(theme ? [[path.programme === 'hack' && path.activity === 'participate' ? L('Challenge area', 'Utmaningsområde') : L('Area', 'Område'), T(theme.title)] as SummaryRow] : []),
      // The two choices, and the final challenge kept apart: the organisers decide it.
      ...(formId === 'young'
        ? [
            [L('Taking part', 'Deltar'), T(teamAnswer())] as SummaryRow,
            [L('1st choice', '1:a val'), challengeName(byChallenge(path.first), T)] as SummaryRow,
            [L('2nd choice', '2:a val'), challengeName(byChallenge(path.second), T)] as SummaryRow,
            [L('Final challenge', 'Slutlig utmaning'), L('Decided by the organisers', 'Bestäms av arrangörerna')] as SummaryRow,
          ]
        : []),
    ];
    return [...pathRows, ...def.summary(values, ctx)];
  };

  const meta = (p: { date?: Bilingual; venue?: Bilingual }) =>
    p.date || p.venue ? (
      <span className="flex flex-wrap gap-x-4 gap-y-0.5">
        {p.date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {T(p.date)}
          </span>
        )}
        {p.venue && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {T(p.venue)}
          </span>
        )}
      </span>
    ) : undefined;

  const outlineBtn =
    'inline-flex items-center gap-1.5 py-2 px-3 text-xs font-headline font-bold uppercase tracking-wider border border-slate-300 bg-white text-slate-700 hover:bg-slate-50';

  // ── Step bodies ──
  const body = (): React.ReactNode => {
    if (kind === 'programme' && !v2) {
      const pictured = programmes.filter((p) => p.image);
      const plain = programmes.filter((p) => !p.image);
      return (
        <div className="space-y-4">
          {pictured.length > 0 && (
            <div className={`grid grid-cols-1 gap-4 ${pictured.length > 1 ? 'md:grid-cols-2' : ''} ${pictured.length > 2 ? 'lg:grid-cols-3' : ''}`}>
              {pictured.map((p) => (
                <ClassicChoiceCard
                  key={p.id}
                  selected={path.programme === p.id}
                  onSelect={() => chooseProgramme(p.id)}
                  image={p.image}
                  title={T(p.title)}
                  desc={T(p.subtitle)}
                  meta={meta(p)}
                  green={isGreen(p.id)}
                />
              ))}
            </div>
          )}
          {plain.map((p) => (
            <ClassicChoiceCard
              key={p.id}
              small
              selected={path.programme === p.id}
              onSelect={() => chooseProgramme(p.id)}
              icon={p.id === 'community' ? '🤝' : '💡'}
              title={T(p.title)}
              desc={T(p.subtitle)}
              meta={meta(p)}
              green={isGreen(p.id)}
            />
          ))}
        </div>
      );
    }

    if (kind === 'programme') {
      // One question: the pictured programmes side by side, the others (e.g. the community) across the row.
      const items: ChoiceItem[] = programmes.map((p) => ({
        id: p.id,
        title: T(p.title),
        desc: T(p.subtitle),
        meta: meta(p),
        image: p.image,
        icon: p.image ? undefined : registerIcon(p.id === 'community' ? 'Handshake' : 'Lightbulb'),
        wide: !p.image,
        accent: accentOf(p.id),
      }));
      return (
        <ChoiceGroup
          label={L('Programme', 'Program')}
          items={items}
          value={path.programme}
          accent="robo"
          columns={programmes.filter((p) => p.image).length > 2 ? 3 : 2}
          onChoose={(id, how) => chooseProgramme(id as RegisterPath['programme'], how === 'pointer')}
        />
      );
    }

    if (kind === 'track') {
      return (
        <ChoiceGroup
          label={L('Track', 'Spår')}
          accent="hack"
          value={path.track}
          onChoose={(id, how) => chooseTrack(id as NonNullable<RegisterPath['track']>, how === 'pointer')}
          items={trackCards.map((tr) => ({
            id: tr.id,
            title: T(tr.label),
            desc: [T(tr.eligibility), ...(tr.highlights ?? []).map(T).filter((h) => h && h !== T(tr.eligibility))].filter(Boolean).join(' · '),
            meta: meta({ date: tr.dateLabel, venue: tr.venue }),
            image: tr.image || (tr.id === 'young' ? '/register/hackathon.jpg' : undefined),
            placeholder: T(tr.label),
            closed: tr.id === 'kid' && !kidOpen ? T(tr.closedMessage) : undefined,
          }))}
        />
      );
    }

    // Kid InnoHack while it is closed (e.g. reached by a link): say so instead of asking on.
    if (kidBlocked) {
      return (
        <div className="p-5 bg-[#FFFBEA] border-2 border-[#FFCD00] space-y-3">
          <p className="flex items-center gap-2 font-headline font-black text-sm uppercase tracking-tight text-[#0A1930]">
            <Lock className="w-4 h-4 text-[#006AA7]" aria-hidden="true" />
            {T(trackOf('kid')?.closedMessage ?? { en: 'Kid InnoHack opens soon.', sv: 'Kid InnoHack öppnar snart.' })}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {ideasClosed()
              ? L(
                  'Kid InnoHack took ideas until 1 December 2026. Young InnoHack is open now.',
                  'Kid InnoHack tog emot idéer till och med den 1 december 2026. Young InnoHack är öppet nu.',
                )
              : L(
                  'Kid InnoHack registration opens once guardian confirmation is ready. Young InnoHack is open now.',
                  'Anmälan till Kid InnoHack öppnar när vårdnadshavarnas bekräftelse är klar. Young InnoHack är öppet nu.',
                )}
          </p>
          <button type="button" onClick={() => goToKind('track')} className={outlineBtn}>
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{L('Choose another track', 'Välj ett annat spår')}</span>
          </button>
        </div>
      );
    }

    if (kind === 'role') {
      const cards = roleChoices(path.programme, accepts, path.track, v2);
      if (!v2)
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${cards.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {cards.map((c) => (
              <ClassicChoiceCard key={c.id} small selected={path.role === c.id} onSelect={() => chooseRole(c.id)} icon={c.icon} title={T(c.title)} desc={T(c.desc)} green={green} />
            ))}
          </div>
        );
      return (
        <ChoiceGroup
          label={heading().title}
          small
          accent={accent}
          columns={cards.length === 3 ? 3 : 4}
          value={path.role}
          onChoose={(id) => chooseRole(id as RegisterPath['role'])}
          items={cards.map((c) => ({ id: c.id, title: T(c.title), desc: T(c.desc), icon: registerIcon(c.icon) }))}
        />
      );
    }

    if (kind === 'activity') {
      const cards = activityChoices(path.programme, accepts, path);
      if (!v2)
        return (
          <div>
            <div className={`grid grid-cols-1 gap-4 ${cards.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {cards.map((c) => (
                <ClassicChoiceCard key={c.id} small selected={path.activity === c.id} onSelect={() => chooseActivity(c.id)} icon={c.icon} title={T(c.title)} desc={T(c.desc)} green={green} />
              ))}
            </div>
            {path.programme === 'hack' && path.activity && themeChoices(path).length > 0 && (
              <div className="mt-8">
                <h3 className="font-headline font-black text-lg uppercase tracking-tight text-[#0A1930]">
                  {path.activity === 'participate' ? L('Challenge area', 'Utmaningsområde') : L('Area of your idea', 'Idéns område')}
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-4">{L('Choose the one that interests you most.', 'Välj det som intresserar dig mest.')}</p>
                {themeGrid()}
              </div>
            )}
          </div>
        );
      return (
        <div>
          <ChoiceGroup
            label={heading().title}
            small
            accent={accent}
            columns={cards.length === 3 ? 3 : 2}
            value={path.activity}
            onChoose={(id) => chooseActivity(id as RegisterPath['activity'])}
            items={cards.map((c) => ({ id: c.id, title: T(c.title), desc: T(c.desc), icon: registerIcon(c.icon) }))}
          />
          {path.programme === 'hack' && path.activity && themeChoices(path).length > 0 && (
            <div className="mt-8">
              <h3 className="font-headline font-bold text-lg text-[#0A1930]">
                {path.activity === 'participate' ? L('Challenge area', 'Utmaningsområde') : L('What is your idea about?', 'Vad handlar din idé om?')}
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 mb-4">{L('Pick the closest one.', 'Välj det som ligger närmast.')}</p>
              {themeGrid()}
            </div>
          )}
        </div>
      );
    }

    if (kind === 'team') {
      if (youngClosed) return <ChallengesClosed state={young} L={L} T={T} />;
      return (
        <TeamStep
          state={young}
          site={youngSite ?? 'vfi'}
          choice={path.team}
          onChoose={chooseTeam}
          onTeamChoices={setChoices}
          v={values}
          set={set}
          L={L}
          T={T}
        />
      );
    }

    if (kind === 'choices') {
      return (
        <ChoicesStep
          state={young}
          joining={path.team === 'join'}
          teamName={String(values.joinTeamName ?? '') || undefined}
          first={path.first}
          second={path.second}
          onChange={setChoices}
          L={L}
          T={T}
        />
      );
    }

    if (kind === 'theme') return themeGrid();

    if (kind === 'form') {
      if (!def || !ctx) return null;
      if (youngIdeaClosed) {
        return (
          <div className="p-5 bg-[#FFFBEA] border-2 border-[#FFCD00] space-y-3">
            <p className="flex items-center gap-2 font-headline font-black text-sm uppercase tracking-tight text-[#0A1930]">
              <Lock className="w-4 h-4 text-[#006AA7]" aria-hidden="true" />
              {L('Idea submissions closed on 1 December 2026', 'Idéinlämningen stängde den 1 december 2026')}
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {L('You can still register for the Young InnoHack hackathon.', 'Du kan fortfarande anmäla dig till hackathonet Young InnoHack.')}
            </p>
            <button type="button" onClick={() => goToKind('activity')} className={outlineBtn}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{L('Choose another pathway', 'Välj en annan väg')}</span>
            </button>
          </div>
        );
      }
      const Fields = def.Fields;
      return (
        <form
          id={formDomId}
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          className="space-y-6"
        >
          {/* vfi and IBK: chips in the form take the programme's selection colour (elsewhere they keep their look). */}
          {v2 ? (
            <AccentContext.Provider value={accent}>
              <Fields v={values} set={set} ctx={ctx} />
            </AccentContext.Provider>
          ) : (
            <Fields v={values} set={set} ctx={ctx} />
          )}
          {(typeof def.fees === 'function' ? def.fees(ctx) : def.fees) && site.intake.showFees && <ParticipationFees />}
        </form>
      );
    }

    // Review
    return (
      <div className="space-y-6">
        <dl className="border border-slate-200 divide-y divide-slate-200">
          {reviewRows().map(([k, val], i) => (
            <div key={`${k}-${i}`} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-4 py-3">
              <dt className="text-[13px] font-mono-code font-bold uppercase tracking-wider text-slate-500 pt-0.5">{k}</dt>
              <dd className="text-sm text-[#0A1930] font-medium break-words whitespace-pre-line">{val}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!values.consentAgreed}
              onChange={(e) => set('consentAgreed', e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer accent-[#006AA7]"
            />
            <span className="text-xs text-slate-700 leading-snug">
              {L('I confirm that the details I submit are accurate. *', 'Jag bekräftar att uppgifterna jag lämnar är korrekta. *')}
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!values.gdprAgreed}
              onChange={(e) => set('gdprAgreed', e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer accent-[#006AA7]"
            />
            <span className="text-xs text-slate-700 leading-snug">
              {L('I accept the GDPR data protection policy and consent terms. *', 'Jag godkänner GDPR-policyn och villkoren för samtycke. *')}
            </span>
          </label>
          <div>
            <button type="button" onClick={() => setShowGdpr(!showGdpr)} className="text-[13px] font-mono-code text-[#006AA7] hover:underline">
              {showGdpr ? L('▲ Hide GDPR details', '▲ Dölj GDPR-information') : L('▼ Read GDPR & privacy terms', '▼ Läs GDPR- och integritetsvillkoren')}
            </button>
            {showGdpr && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 text-[13px] text-slate-600 leading-relaxed">
                {L(
                  `Data controller: ${site.organiser}, in accordance with the EU GDPR. Contact details and uploads are used only to organise workshops, demos, competitions and events, and to review ideas.`,
                  `Personuppgiftsansvarig: ${site.organiser}, enligt EU:s dataskyddsförordning (GDPR). Kontaktuppgifter och uppladdat material används bara för att organisera workshoppar, demos, tävlingar och evenemang, och för att granska idéer.`,
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const themeGrid = () => {
    const themes = themeChoices(path);
    if (!v2)
      return (
        <div className={`grid grid-cols-2 gap-3 ${themes.length === 4 ? '' : 'md:grid-cols-3'}`}>
          {themes.map((t) => (
            <ClassicChoiceCard key={t.id} small selected={path.theme === t.id} onSelect={() => chooseTheme(t.id)} icon={t.icon} title={T(t.title)} green={green} />
          ))}
        </div>
      );
    return (
    <ChoiceGroup
      label={L('Area', 'Område')}
      small
      accent={accent}
      columns={themes.length === 4 ? 2 : 3}
      value={path.theme}
      onChoose={(id) => chooseTheme(id)}
      items={themes.map((t) => ({ id: t.id, title: T(t.title), icon: registerIcon(t.icon) }))}
    />
    );
  };

  const doneCopy = done && def && ctx ? def.done(ctx, values) : null;
  const choiceStep = kind !== 'form' && kind !== 'review';
  const footerDate = shownTrack ? shownTrack.dateLabel : shownDate;
  const footer = programme ? [city, footerDate ? T(footerDate) : ''].filter(Boolean).join(' · ') : `${city} · ${site.nav.brandChip}`;

  return (
    <>
        <div data-no-translate="true">
          <div className="text-center max-w-3xl mx-auto mb-6">
            {/* vfi and IBK (designV2): a plain "Register" heading without the intake label. */}
            {!site.designV2 && (
              <div className="inline-flex items-center gap-2 text-[13px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>{L(site.intake.eyebrow, site.intake.eyebrow)}</span>
              </div>
            )}
            <Heading className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0A1930]">
              {site.designV2 ? L('Register', 'Anmälan') : L('Find your pathway', 'Hitta din väg')}
            </Heading>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              {T(intro)}
            </p>
          </div>

          <div
            ref={wizardRef}
            data-register-wizard=""
            className={`bg-white border-2 border-t-8 shadow-xl scroll-mt-24 ${green ? 'border-[#059669]' : 'border-[#006AA7]'}`}
          >
            {/* The chosen programme stays in view, with its date and place */}
            {programme && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-4 min-w-0">
                  {programme.image && (
                    <img src={programme.image} alt="" className="hidden sm:block w-28 h-16 object-cover border border-slate-200 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500">
                      {v2 ? L('You’re signing up for', 'Du anmäler dig till') : L('You are registering for', 'Du anmäler dig till')}
                    </span>
                    <span className={`block font-headline font-black text-lg sm:text-xl uppercase tracking-tight leading-tight ${green ? 'text-[#059669]' : 'text-[#006AA7]'}`}>
                      {T(programme.title)}
                      {shownTrack && <span className="text-[#0A1930]"> · {T(shownTrack.label)}</span>}
                      {buildPlay && <span className="text-[#0A1930]"> · Build & Play</span>}
                    </span>
                    {shownTrack ? (
                      <span className="block mt-1 text-[13px] font-mono-code font-semibold text-slate-600">{meta({ date: shownTrack.dateLabel, venue: shownTrack.venue })}</span>
                    ) : (
                      (shownDate || shownVenue) && (
                        <span className="block mt-1 text-[13px] font-mono-code font-semibold text-slate-600">{meta({ date: shownDate, venue: shownVenue })}</span>
                      )
                    )}
                  </div>
                </div>
                {programmes.length > 1 && !done && index > 0 && (
                  <button type="button" onClick={() => goTo(0)} className={outlineBtn}>
                    {L('Change programme', 'Byt program')}
                  </button>
                )}
              </div>
            )}

            {crumbs.length > 0 && !done && (
              <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3 border-b border-slate-200">
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 mr-1">
                  {L('Your choices', 'Dina val')}
                </span>
                {crumbs.map(({ k, stepKind, card }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => goToKind(stepKind)}
                    aria-label={`${L('Change', 'Ändra')}: ${T(card.title)}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 hover:border-[#0A1930] text-[13px] font-headline font-bold uppercase tracking-wider text-slate-700"
                  >
                    {v2 ? (
                      (() => {
                        const Icon = registerIcon(card.icon);
                        return Icon ? <Icon className="w-3.5 h-3.5" aria-hidden="true" /> : null;
                      })()
                    ) : (
                      <span aria-hidden="true">{card.icon}</span>
                    )}
                    <span>{T(card.title)}</span>
                    <Pencil className="w-3 h-3 text-[#006AA7]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {/* Progress (Young InnoHack's company challenges count their own four steps) */}
            {!done && (() => {
              const shown = youngChallenges(path) && path.activity === 'participate' && YOUNG_STEPS.includes(kind) ? YOUNG_STEPS : steps;
              const at = shown.indexOf(kind);
              return (
                <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between gap-3 mb-2 text-[13px] font-mono-code font-bold uppercase tracking-wider">
                    <span className="text-[#0A1930]">{L(`Step ${at + 1} of ${shown.length}`, `Steg ${at + 1} av ${shown.length}`)}</span>
                    <span className="text-slate-500 text-right">{T(stepLabel(kind, path))}</span>
                  </div>
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>
                    {shown.map((s, j) => (
                      <span key={s} className={`h-1.5 ${j <= at ? accentBg : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="p-5 sm:p-8">
              {done && doneCopy ? (
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  {!site.designV2 && (
                    <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-emerald-600 uppercase mb-1 block">
                      {L('Received', 'Mottaget')} // {city} {site.nav.brandChip}
                    </span>
                  )}
                  <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{doneCopy.title}</h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">{doneCopy.body}</p>
                  {done.id && (
                    <div className="my-6 p-4 bg-slate-50 border border-slate-200 w-full max-w-md text-center">
                      <span className="text-xs font-mono-code text-slate-500 uppercase block mb-1">{L('Your reference', 'Ditt referensnummer')}</span>
                      <span className="font-mono-code font-bold text-xl text-[#006AA7] tracking-wider block">{done.id}</span>
                      <span className="text-[13px] text-slate-500 font-mono-code block mt-1">
                        {!v2
                          ? formId === 'kid'
                            ? L('Status: waiting for guardian confirmation', 'Status: väntar på vårdnadshavarnas bekräftelse')
                            : L('Status: waiting for review', 'Status: väntar på granskning')
                          : formId === 'kid'
                          ? L('Next: each guardian confirms by email', 'Nästa steg: varje vårdnadshavare bekräftar via e-post')
                          : formId === 'young'
                            ? L('Next: the organisers match you with a challenge', 'Nästa steg: arrangörerna matchar dig med en utmaning')
                            : L('We’ll look it over and get back to you', 'Vi går igenom den och hör av oss')}
                      </span>
                    </div>
                  )}
                  {done.inviteCode && (
                    <div className="mb-6 p-5 bg-sky-50 border-2 border-[#006AA7] w-full max-w-md text-center">
                      <span className="text-sm font-semibold text-[#0A1930] block mb-1">{L(`Invite code for ${done.team ?? 'your team'}`, `Inbjudningskod för ${done.team ?? 'ditt lag'}`)}</span>
                      <span className="font-mono font-bold text-3xl text-[#006AA7] tracking-[0.15em] block">{done.inviteCode}</span>
                      <span className="text-sm text-slate-600 block mt-2">
                        {L('Share it only with your teammates. They choose “Join a team” and enter it, or open the link.', 'Dela den bara med dina lagkamrater. De väljer ”Gå med i ett lag” och skriver in den, eller öppnar länken.')}
                      </span>
                      {done.inviteLink && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(done.inviteLink!);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2500);
                          }}
                          className="mt-3 inline-flex items-center gap-2 py-2.5 px-4 bg-[#006AA7] hover:bg-[#013A63] text-white text-sm font-semibold"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                          {copied ? L('Link copied', 'Länken är kopierad') : L('Copy the invite link', 'Kopiera inbjudningslänken')}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    {formId === 'idea' && (
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        <span>
                          {v2
                            ? copied ? L('Link copied', 'Länken är kopierad') : L('Copy the link to my idea', 'Kopiera länken till min idé')
                            : copied ? L('Link copied!', 'Länken är kopierad!') : L('Copy link: vote for my idea', 'Kopiera länk: rösta på min idé')}
                        </span>
                      </button>
                    )}
                    {formId === 'idea' && onNavigateVoting && (
                      <button
                        type="button"
                        onClick={onNavigateVoting}
                        className="py-3 px-5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                      >
                        {v2 ? L('See the ideas and vote', 'Se idéerna och rösta') : `⭐ ${L('View ideas & vote', 'Se idéer och rösta')}`}
                      </button>
                    )}
                    {/* A Young InnoHack registration is one per person (and a team is created once). */}
                    {formId !== 'young' && (
                    <button
                      type="button"
                      onClick={sendAnother}
                      className="py-3 px-5 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                    >
                      {v2 ? L('Register someone else', 'Anmäl någon annan') : L('Send another', 'Skicka en till')}
                    </button>
                    )}
                    <button
                      type="button"
                      onClick={startOver}
                      className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0A1930] text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                    >
                      {L('Register for something else', 'Anmäl till något annat')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{title}</h2>
                  {hint && <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 max-w-3xl leading-relaxed">{hint}</p>}
                  {body()}
                  {error && (
                    <div role="alert" className="mt-6 p-4 bg-red-50 border-2 border-red-300 flex items-center gap-3 text-xs sm:text-sm font-mono-code font-semibold text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Back · where you are · Continue */}
            {!done && (
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button type="button" onClick={() => goTo(index - 1)} className={`${outlineBtn} ${index === 0 ? 'invisible' : ''}`}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{L('Back', 'Tillbaka')}</span>
                </button>
                <span className="hidden sm:block text-[13px] font-mono-code text-slate-500 truncate">{footer}</span>
                <button
                  type={kind === 'form' ? 'submit' : 'button'}
                  form={kind === 'form' ? formDomId : undefined}
                  onClick={kind === 'form' ? undefined : next}
                  disabled={busy || (choiceStep && !isAnswered(kind, path)) || (kidBlocked && kind !== 'programme' && kind !== 'track') || (youngIdeaClosed && kind === 'form') || (youngClosed && kind !== 'programme' && kind !== 'track' && kind !== 'activity')}
                  className={`inline-flex items-center gap-2 py-3 px-5 text-white text-xs font-headline font-black uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    green ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#006AA7] hover:bg-[#013A63]'
                  }`}
                >
                  {busy ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                      <span>{L('Sending…', 'Skickar…')}</span>
                    </>
                  ) : (
                    <>
                      <span>{kind === 'review' && def && ctx ? def.submitLabel(ctx) : L('Continue', 'Fortsätt')}</span>
                      <ArrowRight className="w-4 h-4 text-[#FFCD00]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <datalist id="registered-schools-list">
          {schools.map((s, i) => (
            <option key={i} value={s.name} />
          ))}
        </datalist>
    </>
  );
};
