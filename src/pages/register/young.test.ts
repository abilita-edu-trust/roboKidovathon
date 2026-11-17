import { describe, expect, it, vi } from 'vitest';

(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
vi.mock('../../lib/supabase', () => ({ supabase: { rpc: vi.fn() }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { youngPayload, youngError, youngForm } = await import('./forms/young');
const { teamStepError } = await import('./YoungSteps');
const { normaliseCode, formatCode, teamSizeText } = await import('../../content/youngChallenges');
const { FORMS } = await import('./forms');
const { GRADE_GROUP_OPTIONS } = await import('../../data/vfiFacts');

type Path = import('./flow').RegisterPath;
type Programme = import('./flow').RegisterProgramme;
type Ctx = import('./ui').FormCtx;

const { stepsFor, formFor, tabForPath, pathForTab, activityChoices, answerCard, isAnswered } = flow;
const VFI = VFI_SITE.intake.programmes;
const all = () => true;
const L = (en: string) => en;
const ctxFor = (path: Path, site = VFI_SITE): Ctx => ({
  site, language: 'en', lang: 'en', sv: false, L, path, programme: site.intake.programmes.find((p) => p.id === path.programme) as Programme, gradeOptions: GRADE_GROUP_OPTIONS,
});
const young = (extra: Partial<Path> = {}): Path => ({ programme: 'hack', track: 'young', challengeMode: true, ...extra });

describe('Young InnoHack with company challenges: the four steps', () => {
  it('asks the challenge and the team instead of who you are, once challenges are published', () => {
    expect(stepsFor(young({ activity: 'participate' }), VFI)).toEqual(['programme', 'track', 'activity', 'challenge', 'team', 'form', 'review']);
    // Before a pathway is chosen the longest path shows.
    expect(stepsFor(young(), VFI)).toEqual(['programme', 'track', 'activity', 'challenge', 'team', 'form', 'review']);
    // An idea for the public vote still asks who sends it; mentoring goes straight to its form.
    expect(stepsFor(young({ activity: 'idea' }), VFI)).toEqual(['programme', 'track', 'activity', 'role', 'form', 'review']);
    expect(stepsFor(young({ activity: 'mentor' }), VFI)).toEqual(['programme', 'track', 'activity', 'form', 'review']);
  });

  it('keeps today\'s Young InnoHack flow while no challenge is published', () => {
    const path: Path = { programme: 'hack', track: 'young', activity: 'participate' };
    expect(stepsFor(path, VFI)).toEqual(['programme', 'track', 'role', 'activity', 'form', 'review']);
    expect(formFor({ ...path, role: 'team' })).toBe('squad');
    expect(activityChoices('hack', all, { ...path, role: 'team' }).map((c) => c.id)).toEqual(['idea', 'participate']);
  });

  it('opens the details form only with a challenge and a team answer, and links back to ?tab=young-innohack', () => {
    expect(formFor(young({ activity: 'participate' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', challenge: 'c1' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', challenge: 'c1', team: 'join' }))).toBe('young');
    expect(formFor(young({ activity: 'mentor' }))).toBe('mentor');
    expect(formFor(young({ activity: 'idea', role: 'individual', theme: 'Energy' }))).toBe('idea');
    expect(tabForPath(young({ activity: 'participate', challenge: 'c1', team: 'create' }))).toBe('young-innohack');
    expect(pathForTab('young-innohack', VFI)).toEqual({ programme: 'hack', track: 'young', activity: 'participate' });
    expect(isAnswered('challenge', young({ challenge: 'c1' }))).toBe(true);
    expect(isAnswered('team', young({ team: 'individual' }))).toBe(true);
    expect(FORMS.young).toBe(youngForm);
  });

  it('offers taking on a challenge first, then an idea or mentoring, to everyone', () => {
    const cards = activityChoices('hack', all, young());
    expect(cards.map((c) => c.id)).toEqual(['participate', 'idea', 'mentor']);
    expect(cards[0].title.en).toBe('Take on a company challenge');
    expect(answerCard('activity', young({ activity: 'participate' }))?.title.en).toBe('Take on a company challenge');
  });

  it('never applies to Kid InnoHack or to sites without Future InnoHack', () => {
    expect(stepsFor({ programme: 'hack', track: 'kid', activity: 'kid-idea', challengeMode: true }, VFI)).toEqual(['programme', 'track', 'role', 'activity', 'form', 'review']);
    expect(flow.youngChallenges({ programme: 'hack', activity: 'participate', challengeMode: true })).toBe(false);
  });
});

describe('the team step', () => {
  it('needs a team name, a checked joinable code, or a listed team', () => {
    expect(teamStepError(undefined, {}, L)).toBe('Choose how you take part.');
    expect(teamStepError('individual', {}, L)).toBe('');
    expect(teamStepError('create', { teamName: ' X ' }, L)).toMatch(/2–60/);
    expect(teamStepError('create', { teamName: 'Night  Owls' }, L)).toBe('');
    expect(teamStepError('join', { joinCode: 'ABCDEFGH23' }, L)).toMatch(/check it/);
    expect(teamStepError('join', { joinChecked: true, joinJoinable: false }, L)).toMatch(/can’t take new members/);
    expect(teamStepError('join', { joinChecked: true, joinJoinable: true }, L)).toBe('');
    expect(teamStepError('join', { joinTeamId: 't1' }, L)).toBe('');
  });

  it('reads invite codes the way people type them, and says team sizes only when they are decided', () => {
    expect(normaliseCode(' abcde-fgh23 ')).toBe('ABCDEFGH23');
    expect(formatCode('ABCDEFGH23')).toBe('ABCDE-FGH23');
    expect(teamSizeText({ team_size_min: null, team_size_max: null }, L)).toBeNull();
    expect(teamSizeText({ team_size_min: 2, team_size_max: 4 }, L)).toBe('2–4 people');
    expect(teamSizeText({ team_size_min: null, team_size_max: 4 }, L)).toBe('Up to 4 people');
  });
});

describe('what the details form sends', () => {
  const v = {
    contactName: ' Kim Lee ', email: 'kim@example.com', phone: '', category: 'university', organisation: 'Example University',
    skills: ['Coding & Software'], experience: '', teamName: ' Night Owls ', teamListed: true, joinCode: 'ABCDEFGH23', consentAgreed: true, gdprAgreed: true,
  };

  it('creates a team: its name and whether it is listed, the challenge, the person and both confirmations', () => {
    const p = youngPayload(v, ctxFor(young({ activity: 'participate', challenge: 'c1', team: 'create' })));
    expect(p).toEqual({
      site: 'vfi', language: 'en', challenge_id: 'c1', participation: 'create-team',
      team: { name: 'Night Owls', listed: true },
      person: { name: 'Kim Lee', email: 'kim@example.com', phone: '', category: 'university', organisation: 'Example University', skills: ['Coding & Software'], experience: '' },
      consent: { accurate: true, privacy: true },
    });
  });

  it('joins with the code, or a listed team by id; on your own sends no team; IBK sends its own site', () => {
    expect(youngPayload(v, ctxFor(young({ challenge: 'c1', team: 'join' }))).team).toEqual({ code: 'ABCDEFGH23' });
    expect(youngPayload({ ...v, joinTeamId: 't9' }, ctxFor(young({ challenge: 'c1', team: 'join' }))).team).toEqual({ id: 't9' });
    expect(youngPayload(v, ctxFor(young({ challenge: 'c1', team: 'individual' }))).team).toBeNull();
    expect(youngPayload(v, ctxFor(young({ challenge: 'c1', team: 'individual' }), CITY_SITES.ibk.site)).site).toBe('ibk');
  });

  it('turns the database\'s reasons into plain words', () => {
    expect(youngError('already_registered', L)).toMatch(/already registered/);
    expect(youngError('team_full', L)).toMatch(/not taking new members/);
    expect(youngError('team_name_taken', L)).toMatch(/Choose another name/);
    expect(youngError('something_else', L)).toBe('');
  });

  it('asks only name, email, category (required) and optional extras; free', () => {
    const ctx = ctxFor(young({ challenge: 'c1', team: 'individual' }));
    expect(youngForm.validate?.({ category: '' }, ctx)).toMatch(/gymnasium student/);
    expect(youngForm.validate?.({ category: 'professional' }, ctx)).toBe('');
    expect(youngForm.fees).toBe(false);
    expect(youngForm.submitLabel(ctxFor(young({ team: 'create' })))).toBe('Create the team and register');
  });
});
