import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { SITE_META, SITE_META_PAGES, type SiteMetaKey } from './src/data/siteMeta';
import { withSiteMeta } from './src/lib/siteMetaHtml';

/** index.html gets the vfi meta; the build adds a copy per other site with its own (see siteMeta.ts). */
function siteMetaPages(): Plugin {
  return {
    name: 'site-meta-pages',
    enforce: 'post',
    transformIndexHtml: (html) => withSiteMeta(html, SITE_META.vfi),
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') this.error('index.html is missing from the build');
      for (const key of Object.keys(SITE_META) as SiteMetaKey[]) {
        if (SITE_META_PAGES[key] === 'index.html') continue;
        this.emitFile({ type: 'asset', fileName: SITE_META_PAGES[key], source: withSiteMeta(String(index.source), SITE_META[key]) });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), siteMetaPages()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
