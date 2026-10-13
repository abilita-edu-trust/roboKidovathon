// Writes the built-in home-page content of every site (the Site CMS defaults) to a JSON file, so the
// database can be seeded with exactly what the site shows by default.
//
//   npx esbuild scripts/export-site-defaults.ts --bundle --platform=node --format=esm --jsx=automatic \
//     --loader:.png=file --loader:.jpg=file --loader:.jpeg=file --loader:.svg=file --loader:.webp=file \
//     --loader:.mp4=file --define:import.meta.env={} --outdir=<tmp> && node <tmp>/export-site-defaults.js <out.json>
import { writeFileSync } from 'node:fs';

// The section builders read the browser location for links; any site address works.
(globalThis as unknown as { window: unknown }).window = {
  location: { origin: 'https://vfi.iniac.se', hostname: 'localhost', pathname: '/', search: '', hash: '' },
};

const { VFI_SITE } = await import('../src/context/SiteContext');
const { CITY_SITES } = await import('../src/components/city/citySites');
const { defaultSections } = await import('../src/content/registry');
const ibk = (await import('../src/data/ibkContent.default.json')).default;

const noop = () => undefined;
const env = (siteKey: string, config: typeof VFI_SITE, city?: (typeof CITY_SITES)[string]) => ({
  siteKey, config, city, navigate: noop, register: noop, ideas: noop, go: noop, selectPartner: noop,
});

const out = {
  vfi: defaultSections(env('vfi', VFI_SITE)),
  ...Object.fromEntries(Object.values(CITY_SITES).map((c) => [c.route, defaultSections(env(c.route, c.site, c))])),
  ibkMarquee: ibk.marquee,
};
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('wrote', Object.keys(out).join(', '));
