import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { RefWorkflowMindMap } from './components/RefWorkflowMindMap';
import { RefTrackComparison } from './components/RefTrackComparison';
import { RefKioskShowcase } from './components/RefKioskShowcase';
import { RefCompetitionFlow } from './components/RefCompetitionFlow';
import { VotePrompt } from './components/VotePrompt';
import { RefWorkshopTapeBanner } from './components/RefWorkshopTapeBanner';
import { RefFooter } from './components/RefFooter';
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
import { cityPageFor } from './components/city/citySites';
import { SiteProvider, VFI_SITE } from './context/SiteContext';
import { HomeSections, type SectionEnv } from './content/registry';
import { useSiteDocument } from './content/useSiteDocument';
import { applyFrame } from './content/sections/frame';

import { EventDeckModal } from './components/EventDeckModal';
import { PartnerPreviewModal } from './components/PartnerPreviewModal';
import type { PartnerLogo } from './data/roboData';
import { RoboCursor } from './components/RoboCursor';
import { useLanguage } from './context/LanguageContext';
import { hrefToTarget, initialRouteFromLocation, isExternalHref, pathForRoute, routeFromPath } from './lib/routes';

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
  const [previewPartner, setPreviewPartner] = useState<{ name: string; url: string; role?: string } | null>(null);

  const handleSelectPartner = (partner: PartnerLogo) => {
    if (partner.url) {
      setPreviewPartner({ name: partner.name, url: partner.url, role: partner.role });
    }
  };


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

  // City sites (vxo, esk) get their own tab title and description on all their pages.
  const cityMeta = cityPageFor(currentRoute)?.city.meta;
  useEffect(() => {
    if (!cityMeta) return;
    const meta = document.querySelector('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.getAttribute('content') ?? '';
    document.title = cityMeta.title;
    meta?.setAttribute('content', cityMeta.description);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDescription);
    };
  }, [cityMeta]);

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

  /** Follows a link from the Site CMS: a page of this site, or https:, mailto:, tel:. */
  const goHref = useCallback(
    (href: string) => {
      if (!href) return;
      if (isExternalHref(href)) {
        if (/^https?:/i.test(href)) window.open(href, '_blank', 'noopener,noreferrer');
        else window.location.href = href;
        return;
      }
      const { target, tab } = hrefToTarget(href);
      handleNavigate(target, REGISTER_TABS.includes(tab as IntakeProgramTab) ? (tab as IntakeProgramTab) : undefined);
    },
    [handleNavigate]
  );

  // City sites (vxo.iniac.se, esk.iniac.se: /<city>, /<city>/register, /<city>/ideas) use
  // the same components as VFI; their site settings give them their name, routes and city.
  const cityPage = cityPageFor(currentRoute);
  const homeCity = cityPage?.city;
  const baseSite = homeCity ? homeCity.site : VFI_SITE;
  const sectionEnv: SectionEnv = {
    siteKey: homeCity ? homeCity.route : 'vfi',
    config: baseSite,
    city: homeCity,
    navigate: handleNavigate,
    register: (tab) => handleNavigate(baseSite.nav.registerRoute, tab),
    ideas: () => handleNavigate(homeCity ? `${homeCity.route}-ideas` : 'ideas'),
    go: goHref,
    selectPartner: handleSelectPartner,
  };
  // The site's CMS document (iniac.se Site CMS) over its built-in defaults.
  const { sections, ready } = useSiteDocument(sectionEnv);
  const fadeIn = `transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`;
  // Header and footer from the same document, on every page of the site.
  const site = useMemo(() => applyFrame(baseSite, sections, language === 'sv'), [baseSite, sections, language]);
  /** Header/footer links may point to other sites. */
  const navigateOrOpen = (target: string, tab?: IntakeProgramTab) =>
    isExternalHref(target) ? goHref(target) : handleNavigate(target, tab);

  if (cityPage) {
    const { city, page } = cityPage;
    const goHome = () => handleNavigate(city.route);
    const goRegister = (tab?: IntakeProgramTab) => handleNavigate(site.nav.registerRoute, tab);
    const goIdeas = () => handleNavigate(`${city.route}-ideas`);
    return (
      <SiteProvider site={site}>
        <div key={language} className={`min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden ${fadeIn}`}>
          <RoboCursor />
          <Navbar activeTab={currentRoute} onNavigate={navigateOrOpen} onOpenRegister={() => goRegister()} />
          <main className="w-full">
            {page === 'home' && <HomeSections env={sectionEnv} sections={sections} />}
            {page === 'register' && (
              <IntakeRegisterPage key={registerInitialTab} initialTab={registerInitialTab} onNavigateHome={goHome} onNavigateVoting={goIdeas} />
            )}
            {page === 'ideas' && <IdeasVotingPage onNavigateHome={goHome} onNavigateSubmit={() => goRegister('submit-idea')} />}
          </main>
          <RefFooter onNavigate={navigateOrOpen} onSelectPartner={handleSelectPartner} />
          {page === 'home' && <VotePrompt onGoToVote={goIdeas} onSubmitIdea={() => goRegister('submit-idea')} />}
          {/* Partner Preview Modal */}
          <PartnerPreviewModal
            isOpen={Boolean(previewPartner)}
            onClose={() => setPreviewPartner(null)}
            partnerName={previewPartner?.name || ''}
            url={previewPartner?.url || ''}
            role={previewPartner?.role}
          />
        </div>
      </SiteProvider>
    );
  }

  return (
    <SiteProvider site={site}>
    <div key={language} className={`min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden ${fadeIn}`}>
      {/* ── Custom Animated Robot Cursor ── */}
      <RoboCursor />
      
      {/* ── 0. Floating Responsive Header ── */}
      <Navbar
        activeTab={currentRoute}
        onNavigate={navigateOrOpen}
        onOpenRegister={openRegister}
      />

      {/* ── Page Router ── */}
      <main className="w-full">
        {currentRoute === 'ibk' && <IbkHomePage onNavigate={handleNavigate} />}

        {/* Home: the sections from the Site CMS, in their saved order */}
        {currentRoute === 'future-innovators' && <HomeSections env={sectionEnv} sections={sections} />}

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
      <RefFooter onNavigate={navigateOrOpen} onSelectPartner={handleSelectPartner} />

      {/* ── Interactive Modals ── */}
      <EventDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
      />

      <PartnerPreviewModal
        isOpen={Boolean(previewPartner)}
        onClose={() => setPreviewPartner(null)}
        partnerName={previewPartner?.name || ''}
        url={previewPartner?.url || ''}
        role={previewPartner?.role}
      />


      {/* Not over the forms or the voting page itself */}
      {!['admin', 'ideas', 'register'].includes(currentRoute) && (
        <VotePrompt onGoToVote={goToVote} onSubmitIdea={() => handleNavigate('register', 'submit-idea')} />
      )}

    </div>
    </SiteProvider>
  );
}

export default App;
