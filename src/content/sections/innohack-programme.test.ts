import { describe, expect, it } from 'vitest';

// The section builders read the browser location for links; any site address works (as in the other section tests).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const { innohackTracks, trackProgramme, KID_SESSIONS, KID_NABC, KID_FACTS, KID_PLACES, KID_TEAMS, KID_TEAM_SIZE } = await import('./innohack');
const { mergeData } = await import('../core');

const kid = () => innohackTracks((t) => `/register?tab=${t}`)[0];

describe('Kid InnoHack 2026 programme', () => {
  it('has the five final sessions, at the right times and places', () => {
    expect(KID_SESSIONS.map((s) => [s.key, s.date.en, s.time.en, s.place.en, s.online, s.title.en])).toEqual([
      ['s1', '5 December 2026', '11:00–12:00', 'MISV, Västerås', false, 'Kickoff'],
      ['s2', '7 December 2026', '17:30–18:30', 'Online', true, 'Checkpoint 1'],
      ['s3', '9 December 2026', '17:30–18:30', 'Online', true, 'Checkpoint 2'],
      ['s4', '11 December 2026', '17:30–18:30', 'Online', true, 'Checkpoint 3'],
      ['s5', '12 December 2026', 'From the morning', 'Mälardalen University (MDU), Västerås', false, 'Grand Finale'],
    ]);
    expect(KID_SESSIONS.map((s) => s.weekday.en)).toEqual(['Saturday', 'Monday', 'Wednesday', 'Friday', 'Saturday']);
    expect(KID_SESSIONS.map((s) => s.time.sv)).toEqual(['kl. 11.00–12.00', 'kl. 17.30–18.30', 'kl. 17.30–18.30', 'kl. 17.30–18.30', 'Från förmiddagen']);
    expect(KID_SESSIONS[0].detail.en).toMatch(/challenges are released.*teams are formed.*NABC.*problem/);
    expect(KID_SESSIONS[4].detail.en).toMatch(/closing ceremony and awards/);
  });

  it('is 20 children in five teams of four (not four teams of five)', () => {
    expect([KID_PLACES, KID_TEAMS, KID_TEAM_SIZE]).toEqual([20, 5, 4]);
    expect(Object.fromEntries(KID_FACTS.map((f) => [f.label.en, f.value.en]))).toEqual({
      Who: 'Grades 3–9', Places: 'Up to 20 children', Teams: 'Five teams of four', Cost: 'Free', 'Register by': '3 December 2026',
    });
    expect(JSON.stringify(kid())).not.toMatch(/four teams of five/i);
  });

  it('explains NABC for children, with an example for every letter, in English and Swedish', () => {
    expect(KID_NABC.parts.map((p) => [p.letter, p.word.en, p.word.sv])).toEqual([
      ['N', 'Need', 'Behov'], ['A', 'Approach', 'Lösning'], ['B', 'Benefits', 'Nytta'], ['C', 'Competition', 'Konkurrens'],
    ]);
    for (const p of KID_NABC.parts) for (const t of [p.question, p.example]) expect(t.en && t.sv && t.en !== t.sv).toBeTruthy();
  });

  it('gives a track saved in the Site CMS before these fields existed the built-in programme', () => {
    // A saved list of tracks is laid over a blank copy of the first default track, so new fields come back empty.
    const { sessions: _s, nabc: _n, facts: _f, sessionsHeading: _h, ...savedKid } = kid();
    const merged = mergeData(innohackTracks((t) => t), [JSON.parse(JSON.stringify(savedKid))])[0];
    expect(merged.sessions).toEqual([]);
    const p = trackProgramme(merged);
    expect(p.sessions).toBe(KID_SESSIONS);
    expect(p.nabc).toBe(KID_NABC);
    expect(p.facts).toBe(KID_FACTS);
    // Young InnoHack keeps its steps layout.
    expect(trackProgramme(innohackTracks((t) => t)[1]).sessions).toEqual([]);
  });

  it('opens registration and the separate public idea from the Kid InnoHack panel', () => {
    const a = kid().audiences[0];
    expect([a.cta.label.en, a.cta.href, a.secondaryCta?.label.en, a.secondaryCta?.href]).toEqual([
      'Register for Kid InnoHack', '/register?tab=kid-innohack', 'Submit an idea', '/register?tab=kid-submit-idea',
    ]);
    expect(kid().venue.en).toBe('Start at MISV · Final at Mälardalen University');
  });

  it('puts both Future InnoHack finals at Mälardalen University', () => {
    const young = innohackTracks((t) => t)[1];
    expect(young.venue).toEqual({ en: 'Final at Mälardalen University, Västerås', sv: 'Final på Mälardalens universitet, Västerås' });
    expect(JSON.stringify(innohackTracks((t) => t))).not.toContain('Växhuset');
  });
});
