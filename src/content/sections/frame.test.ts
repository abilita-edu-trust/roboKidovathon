import { describe, expect, it } from 'vitest';

// The section builders read the browser location for links; any site address works (as in journey.test.ts).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { heroDefaults, visiblePromo, promoCaption, WINTER_SPLASH_CAPTION } = await import('./frame');
const { mergeData } = await import('../core');

const bi = (en: string, sv = '') => ({ en, sv });

describe('the hero promotional badge (e.g. the Winter Fest logo)', () => {
  it('is hidden by default on every site, so nothing changes until the Site CMS switches it on', () => {
    for (const site of [VFI_SITE, ...Object.values(CITY_SITES).map((c) => c.site)]) {
      const hero = heroDefaults(site);
      // IBK's default also carries the Winter Splash caption, shown only with a switched-on badge.
      const caption = site.nav.homeRoute === 'ibk' ? WINTER_SPLASH_CAPTION : {};
      expect(hero.promo).toEqual({ visible: false, image: '', alt: bi(''), href: '', ...caption });
      expect(visiblePromo(hero)).toBeNull();
    }
  });

  it('IBK: the live badge (saved in the Site CMS without a caption) gets the Winter Splash caption from the code', () => {
    const base = heroDefaults(CITY_SITES.ibk.site);
    const live = { visible: true, image: '/site/winter-fest-2026.jpg', alt: bi('Spark, Shine & Celebrate – Winter Fest 2026', 'Spark, Shine & Celebrate – Winter Fest 2026'), href: '' };
    const promo = visiblePromo(mergeData(base, { promo: live }))!;
    expect(promo).toMatchObject(live);
    expect(promoCaption(promo)).toEqual({
      title: { en: 'Celebrate With Us!', sv: 'Fira med oss!' },
      when: { en: '12 December 2026 · 17:00–21:00', sv: '12 december 2026 · kl. 17.00–21.00' },
      cta: { label: { en: 'Register for Winter Splash 2026', sv: 'Anmäl dig till Winter Splash 2026' }, href: '/ibk/winter-splash' },
    });
    // vfi's badge (if switched on) has no caption.
    expect(promoCaption(visiblePromo(mergeData(heroDefaults(VFI_SITE), { promo: live }))!)).toBeNull();
    // A caption without a button is not shown.
    expect(promoCaption({ ...promo, cta: { label: bi(''), href: '/ibk/winter-splash' } })).toBeNull();
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
