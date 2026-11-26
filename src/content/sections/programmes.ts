// Programme cards: vfi's two cards with venues, followed by the registration wizard ("experience"), and a
// city's banner with its programme card ("programme").
import type { LucideIcon } from 'lucide-react';
import type { SiteConfig } from '../../context/SiteContext';
import type { CitySite } from '../../components/city/citySites';
import { bi, type Bi, type CmsLink } from '../core';
import { iconName } from '../icons';
import { targetToHref } from './frame';
import { hasBuildAndPlay, robokidoCategoryCards, type CategoryCard } from './robokido';

export interface PathwayStepData {
  icon: string;
  title: Bi;
  subtitle: Bi;
  /** Empty = no date pill. */
  date: Bi;
  highlight: boolean;
  /** "step" (the default), "break" (a pause such as a holiday), "milestone" (a highlighted date such as a
   *  restart) or "tentative" (a step whose date is not confirmed yet). Breaks and milestones are not numbered. */
  stepType?: string;
}

export type StepKind = 'step' | 'break' | 'milestone' | 'tentative';

export const stepKind = (stepType: string | undefined): StepKind =>
  stepType === 'break' || stepType === 'milestone' || stepType === 'tentative' ? stepType : 'step';

/** Each row's step number; breaks and milestones get none. */
export const stepNumbers = (steps: { stepType?: string }[]): (number | null)[] => {
  let n = 0;
  return steps.map((s) => {
    const kind = stepKind(s.stepType);
    return kind === 'break' || kind === 'milestone' ? null : ++n;
  });
};

/** A programme card. `theme`: "robo" (blue) or "hack" (green). The note may mark **bold** parts. */
export interface PathwayData {
  theme: string;
  icon: string;
  title: Bi;
  tagline: Bi;
  /** First line in full colour, the rest a little dimmer. */
  intro: Bi[];
  steps: PathwayStepData[];
  callout: Bi;
  cta: CmsLink;
  /** The Register button beside the CTA (two cards side by side); without a label it opens the programme's form. */
  register?: CmsLink;
}

/** The registration form for a card's programme (RoboKidovation's competition entry or the hackathon squad) on a site's register page. */
export const registerLink = (theme: string, registerRoute = 'register'): CmsLink => ({
  label: bi('REGISTER', 'ANMÄL DIG'),
  href: targetToHref(registerRoute, theme === 'hack' ? 'hackathon' : 'competition'),
});

/** A programme card as the city data builds it, one per language. */
export interface PathwaySource {
  theme: 'robo' | 'hack';
  icon: LucideIcon;
  title: string;
  tagline: string;
  intro: string[];
  steps: { title: string; subtitle: string; date?: string; icon: LucideIcon; highlight?: boolean }[];
  callout: string;
  ctaLabel: string;
}

/** Joins the English and Swedish versions of a card into one bilingual card. */
export function pathwayFromSources(en: PathwaySource, sv: PathwaySource, href: string): PathwayData {
  return {
    theme: en.theme,
    icon: iconName(en.icon),
    title: bi(en.title, sv.title),
    tagline: bi(en.tagline, sv.tagline),
    intro: en.intro.map((line, i) => bi(line, sv.intro[i])),
    steps: en.steps.map((s, i) => ({
      icon: iconName(s.icon),
      title: bi(s.title, sv.steps[i]?.title),
      subtitle: bi(s.subtitle, sv.steps[i]?.subtitle),
      date: bi(s.date ?? '', sv.steps[i]?.date ?? ''),
      highlight: Boolean(s.highlight),
    })),
    callout: bi(en.callout, sv.callout),
    cta: { label: bi(en.ctaLabel, sv.ctaLabel), href },
  };
}

export interface VenueData {
  label: Bi;
  name: Bi;
  detail: Bi;
  image: string;
  /** "robo" (blue) or "hack" (green). */
  theme: string;
}

export interface ExperienceData {
  banner: string;
  /** The RoboKidovation box's rows (vfi and IBK): one per category, each linking to its section with the poster. */
  categoriesLabel: Bi;
  categories: CategoryCard[];
  /** The two programme boxes' footers (vfi and IBK): the final day and its venue, and the RoboKidovation link. */
  finalLabel: Bi;
  roboFinal: { date: Bi; venue: Bi; cta: CmsLink };
  hackFinal: { date: Bi; venue: Bi };
  /** Future InnoHack's track panels (vfi and IBK): an icon and one short line per track of Find Your Path. */
  trackPanels: { id: string; icon: string; description: Bi }[];
  cards: PathwayData[];
  venues: VenueData[];
  noImage: Bi;
  stripLeft: Bi;
  stripMiddle: Bi;
  stripRight: Bi;
}

