import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Briefcase, CheckCircle2, HandHeart, Lightbulb, Rocket } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { submitIdea, uploadIdeaMedia } from '../../lib/ideasService';
import { useLanguage } from '../../context/LanguageContext';
import { VolunteerForm } from '../VolunteerForm';
import type { Bilingual, RoboHackEvent } from '../../data/robohack/types';

export type RoboHackFormTab = 'register' | 'idea' | 'partner' | 'volunteer';

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#006AA7] focus:ring-1 focus:ring-[#006AA7]';
const labelCls = 'block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1.5';
const chip = (active: boolean) =>
  `py-1.5 px-3 text-xs border transition-all text-left ${
    active ? 'bg-[#006AA7] border-[#006AA7] text-white font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
  }`;
const submitCls =
  'w-full btn-pill-lime py-3.5 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-60';

const LEVELS: { value: string; en: string; sv: string }[] = [
  { value: 'Grades 7–9', en: 'Grades 7–9', sv: 'Årskurs 7–9' },
  { value: 'Gymnasiet', en: 'Gymnasiet (upper secondary)', sv: 'Gymnasiet' },
  { value: 'University', en: 'University', sv: 'Universitet' },
  { value: 'Young professional', en: 'Young professional / other', sv: 'Ung yrkesverksam / annat' },
];

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

const cityFields = (event: RoboHackEvent) => ({
  country_slug: event.location.countrySlug,
  city_slug: event.location.citySlug,
  country_name: event.location.countryName,
  city_name: event.location.cityName,
});

