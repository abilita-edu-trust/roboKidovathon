import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '../content/useT';
import { siteIcon } from '../content/icons';
import type { ReadMoreData } from '../content/sections/simple';

interface FutureInnovatorsDetailLinksProps {
  /** Heading and links from the Site CMS. */
  data: ReadMoreData;
  go: (href: string) => void;
}

export const FutureInnovatorsDetailLinks: React.FC<FutureInnovatorsDetailLinksProps> = ({ data, go }) => {
  const { t } = useT();
  return (
  <section className="w-full bg-[#F8FAFC] text-[#0A1930] py-14 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-200">
    <div className="max-w-[1560px] mx-auto space-y-6">
      <div>
        <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
          {t(data.eyebrow)}
        </span>
        <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(data.title)}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.links.map((l, i) => {
          const Icon = siteIcon(l.icon);
          return (
          <button
            key={i}
            onClick={() => go(l.href)}
            className="text-left bg-white border-2 border-slate-200 hover:border-[#006AA7] p-5 space-y-2 transition-colors group"
          >
            <Icon className="w-6 h-6 text-[#006AA7]" />
            <div className="font-headline font-black text-lg uppercase tracking-tight flex items-center gap-2">
              {t(l.title)}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-sm text-slate-600 font-light">{t(l.text)}</p>
          </button>
          );
        })}
      </div>
    </div>
  </section>
  );
};
