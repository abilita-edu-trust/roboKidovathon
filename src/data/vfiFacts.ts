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
