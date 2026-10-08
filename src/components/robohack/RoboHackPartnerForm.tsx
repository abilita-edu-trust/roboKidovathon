import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import type { Bilingual, RoboHackEvent } from '../../data/robohack/types';

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#006AA7] focus:ring-1 focus:ring-[#006AA7]';
const labelCls = 'block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1.5';
const chip = (active: boolean) =>
  `py-1.5 px-3 text-xs border transition-all text-left ${
    active ? 'bg-[#006AA7] border-[#006AA7] text-white font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
  }`;
const submitCls =
  'w-full btn-pill-lime py-3.5 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-60';

const useT = () => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  return { sv, L: (en: string, s: string) => (sv ? s : en), T: (b: Bilingual) => (sv ? b.sv : b.en) };
};

const ErrorBox: React.FC<{ message: string }> = ({ message }) =>
  message ? (
    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  ) : null;

const Success: React.FC<{ title: string; body: string; id: string; again: string; onAgain: () => void }> = ({ title, body, id, again, onAgain }) => (
  <div className="text-center py-10 space-y-4">
    <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
    <h3 className="font-headline font-black text-2xl uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-slate-600 max-w-md mx-auto">{body}</p>
    {id && (
      <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-200 font-mono-code text-sm font-bold text-[#006AA7]">{id}</div>
    )}
    <div>
      <button type="button" onClick={onAgain} className="text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline">
        {again}
      </button>
    </div>
  </div>
);

const Consent: React.FC<{ checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }> = ({ checked, onChange, children }) => (
  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
    <input type="checkbox" className="mt-0.5 accent-[#006AA7]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>{children}</span>
  </label>
);

/** "Become a Partner" form for a RoboHack city site; shown as option 7 on its register page. */
export const PartnerForm: React.FC<{ event: RoboHackEvent }> = ({ event }) => {
  const { L, T } = useT();

  const [organisation, setOrganisation] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [ways, setWays] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [doneId, setDoneId] = useState('');

  const reset = () => {
    setOrganisation(''); setName(''); setEmail(''); setPhone(''); setWebsite(''); setWays([]); setMessage('');
    setConsent(false); setError(''); setDoneId('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (ways.length === 0) return setError(L('Please choose at least one way to take part.', 'Välj minst ett sätt att delta.'));
    if (!consent) return setError(L('Please accept the consent box.', 'Godkänn samtyckesrutan.'));
    setBusy(true);
    try {
      const { data, error: rpcError } = await supabase.rpc('submit_eu_skola_partner', {
        payload: {
          country_slug: event.location.countrySlug,
          city_slug: event.location.citySlug,
          organisation,
          contact_name: name,
          email,
          phone,
          website,
          ways_to_help: ways,
          message,
          consent_agreed: consent,
        },
      });
      if (rpcError) throw rpcError;
      setDoneId((data as string) || '');
    } catch (err) {
      console.error('RoboHack partner error:', err);
      setError(L('Something went wrong while submitting. Please try again.', 'Något gick fel vid inskickningen. Försök igen.'));
    } finally {
      setBusy(false);
    }
  };

  if (doneId) {
    return (
      <Success
        title={L('Thank you!', 'Tack!')}
        body={L('We have received your partner request and will contact you soon.', 'Vi har tagit emot din partnerförfrågan och kontaktar dig snart.')}
        id={doneId}
        again={L('Send another request', 'Skicka en till förfrågan')}
        onAgain={reset}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="pa-org">{L('Company or organisation', 'Företag eller organisation')} *</label>
          <input id="pa-org" required className={inputCls} value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pa-name">{L('Contact person', 'Kontaktperson')} *</label>
          <input id="pa-name" required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pa-email">{L('Email', 'E-post')} *</label>
          <input id="pa-email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pa-phone">{L('Phone', 'Telefon')}</label>
          <input id="pa-phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pa-web">{L('Website', 'Webbplats')}</label>
          <input id="pa-web" className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      <div>
        <span className={labelCls}>{L('How would you like to take part?', 'Hur vill ni delta?')} *</span>
        <div className="flex flex-wrap gap-2">
          {event.partners.ways.map((w) => {
            const active = ways.includes(w.en);
            return (
              <button
                key={w.en}
                type="button"
                aria-pressed={active}
                onClick={() => setWays(active ? ways.filter((x) => x !== w.en) : [...ways, w.en])}
                className={chip(active)}
              >
                {T(w)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="pa-msg">{L('Message', 'Meddelande')}</label>
        <textarea id="pa-msg" rows={4} className={inputCls} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <Consent checked={consent} onChange={setConsent}>
        {L('I agree that these details are stored so the organisers can contact us.', 'Jag godkänner att uppgifterna sparas så att arrangörerna kan kontakta oss.')}
      </Consent>

      <ErrorBox message={error} />
      <button type="submit" disabled={busy} className={submitCls}>
        <span>{busy ? L('Sending…', 'Skickar…') : T(event.partners.cta)}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
