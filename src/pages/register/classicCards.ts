// The question cards as they were before the vfi and IBK registration redesign (emoji icons and the earlier
// wording). Riga, Eskilstuna and Växjö keep these unchanged; vfi and IBK (SiteConfig.designV2) use the cards in
// ./flow. Copied from main as it was on 17 November 2026: change them only on purpose, for those cities.
import type { Bilingual } from '../../context/SiteContext';
import type { ActivityId, Choice, RoleId } from './flow';

const bi = (en: string, sv: string): Bilingual => ({ en, sv });

export const CLASSIC_ROLE_CARDS: Record<RoleId, Choice<RoleId>> = {
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

export const CLASSIC_HACK_INDIVIDUAL: Choice<RoleId> = {
  id: 'individual',
  icon: '🙋',
  title: bi('Individual', 'Individ'),
  desc: bi('Join on your own. We help you find a team.', 'Delta på egen hand. Vi hjälper dig att hitta ett lag.'),
};

export const CLASSIC_ACTIVITY_CARDS: Record<ActivityId, Choice<ActivityId>> = {
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
    title: bi('Join Kid InnoHack', 'Delta i Kid InnoHack'),
    desc: bi(
      '5–12 December 2026. No idea needed: we form five teams of four and give each team a challenge. Register by 3 December.',
      '5–12 december 2026. Ingen idé behövs: vi bildar fem lag med fyra barn och ger varje lag en utmaning. Anmäl senast 3 december.',
    ),
  },
  mentor: {
    id: 'mentor',
    icon: '🎓',
    title: bi('Become a mentor (professionals)', 'Bli mentor (yrkesverksamma)'),
    desc: bi('Coach the teams with your experience. You sign up with the mentor form.', 'Coacha lagen med din erfarenhet. Du anmäler dig med mentorsformuläret.'),
  },
};

/** Idea areas from the printed Idea Card (stored as the English value). */
export const CLASSIC_IDEA_AREAS: Choice[] = [
  { id: 'Sustainability', icon: '🌱', title: bi('Sustainability', 'Hållbarhet'), desc: bi('', '') },
  { id: 'Energy', icon: '⚡', title: bi('Energy', 'Energi'), desc: bi('', '') },
  { id: 'Future Cities', icon: '🏙️', title: bi('Future Cities', 'Framtidens städer'), desc: bi('', '') },
  { id: 'Future Schools', icon: '🏫', title: bi('Future Schools', 'Framtidens skolor'), desc: bi('', '') },
  { id: 'Technology / AI', icon: '🧠', title: bi('Technology / AI', 'Teknik / AI'), desc: bi('', '') },
  { id: 'Community', icon: '🤝', title: bi('Community', 'Samhälle'), desc: bi('', '') },
];

/** Hackathon challenge areas (the admin squad view reads them as intake_details.challenge_domain). */
export const CLASSIC_CHALLENGE_AREAS: Choice[] = [
  { id: 'Sustainable Cities & Climate', icon: '🌍', title: bi('Sustainable Cities & Climate', 'Hållbara städer och klimat'), desc: bi('', '') },
  { id: 'Future School & Digital Learning', icon: '📚', title: bi('Future School & Digital Learning', 'Framtidens skola och digitalt lärande'), desc: bi('', '') },
  { id: 'Autonomous Navigation & Rover Tech', icon: '🤖', title: bi('Autonomous Navigation & Rover Tech', 'Autonom navigering och rovrar'), desc: bi('', '') },
  { id: 'Civic Accessibility & Healthcare', icon: '♿', title: bi('Civic Accessibility & Healthcare', 'Tillgänglighet och hälsa'), desc: bi('', '') },
];
