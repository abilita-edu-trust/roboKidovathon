import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Check, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RoboHackForms, RoboHackFormTab } from '../components/robohack/RoboHackForms';
import type { Bilingual, RoboHackEvent } from '../data/robohack/types';

interface RoboHackPageProps {
  event: RoboHackEvent;
}

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean; className?: string }> = ({ children, light, className = '' }) => (
  <span
    className={`text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.2em] uppercase block mb-2 ${
      light ? 'text-[#FFCD00]' : 'text-[#006AA7]'
    } ${className}`}
  >
    {children}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`font-headline font-black uppercase tracking-tight leading-[1.0] ${className}`} style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
    {children}
  </h2>
);

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const Section: React.FC<{ id: string; tone?: 'white' | 'gray' | 'blue' | 'navy'; children: React.ReactNode }> = ({ id, tone = 'white', children }) => {
  const tones = {
    white: 'bg-white text-[#0A1930]',
    gray: 'bg-[#F8FAFC] text-[#0A1930] border-y border-slate-200',
    blue: 'bg-[#006AA7] text-white',
    navy: 'bg-[#0A1930] text-white',
  };
  return (
    <section id={id} className={`w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20 ${tones[tone]}`}>
      <div className="max-w-[1400px] mx-auto space-y-10">{children}</div>
    </section>
  );
};

/** "A → B → C" as a row of chips. */
const Flow: React.FC<{ items: string[]; light?: boolean }> = ({ items, light }) => (
  <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
    {items.map((item, i) => (
      <li key={item} className="flex items-center gap-2">
        <span
          className={`text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-wide px-3 py-2 ${
            light ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-slate-200 text-[#0A1930]'
          }`}
        >
          {item}
        </span>
        {i < items.length - 1 && <ArrowRight className={`w-3.5 h-3.5 ${light ? 'text-[#FFCD00]' : 'text-[#006AA7]'}`} aria-hidden />}
      </li>
    ))}
  </ol>
);

const btnPrimary =
  'px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors';
const btnGhostLight =
  'px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors';

