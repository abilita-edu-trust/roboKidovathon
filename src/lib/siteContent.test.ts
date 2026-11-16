import { describe, expect, it } from 'vitest';
import { normalizeContent } from './siteContent';

const board = {
  id: 'board', type: 'people', visible: true, title: { en: 'Our board', sv: 'Vår styrelse' }, intro: { en: '', sv: '' },
  emptyText: { en: '', sv: '' }, people: [{ id: 'p1', name: 'Richa Nautiyal', role: { en: 'Chairman', sv: 'Ordförande' }, organisation: '', photo: '' }],
};
const media = { id: 'about-welcome', type: 'media', visible: true, data: { title: { en: 'Welcome', sv: 'Välkommen' } } };

describe('site content with pages of their own (Site CMS)', () => {
  it('reads the pages with their blocks, as the Site CMS saves them', () => {
    const stored = { sections: [media], pages: [{ id: 'about', path: 'about', title: { en: 'About IBK', sv: 'Om IBK' }, sections: [media, board] }] };
    expect(normalizeContent(JSON.parse(JSON.stringify(stored)))).toEqual(stored);
  });

  it('copes with a document without pages, or with odd ones', () => {
    expect(normalizeContent({ sections: [media] })).toEqual({ sections: [media] });
    const odd = normalizeContent({ sections: [], pages: [{ path: 'About', sections: 'x' }, 'junk'] });
    expect(odd.pages).toEqual([{ id: 'page-0', path: 'about', title: { en: '', sv: '' }, sections: [] }]);
  });
});
