// The privacy notice for Winter Splash 2026 registrations (indiskbarnklubb.se/ibk/winter-splash/privacy), linked from
// both Winter Splash forms. Separate from the Future InnoHack notice because IBK, not INIAC, organises Winter Splash.
// DRAFT: it stays unpublished until the organisers approve it. Until then the live page says the notice is being
// finalised, and only preview builds made with VITE_PRIVACY_DRAFT=1 show the draft. To confirm: IBK as the data
// controller with INIAC as its processor, the contact address, the retention dates and the bookkeeping period.
// When approved: set WINTER_SPLASH_PRIVACY_APPROVED to true and WINTER_SPLASH_PRIVACY_VERSION to the approval date.
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../content/useT';
import type { PrivacySection } from './PrivacyNoticePage';

export const WINTER_SPLASH_PRIVACY_VERSION = 'draft 2026-11-19';
/** False until the organisers approve the text below. */
export const WINTER_SPLASH_PRIVACY_APPROVED = false;
/** Provisional: IBK's contact address for data requests (the reply-to address of the Winter Splash emails). */
export const WINTER_SPLASH_CONTACT = 'Vasteras@indiskbarnklubb.se';

const tx = (en: string, sv: string) => ({ en, sv });
const C = WINTER_SPLASH_CONTACT;

export const WINTER_SPLASH_PRIVACY: PrivacySection[] = [
  {
    title: tx('Who is responsible', 'Vem som ansvarar'),
    paragraphs: [
      tx(
        `Winter Splash 2026 is organised by Indisk Barnklubb (IBK) Västerås, which is responsible for the data you give when you register (the data controller). INIAC runs the registration system on IBK's behalf. Questions, and requests to see, correct or delete your data: ${C}.`,
        `Winter Splash 2026 arrangeras av Indisk Barnklubb (IBK) Västerås, som ansvarar för de uppgifter du lämnar när du anmäler dig (personuppgiftsansvarig). INIAC driver anmälningssystemet för IBK:s räkning. Frågor, och önskemål om att se, rätta eller radera dina uppgifter: ${C}.`,
      ),
    ],
  },
  {
    title: tx('What we collect', 'Vad vi samlar in'),
    paragraphs: [],
    items: [
      tx(
        "General Admission: your name, email address and phone number, and how many adults and children are coming. We don't ask for the other attendees' names.",
        'Allmän entré: ditt namn, din e-postadress och ditt telefonnummer, och hur många vuxna och barn som kommer. Vi frågar inte efter övriga deltagares namn.',
      ),
      tx(
        "Guest or performer: the contact person's name, email address and phone number, the group name, the number of people or performers, and details of the performance.",
        'Gäst eller artist: kontaktpersonens namn, e-postadress och telefonnummer, gruppens namn, antalet personer eller artister och uppgifter om uppträdandet.',
      ),
      tx(
        'For everyone: your answer to the optional photo consent, your registration reference, and the status of your registration.',
        'För alla: ditt svar på det frivilliga fotosamtycket, din anmälningsreferens och anmälans status.',
      ),
      tx(
        'If you pay: the price saved when you registered, the payment status, and the payment screenshot you send by email.',
        'Om du betalar: priset som sparades när du anmälde dig, betalningens status och skärmbilden av betalningen som du skickar via e-post.',
      ),
      tx(
        'To protect the form from misuse, a scrambled (hashed) form of the internet address it was sent from is kept for two days.',
        'För att skydda formuläret mot missbruk sparas en krypterad (hashad) form av den internetadress som det skickades från i två dagar.',
      ),
    ],
  },
  {
    title: tx('Why we use it, and the legal basis', 'Varför vi använder uppgifterna, och med vilket rättsligt stöd'),
    paragraphs: [],
    items: [
      tx('To handle your registration, your payment and the event (GDPR Article 6(1)(b)).', 'För att hantera din anmälan, din betalning och evenemanget (artikel 6.1 b i dataskyddsförordningen).'),
      tx('To keep the payment records that the Swedish Bookkeeping Act requires (Article 6(1)(c)).', 'För att spara de betalningsuppgifter som bokföringslagen kräver (artikel 6.1 c).'),
      tx(
        'To publish photos or videos in which you or your children can be seen: only with your separate, optional consent (Article 6(1)(a)). Saying no does not affect taking part.',
        'För att publicera foton eller filmer där du eller dina barn syns: bara med ditt separata, frivilliga samtycke (artikel 6.1 a). Att säga nej påverkar inte deltagandet.',
      ),
    ],
  },
  {
    title: tx('Who sees it', 'Vem som ser uppgifterna'),
    paragraphs: [
      tx(
        "IBK's organisers of Winter Splash 2026. INIAC (the registration system), Supabase (the database) and Hostinger (the website and email) process the data on IBK's behalf. We don't sell your data or use it for marketing.",
        'IBK:s arrangörer av Winter Splash 2026. INIAC (anmälningssystemet), Supabase (databasen) och Hostinger (webbplatsen och e-posten) behandlar uppgifterna för IBK:s räkning. Vi säljer inte dina uppgifter och använder dem inte för marknadsföring.',
      ),
    ],
  },
  {
    title: tx('How long we keep it', 'Hur länge vi sparar uppgifterna'),
    paragraphs: [],
    items: [
      tx("Payment screenshots: deleted from IBK's inbox once the payment has been verified and reconciled.", 'Skärmbilder av betalningar: raderas från IBK:s inkorg när betalningen har kontrollerats och stämts av.'),
      tx('Registration details: until 31 March 2027.', 'Anmälningsuppgifter: till och med 31 mars 2027.'),
      tx('Payment records (amount, date, reference): as long as the Bookkeeping Act requires, seven years.', 'Betalningsuppgifter (belopp, datum, referens): så länge bokföringslagen kräver, sju år.'),
      tx(
        'Photos and videos published with consent: until you withdraw your consent, and at most until 12 December 2028.',
        'Foton och filmer som publicerats med samtycke: tills du återkallar samtycket, dock längst till och med 12 december 2028.',
      ),
    ],
  },
  {
    title: tx('Your rights', 'Dina rättigheter'),
    paragraphs: [
      tx(
        `You can ask to see, correct or delete your data, restrict or object to how it is used, and withdraw your photo consent at any time, by emailing ${C}. If you are unhappy with how we handle your data, you can complain to the Swedish Authority for Privacy Protection (IMY), imy.se.`,
        `Du kan be att få se, rätta eller radera dina uppgifter, begränsa eller invända mot hur de används, och när som helst återkalla ditt fotosamtycke, genom att mejla ${C}. Om du är missnöjd med hur vi hanterar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY), imy.se.`,
      ),
    ],
  },
];