/* ── Register (Join a RoboHack) ─────────────────────────────────────────── */
const RegisterForm: React.FC<{ event: RoboHackEvent }> = ({ event }) => {
  const { sv, L, T } = useT();
  const tracks = event.tracks.filter((t) => t.enabled);

  const [mode, setMode] = useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [level, setLevel] = useState('');
  const [track, setTrack] = useState('');
  const [under18, setUnder18] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [idea, setIdea] = useState('');
  const [consent, setConsent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [doneId, setDoneId] = useState('');

  const reset = () => {
    setMode('individual'); setTeamName(''); setTeamSize(''); setName(''); setEmail(''); setPhone('');
    setOrganisation(''); setLevel(''); setTrack(''); setUnder18(false); setGuardianName(''); setGuardianPhone('');
    setIdea(''); setConsent(false); setError(''); setDoneId('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!track) return setError(L('Please choose a track.', 'Välj ett spår.'));
    if (!level) return setError(L('Please choose your level.', 'Välj din nivå.'));
    if (!consent) return setError(L('Please accept the consent box.', 'Godkänn samtyckesrutan.'));

    const trackTitle = tracks.find((t) => t.id === track)?.title.en ?? track;
    setBusy(true);
    try {
      const payload = {
        ...cityFields(event),
        registration_type: 'student',
        form_type: 'hackathon',
        category_id: `yng-robohack-${event.location.citySlug}`,
        school_name: mode === 'team' ? `${teamName} (Team)` : organisation || name,
        team_name: mode === 'team' ? teamName : null,
        contact_name: name,
        email,
        phone,
        student_count: mode === 'team' ? teamSize || '1' : '1',
        grade_group: level,
        preferred_date: event.event.dates.en,
        consent_agreed: true,
        intake_details: {
          event: `${event.brand.name} ${event.brand.city}`,
          track: trackTitle,
          participation: mode,
          school_or_organisation: organisation || null,
          under_18: under18,
          guardian_name: under18 ? guardianName : null,
          guardian_phone: under18 ? guardianPhone : null,
          idea_or_problem: idea || null,
        },
      };
      const { data, error: rpcError } = await supabase.rpc('submit_eu_skola_registration', { payload });
      if (rpcError) throw rpcError;
      setDoneId((data as string) || '');
    } catch (err) {
      console.error('RoboHack registration error:', err);
      setError(L('Something went wrong while submitting. Please try again.', 'Något gick fel vid inskickningen. Försök igen.'));
    } finally {
      setBusy(false);
    }
  };

  if (doneId) {
    return (
      <Success
        title={L("You're registered!", 'Du är anmäld!')}
        body={L(
          `Thanks for joining ${event.brand.name} ${event.brand.city}. We will email you with the next steps.`,
          `Tack för att du är med i ${event.brand.name} ${event.brand.city}. Vi mejlar dig nästa steg.`
        )}
        id={doneId}
        again={L('Register someone else', 'Anmäl någon annan')}
        onAgain={reset}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <span className={labelCls}>{L('I am registering', 'Jag anmäler')} *</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={mode === 'individual'} onClick={() => setMode('individual')} className={chip(mode === 'individual')}>
            {L('Myself', 'Mig själv')}
          </button>
          <button type="button" aria-pressed={mode === 'team'} onClick={() => setMode('team')} className={chip(mode === 'team')}>
            {L('A team', 'Ett lag')}
          </button>
        </div>
      </div>

      {mode === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="rh-team">{L('Team name', 'Lagnamn')} *</label>
            <input id="rh-team" required className={inputCls} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="rh-size">{L('Team size', 'Antal i laget')} *</label>
            <input id="rh-size" required type="number" min={2} max={10} className={inputCls} value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="rh-name">{mode === 'team' ? L('Contact person', 'Kontaktperson') : L('Full name', 'Fullständigt namn')} *</label>
          <input id="rh-name" required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="rh-email">{L('Email', 'E-post')} *</label>
          <input id="rh-email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="rh-phone">{L('Phone', 'Telefon')} *</label>
          <input id="rh-phone" type="tel" required className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="rh-org">{L('School, university or organisation', 'Skola, universitet eller organisation')}</label>
          <input id="rh-org" className={inputCls} value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
        </div>
      </div>

      <div>
        <span className={labelCls}>{L('Level', 'Nivå')} *</span>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((o) => (
            <button key={o.value} type="button" aria-pressed={level === o.value} onClick={() => setLevel(o.value)} className={chip(level === o.value)}>
              {sv ? o.sv : o.en}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={labelCls}>{L('Track', 'Spår')} *</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {tracks.map((t) => {
            const Icon = t.icon;
            const active = track === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTrack(t.id)}
                className={`p-3 border text-left transition-all flex items-start gap-2.5 ${
                  active ? 'bg-[#0A1930] border-[#0A1930] text-white' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`w-8 h-8 flex items-center justify-center shrink-0 ${active ? 'bg-[#FFCD00] text-[#0A1930]' : 'bg-slate-100 text-[#006AA7]'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span>
                  <span className="block font-headline font-black uppercase text-sm">{T(t.title)}</span>
                  <span className={`block text-[11px] ${active ? 'text-white/70' : 'text-slate-500'}`}>{T(t.tagline)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Consent checked={under18} onChange={setUnder18}>
        {mode === 'team' ? L('Someone in the team is under 18', 'Någon i laget är under 18 år') : L('I am under 18', 'Jag är under 18 år')}
      </Consent>
      {under18 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50 border border-amber-200">
          <div>
            <label className={labelCls} htmlFor="rh-gname">{L('Parent / guardian name', 'Förälder / vårdnadshavare')} *</label>
            <input id="rh-gname" required className={inputCls} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="rh-gphone">{L('Parent / guardian phone', 'Vårdnadshavarens telefon')} *</label>
            <input id="rh-gphone" type="tel" required className={inputCls} value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
          </div>
        </div>
      )}

      <div>
        <label className={labelCls} htmlFor="rh-idea">{L('Do you already have a problem or idea? (optional)', 'Har du redan ett problem eller en idé? (valfritt)')}</label>
        <textarea id="rh-idea" rows={3} className={inputCls} value={idea} onChange={(e) => setIdea(e.target.value)} />
      </div>

      <Consent checked={consent} onChange={setConsent}>
        {L(
          'I agree that my details are stored and used to organise this event, in line with GDPR.',
          'Jag godkänner att mina uppgifter sparas och används för att organisera evenemanget, i enlighet med GDPR.'
        )}
      </Consent>

      <ErrorBox message={error} />
      <button type="submit" disabled={busy} className={submitCls}>
        <span>{busy ? L('Sending…', 'Skickar…') : L('Register now', 'Anmäl dig nu')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

/* ── Bring Your Idea ────────────────────────────────────────────────────── */
const IdeaForm: React.FC<{ event: RoboHackEvent }> = ({ event }) => {
  const { sv, L, T } = useT();
  const areas = event.problem.ideas;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [area, setArea] = useState('');
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [gdpr, setGdpr] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [doneId, setDoneId] = useState('');

  const reset = () => {
    setName(''); setAge(''); setLevel(''); setEmail(''); setPhone(''); setSchool(''); setArea(''); setTitle('');
    setProblem(''); setDescription(''); setBeneficiaries(''); setPhoto(null); setConsent(false); setGdpr(false);
    setError(''); setDoneId('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!area) return setError(L('Please choose what your idea is about.', 'Välj vad din idé handlar om.'));
    if (!consent || !gdpr) return setError(L('Please accept both consent boxes.', 'Godkänn båda samtyckesrutorna.'));
    if (photo && photo.size > 10 * 1024 * 1024) return setError(L('The photo must be under 10 MB.', 'Bilden måste vara mindre än 10 MB.'));

    setBusy(true);
    try {
      const photoUrl = photo ? await uploadIdeaMedia(photo, 'photos') : null;
      const res = await submitIdea({
        ...cityFields(event),
        student_name: name,
        student_age: age,
        student_grade: level,
        contact_email: email,
        contact_phone: phone,
        school_name: school,
        idea_title: title,
        idea_description: description,
        photo_url: photoUrl,
        voice_note_url: null,
        video_url: null,
        video_type: 'none',
        category: areas.find((a) => a.en === area)?.en ?? area,
        problem_statement: problem,
        beneficiaries,
        develop_further: `${event.brand.name} ${event.brand.city}`,
        consent_agreed: consent,
        gdpr_agreed: gdpr,
      });
      setDoneId(res.public_id);
    } catch (err) {
      console.error('RoboHack idea error:', err);
      setError(L('Something went wrong while submitting. Please try again.', 'Något gick fel vid inskickningen. Försök igen.'));
    } finally {
      setBusy(false);
    }
  };

  if (doneId) {
    return (
      <Success
        title={L('Idea received!', 'Idén är mottagen!')}
        body={L('Thank you for bringing your idea. We will be in touch about the next steps.', 'Tack för din idé. Vi hör av oss om nästa steg.')}
        id={doneId}
        again={L('Submit another idea', 'Skicka in en till idé')}
        onAgain={reset}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="id-name">{L('Your name', 'Ditt namn')} *</label>
          <input id="id-name" required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-age">{L('Age', 'Ålder')} *</label>
          <input id="id-age" required type="number" min={6} max={99} className={inputCls} value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-email">{L('Email', 'E-post')} *</label>
          <input id="id-email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-phone">{L('Phone', 'Telefon')}</label>
          <input id="id-phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-level">{L('Level', 'Nivå')} *</label>
          <select id="id-level" required className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">{L('Choose…', 'Välj…')}</option>
            {LEVELS.map((o) => (
              <option key={o.value} value={o.value}>{sv ? o.sv : o.en}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls} htmlFor="id-school">{L('School, university or organisation', 'Skola, universitet eller organisation')} *</label>
          <input id="id-school" required className={inputCls} value={school} onChange={(e) => setSchool(e.target.value)} />
        </div>
      </div>

      <div>
        <span className={labelCls}>{T(event.problem.ideasTitle)} *</span>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button key={a.en} type="button" aria-pressed={area === a.en} onClick={() => setArea(a.en)} className={chip(area === a.en)}>
              {T(a)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="id-title">{L('Idea title', 'Idéns namn')} *</label>
          <input id="id-title" required maxLength={120} className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-problem">{L('What problem do you see?', 'Vilket problem ser du?')} *</label>
          <textarea id="id-problem" required rows={3} className={inputCls} value={problem} onChange={(e) => setProblem(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-desc">{L('Your idea to solve it', 'Din idé för att lösa det')} *</label>
          <textarea id="id-desc" required rows={4} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-who">{L('Who would it help?', 'Vem skulle den hjälpa?')}</label>
          <input id="id-who" className={inputCls} value={beneficiaries} onChange={(e) => setBeneficiaries(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="id-photo">{L('Photo or sketch (optional)', 'Foto eller skiss (valfritt)')}</label>
          <input id="id-photo" type="file" accept="image/*" className="text-xs" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>
      </div>

      <div className="space-y-2">
        <Consent checked={consent} onChange={setConsent}>
          {L(
            'I agree that my idea can be shared with the organisers, mentors and partners of this event.',
            'Jag godkänner att min idé delas med arrangörer, mentorer och partner till evenemanget.'
          )}
        </Consent>
        <Consent checked={gdpr} onChange={setGdpr}>
          {L(
            'I agree that my details are stored and handled in line with GDPR. If I am under 18, my parent or guardian agrees too.',
            'Jag godkänner att mina uppgifter sparas och hanteras enligt GDPR. Om jag är under 18 år godkänner även min vårdnadshavare.'
          )}
        </Consent>
      </div>

      <ErrorBox message={error} />
      <button type="submit" disabled={busy} className={submitCls}>
        <span>{busy ? L('Sending…', 'Skickar…') : L('Send my idea', 'Skicka min idé')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

/* ── Become a Partner ───────────────────────────────────────────────────── */
const PartnerForm: React.FC<{ event: RoboHackEvent }> = ({ event }) => {
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

/* ── Tabs ───────────────────────────────────────────────────────────────── */
interface RoboHackFormsProps {
  event: RoboHackEvent;
  tab: RoboHackFormTab;
  onTabChange: (tab: RoboHackFormTab) => void;
}

export const RoboHackForms: React.FC<RoboHackFormsProps> = ({ event, tab, onTabChange }) => {
  const { L } = useT();
  const tabs: { id: RoboHackFormTab; icon: React.ElementType; label: string }[] = [
    { id: 'register', icon: Rocket, label: L('Join a RoboHack', 'Var med i RoboHack') },
    { id: 'idea', icon: Lightbulb, label: L('Bring your idea', 'Kom med din idé') },
    { id: 'partner', icon: Briefcase, label: L('Become a partner', 'Bli partner') },
    { id: 'volunteer', icon: HandHeart, label: L('Volunteer', 'Volontär') },
  ];

  return (
    <div className="border border-slate-200 bg-white">
      <div role="tablist" className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-200">
        {tabs.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-syne font-black uppercase tracking-wider transition-colors border-b-2 ${
                active ? 'bg-[#0A1930] text-white border-[#FFCD00]' : 'text-slate-600 border-transparent hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="p-5 sm:p-8">
        {tab === 'register' && <RegisterForm event={event} />}
        {tab === 'idea' && <IdeaForm event={event} />}
        {tab === 'partner' && <PartnerForm event={event} />}
        {tab === 'volunteer' && (
          <VolunteerForm
            city={event.location}
            eventOptions={[
              {
                value: `yng-robohack-${event.location.citySlug}`,
                en: `${event.brand.name} ${event.brand.city} (${event.event.dates.en})`,
                sv: `${event.brand.name} ${event.brand.city} (${event.event.dates.sv})`,
              },
            ]}
            eyebrow={{ en: 'VOLUNTEER', sv: 'VOLONTÄR' }}
            intro={{
              en: `Help us run ${event.brand.name} ${event.brand.city}. All fields are required.`,
              sv: `Hjälp oss att genomföra ${event.brand.name} ${event.brand.city}. Alla fält är obligatoriska.`,
            }}
            teamName={event.brand.name}
          />
        )}
      </div>
    </div>
  );
};
