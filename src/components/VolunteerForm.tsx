import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { COUNTRIES, CITIES_BY_COUNTRY } from '../pages/IntakeRegisterPage';

type Option = { value: string; en: string; sv: string };

// Stored values are English and shared with the EU Skola admin filters.
export const VOLUNTEER_EVENTS: Option[] = [
  { value: 'robo-sprint-city-final', en: 'Robo-Sprint City Final (5 Dec 2026)', sv: 'Robo-Sprint stadsfinal (5 dec 2026)' },
  { value: 'young-inno-hack', en: 'Young Inno Hack (5 Dec 2026)', sv: 'Young Inno Hack (5 dec 2026)' },
  { value: 'school-workshops-demos', en: 'In-school workshops & demos', sv: 'Workshoppar och demos på skolor' },
  { value: 'any-vfi-event', en: 'Any VFI event', sv: 'Valfritt VFI-evenemang' },
];

export const VOLUNTEER_ROLES: Option[] = [
  { value: 'stage-backstage', en: 'Stage / backstage', sv: 'Scen / backstage' },
  { value: 'registration-desk', en: 'Registration desk', sv: 'Registreringsdisk' },
  { value: 'kids-activities', en: "Kids' activities", sv: 'Aktiviteter för barn' },
  { value: 'food-stalls', en: 'Food stalls', sv: 'Matstånd' },
  { value: 'setup-teardown', en: 'Setup / teardown', sv: 'Uppbyggnad / nedmontering' },
  { value: 'photo-media', en: 'Photo / media', sv: 'Foto / media' },
  { value: 'tech-robotics', en: 'Tech / robotics support', sv: 'Teknik- / robotiksupport' },
];

