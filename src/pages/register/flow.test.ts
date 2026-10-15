import { describe, expect, it } from 'vitest';
import {
  REGISTER_TABS,
  activityChoices,
  formFor,
  isAnswered,
  pathForTab,
  roleChoices,
  stepsFor,
  tabForPath,
  type IntakeProgramTab,
  type RegisterProgramme,
} from './flow';

const prog = (id: RegisterProgramme['id']): RegisterProgramme => ({ id, title: { en: id, sv: id }, subtitle: { en: '', sv: '' } });
const VFI = [prog('robo'), prog('hack'), prog('community')];
const ESK = [prog('robo'), prog('ideas'), prog('community')];
const VXO = [prog('hack')];
const all = () => true;
const only = (tabs: IntakeProgramTab[]) => (t: IntakeProgramTab) => tabs.includes(t);

describe('stepsFor', () => {
  it('asks the programme first when a site has several', () => {
    expect(stepsFor({}, VFI)).toEqual(['programme', 'role', 'activity', 'form', 'review']);
    expect(stepsFor({ programme: 'robo' }, VFI)).toEqual(['programme', 'role', 'activity', 'form', 'review']);
  });
  it('skips step 1 on a single-programme site', () => {
    expect(stepsFor({ programme: 'hack' }, VXO)).toEqual(['role', 'activity', 'form', 'review']);
  });
  it('asks only the area for ideas and only the role for the community', () => {
    expect(stepsFor({ programme: 'ideas' }, ESK)).toEqual(['programme', 'theme', 'form', 'review']);
    expect(stepsFor({ programme: 'community' }, ESK)).toEqual(['programme', 'role', 'form', 'review']);
  });
});

describe('formFor', () => {
  it('maps every answer combination to one form', () => {
    expect(formFor({ programme: 'robo', role: 'school', activity: 'workshop' })).toBe('booking');
    expect(formFor({ programme: 'robo', role: 'team', activity: 'demo' })).toBe('booking');
    expect(formFor({ programme: 'robo', role: 'association', activity: 'demo' })).toBe('association');
    expect(formFor({ programme: 'robo', role: 'individual', activity: 'competition' })).toBe('competition');
    expect(formFor({ programme: 'robo', role: 'association', activity: 'competition' })).toBe('competition');
    expect(formFor({ programme: 'hack', role: 'team', activity: 'participate', theme: 'x' })).toBe('squad');
    expect(formFor({ programme: 'hack', role: 'individual', activity: 'idea', theme: 'x' })).toBe('idea');
    expect(formFor({ programme: 'ideas', theme: 'Energy' })).toBe('idea');
    expect(formFor({ programme: 'community', role: 'member' })).toBe('community');
    expect(formFor({ programme: 'community', role: 'mentor' })).toBe('mentor');
  });
  it('has no form while a question is open', () => {
    expect(formFor({ programme: 'robo', role: 'school' })).toBeNull();
    expect(formFor({ programme: 'hack', role: 'team', activity: 'participate' })).toBeNull();
    expect(formFor({ programme: 'ideas' })).toBeNull();
  });
});

describe('isAnswered', () => {
  it('needs a theme on the hackathon pathway step', () => {
    expect(isAnswered('activity', { programme: 'hack', activity: 'idea' })).toBe(false);
    expect(isAnswered('activity', { programme: 'hack', activity: 'idea', theme: 'Energy' })).toBe(true);
    expect(isAnswered('activity', { programme: 'robo', activity: 'demo' })).toBe(true);
  });
});

describe('?tab= links', () => {
  it('round-trips every tab once the remaining answers are given', () => {
    for (const tab of REGISTER_TABS) {
      const programmes = tab === 'submit-idea' ? ESK : VFI;
      const path = { role: 'school' as const, theme: 'Energy', ...pathForTab(tab, programmes) };
      if (path.programme === 'robo' && !path.activity) path.activity = 'workshop';
      expect(tabForPath(path), tab).toBe(tab);
    }
  });
  it('sends submit-idea to the hackathon where there is one', () => {
    expect(pathForTab('submit-idea', VFI)).toEqual({ programme: 'hack', activity: 'idea' });
    expect(pathForTab('submit-idea', ESK)).toEqual({ programme: 'ideas' });
  });
});

describe('choices follow the forms a site accepts', () => {
  it('hides the association card and competition where not accepted', () => {
    const accepts = only(['workshop', 'demo']);
    expect(roleChoices('robo', accepts).map((c) => c.id)).toEqual(['school', 'team', 'individual']);
    expect(activityChoices('robo', accepts).map((c) => c.id)).toEqual(['demo', 'workshop']);
  });
  it('offers vxo only volunteer and partner in the community', () => {
    const accepts = only(['submit-idea', 'hackathon', 'volunteer', 'partner']);
    expect(roleChoices('community', accepts).map((c) => c.id)).toEqual(['volunteer', 'partner']);
  });
  it('offers every community role on vfi', () => {
    expect(roleChoices('community', all).map((c) => c.id)).toEqual(['member', 'volunteer', 'mentor', 'partner']);
  });
});
