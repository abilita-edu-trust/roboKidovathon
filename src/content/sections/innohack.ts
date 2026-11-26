// Future InnoHack (vfi.iniac.se and indiskbarnklubb.se): the programme with its two tracks, Kid InnoHack and Young
// InnoHack. One source for the home page's Find Your Path box, the programme section's track cards and the register
// page's track step; the Site CMS holds the live copy (journey section, programme "innohack"), these are its defaults.
import { bi, type Bi, type CmsLink } from '../core';
import type { NabcPart, ProgrammeAudience, ProgrammeJourney, ProgrammeTrack, TrackFact, TrackNabc, TrackScheduleItem, TrackSession } from './audienceJourneys';

/** Stored in registrations.intake_details.innohack_track; also the track ids in the CMS. */
export type InnohackTrackId = 'kid' | 'young';
export const INNOHACK_TRACK_IDS: InnohackTrackId[] = ['kid', 'young'];

/** Kid InnoHack: a registration covers one child or a group of up to four (an existing team, or a teacher's pupils). */
export const KID_MAX_CHILDREN = 4;
/** Kid InnoHack places: up to 20 children, formed by the organisers into five teams of four. */
export const KID_PLACES = 20;
export const KID_TEAMS = 5;
export const KID_TEAM_SIZE = 4;

/** Kid InnoHack registration closes at the end of 3 December 2026, Swedish time (the database stops it then too:
 *  fut_inno_innohack_settings.kid_ideas_close_at). Guardians confirm by 5 December 2026 at 10:00. */
export const KID_REGISTRATION_CLOSE_AT = '2026-12-03T23:59:59+01:00';
export const KID_REGISTRATION_CLOSE = { en: '3 December 2026 at 23:59 Swedish time', sv: '3 december 2026 kl. 23.59 svensk tid' };
export const kidRegistrationClosed = (now: number = Date.now()): boolean => now > Date.parse(KID_REGISTRATION_CLOSE_AT);

/** Public ideas (the separate "Submit an idea" activity, Kid and Young) close at the end of 1 December 2026. */
export const IDEAS_CLOSE_AT = '2026-12-01T23:59:59+01:00';
export const IDEAS_CLOSE = { en: '1 December 2026 at 23:59 Swedish time', sv: '1 december 2026 kl. 23.59 svensk tid' };
export const ideasClosed = (now: number = Date.now()): boolean => now > Date.parse(IDEAS_CLOSE_AT);

/** Both Future InnoHack finals (Kid and Young) are at Mälardalen University on 12 December 2026. */
export const FINAL_PLACE = bi('Mälardalen University, Västerås', 'Mälardalens universitet, Västerås');

const link = (en: string, sv: string, href: string): CmsLink => ({ label: bi(en, sv), href });
const NO_LINK: CmsLink = { label: bi(''), href: '' };
const steps = (...rows: [string, string, string, string][]) =>
  rows.map(([title, titleSv, description, descriptionSv]) => ({ title: bi(title, titleSv), description: bi(description, descriptionSv) }));
const row = (date: Bi, activity: Bi, detail: Bi = bi('')): TrackScheduleItem => ({ date, activity, detail });
const WHY = bi('Why participate?', 'Varför delta?');
const FINAL_VENUE = bi('Final at Mälardalen University, Västerås', 'Final på Mälardalens universitet, Västerås');

const audience = (a: Omit<ProgrammeAudience, 'imagePosition' | 'benefitsHeading' | 'image' | 'secondaryCta'> & { secondaryCta?: CmsLink }): ProgrammeAudience => ({
  ...a,
  image: '',
  imagePosition: 'center',
  benefitsHeading: WHY,
  secondaryCta: a.secondaryCta ?? NO_LINK,
});

