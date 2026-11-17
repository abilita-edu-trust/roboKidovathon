// The register page asks a few card questions, one per step, then opens the one form that
// fits the answers, then a review. The site's programmes (SiteConfig.intake.programmes)
// decide which questions it asks; SiteConfig.intake.tabs decides which forms it accepts.
// Future InnoHack (vfi and IBK: a hackathon programme with `tracks`) asks its track right after
// the programme: Kid InnoHack (an idea for selection, guardians confirm) or Young InnoHack (an
// idea for the public vote, the hackathon squad, or the mentor form for professionals).
// Once the Admin Panel publishes Young InnoHack's company challenges (path.challengeMode), taking part in Young
// InnoHack is four steps: the challenge, on your own or in a team (create one or join one), your details, review.
import type { Bilingual } from '../../context/SiteContext';
import type { InnohackTrackId } from '../../content/sections/innohack';
import { CLASSIC_ACTIVITY_CARDS, CLASSIC_CHALLENGE_AREAS, CLASSIC_HACK_INDIVIDUAL, CLASSIC_IDEA_AREAS, CLASSIC_ROLE_CARDS } from './classicCards';

/** A form on the register page; also the ?tab= value that opens it. */
export type IntakeProgramTab =
  | 'workshop'
  | 'demo'
  | 'association'
  | 'competition'
  | 'submit-idea'
  | 'hackathon'
  | 'volunteer'
  | 'mentor'
  | 'partner'
  | 'community'
  | 'kid-innohack'
  | 'young-innohack'
  | 'build-play';

export const REGISTER_TABS: IntakeProgramTab[] = [
  'workshop', 'demo', 'association', 'competition', 'submit-idea', 'hackathon', 'volunteer', 'mentor', 'partner', 'community',
  'kid-innohack', 'young-innohack', 'build-play',
];

/** Links that only sites with Future InnoHack tracks accept. */
export const TRACK_TABS: IntakeProgramTab[] = ['kid-innohack', 'young-innohack'];

export type ProgrammeId = 'robo' | 'hack' | 'ideas' | 'community';
export type RoleId = 'school' | 'team' | 'individual' | 'association' | 'member' | 'volunteer' | 'mentor' | 'partner';
export type ActivityId = 'demo' | 'workshop' | 'competition' | 'build-play' | 'idea' | 'participate' | 'kid-idea' | 'mentor';
export type StepKind = 'programme' | 'track' | 'role' | 'activity' | 'team' | 'choices' | 'theme' | 'form' | 'review';
export type FormId = 'booking' | 'association' | 'competition' | 'buildplay' | 'squad' | 'young' | 'idea' | 'volunteer' | 'mentor' | 'partner' | 'community' | 'kid';
/** Young InnoHack with company challenges: on your own, creating a team, or joining one. */
export type TeamChoice = 'individual' | 'create' | 'join';

/** The answers so far. */
export interface RegisterPath {
  programme?: ProgrammeId;
  /** Future InnoHack's track (sites whose hackathon programme has tracks). */
  track?: InnohackTrackId;
  role?: RoleId;
  activity?: ActivityId;
  /** Idea area or hackathon challenge area (stored as the English value). */
  theme?: string;
  /** Young InnoHack's company challenges are published (the wizard sets this from the database). */
  challengeMode?: boolean;
  /** vfi and IBK (SiteConfig.designV2): the cards below. Other sites keep the earlier cards (./classicCards). The
   *  wizard sets this from the site. */
  v2?: boolean;
  /** On your own, starting a team, or joining one. */
  team?: TeamChoice;
  /** The 1st and 2nd company challenge choices (ids; a team's when joining it). */
  first?: string;
  second?: string;
}

/** Young InnoHack with published company challenges: asks how you take part and two choices instead of who you are. */
export const youngChallenges = (path: RegisterPath) => path.programme === 'hack' && path.track === 'young' && !!path.challengeMode;

/** A 1st and a 2nd choice, different from each other. */
export const twoChoices = (path: RegisterPath) => !!path.first && !!path.second && path.first !== path.second;

/** A step-1 card: one programme of the site, with its own date and place. */
export interface RegisterProgramme {
  id: ProgrammeId;
  title: Bilingual;
  subtitle: Bilingual;
  date?: Bilingual;
  venue?: Bilingual;
  /** A file in public/. */
  image?: string;
  /** Future InnoHack: the tracks asked right after this programme (vfi and IBK). */
  tracks?: InnohackTrackId[];
}

