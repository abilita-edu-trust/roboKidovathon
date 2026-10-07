// Registry of RoboHack events by route id. Add a new city here once its config exists.
import type { RoboHackEvent } from './types';
import { vaxjo } from './vaxjo';

export type { RoboHackEvent } from './types';

export const ROBOHACK_EVENTS: Record<string, RoboHackEvent> = {
  [vaxjo.route]: vaxjo,
};
