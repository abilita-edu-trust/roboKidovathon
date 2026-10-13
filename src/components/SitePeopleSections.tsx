import React from 'react';
import { pickLang } from '../context/SiteContext';
import { initials, type PeopleSection } from '../lib/siteContent';

/** One people section (Jury, Speakers, …): a grid of cards, or its "announced soon" text while empty. */
export const PeopleBlock: React.FC<{ section: PeopleSection; sv: boolean }> = ({ section, sv }) => {
  const intro = pickLang(section.intro, sv);
  return (
    <section id={section.id} data-no-translate="true" className="w-full bg-white text-[#0A1930] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 scroll-mt-20">
      <div className="max-w-[1560px] mx-auto">
        <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{pickLang(section.title, sv)}</h2>
        {intro && <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#0A1930]/70">{intro}</p>}
        {section.people.length === 0 ? (
          <p className="mt-6 inline-flex items-center gap-2.5 rounded-2xl border-2 border-dashed border-[#0A1930]/20 px-5 py-4 text-sm font-semibold text-[#0A1930]/80">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#FFCD00]" aria-hidden />
            {pickLang(section.emptyText, sv)}
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
            {section.people.map((p) => {
              const role = pickLang(p.role, sv);
              return (
                <li key={p.id} className="min-w-0">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-[#F2F8FD]">
                    {/^https:\/\//.test(p.photo) ? (
                      <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-headline text-4xl font-black text-[#0A1930]/25" aria-hidden>
                        {initials(p.name)}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-bold leading-tight">{p.name}</p>
                  {role && <p className="mt-0.5 text-sm leading-snug text-[#0A1930]/70">{role}</p>}
                  {p.organisation && (
                    <p className="mt-1 font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#0A1930]/50">{p.organisation}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};