/** Kid InnoHack's five sessions (keys s1–s5 are stored with each child's availability). */
const session = (key: string, date: [string, string], weekday: [string, string], time: [string, string], place: [string, string], online: boolean,
  title: [string, string], detail: [string, string]): TrackSession => ({
  key, date: bi(...date), weekday: bi(...weekday), time: bi(...time), place: bi(...place), online, title: bi(...title), detail: bi(...detail),
});
const ONLINE: [string, string] = ['Online', 'Digitalt'];
export const KID_SESSIONS: TrackSession[] = [
  session('s1', ['5 December 2026', '5 december 2026'], ['Saturday', 'lördag'], ['11:00–12:00', 'kl. 11.00–12.00'], ['MISV, Västerås', 'MISV, Västerås'], false,
    ['Kickoff', 'Kickoff'],
    ['The challenges are released and the teams are formed. You learn NABC and start to understand your problem.',
      'Utmaningarna presenteras och lagen bildas. Ni lär er NABC och börjar förstå ert problem.']),
  session('s2', ['7 December 2026', '7 december 2026'], ['Monday', 'måndag'], ['17:30–18:30', 'kl. 17.30–18.30'], ONLINE, true,
    ['Checkpoint 1', 'Avstämning 1'],
    ['Understand the problem and what the customer needs.', 'Förstå problemet och vad kunden behöver.']),
  session('s3', ['9 December 2026', '9 december 2026'], ['Wednesday', 'onsdag'], ['17:30–18:30', 'kl. 17.30–18.30'], ONLINE, true,
    ['Checkpoint 2', 'Avstämning 2'],
    ['Show a sketch or a first prototype, the benefits, and what already exists.', 'Visa en skiss eller en första prototyp, nyttan och vad som redan finns.']),
  session('s4', ['11 December 2026', '11 december 2026'], ['Friday', 'fredag'], ['17:30–18:30', 'kl. 17.30–18.30'], ONLINE, true,
    ['Checkpoint 3', 'Avstämning 3'],
    ['Practise your NABC pitch, get feedback from your mentor and get ready for the final.',
      'Öva er NABC-pitch, få återkoppling från er mentor och gör er redo för finalen.']),
  session('s5', ['12 December 2026', '12 december 2026'], ['Saturday', 'lördag'], ['From the morning', 'Från förmiddagen'], ['Mälardalen University (MDU), Västerås', 'Mälardalens universitet (MDU), Västerås'], false,
    ['Grand Finale', 'Stora finalen'],
    ['Finish your prototype and presentation, present your idea, then the closing ceremony and awards.',
      'Gör klart prototypen och presentationen, presentera er idé, och sedan avslutning och prisutdelning.']),
];

/** Young InnoHack's three days (10–12 December 2026): online kickoff, online checkpoints, hybrid finale at MDU. */
export const YOUNG_SESSIONS: TrackSession[] = [
  session('y1', ['10 December 2026', '10 december 2026'], ['Thursday', 'torsdag'], ['17:00–18:30', 'kl. 17.00–18.30'], ONLINE, true,
    ['Online kickoff', 'Digital kickoff'],
    ['Meet the organisers and the themes, and get started with your team.', 'Träffa arrangörerna och temana, och kom igång med ert lag.']),
  session('y2', ['11 December 2026', '11 december 2026'], ['Friday', 'fredag'], ['Flexible', 'Flexibelt'], ONLINE, true,
    ['Online checkpoints', 'Digitala avstämningar'],
    ['Short checkpoints with mentors, and team work at your own pace.', 'Korta avstämningar med mentorer, och lagarbete i egen takt.']),
  session('y3', ['12 December 2026', '12 december 2026'], ['Saturday', 'lördag'], ['09:00–17:00', 'kl. 09.00–17.00'],
    ['Mälardalen University (MDU), Västerås, or online', 'Mälardalens universitet (MDU), Västerås, eller digitalt'], false,
    ['Hybrid finale', 'Hybridfinal'],
    ['Build, pitch to the jury and celebrate: on campus at MDU or online.', 'Bygg, pitcha för juryn och fira: på campus på MDU eller digitalt.']),
];

const nabc = (letter: string, word: [string, string], question: [string, string], example: [string, string]): NabcPart => ({
  letter, word: bi(...word), question: bi(...question), example: bi(...example),
});
/** NABC for children: four questions whose answers become the team's pitch. */
export const KID_NABC: TrackNabc = {
  heading: bi('What is NABC?', 'Vad är NABC?'),
  intro: bi(
    'NABC is a simple way to explain an idea. Your team answers four questions, and together the answers become your pitch.',
    'NABC är ett enkelt sätt att förklara en idé. Laget svarar på fyra frågor, och tillsammans blir svaren er pitch.',
  ),
  exampleLabel: bi('For example', 'Till exempel'),
  parts: [
    nabc('N', ['Need', 'Behov'], ['Who has a problem, and why does it matter?', 'Vem har ett problem, och varför spelar det roll?'],
      ['Many pupils forget their PE kit at home.', 'Många elever glömmer gympakläderna hemma.']),
    nabc('A', ['Approach', 'Lösning'], ['What is your idea for solving it?', 'Vad är er idé för att lösa det?'],
      ['A reminder that pings the evening before PE.', 'En påminnelse som plingar kvällen före idrotten.']),
    nabc('B', ['Benefits', 'Nytta'], ['What gets better, and for whom?', 'Vad blir bättre, och för vem?'],
      ['Nobody misses PE, and teachers save time.', 'Ingen missar idrotten, och lärarna sparar tid.']),
    nabc('C', ['Competition', 'Konkurrens'], ['What already exists, and why is your idea better?', 'Vad finns redan, och varför är er idé bättre?'],
      ['A note on the fridge is easy to miss. Ours comes at the right time.', 'En lapp på kylskåpet är lätt att missa. Vår kommer i rätt tid.']),
  ],
};

