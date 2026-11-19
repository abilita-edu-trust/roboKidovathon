import { describe, expect, it, vi } from 'vitest';

// Every registration from vfi or IBK records its site in the details ("site": "vfi" / "ibk"); nothing else in what is
// sent changes, and the other city sites send exactly what they sent before.
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};
const rpc = vi.fn(async (..._args: unknown[]) => ({ data: 'EU-SWE-VAST-001', error: null }));
vi.mock('../../lib/supabase', () => ({ supabase: { rpc }, isSupabaseConfigured: false }));

const flow = await import('./flow');
const { VFI_SITE } = await import('../../context/SiteContext');
const { CITY_SITES } = await import('../../components/city/citySites');
const { FORMS } = await import('./forms');
const { GRADE_GROUP_OPTIONS } = await import('../../data/vfiFacts');

type Site = typeof VFI_SITE;
type Path = import('./flow').RegisterPath;
const IBK = CITY_SITES.ibk.site;
const L = (en: string) => en;
const ctxFor = (site: Site, path: Path) =>
  ({ site, language: 'en', lang: 'en', sv: false, L, path, programme: site.intake.programmes.find((p) => p.id === path.programme) ?? site.intake.programmes[0], gradeOptions: GRADE_GROUP_OPTIONS }) as import('./ui').FormCtx;
const values = { contactName: 'Test Person', email: 't@example.org', phone: '+46 70 000 00 00', orgName: 'Test School', teamName: 'Test Team', consentAgreed: true, children: [{ full_name: 'Kid', grade: '1' }], members: [{ full_name: 'A', grade: '5' }] };

/** What a form sends for this site and path. */
const sent = async (site: Site, path: Path) => {
  const id = flow.formFor(path)!;
  const ctx = ctxFor(site, path);
  rpc.mockClear();
  await FORMS[id].submit({ ...(FORMS[id].initial?.(ctx) ?? {}), ...values } as never, ctx);
  return { id, call: rpc.mock.calls[0] as unknown as [string, { payload: Record<string, unknown> }] };
};

const PATHS: [string, Path][] = [
  ['buildplay', { programme: 'robo', role: 'individual', activity: 'build-play' }],
  ['competition', { programme: 'robo', role: 'team', activity: 'competition' }],
  ['booking', { programme: 'robo', role: 'school', activity: 'workshop' }],
  ['booking', { programme: 'robo', role: 'school', activity: 'demo' }],
  ['association', { programme: 'robo', role: 'association', activity: 'workshop' }],
  ['community', { programme: 'community', role: 'member' }],
  ['squad', { programme: 'hack', track: 'young', role: 'team', activity: 'participate' } as Path],
];

describe('the site a vfi or IBK registration came from', () => {
  for (const [name, site, key] of [['vfi', VFI_SITE, 'vfi'], ['IBK', IBK, 'ibk']] as const) {
    it(`${name}: every registration form adds "site": "${key}" to the details and changes nothing else`, async () => {
      for (const [form, path] of PATHS) {
        expect(flow.formFor(path), form).toBe(form);
        const { call } = await sent(site, path);
        const { call: before } = await sent({ ...site, designV2: false } as Site, path);
        expect(call[0], form).toBe('submit_fut_inno_registration');
        const { site: s, ...rest } = call[1].payload.intake_details as Record<string, unknown>;
        expect(s, form).toBe(key);
        expect(rest, form).toEqual(before[1].payload.intake_details ?? {});
        expect({ ...call[1].payload, intake_details: undefined }, form).toEqual({ ...before[1].payload, intake_details: undefined });
      }
    });
  }

  it('Riga, Eskilstuna and Växjö send no site, exactly as before', async () => {
    const classic: Path[] = [
      { programme: 'robo', role: 'team', activity: 'competition' },
      { programme: 'robo', role: 'school', activity: 'workshop' },
      { programme: 'robo', role: 'association', activity: 'workshop' },
      { programme: 'hack', role: 'team', activity: 'participate', theme: 'climate' } as Path,
    ];
    let checked = 0;
    for (const site of [CITY_SITES.riga.site, CITY_SITES.esk.site, CITY_SITES.vxo.site]) {
      for (const path of classic) {
        const { call } = await sent(site, path);
        expect(call[0]).toBe('submit_fut_inno_registration');
        expect(JSON.stringify(call[1].payload)).not.toContain('"site"');
        checked++;
      }
    }
    expect(checked).toBe(12);
  });
});
