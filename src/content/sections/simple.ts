// Partner logos, the vfi "Read the full details" links and the participation fees.
import type { Language } from '../../context/LanguageContext';
import { PARTNER_LOGOS, type PartnerLogo } from '../../data/roboData';
import { PARTICIPATION_FEES, PAYMENT } from '../../data/vfiFacts';
import { bi, pick, type Bi } from '../core';
import { targetToHref, biOf } from './frame';

export interface PartnerItem {
  name: string;
  logo: string;
  role: Bi;
  /** Opens in a preview; empty = not clickable through. */
  href: string;
}

export interface PartnersData {
  logos: PartnerItem[];
}

export const partnersDefaults = (): PartnersData => ({
  logos: PARTNER_LOGOS.map((p) => ({ name: p.name, logo: p.file, role: bi(p.role ?? ''), href: p.url ?? '' })),
});

/** The marquee/footer shape of a CMS logo, in the visitor's language. Logos without a file are left out. */
export const toPartnerLogos = (logos: PartnerItem[], lang: Language): PartnerLogo[] =>
  logos.filter((l) => l.logo).map((l) => ({ name: l.name, file: l.logo, role: pick(l.role, lang), url: l.href }));

export interface ReadMoreData {
  eyebrow: Bi;
  title: Bi;
  links: { icon: string; title: Bi; text: Bi; href: string }[];
}

export const readMoreDefaults = (): ReadMoreData => ({
  eyebrow: bi('PROGRAMME DETAILS'),
  title: bi('Read the full details'),
  links: [
    { icon: 'Trophy', title: bi('Competition rules'), text: bi('Categories, qualification, match format and arena specifications.'), href: targetToHref('challenges') },
    { icon: 'BookOpen', title: bi('Curriculum'), text: bi('How the 20-hour programme maps to Lgr22 and Gy25.'), href: targetToHref('lgr22') },
    { icon: 'Wrench', title: bi('Equipment & workshops'), text: bi('Kits, sessions and the step-by-step learning pathway.'), href: targetToHref('workflow') },
    { icon: 'Calendar', title: bi('Events & final'), text: bi('The season timeline, qualifiers and the 5 December 2026 Final.'), href: targetToHref('events') },
  ],
});

export interface FeesData {
  title: Bi;
  fees: { who: Bi; fee: Bi; note: Bi }[];
  showPayment: boolean;
  payTo: Bi;
  bankgiro: string;
  nameLabel: Bi;
  payee: string;
  write: Bi;
  reference: Bi;
  referenceField: Bi;
  payNow: Bi;
}

export const feesDefaults = (): FeesData => ({
  title: bi('Participation fees', 'Deltagaravgifter'),
  fees: PARTICIPATION_FEES.map((f) => ({ who: biOf(f.who), fee: biOf(f.fee), note: f.note ? biOf(f.note) : bi('') })),
  showPayment: true,
  payTo: bi('Pay to', 'Betala till'),
  bankgiro: PAYMENT.bankgiro,
  nameLabel: bi('Name', 'Namn'),
  payee: PAYMENT.payee,
  write: bi('Write', 'Skriv'),
  reference: biOf(PAYMENT.reference),
  referenceField: bi('in the OCR/Meddelande field.', 'i OCR-/meddelandefältet.'),
  payNow: bi(
    'Please pay immediately after registering so we can prepare enough Robo-kits on time.',
    'Betala direkt efter anmälan så att vi hinner förbereda tillräckligt många Robo-kit.'
  ),
});