const showDraft = (): boolean => import.meta.env.VITE_PRIVACY_DRAFT === '1';

export const WinterSplashPrivacyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { L } = useT();
  const published = WINTER_SPLASH_PRIVACY_APPROVED || showDraft();
  return (
    <div className="w-full bg-white text-[#0A1930] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{L('Back to Winter Splash 2026', 'Tillbaka till Winter Splash 2026')}</span>
        </button>
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <h1 className="font-headline font-black uppercase tracking-tight leading-tight" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
            {L('Privacy notice', 'Integritetsmeddelande')}
          </h1>
          <p className="text-sm text-slate-600">
            {L(`Winter Splash 2026 registrations · ${WINTER_SPLASH_PRIVACY_VERSION}`, `Anmälningar till Winter Splash 2026 · ${WINTER_SPLASH_PRIVACY_VERSION.replace('draft', 'utkast')}`)}
          </p>
        </div>
        {!published ? (
          <p className="text-sm text-slate-700 leading-relaxed">
            {L(
              `The privacy notice for Winter Splash 2026 is being finalised and will be published here. Questions about your data: ${C}.`,
              `Integritetsmeddelandet för Winter Splash 2026 håller på att färdigställas och publiceras här. Frågor om dina uppgifter: ${C}.`,
            )}
          </p>
        ) : (
          <>
            {!WINTER_SPLASH_PRIVACY_APPROVED && (
              <p className="border-2 border-[#FFCD00] bg-[#FFCD00]/15 px-4 py-3 text-sm font-bold text-[#0A1930]">
                {L('DRAFT for review: not approved and not in effect.', 'UTKAST för granskning: inte godkänt och gäller inte.')}
              </p>
            )}
            {WINTER_SPLASH_PRIVACY.map((s) => (
              <section key={s.title.en} className="space-y-2">
                <h2 className="font-headline font-black text-lg uppercase tracking-tight text-[#0A1930]">{L(s.title.en, s.title.sv)}</h2>
                <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                  {s.paragraphs.map((p) => <p key={p.en}>{L(p.en, p.sv)}</p>)}
                  {s.items && <ul className="list-disc pl-5 space-y-1.5">{s.items.map((p) => <li key={p.en}>{L(p.en, p.sv)}</li>)}</ul>}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
