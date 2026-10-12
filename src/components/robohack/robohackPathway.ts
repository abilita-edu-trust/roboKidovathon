import { Lightbulb } from 'lucide-react';
import type { PathwayContent } from '../PathwayCard';
import type { Bilingual, RoboHackEvent } from '../../data/robohack/types';

/** The hackathon card under a RoboHack city's banner: the event's journey, ending on its dates. */
export function robohackPathway(event: RoboHackEvent, sv: boolean): PathwayContent {
  const t = (b: Bilingual) => (sv ? b.sv || b.en : b.en);
  const { name, title, intro, dates, venue } = event.event;
  const tracks = event.tracks.filter((track) => track.enabled).map((track) => t(track.title));
  const last = event.journey.length - 1;

  return {
    theme: 'hack',
    icon: Lightbulb,
    title: name.replace(/\s*\d{4}$/, ''),
    tagline: t(title).toUpperCase(),
    intro: [t(intro), `${t(dates)} · ${t(venue)}`, `${sv ? 'Spår' : 'Tracks'}: ${tracks.join(' · ')}`],
    steps: event.journey.map((step, i) => ({
      title: t(step.title),
      subtitle: t(step.description),
      icon: step.icon,
      ...(i === last ? { date: t(dates), highlight: true } : {}),
    })),
    callout: sv
      ? `${name} hålls ${t(dates)} på ${t(venue)}. Inga programmeringskunskaper krävs.`
      : `${name} runs ${t(dates)} at ${t(venue)}. No coding experience needed.`,
    ctaLabel: sv ? 'SE SPÅREN' : 'SEE THE TRACKS',
  };
}
