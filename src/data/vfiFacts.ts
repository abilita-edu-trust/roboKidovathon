// Single source of truth for the confirmed Västerås Future Innovators 2026 rules,
// dates and venues. Update here first, then any copy that repeats these facts.

type Bilingual = { en: string; sv: string };

export const VFI_FACTS = {
  finalDate: { en: '5 December 2026', sv: '5 december 2026' } as Bilingual,
  /** Only MISV is confirmed. Do not list other venues until they confirm. */
  roboFinalVenue: {
    short: 'MISV',
    full: 'Mälardalen International School Västerås (MISV)',
  },
  hackVenue: { en: 'Venue to be confirmed', sv: 'Plats meddelas senare' } as Bilingual,
  qualifiers: { en: '12–25 November 2026', sv: '12–25 november 2026' } as Bilingual,
  qualificationRule: {
    en: 'Up to 4 teams from each participating school or association qualify for the Final.',
    sv: 'Upp till 4 lag från varje deltagande skola eller förening går vidare till finalen.',
  } as Bilingual,
};

export const VFI_TIMELINE: { en: string; sv: string; date: Bilingual }[] = [
  { en: 'School demos', sv: 'Skoldemos', date: { en: '1–14 Oct', sv: '1–14 okt' } },
  { en: 'Hands-on workshops', sv: 'Praktiska workshoppar', date: { en: '15–28 Oct', sv: '15–28 okt' } },
  { en: 'Team formation', sv: 'Lagbildning', date: { en: '29 Oct – 11 Nov', sv: '29 okt – 11 nov' } },
  { en: 'School qualifiers', sv: 'Skolkval', date: { en: '12–25 Nov', sv: '12–25 nov' } },
  { en: 'Final preparation', sv: 'Finalförberedelser', date: { en: '26 Nov – 4 Dec', sv: '26 nov – 4 dec' } },
  { en: 'Final', sv: 'Final', date: { en: '5 Dec', sv: '5 dec' } },
];

/** RoboKidovation categories. Grades 1–2 join as participants, not as a competition category. */
export const ROBOKIDO_CATEGORIES: {
  name: string;
  level: Bilingual;
  grades: Bilingual;
  focus: Bilingual;
  coding: Bilingual;
}[] = [
  {
    name: 'RoboKido Junior',
    level: { en: 'Basic', sv: 'Grundnivå' },
    grades: { en: 'Grades 3–6', sv: 'Årskurs 3–6' },
    focus: { en: 'Building, motors, joystick/control, teamwork', sv: 'Bygga, motorer, joystick/styrning, lagarbete' },
    coding: { en: 'Not required', sv: 'Krävs inte' },
  },
  {
    name: 'RoboKido Senior',
    level: { en: 'Advanced', sv: 'Avancerad' },
    grades: { en: 'Grades 7–9', sv: 'Årskurs 7–9' },
    focus: {
      en: 'Sensors, mechanisms, problem-solving, basic automation',
      sv: 'Sensorer, mekanismer, problemlösning, enkel automation',
    },
    coding: { en: 'Intro/basic coding', sv: 'Introduktion/grundläggande programmering' },
  },
  {
    name: 'RoboKido GYM',
    level: { en: 'Programmable bot', sv: 'Programmerbar robot' },
    grades: { en: 'Gymnasium', sv: 'Gymnasiet' },
    focus: { en: 'Programmable/autonomous robot', sv: 'Programmerbar/autonom robot' },
    coding: { en: 'Required', sv: 'Krävs' },
  },
];

export const PARTICIPANT_CATEGORY = {
  grades: { en: 'Grades 1–2', sv: 'Årskurs 1–2' } as Bilingual,
  name: { en: 'Participant category · no competition', sv: 'Deltagarkategori · ingen tävling' } as Bilingual,
};

/** Young Inno Hack levels. */
export const HACKATHON_LEVELS: { level: Bilingual; who: Bilingual }[] = [
  { level: { en: 'Basic level', sv: 'Grundnivå' }, who: { en: 'Grades 7–9', sv: 'Årskurs 7–9' } },
  { level: { en: 'Medium level', sv: 'Mellannivå' }, who: { en: 'Gymnasiet students', sv: 'Gymnasieelever' } },
  { level: { en: 'Advanced level', sv: 'Avancerad nivå' }, who: { en: 'University students', sv: 'Universitetsstudenter' } },
];

/** Grade options shared by the registration forms (stored value, shown label). */
export const GRADE_GROUP_OPTIONS: string[] = [
  'Årskurs 1–2 (Participant category · not competing · Ages 7–8)',
  'Årskurs 3–6 (RoboKido Junior · Ages 9–12)',
  'Årskurs 7–9 (RoboKido Senior / Hackathon Basic · Ages 13–15)',
  'Gymnasiet (RoboKido GYM / Hackathon Medium · Ages 16–18)',
  'University students (Hackathon Advanced)',
  'Mixed ages / Blandade åldrar',
];

/** Participation fees, per kid. */
export const PARTICIPATION_FEES: { who: Bilingual; fee: Bilingual; note?: Bilingual }[] = [
  {
    who: { en: 'Schools, associations and independent teams', sv: 'Skolor, föreningar och fristående lag' },
    fee: { en: '200 SEK / kid', sv: '200 kr / barn' },
  },
  {
    who: { en: 'IBK member kids', sv: 'Barn som är medlemmar i IBK' },
    fee: { en: '100 SEK / kid', sv: '100 kr / barn' },
    note: { en: '50% discount', sv: '50 % rabatt' },
  },
  {
    who: { en: 'MISV students', sv: 'Elever på MISV' },
    fee: { en: 'Free', sv: 'Gratis' },
    note: { en: '100% discount', sv: '100 % rabatt' },
  },
];

