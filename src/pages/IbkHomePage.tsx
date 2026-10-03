import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Calendar, Clock, Lightbulb, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { IntakeProgramTab } from './IntakeRegisterPage';
import { ParticipationFees } from '../components/ParticipationFees';
import { useIbkContent, ibkIcon, mediaUrl, type Bilingual } from '../lib/ibkContent';
import { hrefToTarget, isExternalHref } from '../lib/routes';

interface IbkHomePageProps {
  onNavigate: (route: string, tab?: IntakeProgramTab) => void;
}

type LinkData = { label: Bilingual; href: string };

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span
    className={`text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.2em] uppercase block mb-2 ${
      light ? 'text-[#FFCD00]' : 'text-[#006AA7]'
    }`}
  >
    {children}
  </span>
);

/** Junior / Senior / GYM colour tags, in category order. */
const CATEGORY_TONES = ['bg-[#006AA7] text-white', 'bg-[#0A1930] text-white', 'bg-[#FFCD00] text-[#0A1930]'];
const FINAL_DAY_TONES = ['bg-slate-200 text-[#0A1930]', 'bg-[#006AA7] text-white', 'bg-[#0A1930] text-white', 'bg-[#FFCD00] text-[#0A1930]'];
const tone = (tones: string[], i: number) => tones[i % tones.length];

