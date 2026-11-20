// Winter Splash 2026 (IBK, 12 December 2026, 17:00–21:00, Växhuset, Västerås): prices, checks and the form's payload.
// The database (submit_ibk_winter_splash) decides the price at the moment the form arrives and checks everything again;
// the page shows the same numbers beforehand.
import { supabase } from './supabase';

export type WsKind = 'general' | 'guest' | 'performer';
export type WsBand = 'until_25_november' | '26_november_9_december' | '10_12_december';
type Lf = (en: string, sv: string) => string;

export const WS_EVENT = {
  when: { en: '12 December 2026 · 17:00–21:00', sv: '12 december 2026 · kl. 17.00–21.00' },
  venue: { en: 'Växhuset, Västerås', sv: 'Växhuset, Västerås' },
  closes: { en: 'Registration closes 12 December, 17:00', sv: 'Anmälan stänger 12 december kl. 17.00' },
};
export const WS_BADGE = '/site/winter-fest-2026.jpg';
export const WS_MAX = { adults: 20, children: 20, people: 50, minutes: 60 };
export const WS_PAYMENT_HOURS = 48;

/** The three price periods (Swedish time), the same as fut_inno_winter_splash_price in the database. */
export const WS_PRICES: { band: WsBand; price: number; until: string | null; en: string; sv: string }[] = [
  { band: 'until_25_november', price: 50, until: '2026-11-26T00:00:00+01:00', en: 'until 25 November', sv: 'till och med 25 november' },
  { band: '26_november_9_december', price: 75, until: '2026-12-10T00:00:00+01:00', en: '26 November – 9 December', sv: '26 november – 9 december' },
  { band: '10_12_december', price: 100, until: null, en: '10–12 December', sv: '10–12 december' },
];
const upFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "Until 25 November: 50 SEK", for the list of periods. */
export const wsTierText = (p: (typeof WS_PRICES)[number], L: Lf) => L(`${upFirst(p.en)}: ${p.price} SEK`, `${upFirst(p.sv)}: ${p.price} kr`);
export function wsPriceAt(at: Date): { band: WsBand; price: number } {
  const p = WS_PRICES.find((x) => !x.until || at.getTime() < new Date(x.until).getTime())!;
  return { band: p.band, price: p.price };
}
/** "until 25 November" / "till och med 25 november". */
export const wsBandText = (band: string, L: Lf) => {
  const p = WS_PRICES.find((x) => x.band === band);
  return p ? L(p.en, p.sv) : '';
};
export const sek = (n: number, L: Lf) => L(`${n} SEK`, `${n} kr`);

export interface WsValues {
  kind: WsKind | '';
  name: string;
  email: string;
  phone: string;
  adults: string;
  children: string;
  people: string;
  groupName: string;
  perfType: string;
  perfDescription: string;
  perfMinutes: string;
  perfTechnical: string;
  photo: boolean;
  privacy: boolean;
}
export const WS_BLANK: WsValues = {
  kind: '', name: '', email: '', phone: '', adults: '1', children: '0', people: '1', groupName: '',
  perfType: '', perfDescription: '', perfMinutes: '', perfTechnical: '', photo: false, privacy: false,
};

const int = (s: string) => (/^\s*\d+\s*$/.test(s) ? Number(s) : NaN);
export const wsAttendees = (v: WsValues) => (v.kind === 'general' ? (int(v.adults) || 0) + (int(v.children) || 0) : int(v.people) || 0);

