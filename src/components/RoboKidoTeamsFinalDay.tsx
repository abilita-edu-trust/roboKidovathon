import React from 'react';
import { Users, Code2, Timer, Wrench, Gamepad2, PenTool, Mic, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ROBOKIDO_CATEGORIES, TEAM_RULES, WORKSHOP_PATHS, FINAL_DAY_STEPS } from '../data/vfiFacts';

const CATEGORY_TAG_STYLES: Record<string, string> = {
  Junior: 'bg-[#006AA7] text-white',
  Senior: 'bg-[#0A1930] text-white',
  GYM: 'bg-[#FFCD00] text-[#0A1930]',
};

const BAR_STYLES = [
  'bg-[#E2E8F0] text-[#0A1930]',
  'bg-[#006AA7] text-white',
  'bg-[#0A1930] text-white',
  'bg-[#FFCD00] text-[#0A1930]',
];

const StatTile: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="border-t-4 border-[#006AA7] bg-[#F2F6FA] px-3 py-3 sm:px-4 sm:py-4">
    <div className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#0A1930] leading-none">
      {value}
    </div>
    <div className="mt-2 text-[10px] font-mono-code uppercase tracking-wider text-slate-500">{label}</div>
  </div>
);

const PanelHeader: React.FC<{ icon: React.ReactNode; title: string; badge?: string }> = ({ icon, title, badge }) => (
  <div className="bg-[#0A1930] px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center shrink-0">{icon}</span>
      <h3 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-white">{title}</h3>
    </div>
    {badge && (
      <span className="border border-[#FFCD00] text-[#FFCD00] text-[11px] font-mono-code font-bold px-2 py-1 whitespace-nowrap">
        {badge}
      </span>
    )}
  </div>
);

