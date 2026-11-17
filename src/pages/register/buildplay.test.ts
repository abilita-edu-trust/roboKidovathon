import { describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';

// The forms build links from the browser location; any site address works (as in the other register tests).
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const rpc = vi.fn(async () => ({ data: 'EU-SWE-VAST-001', error: null }));
vi.mock('../../lib/supabase', () => ({ supabase: { rpc }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { buildPlayForm, BUILD_PLAY_GRADES } = await import('./forms/buildPlay');
const { categoryOptions } = await import('./forms/competition');
const { FORMS } = await import('./forms');
const { BUILD_PLAY_GRADE_GROUP, GRADE_GROUP_OPTIONS } = await import('../../data/vfiFacts');
const { experienceDefaults } = await import('../../content/sections/programmes');
const { teamsDefaults } = await import('../../content/sections/teams');
const { heroDefaults } = await import('../../content/sections/frame');
const { feesDefaults } = await import('../../content/sections/simple');
const { journeyDefaults } = await import('../../content/sections/journey');

type Path = import('./flow').RegisterPath;
type Site = typeof VFI_SITE;
const L = (en: string) => en;
const ctxFor = (path: Path, site: Site = VFI_SITE) =>
  ({ site, language: 'en', lang: 'en', sv: false, L, path, programme: site.intake.programmes[0], gradeOptions: GRADE_GROUP_OPTIONS }) as import('./ui').FormCtx;
const IBK = CITY_SITES.ibk.site;
const RIGA = CITY_SITES.riga.site;
const ESK = CITY_SITES.esk.site;
const accepting = (site: Site) => (tab: import('./flow').IntakeProgramTab) => (tab === 'build-play' ? !!site.intake.buildAndPlay : true);
const BP: Path = { programme: 'robo', role: 'individual', activity: 'build-play' };

describe('RoboKidovation categories on vfi and IBK: Build & Play, Junior Robo Sprint, Senior Robo Sprint', () => {
  it('gives the RoboKidovation box a row per category, each linking to its detailed section', () => {
    for (const site of [VFI_SITE, IBK]) {
      const cards = experienceDefaults(site).categories;
      expect(cards.map((c) => [c.id, c.name.en, c.grades.en, c.description.en])).toEqual([
        ['build-play', 'Build & Play', 'Preschool–Grade 2', 'Free · with a parent · 5 December 2026'],
        ['junior', 'Junior Robo Sprint', 'Grades 3–6', 'Build, race and compete'],
        ['senior', 'Senior Robo Sprint', 'Grades 7–9', 'Design, test and compete'],
      ]);
      expect(cards.every((c) => c.description.sv && c.grades.sv)).toBe(true);
      expect(cards.map((c) => c.href.split('#')[1])).toEqual(['robokido-build-play', 'robokido-junior', 'robokido-senior']);
    }
    expect(experienceDefaults(IBK).categories[0].href).toBe('/ibk#robokido-build-play');
    expect(experienceDefaults(RIGA).categories).toEqual([]);
  });

  it('gives both boxes a footer with the final day and venue, and Future InnoHack a short line per track', () => {
    const x = experienceDefaults(VFI_SITE);
    expect([x.finalLabel.en, x.roboFinal.date.en, x.roboFinal.venue.en, x.hackFinal.date.en, x.hackFinal.venue.en]).toEqual(['Final day', '5 December 2026', 'MISV, Västerås', '12 December 2026', 'Växhuset, Västerås']);
    expect(x.roboFinal.cta.href).toBe('/#teams-final-day');
    expect(experienceDefaults(IBK).roboFinal.cta.href).toBe('/ibk#teams-final-day');
    expect(x.trackPanels.map((p) => [p.id, p.icon])).toEqual([['kid', 'Users'], ['young', 'GraduationCap']]);
  });

  it('shows each full poster with its details; Build & Play: free, 5 December 2026 at MISV, no competition', () => {
    const posters = teamsDefaults(VFI_SITE).posters;
    expect(posters.map((p) => p.id)).toEqual(['build-play', 'junior', 'senior']);
    for (const p of posters) {
      expect(existsSync(new URL(`../../../public${p.image}`, import.meta.url))).toBe(true);
      expect(p.imageAlt.en.length).toBeGreaterThan(60);
      expect(p.imageAlt.sv.length).toBeGreaterThan(60);
    }
    const bp = posters[0];
    expect(bp.grades.en).toBe('Preschool–Grade 2');
    expect(bp.tagline.en).toBe('Come with your parents. Build, play and discover robotics together!');
    expect(Object.fromEntries(bp.facts.map((f) => [f.label.en, f.value.en]))).toEqual({
      Who: 'Preschool to grade 2, including children younger than förskoleklass. A parent or guardian comes with each child.',
      When: '5 December 2026',
      Where: 'Mälardalen International School (MISV), Västerås',
      Fee: 'Free',
      Format: 'Hands-on robotics for a parent and child together. No competition, scoring, judging, rankings or prizes.',
      Experience: 'No previous robotics knowledge needed.',
    });
    // Every fact has Swedish (an empty Swedish text means the same as the English, e.g. the venue's name).
    expect(bp.facts.every((f) => f.label.sv && (f.value.sv || f.label.en === 'Where'))).toBe(true);
    expect(bp.imageAlt.en).toContain('preschool to grade 2');
    expect(bp.imageAlt.en).not.toMatch(/1–3/);
    expect(posters.map((p) => [p.register.label.en, p.register.href])).toEqual([
      ['REGISTER FOR BUILD & PLAY · FREE', '/register?tab=build-play'],
      ['REGISTER A TEAM', '/register?tab=competition'],
      ['REGISTER A TEAM', '/register?tab=competition'],
    ]);
    expect(teamsDefaults(IBK).posters[0].register.href).toBe('/ibk/register?tab=build-play');
    // Junior and Senior link to the competition rules (IBK's site to the rules page on vfi); Build & Play has none.
    expect(posters.map((p) => p.rules.href)).toEqual(['', '/competition', '/competition']);
    expect(teamsDefaults(IBK).posters[1].rules.href).toBe('https://vfi.iniac.se/competition');
    expect(posters[1].facts.map((f) => f.value.en)).toEqual(['Basic', 'Building, motors, joystick/control, teamwork', 'Not required']);
  });

  it('names Build & Play in the eligibility labels, key dates and fees of vfi and IBK only', () => {
    const hero = heroDefaults(VFI_SITE);
    expect(hero.facts[0]).toEqual({ label: { en: 'GRADES', sv: '' }, value: { en: 'PRESCHOOL–9', sv: '' } });
    expect(hero.events[0].audience.en).toBe('Preschool–Grade 9');
    expect(experienceDefaults(VFI_SITE).cards[0].intro.map((x) => x.en).join(' ')).toContain('Build & Play: preschool–grade 2, with a parent, free');
    const j = journeyDefaults(VFI_SITE)!;
    expect(j.programmes[0].subtitle.en).toBe('Build & Play and the robotics competition · Preschool–Grade 9');
    expect(j.dates.map((d) => [d.label.en, d.value.en])).toContainEqual(['Build & Play', '5 December 2026 (MISV, Västerås)']);
    const fees = feesDefaults(VFI_SITE).fees.map((f) => [f.who.en, f.fee.en]);
    expect(fees).toContainEqual(['RoboKidovation Build & Play (preschool–grade 2, with a parent)', 'Free participation']);
    expect(fees).toContainEqual(['Future InnoHack (Kid InnoHack and Young InnoHack)', 'Free participation']);
    expect(fees[0]).toEqual(['Schools, associations and independent teams', '200 SEK / kid']);
    // Riga keeps its own.
    expect(heroDefaults(RIGA).facts[0].value.en).toBe('1–9 + GYM');
    expect(feesDefaults(RIGA).fees.map((f) => f.who.en).join()).not.toContain('Build & Play');
    expect(experienceDefaults(RIGA).cards[0].intro.map((x) => x.en).join(' ')).toContain('GYM: programmable bot');
  });

  it('drops GYM on vfi and IBK only; Riga and Eskilstuna keep their categories and text cards', () => {
    expect(teamsDefaults(VFI_SITE).categories.map((c) => c.name.en)).toEqual(['RoboKido Junior', 'RoboKido Senior']);
    for (const site of [RIGA, ESK, undefined]) {
      expect(teamsDefaults(site).posters).toEqual([]);
      expect(teamsDefaults(site).categories.map((c) => c.name.en)).toContain('RoboKido GYM');
    }
  });

  it('lets only Junior and Senior compete on vfi and IBK; other sites keep GYM; old GYM entries keep their grade group', () => {
    const competition: Path = { programme: 'robo', role: 'team', activity: 'competition' };
    expect(categoryOptions(ctxFor(competition)).map((o) => o.en)).toEqual(['Junior · Grades 3–6', 'Senior · Grades 7–9']);
    expect(categoryOptions(ctxFor(competition, ESK)).map((o) => o.en)).toEqual(['Junior · Grades 3–6', 'Senior · Grades 7–9', 'GYM · Upper secondary']);
    // The stored GYM / gymnasium value is unchanged (older registrations, Young InnoHack's gymnasium category).
    expect(GRADE_GROUP_OPTIONS[3]).toBe('Gymnasiet (RoboKido GYM / Hackathon Medium · Ages 16–18)');
  });
});

describe('Build & Play registration (a parent and child, free, no competition)', () => {
  it('is a choice for a parent under RoboKidovation, on vfi and IBK only, with its own link', () => {
    const parent: Path = { programme: 'robo', role: 'individual' };
    const choices = flow.activityChoices('robo', accepting(VFI_SITE), parent);
    expect(choices.map((c) => c.id)).toEqual(['demo', 'workshop', 'competition', 'build-play']);
    expect(choices[3].title.en).toBe('Build & Play (preschool–grade 2)');
    expect(choices[3].desc.en).toMatch(/^Free\..*5 December 2026.*No competition/);
    expect(flow.activityChoices('robo', accepting(RIGA), parent).map((c) => c.id)).toEqual(['demo', 'workshop', 'competition']);
    expect(flow.activityChoices('robo', accepting(VFI_SITE), { programme: 'robo', role: 'school' }).map((c) => c.id)).not.toContain('build-play');
    const path = flow.pathForTab('build-play', VFI_SITE.intake.programmes);
    expect(path).toEqual(BP);
    expect(flow.formFor(path)).toBe('buildplay');
    expect(flow.tabForPath(path)).toBe('build-play');
    expect(FORMS.buildplay).toBe(buildPlayForm);
  });

  it('takes children from preschool (younger than förskoleklass) to grade 2, and needs an accompanying parent or guardian', () => {
    const ctx = ctxFor(BP);
    expect(BUILD_PLAY_GRADES).toEqual(['preschool', 'F', '1', '2']);
    const ok = { children: [{ full_name: 'Ada', grade: 'preschool' }, { full_name: 'Bo', grade: '2' }, { full_name: '', grade: '' }], accompany: true };
    expect(buildPlayForm.validate!(ok, ctx)).toBe('');
    expect(buildPlayForm.validate!({ ...ok, children: [{ full_name: '', grade: '' }] }, ctx)).toMatch(/child's name/);
    for (const g of ['3', '4', '']) expect(buildPlayForm.validate!({ ...ok, children: [{ full_name: 'Ada', grade: g }] }, ctx)).toMatch(/preschool, förskoleklass, grade 1 or grade 2/);
    expect(buildPlayForm.validate!({ ...ok, accompany: false }, ctx)).toMatch(/parent or guardian stays with the child/);
  });

  it('shows that it is free, on 5 December 2026 at MISV, and asks nothing about teams, scoring or judging', () => {
    const ctx = ctxFor(BP);
    const summary = Object.fromEntries(buildPlayForm.summary({ contactName: 'P', email: 'p@example.org', phone: '1', children: [{ full_name: 'Ada', grade: 'preschool' }], accompany: true, mediaConsent: false }, ctx));
    expect(summary).toMatchObject({ Fee: 'Free', Children: 'Ada (preschool)', 'Accompanied by': 'A parent or guardian', 'Photos and videos': 'Not published' });
    expect(Object.keys(summary).join()).not.toMatch(/team|category|score|judg/i);
    expect(buildPlayForm.intro(ctx)).toContain('free');
    expect(buildPlayForm.done(ctx, { email: 'p@example.org' }).body).toContain('5 December 2026 at Mälardalen International School (MISV), Västerås. Participation is free.');
    expect(buildPlayForm.fees).toBe(false);
  });

  it('is saved as a Build & Play registration with its own grade group, the children, the date and the consents', async () => {
    const ctx = ctxFor(BP);
    const ref = await buildPlayForm.submit(
      { contactName: 'Parent A', email: 'a@example.org', phone: '070', orgName: '', children: [{ full_name: 'Ada', grade: 'preschool' }, { full_name: 'Bo', grade: 'F' }], accompany: true, mediaConsent: true, consentAgreed: true },
      ctx,
    );
    expect(ref).toBe('EU-SWE-VAST-001');
    const payload = (rpc.mock.calls.at(-1) as unknown as [string, { payload: Record<string, unknown> }])[1].payload;
    expect(payload).toMatchObject({
      form_type: 'build-play',
      grade_group: BUILD_PLAY_GRADE_GROUP,
      category_id: 'vasteras-robokidovation-build-play',
      preferred_date: '5 December 2026',
      contact_name: 'Parent A',
      student_count: '2',
      city_slug: 'vasteras',
      team_name: null,
      intake_details: {
        robokido_category: 'build-play',
        participation: 'free',
        children: [{ full_name: 'Ada', grade: 'preschool' }, { full_name: 'Bo', grade: 'F' }],
        team_members: ['Ada (preschool)', 'Bo (förskoleklass)'],
        accompanied_by_guardian: true,
        media_consent: true,
      },
    });
    expect(BUILD_PLAY_GRADE_GROUP).toBe('Förskola–årskurs 2 (Build & Play · parent and child · not competing)');
  });
});
