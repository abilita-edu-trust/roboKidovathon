import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RefHero } from './components/RefHero';
import { RefHeroMarquee } from './components/RefHeroMarquee';
import { RefTheExperience } from './components/RefTheExperience';
import { RefWorkflowMindMap } from './components/RefWorkflowMindMap';
import { RefTrackComparison } from './components/RefTrackComparison';
import { RefKioskShowcase } from './components/RefKioskShowcase';
import { RefCompetitionFlow } from './components/RefCompetitionFlow';
import { VenueBanner } from './components/VenueBanner';
import { RefPhotoStrip } from './components/RefPhotoStrip';
import { RefWorkshopTapeBanner } from './components/RefWorkshopTapeBanner';
import { RefFooter } from './components/RefFooter';

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

import { RegisterModal } from './components/RegisterModal';
import { EventDeckModal } from './components/EventDeckModal';
import { RoboCursor } from './components/RoboCursor';
import { useLanguage } from './context/LanguageContext';

export function App() {
  const { language } = useLanguage();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('route') === 'register') return 'register';
    if (params.get('route') === 'ideas' || params.get('idea')) return 'ideas';
    if (params.get('route') === 'admin') return 'admin';
    return 'home';
  });
  const [registerInitialTab, setRegisterInitialTab] = useState<IntakeProgramTab>('workshop');
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);

  const handleNavigate = (route: string, tab?: IntakeProgramTab) => {
    if (tab) setRegisterInitialTab(tab);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div key={language} className="min-h-screen bg-white text-[#0A1930] font-sans selection:bg-[#FFCD00] selection:text-[#0A1930] relative overflow-x-hidden">
      {/* ── Custom Animated Robot Cursor ── */}
      <RoboCursor />
      
      {/* ── 0. Floating Responsive Header ── */}
      <Navbar
        activeTab={currentRoute}
        onNavigate={handleNavigate}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* ── Page Router ── */}
      <main className="w-full">
        {currentRoute === 'home' && (
          <>
            {/* 01. Main Hero / Video & Design Section */}
            <RefHero
              onNavigate={handleNavigate}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 02. Trusted Partners Marquee / Ticker (directly below Hero) */}
            <RefHeroMarquee />

            {/* 03. Dual Experience Pathways: RoboKidovation & Young Innovators Hackathon */}
            <RefTheExperience
              onNavigate={handleNavigate}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 04. Workflow Mind Map: From Parts to City Final */}
            <RefWorkflowMindMap
              onNavigate={handleNavigate}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 04. Top Three Cards: Robo Sprint / Robo Sprint Advanced / Robo Trials */}
            <RefTrackComparison
              onNavigate={handleNavigate}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 04. Design, Build & Compete: Robo Sprint + Arena Match (Cohesive 2-Card Layout) */}
            <RefKioskShowcase
              onNavigate={handleNavigate}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            {/* 05. Competition Pathway: Real 3-Stage Milestone Journey */}
            <RefCompetitionFlow
              onOpenRegister={() => setIsRegisterOpen(true)}
              onNavigate={handleNavigate}
            />

            {/* 05b. Final Venue */}
            <section className="w-full bg-white text-[#0A1930] py-16 sm:py-20 px-3 sm:px-6 border-t border-slate-200">
              <div className="max-w-[1440px] mx-auto">
                <VenueBanner />
              </div>
            </section>

            {/* 06. Tournament Highlights Photo Reel */}
            <RefPhotoStrip
              onOpenRegister={() => handleNavigate('register')}
              onNavigate={handleNavigate}
            />

            {/* 07. Main Conversion Anchor: Bring Hands-On STEM to Your School */}
            <RefWorkshopTapeBanner
              onOpenRegister={() => handleNavigate('register')}
              onOpenDeckModal={() => setIsDeckOpen(true)}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {currentRoute === 'challenges' && (
          <ChallengesPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'how-it-works' && (
          <HowItWorksPage
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'workflow' && (
          <WorkflowPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'for-schools' && (
          <ForSchoolsPage
            onOpenRegister={() => handleNavigate('register')}
            onOpenDeckModal={() => setIsDeckOpen(true)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'lgr22' && (
          <Lgr22Page
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'events' && (
          <EventsPage
            onOpenRegister={() => handleNavigate('register')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'register' && (
          <IntakeRegisterPage
            initialTab={registerInitialTab}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateVoting={() => handleNavigate('ideas')}
          />
        )}

        {currentRoute === 'ideas' && (
          <IdeasVotingPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateSubmit={() => handleNavigate('register', 'submit-idea')}
            onNavigateAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminIdeasCurationPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateVoting={() => handleNavigate('ideas')}
          />
        )}
      </main>

      {/* ── Master Dark Footer with Verified Contacts ── */}
      <RefFooter
        onNavigate={handleNavigate}
        onOpenRegister={() => handleNavigate('register')}
      />

      {/* ── Interactive Modals ── */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onNavigateToFullIntake={(tab) => {
          setIsRegisterOpen(false);
          handleNavigate('register', tab as any);
        }}
      />

      <EventDeckModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
      />

    </div>
  );
}

export default App;
