import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  MapPin,
  Pencil,
  Share2,
  Sparkles,
} from 'lucide-react';
import { fetchRegisteredSchools } from '../lib/ideasService';
import { GRADE_GROUP_OPTIONS } from '../data/vfiFacts';
import { ParticipationFees } from '../components/ParticipationFees';
import { useSite, type Bilingual } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import {
  activityChoices,
  answerCard,
  formFor,
  isAnswered,
  isGreen,
  pathForTab,
  programmeOf,
  roleChoices,
  stepLabel,
  stepsFor,
  tabForPath,
  themeChoices,
  type IntakeProgramTab,
  type RegisterPath,
  type StepKind,
} from './register/flow';
import { FORMS } from './register/forms';
import type { FormCtx, SummaryRow, Values } from './register/ui';

export type { IntakeProgramTab } from './register/flow';
export { COUNTRIES, CITIES_BY_COUNTRY } from './register/locations';

interface IntakeRegisterPageProps {
  /** A form to open (a ?tab= link): the questions it answers are skipped; null starts at step 1. */
  initialTab?: IntakeProgramTab | null;
  onNavigateHome: () => void;
  onNavigateVoting?: () => void;
}

/** A selectable card: programme (with its picture), role, activity or theme. */
const ChoiceCard: React.FC<{
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc?: string;
  icon?: string;
  image?: string;
  meta?: React.ReactNode;
  green?: boolean;
  small?: boolean;
}> = ({ selected, onSelect, title, desc, icon, image, meta, green, small }) => {
  const tone = selected
    ? `${green ? 'border-[#059669] bg-emerald-50/60' : 'border-[#006AA7] bg-sky-50/70'} shadow-md`
    : 'bg-white border-slate-200 hover:border-[#0A1930] hover:shadow-lg';
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative w-full text-left border-2 transition-all flex flex-col cursor-pointer ${tone}`}
    >
      {selected && (
        <span className={`absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-white ${green ? 'bg-[#059669]' : 'bg-[#006AA7]'}`}>
          <Check className="w-3.5 h-3.5" />
        </span>
      )}
      {image && <img src={image} alt="" className="w-full h-40 sm:h-44 object-cover border-b border-slate-200" />}
      <span className={`block ${small ? 'p-4' : 'p-5'}`}>
        {icon && (
          <span className={`block leading-none mb-2 ${small ? 'text-2xl' : 'text-3xl'}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={`block font-headline font-black uppercase tracking-tight text-[#0A1930] leading-snug pr-7 ${small ? 'text-sm' : 'text-lg'}`}>
          {title}
        </span>
        {desc && <span className="block text-xs text-slate-600 leading-relaxed mt-1.5">{desc}</span>}
        {meta && <span className="block mt-3 text-[11px] font-mono-code font-semibold text-slate-600">{meta}</span>}
      </span>
    </button>
  );
};

/**
 * The register page: card questions, one per step (programme → how you join → activity or
 * pathway → theme), then the form for those answers, then a review before sending.
 */
