// The privacy notice for Future InnoHack and RoboKidovation Build & Play registrations (vfi.iniac.se/privacy,
// indiskbarnklubb.se/ibk/privacy), linked from the guardian confirmation page. Final wording: controller INIAC,
// contact contact@iniac.se, retention and children's data. It stays unpublished until the organisers approve it: until then the live page
// says that the notice is being finalised, and only preview builds made with VITE_PRIVACY_DRAFT=1 show the draft.
// When it is approved: set PRIVACY_NOTICE_APPROVED to true, PRIVACY_VERSION to the approval date, and the same date in
// the Admin Panel's fut_inno_innohack_settings.privacy_version (stored with each guardian confirmation).
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../content/useT';

/** The version guardians confirm against (also stored with each confirmation by the database). */
export const PRIVACY_VERSION = '2026-11-26';

/** False until the organisers approve the text below. Kid InnoHack must not open before this is true. */
export const PRIVACY_NOTICE_APPROVED = true;

interface Text { en: string; sv: string }
export interface PrivacySection { title: Text; paragraphs: Text[]; items?: Text[] }

const tx = (en: string, sv: string): Text => ({ en, sv });

/** The notice, section by section (English and Swedish). */
export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: tx('Who is responsible', 'Vem som ansvarar'),
    paragraphs: [
      tx(
        'Future InnoHack (Kid InnoHack and Young InnoHack) and RoboKidovation Build & Play are organised by INIAC together with Indisk Barnklubb (IBK) Västerås. INIAC is the data controller: INIAC runs the registration system and decides how the data is used. IBK co-organises the events in Västerås and uses the data only to run them.',
        'Future InnoHack (Kid InnoHack och Young InnoHack) och RoboKidovation Build & Play arrangeras av INIAC tillsammans med Indisk Barnklubb (IBK) Västerås. INIAC är personuppgiftsansvarig: INIAC driver anmälningssystemet och bestämmer hur uppgifterna används. IBK är medarrangör av evenemangen i Västerås och använder uppgifterna enbart för att genomföra dem.',
      ),
      tx(
        'This notice applies to registrations on vfi.iniac.se and indiskbarnklubb.se. Questions about your data, and requests to see, correct or delete it: contact@iniac.se.',
        'Detta meddelande gäller anmälningar på vfi.iniac.se och indiskbarnklubb.se. Frågor om dina uppgifter, och begäran om att se, rätta eller radera dem: contact@iniac.se.',
      ),
    ],
  },
  {
    title: tx('What we collect', 'Vilka uppgifter vi samlar in'),
    paragraphs: [],
    items: [
      tx(
        'Kid InnoHack: each child’s name, grade and, if given, school; which of the five sessions each child can attend, and their attendance; their place and team; the name, email address and phone number of each child’s parent or guardian and of the person who registers them (a parent, guardian or teacher); and each guardian’s answer (confirmed or declined, when, and to which version of this notice). Registrations sent with the earlier idea form also hold the idea.',
        'Kid InnoHack: varje barns namn, årskurs och, om det anges, skola; vilka av de fem träffarna varje barn kan vara med på, och deras närvaro; plats och lag; namn, e-postadress och telefonnummer till varje barns förälder eller vårdnadshavare och till den som anmäler dem (förälder, vårdnadshavare eller lärare); samt varje vårdnadshavares svar (bekräftat eller avböjt, när, och mot vilken version av detta meddelande). Anmälningar som skickades med det tidigare idéformuläret innehåller även idén.',
      ),
      tx(
        'Young InnoHack: your name, contact details, category (gymnasium, university or professional), organisation, skills and experience; whether you take part hybrid or fully online, which sessions you can attend, and your attendance; the themes you choose and your team; and whether you are under 18. If you are, your parent or guardian’s name, email address and phone number, and their answer.',
        'Young InnoHack: ditt namn, kontaktuppgifter, kategori (gymnasium, universitet eller yrkesverksam), organisation, färdigheter och erfarenhet; om du deltar hybrid eller helt digitalt, vilka träffar du kan vara med på, och din närvaro; de teman du väljer och ditt lag; samt om du är under 18 år. Om du är det: din förälders eller vårdnadshavares namn, e-postadress och telefonnummer, och deras svar.',
      ),
      tx(
        'Mentors: name, contact details, organisation and expertise.',
        'Mentorer: namn, kontaktuppgifter, organisation och kompetens.',
      ),
      tx(
        'Build & Play: the name, email address and phone number of the parent or guardian; each child’s name and age group (preschool to grade 2) and, if you give it, their preschool or school; that a parent or guardian stays with the child; and whether photos may be published.',
        'Build & Play: namn, e-postadress och telefonnummer till föräldern eller vårdnadshavaren; varje barns namn och ålder (förskola till årskurs 2) och, om du anger det, barnets förskola eller skola; att en förälder eller vårdnadshavare stannar med barnet; samt om foton får publiceras.',
      ),
      tx(
        'To protect the forms from misuse, a scrambled (hashed) form of the internet address a form was sent from is kept for two days.',
        'För att skydda formulären mot missbruk sparas en krypterad (hashad) form av den internetadress som formuläret skickades från i två dagar.',
      ),
    ],
  },
  {
    title: tx('Children’s data', 'Barns uppgifter'),
    paragraphs: [
      tx(
        'Most participants are children, so we keep what we collect about them to a minimum: their name, grade or age group and, if you give it, their school or preschool. For Kid InnoHack also which sessions they can attend, their attendance and their team.',
        'De flesta deltagarna är barn, så vi samlar in så lite som möjligt om dem: namn, årskurs eller ålder och, om du anger det, skola eller förskola. För Kid InnoHack även vilka träffar de kan vara med på, deras närvaro och deras lag.',
      ),
    ],
    items: [
      tx(
        'Kid InnoHack: a parent, guardian or teacher registers the child, and every child’s parent or guardian then confirms by email before the child can get a place.',
        'Kid InnoHack: en förälder, vårdnadshavare eller lärare anmäler barnet, och varje barns förälder eller vårdnadshavare bekräftar sedan via e-post innan barnet kan få en plats.',
      ),
      tx(
        'Young InnoHack: participants under 18 register themselves and give a parent or guardian, who confirms by email that they may take part.',
        'Young InnoHack: deltagare under 18 år anmäler sig själva och anger en förälder eller vårdnadshavare, som bekräftar via e-post att de får delta.',
      ),
      tx(
        'Build & Play: the child’s parent or guardian registers the child and stays with them during the activity.',
        'Build & Play: barnets förälder eller vårdnadshavare anmäler barnet och stannar med barnet under aktiviteten.',
      ),
      tx(
        'Children’s data is used only to run the activity. It is not used for marketing or profiling, and it is not sold.',
        'Barns uppgifter används bara för att genomföra aktiviteten. De används inte för marknadsföring eller profilering och säljs inte.',
      ),
      tx(
        'Photos or videos of a child are published only with a parent’s or guardian’s separate consent (see Photos and videos).',
        'Foton eller filmer av ett barn publiceras bara med ett separat samtycke från förälder eller vårdnadshavare (se Foton och filmer).',
      ),
      tx(
        'Parents and guardians can ask to see, correct or delete their child’s data at contact@iniac.se.',
        'Föräldrar och vårdnadshavare kan be att få se, rätta eller radera sitt barns uppgifter via contact@iniac.se.',
      ),
    ],
  },
  {
    title: tx('Why we use it, and the legal basis', 'Varför vi använder uppgifterna och med vilket rättsligt stöd'),
    paragraphs: [],
    items: [
      tx(
        'A child’s participation in Kid InnoHack, and that of a Young InnoHack participant under 18: the consent of their parent or guardian (GDPR Article 6(1)(a)), given through the email confirmation.',
        'Ett barns deltagande i Kid InnoHack, och en deltagares under 18 år i Young InnoHack: samtycke från förälder eller vårdnadshavare (artikel 6.1 a i dataskyddsförordningen, GDPR), som lämnas genom bekräftelsen via e-post.',
      ),
      tx(
        'Until the guardian has answered, a registration is kept only to ask for their confirmation (legitimate interest, Article 6(1)(f)).',
        'Tills vårdnadshavaren har svarat sparas en anmälan enbart för att be om bekräftelsen (berättigat intresse, artikel 6.1 f).',
      ),
      tx(
        'Young InnoHack, Build & Play and mentor registrations: to handle your registration and run the event you signed up for (Article 6(1)(b)). For Build & Play, the parent or guardian registers their own child.',
        'Anmälningar till Young InnoHack, Build & Play och som mentor: för att hantera din anmälan och genomföra evenemanget du har anmält dig till (artikel 6.1 b). Till Build & Play anmäler föräldern eller vårdnadshavaren sitt eget barn.',
      ),
      tx(
        'Publishing photos and videos: separate, optional consent (Article 6(1)(a)).',
        'Publicering av foton och filmer: ett separat, frivilligt samtycke (artikel 6.1 a).',
      ),
      tx(
        'Records of guardians’ answers and consents: kept because GDPR requires us to be able to show that consent was given (Article 7(1)).',
        'Uppgifter om vårdnadshavares svar och samtycken: sparas eftersom GDPR kräver att vi kan visa att samtycke har lämnats (artikel 7.1).',
      ),
    ],
  },
  {
    title: tx('Guardian confirmation', 'Vårdnadshavarens bekräftelse'),
    paragraphs: [
      tx(
        'Every child in Kid InnoHack, and every Young InnoHack participant under 18, needs their parent’s or guardian’s confirmation. When a registration is sent, each guardian named in the form gets an email with a personal link. The link works for 7 days, and at the latest until 5 December 2026 at 10:00 Swedish time (Kid InnoHack) or 10 December 2026 at 12:00 (Young InnoHack). A guardian whose link has expired can ask for a new one on the confirmation page until then.',
        'Varje barn i Kid InnoHack, och varje deltagare under 18 år i Young InnoHack, behöver bekräftelse från sin förälder eller vårdnadshavare. När en anmälan skickas in får varje vårdnadshavare som anges i formuläret ett e-postmeddelande med en personlig länk. Länken gäller i 7 dagar, dock längst till den 5 december 2026 kl. 10.00 svensk tid (Kid InnoHack) eller den 10 december 2026 kl. 12.00 (Young InnoHack). En vårdnadshavare vars länk har gått ut kan be om en ny på bekräftelsesidan fram till dess.',
      ),
      tx(
        'A child or participant can only take part when their guardian has confirmed by then. If a guardian declines, or has not confirmed in time, they do not take part.',
        'Ett barn eller en deltagare kan bara delta när vårdnadshavaren har bekräftat inom den tiden. Om vårdnadshavaren tackar nej, eller inte har bekräftat i tid, deltar de inte.',
      ),
      tx(
        'A guardian can withdraw their consent at any time by emailing contact@iniac.se. The child then no longer takes part.',
        'En vårdnadshavare kan när som helst återkalla sitt samtycke genom att mejla contact@iniac.se. Barnet deltar då inte längre.',
      ),
    ],
  },
  {
    title: tx('Photos and videos (optional)', 'Foton och filmer (frivilligt)'),
    paragraphs: [
      tx(
        'Photos or videos of a child are only published by the organisers (on our websites and social media) with the separate, optional consent of the child’s parent or guardian: for Kid InnoHack and Young InnoHack participants under 18 on the confirmation page, for Build & Play in the registration form. Saying no does not affect taking part.',
        'Foton eller filmer av ett barn publiceras av arrangörerna (på våra webbplatser och i sociala medier) bara med ett separat, frivilligt samtycke från barnets förälder eller vårdnadshavare: för Kid InnoHack och för deltagare under 18 år i Young InnoHack på bekräftelsesidan, för Build & Play i anmälningsformuläret. Att säga nej påverkar inte deltagandet.',
      ),
      tx(
        'This consent can be withdrawn at any time by emailing contact@iniac.se. We then stop using the material and remove it from our own channels. Material that others have already shared or printed may not be possible to remove.',
        'Samtycket kan återkallas när som helst genom att mejla contact@iniac.se. Vi slutar då använda materialet och tar bort det från våra egna kanaler. Material som andra redan har delat eller skrivit ut kan vara omöjligt att ta bort.',
      ),
    ],
  },
  {
    title: tx('Who sees it', 'Vem som ser uppgifterna'),
    paragraphs: [
      tx(
        'The organisers’ coordinators, and the teams’ mentors and the judges, see what they need for their part of the event.',
        'Arrangörernas samordnare, samt lagens mentorer och juryn, ser det de behöver för sin del av evenemanget.',
      ),
      tx(
        'Our service providers process the data on our behalf: Supabase (database and registration system) and Hostinger (website hosting and email delivery). We do not sell your data or use it for advertising.',
        'Våra tjänsteleverantörer behandlar uppgifterna för vår räkning: Supabase (databas och anmälningssystem) och Hostinger (webbhotell och e-postutskick). Vi säljer inte dina uppgifter och använder dem inte för reklam.',
      ),
    ],
  },
  {
    title: tx('How long we keep it', 'Hur länge vi sparar uppgifterna'),
    paragraphs: [tx('When a period ends, the data is deleted.', 'När en period har löpt ut raderas uppgifterna.')],
    items: [
      tx(
        'Registrations whose guardian did not confirm in time (Kid InnoHack by 5 December 2026 at 10:00, Young InnoHack under 18 by 10 December 2026 at 12:00): deleted within 30 days.',
        'Anmälningar där vårdnadshavaren inte bekräftade i tid (Kid InnoHack senast den 5 december 2026 kl. 10.00, Young InnoHack under 18 år senast den 10 december 2026 kl. 12.00): raderas inom 30 dagar.',
      ),
      tx(
        'Registrations (Future InnoHack and Build & Play), ideas and mentor registrations: until 12 December 2027.',
        'Anmälningar (Future InnoHack och Build & Play), idéer och mentorsanmälningar: till och med den 12 december 2027.',
      ),
      tx(
        'Guardians’ answers and consent records: 24 months after the final, until 12 December 2028.',
        'Vårdnadshavares svar och samtycken: 24 månader efter finalen, till och med den 12 december 2028.',
      ),
      tx(
        'Photos and videos published with consent: until the consent is withdrawn, and at most until 12 December 2028.',
        'Foton och filmer som publicerats med samtycke: tills samtycket återkallas, dock längst till och med den 12 december 2028.',
      ),
    ],
  },
  {
    title: tx('Deleting your data', 'Radera dina uppgifter'),
    paragraphs: [
      tx(
        'Email contact@iniac.se from the email address used in the registration, and say which registration or idea it concerns (the reference number from your receipt helps). A parent or guardian can ask for their child’s data to be deleted. We may ask you to confirm who you are.',
        'Mejla contact@iniac.se från den e-postadress som användes vid anmälan och berätta vilken anmälan eller idé det gäller (referensnumret i ditt kvitto hjälper). En förälder eller vårdnadshavare kan begära att barnets uppgifter raderas. Vi kan be dig bekräfta vem du är.',
      ),
      tx(
        'We delete the data within one month and confirm by email. If a child’s data is deleted before the final, the child can no longer take part.',
        'Vi raderar uppgifterna inom en månad och bekräftar via e-post. Om ett barns uppgifter raderas före finalen kan barnet inte längre delta.',
      ),
    ],
  },
  {
    title: tx('Your rights', 'Dina rättigheter'),
    paragraphs: [
      tx(
        'You can ask to see the data we hold about you, have it corrected or deleted, restrict or object to its use, and receive it in a portable format. You can withdraw a consent at any time; this does not affect what was done before. Email contact@iniac.se.',
        'Du kan begära att få se de uppgifter vi har om dig, få dem rättade eller raderade, begränsa eller invända mot hur de används och få ut dem i ett överförbart format. Du kan när som helst återkalla ett samtycke; det påverkar inte det som redan har gjorts. Mejla contact@iniac.se.',
      ),
      tx(
        'If you are unhappy with how we handle your data, you can complain to the Swedish Authority for Privacy Protection (IMY), imy.se.',
        'Om du är missnöjd med hur vi hanterar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY), imy.se.',
      ),
    ],
  },
  {
    title: tx('Changes to this notice', 'Ändringar i detta meddelande'),
    paragraphs: [
      tx(
        'If this notice changes, the new version is published here with a new date. Each guardian’s confirmation records the version they confirmed against.',
        'Om meddelandet ändras publiceras den nya versionen här med ett nytt datum. Varje vårdnadshavares bekräftelse sparar vilken version den gällde.',
      ),
    ],
  },
];

