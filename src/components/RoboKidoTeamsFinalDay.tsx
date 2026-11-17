import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Code2, EyeOff, Timer, Users, type LucideIcon } from 'lucide-react';
import { fill } from '../content/core';
import { useT } from '../content/useT';
import { siteIcon } from '../content/icons';
import { teamsDefaults, type TeamsData } from '../content/sections/teams';
import { robokidoAnchor } from '../content/sections/robokido';
import { useSite } from '../context/SiteContext';

/** The categories' detailed sections (vfi, IBK): each full poster (uncropped) with its facts, registration and
 *  rules link, then the team rules and final-day format folded away. A section reached from the programme box is
 *  outlined for a moment. */
const CategoryPosters: React.FC<{ d: TeamsData; go?: (href: string) => void; className: string }> = ({ d, go, className }) => {
  const { t, L } = useT();
  // vfi and IBK (designV2): name, grades, kind and tagline show; the fact table opens on request.
  const { designV2 } = useSite();
  const posters = d.posters;
  const [lit, setLit] = useState('');
  useEffect(() => {
    const onSection = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!posters.some((p) => robokidoAnchor(p.id) === id)) return;
      setLit(id);
      window.setTimeout(() => setLit((cur) => (cur === id ? '' : cur)), 2400);
    };
    window.addEventListener('site-section', onSection);
    return () => window.removeEventListener('site-section', onSection);
  }, [posters]);
  const follow = (href: string) => (e: React.MouseEvent) => {
    if (!go || /^https?:/.test(href)) return;
    e.preventDefault();
    go(href);
  };
  return (
    <section id="teams-final-day" data-no-translate="true" className={`w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 scroll-mt-20 ${className}`}>
      <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
        <div>
          <span className="block text-[13px] sm:text-sm font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-3">{t(d.eyebrow)}</span>
          <h2 className="font-headline font-black uppercase tracking-tight leading-[1] text-[#0A1930]" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}>
            {t(d.postersTitle)}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {posters.map((p) => {
            const anchor = robokidoAnchor(p.id);
            return (
              <article
                key={p.id}
                id={anchor}
                aria-labelledby={`${anchor}-name`}
                className={`scroll-mt-24 grid grid-cols-1 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:grid-cols-1 gap-5 md:gap-6 lg:gap-4 content-start p-3 -m-3 outline outline-4 motion-safe:transition-[outline-color] motion-safe:duration-500 ${
                  lit === anchor ? 'outline-[#FFCD00]' : 'outline-transparent'
                }`}
              >
                <img src={p.image} alt={t(p.imageAlt)} width={941} height={1672} loading="lazy" className="w-full max-w-[420px] mx-auto h-auto shadow-lg" />
                <div className="min-w-0 flex flex-col items-start gap-3">
                  <div>
                    <h3 id={`${anchor}-name`} className="font-headline font-black uppercase text-xl leading-tight">{t(p.name)}</h3>
                    <p className="font-headline font-black text-[#006AA7] text-lg leading-tight">{t(p.grades)}</p>
                    <span className="inline-block mt-1.5 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5">{t(p.kind)}</span>
                    {t(p.tagline) && <p className="mt-2 text-[15px] font-semibold text-[#0A1930] leading-snug">{t(p.tagline)}</p>}
                  </div>
                  {(() => {
                    const facts = (
                      <dl className="w-full space-y-1.5 text-sm">
                        {p.facts.map((f, i) => (
                          <div key={i} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 border-t border-slate-200 pt-1.5">
                            <dt className="font-mono-code font-bold text-[12px] uppercase tracking-wider text-slate-500">{t(f.label)}</dt>
                            <dd className="text-slate-700 leading-snug">{t(f.value)}</dd>
                          </div>
                        ))}
                      </dl>
                    );
                    if (!designV2 || !p.facts.length) return facts;
                    return (
                      <details className="group w-full border-y border-slate-200">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 py-3 text-[15px] font-semibold text-[#0A1930] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006AA7] [&::-webkit-details-marker]:hidden">
                          {L('Details', 'Detaljer')}
                          <ChevronDown className="w-5 h-5 shrink-0 motion-safe:transition-transform group-open:rotate-180" aria-hidden="true" />
                        </summary>
                        <div className="pb-3">{facts}</div>
                      </details>
                    );
                  })()}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={p.register.href}
                      onClick={follow(p.register.href)}
                      className="inline-flex items-center gap-2 bg-[#0A1930] text-white hover:bg-[#006AA7] px-4 py-2.5 text-xs font-headline font-black uppercase tracking-wider motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7]"
                    >
                      {t(p.register.label)}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                    {p.rules?.href && t(p.rules.label) && (
                      <a
                        href={p.rules.href}
                        onClick={follow(p.rules.href)}
                        className="inline-flex items-center gap-2 border-2 border-[#0A1930] text-[#0A1930] hover:bg-[#0A1930] hover:text-white px-4 py-2 text-xs font-headline font-black uppercase tracking-wider motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7]"
                      >
                        {t(p.rules.label)}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <details className="group border border-slate-200 bg-[#F8FAFC]">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 font-headline font-black uppercase text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006AA7]">
            <span>
              {t(d.teamsTitle)} · {t(d.finalTitle)}
            </span>
            <ChevronDown className="w-5 h-5 shrink-0 motion-safe:transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-5 pb-5 text-sm text-slate-700 leading-relaxed">
            <div>
              <h4 className="font-headline font-black uppercase text-[#0A1930] mb-2">{t(d.teamsTitle)}</h4>
              <ol className="list-decimal pl-5 space-y-1.5">
                {d.rules.map((r, i) => (
                  <li key={i}>{t(r)}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="font-headline font-black uppercase text-[#0A1930] mb-2">{t(d.finalTitle)}</h4>
              <p className="mb-2">{t(d.finalIntro)}</p>
              <ol className="space-y-1.5">
                {d.finalSteps.map((s, i) => (
                  <li key={i} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
                    <span className="font-mono-code font-bold text-[12px] uppercase text-[#006AA7]">{t(s.time)}</span>
                    <span>{t(s.label)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
};

// One colour per category, used on its card header, skill markers and the coding badge.
const CATEGORY_STYLES: Record<string, { band: string; dot: string; badge: string }> = {
  Junior: { band: 'bg-[#006AA7] text-white', dot: 'bg-[#006AA7]', badge: 'bg-sky-100 text-[#006AA7]' },
  Senior: { band: 'bg-[#0A1930] text-white', dot: 'bg-[#0A1930]', badge: 'bg-slate-200 text-[#0A1930]' },
  GYM: { band: 'bg-[#FFCD00] text-[#0A1930]', dot: 'bg-[#E0B000]', badge: 'bg-[#FFF3C2] text-[#0A1930]' },
};

/** Wide-screen columns for 1–5 team facts (full class names, so Tailwind keeps them). */
const FACT_COLS = ['', 'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5'];

const BAR_STYLES = ['bg-[#E2E8F0] text-[#0A1930]', 'bg-[#006AA7] text-white', 'bg-[#0A1930] text-white', 'bg-[#FFCD00] text-[#0A1930]'];

const PanelHeader: React.FC<{ icon: LucideIcon; title: string; badge?: string }> = ({ icon: Icon, title, badge }) => (
  <div className="bg-[#0A1930] px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <h3 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-white">{title}</h3>
    </div>
    {badge && (
      <span className="border border-[#FFCD00] text-[#FFCD00] text-[13px] font-mono-code font-bold px-2 py-1 whitespace-nowrap">{badge}</span>
    )}
  </div>
);

/** RoboKidovation categories (with each one's workshop skill path), team rules and the final-day format. */
export const RoboKidoTeamsFinalDay: React.FC<{ className?: string; data?: TeamsData; go?: (href: string) => void; textOnly?: boolean }> = ({
  className = '',
  data,
  go,
  textOnly = false,
}) => {
  const { t } = useT();
  const d = data ?? teamsDefaults();
  if (!textOnly && d.posters?.length) return <CategoryPosters d={d} go={go} className={className} />;

  const timedSteps = d.finalSteps.filter((s) => s.minutes > 0);
  const totalMinutes = timedSteps.reduce((sum, s) => sum + s.minutes, 0);

  // Team facts share one row on wide screens; an odd last fact spans the 2-column rows.
  const factCount = d.teamFacts.length;
  const factCols = factCount <= 5 ? FACT_COLS[factCount] : factCount === 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <section
      id="teams-final-day"
      data-no-translate="true"
      className={`w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 scroll-mt-20 ${className}`}
    >
      <div className="max-w-[1560px] mx-auto space-y-6 sm:space-y-8">
        <div>
          <span className="block text-[13px] sm:text-sm font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-3">
            {t(d.eyebrow)}
          </span>
          <h2
            className="font-headline font-black uppercase tracking-tight leading-[1] text-[#0A1930]"
            style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}
          >
            {t(d.title)}
          </h2>
        </div>

        {/* ── Categories, each with the skills its workshops build ── */}
        <div className={`grid grid-cols-1 ${d.categories.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 sm:gap-5`}>
          {d.categories.map((c, i) => {
            const style = CATEGORY_STYLES[c.colour] ?? CATEGORY_STYLES.Junior;
            return (
              <article key={i} className="border border-slate-200 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`${style.band} px-5 py-4`}>
                  <div className="text-[13px] font-mono-code font-bold uppercase tracking-wider opacity-80">{t(c.level)}</div>
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight leading-none mt-1">{t(c.name)}</h3>
                  <div className="font-headline font-black text-lg mt-2 opacity-90">{t(c.grades)}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <p className="text-[15px] text-slate-700 leading-snug">{t(c.focus)}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{t(d.codingLabel)}</span>
                    <span className={`px-2 py-0.5 font-bold ${style.badge}`}>{t(c.coding)}</span>
                  </div>
                  {c.skills.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="text-[13px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-3">
                        {t(d.skillsLabel)}
                      </div>
                      {/* Two columns where the card is wide enough, so the skills use its full width */}
                      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2.5">
                        {c.skills.map((s, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-[15px] text-[#0A1930] leading-snug">
                            <span className={`w-3 h-3 mt-1 shrink-0 ${style.dot}`} aria-hidden />
                            <span className="first-letter:uppercase">{t(s)}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Teams ── */}
        <div className="border border-slate-200">
          <PanelHeader icon={Users} title={t(d.teamsTitle)} />
          <div className="p-5 sm:p-6 space-y-6">
            <ul className={`grid grid-cols-1 sm:grid-cols-2 ${factCols} gap-3`}>
              {d.teamFacts.map((f, i) => {
                const Icon = siteIcon(f.icon);
                const oddLast = factCount % 2 === 1 && i === factCount - 1;
                return (
                  <li
                    key={i}
                    className={`flex lg:flex-col gap-3 p-4 bg-[#F2F6FA] border-t-4 border-[#006AA7] ${oddLast ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    <span className="w-10 h-10 shrink-0 bg-white text-[#006AA7] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-headline font-black text-base uppercase tracking-tight leading-tight">{t(f.value)}</div>
                      <p className="text-sm text-slate-600 leading-snug mt-1">{t(f.text)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div>
              <div className="text-[13px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2.5">
                {t(d.rolesTitle)}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {d.roles.map((r, i) => {
                  const Icon = siteIcon(r.icon);
                  return (
                    <div key={i} className="bg-[#0A1930] text-white px-2 py-3.5 flex flex-col items-center gap-2 text-center">
                      <Icon className="w-5 h-5 text-[#FFCD00]" />
                      <span className="text-sm font-bold leading-tight">{t(r.label)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <details className="group border border-slate-200">
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none text-[15px] font-bold hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                {fill(t(d.rulesLabel), { count: d.rules.length }).join('')}
                <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
              </summary>
              <ol className="px-4 pb-4 pt-1 space-y-2.5">
                {d.rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
                    <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[13px] font-mono-code font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{t(rule)}</span>
                  </li>
                ))}
              </ol>
            </details>
          </div>
        </div>

        {/* ── Before the final: the preparation figures beside what they mean ── */}
        <div className="border border-slate-200">
          <PanelHeader icon={Code2} title={t(d.beforeTitle)} />
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
            <div className="lg:col-span-3 grid grid-cols-3 gap-3">
              {d.prep.map((s, i) => (
                <div key={i} className="border-t-4 border-[#006AA7] bg-[#F2F6FA] px-3 py-4 sm:px-4 sm:py-5 flex flex-col justify-center">
                  <div className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight leading-none">{t(s.value)}</div>
                  <div className="mt-2 text-xs sm:text-[13px] font-mono-code uppercase tracking-wider text-slate-600">{t(s.label)}</div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              <p className="text-[15px] leading-relaxed text-slate-700 flex-1 flex items-center">{t(d.prepText)}</p>
              <div className="flex gap-3 p-4 bg-[#0A1930] text-white">
                <EyeOff className="w-5 h-5 shrink-0 text-[#FFCD00]" />
                <p className="text-[15px] leading-snug">{t(d.secret)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Final day: 3 hours from check-in to submission ── */}
        <div className="border border-slate-200">
          <PanelHeader icon={Timer} title={t(d.finalTitle)} badge={t(d.finalBadge)} />
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-[15px] leading-relaxed text-slate-700">
              {t(d.finalIntro)}
            </p>

            <div className="flex w-full h-10 text-[13px] font-mono-code font-bold uppercase">
              {timedSteps.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center whitespace-nowrap overflow-hidden ${BAR_STYLES[i % BAR_STYLES.length]}`}
                  style={{ width: `${(s.minutes / totalMinutes) * 100}%` }}
                >
                  {t(s.time)}
                </div>
              ))}
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {d.finalSteps.map((s, i) => {
                const Icon = siteIcon(s.icon);
                return (
                  <li key={i} className="flex lg:flex-col gap-3 p-4 bg-[#F8FAFC] border border-slate-200 hover:border-[#006AA7] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 shrink-0 bg-[#0A1930] text-[#FFCD00] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-mono-code font-bold text-[#006AA7] uppercase hidden lg:inline">{t(s.time)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-mono-code font-bold text-[#006AA7] uppercase lg:hidden">{t(s.time)}</span>
                      <p className="text-[15px] text-[#0A1930] leading-snug">{t(s.label)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
