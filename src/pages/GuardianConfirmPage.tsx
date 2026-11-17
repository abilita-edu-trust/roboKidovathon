// Kid InnoHack guardian confirmation (vfi.iniac.se/guardian and indiskbarnklubb.se/ibk/guardian): the page a parent or
// guardian opens from the email. It shows only their own children and the idea, asks for the required participation
// permission (and the privacy notice), offers separate optional photo/video consent, and records the answer through
// fut_inno_guardian_respond. An expired link can ask for a new one until the confirmation cut-off.
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Lock, Mail, ShieldCheck, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useT } from '../content/useT';
import { useSite } from '../context/SiteContext';
import { targetToHref } from '../content/sections/frame';

/** What fut_inno_guardian_info returns for a link. */
export interface GuardianInfo {
  status: 'pending' | 'confirmed' | 'declined' | 'expired' | 'closed' | 'invalid';
  guardian_name?: string;
  children?: string[];
  idea_title?: string;
  school?: string;
  privacy_version?: string;
  can_request_new_link?: boolean;
}

type View = GuardianInfo['status'] | 'loading' | 'error' | 'new-link-sent';

/** The token from the email link (?token=…), read once; the address bar then drops it. */
export function takeToken(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const token = (params.get('token') ?? '').trim();
  if (token) {
    params.delete('token');
    const rest = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''));
  }
  return /^[A-Za-z0-9_-]{20,200}$/.test(token) ? token : '';
}

const box = 'bg-white border-2 border-slate-200 p-5 sm:p-7';

