// The RoboHack event sections (vxo): their default content is the event's data file with the labels the
// page always showed.
import type { RoboHackEvent } from '../../data/robohack/types';
import type { SiteConfig } from '../../context/SiteContext';
import { bi, type Bi, type CmsLink } from '../core';
import { iconName } from '../icons';
import { biOf, targetToHref } from './frame';

export interface RhAboutData {
  eyebrow: Bi;
  title: Bi;
  intro: Bi;
  flow: Bi[];
}

export interface RhProblemData {
  eyebrow: Bi;
  title: Bi;
  question: Bi;
  body: Bi[];
  flow: Bi[];
  cards: { icon: string; title: Bi; description: Bi }[];
  ideasTitle: Bi;
  ideas: Bi[];
  /** The first line is the big one. */
  closing: Bi[];
  button: CmsLink;
}

export interface RhEventData {
  eyebrow: Bi;
  title: Bi;
  intro: Bi;
  name: Bi;
  venue: Bi;
  dates: Bi;
  registerButton: CmsLink;
  partnerButton: CmsLink;
  poweredByLabel: Bi;
  poweredBy: string;
}

export interface RhTracksData {
  eyebrow: Bi;
  title: Bi;
  interestsLabel: Bi;
  /** "{track}" is the track's title. */
  joinLabel: Bi;
  joinHref: string;
  tracks: { icon: string; title: Bi; tagline: Bi; description: Bi; interests: Bi[] }[];
}

export interface RhChallengesData {
  eyebrow: Bi;
  title: Bi;
  intro: Bi;
  examplesLabel: Bi;
  items: { title: Bi; question: Bi; examples: Bi[] }[];
  closing: Bi;
  flow: Bi[];
}

export interface RhProgrammesData {
  eyebrow: Bi;
  title: Bi;
  items: { name: Bi; audience: Bi; description: Bi; flow: Bi[] }[];
}

export interface RhPartnersData {
  eyebrow: Bi;
  title: Bi;
  button: CmsLink;
  intro: Bi;
  ways: Bi[];
}

const reg = (c: SiteConfig, tab: string) => targetToHref(c.nav.registerRoute, tab);

export const rhAboutDefaults = (e: RoboHackEvent): RhAboutData => ({
  eyebrow: bi(e.brand.name),
  title: biOf(e.platform.title),
  intro: biOf(e.platform.intro),
  flow: e.platform.flow.map(biOf),
});

export const rhProblemDefaults = (e: RoboHackEvent, c: SiteConfig): RhProblemData => ({
  eyebrow: bi('Your idea', 'Din idé'),
  title: biOf(e.problem.title),
  question: biOf(e.problem.question),
  body: e.problem.body.map(biOf),
  flow: e.problem.flow.map(biOf),
  cards: e.problem.cards.map((card) => ({ icon: iconName(card.icon), title: biOf(card.title), description: biOf(card.description) })),
  ideasTitle: biOf(e.problem.ideasTitle),
  ideas: e.problem.ideas.map(biOf),
  closing: e.problem.closing.map(biOf),
  button: { label: bi('Bring Your Idea', 'Kom med din idé'), href: reg(c, 'submit-idea') },
});

export const rhEventDefaults = (e: RoboHackEvent, c: SiteConfig): RhEventData => ({
  eyebrow: bi(e.event.name),
  title: biOf(e.event.title),
  intro: biOf(e.event.intro),
  name: bi(e.event.name),
  venue: biOf(e.event.venue),
  dates: biOf(e.event.dates),
  registerButton: { label: bi('Register now', 'Anmäl dig nu'), href: reg(c, 'hackathon') },
  partnerButton: { label: biOf(e.partners.cta), href: reg(c, 'partner') },
  poweredByLabel: bi('Powered by', 'Arrangeras av'),
  poweredBy: e.event.poweredBy,
});

export const rhTracksDefaults = (e: RoboHackEvent, c: SiteConfig): RhTracksData => {
  const tracks = e.tracks.filter((track) => track.enabled);
  const n = tracks.length;
  return {
    eyebrow: bi(`${e.brand.city} · ${e.brand.name}`),
    title: bi(`One event — ${n === 3 ? 'three' : n} tracks`, `Ett evenemang — ${n === 3 ? 'tre' : n} spår`),
    interestsLabel: bi('For participants interested in', 'För dig som är intresserad av'),
    joinLabel: bi('Join {track}', 'Välj {track}'),
    joinHref: reg(c, 'hackathon'),
    tracks: tracks.map((track) => ({
      icon: iconName(track.icon),
      title: biOf(track.title),
      tagline: biOf(track.tagline),
      description: biOf(track.description),
      interests: track.interests.map(biOf),
    })),
  };
};

export const rhChallengesDefaults = (e: RoboHackEvent): RhChallengesData => ({
  eyebrow: bi('Challenges', 'Utmaningar'),
  title: biOf(e.challenges.question),
  intro: biOf(e.challenges.intro),
  examplesLabel: bi('Examples', 'Exempel'),
  items: e.challenges.items.map((item) => ({ title: biOf(item.title), question: biOf(item.question), examples: item.examples.map(biOf) })),
  closing: biOf(e.challenges.closing),
  flow: e.challenges.flow.map(biOf),
});

export const rhProgrammesDefaults = (e: RoboHackEvent): RhProgrammesData => ({
  eyebrow: bi('Two programmes', 'Två program'),
  title: bi('Find your path', 'Hitta din väg'),
  items: e.programmes.map((p) => ({ name: bi(p.name), audience: biOf(p.audience), description: biOf(p.description), flow: p.flow.map(biOf) })),
});

export const rhPartnersDefaults = (e: RoboHackEvent, c: SiteConfig): RhPartnersData => ({
  eyebrow: bi('For companies & partners', 'För företag och partner'),
  title: biOf(e.partners.headline),
  button: { label: biOf(e.partners.cta), href: reg(c, 'partner') },
  intro: biOf(e.partners.intro),
  ways: e.partners.ways.map(biOf),
});
