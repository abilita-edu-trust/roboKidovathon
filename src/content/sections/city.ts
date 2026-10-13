// City-site sections: the event-details grid and the "Get involved" cards (one per form the site offers).
import type { SiteConfig } from '../../context/SiteContext';
import type { CitySite } from '../../components/city/citySites';
import type { IntakeProgramTab } from '../../pages/IntakeRegisterPage';
import { bi, type Bi } from '../core';
import { biOf, targetToHref } from './frame';

export interface DetailsData {
  eyebrow: Bi;
  title: Bi;
  /** An empty value shows the "not confirmed" text. */
  rows: { label: Bi; value: Bi }[];
  tbc: Bi;
}

export const detailsDefaults = (c: SiteConfig, city?: CitySite): DetailsData => ({
  eyebrow: bi(c.cityName),
  title: bi('Event details', 'Praktisk info'),
  rows: (city?.details ?? []).map((d) => ({ label: biOf(d.label), value: d.value ? biOf(d.value) : bi('') })),
  tbc: bi('TBC', 'Meddelas senare'),
});

export interface JoinCard {
  emoji: string;
  title: Bi;
  desc: Bi;
  href: string;
}

export interface JoinData {
  eyebrow: Bi;
  title: Bi;
  intro: Bi;
  cards: JoinCard[];
  openForm: Bi;
  /** The green "Ideas & Vote" card at the end. */
  ideas: { visible: boolean; emoji: string; title: Bi; desc: Bi; button: Bi; href: string };
}

const FORMS: { tab: IntakeProgramTab; emoji: string; title: Bi; desc: Bi }[] = [
  { tab: 'workshop', emoji: '🤖', title: bi('School Workshop', 'Skolworkshop'), desc: bi('Hands-on robotics workshop at your school', 'Praktisk robotikworkshop på er skola') },
  { tab: 'demo', emoji: '📢', title: bi('School Demo', 'Skoldemo'), desc: bi('A live robotics demo for your school', 'En robotikdemo live på er skola') },
  { tab: 'association', emoji: '🤝', title: bi('Group / Association', 'Grupp / förening'), desc: bi('Associations, clubs and community groups', 'Föreningar, klubbar och grupper') },
  { tab: 'submit-idea', emoji: '💡', title: bi('Bring Your Idea', 'Kom med din idé'), desc: bi('Text, drawing, voice note or video, then public voting', 'Text, skiss, röstmeddelande eller video, sedan röstning') },
  { tab: 'hackathon', emoji: '🏆', title: bi('Join the Hackathon', 'Var med i hackathonet'), desc: bi('Register your team', 'Anmäl ert lag') },
  { tab: 'volunteer', emoji: '🙋', title: bi('Volunteer', 'Volontär'), desc: bi('Help run the events', 'Hjälp till på evenemangen') },
  { tab: 'partner', emoji: '🏢', title: bi('Become a Partner', 'Bli partner'), desc: bi('Problem statements, mentors, workshops or equipment', 'Problemformuleringar, mentorer, workshoppar eller utrustning') },
];

export const joinDefaults = (c: SiteConfig, city?: CitySite): JoinData => {
  const offered = FORMS.filter((f) => !c.intake.tabs || c.intake.tabs.includes(f.tab));
  const overrides = city?.joinOverrides ?? {};
  return {
    eyebrow: bi('Get involved', 'Var med'),
    title: bi('Build something real', 'Bygg något verkligt'),
    intro: bi('Choose how you want to take part. Each option opens its form.', 'Välj hur du vill vara med. Varje val öppnar sitt formulär.'),
    cards: offered.map((f) => {
      const o = overrides[f.tab];
      return {
        emoji: f.emoji,
        title: o?.title ? biOf(o.title) : f.title,
        desc: o?.desc ? biOf(o.desc) : f.desc,
        href: targetToHref(c.nav.registerRoute, f.tab),
      };
    }),
    openForm: bi('Open form', 'Öppna formuläret'),
    ideas: {
      visible: offered.some((f) => f.tab === 'submit-idea'),
      emoji: '⭐',
      title: bi('Ideas & Vote', 'Idéer och röstning'),
      desc: bi('See the ideas and vote for your favourite', 'Se idéerna och rösta på din favorit'),
      button: bi('Vote', 'Rösta'),
      href: targetToHref(city ? `${city.route}-ideas` : 'ideas'),
    },
  };
};
