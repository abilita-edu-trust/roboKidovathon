// Winter Splash 2026 registration (indiskbarnklubb.se/ibk/winter-splash): General Admission for everyone (one price per
// person, adults and children alike, paid by Bankgiro and checked by hand), or a guest / performer (no payment).
// Three steps (how you are coming, your details, a last check), then the reference and, for General Admission, the
// payment instructions. The database sets the price when the form arrives; nothing here confirms a registration.
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Mic2, Ticket, Users } from 'lucide-react';
import { useT } from '../content/useT';
import { AccentContext, ChoiceGroup } from './register/ChoiceCards';
import { Chips, Grid, Section, TextArea, TextField, type SetValue, type Values } from './register/ui';
import {
  WS_BADGE, WS_BLANK, WS_EVENT, WS_MAX, WS_PRICES, sek, wsAttendees, wsBandText, wsDateTime, wsErrorText, wsFetchPublic,
  wsPriceAt, wsProblem, wsSubmit, wsTierText, type WsPublic, type WsReceipt, type WsValues,
} from '../lib/winterSplash';

type Step = 'choose' | 'details' | 'check';
const STEPS: Step[] = ['choose', 'details', 'check'];
const PRIVACY_HREF = '/ibk/winter-splash/privacy';
/** The evening starts at 17:00 on 12 December; registration is shown as closed from then (text only, nothing closes). */
const EVENT_START = new Date('2026-12-12T17:00:00+01:00');

const outlineBtn =
  'inline-flex items-center gap-2 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-[#0A1930] text-xs font-headline font-bold uppercase tracking-wider transition-colors';
const mainBtn =
  'inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#006AA7] hover:bg-[#013A63] text-white text-xs font-headline font-black uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const Tick: React.FC<{ id: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }> = ({ id, checked, onChange, children }) => (
  <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer select-none">
    <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#006AA7]" />
    <span className="text-sm text-slate-700 leading-snug">{children}</span>
  </label>
);

/** Today's price, the total and the three periods (General Admission). */
const PriceBox: React.FC<{ price: number; band: string; attendees: number }> = ({ price, band, attendees }) => {
  const { L } = useT();
  return (
    <div className="border-l-4 border-[#FFCD00] bg-[#FFF8E1] px-4 py-4 space-y-3">
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
        <span className="font-bold text-[#0A1930]">{L(`Price today: ${price} SEK per person`, `Pris i dag: ${price} kr per person`)}</span>
        <span className="text-slate-600">{wsBandText(band, L)}</span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm text-slate-700">{L(`${attendees} ${attendees === 1 ? 'attendee' : 'attendees'} × ${price} SEK`, `${attendees} deltagare × ${price} kr`)}</span>
        <span className="font-headline font-black text-2xl text-[#0A1930]" aria-live="polite">{sek(attendees * price, L)}</span>
      </div>
      <ul className="text-[13px] text-slate-600 space-y-0.5">
        {WS_PRICES.map((p) => (
          <li key={p.band} className={p.band === band ? 'font-bold text-[#0A1930]' : ''}>{wsTierText(p, L)}</li>
        ))}
      </ul>
      <p className="text-[13px] text-slate-600">
        {L('The price is locked when you send the form. Pay within 48 hours.', 'Priset låses när du skickar formuläret. Betala inom 48 timmar.')}
      </p>
    </div>
  );
};

