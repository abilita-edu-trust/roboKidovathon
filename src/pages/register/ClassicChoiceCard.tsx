// The selection card as it was before the vfi and IBK registration redesign. Riga, Eskilstuna and Växjö keep it
// unchanged (vfi and IBK use ./ChoiceCards). Copied from main as it was on 17 November 2026.
import React from 'react';
import { Check, Lightbulb, Lock } from 'lucide-react';

/** A selectable card: programme (with its picture), role, activity or theme. */
export const ClassicChoiceCard: React.FC<{
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc?: string;
  icon?: string;
  image?: string;
  meta?: React.ReactNode;
  green?: boolean;
  small?: boolean;
  /** Not open yet (Kid InnoHack): greyed, with `badge` saying why; choosing it explains instead of selecting. */
  disabled?: boolean;
  badge?: string;
  /** A picture slot without a picture yet: a navy panel with a lightbulb and this name. */
  placeholder?: string;
}> = ({ selected, onSelect, title, desc, icon, image, meta, green, small, disabled, badge, placeholder }) => {
  const tone = selected
    ? `${green ? 'border-[#059669] bg-emerald-50/60' : 'border-[#006AA7] bg-sky-50/70'} shadow-md`
    : disabled
      ? 'bg-slate-50 border-slate-200'
      : 'bg-white border-slate-200 hover:border-[#0A1930] hover:shadow-lg';
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      className={`relative w-full text-left border-2 transition-all flex flex-col ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${tone}`}
    >
      {badge && (
        <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFCD00] text-[#0A1930] text-[11px] font-headline font-black uppercase tracking-wider">
          <Lock className="w-3 h-3" aria-hidden="true" />
          {badge}
        </span>
      )}
      {selected && (
        <span className={`absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-white ${green ? 'bg-[#059669]' : 'bg-[#006AA7]'}`}>
          <Check className="w-3.5 h-3.5" />
        </span>
      )}
      {image ? (
        <img src={image} alt="" className={`w-full h-40 sm:h-44 object-cover border-b border-slate-200 ${disabled ? 'opacity-60' : ''}`} />
      ) : placeholder ? (
        <span className={`w-full h-40 sm:h-44 border-b border-slate-200 bg-gradient-to-br from-[#0A1930] to-[#1E3A5F] flex flex-col items-center justify-center gap-2 text-white ${disabled ? 'opacity-70' : ''}`} aria-hidden="true">
          <span className="w-14 h-14 bg-white/10 border border-white/25 flex items-center justify-center">
            <Lightbulb className="w-7 h-7 text-[#FFCD00]" />
          </span>
          <span className="font-headline font-black text-xs uppercase tracking-wider text-white/85">{placeholder}</span>
        </span>
      ) : null}
      <span className={`block ${small ? 'p-4' : 'p-5'}`}>
        {icon && (
          <span className={`block leading-none mb-2 ${small ? 'text-2xl' : 'text-3xl'}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={`block font-headline font-black uppercase tracking-tight text-[#0A1930] leading-snug pr-7 ${small ? 'text-sm' : 'text-lg'}`}>
          {title}
        </span>
        {desc && <span className="block text-xs text-slate-600 leading-relaxed mt-1.5">{desc}</span>}
        {meta && <span className="block mt-3 text-[13px] font-mono-code font-semibold text-slate-600">{meta}</span>}
      </span>
    </button>
  );
};