/** RoboKidovation categories table, team rules, workshop preparation and final-day format. */
export const RoboKidoTeamsFinalDay: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);
  const T = (b: { en: string; sv: string }) => (sv ? b.sv : b.en);

  const roles = [
    { icon: <Wrench className="w-3.5 h-3.5" />, label: L('Builder', 'Byggare') },
    { icon: <Gamepad2 className="w-3.5 h-3.5" />, label: L('Controller', 'Förare') },
    { icon: <Code2 className="w-3.5 h-3.5" />, label: L('Programmer', 'Programmerare') },
    { icon: <PenTool className="w-3.5 h-3.5" />, label: L('Designer / tester', 'Designer / testare') },
    { icon: <Mic className="w-3.5 h-3.5" />, label: L('Presenter', 'Presentatör') },
  ];

  const timedSteps = FINAL_DAY_STEPS.filter((s) => s.minutes > 0);
  const totalMinutes = timedSteps.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <section
      id="teams-final-day"
      data-no-translate="true"
      className={`w-full bg-white text-[#0A1930] py-12 sm:py-16 px-4 sm:px-6 lg:px-10 scroll-mt-20 ${className}`}
    >
      <div className="max-w-[1560px] mx-auto space-y-10">
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

        {/* Categories */}
        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#0A1930] text-white text-[11px] font-mono-code uppercase tracking-wider">
                <th className="px-4 py-4 font-bold">{L('Category', 'Kategori')}</th>
                <th className="px-4 py-4 font-bold">{L('Grades', 'Årskurser')}</th>
                <th className="px-4 py-4 font-bold">{L('Main focus', 'Huvudfokus')}</th>
                <th className="px-4 py-4 font-bold">{L('Coding', 'Programmering')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROBOKIDO_CATEGORIES.map((c) => (
                <tr key={c.name}>
                  <td className="px-4 py-3.5 font-bold whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{T(c.grades)}</td>
                  <td className="px-4 py-3.5 text-slate-600">{T(c.focus)}</td>
                  <td className="px-4 py-3.5">{T(c.coding)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Teams */}
          <div className="border border-slate-200">
            <PanelHeader icon={<Users className="w-5 h-5" />} title={L('Teams', 'Lag')} />
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatTile value="4–5" label={L('Participants per team', 'Deltagare per lag')} />
                <StatTile value={L('Team / solo', 'Lag / solo')} label={L('Registration', 'Anmälan')} />
                <StatTile value={L('Nov wk 1', 'Nov v. 1')} label={L('Teams formed', 'Lag bildas')} />
              </div>

              <div>
                <div className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2">
                  {L('Rotating team roles', 'Roterande roller i laget')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <span
                      key={r.label}
                      className="inline-flex items-center gap-1.5 bg-[#0A1930] text-white text-xs font-bold px-2.5 py-1.5"
                    >
                      <span className="text-[#FFCD00]">{r.icon}</span>
                      {r.label}
                    </span>
                  ))}
                </div>
              </div>

              <ol className="space-y-3">
                {TEAM_RULES.map((rule, i) => (
                  <li key={rule.en} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold flex items-center justify-center">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{T(rule)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {/* Before the final */}
            <div className="border border-slate-200">
              <PanelHeader icon={<Code2 className="w-5 h-5" />} title={L('Before the final', 'Före finalen')} />
              <div className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <StatTile value="3 h" label={L('Guided preparation', 'Handledd förberedelse')} />
                  <StatTile value="2 × 90" label={L('Minute workshops', 'Minuters workshoppar')} />
                  <StatTile value={L('Pick', 'Välj')} label={L('Your workshop slot', 'Din workshoptid')} />
                </div>

                <p className="text-sm leading-relaxed text-slate-700">
                  {L(
                    'Each participant gets 3 hours of guided preparation, preferably as 2 × 90-minute workshops. Several workshop slots are opened so teams can choose suitable times. The workshops teach the skills but do not reveal the final competition problem.',
                    'Varje deltagare får 3 timmars handledd förberedelse, helst som 2 × 90 minuters workshoppar. Flera workshoptider öppnas så att lagen kan välja passande tider. Workshopparna lär ut färdigheterna men avslöjar inte finalens tävlingsuppgift.'
                  )}
                </p>

                <div className="space-y-2">
                  {WORKSHOP_PATHS.map((p) => (
                    <div key={p.category} className="flex border border-slate-200">
                      <div
                        className={`w-20 sm:w-24 shrink-0 flex items-center justify-center text-xs font-mono-code font-bold uppercase ${CATEGORY_TAG_STYLES[p.category]}`}
                      >
                        {p.category}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 p-2.5">
                        {p.steps.map((s, i) => (
                          <React.Fragment key={s.en}>
                            <span className="border border-slate-200 px-2 py-1 text-xs text-slate-700">{T(s)}</span>
                            {i < p.steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Final-day format */}
            <div className="border border-slate-200">
              <PanelHeader icon={<Timer className="w-5 h-5" />} title={L('Final-day format', 'Finaldagens upplägg')} badge="T − 3 h" />
              <div className="p-5 sm:p-6 space-y-5">
                <p className="text-sm leading-relaxed text-slate-700">
                  {L(
                    'The challenge is given only on competition day. Teams have 3 hours from check-in to submission.',
                    'Uppgiften ges först på tävlingsdagen. Lagen har 3 timmar från incheckning till inlämning.'
                  )}
                </p>

                <div className="flex w-full h-9 text-[11px] font-mono-code font-bold uppercase">
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

                <ol className="divide-y divide-slate-200">
                  {FINAL_DAY_STEPS.map((s, i) => (
                    <li key={s.label.en} className="flex items-start gap-3 sm:gap-4 py-3 text-sm">
                      <span className="w-6 h-6 shrink-0 bg-[#0A1930] text-[#FFCD00] text-[11px] font-mono-code font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="w-20 shrink-0 pt-0.5 text-xs font-mono-code font-bold text-[#006AA7]">{T(s.time)}</span>
                      <span className="text-[#0A1930]">{T(s.label)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