export interface Choice<T extends string = string> {
  id: T;
  icon: string;
  title: Bilingual;
  desc: Bilingual;
}

const bi = (en: string, sv: string): Bilingual => ({ en, sv });

/** Programme details for a form reached by a link on a site that has no such step-1 card. */
const FALLBACK_PROGRAMMES: Record<ProgrammeId, RegisterProgramme> = {
  robo: { id: 'robo', title: bi('RoboKidovation', 'RoboKidovation'), subtitle: bi('School robotics', 'Skolrobotik'), image: '/register/robokidovation.jpg' },
  hack: { id: 'hack', title: bi('Hackathon', 'Hackathon'), subtitle: bi('Ideas and squads', 'Idéer och lag'), image: '/register/hackathon.jpg' },
  ideas: { id: 'ideas', title: bi('Bring your idea', 'Kom med din idé'), subtitle: bi('Share an idea, then the public votes', 'Dela en idé, sedan röstar alla'), image: '/register/hackathon.jpg' },
  community: { id: 'community', title: bi('Get involved', 'Engagera dig'), subtitle: bi('Volunteer or partner with us', 'Bli volontär eller partner') },
};

export const programmeOf = (id: ProgrammeId, programmes: RegisterProgramme[]): RegisterProgramme =>
  programmes.find((p) => p.id === id) ?? FALLBACK_PROGRAMMES[id];

/** The tracks of the site's hackathon programme (Future InnoHack: kid, young); empty elsewhere. */
export const hackTracks = (programmes: RegisterProgramme[]): InnohackTrackId[] => programmes.find((p) => p.id === 'hack')?.tracks ?? [];

/** Ideas and the hackathon use the green accent, like the old forms. */
export const isGreen = (programme?: ProgrammeId) => programme === 'hack' || programme === 'ideas';

// ── Question cards ──

// vfi and IBK's cards. Icons are names from REGISTER_ICONS (./icons): one line-icon set for every card.
const ROLE_CARDS: Record<RoleId, Choice<RoleId>> = {
  school: { id: 'school', icon: 'School', title: bi('A school or class', 'En skola eller klass'), desc: bi('You are a teacher or sign up on behalf of a school.', 'Du är lärare eller anmäler för en skola.') },
  team: { id: 'team', icon: 'Users', title: bi('A team we already have', 'Ett lag vi redan har'), desc: bi('The team is ready; you are its contact.', 'Laget finns redan; du är dess kontakt.') },
  individual: {
    id: 'individual',
    icon: 'User',
    title: bi('Myself or my child', 'Mig själv eller mitt barn'),
    desc: bi('One person: you, or your child.', 'En person: du eller ditt barn.'),
  },
  association: {
    id: 'association',
    icon: 'Tent',
    title: bi('A club or association', 'En klubb eller förening'),
    desc: bi('Scouts, sports clubs, study circles and parent groups.', 'Scouter, idrottsklubbar, studiecirklar och föräldragrupper.'),
  },
  member: { id: 'member', icon: 'Mail', title: bi('Stay in touch', 'Håll kontakten'), desc: bi('Occasional news about events and ways to take part.', 'Nyheter då och då om evenemang och sätt att delta.') },
  volunteer: { id: 'volunteer', icon: 'HandHeart', title: bi('Help on the day', 'Hjälp till på plats'), desc: bi('Welcome visitors, run stations, keep things moving.', 'Ta emot besökare, sköt stationer, håll ordning.') },
  mentor: { id: 'mentor', icon: 'GraduationCap', title: bi('Mentor a team', 'Bli mentor för ett lag'), desc: bi('Share what you know with student teams.', 'Dela med dig av det du kan till elevlagen.') },
  partner: {
    id: 'partner',
    icon: 'Handshake',
    title: bi('Partner with us', 'Bli partner'),
    desc: bi('For companies and organisations.', 'För företag och organisationer.'),
  },
};

const HACK_INDIVIDUAL: Choice<RoleId> = {
  id: 'individual',
  icon: 'User',
  title: bi('Just me', 'Bara jag'),
  desc: bi('Come on your own; we help you find a team.', 'Kom ensam; vi hjälper dig att hitta ett lag.'),
};

