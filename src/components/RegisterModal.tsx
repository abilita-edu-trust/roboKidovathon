import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
} from 'lucide-react';
import { COMPETITION_CATEGORIES, CompetitionCategory } from '../data/roboData';
import { supabase } from '../lib/supabase';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'school' | 'student'>('school');

  // School Registration Form Fields
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [gradeGroup, setGradeGroup] = useState('');
  const [workshopSlot, setWorkshopSlot] = useState<'morning' | 'afternoon' | 'custom'>('morning');
  const [customStartTime, setCustomStartTime] = useState('10:00');
  const [customEndTime, setCustomEndTime] = useState('12:30');
  const [studentCount, setStudentCount] = useState('25');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [showGdprInfo, setShowGdprInfo] = useState(false);

  // Student / Team Registration Form Fields
  const [teamName, setTeamName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('robo-sprint-explorer');

  // State handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (activeTab === 'school' && !consentAgreed) {
      setSubmitError('Please confirm the consent checkbox to proceed with school registration.');
      return;
    }

    setIsSubmitting(true);

    const code = `RKV-2026-${Math.floor(1000 + Math.random() * 9000)}-${activeTab === 'school' ? 'SC' : 'ST'}`;

    // Format time range string
    let timeRange = '';
    if (activeTab === 'school') {
      if (workshopSlot === 'morning') timeRange = '09:00–11:30 (2.5 hours)';
      else if (workshopSlot === 'afternoon') timeRange = '14:00–16:30 (2.5 hours)';
      else timeRange = `${customStartTime}–${customEndTime} (Custom)`;
    }

    // Format preferred date summary
    let finalPreferredDate = preferredDate;
    if (activeTab === 'school' && isCustomDate) {
      finalPreferredDate = dateRangeStart && dateRangeEnd
        ? `${dateRangeStart} to ${dateRangeEnd}`
        : dateRangeStart || dateRangeEnd || 'Custom Date Range';
    }

    const payload = {
      registration_type: activeTab,
      school_name: activeTab === 'school' ? schoolName : null,
      team_name: activeTab === 'student' ? teamName : null,
      contact_name: contactName,
      email,
      phone,
      category_id: activeTab === 'student' ? selectedCategory : 'vasteras-school-workshop',
      student_count: studentCount,
      preferred_date: finalPreferredDate || null,
      date_range_start: isCustomDate && dateRangeStart ? dateRangeStart : null,
      date_range_end: isCustomDate && dateRangeEnd ? dateRangeEnd : null,
      workshop_slot: activeTab === 'school' ? workshopSlot : null,
      time_range: activeTab === 'school' ? timeRange : null,
      grade_group: activeTab === 'school' ? gradeGroup : null,
      status: 'pending',
      consent_agreed: activeTab === 'school' ? consentAgreed : true,
      confirmation_code: code,
    };

    const { error } = await supabase.from('registrations').insert(payload);

    setIsSubmitting(false);

    if (error) {
      console.error('[Supabase Registration Error]:', error);
      setSubmitError(error.message || 'Something went wrong submitting your registration. Please try again.');
      return;
    }

    setIsSubmitted(true);
    setConfirmationCode(code);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSchoolName('');
    setTeamName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setIsCustomDate(false);
    setDateRangeStart('');
    setDateRangeEnd('');
    setGradeGroup('');
    setWorkshopSlot('morning');
    setStudentCount('25');
    setConsentAgreed(false);
    setSubmitError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A1930]/75 backdrop-blur-sm -z-10"
      />

      {/* Modal Container — STRICTLY SHARP EDGES */}
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-300 shadow-2xl p-5 sm:p-8 my-6 text-[#0A1930] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>VÄSTERÅS FUTURE INNOVATORS 2026 // OFFICIAL INTAKE</span>
              </div>
              <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
                {activeTab === 'school' ? 'School Registration' : 'Student / Team Registration'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light mt-1 leading-relaxed">
                {activeTab === 'school'
                  ? 'Book a turnkey robotics & innovation workshop for your school cohort ahead of the Västerås Finals.'
                  : 'Register your independent student squad for the RoboKidovation or Hackathon league.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 border-b border-slate-200 pb-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('school');
                  setSubmitError('');
                }}
                className={`py-2 px-5 text-xs font-headline font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  activeTab === 'school'
                    ? 'bg-[#006AA7] text-white border-[#006AA7] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>School Intake</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setSubmitError('');
                }}
                className={`py-2 px-5 text-xs font-headline font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  activeTab === 'student'
                    ? 'bg-[#006AA7] text-white border-[#006AA7] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student / Team</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name & Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                    {activeTab === 'school' ? 'School name *' : 'Team name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={activeTab === 'school' ? schoolName : teamName}
                    onChange={(e) =>
                      activeTab === 'school' ? setSchoolName(e.target.value) : setTeamName(e.target.value)
                    }
                    placeholder={activeTab === 'school' ? 'Example: Sundsvall School' : 'Example: Aros Tech Titans'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                    Contact person *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.se"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+46 ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                  />
                </div>
              </div>

              {/* SCHOOL INTAKE SPECIFIC FIELDS */}
              {activeTab === 'school' && (
                <>
                  {/* Preferred Date & Grade / Age Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                        Preferred date *
                      </label>
                      <select
                        required
                        value={preferredDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPreferredDate(val);
                          setIsCustomDate(val === 'custom');
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                      >
                        <option value="">Select a date</option>
                        <option value="7 – 25 September 2026 (School Demo & Intro Session)">
                          7 – 25 September 2026 (School Demo)
                        </option>
                        <option value="1 – 9 October 2026 (Hands-on Robotics Workshop)">
                          1 – 9 October 2026 (Robotics Workshop)
                        </option>
                        <option value="12 – 30 October 2026 (Build, Test & Practice Period)">
                          12 – 30 October 2026 (Build & Practice)
                        </option>
                        <option value="2 – 13 November 2026 (Internal School Finals)">
                          2 – 13 November 2026 (Internal Finals)
                        </option>
                        <option value="16 – 27 November 2026 (Selection of 4 Teams)">
                          16 – 27 November 2026 (Team Selection)
                        </option>
                        <option value="5 December 2026 (Västerås RoboKidovation Final)">
                          5 December 2026 (RoboKidovation Final)
                        </option>
                        <option value="5 December 2026 (Young Innovators Hackathon Final)">
                          5 December 2026 (Hackathon Final)
                        </option>
                        <option value="custom">Specific / Custom Date Range...</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                        Grade / age group *
                      </label>
                      <select
                        required
                        value={gradeGroup}
                        onChange={(e) => setGradeGroup(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                      >
                        <option value="">Select grade</option>
                        <option value="Årskurs 4–6 (Mellanstadiet · Ages 10–12)">
                          Årskurs 4–6 (Mellanstadiet · Ages 10–12)
                        </option>
                        <option value="Årskurs 7–9 (Högstadiet · Ages 13–15)">
                          Årskurs 7–9 (Högstadiet · Ages 13–15)
                        </option>
                        <option value="Gymnasiet (Upper Secondary · Ages 16–18)">
                          Gymnasiet (Upper Secondary · Ages 16–18)
                        </option>
                        <option value="Mixed Cohort / STEM Club">
                          Mixed Cohort / STEM Club
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Date Range Picker when selected */}
                  {isCustomDate && (
                    <div className="p-3.5 bg-sky-50/60 border border-sky-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono-code font-bold text-[#006AA7] uppercase mb-1">
                          Date Range Start *
                        </label>
                        <input
                          type="date"
                          required={isCustomDate}
                          value={dateRangeStart}
                          onChange={(e) => setDateRangeStart(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono-code font-bold text-[#006AA7] uppercase mb-1">
                          Date Range End *
                        </label>
                        <input
                          type="date"
                          required={isCustomDate}
                          value={dateRangeEnd}
                          onChange={(e) => setDateRangeEnd(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Workshop Slot Selection */}
                  <div>
                    <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                      Choose workshop slot *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Morning Slot */}
                      <button
                        type="button"
                        onClick={() => setWorkshopSlot('morning')}
                        className={`p-3.5 border text-left transition-all ${
                          workshopSlot === 'morning'
                            ? 'border-[#006AA7] bg-[#006AA7]/10 ring-1 ring-[#006AA7]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-headline font-bold text-sm text-[#0A1930]">
                          Morning
                        </div>
                        <div className="text-xs text-slate-500 font-mono-code mt-0.5">
                          09:00–11:30 · 2.5 hours
                        </div>
                      </button>

                      {/* Afternoon Slot */}
                      <button
                        type="button"
                        onClick={() => setWorkshopSlot('afternoon')}
                        className={`p-3.5 border text-left transition-all ${
                          workshopSlot === 'afternoon'
                            ? 'border-[#006AA7] bg-[#006AA7]/10 ring-1 ring-[#006AA7]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-headline font-bold text-sm text-[#0A1930]">
                          Afternoon
                        </div>
                        <div className="text-xs text-slate-500 font-mono-code mt-0.5">
                          14:00–16:30 · 2.5 hours
                        </div>
                      </button>
                    </div>

                    {/* Custom time range toggle button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setWorkshopSlot(workshopSlot === 'custom' ? 'morning' : 'custom')}
                        className="text-xs text-[#006AA7] hover:underline font-mono-code flex items-center gap-1 font-semibold"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {workshopSlot === 'custom' ? 'Use standard slots' : '+ Need custom workshop hours / time range?'}
                        </span>
                      </button>

                      {workshopSlot === 'custom' && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono-code text-slate-500 uppercase mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={customStartTime}
                              onChange={(e) => setCustomStartTime(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono-code text-slate-500 uppercase mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={customEndTime}
                              onChange={(e) => setCustomEndTime(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Number of students */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase">
                        Number of students *
                      </label>
                      <div className="flex gap-1.5">
                        {['15', '25', '30', '50', '60+'].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setStudentCount(num)}
                            className={`px-2 py-0.5 text-[10px] font-mono-code border transition-colors ${
                              studentCount === num
                                ? 'bg-[#006AA7] text-white border-[#006AA7]'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      value={studentCount}
                      onChange={(e) => setStudentCount(e.target.value)}
                      placeholder="Example: 25"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                    />
                  </div>

                  {/* What is included? Info Callout */}
                  <div className="p-4 bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-headline font-bold text-[#0A1930]">
                      <Info className="w-4 h-4 text-[#006AA7]" />
                      <span>What is included?</span>
                    </div>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Robots, equipment, instructor, team challenges and Robo Trials activities. No previous coding or robotics experience is needed.
                    </p>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#006AA7] border-slate-300 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-700 leading-snug">
                        I confirm that I am registering on behalf of the school and agree that the contact information above may be used to manage this workshop booking.
                      </span>
                    </label>
                  </div>

                  {/* GDPR / Privacy Information Accordion */}
                  <div className="border-t border-slate-200 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowGdprInfo(!showGdprInfo)}
                      className="text-xs text-[#006AA7] hover:underline font-mono-code flex items-center gap-1"
                    >
                      {showGdprInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span className="font-semibold">GDPR / privacy information</span>
                    </button>

                    {showGdprInfo && (
                      <div className="mt-2 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1 font-light">
                        <p>
                          <strong>Data Controller:</strong> Västerås Future Innovators & Skillskolan in compliance with EU GDPR and the Swedish Education Act (Lgr22).
                        </p>
                        <p>
                          Contact details provided are utilized strictly for scheduling classroom workshops, dispatching competition materials, and coordinating tournament finals. No personal student identifiers are collected without verified parental consent.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* STUDENT / TEAM SPECIFIC FIELDS */}
              {activeTab === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-2">
                      Choose your tournament track *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {COMPETITION_CATEGORIES.map((cat: CompetitionCategory) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-3 border text-left transition-all ${
                            selectedCategory === cat.id
                              ? 'border-[#006AA7] bg-[#006AA7]/10 text-[#0A1930]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-headline font-bold text-xs text-[#0A1930]">
                            {cat.title}
                          </div>
                          <div className="text-[11px] font-mono-code text-slate-500 mt-0.5">
                            {cat.ageRange}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold tracking-wider text-slate-700 uppercase mb-1">
                      Team size (students) *
                    </label>
                    <div className="flex gap-2">
                      {['2', '3', '4', '5'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStudentCount(num)}
                          className={`flex-1 py-2 text-xs font-mono-code font-bold border transition-all ${
                            studentCount === num
                              ? 'bg-[#006AA7] text-white border-[#006AA7]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {num} Students
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-mono-code text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#006AA7] hover:bg-[#013A63] text-white font-headline font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                    <span>TRANSMITTING TO VÄSTERÅS PLATFORM...</span>
                  </span>
                ) : (
                  <>
                    <span>{activeTab === 'school' ? 'Request Free Workshop' : 'Register Team for Qualifiers'}</span>
                    <ArrowRight className="w-4 h-4 text-[#FFCD00]" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#059669]/10 border border-[#059669]/40 flex items-center justify-center text-[#059669] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#059669] uppercase mb-1 block">
              REGISTRATION RECORDED // VÄSTERÅS 2026
            </span>

            <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0A1930] uppercase tracking-tight">
              Workshop Request Received!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-light max-w-md leading-relaxed">
              We have dispatched booking verification and curriculum materials to{' '}
              <strong className="text-[#0A1930] font-semibold">{email}</strong>.
            </p>

            {/* Token Badge */}
            <div className="my-5 p-4 bg-slate-50 border border-slate-200 w-full max-w-md text-center">
              <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1">
                OFFICIAL REGISTRATION TOKEN
              </span>
              <span className="font-mono-code font-bold text-lg sm:text-xl text-[#006AA7] tracking-wider block">
                {confirmationCode}
              </span>
              <span className="text-[11px] text-slate-500 font-mono-code block mt-1">
                Status: Pending Coordinator Review
              </span>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
            >
              Return to Tournament Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
