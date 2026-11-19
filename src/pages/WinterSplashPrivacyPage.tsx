// The privacy notice for Winter Splash 2026 registrations (indiskbarnklubb.se/ibk/winter-splash/privacy), linked from
// both Winter Splash forms. Separate from the Future InnoHack notice because IBK, not INIAC, organises Winter Splash.
// Controller: Indisk Barnklubb (IBK) Västerås; processor: INIAC (the registration system). Contact, also the emails'
// reply-to: Vasteras@indiskbarnklubb.se (confirmed 19 November 2026). Until the organisers approve the text, the live
// page says the notice is being finalised, and only preview builds made with VITE_PRIVACY_DRAFT=1 show it.
// Text approved by the organisers on 19 November 2026, subject to the agreement below. Publish (WINTER_SPLASH_PRIVACY_APPROVED = true, WINTER_SPLASH_PRIVACY_VERSION = the approval date) only when the text is
// approved AND the data processing agreement between IBK and INIAC (covering Supabase and Hostinger as subcontractors)
// is confirmed in place: the notice says it exists.
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../content/useT';
import type { PrivacySection } from './PrivacyNoticePage';

export const WINTER_SPLASH_PRIVACY_VERSION = 'draft 2026-11-19';
/** False until the organisers approve the text below. */
export const WINTER_SPLASH_PRIVACY_APPROVED = false;
/** IBK's contact address for data requests (also the reply-to of the Winter Splash emails; confirmed). */
export const WINTER_SPLASH_CONTACT = 'Vasteras@indiskbarnklubb.se';

const tx = (en: string, sv: string) => ({ en, sv });
const C = WINTER_SPLASH_CONTACT;

export const WINTER_SPLASH_PRIVACY: PrivacySection[] = [
  {
    title: tx('Who is responsible', 'Vem som ansvarar'),
    paragraphs: [
      tx(
        `Winter Splash 2026 is organised by Indisk Barnklubb (IBK) Västerås, which is responsible for the personal data you give when you register (the data controller). INIAC runs the registration system for IBK and handles the data only on IBK's instructions, under a data processing agreement between IBK and INIAC (the data processor). Questions, and requests to see, correct or delete your data: ${C}.`,
        `Winter Splash 2026 arrangeras av Indisk Barnklubb (IBK) Västerås, som ansvarar för de personuppgifter du lämnar när du anmäler dig (personuppgiftsansvarig). INIAC driver anmälningssystemet för IBK och behandlar uppgifterna bara enligt IBK:s instruktioner, enligt ett personuppgiftsbiträdesavtal mellan IBK och INIAC (personuppgiftsbiträde). Frågor, och önskemål om att se, rätta eller radera dina uppgifter: ${C}.`,
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
        'To protect the form from misuse: a scrambled (hashed) form of the internet address it was sent from.',
        'För att skydda formuläret mot missbruk: en krypterad (hashad) form av den internetadress som det skickades från.',
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
        'To publish photos or videos in which you or your children can be seen: only with separate, optional consent (Article 6(1)(a)). For children, the consent is given by a parent or legal guardian, separately from the registration. Saying no does not affect taking part.',
        'För att publicera foton eller filmer där du eller dina barn syns: bara med ett separat, frivilligt samtycke (artikel 6.1 a). För barn lämnas samtycket av en förälder eller vårdnadshavare, separat från anmälan. Att säga nej påverkar inte deltagandet.',
      ),
    ],
  },
  {
    title: tx('Who sees it', 'Vem som ser uppgifterna'),
    paragraphs: [
      tx(
        "IBK's organisers of Winter Splash 2026. INIAC (the registration system), with Supabase (the database) and Hostinger (the website and email) as its subcontractors, processes the data on IBK's behalf. We don't sell your data or use it for marketing.",
        'IBK:s arrangörer av Winter Splash 2026. INIAC (anmälningssystemet), med Supabase (databasen) och Hostinger (webbplatsen och e-posten) som underbiträden, behandlar uppgifterna för IBK:s räkning. Vi säljer inte dina uppgifter och använder dem inte för marknadsföring.',
      ),
    ],
  },
  {
    title: tx('How long we keep it', 'Hur länge vi sparar uppgifterna'),
    paragraphs: [],
    items: [
      tx("Payment screenshots: deleted from IBK's inbox once the payment has been verified and reconciled.", 'Skärmbilder av betalningar: raderas från IBK:s inkorg när betalningen har kontrollerats och stämts av.'),
      tx(
        'Registration details: deleted by 31 March 2027, except information that must be kept to meet legal accounting obligations (the payment records below).',
        'Anmälningsuppgifter: raderas senast 31 mars 2027, utom uppgifter som måste sparas för att uppfylla lagkrav på bokföring (betalningsuppgifterna nedan).',
      ),
      tx(
        "Payment records (amount, date, reference): in IBK's accounts for as long as the Bookkeeping Act requires, until the end of the seventh year after the year in which the financial year ended.",
        'Betalningsuppgifter (belopp, datum, referens): i IBK:s bokföring så länge bokföringslagen kräver, till och med det sjunde året efter utgången av det kalenderår då räkenskapsåret avslutades.',
      ),
      tx('The scrambled internet address used against misuse: two days.', 'Den krypterade internetadressen som används mot missbruk: två dagar.'),
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
        `You can ask to see, correct or delete your data, restrict or object to how it is used, and receive it in a portable format. You can withdraw your photo consent at any time; this does not affect what was done before. Email ${C}. If you are unhappy with how we handle your data, you can complain to the Swedish Authority for Privacy Protection (IMY), imy.se.`,
        `Du kan be att få se, rätta eller radera dina uppgifter, begränsa eller invända mot hur de används och få ut dem i ett överförbart format. Du kan när som helst återkalla ditt fotosamtycke; det påverkar inte det som redan har gjorts. Mejla ${C}. Om du är missnöjd med hur vi hanterar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY), imy.se.`,
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