const fact = (label: [string, string], value: [string, string]): TrackFact => ({ label: bi(...label), value: bi(...value) });
export const KID_FACTS: TrackFact[] = [
  fact(['Who', 'Vem'], ['Grades 3–9', 'Årskurs 3–9']),
  fact(['Places', 'Platser'], ['Up to 20 children', 'Upp till 20 barn']),
  fact(['Teams', 'Lag'], ['Five teams of four', 'Fem lag med fyra barn']),
  fact(['Cost', 'Kostnad'], ['Free', 'Gratis']),
  fact(['Register by', 'Anmäl senast'], ['3 December 2026', '3 december 2026']),
];
export const KID_SESSIONS_HEADING = bi('The programme', 'Programmet');

/** A track's programme layout: what the Site CMS holds, or Kid InnoHack's built-in programme when a track saved before
 *  these fields existed has them blank. Other tracks without sessions get none (they keep the steps layout). */
export function trackProgramme(t: ProgrammeTrack): { facts: TrackFact[]; sessionsHeading: Bi; sessions: TrackSession[]; nabc: TrackNabc | null } {
  const saved = (Array.isArray(t.sessions) ? t.sessions : []).filter((x) => x && (x.title?.en || x.title?.sv));
  const isKid = t.id === 'kid';
  const sessions = saved.length ? saved : isKid ? KID_SESSIONS : [];
  const facts = (Array.isArray(t.facts) ? t.facts : []).filter((f) => f && (f.value?.en || f.value?.sv));
  const parts = (Array.isArray(t.nabc?.parts) ? t.nabc!.parts : []).filter((p) => p && (p.word?.en || p.word?.sv));
  return {
    facts: facts.length ? facts : isKid ? KID_FACTS : [],
    sessionsHeading: t.sessionsHeading?.en || t.sessionsHeading?.sv ? t.sessionsHeading : KID_SESSIONS_HEADING,
    sessions,
    nabc: parts.length && t.nabc ? t.nabc : isKid ? KID_NABC : null,
  };
}

/** Young InnoHack's steps (shared by its three audiences). */
const YOUNG_STEPS = steps(
  ['Choose how you take part', 'Välj hur du deltar', 'Hybrid (online 10–11 December, at MDU on 12 December) or fully online.', 'Hybrid (digitalt 10–11 december, på MDU 12 december) eller helt digitalt.'],
  ['Join a team', 'Gå med i ett lag', 'Register alone and get allocated to a team, create a team, or join one with its code.', 'Anmäl dig själv och bli placerad i ett lag, skapa ett lag eller gå med i ett med dess kod.'],
  ['Pick two themes', 'Välj två teman', 'AI Apps & Fan Engagement, Smart Systems & Automation, or Circular Battery & Sustainability.', 'AI-appar och publikengagemang, Smarta system och automation, eller Cirkulära batterier och hållbarhet.'],
  ['Kick off and build', 'Kickoff och bygg', 'Online kickoff on 10 December, 17:00–18:30; online checkpoints on 11 December.', 'Digital kickoff 10 december kl. 17.00–18.30; digitala avstämningar 11 december.'],
  ['Pitch at the finale', 'Pitcha på finalen', 'Hybrid finale at MDU on 12 December 2026, 09:00–17:00.', 'Hybridfinal på MDU 12 december 2026 kl. 09.00–17.00.'],
);