export const GuardianConfirmPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { L } = useT();
  const site = useSite();
  const [token] = useState(takeToken);
  const [info, setInfo] = useState<GuardianInfo | null>(null);
  const [view, setView] = useState<View>(token ? 'loading' : 'invalid');
  const [permission, setPermission] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [media, setMedia] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const privacyHref = targetToHref(site.nav.homeRoute === 'ibk' ? 'ibk-privacy' : 'privacy');

  useEffect(() => {
    if (!token) return;
    supabase
      .rpc('fut_inno_guardian_info', { _token: token })
      .then(({ data, error: err }: { data: GuardianInfo | null; error: unknown }) => {
        if (err || !data) return setView('error');
        setInfo(data);
        setView(data.status);
      });
  }, [token]);

  const respond = async (give: boolean) => {
    if (give && (!permission || !privacy)) {
      setError(L('Tick both required boxes to confirm.', 'Kryssa i båda obligatoriska rutorna för att bekräfta.'));
      return;
    }
    if (!give && !window.confirm(L('Decline participation? The idea cannot be selected without your permission.', 'Avböja deltagande? Idén kan inte väljas ut utan ditt tillstånd.'))) return;
    setBusy(true);
    setError('');
    const { data, error: err } = await supabase.rpc('fut_inno_guardian_respond', { _token: token, _permission: give, _media_consent: give ? media : false });
    setBusy(false);
    if (err) return setError(L('Something went wrong. Please try again.', 'Något gick fel. Försök igen.'));
    setView(((data as { status?: View } | null)?.status as View) ?? (give ? 'confirmed' : 'declined'));
  };

  const newLink = async () => {
    setBusy(true);
    await supabase.rpc('fut_inno_guardian_new_link', { _token: token });
    setBusy(false);
    setView('new-link-sent');
  };

  const children = info?.children ?? [];
  const heading = (icon: React.ReactNode, title: string, body: string) => (
    <div className={`${box} text-center flex flex-col items-center gap-3`}>
      {icon}
      <h2 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">{title}</h2>
      <p className="text-sm text-slate-600 max-w-xl leading-relaxed">{body}</p>
      <button type="button" onClick={onNavigateHome} className="mt-2 text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline">
        {L('Go to the home page', 'Till startsidan')}
      </button>
    </div>
  );

  return (
    <div className="w-full bg-[#F2F8FD] text-[#0A1930] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-widest text-[#006AA7]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            {L('Future InnoHack · Kid InnoHack', 'Future InnoHack · Kid InnoHack')}
          </p>
          <h1 className="font-headline font-black uppercase tracking-tight leading-tight" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
            {L('Guardian confirmation', 'Vårdnadshavarens bekräftelse')}
          </h1>
        </div>

        {view === 'loading' && <div className={`${box} text-sm text-slate-600`}>{L('Opening your link…', 'Öppnar din länk…')}</div>}
        {view === 'invalid' &&
          heading(<XCircle className="w-10 h-10 text-red-500" />, L('This link does not work', 'Länken fungerar inte'),
            L('Open the link exactly as it is in the email. If it still does not work, contact contact@iniac.se.', 'Öppna länken precis som den står i e-postmeddelandet. Om den ändå inte fungerar, kontakta contact@iniac.se.'))}
        {view === 'error' &&
          heading(<XCircle className="w-10 h-10 text-red-500" />, L('We could not open your link', 'Vi kunde inte öppna din länk'), L('Please try again in a moment.', 'Försök igen om en stund.'))}
        {view === 'confirmed' &&
          heading(<CheckCircle2 className="w-10 h-10 text-emerald-600" />, L('Thank you: participation confirmed', 'Tack: deltagandet är bekräftat'),
            L('The idea counts once every child’s guardian has confirmed. The organisers contact the selected teams after 5 December 2026.', 'Idén räknas när alla barns vårdnadshavare har bekräftat. Arrangörerna kontaktar de utvalda lagen efter den 5 december 2026.'))}
        {view === 'declined' &&
          heading(<XCircle className="w-10 h-10 text-slate-500" />, L('You declined participation', 'Du har avböjt deltagande'),
            L('Your child will not take part, and the idea cannot be selected with your child in the team. Contact contact@iniac.se if this was a mistake.', 'Ditt barn deltar inte, och idén kan inte väljas ut med ditt barn i laget. Kontakta contact@iniac.se om detta blev fel.'))}
        {view === 'closed' &&
          heading(<Lock className="w-10 h-10 text-slate-500" />, L('Confirmations have closed', 'Bekräftelserna har stängt'),
            L('Guardian confirmations for Kid InnoHack 2026 are closed, so the idea can no longer be selected.', 'Vårdnadshavarnas bekräftelser för Kid InnoHack 2026 har stängt, så idén kan inte längre väljas ut.'))}
        {view === 'new-link-sent' &&
          heading(<Mail className="w-10 h-10 text-[#006AA7]" />, L('A new link is on its way', 'En ny länk är på väg'),
            L('Check your inbox (and spam folder). The old link no longer works.', 'Titta i din inkorg (och skräppost). Den gamla länken fungerar inte längre.'))}
        {view === 'expired' && (
          <div className={`${box} text-center flex flex-col items-center gap-3`}>
            <Clock className="w-10 h-10 text-amber-500" />
            <h2 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight">{L('This link has expired', 'Länken har gått ut')}</h2>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              {L('For your child’s safety, links only work for a limited time.', 'För ditt barns säkerhet fungerar länkarna bara en begränsad tid.')}
            </p>
            {info?.can_request_new_link ? (
              <button type="button" disabled={busy} onClick={newLink} className="mt-2 px-5 py-3 bg-[#006AA7] hover:bg-[#013A63] text-white text-xs font-headline font-black uppercase tracking-wider disabled:opacity-50">
                {L('Email me a new link', 'Mejla mig en ny länk')}
              </button>
            ) : (
              <p className="text-sm text-slate-600">{L('Contact contact@iniac.se for help.', 'Kontakta contact@iniac.se för hjälp.')}</p>
            )}
          </div>
        )}

        {view === 'pending' && info && (
          <>
            <div className={`${box} space-y-4`}>
              <p className="text-sm text-slate-700">
                {L(`Hello ${info.guardian_name ?? ''},`, `Hej ${info.guardian_name ?? ''},`)}{' '}
                {L(
                  `an idea has been sent to Kid InnoHack with ${children.length === 1 ? 'your child' : 'your children'} in the team. Please confirm that they may take part.`,
                  `en idé har skickats till Kid InnoHack med ${children.length === 1 ? 'ditt barn' : 'dina barn'} i laget. Bekräfta att ${children.length === 1 ? 'barnet' : 'barnen'} får delta.`,
                )}
              </p>
              <dl className="border border-slate-200 divide-y divide-slate-200 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 px-4 py-3">
                  <dt className="text-xs font-mono-code font-bold uppercase text-slate-500">{children.length > 1 ? L('Children', 'Barn') : L('Child', 'Barn')}</dt>
                  <dd className="font-medium">{children.join(', ')}</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 px-4 py-3">
                  <dt className="text-xs font-mono-code font-bold uppercase text-slate-500">{L('Idea', 'Idé')}</dt>
                  <dd className="font-medium">{info.idea_title}</dd>
                </div>
                {info.school && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 px-4 py-3">
                    <dt className="text-xs font-mono-code font-bold uppercase text-slate-500">{L('School', 'Skola')}</dt>
                    <dd className="font-medium">{info.school}</dd>
                  </div>
                )}
              </dl>
              <div className="text-sm text-slate-700 space-y-1.5">
                <p className="font-headline font-black text-xs uppercase tracking-wider text-[#0A1930]">{L('What taking part means', 'Vad deltagandet innebär')}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{L('Five ideas are selected on 5 December 2026.', 'Fem idéer väljs ut den 5 december 2026.')}</li>
                  <li>{L('Selected teams get one hour of guided mentoring a day, 6–11 December 2026 (session times are sent to you).', 'Utvalda lag får en timmes handledning om dagen, 6–11 december 2026 (tiderna skickas till dig).')}</li>
                  <li>{L('Final presentations on 12 December 2026 at Växhuset, Västerås.', 'Slutpresentationer den 12 december 2026 på Växhuset i Västerås.')}</li>
                  <li>{L('Participation is free.', 'Deltagandet är gratis.')}</li>
                </ul>
              </div>
            </div>

            <div className={`${box} space-y-4`}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={permission} onChange={(e) => setPermission(e.target.checked)} className="mt-0.5 w-5 h-5 cursor-pointer accent-[#006AA7]" />
                <span className="text-sm text-slate-800 leading-snug">
                  {children.length > 1
                    ? L(
                        'I am the parent or legal guardian of the children named above, and I give permission for them to take part in Kid InnoHack. *',
                        'Jag är förälder eller vårdnadshavare till barnen ovan och ger tillstånd till att de deltar i Kid InnoHack. *',
                      )
                    : L(
                        'I am the parent or legal guardian of the child named above, and I give permission for them to take part in Kid InnoHack. *',
                        'Jag är förälder eller vårdnadshavare till barnet ovan och ger tillstånd till att barnet deltar i Kid InnoHack. *',
                      )}
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 w-5 h-5 cursor-pointer accent-[#006AA7]" />
                <span className="text-sm text-slate-800 leading-snug">
                  {L('I have read the ', 'Jag har läst ')}
                  <a href={privacyHref} target="_blank" rel="noreferrer" className="text-[#006AA7] underline">
                    {L('privacy notice', 'integritetsmeddelandet')}
                  </a>
                  {info.privacy_version ? ` (${info.privacy_version})` : ''}. *
                </span>
              </label>
              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} className="mt-0.5 w-5 h-5 cursor-pointer accent-[#006AA7]" />
                  <span className="text-sm text-slate-800 leading-snug">
                    <span className="font-semibold">{L('Optional: photos and videos. ', 'Valfritt: foton och filmer. ')}</span>
                    {children.length > 1
                      ? L(
                          'I allow photos or videos of my children from Kid InnoHack to be published by the organisers. You can say no and your children still take part.',
                          'Jag tillåter att arrangörerna publicerar foton eller filmer av mina barn från Kid InnoHack. Du kan säga nej och dina barn deltar ändå.',
                        )
                      : L(
                          'I allow photos or videos of my child from Kid InnoHack to be published by the organisers. You can say no and your child still takes part.',
                          'Jag tillåter att arrangörerna publicerar foton eller filmer av mitt barn från Kid InnoHack. Du kan säga nej och ditt barn deltar ändå.',
                        )}
                  </span>
                </label>
              </div>
              {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" disabled={busy} onClick={() => respond(true)} className="flex-1 px-5 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] text-xs font-headline font-black uppercase tracking-wider disabled:opacity-50">
                  {L('Confirm participation', 'Bekräfta deltagande')}
                </button>
                <button type="button" disabled={busy} onClick={() => respond(false)} className="sm:w-auto px-5 py-3.5 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-headline font-black uppercase tracking-wider disabled:opacity-50">
                  {L('I do not give permission', 'Jag ger inte tillstånd')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
