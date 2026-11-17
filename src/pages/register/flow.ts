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
export type StepKind = 'programme' | 'track' | 'role' | 'activity' | 'challenge' | 'team' | 'theme' | 'form' | 'review';
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
  /** The chosen company challenge (its id). */
  challenge?: string;
  /** On your own, creating a team, or joining one. */
  team?: TeamChoice;
}

/** Young InnoHack with published company challenges: asks challenge and team instead of who you are. */
export const youngChallenges = (path: RegisterPath) => path.programme === 'hack' && path.track === 'young' && !!path.challengeMode;

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

const ROLE_CARDS: Record<RoleId, Choice<RoleId>> = {
  school: { id: 'school', icon: '🏫', title: bi('School / Teacher', 'Skola / lärare'), desc: bi('Register on behalf of a school or class.', 'Anmäl för en skola eller klass.') },
  team: { id: 'team', icon: '👥', title: bi('Existing team', 'Befintligt lag'), desc: bi('Already have a team? Start here.', 'Har ni redan ett lag? Börja här.') },
  individual: {
    id: 'individual',
    icon: '🙋',
    title: bi('Individual / Parent', 'Individ / förälder'),
    desc: bi('Join on your own, or sign up your child.', 'Delta på egen hand eller anmäl ditt barn.'),
  },
  association: {
    id: 'association',
    icon: '🤝',
    title: bi('Association / Club', 'Förening / klubb'),
    desc: bi('Clubs, scouts, study associations and parent groups.', 'Klubbar, scouter, studieförbund och föräldragrupper.'),
  },
  member: { id: 'member', icon: '🤝', title: bi('Join the community', 'Gå med i nätverket'), desc: bi('Get news about activities and ways to take part.', 'Få nyheter om aktiviteter och sätt att delta.') },
  volunteer: { id: 'volunteer', icon: '🙌', title: bi('Volunteer', 'Volontär'), desc: bi('Help organise and run the events.', 'Hjälp till att organisera och genomföra evenemangen.') },
  mentor: { id: 'mentor', icon: '🎓', title: bi('Mentor', 'Mentor'), desc: bi('Support student teams and their projects.', 'Stötta elevlag och deras projekt.') },
  partner: {
    id: 'partner',
    icon: '🏢',
    title: bi('Partner', 'Samarbetspartner'),
    desc: bi('Work with us as a company or organisation.', 'Samarbeta med oss som företag eller organisation.'),
  },
};

const HACK_INDIVIDUAL: Choice<RoleId> = {
  id: 'individual',
  icon: '🙋',
  title: bi('Individual', 'Individ'),
  desc: bi('Join on your own. We help you find a team.', 'Delta på egen hand. Vi hjälper dig att hitta ett lag.'),
};

/** Kid InnoHack: who sends the idea (each child's guardian confirms by email). */
const KID_ROLE_CARDS: Record<'school' | 'team' | 'individual', Choice<RoleId>> = {
  school: {
    id: 'school',
    icon: '🏫',
    title: bi('School / Teacher', 'Skola / lärare'),
    desc: bi('Send ideas for pupils in your class: 1–4 children per idea.', 'Skicka in idéer för elever i din klass: 1–4 barn per idé.'),
  },
  team: {
    id: 'team',
    icon: '👥',
    title: bi('Existing team', 'Befintligt lag'),
    desc: bi('A team of 2–4 children with one idea.', 'Ett lag med 2–4 barn och en idé.'),
  },
  individual: {
    id: 'individual',
    icon: '🙋',
    title: bi('Individual', 'Individ'),
    desc: bi('One child, registered by a parent, guardian or teacher.', 'Ett barn, anmält av en förälder, vårdnadshavare eller lärare.'),
  },
};

