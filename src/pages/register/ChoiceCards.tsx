// vfi and IBK's selection cards for the register wizard and its forms. A card takes the colour of its programme when
// chosen: RoboKidovation's Swedish blue, Future InnoHack's navy with the yellow accent. Not chosen, it stays neutral.
// (Riga, Eskilstuna and Växjö keep the earlier card, ./ClassicChoiceCard.) Single choices are a radio group (arrow keys move and choose,
// Space or Enter chooses, the chosen card is announced as checked); a check mark or a number shows the choice
// without relying on colour.
import React, { createContext, useContext, useRef } from 'react';
import { Check, Lock, type LucideIcon } from 'lucide-react';

export type Accent = 'robo' | 'hack';

/** The accent of the programme being registered for (vfi and IBK's wizard); forms' chips read it. None: the earlier look. */
export const AccentContext = createContext<Accent | undefined>(undefined);
export const useAccent = () => useContext(AccentContext);

/** Tailwind classes per accent (the site's tokens: --se-blue, and --se-ink with --se-yellow). */
export const ACCENTS: Record<Accent, { on: string; tick: string; icon: string; focus: string; bar: string; chipOn: string }> = {
  robo: {
    on: 'border-[#006AA7] shadow-[inset_0_0_0_1px_#006AA7] bg-[#EEF5FC]',
    tick: 'bg-[#006AA7] border-[#006AA7] text-white',
    icon: 'bg-[#006AA7] text-white',
    focus: 'focus-visible:outline-[#006AA7]',
    bar: 'bg-[#006AA7]',
    chipOn: 'border-[#006AA7] bg-[#EEF5FC] text-[#013A63] shadow-[inset_0_0_0_1px_#006AA7]',
  },
  hack: {
    on: 'border-[#0A1930] shadow-[inset_0_0_0_1px_#0A1930] bg-[#FFF8E1]',
    tick: 'bg-[#FFCD00] border-[#0A1930] text-[#0A1930]',
    icon: 'bg-[#0A1930] text-[#FFCD00]',
    focus: 'focus-visible:outline-[#0A1930]',
    bar: 'bg-[#0A1930]',
    chipOn: 'border-[#0A1930] bg-[#FFF8E1] text-[#0A1930] shadow-[inset_0_0_0_1px_#0A1930]',
  },
};

export interface ChoiceItem {
  id: string;
  title: string;
  desc?: string;
  icon?: LucideIcon;
  /** A picture on top (programme and track cards); shown as it is. */
  image?: string;
  /** A picture slot without a picture: a navy panel with this name. */
  placeholder?: string;
  meta?: React.ReactNode;
  /** Not open (e.g. Kid InnoHack): greyed with a lock and this reason; choosing it explains instead. */
  closed?: string;
  /** This card's own accent (the programme step: each programme in its colour). */
  accent?: Accent;
  /** Spans the whole row (a card without a picture under pictured ones). */
  wide?: boolean;
}

/**
 * One question's cards as a radio group. `onChoose(id, how)`: `how` is 'keyboard' when an arrow key moved the
 * choice, so a step that moves on after a click can stay put for keyboard users.
 */
export const ChoiceGroup: React.FC<{
  label: string;
  items: ChoiceItem[];
  value?: string;
  onChoose: (id: string, how: 'pointer' | 'keyboard') => void;
  accent: Accent;
  columns?: 1 | 2 | 3 | 4;
  small?: boolean;
}> = ({ label, items, value, onChoose, accent, columns = 2, small }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(0, items.findIndex((i) => i.id === value));
  const move = (from: number, step: number) => {
    const n = items.length;
    const to = (from + step + n) % n;
    refs.current[to]?.focus();
    onChoose(items[to].id, 'keyboard');
  };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(i, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(i, -1); }
    else if (e.key === 'Home') { e.preventDefault(); move(-1, 1); }
    else if (e.key === 'End') { e.preventDefault(); move(0, -1); }
  };
  const cols = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    <div role="radiogroup" aria-label={label} className={`grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((item, i) => {
        const a = ACCENTS[item.accent ?? accent];
        const chosen = item.id === value;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={chosen}
            aria-disabled={item.closed ? true : undefined}
            aria-describedby={item.closed ? `${item.id}-closed` : undefined}
            tabIndex={i === current ? 0 : -1}
            onClick={() => onChoose(item.id, 'pointer')}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative w-full text-left flex flex-col border-2 transition-colors ${item.wide ? 'md:col-span-full' : ''} motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 ${a.focus} ${
              chosen ? a.on : item.closed ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'bg-white border-[#E1E7EF] hover:border-slate-400'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center border-2 ${chosen ? a.tick : 'bg-white border-[#E1E7EF] text-transparent'}`}
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </span>
            {item.closed && (
              <span id={`${item.id}-closed`} className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFCD00] text-[#0A1930] text-sm font-semibold">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                {item.closed}
              </span>
            )}
            {item.image ? (
              <img src={item.image} alt="" className={`w-full h-40 sm:h-44 object-cover border-b border-slate-200 ${item.closed ? 'opacity-60' : ''}`} />
            ) : item.placeholder ? (
              <span aria-hidden="true" className="w-full h-40 sm:h-44 border-b border-slate-200 bg-gradient-to-br from-[#0A1930] to-[#1E3A5F] flex items-center justify-center text-white/85 font-headline font-bold">
                {item.placeholder}
              </span>
            ) : null}
            <span className={`flex gap-3.5 ${small ? 'p-4' : 'p-5'}`}>
              {Icon && (
                <span aria-hidden="true" className={`shrink-0 w-10 h-10 flex items-center justify-center ${chosen ? a.icon : 'bg-[#F2F6FA] text-[#0A1930]'}`}>
                  <Icon className="w-5 h-5" />
                </span>
              )}
              <span className="min-w-0 pr-8">
                <span className="block font-headline font-bold text-[17px] leading-snug text-[#0A1930]">{item.title}</span>
                {item.desc && <span className="block mt-1 text-[15px] leading-relaxed text-slate-600">{item.desc}</span>}
                {item.meta && <span className="block mt-2.5 text-sm font-medium text-slate-600">{item.meta}</span>}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

/** A closed card's badge text, for screen readers too. */
export const ClosedBadge: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFCD00] text-[#0A1930] text-sm font-semibold">
    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
    {text}
  </span>
);