/** What the visitor still has to fix, in their language; '' when the form can be sent. Mirrors the database's checks. */
export function wsProblem(v: WsValues, L: Lf): string {
  if (!v.kind) return L('Choose how you are coming.', 'Välj hur du kommer.');
  const name = v.name.trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 120) return L('Write your full name.', 'Skriv ditt fullständiga namn.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) return L('Check your email address.', 'Kontrollera din e-postadress.');
  if (!/^[0-9+()\s-]{6,30}$/.test(v.phone.trim())) return L('Check your phone number.', 'Kontrollera ditt telefonnummer.');
  if (v.kind === 'general') {
    const a = int(v.adults), c = int(v.children);
    if (!(a >= 1 && a <= WS_MAX.adults)) return L('At least 1 adult, and up to 20 adults per registration.', 'Minst 1 vuxen och högst 20 vuxna per anmälan.');
    if (!(c >= 0 && c <= WS_MAX.children)) return L('Up to 20 children per registration.', 'Högst 20 barn per anmälan.');
  } else {
    const n = int(v.people);
    if (!(n >= 1 && n <= WS_MAX.people)) return v.kind === 'performer'
      ? L('Give the number of performers (1 to 50).', 'Ange antal som uppträder (1 till 50).')
      : L('Give the number of people (1 to 50).', 'Ange antal personer (1 till 50).');
    if (v.groupName.trim().length > 120) return L('The group name can be up to 120 characters.', 'Gruppens namn får vara högst 120 tecken.');
    if (v.kind === 'performer') {
      if (!v.perfType) return L('Choose the type of performance.', 'Välj typ av uppträdande.');
      const d = v.perfDescription.trim().length;
      if (d < 2 || d > 500) return L('Describe the performance briefly.', 'Beskriv uppträdandet kort.');
      const m = int(v.perfMinutes);
      if (!(m >= 1 && m <= WS_MAX.minutes)) return L('Give the length in minutes (1 to 60).', 'Ange längden i minuter (1 till 60).');
      if (v.perfTechnical.trim().length > 500) return L('Music and technical needs: up to 500 characters.', 'Musik och tekniska behov: högst 500 tecken.');
    }
  }
  if (!v.privacy) return L('Please confirm that you have read the privacy notice.', 'Bekräfta att du har läst integritetsmeddelandet.');
  return '';
}

/** The form as submit_ibk_winter_splash reads it. */
export function wsPayload(v: WsValues, language: 'en' | 'sv'): Record<string, unknown> {
  const base = {
    kind: v.kind, name: v.name.trim().replace(/\s+/g, ' '), email: v.email.trim(), phone: v.phone.trim(), language,
    consent: { privacy: v.privacy, photo: v.photo },
  };
  if (v.kind === 'general') return { ...base, adults: int(v.adults), children: int(v.children) };
  return {
    ...base,
    people: int(v.people),
    group_name: v.groupName.trim(),
    ...(v.kind === 'performer'
      ? { performance: { type: v.perfType, description: v.perfDescription.trim(), minutes: int(v.perfMinutes), technical: v.perfTechnical.trim() } }
      : {}),
  };
}

export interface WsReceipt {
  reference: string;
  kind: WsKind;
  attendees: number;
  adults?: number;
  children?: number;
  price?: number;
  price_band?: WsBand;
  amount?: number;
  pay_by?: string;
  bankgiro?: string;
  payee?: string;
  message?: string;
}
export interface WsPublic { registration_open: boolean; price_now: number; band_now: WsBand; payment_hours: number }

/** Whether registration is open and today's price. */
export async function wsFetchPublic(): Promise<WsPublic> {
  const { data, error } = await supabase.rpc('fut_inno_winter_splash_public');
  if (error) throw error;
  return data as WsPublic;
}
export async function wsSubmit(v: WsValues, language: 'en' | 'sv'): Promise<WsReceipt> {
  const { data, error } = await supabase.rpc('submit_ibk_winter_splash', { payload: wsPayload(v, language) });
  if (error) throw error;
  return data as WsReceipt;
}

/** The database's refusals for the visitor (its own messages are English only). */
export function wsErrorText(e: unknown, L: Lf): string {
  const err = e as { hint?: string; message?: string };
  switch (err?.hint) {
    case 'closed': return L('Registration for Winter Splash 2026 is closed.', 'Anmälan till Winter Splash 2026 är stängd.');
    case 'rate_limited': return L('Too many tries from this network. Please try again in an hour.', 'För många försök från det här nätverket. Försök igen om en timme.');
    case 'invalid': return L(upFirst(err.message?.replace(/^Winter Splash 2026:\s*/, '') ?? '') || 'Check the details.', 'Kontrollera uppgifterna och försök igen.');
    default: return L('Something went wrong. Please try again in a moment.', 'Något gick fel. Försök igen om en stund.');
  }
}

/** "21 November 2026, 18:30" / "21 november 2026 kl. 18.30", Swedish time. */
export function wsDateTime(iso: string | undefined, sv: boolean): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = new Intl.DateTimeFormat(sv ? 'sv-SE' : 'en-GB', { timeZone: 'Europe/Stockholm', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  const time = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit' }).format(d);
  return sv ? `${date} kl. ${time.replace(':', '.')}` : `${date}, ${time}`;
}
