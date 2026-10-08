import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RefHero } from './components/RefHero';
import { RefHeroMarquee } from './components/RefHeroMarquee';
import { RefTheExperience } from './components/RefTheExperience';
import { RefWorkflowMindMap } from './components/RefWorkflowMindMap';
import { RefTrackComparison } from './components/RefTrackComparison';
import { RefKioskShowcase } from './components/RefKioskShowcase';
import { RefCompetitionFlow } from './components/RefCompetitionFlow';
import { CollaboratorsMarquee } from './components/CollaboratorsMarquee';
import { VoteYoungMindsSection } from './components/VoteYoungMindsSection';
import { VotePrompt } from './components/VotePrompt';
import { RefWorkshopTapeBanner } from './components/RefWorkshopTapeBanner';
import { RefFooter } from './components/RefFooter';
import { FutureInnovatorsDetailLinks } from './components/FutureInnovatorsDetailLinks';
import { ParticipationFees } from './components/ParticipationFees';
import { RoboKidoTeamsFinalDay } from './components/RoboKidoTeamsFinalDay';

import { ChallengesPage } from './pages/ChallengesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { ForSchoolsPage } from './pages/ForSchoolsPage';
import { AboutPage } from './pages/AboutPage';
import { Lgr22Page } from './pages/Lgr22Page';
import { EventsPage } from './pages/EventsPage';
import { IntakeRegisterPage, IntakeProgramTab } from './pages/IntakeRegisterPage';
import { IdeasVotingPage } from './pages/IdeasVotingPage';
import { AdminIdeasCurationPage } from './pages/AdminIdeasCurationPage';
import { AdminLoginGate } from './components/AdminLoginGate';
import { IbkHomePage } from './pages/IbkHomePage';
import { VolunteerCta } from './components/VolunteerCta';
import { RoboHackPage } from './pages/RoboHackPage';
import { RoboHackNavbar } from './components/robohack/RoboHackNavbar';
import { RoboHackFooter } from './components/robohack/RoboHackFooter';
import { ROBOHACK_EVENTS } from './data/robohack';

import { EventDeckModal } from './components/EventDeckModal';
import { RoboCursor } from './components/RoboCursor';
import { useLanguage } from './context/LanguageContext';
import { initialRouteFromLocation, pathForRoute, routeFromPath } from './lib/routes';

const REGISTER_TABS: IntakeProgramTab[] = ['workshop', 'demo', 'association', 'submit-idea', 'hackathon', 'volunteer'];
const toRegisterTab = (tab: string | null): IntakeProgramTab =>
  REGISTER_TABS.includes(tab as IntakeProgramTab) ? (tab as IntakeProgramTab) : 'workshop';

const scrollToSection = (id: string) => {
  // Wait for the newly routed page to render before scrolling.
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
};