/** Kid InnoHack: who sends the idea (each child's guardian confirms by email). */
const KID_ROLE_CARDS: Record<'school' | 'team' | 'individual', Choice<RoleId>> = {
  school: {
    id: 'school',
    icon: 'School',
    title: bi('A teacher, for my class', 'En lärare, för min klass'),
    desc: bi('One idea per group of 1–4 pupils.', 'En idé per grupp med 1–4 elever.'),
  },
  team: {
    id: 'team',
    icon: 'Users',
    title: bi('A team of friends', 'Ett gäng kompisar'),
    desc: bi('2–4 children with one idea together.', '2–4 barn med en gemensam idé.'),
  },
  individual: {
    id: 'individual',
    icon: 'User',
    title: bi('One child', 'Ett barn'),
    desc: bi('Sent by a parent, guardian or teacher.', 'Skickas av en förälder, vårdnadshavare eller lärare.'),
  },
};

const ACTIVITY_CARDS: Record<ActivityId, Choice<ActivityId>> = {
  demo: { id: 'demo', icon: 'Presentation', title: bi('A school demo', 'En skoldemo'), desc: bi('A short robot show for a class or an assembly.', 'En kort robotvisning för en klass eller en samling.') },
  workshop: {
    id: 'workshop',
    icon: 'Wrench',
    title: bi('A workshop', 'En workshop'),
    desc: bi('Hands-on building with our kits and instructors.', 'Bygg på riktigt med våra kit och instruktörer.'),
  },
  competition: {
    id: 'competition',
    icon: 'Trophy',
    title: bi('Robo Sprint competition', 'Tävlingen Robo Sprint'),
    desc: bi('Grades 3–9: school qualifiers, then the final.', 'Årskurs 3–9: skolkval, sedan finalen.'),
  },
  'build-play': {
    id: 'build-play',
    icon: 'Blocks',
    title: bi('Build & Play', 'Build & Play'),
    desc: bi('Preschool to grade 2, with you, on 5 December 2026. Free, and no competition.', 'Förskola till årskurs 2, tillsammans med dig, den 5 december 2026. Gratis, och ingen tävling.'),
  },
  idea: {
    id: 'idea',
    icon: 'Megaphone',
    title: bi('An idea for the public vote', 'En idé till den publika omröstningen'),
    desc: bi('Share an idea; approved ideas go up for everyone to vote on.', 'Dela en idé; godkända idéer visas så att alla kan rösta.'),
  },
  participate: {
    id: 'participate',
    icon: 'Rocket',
    title: bi('Take part in the hackathon', 'Delta i hackathonet'),
    desc: bi('Register a team and build on the day.', 'Anmäl ett lag och bygg på plats.'),
  },
  'kid-idea': {
    id: 'kid-idea',
    icon: 'Lightbulb',
    title: bi('Send an idea to Kid InnoHack', 'Skicka en idé till Kid InnoHack'),
    desc: bi(
      'A problem you have noticed and how you would fix it, by 1 December 2026. Five ideas go on to mentoring and the final.',
      'Ett problem du har sett och hur du skulle lösa det, senast 1 december 2026. Fem idéer går vidare till handledning och finalen.',
    ),
  },
  mentor: {
    id: 'mentor',
    icon: 'GraduationCap',
    title: bi('Mentor the teams', 'Bli mentor för lagen'),
    desc: bi('For professionals: coach teams with your experience.', 'För yrkesverksamma: coacha lagen med din erfarenhet.'),
  },
};

/** Young InnoHack with company challenges: take part in one of them. */
const CHALLENGE_CARD: Choice<ActivityId> = {
  id: 'participate',
  icon: 'Target',
  title: bi('Take on a company challenge', 'Anta en utmaning från ett företag'),
  desc: bi('On your own or in a team; you give two choices and the organisers match you.', 'Själv eller i lag; du gör två val och arrangörerna matchar dig.'),
};

/** Young InnoHack's public idea (vfi and IBK) closes on 1 December 2026; other hackathons keep the plain card. */
const YOUNG_IDEA_CARD: Choice<ActivityId> = {
  ...ACTIVITY_CARDS.idea,
  desc: bi(
    'Share an idea by 1 December 2026; approved ideas go up for everyone to vote on.',
    'Dela en idé senast 1 december 2026; godkända idéer visas så att alla kan rösta.',
  ),
};

