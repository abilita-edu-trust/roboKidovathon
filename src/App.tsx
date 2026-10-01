import { useState } from 'react';
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
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);

  const handleNavigate = (route: string, tab?: IntakeProgramTab) => {
    if (tab) setRegisterInitialTab(tab);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRegister = () => handleNavigate('register');

  const goToVote = () => {
    const scroll = () => document.getElementById('vote-ideas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (currentRoute === 'home') return scroll();
    setCurrentRoute('home');
    setTimeout(scroll, 150);
  };

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
        {currentRoute === 'home' && (
          <>
            {/* 01. Main Hero / Video & Design Section */}
            <RefHero onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 02. Trusted Partners Marquee / Ticker (directly below Hero) */}
            <RefHeroMarquee />

            {/* 03. Meet Us @ — confirmed school bookings + live stats */}
            <section className="w-full bg-white text-[#0A1930] py-14 sm:py-16 px-4 sm:px-6 lg:px-10">
              <div className="max-w-[1560px] mx-auto">
                <CollaboratorsMarquee onNavigate={handleNavigate} />
              </div>
            </section>

            {/* 04. From Classroom to Arena: 3-Stage Competition Pathway */}
            <RefCompetitionFlow onOpenRegister={openRegister} onNavigate={handleNavigate} />

            {/* 05. Choose your pathway: RoboKidovation & Young Inno Hack + venues */}
            <RefTheExperience onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 06. Vote for an idea of young minds */}
            <section id="vote-ideas" className="w-full bg-white text-[#0A1930] py-10 sm:py-14 px-4 sm:px-6 lg:px-10 scroll-mt-20">
              <div className="max-w-[1560px] mx-auto">
                <VoteYoungMindsSection
                  onNavigateIdeas={() => handleNavigate('ideas')}
                  onNavigateSubmit={() => handleNavigate('register', 'submit-idea')}
                  onNavigateAdmin={() => handleNavigate('admin')}
                />
              </div>
            </section>

            {/* 07. Tournament Highlights Photo Reel */}
            <RefPhotoStrip onOpenRegister={openRegister} onNavigate={handleNavigate} />

            {/* 08. Design, Build & Compete */}
            <RefKioskShowcase onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 09. How students progress: STEM learning pathway */}
            <RefWorkflowMindMap onNavigate={handleNavigate} onOpenRegister={openRegister} />

            {/* 10. Bring Hands-On STEM to Your School (Edu Kit → iniac.se) */}
            <RefWorkshopTapeBanner
              onOpenRegister={openRegister}
              onOpenDeckModal={() => setIsDeckOpen(true)}
              onNavigate={handleNavigate}
            />

            {/* 11. Competition league tracks */}
            <RefTrackComparison onNavigate={handleNavigate} onOpenRegister={openRegister} />
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
