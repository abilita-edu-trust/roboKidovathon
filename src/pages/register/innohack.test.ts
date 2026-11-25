import { describe, expect, it, vi } from 'vitest';

// The forms build links from the browser location; any site address works (as in the section tests).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
vi.mock('../../lib/supabase', () => ({ supabase: { rpc: vi.fn() }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { kidChildLimits, kidPayload, kidProblem, kidForm } = await import('./forms/kid');
const { squadPayload, squadForm, YOUNG_CATEGORIES } = await import('./forms/squad');
const { FORMS } = await import('./forms');
const { GRADE_GROUP_OPTIONS, PROFESSIONALS_GRADE_GROUP } = await import('../../data/vfiFacts');

type Path = import('./flow').RegisterPath;
type Programme = import('./flow').RegisterProgramme;
type Ctx = import('./ui').FormCtx;

const { stepsFor, pathForTab, tabForPath, formFor, isAnswered, activityChoices, roleChoices, themeChoices, hackTracks } = flow;
const VFI = VFI_SITE.intake.programmes;
const RIGA = CITY_SITES.riga.site.intake.programmes;
const VXO = CITY_SITES.vxo.site.intake.programmes;
const all = () => true;
const L = (en: string) => en;
const ctxFor = (path: Path, site = VFI_SITE): Ctx => ({
  site, language: 'en', lang: 'en', sv: false, L, path, programme: site.intake.programmes.find((p) => p.id === path.programme) as Programme, gradeOptions: GRADE_GROUP_OPTIONS,
});

describe('Future InnoHack in the register wizard (vfi and IBK only)', () => {
  it('gives the hackathon programme tracks on vfi and IBK, and none on Riga, Växjö or Eskilstuna', () => {
    expect(hackTracks(VFI)).toEqual(['kid', 'young']);
    expect(hackTracks(CITY_SITES.ibk.site.intake.programmes)).toEqual(['kid', 'young']);
    expect(hackTracks(RIGA)).toEqual([]);
    expect(hackTracks(VXO)).toEqual([]);
    expect(hackTracks(CITY_SITES.esk.site.intake.programmes)).toEqual([]);
    expect(VFI.find((p) => p.id === 'hack')).toMatchObject({ title: { en: 'Future InnoHack' }, date: { en: '5–12 December 2026' }, venue: { en: 'Mälardalen University, Västerås', sv: 'Mälardalens universitet, Västerås' } });
  });

  it('asks programme → track → how you join → pathway → form → review', () => {
    expect(stepsFor({ programme: 'hack' }, VFI)).toEqual(['programme', 'track', 'role', 'activity', 'form', 'review']);
    expect(stepsFor({ programme: 'robo' }, VFI)).toEqual(['programme', 'role', 'activity', 'form', 'review']);
    expect(stepsFor({ programme: 'hack' }, RIGA)).toEqual(['programme', 'role', 'activity', 'form', 'review']);
    expect(stepsFor({ programme: 'hack' }, VXO)).toEqual(['role', 'activity', 'form', 'review']);
  });

  it('lets a parent or guardian, a teacher or an existing team register for Kid, and keeps the three answers for Young', () => {
    expect(roleChoices('hack', all, 'kid').map((c) => [c.id, c.title.en])).toEqual([['individual', 'A parent or guardian'], ['school', 'A teacher'], ['team', 'An existing team']]);
    expect(roleChoices('hack', all, 'young').map((c) => c.id)).toEqual(['school', 'team', 'individual']);
  });

  it('gives Kid joining or a separate public idea, Young the public idea and the hackathon, and individuals also the mentor form', () => {
    expect(activityChoices('hack', all, { track: 'kid', role: 'team', v2: true }).map((c) => [c.id, c.title.en])).toEqual([['kid-idea', 'Join Kid InnoHack'], ['idea', 'An idea for the public vote']]);
    expect(activityChoices('hack', all, { track: 'young', role: 'team' }).map((c) => c.id)).toEqual(['idea', 'participate']);
    expect(activityChoices('hack', all, { track: 'young', role: 'individual' }).map((c) => c.id)).toEqual(['idea', 'participate', 'mentor']);
    expect(activityChoices('hack', all, {}).map((c) => c.id)).toEqual(['idea', 'participate']);
  });

  it('keeps Young’s public idea separate from Kid’s selection, and the squad without the old fixed areas', () => {
    expect(formFor({ programme: 'hack', track: 'kid', role: 'school', activity: 'kid-idea' })).toBe('kid');
    expect(formFor({ programme: 'hack', track: 'young', role: 'team', activity: 'participate' })).toBe('squad');
    expect(formFor({ programme: 'hack', track: 'young', role: 'individual', activity: 'idea' })).toBeNull();
    expect(formFor({ programme: 'hack', track: 'young', role: 'individual', activity: 'idea', theme: 'Energy' })).toBe('idea');
    expect(formFor({ programme: 'hack', track: 'young', role: 'individual', activity: 'mentor' })).toBe('mentor');
    expect(formFor({ programme: 'hack', track: 'kid', role: 'team', activity: 'participate', theme: 'x' })).toBeNull();
    // Kid's public idea is the idea form, once an area is chosen; it has its own link.
    expect(formFor({ programme: 'hack', track: 'kid', role: 'individual', activity: 'idea' })).toBeNull();
    expect(formFor({ programme: 'hack', track: 'kid', role: 'individual', activity: 'idea', theme: 'Energy' })).toBe('idea');
    expect(tabForPath({ programme: 'hack', track: 'kid', role: 'individual', activity: 'idea', theme: 'Energy' })).toBe('kid-submit-idea');
    expect(pathForTab('kid-submit-idea', VFI)).toEqual({ programme: 'hack', track: 'kid', activity: 'idea' });
    // Other hackathons as before.
    expect(formFor({ programme: 'hack', role: 'team', activity: 'participate' })).toBeNull();
    expect(formFor({ programme: 'hack', role: 'team', activity: 'participate', theme: 'x' })).toBe('squad');
    expect(themeChoices({ programme: 'hack', track: 'young', activity: 'participate' })).toEqual([]);
    expect(themeChoices({ programme: 'hack', activity: 'participate' }).length).toBe(4);
    expect(isAnswered('track', { programme: 'hack' })).toBe(false);
    expect(isAnswered('activity', { programme: 'hack', track: 'young', activity: 'participate' })).toBe(true);
    expect(isAnswered('activity', { programme: 'hack', track: 'kid', activity: 'kid-idea' })).toBe(true);
    expect(isAnswered('activity', { programme: 'hack', activity: 'participate' })).toBe(false);
  });

  it('keeps every old link working and adds the two track links', () => {
    expect(pathForTab('hackathon', VFI)).toEqual({ programme: 'hack', activity: 'participate' });
    const fromOldLink = pathForTab('hackathon', VFI);
    expect(stepsFor(fromOldLink, VFI).find((k) => !isAnswered(k, fromOldLink))).toBe('track');
    expect(pathForTab('kid-innohack', VFI)).toEqual({ programme: 'hack', track: 'kid', activity: 'kid-idea' });
    expect(pathForTab('young-innohack', VFI)).toEqual({ programme: 'hack', track: 'young', activity: 'participate' });
    expect(pathForTab('submit-idea', VFI)).toEqual({ programme: 'hack', track: 'young', activity: 'idea' });
    expect(pathForTab('mentor', VFI)).toEqual({ programme: 'community', role: 'mentor' });
    // Where there are no tracks the new links behave like the old hackathon link.
    expect(pathForTab('kid-innohack', RIGA)).toEqual({ programme: 'hack', activity: 'participate' });
    expect(pathForTab('submit-idea', VXO)).toEqual({ programme: 'hack', activity: 'idea' });
    expect(tabForPath({ programme: 'hack', track: 'kid', role: 'team', activity: 'kid-idea' })).toBe('kid-innohack');
    expect(tabForPath({ programme: 'hack', track: 'young', role: 'team', activity: 'participate' })).toBe('young-innohack');
    expect(tabForPath({ programme: 'hack', role: 'team', activity: 'participate', theme: 'x' })).toBe('hackathon');
  });
});

describe('Kid InnoHack form', () => {
  const child = (n: number, over = {}) => ({ full_name: `Child ${n}`, grade: '5', guardian_name: `Parent ${n}`, guardian_email: `PARENT${n}@example.org`, guardian_phone: '', availability: ['s1', 's2', 's3', 's4', 's5'], ...over });
  const values = (children: object[], over = {}) => ({ orgName: 'Skola', contactName: 'Anna', email: 'anna@example.org', guardianNotice: true, children, ...over });

  it('takes one child or a group of up to four: a parent or a teacher 1–4, an existing team 2–4', () => {
    expect([kidChildLimits('school'), kidChildLimits('team'), kidChildLimits('individual')]).toEqual([{ min: 1, max: 4 }, { min: 2, max: 4 }, { min: 1, max: 4 }]);
    expect(kidProblem(values([child(1)]), 'team', L)).toMatch(/2–4 children/);
    expect(kidProblem(values([child(1), child(2), child(3), child(4), child(5)]), 'school', L)).toMatch(/1–4 children/);
    expect(kidProblem(values([child(1), child(2)]), 'individual', L)).toBe('');
    expect(kidProblem(values([child(1), child(2)]), 'team', L)).toBe('');
  });

  it('asks no idea, but the sessions each child can attend', () => {
    expect(kidProblem(values([child(1, { availability: [] })]), 'individual', L)).toMatch(/sessions child 1 can attend/);
    expect(kidProblem(values([child(1, { availability: ['s1', 's5'] })]), 'individual', L)).toBe('');
  });

  it('needs a grade 3–9 and a guardian with a valid email for every child, and the guardian acknowledgement', () => {
    expect(kidProblem(values([child(1, { grade: '2' })]), 'school', L)).toMatch(/grade \(3–9\)/);
    expect(kidProblem(values([child(1, { guardian_name: '' })]), 'school', L)).toMatch(/parent or guardian/);
    expect(kidProblem(values([child(1, { guardian_email: 'nope' })]), 'school', L)).toMatch(/valid guardian email/);
    expect(kidProblem(values([child(1)], { guardianNotice: false }), 'school', L)).toMatch(/guardian confirmation/);
  });

  it('sends the children with their guardians and sessions, no idea, and the site it came from (for the confirmation link)', () => {
    const p = kidPayload(values([child(1), child(2, { availability: ['s1', 's3'] })], { teamName: 'Stars', consentAgreed: true, gdprAgreed: true }), ctxFor({ programme: 'hack', track: 'kid', role: 'team', activity: 'kid-idea' }));
    expect(p).toMatchObject({ kind: 'participation', site: 'vfi', role: 'team', team_name: 'Stars', school_name: 'Skola', contact_email: 'anna@example.org' });
    expect(p).not.toHaveProperty('idea');
    expect((p.children as { guardian_email: string }[]).map((c) => c.guardian_email)).toEqual(['parent1@example.org', 'parent2@example.org']);
    expect((p.children as { availability: object }[])[1].availability).toEqual({ s1: true, s2: false, s3: true, s4: false, s5: false });
    expect(p.consent).toEqual({ submitter_confirmed: true, privacy_accepted: true, guardian_notice: true });
    const ibk = kidPayload(values([child(1)]), ctxFor({ programme: 'hack', track: 'kid', role: 'individual', activity: 'kid-idea' }, CITY_SITES.ibk.site));
    expect(ibk.site).toBe('ibk');
  });

  it('is free and is the form for Kid InnoHack', () => {
    expect(FORMS.kid).toBe(kidForm);
    expect(kidForm.fees).toBe(false);
  });
});

describe('Young InnoHack squad form', () => {
  const base = { contactName: 'Eva', email: 'eva@example.org', members: [{ full_name: 'Eva', grade: '' }], skills: ['Coding & Software'], consentAgreed: true };

  it('saves the track, category and interests next to the existing hackathon fields, without fees', () => {
    const ctx = ctxFor({ programme: 'hack', track: 'young', role: 'individual', activity: 'participate' });
    const p = squadPayload({ ...base, category: 'professional', organisation: 'Volvo', teamPreference: 'match-me', challengeInterests: ['Water'], experience: '10 years' }, ctx);
    expect(p).toMatchObject({ form_type: 'hackathon', category_id: 'young-innovators-hackathon', grade_group: PROFESSIONALS_GRADE_GROUP, registration_type: 'student' });
    expect(p.intake_details).toEqual({
      innohack_track: 'young', participant_category: 'professional', organisation: 'Volvo', team_preference: 'match-me',
      challenge_interests: ['Water'], challenge_domain: 'Water', squad_skills: ['Coding & Software'], experience: '10 years',
    });
    expect((squadForm.fees as (c: Ctx) => boolean)(ctx)).toBe(false);
    expect(YOUNG_CATEGORIES.map((c) => c.gradeGroup)).toEqual([GRADE_GROUP_OPTIONS[3], GRADE_GROUP_OPTIONS[4], PROFESSIONALS_GRADE_GROUP]);
    expect(squadForm.validate!({ ...base }, ctx)).toMatch(/at gymnasium, at university or working/);
  });

  it('sends exactly what it sent before on sites without tracks (Växjö, Riga) and without a track', () => {
    const legacy = ctxFor({ programme: 'hack', role: 'team', activity: 'participate', theme: 'Sustainable Cities & Climate' }, CITY_SITES.vxo.site);
    const v = { ...base, teamName: 'Bots', gradeGroup: 'Årskurs 7–9 (Hackathon Basic · Ages 13–15)', members: [{ full_name: 'A', grade: '8' }, { full_name: 'B', grade: '' }] };
    expect(squadPayload(v, legacy)).toEqual({
      language: 'en', registration_type: 'student', ...squadPayload(v, legacy),
      school_name: 'Bots (Team)', team_name: 'Bots', contact_name: 'Eva', email: 'eva@example.org', phone: '',
      category_id: 'young-innovators-hackathon', student_count: '2', members: [{ full_name: 'A', grade: '8' }, { full_name: 'B', grade: null }],
      preferred_date: 'To be confirmed', custom_date: null, custom_time: null, time_range: null, workshop_slot: 'custom',
      grade_group: 'Årskurs 7–9 (Hackathon Basic · Ages 13–15)', consent_agreed: true, form_type: 'hackathon',
      intake_details: { squad_skills: ['Coding & Software'], challenge_domain: 'Sustainable Cities & Climate' },
    });
    expect((squadForm.fees as (c: Ctx) => boolean)(legacy)).toBe(true);
  });
});

describe('Future InnoHack pages, shared track data and programme section', () => {
  it('serves the guardian confirmation and privacy notice on vfi and IBK', async () => {
    const { pathForRoute, routeFromPath } = await import('../../lib/routes');
    const { cityPageFor } = await import('../../components/city/citySites');
    expect(['guardian', 'privacy', 'ibk-guardian', 'ibk-privacy'].map(pathForRoute)).toEqual(['/guardian', '/privacy', '/ibk/guardian', '/ibk/privacy']);
    expect(routeFromPath('/guardian')).toBe('guardian');
    expect(routeFromPath('/ibk/guardian')).toBe('ibk-guardian');
    expect(cityPageFor('ibk-guardian')).toMatchObject({ page: 'guardian', city: { route: 'ibk' } });
    expect(cityPageFor('ibk-privacy')).toMatchObject({ page: 'privacy', city: { route: 'ibk' } });
    // A Site CMS page can't take these addresses.
    expect(routeFromPath('/ibk/about')).toBe('ibk/about');
  });

  it('reads the tracks from Find Your Path in the site document, and none where there are none', async () => {
    const { innohackTracksFrom } = await import('../../content/innohackContext');
    const { journeyDefaults } = await import('../../content/sections/journey');
    const doc = (j: unknown) => [{ id: 'journey', type: 'journey', visible: true, data: j as Record<string, unknown> }];
    expect(innohackTracksFrom(doc(journeyDefaults(VFI_SITE))).map((t) => t.id)).toEqual(['kid', 'young']);
    expect(innohackTracksFrom(doc(journeyDefaults(CITY_SITES.riga.site)))).toEqual([]);
    expect(innohackTracksFrom([])).toEqual([]);
  });

  it('gives vfi and IBK the Future InnoHack programme card and venues, and Riga its own as before', async () => {
    const { experienceDefaults } = await import('../../content/sections/programmes');
    const vfi = experienceDefaults(VFI_SITE);
    expect(vfi.cards.map((c) => [c.title.en, c.steps.length])).toEqual([['RoboKidovation', 6], ['Future InnoHack', 0]]);
    expect(vfi.cards[1].register?.href).toBe('/register?tab=hackathon');
    expect(vfi.venues.map((v) => v.name.en)).toEqual(['MISV', 'Mälardalen University', 'Online']);
    expect(vfi.stripRight.en).toBe('VÄSTERÅS | 5–12 DECEMBER 2026');
    expect(experienceDefaults(CITY_SITES.ibk.site).cards[1].register?.href).toBe('/ibk/register?tab=hackathon');
    const riga = experienceDefaults(CITY_SITES.riga.site);
    expect(riga.cards[1].title.en).toBe('Young Inno Hack');
    expect(riga.cards[1].steps.length).toBe(6);
  });

  it('names the hackathon sessions Future InnoHack on vfi and IBK only', async () => {
    const { meetUsDefaults } = await import('../../content/sections/live');
    expect(meetUsDefaults({ config: VFI_SITE }).kinds.hackathon.en).toBe('Future InnoHack');
    expect(meetUsDefaults({ config: CITY_SITES.riga.site }).kinds.hackathon.en).toBe('Young Inno Hack');
    expect(meetUsDefaults().kinds.hackathon.en).toBe('Young Inno Hack');
  });

  it('shows the hero with RoboKidovation and Future InnoHack (5–12 December), the badge off until the CMS turns it on', async () => {
    const { heroDefaults, visiblePromo } = await import('../../content/sections/frame');
    const hero = heroDefaults(VFI_SITE);
    expect(hero.events.map((e) => [e.title.en, e.date.en, e.href])).toEqual([
      ['RoboKidovation', '5 DECEMBER', '/register?tab=competition'],
      ['Future InnoHack', '5–12 DECEMBER', '/register?tab=hackathon'],
    ]);
    expect(visiblePromo(hero)).toBeNull();
  });

  it('names both finals in the hero date boxes, the footer and the site description', async () => {
    const { heroDefaults } = await import('../../content/sections/frame');
    const { SITE_META } = await import('../../data/siteMeta');
    const facts = heroDefaults(VFI_SITE).facts.map((f) => [f.label.en, f.value.en]);
    expect(facts).toContainEqual(['ROBOKIDOVATION FINAL', '5 DECEMBER 2026']);
    expect(facts).toContainEqual(['FUTURE INNOHACK FINAL', '12 DECEMBER 2026']);
    expect(facts.map(([label]) => label)).not.toContain('FINAL DATE');
    expect(VFI_SITE.footer.registerText.en).toContain('RoboKidovation on 5 December 2026');
    expect(VFI_SITE.footer.registerText.en).toContain('Future InnoHack on 12 December 2026');
    expect(SITE_META.vfi.description).toContain('RoboKidovation final on 5 December 2026; Future InnoHack final on 12 December 2026.');
    // Riga and Eskilstuna keep their own.
    expect(CITY_SITES.riga.site.hero.facts).toContainEqual({ label: 'FINAL DATE', value: '6 FEBRUARY 2027' });
  });

  it('tells senders that guardians confirm by 5 December 2026 at 10:00 Swedish time', () => {
    const done = kidForm.done(ctxFor({ programme: 'hack', track: 'kid', role: 'school', activity: 'kid-idea' }), { email: 'a@b.se' });
    expect(done.body).toContain('by 5 December 2026 at 10:00 Swedish time');
  });
});

describe('privacy notice (approved 21 November 2026)', () => {
  it('is published, at the version the database records with each guardian confirmation (2026-11-17)', async () => {
    const { PRIVACY_NOTICE_APPROVED, PRIVACY_VERSION } = await import('../PrivacyNoticePage');
    expect(PRIVACY_NOTICE_APPROVED).toBe(true);
    expect(PRIVACY_VERSION).toBe('2026-11-17');
  });

  it('covers the organisations, legal basis, guardian and photo consent, retention and deletion, in English and Swedish', async () => {
    const { PRIVACY_SECTIONS } = await import('../PrivacyNoticePage');
    expect(PRIVACY_SECTIONS.map((s) => s.title.en)).toEqual([
      'Who is responsible', 'What we collect', 'Children’s data', 'Why we use it, and the legal basis', 'Guardian confirmation',
      'Photos and videos (optional)', 'Who sees it', 'How long we keep it', 'Deleting your data', 'Your rights', 'Changes to this notice',
    ]);
    for (const s of PRIVACY_SECTIONS) {
      for (const t of [s.title, ...s.paragraphs, ...(s.items ?? [])]) {
        expect(t.en.trim()).not.toBe('');
        expect(t.sv.trim()).not.toBe('');
        expect(t.sv).not.toBe(t.en);
      }
    }
    const text = JSON.stringify(PRIVACY_SECTIONS);
    expect(text).toContain('5 December 2026 at 10:00 Swedish time');
    // The controller and the one contact address for data requests.
    expect(text).toContain('INIAC is the data controller');
    expect(text.match(/contact@iniac\.se/g)?.length).toBeGreaterThanOrEqual(5);
    expect(text).not.toMatch(/robokidovation\.se/);
    expect(text).toContain('until 12 December 2027');
    expect(text).toContain('until 12 December 2028');
    expect(text).toContain('5 december 2026 kl. 10.00 svensk tid');
  });
});

describe('idea deadline 1 December 2026 and no fees in the registration forms (vfi and IBK)', () => {
  it('hides the participation-fee box under every form on vfi and IBK; Riga, Eskilstuna and Växjö already do', () => {
    expect(VFI_SITE.intake.showFees).toBe(false);
    expect(CITY_SITES.ibk.site.intake.showFees).toBe(false);
    for (const s of ['riga', 'esk', 'vxo'] as const) expect(CITY_SITES[s].site.intake.showFees).toBe(false);
  });

  it('names 3 December 2026 for Kid InnoHack registration, and 1 December 2026 for the public ideas', async () => {
    const { innohackTracks, IDEAS_CLOSE_AT, KID_REGISTRATION_CLOSE_AT } = await import('../../content/sections/innohack');
    expect(IDEAS_CLOSE_AT).toBe('2026-12-01T23:59:59+01:00');
    expect(KID_REGISTRATION_CLOSE_AT).toBe('2026-12-03T23:59:59+01:00');
    const kid = innohackTracks((t) => `/register?tab=${t}`)[0];
    expect(kid.schedule[0].date).toEqual({ en: 'By 3 December 2026', sv: 'Senast 3 december 2026' });
    expect(JSON.stringify(kid)).not.toMatch(/Växhuset|Five ideas|selected/);
    const all = () => true;
    expect(activityChoices('hack', all, { track: 'kid', role: 'team' })[0].desc.en).toContain('Register by 3 December');
    expect(activityChoices('hack', all, { track: 'kid', role: 'team' })[1].desc.en).toContain('by 1 December 2026');
    const young = activityChoices('hack', all, { track: 'young', role: 'team' }).find((c) => c.id === 'idea')!;
    expect(young.desc.en).toBe('Share an idea by 1 December 2026; approved ideas go up for everyone to vote on.');
    // Other hackathons (Riga, Växjö) keep the plain card.
    expect(activityChoices('hack', all, { role: 'team' }).find((c) => c.id === 'idea')!.desc.en).not.toContain('December');
    const { ideaForm } = await import('./forms/idea');
    expect(ideaForm.intro(ctxFor({ programme: 'hack', track: 'young', role: 'team', activity: 'idea' }))).toContain('Ideas close on 1 December 2026 at 23:59 Swedish time.');
    expect(ideaForm.intro(ctxFor({ programme: 'hack', role: 'team', activity: 'idea' }))).not.toContain('December');
    const done = kidForm.done(ctxFor({ programme: 'hack', track: 'kid', role: 'team', activity: 'kid-idea' }), { email: 'a@b.se' });
    expect(done.body).toContain('by 5 December 2026 at 10:00');
  });

  it('closes Kid InnoHack after 3 December 2026 23:59 Swedish time, whatever the Site CMS switch says', async () => {
    const { kidRegistrationClosed, innohackTracks } = await import('../../content/sections/innohack');
    const { closeKidAfterDeadline } = await import('../../content/innohackContext');
    const before = Date.parse('2026-12-03T23:59:00+01:00');
    const after = Date.parse('2026-12-04T00:00:30+01:00');
    expect([kidRegistrationClosed(before), kidRegistrationClosed(after)]).toEqual([false, true]);
    const open = innohackTracks((t) => t).map((t) => (t.id === 'kid' ? { ...t, registrationOpen: true } : t));
    expect(closeKidAfterDeadline(open, before).find((t) => t.id === 'kid')!.registrationOpen).toBe(true);
    const closed = closeKidAfterDeadline(open, after);
    expect(closed.find((t) => t.id === 'kid')).toMatchObject({ registrationOpen: false, closedMessage: { en: 'Registration closed on 3 December 2026' } });
    expect(closed.find((t) => t.id === 'young')!.registrationOpen).toBe(true);
  });
});
