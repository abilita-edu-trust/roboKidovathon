import { describe, expect, it } from 'vitest';
import {
  programmeTracks, trackAnchor, trackIndexForHash, visibleChallenges,
  type ProgrammeAudience, type ProgrammeJourney, type ProgrammeTrack,
} from './audienceJourneys';
import { mergeData } from '../core';

// The section builders read the browser location for links; any site address works (as in scripts/export-site-defaults.ts).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { journeyDefaults } = await import('./journey');

const vfi = journeyDefaults(VFI_SITE)!;
// Riga keeps the earlier Young Future InnoHack box; vfi and IBK have Future InnoHack with its tracks.
const riga = journeyDefaults(CITY_SITES.riga.site)!;
const allAudiences = (j: typeof vfi) => j.programmes.flatMap((p) => [...p.audiences, ...(p.tracks ?? []).flatMap((t) => t.audiences)]);
const texts = (a: ProgrammeAudience) =>
  [a.label, a.heading, a.description, a.imageAlt, a.benefitsHeading, a.cta.label, ...a.benefits, ...a.steps.flatMap((s) => [s.title, s.description])]
    .flatMap((b) => [b.en, b.sv]);

describe('audience journeys (vfi)', () => {
  it('has RoboKidovation and Future InnoHack (Kid and Young tracks) with their own dates', () => {
    expect(vfi.programmes.map((p) => [p.id, p.title.en, p.dateLabel.en, p.dateLabel.sv])).toEqual([
      ['robokidovation', 'RoboKidovation', '5 December 2026', '5 december 2026'],
      ['innohack', 'Future InnoHack', '5–12 December 2026', '5–12 december 2026'],
    ]);
    expect(vfi.programmes[0].audiences.map((a) => a.id)).toEqual(['students', 'parents', 'teachers']);
    const tracks = vfi.programmes[1].tracks!;
    expect(tracks.map((t) => [t.id, t.label.en, t.dateLabel.en, t.registrationOpen])).toEqual([
      ['kid', 'Kid InnoHack', '5–12 December 2026', false],
      ['young', 'Young InnoHack', '10–12 December 2026', true],
    ]);
    expect(tracks.map((t) => t.audiences.map((a) => a.id))).toEqual([['kids'], ['gymnasium', 'university', 'professionals']]);
    expect(tracks[0].schedule.map((r) => r.date.en)).toEqual(['By 1 December 2026', '5 December 2026', '6–11 December 2026', '12 December 2026']);
    expect(tracks[1].schedule.map((r) => r.date.en)).toEqual(['10 December 2026, evening', '11 December 2026', '12 December 2026']);
    // No company is named before they are confirmed: one hidden, empty challenge as the CMS template.
    expect(tracks[1].challenges).toEqual([{ visible: false, company: '', logo: '', title: { en: '', sv: '' }, problem: { en: '', sv: '' } }]);
  });

  it('keeps the earlier box on Riga', () => {
    expect(riga.programmes.map((p) => [p.id, p.title.en, p.tracks])).toEqual([
      ['robokidovation', 'RoboKidovation', undefined],
      ['innohack', 'Young Future InnoHack', undefined],
    ]);
  });

  it('gives every audience five steps, three benefits, a button and an empty image slot', () => {
    for (const a of allAudiences(vfi)) {
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
    const hrefs = Object.fromEntries(allAudiences(vfi).map((a) => [a.id, [a.cta.href, a.secondaryCta?.href ?? '']]));
    expect(hrefs).toEqual({
      students: ['/register?tab=competition', ''],
      parents: ['/register?tab=competition', ''],
      teachers: ['/register?tab=workshop', ''],
      kids: ['/register?tab=kid-innohack', ''],
      gymnasium: ['/register?tab=young-innohack', ''],
      university: ['/register?tab=young-innohack', ''],
      // Professionals: take part, or the mentor form.
      professionals: ['/register?tab=young-innohack', '/register?tab=mentor'],
    });
  });

  it('keeps robots out of the hackathon audiences', () => {
    for (const a of vfi.programmes[1].tracks!.flatMap((t) => t.audiences)) for (const text of texts(a)) expect(text).not.toMatch(/robo/i);
    for (const a of riga.programmes[1].audiences) for (const text of texts(a)) expect(text).not.toMatch(/robo/i);
  });

  it('keeps the single guide content alongside the programmes', () => {
    expect(vfi.audiences.map((a) => a.label.en)).toEqual(['For Students', 'For Parents', 'For Teachers & Schools']);
    expect(vfi.dates.length).toBeGreaterThan(0);
  });
});

describe('InnoHack tracks (Site CMS content)', () => {
  const bi = (en: string, sv = '') => ({ en, sv });
  const audience = (id: string): ProgrammeAudience => ({ ...riga.programmes[1].audiences[0], id, label: bi(id) });
  const track = (id: string, over: Partial<ProgrammeTrack> = {}): ProgrammeTrack => ({
    id, label: bi(`${id} InnoHack`), eligibility: bi(''), summary: bi(''), dateLabel: bi(''), venue: bi(''), highlights: [], image: '',
    imageAlt: bi(''), registrationOpen: true, closedMessage: bi(''), audiences: [audience(id)], scheduleHeading: bi(''), schedule: [],
    challengesHeading: bi(''), challengesNote: bi(''), challenges: [], ...over,
  });
  const innohack: ProgrammeJourney = { ...riga.programmes[1], title: bi('InnoHack'), tracks: [track('kid'), track('young')] };

  it('has tracks in the built-in content of vfi and IBK only', () => {
    expect(vfi.programmes.map((p) => !!p.tracks)).toEqual([false, true]);
    for (const city of Object.values(CITY_SITES)) {
      const withTracks = (journeyDefaults(city.site)?.programmes ?? []).some((p) => p.tracks);
      expect(withTracks, city.route).toBe(city.route === 'ibk');
    }
  });

  it('keeps saved tracks when the CMS document is laid over the defaults', () => {
    const merged = mergeData(riga, { ...riga, programmes: [riga.programmes[0], innohack] });
    expect(merged.programmes[1].tracks).toEqual(innohack.tracks);
    expect(programmeTracks(merged.programmes[1]).map((t) => t.id)).toEqual(['kid', 'young']);
  });

  it('shows saved content without tracks (Riga, and vfi and IBK until the content update) exactly as before', () => {
    const saved = JSON.parse(JSON.stringify({ ...riga, programmes: riga.programmes }));
    const merged = mergeData(vfi, saved);
    for (const p of merged.programmes) {
      expect(p.tracks).toBeUndefined();
      expect(programmeTracks(p)).toEqual([]);
    }
  });

  it('opens a track from its link anchor (#innohack-kid, #innohack-young)', () => {
    expect(innohack.tracks!.map((t, i) => trackAnchor(innohack, t, i))).toEqual(['innohack-kid', 'innohack-young']);
    expect(trackIndexForHash(innohack, '#innohack-young')).toBe(1);
    expect(trackIndexForHash(innohack, '#INNOHACK-KID')).toBe(0);
    expect(trackIndexForHash(innohack, '#journey-innohack')).toBe(-1);
    expect(trackIndexForHash(innohack, '')).toBe(-1);
    expect(trackIndexForHash(riga.programmes[0], '#innohack-kid')).toBe(-1);
  });

  it('skips tracks without a name', () => {
    expect(programmeTracks({ ...innohack, tracks: [track('kid', { label: bi('') }), track('young')] }).map((t) => t.id)).toEqual(['young']);
    expect(programmeTracks({ ...innohack, tracks: 'oops' as unknown as ProgrammeTrack[] })).toEqual([]);
  });

  it('shows only the company challenges that are switched on and filled in', () => {
    const c = (visible: boolean, company: string, title = '') => ({ visible, company, logo: '', title: bi(title), problem: bi('') });
    const young = track('young', { challenges: [c(false, ''), c(false, 'Hidden AB', 'Not yet'), c(true, 'Shown AB', 'Water'), c(true, '')] });
    expect(visibleChallenges(young).map((x) => x.company)).toEqual(['Shown AB']);
    expect(visibleChallenges(track('kid'))).toEqual([]);
  });
});

describe('journey on other sites', () => {
  it('keeps the single guide (no programme boxes) on the city sites without them', () => {
    for (const city of Object.values(CITY_SITES)) {
      const j = journeyDefaults(city.site);
      // Riga copies vfi, programme boxes included.
      if (!j || city.site.journey?.audienceJourneys) continue;
      expect(j.programmes).toEqual([]);
      expect(j.title.en).toBe('Designed for Students, Parents & Teachers');
    }
  });
});
