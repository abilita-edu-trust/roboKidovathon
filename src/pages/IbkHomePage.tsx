import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Users,
  HandHeart,
  Bot,
  Lightbulb,
  Globe2,
  Sparkles,
  FlaskConical,
  Puzzle,
  PartyPopper,
  Smile,
  Code2,
  Timer,
  Wrench,
  Gamepad2,
  PenTool,
  Mic,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PARTNER_LOGOS } from '../data/roboData';
import { HACKATHON_LEVELS, PARTICIPANT_CATEGORY, ROBOKIDO_CATEGORIES, VFI_FACTS, VFI_TIMELINE } from '../data/vfiFacts';
import type { IntakeProgramTab } from './IntakeRegisterPage';
import { ParticipationFees } from '../components/ParticipationFees';

interface IbkHomePageProps {
  onNavigate: (route: string, tab?: IntakeProgramTab) => void;
}

const ibkImage = (file: string) => `/ibk/${encodeURIComponent(file)}`;

const IBK_EMAIL = 'Vasteras@indiskbarnklubb.se';

const MEMBERSHIP_FORM = 'https://forms.gle/fJ1ycYvkK1rN3kZw5';

const IBK_LOGO = '/ibk logo.png';

const TEAM_REGISTRATION_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSf92IaaY4SzkGYdu-kcUO1de4F-KJMdRPmwNd0ap8__Quv6Fg/viewform';

type BoardMember = { name: string; role: { en: string; sv: string }; photo: string };

const BOARD: BoardMember[] = [
  { name: 'Richa Nautiyal', role: { en: 'Chairman', sv: 'Ordförande' }, photo: ibkImage('Richa Nautiyal, Chairman.png') },
  { name: 'Poonam Shenoy', role: { en: 'Deputy Chairman', sv: 'Vice ordförande' }, photo: ibkImage('Poonam Shenoy, Deputy Chairman.jpeg') },
  { name: 'Sandhya Acharya', role: { en: 'Secretary', sv: 'Sekreterare' }, photo: ibkImage('Sandhya Acharya, Secretary.jpeg') },
  { name: 'Radha', role: { en: 'Deputy Secretary', sv: 'Vice sekreterare' }, photo: ibkImage('Radha, Deputy Secretary.jpeg') },
  { name: 'Priyanka Eti', role: { en: 'Treasurer', sv: 'Kassör' }, photo: ibkImage('Priyanka Eti – Treasurer Srushti – Deputy Treasurer.jpg') },
  { name: 'Srushti', role: { en: 'Deputy Treasurer', sv: 'Vice kassör' }, photo: ibkImage('last pic.jpeg') },
];

const WORKSHOP_SCHEDULE: { time: string; place: string; note?: { en: string; sv: string } }[] = [
  { time: '08:30–11:00', place: 'MISV' },
  { time: '13:00–14:00', place: 'Viksängskolan' },
  {
    time: '17:30–19:00',
    place: 'ABF, Pilgatan',
    note: { en: 'Open session for children aged 7+ & parents', sv: 'Öppen session för barn från 7 år och föräldrar' },
  },
];

const MKM_HIGHLIGHTS: { icon: string; en: string; sv: string }[] = [
  { icon: '🌍', en: 'Multicultural stage performances', sv: 'Mångkulturella scenframträdanden' },
  { icon: '💃', en: 'Inter-city dance championship', sv: 'Dansmästerskap mellan städer' },
  { icon: '🍛', en: 'International food stalls', sv: 'Internationella matstånd' },
  { icon: '🎈', en: "Children's activities", sv: 'Aktiviteter för barn' },
];

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

const TEAM_ROLES: { icon: React.ElementType; en: string; sv: string }[] = [
  { icon: Wrench, en: 'Builder', sv: 'Byggare' },
  { icon: Gamepad2, en: 'Controller', sv: 'Förare' },
  { icon: Code2, en: 'Programmer', sv: 'Programmerare' },
  { icon: PenTool, en: 'Designer / tester', sv: 'Designer / testare' },
  { icon: Mic, en: 'Presenter', sv: 'Presentatör' },
];

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

const DateBadge: React.FC<{ green?: boolean }> = ({ green }) => (
  <div className={`w-12 shrink-0 text-center text-white ${green ? 'bg-[#059669]' : 'bg-[#006AA7]'}`}>
    <div className="font-headline font-black text-xl leading-none pt-1.5">5</div>
    <div className="text-[9px] font-mono-code font-bold uppercase pb-1.5">Dec</div>
  </div>
);