export const WinterSplashPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { L, sv, lang } = useT();
  const [pub, setPub] = useState<WsPublic | null | 'error'>(null);
  const [choice, setChoice] = useState<'general' | 'other' | ''>('');
  const [values, setValues] = useState<WsValues>(WS_BLANK);
  const [step, setStep] = useState<Step>('choose');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<WsReceipt | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    wsFetchPublic().then((p) => live && setPub(p)).catch(() => live && setPub('error'));
    return () => { live = false; };
  }, []);

  const v = values as unknown as Values;
  const set: SetValue = (k, value) => { setValues((old) => ({ ...old, [k]: value })); setError(''); };
  const general = choice === 'general';
  const today = pub && pub !== 'error' ? { price: pub.price_now, band: pub.band_now } : wsPriceAt(new Date());
  const attendees = wsAttendees(values);
  const open = pub !== null && pub !== 'error' && pub.registration_open;
  const scrollUp = () => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const go = (s: Step) => { setStep(s); setError(''); scrollUp(); };

  const choose = (id: string) => {
    setChoice(id as 'general' | 'other');
    setValues((old) => ({ ...old, kind: id === 'general' ? 'general' : old.kind === 'general' ? '' : old.kind }));
    setError('');
  };
  const next = () => {
    if (step === 'choose') return choice ? go('details') : setError(L('Choose how you are coming.', 'Välj hur du kommer.'));
    if (step === 'details') {
      if (choice === 'other' && !values.kind) return setError(L('Choose whether you are a guest or a performer.', 'Välj om du är gäst eller artist.'));
      const problem = wsProblem(values, L);
      return problem ? setError(problem) : go('check');
    }
  };
  const send = async () => {
    const problem = wsProblem(values, L);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      setReceipt(await wsSubmit(values, sv ? 'sv' : 'en'));
      scrollUp();
    } catch (e) {
      setError(wsErrorText(e, L));
    } finally {
      setBusy(false);
    }
  };
  const again = () => { setReceipt(null); setValues(WS_BLANK); setChoice(''); go('choose'); };

  const kindLabel = values.kind === 'general' ? L('General Admission', 'Allmän entré')
    : values.kind === 'performer' ? L('Performer', 'Artist') : values.kind === 'guest' ? L('Guest', 'Gäst') : '';
  const perfTypes = [
    { value: 'dance', en: 'Dance', sv: 'Dans' }, { value: 'music', en: 'Music', sv: 'Musik' },
    { value: 'song', en: 'Song', sv: 'Sång' }, { value: 'other', en: 'Other', sv: 'Annat' },
  ];
  const at = STEPS.indexOf(step);
  const stepTitle = [L('How you are coming', 'Hur du kommer'), L('Your details', 'Dina uppgifter'), L('Last check', 'Sista kontrollen')][at];

  // ── Step bodies ──
  const chooseBody = (
    <>
      <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mb-6">{L('How are you coming?', 'Hur kommer du?')}</h2>
      <ChoiceGroup
        label={L('How are you coming?', 'Hur kommer du?')}
        accent="robo"
        value={choice}
        onChoose={choose}
        items={[
          {
            id: 'general', icon: Ticket, title: L('General Admission', 'Allmän entré'),
            desc: L('For everyone. Register yourself and the people coming with you. Everyone pays the same price.', 'För alla. Anmäl dig själv och de som kommer med dig. Alla betalar samma pris.'),
            meta: <span className="inline-block px-2 py-0.5 bg-[#FFF8E1] border border-[#F1D978] text-[#0A1930] font-bold">{L(`${today.price} SEK per person today`, `${today.price} kr per person i dag`)}</span>,
          },
          {
            id: 'other', icon: Mic2, title: L('Guest or performer', 'Gäst eller artist'),
            desc: L('Invited guests, and groups performing on the evening.', 'Inbjudna gäster och grupper som uppträder under kvällen.'),
            meta: <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold">{L('No payment requested', 'Ingen betalning begärs')}</span>,
          },
        ]}
      />
    </>
  );

  const photoText = general
    ? L('IBK may publish photos and videos from Winter Splash 2026 in which our group, including any children, can be seen. Saying no does not affect taking part.',
      'IBK får publicera foton och filmer från Winter Splash 2026 där vårt sällskap, även barn, syns. Att säga nej påverkar inte deltagandet.')
    : L('IBK may publish photos and videos of us, including any children with us. Saying no does not affect taking part.',
      'IBK får publicera foton och filmer av oss, även av barn som är med. Att säga nej påverkar inte deltagandet.');
  const consents = (
    <div className="space-y-4">
      <Section title={L('Photos (optional)', 'Foton (frivilligt)')} icon={Users}>
        <Tick id="ws-photo" checked={values.photo} onChange={(x) => set('photo', x)}>{photoText}</Tick>
      </Section>
      <Tick id="ws-privacy" checked={values.privacy} onChange={(x) => set('privacy', x)}>
        {L('I have read the', 'Jag har läst')}{' '}
        <a href={PRIVACY_HREF} target="_blank" rel="noopener" className="text-[#006AA7] underline underline-offset-2 font-semibold">
          {L('privacy notice for Winter Splash 2026', 'integritetsmeddelandet för Winter Splash 2026')}
        </a>{' '}*
      </Tick>
    </div>
  );

  const contact = (
    <Section title={general ? L('Main contact', 'Kontaktperson') : L('Contact', 'Kontakt')} icon={Users}>
      <Grid>
        <TextField k="name" v={v} set={set} required maxLength={120} label={general ? L('Full name', 'Fullständigt namn') : L('Name', 'Namn')} placeholder={general ? L('First and last name', 'För- och efternamn') : L('Contact person', 'Kontaktperson')} />
        <TextField k="email" v={v} set={set} type="email" required maxLength={254} label={L('Email', 'E-post')} placeholder="name@example.org" />
        <TextField k="phone" v={v} set={set} type="tel" required maxLength={30} label={L('Phone', 'Telefon')} placeholder="+46 70 123 45 67" />
        {!general && <TextField k="groupName" v={v} set={set} maxLength={120} label={L('Group name', 'Gruppens namn')} placeholder={L('e.g. a dance group', 't.ex. en dansgrupp')} />}
      </Grid>
      {general && <p className="text-[13px] text-slate-600">{L('We send the receipt and the payment details to this email address.', 'Kvittot och betalningsuppgifterna skickas till den här e-postadressen.')}</p>}
    </Section>
  );

  const detailsBody = general ? (
    <>
      <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{L('General Admission', 'Allmän entré')}</h2>
      <p className="text-sm text-slate-600 mt-2 mb-6">{L('Fields with * are required.', 'Fält markerade med * är obligatoriska.')}</p>
      <div className="space-y-5">
        {contact}
        <Section title={L('Who’s coming', 'Vilka som kommer')} icon={Ticket}>
          <Grid cols={3}>
            <TextField k="adults" v={v} set={set} type="number" min="1" max={String(WS_MAX.adults)} required label={L('Adults, including you', 'Vuxna, inklusive dig')} />
            <TextField k="children" v={v} set={set} type="number" min="0" max={String(WS_MAX.children)} required label={L('Children', 'Barn')} />
            <div>
              <span className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">{L('Total attendees', 'Totalt antal deltagare')}</span>
              <span className="block px-3.5 py-2.5 bg-slate-100 border border-slate-200 font-headline font-black text-[#0A1930]">{attendees}</span>
            </div>
          </Grid>
          <p className="text-[13px] text-slate-600">{L('Everyone pays the same price, adults and children.', 'Alla betalar samma pris, vuxna och barn.')}</p>
        </Section>
        <PriceBox price={today.price} band={today.band} attendees={attendees} />
        {consents}
      </div>
    </>
  ) : (
    <>
      <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{L('Guest or performer', 'Gäst eller artist')}</h2>
      <p className="text-sm text-slate-600 mt-2 mb-6">{L('Fields with * are required.', 'Fält markerade med * är obligatoriska.')}</p>
      <div className="space-y-5">
        <Chips k="kind" v={v} set={set} lang={lang} required label={L('I am', 'Jag är')}
          options={[{ value: 'guest', en: 'A guest', sv: 'En gäst' }, { value: 'performer', en: 'A performer', sv: 'En artist' }]} />
        {contact}
        <Section title={values.kind === 'performer' ? L('Performance', 'Uppträdande') : L('Your group', 'Ert sällskap')} icon={Mic2}>
          <Grid>
            <TextField k="people" v={v} set={set} type="number" min="1" max={String(WS_MAX.people)} required
              label={values.kind === 'performer' ? L('Number of performers', 'Antal som uppträder') : L('Number of people', 'Antal personer')} />
            {values.kind === 'performer' && (
              <TextField k="perfMinutes" v={v} set={set} type="number" min="1" max={String(WS_MAX.minutes)} required label={L('Length (minutes)', 'Längd (minuter)')} />
            )}
          </Grid>
          {values.kind === 'performer' && (
            <>
              <Chips k="perfType" v={v} set={set} lang={lang} required label={L('Type', 'Typ')} options={perfTypes} />
              <TextArea k="perfDescription" v={v} set={set} required rows={2} label={L('Short description', 'Kort beskrivning')} placeholder={L('What you’ll perform', 'Vad ni ska framföra')} />
              <TextArea k="perfTechnical" v={v} set={set} rows={2} label={L('Music and technical needs', 'Musik och tekniska behov')} placeholder={L('e.g. a microphone; music on a USB stick', 't.ex. en mikrofon; musik på ett USB-minne')} />
            </>
          )}
        </Section>
        <p className="border-l-4 border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {L('No payment is requested. The organisers contact you to confirm.', 'Ingen betalning begärs. Arrangörerna kontaktar dig för att bekräfta.')}
        </p>
        {consents}
      </div>
    </>
  );

  const rows: [string, string][] = [
    [L('Registration', 'Anmälan'), kindLabel],
    [general ? L('Main contact', 'Kontaktperson') : L('Contact', 'Kontakt'), values.name.trim()],
    [L('Email', 'E-post'), values.email.trim()],
    [L('Phone', 'Telefon'), values.phone.trim()],
    ...(general
      ? [[L('Attendees', 'Deltagare'), (() => {
        const a = Number(values.adults), c = Number(values.children);
        return L(`${attendees} (${a} ${a === 1 ? 'adult' : 'adults'}${c ? `, ${c} ${c === 1 ? 'child' : 'children'}` : ''})`,
          `${attendees} (${a} ${a === 1 ? 'vuxen' : 'vuxna'}${c ? `, ${c} barn` : ''})`);
      })()] as [string, string]]
      : [
        [values.kind === 'performer' ? L('Performers', 'Antal som uppträder') : L('People', 'Personer'), values.people] as [string, string],
        ...(values.groupName.trim() ? [[L('Group name', 'Gruppens namn'), values.groupName.trim()] as [string, string]] : []),
        ...(values.kind === 'performer'
          ? [[L('Performance', 'Uppträdande'), `${perfTypes.find((p) => p.value === values.perfType)?.[sv ? 'sv' : 'en'] ?? ''} · ${values.perfMinutes} min · ${values.perfDescription.trim()}`] as [string, string]]
          : []),
      ]),
    [L('Photos', 'Foton'), values.photo ? L('May be published', 'Får publiceras') : L('Not to be published', 'Får inte publiceras')],
  ];
  const checkBody = (
    <>
      <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{L('Check and send', 'Kontrollera och skicka')}</h2>
      <p className="text-sm text-slate-600 mt-2 mb-6">{L('Check your details. You can go back and change them.', 'Kontrollera dina uppgifter. Du kan gå tillbaka och ändra dem.')}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] border border-slate-200 text-sm">
        {rows.map(([k, val]) => (
          <React.Fragment key={k}>
            <dt className="px-4 pt-3 sm:py-3 font-headline font-bold text-xs uppercase tracking-wider text-slate-500 sm:border-b border-slate-200">{k}</dt>
            <dd className="px-4 pb-3 pt-1 sm:py-3 text-[#0A1930] border-b border-slate-200 break-words">{val}</dd>
          </React.Fragment>
        ))}
      </dl>
      {general && <div className="mt-5"><PriceBox price={today.price} band={today.band} attendees={attendees} /></div>}
      <p className="mt-5 text-sm text-slate-700">
        {general
          ? L('After sending, you get your reference and the payment details, here and by email. Your registration is confirmed when we have checked your payment.',
            'När du har skickat får du din referens och betalningsuppgifterna, här och via e-post. Din anmälan är bekräftad när vi har kontrollerat din betalning.')
          : L('After sending, you get your reference here and by email. The organisers contact you to confirm.',
            'När du har skickat får du din referens här och via e-post. Arrangörerna kontaktar dig för att bekräfta.')}
      </p>
    </>
  );

  const doneBody = receipt && (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 shrink-0 bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-7 h-7" aria-hidden="true" /></span>
        <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">{L('Registration received', 'Anmälan mottagen')}</h2>
      </div>
      <p className="flex flex-wrap items-center gap-3 text-sm">
        <span>{L('Your reference', 'Din referens')}:</span>
        <span className="font-mono-code font-bold text-xl text-[#006AA7] tracking-wider px-3 py-1.5 bg-slate-50 border border-slate-200">{receipt.reference}</span>
      </p>
      {receipt.kind === 'general' && receipt.amount != null ? (
        <>
          <p className="border-l-4 border-[#8A5A00] bg-[#FFF3D6] px-4 py-3 text-sm text-[#0A1930]">
            <b>{L('Pending payment verification.', 'Väntar på att betalningen kontrolleras.')}</b>{' '}
            {L('Your registration is confirmed only when we have checked your payment. We email you when it is.', 'Din anmälan är bekräftad först när vi har kontrollerat din betalning. Vi mejlar dig när den är det.')}
          </p>
          <div className="border border-slate-300 p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span>{L(`${receipt.attendees} ${receipt.attendees === 1 ? 'attendee' : 'attendees'} × ${receipt.price} SEK`, `${receipt.attendees} deltagare × ${receipt.price} kr`)}</span>
              <span className="font-headline font-black text-2xl">{sek(receipt.amount, L)}</span>
            </div>
            <p className="font-bold text-[#8A5A00] text-sm">{L(`Pay by ${wsDateTime(receipt.pay_by, false)}`, `Betala senast ${wsDateTime(receipt.pay_by, true)}`)}</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-800">
              <li>{L('Pay ', 'Betala ')}<b>{sek(receipt.amount, L)}</b>{L(' to ', ' till ')}<b>{L('Bankgiro', 'bankgiro')} {receipt.bankgiro}</b> ({receipt.payee}).</li>
              <li>{L('Write ', 'Skriv ')}<b>{receipt.message}</b>{L(' in the message field.', ' i meddelandefältet.')}</li>
              <li>{L('Reply to the email we have just sent you, with a screenshot of the payment attached.', 'Svara på mejlet vi just skickade och bifoga en skärmbild av betalningen.')}</li>
            </ol>
          </div>
          <p className="text-sm text-slate-600">{L(`We have emailed the same details to ${values.email.trim()}. Questions? Reply to that email.`, `Vi har mejlat samma uppgifter till ${values.email.trim()}. Frågor? Svara på det mejlet.`)}</p>
        </>
      ) : (
        <p className="text-sm text-slate-700">
          {L(`Thank you. We have emailed a receipt to ${values.email.trim()}. The organisers contact you to confirm. No payment is requested.`,
            `Tack. Vi har mejlat ett kvitto till ${values.email.trim()}. Arrangörerna kontaktar dig för att bekräfta. Ingen betalning begärs.`)}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" onClick={again} className={mainBtn}>{L('Register someone else', 'Anmäl någon annan')}</button>
        <button type="button" onClick={onNavigateHome} className={outlineBtn}>{L('Back to home', 'Tillbaka till startsidan')}</button>
      </div>
    </div>
  );

  const closedBody = (
    <div className="py-4 space-y-3">
      <h2 className="font-headline font-black text-2xl uppercase tracking-tight text-[#0A1930]">
        {pub === 'error'
          ? L('Registration can’t be loaded right now', 'Anmälan kan inte visas just nu')
          : Date.now() >= EVENT_START.getTime() ? L('Registration has closed', 'Anmälan är stängd') : L('Registration opens soon', 'Anmälan öppnar snart')}
      </h2>
      <p className="text-sm text-slate-700">
        {pub === 'error'
          ? L('Please try again in a moment.', 'Försök igen om en stund.')
          : L('Registration for Winter Splash 2026 is not open at the moment. Please check back soon.', 'Anmälan till Winter Splash 2026 är inte öppen just nu. Titta in igen snart.')}
      </p>
    </div>
  );

  return (
    <AccentContext.Provider value="robo">
      <div className="w-full bg-white text-[#0A1930] pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <button type="button" onClick={onNavigateHome} className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{L('Back to home', 'Tillbaka till startsidan')}</span>
          </button>
          <div className="text-center space-y-2">
            <h1 className="font-headline font-black uppercase tracking-tight leading-tight" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}>Winter Splash 2026</h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              {L('Register for the evening at Växhuset in Västerås. Choose how you are coming, fill in a short form, and you are done.',
                'Anmäl dig till kvällen på Växhuset i Västerås. Välj hur du kommer, fyll i ett kort formulär, så är det klart.')}
            </p>
          </div>

          <div ref={panel} className="bg-white border-2 border-t-8 border-[#006AA7] shadow-xl scroll-mt-24">
            {/* The event stays in view, with its date and place */}
            <div className="flex items-center gap-4 p-4 sm:px-6 bg-slate-50 border-b border-slate-200">
              <img src={WS_BADGE} alt="" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-cover" style={{ clipPath: 'circle(49.1% at 49.9% 49.2%)' }} />
              <div className="min-w-0">
                <span className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500">{L('You’re registering for', 'Du anmäler dig till')}</span>
                <span className="block font-headline font-black text-lg sm:text-xl uppercase tracking-tight leading-tight text-[#006AA7]">Winter Splash 2026</span>
                <span className="mt-1 flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-0.5 text-[13px] font-mono-code font-semibold text-slate-600">
                  <span>{L(WS_EVENT.when.en, WS_EVENT.when.sv)}</span>
                  <span>{L(WS_EVENT.venue.en, WS_EVENT.venue.sv)}</span>
                  <span>{L(WS_EVENT.closes.en, WS_EVENT.closes.sv)}</span>
                </span>
              </div>
            </div>

            {pub === null ? (
              <div className="p-8 text-sm text-slate-500">{L('Loading…', 'Laddar…')}</div>
            ) : !open && !receipt ? (
              <div className="p-5 sm:p-8">{closedBody}</div>
            ) : (
              <>
                {!receipt && (
                  <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between gap-3 mb-2 text-[13px] font-mono-code font-bold uppercase tracking-wider">
                      <span className="text-[#0A1930]">{L(`Step ${at + 1} of 3`, `Steg ${at + 1} av 3`)}</span>
                      <span className="text-slate-500 text-right">{stepTitle}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {STEPS.map((s, j) => <span key={s} className={`h-1.5 ${j <= at ? 'bg-[#006AA7]' : 'bg-slate-200'}`} />)}
                    </div>
                  </div>
                )}
                <div className="p-5 sm:p-8">
                  {receipt ? doneBody : step === 'choose' ? chooseBody : step === 'details' ? detailsBody : checkBody}
                  {error && (
                    <div role="alert" className="mt-6 p-4 bg-red-50 border-2 border-red-300 flex items-center gap-3 text-sm font-semibold text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-600" aria-hidden="true" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
                {!receipt && (
                  <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button type="button" onClick={() => go(STEPS[at - 1])} className={`${outlineBtn} ${at === 0 ? 'invisible' : ''}`}>
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{L('Back', 'Tillbaka')}</span>
                    </button>
                    {step === 'check' ? (
                      <button type="button" onClick={send} disabled={busy} className={mainBtn}>
                        {busy ? L('Sending…', 'Skickar…') : L('Send registration', 'Skicka anmälan')}
                        {!busy && <ArrowRight className="w-4 h-4 text-[#FFCD00]" aria-hidden="true" />}
                      </button>
                    ) : (
                      <button type="button" onClick={next} disabled={step === 'choose' && !choice} className={mainBtn}>
                        {step === 'details' ? L('Continue to the last check', 'Fortsätt till sista kontrollen') : L('Continue', 'Fortsätt')}
                        <ArrowRight className="w-4 h-4 text-[#FFCD00]" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AccentContext.Provider>
  );
};
