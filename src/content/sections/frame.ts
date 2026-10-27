// Header, hero, volunteer banner and footer: their default content comes from the site's configuration,
// and the header/footer content is put back into that configuration so every page of the site shows it.
import type { Bilingual, SiteAction, SiteConfig, SiteLink } from '../../context/SiteContext';
import type { IntakeProgramTab } from '../../pages/IntakeRegisterPage';
import { hrefToTarget, isExternalHref, pathForRoute } from '../../lib/routes';
import { bi, pick, type Bi, type CmsLink } from '../core';
import type { SectionDoc } from '../document';
import { toPartnerLogos, type PartnersData } from './simple';

/** A route target (`route` or `route#section`, optionally on a register form) as a site path. */
export const targetToHref = (target: string, tab?: string | null): string => {
  const [route, section] = target.split('#');
  return pathForRoute(route) + (tab ? `?tab=${tab}` : '') + (section ? `#${section}` : '');
};

export const biOf = (b: Bilingual): Bi => bi(b.en, b.sv);
const linkOf = (l: SiteLink): CmsLink => ({ label: biOf(l.label), href: targetToHref(l.id) });
const actionLink = (a: SiteAction): CmsLink => ({ label: biOf(a.label), href: targetToHref(a.target, a.tab) });

/** A link with no text in either language is hidden. */
export const hasLabel = (l: CmsLink | undefined): l is CmsLink => Boolean(l && (l.label.en.trim() || l.label.sv.trim()));

/** The header and footer navigate by target; links to other sites keep their address as the target. */
const siteLink = (l: CmsLink): SiteLink => ({ id: isExternalHref(l.href) ? l.href : hrefToTarget(l.href).target, label: l.label });
const actionOf = (l: CmsLink): SiteAction => {
  if (isExternalHref(l.href)) return { label: l.label, target: l.href };
  const { target, tab } = hrefToTarget(l.href);
  return { label: l.label, target, ...(tab ? { tab: tab as IntakeProgramTab } : {}) };
};

export interface HeaderData {
  brand: Bi;
  brandChip: Bi;
  links: CmsLink[];
  registerLabel: Bi;
  registerShort: Bi;
  season: Bi;
}

/** An event card in the hero; `href` goes to the event's details or registration. */
export interface HeroEventCard {
  date: Bi;
  title: Bi;
  kind: Bi;
  audience: Bi;
  href: string;
}

export interface HeroData {
  badge: Bi;
  /** Headline lines; the last one is yellow. */
  lines: Bi[];
  intro: Bi;
  /** Event cards; with any, the hero shows the events layout. */
  events: HeroEventCard[];
  primary: CmsLink;
  secondary: CmsLink;
  facts: { label: Bi; value: Bi }[];
  /** Background image; also the video's first frame. */
  image: string;
  /** Optional background video (MP4/WebM), muted and looping. */
  video: string;
}

export interface VolunteerData {
  eyebrow: Bi;
  title: Bi;
  body: Bi;
  button: CmsLink;
}

export interface FooterData {
  title: Bi;
  description: Bi;
  location: Bi;
  audience: Bi;
  programmeTitle: Bi;
  programmeLinks: CmsLink[];
  orgTitle: Bi;
  orgLinks: CmsLink[];
  email: string;
  orgLines: Bi[];
  registerTitle: Bi;
  registerText: Bi;
  register: CmsLink;
  copyright: Bi;
  complianceLine: Bi;
}

/** The hero artwork shipped with the site (public/site/). */
export const DEFAULT_HERO_IMAGE = '/site/arena_court_hd.jpg';

export const headerDefaults = (c: SiteConfig): HeaderData => ({
  brand: bi(c.nav.brand),
  brandChip: bi(c.nav.brandChip),
  links: c.nav.links.map(linkOf),
  registerLabel: biOf(c.nav.registerLabel),
  registerShort: biOf(c.nav.registerShort),
  season: biOf(c.nav.season),
});