export const RoboHackPage: React.FC<RoboHackPageProps> = ({ event }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const t = (b: Bilingual) => (sv ? b.sv || b.en : b.en);
  const tbc = sv ? 'Meddelas senare' : 'TBC';
  const [formTab, setFormTab] = useState<RoboHackFormTab>('register');

  const tracks = event.tracks.filter((track) => track.enabled);

  /** Open a form tab and scroll to the forms. */
  const openForm = (tab: RoboHackFormTab) => {
    setFormTab(tab);
    setTimeout(() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

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
      <section className="relative w-full min-h-[640px] lg:min-h-[min(100vh,900px)] flex flex-col justify-center overflow-hidden bg-[#0A1930] text-white pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[1200px] mx-auto text-center space-y-6"
        >
          <Eyebrow light>{event.brand.name} · {t(event.hero.eyebrow)}</Eyebrow>
          <h1 className="font-headline font-black uppercase tracking-tight leading-[1.02]" style={{ fontSize: 'clamp(2.2rem, 6.4vw, 5.6rem)' }}>
            {event.hero.lines.map((line, i) => (
              <span key={line.en} className={`block ${i === event.hero.lines.length - 1 ? 'text-[#FFCD00]' : ''}`}>
                {t(line)}
              </span>
            ))}
          </h1>
          <p className="text-sm sm:text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed">{t(event.hero.intro)}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button type="button" onClick={() => openForm('idea')} className={btnPrimary}>
              <span>{sv ? 'Kom med din idé' : 'Bring Your Idea'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => openForm('register')} className={btnGhostLight}>
              <span>{sv ? 'Var med i en RoboHack' : 'Join a RoboHack'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="pt-4 text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.25em] text-white/60">
            {event.hero.keywords.join('  •  ')}
          </p>
        </motion.div>
      </section>

      {/* ── 2. PLATFORM ── */}
      <Section id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <Eyebrow>{event.brand.name}</Eyebrow>
            <SectionTitle>{t(event.platform.title)}</SectionTitle>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(event.platform.intro)}</p>
        </div>
        <Flow items={event.platform.flow.map(t)} />
      </Section>

      {/* ── 3. BRING THE PROBLEM ── */}
      <Section id="problem" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow>{sv ? 'Din idé' : 'Your idea'}</Eyebrow>
            <SectionTitle>{t(event.problem.title)}</SectionTitle>
            <p className="font-headline font-bold text-lg sm:text-xl text-[#006AA7]">{t(event.problem.question)}</p>
          </div>
          <div className="lg:col-span-5 space-y-3 lg:pt-10">
            {event.problem.body.map((p) => (
              <p key={p.en} className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(p)}</p>
            ))}
          </div>
        </div>
        <Flow items={event.problem.flow.map(t)} />

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {event.problem.cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title.en} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="bg-white border border-slate-200 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 bg-[#0A1930] text-[#FFCD00] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-mono-code font-bold text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight">{t(card.title)}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">{t(card.description)}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 space-y-3">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#006AA7] block">{t(event.problem.ideasTitle)}</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {event.problem.ideas.map((idea) => (
                <li key={idea.en} className="flex items-start gap-2 text-sm text-[#0A1930]">
                  <Check className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                  <span>{t(idea)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 bg-[#0A1930] text-white p-5 sm:p-6 space-y-3">
            {event.problem.closing.map((c, i) => (
              <p key={c.en} className={i === 0 ? 'font-headline font-black text-lg uppercase tracking-tight leading-snug' : 'text-sm text-white/80 font-light leading-relaxed'}>
                {t(c)}
              </p>
            ))}
            <button type="button" onClick={() => openForm('idea')} className={`${btnPrimary} w-full sm:w-auto mt-2`}>
              <span>{sv ? 'Kom med din idé' : 'Bring Your Idea'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* ── 4. THE EVENT ── */}
      <Section id="event" tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow light>{event.event.name}</Eyebrow>
            <SectionTitle>{t(event.event.title)}</SectionTitle>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">{t(event.event.intro)}</p>
          </div>
          <div className="lg:col-span-5 border border-white/15 bg-white/5 p-6 space-y-5">
            <div className="font-headline font-black text-3xl uppercase tracking-tight">{event.event.name}</div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FFCD00]" />{t(event.event.venue)}</p>
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#FFCD00]" />{t(event.event.dates)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => openForm('register')} className={btnPrimary}>
                <span>{sv ? 'Anmäl dig nu' : 'Register now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => openForm('partner')} className={btnGhostLight}>
                <span>{t(event.partners.cta)}</span>
              </button>
            </div>
            <p className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-white/60 pt-1 border-t border-white/10">
              {sv ? 'Arrangeras av' : 'Powered by'} {event.event.poweredBy}
            </p>
          </div>
        </div>
      </Section>

      {/* ── 5. ONE EVENT — THREE TRACKS (the key section) ── */}
      <Section id="tracks" tone="blue">
        <div className="space-y-3 text-center">
          <Eyebrow light>{event.brand.city} · {event.brand.name}</Eyebrow>
          <SectionTitle>
            {sv ? `Ett evenemang — ${tracks.length === 3 ? 'tre' : tracks.length} spår` : `One event — ${tracks.length === 3 ? 'three' : tracks.length} tracks`}
          </SectionTitle>
        </div>

        <div className={`grid grid-cols-1 gap-4 items-stretch ${tracks.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div key={track.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="bg-[#0A1930] border border-white/10 flex flex-col">
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </span>
                    <div>
                      <h3 className="font-headline font-black text-2xl uppercase tracking-tight leading-none">{t(track.title)}</h3>
                      <p className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-[#FFCD00] mt-1">{t(track.tagline)}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">{t(track.description)}</p>
                  {track.interests.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-white/50 block">
                        {sv ? 'För dig som är intresserad av' : 'For participants interested in'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {track.interests.map((tag) => (
                          <span key={tag.en} className="text-[10px] font-mono-code font-bold text-white bg-white/10 border border-white/15 px-2.5 py-1 uppercase tracking-wide">
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openForm('register')}
                  className="w-full px-6 py-3.5 bg-white/5 hover:bg-[#FFCD00] hover:text-[#0A1930] border-t border-white/10 text-white font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{sv ? `Välj ${t(track.title)}` : `Join ${t(track.title)}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── 6. JOURNEY ── */}
      <Section id="journey">
        <div className="space-y-3">
          <Eyebrow>{sv ? `${event.journey.length} steg` : `${event.journey.length} steps`}</Eyebrow>
          <SectionTitle>{sv ? 'Resan' : 'The journey'}</SectionTitle>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {event.journey.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li key={step.title.en} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 4) * 0.08 }} className="bg-[#F8FAFC] border border-slate-200 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 bg-[#006AA7] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-mono-code font-bold text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight">{t(step.title)}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">{t(step.description)}</p>
              </motion.li>
            );
          })}
        </ol>
      </Section>

      {/* ── 7. CHALLENGES ── */}
      <Section id="challenges" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow>{sv ? 'Utmaningar' : 'Challenges'}</Eyebrow>
            <SectionTitle>{t(event.challenges.question)}</SectionTitle>
          </div>
          <p className="lg:col-span-5 lg:pt-10 text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(event.challenges.intro)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.challenges.items.map((c, i) => (
            <motion.div key={c.title.en} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }} className="bg-white border border-slate-200 p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] font-headline font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight pt-1">{t(c.title)}</h3>
              </div>
              <p className="text-sm font-medium text-[#006AA7] leading-snug">{t(c.question)}</p>
              {c.examples.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500 block">{sv ? 'Exempel' : 'Examples'}</span>
                  <ul className="space-y-1.5">
                    {c.examples.map((ex) => (
                      <li key={ex.en} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-[#006AA7] shrink-0 mt-0.5" />
                        <span>{t(ex)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="bg-[#0A1930] text-white p-6 sm:p-8 space-y-5">
          <p className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight leading-snug max-w-3xl">{t(event.challenges.closing)}</p>
          <Flow items={event.challenges.flow.map(t)} light />
        </div>
      </Section>

      {/* ── 8. PROGRAMMES ── */}
      <Section id="programmes">
        <div className="space-y-3">
          <Eyebrow>{sv ? 'Två program' : 'Two programmes'}</Eyebrow>
          <SectionTitle>{sv ? 'Hitta din väg' : 'Find your path'}</SectionTitle>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {event.programmes.map((p, i) => (
            <div key={p.name} className={`p-6 sm:p-8 space-y-4 border ${i === 1 ? 'bg-[#0A1930] text-white border-[#0A1930]' : 'bg-[#F8FAFC] border-slate-200'}`}>
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tight">{p.name}</h3>
                <p className={`text-[11px] font-mono-code font-bold uppercase tracking-widest mt-1 ${i === 1 ? 'text-[#FFCD00]' : 'text-[#006AA7]'}`}>{t(p.audience)}</p>
              </div>
              <p className={`text-sm sm:text-base font-light leading-relaxed ${i === 1 ? 'text-white/80' : 'text-slate-600'}`}>{t(p.description)}</p>
              <Flow items={p.flow.map(t)} light={i === 1} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── 9. PARTNERS ── */}
      <Section id="partners" tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-4">
            <Eyebrow light>{sv ? 'För företag och partner' : 'For companies & partners'}</Eyebrow>
            <SectionTitle>{t(event.partners.headline)}</SectionTitle>
            <button type="button" onClick={() => openForm('partner')} className={`${btnPrimary} w-full sm:w-auto mt-2`}>
              <span>{t(event.partners.cta)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <p className="text-sm sm:text-base text-white/80 font-light">{t(event.partners.intro)}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.partners.ways.map((w) => (
                <li key={w.en} className="flex items-start gap-2.5 bg-white/5 border border-white/10 px-4 py-3 text-sm">
                  <Check className="w-4 h-4 text-[#FFCD00] shrink-0 mt-0.5" />
                  <span>{t(w)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── 10. DETAILS ── */}
      <Section id="details">
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
      </Section>

      {/* ── 11. FORMS ── */}
      <Section id="join" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <Eyebrow>{sv ? 'Var med' : 'Get involved'}</Eyebrow>
            <SectionTitle>{sv ? 'Bygg något verkligt' : 'Build something real'}</SectionTitle>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {sv
              ? 'Anmäl dig till RoboHack, skicka in din idé, bli partner eller hjälp till som volontär.'
              : 'Register for the RoboHack, send in your idea, become a partner or help out as a volunteer.'}
          </p>
        </div>
        <RoboHackForms event={event} tab={formTab} onTabChange={setFormTab} />
      </Section>
    </div>
  );
};
