// Programme cards: vfi's two cards with venues, followed by the registration wizard ("experience"), and a
// city's banner with its programme card ("programme").
import type { LucideIcon } from 'lucide-react';
import type { SiteConfig } from '../../context/SiteContext';
import type { CitySite } from '../../components/city/citySites';
import { bi, type Bi, type CmsLink } from '../core';
import { iconName } from '../icons';
import { targetToHref } from './frame';

export interface PathwayStepData {
  icon: string;
  title: Bi;
  subtitle: Bi;
  /** Empty = no date pill. */
  date: Bi;
  highlight: boolean;
}

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

export const experienceDefaults = (c: SiteConfig): ExperienceData => ({
  banner: c.banner ?? '',
  cards: [
    {
      theme: 'robo',
      icon: 'Bot',
      title: bi('RoboKidovation'),
      tagline: bi('LEARN. TEST. IMPROVE. COMPETE.'),
      intro: [
        bi('Hands-on robotics challenge for teams from schools and associations.'),
        bi('No previous experience needed.'),
        bi('Junior: grades 3–6 · Senior: grades 7–9 · GYM: programmable bot.'),
      ],
      steps: [
        st('Presentation', 'School Demo', 'See the robots, try simple challenges', '1 – 14 October 2026'),
        st('Cpu', 'Hands-On Workshop', 'Learn and build with real robots', '15 – 28 October 2026'),
        st('Users', 'Team Formation', 'Form teams and start practising', '29 October – 11 November 2026'),
        st('Award', 'School Qualification', 'Internal challenge to select best teams', '12 – 25 November 2026'),
        st('Wrench', 'Final Preparation', 'Practise and get final-ready', '26 November – 3 December 2026'),
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
        bi('A one-day innovation challenge solving real-world problems.'),
        bi('Develop a concept and pitch to the jury.'),
        bi('Basic: grades 7–9 · Medium: gymnasiet · Advanced: university students.'),
      ],
      steps: [
        st('Compass', 'Listen', 'Collect ideas from schools', '1 – 14 October 2026'),
        st('Search', 'Select', 'Identify key challenges', '15 – 28 October 2026'),
        st('UserPlus', 'Connect', 'Form mixed teams with mentors', '29 October – 11 November 2026'),
        st('Layers', 'Build', 'Turn ideas into a prototype', '12 – 25 November 2026'),
        st('LineChart', 'Prepare Pitch', 'Refine your solution and pitch', '26 November – 3 December 2026'),
        st('Rocket', 'Demonstrate', 'Present to the jury and win', '4–5 December 2026', true),
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
