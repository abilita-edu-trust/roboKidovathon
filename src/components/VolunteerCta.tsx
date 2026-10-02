import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VolunteerCtaProps {
  onOpenVolunteer: () => void;
}

export const VolunteerCta: React.FC<VolunteerCtaProps> = ({ onOpenVolunteer }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';

  return (
    <section data-no-translate="true" className="w-full bg-[#0A1930] text-white py-12 sm:py-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#FFCD00] uppercase block mb-2">
            {sv ? 'VOLONTÄRER // VÄSTERÅS 2026' : 'VOLUNTEERS // VÄSTERÅS 2026'}
          </span>
          <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
            {sv ? 'Bli volontär hos Västerås Future Innovators' : 'Volunteer with Västerås Future Innovators'}
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            {sv
              ? 'Hjälp oss att genomföra robotikfinaler, hackathons och skolevenemang i Västerås. Välj din roll, din tid och de evenemang du vill stötta.'
              : 'Help us run robotics finals, hackathons and school events across Västerås. Pick your role, your time and the events you want to support.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenVolunteer}
          className="btn-pill-lime text-xs font-black py-3.5 px-6 flex items-center justify-center gap-2 shrink-0"
        >
          <span>{sv ? 'ANMÄL DIG SOM VOLONTÄR' : 'REGISTER AS A VOLUNTEER'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
