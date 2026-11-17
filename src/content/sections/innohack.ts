// Future InnoHack (vfi.iniac.se and indiskbarnklubb.se): the programme with its two tracks, Kid InnoHack and Young
// InnoHack. One source for the home page's Find Your Path box, the programme section's track cards and the register
// page's track step; the Site CMS holds the live copy (journey section, programme "innohack"), these are its defaults.
import { bi, type Bi, type CmsLink } from '../core';
import type { ProgrammeAudience, ProgrammeJourney, ProgrammeTrack, TrackScheduleItem } from './audienceJourneys';

/** Stored in registrations.intake_details.innohack_track; also the track ids in the CMS. */
export type InnohackTrackId = 'kid' | 'young';
export const INNOHACK_TRACK_IDS: InnohackTrackId[] = ['kid', 'young'];

/** Kid InnoHack: ideas from one child or a team of up to four. */
export const KID_MAX_CHILDREN = 4;

const link = (en: string, sv: string, href: string): CmsLink => ({ label: bi(en, sv), href });
const NO_LINK: CmsLink = { label: bi(''), href: '' };
const steps = (...rows: [string, string, string, string][]) =>
  rows.map(([title, titleSv, description, descriptionSv]) => ({ title: bi(title, titleSv), description: bi(description, descriptionSv) }));
const row = (date: Bi, activity: Bi, detail: Bi = bi('')): TrackScheduleItem => ({ date, activity, detail });
const WHY = bi('Why participate?', 'Varför delta?');
const FINAL_VENUE = bi('Final at Växhuset, Västerås', 'Final på Växhuset, Västerås');

const audience = (a: Omit<ProgrammeAudience, 'imagePosition' | 'benefitsHeading' | 'image' | 'secondaryCta'> & { secondaryCta?: CmsLink }): ProgrammeAudience => ({
  ...a,
  image: '',
  imagePosition: 'center',
  benefitsHeading: WHY,
  secondaryCta: a.secondaryCta ?? NO_LINK,
});

