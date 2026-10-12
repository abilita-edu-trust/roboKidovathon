import React from 'react';
import {
  BookOpen, CalendarDays, ChevronDown, ClipboardCheck, Code2, EyeOff, Flag, Gamepad2, Gauge, Mic,
  PenTool, RefreshCw, Timer, UserCheck, Users, Wrench, type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ROBOKIDO_CATEGORIES, TEAM_RULES, WORKSHOP_PATHS, FINAL_DAY_STEPS } from '../data/vfiFacts';

type Bi = { en: string; sv: string };

// One colour per category, used on its card header, skill path and the coding badge.
const CATEGORY_STYLES: Record<string, { band: string; dot: string; line: string; badge: string }> = {
  Junior: { band: 'bg-[#006AA7] text-white', dot: 'bg-[#006AA7]', line: 'bg-[#006AA7]/25', badge: 'bg-sky-100 text-[#006AA7]' },
  Senior: { band: 'bg-[#0A1930] text-white', dot: 'bg-[#0A1930]', line: 'bg-[#0A1930]/20', badge: 'bg-slate-200 text-[#0A1930]' },
  GYM: { band: 'bg-[#FFCD00] text-[#0A1930]', dot: 'bg-[#E0B000]', line: 'bg-[#FFCD00]/50', badge: 'bg-[#FFF3C2] text-[#0A1930]' },
};

const BAR_STYLES = ['bg-[#E2E8F0] text-[#0A1930]', 'bg-[#006AA7] text-white', 'bg-[#0A1930] text-white', 'bg-[#FFCD00] text-[#0A1930]'];

