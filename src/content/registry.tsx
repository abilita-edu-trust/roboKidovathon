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
import { MediaBlock, mediaDefaults, type MediaData } from '../components/MediaBlock';
import { RefHeroMarquee } from '../components/RefHeroMarquee';
import { CollaboratorsMarquee } from '../components/CollaboratorsMarquee';
import { UserJourneyAudienceGuide } from '../components/UserJourneyAudienceGuide';
import { AudienceJourneys } from '../components/AudienceJourneys';
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
import type { RoboHackEvent } from '../data/robohack/types';
import {
  rhAboutDefaults, rhChallengesDefaults, rhEventDefaults, rhPartnersDefaults, rhProblemDefaults, rhProgrammesDefaults, rhTracksDefaults,
  type RhAboutData, type RhChallengesData, type RhEventData, type RhPartnersData, type RhProblemData, type RhProgrammesData, type RhTracksData,
} from './sections/robohack';
import { detailsDefaults, joinDefaults, type DetailsData, type JoinData } from './sections/city';
import { teamsDefaults, type TeamsData } from './sections/teams';
import { experienceDefaults, programmeDefaults, type ExperienceData, type ProgrammeData } from './sections/programmes';
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
/** A RoboHack section's default from the site's event (empty for sites without one). */
const ev = <D,>(env: SectionEnv, build: (e: RoboHackEvent) => D): D => (env.city?.event ? build(env.city.event) : ({} as D));

export const SECTION_DEFS: Record<string, SectionDef> = {
  // Header and footer render around every page of the site (applyFrame), not in the home sections.
  header: def<HeaderData>({ defaults: (env) => headerDefaults(env.config), render: () => null }),
  footer: def<FooterData>({ defaults: (env) => footerDefaults(env.config), render: () => null }),
  hero: def<HeroData>({ defaults: (env) => heroDefaults(env.config), render: (d, env) => <RefHero data={d} go={env.go} /> }),
  partners: def<PartnersData>({ defaults: partnersDefaults, render: (d, env) => <PartnersMarquee data={d} env={env} /> }),
  'meet-us': def<MeetUsData>({
    defaults: meetUsDefaults,
    render: (d) => (
      <section className="w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1560px] mx-auto">
          <CollaboratorsMarquee data={d} />
        </div>
      </section>
    ),
  }),
  journey: def<JourneyData>({
    // Sites without season dates (vxo) leave the journey section out of their defaults.
    defaults: (env) => journeyDefaults(env.config) ?? ({ audiences: [], dates: [] } as unknown as JourneyData),
    // With programme boxes (vfi) the section shows them; other sites keep the single guide.
    render: (d, env) => (d.programmes?.length ? <AudienceJourneys data={d} go={env.go} /> : <UserJourneyAudienceGuide data={d} go={env.go} />),
  }),
  experience: def<ExperienceData>({ defaults: (env) => experienceDefaults(env.config), render: (d, env) => <RefTheExperience data={d} go={env.go} onNavigateVoting={env.ideas} /> }),
  programme: def<ProgrammeData>({
    // Only cities with a programme card have this section by default.
    defaults: (env) => programmeDefaults(env.config, env.city) ?? (null as unknown as ProgrammeData),
    render: (d, env) => <CityProgramme data={d} env={env} />,
  }),
  winners: def<WinnersData>({ defaults: winnersDefaults, render: (d) => <HackathonWinners data={d} /> }),
  teams: def<TeamsData>({ defaults: teamsDefaults, render: (d) => <RoboKidoTeamsFinalDay data={d} /> }),
  fees: def<FeesData>({
    defaults: feesDefaults,
    render: (d) => (
      <section className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-8">
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
        <section id="vote-ideas" className="w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 scroll-mt-20">
          <div className="max-w-[1560px] mx-auto">
            <VoteYoungMindsSection onNavigateIdeas={env.ideas} onNavigateSubmit={() => env.register('submit-idea')} data={d} />
          </div>
        </section>
      ),
  }),
  details: def<DetailsData>({ defaults: (env) => detailsDefaults(env.config, env.city), render: (d) => <CityDetailsSection data={d} /> }),
  join: def<JoinData>({ defaults: (env) => joinDefaults(env.config, env.city), render: (d, env) => <CityPathways data={d} go={env.go} /> }),
  // RoboHack event sections (vxo); only sites with an event have them.
  about: def<RhAboutData>({ defaults: (env) => ev(env, (e) => rhAboutDefaults(e)), render: (d, env) => <RoboHackAbout data={d} go={env.go} /> }),
  problem: def<RhProblemData>({ defaults: (env) => ev(env, (e) => rhProblemDefaults(e, env.config)), render: (d, env) => <RoboHackProblem data={d} go={env.go} /> }),
  event: def<RhEventData>({ defaults: (env) => ev(env, (e) => rhEventDefaults(e, env.config)), render: (d, env) => <RoboHackEventSection data={d} go={env.go} /> }),
  tracks: def<RhTracksData>({ defaults: (env) => ev(env, (e) => rhTracksDefaults(e, env.config)), render: (d, env) => <RoboHackTracks data={d} go={env.go} /> }),
  challenges: def<RhChallengesData>({ defaults: (env) => ev(env, (e) => rhChallengesDefaults(e)), render: (d, env) => <RoboHackChallenges data={d} go={env.go} /> }),
  programmes: def<RhProgrammesData>({ defaults: (env) => ev(env, (e) => rhProgrammesDefaults(e)), render: (d, env) => <RoboHackProgrammes data={d} go={env.go} /> }),
  'partners-ask': def<RhPartnersData>({ defaults: (env) => ev(env, (e) => rhPartnersDefaults(e, env.config)), render: (d, env) => <RoboHackPartners data={d} go={env.go} /> }),
  // Added by editors anywhere in the order; never part of the defaults.
  media: def<MediaData>({ defaults: mediaDefaults, render: (d, env, section) => <MediaBlock id={section.id} data={d} go={env.go} /> }),
  volunteer: def<VolunteerData>({ defaults: (env) => volunteerDefaults(env.config), render: (d, env) => <VolunteerCta data={d} go={env.go} /> }),
  'read-more': def<ReadMoreData>({ defaults: readMoreDefaults, render: (d, env) => <FutureInnovatorsDetailLinks data={d} go={env.go} /> }),
};