const ACTIVITY_CARDS: Record<ActivityId, Choice<ActivityId>> = {
  demo: { id: 'demo', icon: '🎬', title: bi('Request a demo', 'Boka en demonstration'), desc: bi('A short, live robotics show at your school.', 'En kort robotikvisning live på er skola.') },
  workshop: {
    id: 'workshop',
    icon: '🛠️',
    title: bi('Request a workshop', 'Boka en workshop'),
    desc: bi('A hands-on session: we bring the kits, mats and curriculum.', 'Ett praktiskt pass: vi tar med kit, banor och läroplan.'),
  },
  competition: {
    id: 'competition',
    icon: '🏆',
    title: bi('Competition registration', 'Tävlingsanmälan'),
    desc: bi('Enter a team in the RoboKidovation competition.', 'Anmäl ett lag till RoboKidovation-tävlingen.'),
  },
  'build-play': {
    id: 'build-play',
    icon: '🧩',
    title: bi('Build & Play (preschool–grade 2)', 'Build & Play (förskola–åk 2)'),
    desc: bi('Free. Build robots together with your child on 5 December 2026. No competition.', 'Gratis. Bygg robotar tillsammans med ditt barn den 5 december 2026. Ingen tävling.'),
  },
  idea: {
    id: 'idea',
    icon: '💡',
    title: bi('Register your idea', 'Registrera din idé'),
    desc: bi('Send in an idea or a problem to solve. Approved ideas go to public voting.', 'Skicka in en idé eller ett problem att lösa. Godkända idéer går till publik röstning.'),
  },
  participate: {
    id: 'participate',
    icon: '🚀',
    title: bi('Participate in the hackathon', 'Delta i hackathonet'),
    desc: bi('Register a squad and build solutions on the day.', 'Anmäl ett lag och bygg lösningar på plats.'),
  },
  'kid-idea': {
    id: 'kid-idea',
    icon: '💡',
    title: bi('Submit your idea for Kid InnoHack', 'Skicka in din idé till Kid InnoHack'),
    desc: bi(
      'Describe a problem and how you would solve it, by 1 December 2026. Five ideas are selected for mentoring and the final.',
      'Beskriv ett problem och hur du skulle lösa det, senast 1 december 2026. Fem idéer väljs ut till handledning och finalen.',
    ),
  },
  mentor: {
    id: 'mentor',
    icon: '🎓',
    title: bi('Become a mentor (professionals)', 'Bli mentor (yrkesverksamma)'),
    desc: bi('Coach the teams with your experience. You sign up with the mentor form.', 'Coacha lagen med din erfarenhet. Du anmäler dig med mentorsformuläret.'),
  },
};

/** Young InnoHack with company challenges: take part in one of them. */
const CHALLENGE_CARD: Choice<ActivityId> = {
  id: 'participate',
  icon: '🚀',
  title: bi('Take on a company challenge', 'Anta en utmaning från ett företag'),
  desc: bi('Choose a challenge, then take part on your own or in a team.', 'Välj en utmaning och delta sedan på egen hand eller i ett lag.'),
};

/** Young InnoHack's public idea (vfi and IBK) closes on 1 December 2026; other hackathons keep the plain card. */
const YOUNG_IDEA_CARD: Choice<ActivityId> = {
  ...ACTIVITY_CARDS.idea,
  desc: bi(
    'Send in an idea or a problem to solve by 1 December 2026. Approved ideas go to public voting.',
    'Skicka in en idé eller ett problem att lösa senast 1 december 2026. Godkända idéer går till publik röstning.',
  ),
};

/** Idea areas from the printed Idea Card (stored as the English value). */
export const IDEA_AREAS: Choice[] = [
  { id: 'Sustainability', icon: '🌱', title: bi('Sustainability', 'Hållbarhet'), desc: bi('', '') },
  { id: 'Energy', icon: '⚡', title: bi('Energy', 'Energi'), desc: bi('', '') },
  { id: 'Future Cities', icon: '🏙️', title: bi('Future Cities', 'Framtidens städer'), desc: bi('', '') },
  { id: 'Future Schools', icon: '🏫', title: bi('Future Schools', 'Framtidens skolor'), desc: bi('', '') },
  { id: 'Technology / AI', icon: '🧠', title: bi('Technology / AI', 'Teknik / AI'), desc: bi('', '') },
  { id: 'Community', icon: '🤝', title: bi('Community', 'Samhälle'), desc: bi('', '') },
];

