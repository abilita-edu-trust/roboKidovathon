import { describe, expect, it } from 'vitest';
import { SITE_META, SITE_META_PAGES } from '../data/siteMeta';
import { withSiteMeta } from './siteMetaHtml';

const TEMPLATE = '<head>\n<meta charset="UTF-8" />\n<!-- site-meta --><!-- /site-meta -->\n</head>';

describe('withSiteMeta', () => {
  it("writes the site's title, description and preview tags", () => {
    const html = withSiteMeta(TEMPLATE, SITE_META.esk);
    expect(html).toContain('<title>Eskilstuna Future Innovators 2026 | INIAC</title>');
    expect(html).toContain('<meta name="description" content="Hands-on RoboKidovation robotics');
    expect(html).toContain('<meta property="og:title" content="Eskilstuna Future Innovators 2026 | INIAC" />');
    expect(html).toContain('<meta property="og:image" content="https://esk.iniac.se/esk.jpeg" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it('replaces the meta already in the page, so no other site is left in it', () => {
    const vfi = withSiteMeta(TEMPLATE, SITE_META.vfi);
    const esk = withSiteMeta(vfi, SITE_META.esk);
    expect(esk).not.toMatch(/Västerås|IBK/);
    expect(esk.match(/<title>/g)).toHaveLength(1);
  });

  it('makes image addresses absolute and encodes spaces', () => {
    expect(withSiteMeta(TEMPLATE, SITE_META.ibk)).toContain('content="https://indiskbarnklubb.se/ibk%20logo.png"');
  });

  it('escapes text for HTML attributes', () => {
    const html = withSiteMeta(TEMPLATE, { ...SITE_META.vfi, title: 'A & "B" <C>' });
    expect(html).toContain('<title>A &amp; &quot;B&quot; &lt;C&gt;</title>');
  });

  it('fails without the site-meta marker, so a build never ships the wrong meta', () => {
    expect(() => withSiteMeta('<head></head>', SITE_META.vfi)).toThrow(/site-meta/);
  });
});

describe('SITE_META', () => {
  it('names INIAC in every title', () => {
    for (const meta of Object.values(SITE_META)) expect(meta.title).toMatch(/ \| INIAC$/);
  });

  it('has a built page for every site', () => {
    expect(Object.keys(SITE_META_PAGES).sort()).toEqual(Object.keys(SITE_META).sort());
  });
});
