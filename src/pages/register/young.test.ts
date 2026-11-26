import { describe, expect, it, vi } from 'vitest';

(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
vi.mock('../../lib/supabase', () => ({ supabase: { rpc: vi.fn() }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { youngPayload, youngError, youngForm, youngProblem } = await import('./forms/young');
const { teamStepError, choicesError } = await import('./YoungSteps');
const { normaliseCode, formatCode, teamSizeText, toYoungState } = await import('../../content/youngChallenges');
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
const young = (extra: Partial<Path> = {}): Path => ({ programme: 'hack', track: 'young', challengeMode: true, v2: true, ...extra });

describe('Young InnoHack with company challenges: how you take part, then two choices', () => {
  it('asks how you take part first, then two choices; ideas ask who sends them; mentoring goes straight to its form', () => {
    expect(stepsFor(young({ activity: 'participate' }), VFI)).toEqual(['programme', 'track', 'activity', 'team', 'choices', 'form', 'review']);
    expect(stepsFor(young(), VFI)).toEqual(['programme', 'track', 'activity', 'team', 'choices', 'form', 'review']);
    expect(stepsFor(young({ activity: 'idea' }), VFI)).toEqual(['programme', 'track', 'activity', 'role', 'form', 'review']);
    expect(stepsFor(young({ activity: 'mentor' }), VFI)).toEqual(['programme', 'track', 'activity', 'form', 'review']);
  });

  it('keeps today\'s Young InnoHack flow while no challenge is published', () => {
    const path: Path = { programme: 'hack', track: 'young', activity: 'participate' };
    expect(stepsFor(path, VFI)).toEqual(['programme', 'track', 'role', 'activity', 'form', 'review']);
    expect(formFor({ ...path, role: 'team' })).toBe('squad');
  });

  it('needs a 1st theme (a different 2nd is optional) before the details form; the final theme is not part of the answers', () => {
    expect(formFor(young({ activity: 'participate', team: 'individual' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', team: 'individual', first: 'c1', second: 'c1' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', team: 'individual', first: 'c1', second: 'c2' }))).toBe('young');
    expect(formFor(young({ activity: 'participate', team: 'join', first: 'c1', second: 'c2' }))).toBe('young');
    expect(isAnswered('choices', young({ first: 'c1', second: 'c2' }))).toBe(true);
    expect(isAnswered('choices', young({ first: 'c1' }))).toBe(true);
    expect(isAnswered('choices', young({}))).toBe(false);
    expect(tabForPath(young({ activity: 'participate', team: 'create', first: 'c1', second: 'c2' }))).toBe('young-innohack');
    expect(pathForTab('young-innohack', VFI)).toEqual({ programme: 'hack', track: 'young', activity: 'participate' });
    expect(FORMS.young).toBe(youngForm);
  });

  it('offers taking on a challenge first, with a line icon instead of an emoji', () => {
    const cards = activityChoices('hack', all, young());
    expect(cards.map((c) => c.id)).toEqual(['participate', 'idea', 'mentor']);
    expect(cards[0].title.en).toBe('Join Young InnoHack');
    expect(cards.every((c) => /^[A-Z][A-Za-z0-9]+$/.test(c.icon))).toBe(true);
    expect(answerCard('activity', young({ activity: 'participate' }))?.title.en).toBe('Join Young InnoHack');
  });

  it('never applies to Kid InnoHack', () => {
    expect(stepsFor({ programme: 'hack', track: 'kid', activity: 'kid-idea', challengeMode: true }, VFI)).toEqual(['programme', 'track', 'role', 'activity', 'form', 'review']);
  });
});

describe('the website reads what the database publishes', () => {
  it('open only with the switch on and at least two published challenges; anything else is "nothing yet"', () => {
    const ch = (id: string) => ({ id, slot: 1, company: 'X', logo: '', title: { en: 't', sv: '' }, short: { en: 's', sv: '' }, problem: { en: '', sv: '' }, requirements: { en: '', sv: '' } });
    expect(toYoungState({ registration_open: true, team_size_max: 4, listed_teams: false, challenges: [ch('a'), ch('b')] })).toMatchObject({ registrationOpen: true, teamSizeMax: 4, challenges: [{ id: 'a' }, { id: 'b' }] });
    expect(toYoungState({ registration_open: true, challenges: [ch('a')] }).registrationOpen).toBe(false);
    expect(toYoungState({ registration_open: false, challenges: [ch('a'), ch('b')] }).registrationOpen).toBe(false);
    // The older database answered with a list: the site treats that as no challenges (today's form).
    expect(toYoungState([ch('a')]).challenges).toEqual([]);
    expect(toYoungState(null).challenges).toEqual([]);
  });
});

describe('steps 1 and 2', () => {
  it('step 1 needs a team name, a checked joinable code, or a listed team', () => {
    expect(teamStepError(undefined, {}, L)).toBe('Choose how you will take part.');
    expect(teamStepError('individual', {}, L)).toBe('');
    expect(teamStepError('create', { teamName: ' X ' }, L)).toMatch(/2–60/);
    expect(teamStepError('create', { teamName: 'Night  Owls' }, L)).toBe('');
    expect(teamStepError('join', { joinCode: 'ABCDEFGH23' }, L)).toMatch(/check it first/);
    expect(teamStepError('join', { joinChecked: true, joinJoinable: false }, L)).toMatch(/can’t take more people/);
    expect(teamStepError('join', { joinChecked: true, joinJoinable: true }, L)).toBe('');
    expect(teamStepError('join', { joinTeamId: 't1' }, L)).toBe('');
  });

  it('step 2 needs two different challenges', () => {
    expect(choicesError(undefined, undefined, L)).toBe('Choose a first theme, or “Open to any theme”.');
    expect(choicesError('c1', undefined, L)).toBe('');
    expect(choicesError('any', undefined, L)).toBe('');
    expect(choicesError('c1', 'c1', L)).toBe('Choose a different second theme, or none.');
    expect(choicesError('a', 'a', L)).not.toBe('');
    expect(choicesError('a', 'b', L)).toBe('');
  });

  it('reads codes the way people type them, and gives the team size only when decided', () => {
    expect(normaliseCode(' abcde-fgh23 ')).toBe('ABCDEFGH23');
    expect(formatCode('ABCDEFGH23')).toBe('ABCDE-FGH23');
    expect(teamSizeText(null, null, L)).toBeNull();
    expect(teamSizeText(2, 4, L)).toBe('2–4 people');
    expect(teamSizeText(null, 4, L)).toBe('up to 4 people');
  });
});

describe('what the details form sends', () => {
  const v = {
    contactName: ' Kim Lee ', email: 'kim@example.com', phone: '', category: 'university', organisation: '',
    skills: [], experience: '', teamName: ' Night Owls ', teamListed: true, joinCode: 'ABCDEFGH23', consentAgreed: true, gdprAgreed: true,
    attendance: 'hybrid', youngSessions: ['y1', 'y3'], under18: 'no',
  };

  it('a 1st theme is enough; the 2nd is optional; "open to any theme" sends no themes', () => {
    const one = youngPayload(v, ctxFor(young({ team: 'individual', first: 'c1' })));
    expect(one).toMatchObject({ open_to_any: false, first_choice_id: 'c1', second_choice_id: null });
    const any = youngPayload(v, ctxFor(young({ team: 'create', first: 'any', second: 'c2' })));
    expect(any).toMatchObject({ open_to_any: true, first_choice_id: null, second_choice_id: null });
    expect(flow.twoChoices(young({ team: 'individual', first: 'c1' }))).toBe(true);
    expect(flow.twoChoices(young({ team: 'individual', first: 'any' }))).toBe(true);
    expect(flow.twoChoices(young({ team: 'individual' }))).toBe(false);
    expect(flow.twoChoices(young({ team: 'join' }))).toBe(true);
  });

  it('sends hybrid or fully online, the sessions you can attend, and no guardian when 18 or older', () => {
    const p = youngPayload(v, ctxFor(young({ team: 'individual', first: 'c1', second: 'c2' })));
    expect(p).toMatchObject({ attendance: 'hybrid', availability: { y1: true, y2: false, y3: true }, person: { under_18: false }, guardian: null });
    expect(youngPayload({ ...v, attendance: 'online' }, ctxFor(young({ team: 'individual', first: 'c1', second: 'c2' }))).attendance).toBe('online');
  });

  it('under 18: needs a parent or guardian with their own email, and sends them', () => {
    const minor = { ...v, under18: 'yes', guardianName: ' Maria Lee ', guardianEmail: 'maria@example.com', guardianPhone: '' };
    expect(youngPayload(minor, ctxFor(young({ team: 'individual', first: 'c1', second: 'c2' })))).toMatchObject({
      person: { under_18: true }, guardian: { name: 'Maria Lee', email: 'maria@example.com', phone: '' },
    });
    expect(youngProblem(minor, L)).toBe('');
    expect(youngProblem({ ...minor, guardianEmail: 'kim@example.com' }, L)).toMatch(/own email/);
    expect(youngProblem({ ...minor, guardianName: '' }, L)).toMatch(/parent or guardian’s name and email/);
  });

  it('asks how you take part, which sessions and your age before the review', () => {
    expect(youngProblem(v, L)).toBe('');
    expect(youngProblem({ ...v, attendance: '' }, L)).toMatch(/hybrid or fully online/);
    expect(youngProblem({ ...v, youngSessions: [] }, L)).toMatch(/sessions you can attend/);
    expect(youngProblem({ ...v, under18: '' }, L)).toMatch(/under 18 on 10 December 2026/);
    expect(youngError('hybrid_full', L)).toMatch(/50 on-campus places.*fully online/);
    expect(youngError('online_full', L)).toMatch(/25 online places/);
    expect(youngError('teams_full', L)).toMatch(/15 teams/);
  });

  it('starting a team sends its name and both choices', () => {
    const p = youngPayload(v, ctxFor(young({ activity: 'participate', team: 'create', first: 'c1', second: 'c2' })));
    expect(p).toMatchObject({ site: 'vfi', participation: 'create-team', first_choice_id: 'c1', second_choice_id: 'c2', team: { name: 'Night Owls', listed: true }, consent: { accurate: true, privacy: true } });
  });

  it('joining sends no choices (the team\'s are kept by the database); on your own sends none for a team; IBK its own site', () => {
    const join = youngPayload(v, ctxFor(young({ team: 'join', first: 'c1', second: 'c2' })));
    expect(join).toMatchObject({ participation: 'join-team', first_choice_id: null, second_choice_id: null, team: { code: 'ABCDEFGH23' } });
    expect(youngPayload({ ...v, joinTeamId: 't9' }, ctxFor(young({ team: 'join' }))).team).toEqual({ id: 't9' });
    expect(youngPayload(v, ctxFor(young({ team: 'individual', first: 'c1', second: 'c2' }))).team).toBeNull();
    expect(youngPayload(v, ctxFor(young({ team: 'individual', first: 'c1', second: 'c2' }), CITY_SITES.ibk.site)).site).toBe('ibk');
  });

  it('turns the database\'s reasons into plain words', () => {
    expect(youngError('already_registered', L)).toMatch(/already registered/);
    expect(youngError('team_full', L)).toMatch(/full or not taking new people/);
    expect(youngError('invalid_choice', L)).toMatch(/choose again/);
    expect(youngError('closed', L)).toMatch(/closed/);
    expect(youngError('other', L)).toBe('');
  });

  it('never promises a challenge on the confirmation', () => {
    const done = youngForm.done(ctxFor(young({ team: 'create', first: 'c1', second: 'c2' })), { email: 'kim@example.com' });
    expect(done.body).toMatch(/which theme your team gets/);
    expect(done.body).not.toMatch(/first choice|guarantee/i);
    expect(youngForm.submitLabel(ctxFor(young({ team: 'create' })))).toBe('Start the team');
    const minorDone = youngForm.done(ctxFor(young({ team: 'individual' })), { email: 'kim@example.com', under18: 'yes', guardianEmail: 'maria@example.com' });
    expect(minorDone.body).toMatch(/maria@example\.com\) now gets an email to confirm by 10 December 2026 at 12:00/);
  });
});
