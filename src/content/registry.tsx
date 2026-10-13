// Every section a city website's home page can show, edited in the iniac.se Site CMS. Each type builds its
// default content from the site's configuration and renders from its (saved or default) data.
import React from 'react';
import type { SiteConfig } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import type { IntakeProgramTab } from '../pages/IntakeRegisterPage';
import type { PartnerLogo } from '../data/roboData';
import type { CitySite } from '../components/city/citySites';
import { DEFAULT_SITE_CONTENT } from '../data/siteContent.default';
import { PeopleBlock } from '../components/SitePeopleSections';
import type { PeopleSection } from '../lib/siteContent';
import { RefHero } from '../components/RefHero';
import { RefHeroMarquee } from '../components/RefHeroMarquee';
import { CollaboratorsMarquee } from '../components/CollaboratorsMarquee';
import { UserJourneyAudienceGuide } from '../components/UserJourneyAudienceGuide';
import { RefTheExperience } from '../components/RefTheExperience';
import { HackathonWinners } from '../components/HackathonWinners';
import { RoboKidoTeamsFinalDay } from '../components/RoboKidoTeamsFinalDay';
import { ParticipationFees } from '../components/ParticipationFees';
import { VoteYoungMindsSection } from '../components/VoteYoungMindsSection';
import { VolunteerCta } from '../components/VolunteerCta';
import { FutureInnovatorsDetailLinks } from '../components/FutureInnovatorsDetailLinks';
import { FutureInnovatorsBanner } from '../components/FutureInnovatorsBanner';
import { PathwayCard } from '../components/PathwayCard';
import { CityDetailsSection, CityPathways, CityVoteSection } from '../components/city/CitySections';
import {
  RoboHackAbout, RoboHackChallenges, RoboHackEventSection, RoboHackPartners, RoboHackProblem, RoboHackProgrammes, RoboHackTracks,
} from '../pages/RoboHackPage';
import { FIXED_FIRST, FIXED_LAST, type SectionDoc } from './document';
import {
  footerDefaults, headerDefaults, heroDefaults, volunteerDefaults, type FooterData, type HeaderData, type HeroData, type VolunteerData,
} from './sections/frame';
import {
  feesDefaults, partnersDefaults, readMoreDefaults, toPartnerLogos, type FeesData, type PartnersData, type ReadMoreData,
} from './sections/simple';
import { useT } from './useT';
import { journeyDefaults, type JourneyData } from './sections/journey';
import {
  meetUsDefaults, voteDefaults, winnersDefaults, type MeetUsData, type VoteData, type WinnersData,
} from './sections/live';

/** What a section needs from the page around it. */
export interface SectionEnv {
  /** Site key in the CMS: 'vfi', or a city site's route ('esk', 'vxo'). */
  siteKey: string;
  /** The site's built-in configuration (before content is applied). */
  config: SiteConfig;
  city?: CitySite;
  navigate: (target: string, tab?: IntakeProgramTab) => void;
  register: (tab?: IntakeProgramTab) => void;
  ideas: () => void;
  /** Follows a CMS link (site path, https:, mailto:, tel:). */
  go: (href: string) => void;
  selectPartner: (partner: PartnerLogo) => void;
}

type AnyData = Record<string, unknown>;

export interface SectionDef<D = AnyData> {
  defaults: (env: SectionEnv) => D;
  render: (data: D, env: SectionEnv, section: SectionDoc) => React.ReactNode;
}

const def = <D,>(d: SectionDef<D>): SectionDef => d as unknown as SectionDef;
const none = () => ({});

