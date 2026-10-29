import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '../content/useT';
import { hasLabel, type VolunteerData } from '../content/sections/frame';

interface VolunteerCtaProps {
  /** Texts and button from the Site CMS. */
  data: VolunteerData;
  go: (href: string) => void;
}

export const VolunteerCta: React.FC<VolunteerCtaProps> = ({ data: cta, go }) => {
  const { t } = useT();

  return (
    <section data-no-translate="true" className="w-full bg-[#0A1930] text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[13px] font-mono-code font-bold tracking-[0.2em] text-[#FFCD00] uppercase block mb-2">
            {t(cta.eyebrow)}
          </span>
          <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
            {t(cta.title)}
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            {t(cta.body)}
          </p>
        </div>
        {hasLabel(cta.button) && (
          <button
            type="button"
            onClick={() => go(cta.button.href)}
            className="btn-pill-lime text-xs font-black py-3.5 px-6 flex items-center justify-center gap-2 shrink-0"
          >
            <span>{t(cta.button.label)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