const AVAILABILITY: Option[] = [
  { value: 'full-day', en: 'Full day', sv: 'Heldag' },
  { value: 'morning', en: 'Morning', sv: 'Förmiddag' },
  { value: 'afternoon', en: 'Afternoon', sv: 'Eftermiddag' },
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#006AA7] focus:ring-1 focus:ring-[#006AA7]';
const labelCls = 'block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1.5';

export const VolunteerForm: React.FC = () => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState<'' | 'under-18' | '18-plus'>('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [countrySlug, setCountrySlug] = useState('sweden');
  const [citySlug, setCitySlug] = useState('vasteras');
  const [events, setEvents] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [languages, setLanguages] = useState('');
  const [experience, setExperience] = useState('');
  const [tshirtSize, setTshirtSize] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [gdprAgreed, setGdprAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  const cities = CITIES_BY_COUNTRY[countrySlug] || [];

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleCountryChange = (slug: string) => {
    setCountrySlug(slug);
    setCitySlug((CITIES_BY_COUNTRY[slug] || [])[0]?.slug || '');
  };

  const resetForm = () => {
    setFullName(''); setEmail(''); setPhone(''); setAgeGroup('');
    setGuardianName(''); setGuardianPhone('');
    setCountrySlug('sweden'); setCitySlug('vasteras');
    setEvents([]); setRoles([]); setAvailability('');
    setLanguages(''); setExperience(''); setTshirtSize('');
    setConsentAgreed(false); setGdprAgreed(false);
    setGeneratedId(''); setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Checkbox groups and radios can't use the native `required` attribute.
    if (!ageGroup) return setSubmitError(L('Please select your age group.', 'Välj din åldersgrupp.'));
    if (events.length === 0) return setSubmitError(L('Please select at least one event.', 'Välj minst ett evenemang.'));
    if (roles.length === 0) return setSubmitError(L('Please select at least one preferred role.', 'Välj minst en roll.'));
    if (!availability) return setSubmitError(L('Please select your availability.', 'Välj när du är tillgänglig.'));
    if (!consentAgreed || !gdprAgreed)
      return setSubmitError(L('Please accept both consent checkboxes.', 'Godkänn båda samtyckesrutorna.'));

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        phone,
        age_group: ageGroup,
        guardian_name: ageGroup === 'under-18' ? guardianName : '',
        guardian_phone: ageGroup === 'under-18' ? guardianPhone : '',
        country_slug: countrySlug,
        city_slug: citySlug,
        country_name: COUNTRIES.find((c) => c.slug === countrySlug)?.name || countrySlug,
        city_name: cities.find((c) => c.slug === citySlug)?.name || citySlug,
        events,
        roles,
        availability,
        languages,
        experience,
        tshirt_size: tshirtSize,
        consent_agreed: consentAgreed,
        gdpr_agreed: gdprAgreed,
      };
      const { data, error } = await supabase.rpc('submit_vfi_volunteer', { payload });
      if (error) throw new Error(error.message || 'Failed to submit');
      setGeneratedId(data as string);
    } catch (err: any) {
      console.error('Volunteer submission error:', err);
      setSubmitError(
        L('Something went wrong while submitting. Please try again.', 'Något gick fel vid inskickningen. Försök igen.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (generatedId) {
    return (
      <div data-no-translate="true" className="text-center py-10 space-y-4">
        <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight">
          {L('Thank you for volunteering!', 'Tack för att du vill bli volontär!')}
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {L(
            'We have received your volunteer registration. The VFI team will contact you by email with next steps.',
            'Vi har tagit emot din volontäranmälan. VFI-teamet kontaktar dig via e-post med nästa steg.'
          )}
        </p>
        <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-200 font-mono-code text-sm font-bold text-[#006AA7]">
          {generatedId}
        </div>
        <div>
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline"
          >
            {L('Register another volunteer', 'Anmäl en till volontär')}
          </button>
        </div>
      </div>
    );
  }

  const chip = (active: boolean) =>
    `py-1.5 px-3 text-xs border transition-all text-left ${
      active ? 'bg-[#006AA7] border-[#006AA7] text-white font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
    }`;

  return (
    <form data-no-translate="true" onSubmit={handleSubmit} className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase">
          {L('OPTION 6 // VOLUNTEER', 'ALTERNATIV 6 // VOLONTÄR')}
        </span>
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight mt-1">
          {L('Work as a Volunteer', 'Arbeta som volontär')}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {L(
            'Help us run Västerås Future Innovators events. All fields are required.',
            'Hjälp oss att genomföra Västerås Future Innovators evenemang. Alla fält är obligatoriska.'
          )}
        </p>
      </div>

      {/* Personal details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="vol-name">{L('Full name', 'Fullständigt namn')} *</label>
          <input id="vol-name" required className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="vol-email">{L('Email', 'E-post')} *</label>
          <input id="vol-email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="vol-phone">{L('Phone', 'Telefon')} *</label>
          <input id="vol-phone" type="tel" required className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {/* Age group + guardian */}
      <div>
        <span className={labelCls}>{L('Age group', 'Åldersgrupp')} *</span>
        <div className="flex flex-wrap gap-2">
          {([
            { value: 'under-18', label: L('Under 18', 'Under 18') },
            { value: '18-plus', label: L('18 or older', '18 år eller äldre') },
          ] as const).map((o) => (
            <button key={o.value} type="button" aria-pressed={ageGroup === o.value} onClick={() => setAgeGroup(o.value)} className={chip(ageGroup === o.value)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {ageGroup === 'under-18' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50 border border-amber-200">
          <div>
            <label className={labelCls} htmlFor="vol-guardian-name">{L('Parent / guardian name', 'Förälder / vårdnadshavare')} *</label>
            <input id="vol-guardian-name" required className={inputCls} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="vol-guardian-phone">{L('Parent / guardian phone', 'Vårdnadshavarens telefon')} *</label>
            <input id="vol-guardian-phone" type="tel" required className={inputCls} value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
          </div>
        </div>
      )}

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="vol-country">{L('Country', 'Land')} *</label>
          <select id="vol-country" required className={inputCls} value={countrySlug} onChange={(e) => handleCountryChange(e.target.value)}>
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="vol-city">{L('City', 'Stad')} *</label>
          <select id="vol-city" required className={inputCls} value={citySlug} onChange={(e) => setCitySlug(e.target.value)}>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events */}
      <div>
        <span className={labelCls}>{L('Which event(s)?', 'Vilket/vilka evenemang?')} *</span>
        <div className="flex flex-wrap gap-2">
          {VOLUNTEER_EVENTS.map((o) => (
            <button key={o.value} type="button" aria-pressed={events.includes(o.value)} onClick={() => toggle(events, o.value, setEvents)} className={chip(events.includes(o.value))}>
              {sv ? o.sv : o.en}
            </button>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div>
        <span className={labelCls}>{L('Preferred roles', 'Önskade roller')} *</span>
        <div className="flex flex-wrap gap-2">
          {VOLUNTEER_ROLES.map((o) => (
            <button key={o.value} type="button" aria-pressed={roles.includes(o.value)} onClick={() => toggle(roles, o.value, setRoles)} className={chip(roles.includes(o.value))}>
              {sv ? o.sv : o.en}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <span className={labelCls}>{L('Availability', 'Tillgänglighet')} *</span>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map((o) => (
            <button key={o.value} type="button" aria-pressed={availability === o.value} onClick={() => setAvailability(o.value)} className={chip(availability === o.value)}>
              {sv ? o.sv : o.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="vol-languages">{L('Languages spoken', 'Språk du talar')} *</label>
          <input
            id="vol-languages"
            required
            className={inputCls}
            placeholder={L('e.g. Swedish, English, Hindi', 't.ex. svenska, engelska, hindi')}
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="vol-tshirt">{L('T-shirt size', 'T-shirtstorlek')} *</label>
          <select id="vol-tshirt" required className={inputCls} value={tshirtSize} onChange={(e) => setTshirtSize(e.target.value)}>
            <option value="" disabled>{L('Select size', 'Välj storlek')}</option>
            {TSHIRT_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="vol-experience">{L('Previous volunteering experience', 'Tidigare erfarenhet av volontärarbete')} *</label>
        <textarea
          id="vol-experience"
          required
          rows={3}
          className={inputCls}
          placeholder={L('Tell us briefly — write "None" if this is your first time.', 'Berätta kort — skriv "Ingen" om det är första gången.')}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      {/* Consent */}
      <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 text-xs text-slate-700">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" required checked={consentAgreed} onChange={(e) => setConsentAgreed(e.target.checked)} className="mt-0.5" />
          <span>
            {L(
              'I agree to be contacted by the Västerås Future Innovators team about volunteering. *',
              'Jag godkänner att Västerås Future Innovators-teamet kontaktar mig om volontärarbete. *'
            )}
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" required checked={gdprAgreed} onChange={(e) => setGdprAgreed(e.target.checked)} className="mt-0.5" />
          <span>
            {L(
              'I consent to my personal data being stored and handled according to GDPR for volunteer coordination. *',
              'Jag samtycker till att mina personuppgifter lagras och hanteras enligt GDPR för samordning av volontärer. *'
            )}
          </span>
        </label>
      </div>

      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-pill-lime py-3.5 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <span>{isSubmitting ? L('SUBMITTING…', 'SKICKAR…') : L('SUBMIT VOLUNTEER REGISTRATION', 'SKICKA VOLONTÄRANMÄLAN')}</span>
        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
};