export const KNOWN_SECTION_TYPES = new Set(Object.keys(SECTION_DEFS));

const PartnersMarquee: React.FC<{ data: PartnersData; env: SectionEnv }> = ({ data, env }) => {
  const { lang } = useT();
  return <RefHeroMarquee logos={toPartnerLogos(data.logos, lang)} onSelectPartner={env.selectPartner} />;
};

/** City banner over the skyline, then the city's programme card (as on vfi). */
const CityProgramme: React.FC<{ data: ProgrammeData; env: SectionEnv }> = ({ data, env }) => (
  <section className="w-full bg-gradient-to-b from-[#F2F8FD] to-white px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-2">
    <div className="max-w-[1400px] mx-auto space-y-10">
      <FutureInnovatorsBanner src={data.banner} />
      <div id="journey" className="scroll-mt-24">
        <PathwayCard data={data.card} onCta={env.go} />
      </div>
    </div>
  </section>
);

const VFI_HOME = ['hero', 'partners', 'meet-us', 'journey', 'experience', 'winners', 'teams', 'fees', 'vote', 'jury', 'speakers', 'volunteer', 'read-more'];

/** The site's home sections in their default order, each with its default data. */
export function defaultSections(env: SectionEnv): SectionDoc[] {
  const { city, config } = env;
  const offersHackathon = !config.intake.tabs || config.intake.tabs.includes('hackathon');
  const middle = city
    ? [
        'hero', 'partners', 'meet-us', ...(config.journey ? ['journey'] : []),
        ...(city.pathway ? ['programme'] : []),
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
  return (
    <>
      {sections
        .filter((s) => s.visible && s.type !== FIXED_FIRST && s.type !== FIXED_LAST)
        .map((s) => {
          if (s.type === 'people') return <PeopleBlock key={s.id} section={s as unknown as PeopleSection} lang={language} />;
          const d = SECTION_DEFS[s.type];
          return d ? <React.Fragment key={s.id}>{d.render(s.data ?? {}, env, s)}</React.Fragment> : null;
        })}
    </>
  );
};
