// Riga Future Innovators (riga.iniac.se): the VFI site for Riga, with RoboKidovation and the
// Young Inno Hack, ideas & voting, in English and Latvian. The RoboKidovation final is on 6 February 2027
// at the International School of Riga (ISR); the Young Inno Hack on 12–13 February 2027 is tentative
// (dates to be confirmed). No fees or payment details yet.
import type { SiteConfig } from '../../context/SiteContext';
import { pathForRoute } from '../../lib/routes';

const NAME = 'Riga Future Innovators';

/** A text in English and Latvian (the site has no Swedish, so the Swedish slot repeats the English). */
const enLv = (en: string, lv: string) => ({ en, sv: en, lv });
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
  secondLanguage: 'lv',

  nav: {
    brand: 'RIGA FUTURE INNOVATORS',
    brandChip: '2027',
    homeRoute: 'riga',
    registerRoute: 'riga-register',
    darkRoutes: ['riga'],
    links: [
      { id: 'riga', label: enLv('Home', 'Sākums') },
      { id: 'riga#journey-robokidovation', label: same('RoboKidovation') },
      { id: 'riga#journey-innohack', label: same('Young InnoHack') },
      { id: 'riga#choose-experience', label: enLv('Events', 'Pasākumi') },
      { id: 'riga-register', label: enLv('Register', 'Reģistrācija') },
      { id: 'riga#contact-us', label: enLv('Contact', 'Kontakti') },
    ],
    registerLabel: enLv('REGISTER SCHOOL, ASSOCIATION OR TEAM', 'REĢISTRĒT SKOLU, BIEDRĪBU VAI KOMANDU'),
    registerShort: enLv('REGISTER', 'REĢISTRĒTIES'),
    season: enLv('Riga, Latvia · 2026–27 Season', 'Rīga, Latvija · 2026.–2027. gada sezona'),
  },

  hero: {
    badge: enLv('RIGA, LATVIA · FEBRUARY 2027', 'RĪGA, LATVIJA · 2027. GADA FEBRUĀRIS'),
    lines: [enLv('Young Future', 'Jaunie nākotnes'), enLv('Innovators.', 'inovatori.')],
    intro: enLv(
      'Two events. One mission. Inspiring the next generation of builders, creators and innovators.',
      'Divi pasākumi. Viena misija. Iedvesmojam nākamo konstruktoru, radītāju un inovatoru paaudzi.'
    ),
    events: [
      {
        date: enLv('6 FEBRUARY', '6. FEBRUĀRIS'),
        title: same('RoboKidovation'),
        kind: enLv('Robotics Competition', 'Robotikas sacensības'),
        audience: enLv('Grades 3–9', '3.–9. klase'),
        target: 'riga-register',
        tab: 'competition',
      },
      {
        date: enLv('12–13 FEBRUARY\nDATES TO BE CONFIRMED', '12.–13. FEBRUĀRIS\nDATUMI TIKS PRECIZĒTI'),
        title: same('Young Future InnoHack'),
        kind: enLv('Innovation Hackathon', 'Inovāciju hakatons'),
        audience: enLv('Students and young innovators', 'Skolēni un jaunie inovatori'),
        target: 'riga-register',
        tab: 'hackathon',
      },
    ],
    primary: { label: enLv('Explore Both Programmes', 'Iepazīsti abas programmas'), target: 'riga#choose-experience' },
    secondary: { label: enLv('EXPLORE EVENTS', 'IEPAZĪT PASĀKUMUS'), target: 'riga#choose-experience' },
    facts: [
      { label: 'GRADES', value: '1–9 + GYM' },
      { label: 'ROBOTICS TRAINING', value: '20H STEM' },
      { label: 'ARENA', value: '244 × 122 CM' },
      { label: 'FINAL DATE', value: '6 FEBRUARY 2027' },
    ],
  },

  // No banner until there is Riga artwork (the Västerås one has the city in the image).
  banner: '',
  journey: {
    finals: 'on 6 February 2027 in Riga',
    audienceJourneys: true,
    dates: [
      { label: 'Your path', value: 'Try → Learn → Practise → Represent your school' },
      { label: 'RoboKidovation', value: '6 February 2027 (International School of Riga)' },
      { label: 'Young Inno Hack', value: '12–13 February 2027 (dates and venue to be confirmed)' },
    ],
  },

  footer: {
    title: 'RIGA FUTURE INNOVATORS 2027',
    description: enLv(
      'Hands-on STEM programme and robotics competition for schools, associations and independent teams in Riga. Hosted by INIAC and SkillSkolan, with Blix as technology and kit partner.',
      'Praktiska STEM programma un robotikas sacensības Rīgas skolām, biedrībām un neatkarīgām komandām. Rīko INIAC un SkillSkolan, tehnoloģiju un komplektu partneris – Blix.'
    ),
    location: 'RIGA, LATVIA',
    audience: 'GRADES 1–9 & GYMNASIUM',
    programmeTitle: enLv('PROGRAMME', 'PROGRAMMA'),
    programmeLinks: [
      { id: 'riga', label: enLv('Home', 'Sākums') },
      { id: 'riga#journey-robokidovation', label: same('RoboKidovation') },
      { id: 'riga#journey-innohack', label: same('Young InnoHack') },
      { id: 'riga#teams-final-day', label: enLv('Categories & final day', 'Kategorijas un fināla diena') },
      { id: 'riga-ideas', label: enLv('Ideas & Vote', 'Idejas un balsošana') },
      { id: 'riga-register', label: enLv('Register', 'Reģistrācija') },
    ],
    orgTitle: enLv('ORGANIZATION & CONTACT', 'ORGANIZĀCIJA UN KONTAKTI'),
    orgLinks: [{ id: 'riga#contact-us', label: enLv('Contact us', 'Sazinies ar mums') }],
    email: 'contact@iniac.se',
    orgLines: ['INIAC', 'Riga, Latvia'],
    registerText: enLv(
      'Registration is open for schools, associations and independent teams ahead of the 6 February 2027 Final.',
      'Reģistrācija ir atvērta skolām, biedrībām un neatkarīgām komandām – fināls notiks 2027. gada 6. februārī.'
    ),
    register: { label: enLv('REGISTER SCHOOL, ASSOCIATION OR TEAM', 'REĢISTRĒT SKOLU, BIEDRĪBU VAI KOMANDU'), target: 'riga-register' },
    copyright: '© 2026 RIGA FUTURE INNOVATORS · INIAC',
    // City admins sign in on the iniac.se dashboard.
    adminHref: 'https://iniac.se/auth',
  },

  volunteerCta: {
    eyebrow: enLv('VOLUNTEERS // RIGA 2027', 'BRĪVPRĀTĪGIE // RĪGA 2027'),
    title: enLv(`Volunteer with ${NAME}`, `Kļūsti par ${NAME} brīvprātīgo`),
    body: enLv(
      'Help us run robotics finals, hackathons and school events across Riga. Pick your role, your time and the events you want to support.',
      'Palīdzi mums rīkot robotikas finālus, hakatonus un skolu pasākumus visā Rīgā. Izvēlies savu lomu, laiku un pasākumus, kurus vēlies atbalstīt.'
    ),
    button: enLv('REGISTER AS A VOLUNTEER', 'PIETEIKTIES KĀ BRĪVPRĀTĪGAJAM'),
  },

  intake: {
    eyebrow: 'OFFICIAL PROGRAM INTAKE // RIGA 2027',
    programmes: [
      {
        id: 'robo',
        title: same('RoboKidovation'),
        subtitle: enLv('School robotics · Grades 1–9 & GYM', 'Skolu robotika · 1.–9. klase un ģimnāzija'),
        date: enLv('6 February 2027', '2027. gada 6. februāris'),
        venue: same('International School of Riga (ISR)'),
        image: '/register/robokidovation.jpg',
      },
      {
        id: 'hack',
        title: same('Young Inno Hack'),
        subtitle: enLv('Ideas and squads · Grade 7 to university', 'Idejas un komandas · no 7. klases līdz augstskolai'),
        date: enLv('12–13 February 2027 · dates to be confirmed', '2027. gada 12.–13. februāris · datumi tiks precizēti'),
        venue: enLv('Riga · venue to be confirmed', 'Rīga · norises vieta tiks precizēta'),
        image: '/register/hackathon.jpg',
      },
      {
        id: 'community',
        title: enLv('Join the Innovation Community', 'Pievienojies inovāciju kopienai'),
        subtitle: enLv('Volunteer, mentor, partner or stay connected.', 'Kļūsti par brīvprātīgo, mentoru vai partneri vai vienkārši paliec saziņā.'),
      },
    ],
    associationContact: 'the organisers',
    // The VFI fees and payment details belong to Västerås.
    showFees: false,
    volunteer: {
      eventOptions: [{ value: 'riga-future-innovators', en: `${NAME} events`, sv: `${NAME} events`, lv: `${NAME} pasākumi` }],
      eyebrow: enLv('OPTION 5 // VOLUNTEER', '5. IESPĒJA // BRĪVPRĀTĪGAIS'),
      intro: enLv(`Help us run ${NAME} events. All fields are required.`, `Palīdzi mums rīkot ${NAME} pasākumus. Visi lauki ir obligāti.`),
      teamName: NAME,
    },
  },
};
