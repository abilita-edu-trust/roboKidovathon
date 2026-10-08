// Registry of RoboHack events by route id. Add a new city here once its config exists.
// Each event has a home route (e.g. 'vxo') plus '<route>-register' and '<route>-ideas'.
import type { RoboHackEvent } from './types';
import { vaxjo } from './vaxjo';

export type { RoboHackEvent } from './types';

export const ROBOHACK_EVENTS: Record<string, RoboHackEvent> = {
  [vaxjo.route]: vaxjo,
};

export type RoboHackPageKind = 'home' | 'register' | 'ideas';

/** The RoboHack event and page a route belongs to, or null for any other route. */
export function robohackPageFor(route: string): { event: RoboHackEvent; page: RoboHackPageKind } | null {
  const [base, suffix] = route.split(/-(register|ideas)$/);
  const event = ROBOHACK_EVENTS[base];
  if (!event) return null;
  return { event, page: (suffix as RoboHackPageKind | undefined) ?? 'home' };
}
