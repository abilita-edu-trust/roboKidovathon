// RoboKidovation's three categories on vfi and IBK (SiteConfig.intake.buildAndPlay): Build & Play (preschool to grade 2,
// including children younger than förskoleklass: a free parent-and-child activity on 5 December 2026 at MISV, with no
// competition, scoring, judging, rankings or prizes), Junior Robo Sprint (grades 3–6) and
// Senior Robo Sprint (grades 7–9), each with its promotional poster. Build & Play replaces the GYM category there;
// other sites keep their categories.
// The RoboKidovation programme box shows a row per category ("experience".categories), each linking to the
// category's detailed section with its full poster and rules ("teams".posters).
import type { SiteConfig } from '../../context/SiteContext';
import { ROBOKIDO_CATEGORIES } from '../../data/vfiFacts';
import { bi, type Bi, type CmsLink } from '../core';
import { biOf, targetToHref } from './frame';

export type RobokidoCategoryId = 'build-play' | 'junior' | 'senior';
export const ROBOKIDO_CATEGORY_IDS: RobokidoCategoryId[] = ['build-play', 'junior', 'senior'];

/** The page anchor of a category's detailed section. */
export const robokidoAnchor = (id: string) => `robokido-${id}`;

export const hasBuildAndPlay = (c?: SiteConfig): boolean => Boolean(c?.intake.buildAndPlay);

/** A row in the RoboKidovation programme box: a crop of the poster and a few words. */
export interface CategoryCard {
  id: string;
  name: Bi;
  grades: Bi;
  /** One short line, e.g. "Build, race and compete". */
  description: Bi;
  /** "Competition" or "Parent and child · not a competition". */
  kind: Bi;
  /** The poster (the row shows a landscape crop of it). */
  image: string;
  /** CSS object-position of the crop, e.g. "50% 70%". */
  imagePosition: string;
  /** Where the row leads: the category's detailed section further down the page. */
  href: string;
}

/** A category's detailed section: the full poster, a few facts and its links. */
export interface CategoryPoster {
  id: string;
  name: Bi;
  grades: Bi;
  kind: Bi;
  /** One line under the name (Build & Play); empty for none. */
  tagline: Bi;
  image: string;
  /** The poster's words, for screen readers. */
  imageAlt: Bi;
  facts: { label: Bi; value: Bi }[];
  register: CmsLink;
  /** The full competition rules (Junior and Senior); no label = no link. */
  rules: CmsLink;
}

const JUNIOR = ROBOKIDO_CATEGORIES.find((c) => c.name === 'RoboKido Junior')!;
const SENIOR = ROBOKIDO_CATEGORIES.find((c) => c.name === 'RoboKido Senior')!;
const fact = (en: string, sv: string, value: Bi) => ({ label: bi(en, sv), value });