const CardHeader: React.FC<{ icon: React.ElementType; title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 px-5 py-3 bg-[#0A1930] text-white">
    <span className="w-8 h-8 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </span>
    <span className="font-headline font-black uppercase text-sm tracking-wide">{title}</span>
  </div>
);

const PanelHeader: React.FC<{ icon: React.ElementType; title: string; badge?: string }> = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-[#0A1930] text-white">
    <h3 className="font-headline font-black text-xl uppercase tracking-tight flex items-center gap-3">
      <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>
      {title}
    </h3>
    {badge && <span className="font-mono-code text-xs font-bold px-2 py-1 border border-[#FFCD00] text-[#FFCD00]">{badge}</span>}
  </div>
);

const DateBadge: React.FC<{ day: string; month: string; green?: boolean }> = ({ day, month, green }) => (
  <div className={`w-12 shrink-0 text-center text-white ${green ? 'bg-[#059669]' : 'bg-[#006AA7]'}`}>
    <div className="font-headline font-black text-xl leading-none pt-1.5">{day}</div>
    <div className="text-[9px] font-mono-code font-bold uppercase pb-1.5">{month}</div>
  </div>
);

const StatTiles: React.FC<{ stats: { big: Bilingual; small: Bilingual }[]; t: (b: Bilingual) => string }> = ({ stats, t }) => (
  <div className="grid grid-cols-3 gap-2">
    {stats.map((s, i) => (
      <div key={i} className="bg-[#F2F6FA] border-t-4 border-[#006AA7] p-3">
        <div className="font-headline font-black text-lg sm:text-xl leading-none">{t(s.big)}</div>
        <div className="text-[10px] font-mono-code font-bold uppercase text-slate-500 mt-1">{t(s.small)}</div>
      </div>
    ))}
  </div>
);

export const IbkHomePage: React.FC<IbkHomePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const t = (b: Bilingual | undefined) => (b ? (sv ? b.sv || b.en : b.en) : '');
  const { content: c, ready } = useIbkContent();

  /** A button or link from the CMS: external links open in a new tab, site links navigate in-app. */
  const cmsLink = (link: LinkData, className: string, arrow: 'sm' | 'md' = 'md') => {
    const label = t(link.label);
    if (!label || !link.href) return null;
    const icon = <ArrowRight className={arrow === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
    if (isExternalHref(link.href)) {
      const newTab = /^https?:/i.test(link.href);
      return (
        <a href={link.href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} className={className}>
          <span>{label}</span>
          {icon}
        </a>
      );
    }
    return (
      <a
        href={link.href}
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          const { target, tab } = hrefToTarget(link.href);
          onNavigate(target, (tab as IntakeProgramTab) || undefined);
        }}
      >
        <span>{label}</span>
        {icon}
      </a>
    );
  };

  const yellowBtn = 'inline-flex btn-pill-lime text-xs font-black py-3 px-5 items-center gap-2';
  const textLink = 'self-start text-[11px] font-mono-code font-bold uppercase text-[#006AA7] hover:underline inline-flex items-center gap-1';

  const fi = c.futureInnovators;
  const rk = c.robokidovation;
  const finalDaySegments = rk.finalDay.steps.filter((s) => s.minutes > 0);

  return (
    <div data-no-translate="true" className={`w-full bg-white text-[#0A1930] transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>
      {/* ── 1. WELCOME TO IBK ── */}
      <section className="relative w-full min-h-[640px] lg:min-h-[min(100vh,960px)] flex items-end overflow-hidden bg-[#0A1930] text-white pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
        {c.hero.video && (
          <video
            key={c.hero.video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={mediaUrl(c.hero.video)}
          />
        )}
        {/* Flat scrim keeps the headline readable over the video */}
        <div className="absolute inset-0 bg-[#0A1930]/60 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-5"
          >
            <Eyebrow light>{t(c.hero.eyebrow)}</Eyebrow>
            <h1 className="font-headline font-black uppercase tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.4rem)' }}>
              {t(c.hero.titleLine1)}
              <br />
              <span className="text-[#FFCD00]">{t(c.hero.titleLine2)}</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">{t(c.hero.intro)}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {cmsLink(c.hero.primaryButton, 'px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors')}
              {cmsLink(c.hero.secondaryButton, 'px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors')}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 grid grid-cols-2 gap-2"
          >
            {c.hero.facts.map((f, i) => (
              <div key={i} className="p-3.5 bg-[#0A1930]/70 border border-white/15">
                <div className="text-[9px] font-mono-code font-bold uppercase tracking-widest text-white/55">{t(f.label)}</div>
                <div className="font-headline font-black text-base uppercase mt-0.5">{t(f.value)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. UPCOMING EVENTS ── */}
      <section id="activities" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-headline font-black uppercase tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
                {t(c.events.title)}
              </h2>
              <h4 className="mt-2 font-headline font-bold text-base sm:text-lg uppercase tracking-wide text-[#006AA7]">{t(c.events.subtitle)}</h4>
            </div>
            {t(c.events.note) && (
              <span className="text-[11px] font-mono-code font-bold uppercase px-3 py-1.5 bg-[#0A1930] text-[#FFCD00]">{t(c.events.note)}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.events.items.map((a, i) => {
              const Icon = ibkIcon(a.icon);
              return (
                <div key={i} className="border border-slate-200 bg-[#F8FAFC] p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono-code font-bold uppercase text-[#006AA7]">
                      <span className="w-7 h-7 bg-[#006AA7] text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{t(a.when)}</span>
                    </div>
                    <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight">{t(a.title)}</h3>
                    {t(a.where) && (
                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{t(a.where)}</span>
                      </p>
                    )}
                  </div>
                  {cmsLink(a.link, textLink, 'sm')}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FUTURE INNOVATORS (DEDICATED SECTION) ── */}
      <section id="future-innovators" className="w-full bg-[#006AA7] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <Eyebrow light>{t(fi.eyebrow)}</Eyebrow>
              <h2 className="font-headline font-black uppercase tracking-tight leading-[1.0]" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
                {t(fi.title)}
              </h2>
              <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-2xl">{t(fi.intro)}</p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              {cmsLink(fi.primaryButton, 'px-5 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors')}
              {cmsLink(fi.secondaryButton, 'px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* Who can join */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={Users} title={t(fi.whoCanJoin.title)} />
              <div className="p-5 space-y-5 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#006AA7]">
                    <Bot className="w-3.5 h-3.5" /> {t(fi.whoCanJoin.robokidoLabel)}
                  </div>
                  <ul className="space-y-1.5">
                    {fi.whoCanJoin.robokido.map((cat, i) => (
                      <li key={i} className="flex items-center gap-3 p-2 bg-[#F2F6FA] border-l-4 border-[#006AA7]">
                        <span className={`min-w-16 px-2 shrink-0 text-center text-[11px] font-mono-code font-bold uppercase py-1 ${tone(CATEGORY_TONES, i)}`}>
                          {t(cat.tag)}
                        </span>
                        <span className="text-sm font-bold flex-1">{t(cat.grades)}</span>
                        <span className="text-[11px] text-slate-500">{t(cat.level)}</span>
                      </li>
                    ))}
                    {t(fi.whoCanJoin.participant.tag) && (
                      <li className="flex flex-wrap items-center gap-x-3 gap-y-1 p-2 border border-dashed border-slate-300">
                        <span className="px-2 shrink-0 text-center text-[11px] font-mono-code font-bold uppercase py-1 bg-slate-100 text-slate-600">
                          {t(fi.whoCanJoin.participant.tag)}
                        </span>
                        <span className="text-sm flex-1">{t(fi.whoCanJoin.participant.text)}</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#059669]">
                    <Lightbulb className="w-3.5 h-3.5" /> {t(fi.whoCanJoin.hackathonLabel)}
                  </div>
                  <ol className="space-y-1.5">
                    {fi.whoCanJoin.hackathon.map((h, i) => (
                      <li key={i} className="flex items-center gap-3 p-2 bg-[#F0FDF4] border-l-4 border-[#059669]">
                        <span className="w-6 h-6 shrink-0 bg-[#059669] text-white text-xs font-mono-code font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="text-sm font-bold flex-1">{t(h.who)}</span>
                        <span className="text-[11px] text-slate-500">{t(h.level)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={Calendar} title={t(fi.timeline.title)} />
              <ol className="p-5 flex-1 relative">
                <span className="absolute left-[29px] top-7 bottom-7 w-px bg-slate-200" aria-hidden="true" />
                {fi.timeline.steps.map((step, i) => {
                  const last = i === fi.timeline.steps.length - 1;
                  return (
                    <li key={i} className="relative flex items-center gap-3 py-2">
                      <span
                        className={`relative z-10 w-5 h-5 shrink-0 flex items-center justify-center text-[10px] font-mono-code font-bold ${
                          last ? 'bg-[#FFCD00] text-[#0A1930]' : 'bg-[#006AA7] text-white'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm ${last ? 'font-black uppercase' : ''}`}>{t(step.label)}</span>
                      <span
                        className={`font-mono-code text-[11px] font-bold whitespace-nowrap px-2 py-0.5 ${
                          last ? 'bg-[#0A1930] text-[#FFCD00]' : 'bg-[#F2F6FA] text-[#006AA7]'
                        }`}
                      >
                        {t(step.date)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Qualification & venue */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={MapPin} title={t(fi.venues.title)} />
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                {fi.venues.items.map((v, i) => (
                  <div key={i} className={v.confirmed ? 'border border-slate-200 flex flex-col' : 'border border-dashed border-[#059669]'}>
                    {v.image && (
                      <div className="h-36 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-center p-3">
                        <img src={mediaUrl(v.image)} alt={t(v.name)} loading="lazy" className="max-h-full w-auto object-contain" />
                      </div>
                    )}
                    <div className="p-3 flex items-start gap-3">
                      <DateBadge day={v.day} month={t(v.month)} green={!v.confirmed} />
                      <div>
                        <div className={`text-[11px] font-mono-code font-bold uppercase ${v.confirmed ? 'text-[#006AA7]' : 'text-[#059669]'}`}>
                          {t(v.label)}
                        </div>
                        <div className="text-sm font-bold leading-snug">{t(v.name)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. JOIN IBK ── */}
      <section id="join" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <Eyebrow>{t(c.join.eyebrow)}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(c.join.title)}</h2>
          </div>

          <div className="bg-[#0A1930] text-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {c.join.intro.logo && (
              <div className="md:col-span-2 flex md:justify-center">
                <img src={mediaUrl(c.join.intro.logo)} alt="Indisk Barnklubb (IBK)" className="h-20 w-auto object-contain bg-white p-2" />
              </div>
            )}
            <div className={`${c.join.intro.logo ? 'md:col-span-7' : 'md:col-span-9'} space-y-2`}>
              <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">{t(c.join.intro.title)}</h3>
              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">{t(c.join.intro.text)}</p>
              <p className="text-sm font-bold text-[#FFCD00]">{t(c.join.intro.tagline)}</p>
            </div>
            <div className="md:col-span-3 md:text-right">
              {cmsLink(c.join.intro.button, yellowBtn)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.join.benefits.map((b, i) => {
              const Icon = ibkIcon(b.icon);
              return (
                <div key={i} className="border border-slate-200 bg-[#F8FAFC] p-5 flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 bg-[#006AA7] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-headline font-black text-base uppercase tracking-tight">{t(b.title)}</h4>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{t(b.text)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`grid grid-cols-1 gap-4 ${c.join.actions.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {c.join.actions.map((o, i) => {
              const Icon = ibkIcon(o.icon);
              return (
                <div key={i} className="border-2 border-slate-200 p-6 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      {o.logo && <img src={mediaUrl(o.logo)} alt="IBK" className="h-10 w-auto object-contain" />}
                    </div>
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight">{t(o.title)}</h3>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{t(o.text)}</p>
                  </div>
                  {cmsLink(o.button, `self-start ${yellowBtn}`)}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. ROBOKIDOVATION 2026 ── */}
      <section id="robokidovation" className="w-full bg-white border-t border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div>
            <Eyebrow>{t(rk.eyebrow)}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(rk.title)}</h2>
          </div>

          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-sm text-left min-w-[560px]">
              <thead className="bg-[#0A1930] text-white text-[11px] font-mono-code uppercase tracking-wider">
                <tr>
                  <th className="p-3">{t(rk.categoryTable.headers.category)}</th>
                  <th className="p-3">{t(rk.categoryTable.headers.grades)}</th>
                  <th className="p-3">{t(rk.categoryTable.headers.focus)}</th>
                  <th className="p-3">{t(rk.categoryTable.headers.coding)}</th>
                </tr>
              </thead>
              <tbody>
                {rk.categoryTable.rows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-200">
                    <td className="p-3 font-bold">{t(row.category)}</td>
                    <td className="p-3">{t(row.grades)}</td>
                    <td className="p-3 text-slate-600">{t(row.focus)}</td>
                    <td className="p-3">{t(row.coding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Teams */}
            <div className="border-2 border-slate-200 flex flex-col">
              <PanelHeader icon={ibkIcon(rk.teams.icon)} title={t(rk.teams.title)} />
              <div className="p-5 sm:p-6 space-y-5">
                <StatTiles stats={rk.teams.stats} t={t} />
                <div>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#006AA7] mb-2">{t(rk.teams.rolesTitle)}</div>
                  <div className="flex flex-wrap gap-2">
                    {rk.teams.roles.map((r, i) => {
                      const Icon = ibkIcon(r.icon);
                      return (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A1930] text-white text-xs font-bold">
                          <Icon className="w-3.5 h-3.5 text-[#FFCD00]" />
                          {t(r.label)}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <ol className="space-y-2.5">
                  {rk.teams.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold flex items-center justify-center">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="pt-0.5">{t(r)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="space-y-6">
              {/* Before the final */}
              <div className="border-2 border-slate-200">
                <PanelHeader icon={ibkIcon(rk.beforeFinal.icon)} title={t(rk.beforeFinal.title)} />
                <div className="p-5 sm:p-6 space-y-4">
                  <StatTiles stats={rk.beforeFinal.stats} t={t} />
                  <p className="text-sm text-slate-700">{t(rk.beforeFinal.text)}</p>
                  <ul className="space-y-2">
                    {rk.beforeFinal.paths.map((pth, i) => (
                      <li key={i} className="flex items-stretch border border-slate-200">
                        <span className={`w-20 shrink-0 flex items-center justify-center text-xs font-mono-code font-bold uppercase ${tone(CATEGORY_TONES, i)}`}>
                          {t(pth.name)}
                        </span>
                        <div className="p-2.5 flex flex-wrap items-center gap-1.5">
                          {t(pth.steps)
                            .split(/\s*→\s*/)
                            .map((step, j, all) => (
                              <React.Fragment key={j}>
                                <span className="px-2 py-1 bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700">{step}</span>
                                {j < all.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                              </React.Fragment>
                            ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final-day format */}
              <div className="border-2 border-slate-200">
                <PanelHeader icon={ibkIcon(rk.finalDay.icon)} title={t(rk.finalDay.title)} badge={t(rk.finalDay.badge)} />
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-slate-700">{t(rk.finalDay.text)}</p>
                  {finalDaySegments.length > 0 && (
                    <div className="flex h-9 text-[10px] font-mono-code font-bold uppercase" aria-hidden="true">
                      {finalDaySegments.map((f, i) => (
                        <div
                          key={i}
                          style={{ flexGrow: f.minutes }}
                          className={`flex items-center justify-center border-r border-white last:border-r-0 ${tone(FINAL_DAY_TONES, i)}`}
                        >
                          {t(f.time)}
                        </div>
                      ))}
                    </div>
                  )}
                  <ol>
                    {rk.finalDay.steps.map((f, i) => (
                      <li key={i} className="flex gap-3 items-start py-2 border-b border-slate-100 last:border-0">
                        <span className="w-6 h-6 shrink-0 bg-[#0A1930] text-[#FFCD00] text-[11px] font-mono-code font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="w-16 shrink-0 font-mono-code text-xs font-bold text-[#006AA7] pt-1">{t(f.time)}</span>
                        <span className="text-sm pt-0.5">{t(f.text)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {rk.showFees && <ParticipationFees />}
        </div>
      </section>

      {/* ── 6. PHOTOS & COMMUNITY STORIES ── */}
      <section id="stories" className="w-full bg-[#F8FAFC] border-y border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div>
            <Eyebrow>{t(c.stories.eyebrow)}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(c.stories.title)}</h2>
          </div>

          {c.stories.items.map((s, i) => (
            <article key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white border border-slate-200 p-5 sm:p-8">
              {s.image && (
                <div className="lg:col-span-4">
                  <img src={mediaUrl(s.image)} alt={t(s.imageAlt)} loading="lazy" className="w-full h-auto border border-slate-200" />
                </div>
              )}
              <div className={`${s.image ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500">{t(s.date)}</span>
                    <h3 className="font-headline font-black text-2xl uppercase tracking-tight">{t(s.title)}</h3>
                  </div>
                  {t(s.badge) && (
                    <span className="text-[11px] font-mono-code font-bold uppercase px-3 py-1.5 bg-[#0A1930] text-[#FFCD00]">{t(s.badge)}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 font-light leading-relaxed max-w-3xl">{t(s.text)}</p>
                {s.schedule.length > 0 && (
                  <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {s.schedule.map((w, j) => (
                      <li key={j} className="p-3 border border-slate-200 bg-[#F8FAFC] text-sm">
                        <div className="font-bold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#006AA7]" />
                          {t(w.place)}
                        </div>
                        <div className="font-mono-code text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-[#006AA7]" />
                          {w.time}
                        </div>
                        {t(w.note) && <div className="text-xs text-[#006AA7] font-bold mt-1">{t(w.note)}</div>}
                      </li>
                    ))}
                  </ol>
                )}
                {s.highlights.length > 0 && (
                  <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {s.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-2 p-3 border border-slate-200 text-sm">
                        <span className="text-lg leading-none">{h.emoji}</span>
                        <span className="text-slate-700">{t(h.text)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {cmsLink(s.link, textLink, 'sm')}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 7. PARTNERS ── */}
      <section id="partners" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <Eyebrow>{t(c.partners.eyebrow)}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(c.partners.title)}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.partners.items.map((p, i) => {
              const inner = (
                <>
                  {p.logo && <img src={mediaUrl(p.logo)} alt={p.name} loading="lazy" className="h-12 w-auto object-contain" />}
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500">{t(p.role)}</span>
                </>
              );
              const cls = 'border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 text-center';
              return p.href ? (
                <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-[#006AA7] transition-colors`}>
                  {inner}
                </a>
              ) : (
                <div key={i} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
          {t(c.partners.note) && <p className="text-xs font-mono-code font-bold uppercase text-slate-500">{t(c.partners.note)}</p>}
        </div>
      </section>

      {/* ── 8. CONTACT ── */}
      <section id="contact" className="w-full bg-[#0A1930] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Eyebrow light>{t(c.contact.eyebrow)}</Eyebrow>
              <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{t(c.contact.title)}</h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.contact.cards.map((card, i) => {
                const Icon = ibkIcon(card.icon);
                return (
                  <a key={i} href={card.href || undefined} className="p-4 border border-white/20 hover:border-[#FFCD00] transition-colors flex items-start gap-3">
                    <Icon className="w-5 h-5 text-[#FFCD00] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-mono-code font-bold uppercase text-white/55">{t(card.label)}</div>
                      <div className="text-sm font-bold break-all">{card.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {c.contact.board.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-headline font-black text-lg uppercase tracking-tight">{t(c.contact.boardTitle)}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {c.contact.board.map((m, i) => (
                  <div key={i} className="bg-white text-[#0A1930]">
                    <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
                      {m.photo && <img src={mediaUrl(m.photo)} alt={m.name} loading="lazy" className="w-full h-full object-cover object-top" />}
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm">{m.name}</div>
                      <div className="text-[11px] font-mono-code uppercase text-[#006AA7]">{t(m.role)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