export const IbkHomePage: React.FC<IbkHomePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);

  const upcoming = [
    {
      icon: Bot,
      when: L('October 2026', 'Oktober 2026'),
      title: L('Future Innovators school demos & workshops', 'Future Innovators skoldemos och workshoppar'),
      where: L('Participating schools and associations, Västerås', 'Deltagande skolor och föreningar, Västerås'),
      action: { label: L('Register School, Association or Team', 'Registrera skola, förening eller lag'), go: () => onNavigate('register') },
    },
    {
      icon: Calendar,
      when: sv ? VFI_FACTS.qualifiers.sv : VFI_FACTS.qualifiers.en,
      title: L('RoboKidovation school qualifiers', 'RoboKidovation skolkval'),
      where: L(
        'Held in each participating school or association',
        'Genomförs på varje deltagande skola eller förening'
      ),
      action: { label: L('See the competition rules', 'Se tävlingsreglerna'), go: () => onNavigate('challenges') },
    },
    {
      icon: MapPin,
      when: sv ? VFI_FACTS.finalDate.sv : VFI_FACTS.finalDate.en,
      title: L('RoboKidovation Final', 'RoboKidovation-final'),
      where: VFI_FACTS.roboFinalVenue.full,
      action: { label: L('About the final', 'Om finalen'), go: () => onNavigate('events') },
    },
    {
      icon: Lightbulb,
      when: sv ? VFI_FACTS.finalDate.sv : VFI_FACTS.finalDate.en,
      title: L('Young Inno Hack final presentations', 'Young Inno Hack – finalpresentationer'),
      where: sv ? VFI_FACTS.hackVenue.sv : VFI_FACTS.hackVenue.en,
      action: { label: L('Submit an idea', 'Skicka in en idé'), go: () => onNavigate('register', 'submit-idea') },
    },
  ];

  const joinOptions = [
    {
      icon: Heart,
      title: L('Become a member', 'Bli medlem'),
      text: L(
        'Families from all cultures and backgrounds are welcome. Fill in the membership form to join IBK.',
        'Familjer från alla kulturer och bakgrunder är välkomna. Fyll i medlemsformuläret för att gå med i IBK.'
      ),
      cta: L('Membership form', 'Medlemsformulär'),
      href: MEMBERSHIP_FORM,
    },
    {
      icon: HandHeart,
      title: L('Volunteer with us', 'Bli volontär'),
      text: L(
        'Help at our festivals, workshops and the Future Innovators final — every pair of hands counts.',
        'Hjälp till på våra festivaler, workshoppar och Future Innovators-finalen — varje insats räknas.'
      ),
      cta: L('Volunteer form', 'Volontärformulär'),
      go: () => onNavigate('register', 'volunteer'),
    },
  ];

  const benefits = [
    {
      icon: Smile,
      title: L('Make new friends', 'Få nya vänner'),
      text: L(
        'Connect with children from different backgrounds in a welcoming community.',
        'Träffa barn med olika bakgrunder i en välkomnande gemenskap.'
      ),
    },
    {
      icon: Globe2,
      title: L('Explore cultures', 'Upptäck kulturer'),
      text: L(
        'Discover Indian traditions and share your own through festivals, music, dance and art.',
        'Upptäck indiska traditioner och dela dina egna genom festivaler, musik, dans och konst.'
      ),
    },
    {
      icon: Sparkles,
      title: L('Build confidence', 'Bygg självförtroende'),
      text: L(
        'Express yourself through performances and creative activities.',
        'Uttryck dig genom framträdanden och kreativa aktiviteter.'
      ),
    },
    {
      icon: FlaskConical,
      title: L('Learn through discovery', 'Lär genom att upptäcka'),
      text: L(
        'Explore science, robotics and innovation through hands-on workshops.',
        'Utforska naturvetenskap, robotik och innovation i praktiska workshoppar.'
      ),
    },
    {
      icon: Puzzle,
      title: L('Develop valuable skills', 'Utveckla värdefulla färdigheter'),
      text: L(
        'Practise teamwork, communication and creative problem-solving.',
        'Öva lagarbete, kommunikation och kreativ problemlösning.'
      ),
    },
    {
      icon: PartyPopper,
      title: L('Enjoy time together', 'Ha roligt tillsammans'),
      text: L(
        'Join family activities, celebrations and community events.',
        'Delta i familjeaktiviteter, firanden och gemenskapsevenemang.'
      ),
    },
  ];

  const teamRules = [
    L('Each team should have 4–5 participants.', 'Varje lag ska ha 4–5 deltagare.'),
    L(
      'Students can register either as a full team or as an individual participant. Individual registrations will be grouped with other participants by the organizers.',
      'Elever kan anmäla sig som ett helt lag eller som enskild deltagare. Enskilda anmälningar placeras i lag med andra deltagare av arrangörerna.'
    ),
    L(
      'Teams will be formed during the first workshop in the first week of November.',
      'Lagen bildas under den första workshoppen i första veckan i november.'
    ),
    L(
      'Where possible, teams should be balanced by age/grade level, experience and gender. Students from different schools can be placed in the same team if needed.',
      'Om möjligt balanseras lagen efter ålder/årskurs, erfarenhet och kön. Elever från olika skolor kan placeras i samma lag vid behov.'
    ),
    L(
      'Every team should choose a team name and assign simple rotating roles such as builder, controller, programmer, designer/tester and presenter.',
      'Varje lag väljer ett lagnamn och fördelar enkla roterande roller, till exempel byggare, förare, programmerare, designer/testare och presentatör.'
    ),
    L(
      'One student should not do all the technical work. Team members should be encouraged to rotate roles during workshops.',
      'En elev ska inte göra allt tekniskt arbete. Lagmedlemmarna uppmuntras att rotera roller under workshopparna.'
    ),
    L(
      'For Junior teams, coding experience is not required. For higher categories, previous coding experience is also not mandatory; introductory support will be provided.',
      'För Junior-lag krävs ingen programmeringserfarenhet. Inte heller i högre kategorier är tidigare erfarenhet ett krav; introduktionsstöd ges.'
    ),
    L(
      'Teams should attend the scheduled preparation workshops to remain eligible for the final challenge.',
      'Lagen ska delta i de schemalagda förberedande workshopparna för att få delta i finalutmaningen.'
    ),
    L(
      'If someone drops out, the organizers may move or add participants to keep teams at a workable size.',
      'Om någon hoppar av kan arrangörerna flytta eller lägga till deltagare så att lagen har en fungerande storlek.'
    ),
    L(
      'Final team composition should normally be fixed after the first or second workshop, so students have enough time to work together before the competition.',
      'Lagens sammansättning bör normalt vara fastställd efter den första eller andra workshoppen, så att eleverna hinner arbeta tillsammans före tävlingen.'
    ),
  ];

  const prepPaths = [
    {
      name: 'Junior',
      steps: L(
        'Motor control → chassis/building → joystick → testing → simple obstacle tasks',
        'Motorstyrning → chassi/bygge → joystick → testning → enkla hinderuppgifter'
      ),
    },
    {
      name: 'Senior',
      steps: L(
        'Motors → sensors → basic ESP32 logic → testing → simple autonomous functions',
        'Motorer → sensorer → grundläggande ESP32-logik → testning → enkla autonoma funktioner'
      ),
    },
    {
      name: 'GYM',
      steps: L(
        'ESP32 programming → sensors → motor control → line/maze concepts → debugging and autonomous robot development',
        'ESP32-programmering → sensorer → motorstyrning → linje-/labyrintkoncept → felsökning och utveckling av autonom robot'
      ),
    },
  ];

  const finalDay = [
    { time: L('Check-in', 'Incheckning'), minutes: 0, text: L('Teams check in → kits are handed over → official problem statement announced', 'Lagen checkar in → kit delas ut → den officiella uppgiften presenteras') },
    { time: '15 min', minutes: 15, text: L('Read the rules + team planning', 'Läs reglerna + planering i laget') },
    { time: '2 h', minutes: 120, text: L('Design, build, code and test', 'Designa, bygg, programmera och testa') },
    { time: '30 min', minutes: 30, text: L('Final testing / inspection', 'Sluttest / inspektion') },
    { time: '15 min', minutes: 15, text: L('Robot submitted to the competition area', 'Roboten lämnas till tävlingsområdet') },
  ];

  return (
    <div data-no-translate="true" className="w-full bg-white text-[#0A1930]">
      {/* ── 1. WELCOME TO IBK ── */}
      <section className="relative w-full min-h-[640px] lg:min-h-[min(100vh,960px)] flex items-end overflow-hidden bg-[#0A1930] text-white pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={ibkImage('ibk_hero.mp4')}
        />
        {/* Flat scrim keeps the headline readable over the video */}
        <div className="absolute inset-0 bg-[#0A1930]/60 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-5"
          >
            <Eyebrow light>{L('NON-PROFIT ASSOCIATION // VÄSTERÅS, SWEDEN', 'IDEELL FÖRENING // VÄSTERÅS, SVERIGE')}</Eyebrow>
            <h1
              className="font-headline font-black uppercase tracking-tight leading-[1.0]"
              style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.4rem)' }}
            >
              {L('Welcome to', 'Välkommen till')}
              <br />
              <span className="text-[#FFCD00]">Indisk Barnklubb</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
              {L(
                'IBK is a non-profit club in Västerås that fills the lives of children and youth with culture, creativity and community — and helps them find their place in Swedish society. We run cultural festivals, workshops and, this autumn, Västerås Future Innovators.',
                'IBK är en ideell förening i Västerås som fyller barns och ungdomars liv med kultur, kreativitet och gemenskap — och hjälper dem att hitta sin plats i det svenska samhället. Vi arrangerar kulturfestivaler, workshoppar och i höst Västerås Future Innovators.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('ibk#join')}
                className="px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <span>{L('Join IBK', 'Gå med i IBK')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('ibk#future-innovators')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <span>{L('Future Innovators 2026', 'Future Innovators 2026')}</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 grid grid-cols-2 gap-2"
          >
            {[
              { label: L('Cultural festivals', 'Kulturfestivaler'), value: 'MKM' },
              { label: L('Science & robotics', 'Teknik & robotik'), value: 'VFI 2026' },
              { label: L('For', 'För'), value: L('Children & youth', 'Barn & unga') },
              { label: L('Based in', 'Hemort'), value: 'Västerås' },
            ].map((f) => (
              <div key={f.label} className="p-3.5 bg-[#0A1930]/70 border border-white/15">
                <div className="text-[9px] font-mono-code font-bold uppercase tracking-widest text-white/55">{f.label}</div>
                <div className="font-headline font-black text-base uppercase mt-0.5">{f.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. UPCOMING ACTIVITIES ── */}
      <section id="activities" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <h2
              className="font-headline font-black uppercase tracking-tight leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              {L('Upcoming events', 'Kommande evenemang')}
            </h2>
            <h4 className="mt-2 font-headline font-bold text-base sm:text-lg uppercase tracking-wide text-[#006AA7]">
              {L('Upcoming activities', 'Kommande aktiviteter')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcoming.map((a) => (
              <div key={a.title} className="border border-slate-200 bg-[#F8FAFC] p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono-code font-bold uppercase text-[#006AA7]">
                    <a.icon className="w-4 h-4" />
                    <span>{a.when}</span>
                  </div>
                  <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight">{a.title}</h3>
                  <p className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{a.where}</span>
                  </p>
                </div>
                <button
                  onClick={a.action.go}
                  className="self-start text-[11px] font-mono-code font-bold uppercase text-[#006AA7] hover:underline inline-flex items-center gap-1"
                >
                  {a.action.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FUTURE INNOVATORS (DEDICATED SECTION) ── */}
      <section
        id="future-innovators"
        className="w-full bg-[#006AA7] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20"
      >
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <Eyebrow light>{L('AN IBK PROGRAMME // AUTUMN 2026', 'ETT IBK-PROGRAM // HÖSTEN 2026')}</Eyebrow>
              <h2
                className="font-headline font-black uppercase tracking-tight leading-[1.0]"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
              >
                Västerås Future Innovators 2026
              </h2>
              <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-2xl">
                {L(
                  'Hands-on robotics (RoboKidovation) and a youth innovation challenge (Young Inno Hack) for children from schools, associations and independent teams. No previous experience needed.',
                  'Praktisk robotik (RoboKidovation) och en innovationsutmaning för unga (Young Inno Hack) för barn från skolor, föreningar och fristående lag. Inga förkunskaper behövs.'
                )}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="px-5 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <span>{L('Register School, Association or Team', 'Registrera skola, förening eller lag')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('future-innovators')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-syne font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <span>{L('Programme details', 'Om programmet')}</span>
              </button>
            </div>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* Who can join */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={Users} title={L('Who can join', 'Vem kan delta')} />
              <div className="p-5 space-y-5 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#006AA7]">
                    <Bot className="w-3.5 h-3.5" /> RoboKidovation
                  </div>
                  <ul className="space-y-1.5">
                    {ROBOKIDO_CATEGORIES.map((c, i) => (
                      <li key={c.name} className="flex items-center gap-3 p-2 bg-[#F2F6FA] border-l-4 border-[#006AA7]">
                        <span className={`w-16 shrink-0 text-center text-[11px] font-mono-code font-bold uppercase py-1 ${CATEGORY_TONES[i]}`}>
                          {c.name.replace('RoboKido ', '')}
                        </span>
                        <span className="text-sm font-bold flex-1">{sv ? c.grades.sv : c.grades.en}</span>
                        <span className="text-[11px] text-slate-500">{sv ? c.level.sv : c.level.en}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3 p-2 border border-dashed border-slate-300">
                      <span className="w-16 shrink-0 text-center text-[11px] font-mono-code font-bold uppercase py-1 bg-slate-100 text-slate-600">
                        {L('Gr 1–2', 'Åk 1–2')}
                      </span>
                      <span className="text-sm flex-1">{sv ? PARTICIPANT_CATEGORY.name.sv : PARTICIPANT_CATEGORY.name.en}</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#059669]">
                    <Lightbulb className="w-3.5 h-3.5" /> {L('Hackathon', 'Hackathon')}
                  </div>
                  <ol className="space-y-1.5">
                    {HACKATHON_LEVELS.map((h, i) => (
                      <li key={h.level.en} className="flex items-center gap-3 p-2 bg-[#F0FDF4] border-l-4 border-[#059669]">
                        <span className="w-6 h-6 shrink-0 bg-[#059669] text-white text-xs font-mono-code font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm font-bold flex-1">{sv ? h.who.sv : h.who.en}</span>
                        <span className="text-[11px] text-slate-500">{sv ? h.level.sv : h.level.en}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={Calendar} title={L('Timeline', 'Tidslinje')} />
              <ol className="p-5 flex-1 relative">
                <span className="absolute left-[29px] top-7 bottom-7 w-px bg-slate-200" aria-hidden="true" />
                {VFI_TIMELINE.map((step, i) => {
                  const last = i === VFI_TIMELINE.length - 1;
                  return (
                    <li key={step.en} className="relative flex items-center gap-3 py-2">
                      <span
                        className={`relative z-10 w-5 h-5 shrink-0 flex items-center justify-center text-[10px] font-mono-code font-bold ${
                          last ? 'bg-[#FFCD00] text-[#0A1930]' : 'bg-[#006AA7] text-white'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm ${last ? 'font-black uppercase' : ''}`}>{sv ? step.sv : step.en}</span>
                      <span
                        className={`font-mono-code text-[11px] font-bold whitespace-nowrap px-2 py-0.5 ${
                          last ? 'bg-[#0A1930] text-[#FFCD00]' : 'bg-[#F2F6FA] text-[#006AA7]'
                        }`}
                      >
                        {sv ? step.date.sv : step.date.en}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Qualification & venue */}
            <div className="bg-white text-[#0A1930] flex flex-col">
              <CardHeader icon={MapPin} title={L('Qualification & venue', 'Kval och plats')} />
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                <div className="border border-slate-200 flex flex-col">
                  <div className="h-36 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-center p-3">
                    <img src="/venue.png" alt={VFI_FACTS.roboFinalVenue.full} loading="lazy" className="max-h-full w-auto object-contain" />
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <DateBadge />
                    <div>
                      <div className="text-[11px] font-mono-code font-bold uppercase text-[#006AA7]">
                        {L('RoboKidovation Final', 'RoboKidovation-final')}
                      </div>
                      <div className="text-sm font-bold leading-snug">{VFI_FACTS.roboFinalVenue.full}</div>
                    </div>
                  </div>
                </div>
                <div className="border border-dashed border-[#059669] p-3 flex items-start gap-3">
                  <DateBadge green />
                  <div>
                    <div className="text-[11px] font-mono-code font-bold uppercase text-[#059669]">Young Inno Hack</div>
                    <div className="text-sm font-bold leading-snug">{sv ? VFI_FACTS.hackVenue.sv : VFI_FACTS.hackVenue.en}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. JOIN IBK ── */}
      <section id="join" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <Eyebrow>{L('GET INVOLVED', 'ENGAGERA DIG')}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{L('Join IBK', 'Gå med i IBK')}</h2>
          </div>

          {/* Why join: one intro card, then the benefits three per row */}
          <div className="bg-[#0A1930] text-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex md:justify-center">
              <img src={IBK_LOGO} alt="Indisk Barnklubb (IBK)" className="h-20 w-auto object-contain bg-white p-2" />
            </div>
            <div className="md:col-span-7 space-y-2">
              <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
                {L('Why join Indisk Barnklubb (IBK)?', 'Varför gå med i Indisk Barnklubb (IBK)?')}
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                {L(
                  'IBK welcomes children and families from all cultures and backgrounds — you don’t need to be Indian to join!',
                  'IBK välkomnar barn och familjer från alla kulturer och bakgrunder — du behöver inte vara indier för att gå med!'
                )}
              </p>
              <p className="text-sm font-bold text-[#FFCD00]">
                {L(
                  'Celebrating cultures, inspiring young minds and growing together.',
                  'Vi firar kulturer, inspirerar unga och växer tillsammans.'
                )}
              </p>
            </div>
            <div className="md:col-span-3 md:text-right">
              <a
                href={MEMBERSHIP_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex btn-pill-lime text-xs font-black py-3 px-5 items-center gap-2"
              >
                <span>{L('Membership form', 'Medlemsformulär')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="border border-slate-200 bg-[#F8FAFC] p-5 flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 bg-[#006AA7] text-white flex items-center justify-center">
                  <b.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-black text-base uppercase tracking-tight">{b.title}</h4>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">{b.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinOptions.map((o) => {
              const btnCls =
                'self-start btn-pill-lime text-xs font-black py-3 px-5 inline-flex items-center gap-2';
              return (
                <div key={o.title} className="border-2 border-slate-200 p-6 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                        <o.icon className="w-6 h-6" />
                      </div>
                      <img src={IBK_LOGO} alt="IBK" className="h-10 w-auto object-contain" />
                    </div>
                    <h3 className="font-headline font-black text-xl uppercase tracking-tight">{o.title}</h3>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{o.text}</p>
                  </div>
                  {o.href ? (
                    <a href={o.href} target="_blank" rel="noopener noreferrer" className={btnCls}>
                      <span>{o.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button onClick={o.go} className={btnCls}>
                      <span>{o.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. ROBOKIDOVATION 2026: CATEGORIES, TEAMS, PREPARATION, FINAL DAY, PAYMENT ── */}
      <section id="robokidovation" className="w-full bg-white border-t border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div>
            <Eyebrow>{L('ROBOKIDOVATION 2026', 'ROBOKIDOVATION 2026')}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">
              {L('Categories, teams & final day', 'Kategorier, lag och finaldag')}
            </h2>
          </div>

          {/* Categories */}
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-sm text-left min-w-[560px]">
              <thead className="bg-[#0A1930] text-white text-[11px] font-mono-code uppercase tracking-wider">
                <tr>
                  <th className="p-3">{L('Category', 'Kategori')}</th>
                  <th className="p-3">{L('Grades', 'Årskurs')}</th>
                  <th className="p-3">{L('Main focus', 'Huvudfokus')}</th>
                  <th className="p-3">{L('Coding', 'Programmering')}</th>
                </tr>
              </thead>
              <tbody>
                {ROBOKIDO_CATEGORIES.map((c) => (
                  <tr key={c.name} className="border-t border-slate-200">
                    <td className="p-3 font-bold">{c.name}</td>
                    <td className="p-3">{sv ? c.grades.sv : c.grades.en}</td>
                    <td className="p-3 text-slate-600">{sv ? c.focus.sv : c.focus.en}</td>
                    <td className="p-3">{sv ? c.coding.sv : c.coding.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Team rules */}
            <div className="border-2 border-slate-200 flex flex-col">
              <PanelHeader icon={Users} title={L('Teams', 'Lag')} />
              <div className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { big: '4–5', small: L('participants per team', 'deltagare per lag') },
                    { big: L('Team / solo', 'Lag / enskild'), small: L('registration', 'anmälan') },
                    { big: L('Nov wk 1', 'Nov v. 1'), small: L('teams formed', 'lagen bildas') },
                  ].map((t) => (
                    <div key={t.small} className="bg-[#F2F6FA] border-t-4 border-[#006AA7] p-3">
                      <div className="font-headline font-black text-lg sm:text-xl leading-none">{t.big}</div>
                      <div className="text-[10px] font-mono-code font-bold uppercase text-slate-500 mt-1">{t.small}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#006AA7] mb-2">
                    {L('Rotating team roles', 'Roterande roller i laget')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TEAM_ROLES.map((r) => (
                      <span key={r.en} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A1930] text-white text-xs font-bold">
                        <r.icon className="w-3.5 h-3.5 text-[#FFCD00]" />
                        {sv ? r.sv : r.en}
                      </span>
                    ))}
                  </div>
                </div>

                <ol className="space-y-2.5">
                  {teamRules.map((r, i) => (
                    <li key={r} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 shrink-0 bg-[#FFCD00] text-[#0A1930] text-[11px] font-mono-code font-bold flex items-center justify-center">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="pt-0.5">{r}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="space-y-6">
              {/* Before the final */}
              <div className="border-2 border-slate-200">
                <PanelHeader icon={Code2} title={L('Before the Final', 'Före finalen')} />
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { big: '3 h', small: L('guided preparation', 'handledd förberedelse') },
                      { big: '2 × 90', small: L('minute workshops', 'minuters workshoppar') },
                      { big: L('Pick', 'Välj'), small: L('your workshop slot', 'er workshoptid') },
                    ].map((t) => (
                      <div key={t.small} className="bg-[#F2F6FA] border-t-4 border-[#006AA7] p-3">
                        <div className="font-headline font-black text-lg sm:text-xl leading-none">{t.big}</div>
                        <div className="text-[10px] font-mono-code font-bold uppercase text-slate-500 mt-1">{t.small}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700">
                    {L(
                      'Each participant gets 3 hours of guided preparation, preferably as 2 × 90-minute workshops. Several workshop slots are opened so teams can choose suitable times. The workshops teach the skills but do not reveal the final competition problem.',
                      'Varje deltagare får 3 timmars handledd förberedelse, helst som 2 × 90-minuters workshoppar. Flera workshoptider öppnas så att lagen kan välja passande tider. Workshopparna lär ut färdigheterna men avslöjar inte finaluppgiften.'
                    )}
                  </p>
                  <ul className="space-y-2">
                    {prepPaths.map((pth, i) => (
                      <li key={pth.name} className="flex items-stretch border border-slate-200">
                        <span className={`w-20 shrink-0 flex items-center justify-center text-xs font-mono-code font-bold uppercase ${CATEGORY_TONES[i]}`}>
                          {pth.name}
                        </span>
                        <div className="p-2.5 flex flex-wrap items-center gap-1.5">
                          {pth.steps.split(' → ').map((step, j, all) => (
                            <React.Fragment key={step}>
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
                <PanelHeader icon={Timer} title={L('Final-day format', 'Finaldagens upplägg')} badge="T – 3 h" />
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-slate-700">
                    {L(
                      'The challenge is given only on competition day. Teams have 3 hours from check-in to submission.',
                      'Uppgiften ges först på tävlingsdagen. Lagen har 3 timmar från incheckning till inlämning.'
                    )}
                  </p>
                  {/* Proportional bar of the 3 hours */}
                  <div className="flex h-9 text-[10px] font-mono-code font-bold uppercase" aria-hidden="true">
                    {finalDay
                      .filter((f) => f.minutes)
                      .map((f, i) => (
                        <div
                          key={f.text}
                          style={{ flexGrow: f.minutes }}
                          className={`flex items-center justify-center border-r border-white last:border-r-0 ${FINAL_DAY_TONES[i]}`}
                        >
                          {f.time}
                        </div>
                      ))}
                  </div>
                  <ol className="space-y-0">
                    {finalDay.map((f, i) => (
                      <li key={f.text} className="flex gap-3 items-start py-2 border-b border-slate-100 last:border-0">
                        <span className="w-6 h-6 shrink-0 bg-[#0A1930] text-[#FFCD00] text-[11px] font-mono-code font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="w-16 shrink-0 font-mono-code text-xs font-bold text-[#006AA7] pt-1">{f.time}</span>
                        <span className="text-sm pt-0.5">{f.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Participation fees & payment */}
          <ParticipationFees />
        </div>
      </section>

      {/* ── 6. PHOTOS & COMMUNITY STORIES ── */}
      <section id="stories" className="w-full bg-[#F8FAFC] border-y border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div>
            <Eyebrow>{L('PHOTOS & COMMUNITY STORIES', 'BILDER & BERÄTTELSER')}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">
              {L('From our community', 'Från vår gemenskap')}
            </h2>
          </div>

          {/* Story: RoboKidovation workshops, 2 October */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white border border-slate-200 p-5 sm:p-8">
            <div className="lg:col-span-4">
              <img
                src={ibkImage('ibk-vfi.png')}
                alt={L(
                  'Västerås Future Innovators introductory workshop poster, 2 October 2026',
                  'Affisch för Västerås Future Innovators introduktionsworkshop, 2 oktober 2026'
                )}
                loading="lazy"
                className="w-full h-auto border border-slate-200"
              />
            </div>
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500">
                {L('Friday 2 October 2026', 'Fredag 2 oktober 2026')}
              </span>
              <h3 className="font-headline font-black text-2xl uppercase tracking-tight">
                {L('RoboKidovation workshops on Gandhi Jayanti', 'RoboKidovation-workshoppar på Gandhi Jayanti')}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {L(
                  'IBK invited young innovators to explore robotics, science and technology at three sessions across Västerås, including an open session at ABF for children aged 7+ and their parents.',
                  'IBK bjöd in unga innovatörer att utforska robotik, naturvetenskap och teknik på tre tillfällen i Västerås, bland annat en öppen session på ABF för barn från 7 år och deras föräldrar.'
                )}
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {WORKSHOP_SCHEDULE.map((w) => (
                  <li key={w.place} className="p-3 border border-slate-200 bg-[#F8FAFC] text-sm">
                    <div className="font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#006AA7]" />
                      {w.place}
                    </div>
                    <div className="font-mono-code text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#006AA7]" />
                      {w.time}
                    </div>
                    {w.note && <div className="text-xs text-[#006AA7] font-bold mt-1">{sv ? w.note.sv : w.note.en}</div>}
                  </li>
                ))}
              </ol>
              <a
                href={TEAM_REGISTRATION_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase text-[#006AA7] hover:underline"
              >
                {L('Team registration form', 'Formulär för laganmälan')}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>

          {/* Story: MKM Fusion X */}
          <article className="bg-white border border-slate-200 p-5 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500">
                  {L('29 August 2026 · Stora Torget, Västerås', '29 augusti 2026 · Stora Torget, Västerås')}
                </span>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight">MKM Fusion X – {L('Season 3', 'säsong 3')}</h3>
              </div>
              <span className="text-[11px] font-mono-code font-bold uppercase px-3 py-1.5 bg-[#0A1930] text-[#FFCD00]">
                {L('Free entry · One stage, many cultures', 'Fri entré · En scen, många kulturer')}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-light leading-relaxed max-w-3xl">
              {L(
                'One of Västerås’ largest multicultural festivals brought people from many cultures, nationalities and backgrounds together on one stage to share music, dance, art and traditions.',
                'En av Västerås största mångkulturella festivaler samlade människor från många kulturer, nationaliteter och bakgrunder på en scen för att dela musik, dans, konst och traditioner.'
              )}
            </p>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {MKM_HIGHLIGHTS.map((item) => (
                <li key={item.en} className="flex items-center gap-2 p-3 border border-slate-200 text-sm">
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="text-slate-700">{sv ? item.sv : item.en}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ── 7. PARTNERS ── */}
      <section id="partners" className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <Eyebrow>{L('PARTNERS', 'PARTNER')}</Eyebrow>
            <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">
              {L('Working together', 'Vi samarbetar med')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTNER_LOGOS.filter((logo) => !logo.name.startsWith('Indisk')).map((logo) => (
              <div key={logo.name} className="border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 text-center">
                <img src={logo.file} alt={logo.name} loading="lazy" className="h-12 w-auto object-contain" />
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500">{logo.role}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono-code font-bold uppercase text-slate-500">
            {L(
              'Future Innovators workshops are run in collaboration with MISV and ABF Västerås.',
              'Future Innovators-workshopparna genomförs i samarbete med MISV och ABF Västerås.'
            )}
          </p>
        </div>
      </section>

      {/* ── 8. CONTACT ── */}
      <section id="contact" className="w-full bg-[#0A1930] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Eyebrow light>{L('CONTACT US', 'KONTAKTA OSS')}</Eyebrow>
              <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">{L('Get in touch', 'Hör av dig')}</h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={`mailto:${IBK_EMAIL}`} className="p-4 border border-white/20 hover:border-[#FFCD00] transition-colors flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#FFCD00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono-code font-bold uppercase text-white/55">{L('Email', 'E-post')}</div>
                  <div className="text-sm font-bold break-all">{IBK_EMAIL}</div>
                </div>
              </a>
              <a href="tel:+46761692757" className="p-4 border border-white/20 hover:border-[#FFCD00] transition-colors flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#FFCD00] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono-code font-bold uppercase text-white/55">{L('Mobile', 'Mobil')}</div>
                  <div className="text-sm font-bold">Richa · 0761692757</div>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-black text-lg uppercase tracking-tight">
              {L('Our board – 2026', 'Vår styrelse – 2026')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {BOARD.map((m) => (
                <div key={m.name} className="bg-white text-[#0A1930]">
                  <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
                    <img src={m.photo} alt={m.name} loading="lazy" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-[11px] font-mono-code uppercase text-[#006AA7]">{sv ? m.role.sv : m.role.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
