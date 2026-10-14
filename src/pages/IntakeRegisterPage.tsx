import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Lightbulb,
  Upload,
  ArrowRight,
  ArrowLeft,
  Compass,
  Share2,
  Check,
  Video,
  Image as ImageIcon,
  FileText,
  School,
  GraduationCap,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { VoiceNoteRecorder } from '../components/VoiceNoteRecorder';
import { uploadIdeaMedia, submitIdea, fetchRegisteredSchools } from '../lib/ideasService';
import { VolunteerForm } from '../components/VolunteerForm';
import { GRADE_GROUP_OPTIONS } from '../data/vfiFacts';
import { ParticipationFees } from '../components/ParticipationFees';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

// 'partner' only exists on city sites that provide an extra form (see SiteConfig.intake.extraForm).
export type IntakeProgramTab = 'workshop' | 'demo' | 'association' | 'submit-idea' | 'hackathon' | 'volunteer' | 'partner';

// The register page is a three-step wizard: who is registering → which programme → the form.
type Audience = 'schools' | 'students' | 'community';
type WizardStep = 1 | 2 | 3;
const AUDIENCE_TABS: Record<Audience, IntakeProgramTab[]> = {
  schools: ['workshop', 'demo'],
  students: ['submit-idea', 'hackathon'],
  community: ['association', 'volunteer', 'partner'],
};
const AUDIENCE_ORDER: Audience[] = ['schools', 'students', 'community'];
const audienceOf = (tab: IntakeProgramTab): Audience =>
  AUDIENCE_ORDER.find((a) => AUDIENCE_TABS[a].includes(tab)) ?? 'schools';

interface IntakeRegisterPageProps {
  /** A programme to open straight away (a ?tab= link); null starts at step 1. */
  initialTab?: IntakeProgramTab | null;
  onNavigateHome: () => void;
  onNavigateVoting?: () => void;
}

// Every city here needs a row in eu_skola_cities with the same slug, or its entries land
// in the country's first city on the EU Skola dashboard (submit_eu_skola_registration).
export const COUNTRIES = [
  { slug: 'sweden', name: 'Sweden', defaultCity: 'vasteras' },
  { slug: 'denmark', name: 'Denmark', defaultCity: 'copenhagen' },
  { slug: 'latvia', name: 'Latvia', defaultCity: 'riga' },
  { slug: 'estonia', name: 'Estonia', defaultCity: 'tallinn' },
  { slug: 'germany', name: 'Germany', defaultCity: 'leipzig' },
];

export const CITIES_BY_COUNTRY: Record<string, { slug: string; name: string }[]> = {
  sweden: [
    { slug: 'vasteras', name: 'Västerås' },
    { slug: 'eskilstuna', name: 'Eskilstuna' },
    { slug: 'vaxjo', name: 'Växjö' },
    { slug: 'uppsala', name: 'Uppsala' },
    { slug: 'stockholm', name: 'Stockholm' },
    { slug: 'gavle', name: 'Gävle' },
  ],
  denmark: [{ slug: 'copenhagen', name: 'Copenhagen' }],
  latvia: [
    { slug: 'riga', name: 'Riga' },
    { slug: 'ventspils', name: 'Ventspils' },
  ],
  estonia: [{ slug: 'tallinn', name: 'Tallinn' }],
  germany: [
    { slug: 'leipzig', name: 'Leipzig' },
    { slug: 'zwickau', name: 'Zwickau' },
    { slug: 'dresden', name: 'Dresden' },
  ],
};

type Choice = { value: string; label: string };

/** Areas from the printed Idea Card (stored as the English value). */
const IDEA_AREAS: Choice[] = [
  { value: 'Sustainability', label: 'Sustainability / Hållbarhet' },
  { value: 'Energy', label: 'Energy / Energi' },
  { value: 'Future Cities', label: 'Future Cities / Framtidens städer' },
  { value: 'Future Schools', label: 'Future Schools / Framtidens skolor' },
  { value: 'Technology / AI', label: 'Technology / AI / Teknik / AI' },
  { value: 'Community', label: 'Community / Samhälle' },
];

const DEVELOP_OPTIONS: Choice[] = [
  { value: 'yes', label: 'Yes / Ja' },
  { value: 'maybe', label: 'Maybe / Kanske' },
  { value: 'just-submitting', label: 'Just submitting my idea / Jag vill bara lämna in min idé' },
];

/** Options from the printed Interest Card. */
const WANTS_TO_OPTIONS: Choice[] = [
  { value: 'demo', label: 'Try a robotics demo / Prova en robotikdemo' },
  { value: 'workshop', label: 'Join a hands-on workshop / Delta i en praktisk workshop' },
  { value: 'team', label: 'Join a RoboKidovation team / Gå med i ett RoboKidovation-lag' },
  { value: 'final', label: 'Take part in the final / Delta i finalen' },
];

/** Group / association form: what the group would like from the programme. */
const ASSOCIATION_WANTS_OPTIONS: Choice[] = [
  { value: 'workshop', label: 'Hands-on workshop / Praktisk workshop' },
  { value: 'demo', label: 'Robotics demo / Robotikdemo' },
  { value: 'competition-teams', label: 'Enter competition teams / Anmäla tävlingslag' },
  { value: 'grade-1-2-participants', label: 'Grades 1–2 participant session / Deltagarpass för åk 1–2' },
  { value: 'young-inno-hack', label: 'Young Inno Hack ideas / Idéer till Young Inno Hack' },
];

const ASSOCIATION_TYPE_OPTIONS: Choice[] = [
  { value: 'cultural-association', label: 'Cultural association / Kulturförening' },
  { value: 'sports-club', label: 'Sports club / Idrottsförening' },
  { value: 'study-association', label: 'Study association / Studieförbund' },
  { value: 'parent-group', label: 'Parent group / Föräldragrupp' },
  { value: 'other', label: 'Other / Annat' },
];

const EXPERIENCE_OPTIONS: Choice[] = [
  { value: 'first-time', label: 'First time / Första gången' },
  { value: 'a-little', label: 'A little / Lite erfarenhet' },
  { value: 'built-before', label: 'I have built or coded before / Jag har byggt eller programmerat tidigare' },
];

const INTEREST_OPTIONS: Choice[] = [
  { value: 'building', label: 'Building / Bygga' },
  { value: 'coding', label: 'Coding / Programmering' },
  { value: 'engineering', label: 'Engineering / Teknik' },
  { value: 'design', label: 'Design / Design' },
  { value: 'problem-solving', label: 'Problem-solving / Problemlösning' },
];

