import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/roboData';
import { Mail } from 'lucide-react';

export const RoboFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="w-full bg-[#F8F9FA] text-[#07111F] border-b border-[#07111F]/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-10 border-b border-[#07111F]/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              09 / FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-[#07111F]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              Programme<br />
              <span className="text-[#0052FF]">FAQ.</span>
            </h2>
          </div>

          <a
            href="mailto:contact@robokidoathon.se"
            className="text-xs font-display font-bold tracking-[0.14em] uppercase text-[#07111F] hover:text-[#0052FF] inline-flex items-center gap-2 border-b border-[#07111F]/30 pb-0.5 hover:border-[#0052FF] transition-all self-start md:self-end"
          >
            <Mail className="w-4 h-4 text-[#0052FF]" />
            <span>CONTACT EVENT COORDINATORS</span>
          </a>
        </div>

        {/* Numbered Editorial Rows */}
        <div className="border-t border-[#07111F]/10 divide-y divide-[#07111F]/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={item.id} className="py-6 sm:py-8 transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-start justify-between gap-6 text-left group focus:outline-none"
                >
                  <div className="flex items-start gap-4 sm:gap-8 flex-1">
                    <span className="text-xs font-mono-code font-bold text-[#07111F]/40 shrink-0 mt-1">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <div className="text-xs font-mono-code font-bold text-[#0052FF] uppercase tracking-wider mb-1">
                        {item.category}
                      </div>
                      <h3
                        className={`font-display font-bold text-lg sm:text-xl tracking-tight transition-colors ${
                          isOpen ? 'text-[#0052FF]' : 'text-[#07111F] group-hover:text-[#0052FF]'
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`font-display text-2xl font-light shrink-0 transition-colors ${
                      isOpen ? 'text-[#0052FF]' : 'text-[#07111F]/40'
                    }`}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pl-8 sm:pl-16 pr-6 pt-4">
                    <p className="text-sm sm:text-base text-[#4A5568] font-light leading-relaxed max-w-4xl">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
