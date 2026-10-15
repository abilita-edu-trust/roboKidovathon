// Idea submission (Young Inno Hack / RoboHack "Register your idea", esk "Bring your idea").
// The area is the theme card chosen before the form. Approved ideas go to public voting.
import React from 'react';
import { CheckCircle2, FileText, Image as ImageIcon, Lightbulb, Upload, Video } from 'lucide-react';
import { VoiceNoteRecorder } from '../../../components/VoiceNoteRecorder';
import { submitIdea, uploadIdeaMedia } from '../../../lib/ideasService';
import {
  Chips, FormDef, Grid, LocationFields, TextArea, TextField,
  chipLabels, labelCls, locationInitial, locationRow, resolveLocation, rows, str,
  type ChipOption, type FieldsProps,
} from '../ui';

const DEVELOP_OPTIONS: ChipOption[] = [
  { value: 'yes', en: 'Yes', sv: 'Ja' },
  { value: 'maybe', en: 'Maybe', sv: 'Kanske' },
  { value: 'just-submitting', en: 'Just submitting my idea', sv: 'Jag vill bara lämna in min idé' },
];

const fileName = (f: unknown) => (f instanceof File ? f.name : '');

const IdeaFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, sv } = ctx;
  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('photoFile', file);
    set('photoPreview', URL.createObjectURL(file));
  };
  const tab = (active: boolean) =>
    `px-2 py-0.5 border ${active ? 'bg-[#006AA7] text-white border-[#006AA7]' : 'bg-slate-100 text-slate-600 border-slate-200'}`;
  const uploadBtn =
    'py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors';

  return (
    <>
      <LocationFields {...props} />
      <Grid>
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={ctx.path.role === 'school' ? L('Student name', 'Elevens namn') : L('Name', 'Namn')}
          placeholder={L('Full name', 'Fullständigt namn')}
        />
        <TextField k="orgName" v={v} set={set} required list="registered-schools-list" label={L('School', 'Skola')} />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <div className="space-y-5 p-5 bg-emerald-50/40 border border-emerald-200">
        <div className="flex items-center gap-2 text-xs font-headline font-bold text-emerald-800 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <span>{L('Your idea', 'Din idé')}</span>
        </div>
        <TextField k="ideaTitle" v={v} set={set} required label={L('Idea title', 'Idéns titel')} placeholder={L('e.g. A solar-powered rover that sorts school recycling', 't.ex. En soldriven rover som sorterar skolans återvinning')} />
        <Grid>
          <TextField k="studentAge" v={v} set={set} type="number" min="6" max="20" label={L('Age', 'Ålder')} />
          <TextField k="studentGrade" v={v} set={set} label={L('Grade / class', 'Årskurs / klass')} placeholder={L('e.g. Grade 7B', 't.ex. 7B')} />
        </Grid>
        <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
          {L(
            'You do not need to know how to build it yet. Start with a problem or an idea.',
            'Du behöver inte veta hur du ska bygga det ännu. Börja med ett problem eller en idé.',
          )}
        </p>
        <TextArea k="problemStatement" v={v} set={set} label={L('1. What problem do you see?', '1. Vilket problem ser du?')} />
        <div>
          <label htmlFor="reg-ideaDescription" className={`${labelCls} flex items-center gap-1.5`}>
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{L('2. What is your idea?', '2. Vad är din idé?')}</span>
          </label>
          <textarea
            id="reg-ideaDescription"
            rows={4}
            value={v.ideaDescription ?? ''}
            onChange={(e) => set('ideaDescription', e.target.value)}
            placeholder={L('How does your idea work?', 'Hur fungerar din idé?')}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-600 focus:outline-none text-xs sm:text-sm text-[#0A1930]"
          />
        </div>
        <TextArea k="beneficiaries" v={v} set={set} rows={2} label={L('3. Who would your idea help?', '3. Vem skulle din idé hjälpa?')} />
        <Chips k="developFurther" v={v} set={set} sv={sv} green label={L('Would you like to develop this idea further?', 'Vill du utveckla idén vidare?')} options={DEVELOP_OPTIONS} />

        <div className="p-4 bg-white border border-slate-200">
          <span className={`${labelCls} mb-2 flex items-center gap-1.5`}>
            <ImageIcon className="w-3.5 h-3.5 text-[#006AA7]" />
            <span>{L('Picture or drawing', 'Bild eller ritning')}</span>
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <label className={uploadBtn}>
              <Upload className="w-4 h-4 text-slate-600" />
              <span>{L('Choose image (JPG, PNG, WebP)', 'Välj bild (JPG, PNG, WebP)')}</span>
              <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
            </label>
            {fileName(v.photoFile) && (
              <span className="flex items-center gap-2 text-xs font-mono-code text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                {fileName(v.photoFile)}
              </span>
            )}
          </div>
          {v.photoPreview && (
            <div className="mt-3 w-32 h-32 border border-slate-200 overflow-hidden bg-slate-50">
              <img src={v.photoPreview} alt={L('Idea preview', 'Förhandsvisning')} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <VoiceNoteRecorder onAudioReady={(file) => set('voiceFile', file)} />

        <div className="p-4 bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`${labelCls} mb-0 flex items-center gap-1.5`}>
              <Video className="w-3.5 h-3.5 text-[#006AA7]" />
              <span>Video</span>
            </span>
            <div className="flex gap-1 text-[11px] font-mono-code">
              <button type="button" onClick={() => set('videoMode', 'link')} className={tab(v.videoMode !== 'upload')}>
                {L('Paste link', 'Klistra in länk')}
              </button>
              <button type="button" onClick={() => set('videoMode', 'upload')} className={tab(v.videoMode === 'upload')}>
                {L('Upload file', 'Ladda upp fil')}
              </button>
            </div>
          </div>
          {v.videoMode === 'upload' ? (
            <div className="flex flex-wrap items-center gap-4">
              <label className={uploadBtn}>
                <Upload className="w-4 h-4 text-slate-600" />
                <span>{L('Select video (MP4, WebM)', 'Välj video (MP4, WebM)')}</span>
                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && set('videoFile', e.target.files[0])} className="hidden" />
              </label>
              {fileName(v.videoFile) && (
                <span className="flex items-center gap-2 text-xs font-mono-code text-[#006AA7]">
                  <CheckCircle2 className="w-4 h-4" />
                  {fileName(v.videoFile)}
                </span>
              )}
            </div>
          ) : (
            <input
              type="url"
              value={v.videoLink ?? ''}
              onChange={(e) => set('videoLink', e.target.value)}
              placeholder={L('Paste a YouTube, Vimeo, Loom or Google Drive link…', 'Klistra in en länk till YouTube, Vimeo, Loom eller Google Drive…')}
              aria-label={L('Video link', 'Videolänk')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930]"
            />
          )}
        </div>
      </div>
    </>
  );
};

export const ideaForm: FormDef = {
  title: (ctx) => ctx.L('Submit your innovation idea', 'Skicka in din innovationsidé'),
  intro: (ctx) =>
    ctx.L(
      'Share your idea as text, a drawing or photo, a voice note or a video. A coordinator reviews it, then it goes to public voting.',
      'Dela din idé som text, teckning eller foto, röstmeddelande eller video. En samordnare granskar den, sedan går den till publik röstning.',
    ),
  initial: (ctx) => ({ ...locationInitial(ctx.site), studentAge: '13', videoMode: 'link' }),
  Fields: IdeaFields,
  summary: (v, ctx) => {
    const { L, sv } = ctx;
    const video = v.videoMode === 'upload' ? fileName(v.videoFile) : str(v.videoLink);
    return [
      ...locationRow(v, ctx),
      ...rows(
        [L('Name', 'Namn'), str(v.contactName)],
        [L('School', 'Skola'), str(v.orgName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Age', 'Ålder'), str(v.studentAge)],
        [L('Grade / class', 'Årskurs / klass'), str(v.studentGrade)],
        [L('Idea title', 'Idéns titel'), str(v.ideaTitle)],
        [L('Problem', 'Problem'), str(v.problemStatement)],
        [L('Idea', 'Idé'), str(v.ideaDescription)],
        [L('Who it helps', 'Vem den hjälper'), str(v.beneficiaries)],
        [L('Develop further', 'Utveckla vidare'), chipLabels(v.developFurther, DEVELOP_OPTIONS, sv)],
        [L('Picture', 'Bild'), fileName(v.photoFile)],
        [L('Voice note', 'Röstmeddelande'), v.voiceFile ? L('Recorded', 'Inspelat') : ''],
        ['Video', video],
      ),
    ];
  },
  submit: async (v, ctx) => {
    const loc = resolveLocation(v, ctx.site);
    const photoUrl = v.photoFile instanceof File ? await uploadIdeaMedia(v.photoFile, 'photos') : null;
    const audioUrl = v.voiceFile instanceof File ? await uploadIdeaMedia(v.voiceFile, 'audio') : null;
    const upload = v.videoMode === 'upload' && v.videoFile instanceof File;
    const link = v.videoMode !== 'upload' ? str(v.videoLink) : '';
    const videoUrl = upload ? await uploadIdeaMedia(v.videoFile, 'videos') : link || null;
    const res = await submitIdea({
      language: ctx.language,
      student_name: str(v.contactName),
      student_age: str(v.studentAge),
      student_grade: str(v.studentGrade),
      contact_email: str(v.email),
      contact_phone: str(v.phone),
      school_name: str(v.orgName),
      country_slug: loc.country_slug,
      city_slug: loc.city_slug,
      city_name: loc.city_name,
      country_name: loc.country_name,
      idea_title: str(v.ideaTitle),
      idea_description: str(v.ideaDescription),
      photo_url: photoUrl,
      voice_note_url: audioUrl,
      video_url: videoUrl,
      video_type: upload ? 'file' : link ? 'link' : 'none',
      category: ctx.path.theme ?? '',
      problem_statement: str(v.problemStatement),
      beneficiaries: str(v.beneficiaries),
      develop_further: v.developFurther ?? '',
      consent_agreed: !!v.consentAgreed,
      gdpr_agreed: !!v.gdprAgreed,
    });
    return res.public_id;
  },
  submitLabel: (ctx) => ctx.L('Submit idea for review', 'Skicka idén för granskning'),
  done: (ctx) => ({
    title: ctx.L('Idea submitted for review!', 'Idén är inskickad för granskning!'),
    body: ctx.L(
      'Your idea is saved. Once a coordinator approves it, it appears on the public ideas page where people can vote.',
      'Din idé är sparad. När en samordnare har godkänt den visas den på den publika idésidan där alla kan rösta.',
    ),
  }),
};