/** Hackathon challenge areas (the admin squad view reads them as intake_details.challenge_domain). */
export const CHALLENGE_AREAS: Choice[] = [
  { id: 'Sustainable Cities & Climate', icon: '🌍', title: bi('Sustainable Cities & Climate', 'Hållbara städer och klimat'), desc: bi('', '') },
  { id: 'Future School & Digital Learning', icon: '📚', title: bi('Future School & Digital Learning', 'Framtidens skola och digitalt lärande'), desc: bi('', '') },
  { id: 'Autonomous Navigation & Rover Tech', icon: '🤖', title: bi('Autonomous Navigation & Rover Tech', 'Autonom navigering och rovrar'), desc: bi('', '') },
  { id: 'Civic Accessibility & Healthcare', icon: '♿', title: bi('Civic Accessibility & Healthcare', 'Tillgänglighet och hälsa'), desc: bi('', '') },
];

type Accepts = (tab: IntakeProgramTab) => boolean;

const ROLE_TAB: Partial<Record<RoleId, IntakeProgramTab>> = {
  association: 'association',
  member: 'community',
  volunteer: 'volunteer',
  mentor: 'mentor',
  partner: 'partner',
};

export function roleChoices(programme: ProgrammeId | undefined, accepts: Accepts, track?: InnohackTrackId): Choice<RoleId>[] {
  const ok = (r: RoleId) => !ROLE_TAB[r] || accepts(ROLE_TAB[r]!);
  if (programme === 'community') return (['member', 'volunteer', 'mentor', 'partner'] as RoleId[]).filter(ok).map((r) => ROLE_CARDS[r]);
  if (programme === 'hack' && track === 'kid') return [KID_ROLE_CARDS.school, KID_ROLE_CARDS.team, KID_ROLE_CARDS.individual];
  if (programme === 'hack') return [ROLE_CARDS.school, ROLE_CARDS.team, HACK_INDIVIDUAL];
  return (['school', 'team', 'individual', 'association'] as RoleId[]).filter(ok).map((r) => ROLE_CARDS[r]);
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
    .map((a) => (a === 'idea' && path.track === 'young' ? YOUNG_IDEA_CARD : a === 'participate' && youngChallenges(path) ? CHALLENGE_CARD : ACTIVITY_CARDS[a]));
}

/** The area cards under the pathway: idea areas, or the hackathon's challenge areas. Young InnoHack's squad
 *  chooses among the companies' challenges in its form instead, and Kid InnoHack has none. */
export const themeChoices = (path: RegisterPath): Choice[] => {
  if (path.programme === 'hack' && (path.activity === 'kid-idea' || path.activity === 'mentor')) return [];
  if (path.programme === 'hack' && path.activity === 'participate') return path.track ? [] : CHALLENGE_AREAS;
  return IDEA_AREAS;
};

/** The card behind an answer, for the "your choices" bar and the review. */
export function answerCard(kind: 'role' | 'activity' | 'theme', path: RegisterPath): Choice | undefined {
  if (kind === 'role') {
    if (!path.role) return undefined;
    if (path.programme === 'hack' && path.track === 'kid' && path.role in KID_ROLE_CARDS) return KID_ROLE_CARDS[path.role as keyof typeof KID_ROLE_CARDS];
    return path.programme === 'hack' && path.role === 'individual' ? HACK_INDIVIDUAL : ROLE_CARDS[path.role];
  }
  if (kind === 'activity') return path.activity === 'participate' && youngChallenges(path) ? CHALLENGE_CARD : path.activity && ACTIVITY_CARDS[path.activity];
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
      // chosen) asks the challenge and the team, an idea asks who sends it, mentoring goes straight to its form.
      steps.push('activity');
      if (!path.activity || path.activity === 'participate') steps.push('challenge', 'team');
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
  if (kind === 'challenge') return !!path.challenge;
  if (kind === 'team') return !!path.team;
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
    case 'challenge':
      return bi('Choose a challenge', 'Välj en utmaning');
    case 'team':
      return bi('On your own or in a team', 'Själv eller i ett lag');
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
    if (activity === 'participate') return path.challenge && path.team ? 'young' : null;
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
