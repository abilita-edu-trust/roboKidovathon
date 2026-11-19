// Young InnoHack with company challenges: step 1 (on your own, start a team or join one) and step 2 (two different
// challenge choices; a team's choices, read-only, for someone joining it). Organisers allocate the final challenge;
// nothing here promises a first choice. Only team names, sizes and choices are shown, never who is in a team.
import React, { useEffect, useId, useState } from 'react';
import { Check, ChevronDown, KeyRound, Lock, User, Users } from 'lucide-react';
import type { Bilingual } from '../../context/SiteContext';
import {
  challengeName, fetchOpenTeams, lookupTeamCode, normaliseCode, teamSizeText,
  type OpenTeam, type YoungChallenge, type YoungSite, type YoungState,
} from '../../content/youngChallenges';
import { ChoiceGroup } from './ChoiceCards';
import type { TeamChoice } from './flow';
import type { SetValue, Values } from './ui';

type L = (en: string, sv: string) => string;
type T = (b: Bilingual) => string;

const labelCls = 'block text-[15px] font-semibold text-[#0A1930] mb-1.5';
const inputCls =
  'w-full px-4 py-3 bg-white border-2 border-slate-300 focus:border-[#0A1930] focus:outline-none text-base text-[#0A1930] placeholder:text-slate-400';

/** Step 1's answer is complete: a team name, a checked joinable code, or a listed team. '' when it is. */
export function teamStepError(choice: TeamChoice | undefined, v: Values, L: L): string {
  if (!choice) return L('Choose how you will take part.', 'Välj hur du vill delta.');
  if (choice === 'create') {
    const name = String(v.teamName ?? '').trim().replace(/\s+/g, ' ');
    return name.length < 2 || name.length > 60 ? L('Give your team a name (2–60 characters).', 'Ge laget ett namn (2–60 tecken).') : '';
  }
  if (choice === 'join') {
    if (v.joinTeamId) return '';
    if (!v.joinChecked) return L('Enter your team’s code and check it first.', 'Skriv lagets kod och kontrollera den först.');
    return v.joinJoinable ? '' : L('That team can’t take more people. Choose another way to take part.', 'Laget kan inte ta emot fler. Välj ett annat sätt att delta.');
  }
  return '';
}

/** Step 2's answer is complete. */
export const choicesError = (first: string | undefined, second: string | undefined, L: L) =>
  first && second && first !== second ? '' : L('Choose a first and a second challenge.', 'Välj en första och en andra utmaning.');

const ChallengeHead: React.FC<{ c: YoungChallenge; T: T }> = ({ c, T }) => (
  <div className="flex gap-3.5 items-start">
    {c.logo && (
      <span className="shrink-0 w-14 h-14 border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
        <img src={c.logo} alt="" className="max-w-full max-h-full object-contain" />
      </span>
    )}
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-[#006AA7]">{c.company}</span>
      <span className="block font-headline font-bold text-lg leading-snug text-[#0A1930]">{T(c.title)}</span>
      {T(c.short) && <span className="block mt-1.5 text-[15px] leading-relaxed text-slate-700">{T(c.short)}</span>}
    </span>
  </div>
);

const ChallengeMore: React.FC<{ c: YoungChallenge; L: L; T: T }> = ({ c, L, T }) =>
  T(c.problem) || T(c.requirements) ? (
    <details className="group mt-3 border-t border-slate-200">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-2 pt-3 text-[15px] font-semibold text-[#0A1930] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0A1930] [&::-webkit-details-marker]:hidden">
        {L('More about this challenge', 'Mer om utmaningen')}
        <ChevronDown className="w-4 h-4 motion-safe:transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      {T(c.problem) && (
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">
          <b className="block text-[#0A1930]">{L('The problem', 'Problemet')}</b>
          {T(c.problem)}
        </p>
      )}
      {T(c.requirements) && (
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">
          <b className="block text-[#0A1930]">{L('What teams deliver', 'Vad lagen ska leverera')}</b>
          {T(c.requirements)}
        </p>
      )}
    </details>
  ) : null;

/** Published challenges, read-only (while registration is closed, and on Find Your Path). */
export const ChallengeList: React.FC<{ challenges: YoungChallenge[]; L: L; T: T }> = ({ challenges, L, T }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {challenges.map((c) => (
      <li key={c.id} className="border-2 border-[#E1E7EF] bg-white p-5">
        <ChallengeHead c={c} T={T} />
        <ChallengeMore c={c} L={L} T={T} />
      </li>
    ))}
  </ul>
);

