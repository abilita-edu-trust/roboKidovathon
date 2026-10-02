import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Ticket, Sparkles, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface IbkPageProps {
  onNavigateHome: () => void;
}

const ibkImage = (file: string) => `/ibk/${encodeURIComponent(file)}`;

type BoardMember = { name: string; role: { en: string; sv: string }; photo: string | null };

const BOARD: BoardMember[] = [
  { name: 'Richa Nautiyal', role: { en: 'Chairman', sv: 'Ordförande' }, photo: ibkImage('Richa Nautiyal, Chairman.png') },
  { name: 'Poonam Shenoy', role: { en: 'Deputy Chairman', sv: 'Vice ordförande' }, photo: ibkImage('Poonam Shenoy, Deputy Chairman.jpeg') },
  { name: 'Sandhya Acharya', role: { en: 'Secretary', sv: 'Sekreterare' }, photo: ibkImage('Sandhya Acharya, Secretary.jpeg') },
  { name: 'Radha', role: { en: 'Deputy Secretary', sv: 'Vice sekreterare' }, photo: ibkImage('Radha, Deputy Secretary.jpeg') },
  { name: 'Priyanka Eti', role: { en: 'Treasurer', sv: 'Kassör' }, photo: ibkImage('Priyanka Eti – Treasurer Srushti – Deputy Treasurer.jpg') },
  { name: 'Srushti', role: { en: 'Deputy Treasurer', sv: 'Vice kassör' }, photo: ibkImage('last pic.jpeg') },
];

