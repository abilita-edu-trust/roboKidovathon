// Eskilstuna Future Innovators (esk.iniac.se): the VFI site, RoboKidovation only, with
// ideas & voting. Dates and venue are not confirmed yet; fill them in here when they are.
import type { SiteConfig } from '../../context/SiteContext';
import type { CityDetail } from '../../components/city/CitySections';
import { pathForRoute } from '../../lib/routes';

const NAME = 'Eskilstuna Future Innovators';

export const ESKILSTUNA_META = {
  title: 'Eskilstuna Future Innovators 2026',
  description:
    'Eskilstuna Future Innovators 2026 — hands-on RoboKidovation robotics for schools, associations and independent teams in Eskilstuna.',
};

// Confirmed event details:
// - Registration opening: 12 October 2026
// - School demo: 16 October 2026
// - Finals: 2 December 2026, IES Eskilstuna
// - International-level opportunity: April 2027 (flight ticket possibility for 1-2 teams, subject to official rules)
export const ESKILSTUNA_DETAILS: CityDetail[] = [
  {
    label: { en: 'Key Dates', sv: 'Viktiga datum' },
    value: {
      en: 'Registration opens: 12 Oct 2026 · School Demo: 16 Oct 2026 · Finals: 2 Dec 2026',
      sv: 'Anmälan öppnar: 12 okt 2026 · Skoldemo: 16 okt 2026 · Final: 2 dec 2026',
    },
  },
  {
    label: { en: 'Venue', sv: 'Plats' },
    value: {
      en: 'IES Eskilstuna (Internationella Engelska Skolan Eskilstuna)',
      sv: 'IES Eskilstuna (Internationella Engelska Skolan Eskilstuna)',
    },
  },
  { label: { en: 'Programme', sv: 'Program' }, value: { en: 'RoboKidovation STEM Robotics', sv: 'RoboKidovation STEM-robotik' } },
  { label: { en: 'Categories', sv: 'Kategorier' }, value: { en: 'Junior (Gr 3–6) · Senior (Gr 7–9) · GYM', sv: 'Junior (åk 3–6) · Senior (åk 7–9) · GYM' } },
  { label: { en: 'Who can join', sv: 'Vem kan delta' }, value: { en: 'Grades 1–9 & Gymnasium (Grades 1–2 as participants)', sv: 'Årskurs 1–9 och gymnasiet (åk 1–2 som deltagare)' } },
  {
    label: { en: 'International Stage', sv: 'Internationellt steg' },
    value: {
      en: 'April 2027 — Possibility of flight tickets for 1–2 winning teams (subject to official rules & confirmation)',
      sv: 'April 2027 — Möjlighet till flygbiljetter för 1–2 vinnande lag (villkorat officiella regler och bekräftelse)',
    },
  },
];