export const SECTION_DEFS: Record<string, SectionDef> = {
  // Header and footer render around every page of the site (applyFrame), not in the home sections.
  header: def<HeaderData>({ defaults: (env) => headerDefaults(env.config), render: () => null }),
  footer: def<FooterData>({ defaults: (env) => footerDefaults(env.config), render: () => null }),
  hero: def<HeroData>({ defaults: (env) => heroDefaults(env.config), render: (d, env) => <RefHero data={d} go={env.go} /> }),
  partners: def<PartnersData>({ defaults: partnersDefaults, render: (d, env) => <PartnersMarquee data={d} env={env} /> }),
  'meet-us': def<MeetUsData>({
    defaults: meetUsDefaults,
    render: (d) => (
      <section className="w-full bg-white text-[#0A1930] py-14 sm:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1560px] mx-auto">
          <CollaboratorsMarquee data={d} />
        </div>
      </section>
    ),
  }),
  journey: def<JourneyData>({
    // Sites without season dates (vxo) leave the journey section out of their defaults.
    defaults: (env) => journeyDefaults(env.config) ?? ({ audiences: [], dates: [] } as unknown as JourneyData),
    render: (d, env) => <UserJourneyAudienceGuide data={d} go={env.go} />,
  }),
  experience: def({
    defaults: none,
    render: (_d, env) => <RefTheExperience onNavigate={env.navigate} onOpenRegister={() => env.register()} />,
  }),
  programme: def({ defaults: none, render: (_d, env) => <CityProgramme env={env} /> }),
  winners: def<WinnersData>({ defaults: winnersDefaults, render: (d) => <HackathonWinners data={d} /> }),
  teams: def({ defaults: none, render: () => <RoboKidoTeamsFinalDay /> }),
  fees: def<FeesData>({
    defaults: feesDefaults,
    render: (d) => (
      <section className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-12">
        <div className="max-w-[1560px] mx-auto">
          <ParticipationFees data={d} />
        </div>
      </section>
    ),
  }),
  vote: def<VoteData>({
    defaults: voteDefaults,
    render: (d, env) =>
      env.city ? (
        <CityVoteSection onOpenIdeas={env.ideas} onSubmitIdea={() => env.register('submit-idea')} data={d} />
      ) : (
        <section id="vote-ideas" className="w-full bg-white text-[#0A1930] py-10 sm:py-14 px-4 sm:px-6 lg:px-10 scroll-mt-20">
          <div className="max-w-[1560px] mx-auto">
            <VoteYoungMindsSection onNavigateIdeas={env.ideas} onNavigateSubmit={() => env.register('submit-idea')} data={d} />
          </div>
        </section>
      ),
  }),
  details: def({ defaults: none, render: (_d, env) => <CityDetailsSection details={env.city?.details ?? []} /> }),
  join: def({
    defaults: none,
    render: (_d, env) => <CityPathways onRegister={env.register} onOpenIdeas={env.ideas} overrides={env.city?.joinOverrides} />,
  }),
  about: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackAbout event={env.city.event} onRegister={env.register} /> }),
  problem: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackProblem event={env.city.event} onRegister={env.register} /> }),
  event: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackEventSection event={env.city.event} onRegister={env.register} /> }),
  tracks: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackTracks event={env.city.event} onRegister={env.register} /> }),
  challenges: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackChallenges event={env.city.event} onRegister={env.register} /> }),
  programmes: def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackProgrammes event={env.city.event} onRegister={env.register} /> }),
  'partners-ask': def({ defaults: none, render: (_d, env) => env.city?.event && <RoboHackPartners event={env.city.event} onRegister={env.register} /> }),
  volunteer: def<VolunteerData>({ defaults: (env) => volunteerDefaults(env.config), render: (d, env) => <VolunteerCta data={d} go={env.go} /> }),
  'read-more': def<ReadMoreData>({ defaults: readMoreDefaults, render: (d, env) => <FutureInnovatorsDetailLinks data={d} go={env.go} /> }),
};

export const KNOWN_SECTION_TYPES = new Set(Object.keys(SECTION_DEFS));

const PartnersMarquee: React.FC<{ data: PartnersData; env: SectionEnv }> = ({ data, env }) => {
  const { sv } = useT();
  return <RefHeroMarquee logos={toPartnerLogos(data.logos, sv)} onSelectPartner={env.selectPartner} />;
};

/** City banner over the skyline, then the city's programme card (as on vfi). */
const CityProgramme: React.FC<{ env: SectionEnv }> = ({ env }) => {
  const { language } = useLanguage();
  const pathway = env.city?.pathway;
  if (!env.config.banner && !pathway) return null;
  return (
    <section className="w-full bg-gradient-to-b from-[#F2F8FD] to-white px-4 sm:px-6 lg:px-10 pt-14 sm:pt-20 pb-2">
      <div className="max-w-[1400px] mx-auto space-y-10">
        <FutureInnovatorsBanner />
        {pathway && (
          <div id="journey" className="scroll-mt-24">
            <PathwayCard {...pathway.content(language === 'sv')} onCta={() => env.navigate(pathway.target)} />
          </div>
        )}
      </div>
    </section>
  );
};

const VFI_HOME = ['hero', 'partners', 'meet-us', 'journey', 'experience', 'winners', 'teams', 'fees', 'vote', 'jury', 'speakers', 'volunteer', 'read-more'];

/** The site's home sections in their default order, each with its default data. */
export function defaultSections(env: SectionEnv): SectionDoc[] {
  const { city, config } = env;
  const offersHackathon = !config.intake.tabs || config.intake.tabs.includes('hackathon');
  const middle = city
    ? [
        'hero', 'partners', 'meet-us', ...(config.journey ? ['journey'] : []),
        ...(config.banner || city.pathway ? ['programme'] : []),
        ...(offersHackathon ? ['winners'] : []),
        ...city.home, 'jury', 'speakers', 'volunteer',
      ]
    : VFI_HOME;
  const people = DEFAULT_SITE_CONTENT.sections;
  return [FIXED_FIRST, ...middle, FIXED_LAST].map((id): SectionDoc => {
    const person = people.find((s) => s.id === id);
    if (person) return { ...person };
    return { id, type: id, visible: true, data: SECTION_DEFS[id].defaults(env) };
  });
}

/** The visible home sections in order (header and footer render around the page instead). */
export const HomeSections: React.FC<{ env: SectionEnv; sections: SectionDoc[] }> = ({ env, sections }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';
  return (
    <>
      {sections
        .filter((s) => s.visible && s.type !== FIXED_FIRST && s.type !== FIXED_LAST)
        .map((s) => {
          if (s.type === 'people') return <PeopleBlock key={s.id} section={s as unknown as PeopleSection} sv={sv} />;
          const d = SECTION_DEFS[s.type];
          return d ? <React.Fragment key={s.id}>{d.render(s.data ?? {}, env, s)}</React.Fragment> : null;
        })}
    </>
  );
};