/** The two tracks; `register(tab)` is the site's register page on that form. */
export function innohackTracks(register: (tab: string) => string): ProgrammeTrack[] {
  return [
    {
      id: 'kid',
      label: bi('Kid InnoHack'),
      eligibility: bi('Grades 3–9', 'Årskurs 3–9'),
      summary: bi(
        'Bring your own problem statement. Children in grades 3–9 submit an idea that solves a problem in school, society, the environment, technology or everyday life, on their own or in a team of up to four. Five ideas are selected for a week of guided mentoring and the final presentations.',
        'Ta med ditt eget problem. Barn i årskurs 3–9 skickar in en idé som löser ett problem i skolan, samhället, miljön, tekniken eller vardagen, ensamma eller i ett lag med upp till fyra. Fem idéer väljs ut till en vecka med handledning och slutpresentationerna.',
      ),
      dateLabel: bi('5–12 December 2026', '5–12 december 2026'),
      venue: FINAL_VENUE,
      highlights: [bi('Grades 3–9', 'Årskurs 3–9'), bi('Bring your own idea', 'Ta med din egen idé'), bi('Five ideas selected', 'Fem idéer väljs ut'), bi('Guided mentoring', 'Handledning av mentorer')],
      image: '',
      imageAlt: bi('Children presenting their idea', 'Barn som presenterar sin idé'),
      registrationOpen: false,
      closedMessage: bi('Idea submissions open soon', 'Idéinlämningen öppnar snart'),
      audiences: [
        audience({
          id: 'kids',
          icon: 'Lightbulb',
          label: bi('Kid InnoHack'),
          heading: bi('Turn a problem you see into an idea', 'Gör ett problem du ser till en idé'),
          description: bi(
            'No prototype needed. Start with a problem you care about and describe how you would solve it.',
            'Ingen prototyp behövs. Börja med ett problem du bryr dig om och beskriv hur du skulle lösa det.',
          ),
          steps: steps(
            ['Spot a problem', 'Hitta ett problem', 'In school, society, the environment, technology or everyday life.', 'I skolan, samhället, miljön, tekniken eller vardagen.'],
            ['Submit your idea', 'Skicka in din idé', 'On your own or as a team of up to four, by 4 December 2026. Each child’s guardian confirms by email.', 'Ensam eller i ett lag med upp till fyra, senast 4 december 2026. Varje barns vårdnadshavare bekräftar via e-post.'],
            ['Five ideas selected', 'Fem idéer väljs ut', 'Five ideas are chosen on 5 December 2026.', 'Fem idéer väljs ut den 5 december 2026.'],
            ['Guided mentoring', 'Handledning', 'One hour a day, 6–11 December 2026: need, approach, benefits, customer, validation and pitch.', 'En timme om dagen, 6–11 december 2026: behov, lösning, nytta, kund, validering och pitch.'],
            ['Present at the final', 'Presentera på finalen', 'Present your idea at Växhuset, Västerås on 12 December 2026.', 'Presentera er idé på Växhuset i Västerås den 12 december 2026.'],
          ),
          imageAlt: bi('Children explaining their idea to a mentor', 'Barn som berättar om sin idé för en mentor'),
          benefits: [
            bi('Turn your own idea into a solution', 'Gör din egen idé till en lösning'),
            bi('Learn to explain and pitch an idea', 'Lär dig förklara och pitcha en idé'),
            bi('Get guidance from mentors', 'Få stöd av mentorer'),
          ],
          cta: link('Submit an idea', 'Skicka in en idé', register('kid-innohack')),
        }),
      ],
      scheduleHeading: bi('Kid InnoHack timeline', 'Tidslinje för Kid InnoHack'),
      schedule: [
        row(bi('By 4 December 2026', 'Senast 4 december 2026'), bi('Submit ideas', 'Skicka in idéer'),
          bi('Closes at 23:59 Swedish time. Each child’s guardian confirms by email.', 'Stänger kl. 23.59 svensk tid. Varje barns vårdnadshavare bekräftar via e-post.')),
        row(bi('5 December 2026', '5 december 2026'), bi('Five ideas selected', 'Fem idéer väljs ut')),
        row(bi('6–11 December 2026', '6–11 december 2026'), bi('Daily mentoring', 'Daglig handledning'),
          bi('One hour a day: Need, Approach, Benefits, Customer, Validation, Pitch. Session times to be confirmed.', 'En timme om dagen: behov, lösning, nytta, kund, validering, pitch. Tider meddelas senare.')),
        row(bi('12 December 2026', '12 december 2026'), bi('Final presentations', 'Slutpresentationer'), bi('Växhuset, Västerås', 'Växhuset, Västerås')),
      ],
      challengesHeading: bi(''),
      challengesNote: bi(''),
      challenges: [],
    },
    {
      id: 'young',
      label: bi('Young InnoHack'),
      eligibility: bi('Gymnasium, University and Professionals', 'Gymnasium, universitet och yrkesverksamma'),
      summary: bi(
        'Six companies bring six real-world problem statements. Register on your own or as a team, choose a challenge and build a solution with mentors. Professionals can take part or mentor the teams.',
        'Sex företag kommer med sex verkliga problem. Anmäl dig själv eller som lag, välj en utmaning och bygg en lösning med stöd av mentorer. Yrkesverksamma kan delta eller vara mentorer för lagen.',
      ),
      dateLabel: bi('10–12 December 2026', '10–12 december 2026'),
      venue: FINAL_VENUE,
      highlights: [
        bi('Gymnasium, University and Professionals', 'Gymnasium, universitet och yrkesverksamma'),
        bi('Six company problem statements', 'Sex problem från företag'),
        bi('Team-based innovation challenge', 'Innovationsutmaning i lag'),
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
            'Form a team, pick a real-world challenge and develop a solution you pitch to mentors and judges.',
            'Bilda ett lag, välj en verklig utmaning och utveckla en lösning som ni presenterar för mentorer och jury.',
          ),
          steps: steps(
            ['Form your team', 'Bilda ert lag', 'Team up with classmates, or join alone and meet new teammates.', 'Gå ihop med klasskompisar, eller kom själv och träffa nya lagkamrater.'],
            ['Choose a challenge', 'Välj en utmaning', 'Pick one of six company challenges, revealed at the online kickoff on 10 December 2026.', 'Välj en av sex utmaningar från företag, som presenteras på den digitala kickoffen den 10 december 2026.'],
            ['Brainstorm and plan', 'Brainstorma och planera', 'Explore the problem and plan your solution remotely on 11 December 2026.', 'Utforska problemet och planera er lösning på distans den 11 december 2026.'],
            ['Build a prototype', 'Bygg en prototyp', 'Develop your idea with help from mentors.', 'Utveckla idén med stöd från mentorer.'],
            ['Pitch to the judges', 'Pitcha för juryn', 'Present your solution at Växhuset on 12 December 2026.', 'Presentera er lösning på Växhuset den 12 december 2026.'],
          ),
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
            'Code, design and prototype an app or service for a real challenge, together with mentors from industry.',
            'Koda, designa och ta fram en prototyp av en app eller tjänst för en verklig utmaning, tillsammans med mentorer från näringslivet.',
          ),
          steps: steps(
            ['Register your team', 'Anmäl ert lag', 'Sign up as a team or on your own.', 'Anmäl er som lag eller på egen hand.'],
            ['Pick a challenge', 'Välj en utmaning', 'Choose one of six problems set by companies, revealed on 10 December 2026.', 'Välj ett av sex problem från företag, som presenteras den 10 december 2026.'],
            ['Design the solution', 'Designa lösningen', 'Map users, needs and the features that matter most.', 'Kartlägg användare, behov och de viktigaste funktionerna.'],
            ['Code a prototype', 'Koda en prototyp', 'Build a working demo with feedback from mentors.', 'Bygg en fungerande demo med återkoppling från mentorer.'],
            ['Demo and pitch', 'Demo och pitch', 'Show your prototype to the jury at Växhuset on 12 December 2026.', 'Visa er prototyp för juryn på Växhuset den 12 december 2026.'],
          ),
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
            'Join a team and take on a company challenge yourself, or share your expertise as a mentor for the teams.',
            'Gå med i ett lag och anta en utmaning själv, eller dela med dig av din kunskap som mentor för lagen.',
          ),
          steps: steps(
            ['Choose your role', 'Välj din roll', 'Take part in a team, or mentor the teams.', 'Delta i ett lag, eller bli mentor för lagen.'],
            ['Join the kickoff', 'Var med på kickoffen', 'Meet the teams and hear the six challenges online on the evening of 10 December 2026.', 'Träffa lagen och hör de sex utmaningarna digitalt på kvällen den 10 december 2026.'],
            ['Prepare remotely', 'Förbered på distans', 'Research and plan on 11 December 2026.', 'Research och planering den 11 december 2026.'],
            ['Build or coach', 'Bygg eller coacha', 'Develop a solution, or help teams sharpen theirs.', 'Utveckla en lösning, eller hjälp lagen att vässa sina.'],
            ['Final day', 'Finaldagen', 'Present or coach at Växhuset on 12 December 2026.', 'Presentera eller coacha på Växhuset den 12 december 2026.'],
          ),
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
      scheduleHeading: bi('Young InnoHack timeline', 'Tidslinje för Young InnoHack'),
      schedule: [
        row(bi('10 December 2026, evening', '10 december 2026, kväll'), bi('Online kickoff', 'Digital kickoff'), bi('Challenge reveal and team formation.', 'Utmaningarna presenteras och lagen bildas.')),
        row(bi('11 December 2026', '11 december 2026'), bi('Remote preparation', 'Förberedelser på distans'), bi('Research and plan with your team.', 'Research och planering med laget.')),
        row(bi('12 December 2026', '12 december 2026'), bi('In-person hackathon', 'Hackathon på plats'), bi('Hackathon and presentations at Växhuset, Västerås.', 'Hackathon och presentationer på Växhuset i Västerås.')),
      ],
      challengesHeading: bi('Company challenges', 'Utmaningar från företag'),
      challengesNote: bi(
        'Six companies will each bring a real problem statement. The challenges are revealed at the online kickoff on 10 December 2026.',
        'Sex företag kommer med var sitt verkligt problem. Utmaningarna presenteras på den digitala kickoffen den 10 december 2026.',
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
