import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_EMAIL, TEAM_CONTACTS, initials } from '../data/teamContacts';

const TEXT = {
  en: {
    eyebrow: 'INIAC TEAM',
    title: 'Contact us',
    lead: 'Questions about the programme, your school or working together? Write to us, or reach the person nearest you.',
    write: 'Email us',
    linkedin: 'on LinkedIn',
  },
  sv: {
    eyebrow: 'INIAC-TEAMET',
    title: 'Kontakta oss',
    lead: 'Frågor om programmet, er skola eller samarbete? Skriv till oss, eller kontakta den som är närmast dig.',
    write: 'Mejla oss',
    linkedin: 'på LinkedIn',
  },
};

/** "Contact us": the general address and the INIAC team, above the footer of every page (not IBK's). */
export const TeamContact: React.FC = () => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const t = sv ? TEXT.sv : TEXT.en;
  return (
    <section id="contact-us" aria-labelledby="contact-us-title" className="w-full scroll-mt-24 border-t border-[#0A1930]/10 bg-[#F4F7FB] px-3 py-14 text-[#0A1930] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="font-mono-code text-[11px] font-bold tracking-widest text-[#013A63]">{t.eyebrow}</span>
            <h2 id="contact-us-title" className="mt-1 font-headline text-3xl font-black uppercase tracking-tight sm:text-4xl">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{t.lead}</p>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-12 items-center gap-2.5 self-start bg-[#0A1930] px-5 font-headline text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#013A63] md:self-auto">
            <Mail className="h-4 w-4 text-[#FFCD00]" aria-hidden="true" /> {t.write}: <span className="normal-case">{CONTACT_EMAIL}</span>
          </a>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_CONTACTS.map((p) => (
            <li key={p.name} className="flex items-center gap-4 border border-[#0A1930]/10 bg-white p-4">
              {p.photo
                ? <img src={p.photo} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
                : <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0A1930] font-headline text-lg font-black text-[#FFCD00]">{initials(p.name)}</span>}
              <div className="min-w-0 flex-1">
                <p className="font-headline font-bold leading-snug">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#013A63]" aria-hidden="true" /> {sv ? p.place.sv : p.place.en}
                </p>
                {p.email && (
                  <a href={`mailto:${p.email}`} className="mt-1 block truncate text-sm font-semibold text-[#013A63] hover:underline">{p.email}</a>
                )}
              </div>
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} ${t.linkedin}`}
                  className="grid h-10 w-10 shrink-0 place-items-center border border-[#0A1930]/15 text-[#013A63] transition-colors hover:bg-[#0A1930] hover:text-[#FFCD00]">
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