/** Preview builds can show the draft for review (VITE_PRIVACY_DRAFT=1); live builds never do. */
const showDraft = (): boolean => import.meta.env.VITE_PRIVACY_DRAFT === '1';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="font-headline font-black text-lg uppercase tracking-tight text-[#0A1930]">{title}</h2>
    <div className="text-sm text-slate-700 leading-relaxed space-y-2">{children}</div>
  </section>
);

export const PrivacyNoticePage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { L } = useT();
  const published = PRIVACY_NOTICE_APPROVED || showDraft();
  return (
    <div className="w-full bg-white text-[#0A1930] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <button type="button" onClick={onNavigateHome} className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>{L('Back to home', 'Tillbaka till startsidan')}</span>
        </button>
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <h1 className="font-headline font-black uppercase tracking-tight leading-tight" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
            {L('Privacy notice', 'Integritetsmeddelande')}
          </h1>
          <p className="text-sm text-slate-600">
            {L(`Future InnoHack and Build & Play registrations · version ${PRIVACY_VERSION}`, `Anmälningar till Future InnoHack och Build & Play · version ${PRIVACY_VERSION}`)}
          </p>
        </div>

        {!published ? (
          <p className="text-sm text-slate-700 leading-relaxed">
            {L(
              'The privacy notice for Future InnoHack is being finalised and will be published here before Kid InnoHack opens for ideas. Questions about your data: contact@iniac.se.',
              'Integritetsmeddelandet för Future InnoHack håller på att färdigställas och publiceras här innan Kid InnoHack öppnar för idéer. Frågor om dina uppgifter: contact@iniac.se.',
            )}
          </p>
        ) : (
          <>
            {!PRIVACY_NOTICE_APPROVED && (
              <p className="border-2 border-[#FFCD00] bg-[#FFCD00]/15 px-4 py-3 text-sm font-bold text-[#0A1930]">
                {L('DRAFT for review: not approved and not in effect.', 'UTKAST för granskning: inte godkänt och gäller inte.')}
              </p>
            )}
            {PRIVACY_SECTIONS.map((s) => (
              <Section key={s.title.en} title={L(s.title.en, s.title.sv)}>
                {s.paragraphs.map((p) => <p key={p.en}>{L(p.en, p.sv)}</p>)}
                {s.items && (
                  <ul className="list-disc pl-5 space-y-1.5">
                    {s.items.map((p) => <li key={p.en}>{L(p.en, p.sv)}</li>)}
                  </ul>
                )}
              </Section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
