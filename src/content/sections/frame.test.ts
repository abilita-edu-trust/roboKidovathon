import { describe, expect, it } from 'vitest';

// The section builders read the browser location for links; any site address works (as in journey.test.ts).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { heroDefaults, visiblePromo } = await import('./frame');
const { mergeData } = await import('../core');

const bi = (en: string, sv = '') => ({ en, sv });

describe('the hero promotional badge (e.g. the Winter Fest logo)', () => {
  it('is hidden by default on every site, so nothing changes until the Site CMS switches it on', () => {
    for (const site of [VFI_SITE, ...Object.values(CITY_SITES).map((c) => c.site)]) {
      const hero = heroDefaults(site);
      expect(hero.promo).toEqual({ visible: false, image: '', alt: bi(''), href: '' });
      expect(visiblePromo(hero)).toBeNull();
    }
  });

  it('shows only when switched on and given an image', () => {
    const promo = (over: object) => ({ promo: { visible: true, image: '/winter-fest-2026.png', alt: bi('Winter Fest 2026'), href: '', ...over } });
    expect(visiblePromo(promo({}))?.image).toBe('/winter-fest-2026.png');
    expect(visiblePromo(promo({ visible: false }))).toBeNull();
    expect(visiblePromo(promo({ image: '  ' }))).toBeNull();
    expect(visiblePromo({ promo: undefined as never })).toBeNull();
  });

  it('keeps saved content without a badge (every site today) without one, and a saved badge as saved', () => {
    const base = heroDefaults(VFI_SITE);
    const { promo: _unused, ...savedWithout } = base;
    expect(visiblePromo(mergeData(base, JSON.parse(JSON.stringify(savedWithout))))).toBeNull();
    const saved = { ...savedWithout, promo: { visible: true, image: 'https://example.org/logo.png', alt: bi('Winter Fest 2026', 'Winter Fest 2026'), href: '' } };
    expect(mergeData(base, saved).promo).toEqual(saved.promo);
  });
});
