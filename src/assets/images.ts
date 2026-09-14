// Centralized image catalog for RoboKidovation / Blix-A-Thon competition assets

// 1. Official Kit Piece Lists (Hardware Bills of Material)
import roboPrecisionKitPieces from './WhatsApp Image 2026-09-09 at 15.11.07.jpeg';
import roboSprintKitPieces from './WhatsApp Image 2026-09-09 at 15.11.15.jpeg';

// 2. Official 3D Arena Mat Schematics (Arena Specifications)
import roboSprintArenaMat from './WhatsApp Image 2026-09-09 at 15.11.12 (1).jpeg';
import roboPrecisionArenaMat from './WhatsApp Image 2026-09-09 at 15.11.11.jpeg';
import roboSprintMatFocus from './robo_sprint_mat_focus.jpeg';
import roboPrecisionMatFocus from './robo_precision_mat_focus.jpeg';

// 3. Live Match Action Photography: Robo-Sprint (Ball Passing & Hurdle Agility)
import roboSprintActionWide from './WhatsApp Image 2026-09-09 at 15.11.09 (1).jpeg';
import roboSprintDuel from './WhatsApp Image 2026-09-09 at 15.11.13.jpeg';
import roboSprintObstacleClose from './WhatsApp Image 2026-09-09 at 15.11.11 (1).jpeg';
import roboSprintTopDown from './WhatsApp Image 2026-09-09 at 15.11.08 (1).jpeg';
import roboSprintTrackArch from './WhatsApp Image 2026-09-09 at 15.11.10.jpeg';
import roboSprintStartTrack from './WhatsApp Image 2026-09-09 at 15.11.12.jpeg';

// 4. Live Match Action Photography: Robo-Precision (Cup Stacking & Robotic Arms)
import roboPrecisionActionWide from './WhatsApp Image 2026-09-09 at 15.11.09.jpeg';
import roboPrecisionFacingDual from './WhatsApp Image 2026-09-09 at 15.11.14.jpeg';
import roboPrecisionTowerBot from './WhatsApp Image 2026-09-09 at 15.11.12 (2).jpeg';
import roboPrecisionArenaEmpty from './WhatsApp Image 2026-09-09 at 15.11.08.jpeg';
import mascotRobotHeader from './mascot_robot_header.jpg';
import bannerRoboSprint from './banner_robo_sprint.jpg';
import bannerRoboSprintJunior from './banner_robo_sprint_junior.jpg';
import bannerRoboSprintAdvanced from './banner_robo_sprint_advanced.jpg';
import bannerRoboSprintSenior from './banner_robo_sprint_senior.jpg';
import bannerRoboQuiz from './banner_robo_quiz.jpg';
import bannerRoboTrials from './banner_robo_trials.jpg';
import bannerActionStripCollage from './banner_action_strip_collage.jpg';
import cardRoverSprint from './card_rover_sprint.jpg';
import cardRoverAdvanced from './card_rover_advanced.jpg';
import cardRobotQuiz from './card_robot_quiz.jpg';
import kitRoverOfficial from './kit_rover_official.jpg';
import arenaCourtReference from './arena_court_hd.jpg';
import cadBlueprintReference from './cad_blueprint_reference.png';
import ecosystemRobotTop from './ecosystem_robot_top.png';

export {
  // Ecosystem Assets (Design, Build & Compete)
  kitRoverOfficial,
  arenaCourtReference,
  cadBlueprintReference,
  ecosystemRobotTop,

  // Card Banners (User Provided Official Assets)
  bannerRoboSprint,
  bannerRoboSprintJunior,
  bannerRoboSprintAdvanced,
  bannerRoboSprintSenior,
  bannerRoboQuiz,
  bannerRoboTrials,
  bannerActionStripCollage,

  // 3D Illustration Mascot & Rover Assets
  mascotRobotHeader,
  cardRoverSprint,
  cardRoverAdvanced,
  cardRobotQuiz,

  // Kit piece lists
  roboSprintKitPieces,
  roboPrecisionKitPieces,

  // Arena mat schematics
  roboSprintArenaMat,
  roboPrecisionArenaMat,
  roboSprintMatFocus,
  roboPrecisionMatFocus,

  // Robo-Sprint match photos
  roboSprintActionWide,
  roboSprintDuel,
  roboSprintObstacleClose,
  roboSprintTopDown,
  roboSprintTrackArch,
  roboSprintStartTrack,

  // Robo-Precision match photos
  roboPrecisionActionWide,
  roboPrecisionFacingDual,
  roboPrecisionTowerBot,
  roboPrecisionArenaEmpty,
};