export const eskilstunaSite: SiteConfig = {
  location: { countrySlug: 'sweden', citySlug: 'eskilstuna', countryName: 'Sweden', cityName: 'Eskilstuna' },
  cityName: 'Eskilstuna',
  hackLabel: 'Future Innovators',
  finalsLabel: NAME,
  organiser: `${NAME} / INIAC`,
  ideasPath: pathForRoute('esk-ideas'),
  ideasFilter: { only: { countrySlug: 'sweden', citySlug: 'eskilstuna' } },

  nav: {
    brand: 'ESKILSTUNA FUTURE INNOVATORS',
    brandChip: '2026',
    homeRoute: 'esk',
    registerRoute: 'esk-register',
    darkRoutes: ['esk'],
    links: [
      { id: 'esk', label: { en: 'Home', sv: 'Hem' } },
      { id: 'esk#teams-final-day', label: { en: 'RoboKidovation', sv: 'RoboKidovation' } },
      { id: 'esk-ideas', label: { en: 'Ideas & Vote', sv: 'Idéer och röstning' } },
      { id: 'esk-register', label: { en: 'Register', sv: 'Registrering' } },
      { id: 'esk#details', label: { en: 'Details', sv: 'Praktisk info' } },
      { id: 'esk#site-footer', label: { en: 'Contact', sv: 'Kontakt' } },
    ],
    registerLabel: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
    registerShort: { en: 'REGISTER', sv: 'REGISTRERA' },
    season: { en: 'Eskilstuna, Sweden · 2026 Season', sv: 'Eskilstuna, Sverige · Säsong 2026' },
  },

  hero: {
    badge: 'FINALS: 2 DEC 2026 · IES ESKILSTUNA, SWEDEN',
    lines: [
      { en: 'Build ideas.', sv: 'Bygg idéer.' },
      { en: 'Test them.', sv: 'Testa dem.' },
      { en: 'Take them further.', sv: 'Ta dem vidare.' },
    ],
    intro: {
      en: 'Eskilstuna Future Innovators — hands-on STEM robotics with RoboKidovation, for schools, associations and independent teams — RoboKido Junior, Senior and GYM, and grades 1–2 as participants.',
      sv: 'Eskilstuna Future Innovators — praktisk STEM-robotik med RoboKidovation, för skolor, föreningar och fristående lag — RoboKido Junior, Senior och GYM, och årskurs 1–2 som deltagare.',
    },
    primary: {
      label: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
      target: 'esk-register',
    },
    secondary: { label: { en: 'EXPLORE ROBOKIDOVATION', sv: 'UTFORSKA ROBOKIDOVATION' }, target: 'esk#teams-final-day' },
    facts: [
      { label: 'REG OPENS', value: '12 OCT 2026' },
      { label: 'SCHOOL DEMO', value: '16 OCT 2026' },
      { label: 'FINALS DATE', value: '2 DEC 2026' },
      { label: 'VENUE', value: 'IES ESKILSTUNA' },
      { label: 'NEXT STAGE', value: 'APRIL 2027' },
      { label: 'FLIGHT TICKETS', value: 'TOP 1–2 TEAMS*' },
    ],
  },

  banner: '/esk.jpeg',

  footer: {
    title: 'ESKILSTUNA FUTURE INNOVATORS 2026',
    description: {
      en: 'Hands-on STEM programme and RoboKidovation robotics competition for schools, associations and independent teams in Eskilstuna.',
      sv: 'Praktiskt STEM-program och RoboKidovation-robotiktävling för skolor, föreningar och fristående lag i Eskilstuna.',
    },
    location: 'ESKILSTUNA, SWEDEN',
    audience: 'GRADES 1–9 & GYMNASIUM',
    programmeTitle: { en: 'PROGRAMME', sv: 'PROGRAM' },
    programmeLinks: [
      { id: 'esk', label: { en: 'Home', sv: 'Hem' } },
      { id: 'esk#teams-final-day', label: { en: 'RoboKidovation', sv: 'RoboKidovation' } },
      { id: 'esk#details', label: { en: 'Event details', sv: 'Praktisk info' } },
      { id: 'esk-ideas', label: { en: 'Ideas & Vote', sv: 'Idéer och röstning' } },
      { id: 'esk-register', label: { en: 'Register', sv: 'Registrering' } },
    ],
    orgTitle: { en: 'ORGANIZATION & CONTACT', sv: 'ORGANISATION OCH KONTAKT' },
    orgLinks: [{ id: 'esk#join', label: { en: 'Ways to take part', sv: 'Sätt att vara med' } }],
    email: 'contact@robokidovation.se',
    orgLines: ['INIAC', 'Eskilstuna, Sweden'],
    registerText: {
      en: 'Registration is open for schools, associations and independent teams in Eskilstuna. Dates will be announced.',
      sv: 'Anmälan är öppen för skolor, föreningar och fristående lag i Eskilstuna. Datum meddelas senare.',
    },
    register: {
      label: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
      target: 'esk-register',
    },
    copyright: '© 2026 ESKILSTUNA FUTURE INNOVATORS · INIAC',
    // City admins sign in on the iniac.se dashboard.
    adminHref: 'https://iniac.se/auth',
  },

  volunteerCta: {
    eyebrow: { en: 'VOLUNTEERS // ESKILSTUNA 2026', sv: 'VOLONTÄRER // ESKILSTUNA 2026' },
    title: { en: `Volunteer with ${NAME}`, sv: `Bli volontär hos ${NAME}` },
    body: {
      en: 'Help us run robotics workshops, demos and the RoboKidovation final in Eskilstuna. Pick your role, your time and the events you want to support.',
      sv: 'Hjälp oss att genomföra robotikworkshoppar, demos och RoboKidovation-finalen i Eskilstuna. Välj din roll, din tid och de evenemang du vill stötta.',
    },
    button: { en: 'REGISTER AS A VOLUNTEER', sv: 'ANMÄL DIG SOM VOLONTÄR' },
  },

  intake: {
    eyebrow: 'OFFICIAL PROGRAM INTAKE // ESKILSTUNA 2026',
    // RoboKidovation forms plus ideas and volunteering; no hackathon.
    tabs: ['workshop', 'demo', 'association', 'submit-idea', 'volunteer'],
    defaultTab: 'workshop',
    squadTitle: 'Hackathon Squad',
    ideasTrackDesc:
      'Share your idea for a better school, city or future as text, a drawing, a voice note or a video, then let the public vote.',
    hackathonDesc: '',
    volunteerDesc: `Help run ${NAME} events as a volunteer`,
    associationContact: 'the organisers',
    // The VFI fees and payment details belong to Västerås.
    showFees: false,
    volunteer: {
      eventOptions: [
        { value: 'eskilstuna-future-innovators', en: `${NAME} events`, sv: `${NAME} evenemang` },
      ],
      eyebrow: { en: 'OPTION 5 // VOLUNTEER', sv: 'ALTERNATIV 5 // VOLONTÄR' },
      intro: {
        en: `Help us run ${NAME} events. All fields are required.`,
        sv: `Hjälp oss att genomföra ${NAME} evenemang. Alla fält är obligatoriska.`,
      },
      teamName: NAME,
    },
  },
};
