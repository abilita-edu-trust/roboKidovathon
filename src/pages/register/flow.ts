// The register page asks a few card questions, one per step, then opens the one form that
// fits the answers, then a review. The site's programmes (SiteConfig.intake.programmes)
// decide which questions it asks; SiteConfig.intake.tabs decides which forms it accepts.
import type { Bilingual } from '../../context/SiteContext';

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
  | 'community';

export const REGISTER_TABS: IntakeProgramTab[] = [
  'workshop', 'demo', 'association', 'competition', 'submit-idea', 'hackathon', 'volunteer', 'mentor', 'partner', 'community',
];

export type ProgrammeId = 'robo' | 'hack' | 'ideas' | 'community';
export type RoleId = 'school' | 'team' | 'individual' | 'association' | 'member' | 'volunteer' | 'mentor' | 'partner';
export type ActivityId = 'demo' | 'workshop' | 'competition' | 'idea' | 'participate';
export type StepKind = 'programme' | 'role' | 'activity' | 'theme' | 'form' | 'review';
export type FormId = 'booking' | 'association' | 'competition' | 'squad' | 'idea' | 'volunteer' | 'mentor' | 'partner' | 'community';

/** The answers so far. */
export interface RegisterPath {
  programme?: ProgrammeId;
  role?: RoleId;
  activity?: ActivityId;
  /** Idea area or hackathon challenge area (stored as the English value). */
  theme?: string;
}

/** A step-1 card: one programme of the site, with its own date and place. */
export interface RegisterProgramme {
  id: ProgrammeId;
  title: Bilingual;
  subtitle: Bilingual;
  date?: Bilingual;
  venue?: Bilingual;
  /** A file in public/. */
  image?: string;
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

export function roleChoices(programme: ProgrammeId | undefined, accepts: Accepts): Choice<RoleId>[] {
  const ok = (r: RoleId) => !ROLE_TAB[r] || accepts(ROLE_TAB[r]!);
  if (programme === 'community') return (['member', 'volunteer', 'mentor', 'partner'] as RoleId[]).filter(ok).map((r) => ROLE_CARDS[r]);
  if (programme === 'hack') return [ROLE_CARDS.school, ROLE_CARDS.team, HACK_INDIVIDUAL];
  return (['school', 'team', 'individual', 'association'] as RoleId[]).filter(ok).map((r) => ROLE_CARDS[r]);
}

const ACTIVITY_TAB: Record<ActivityId, IntakeProgramTab> = {
  demo: 'demo',
  workshop: 'workshop',
  competition: 'competition',
  idea: 'submit-idea',
  participate: 'hackathon',
};

export function activityChoices(programme: ProgrammeId | undefined, accepts: Accepts): Choice<ActivityId>[] {
  const ids: ActivityId[] = programme === 'hack' ? ['idea', 'participate'] : ['demo', 'workshop', 'competition'];
  return ids.filter((a) => accepts(ACTIVITY_TAB[a])).map((a) => ACTIVITY_CARDS[a]);
}

export const themeChoices = (path: RegisterPath): Choice[] =>
  path.programme === 'hack' && path.activity === 'participate' ? CHALLENGE_AREAS : IDEA_AREAS;

/** The card behind an answer, for the "your choices" bar and the review. */
export function answerCard(kind: 'role' | 'activity' | 'theme', path: RegisterPath): Choice | undefined {
  if (kind === 'role') return path.role && (path.programme === 'hack' && path.role === 'individual' ? HACK_INDIVIDUAL : ROLE_CARDS[path.role]);
  if (kind === 'activity') return path.activity && ACTIVITY_CARDS[path.activity];
  return path.theme ? themeChoices(path).find((t) => t.id === path.theme) : undefined;
}

// ── Steps ──

/** The steps for the answers so far; step 1 is left out when the site has one programme. */
export function stepsFor(path: RegisterPath, programmes: RegisterProgramme[]): StepKind[] {
  const steps: StepKind[] = programmes.length > 1 ? ['programme'] : [];
  if (path.programme === 'ideas') steps.push('theme');
  else if (path.programme === 'community') steps.push('role');
  // Robo and the hackathon (whose theme is asked on its activity step); before step 1 is
  // answered this is the longest path.
  else steps.push('role', 'activity');
  return [...steps, 'form', 'review'];
}

export function isAnswered(kind: StepKind, path: RegisterPath): boolean {
  if (kind === 'programme') return !!path.programme;
  if (kind === 'role') return !!path.role;
  if (kind === 'activity') return !!path.activity && (path.programme !== 'hack' || !!path.theme);
  if (kind === 'theme') return !!path.theme;
  return false;
}

export function stepLabel(kind: StepKind, path: RegisterPath): Bilingual {
  switch (kind) {
    case 'programme':
      return bi('Choose programme', 'Välj program');
    case 'role':
      return path.programme === 'community' ? bi('How to get involved', 'Hur du engagerar dig') : bi('How you are joining', 'Hur du deltar');
    case 'activity':
      return path.programme === 'hack' ? bi('Your pathway', 'Din väg') : bi('Choose activity', 'Välj aktivitet');
    case 'theme':
      return bi('Choose an area', 'Välj område');
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
  if (programme === 'community') {
    if (role === 'member') return 'community';
    return role === 'volunteer' || role === 'mentor' || role === 'partner' ? role : null;
  }
  if (!role || !activity) return null;
  if (programme === 'hack') return path.theme ? (activity === 'idea' ? 'idea' : 'squad') : null;
  if (activity === 'competition') return 'competition';
  return role === 'association' ? 'association' : 'booking';
}

// ── ?tab= links ──

/** The answers a ?tab= link implies; the questions it leaves open are still asked. */
export function pathForTab(tab: IntakeProgramTab, programmes: RegisterProgramme[]): RegisterPath {
  switch (tab) {
    case 'workshop':
    case 'demo':
    case 'competition':
      return { programme: 'robo', activity: tab };
    case 'association':
      return { programme: 'robo', role: 'association' };
    case 'submit-idea':
      return programmes.some((p) => p.id === 'hack') ? { programme: 'hack', activity: 'idea' } : { programme: 'ideas' };
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
      return 'hackathon';
    case 'idea':
      return 'submit-idea';
    default:
      return form;
  }
}
