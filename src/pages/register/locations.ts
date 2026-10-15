// Every city here needs a row in eu_skola_cities with the same slug, or its entries land
// in the country's first city on the EU Skola dashboard (submit_eu_skola_registration).
export const COUNTRIES = [
  { slug: 'sweden', name: 'Sweden', defaultCity: 'vasteras' },
  { slug: 'denmark', name: 'Denmark', defaultCity: 'copenhagen' },
  { slug: 'latvia', name: 'Latvia', defaultCity: 'riga' },
  { slug: 'estonia', name: 'Estonia', defaultCity: 'tallinn' },
  { slug: 'germany', name: 'Germany', defaultCity: 'leipzig' },
];

export const CITIES_BY_COUNTRY: Record<string, { slug: string; name: string }[]> = {
  sweden: [
    { slug: 'vasteras', name: 'Västerås' },
    { slug: 'eskilstuna', name: 'Eskilstuna' },
    { slug: 'vaxjo', name: 'Växjö' },
    { slug: 'uppsala', name: 'Uppsala' },
    { slug: 'stockholm', name: 'Stockholm' },
    { slug: 'gavle', name: 'Gävle' },
  ],
  denmark: [{ slug: 'copenhagen', name: 'Copenhagen' }],
  latvia: [
    { slug: 'riga', name: 'Riga' },
    { slug: 'ventspils', name: 'Ventspils' },
  ],
  estonia: [{ slug: 'tallinn', name: 'Tallinn' }],
  germany: [
    { slug: 'leipzig', name: 'Leipzig' },
    { slug: 'zwickau', name: 'Zwickau' },
    { slug: 'dresden', name: 'Dresden' },
  ],
};
