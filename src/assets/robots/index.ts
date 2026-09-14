import robotHoldingCursor from './robot-holding-cursor.png';
import robotPointer from './robot-pointer.png';
import robotThinking from './robot-thinking.png';
import robotMagnifier from './robot-magnifier.png';
import robotLaptop from './robot-laptop.png';
import robotFlying from './robot-flying.png';
import robotHeart from './robot-heart.png';
import robotWaving from './robot-waving.png';
import robotIdea from './robot-idea.png';
import robotQuestion from './robot-question.png';
import robotSleeping from './robot-sleeping.png';
import robotRunning from './robot-running.png';
import robotClicking from './robot-clicking.png';
import robotCheering from './robot-cheering.png';
import robotLoading from './robot-loading.png';

export const robotSprites = {
  holdingCursor: robotHoldingCursor,
  pointer: robotPointer,
  thinking: robotThinking,
  magnifier: robotMagnifier,
  laptop: robotLaptop,
  flying: robotFlying,
  heart: robotHeart,
  waving: robotWaving,
  idea: robotIdea,
  question: robotQuestion,
  sleeping: robotSleeping,
  running: robotRunning,
  clicking: robotClicking,
  cheering: robotCheering,
  loading: robotLoading,
} as const;

export type RobotPoseKey = keyof typeof robotSprites;