export const heroDefaults = (c: SiteConfig): HeroData => ({
  badge: typeof c.hero.badge === 'string' ? bi(c.hero.badge) : biOf(c.hero.badge),
  lines: c.hero.lines.map(biOf),
  intro: biOf(c.hero.intro),
  events: (c.hero.events ?? []).map((e) => ({
    date: biOf(e.date),
    title: biOf(e.title),
    kind: biOf(e.kind),
    audience: biOf(e.audience),
    href: targetToHref(e.target, e.tab),
  })),
  primary: actionLink(c.hero.primary),
  secondary: actionLink(c.hero.secondary),
  facts: c.hero.facts.map((f) => ({ label: bi(f.label), value: bi(f.value) })),
  image: DEFAULT_HERO_IMAGE,
  video: '',
});

export const volunteerDefaults = (c: SiteConfig): VolunteerData => ({
  eyebrow: biOf(c.volunteerCta.eyebrow),
  title: biOf(c.volunteerCta.title),
  body: biOf(c.volunteerCta.body),
  button: { label: biOf(c.volunteerCta.button), href: targetToHref(c.nav.registerRoute, 'volunteer') },
});

export const footerDefaults = (c: SiteConfig): FooterData => ({
  title: bi(c.footer.title),
  description: biOf(c.footer.description),
  location: bi(c.footer.location),
  audience: bi(c.footer.audience),
  programmeTitle: biOf(c.footer.programmeTitle),
  programmeLinks: c.footer.programmeLinks.map(linkOf),
  orgTitle: biOf(c.footer.orgTitle),
  orgLinks: c.footer.orgLinks.map(linkOf),
  email: c.footer.email,
  orgLines: c.footer.orgLines.map((line) => bi(line)),
  registerTitle: bi('REGISTER'),
  registerText: biOf(c.footer.registerText),
  register: c.footer.register ? actionLink(c.footer.register) : { label: bi(''), href: '' },
  copyright: bi(c.footer.copyright),
  complianceLine: bi('LOW-VOLTAGE 6V HARDWARE · GDPR-COMPLIANT STUDENT PRIVACY'),
});

const dataOf = <T,>(sections: SectionDoc[], type: string) => sections.find((s) => s.type === type)?.data as T | undefined;

/** The site's configuration with the header and footer from its CMS document, in the visitor's language. */
export function applyFrame(c: SiteConfig, sections: SectionDoc[], sv: boolean): SiteConfig {
  const h = dataOf<HeaderData>(sections, 'header');
  const f = dataOf<FooterData>(sections, 'footer');
  const partners = dataOf<PartnersData>(sections, 'partners');
  return {
    ...c,
    nav: h
      ? {
          ...c.nav,
          brand: pick(h.brand, sv),
          brandChip: pick(h.brandChip, sv),
          links: h.links.filter(hasLabel).map(siteLink),
          registerLabel: h.registerLabel,
          registerShort: h.registerShort,
          season: h.season,
        }
      : c.nav,
    footer: f
      ? {
          ...c.footer,
          title: pick(f.title, sv),
          description: f.description,
          location: pick(f.location, sv),
          audience: pick(f.audience, sv),
          programmeTitle: f.programmeTitle,
          programmeLinks: f.programmeLinks.filter(hasLabel).map(siteLink),
          orgTitle: f.orgTitle,
          orgLinks: f.orgLinks.filter(hasLabel).map(siteLink),
          email: f.email,
          orgLines: f.orgLines.map((line) => pick(line, sv)).filter(Boolean),
          registerTitle: f.registerTitle,
          registerText: f.registerText,
          register: hasLabel(f.register) ? actionOf(f.register) : null,
          copyright: pick(f.copyright, sv),
          complianceLine: f.complianceLine,
          logos: partners ? toPartnerLogos(partners.logos, sv) : undefined,
        }
      : c.footer,
  };
}