const st = (icon: string, title: string, subtitle: string, date: string, highlight = false): PathwayStepData => ({
  icon,
  title: bi(title),
  subtitle: bi(subtitle),
  date: bi(date),
  highlight,
});

/**
 * Future InnoHack's card in the programme section (vfi and IBK): a short introduction; the Kid and Young track cards
 * under it come from Find Your Path's tracks, so the detailed steps are not repeated here.
 */
export const futureInnohackCard = (c: SiteConfig): PathwayData => ({
  theme: 'hack',
  icon: 'Lightbulb',
  title: bi('Future InnoHack'),
  tagline: bi('IDEAS TODAY. A BRIGHTER TOMORROW.', 'IDÉER I DAG. EN LJUSARE MORGONDAG.'),
  intro: [
    bi('An innovation programme with two tracks.', 'Ett innovationsprogram med två spår.'),
    bi('Kid InnoHack: grades 3–9 in five teams of four, 5–12 December.', 'Kid InnoHack: årskurs 3–9 i fem lag med fyra barn, 5–12 december.'),
    bi('Young InnoHack: gymnasium, university and professionals, three themes, hybrid or online, 10–12 December.', 'Young InnoHack: gymnasium, universitet och yrkesverksamma, tre teman, hybrid eller digitalt, 10–12 december.'),
  ],
  steps: [],
  callout: bi(
    'Free participation. Final presentations for both tracks on **12 December 2026** at Mälardalen University, Västerås.',
    'Gratis deltagande. Slutpresentationer för båda spåren den **12 december 2026** på Mälardalens universitet i Västerås.',
  ),
  cta: { label: bi('SEE THE STEPS', 'SE STEGEN'), href: targetToHref(`${c.nav.homeRoute}#journey-innohack`) },
  register: { label: bi('REGISTER', 'ANMÄL DIG'), href: targetToHref(c.nav.registerRoute, 'hackathon') },
});

/** The venues with Future InnoHack: MISV, then Young InnoHack's online kickoff and the shared final at Mälardalen University. */
const FUTURE_INNOHACK_VENUES: VenueData[] = [
  { label: bi('Future InnoHack Final Venue', 'Finalplats för Future InnoHack'), name: bi('Mälardalen University', 'Mälardalens universitet'), detail: bi('Västerås · 12 December 2026', 'Västerås · 12 december 2026'), image: '', theme: 'hack' },
  { label: bi('Young InnoHack Kickoff', 'Kickoff för Young InnoHack'), name: bi('Online', 'Digitalt'), detail: bi('10 December 2026, 17:00–18:30', '10 december 2026 kl. 17.00–18.30'), image: '', theme: 'hack' },
];

export const experienceDefaults = (c: SiteConfig): ExperienceData => {
  const base = baseExperience(c);
  if (!c.journey?.futureInnohack) return base;
  return {
    ...base,
    cards: [base.cards[0], futureInnohackCard(c)],
    venues: [base.venues[0], ...FUTURE_INNOHACK_VENUES],
    stripRight: bi('VÄSTERÅS | 5–12 DECEMBER 2026'),
  };
};

