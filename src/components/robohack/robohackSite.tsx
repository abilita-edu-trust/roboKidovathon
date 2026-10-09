import type { SiteConfig } from '../../context/SiteContext';
import type { RoboHackEvent } from '../../data/robohack/types';
import { pathForRoute } from '../../lib/routes';
import { PartnerForm } from './RoboHackPartnerForm';

// One settings object per event, so consumers see a stable reference across renders.
const cache = new WeakMap<RoboHackEvent, SiteConfig>();

/**
 * Site settings for a RoboHack city site (e.g. vxo.iniac.se): the same VFI header, hero,
 * footer, forms and voting, with the event's own name, routes, city and hackathon-only forms.
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
  const { location, route } = event;
  const home = route;
  const register = `${route}-register`;
  const ideas = `${route}-ideas`;
  const { dates, venue, poweredBy } = event.event;

  return {
    location,
    cityName: event.brand.city,
    hackLabel: 'RoboHack',
    finalsLabel: `${event.event.name} in ${event.brand.city}`,
    organiser: `${name} / INIAC`,
    ideasPath: pathForRoute(ideas),
    ideasFilter: { only: { countrySlug: location.countrySlug, citySlug: location.citySlug } },

    nav: {
      brand: name.toUpperCase(),
      brandChip: '2026',
      homeRoute: home,
      registerRoute: register,
      darkRoutes: [home],
      links: [
        { id: home, label: { en: 'Home', sv: 'Hem' } },
        { id: `${home}#tracks`, label: { en: 'RoboHack', sv: 'RoboHack' } },
        { id: `${home}#challenges`, label: { en: 'Challenges', sv: 'Utmaningar' } },
        { id: ideas, label: { en: 'Ideas & Vote', sv: 'Idéer och röstning' } },
        { id: register, label: { en: 'Register', sv: 'Registrering' } },
        { id: `${home}#partners`, label: { en: 'Partners', sv: 'Partner' } },
        { id: `${home}#site-footer`, label: { en: 'Contact', sv: 'Kontakt' } },
      ],
      registerLabel: { en: 'JOIN ROBOHACK', sv: 'VAR MED I ROBOHACK' },
      registerShort: { en: 'REGISTER', sv: 'REGISTRERA' },
      season: { en: `${event.brand.city}, Sweden · ${dates.en}`, sv: `${event.brand.city}, Sverige · ${dates.sv}` },
    },

    hero: {
      badge: `${dates.en} · ${venue.en}`.toUpperCase(),
      lines: event.hero.lines,
      intro: event.hero.intro,
      primary: { label: { en: 'BRING YOUR IDEA', sv: 'KOM MED DIN IDÉ' }, target: register, tab: 'submit-idea' },
      secondary: { label: { en: 'JOIN ROBOHACK', sv: 'VAR MED I ROBOHACK' }, target: register, tab: 'hackathon' },
      facts: event.hero.facts,
    },

    footer: {
      title: `${name.toUpperCase()} 2026`,
      description: event.hero.intro,
      location: `${event.brand.city.toUpperCase()}, SWEDEN`,
      audience: 'ROBOTICS · CODE · HACK',
      programmeTitle: { en: 'ROBOHACK', sv: 'ROBOHACK' },
      programmeLinks: [
        { id: home, label: { en: 'Home', sv: 'Hem' } },
        { id: `${home}#tracks`, label: { en: 'Three tracks', sv: 'Tre spår' } },
        { id: `${home}#journey`, label: { en: 'The journey', sv: 'Resan' } },
        { id: `${home}#challenges`, label: { en: 'Challenges', sv: 'Utmaningar' } },
        { id: ideas, label: { en: 'Ideas & Vote', sv: 'Idéer och röstning' } },
        { id: `${home}#details`, label: { en: 'Event details', sv: 'Praktisk info' } },
      ],
      orgTitle: { en: 'ORGANIZATION & CONTACT', sv: 'ORGANISATION OCH KONTAKT' },
      orgLinks: [
        { id: `${home}#partners`, label: { en: 'For companies & partners', sv: 'För företag och partner' } },
        { id: `${home}#about`, label: { en: 'About the platform', sv: 'Om plattformen' } },
      ],
      email: 'contact@robokidovation.se',
      orgLines: [poweredBy, `${event.brand.city}, Sweden`],
      registerText: {
        en: `Registration is open for ${event.event.name} at ${venue.en}, ${dates.en}.`,
        sv: `Anmälan är öppen till ${event.event.name} på ${venue.sv}, ${dates.sv}.`,
      },
      register: { label: { en: 'JOIN ROBOHACK', sv: 'VAR MED I ROBOHACK' }, target: register, tab: 'hackathon' },
      copyright: `© 2026 ${name.toUpperCase()} · INIAC`,
      // City admins sign in on the iniac.se dashboard.
      adminHref: 'https://iniac.se/auth',
    },

    volunteerCta: {
      eyebrow: { en: `VOLUNTEERS // ${name.toUpperCase()}`, sv: `VOLONTÄRER // ${name.toUpperCase()}` },
      title: { en: `Volunteer at ${name}`, sv: `Bli volontär på ${name}` },
      body: {
        en: `Help us run ${event.event.name} at ${venue.en} on ${dates.en}. Pick your role and your time.`,
        sv: `Hjälp oss att genomföra ${event.event.name} på ${venue.sv} den ${dates.sv}. Välj din roll och din tid.`,
      },
      button: { en: 'REGISTER AS A VOLUNTEER', sv: 'ANMÄL DIG SOM VOLONTÄR' },
    },

    intake: {
      eyebrow: `OFFICIAL PROGRAM INTAKE // ${name.toUpperCase()}`,
      // RoboHack only: no RoboKidovation workshop, demo or association forms.
      tabs: ['submit-idea', 'hackathon', 'volunteer', 'partner'],
      defaultTab: 'hackathon',
      squadTitle: 'RoboHack Squad',
      hackathonDesc: `Register a team for ${event.event.name}, ${dates.en} at ${venue.en}`,
      volunteerDesc: `Help run ${name} as a volunteer`,
      associationContact: 'the organisers',
      // The VFI fees and payment details belong to Västerås.
      showFees: false,
      volunteer: {
        eventOptions: [
          {
            value: `yng-robohack-${location.citySlug}`,
            en: `${name} (${dates.en})`,
            sv: `${name} (${dates.sv})`,
          },
        ],
        eyebrow: { en: 'OPTION 3 // VOLUNTEER', sv: 'ALTERNATIV 3 // VOLONTÄR' },
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
                OPTION 4 // PARTNER
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
