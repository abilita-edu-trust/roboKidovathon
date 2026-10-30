// Riga Future Innovators (riga.iniac.se): the VFI site for Riga, with RoboKidovation and the
// Young Inno Hack, ideas & voting. The RoboKidovation final is on 6 February 2027 at the International
// School of Riga (ISR); the Young Inno Hack on 12–13 February 2027 is tentative (dates to be confirmed).
// No fees or payment details yet.
import type { SiteConfig } from '../../context/SiteContext';
import { pathForRoute } from '../../lib/routes';

const NAME = 'Riga Future Innovators';

/** Same text in both languages. */
const same = (text: string) => ({ en: text, sv: text });

export const rigaSite: SiteConfig = {
  location: { countrySlug: 'latvia', citySlug: 'riga', countryName: 'Latvia', cityName: 'Riga' },
  cityName: 'Riga',
  hackLabel: 'Young Inno Hack',
  finalsLabel: 'the Riga Finals',
  organiser: `${NAME} / INIAC`,
  ideasPath: pathForRoute('riga-ideas'),
  ideasFilter: { only: { countrySlug: 'latvia', citySlug: 'riga' } },
  meetUsCity: 'Riga',

  nav: {
    brand: 'RIGA FUTURE INNOVATORS',
    brandChip: '2027',
    homeRoute: 'riga',
    registerRoute: 'riga-register',
    darkRoutes: ['riga'],
    links: [
      { id: 'riga', label: { en: 'Home', sv: 'Hem' } },
      { id: 'riga#journey-robokidovation', label: same('RoboKidovation') },
      { id: 'riga#journey-innohack', label: same('Young InnoHack') },
      { id: 'riga#choose-experience', label: { en: 'Events', sv: 'Evenemang' } },
      { id: 'riga-register', label: { en: 'Register', sv: 'Registrering' } },
      { id: 'riga#contact-us', label: { en: 'Contact', sv: 'Kontakt' } },
    ],
    registerLabel: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
    registerShort: { en: 'REGISTER', sv: 'REGISTRERA' },
    season: { en: 'Riga, Latvia · 2026–27 Season', sv: 'Riga, Lettland · Säsongen 2026–27' },
  },

  hero: {
    badge: { en: 'RIGA, LATVIA · FEBRUARY 2027', sv: 'RIGA, LETTLAND · FEBRUARI 2027' },
    lines: [same('Young Future'), same('Innovators.')],
    intro: {
      en: 'Two events. One mission. Inspiring the next generation of builders, creators and innovators.',
      sv: 'Två evenemang. Ett uppdrag. Vi inspirerar nästa generation byggare, skapare och innovatörer.',
    },
    events: [
      {
        date: { en: '06 FEBRUARY', sv: '06 FEBRUARI' },
        title: same('RoboKidovation'),
        kind: { en: 'Robotics Competition', sv: 'Robottävling' },
        audience: { en: 'Grades 3–9', sv: 'Årskurs 3–9' },
        target: 'riga-register',
        tab: 'competition',
      },
      {
        date: { en: '12–13 FEBRUARY\nDATES TO BE CONFIRMED', sv: '12–13 FEBRUARI\nDATUM BEKRÄFTAS SENARE' },
        title: same('Young Future InnoHack'),
        kind: { en: 'Innovation Hackathon', sv: 'Innovationshackathon' },
        audience: { en: 'Students and young innovators', sv: 'Elever och unga innovatörer' },
        target: 'riga-register',
        tab: 'hackathon',
      },
    ],
    primary: { label: { en: 'Explore Both Programmes', sv: 'Utforska båda programmen' }, target: 'riga#choose-experience' },
    secondary: { label: same('EXPLORE EVENTS'), target: 'riga#choose-experience' },
    facts: [
      { label: 'GRADES', value: '1–9 + GYM' },
      { label: 'PROGRAMME', value: '20H STEM' },
      { label: 'ARENA', value: '244 × 122 CM' },
      { label: 'FINAL DATE', value: 'FEB 6, 2027' },
    ],
  },

  // No banner until there is Riga artwork (the Västerås one has the city in the image).
  banner: '',
  journey: {
    finals: 'on 6 Feb 2027 in Riga',
    audienceJourneys: true,
    dates: [
      { label: 'School qualifiers', value: '12–25 Nov 2026' },
      { label: 'RoboKidovation', value: '6 Feb 2027 (International School of Riga)' },
      { label: 'Young Inno Hack', value: '12–13 Feb 2027 (dates and venue to be confirmed)' },
    ],
  },

  footer: {
    title: 'RIGA FUTURE INNOVATORS 2027',
    description: same(
      'Hands-on STEM programme and robotics competition for schools, associations and independent teams in Riga. Hosted by INIAC and SkillSkolan, with Blix as technology and kit partner.'
    ),
    location: 'RIGA, LATVIA',
    audience: 'GRADES 1–9 & GYMNASIUM',
    programmeTitle: same('PROGRAMME'),
    programmeLinks: [
      { id: 'riga', label: { en: 'Home', sv: 'Hem' } },
      { id: 'riga#journey-robokidovation', label: same('RoboKidovation') },
      { id: 'riga#journey-innohack', label: same('Young InnoHack') },
      { id: 'riga#teams-final-day', label: { en: 'Categories & final day', sv: 'Kategorier och finaldag' } },
      { id: 'riga-ideas', label: { en: 'Ideas & Vote', sv: 'Idéer och röstning' } },
      { id: 'riga-register', label: { en: 'Register', sv: 'Registrering' } },
    ],
    orgTitle: same('ORGANIZATION & CONTACT'),
    orgLinks: [{ id: 'riga#contact-us', label: { en: 'Contact us', sv: 'Kontakta oss' } }],
    email: 'contact@iniac.se',
    orgLines: ['INIAC', 'Riga, Latvia'],
    registerText: {
      en: 'Registration is open for schools, associations and independent teams ahead of the 12–25 November qualifiers and the 6 February 2027 Final.',
      sv: 'Anmälan är öppen för skolor, föreningar och fristående lag inför kvalet 12–25 november och finalen 6 februari 2027.',
    },
    register: { label: same('REGISTER SCHOOL, ASSOCIATION OR TEAM'), target: 'riga-register' },
    copyright: '© 2026 RIGA FUTURE INNOVATORS · INIAC',
    // City admins sign in on the iniac.se dashboard.
    adminHref: 'https://iniac.se/auth',
  },

  volunteerCta: {
    eyebrow: { en: 'VOLUNTEERS // RIGA 2027', sv: 'VOLONTÄRER // RIGA 2027' },
    title: { en: `Volunteer with ${NAME}`, sv: `Bli volontär hos ${NAME}` },
    body: {
      en: 'Help us run robotics finals, hackathons and school events across Riga. Pick your role, your time and the events you want to support.',
      sv: 'Hjälp oss att genomföra robotikfinaler, hackathons och skolevenemang i Riga. Välj din roll, din tid och de evenemang du vill stötta.',
    },
    button: { en: 'REGISTER AS A VOLUNTEER', sv: 'ANMÄL DIG SOM VOLONTÄR' },
  },

  intake: {
    eyebrow: 'OFFICIAL PROGRAM INTAKE // RIGA 2027',
    programmes: [
      {
        id: 'robo',
        title: same('RoboKidovation'),
        subtitle: { en: 'School robotics · Grades 1–9 & GYM', sv: 'Skolrobotik · åk 1–9 och gymnasiet' },
        date: { en: '6 February 2027', sv: '6 februari 2027' },
        venue: same('International School of Riga (ISR)'),
        image: '/register/robokidovation.jpg',
      },
      {
        id: 'hack',
        title: same('Young Inno Hack'),
        subtitle: { en: 'Ideas and squads · Grade 7 to university', sv: 'Idéer och lag · åk 7 till universitet' },
        date: { en: '12–13 February 2027 · dates to be confirmed', sv: '12–13 februari 2027 · datum bekräftas senare' },
        venue: { en: 'Riga · venue to be confirmed', sv: 'Riga · lokal meddelas senare' },
        image: '/register/hackathon.jpg',
      },
      {
        id: 'community',
        title: { en: 'Join the Innovation Community', sv: 'Gå med i innovationsgemenskapen' },
        subtitle: { en: 'Volunteer, mentor, partner or stay connected.', sv: 'Bli volontär, mentor eller partner, eller håll kontakten.' },
      },
    ],
    associationContact: 'the organisers',
    // The VFI fees and payment details belong to Västerås.
    showFees: false,
    volunteer: {
      eventOptions: [{ value: 'riga-future-innovators', en: `${NAME} events`, sv: `${NAME} evenemang` }],
      eyebrow: { en: 'OPTION 5 // VOLUNTEER', sv: 'ALTERNATIV 5 // VOLONTÄR' },
      intro: {
        en: `Help us run ${NAME} events. All fields are required.`,
        sv: `Hjälp oss att genomföra ${NAME} evenemang. Alla fält är obligatoriska.`,
      },
      teamName: NAME,
    },
  },
};
