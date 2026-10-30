import { describe, expect, it } from 'vitest';
import { stepKind, stepNumbers } from './programmes';

describe('programme card steps', () => {
  it('numbers the steps, not the breaks and milestones', () => {
    const steps = [{}, { stepType: 'step' }, { stepType: 'break' }, { stepType: 'milestone' }, { stepType: 'tentative' }, {}];
    expect(stepNumbers(steps)).toEqual([1, 2, null, null, 3, 4]);
  });

  it('reads a missing or unknown type as a plain step', () => {
    expect([undefined, '', 'step', 'pause', 'break', 'milestone', 'tentative'].map(stepKind)).toEqual([
      'step', 'step', 'step', 'step', 'break', 'milestone', 'tentative',
    ]);
  });
});
