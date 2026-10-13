import React from 'react';
import { Landmark, Tag } from 'lucide-react';
import { useT } from '../content/useT';
import { feesDefaults, type FeesData } from '../content/sections/simple';

interface ParticipationFeesProps {
  /** Show the Bankgiro payment details under the fee list (when there is no CMS data). */
  showPayment?: boolean;
  className?: string;
  /** The home page's fees from the Site CMS; other pages show the built-in fees. */
  data?: FeesData;
}

/** Participation fee table (per kid) with optional Bankgiro payment details. */
export const ParticipationFees: React.FC<ParticipationFeesProps> = ({ showPayment = true, className = '', data }) => {
  const { t } = useT();
  const d = data ?? feesDefaults();
  const withPayment = data ? data.showPayment : showPayment;

  return (
    <div data-no-translate="true" className={`border-2 border-[#FFCD00] bg-[#FFFBEA] text-[#0A1930] p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-2 font-headline font-black text-lg uppercase tracking-tight">
        <Tag className="w-5 h-5 text-[#006AA7]" />
        {t(d.title)}
      </div>

      <ul className="divide-y divide-[#FFCD00]/50 border-y border-[#FFCD00]/50">
        {d.fees.map((f, i) => (
          <li key={i} className="py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <span>{t(f.who)}</span>
            <span className="flex items-center gap-2">
              {t(f.note) && (
                <span className="text-[10px] font-mono-code font-bold uppercase px-1.5 py-0.5 bg-[#0A1930] text-[#FFCD00]">
                  {t(f.note)}
                </span>
              )}
              <strong className="font-mono-code">{t(f.fee)}</strong>
            </span>
          </li>
        ))}
      </ul>

      {withPayment && (
        <div className="flex items-start gap-3 text-sm">
          <Landmark className="w-5 h-5 text-[#006AA7] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              {t(d.payTo)} <strong>Bankgiro {d.bankgiro}</strong> ({t(d.nameLabel)}:{' '}
              <strong>{d.payee}</strong>).
            </p>
            <p>
              {t(d.write)} <strong>"{t(d.reference)}"</strong>{' '}
              {t(d.referenceField)}
            </p>
            <p className="text-slate-600">{t(d.payNow)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
