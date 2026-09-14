import React, { useState } from 'react';
import { X, Sparkles, User, Building, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { COMPETITION_CATEGORIES, CompetitionCategory } from '../data/roboData';
import { supabase } from '../lib/supabase';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'school'>('student');
  const [selectedCategory, setSelectedCategory] = useState<string>('robo-sprint-explorer');
  const [teamName, setTeamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentCount, setStudentCount] = useState('3');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const code = `RKV-2026-${Math.floor(1000 + Math.random() * 9000)}-${activeTab === 'student' ? 'ST' : 'SC'}`;

    const { error } = await supabase.from('registrations').insert({
      registration_type: activeTab,
      team_name: activeTab === 'student' ? teamName : null,
      school_name: activeTab === 'school' ? schoolName : null,
      contact_name: contactName,
      email,
      phone,
      category_id: selectedCategory,
      student_count: studentCount,
      confirmation_code: code,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError('Something went wrong sending your registration. Please try again.');
      return;
    }

    setIsSubmitted(true);
    setConfirmationCode(code);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setTeamName('');
    setSchoolName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setStudentCount('3');
    setSubmitError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A1930]/60 backdrop-blur-md -z-10"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-10 my-8 text-[#0A1930]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL REGISTRATION GATE // VÄSTERÅS 2026</span>
              </div>
              <h2 className="font-headline font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#0A1930]">
                Join The Competition.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light mt-1.5 leading-relaxed">
                Register a student team or enrol your school cohort for the 20-hour STEM project ahead of the RoboSkolan qualifiers.
              </p>
            </div>

            <div className="flex gap-2 border-b border-slate-200 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className={`py-2 px-5 text-xs font-headline font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'student'
                    ? 'bg-[#FFCD00] text-[#0A1930] shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:text-[#0A1930]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>STUDENT / TEAM</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('school')}
                className={`py-2 px-5 text-xs font-headline font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'school'
                    ? 'bg-[#FFCD00] text-[#0A1930] shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:text-[#0A1930]'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>SCHOOL INTAKE</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                    {activeTab === 'student' ? 'TEAM NAME *' : 'SCHOOL NAME *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={activeTab === 'student' ? teamName : schoolName}
                    onChange={(e) => activeTab === 'student' ? setTeamName(e.target.value) : setSchoolName(e.target.value)}
                    placeholder={activeTab === 'student' ? 'e.g. Aros Tech Titans' : 'e.g. Västerås Gymnasium'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                    {activeTab === 'student' ? 'PARENT / MENTOR NAME *' : 'COORDINATOR NAME *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Karin Lindqvist"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                    OFFICIAL EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mentor@skola.se"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                    PHONE NUMBER (SWEDEN +46) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+46 70 123 4567"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>
              </div>

              {/* League Choice */}
              <div>
                <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-2">
                  CHOOSE YOUR LEAGUE *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {COMPETITION_CATEGORIES.map((cat: CompetitionCategory) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3.5 border text-left transition-all ${
                        selectedCategory === cat.id
                          ? 'border-[#006AA7] bg-[#006AA7]/10 text-[#0A1930]'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-headline font-bold text-sm text-[#0A1930]">
                        {cat.title} · {cat.division}
                      </div>
                      <div className="text-[11px] font-mono-code text-slate-500 mt-0.5">
                        {cat.ageRange}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Capacity Selector */}
              <div>
                <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                  ESTIMATED PARTICIPANT COHORT
                </label>
                <div className="flex gap-2">
                  {['3', '5', '15', '30', '60+'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStudentCount(num)}
                      className={`flex-1 py-2 text-xs font-mono-code font-bold border transition-all ${
                        studentCount === num
                          ? 'bg-[#006AA7] text-white border-[#006AA7]'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {num} {num === '60+' ? 'Students' : 'Max'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FFCD00]/15 border border-[#FFCD00]/60 flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#0A1930] font-semibold">REGISTRATION DEADLINE:</span>
                <span className="font-bold text-[#0A1930]">DECEMBER 4 & 5, 2026</span>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-mono-code text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-pill-lime py-4 text-xs font-black tracking-wider uppercase mt-2 flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-[#0A1930]/30 border-t-[#0A1930] animate-spin" />
                    <span>TRANSMITTING REGISTRATION...</span>
                  </span>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION ENROLMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#006AA7]/10 border border-[#006AA7]/40 flex items-center justify-center text-[#006AA7] mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-2 block">
              REGISTRATION CONFIRMED // VÄSTERÅS 2026
            </span>

            <h3 className="font-headline font-black text-2xl sm:text-4xl text-[#0A1930] uppercase tracking-tight">
              Enrolment Verified.
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-light max-w-md leading-relaxed">
              Confirmation and workshop preparation schedule dispatched to <strong className="text-[#0A1930]">{email}</strong>.
            </p>

            <div className="my-6 p-4 bg-slate-50 border border-slate-200 w-full max-w-md">
              <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1">
                OFFICIAL REGISTRATION TOKEN:
              </span>
              <span className="font-mono-code font-bold text-lg text-[#006AA7] tracking-wider">
                {confirmationCode}
              </span>
            </div>

            <button
              onClick={handleReset}
              className="btn-pill-white px-8 py-3 text-xs"
            >
              RETURN TO TOURNAMENT PORTAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
