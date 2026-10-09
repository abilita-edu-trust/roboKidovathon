import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite, pickLang } from '../context/SiteContext';

interface VolunteerCtaProps {
  onOpenVolunteer: () => void;
}

export const VolunteerCta: React.FC<VolunteerCtaProps> = ({ onOpenVolunteer }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const { volunteerCta: cta } = useSite();

  return (
    <section data-no-translate="true" className="w-full bg-[#0A1930] text-white py-12 sm:py-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#FFCD00] uppercase block mb-2">
            {pickLang(cta.eyebrow, sv)}
          </span>
          <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
            {pickLang(cta.title, sv)}
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            {pickLang(cta.body, sv)}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenVolunteer}
          className="btn-pill-lime text-xs font-black py-3.5 px-6 flex items-center justify-center gap-2 shrink-0"
        >
          <span>{pickLang(cta.button, sv)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