/** The two tracks; `register(tab)` is the site's register page on that form. */
export function innohackTracks(register: (tab: string) => string): ProgrammeTrack[] {
  return [
    {
      id: 'kid',
      label: bi('Kid InnoHack'),
      eligibility: bi('Grades 3–9', 'Årskurs 3–9'),
      summary: bi(
        'For grades 3–9. Sign up on your own or with up to three friends. We form five teams of four, each team gets a challenge, and mentors help you build and present your solution. Free, for up to 20 children.',
        'För årskurs 3–9. Anmäl dig själv eller med upp till tre kompisar. Vi bildar fem lag med fyra barn, varje lag får en utmaning, och mentorer hjälper er att bygga och presentera er lösning. Gratis, för upp till 20 barn.',
      ),
      dateLabel: bi('5–12 December 2026', '5–12 december 2026'),
      venue: bi('Start at MISV · Final at Mälardalen University', 'Start på MISV · Final på Mälardalens universitet'),
      highlights: [bi('Grades 3–9', 'Årskurs 3–9'), bi('Five teams of four', 'Fem lag med fyra barn'), bi('Mentors at every checkpoint', 'Mentorer vid varje avstämning'), bi('Free', 'Gratis')],
      image: '',
      imageAlt: bi('Children presenting their idea', 'Barn som presenterar sin idé'),
      registrationOpen: false,
      closedMessage: bi('Registration opens soon', 'Anmälan öppnar snart'),
      audiences: [
        audience({
          id: 'kids',
          icon: 'Lightbulb',
          label: bi('Kid InnoHack'),
          heading: bi('Five sessions, one team, one solution', 'Fem träffar, ett lag, en lösning'),
          description: bi(
            'You don’t need an idea to sign up. The challenges are revealed at the kickoff, and your team solves one of them together.',
            'Du behöver ingen idé för att anmäla dig. Utmaningarna presenteras på kickoffen, och ditt lag löser en av dem tillsammans.',
          ),
          steps: steps(
            ['Kickoff', 'Kickoff', '5 December, 11:00–12:00 at MISV: meet your team, get your challenge and learn NABC.', '5 december kl. 11.00–12.00 på MISV: träffa ditt lag, få er utmaning och lär er NABC.'],
            ['Checkpoint 1', 'Avstämning 1', '7 December, 17:30–18:30 online: understand the problem and what the customer needs.', '7 december kl. 17.30–18.30 digitalt: förstå problemet och vad kunden behöver.'],
            ['Checkpoint 2', 'Avstämning 2', '9 December, 17:30–18:30 online: show a sketch or first prototype, the benefits and what already exists.', '9 december kl. 17.30–18.30 digitalt: visa en skiss eller första prototyp, nyttan och vad som redan finns.'],
            ['Checkpoint 3', 'Avstämning 3', '11 December, 17:30–18:30 online: practise your NABC pitch and get feedback from your mentor.', '11 december kl. 17.30–18.30 digitalt: öva er NABC-pitch och få återkoppling från er mentor.'],
            ['Grand Finale', 'Stora finalen', '12 December from the morning at MDU: finish, present, and celebrate at the closing ceremony and awards.', '12 december från förmiddagen på MDU: gör klart, presentera och fira vid avslutningen och prisutdelningen.'],
          ),
          imageAlt: bi('Children explaining their idea to a mentor', 'Barn som berättar om sin idé för en mentor'),
          benefits: [
            bi('Work in a real team', 'Arbeta i ett riktigt lag'),
            bi('Learn to explain an idea with NABC', 'Lär dig förklara en idé med NABC'),
            bi('Get help from mentors', 'Få hjälp av mentorer'),
            bi('Present at a university', 'Presentera på ett universitet'),
          ],
          cta: link('Register for Kid InnoHack', 'Anmäl dig till Kid InnoHack', register('kid-innohack')),
          secondaryCta: link('Submit an idea', 'Skicka in en idé', register('kid-submit-idea')),
        }),
      ],
      scheduleHeading: bi('Kid InnoHack programme', 'Program för Kid InnoHack'),
      schedule: [
        row(bi('By 3 December 2026', 'Senast 3 december 2026'), bi('Register', 'Anmälan'),
          bi('Closes at 23:59 Swedish time. Each child’s guardian confirms by email by 5 December, 10:00.', 'Stänger kl. 23.59 svensk tid. Varje barns vårdnadshavare bekräftar via e-post senast 5 december kl. 10.00.')),
        row(bi('5 December 2026, 11:00–12:00', '5 december 2026 kl. 11.00–12.00'), bi('Kickoff at MISV', 'Kickoff på MISV'),
          bi('Challenge release, team formation, NABC and understanding the problem.', 'Utmaningarna presenteras, lagen bildas, NABC och att förstå problemet.')),
        row(bi('7 December 2026, 17:30–18:30', '7 december 2026 kl. 17.30–18.30'), bi('Checkpoint 1 (online)', 'Avstämning 1 (digitalt)'),
          bi('Understand the problem and customer needs.', 'Förstå problemet och kundens behov.')),
        row(bi('9 December 2026, 17:30–18:30', '9 december 2026 kl. 17.30–18.30'), bi('Checkpoint 2 (online)', 'Avstämning 2 (digitalt)'),
          bi('Sketch or first prototype, benefits and existing solutions.', 'Skiss eller första prototyp, nytta och befintliga lösningar.')),
        row(bi('11 December 2026, 17:30–18:30', '11 december 2026 kl. 17.30–18.30'), bi('Checkpoint 3 (online)', 'Avstämning 3 (digitalt)'),
          bi('Practise the NABC pitch, mentor feedback, get ready for the final.', 'Öva NABC-pitchen, återkoppling från mentorn, gör er redo för finalen.')),
        row(bi('12 December 2026, from the morning', '12 december 2026 från förmiddagen'), bi('Grand Finale at MDU', 'Stora finalen på MDU'),
          bi('Finish prototypes and presentations, present, closing ceremony and awards.', 'Gör klart prototyper och presentationer, presentera, avslutning och prisutdelning.')),
      ],
      challengesHeading: bi(''),
      challengesNote: bi(''),
      challenges: [],
      facts: KID_FACTS,
      sessionsHeading: KID_SESSIONS_HEADING,
      sessions: KID_SESSIONS,
      nabc: KID_NABC,
    },
    {
      id: 'young',
      label: bi('Young InnoHack'),
      eligibility: bi('Gymnasium, University and Professionals', 'Gymnasium, universitet och yrkesverksamma'),
      summary: bi(
        'Free, 10–12 December 2026: online kickoff and checkpoints, then a hybrid finale at MDU. 50 places on campus and 25 online, up to 15 teams. Register by 7 December 2026.',
        'Gratis, 10–12 december 2026: digital kickoff och avstämningar, sedan hybridfinal på MDU. 50 platser på campus och 25 digitalt, upp till 15 lag. Anmäl dig senast 7 december 2026.',
      ),
      dateLabel: bi('10–12 December 2026', '10–12 december 2026'),
      venue: FINAL_VENUE,
      highlights: [
        bi('Gymnasium, University and Professionals', 'Gymnasium, universitet och yrkesverksamma'),
        bi('50 on campus · 25 online', '50 på campus · 25 digitalt'),
        bi('Up to 15 teams, three themes', 'Upp till 15 lag, tre teman'),
      ],
      image: '',
      imageAlt: bi('Students and professionals working on a challenge', 'Studenter och yrkesverksamma som arbetar med en utmaning'),
      registrationOpen: true,
      closedMessage: bi('Registration opens soon', 'Anmälan öppnar snart'),
      audiences: [
        audience({
          id: 'gymnasium',
          icon: 'Lightbulb',
          label: bi('Gymnasium'),
          heading: bi('Turn ideas into solutions', 'Gör idéer till lösningar'),
          description: bi(
            'Register alone or with your team, pick two themes and build a solution you pitch to mentors and the jury.',
            'Anmäl dig själv eller med ditt lag, välj två teman och bygg en lösning som ni presenterar för mentorer och jury.',
          ),
          steps: YOUNG_STEPS,
          imageAlt: bi('Upper-secondary students brainstorming ideas on sticky notes around a table', 'Gymnasieelever som brainstormar idéer på lappar runt ett bord'),
          benefits: [
            bi('Solve real-world challenges', 'Lös verkliga utmaningar'),
            bi('Gain experience working in teams', 'Få erfarenhet av att arbeta i lag'),
            bi('Present ideas to mentors and judges', 'Presentera idéer för mentorer och jury'),
          ],
          cta: link('Register for Young InnoHack', 'Anmäl dig till Young InnoHack', register('young-innohack')),
        }),
        audience({
          id: 'university',
          icon: 'Code2',
          label: bi('University', 'Universitet'),
          heading: bi('Build and ship a digital solution', 'Bygg och lansera en digital lösning'),
          description: bi(
            'Code, design and prototype an app or service for one of three themes, together with mentors from industry.',
            'Koda, designa och ta fram en prototyp av en app eller tjänst inom ett av tre teman, tillsammans med mentorer från näringslivet.',
          ),
          steps: YOUNG_STEPS,
          imageAlt: bi('University students coding and prototyping an app together on laptops', 'Universitetsstudenter som kodar och tar fram en app tillsammans på sina datorer'),
          benefits: [
            bi('Develop practical portfolio projects', 'Ta fram praktiska portfolioprojekt'),
            bi('Collaborate with companies and mentors', 'Samarbeta med företag och mentorer'),
            bi('Build and demonstrate innovative solutions', 'Bygg och visa innovativa lösningar'),
          ],
          cta: link('Register as a university team', 'Anmäl ett universitetslag', register('young-innohack')),
        }),
        audience({
          id: 'professionals',
          icon: 'Handshake',
          label: bi('Professionals', 'Yrkesverksamma'),
          heading: bi('Take part or mentor', 'Delta eller bli mentor'),
          description: bi(
            'Join a team and work on one of three themes yourself, or share your expertise as a mentor for the teams.',
            'Gå med i ett lag och arbeta med ett av tre teman själv, eller dela med dig av din kunskap som mentor för lagen.',
          ),
          steps: [...steps(['Choose your role', 'Välj din roll', 'Take part in a team, or mentor the teams.', 'Delta i ett lag, eller bli mentor för lagen.']), ...YOUNG_STEPS.slice(1)],
          imageAlt: bi('An industry mentor giving feedback to a student team during a pitch', 'En mentor från näringslivet som ger återkoppling till ett studentlag under en pitch'),
          benefits: [
            bi('Apply your expertise to real challenges', 'Använd din kunskap på verkliga utmaningar'),
            bi('Mentor emerging talent', 'Var mentor för morgondagens talanger'),
            bi('Discover new ideas and collaboration opportunities', 'Upptäck nya idéer och samarbeten'),
          ],
          cta: link('Participate in Young InnoHack', 'Delta i Young InnoHack', register('young-innohack')),
          secondaryCta: link('Become a Mentor', 'Bli mentor', register('mentor')),
        }),
      ],
      scheduleHeading: bi('Young InnoHack programme', 'Program för Young InnoHack'),
      schedule: [
        row(bi('By 7 December 2026', 'Senast 7 december 2026'), bi('Register', 'Anmälan'), bi('Free. Choose hybrid or fully online, two themes and how you join a team.', 'Gratis. Välj hybrid eller helt digitalt, två teman och hur du går med i ett lag.')),
        row(bi('10 December 2026, 17:00–18:30', '10 december 2026 kl. 17.00–18.30'), bi('Online kickoff', 'Digital kickoff'), bi('Meet the themes, the mentors and your team.', 'Träffa temana, mentorerna och ert lag.')),
        row(bi('11 December 2026', '11 december 2026'), bi('Online checkpoints', 'Digitala avstämningar'), bi('Checkpoints with mentors and flexible team development.', 'Avstämningar med mentorer och flexibelt lagarbete.')),
        row(bi('12 December 2026, 09:00–17:00', '12 december 2026 kl. 09.00–17.00'), bi('Hybrid finale at MDU', 'Hybridfinal på MDU'), bi('On campus at Mälardalen University, Västerås, or online: build, pitch and awards.', 'På campus på Mälardalens universitet i Västerås, eller digitalt: bygg, pitcha och prisutdelning.')),
      ],
      challengesHeading: bi('Three innovation themes', 'Tre innovationsteman'),
      challengesNote: bi(
        'AI Apps & Fan Engagement · Smart Systems & Automation · Circular Battery & Sustainability. You choose two when you register; detailed problem statements come at the kickoff.',
        'AI-appar och publikengagemang · Smarta system och automation · Cirkulära batterier och hållbarhet. Du väljer två när du anmäler dig; detaljerade problem presenteras på kickoffen.',
      ),
      // One hidden, empty challenge: the Site CMS's template for adding the six real ones once they are confirmed.
      challenges: [{ visible: false, company: '', logo: '', title: bi(''), problem: bi('') }],
    },
  ];
}

/** The Future InnoHack box of Find Your Path. */
export function futureInnohackProgramme(register: (tab: string) => string): ProgrammeJourney {
  return {
    id: 'innohack',
    title: bi('Future InnoHack'),
    subtitle: bi('Two tracks. One opportunity to turn ideas into solutions.', 'Två spår. En möjlighet att göra idéer till lösningar.'),
    dateLabel: bi('5–12 December 2026', '5–12 december 2026'),
    accent: 'yellow',
    audiences: [],
    tracks: innohackTracks(register),
  };
}