const ChoiceGroup: React.FC<{
  label: string;
  options: Choice[];
  selected: string[];
  onToggle: (value: string) => void;
  tone?: 'blue' | 'green';
}> = ({ label, options, selected, onToggle, tone = 'blue' }) => {
  const on = tone === 'green' ? 'bg-[#059669] border-[#059669]' : 'bg-[#006AA7] border-[#006AA7]';
  return (
    <div>
      <span className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-2">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onToggle(o.value)}
              aria-pressed={active}
              className={`py-1.5 px-3 text-xs border transition-all text-left ${
                active ? `${on} text-white font-bold` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const IntakeRegisterPage: React.FC<IntakeRegisterPageProps> = ({
  initialTab = null,
  onNavigateHome,
  onNavigateVoting,
}) => {
  // City sites (e.g. vxo.iniac.se) lock the location and swap the Västerås-only wording.
  const site = useSite();
  const lockedLocation = site.location;
  const extraForm = site.intake.extraForm;
  // Forms this site offers, in order (VFI: the six below; vxo.iniac.se: the hackathon ones).
  const offeredTabs: IntakeProgramTab[] =
    site.intake.tabs ?? ['workshop', 'demo', 'association', 'submit-idea', 'hackathon', 'volunteer'];
  const offers = (tab: IntakeProgramTab) => offeredTabs.includes(tab) && (tab !== 'partner' || !!extraForm);
  const showRoboKido = offers('workshop') || offers('demo') || offers('association');
  const { language } = useLanguage();
  const L = (en: string, sv: string) => (language === 'sv' ? sv : en);

  // Wizard: a ?tab= link opens that form (step 3); otherwise the visitor first says who is
  // registering (step 1), then picks a programme (step 2). Steps with one choice are skipped.
  const optionsFor = (a: Audience) => AUDIENCE_TABS[a].filter(offers);
  const shownAudiences = AUDIENCE_ORDER.filter((a) => optionsFor(a).length > 0);
  const startTab: IntakeProgramTab | null = initialTab && offers(initialTab) ? initialTab : null;
  const onlyAudience = shownAudiences.length === 1 ? shownAudiences[0] : null;
  const onlyTab = onlyAudience && optionsFor(onlyAudience).length === 1 ? optionsFor(onlyAudience)[0] : null;
  const [selectedProgram, setSelectedProgram] = useState<IntakeProgramTab>(
    startTab ?? onlyTab ?? site.intake.defaultTab
  );
  const [audience, setAudience] = useState<Audience | null>(
    startTab ? audienceOf(startTab) : onlyAudience
  );
  const [step, setStep] = useState<WizardStep>(startTab || onlyTab ? 3 : onlyAudience ? 2 : 1);

  // Location Fields (Country first, then City / Location)
  const [countrySlug, setCountrySlug] = useState(lockedLocation?.countrySlug ?? 'sweden');
  const [citySlug, setCitySlug] = useState(lockedLocation?.citySlug ?? 'vasteras');
  const [customCityName, setCustomCityName] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);

  const handleCountryChange = (cSlug: string) => {
    setCountrySlug(cSlug);
    const available = CITIES_BY_COUNTRY[cSlug] || [];
    if (available.length > 0) {
      setCitySlug(available[0].slug);
      setIsCustomCity(false);
    } else {
      setCitySlug('custom');
      setIsCustomCity(true);
    }
  };

  // School vs Individual toggle (for Demo & Workshop)
  const [applicantType, setApplicantType] = useState<'school' | 'student'>('school');
  const [schoolName, setSchoolName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Customizable Date & Time (Requirement 1: Customizable date from calendar and customizable time)
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('10:00');
  const [customEndTime, setCustomEndTime] = useState('12:30');
  // Grade labels only name the programmes this site runs: esk has no hackathon (and so no
  // university level), vxo has no RoboKidovation (and so no grade 1–2 participant group).
  const gradeOptions = GRADE_GROUP_OPTIONS.filter(
    (g) => (offers('hackathon') || !g.startsWith('University')) && (showRoboKido || !g.startsWith('Årskurs 1–2')),
  ).map((g) => {
    let label = g;
    if (!showRoboKido) label = label.replace(/RoboKido \w+ (\/|·) /, '');
    if (!offers('hackathon')) label = label.replace(/ \/ Hackathon \w+/, '');
    return label;
  });
  // Hackathon-only sites start at the hackathon's youngest level.
  const [gradeGroup, setGradeGroup] = useState(
    gradeOptions.find((g) => g.startsWith(showRoboKido ? 'Årskurs 3–6' : 'Årskurs 7–9')) ?? gradeOptions[0],
  );
  const [studentCount, setStudentCount] = useState('25');
  // A class-sized default makes no sense for a 2–4 person squad; swap the untouched default.
  useEffect(() => {
    setStudentCount((c) => (selectedProgram === 'hackathon' ? (c === '25' ? '' : c) : c === '' ? '25' : c));
  }, [selectedProgram]);

  // Submit Idea Specific Fields
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('13');
  const [studentGrade, setStudentGrade] = useState('Grade 7');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaCategory, setIdeaCategory] = useState(IDEA_AREAS[0].value);
  const [problemStatement, setProblemStatement] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [developFurther, setDevelopFurther] = useState('');

  // Interest Card fields (individual / group students)
  const [interestAge, setInterestAge] = useState('');
  const [wantsTo, setWantsTo] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [voiceNoteFile, setVoiceNoteFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [videoInputType, setVideoInputType] = useState<'upload' | 'link'>('link');

  // Group / association fields
  const [associationType, setAssociationType] = useState('');
  const [associationWants, setAssociationWants] = useState<string[]>([]);
  const [teamCount, setTeamCount] = useState('');

  // Hackathon Specific Fields
  const [hackathonSkills, setHackathonSkills] = useState<string[]>([
    'Robotics & Hardware',
    'Coding & Software',
  ]);
  const [hackerChallengeDomain, setHackerChallengeDomain] = useState('Sustainable Cities & Climate');
  // Squad members (2–4) on the hackathon form; saved with the registration.
  const [squadMembers, setSquadMembers] = useState<{ full_name: string; grade: string }[]>([
    { full_name: '', grade: '' },
    { full_name: '', grade: '' },
  ]);
  const setSquadMember = (i: number, field: 'full_name' | 'grade', value: string) =>
    setSquadMembers((list) => list.map((m, j) => (j === i ? { ...m, [field]: value } : m)));

  // Consent & GDPR
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const [showGdprInfo, setShowGdprInfo] = useState(false);

  // Registered schools list for autocomplete
  const [registeredSchools, setRegisteredSchools] = useState<{ name: string; city: string }[]>([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchRegisteredSchools().then((schools) => {
      setRegisteredSchools(schools);
    });
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const toggleSkill = (skill: string) => {
    if (hackathonSkills.includes(skill)) {
      setHackathonSkills(hackathonSkills.filter((s) => s !== skill));
    } else {
      setHackathonSkills([...hackathonSkills, skill]);
    }
  };

  const isHack = selectedProgram === 'submit-idea' || selectedProgram === 'hackathon';
  const isAssociation = selectedProgram === 'association';
  const showInterestCard = applicantType === 'student' && (selectedProgram === 'workshop' || selectedProgram === 'demo');

  const toggleIn = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  // ── Wizard navigation ── The URL carries ?tab= only while a form is open, so a shared or
  // reloaded link lands on the same form; steps 1–2 drop it.
  const syncTabParam = (tab: IntakeProgramTab | null) => {
    const url = new URL(window.location.href);
    if (tab) url.searchParams.set('tab', tab);
    else url.searchParams.delete('tab');
    window.history.replaceState(null, '', url.toString());
  };
  const scrollToWizard = () =>
    setTimeout(() => {
      document.getElementById('register-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

  const openForm = (program: IntakeProgramTab) => {
    setSelectedProgram(program);
    setAudience(audienceOf(program));
    setSubmitSuccess(false);
    setSubmitError('');
    setStep(3);
    syncTabParam(program);
    scrollToWizard();
  };

  const chooseAudience = (a: Audience) => {
    setAudience(a);
    const options = optionsFor(a);
    if (options.length === 1) return openForm(options[0]);
    setStep(2);
    syncTabParam(null);
    scrollToWizard();
  };

  /** Step 3 → 2 (or → 1 when step 2 had a single choice); step 2 → 1. */
  const goBack = () => {
    const toStep: WizardStep = step === 3 && audience && optionsFor(audience).length > 1 ? 2 : 1;
    if (toStep === 1 && onlyAudience) return; // nothing to choose on step 1
    setStep(toStep);
    syncTabParam(null);
    scrollToWizard();
  };
  const goToStep = (target: WizardStep) => {
    if (target >= step) return;
    if (target === 1 && onlyAudience) return;
    if (target === 2 && (!audience || optionsFor(audience).length < 2)) return;
    setStep(target);
    syncTabParam(null);
    scrollToWizard();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Client-side validations with clear helper feedback
    if (!consentAgreed) {
      setSubmitError('Please accept the accuracy confirmation checkbox to proceed.');
      document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (!gdprAgreed) {
      setSubmitError('Please accept the GDPR data protection terms to proceed.');
      document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitError('Please enter a valid email address (e.g. name@school.se).');
      document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const namedMembers = squadMembers
      .map((m) => ({ full_name: m.full_name.trim(), grade: m.grade.trim() || null }))
      .filter((m) => m.full_name);
    if (selectedProgram === 'hackathon' && namedMembers.length < 2) {
      setSubmitError('Add at least 2 squad members with their names. / Lägg till minst 2 lagmedlemmar med namn.');
      document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (selectedProgram === 'submit-idea') {
      if (!studentName.trim()) {
        setSubmitError('Please enter your name.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (!schoolName.trim()) {
        setSubmitError('Please enter your school or organization name.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (!ideaTitle.trim()) {
        setSubmitError('Please provide a title for your idea.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    } else {
      if (isAssociation && associationWants.length === 0) {
        setSubmitError('Please choose what your group would like to take part in.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const requiredName = contactName;
      if (!requiredName.trim()) {
        setSubmitError('Please enter the contact person’s full name.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if ((applicantType === 'school' || isAssociation) && !schoolName.trim()) {
        setSubmitError('Please enter the school or association name.');
        document.getElementById('intake-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    setIsSubmitting(true);

    const selectedCityName = lockedLocation
      ? lockedLocation.cityName
      : isCustomCity
      ? (customCityName.trim() || 'Custom City')
      : (CITIES_BY_COUNTRY[countrySlug] || []).find((c) => c.slug === citySlug)?.name || citySlug;
    const selectedCountryName =
      lockedLocation?.countryName ?? (COUNTRIES.find((c) => c.slug === countrySlug)?.name || countrySlug);

    try {
      if (selectedProgram === 'submit-idea') {
        // --- 1. IDEA SUBMISSION WORKFLOW ---
        let uploadedPhotoUrl: string | null = null;
        let uploadedAudioUrl: string | null = null;
        let uploadedVideoUrl: string | null = null;

        // Upload photo if present
        if (photoFile) {
          uploadedPhotoUrl = await uploadIdeaMedia(photoFile, 'photos');
        }

        // Upload voice note if present
        if (voiceNoteFile) {
          uploadedAudioUrl = await uploadIdeaMedia(voiceNoteFile, 'audio');
        }

        // Upload video or save link
        if (videoInputType === 'upload' && videoFile) {
          uploadedVideoUrl = await uploadIdeaMedia(videoFile, 'videos');
        } else if (videoInputType === 'link' && videoLink.trim()) {
          uploadedVideoUrl = videoLink.trim();
        }

        const res = await submitIdea({
          student_name: studentName,
          student_age: studentAge,
          student_grade: studentGrade,
          contact_email: email,
          contact_phone: phone,
          school_name: schoolName,
          country_slug: countrySlug,
          city_slug: isCustomCity ? 'custom' : citySlug,
          city_name: selectedCityName,
          country_name: selectedCountryName,
          idea_title: ideaTitle,
          idea_description: ideaDescription,
          photo_url: uploadedPhotoUrl,
          voice_note_url: uploadedAudioUrl,
          video_url: uploadedVideoUrl,
          video_type:
            videoInputType === 'upload' && videoFile
              ? 'file'
              : videoLink.trim()
              ? 'link'
              : 'none',
          category: ideaCategory,
          problem_statement: problemStatement,
          beneficiaries,
          develop_further: developFurther,
          consent_agreed: consentAgreed,
          gdpr_agreed: gdprAgreed,
        });

        setGeneratedId(res.public_id);
        setSubmitSuccess(true);
      } else {
        // --- 2. WORKSHOP / DEMO / HACKATHON REGISTRATION WORKFLOW ---
        const formattedTimeRange = `${customTime} – ${customEndTime}`;
        // Associations register as an organisation (stored as registration_type 'school').
        const isOrg = applicantType === 'school' || isAssociation;
        const finalSchool = isOrg ? schoolName : teamName ? `${teamName} (Team)` : schoolName;

        const payload = {
          registration_type: isAssociation ? 'school' : applicantType,
          country_slug: countrySlug,
          city_slug: isCustomCity ? 'custom' : citySlug,
          city_name: selectedCityName,
          country_name: selectedCountryName,
          school_name: finalSchool,
          team_name: !isAssociation && applicantType === 'student' ? teamName : null,
          contact_name: contactName,
          email,
          phone,
          category_id:
            selectedProgram === 'hackathon'
              ? 'young-innovators-hackathon'
              : selectedProgram === 'demo'
              ? 'school-demo-session'
              : isAssociation
              ? 'association-group-programme'
              : `${lockedLocation?.citySlug ?? 'vasteras'}-school-workshop`,
          student_count: selectedProgram === 'hackathon' ? String(namedMembers.length) : studentCount,
          members: selectedProgram === 'hackathon' ? namedMembers : undefined,
          preferred_date: customDate ? `Custom Date: ${customDate}` : 'To be confirmed',
          custom_date: customDate || null,
          custom_time: selectedProgram === 'hackathon' ? null : customTime || null,
          time_range: selectedProgram === 'hackathon' ? null : formattedTimeRange,
          workshop_slot: 'custom',
          grade_group: gradeGroup,
          consent_agreed: consentAgreed,
          form_type: selectedProgram,
          intake_details: isAssociation
            ? {
                applicant_kind: 'association',
                association_type: associationType,
                would_like_to: associationWants,
                team_count: teamCount,
              }
            : showInterestCard
            ? {
                student_age: interestAge,
                would_like_to: wantsTo,
                experience,
                interests,
                guardian_name: guardianName,
                guardian_phone: guardianPhone,
              }
            : selectedProgram === 'hackathon'
            ? { squad_skills: hackathonSkills, challenge_domain: hackerChallengeDomain }
            : null,
        };

        const { data: publicId, error } = await supabase.rpc(
          'submit_eu_skola_registration',
          { payload }
        );

        if (error) {
          throw new Error(error.message || 'Failed to submit registration');
        }

        setGeneratedId((publicId as string) || 'REG-' + Math.floor(1000 + Math.random() * 9000));
        setSubmitSuccess(true);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Something went wrong while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${site.ideasPath}?idea=${generatedId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // ── Wizard copy ── Step 1 cards (who is registering) and step 2 cards (which programme).
  // "asks" lists what each form really asks for; "next" matches the confirmation screens.
  const audienceCopy: Record<Audience, { icon: typeof School; eyebrow: string; title: string; text: string; question: string; hint: string }> = {
    schools: {
      icon: School,
      eyebrow: L('I represent a school', 'Jag representerar en skola'),
      title: L('Schools & Educators', 'Skolor & lärare'),
      text: L(
        'Teachers, school leaders and coordinators who want robotics for their pupils.',
        'Lärare, skolledare och samordnare som vill ge sina elever robotik.'
      ),
      question: L('What would you like for your school?', 'Vad vill ni boka till er skola?'),
      hint: L(
        'Pick one. You can come back afterwards and book the other one too.',
        'Välj ett alternativ. Du kan komma tillbaka efteråt och boka det andra också.'
      ),
    },
    students: {
      icon: GraduationCap,
      eyebrow: L('I am a student', 'Jag är elev'),
      title: L('Students & Innovators', 'Elever & innovatörer'),
      text: L(
        'Students with an idea for a better future, and teams that want to compete.',
        'Elever med en idé för en bättre framtid, och lag som vill tävla.'
      ),
      question: L('How do you want to take part?', 'Hur vill du delta?'),
      hint: L(
        'Pick one. You can do both: just send them one at a time.',
        'Välj ett alternativ. Du kan göra båda – skicka in dem en i taget.'
      ),
    },
    community: {
      icon: Users,
      eyebrow: L('I want to get involved', 'Jag vill engagera mig'),
      title: L('Community & Volunteers', 'Föreningar & volontärer'),
      text: L(
        'Groups, clubs, volunteers and partners who want to take part or help out.',
        'Grupper, klubbar, volontärer och partner som vill delta eller hjälpa till.'
      ),
      question: L('How would you like to get involved?', 'Hur vill du engagera dig?'),
      hint: L('Pick the option that fits you.', 'Välj det alternativ som passar dig.'),
    },
  };

  const coordinatorNext = L(
    'Your request goes to the city coordinator, who contacts you to confirm the details.',
    'Förfrågan går till stadens samordnare, som kontaktar dig för att bekräfta detaljerna.'
  );
  const schoolAsks = L(
    'Your school (or group), a contact person, a preferred date and time, the grade group and the number of students.',
    'Er skola (eller grupp), en kontaktperson, önskat datum och tid, årskurs och antal elever.'
  );
  type ProgramCard = {
    icon: string; title: string; subtitle: string; desc: string; badge: string;
    forWho: string; asks: string; next: string; theme: 'blue' | 'emerald';
  };
  const programById: Record<IntakeProgramTab, ProgramCard> = {
    workshop: {
      icon: '🤖',
      title: L('School Workshop', 'Skolworkshop'),
      subtitle: L('Classroom Robotics', 'Robotik i klassrummet'),
      desc: L(
        '20 hours of hands-on STEM robotics curriculum, rover hardware kits, and training brought directly to your school.',
        '20 timmar praktisk STEM-robotik med läroplan, rover-kit och utbildning – direkt till er skola.'
      ),
      badge: L('Grades 1–9 & GYM', 'Åk 1–9 & gymnasiet'),
      forWho: L('Teachers and schools booking robotics for a class.', 'Lärare och skolor som vill boka robotik för en klass.'),
      asks: schoolAsks,
      next: coordinatorNext,
      theme: 'blue',
    },
    demo: {
      icon: '📢',
      title: L('School Demo Session', 'Demopass på skolan'),
      subtitle: L('Auditorium Showcase', 'Visning i aulan'),
      desc: L(
        'Live robotics demonstration session and interactive robot challenge trials in your school assembly hall.',
        'En live-demonstration av robotik och interaktiva robotutmaningar i skolans aula.'
      ),
      badge: L('Live Assembly', 'Live i aulan'),
      forWho: L('Schools that want a live robotics show for the whole school.', 'Skolor som vill ha en robotikvisning för hela skolan.'),
      asks: schoolAsks,
      next: coordinatorNext,
      theme: 'blue',
    },
    'submit-idea': {
      icon: '💡',
      title: L('Submit Innovation Idea', 'Skicka in en innovationsidé'),
      subtitle: 'Young Inno Hack',
      desc: L(
        'Submit your solution for a real-world problem via drawing, photo, voice recording, text, or video. Approved ideas go to public voting.',
        'Skicka in din lösning på ett verkligt problem som teckning, foto, röstinspelning, text eller video. Godkända idéer går vidare till publik röstning.'
      ),
      badge: L('Multimodal Pitch', 'Pitch i valfri form'),
      forWho: L('Individual students or two students together.', 'Enskilda elever eller två elever tillsammans.'),
      asks: L(
        'Your name, age and school, your idea and the problem it solves. You can add a drawing, photo, voice note or video.',
        'Ditt namn, ålder och skola, din idé och problemet den löser. Du kan lägga till en teckning, ett foto, ett röstmeddelande eller en video.'
      ),
      next: L(
        'A coordinator reviews your idea. Once approved, it appears on the public ideas page where people can vote.',
        'En samordnare granskar din idé. När den är godkänd visas den på den publika idésidan där alla kan rösta.'
      ),
      theme: 'emerald',
    },
    hackathon: {
      icon: '🏆',
      title: site.intake.squadTitle,
      subtitle: L('Championship Arena Squad', 'Lag till tävlingsarenan'),
      desc: site.intake.hackathonDesc,
      badge: L('Arena Showdown', 'Tävling'),
      forWho: L('Student teams of 2–4 members ready for a live competition.', 'Elevlag med 2–4 medlemmar som är redo för en live-tävling.'),
      asks: L(
        'Your school or team, a contact person and the 2–4 members of your squad with their grades.',
        'Er skola eller ert lag, en kontaktperson och lagets 2–4 medlemmar med årskurs.'
      ),
      next: L(
        'The coordinator reviews your squad and contacts you with the next steps.',
        'Samordnaren granskar er anmälan och kontaktar er med nästa steg.'
      ),
      theme: 'emerald',
    },
    association: {
      icon: '🤝',
      title: L('Group / Association', 'Grupp / förening'),
      subtitle: L('Community Youth Teams', 'Ungdomsgrupper i föreningar'),
      desc: L(
        'Register an after-school club, scout group, cultural association or youth organisation.',
        'Anmäl en fritidsklubb, scoutgrupp, kulturförening eller ungdomsorganisation.'
      ),
      badge: L('Community Intake', 'Föreningsanmälan'),
      forWho: L('Youth associations, after-school clubs and non-profits.', 'Ungdomsföreningar, fritidsklubbar och ideella organisationer.'),
      asks: L(
        "Your group's name and type, what you would like to take part in, a contact person, a preferred date and the number of children.",
        'Gruppens namn och typ, vad ni vill delta i, en kontaktperson, önskat datum och antal barn.'
      ),
      next: L(
        `${site.intake.associationContact.charAt(0).toUpperCase()}${site.intake.associationContact.slice(1)} will contact you to coordinate.`,
        'Vi kontaktar er för att samordna.'
      ),
      theme: 'blue',
    },
    volunteer: {
      icon: '🙋',
      title: L('Volunteer Crew', 'Volontärteam'),
      subtitle: L('Event Support & Mentorship', 'Eventstöd och mentorskap'),
      desc: site.intake.volunteerDesc || L(
        'Help guide young students, mentor workshop stations, and co-run championship event days.',
        'Hjälp unga elever, var mentor vid workshopstationer och hjälp till att driva tävlingsdagarna.'
      ),
      badge: L('Join The Team', 'Bli en del av teamet'),
      forWho: L('Parents, university mentors and STEM enthusiasts.', 'Föräldrar, universitetsmentorer och STEM-entusiaster.'),
      asks: L(
        'Your name and contact details, city, languages, T-shirt size and any volunteering experience. Under 18s also add a parent or guardian.',
        'Ditt namn och kontaktuppgifter, stad, språk, T-shirtstorlek och eventuell volontärerfarenhet. Är du under 18 anger du även en vårdnadshavare.'
      ),
      next: L('The team contacts you by email with the next steps.', 'Teamet kontaktar dig via e-post med nästa steg.'),
      theme: 'blue',
    },
    partner: {
      icon: extraForm?.icon || '🤝',
      title: extraForm?.title ?? L('Partner', 'Partner'),
      subtitle: extraForm?.subtitle ?? '',
      desc: extraForm?.desc ?? '',
      badge: L('Partner Intake', 'Partneranmälan'),
      forWho: L('Companies, institutions and organisations that want to collaborate.', 'Företag, institutioner och organisationer som vill samarbeta.'),
      asks: L(
        'Your organisation, a contact person and how you would like to take part.',
        'Er organisation, en kontaktperson och hur ni vill delta.'
      ),
      next: L('The team contacts you to talk about the partnership.', 'Teamet kontaktar er för att prata om samarbetet.'),
      theme: 'blue',
    },
  };

  const wizardSteps: { n: WizardStep; label: string }[] = [
    { n: 1, label: L('Who is registering', 'Vem anmäler') },
    { n: 2, label: L('Choose programme', 'Välj program') },
    { n: 3, label: L('Your details', 'Dina uppgifter') },
  ];
  // Step 3's Back goes somewhere only when an earlier step had a real choice.
  const canGoBack = !(onlyAudience && optionsFor(onlyAudience).length === 1);
  const canStartOver = !onlyAudience && !!audience && optionsFor(audience).length > 1;
  const stepClickable = (n: WizardStep) =>
    n < step && (n === 1 ? !onlyAudience : !!audience && optionsFor(audience).length > 1);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A1930] pt-24 pb-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            ← Back to Overview
          </button>
          {onNavigateVoting && (
            <button
              onClick={onNavigateVoting}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 uppercase transition-colors"
            >
              <span>⭐ View Ideas & Vote</span>
            </button>
          )}
        </div>

        {/* ── REGISTRATION WIZARD: 1 who is registering → 2 which programme → 3 the form ── */}
        <div id="register-wizard" className="mb-6 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
              <span>{site.intake.eyebrow}</span>
            </div>
            <h1 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0A1930]">
              {step === 1
                ? L('Who is registering?', 'Vem anmäler sig?')
                : step === 2 && audience
                ? audienceCopy[audience].question
                : L('Your details', 'Dina uppgifter')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              {step === 1
                ? L(
                    'Choose the option that fits you best. Next you pick a programme, then fill in a short form. You can go back at any step.',
                    'Välj det alternativ som passar dig bäst. Sedan väljer du program och fyller i ett kort formulär. Du kan gå tillbaka i varje steg.'
                  )
                : step === 2 && audience
                ? audienceCopy[audience].hint
                : L(
                    'Fill in the form below. Fields marked * are required.',
                    'Fyll i formuläret nedan. Fält markerade med * är obligatoriska.'
                  )}
            </p>
          </div>

          {/* Step indicator */}
          <ol className="flex items-center max-w-2xl mx-auto mb-8" aria-label={L('Registration steps', 'Steg i anmälan')}>
            {wizardSteps.map((s, i) => {
              const done = s.n < step;
              const current = s.n === step;
              return (
                <li key={s.n} className={`flex items-center ${i < wizardSteps.length - 1 ? 'flex-1' : ''}`}>
                  <button
                    type="button"
                    disabled={!stepClickable(s.n)}
                    onClick={() => goToStep(s.n)}
                    aria-current={current ? 'step' : undefined}
                    className="flex items-center gap-2 disabled:cursor-default enabled:hover:opacity-80"
                  >
                    <span
                      className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-mono-code font-bold border-2 ${
                        current
                          ? 'bg-[#0A1930] text-[#FFCD00] border-[#0A1930]'
                          : done
                          ? 'bg-[#006AA7] text-white border-[#006AA7]'
                          : 'bg-white text-slate-400 border-slate-300'
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : s.n}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-wider text-left leading-tight ${
                        current ? 'text-[#0A1930]' : done ? 'text-[#006AA7]' : 'text-slate-400'
                      } ${current ? '' : 'hidden sm:inline'}`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < wizardSteps.length - 1 && (
                    <span className={`flex-1 h-0.5 mx-2 sm:mx-3 ${done ? 'bg-[#006AA7]' : 'bg-slate-200'}`} />
                  )}
                </li>
              );
            })}
          </ol>

          {/* ── STEP 1: WHO IS REGISTERING ── */}
          {step === 1 && (
            <div
              className={`grid grid-cols-1 gap-4 ${
                shownAudiences.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'
              }`}
            >
              {shownAudiences.map((a) => {
                const copy = audienceCopy[a];
                const Icon = copy.icon;
                const emerald = a === 'students';
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => chooseAudience(a)}
                    className="group p-6 text-left bg-white border-2 border-slate-200 hover:border-[#0A1930] hover:shadow-lg transition-all flex flex-col cursor-pointer"
                  >
                    <span
                      className={`w-12 h-12 flex items-center justify-center mb-4 ${
                        emerald ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-[#006AA7]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <span
                      className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                        emerald ? 'text-emerald-700' : 'text-[#006AA7]'
                      }`}
                    >
                      {copy.eyebrow}
                    </span>
                    <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#0A1930] mt-1">
                      {copy.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">{copy.text}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {L('You can choose', 'Du kan välja')}
                      </span>
                      <ul className="space-y-1">
                        {optionsFor(a).map((t) => (
                          <li key={t} className="text-xs text-slate-700 flex items-center gap-2">
                            <span aria-hidden="true">{programById[t].icon}</span>
                            <span>{programById[t].title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-5">
                      <div className="w-full py-2.5 px-3 text-xs font-headline font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 group-hover:bg-[#0A1930] group-hover:text-[#FFCD00] transition-colors">
                        <span>{L('This is me', 'Det här är jag')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── STEP 2: WHICH PROGRAMME ── */}
          {step === 2 && audience && (
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                {!onlyAudience ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-headline font-bold uppercase tracking-wider border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{L('Back', 'Tillbaka')}</span>
                  </button>
                ) : (
                  <span />
                )}
                <span className="text-[11px] font-mono-code font-bold text-slate-500 uppercase tracking-wider">
                  {audienceCopy[audience].title}
                </span>
              </div>
              <div
                className={`grid grid-cols-1 gap-4 ${
                  optionsFor(audience).length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
                }`}
              >
                {optionsFor(audience).map((t) => {
                  const p = programById[t];
                  const emerald = p.theme === 'emerald';
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => openForm(t)}
                      className="group p-6 text-left bg-white border-2 border-slate-200 hover:border-[#0A1930] hover:shadow-lg transition-all flex flex-col cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl shrink-0 leading-none pt-0.5" aria-hidden="true">{p.icon}</span>
                          <div>
                            <h2 className="font-headline font-black text-lg uppercase tracking-tight text-[#0A1930] leading-snug">
                              {p.title}
                            </h2>
                            {p.subtitle && (
                              <p className={`text-xs font-mono-code font-semibold ${emerald ? 'text-emerald-600' : 'text-[#006AA7]'}`}>
                                {p.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 uppercase tracking-wider bg-slate-100 text-slate-600 shrink-0">
                          {p.badge}
                        </span>
                      </div>
                      {p.desc && <p className="text-sm text-slate-700 leading-relaxed mt-4">{p.desc}</p>}
                      <dl className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
                        {[
                          { k: L('Who it is for', 'Passar för'), v: p.forWho },
                          { k: L('The form asks for', 'Formuläret frågar efter'), v: p.asks },
                          { k: L('What happens next', 'Vad händer sedan'), v: p.next },
                        ].map(({ k, v }) => (
                          <div key={k}>
                            <dt className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500">{k}</dt>
                            <dd className="text-slate-700 leading-relaxed mt-0.5">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-auto pt-5">
                        <div
                          className={`w-full py-2.5 px-3 text-xs font-headline font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 transition-colors group-hover:text-white ${
                            emerald ? 'group-hover:bg-emerald-600' : 'group-hover:bg-[#006AA7]'
                          }`}
                        >
                          <span>{L('Continue with this', 'Fortsätt med detta')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: what was chosen, with a way back ── */}
          {step === 3 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white border border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                {canGoBack && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-headline font-bold uppercase tracking-wider border border-slate-300 text-slate-700 hover:bg-slate-50 shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{L('Back', 'Tillbaka')}</span>
                  </button>
                )}
                <div className="min-w-0">
                  {audience && (
                    <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                      {audienceCopy[audience].title}
                    </span>
                  )}
                  <span className="block font-headline font-black text-sm uppercase tracking-tight text-[#0A1930]">
                    {programById[selectedProgram].icon} {programById[selectedProgram].title}
                  </span>
                </div>
              </div>
              {canStartOver && (
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#006AA7] hover:underline"
                >
                  {L('Start over', 'Börja om')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── DYNAMIC INLINE FORM CONTAINER (step 3) ── */}
        {step === 3 && (
        <div
          id="intake-form-container"
          className={`bg-white border-2 border-t-8 shadow-xl p-6 sm:p-10 text-[#0A1930] relative scroll-mt-24 ${
            isHack ? 'border-[#059669]' : 'border-[#006AA7]'
          }`}
        >
          {selectedProgram === 'volunteer' ? (
            site.intake.volunteer ? (
              <VolunteerForm
                city={lockedLocation ?? undefined}
                eventOptions={site.intake.volunteer.eventOptions}
                eyebrow={site.intake.volunteer.eyebrow}
                intro={site.intake.volunteer.intro}
                teamName={site.intake.volunteer.teamName}
              />
            ) : (
              <VolunteerForm />
            )
          ) : selectedProgram === 'partner' && extraForm ? (
            extraForm.render()
          ) : !submitSuccess ? (
            <div>
              {/* Unified Clean Form Header */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className={`inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider uppercase ${isHack ? 'text-[#059669]' : 'text-[#006AA7]'}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Official Registration Intake · Season 2026</span>
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-500">{site.hero.badge}</span>
                </div>

                <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mt-1">
                  {selectedProgram === 'workshop' && '🤖 Book Hands-On Robotics Workshop'}
                  {selectedProgram === 'demo' && '📢 Request School Demonstration Session'}
                  {selectedProgram === 'association' && '🤝 Register Group or Association'}
                  {selectedProgram === 'submit-idea' && '💡 Submit Your Future Innovation Idea'}
                  {selectedProgram === 'hackathon' && `🏆 Register Squad for ${site.hackLabel}`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {selectedProgram === 'workshop' &&
                    'Select your custom preferred calendar date and time. We bring all hardware kits, mats, and 20-hr curriculum to your school.'}
                  {selectedProgram === 'demo' &&
                    'Bring an interactive robotics demonstration straight to your school auditorium or assembly hall.'}
                  {selectedProgram === 'association' &&
                    `For associations, clubs and community groups in Sweden. Tell us about your group — ${site.intake.associationContact} will contact you to coordinate.'`}
                  {selectedProgram === 'submit-idea' &&
                    'Express your vision with drawings, blueprints, photos, voice notes, text, or video to qualify for public voting!'}
                  {selectedProgram === 'hackathon' &&
                    'Form your student squad (2–4 members) to tackle real-world innovation challenges in the live arena finals.'}
                </p>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── LOCATION SELECTION (COUNTRY FIRST, THEN CITY / MUNICIPALITY) ── */}
                <div className={`p-4 border ${isHack ? 'bg-emerald-50/60 border-emerald-200' : 'bg-sky-50/70 border-sky-200'}`}>
                  <div className="flex items-center gap-2 text-xs font-headline font-black text-slate-800 uppercase tracking-wider mb-3">
                    <MapPin className={`w-4 h-4 ${isHack ? 'text-[#059669]' : 'text-[#006AA7]'}`} />
                    <span>Location / Plats</span>
                  </div>
                  {lockedLocation ? (
                    <p className="text-sm font-headline font-bold text-[#0A1930]">
                      {lockedLocation.cityName}, {lockedLocation.countryName}
                    </p>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Country / Land *
                      </label>
                      <select
                        required
                        value={countrySlug}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] font-medium"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        City / Stad *
                      </label>
                      <select
                        required
                        value={isCustomCity ? 'custom' : citySlug}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomCity(true);
                            setCitySlug('custom');
                          } else {
                            setIsCustomCity(false);
                            setCitySlug(e.target.value);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] font-medium"
                      >
                        {(CITIES_BY_COUNTRY[countrySlug] || []).map((ci) => (
                          <option key={ci.slug} value={ci.slug}>
                            {ci.name}
                          </option>
                        ))}
                        <option value="custom">+ Other city / Annan stad...</option>
                      </select>

                      {isCustomCity && (
                        <input
                          type="text"
                          required
                          value={customCityName}
                          onChange={(e) => setCustomCityName(e.target.value)}
                          placeholder="City name / Stadens namn"
                          className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930]"
                        />
                      )}
                    </div>
                  </div>
                  )}
                </div>

                {/* ── APPLICANT & SCHOOL MAPPING DETAILS ── */}
                <div className="space-y-4">
                  {/* For Demo & Workshop: School vs Individual switch */}
                  {(selectedProgram === 'workshop' || selectedProgram === 'demo') && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setApplicantType('school')}
                        className={`py-2 px-4 text-xs font-headline font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                          applicantType === 'school'
                            ? 'bg-[#006AA7] text-white border-[#006AA7]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>School / Skola</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicantType('student')}
                        className={`py-2 px-4 text-xs font-headline font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                          applicantType === 'student'
                            ? 'bg-[#006AA7] text-white border-[#006AA7]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Individual or group / Individ eller grupp</span>
                      </button>
                    </div>
                  )}

                  {/* School / Entity Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {isAssociation
                          ? 'Association or group name / Förening eller grupp *'
                          : selectedProgram === 'submit-idea'
                          ? 'School / Skola *'
                          : applicantType === 'school'
                          ? 'School / Skola *'
                          : 'Team name / Lagnamn (optional / frivilligt)'}
                      </label>
                      <input
                        type="text"
                        required={selectedProgram === 'submit-idea' || applicantType === 'school' || isAssociation}
                        list={isAssociation ? undefined : 'registered-schools-list'}
                        value={applicantType === 'school' || selectedProgram === 'submit-idea' || isAssociation ? schoolName : teamName}
                        onChange={(e) => {
                          if (applicantType === 'school' || selectedProgram === 'submit-idea' || isAssociation) {
                            setSchoolName(e.target.value);
                          } else {
                            setTeamName(e.target.value);
                          }
                        }}
                        placeholder={
                          lockedLocation
                            ? isAssociation
                              ? 'Association or group name'
                              : 'School name'
                            : isAssociation
                            ? 'e.g. Indisk Barnklubb Västerås'
                            : selectedProgram === 'submit-idea'
                            ? 'e.g. Viksängsskolan, MISV, Hydro Skola...'
                            : 'e.g. Viksängsskolan'
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930]"
                      />
                      {/* Datalist for autocomplete with existing registered schools */}
                      <datalist id="registered-schools-list">
                        {registeredSchools.map((s, idx) => (
                          <option key={idx} value={s.name} />
                        ))}
                      </datalist>
                      {selectedProgram === 'submit-idea' && !lockedLocation && (
                        <p className="text-[11px] font-mono-code text-slate-500 mt-1">
                          Tip: Submissions from registered schools (like Hydro or MISV) are
                          automatically grouped in their school admin panel!
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {selectedProgram === 'submit-idea'
                          ? 'Name / Namn *'
                          : applicantType === 'student' && selectedProgram !== 'hackathon' && !isAssociation
                          ? 'Student name / Elevens namn *'
                          : 'Contact person / Kontaktperson *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={selectedProgram === 'submit-idea' ? studentName : contactName}
                        onChange={(e) => {
                          if (selectedProgram === 'submit-idea') {
                            setStudentName(e.target.value);
                          } else {
                            setContactName(e.target.value);
                          }
                        }}
                        placeholder="Full name / Fullständigt namn"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email / E-post *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@school.se"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone / Telefon
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+46 70 123 4567"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>
                  </div>
                </div>

                {/* ── SECTION B2: GROUP / ASSOCIATION DETAILS ── */}
                {isAssociation && (
                  <div className="p-4 bg-sky-50/50 border border-sky-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-headline font-bold text-[#006AA7] uppercase tracking-wider">
                      <Building className="w-4 h-4" />
                      <span>About your group / Om er grupp</span>
                    </div>
                    <ChoiceGroup
                      label="Type of group / Typ av grupp"
                      options={ASSOCIATION_TYPE_OPTIONS}
                      selected={associationType ? [associationType] : []}
                      onToggle={(v) => setAssociationType(associationType === v ? '' : v)}
                    />
                    <ChoiceGroup
                      label="We would like / Vi vill gärna *"
                      options={ASSOCIATION_WANTS_OPTIONS}
                      selected={associationWants}
                      onToggle={(v) => toggleIn(associationWants, v, setAssociationWants)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Number of teams (if competing) / Antal lag
                        </label>
                        <input
                          type="text"
                          value={teamCount}
                          onChange={(e) => setTeamCount(e.target.value)}
                          placeholder="e.g. 2"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">
                      Grades 1–2 take part as participants, not as a competition category. Up to 4 teams per association
                      qualify for the Final. / Årskurs 1–2 deltar som deltagare, inte som tävlingskategori. Upp till 4 lag per
                      förening går vidare till finalen.
                    </p>
                  </div>
                )}

                {/* ── SECTION C: DATE & TIME (WORKSHOP, DEMO, ASSOCIATION); squads only give grade and size,
                     since the event date is fixed ── */}
                {selectedProgram !== 'submit-idea' && (
                  <div className={`p-4 border space-y-4 ${isHack ? 'bg-emerald-50/50 border-emerald-200' : 'bg-sky-50/50 border-sky-200'}`}>
                    <div className={`flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider ${isHack ? 'text-[#059669]' : 'text-[#006AA7]'}`}>
                      {selectedProgram === 'hackathon' ? <Users className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      <span>{selectedProgram === 'hackathon' ? 'Your squad / Ditt lag' : 'Date & time / Datum och tid'}</span>
                    </div>

                    {selectedProgram !== 'hackathon' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Customizable Date Picker */}
                      <div>
                        <label className="block text-[11px] font-mono-code font-bold uppercase text-slate-700 mb-1">
                          Date / Datum *
                        </label>
                        <input
                          type="date"
                          required
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm font-mono-code text-[#0A1930]"
                        />
                      </div>

                      {/* Customizable Start Time */}
                      <div>
                        <label className="block text-[11px] font-mono-code font-bold uppercase text-slate-700 mb-1">
                          Start time / Starttid *
                        </label>
                        <input
                          type="time"
                          required
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm font-mono-code text-[#0A1930]"
                        />
                      </div>

                      {/* Customizable End Time */}
                      <div>
                        <label className="block text-[11px] font-mono-code font-bold uppercase text-slate-700 mb-1">
                          End time / Sluttid *
                        </label>
                        <input
                          type="time"
                          required
                          value={customEndTime}
                          onChange={(e) => setCustomEndTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm font-mono-code text-[#0A1930]"
                        />
                      </div>
                    </div>
                    )}

                    {/* Grade Group & Cohort Count */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Grade / Årskurs
                        </label>
                        <select
                          value={gradeGroup}
                          onChange={(e) => setGradeGroup(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        >
                          {gradeOptions.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProgram !== 'hackathon' && (
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          {isAssociation ? 'Number of children / Antal barn' : 'Number of students / Antal elever'}
                        </label>
                        <input
                          type="text"
                          value={studentCount}
                          onChange={(e) => setStudentCount(e.target.value)}
                          placeholder="e.g. 25"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── SECTION C2: INTEREST CARD (INDIVIDUAL / GROUP STUDENTS) ── */}
                {showInterestCard && (
                  <div className="p-4 bg-sky-50/50 border border-sky-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-headline font-bold text-[#006AA7] uppercase tracking-wider">
                      <User className="w-4 h-4" />
                      <span>About the student / Om eleven</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Age / Ålder
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="20"
                          value={interestAge}
                          onChange={(e) => setInterestAge(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                    </div>

                    <ChoiceGroup
                      label="I would like to / Jag skulle vilja"
                      options={WANTS_TO_OPTIONS}
                      selected={wantsTo}
                      onToggle={(v) => toggleIn(wantsTo, v, setWantsTo)}
                    />
                    <ChoiceGroup
                      label="My experience / Min erfarenhet"
                      options={EXPERIENCE_OPTIONS}
                      selected={experience ? [experience] : []}
                      onToggle={(v) => setExperience(experience === v ? '' : v)}
                    />
                    <ChoiceGroup
                      label="What interests me / Det här intresserar mig"
                      options={INTEREST_OPTIONS}
                      selected={interests}
                      onToggle={(v) => toggleIn(interests, v, setInterests)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sky-200">
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Parent / Guardian name / Vårdnadshavarens namn *
                        </label>
                        <input
                          type="text"
                          required
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Parent / Guardian phone / Vårdnadshavarens telefon *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          placeholder="+46 70 123 4567"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">
                      Parent/guardian approval is required before final registration. / Vårdnadshavarens godkännande
                      krävs innan slutlig registrering.
                    </p>
                  </div>
                )}

                {/* ── SECTION D: MULTIMODAL IDEA SUBMISSION FIELDS (ONLY FOR SUBMIT IDEA) ── */}
                {selectedProgram === 'submit-idea' && (
                  <div className="space-y-5 p-5 bg-emerald-50/40 border border-emerald-200">
                    <div className="flex items-center gap-2 text-xs font-headline font-bold text-emerald-800 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      <span>Your idea / Din idé</span>
                    </div>

                    {/* Idea Title & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Idea title / Idéns titel *
                        </label>
                        <input
                          type="text"
                          required
                          value={ideaTitle}
                          onChange={(e) => setIdeaTitle(e.target.value)}
                          placeholder="e.g. Solar-Powered Smart Rover for School Recycled Sorting"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Choose an area / Välj ett område
                        </label>
                        <select
                          value={ideaCategory}
                          onChange={(e) => setIdeaCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                        >
                          {IDEA_AREAS.map((area) => (
                            <option key={area.value} value={area.value}>
                              {area.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Student Age & Grade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Age / Ålder
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="20"
                          value={studentAge}
                          onChange={(e) => setStudentAge(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Grade / Class / Årskurs / Klass
                        </label>
                        <input
                          type="text"
                          value={studentGrade}
                          onChange={(e) => setStudentGrade(e.target.value)}
                          placeholder="e.g. Grade 7B"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                      You do not need to know how to build it yet. Start with a problem or an idea.
                      <br />
                      Du behöver inte veta hur du ska bygga det ännu. Börja med ett problem eller en idé.
                    </p>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        1. What problem do you see? / Vilket problem ser du?
                      </label>
                      <textarea
                        rows={3}
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>

                    {/* 2. TYPE THE IDEA */}
                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>2. What is your idea? / Vad är din idé?</span>
                      </label>
                      <textarea
                        rows={4}
                        value={ideaDescription}
                        onChange={(e) => setIdeaDescription(e.target.value)}
                        placeholder="How does your idea work? / Hur fungerar din idé?"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        3. Who would your idea help? / Vem skulle din idé hjälpa?
                      </label>
                      <textarea
                        rows={2}
                        value={beneficiaries}
                        onChange={(e) => setBeneficiaries(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                      />
                    </div>

                    <ChoiceGroup
                      label="Would you like to develop this idea further? / Vill du utveckla idén vidare?"
                      options={DEVELOP_OPTIONS}
                      selected={developFurther ? [developFurther] : []}
                      onToggle={(v) => setDevelopFurther(developFurther === v ? '' : v)}
                      tone="green"
                    />

                    {/* 2. UPLOAD A PICTURE */}
                    <div className="p-4 bg-white border border-slate-200">
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#006AA7]" />
                        <span>Picture or drawing / Bild eller ritning</span>
                      </label>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-slate-600" />
                          <span>Choose Image (JPG, PNG, WebP)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>

                        {photoFile && (
                          <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{photoFile.name}</span>
                          </div>
                        )}
                      </div>

                      {photoPreview && (
                        <div className="mt-3 w-32 h-32 border border-slate-200 overflow-hidden bg-slate-50">
                          <img
                            src={photoPreview}
                            alt="Idea preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* 3. VOICE NOTE (IN-BROWSER MICROPHONE RECORDING) */}
                    <div>
                      <VoiceNoteRecorder onAudioReady={(file) => setVoiceNoteFile(file)} />
                    </div>

                    {/* 4. SUBMIT VIDEO (UPLOAD OR LINK) */}
                    <div className="p-4 bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-purple-600" />
                          <span>Video</span>
                        </label>
                        <div className="flex gap-1 text-[11px] font-mono-code">
                          <button
                            type="button"
                            onClick={() => setVideoInputType('link')}
                            className={`px-2 py-0.5 border ${
                              videoInputType === 'link'
                                ? 'bg-[#006AA7] text-white border-[#006AA7]'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            Paste Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoInputType('upload')}
                            className={`px-2 py-0.5 border ${
                              videoInputType === 'upload'
                                ? 'bg-[#006AA7] text-white border-[#006AA7]'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            Upload File
                          </button>
                        </div>
                      </div>

                      {videoInputType === 'link' ? (
                        <input
                          type="url"
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                          placeholder="Paste YouTube, Vimeo, Loom, or Google Drive video URL..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-purple-600 text-xs sm:text-sm text-[#0A1930]"
                        />
                      ) : (
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4 text-slate-600" />
                            <span>Select Video (MP4, WebM)</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoSelect}
                              className="hidden"
                            />
                          </label>

                          {videoFile && (
                            <div className="flex items-center gap-2 text-xs font-mono-code text-purple-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{videoFile.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── SECTION E: HACKATHON ROLES & DOMAIN (ONLY FOR HACKATHON) ── */}
                {selectedProgram === 'hackathon' && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-headline font-bold text-emerald-900 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Squad profile / Lagprofil</span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700">
                        Squad members (2–4) / Lagmedlemmar (2–4) *
                      </label>
                      {squadMembers.map((m, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={m.full_name}
                            onChange={(e) => setSquadMember(i, 'full_name', e.target.value)}
                            placeholder={`Member ${i + 1}: full name / Fullständigt namn`}
                            aria-label={`Member ${i + 1} name`}
                            maxLength={200}
                            className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                          />
                          <input
                            type="text"
                            value={m.grade}
                            onChange={(e) => setSquadMember(i, 'grade', e.target.value)}
                            placeholder="Grade / Åk"
                            aria-label={`Member ${i + 1} grade`}
                            maxLength={50}
                            className="w-28 sm:w-32 px-3 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                          />
                          {squadMembers.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setSquadMembers((list) => list.filter((_, j) => j !== i))}
                              aria-label={`Remove member ${i + 1}`}
                              title="Remove"
                              className="px-3 border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 text-sm"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      {squadMembers.length < 4 && (
                        <button
                          type="button"
                          onClick={() => setSquadMembers((list) => [...list, { full_name: '', grade: '' }])}
                          className="text-xs font-mono-code font-bold uppercase text-emerald-700 hover:underline"
                        >
                          + Add member / Lägg till medlem
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Squad skills / Lagets färdigheter
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Robotics & Hardware',
                          'Coding & Software',
                          '3D Design & CAD',
                          'Pitch & Storytelling',
                          'Science & Research',
                        ].map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`py-1.5 px-3 text-xs font-mono-code border transition-all ${
                              hackathonSkills.includes(skill)
                                ? 'bg-[#059669] text-white border-[#059669] font-bold'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Challenge area / Utmaningsområde
                      </label>
                      <select
                        value={hackerChallengeDomain}
                        onChange={(e) => setHackerChallengeDomain(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-[#0A1930]"
                      >
                        <option value="Sustainable Cities & Climate">
                          Sustainable Cities & Climate
                        </option>
                        <option value="Future School & Digital Learning">
                          Future School & Digital Learning
                        </option>
                        <option value="Autonomous Navigation & Rover Tech">
                          Autonomous Navigation & Rover Tech
                        </option>
                        <option value="Civic Accessibility & Healthcare">
                          Civic Accessibility & Healthcare
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ── SECTION E2: PARTICIPATION FEES (WORKSHOP, DEMO, ASSOCIATION, HACKATHON) ── */}
                {selectedProgram !== 'submit-idea' && site.intake.showFees && <ParticipationFees />}

                {/* ── SECTION F: CONSENT & GDPR CHECKBOXES ── */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#006AA7] border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 leading-snug">
                      I confirm that the details I submit are accurate. / Jag bekräftar att uppgifterna
                      jag lämnar är korrekta.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={gdprAgreed}
                      onChange={(e) => setGdprAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#006AA7] border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 leading-snug">
                      I accept the GDPR data protection policy and consent terms. / Jag godkänner
                      GDPR-policyn och villkoren för samtycke.
                    </span>
                  </label>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowGdprInfo(!showGdprInfo)}
                      className="text-[11px] font-mono-code text-[#006AA7] hover:underline"
                    >
                      {showGdprInfo ? '▲ Hide GDPR details' : '▼ Read GDPR & privacy terms'}
                    </button>
                    {showGdprInfo && (
                      <div className="mt-2 p-3 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-light">
                        Data controller: {site.organiser} in accordance with EU
                        GDPR regulations. Contact data and submission artifacts are used strictly
                        for workshop scheduling, idea evaluation, and league qualification.
                      </div>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div
                    id="submit-error-banner"
                    role="alert"
                    className="p-4 bg-red-50 border-2 border-red-300 flex items-center gap-3 text-xs sm:text-sm font-mono-code font-semibold text-red-700 shadow-xs animate-shake"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 text-white font-headline font-black text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99] ${
                    selectedProgram === 'submit-idea' || selectedProgram === 'hackathon'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#006AA7] hover:bg-[#013A63]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                      <span>
                        {selectedProgram === 'submit-idea'
                          ? 'Uploading Media & Submitting Idea...'
                          : 'Transmitting Registration...'}
                      </span>
                    </span>
                  ) : (
                    <>
                      <span>
                        {selectedProgram === 'workshop' && 'Submit Workshop Booking Request'}
                        {selectedProgram === 'demo' && 'Request School Demo Session'}
                        {selectedProgram === 'association' && 'Register Group / Association'}
                        {selectedProgram === 'submit-idea' && 'Submit Idea for Review'}
                        {selectedProgram === 'hackathon' && 'Register Hacker Squad'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#FFCD00]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ── SUBMISSION CONFIRMATION & CAMPAIGN SHARE SCREEN ── */
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-emerald-600 uppercase mb-1 block">
                SUCCESSFULLY RECORDED // INTAKE 2026
              </span>

              <h3 className="font-headline font-black text-3xl uppercase tracking-tight text-[#0A1930]">
                {selectedProgram === 'submit-idea'
                  ? 'Idea Submitted for Review!'
                  : 'Registration Request Received!'}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-light">
                {selectedProgram === 'submit-idea'
                  ? `Your idea has been securely recorded and mapped to your school admin panel for review. Once approved by the coordinator, it will appear on the public "View Ideas & Vote" page!`
                  : `Your booking request has been forwarded to the municipal coordinator. The coordinator will contact you at ${email} to confirm.`}
              </p>

              {/* Public Reference Token Badge */}
              <div className="my-6 p-4 bg-slate-50 border border-slate-200 w-full max-w-md text-center">
                <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1">
                  OFFICIAL ID TOKEN
                </span>
                <span className="font-mono-code font-bold text-xl text-[#006AA7] tracking-wider block">
                  {generatedId}
                </span>
                <span className="text-[11px] text-slate-500 font-mono-code block mt-1">
                  Status: Pending Coordinator Review
                </span>
              </div>

              {/* Share & Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {selectedProgram === 'submit-idea' && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Campaign Link Copied!' : 'Copy Campaign URL (Vote For My Idea)'}</span>
                  </button>
                )}

                {onNavigateVoting && (
                  <button
                    type="button"
                    onClick={onNavigateVoting}
                    className="py-3 px-5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>⭐ View Ideas & Vote</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setIdeaTitle('');
                    setIdeaDescription('');
                    setProblemStatement('');
                    setBeneficiaries('');
                    setDevelopFurther('');
                    setPhotoFile(null);
                    setPhotoPreview(null);
                    setVoiceNoteFile(null);
                    setVideoFile(null);
                    setVideoLink('');
                    setAssociationType('');
                    setAssociationWants([]);
                    setTeamCount('');
                  }}
                  className="py-3 px-5 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                >
                  Submit Another Request
                </button>

                {canStartOver && (
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0A1930] text-xs font-headline font-bold uppercase tracking-wider transition-colors"
                  >
                    {L('Register for something else', 'Anmäl till något annat')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
