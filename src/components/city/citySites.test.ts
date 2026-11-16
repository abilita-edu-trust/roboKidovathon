import { afterEach, describe, expect, it, vi } from 'vitest';
import { CITY_SITES, cityPageFor } from './citySites';
import { hrefToTarget, pathForRoute, routeFromPath } from '../../lib/routes';
import { VFI_SITE } from '../../context/SiteContext';

describe('the IBK site (indiskbarnklubb.se)', () => {
  it('has its home, registration and ideas pages under /ibk', () => {
    expect(['ibk', 'ibk-register', 'ibk-ideas'].map(pathForRoute)).toEqual(['/ibk', '/ibk/register', '/ibk/ideas']);
    expect(cityPageFor('ibk')).toMatchObject({ page: 'home', city: { route: 'ibk' } });
    expect(cityPageFor('ibk-register')).toMatchObject({ page: 'register', city: { route: 'ibk' } });
    expect(cityPageFor('ibk-ideas')).toMatchObject({ page: 'ideas', city: { route: 'ibk' } });
  });

  it('takes registrations and ideas for Västerås, like vfi, on its own pages', () => {
    const { site } = CITY_SITES.ibk;
    // vfi's location and ideas filter: its entries are Västerås ones.
    expect(site.location).toBe(VFI_SITE.location);
    expect(site.ideasFilter).toBe(VFI_SITE.ideasFilter);
    expect(site.nav.registerRoute).toBe('ibk-register');
    expect(site.ideasPath).toBe('/ibk/ideas');
    expect(site.hero.events?.every((e) => e.target === 'ibk-register')).toBe(true);
  });

  it('keeps its own board and contact details instead of the INIAC team, on its About IBK page', () => {
    expect(CITY_SITES.ibk.ownContact).toBe(true);
    const links = CITY_SITES.ibk.site.nav.links.map((l) => l.id);
    expect(links).toContain('ibk/about');
    expect(links).toContain('ibk/about#contact');
    expect(links.some((id) => /#(board|contact)$/.test(id) && !id.startsWith('ibk/about'))).toBe(false);
  });
});

describe('a city site’s own pages from the Site CMS (e.g. /ibk/about)', () => {
  afterEach(() => vi.unstubAllGlobals());
  const onHost = (hostname: string) => vi.stubGlobal('window', { location: { hostname, origin: `https://${hostname}` } });

  it('opens /<site>/<address> as that site’s page', () => {
    onHost('vfi.iniac.se');
    expect(routeFromPath('/ibk/about')).toBe('ibk/about');
    expect(routeFromPath('/ibk/About/')).toBe('ibk/about');
    expect(routeFromPath('/riga/par-mums')).toBe('riga/par-mums');
    expect(pathForRoute('ibk/about')).toBe('/ibk/about');
    expect(cityPageFor('ibk/about')).toMatchObject({ page: 'page', path: 'about', city: { route: 'ibk' } });
    expect(hrefToTarget('/ibk/about#contact')).toEqual({ target: 'ibk/about#contact', tab: null });
  });

  it('leaves the site’s own register and ideas pages, and everything else, as they were', () => {
    onHost('vfi.iniac.se');
    expect(routeFromPath('/ibk/register')).toBe('ibk-register');
    expect(routeFromPath('/ibk/ideas')).toBe('ibk-ideas');
    expect(routeFromPath('/ibk')).toBe('ibk');
    expect(routeFromPath('/events/about')).toBe('future-innovators');
    expect(routeFromPath('/ibk/a/b')).toBe('future-innovators');
    expect(routeFromPath('/ibk/-x')).toBe('future-innovators');
    expect(cityPageFor('events')).toBeNull();
    expect(pathForRoute('events/about')).toBe('/');
  });

  it('keeps visitors on their own site: indiskbarnklubb.se opens its pages, not another site’s', () => {
    onHost('indiskbarnklubb.se');
    expect(routeFromPath('/ibk/about')).toBe('ibk/about');
    expect(routeFromPath('/esk/about')).toBe('ibk');
    expect(routeFromPath('/about')).toBe('ibk');
    onHost('esk.iniac.se');
    expect(routeFromPath('/ibk/about')).toBe('esk');
  });
});