export interface CompetitionMediaItem {
  id: string;
  title: string;
  category: 'sprint' | 'precision' | 'schematic' | 'kit';
  tag: string;
  desc: string;
  src: string;
  aspect: 'landscape' | 'portrait' | 'square';
}

export const TOURNAMENT_GALLERY: CompetitionMediaItem[] = [
  {
    id: 'action-strip-collage',
    title: 'Workshop Build to Arena Showdown',
    category: 'sprint',
    tag: 'BLIX-A-THON ACTION REEL',
    desc: 'From tactical barrier obstacle navigation to workbench assembly and live podium cup stacking.',
    src: bannerActionStripCollage,
    aspect: 'portrait',
  },
  {
    id: 'sprint-action-1',
    title: 'Robo-Sprint Barrier Face-Off',
    category: 'sprint',
    tag: 'ROBO-SPRINT LEAGUE',
    desc: 'Two student-engineered robots navigating the central zigzag obstacle course with real ping-pong balls.',
    src: roboSprintActionWide,
    aspect: 'landscape',
  },
  {
    id: 'precision-crowd-1',
    title: 'Robo-Precision Championship Heats',
    category: 'precision',
    tag: 'CUP STACKING CHALLENGE',
    desc: 'Multi-stage gear-reduction robotic arms placing scored cups on elevated podiums in front of active student spectators.',
    src: roboPrecisionActionWide,
    aspect: 'landscape',
  },
  {
    id: 'sprint-duel-2',
    title: 'Fast-Paced Court Ball-Passing',
    category: 'sprint',
    tag: 'AIR-HOCKEY FORMAT',
    desc: 'Teams maneuver wired remote-controlled robots to transfer balls across the central hurdle into the opponent court.',
    src: roboSprintDuel,
    aspect: 'landscape',
  },
  {
    id: 'precision-tower-bot',
    title: 'Vertical Rack-and-Pinion Lifter',
    category: 'precision',
    tag: 'MECHANICAL INNOVATION',
    desc: 'High-reach vertical lift bot stacking cup #40 onto the podium before the final buzzer.',
    src: roboPrecisionTowerBot,
    aspect: 'portrait',
  },
  {
    id: 'precision-facing-bots',
    title: 'Precision Dual Arena Showdown',
    category: 'precision',
    tag: 'INTER-SCHOOL ARENA',
    desc: 'Head-to-head match across the hazard-striped dividing line with wired transmitters and 6V DC drivetrains.',
    src: roboPrecisionFacingDual,
    aspect: 'landscape',
  },
  {
    id: 'sprint-obstacle-close',
    title: 'Close-Quarters Chassis Navigation',
    category: 'sprint',
    tag: 'HARDWARE ENGINEERING',
    desc: 'Custom chassis with front scoop clearing balls through narrow passage arches under match pressure.',
    src: roboSprintObstacleClose,
    aspect: 'landscape',
  },
  {
    id: 'sprint-top-down',
    title: 'Tactical Overhead Arena View',
    category: 'sprint',
    tag: 'MATCH STRATEGY',
    desc: 'Overhead view displaying the central obstacle matrix, ball distribution, and robot movement lines.',
    src: roboSprintTopDown,
    aspect: 'portrait',
  },
  {
    id: 'precision-arena-overview',
    title: 'Official Competition Arena Layout',
    category: 'precision',
    tag: 'TOURNAMENT VENUE',
    desc: 'Full competition arena mats deployed across the event floor ready for student heats.',
    src: roboPrecisionArenaEmpty,
    aspect: 'portrait',
  },
];
