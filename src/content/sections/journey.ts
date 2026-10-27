// The students / parents / teachers guide with the season's dates. Its default texts are the ones the
// guide always showed, filled in from the site's journey dates.
import type { SiteConfig } from '../../context/SiteContext';
import { bi, type Bi, type CmsLink } from '../core';
import { targetToHref } from './frame';
import { vfiProgrammes, type ProgrammeJourney } from './audienceJourneys';

export interface JourneyStep {
  title: Bi;
  desc: Bi;
  badge: Bi;
}

export interface JourneyAudience {
  icon: string;
  label: Bi;
  tagline: Bi;
  summary: Bi;
  eligibility: Bi;
  cta: CmsLink;
  altCta: CmsLink;
  steps: JourneyStep[];
}

export interface JourneyData {
  eyebrow: Bi;
  title: Bi;
  intro: Bi;
  /** Programme boxes (RoboKidovation, Young Future InnoHack); with any, they replace the single guide below. */
  programmes: ProgrammeJourney[];
  rulesButton: CmsLink;
  /** "{n}" is the step's number, "{total}" the number of steps. */
  stepLabel: Bi;
  dates: { label: Bi; value: Bi }[];
  note: Bi;
  audiences: JourneyAudience[];
}

const step = (title: string, desc: string, badge: string): JourneyStep => ({ title: bi(title), desc: bi(desc), badge: bi(badge) });

/** Null when the site has no season dates (the guide is not shown, e.g. vxo). */
export function journeyDefaults(c: SiteConfig): JourneyData | null {
  const journey = c.journey;
  if (!journey) return null;
  const hasHackathon = !c.intake.tabs || c.intake.tabs.includes('hackathon');
  const register = (label: string, tab: string): CmsLink => ({ label: bi(label), href: targetToHref(c.nav.registerRoute, tab) });

  const programmes = journey.audienceJourneys;

  return {
    eyebrow: programmes ? bi('FIND YOUR PATH', 'HITTA DIN VÄG') : bi('NAVIGATE YOUR COMPETITION JOURNEY'),
    title: programmes ? bi('Two programmes. One journey for everyone.', 'Två program. En resa för alla.') : bi('Designed for Students, Parents & Teachers'),
    intro: programmes
      ? bi(
          'Pick your programme and who you are to see your steps, what you gain and how to join.',
          'Välj program och vem du är för att se dina steg, vad du får ut och hur du anmäler dig.'
        )
      : bi(
          'Whether you want to build robots, enroll your child, or bring hands-on STEM into your classroom, follow these clear visual steps to get started immediately.'
        ),
    programmes: programmes ? vfiProgrammes((tab) => targetToHref(c.nav.registerRoute, tab)) : [],
    rulesButton: { label: bi('Rules'), href: targetToHref(journey.rulesTarget ?? 'challenges') },
    stepLabel: bi('Step {n} of {total}'),
    dates: journey.dates.map((d) => ({ label: bi(d.label), value: bi(d.value) })),
    note: bi(journey.note ?? ''),
    audiences: [
      {
        icon: 'GraduationCap',
        label: bi('For Students'),
        tagline: bi('Invent, Build Robots & Compete'),
        summary: bi('Join hands-on robotics, program autonomous rovers, or submit your bold ideas for the future.'),
        eligibility: bi('Grades 1–9 & Gymnasium (Individuals, School Teams & Independent Squads)'),
        cta: register('Register a Student or Team', 'workshop'),
        altCta: register('Submit Your Innovation Idea', 'submit-idea'),
        steps: [
          step(
            'Discover the Competition',
            hasHackathon
              ? 'Explore Robo-Sprint, Robo-Precision, and the Young Inno Hack innovation arena.'
              : 'Explore the Robo-Sprint and Robo-Precision challenges and pick your category.',
            'Explore Tracks'
          ),
          step('Check Your Category', 'Junior (Grades 3–6), Senior (Grades 7–9), Gymnasium, or Grades 1–2 participant session.', 'Eligibility'),
          step('Register Online', 'Sign up as a team or submit an idea with voice notes, sketches, or video pitches.', 'Online Intake'),
          step('Hands-On Build & Practice', 'Assemble official hardware kits and practice on regulation 244 × 122 cm arena mats.', 'Preparation'),
          step(
            journey.studentsExtra ? 'Grand Finals & Elevation' : 'Compete in the Final',
            `Compete in the Final ${journey.finals}.${journey.studentsExtra ? ` ${journey.studentsExtra}` : ''}`,
            'Arena Showdown'
          ),
        ],
      },
      {
        icon: 'Users',
        label: bi('For Parents'),
        tagline: bi('Empower Practical STEM Skills'),
        summary: bi('Give your child real-world engineering, teamwork, and problem-solving experience with official mentors.'),
        eligibility: bi('All students aged 7–19. Independent family & neighbourhood teams welcome.'),
        cta: register('Register Your Child / Team', 'workshop'),
        altCta: register('Submit an Idea', 'submit-idea'),
        steps: [
          step('Discover the Programme', 'Structured 20-hour STEM robotics curriculum and open innovation challenges.', 'Hands-On STEM'),
          step('Understand Requirements', 'No prior robotics experience needed. All kits, tools, and training materials are supplied.', 'Zero Barrier'),
          step('Register Easily', 'Complete the quick registration form and receive an official confirmation token.', 'Instant Token'),
          step('Guided Mentorship', 'Children learn mechanics, motors, sensors, and coding in supportive, friendly sessions.', 'Mentorship'),
          step('Finals Day Celebration', `Attend the Final ${journey.finals} and celebrate student achievements.`, 'Family Friendly'),
        ],
      },
      {
        icon: 'School',
        label: bi('For Teachers & Schools'),
        tagline: bi('Bring STEM & Robotics to Your Class'),
        summary: bi('Lgr22 curriculum-aligned robotics demos and 20-hour STEM workshops delivered straight to your school.'),
        eligibility: bi('Primary, Middle, and Secondary schools, and educational associations across Sweden.'),
        cta: register('Book School Demo or Workshop', 'demo'),
        altCta: register('Register Association / Class', 'association'),
        steps: [
          step('Discover School Pathways', 'Auditorium demos, hands-on classroom workshops, and in-school qualifiers.', 'Lgr22 Aligned'),
          step('Review Curriculum Fit', 'Integrates with Technology and Physics syllabus requirements without altering lesson plans.', 'Turnkey Solution'),
          step('Request a Session', 'Pick your preferred school dates and schedule a coordinator call.', 'Flexible Dates'),
          step('Equipment & Delivery', 'Kits, mats, and certified instructors arrive at your school. Zero school budget required.', 'All Provided'),
          step('Represent Your School', `Up to 4 teams per school or association qualify for the Final ${journey.finals}.`, 'School Glory'),
        ],
      },
    ],
  };
}
