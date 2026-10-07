import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Bilingual, RoboHackEvent } from '../data/robohack/types';

interface RoboHackPageProps {
  event: RoboHackEvent;
}

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span
    className={`text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.2em] uppercase block mb-2 ${
      light ? 'text-[#FFCD00]' : 'text-[#006AA7]'
    }`}
  >
    {children}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-headline font-black uppercase tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
    {children}
  </h2>
);

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

/** "Register interest" link, or a disabled "opens soon" state until the event has a link. */
export const RoboHackRegisterButton: React.FC<{ href: string; className?: string }> = ({ href, className = '' }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const base = `px-6 py-3.5 font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors ${className}`;

  if (!href) {
    return (
      <span className={`${base} bg-white/10 border border-white/25 text-white/80 cursor-default`}>
        <Clock className="w-4 h-4" />
        <span>{sv ? 'Anmälan öppnar snart' : 'Registration opens soon'}</span>
      </span>
    );
  }
  const newTab = /^https?:/i.test(href);
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`${base} bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930]`}
    >
      <span>{sv ? 'Anmäl intresse' : 'Register interest'}</span>
      <ArrowRight className="w-4 h-4" />
    </a>
  );
};

export const RoboHackPage: React.FC<RoboHackPageProps> = ({ event }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const t = (b: Bilingual) => (sv ? b.sv || b.en : b.en);
  const tbc = sv ? 'Meddelas senare' : 'TBC';

  const tracks = event.tracks.filter((track) => track.enabled);

  // Event-specific tab title and description while this page is open.
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.getAttribute('content') ?? '';
    document.title = event.meta.title;
    meta?.setAttribute('content', event.meta.description);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDescription);
    };
  }, [event]);

  return (
    <div data-no-translate="true" className="w-full bg-white text-[#0A1930]">
      {/* ── 1. HERO ── */}
      <section className="relative w-full min-h-[640px] lg:min-h-[min(100vh,900px)] flex flex-col justify-end overflow-hidden bg-[#0A1930] text-white pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-5"
          >
            <Eyebrow light>{t(event.hero.eyebrow)}</Eyebrow>
            <h1 className="font-headline font-black uppercase tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}>
              {event.brand.name}
              <br />
              <span className="text-[#FFCD00]">{event.brand.city}</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">{t(event.hero.intro)}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <RoboHackRegisterButton href={event.registerHref} />
              <a
                href="#tracks"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <span>{sv ? 'Se spåren' : 'See the tracks'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 grid grid-cols-2 gap-2"
          >
            {event.details.slice(0, 4).map((d) => (
              <div key={d.label.en} className="p-3.5 bg-[#0A1930]/70 border border-white/15">
                <div className="text-[9px] font-mono-code font-bold uppercase tracking-widest text-white/55">{t(d.label)}</div>
                <div className="font-headline font-black text-base uppercase mt-0.5">{d.value ? t(d.value) : tbc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. TRACKS ── */}
      <section id="tracks" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="space-y-3">
            <Eyebrow>{sv ? `${tracks.length} spår` : `${tracks.length} tracks`}</Eyebrow>
            <SectionTitle>{sv ? 'Välj ditt spår' : 'Choose your track'}</SectionTitle>
          </div>

          <div className={`grid grid-cols-1 gap-4 items-stretch ${tracks.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {tracks.map((track, i) => {
              const Icon = track.icon;
              return (
                <motion.div key={track.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="border border-slate-200 bg-[#F8FAFC] flex flex-col">
                  <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-[#0A1930] text-white">
                    <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight">{t(track.title)}</h3>
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col gap-5">
                    <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(track.description)}</p>

                    {track.buildWith.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500 block">
                          {sv ? 'Bygg med' : 'Build with'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {track.buildWith.map((tag) => (
                            <span key={tag.en} className="text-[10px] font-mono-code font-bold text-[#0A1930] bg-white border border-slate-200 px-3 py-1.5 uppercase tracking-wide">
                              {t(tag)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-200 space-y-2">
                      <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#006AA7] block">
                        {sv ? 'Utmaningar' : 'Challenges'}
                      </span>
                      {track.challenges.length > 0 ? (
                        <ul className="space-y-1.5">
                          {track.challenges.map((c) => (
                            <li key={c.en} className="text-sm text-[#0A1930] flex items-start gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-[#006AA7] shrink-0 mt-1" />
                              <span>{t(c)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 font-light">
                          {sv ? 'Problemformuleringarna publiceras inför evenemanget.' : 'Problem statements are published ahead of the event.'}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. JOURNEY ── */}
      <section id="journey" className="w-full bg-[#006AA7] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="space-y-3">
            <Eyebrow light>{sv ? `${event.journey.length} steg` : `${event.journey.length} steps`}</Eyebrow>
            <SectionTitle>{sv ? 'Resan' : 'The journey'}</SectionTitle>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {event.journey.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li key={step.title.en} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 4) * 0.08 }} className="bg-[#0A1930] border border-white/10 p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="font-mono-code font-bold text-xs text-white/50">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight">{t(step.title)}</h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">{t(step.description)}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── 4. DETAILS ── */}
      <section id="details" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="space-y-3">
            <Eyebrow>{event.brand.city}</Eyebrow>
            <SectionTitle>{sv ? 'Praktisk info' : 'Event details'}</SectionTitle>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
            {event.details.map((d) => (
              <div key={d.label.en} className="p-5 sm:p-6 border-b border-r border-slate-200">
                <dt className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500">{t(d.label)}</dt>
                <dd className={`mt-1 font-headline font-black text-xl uppercase tracking-tight ${d.value ? 'text-[#0A1930]' : 'text-slate-400'}`}>
                  {d.value ? t(d.value) : tbc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 5. REGISTER ── */}
      <section id="register" className="w-full bg-[#0A1930] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <Eyebrow light>{sv ? 'Anmälan' : 'Registration'}</Eyebrow>
            <SectionTitle>{sv ? 'Bygg något verkligt' : 'Build something real'}</SectionTitle>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">
              {sv
                ? `Anmäl intresse för ${event.brand.name} ${event.brand.city}, så hör vi av oss när anmälan öppnar.`
                : `Register your interest in ${event.brand.name} ${event.brand.city} and we will get in touch when registration opens.`}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <RoboHackRegisterButton href={event.registerHref} className="w-full sm:w-auto" />
          </div>
        </div>
      </section>
    </div>
  );
};