const EXPECT: { icon: string; en: string; sv: string }[] = [
  { icon: '🌍', en: 'Grand multicultural stage performances', sv: 'Stora mångkulturella scenframträdanden' },
  { icon: '💃', en: 'Inter-city dance championship', sv: 'Dansmästerskap mellan städer' },
  { icon: '🎤', en: 'Music and cultural performances', sv: 'Musik och kulturella framträdanden' },
  { icon: '🍛', en: 'International food stalls', sv: 'Internationella matstånd' },
  { icon: '🛍️', en: 'Handicraft, jewellery, and cultural market', sv: 'Hantverk, smycken och kulturmarknad' },
  { icon: '🎈', en: "Children's activities and family entertainment", sv: 'Aktiviteter för barn och underhållning för hela familjen' },
  { icon: '🤝', en: 'Community organizations and cultural associations', sv: 'Föreningar och kulturföreningar' },
  { icon: '🎉', en: 'A full-day celebration of diversity and inclusion', sv: 'En heldag som firar mångfald och inkludering' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const IbkPage: React.FC<IbkPageProps> = ({ onNavigateHome }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);

  const facts = [
    { icon: Calendar, label: L('Date & Time', 'Datum och tid'), value: L('29 August 2026 · from 11:00', '29 augusti 2026 · från kl. 11:00') },
    { icon: MapPin, label: L('Location', 'Plats'), value: 'Stora Torget, Västerås' },
    { icon: Ticket, label: L('Entry', 'Entré'), value: L('Free', 'Fri entré') },
    { icon: Sparkles, label: L('Theme', 'Tema'), value: L('One Stage • Many Cultures • Endless Celebrations', 'En scen • Många kulturer • Oändliga firanden') },
  ];

  return (
    <div data-no-translate="true" className="w-full min-h-screen bg-white text-[#0A1930] pt-28 pb-24 px-3 sm:px-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-16">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{L('BACK TO HOME', 'TILLBAKA TILL START')}</span>
        </motion.button>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-slate-200 pb-12"
        >
          <span className="text-[10px] font-mono-code font-medium tracking-[0.2em] text-slate-500 uppercase block mb-3">
            {L('NON-PROFIT ORGANIZATION // VÄSTERÅS, SWEDEN', 'IDEELL FÖRENING // VÄSTERÅS, SVERIGE')}
          </span>
          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
          >
            <span className="text-stroke block">INDISK</span>
            <span className="text-[#0A1930] block">BARNKLUBB (IBK)</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            {L(
              'Filling the lives of children and youth in Västerås with cultural fun — and helping them groove into Swedish society.',
              'Vi fyller barns och ungdomars liv i Västerås med kulturell glädje — och hjälper dem att hitta sin plats i det svenska samhället.'
            )}
          </p>
        </motion.div>

        {/* ── OUR WORKS: MKM FUSION X 2026 ── */}
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
                {L('OUR WORKS', 'VÅRA ARBETEN')}
              </span>
              <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">
                MKM Fusion X – 2026
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {L('MKM Season 3 at Stora Torget, Västerås', 'MKM säsong 3 på Stora Torget, Västerås')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase px-3 py-1.5 bg-[#0A1930] text-[#FFCD00]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {L('Held 29 August 2026', 'Genomfördes 29 augusti 2026')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="p-4 bg-[#F8FAFC] border border-slate-200">
                <div className="flex items-center gap-2 text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  <f.icon className="w-3.5 h-3.5 text-[#006AA7]" />
                  {f.label}
                </div>
                <div className="text-sm font-bold text-[#0A1930] leading-snug">{f.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-headline font-black text-xl uppercase tracking-tight">
                {L('About the Event', 'Om evenemanget')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                {L(
                  "Indisk Barnklubb (IBK) proudly presented MKM Season 3, one of Västerås' largest multicultural festivals celebrating diversity, talent, and community. The festival brought together people from different cultures, nationalities, and backgrounds on one grand stage to showcase music, dance, art, and traditions from around the world.",
                  'Indisk Barnklubb (IBK) presenterade stolt MKM säsong 3, en av Västerås största mångkulturella festivaler som hyllar mångfald, talang och gemenskap. Festivalen samlade människor från olika kulturer, nationaliteter och bakgrunder på en stor scen för att visa musik, dans, konst och traditioner från hela världen.'
                )}
              </p>
            </div>
            <div className="lg:col-span-7">
              <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-4">
                {L('What the Festival Offered', 'Vad festivalen bjöd på')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXPECT.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 p-3 border border-slate-200 bg-white text-sm">
                    <span className="text-lg leading-none">{item.icon}</span>
                    <span className="text-slate-700">{sv ? item.sv : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── ABOUT US ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-200 pt-12">
          <div className="lg:col-span-4">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
              {L('ABOUT US', 'OM OSS')}
            </span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">
              {L('Welcome to Indisk Barnklubb', 'Välkommen till Indisk Barnklubb')}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            <p>
              {L(
                "Welcome to Indisk Barnklubb in Västerås, Sweden! We're a lively non-profit organization dedicated to filling the lives of children and youth with cultural fun and helping them groove into Swedish society.",
                'Välkommen till Indisk Barnklubb i Västerås! Vi är en livfull ideell förening som vill fylla barns och ungdomars liv med kulturell glädje och hjälpa dem att hitta sin plats i det svenska samhället.'
              )}
            </p>
            <p>
              {L(
                "Our mission is to create a vibrant playground where kids and teens can dive into their heritage through epic events, creative workshops, and dazzling cultural performances. We're all about building a tight-knit community, making lifelong buddies, and having a blast while promoting cultural exchange.",
                'Vårt mål är att skapa en levande mötesplats där barn och tonåringar kan upptäcka sitt kulturarv genom fantastiska evenemang, kreativa workshoppar och bländande kulturella framträdanden. Vi bygger en sammansvetsad gemenskap, skapar livslånga vänskaper och har roligt samtidigt som vi främjar kulturellt utbyte.'
              )}
            </p>
          </div>
        </section>

        {/* ── BOARD ── */}
        <section className="border-t border-slate-200 pt-12 space-y-6">
          <div>
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
              {L('OUR BOARD – 2026', 'VÅR STYRELSE – 2026')}
            </span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">
              {L('The People Behind IBK', 'Människorna bakom IBK')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BOARD.map((m) => (
              <div key={m.name} className="border border-slate-200 bg-white">
                <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0A1930] text-[#FFCD00] font-headline font-black text-4xl">
                      {initials(m.name)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-[#0A1930]">{m.name}</div>
                  <div className="text-[11px] font-mono-code uppercase text-[#006AA7]">{sv ? m.role.sv : m.role.en}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="border-t border-slate-200 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
              {L('CONTACT US', 'KONTAKTA OSS')}
            </span>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tight">
              {L('Get in Touch', 'Hör av dig')}
            </h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="mailto:vasteras@indiskbarnklubb.se"
              className="p-4 border border-slate-200 bg-[#F8FAFC] hover:border-[#006AA7] transition-colors flex items-start gap-3"
            >
              <Mail className="w-5 h-5 text-[#006AA7] shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-mono-code font-bold uppercase text-slate-500">{L('Email', 'E-post')}</div>
                <div className="text-sm font-bold text-[#0A1930] break-all">vasteras@indiskbarnklubb.se</div>
              </div>
            </a>
            <a
              href="tel:+46761692757"
              className="p-4 border border-slate-200 bg-[#F8FAFC] hover:border-[#006AA7] transition-colors flex items-start gap-3"
            >
              <Phone className="w-5 h-5 text-[#006AA7] shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-mono-code font-bold uppercase text-slate-500">
                  {L('Mobile / Vendor Enquiries', 'Mobil / Förfrågningar från utställare')}
                </div>
                <div className="text-sm font-bold text-[#0A1930]">Richa · 0761692757</div>
              </div>
            </a>
          </div>
        </section>

        <p className="text-[11px] font-mono-code text-slate-400 text-center border-t border-slate-100 pt-6">
          © 2026 Indisk Barnklubb - Västerås
        </p>
      </div>
    </div>
  );
};
