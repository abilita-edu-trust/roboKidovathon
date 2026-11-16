import { describe, expect, it } from 'vitest';
import { CITY_SITES, cityPageFor } from './citySites';
import { pathForRoute } from '../../lib/routes';
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

  it('keeps its own board and contact details instead of the INIAC team', () => {
    expect(CITY_SITES.ibk.ownContact).toBe(true);
    expect(CITY_SITES.ibk.site.nav.links.map((l) => l.id)).toContain('ibk#board');
  });
});
