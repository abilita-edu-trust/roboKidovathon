// Young InnoHack with company challenges: step 1 (choose a challenge) and step 2 (on your own, create a team or join
// one). Joining needs the team's invite code, or (where the organisers allow listed teams) a team its captain listed.
// Only team names and sizes are shown; never who is in a team.
import React, { useEffect, useId, useState } from 'react';
import { Building2, Check, ChevronDown, KeyRound, Lock, Users } from 'lucide-react';
import type { Bilingual } from '../../context/SiteContext';
import {
  fetchOpenTeams, formatCode, lookupTeamCode, normaliseCode, teamSizeText,
  type OpenTeam, type TeamLookup, type YoungChallenge,
} from '../../content/youngChallenges';
import type { TeamChoice } from './flow';
import type { SetValue, Values } from './ui';

type L = (en: string, sv: string) => string;
type T = (b: Bilingual) => string;

const labelCls = 'block text-[15px] font-semibold text-[#0A1930] mb-1.5';
const inputCls =
  'w-full px-4 py-3 bg-white border-2 border-slate-300 focus:border-[#006AA7] focus:outline-none text-base text-[#0A1930] placeholder:text-slate-400';

/** Step 1: the published challenges, each with its company, problem and (on request) requirements. */
export const ChallengeStep: React.FC<{
  challenges: YoungChallenge[];
  selected?: string;
  onSelect: (id: string) => void;
  L: L;
  T: T;
}> = ({ challenges, selected, onSelect, L, T }) => (
  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4" aria-label={L('Company challenges', 'Utmaningar från företag')}>
    {challenges.map((c) => {
      const chosen = selected === c.id;
      const closed = !c.registration_open;
      const size = teamSizeText(c, L);
      return (
        <li key={c.id}>
          <div
            className={`h-full flex flex-col border-2 transition-colors ${
              chosen ? 'border-[#006AA7] bg-sky-50/70 shadow-md' : closed ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:border-[#0A1930]'
            }`}
          >
            <button
              type="button"
              onClick={() => !closed && onSelect(c.id)}
              aria-pressed={chosen}
              aria-disabled={closed || undefined}
              className={`text-left p-5 flex gap-4 items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7] ${closed ? 'cursor-not-allowed' : ''}`}
            >
              <span className="w-14 h-14 shrink-0 border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                {c.logo ? <img src={c.logo} alt="" className="max-w-full max-h-full object-contain" /> : <Building2 className="w-6 h-6 text-slate-400" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#006AA7]">{c.company}</span>
                <span className="block mt-0.5 font-headline font-bold text-xl leading-snug text-[#0A1930]">{T(c.title)}</span>
                <span className="block mt-2 text-base text-slate-700 leading-relaxed">{T(c.problem)}</span>
                <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4" aria-hidden="true" />
                    {size ? L(`Teams of ${size.toLowerCase()}`, `Lag med ${size.toLowerCase()}`) : L('Team size to be confirmed', 'Lagstorlek meddelas senare')}
                  </span>
                  <span>{L(`${c.teams} ${c.teams === 1 ? 'team' : 'teams'} so far`, `${c.teams} lag hittills`)}</span>
                </span>
              </span>
              <span
                className={`w-7 h-7 shrink-0 flex items-center justify-center border-2 ${chosen ? 'bg-[#006AA7] border-[#006AA7] text-white' : 'border-slate-300 text-transparent'}`}
                aria-hidden="true"
              >
                <Check className="w-4 h-4" />
              </span>
            </button>
            {!closed && c.full && (
              <p className="mx-5 mb-4 -mt-1 text-sm font-semibold text-[#0A1930]">
                {L('No room for new teams: join a team or take part on your own.', 'Ingen plats för nya lag: gå med i ett lag eller delta på egen hand.')}
              </p>
            )}
            {closed && (
              <p className="mx-5 mb-4 -mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#0A1930]">
                <Lock className="w-4 h-4 text-[#006AA7]" aria-hidden="true" />
                {L('Registration opens soon', 'Anmälan öppnar snart')}
              </p>
            )}
            {(T(c.requirements) || '').trim() && (
              <details className="group mt-auto border-t border-slate-200">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-5 py-3 text-[15px] font-semibold text-[#006AA7] [&::-webkit-details-marker]:hidden">
                  {L('What teams deliver', 'Vad lagen ska leverera')}
                  <ChevronDown className="w-4 h-4 motion-safe:transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-4 text-base text-slate-700 leading-relaxed whitespace-pre-line">{T(c.requirements)}</p>
              </details>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

/** Step 2's answer is complete: a team name, a checked invite code, or a listed team. '' when it is. */
export function teamStepError(choice: TeamChoice | undefined, v: Values, L: L): string {
  if (!choice) return L('Choose how you take part.', 'Välj hur du deltar.');
  if (choice === 'create') {
    const name = String(v.teamName ?? '').trim().replace(/\s+/g, ' ');
    return name.length < 2 || name.length > 60 ? L('Give your team a name (2–60 characters).', 'Ge laget ett namn (2–60 tecken).') : '';
  }
  if (choice === 'join') {
    if (v.joinTeamId) return '';
    if (!v.joinChecked) return L('Enter your team’s invite code and check it.', 'Skriv lagets inbjudningskod och kontrollera den.');
    return v.joinJoinable ? '' : L('This team can’t take new members. Choose another way to take part.', 'Laget kan inte ta emot fler. Välj ett annat sätt att delta.');
  }
  return '';
}

/** Step 2: on your own, a new team, or joining one of this challenge's teams. */
export const TeamStep: React.FC<{
  challenge: YoungChallenge;
  choice?: TeamChoice;
  onChoose: (c: TeamChoice) => void;
  v: Values;
  set: SetValue;
  L: L;
  T: T;
}> = ({ challenge, choice, onChoose, v, set, L, T }) => {
  const nameId = useId();
  const codeId = useId();
  const [checking, setChecking] = useState(false);
  const [codeMsg, setCodeMsg] = useState('');
  const [open, setOpen] = useState<OpenTeam[] | null>(null);
  const size = teamSizeText(challenge, L);

  // Listed teams (only where the organisers allow them).
  useEffect(() => {
    if (choice !== 'join' || !challenge.listed_teams) return;
    let live = true;
    fetchOpenTeams(challenge.id).then((teams) => live && setOpen(teams));
    return () => {
      live = false;
    };
  }, [choice, challenge.id, challenge.listed_teams]);

  const check = async () => {
    const code = normaliseCode(String(v.joinCode ?? ''));
    set('joinTeamId', '');
    if (code.length !== 10) {
      setCodeMsg(L('An invite code has 10 letters and digits.', 'En inbjudningskod har 10 bokstäver och siffror.'));
      set('joinChecked', false);
      return;
    }
    setChecking(true);
    setCodeMsg('');
    try {
      const found: TeamLookup | null = await lookupTeamCode(code);
      if (!found || found.challenge_id !== challenge.id) {
        set('joinChecked', false);
        setCodeMsg(
          found
            ? L('That code is for a team in another challenge. Go back and choose that challenge.', 'Koden gäller ett lag i en annan utmaning. Gå tillbaka och välj den utmaningen.')
            : L('No team has that code. Check it with your captain.', 'Inget lag har den koden. Kontrollera den med din lagkapten.'),
        );
        return;
      }
      set('joinCode', code);
      set('joinChecked', true);
      set('joinJoinable', found.joinable);
      set('joinTeamName', found.team);
      setCodeMsg('');
    } catch {
      setCodeMsg(L('Too many attempts from this network. Please try again later.', 'För många försök från det här nätverket. Försök igen senare.'));
    } finally {
      setChecking(false);
    }
  };

  const cards: { id: TeamChoice; title: string; desc: string; disabled?: string }[] = [
    { id: 'individual', title: L('On my own', 'På egen hand'), desc: L('Register alone. The organisers can match you with a team.', 'Anmäl dig själv. Arrangörerna kan matcha dig med ett lag.') },
    {
      id: 'create',
      title: L('Create a team', 'Skapa ett lag'),
      desc: L('You become the captain and get an invite code for your teammates.', 'Du blir lagkapten och får en inbjudningskod till lagkamraterna.'),
      disabled: challenge.full ? L('This challenge has no room for more teams.', 'Utmaningen har inte plats för fler lag.') : undefined,
    },
    { id: 'join', title: L('Join a team', 'Gå med i ett lag'), desc: L('Use the invite code from your captain.', 'Använd inbjudningskoden från din lagkapten.') },
  ];

  return (
    <div className="space-y-6">
      <p className="flex items-center gap-2 text-base text-slate-700">
        <Users className="w-5 h-5 text-[#006AA7]" aria-hidden="true" />
        <span>
          <span className="font-semibold text-[#0A1930]">{challenge.company}: {T(challenge.title)}</span>
          {' · '}
          {size ? L(`Teams of ${size.toLowerCase()}`, `Lag med ${size.toLowerCase()}`) : L('Team size to be confirmed', 'Lagstorlek meddelas senare')}
        </span>
      </p>

      <div role="radiogroup" aria-label={L('How you take part', 'Hur du deltar')} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const chosen = choice === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={chosen}
              aria-disabled={c.disabled ? true : undefined}
              onClick={() => !c.disabled && onChoose(c.id)}
              className={`text-left p-5 border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7] ${
                chosen ? 'border-[#006AA7] bg-sky-50/70 shadow-md' : c.disabled ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-[#0A1930]'
              }`}
            >
              <span className="block font-headline font-bold text-lg text-[#0A1930]">{c.title}</span>
              <span className="block mt-1 text-[15px] text-slate-600 leading-relaxed">{c.disabled ?? c.desc}</span>
            </button>
          );
        })}
      </div>

      {choice === 'create' && (
        <div className="p-5 border-2 border-sky-200 bg-sky-50/50 space-y-4">
          <div>
            <label htmlFor={nameId} className={labelCls}>{L('Team name', 'Lagnamn')} *</label>
            <input
              id={nameId}
              className={inputCls}
              value={String(v.teamName ?? '')}
              onChange={(e) => set('teamName', e.target.value)}
              maxLength={60}
              autoComplete="off"
              placeholder={L('For example: Night Owls', 'Till exempel: Nattugglorna')}
            />
            <p className="mt-1.5 text-sm text-slate-600">{L('Other teams see this name. Please don’t use people’s names.', 'Andra lag ser namnet. Använd inte personers namn.')}</p>
          </div>
          {challenge.listed_teams && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!v.teamListed} onChange={(e) => set('teamListed', e.target.checked)} className="mt-1 w-5 h-5 accent-[#006AA7]" />
              <span className="text-base text-slate-700">
                {L('List my team so others in this challenge can join without the code', 'Visa mitt lag så att andra i utmaningen kan gå med utan kod')}
                <span className="block text-sm text-slate-600">{L('Only the team name and its size are shown.', 'Bara lagets namn och storlek visas.')}</span>
              </span>
            </label>
          )}
        </div>
      )}

      {choice === 'join' && (
        <div className="p-5 border-2 border-sky-200 bg-sky-50/50 space-y-5">
          <div>
            <label htmlFor={codeId} className={labelCls}>{L('Invite code', 'Inbjudningskod')}</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id={codeId}
                className={`${inputCls} font-mono tracking-widest uppercase sm:max-w-xs`}
                value={String(v.joinCode ?? '')}
                onChange={(e) => {
                  set('joinCode', e.target.value);
                  set('joinChecked', false);
                }}
                maxLength={14}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="ABCDE-FGHJK"
                aria-describedby={`${codeId}-msg`}
              />
              <button
                type="button"
                onClick={check}
                disabled={checking}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0A1930] hover:bg-[#006AA7] text-white text-base font-semibold disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" aria-hidden="true" />
                {checking ? L('Checking…', 'Kontrollerar…') : L('Check code', 'Kontrollera koden')}
              </button>
            </div>
            <div id={`${codeId}-msg`} aria-live="polite" className="mt-2 text-[15px]">
              {v.joinChecked && !v.joinTeamId ? (
                v.joinJoinable ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    {L(`You will join ${v.joinTeamName} (code ${formatCode(String(v.joinCode))}).`, `Du går med i ${v.joinTeamName} (kod ${formatCode(String(v.joinCode))}).`)}
                  </span>
                ) : (
                  <span className="font-semibold text-red-700">{L(`${v.joinTeamName} is not taking new members.`, `${v.joinTeamName} tar inte emot fler medlemmar.`)}</span>
                )
              ) : (
                codeMsg && <span className="font-semibold text-red-700">{codeMsg}</span>
              )}
            </div>
          </div>

          {challenge.listed_teams && open && open.length > 0 && (
            <fieldset>
              <legend className={labelCls}>{L('Or join a team that welcomes new members', 'Eller gå med i ett lag som välkomnar nya medlemmar')}</legend>
              <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
                {open.map((t) => (
                  <li key={t.id}>
                    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                      <input
                        type="radio"
                        name="young-open-team"
                        checked={v.joinTeamId === t.id}
                        onChange={() => {
                          set('joinTeamId', t.id);
                          set('joinTeamName', t.name);
                          set('joinChecked', false);
                        }}
                        className="w-5 h-5 accent-[#006AA7]"
                      />
                      <span className="text-base font-semibold text-[#0A1930]">{t.name}</span>
                      <span className="text-sm text-slate-600">
                        {L(`${t.members} ${t.members === 1 ? 'member' : 'members'}`, `${t.members} ${t.members === 1 ? 'medlem' : 'medlemmar'}`)}
                        {t.spaces != null && L(` · ${t.spaces} ${t.spaces === 1 ? 'place' : 'places'} left`, ` · ${t.spaces} ${t.spaces === 1 ? 'plats' : 'platser'} kvar`)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}
        </div>
      )}
    </div>
  );
};
