import { describe, expect, it } from 'vitest';
import type { ProgrammeAudience } from './audienceJourneys';

// The section builders read the browser location for links; any site address works (as in scripts/export-site-defaults.ts).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { journeyDefaults } = await import('./journey');

const vfi = journeyDefaults(VFI_SITE)!;
const texts = (a: ProgrammeAudience) =>
  [a.label, a.heading, a.description, a.imageAlt, a.benefitsHeading, a.cta.label, ...a.benefits, ...a.steps.flatMap((s) => [s.title, s.description])]
    .flatMap((b) => [b.en, b.sv]);

describe('audience journeys (vfi)', () => {
  it('has RoboKidovation and Young Future InnoHack with their dates and audiences', () => {
    expect(vfi.programmes.map((p) => [p.id, p.title.en, p.dateLabel.en, p.dateLabel.sv])).toEqual([
      ['robokidovation', 'RoboKidovation', '5 December 2026', '5 december 2026'],
      ['innohack', 'Young Future InnoHack', '11–12 December 2026', '11–12 december 2026'],
    ]);
    expect(vfi.programmes.map((p) => p.audiences.map((a) => a.id))).toEqual([
      ['students', 'parents', 'teachers'],
      ['gymnasium', 'university', 'professionals'],
    ]);
  });

  it('gives every audience five steps, three benefits, a button and an empty image slot', () => {
    for (const a of vfi.programmes.flatMap((p) => p.audiences)) {
      expect(a.steps).toHaveLength(5);
      expect(a.benefits).toHaveLength(3);
      expect(a.image).toBe('');
      expect(a.imagePosition).toBe('center');
      for (const text of [a.heading, a.description, a.imageAlt, a.cta.label, ...a.benefits, ...a.steps.flatMap((s) => [s.title, s.description])]) {
        expect(text.en.trim()).not.toBe('');
      }
    }
  });

  it("sends each audience's button to its registration form", () => {
    const hrefs = Object.fromEntries(vfi.programmes.flatMap((p) => p.audiences).map((a) => [a.id, a.cta.href]));
    expect(hrefs).toEqual({
      students: '/register?tab=competition',
      parents: '/register?tab=competition',
      teachers: '/register?tab=workshop',
      gymnasium: '/register?tab=hackathon',
      university: '/register?tab=hackathon',
      professionals: '/register?tab=mentor',
    });
  });

  it('keeps robots out of the hackathon audiences', () => {
    for (const a of vfi.programmes[1].audiences) for (const text of texts(a)) expect(text).not.toMatch(/robo/i);
  });

  it('keeps the single guide content alongside the programmes', () => {
    expect(vfi.audiences.map((a) => a.label.en)).toEqual(['For Students', 'For Parents', 'For Teachers & Schools']);
    expect(vfi.dates.length).toBeGreaterThan(0);
  });
});

describe('journey on other sites', () => {
  it('keeps the single guide (no programme boxes) on the city sites', () => {
    for (const city of Object.values(CITY_SITES)) {
      const j = journeyDefaults(city.site);
      if (!j) continue;
      expect(j.programmes).toEqual([]);
      expect(j.title.en).toBe('Designed for Students, Parents & Teachers');
    }
  });
});
