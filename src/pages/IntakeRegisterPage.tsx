import React from 'react';
import { useT } from '../content/useT';
import { RegisterWizard } from './register/RegisterWizard';
import type { IntakeProgramTab } from './register/flow';

export type { IntakeProgramTab } from './register/flow';
export { COUNTRIES, CITIES_BY_COUNTRY } from './register/locations';

interface IntakeRegisterPageProps {
  /** A form to open (a ?tab= link): the questions it answers are skipped; null starts at step 1. */
  initialTab?: IntakeProgramTab | null;
  onNavigateHome: () => void;
  onNavigateVoting?: () => void;
}

/** The register page: the registration wizard (also on the home page) under a link back to the overview. */
export const IntakeRegisterPage: React.FC<IntakeRegisterPageProps> = ({
  initialTab = null,
  onNavigateHome,
  onNavigateVoting,
}) => {
  const { L } = useT();

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A1930] pt-24 pb-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            ← {L('Back to overview', 'Tillbaka till översikten')}
          </button>
          {onNavigateVoting && (
            <button
              onClick={onNavigateVoting}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 uppercase transition-colors"
            >
              <span>⭐ {L('View ideas & vote', 'Se idéer och rösta')}</span>
            </button>
          )}
        </div>

        <RegisterWizard initialTab={initialTab} onNavigateVoting={onNavigateVoting} syncUrl headingLevel={1} />
      </div>
    </div>
  );
};