export function App() {
  const { language } = useLanguage();
  const [initial] = useState(initialRouteFromLocation);
  const [currentRoute, setCurrentRoute] = useState<string>(initial.route);
  const [registerInitialTab, setRegisterInitialTab] = useState<IntakeProgramTab>(() => toRegisterTab(initial.tab));
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);

  // Rewrite legacy `?route=` links to their real path once, keeping other params (e.g. ?idea=).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('route')) return;
    params.delete('route');
    if (initial.route === 'register' && initial.tab) params.set('tab', initial.tab);
    const query = params.toString();
    window.history.replaceState(null, '', pathForRoute(initial.route) + (query ? `?${query}` : '') + window.location.hash);
  }, [initial]);

  // Browser back / forward.
  useEffect(() => {
    const onPopState = () => {
      const route = routeFromPath(window.location.pathname);
      if (route === 'register') {
        setRegisterInitialTab(toRegisterTab(new URLSearchParams(window.location.search).get('tab')));
      }
      setCurrentRoute(route);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Deep links to a section, e.g. /#contact.
  useEffect(() => {
    if (window.location.hash) scrollToSection(window.location.hash.slice(1));
  }, []);

  /** Navigate to a route id, optionally with a register tab or a `route#section` anchor. */
  const handleNavigate = useCallback((target: string, tab?: IntakeProgramTab) => {
    const [route, section] = target.split('#');
    if (tab) setRegisterInitialTab(tab);
    else if (route === 'register') setRegisterInitialTab('workshop');

    const query = route === 'register' && tab && tab !== 'workshop' ? `?tab=${tab}` : '';
    const url = pathForRoute(route) + query + (section ? `#${section}` : '');
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, '', url);
    }
    setCurrentRoute(route);

    if (section) scrollToSection(section);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openRegister = () => handleNavigate('register');

  const goToVote = () => handleNavigate('future-innovators#vote-ideas');

  // RoboHack event pages (e.g. /vxo) have their own header and footer and link only within the event.
  const robohackEvent = ROBOHACK_EVENTS[currentRoute];
  if (robohackEvent) {
    return (
      <div key={language} className="min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden">
        <RoboCursor />
        <RoboHackNavbar event={robohackEvent} onNavigate={handleNavigate} />
        <main className="w-full">
          <RoboHackPage event={robohackEvent} />
        </main>
        <RoboHackFooter event={robohackEvent} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div key={language} className="min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden">
      {/* ── Custom Animated Robot Cursor ── */}
      <RoboCursor />
      
      {/* ── 0. Floating Responsive Header ── */}
      <Navbar
        activeTab={currentRoute}
        onNavigate={handleNavigate}
        onOpenRegister={openRegister}
      />

      {/* ── Page Router ── */}
      <main className="w-full">
        {currentRoute === 'ibk' && <IbkHomePage onNavigate={handleNavigate} />}

        {currentRoute === 'future-innovators' && (
          <>
            {/* 01. Programme hero */}
            <RefHero onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 02. Partners ticker */}
            <RefHeroMarquee />

            {/* 03. Meet Us At — confirmed bookings + live stats */}
            <section className="w-full bg-white text-[#0A1930] py-14 sm:py-16 px-4 sm:px-6 lg:px-10">
              <div className="max-w-[1560px] mx-auto">
                <CollaboratorsMarquee onNavigate={handleNavigate} />
              </div>
            </section>

            {/* 04. Two pathways, the one official timeline, and venues */}
            <RefTheExperience onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 04a. RoboKidovation categories, teams, workshops and final-day format */}
            <RoboKidoTeamsFinalDay />

            {/* 04b. Participation fees, next to the registration call-to-action */}
            <section className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-12">
              <div className="max-w-[1560px] mx-auto">
                <ParticipationFees />
              </div>
            </section>

            {/* 05. Vote for an idea of young minds */}
            <section id="vote-ideas" className="w-full bg-white text-[#0A1930] py-10 sm:py-14 px-4 sm:px-6 lg:px-10 scroll-mt-20">
              <div className="max-w-[1560px] mx-auto">
                <VoteYoungMindsSection
                  onNavigateIdeas={() => handleNavigate('ideas')}
                  onNavigateSubmit={() => handleNavigate('register', 'submit-idea')}
                  onNavigateAdmin={() => handleNavigate('admin')}
                />
              </div>
            </section>

            {/* 06. Volunteer call-to-action */}
            <VolunteerCta onOpenVolunteer={() => handleNavigate('register', 'volunteer')} />

            {/* 07. Detailed rules, curriculum and equipment live on their own pages */}
            <FutureInnovatorsDetailLinks onNavigate={handleNavigate} />
          </>
        )}

        {currentRoute === 'challenges' && (
          <ChallengesPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}
        {currentRoute === 'challenges' && (
          <>
            <RefCompetitionFlow onOpenRegister={openRegister} onNavigate={handleNavigate} />
            <RoboKidoTeamsFinalDay />
            <RefTrackComparison onNavigate={handleNavigate} onOpenRegister={openRegister} />
            <section className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-16">
              <div className="max-w-[1560px] mx-auto">
                <ParticipationFees />
              </div>
            </section>
          </>
        )}

        {currentRoute === 'how-it-works' && (
          <HowItWorksPage
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}

        {currentRoute === 'workflow' && (
          <WorkflowPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}

        {currentRoute === 'workflow' && (
          <>
            <RefKioskShowcase onNavigate={handleNavigate} onOpenRegister={openRegister} />
            <RefWorkflowMindMap onNavigate={handleNavigate} onOpenRegister={openRegister} />
            <RefWorkshopTapeBanner
              onOpenRegister={openRegister}
              onOpenDeckModal={() => setIsDeckOpen(true)}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {currentRoute === 'for-schools' && (
          <ForSchoolsPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}

        {currentRoute === 'lgr22' && (
          <Lgr22Page
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('future-innovators')}
          />
        )}

        {currentRoute === 'events' && (
          <>
            <EventsPage
              onOpenRegister={() => handleNavigate('register')}
              onNavigateHome={() => handleNavigate('future-innovators')}
            />
            <section className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-16">
              <div className="max-w-[1560px] mx-auto">
                <ParticipationFees />
              </div>
            </section>
          </>
        )}

        {currentRoute === 'register' && (
          <IntakeRegisterPage
            key={registerInitialTab}
            initialTab={registerInitialTab}
            onNavigateHome={() => handleNavigate('future-innovators')}
            onNavigateVoting={() => handleNavigate('ideas')}
          />
        )}

        {currentRoute === 'ideas' && (
          <IdeasVotingPage
            onNavigateHome={() => handleNavigate('future-innovators')}
            onNavigateSubmit={() => handleNavigate('register', 'submit-idea')}
            onNavigateAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminLoginGate>
            <AdminIdeasCurationPage
              onNavigateHome={() => handleNavigate('future-innovators')}
              onNavigateVoting={() => handleNavigate('ideas')}
            />
          </AdminLoginGate>
        )}
      </main>

      {/* ── Master Dark Footer with Verified Contacts ── */}
      <RefFooter
        onNavigate={handleNavigate}
        onOpenRegister={() => handleNavigate('register')}
      />

      {/* ── Interactive Modals ── */}
      <EventDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
      />

      {currentRoute !== 'admin' && (
        <VotePrompt onGoToVote={goToVote} onSubmitIdea={() => handleNavigate('register', 'submit-idea')} />
      )}

    </div>
  );
}

export default App;