/** Idea areas from the printed Idea Card (stored as the English value). */
export const IDEA_AREAS: Choice[] = [
  { id: 'Sustainability', icon: 'Leaf', title: bi('Sustainability', 'Hållbarhet'), desc: bi('', '') },
  { id: 'Energy', icon: 'Zap', title: bi('Energy', 'Energi'), desc: bi('', '') },
  { id: 'Future Cities', icon: 'Building2', title: bi('Future Cities', 'Framtidens städer'), desc: bi('', '') },
  { id: 'Future Schools', icon: 'School', title: bi('Future Schools', 'Framtidens skolor'), desc: bi('', '') },
  { id: 'Technology / AI', icon: 'Cpu', title: bi('Technology / AI', 'Teknik / AI'), desc: bi('', '') },
  { id: 'Community', icon: 'HeartHandshake', title: bi('Community', 'Samhälle'), desc: bi('', '') },
];

/** Hackathon challenge areas (the admin squad view reads them as intake_details.challenge_domain). */
export const CHALLENGE_AREAS: Choice[] = [
  { id: 'Sustainable Cities & Climate', icon: 'Globe2', title: bi('Sustainable Cities & Climate', 'Hållbara städer och klimat'), desc: bi('', '') },
  { id: 'Future School & Digital Learning', icon: 'BookOpen', title: bi('Future School & Digital Learning', 'Framtidens skola och digitalt lärande'), desc: bi('', '') },
  { id: 'Autonomous Navigation & Rover Tech', icon: 'Bot', title: bi('Autonomous Navigation & Rover Tech', 'Autonom navigering och rovrar'), desc: bi('', '') },
  { id: 'Civic Accessibility & Healthcare', icon: 'Accessibility', title: bi('Civic Accessibility & Healthcare', 'Tillgänglighet och hälsa'), desc: bi('', '') },
];

type Accepts = (tab: IntakeProgramTab) => boolean;

const ROLE_TAB: Partial<Record<RoleId, IntakeProgramTab>> = {
  association: 'association',
  member: 'community',
  volunteer: 'volunteer',
  mentor: 'mentor',
  partner: 'partner',
};

// vfi and IBK's cards, or the earlier ones elsewhere. Kid InnoHack, Young InnoHack and their cards exist only on vfi
// and IBK, so they have no earlier version.
const roleCards = (v2?: boolean) => (v2 ? ROLE_CARDS : CLASSIC_ROLE_CARDS);
const hackIndividual = (v2?: boolean) => (v2 ? HACK_INDIVIDUAL : CLASSIC_HACK_INDIVIDUAL);
const activityCards = (v2?: boolean) => (v2 ? ACTIVITY_CARDS : CLASSIC_ACTIVITY_CARDS);

export function roleChoices(programme: ProgrammeId | undefined, accepts: Accepts, track?: InnohackTrackId, v2?: boolean): Choice<RoleId>[] {
  const ok = (r: RoleId) => !ROLE_TAB[r] || accepts(ROLE_TAB[r]!);
  const cards = roleCards(v2);
  if (programme === 'community') return (['member', 'volunteer', 'mentor', 'partner'] as RoleId[]).filter(ok).map((r) => cards[r]);
  if (programme === 'hack' && track === 'kid') return [KID_ROLE_CARDS.school, KID_ROLE_CARDS.team, KID_ROLE_CARDS.individual];
  if (programme === 'hack') return [cards.school, cards.team, hackIndividual(v2)];
  return (['school', 'team', 'individual', 'association'] as RoleId[]).filter(ok).map((r) => cards[r]);
}

const ACTIVITY_TAB: Record<ActivityId, IntakeProgramTab> = {
  demo: 'demo',
  workshop: 'workshop',
  competition: 'competition',
  'build-play': 'build-play',
  idea: 'submit-idea',
  participate: 'hackathon',
  'kid-idea': 'kid-innohack',
  mentor: 'mentor',
};

/**
 * The pathway cards. Kid InnoHack has one (its idea for selection); Young InnoHack keeps the public idea and the
 * hackathon squad, and individuals can also choose the mentor form; other hackathons keep idea and squad.
 */