/** A challenge is published but registration is not open yet: "Registration opening soon" and the challenges, read-only
 *  (this replaces Young InnoHack's general form until the organisers open registration). */
export const ChallengesClosed: React.FC<{ state: YoungState; L: L; T: T }> = ({ state, L, T }) => (
  <div className="space-y-5">
    <p className="flex items-center gap-2.5 p-4 bg-[#FFF8E1] border border-[#F3DE9A] text-[15px] font-semibold text-[#0A1930]">
      <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
      {L('Registration opening soon: you can read the challenges now, but not register yet.', 'Anmälan öppnar snart: du kan läsa om utmaningarna nu, men inte anmäla dig än.')}
    </p>
    <ChallengeList challenges={state.challenges} L={L} T={T} />
  </div>
);

/** Step 1: on your own, start a team, or join one. */
export const TeamStep: React.FC<{
  state: YoungState;
  site: YoungSite;
  choice?: TeamChoice;
  onChoose: (c: TeamChoice) => void;
  /** A checked code or a chosen listed team: the team's two choices (none: cleared). */
  onTeamChoices: (first?: string, second?: string) => void;
  v: Values;
  set: SetValue;
  L: L;
  T: T;
}> = ({ state, site, choice, onChoose, onTeamChoices, v, set, L, T }) => {
  const nameId = useId();
  const codeId = useId();
  const [checking, setChecking] = useState(false);
  const [codeMsg, setCodeMsg] = useState('');
  const [open, setOpen] = useState<OpenTeam[] | null>(null);
  const size = teamSizeText(state.teamSizeMin, state.teamSizeMax, L);
  const byId = (id: string) => state.challenges.find((c) => c.id === id);

  useEffect(() => {
    if (choice !== 'join' || !state.listedTeams) return;
    let live = true;
    fetchOpenTeams(site).then((teams) => live && setOpen(teams));
    return () => {
      live = false;
    };
  }, [choice, site, state.listedTeams]);

  const check = async () => {
    const code = normaliseCode(String(v.joinCode ?? ''));
    set('joinTeamId', '');
    onTeamChoices();
    if (code.length !== 10) {
      setCodeMsg(L('A team code has 10 letters and numbers.', 'En lagkod har 10 bokstäver och siffror.'));
      set('joinChecked', false);
      return;
    }
    setChecking(true);
    setCodeMsg('');
    try {
      const found = await lookupTeamCode(code);
      if (!found) {
        set('joinChecked', false);
        setCodeMsg(L('No team has that code. Ask your captain to check it.', 'Inget lag har den koden. Be din lagkapten kontrollera den.'));
        return;
      }
      set('joinCode', code);
      set('joinChecked', true);
      set('joinJoinable', found.joinable);
      set('joinTeamName', found.team);
      onTeamChoices(found.first_choice, found.second_choice);
    } catch {
      setCodeMsg(L('Too many tries from this network. Please try again later.', 'För många försök från det här nätverket. Försök igen senare.'));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <ChoiceGroup
        label={L('How you take part', 'Hur du deltar')}
        accent="hack"
        columns={3}
        value={choice}
        onChoose={(id) => onChoose(id as TeamChoice)}
        items={[
          { id: 'individual', icon: User, title: L('On my own', 'På egen hand'), desc: L('Register alone. The organisers can put you in a team with others.', 'Anmäl dig själv. Arrangörerna kan sätta ihop dig med andra i ett lag.') },
          { id: 'create', icon: Users, title: L('Start a team', 'Starta ett lag'), desc: L('You choose the challenges and get a code for your teammates.', 'Du väljer utmaningarna och får en kod till dina lagkamrater.') },
          { id: 'join', icon: KeyRound, title: L('Join a team', 'Gå med i ett lag'), desc: L('Use the code your captain sent you.', 'Använd koden från din lagkapten.') },
        ]}
      />
      <p className="text-[15px] text-slate-600">
        {size ? L(`Teams are ${size}.`, `Lagen har ${size}.`) : L('The organisers will confirm the team size.', 'Arrangörerna bekräftar lagstorleken.')}
      </p>

      {choice === 'create' && (
        <div className="p-5 border-2 border-[#F3DE9A] bg-[#FFF8E1] space-y-4">
          <div>
            <label htmlFor={nameId} className={labelCls}>
              {L('Team name', 'Lagnamn')} <span aria-hidden="true">*</span>
            </label>
            <input
              id={nameId}
              className={inputCls}
              value={String(v.teamName ?? '')}
              onChange={(e) => set('teamName', e.target.value)}
              maxLength={60}
              autoComplete="off"
              aria-describedby={`${nameId}-help`}
            />
            <p id={`${nameId}-help`} className="mt-1.5 text-sm text-slate-600">
              {L('Other teams see this name, so leave out people’s names.', 'Andra lag ser namnet, så skriv inga personnamn.')}
            </p>
          </div>
          {state.listedTeams && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!v.teamListed} onChange={(e) => set('teamListed', e.target.checked)} className="mt-1 w-5 h-5 accent-[#0A1930]" />
              <span className="text-base text-slate-700">
                {L('Let others find the team and join without the code', 'Låt andra hitta laget och gå med utan kod')}
                <span className="block text-sm text-slate-600">{L('Only the team name, its size and its choices are shown.', 'Bara lagets namn, storlek och val visas.')}</span>
              </span>
            </label>
          )}
        </div>
      )}

      {choice === 'join' && (
        <div className="p-5 border-2 border-[#F3DE9A] bg-[#FFF8E1] space-y-5">
          <div>
            <label htmlFor={codeId} className={labelCls}>{L('Team code', 'Lagkod')}</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id={codeId}
                className={`${inputCls} font-mono tracking-widest uppercase sm:max-w-xs`}
                value={String(v.joinCode ?? '')}
                onChange={(e) => {
                  set('joinCode', e.target.value);
                  set('joinChecked', false);
                  onTeamChoices();
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0A1930] hover:bg-[#1E3A5F] text-white text-base font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0A1930]"
              >
                <KeyRound className="w-4 h-4" aria-hidden="true" />
                {checking ? L('Checking…', 'Kontrollerar…') : L('Check the code', 'Kontrollera koden')}
              </button>
            </div>
            <div id={`${codeId}-msg`} aria-live="polite" className="mt-2 text-[15px]">
              {v.joinChecked && !v.joinTeamId ? (
                v.joinJoinable ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-800">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    {L(`You’ll join ${v.joinTeamName}.`, `Du går med i ${v.joinTeamName}.`)}
                  </span>
                ) : (
                  <span className="font-semibold text-red-700">{L(`${v.joinTeamName} is full or not taking new people.`, `${v.joinTeamName} är fullt eller tar inte emot fler.`)}</span>
                )
              ) : (
                codeMsg && <span className="font-semibold text-red-700">{codeMsg}</span>
              )}
            </div>
          </div>

          {state.listedTeams && open && open.length > 0 && (
            <fieldset>
              <legend className={labelCls}>{L('Or join a team that’s looking for people', 'Eller gå med i ett lag som söker fler')}</legend>
              <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
                {open.map((t) => (
                  <li key={t.id}>
                    <label className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 cursor-pointer">
                      <input
                        type="radio"
                        name="young-open-team"
                        checked={v.joinTeamId === t.id}
                        onChange={() => {
                          set('joinTeamId', t.id);
                          set('joinTeamName', t.name);
                          set('joinChecked', false);
                          onTeamChoices(t.first_choice, t.second_choice);
                        }}
                        className="w-5 h-5 accent-[#0A1930]"
                      />
                      <span className="text-base font-semibold text-[#0A1930]">{t.name}</span>
                      <span className="text-sm text-slate-600">
                        {L(`${t.members} in the team`, `${t.members} i laget`)}
                        {t.spaces != null && L(` · room for ${t.spaces} more`, ` · plats för ${t.spaces} till`)}
                      </span>
                      <span className="basis-full text-sm text-slate-600 pl-8">
                        {L('Choices', 'Val')}: 1. {challengeName(byId(t.first_choice), T)} · 2. {challengeName(byId(t.second_choice), T)}
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

/** Step 2: two different challenges (1st and 2nd), or the team's two, read-only, for someone joining it. */
export const ChoicesStep: React.FC<{
  state: YoungState;
  joining: boolean;
  teamName?: string;
  first?: string;
  second?: string;
  onChange: (first?: string, second?: string) => void;
  L: L;
  T: T;
}> = ({ state, joining, teamName, first, second, onChange, L, T }) => {
  const uid = useId();
  const [said, setSaid] = useState('');
  const byId = (id?: string) => state.challenges.find((c) => c.id === id);
  const notShown = L('a challenge that is no longer shown', 'en utmaning som inte längre visas');

  if (joining) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-[#FFF8E1] border border-[#F3DE9A] space-y-1.5 text-base">
          <p><b>{L('1st choice', '1:a val')}:</b> {challengeName(byId(first), T) || notShown}</p>
          <p><b>{L('2nd choice', '2:a val')}:</b> {challengeName(byId(second), T) || notShown}</p>
        </div>
        <p className="text-[15px] text-slate-600">
          {L(
            `${teamName ?? 'Your team'}’s captain chose these for the whole team. The organisers decide the final match for the team.`,
            `Lagkaptenen i ${teamName ?? 'laget'} valde dem för hela laget. Arrangörerna bestämmer vilken utmaning laget får.`,
          )}
        </p>
      </div>
    );
  }

  const pick = (place: 1 | 2, id: string) => {
    if (place === 1) onChange(id, second === id ? undefined : second);
    else onChange(first === id ? undefined : first, id);
    setSaid(`${place === 1 ? L('1st choice', 'Första val') : L('2nd choice', 'Andra val')}: ${challengeName(byId(id), T)}.`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#F2F6FA] border-l-4 border-[#0A1930] space-y-1 text-base" aria-hidden="true">
        <p>{L('1st choice', '1:a val')}: <b>{challengeName(byId(first), T) || L('not chosen yet', 'inte valt än')}</b></p>
        <p>{L('2nd choice', '2:a val')}: <b>{challengeName(byId(second), T) || L('not chosen yet', 'inte valt än')}</b></p>
      </div>
      <p className="sr-only" aria-live="polite">{said}</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.challenges.map((c) => {
          const place = c.id === first ? 1 : c.id === second ? 2 : 0;
          return (
            <li
              key={c.id}
              data-challenge-card=""
              className={`relative flex flex-col border-2 transition-colors motion-reduce:transition-none ${
                place ? 'border-[#0A1930] shadow-[inset_0_0_0_1px_#0A1930] bg-[#FFF8E1]' : 'border-[#E1E7EF] bg-white'
              }`}
            >
              {place > 0 && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0A1930]" aria-hidden="true">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#FFCD00] border-2 border-[#0A1930]">{place}</span>
                  {place === 1 ? L('1st choice', '1:a val') : L('2nd choice', '2:a val')}
                </span>
              )}
              <div className="p-5 pr-28">
                <ChallengeHead c={c} T={T} />
              </div>
              <div className="px-5 pb-4 -mt-2">
                <ChallengeMore c={c} L={L} T={T} />
              </div>
              <div role="group" aria-label={challengeName(c, T)} className="mt-auto grid grid-cols-2 border-t border-slate-200">
                {([1, 2] as const).map((n) => {
                  const on = place === n;
                  return (
                    <label
                      key={n}
                      className={`relative flex items-center justify-center gap-2 min-h-[48px] px-2 text-[15px] font-semibold cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-[#0A1930] ${
                        n === 2 ? 'border-l border-slate-200' : ''
                      } ${on ? 'bg-[#0A1930] text-white' : 'bg-white text-[#0A1930] hover:bg-slate-50'}`}
                    >
                      <input
                        type="radio"
                        name={`${uid}-${n === 1 ? 'first' : 'second'}`}
                        value={c.id}
                        checked={on}
                        onChange={() => pick(n, c.id)}
                        className="sr-only"
                        aria-label={`${n === 1 ? L('First choice', 'Första val') : L('Second choice', 'Andra val')}: ${challengeName(c, T)}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`w-6 h-6 flex items-center justify-center border-2 text-sm font-extrabold ${on ? 'bg-[#FFCD00] border-[#FFCD00] text-[#0A1930]' : 'border-[#0A1930]'}`}
                      >
                        {n}
                      </span>
                      {n === 1 ? L('1st choice', '1:a val') : L('2nd choice', '2:a val')}
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