export const PAYMENT = {
  bankgiro: '118-7566',
  payee: 'Indisk Barnklubb',
  reference: { en: 'Robokidovation2026 - Your full name', sv: 'Robokidovation2026 - Ditt fullständiga namn' } as Bilingual,
};

/** Team rules for RoboKidovation, shown in order. */
export const TEAM_RULES: Bilingual[] = [
  { en: 'Each team should have 4–5 participants.', sv: 'Varje lag bör ha 4–5 deltagare.' },
  {
    en: 'Students can register either as a full team or as an individual participant. Individual registrations will be grouped with other participants by the organizers.',
    sv: 'Elever kan anmäla sig som ett helt lag eller som enskild deltagare. Enskilda anmälningar placeras i lag med andra deltagare av arrangörerna.',
  },
  {
    en: 'Teams will be formed during the first workshop in the first week of November.',
    sv: 'Lagen bildas under den första workshoppen i första veckan i november.',
  },
  {
    en: 'Where possible, teams should be balanced by age/grade level, experience and gender. Students from different schools can be placed in the same team if needed.',
    sv: 'Om möjligt ska lagen vara balanserade efter ålder/årskurs, erfarenhet och kön. Elever från olika skolor kan placeras i samma lag vid behov.',
  },
  {
    en: 'Every team should choose a team name and assign simple rotating roles such as builder, controller, programmer, designer/tester and presenter.',
    sv: 'Varje lag väljer ett lagnamn och fördelar enkla roterande roller som byggare, förare, programmerare, designer/testare och presentatör.',
  },
  {
    en: 'One student should not do all the technical work. Team members should be encouraged to rotate roles during workshops.',
    sv: 'En elev ska inte göra allt tekniskt arbete. Lagmedlemmarna uppmuntras att rotera roller under workshopparna.',
  },
  {
    en: 'For Junior teams, coding experience is not required. For higher categories, previous coding experience is also not mandatory; introductory support will be provided.',
    sv: 'För Junior-lag krävs ingen programmeringserfarenhet. Inte heller i de högre kategorierna krävs tidigare erfarenhet; introducerande stöd ges.',
  },
  {
    en: 'Teams should attend the scheduled preparation workshops to remain eligible for the final challenge.',
    sv: 'Lagen ska delta i de schemalagda förberedande workshopparna för att få delta i finalutmaningen.',
  },
  {
    en: 'If someone drops out, the organizers may move or add participants to keep teams at a workable size.',
    sv: 'Om någon hoppar av kan arrangörerna flytta eller lägga till deltagare så att lagen behåller en fungerande storlek.',
  },
  {
    en: 'Final team composition should normally be fixed after the first or second workshop, so students have enough time to work together before the competition.',
    sv: 'Lagets slutliga sammansättning bör normalt vara klar efter första eller andra workshoppen, så att eleverna hinner arbeta tillsammans före tävlingen.',
  },
];

/** Preparation workshop skill path per category. Workshops never reveal the final problem. */
export const WORKSHOP_PATHS: { category: string; steps: Bilingual[] }[] = [
  {
    category: 'Junior',
    steps: [
      { en: 'Motor control', sv: 'Motorstyrning' },
      { en: 'chassis/building', sv: 'chassi/bygge' },
      { en: 'joystick', sv: 'joystick' },
      { en: 'testing', sv: 'testning' },
      { en: 'simple obstacle tasks', sv: 'enkla hinderuppgifter' },
    ],
  },
  {
    category: 'Senior',
    steps: [
      { en: 'Motors', sv: 'Motorer' },
      { en: 'sensors', sv: 'sensorer' },
      { en: 'basic ESP32 logic', sv: 'grundläggande ESP32-logik' },
      { en: 'testing', sv: 'testning' },
      { en: 'simple autonomous functions', sv: 'enkla autonoma funktioner' },
    ],
  },
  {
    category: 'GYM',
    steps: [
      { en: 'ESP32 programming', sv: 'ESP32-programmering' },
      { en: 'sensors', sv: 'sensorer' },
      { en: 'motor control', sv: 'motorstyrning' },
      { en: 'line/maze concepts', sv: 'linje-/labyrintkoncept' },
      { en: 'debugging and autonomous robot development', sv: 'felsökning och utveckling av autonom robot' },
    ],
  },
];

/** Final-day format: 3 hours from check-in to submission. `minutes` sizes the timeline bar. */
export const FINAL_DAY_STEPS: { time: Bilingual; label: Bilingual; minutes: number }[] = [
  {
    time: { en: 'Check-in', sv: 'Incheckning' },
    label: {
      en: 'Teams check in → kits are handed over → official problem statement announced',
      sv: 'Lagen checkar in → kit delas ut → den officiella uppgiften presenteras',
    },
    minutes: 0,
  },
  { time: { en: '15 min', sv: '15 min' }, label: { en: 'Read the rules + team planning', sv: 'Läs reglerna + planering i laget' }, minutes: 15 },
  { time: { en: '2 h', sv: '2 h' }, label: { en: 'Design, build, code and test', sv: 'Designa, bygg, programmera och testa' }, minutes: 120 },
  { time: { en: '30 min', sv: '30 min' }, label: { en: 'Final testing / inspection', sv: 'Sluttestning / inspektion' }, minutes: 30 },
  {
    time: { en: '15 min', sv: '15 min' },
    label: { en: 'Robot submitted to the competition area', sv: 'Roboten lämnas in till tävlingsområdet' },
    minutes: 15,
  },
];
