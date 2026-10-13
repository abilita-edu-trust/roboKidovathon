import React, { useEffect, useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchHackathonResults, type HackathonResults } from '../lib/hackathonResults';

const PLACE: Record<number, { en: string; sv: string; tone: string }> = {
  1: { en: '1st', sv: '1:a', tone: 'text-[#FFCD00]' },
  2: { en: '2nd', sv: '2:a', tone: 'text-slate-300' },
  3: { en: '3rd', sv: '3:e', tone: 'text-orange-400' },
};

/** Published hackathon winners for this site's city; renders nothing until an admin publishes. */
export const HackathonWinners: React.FC = () => {
  const site = useSite();
  const { language } = useLanguage();
  const sv = language === 'sv';
  // The VFI site has no locked city; its hackathon is Västerås.
  const where = site.location ?? { countrySlug: 'sweden', citySlug: 'vasteras' };
  const [results, setResults] = useState<HackathonResults | null>(null);

  useEffect(() => {
    let alive = true;
    fetchHackathonResults(where.countrySlug, where.citySlug)
      .then((r) => alive && setResults(r))
      .catch(() => alive && setResults(null));
    return () => {
      alive = false;
    };
  }, [where.countrySlug, where.citySlug]);

  if (!results) return null;
  const tracks = [...new Set(results.results.map((r) => r.track))];

  return (
    <section id="winners" data-no-translate="true" className="w-full bg-[#0A1930] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#FFCD00] uppercase">{sv ? 'Resultat' : 'Results'}</span>
          <h2 className="font-headline font-black uppercase tracking-tight leading-none flex items-center gap-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}>
            <Trophy className="w-8 h-8 text-[#FFCD00] shrink-0" />
            {sv ? `Vinnare: ${results.name}` : `${results.name}: winners`}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <div key={track} className="bg-white/5 border border-white/15 p-5 space-y-4">
              <h3 className="font-headline font-black text-xl uppercase tracking-tight">{track}</h3>
              <ol className="space-y-3">
                {results.results
                  .filter((r) => r.track === track)
                  .sort((a, b) => a.rank - b.rank)
                  .map((r) => {
                    const place = PLACE[r.rank];
                    return (
                      <li key={`${r.rank}-${r.squad}`} className="flex items-center gap-3">
                        <Medal className={`w-6 h-6 shrink-0 ${place?.tone ?? 'text-white/60'}`} />
                        <span className="w-10 font-mono-code font-bold text-sm text-white/70">{place ? (sv ? place.sv : place.en) : r.rank}</span>
                        <span className="min-w-0">
                          <span className="block font-semibold truncate">{r.squad}</span>
                          {r.school && <span className="block text-xs text-white/60 truncate">{r.school}</span>}
                        </span>
                      </li>
                    );
                  })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
