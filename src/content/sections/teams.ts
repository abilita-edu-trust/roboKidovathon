// RoboKidovation categories (with each one's workshop skills), team rules and the final-day format.
import { ROBOKIDO_CATEGORIES, TEAM_RULES, WORKSHOP_PATHS, FINAL_DAY_STEPS } from '../../data/vfiFacts';
import { bi, type Bi } from '../core';
import { biOf } from './frame';

export interface TeamsData {
  eyebrow: Bi;
  title: Bi;
  codingLabel: Bi;
  skillsLabel: Bi;
  /** `colour`: "Junior" (blue), "Senior" (navy) or "GYM" (yellow). */
  categories: { name: Bi; colour: string; level: Bi; grades: Bi; focus: Bi; coding: Bi; skills: Bi[] }[];
  teamsTitle: Bi;
  teamFacts: { icon: string; value: Bi; text: Bi }[];
  rolesTitle: Bi;
  roles: { icon: string; label: Bi }[];
  /** "{count}" is the number of rules. */
  rulesLabel: Bi;
  rules: Bi[];
  beforeTitle: Bi;
  prep: { value: Bi; label: Bi }[];
  prepText: Bi;
  secret: Bi;
  finalTitle: Bi;
  finalBadge: Bi;
  finalIntro: Bi;
  /** Steps with minutes > 0 form the time bar, sized by their minutes. */
  finalSteps: { icon: string; time: Bi; label: Bi; minutes: number }[];
}

const FINAL_ICONS = ['ClipboardCheck', 'BookOpen', 'Wrench', 'Gauge', 'Flag'];

export const teamsDefaults = (): TeamsData => ({
  eyebrow: bi('RoboKidovation 2026'),
  title: bi('Categories, teams & final day', 'Kategorier, lag & finaldag'),
  codingLabel: bi('Coding', 'Programmering'),
  skillsLabel: bi('Workshop skills', 'Workshopfärdigheter'),
  categories: ROBOKIDO_CATEGORIES.map((c) => {
    const key = c.name.replace('RoboKido ', '');
    return {
      name: bi(c.name),
      colour: key,
      level: biOf(c.level),
      grades: biOf(c.grades),
      focus: biOf(c.focus),
      coding: biOf(c.coding),
      skills: (WORKSHOP_PATHS.find((p) => p.category === key)?.steps ?? []).map(biOf),
    };
  }),
  teamsTitle: bi('Teams', 'Lag'),
  teamFacts: [
    { icon: 'Users', value: bi('4–5 per team', '4–5 per lag'), text: bi('Sign up as a team, or on your own and we place you in one.', 'Anmäl ett lag, eller dig själv så placerar vi dig i ett.') },
    { icon: 'CalendarDays', value: bi('Teams form in Nov, week 1', 'Lagen bildas nov v. 1'), text: bi('At the first workshop, balanced by age, experience and gender.', 'På första workshoppen, balanserade efter ålder, erfarenhet och kön.') },
    { icon: 'RefreshCw', value: bi('Everyone rotates roles', 'Alla roterar roller'), text: bi('No one does all the technical work.', 'Ingen gör allt tekniskt arbete.') },
    { icon: 'Code2', value: bi('No coding needed to start', 'Ingen kod krävs för att börja'), text: bi('Juniors need none; older teams get intro support.', 'Junior behöver ingen; äldre lag får introduktion.') },
    { icon: 'UserCheck', value: bi('Come to the workshops', 'Kom till workshopparna'), text: bi('Attending them keeps your team in the final.', 'Att delta håller laget kvar i finalen.') },
  ],
  rolesTitle: bi('Roles you rotate through', 'Roller ni roterar mellan'),
  roles: [
    { icon: 'Wrench', label: bi('Builder', 'Byggare') },
    { icon: 'Gamepad2', label: bi('Controller', 'Förare') },
    { icon: 'Code2', label: bi('Programmer', 'Programmerare') },
    { icon: 'PenTool', label: bi('Designer / tester', 'Designer / testare') },
    { icon: 'Mic', label: bi('Presenter', 'Presentatör') },
  ],
  rulesLabel: bi('Read all {count} team rules', 'Läs alla {count} lagregler'),
  rules: TEAM_RULES.map(biOf),
  beforeTitle: bi('Before the final', 'Före finalen'),
  prep: [
    { value: bi('3 h'), label: bi('Guided preparation', 'Handledd förberedelse') },
    { value: bi('2 × 90'), label: bi('Minute workshops', 'Minuters workshoppar') },
    { value: bi('Pick', 'Välj'), label: bi('Your workshop slot', 'Din workshoptid') },
  ],
  prepText: bi('Several workshop slots open, so each team picks times that suit them.', 'Flera workshoptider öppnas, så varje lag väljer tider som passar.'),
  secret: bi(
    'Workshops teach the skills. The final problem stays secret until competition day.',
    'Workshopparna lär ut färdigheterna. Finaluppgiften hålls hemlig till tävlingsdagen.'
  ),
  finalTitle: bi('Final-day format', 'Finaldagens upplägg'),
  finalBadge: bi('T − 3 h'),
  finalIntro: bi(
    'The challenge is revealed on competition day. Teams have 3 hours from check-in to submission.',
    'Uppgiften avslöjas på tävlingsdagen. Lagen har 3 timmar från incheckning till inlämning.'
  ),
  finalSteps: FINAL_DAY_STEPS.map((s, i) => ({ icon: FINAL_ICONS[i] ?? 'Flag', time: biOf(s.time), label: biOf(s.label), minutes: s.minutes })),
});