const baseExperience = (c: SiteConfig): ExperienceData => ({
  banner: c.banner ?? '',
  categoriesLabel: bi('RoboKidovation categories', 'RoboKidovations kategorier'),
  categories: robokidoCategoryCards(c),
  finalLabel: bi('Final day', 'Finaldag'),
  roboFinal: {
    date: bi('5 December 2026', '5 december 2026'),
    venue: bi('MISV, Västerås'),
    cta: { label: bi('Categories and rules', 'Kategorier och regler'), href: targetToHref(`${c.nav.homeRoute}#teams-final-day`) },
  },
  hackFinal: { date: bi('12 December 2026', '12 december 2026'), venue: bi('Mälardalen University, Västerås', 'Mälardalens universitet, Västerås') },
  trackPanels: [
    { id: 'kid', icon: 'Users', description: bi('Your own idea for a problem you care about.', 'Din egen idé om ett problem du bryr dig om.') },
    { id: 'young', icon: 'GraduationCap', description: bi('Solve one of six company challenges, alone or in a team.', 'Lös en av sex utmaningar från företag, själv eller i lag.') },
  ],
  cards: [
    {
      theme: 'robo',
      icon: 'Bot',
      title: bi('RoboKidovation'),
      tagline: bi('LEARN. TEST. IMPROVE. COMPETE.'),
      intro: [
        bi('Hands-on robotics challenge for teams from schools and associations.'),
        bi('No previous experience needed.'),
        hasBuildAndPlay(c)
          ? bi(
              'Build & Play: preschool–grade 2, with a parent, free · Junior: grades 3–6 · Senior: grades 7–9.',
              'Build & Play: förskola–åk 2, med en förälder, gratis · Junior: åk 3–6 · Senior: åk 7–9.',
            )
          : bi('Junior: grades 3–6 · Senior: grades 7–9 · GYM: programmable bot.'),
      ],
      steps: [
        st('Presentation', 'School Demo', 'See the robots, try simple challenges', '1–14 October 2026'),
        st('Cpu', 'Hands-On Workshop', 'Learn and build with real robots', '15–28 October 2026'),
        st('Users', 'Team Formation', 'Form teams and start practising', '29 October – 11 November 2026'),
        st('Award', 'School Qualification', 'Internal challenge to select best teams', '12–25 November 2026'),
        st('Wrench', 'Final Preparation', 'Practise and get final-ready', '26 November – 4 December 2026'),
        st('Trophy', 'Västerås Future Innovators Final', 'Compete, showcase & celebrate innovation', '5 December 2026', true),
      ],
      callout: bi(
        'From school workshops and internal competitions, up to **4 teams** from each participating school or association qualify for the Västerås RoboKidovation Final on **5 December 2026**.'
      ),
      cta: { label: bi('EXPLORE TRACK'), href: targetToHref('challenges') },
      register: registerLink('robo'),
    },
    {
      theme: 'hack',
      icon: 'Lightbulb',
      title: bi('Young Inno Hack'),
      tagline: bi('IDEAS TODAY. A BRIGHTER TOMORROW.'),
      intro: [
        bi('An innovation challenge solving real-world problems.'),
        bi('Develop a concept and pitch to the jury.'),
        bi('Basic: grades 7–9 · Medium: gymnasiet · Advanced: university students.'),
      ],
      steps: [
        st('Compass', 'Listen', 'Collect ideas from schools', '1–20 November 2026'),
        st('Search', 'Select', 'Identify key challenges', '20–25 November 2026'),
        st('UserPlus', 'Connect', 'Form mixed teams with mentors', '25–30 November 2026'),
        st('Layers', 'Build', 'Turn ideas into a prototype', '1–7 December 2026'),
        st('LineChart', 'Prepare Pitch', 'Refine your solution and pitch', '11 December 2026'),
        st('Rocket', 'Demonstrate', 'Present to the jury and win', '12 December 2026', true),
      ],
      callout: bi(
        'Students work on real-world challenges around science, technology, sustainability and innovation. The final presentations take place on **11–12 December 2026**.'
      ),
      cta: { label: bi('EXPLORE TRACK'), href: targetToHref('workflow') },
      register: registerLink('hack'),
    },
  ],
  venues: [
    { label: bi('RoboKidovation Final Venue'), name: bi('MISV'), detail: bi('Mälardalen International School Västerås'), image: '/venue.png', theme: 'robo' },
    { label: bi('Young Inno Hack Opening AW'), name: bi('TBD'), detail: bi('Opening After Work · venue to be announced'), image: '', theme: 'hack' },
    { label: bi('Young Inno Hack Final Venue'), name: bi('TBC'), detail: bi('Venue to be confirmed'), image: '', theme: 'hack' },
  ],
  noImage: bi('Image coming soon'),
  stripLeft: bi('// VÄSTERÅS FUTURE INNOVATORS 2026'),
  stripMiddle: bi('Students Today. A Brighter Tomorrow.'),
  stripRight: bi('VÄSTERÅS | 5 & 11–12 DECEMBER 2026'),
});

export interface ProgrammeData {
  banner: string;
  card: PathwayData;
}

export const programmeDefaults = (c: SiteConfig, city?: CitySite): ProgrammeData | null => {
  const pathway = city?.pathway;
  if (!pathway) return null;
  return {
    banner: c.banner ?? '',
    card: pathwayFromSources(pathway.content(false), pathway.content(true), targetToHref(pathway.target)),
  };
};
