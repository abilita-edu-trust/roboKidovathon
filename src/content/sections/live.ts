// Sections around live data (bookings and counts, published winners, submitted ideas): the data stays
// automatic, their headings, labels and buttons come from the Site CMS. "{…}" placeholders are filled in.
import { bi, type Bi } from '../core';

export interface MeetUsData {
  eyebrow: Bi;
  title: Bi;
  studentsLabel: Bi;
  schoolsLabel: Bi;
  ideasLabel: Bi;
  morning: Bi;
  afternoon: Bi;
  /** Badge per booking type. */
  kinds: { demo: Bi; workshop: Bi; hackathon: Bi; association: Bi };
}

export const meetUsDefaults = (): MeetUsData => ({
  eyebrow: bi('Workshops & demos near you'),
  title: bi('Meet Us At'),
  studentsLabel: bi('Students Registered'),
  schoolsLabel: bi('Schools Registered'),
  ideasLabel: bi('Ideas Submitted'),
  morning: bi('Morning'),
  afternoon: bi('Afternoon'),
  kinds: { demo: bi('Demo'), workshop: bi('Workshop'), hackathon: bi('Young Inno Hack'), association: bi('Association') },
});

export interface WinnersData {
  eyebrow: Bi;
  /** "{name}" is the hackathon's name. */
  title: Bi;
  first: Bi;
  second: Bi;
  third: Bi;
}

export const winnersDefaults = (): WinnersData => ({
  eyebrow: bi('Results', 'Resultat'),
  title: bi('{name}: winners', 'Vinnare: {name}'),
  first: bi('1st', '1:a'),
  second: bi('2nd', '2:a'),
  third: bi('3rd', '3:e'),
});

export interface VoteData {
  /** "{city}" is the city in capitals. */
  eyebrow: Bi;
  title: Bi;
  /** "{finals}" is where winning ideas go, e.g. "the Västerås Finals". */
  intro: Bi;
  submitButton: Bi;
  allIdeasButton: Bi;
  categoryLabel: Bi;
  allCategories: Bi;
  loading: Bi;
  emptyTitle: Bi;
  emptyText: Bi;
  emptyButton: Bi;
  noPhoto: Bi;
  defaultCategory: Bi;
  /** "{n}" is the number of votes. */
  votes: Bi;
  defaultDescription: Bi;
  voiceNote: Bi;
  playing: Bi;
  listen: Bi;
  pause: Bi;
  voteButton: Bi;
  voted: Bi;
  copyLink: Bi;
  bannerEyebrow: Bi;
  /** "{count}" is the number of ideas. */
  bannerTitle: Bi;
  bannerText: Bi;
  bannerButton: Bi;
}

export const voteDefaults = (): VoteData => ({
  eyebrow: bi('COMMUNITY VOTING ARENA // {city}'),
  title: bi('Vote for an Idea of Young Minds'),
  intro: bi('Explore innovations submitted by students across schools. Listen to voice notes, inspect blueprints, and vote to propel the best ideas to {finals}!'),
  submitButton: bi('+ Submit Idea'),
  allIdeasButton: bi('All Ideas Arena'),
  categoryLabel: bi('Category:'),
  allCategories: bi('All Segregations'),
  loading: bi("Loading young minds' ideas..."),
  emptyTitle: bi('No ideas in this segregation yet'),
  emptyText: bi('Be the first school student to submit an idea in this category!'),
  emptyButton: bi('Submit Student Idea'),
  noPhoto: bi('Concept Blueprint'),
  defaultCategory: bi('Innovation'),
  votes: bi('{n} votes'),
  defaultDescription: bi('Student concept submission.'),
  voiceNote: bi('Voice Note Pitch'),
  playing: bi('Playing pitch audio...'),
  listen: bi('Listen'),
  pause: bi('Pause'),
  voteButton: bi('Vote for this Idea'),
  voted: bi('Voted'),
  copyLink: bi('Copy campaign link'),
  bannerEyebrow: bi('TOP 10 LEADERBOARD & FULL ARENA'),
  bannerTitle: bi('Want to see all {count} student innovations?'),
  bannerText: bi('Head to the full public voting arena to view the ranked leaderboard, search by school, and support young innovators.'),
  bannerButton: bi('View All Ideas & Leaderboard'),
});
