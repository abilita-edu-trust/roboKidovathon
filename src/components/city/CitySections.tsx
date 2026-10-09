// Building blocks shared by the city sites (vxo.iniac.se, esk.iniac.se): section frame,
// headings, the event-details grid, the vote section and the "get involved" options.
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSite, pickLang, type Bilingual } from '../../context/SiteContext';
import { VoteYoungMindsSection } from '../VoteYoungMindsSection';
import type { IntakeProgramTab } from '../../pages/IntakeRegisterPage';

export const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean; className?: string }> = ({ children, light, className = '' }) => (
  <span
    className={`text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.2em] uppercase block mb-2 ${
      light ? 'text-[#FFCD00]' : 'text-[#006AA7]'
    } ${className}`}
  >
    {children}
  </span>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`font-headline font-black uppercase tracking-tight leading-[1.0] ${className}`} style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
    {children}
  </h2>
);

export const Section: React.FC<{ id: string; tone?: 'white' | 'gray' | 'blue' | 'navy'; children: React.ReactNode }> = ({ id, tone = 'white', children }) => {
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

export interface CityDetail {
  label: Bilingual;
  /** Leave null until confirmed; shown as "TBC". */
  value: Bilingual | null;
}

/** "Event details" grid; unconfirmed values show TBC. */
export const CityDetailsSection: React.FC<{ details: CityDetail[] }> = ({ details }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const { cityName } = useSite();
  return (
    <div data-no-translate="true">
      <Section id="details">
        <div className="space-y-3">
          <Eyebrow>{cityName}</Eyebrow>
          <SectionTitle>{sv ? 'Praktisk info' : 'Event details'}</SectionTitle>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
          {details.map((d) => (
            <div key={d.label.en} className="p-5 sm:p-6 border-b border-r border-slate-200">
              <dt className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500">{pickLang(d.label, sv)}</dt>
              <dd className={`mt-1 font-headline font-black text-xl uppercase tracking-tight ${d.value ? 'text-[#0A1930]' : 'text-slate-400'}`}>
                {d.value ? pickLang(d.value, sv) : sv ? 'Meddelas senare' : 'TBC'}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
};

/** The VFI "Vote for an idea of young minds" section, showing this city's ideas. */
export const CityVoteSection: React.FC<{ onOpenIdeas: () => void; onSubmitIdea: () => void }> = ({ onOpenIdeas, onSubmitIdea }) => (
  <section id="vote-ideas" className="w-full bg-white text-[#0A1930] py-10 sm:py-14 px-4 sm:px-6 lg:px-10 scroll-mt-20">
    <div className="max-w-[1400px] mx-auto">
      <VoteYoungMindsSection onNavigateIdeas={onOpenIdeas} onNavigateSubmit={onSubmitIdea} />
    </div>
  </section>
);

const PATHWAYS: { tab: IntakeProgramTab; icon: string; title: Bilingual; desc: Bilingual }[] = [
  { tab: 'workshop', icon: '🤖', title: { en: 'School Workshop', sv: 'Skolworkshop' }, desc: { en: 'Hands-on robotics workshop at your school', sv: 'Praktisk robotikworkshop på er skola' } },
  { tab: 'demo', icon: '📢', title: { en: 'School Demo', sv: 'Skoldemo' }, desc: { en: 'A live robotics demo for your school', sv: 'En robotikdemo live på er skola' } },
  { tab: 'association', icon: '🤝', title: { en: 'Group / Association', sv: 'Grupp / förening' }, desc: { en: 'Associations, clubs and community groups', sv: 'Föreningar, klubbar och grupper' } },
  { tab: 'submit-idea', icon: '💡', title: { en: 'Bring Your Idea', sv: 'Kom med din idé' }, desc: { en: 'Text, drawing, voice note or video, then public voting', sv: 'Text, skiss, röstmeddelande eller video, sedan röstning' } },
  { tab: 'hackathon', icon: '🏆', title: { en: 'Join the Hackathon', sv: 'Var med i hackathonet' }, desc: { en: 'Register your team', sv: 'Anmäl ert lag' } },
  { tab: 'volunteer', icon: '🙋', title: { en: 'Volunteer', sv: 'Volontär' }, desc: { en: 'Help run the events', sv: 'Hjälp till på evenemangen' } },
  { tab: 'partner', icon: '🏢', title: { en: 'Become a Partner', sv: 'Bli partner' }, desc: { en: 'Problem statements, mentors, workshops or equipment', sv: 'Problemformuleringar, mentorer, workshoppar eller utrustning' } },
];

const GRID_COLS: Record<number, string> = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-3' };

/** "Get involved": one card per form the site offers (opening the register page), plus Ideas & Vote. */
export const CityPathways: React.FC<{
  onRegister: (tab?: IntakeProgramTab) => void;
  onOpenIdeas: () => void;
  /** Site-specific titles and descriptions, e.g. the RoboHack dates. */
  overrides?: Partial<Record<IntakeProgramTab, { title?: Bilingual; desc?: Bilingual }>>;
}> = ({ onRegister, onOpenIdeas, overrides = {} }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const { intake } = useSite();
  const offered = PATHWAYS.filter((p) => !intake.tabs || intake.tabs.includes(p.tab)).map((p) => ({ ...p, ...overrides[p.tab] }));
  const showIdeas = offered.some((p) => p.tab === 'submit-idea');
  const cards = offered.length + (showIdeas ? 1 : 0);

  return (
    <div data-no-translate="true">
      <Section id="join" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <Eyebrow>{sv ? 'Var med' : 'Get involved'}</Eyebrow>
            <SectionTitle>{sv ? 'Bygg något verkligt' : 'Build something real'}</SectionTitle>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {sv ? 'Välj hur du vill vara med. Varje val öppnar sitt formulär.' : 'Choose how you want to take part. Each option opens its form.'}
          </p>
        </div>
        <div className={`grid grid-cols-2 gap-3 ${GRID_COLS[cards] ?? 'lg:grid-cols-4'}`}>
          {offered.map((p) => (
            <button
              key={p.tab}
              type="button"
              onClick={() => onRegister(p.tab)}
              className="group text-left bg-white border-2 border-slate-200 hover:border-[#006AA7] p-4 sm:p-5 flex flex-col gap-2 transition-colors"
            >
              <span className="text-2xl" aria-hidden>{p.icon}</span>
              <span className="font-headline font-black text-base uppercase tracking-tight">{pickLang(p.title, sv)}</span>
              <span className="text-xs text-slate-500 leading-snug">{pickLang(p.desc, sv)}</span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-mono-code font-bold uppercase text-[#006AA7]">
                {sv ? 'Öppna formuläret' : 'Open form'}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
          {showIdeas && (
            <button
              type="button"
              onClick={onOpenIdeas}
              className="group text-left bg-[#059669] hover:bg-[#047857] text-white p-4 sm:p-5 flex flex-col gap-2 transition-colors"
            >
              <span className="text-2xl" aria-hidden>⭐</span>
              <span className="font-headline font-black text-base uppercase tracking-tight">{sv ? 'Idéer och röstning' : 'Ideas & Vote'}</span>
              <span className="text-xs text-white/80 leading-snug">{sv ? 'Se idéerna och rösta på din favorit' : 'See the ideas and vote for your favourite'}</span>
              <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-mono-code font-bold uppercase">
                {sv ? 'Rösta' : 'Vote'}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          )}
        </div>
      </Section>
    </div>
  );
};
