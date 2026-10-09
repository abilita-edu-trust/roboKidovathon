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
import { robohackPageFor } from './data/robohack';
import { robohackSite } from './components/robohack/robohackSite';
import { SiteProvider } from './context/SiteContext';

import { EventDeckModal } from './components/EventDeckModal';
import { RoboCursor } from './components/RoboCursor';
import { useLanguage } from './context/LanguageContext';
import { initialRouteFromLocation, pathForRoute, routeFromPath } from './lib/routes';

const REGISTER_TABS: IntakeProgramTab[] = ['workshop', 'demo', 'association', 'submit-idea', 'hackathon', 'volunteer', 'partner'];
/** The VFI register page and the RoboHack city register pages (e.g. 'vxo-register'). */
const isRegisterRoute = (route: string) => route === 'register' || route.endsWith('-register');
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
    if (isRegisterRoute(initial.route) && initial.tab) params.set('tab', initial.tab);
    const query = params.toString();
    window.history.replaceState(null, '', pathForRoute(initial.route) + (query ? `?${query}` : '') + window.location.hash);
  }, [initial]);

  // Browser back / forward.
  useEffect(() => {
    const onPopState = () => {
      const route = routeFromPath(window.location.pathname);
      if (isRegisterRoute(route)) {
        setRegisterInitialTab(toRegisterTab(new URLSearchParams(window.location.search).get('tab')));
      }
      setCurrentRoute(route);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // RoboHack city sites get their own tab title and description on all their pages.
  const robohackEvent = robohackPageFor(currentRoute)?.event;
  useEffect(() => {
    if (!robohackEvent) return;
    const meta = document.querySelector('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.getAttribute('content') ?? '';
    document.title = robohackEvent.meta.title;
    meta?.setAttribute('content', robohackEvent.meta.description);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDescription);
    };
  }, [robohackEvent]);

  // Deep links to a section, e.g. /#contact.
  useEffect(() => {
    if (window.location.hash) scrollToSection(window.location.hash.slice(1));
  }, []);

  /** Navigate to a route id, optionally with a register tab or a `route#section` anchor. */
  const handleNavigate = useCallback((target: string, tab?: IntakeProgramTab) => {
    const [route, section] = target.split('#');
    if (tab) setRegisterInitialTab(tab);
    else if (isRegisterRoute(route)) setRegisterInitialTab('workshop');

    const query = isRegisterRoute(route) && tab && tab !== 'workshop' ? `?tab=${tab}` : '';
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

  // RoboHack city sites (e.g. vxo.iniac.se: /vxo, /vxo/register, /vxo/ideas) use the same
  // components as VFI; the site settings give them the event's name, routes and city.
  const robohack = robohackPageFor(currentRoute);
  if (robohack) {
    const { event, page } = robohack;
    const site = robohackSite(event);
    const goHome = () => handleNavigate(event.route);
    const goRegister = (tab?: IntakeProgramTab) => handleNavigate(site.nav.registerRoute, tab);
    const goIdeas = () => handleNavigate(`${event.route}-ideas`);
    return (
      <SiteProvider site={site}>
        <div key={language} className="min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden">
          <RoboCursor />
          <Navbar activeTab={currentRoute} onNavigate={handleNavigate} onOpenRegister={() => goRegister()} />
          <main className="w-full">
            {page === 'home' && (
              <>
                <RefHero onNavigate={handleNavigate} />
                <RefHeroMarquee />
                <RoboHackPage event={event} onRegister={goRegister} onOpenIdeas={goIdeas} />
                <VolunteerCta onOpenVolunteer={() => goRegister('volunteer')} />
              </>
            )}
            {page === 'register' && (
              <IntakeRegisterPage key={registerInitialTab} initialTab={registerInitialTab} onNavigateHome={goHome} onNavigateVoting={goIdeas} />
            )}
            {page === 'ideas' && <IdeasVotingPage onNavigateHome={goHome} onNavigateSubmit={() => goRegister('submit-idea')} />}
          </main>
          <RefFooter onNavigate={handleNavigate} />
          <VotePrompt onGoToVote={goIdeas} onSubmitIdea={() => goRegister('submit-idea')} />
        </div>
      </SiteProvider>
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
            <RefHero onNavigate={handleNavigate} />

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
      <RefFooter onNavigate={handleNavigate} />

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