export const IntakeRegisterPage: React.FC<IntakeRegisterPageProps> = ({
  initialTab = null,
  onNavigateHome,
  onNavigateVoting,
}) => {
  const site = useSite();
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);
  const T = (b: Bilingual) => (sv ? b.sv || b.en : b.en);

  const programmes = site.intake.programmes;
  const accepts = (tab: IntakeProgramTab) => !site.intake.tabs || site.intake.tabs.includes(tab);

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
    p.programme ? { site, language, sv, L, path: p, programme: programmeOf(p.programme, programmes), gradeOptions } : null;
  const formKey = (p: RegisterPath) => {
    const f = formFor(p);
    return f ? `${f}|${p.role ?? ''}|${p.activity ?? ''}` : '';
  };
  /** Values for the form `p` leads to: what was typed so far plus that form's presets. */
  const withForm = (prev: Values, p: RegisterPath): Values => {
    const f = formFor(p);
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
  const [path, setPath] = useState<RegisterPath>(start.path);
  const [stepIndex, setStepIndex] = useState(start.index);
  const [values, setValues] = useState<Values>(() => withForm({}, start.path));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [showGdpr, setShowGdpr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [schools, setSchools] = useState<{ name: string; city: string }[]>([]);

  useEffect(() => {
    fetchRegisteredSchools().then(setSchools);
  }, []);

  const steps = stepsFor(path, programmes);
  const index = Math.min(stepIndex, steps.length - 1);
  const kind: StepKind = steps[index];
  const formId = formFor(path);
  const def = formId ? FORMS[formId] : null;
  const ctx = ctxFor(path);
  const programme = ctx?.programme ?? null;
  const green = isGreen(path.programme);
  const accentBg = green ? 'bg-[#059669]' : 'bg-[#006AA7]';

  const set = (key: string, value: unknown) => setValues((prev) => ({ ...prev, [key]: value }));

  // ── Navigation ── The URL carries ?tab= only while a form is open, so a shared or
  // reloaded link lands on the same form.
  const syncTab = (tab: IntakeProgramTab | null) => {
    const url = new URL(window.location.href);
    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');
    window.history.replaceState(null, '', url.toString());
  };
  const scrollToWizard = () =>
    setTimeout(() => {
      document.getElementById('register-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

  const goTo = (target: number, p: RegisterPath = path) => {
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
  const chooseProgramme = (id: RegisterPath['programme']) => choose(id === path.programme ? path : { programme: id });
  const chooseRole = (id: RegisterPath['role']) => choose({ ...path, role: id });
  const chooseActivity = (id: RegisterPath['activity']) =>
    choose({ ...path, activity: id, theme: id === path.activity ? path.theme : undefined });
  const chooseTheme = (id: string) => choose({ ...path, theme: id });

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
      setError(L('Please tick both boxes to confirm.', 'Kryssa i båda rutorna för att bekräfta.'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const id = await def.submit(values, ctx);
      setDone({ id });
      scrollToWizard();
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err instanceof Error ? err.message : '';
      setError(
        /Too many requests/.test(msg)
          ? L(
              'Too many submissions from this email or network. Please try again in an hour.',
              'För många anmälningar från den här e-postadressen eller det här nätverket. Försök igen om en timme.',
            )
          : /too long|must be a web address|must be an uploaded file|could not be uploaded/.test(msg)
          ? msg
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
  const heading = (): { title: string; hint: string } => {
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
  const { title, hint } = heading();

  // "Your choices": every answered question, each with a way back to it.
  const crumbs = (['role', 'activity', 'theme'] as const)
    .map((k) => {
      const card = answerCard(k, path);
      const stepKind: StepKind = k === 'theme' && path.programme === 'hack' ? 'activity' : k;
      return card && steps.includes(stepKind) ? { k, stepKind, card } : null;
    })
    .filter((c): c is NonNullable<typeof c> => !!c);

  const reviewRows = (): SummaryRow[] => {
    if (!def || !ctx || !programme) return [];
    const role = answerCard('role', path);
    const activity = answerCard('activity', path);
    const theme = answerCard('theme', path);
    const pathRows: SummaryRow[] = [
      [L('Programme', 'Program'), T(programme.title)],
      ...(programme.date ? [[L('Event date', 'Evenemangsdatum'), T(programme.date)] as SummaryRow] : []),
      ...(programme.venue ? [[L('Venue', 'Plats'), T(programme.venue)] as SummaryRow] : []),
      ...(role ? [[path.programme === 'community' ? L('Getting involved as', 'Engagerar dig som') : L('Joining as', 'Deltar som'), T(role.title)] as SummaryRow] : []),
      ...(activity ? [[path.programme === 'hack' ? L('Pathway', 'Väg') : L('Activity', 'Aktivitet'), T(activity.title)] as SummaryRow] : []),
      ...(theme ? [[path.programme === 'hack' && path.activity === 'participate' ? L('Challenge area', 'Utmaningsområde') : L('Area', 'Område'), T(theme.title)] as SummaryRow] : []),
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
    if (kind === 'programme') {
      const pictured = programmes.filter((p) => p.image);
      const plain = programmes.filter((p) => !p.image);
      return (
        <div className="space-y-4">
          {pictured.length > 0 && (
            <div className={`grid grid-cols-1 gap-4 ${pictured.length > 1 ? 'md:grid-cols-2' : ''} ${pictured.length > 2 ? 'lg:grid-cols-3' : ''}`}>
              {pictured.map((p) => (
                <ChoiceCard
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
            <ChoiceCard
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

    if (kind === 'role') {
      const cards = roleChoices(path.programme, accepts);
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${cards.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {cards.map((c) => (
            <ChoiceCard key={c.id} small selected={path.role === c.id} onSelect={() => chooseRole(c.id)} icon={c.icon} title={T(c.title)} desc={T(c.desc)} green={green} />
          ))}
        </div>
      );
    }

    if (kind === 'activity') {
      const cards = activityChoices(path.programme, accepts);
      return (
        <div>
          <div className={`grid grid-cols-1 gap-4 ${cards.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {cards.map((c) => (
              <ChoiceCard key={c.id} small selected={path.activity === c.id} onSelect={() => chooseActivity(c.id)} icon={c.icon} title={T(c.title)} desc={T(c.desc)} green={green} />
            ))}
          </div>
          {path.programme === 'hack' && path.activity && (
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
    }

    if (kind === 'theme') return themeGrid();

    if (kind === 'form') {
      if (!def || !ctx) return null;
      const Fields = def.Fields;
      return (
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          className="space-y-6"
        >
          <Fields v={values} set={set} ctx={ctx} />
          {def.fees && site.intake.showFees && <ParticipationFees />}
        </form>
      );
    }

    // Review
    return (
      <div className="space-y-6">
        <dl className="border border-slate-200 divide-y divide-slate-200">
          {reviewRows().map(([k, val], i) => (
            <div key={`${k}-${i}`} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-4 py-3">
              <dt className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500 pt-0.5">{k}</dt>
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
            <button type="button" onClick={() => setShowGdpr(!showGdpr)} className="text-[11px] font-mono-code text-[#006AA7] hover:underline">
              {showGdpr ? L('▲ Hide GDPR details', '▲ Dölj GDPR-information') : L('▼ Read GDPR & privacy terms', '▼ Läs GDPR- och integritetsvillkoren')}
            </button>
            {showGdpr && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
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
    return (
    <div className={`grid grid-cols-2 gap-3 ${themes.length === 4 ? '' : 'md:grid-cols-3'}`}>
      {themes.map((t) => (
        <ChoiceCard key={t.id} small selected={path.theme === t.id} onSelect={() => chooseTheme(t.id)} icon={t.icon} title={T(t.title)} green={green} />
      ))}
    </div>
    );
  };

  const doneCopy = done && def && ctx ? def.done(ctx, values) : null;
  const choiceStep = kind !== 'form' && kind !== 'review';
  const footer = programme ? [site.cityName, programme.date ? T(programme.date) : ''].filter(Boolean).join(' · ') : `${site.cityName} · 2026`;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A1930] pt-24 pb-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            ← {L('Back to overview', 'Tillbaka till översikten')}
          </button>
          {onNavigateVoting && (
            <button
              onClick={onNavigateVoting}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 uppercase transition-colors"
            >
              <span>⭐ {L('View ideas & vote', 'Se idéer och rösta')}</span>
            </button>
          )}
        </div>

        <div data-no-translate="true">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
              <span>{site.intake.eyebrow}</span>
            </div>
            <h1 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0A1930]">
              {L('Find your pathway', 'Hitta din väg')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              {L(
                'Answer a few quick questions. Then you get the form that fits you, and a last check before you send it.',
                'Svara på några snabba frågor. Sedan får du formuläret som passar dig, och en sista kontroll innan du skickar.',
              )}
            </p>
          </div>

          <div
            id="register-wizard"
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
                    <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                      {L('You are registering for', 'Du anmäler dig till')}
                    </span>
                    <span className={`block font-headline font-black text-lg sm:text-xl uppercase tracking-tight leading-tight ${green ? 'text-[#059669]' : 'text-[#006AA7]'}`}>
                      {T(programme.title)}
                    </span>
                    {(programme.date || programme.venue) && (
                      <span className="block mt-1 text-[11px] font-mono-code font-semibold text-slate-600">{meta(programme)}</span>
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
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mr-1">
                  {L('Your choices', 'Dina val')}
                </span>
                {crumbs.map(({ k, stepKind, card }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => goToKind(stepKind)}
                    aria-label={`${L('Change', 'Ändra')}: ${T(card.title)}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 hover:border-[#0A1930] text-[11px] font-headline font-bold uppercase tracking-wider text-slate-700"
                  >
                    <span aria-hidden="true">{card.icon}</span>
                    <span>{T(card.title)}</span>
                    <Pencil className="w-3 h-3 text-[#006AA7]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            {/* Progress */}
            {!done && (
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3 mb-2 text-[11px] font-mono-code font-bold uppercase tracking-wider">
                  <span className="text-[#0A1930]">{L(`Step ${index + 1} of ${steps.length}`, `Steg ${index + 1} av ${steps.length}`)}</span>
                  <span className="text-slate-500 text-right">{T(stepLabel(kind, path))}</span>
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                  {steps.map((s, j) => (
                    <span key={s} className={`h-1.5 ${j <= index ? accentBg : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 sm:p-8">
              {done && doneCopy ? (
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-emerald-600 uppercase mb-1 block">
                    {L('Received', 'Mottaget')} // {site.cityName} 2026
                  </span>
                  <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{doneCopy.title}</h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">{doneCopy.body}</p>
                  {done.id && (
                    <div className="my-6 p-4 bg-slate-50 border border-slate-200 w-full max-w-md text-center">
                      <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1">{L('Your reference', 'Ditt referensnummer')}</span>
                      <span className="font-mono-code font-bold text-xl text-[#006AA7] tracking-wider block">{done.id}</span>
                      <span className="text-[11px] text-slate-500 font-mono-code block mt-1">
                        {L('Status: waiting for review', 'Status: väntar på granskning')}
                      </span>
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
                        <span>{copied ? L('Link copied!', 'Länken är kopierad!') : L('Copy link: vote for my idea', 'Kopiera länk: rösta på min idé')}</span>
                      </button>
                    )}
                    {formId === 'idea' && onNavigateVoting && (
                      <button
                        type="button"
                        onClick={onNavigateVoting}
                        className="py-3 px-5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                      >
                        ⭐ {L('View ideas & vote', 'Se idéer och rösta')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={sendAnother}
                      className="py-3 px-5 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                    >
                      {L('Send another', 'Skicka en till')}
                    </button>
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
                <span className="hidden sm:block text-[11px] font-mono-code text-slate-500 truncate">{footer}</span>
                <button
                  type={kind === 'form' ? 'submit' : 'button'}
                  form={kind === 'form' ? 'register-form' : undefined}
                  onClick={kind === 'form' ? undefined : next}
                  disabled={busy || (choiceStep && !isAnswered(kind, path))}
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
      </div>
    </div>
  );
};