export function activityChoices(programme: ProgrammeId | undefined, accepts: Accepts, path: RegisterPath = {}): Choice<ActivityId>[] {
  // A parent can also sign up for Build & Play (sites that offer it).
  let ids: ActivityId[] = path.role === 'individual' ? ['demo', 'workshop', 'competition', 'build-play'] : ['demo', 'workshop', 'competition'];
  if (programme === 'hack' && path.track === 'kid') ids = ['kid-idea'];
  else if (youngChallenges(path)) ids = ['participate', 'idea', 'mentor'];
  else if (programme === 'hack' && path.track === 'young') ids = path.role === 'individual' ? ['idea', 'participate', 'mentor'] : ['idea', 'participate'];
  else if (programme === 'hack') ids = ['idea', 'participate'];
  return ids
    .filter((a) => accepts(ACTIVITY_TAB[a]))
    .map((a) => (a === 'idea' && path.track === 'young' ? YOUNG_IDEA_CARD : a === 'participate' && youngChallenges(path) ? CHALLENGE_CARD : activityCards(path.v2)[a]));
}

/** The area cards under the pathway: idea areas, or the hackathon's challenge areas. Young InnoHack's squad
 *  chooses among the companies' challenges in its form instead, and Kid InnoHack has none. */
export const themeChoices = (path: RegisterPath): Choice[] => {
  if (path.programme === 'hack' && (path.activity === 'kid-idea' || path.activity === 'mentor')) return [];
  if (path.programme === 'hack' && path.activity === 'participate') return path.track ? [] : path.v2 ? CHALLENGE_AREAS : CLASSIC_CHALLENGE_AREAS;
  return path.v2 ? IDEA_AREAS : CLASSIC_IDEA_AREAS;
};

/** The card behind an answer, for the "your choices" bar and the review. */
export function answerCard(kind: 'role' | 'activity' | 'theme', path: RegisterPath): Choice | undefined {
  if (kind === 'role') {
    if (!path.role) return undefined;
    if (path.programme === 'hack' && path.track === 'kid' && path.role in KID_ROLE_CARDS) return KID_ROLE_CARDS[path.role as keyof typeof KID_ROLE_CARDS];
    return path.programme === 'hack' && path.role === 'individual' ? hackIndividual(path.v2) : roleCards(path.v2)[path.role];
  }
  if (kind === 'activity') return path.activity === 'participate' && youngChallenges(path) ? CHALLENGE_CARD : path.activity && activityCards(path.v2)[path.activity];
  return path.theme ? themeChoices(path).find((t) => t.id === path.theme) : undefined;
}

// ── Steps ──

/** The steps for the answers so far; step 1 is left out when the site has one programme. */
export function stepsFor(path: RegisterPath, programmes: RegisterProgramme[]): StepKind[] {
  const steps: StepKind[] = programmes.length > 1 ? ['programme'] : [];
  if (path.programme === 'ideas') steps.push('theme');
  else if (path.programme === 'community') steps.push('role');
  else {
    // Future InnoHack asks its track first.
    if (path.programme === 'hack' && hackTracks(programmes).length) steps.push('track');
    if (youngChallenges(path)) {
      // Young InnoHack with company challenges: the pathway first; taking part (the default until another is
      // chosen) asks how you take part, then the two choices (a team's, read-only, when joining it); an idea asks
      // who sends it; mentoring goes straight to its form.
      steps.push('activity');
      if (!path.activity || path.activity === 'participate') steps.push('team', 'choices');
      else if (path.activity === 'idea') steps.push('role');
      return [...steps, 'form', 'review'];
    }
    // Robo and the hackathon (whose theme is asked on its activity step); before step 1 is
    // answered this is the longest path.
    steps.push('role', 'activity');
  }
  return [...steps, 'form', 'review'];
}

export function isAnswered(kind: StepKind, path: RegisterPath): boolean {
  if (kind === 'programme') return !!path.programme;
  if (kind === 'track') return !!path.track;
  if (kind === 'role') return !!path.role;
  if (kind === 'activity') {
    if (!path.activity) return false;
    if (path.programme !== 'hack') return true;
    if (path.track === 'kid') return path.activity === 'kid-idea';
    if (path.activity === 'mentor') return path.track === 'young';
    if (path.activity === 'participate' && path.track === 'young') return true;
    return path.activity !== 'kid-idea' && !!path.theme;
  }
  if (kind === 'theme') return !!path.theme;
  if (kind === 'team') return !!path.team;
  if (kind === 'choices') return twoChoices(path);
  return false;
}