// Final-day stages in FINAL_DAY_STEPS order.
const FINAL_ICONS: LucideIcon[] = [ClipboardCheck, BookOpen, Wrench, Gauge, Flag];

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
export const RoboKidoTeamsFinalDay: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);
  const T = (b: Bi) => (sv ? b.sv : b.en);

  const roles: { icon: LucideIcon; label: string }[] = [
    { icon: Wrench, label: L('Builder', 'Byggare') },
    { icon: Gamepad2, label: L('Controller', 'Förare') },
    { icon: Code2, label: L('Programmer', 'Programmerare') },
    { icon: PenTool, label: L('Designer / tester', 'Designer / testare') },
    { icon: Mic, label: L('Presenter', 'Presentatör') },
  ];

  // The team rules at a glance; the full wording stays in the drawer below.
  const teamFacts: { icon: LucideIcon; value: string; text: string }[] = [
    {
      icon: Users,
      value: L('4–5 per team', '4–5 per lag'),
      text: L('Sign up as a team, or on your own and we place you in one.', 'Anmäl ett lag, eller dig själv så placerar vi dig i ett.'),
    },
    {
      icon: CalendarDays,
      value: L('Teams form in Nov, week 1', 'Lagen bildas nov v. 1'),
      text: L('At the first workshop, balanced by age, experience and gender.', 'På första workshoppen, balanserade efter ålder, erfarenhet och kön.'),
    },
    {
      icon: RefreshCw,
      value: L('Everyone rotates roles', 'Alla roterar roller'),
      text: L('No one does all the technical work.', 'Ingen gör allt tekniskt arbete.'),
    },
    {
      icon: Code2,
      value: L('No coding needed to start', 'Ingen kod krävs för att börja'),
      text: L('Juniors need none; older teams get intro support.', 'Junior behöver ingen; äldre lag får introduktion.'),
    },
    {
      icon: UserCheck,
      value: L('Come to the workshops', 'Kom till workshopparna'),
      text: L('Attending them keeps your team in the final.', 'Att delta håller laget kvar i finalen.'),
    },
  ];

  const timedSteps = FINAL_DAY_STEPS.filter((s) => s.minutes > 0);
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
            RoboKidovation 2026
          </span>
          <h2
            className="font-headline font-black uppercase tracking-tight leading-[1] text-[#0A1930]"
            style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)' }}
          >
            {L('Categories, teams & final day', 'Kategorier, lag & finaldag')}
          </h2>
        </div>

        {/* ── Categories, each with the skills its workshops build ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {ROBOKIDO_CATEGORIES.map((c) => {
            const key = c.name.replace('RoboKido ', '');
            const style = CATEGORY_STYLES[key] ?? CATEGORY_STYLES.Junior;
            const path = WORKSHOP_PATHS.find((p) => p.category === key);
            return (
              <article key={c.name} className="border border-slate-200 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`${style.band} px-5 py-4`}>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider opacity-80">{T(c.level)}</div>
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight leading-none mt-1">{c.name}</h3>
                  <div className="font-headline font-black text-lg mt-2 opacity-90">{T(c.grades)}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <p className="text-sm text-slate-700 leading-snug">{T(c.focus)}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">{L('Coding', 'Programmering')}</span>
                    <span className={`px-2 py-0.5 font-bold ${style.badge}`}>{T(c.coding)}</span>
                  </div>
                  {path && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-3">
                        {L('Workshop skills', 'Workshopfärdigheter')}
                      </div>
                      <ol className="relative space-y-2.5">
                        <span className={`absolute left-[5px] top-2 bottom-2 w-0.5 ${style.line}`} aria-hidden />
                        {path.steps.map((s) => (
                          <li key={s.en} className="relative flex items-center gap-3 text-sm text-[#0A1930]">
                            <span className={`w-3 h-3 shrink-0 ${style.dot} ring-2 ring-white`} aria-hidden />
                            <span className="first-letter:uppercase">{T(s)}</span>
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
            <PanelHeader icon={Users} title={L('Teams', 'Lag')} />
            <div className="p-5 sm:p-6 space-y-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teamFacts.map(({ icon: Icon, value, text }) => (
                  <li key={value} className="flex gap-3 p-3.5 bg-[#F2F6FA] border-l-4 border-[#006AA7]">
                    <span className="w-10 h-10 shrink-0 bg-white text-[#006AA7] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-headline font-black text-sm uppercase tracking-tight leading-tight">{value}</div>
                      <p className="text-xs text-slate-600 leading-snug mt-1">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div>
                <div className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2.5">
                  {L('Roles you rotate through', 'Roller ni roterar mellan')}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {roles.map(({ icon: Icon, label }) => (
                    <div key={label} className="bg-[#0A1930] text-white px-2 py-3 flex flex-col items-center gap-2 text-center">
                      <Icon className="w-5 h-5 text-[#FFCD00]" />
                      <span className="text-[11px] font-bold leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <details className="group border border-slate-200">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none text-sm font-bold hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                  {L(`Read all ${TEAM_RULES.length} team rules`, `Läs alla ${TEAM_RULES.length} lagregler`)}
                  <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <ol className="px-4 pb-4 pt-1 space-y-2.5">
                  {TEAM_RULES.map((rule, i) => (
                    <li key={rule.en} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{T(rule)}</span>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </div>

          {/* ── Before the final ── */}
          <div className="border border-slate-200">
            <PanelHeader icon={Code2} title={L('Before the final', 'Före finalen')} />
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: '3 h', label: L('Guided preparation', 'Handledd förberedelse') },
                  { value: '2 × 90', label: L('Minute workshops', 'Minuters workshoppar') },
                  { value: L('Pick', 'Välj'), label: L('Your workshop slot', 'Din workshoptid') },
                ].map((s) => (
                  <div key={s.label} className="border-t-4 border-[#006AA7] bg-[#F2F6FA] px-3 py-3 sm:px-4 sm:py-4">
                    <div className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight leading-none">{s.value}</div>
                    <div className="mt-2 text-[10px] font-mono-code uppercase tracking-wider text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {L(
                  'Several workshop slots open, so each team picks times that suit them.',
                  'Flera workshoptider öppnas, så varje lag väljer tider som passar.'
                )}
              </p>
              <div className="flex gap-3 p-4 bg-[#0A1930] text-white">
                <EyeOff className="w-5 h-5 shrink-0 text-[#FFCD00]" />
                <p className="text-sm leading-snug">
                  {L(
                    'Workshops teach the skills. The final problem stays secret until competition day.',
                    'Workshopparna lär ut färdigheterna. Finaluppgiften hålls hemlig till tävlingsdagen.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Final day: 3 hours from check-in to submission ── */}
        <div className="border border-slate-200">
          <PanelHeader icon={Timer} title={L('Final-day format', 'Finaldagens upplägg')} badge="T − 3 h" />
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-sm leading-relaxed text-slate-700">
              {L(
                'The challenge is revealed on competition day. Teams have 3 hours from check-in to submission.',
                'Uppgiften avslöjas på tävlingsdagen. Lagen har 3 timmar från incheckning till inlämning.'
              )}
            </p>

            <div className="flex w-full h-10 text-[11px] font-mono-code font-bold uppercase">
              {timedSteps.map((s, i) => (
                <div
                  key={s.label.en}
                  className={`flex items-center justify-center whitespace-nowrap overflow-hidden ${BAR_STYLES[i % BAR_STYLES.length]}`}
                  style={{ width: `${(s.minutes / totalMinutes) * 100}%` }}
                >
                  {T(s.time)}
                </div>
              ))}
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {FINAL_DAY_STEPS.map((s, i) => {
                const Icon = FINAL_ICONS[i] ?? Flag;
                return (
                  <li key={s.label.en} className="flex lg:flex-col gap-3 p-4 bg-[#F8FAFC] border border-slate-200 hover:border-[#006AA7] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 shrink-0 bg-[#0A1930] text-[#FFCD00] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-mono-code font-bold text-[#006AA7] uppercase hidden lg:inline">{T(s.time)}</span>
                    </div>
                    <div>
                      <span className="text-xs font-mono-code font-bold text-[#006AA7] uppercase lg:hidden">{T(s.time)}</span>
                      <p className="text-sm text-[#0A1930] leading-snug">{T(s.label)}</p>
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
