import React from 'react';
import { ChevronDown, Code2, EyeOff, Timer, Users, type LucideIcon } from 'lucide-react';
import { fill } from '../content/core';
import { useT } from '../content/useT';
import { siteIcon } from '../content/icons';
import { teamsDefaults, type TeamsData } from '../content/sections/teams';

// One colour per category, used on its card header, skill path and the coding badge.
const CATEGORY_STYLES: Record<string, { band: string; dot: string; line: string; badge: string }> = {
  Junior: { band: 'bg-[#006AA7] text-white', dot: 'bg-[#006AA7]', line: 'bg-[#006AA7]/25', badge: 'bg-sky-100 text-[#006AA7]' },
  Senior: { band: 'bg-[#0A1930] text-white', dot: 'bg-[#0A1930]', line: 'bg-[#0A1930]/20', badge: 'bg-slate-200 text-[#0A1930]' },
  GYM: { band: 'bg-[#FFCD00] text-[#0A1930]', dot: 'bg-[#E0B000]', line: 'bg-[#FFCD00]/50', badge: 'bg-[#FFF3C2] text-[#0A1930]' },
};

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
      <span className="border border-[#FFCD00] text-[#FFCD00] text-[11px] font-mono-code font-bold px-2 py-1 whitespace-nowrap">{badge}</span>
    )}
  </div>
);

/** RoboKidovation categories (with each one's workshop skill path), team rules and the final-day format. */
export const RoboKidoTeamsFinalDay: React.FC<{ className?: string; data?: TeamsData }> = ({ className = '', data }) => {
  const { t } = useT();
  const d = data ?? teamsDefaults();

  const timedSteps = d.finalSteps.filter((s) => s.minutes > 0);
  const totalMinutes = timedSteps.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <section
      id="teams-final-day"
      data-no-translate="true"
      className={`w-full bg-white text-[#0A1930] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 scroll-mt-20 ${className}`}
    >
      <div className="max-w-[1560px] mx-auto space-y-8 sm:space-y-10">
        <div>
          <span className="block text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-3">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {d.categories.map((c, i) => {
            const style = CATEGORY_STYLES[c.colour] ?? CATEGORY_STYLES.Junior;
            return (
              <article key={i} className="border border-slate-200 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`${style.band} px-5 py-4`}>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider opacity-80">{t(c.level)}</div>
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight leading-none mt-1">{t(c.name)}</h3>
                  <div className="font-headline font-black text-lg mt-2 opacity-90">{t(c.grades)}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <p className="text-sm text-slate-700 leading-snug">{t(c.focus)}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">{t(d.codingLabel)}</span>
                    <span className={`px-2 py-0.5 font-bold ${style.badge}`}>{t(c.coding)}</span>
                  </div>
                  {c.skills.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-3">
                        {t(d.skillsLabel)}
                      </div>
                      <ol className="relative space-y-2.5">
                        <span className={`absolute left-[5px] top-2 bottom-2 w-0.5 ${style.line}`} aria-hidden />
                        {c.skills.map((s, j) => (
                          <li key={j} className="relative flex items-center gap-3 text-sm text-[#0A1930]">
                            <span className={`w-3 h-3 shrink-0 ${style.dot} ring-2 ring-white`} aria-hidden />
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

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-8 items-start">
          {/* ── Teams ── */}
          <div className="border border-slate-200">
            <PanelHeader icon={Users} title={t(d.teamsTitle)} />
            <div className="p-5 sm:p-6 space-y-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {d.teamFacts.map((f, i) => {
                  const Icon = siteIcon(f.icon);
                  return (
                  <li key={i} className="flex gap-3 p-3.5 bg-[#F2F6FA] border-l-4 border-[#006AA7]">
                    <span className="w-10 h-10 shrink-0 bg-white text-[#006AA7] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-headline font-black text-sm uppercase tracking-tight leading-tight">{t(f.value)}</div>
                      <p className="text-xs text-slate-600 leading-snug mt-1">{t(f.text)}</p>
                    </div>
                  </li>
                  );
                })}
              </ul>

              <div>
                <div className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2.5">
                  {t(d.rolesTitle)}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {d.roles.map((r, i) => {
                    const Icon = siteIcon(r.icon);
                    return (
                    <div key={i} className="bg-[#0A1930] text-white px-2 py-3 flex flex-col items-center gap-2 text-center">
                      <Icon className="w-5 h-5 text-[#FFCD00]" />
                      <span className="text-[11px] font-bold leading-tight">{t(r.label)}</span>
                    </div>
                    );
                  })}
                </div>
              </div>

              <details className="group border border-slate-200">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none text-sm font-bold hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                  {fill(t(d.rulesLabel), { count: d.rules.length }).join('')}
                  <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <ol className="px-4 pb-4 pt-1 space-y-2.5">
                  {d.rules.map((rule, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{t(rule)}</span>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </div>

          {/* ── Before the final ── */}
          <div className="border border-slate-200">
            <PanelHeader icon={Code2} title={t(d.beforeTitle)} />
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {d.prep.map((s, i) => (
                  <div key={i} className="border-t-4 border-[#006AA7] bg-[#F2F6FA] px-3 py-3 sm:px-4 sm:py-4">
                    <div className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight leading-none">{t(s.value)}</div>
                    <div className="mt-2 text-[10px] font-mono-code uppercase tracking-wider text-slate-500">{t(s.label)}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {t(d.prepText)}
              </p>
              <div className="flex gap-3 p-4 bg-[#0A1930] text-white">
                <EyeOff className="w-5 h-5 shrink-0 text-[#FFCD00]" />
                <p className="text-sm leading-snug">
                  {t(d.secret)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Final day: 3 hours from check-in to submission ── */}
        <div className="border border-slate-200">
          <PanelHeader icon={Timer} title={t(d.finalTitle)} badge={t(d.finalBadge)} />
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-sm leading-relaxed text-slate-700">
              {t(d.finalIntro)}
            </p>

            <div className="flex w-full h-10 text-[11px] font-mono-code font-bold uppercase">
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
                      <span className="text-xs font-mono-code font-bold text-[#006AA7] uppercase hidden lg:inline">{t(s.time)}</span>
                    </div>
                    <div>
                      <span className="text-xs font-mono-code font-bold text-[#006AA7] uppercase lg:hidden">{t(s.time)}</span>
                      <p className="text-sm text-[#0A1930] leading-snug">{t(s.label)}</p>
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