export function stepLabel(kind: StepKind, path: RegisterPath): Bilingual {
  switch (kind) {
    case 'programme':
      return bi('Choose programme', 'Välj program');
    case 'track':
      return bi('Choose track', 'Välj spår');
    case 'role':
      return path.programme === 'community' ? bi('How to get involved', 'Hur du engagerar dig') : bi('How you are joining', 'Hur du deltar');
    case 'activity':
      return path.programme === 'hack' ? bi('Your pathway', 'Din väg') : bi('Choose activity', 'Välj aktivitet');
    case 'theme':
      return bi('Choose an area', 'Välj område');
    case 'team':
      return bi('How you take part', 'Hur du deltar');
    case 'choices':
      return bi('Your two choices', 'Dina två val');
    case 'form':
      return bi('Your details', 'Dina uppgifter');
    default:
      return bi('Review', 'Granska');
  }
}

/** The form the answers lead to, or null while a question is still open. */
export function formFor(path: RegisterPath): FormId | null {
  const { programme, role, activity } = path;
  if (programme === 'ideas') return path.theme ? 'idea' : null;
  if (youngChallenges(path)) {
    if (activity === 'participate') return path.team && twoChoices(path) ? 'young' : null;
    if (activity === 'mentor') return 'mentor';
    if (activity === 'idea') return role && path.theme ? 'idea' : null;
    return null;
  }
  if (programme === 'community') {
    if (role === 'member') return 'community';
    return role === 'volunteer' || role === 'mentor' || role === 'partner' ? role : null;
  }
  if (!role || !activity) return null;
  if (programme === 'hack') {
    if (activity === 'kid-idea') return path.track === 'kid' ? 'kid' : null;
    if (activity === 'mentor') return path.track === 'young' ? 'mentor' : null;
    if (activity === 'participate' && path.track === 'young') return 'squad';
    if (path.track === 'kid') return null;
    return path.theme ? (activity === 'idea' ? 'idea' : 'squad') : null;
  }
  if (activity === 'competition') return 'competition';
  if (activity === 'build-play') return 'buildplay';
  return role === 'association' ? 'association' : 'booking';
}

// ── ?tab= links ──

/**
 * The answers a ?tab= link implies; the questions it leaves open are still asked. On Future InnoHack sites the old
 * hackathon link asks the track, the track links choose it, and submit-idea is Young InnoHack's public idea.
 */
export function pathForTab(tab: IntakeProgramTab, programmes: RegisterProgramme[]): RegisterPath {
  const tracked = hackTracks(programmes).length > 0;
  switch (tab) {
    case 'kid-innohack':
      return tracked ? { programme: 'hack', track: 'kid', activity: 'kid-idea' } : { programme: 'hack', activity: 'participate' };
    case 'young-innohack':
      return tracked ? { programme: 'hack', track: 'young', activity: 'participate' } : { programme: 'hack', activity: 'participate' };
    case 'workshop':
    case 'demo':
    case 'competition':
      return { programme: 'robo', activity: tab };
    case 'association':
      return { programme: 'robo', role: 'association' };
    case 'build-play':
      return { programme: 'robo', role: 'individual', activity: 'build-play' };
    case 'submit-idea':
      if (!programmes.some((p) => p.id === 'hack')) return { programme: 'ideas' };
      return tracked ? { programme: 'hack', track: 'young', activity: 'idea' } : { programme: 'hack', activity: 'idea' };
    case 'hackathon':
      return { programme: 'hack', activity: 'participate' };
    case 'community':
      return { programme: 'community', role: 'member' };
    default:
      return { programme: 'community', role: tab };
  }
}

/** The ?tab= value for an open form, so a shared or reloaded link comes back to it. */
export function tabForPath(path: RegisterPath): IntakeProgramTab | null {
  const form = formFor(path);
  switch (form) {
    case null:
      return null;
    case 'booking':
      return path.activity === 'demo' ? 'demo' : 'workshop';
    case 'squad':
      return path.track === 'young' ? 'young-innohack' : 'hackathon';
    case 'young':
      return 'young-innohack';
    case 'kid':
      return 'kid-innohack';
    case 'buildplay':
      return 'build-play';
    case 'idea':
      return 'submit-idea';
    default:
      return form;
  }
}
