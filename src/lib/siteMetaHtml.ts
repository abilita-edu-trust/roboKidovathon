// Writes a site's title, description and link-preview tags into an HTML page, between the
// <!-- site-meta --> markers in index.html. Used by the build (vite.config.ts).
import type { SiteMeta } from '../data/siteMeta';

const META_BLOCK = /<!-- site-meta -->[\s\S]*?<!-- \/site-meta -->/;

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The page with `meta` in place of whatever site meta it had. */
export function withSiteMeta(html: string, meta: SiteMeta): string {
  if (!META_BLOCK.test(html)) throw new Error('index.html has no <!-- site-meta --><!-- /site-meta --> block');
  const title = escape(meta.title);
  const description = escape(meta.description);
  const image = escape(new URL(meta.image, meta.origin).href);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  return html.replace(META_BLOCK, () => `<!-- site-meta -->\n    ${tags.join('\n    ')}\n    <!-- /site-meta -->`);
}
