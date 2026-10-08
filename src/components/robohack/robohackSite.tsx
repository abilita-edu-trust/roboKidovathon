import type { SiteConfig } from '../../context/SiteContext';
import type { RoboHackEvent } from '../../data/robohack/types';
import { pathForRoute } from '../../lib/routes';
import { PartnerForm } from './RoboHackPartnerForm';

// One settings object per event, so consumers see a stable reference across renders.
const cache = new WeakMap<RoboHackEvent, SiteConfig>();

/**
 * Site settings for a RoboHack city site: the shared VFI forms and voting pages, locked
 * to the event's city, with the event's own wording, its own ideas and a partner form.
 */
export function robohackSite(event: RoboHackEvent): SiteConfig {
  let site = cache.get(event);
  if (!site) {
    site = buildSite(event);
    cache.set(event, site);
  }
  return site;
}

function buildSite(event: RoboHackEvent): SiteConfig {
  const name = `${event.brand.name} ${event.brand.city}`;
  const { location } = event;

  return {
    location,
    cityName: event.brand.city,
    hackLabel: event.brand.name,
    finalsLabel: `${event.event.name} in ${event.brand.city}`,
    organiser: `${name} / INIAC`,
    ideasPath: pathForRoute(`${event.route}-ideas`),
    ideasFilter: { only: { countrySlug: location.countrySlug, citySlug: location.citySlug } },
    intake: {
      eyebrow: `OFFICIAL PROGRAM INTAKE // ${name.toUpperCase()}`,
      hackathonDesc: `Register a team for ${name}, ${event.event.dates.en} at ${event.event.venue.en}`,
      volunteerDesc: `Help run ${name} as a volunteer`,
      associationContact: 'the organisers',
      // The VFI fees and payment details belong to Västerås.
      showFees: false,
      volunteer: {
        eventOptions: [
          {
            value: `yng-robohack-${location.citySlug}`,
            en: `${name} (${event.event.dates.en})`,
            sv: `${name} (${event.event.dates.sv})`,
          },
        ],
        eyebrow: { en: 'OPTION 6 // VOLUNTEER', sv: 'ALTERNATIV 6 // VOLONTÄR' },
        intro: {
          en: `Help us run ${name}. All fields are required.`,
          sv: `Hjälp oss att genomföra ${name}. Alla fält är obligatoriska.`,
        },
        teamName: event.brand.name,
      },
      extraForm: {
        title: event.partners.cta.en,
        subtitle: 'Companies & Partners',
        desc: 'Bring problem statements, mentors, workshops, equipment or sponsorship',
        icon: '🏢',
        render: () => (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase">
                OPTION 7 // PARTNER
              </span>
              <h2 className="font-headline font-black text-2xl uppercase tracking-tight mt-1">{event.partners.cta.en}</h2>
              <p className="text-sm text-slate-600 mt-1">{event.partners.headline.en}</p>
            </div>
            <PartnerForm event={event} />
          </div>
        ),
      },
    },
  };
}