const CATEGORIES: Record<RobokidoCategoryId, Omit<CategoryPoster, 'id' | 'register' | 'rules'> & { description: Bi; imagePosition: string; tab: string; competition: boolean }> = {
  'build-play': {
    name: bi('Build & Play'),
    grades: bi('Preschool–Grade 2', 'Förskola–årskurs 2'),
    description: bi('Free · with a parent · 5 December 2026', 'Gratis · med en förälder · 5 december 2026'),
    kind: bi('Parent and child · free · no competition', 'Förälder och barn · gratis · ingen tävling'),
    tagline: bi('Come with your parents. Build, play and discover robotics together!', 'Kom med dina föräldrar. Bygg, lek och upptäck robotik tillsammans!'),
    image: '/site/robokidovation-build-play.jpg',
    imagePosition: '50% 72%',
    imageAlt: bi(
      'Build & Play poster: open to preschool to grade 2. Come with your parents and build together. Hands-on robotics for families: build together, explore ideas, a parent-and-child activity, a fun experience. A first step into robotics.',
      'Affisch för Build & Play: för förskola till årskurs 2. Kom med dina föräldrar och bygg tillsammans. Praktisk robotik för familjer: bygg tillsammans, utforska idéer, en aktivitet för förälder och barn, en rolig upplevelse. Ett första steg in i robotik.',
    ),
    facts: [
      fact('Who', 'Vem', bi('Preschool to grade 2, including children younger than förskoleklass. A parent or guardian comes with each child.', 'Förskola till årskurs 2, även barn som är yngre än förskoleklass. En förälder eller vårdnadshavare följer med varje barn.')),
      fact('When', 'När', bi('5 December 2026', '5 december 2026')),
      fact('Where', 'Var', bi('Mälardalen International School (MISV), Västerås', 'Mälardalen International School (MISV), Västerås')),
      fact('Fee', 'Avgift', bi('Free', 'Gratis')),
      fact('Format', 'Upplägg', bi('Hands-on robotics for a parent and child together. No competition, scoring, judging, rankings or prizes.', 'Praktisk robotik för förälder och barn tillsammans. Ingen tävling, poäng, jury, rankning eller priser.')),
      fact('Experience', 'Förkunskaper', bi('No previous robotics knowledge needed.', 'Inga förkunskaper i robotik behövs.')),
    ],
    tab: 'build-play',
    competition: false,
  },
  junior: {
    name: bi('Junior Robo Sprint'),
    grades: bi('Grades 3–6', 'Årskurs 3–6'),
    description: bi('Build, race and compete', 'Bygg, kör och tävla'),
    kind: bi('Competition', 'Tävling'),
    tagline: bi(''),
    image: '/site/robokidovation-junior.jpg',
    imagePosition: '50% 72%',
    imageAlt: bi(
      'Robo Sprint poster for Junior, grades 3–6: make small bots big moves. Speed, skills, teamwork, fun. Hands-on robotics, creative problem solving, teamwork and friendship, compete and grow. Robotics for a brighter tomorrow.',
      'Affisch för Robo Sprint Junior, årskurs 3–6: små robotar, stora rörelser. Fart, färdigheter, lagarbete, glädje. Praktisk robotik, kreativ problemlösning, lagarbete och vänskap, tävla och väx. Robotik för en ljusare framtid.',
    ),
    facts: [
      fact('Level', 'Nivå', biOf(JUNIOR.level)),
      fact('Focus', 'Fokus', biOf(JUNIOR.focus)),
      fact('Coding', 'Programmering', biOf(JUNIOR.coding)),
    ],
    tab: 'competition',
    competition: true,
  },
  senior: {
    name: bi('Senior Robo Sprint'),
    grades: bi('Grades 7–9', 'Årskurs 7–9'),
    description: bi('Design, test and compete', 'Konstruera, testa och tävla'),
    kind: bi('Competition', 'Tävling'),
    tagline: bi(''),
    image: '/site/robokidovation-senior.jpg',
    imagePosition: '50% 71%',
    imageAlt: bi(
      'Robo Sprint poster for Seniors, grades 7–9: bigger challenges, bolder innovations. Real problems, real solutions. Advanced robotics, coding and automation, engineering thinking, teamwork and leadership, compete and create impact. Innovating a brighter tomorrow.',
      'Affisch för Robo Sprint Senior, årskurs 7–9: större utmaningar, djärvare innovationer. Verkliga problem, verkliga lösningar. Avancerad robotik, programmering och automation, ingenjörstänkande, lagarbete och ledarskap, tävla och gör skillnad. Innovation för en ljusare framtid.',
    ),
    facts: [
      fact('Level', 'Nivå', biOf(SENIOR.level)),
      fact('Focus', 'Fokus', biOf(SENIOR.focus)),
      fact('Coding', 'Programmering', biOf(SENIOR.coding)),
    ],
    tab: 'competition',
    competition: true,
  },
};

/** The competition rules page: on vfi.iniac.se itself, from IBK's site on vfi. */
const rulesHref = (c: SiteConfig) => (c.nav.homeRoute === 'ibk' ? `https://vfi.iniac.se${targetToHref('challenges')}` : targetToHref('challenges'));

/** The RoboKidovation box's category rows (vfi and IBK); none elsewhere. */
export const robokidoCategoryCards = (c: SiteConfig): CategoryCard[] =>
  hasBuildAndPlay(c)
    ? ROBOKIDO_CATEGORY_IDS.map((id) => {
        const k = CATEGORIES[id];
        return {
          id,
          name: k.name,
          grades: k.grades,
          description: k.description,
          kind: k.kind,
          image: k.image,
          imagePosition: k.imagePosition,
          href: targetToHref(`${c.nav.homeRoute}#${robokidoAnchor(id)}`),
        };
      })
    : [];

/** The categories' detailed sections (vfi and IBK); none elsewhere, which keeps the text cards. */
export const robokidoPosters = (c?: SiteConfig): CategoryPoster[] =>
  c && hasBuildAndPlay(c)
    ? ROBOKIDO_CATEGORY_IDS.map((id) => {
        const k = CATEGORIES[id];
        return {
          id,
          name: k.name,
          grades: k.grades,
          kind: k.kind,
          tagline: k.tagline,
          image: k.image,
          imageAlt: k.imageAlt,
          facts: k.facts,
          register: { label: k.competition ? bi('REGISTER A TEAM', 'ANMÄL ETT LAG') : bi('REGISTER FOR BUILD & PLAY · FREE', 'ANMÄL TILL BUILD & PLAY · GRATIS'), href: targetToHref(c.nav.registerRoute, k.tab) },
          rules: k.competition ? { label: bi('COMPETITION RULES', 'TÄVLINGSREGLER'), href: rulesHref(c) } : { label: bi(''), href: '' },
        };
      })
    : [];
