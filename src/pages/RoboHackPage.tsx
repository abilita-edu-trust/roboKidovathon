import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Check, MapPin } from 'lucide-react';
import { Eyebrow, Section, SectionTitle } from '../components/city/CitySections';
import { fill } from '../content/core';
import { useT } from '../content/useT';
import { siteIcon } from '../content/icons';
import { hasLabel } from '../content/sections/frame';
import type {
  RhAboutData, RhChallengesData, RhEventData, RhPartnersData, RhProblemData, RhProgrammesData, RhTracksData,
} from '../content/sections/robohack';

// The RoboHack event sections (vxo.iniac.se); each reads its content from the Site CMS.

interface Props<D> {
  data: D;
  go: (href: string) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

/** "A → B → C" as a row of chips. */
const Flow: React.FC<{ items: string[]; light?: boolean }> = ({ items, light }) => (
  <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-center gap-2">
        <span
          className={`text-[13px] sm:text-sm font-mono-code font-bold uppercase tracking-wide px-3 py-2 ${
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

const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-no-translate="true" className="w-full bg-white text-[#0A1930]">
    {children}
  </div>
);

export const RoboHackAbout: React.FC<Props<RhAboutData>> = ({ data }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <Eyebrow>{t(data.eyebrow)}</Eyebrow>
            <SectionTitle>{t(data.title)}</SectionTitle>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(data.intro)}</p>
        </div>
        <Flow items={data.flow.map(t)} />
      </Section>
    </Wrap>
  );
};

export const RoboHackProblem: React.FC<Props<RhProblemData>> = ({ data, go }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="problem" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow>{t(data.eyebrow)}</Eyebrow>
            <SectionTitle>{t(data.title)}</SectionTitle>
            <p className="font-headline font-bold text-lg sm:text-xl text-[#006AA7]">{t(data.question)}</p>
          </div>
          <div className="lg:col-span-5 space-y-3 lg:pt-10">
            {data.body.map((p, i) => (
              <p key={i} className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(p)}</p>
            ))}
          </div>
        </div>
        <Flow items={data.flow.map(t)} />

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {data.cards.map((card, i) => {
            const Icon = siteIcon(card.icon);
            return (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="bg-white border border-slate-200 p-5 flex flex-col gap-3">
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
            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#006AA7] block">{t(data.ideasTitle)}</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {data.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#0A1930]">
                  <Check className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                  <span>{t(idea)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 bg-[#0A1930] text-white p-5 sm:p-6 space-y-3">
            {data.closing.map((c, i) => (
              <p key={i} className={i === 0 ? 'font-headline font-black text-lg uppercase tracking-tight leading-snug' : 'text-sm text-white/80 font-light leading-relaxed'}>
                {t(c)}
              </p>
            ))}
            {hasLabel(data.button) && (
              <button type="button" onClick={() => go(data.button.href)} className={`${btnPrimary} w-full sm:w-auto mt-2`}>
                <span>{t(data.button.label)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Section>
    </Wrap>
  );
};

export const RoboHackEventSection: React.FC<Props<RhEventData>> = ({ data, go }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="event" tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow light>{t(data.eyebrow)}</Eyebrow>
            <SectionTitle>{t(data.title)}</SectionTitle>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">{t(data.intro)}</p>
          </div>
          <div className="lg:col-span-5 border border-white/15 bg-white/5 p-6 space-y-5">
            <div className="font-headline font-black text-3xl uppercase tracking-tight">{t(data.name)}</div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FFCD00]" />{t(data.venue)}</p>
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#FFCD00]" />{t(data.dates)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {hasLabel(data.registerButton) && (
                <button type="button" onClick={() => go(data.registerButton.href)} className={btnPrimary}>
                  <span>{t(data.registerButton.label)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {hasLabel(data.partnerButton) && (
                <button type="button" onClick={() => go(data.partnerButton.href)} className={btnGhostLight}>
                  <span>{t(data.partnerButton.label)}</span>
                </button>
              )}
            </div>
            <p className="text-[13px] font-mono-code font-bold uppercase tracking-widest text-white/60 pt-1 border-t border-white/10">
              {t(data.poweredByLabel)} {data.poweredBy}
            </p>
          </div>
        </div>
      </Section>
    </Wrap>
  );
};

export const RoboHackTracks: React.FC<Props<RhTracksData>> = ({ data, go }) => {
  const { t } = useT();
  const tracks = data.tracks;
  return (
    <Wrap>
      <Section id="tracks" tone="blue">
        <div className="space-y-3 text-center">
          <Eyebrow light>{t(data.eyebrow)}</Eyebrow>
          <SectionTitle>{t(data.title)}</SectionTitle>
        </div>

        <div className={`grid grid-cols-1 gap-4 items-stretch ${tracks.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {tracks.map((track, i) => {
            const Icon = siteIcon(track.icon);
            return (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="bg-[#0A1930] border border-white/10 flex flex-col">
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 bg-[#FFCD00] text-[#0A1930] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </span>
                    <div>
                      <h3 className="font-headline font-black text-2xl uppercase tracking-tight leading-none">{t(track.title)}</h3>
                      <p className="text-[13px] font-mono-code font-bold uppercase tracking-widest text-[#FFCD00] mt-1">{t(track.tagline)}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">{t(track.description)}</p>
                  {track.interests.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-white/50 block">
                        {t(data.interestsLabel)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {track.interests.map((tag, j) => (
                          <span key={j} className="text-xs font-mono-code font-bold text-white bg-white/10 border border-white/15 px-2.5 py-1 uppercase tracking-wide">
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {t(data.joinLabel) && (
                  <button
                    type="button"
                    onClick={() => go(data.joinHref)}
                    className="w-full px-6 py-3.5 bg-white/5 hover:bg-[#FFCD00] hover:text-[#0A1930] border-t border-white/10 text-white font-syne font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{fill(t(data.joinLabel), { track: t(track.title) }).join('')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </Section>
    </Wrap>
  );
};

export const RoboHackChallenges: React.FC<Props<RhChallengesData>> = ({ data }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="challenges" tone="gray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Eyebrow>{t(data.eyebrow)}</Eyebrow>
            <SectionTitle>{t(data.title)}</SectionTitle>
          </div>
          <p className="lg:col-span-5 lg:pt-10 text-sm sm:text-base text-slate-600 font-light leading-relaxed">{t(data.intro)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((c, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }} className="bg-white border border-slate-200 p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 bg-[#FFCD00] text-[#0A1930] font-headline font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight pt-1">{t(c.title)}</h3>
              </div>
              <p className="text-sm font-medium text-[#006AA7] leading-snug">{t(c.question)}</p>
              {c.examples.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 block">{t(data.examplesLabel)}</span>
                  <ul className="space-y-1.5">
                    {c.examples.map((ex, j) => (
                      <li key={j} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
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
          <p className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight leading-snug max-w-3xl">{t(data.closing)}</p>
          <Flow items={data.flow.map(t)} light />
        </div>
      </Section>
    </Wrap>
  );
};

export const RoboHackProgrammes: React.FC<Props<RhProgrammesData>> = ({ data }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="programmes">
        <div className="space-y-3">
          <Eyebrow>{t(data.eyebrow)}</Eyebrow>
          <SectionTitle>{t(data.title)}</SectionTitle>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.items.map((p, i) => (
            <div key={i} className={`p-6 sm:p-8 space-y-4 border ${i === 1 ? 'bg-[#0A1930] text-white border-[#0A1930]' : 'bg-[#F8FAFC] border-slate-200'}`}>
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tight">{t(p.name)}</h3>
                <p className={`text-[13px] font-mono-code font-bold uppercase tracking-widest mt-1 ${i === 1 ? 'text-[#FFCD00]' : 'text-[#006AA7]'}`}>{t(p.audience)}</p>
              </div>
              <p className={`text-sm sm:text-base font-light leading-relaxed ${i === 1 ? 'text-white/80' : 'text-slate-600'}`}>{t(p.description)}</p>
              <Flow items={p.flow.map(t)} light={i === 1} />
            </div>
          ))}
        </div>
      </Section>
    </Wrap>
  );
};

export const RoboHackPartners: React.FC<Props<RhPartnersData>> = ({ data, go }) => {
  const { t } = useT();
  return (
    <Wrap>
      <Section id="partners" tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-4">
            <Eyebrow light>{t(data.eyebrow)}</Eyebrow>
            <SectionTitle>{t(data.title)}</SectionTitle>
            {hasLabel(data.button) && (
              <button type="button" onClick={() => go(data.button.href)} className={`${btnPrimary} w-full sm:w-auto mt-2`}>
                <span>{t(data.button.label)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="lg:col-span-6 space-y-3">
            <p className="text-sm sm:text-base text-white/80 font-light">{t(data.intro)}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.ways.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-white/5 border border-white/10 px-4 py-3 text-sm">
                  <Check className="w-4 h-4 text-[#FFCD00] shrink-0 mt-0.5" />
                  <span>{t(w)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </Wrap>
  );
};
