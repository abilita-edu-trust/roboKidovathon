import { describe, expect, it, vi } from 'vitest';

(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
vi.mock('../../lib/supabase', () => ({ supabase: { rpc: vi.fn() }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { youngPayload, youngError, youngForm } = await import('./forms/young');
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

  it('needs two different choices before the details form; the final challenge is not part of the answers', () => {
    expect(formFor(young({ activity: 'participate', team: 'individual' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', team: 'individual', first: 'c1', second: 'c1' }))).toBeNull();
    expect(formFor(young({ activity: 'participate', team: 'individual', first: 'c1', second: 'c2' }))).toBe('young');
    expect(formFor(young({ activity: 'participate', team: 'join', first: 'c1', second: 'c2' }))).toBe('young');
    expect(isAnswered('choices', young({ first: 'c1', second: 'c2' }))).toBe(true);
    expect(isAnswered('choices', young({ first: 'c1' }))).toBe(false);
    expect(tabForPath(young({ activity: 'participate', team: 'create', first: 'c1', second: 'c2' }))).toBe('young-innohack');
    expect(pathForTab('young-innohack', VFI)).toEqual({ programme: 'hack', track: 'young', activity: 'participate' });
    expect(FORMS.young).toBe(youngForm);
  });

  it('offers taking on a challenge first, with a line icon instead of an emoji', () => {
    const cards = activityChoices('hack', all, young());
    expect(cards.map((c) => c.id)).toEqual(['participate', 'idea', 'mentor']);
    expect(cards[0].title.en).toBe('Take on a company challenge');
    expect(cards.every((c) => /^[A-Z][A-Za-z0-9]+$/.test(c.icon))).toBe(true);
    expect(answerCard('activity', young({ activity: 'participate' }))?.title.en).toBe('Take on a company challenge');
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
    expect(choicesError(undefined, undefined, L)).toBe('Choose a first and a second challenge.');
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
  };

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
    expect(done.body).toMatch(/which challenge your team gets/);
    expect(done.body).not.toMatch(/first choice|guarantee/i);
    expect(youngForm.submitLabel(ctxFor(young({ team: 'create' })))).toBe('Start the team');
  });
});
