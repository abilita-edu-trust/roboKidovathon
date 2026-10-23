// The INIAC team on the "Contact us" section of the city sites (vfi, esk, vxo; not IBK's
// page). iniac.se shows the same list from www-iniac-se src/data/teamContacts.ts: change
// both together. A photo goes in public/team/ and its path in `photo` (e.g. '/team/pramod.jpg').

export interface TeamContact {
  name: string;
  place: { en: string; sv: string };
  email?: string;
  linkedin?: string;
  photo?: string;
}

/** The general address for anything that is not for one person. */
export const CONTACT_EMAIL = 'contact@iniac.se';

export const TEAM_CONTACTS: TeamContact[] = [
  { name: 'Pramod', place: { en: 'Sweden', sv: 'Sverige' } },
  { name: 'Bhavya', place: { en: 'Sweden', sv: 'Sverige' } },
  { name: 'Sriram', place: { en: 'Germany', sv: 'Tyskland' } },
  { name: 'Richa', place: { en: 'Sweden', sv: 'Sverige' } },
  { name: 'Atchyuth Karri', place: { en: 'London, UK', sv: 'London, Storbritannien' }, email: 'atchyuthkarri46@gmail.com' },
  { name: 'Pavan Surya Chintada', place: { en: 'India', sv: 'Indien' }, email: 'pavansuryachintada@gmail.com' },
];

/** "Pavan Surya Chintada" → "PC": shown until there is a photo. */
export const initials = (name: string) => {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
};
