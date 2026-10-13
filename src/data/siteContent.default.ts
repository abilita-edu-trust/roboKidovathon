import type { SiteContent } from '../lib/siteContent';

/** Used until the database answers, and when it can't be reached. Same as the database's starting content. */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  sections: [
    {
      id: 'jury',
      type: 'people',
      visible: true,
      title: { en: 'Jury', sv: 'Jury' },
      intro: { en: '', sv: '' },
      emptyText: { en: 'The jury will be announced soon.', sv: 'Juryn presenteras snart.' },
      people: [],
    },
    {
      id: 'speakers',
      type: 'people',
      visible: true,
      title: { en: 'Speakers', sv: 'Talare' },
      intro: { en: '', sv: '' },
      emptyText: { en: 'Speakers will be announced soon.', sv: 'Talarna presenteras snart.' },
      people: [],
    },
  ],
};
