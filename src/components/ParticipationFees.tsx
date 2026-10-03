import React from 'react';
import { Landmark, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PARTICIPATION_FEES, PAYMENT } from '../data/vfiFacts';

interface ParticipationFeesProps {
  /** Show the Bankgiro payment details under the fee list. */
  showPayment?: boolean;
  className?: string;
}

/** Participation fee table (per kid) with optional Bankgiro payment details. */
export const ParticipationFees: React.FC<ParticipationFeesProps> = ({ showPayment = true, className = '' }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  const L = (en: string, svText: string) => (sv ? svText : en);

  return (
    <div data-no-translate="true" className={`border-2 border-[#FFCD00] bg-[#FFFBEA] text-[#0A1930] p-5 sm:p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-2 font-headline font-black text-lg uppercase tracking-tight">
        <Tag className="w-5 h-5 text-[#006AA7]" />
        {L('Participation fees', 'Deltagaravgifter')}
      </div>

      <ul className="divide-y divide-[#FFCD00]/50 border-y border-[#FFCD00]/50">
        {PARTICIPATION_FEES.map((f) => (
          <li key={f.who.en} className="py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <span>{sv ? f.who.sv : f.who.en}</span>
            <span className="flex items-center gap-2">
              {f.note && (
                <span className="text-[10px] font-mono-code font-bold uppercase px-1.5 py-0.5 bg-[#0A1930] text-[#FFCD00]">
                  {sv ? f.note.sv : f.note.en}
                </span>
              )}
              <strong className="font-mono-code">{sv ? f.fee.sv : f.fee.en}</strong>
            </span>
          </li>
        ))}
      </ul>

      {showPayment && (
        <div className="flex items-start gap-3 text-sm">
          <Landmark className="w-5 h-5 text-[#006AA7] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              {L('Pay to', 'Betala till')} <strong>Bankgiro {PAYMENT.bankgiro}</strong> ({L('Name', 'Namn')}:{' '}
              <strong>{PAYMENT.payee}</strong>).
            </p>
            <p>
              {L('Write', 'Skriv')} <strong>"{sv ? PAYMENT.reference.sv : PAYMENT.reference.en}"</strong>{' '}
              {L('in the OCR/Meddelande field.', 'i OCR-/meddelandefältet.')}
            </p>
            <p className="text-slate-600">
              {L(
                'Please pay immediately after registering so we can prepare enough Robo-kits on time.',
                'Betala direkt efter anmälan så att vi hinner förbereda tillräckligt många Robo-kit.'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
