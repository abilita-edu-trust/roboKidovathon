import {
  roboSprintActionWide,
  roboPrecisionFacingDual,
  roboSprintArenaMat,
  roboPrecisionArenaMat,
  roboSprintMatFocus,
  roboPrecisionMatFocus,
  roboSprintKitPieces,
  roboPrecisionKitPieces,
} from '../assets/images';

export interface CompetitionCategory {
  id: 'robo-sprint-explorer' | 'robo-sprint-advanced' | 'robo-precision';
  code: 'CAT A' | 'CAT B' | 'CAT C';
  title: string;
  division: string;
  ageRange: string;
  duration: string;
  format: string;
  objective: string;
  dimensions: string;
  scoring: string;
  keyRule: string;
  tieBreak: string[];
  judgingWeights: { label: string; pct: string }[];
  robotRequirements: string[];
  demonstrates: string[];
  accentColor: string;
  accentBg: string;
  accentText: string;
  imageUrl: string;
  arenaMatUrl?: string;
  arenaMatFocusUrl?: string;
  kitImageUrl?: string;
  rulesLink: string;
  specs: { label: string; value: string }[];
}

export interface RoadmapStep {
  stepNumber: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  isMilestone?: boolean;
}

export interface ChampionshipStage {
  stageNumber: string;
  stageCode: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  advancement: string;
  active?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Eligibility' | 'Hardware & Kits' | 'Schools & Fees' | 'Competition & Arena' | 'Judging & Safety' | 'Curriculum & Lgr22';
}

export interface PartnerLogo {
  name: string;
  file: string;
  role: string;
}

export interface KitPiece {
  label: string;
  qty: string;
}

export interface UpcomingEvent {
  id: string;
  date: string;
  day: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  categories?: string[];
  curriculumNote?: string;
  cta: string;
  ctaAction: 'register' | 'external' | 'none';
}

export interface Lgr22Subject {
  subject: string;
  connections: string[];
}

export interface AgePathway {
  id: string;
  grades: string;
  name: string;
  focus: string[];
  message: string;
  detail: string;
}

export interface ProjectSession {
  session: number;
  hours: string;
  focus: string;
}

export interface ProjectDeliverable {
  title: string;
  desc: string;
}

export interface LearningBlock {
  tag: string;
  desc: string;
  detail: string;
}

export const STATS_DATA = [
  { value: '4', label: 'HOST PARTNERS', sub: 'IBK · INIAC · SKILLSKOLAN · BLIX', accent: 'text-[#006AA7]' },
  { value: '20H', label: 'STEM PROJECT', sub: '10 SESSIONS · BUILD TO COMPETE', accent: 'text-[#0A1930]' },
  { value: 'SEK 3,000', label: 'PRIZE POOL', sub: '1,200 EXPLORER + 1,800 ADVANCED', accent: 'text-[#006AA7]' },
  { value: 'DEC 5', label: 'GRAND FINALE', sub: 'VÄSTERÅS, SWEDEN · 2026', accent: 'text-[#0A1930]' },
];

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: 'Indisk BarnKlubb (IBK) Västerås', file: '/ibk logo.png', role: 'Host & Organizer' },
  { name: 'INIAC', file: '/iniac logo.png', role: 'Programme & Pedagogy Partner' },
  { name: 'SkillSkolan', file: '/skillskolan logo.png', role: 'Education Delivery Partner' },
  { name: 'Blix', file: '/blix a thon logo.png', role: 'Technology & Kit Partner' },
];

export const KIT_PIECES: KitPiece[] = [
  { label: 'CT2', qty: '112 pcs' },
  { label: 'CT3', qty: '60 pcs' },
  { label: 'CH2', qty: '80 pcs' },
  { label: 'CL2', qty: '72 pcs' },
  { label: 'TW1', qty: '72 pcs' },
  { label: 'TW2', qty: '40 pcs' },
  { label: 'PC3', qty: '16 pcs' },
  { label: 'P5 Plus', qty: '4 pcs' },
  { label: 'P3', qty: '32 pcs' },
  { label: 'P3C2', qty: '20 pcs' },
  { label: 'P5 Nut', qty: '2 pcs' },
  { label: 'P5', qty: '40 pcs' },
  { label: 'P7', qty: '24 pcs' },
  { label: 'P11', qty: '32 pcs' },
  { label: 'P7x11', qty: '8 pcs' },
  { label: 'PU5x7', qty: '16 pcs' },
  { label: 'PU5x13', qty: '8 pcs' },
  { label: 'Rack', qty: '12 pcs' },
  { label: 'Pulley', qty: '4 pcs' },
  { label: 'CT1x2', qty: '12 pcs' },
  { label: 'G20 Plus', qty: '8 pcs' },
  { label: 'G20 Idler', qty: '8 pcs' },
  { label: 'G60', qty: '8 pcs' },
  { label: 'Thread', qty: '2 pcs' },
  { label: 'Power Screw', qty: '2 pcs' },
  { label: 'SH60', qty: '6 pcs' },
  { label: 'SH100', qty: '8 pcs' },
  { label: 'SH170', qty: '6 pcs' },
  { label: 'Wheels', qty: '8 pcs' },
  { label: 'Leaflet', qty: '1 pc' },
  { label: 'Remover Tool', qty: '2 pcs' },
  { label: 'P21x21', qty: '2 pcs' },
  { label: 'Ball', qty: '1 pc' },
  { label: 'MDF Arena Part', qty: '1 pc' },
  { label: 'Ethernet Cable', qty: '1 pc' },
  { label: 'Rubber Band', qty: '5 pcs' },
  { label: 'Transmitter (Wired)', qty: '1 pc' },
  { label: 'Receiver (Wired)', qty: '1 pc' },
  { label: 'DC Gearbox', qty: '4 pcs' },
  { label: '6V Battery Box', qty: '1 pc' },
  { label: 'Screwdriver', qty: '1 pc' },
];

export const COMPETITION_CATEGORIES: CompetitionCategory[] = [
  {
    id: 'robo-sprint-explorer',
    code: 'CAT A',
    title: 'ROBO-SPRINT',
    division: 'EXPLORER LEAGUE',
    ageRange: 'GRADES 3 – 6',
    duration: '3 MINUTES PER MATCH',
    format: 'Arena Ball-Transfer Challenge',
    objective: 'Move as many balls as possible from your side into the opponent’s side before time ends. Each match begins with an equal number of balls on both sides of the arena.',
    dimensions: '2.44 m × 1.22 m arena (8 ft × 4 ft)',
    scoring: 'Each ball successfully moved into the opponent’s side scores 5 points. Ties are broken by fewer balls remaining on your own side, then a one-minute tie-break round, then sudden death on the first ball.',
    keyRule: 'This mode builds confidence, mechanisms, movement and teamwork. Robots may push or guide balls but must not trap them permanently, and must stay within the arena throughout play.',
    tieBreak: ['Fewer balls remaining on own side', 'One-minute tie-break round', 'Sudden-death first-ball challenge'],
    judgingWeights: [
      { label: 'Match performance', pct: '70%' },
      { label: 'Robot design & improvement', pct: '20%' },
      { label: 'Teamwork & explanation', pct: '10%' },
    ],
    robotRequirements: [
      'Maximum starting size: 0.46 m × 0.46 m',
      'Robot built primarily by the student team during the STEM project',
      'Motorised movement and simple remote/manual control are allowed',
      'A pushing or guiding mechanism may be used to move balls',
      'No sharp, dangerous or damaging mechanisms',
      'Robots must remain within the arena during play',
    ],
    demonstrates: [
      'Stable robot construction',
      'Wheels, axles and movement',
      'Motor control',
      'Direction and turning',
      'Simple pushing mechanisms',
      'Testing and improvement',
      'Team strategy',
    ],
    accentColor: '#006AA7',
    accentBg: 'bg-[#006AA7]',
    accentText: 'text-white',
    imageUrl: roboSprintActionWide,
    arenaMatUrl: roboSprintArenaMat,
    arenaMatFocusUrl: roboSprintMatFocus,
    kitImageUrl: roboSprintKitPieces,
    rulesLink: 'challenges',
    specs: [
      { label: 'ARENA SIZE', value: '2.44 m × 1.22 m (8 × 4 ft)' },
      { label: 'MATCH LENGTH', value: '3 Minutes' },
      { label: 'SCORING', value: '5 Points Per Ball' },
      { label: 'FOCUS', value: 'Movement, Control, Teamwork' },
    ]
  },
  {
    id: 'robo-sprint-advanced',
    code: 'CAT B',
    title: 'ROBO-PRECISION & SPRINT',
    division: 'SENIOR LEAGUE',
    ageRange: 'GRADES 7 – 9',
    duration: '6 MINUTES PER MATCH',
    format: 'Multi-Phase Arena Challenge: Agility & Cup Stacking',
    objective: 'Deploy gear-driven robotic arms and high-torque drivetrains to maneuver arena barriers, capture scoring cups, and stack them onto platform targets.',
    dimensions: 'Shared 8 ft × 4 ft divided arena mat',
    scoring: 'Scored cups on designated podiums + fewest penalty balls at final whistle.',
    keyRule: 'Each team starts with 5 balls in their court. Focus is on precision control, robotic arm kinematics, gear ratios, and strategic placement under pressure.',
    tieBreak: ['Fewest penalty balls', 'Fastest cup placement time', 'Referee discretion'],
    judgingWeights: [
      { label: 'Precision Control', pct: '35%' },
      { label: 'Speed & Efficiency', pct: '25%' },
      { label: 'Strategy', pct: '25%' },
      { label: 'Build Quality', pct: '15%' },
    ],
    robotRequirements: [
      'Maximum starting size: 0.46 m × 0.46 m',
      'Robotic arm or gripper mechanism required for cup placement',
      'Gear-driven drivetrain with minimum 2-stage reduction',
      'No sharp, dangerous or damaging mechanisms',
      'Robot must stay within the arena boundary during play',
      'Arm must retract within robot footprint before match start',
    ],
    demonstrates: [
      'Gear ratios and torque',
      'Robotic arm kinematics',
      'Precision motor control',
      'Cup-stacking strategy',
      'Arena navigation under time pressure',
      'Collaborative build planning',
    ],
    accentColor: '#FFCD00',
    accentBg: 'bg-[#FFCD00]',
    accentText: 'text-[#0A1930]',
    imageUrl: roboPrecisionFacingDual,
    arenaMatUrl: roboPrecisionArenaMat,
    arenaMatFocusUrl: roboPrecisionMatFocus,
    kitImageUrl: roboPrecisionKitPieces,
    rulesLink: 'challenges',
    specs: [
      { label: 'ARENA SIZE', value: '8 ft × 4 ft Divided Court' },
      { label: 'MATCH LENGTH', value: '6 Minutes' },
      { label: 'STARTING BALLS', value: '5 Per Team Court' },
      { label: 'FOCUS', value: 'Arm Kinematics, Gearing, Speed' },
    ]
  }
];

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    stepNumber: '01',
    tag: 'STAGE 01 // LEARN',
    title: 'LEARN',
    subtitle: 'STEM Project Kickoff',
    description: 'Start the 20-hour in-school STEM project: explore components, mechanisms and movement, form your team, and get hands-on with the official Robo-Sprint kit. No prior robotics experience required.',
    badge: 'SCHOOL ROUND'
  },
  {
    stepNumber: '02',
    tag: 'STAGE 02 // BUILD',
    title: 'BUILD',
    subtitle: 'Assemble Your Robot',
    description: 'Build your Robo-Sprint robot from the competition kit — chassis, gearbox, wheels, and wired transmitter — testing stability, wheel placement and motor connection as you go.',
  },
  {
    stepNumber: '03',
    tag: 'STAGE 03 // CHALLENGE',
    title: 'CHALLENGE',
    subtitle: 'School Robo-Sprint (Qualifiers)',
    description: 'Test, measure and improve your design, then compete in Robo-Sprint matches within your own school in October 2026. One winning Explorer team and one winning Advanced team qualify per school.',
    badge: 'OCTOBER 2026'
  },
  {
    stepNumber: '04',
    tag: 'STAGE 04 // INNOVATE',
    title: 'INNOVATE',
    subtitle: 'Redesign & Refine',
    description: 'Qualifying teams redesign, troubleshoot and refine positioning, speed and teamwork ahead of the inter-school Grand Finale.',
  },
  {
    stepNumber: '05',
    tag: 'STAGE 05 // CELEBRATE',
    title: 'CELEBRATE',
    subtitle: 'Västerås Future Innovators — Robo-Sprint City Final',
    description: 'Qualifying teams face off at the Robo-Sprint City Final on December 5, 2026 — an inter-school competition and innovation showcase with SEK 3,000 in prizes, trophies, and certificates.',
    isMilestone: true,
    badge: 'GRAND FINALE'
  }
];

export const CHAMPIONSHIP_STAGES: ChampionshipStage[] = [
  {
    stageNumber: '01',
    stageCode: 'STAGE 01',
    title: 'ROBOSKOLAN ROBO LEAGUE',
    subtitle: 'QUALIFIERS — WITHIN EACH SCHOOL',
    date: 'OCTOBER 2026',
    location: 'PARTICIPATING SCHOOL VENUES · VÄSTERÅS',
    description: 'A 20-hour, ten-session in-school STEM project — learn, build, test, improve and apply — held inside each participating school and completed with School Robo-Sprint matches.',
    advancement: '1 WINNING EXPLORER TEAM & 1 WINNING ADVANCED TEAM PER SCHOOL QUALIFY',
    active: false
  },
  {
    stageNumber: '02',
    stageCode: 'STAGE 02',
    title: 'VÄSTERÅS FUTURE INNOVATORS ROBO-SPRINT CITY FINAL',
    subtitle: 'INTER-SCHOOL COMPETITION & SHOWCASE',
    date: 'DECEMBER 5, 2026',
    location: 'MÄLARDALEN INTERNATIONAL SCHOOL, VÄSTERÅS',
    description: 'Winning school teams compete live in the Robo-Sprint arena for cash prizes, trophies, and certificates, alongside an innovation and robotics showcase.',
    advancement: 'SEK 3,000 AWARDED — 1,200 EXPLORER + 1,800 ADVANCED',
    active: true
  }
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'robokidovation-final',
    date: 'DECEMBER 5, 2026',
    day: 'SATURDAY · DEC 5',
    title: 'Västerås Future Innovators — Robo-Sprint City Final',
    subtitle: 'Explorer (Grades 3–6) & Advanced (Grades 7–9) Championships',
    location: 'Mälardalen International School, Västerås',
    description: 'School champions from the autumn STEM project compete live in the Robo-Sprint arena, judged across match performance, engineering design, teamwork and technical explanation.',
    categories: ['Grades 3–6', 'Grades 7–9'],
    cta: 'REGISTER YOUR SCHOOL',
    ctaAction: 'register',
  },
  {
    id: 'young-innovators-hackathon',
    date: 'DECEMBER 5, 2026',
    day: 'SATURDAY · DEC 5',
    title: 'Young Innovators Hackathon',
    subtitle: 'At Mälardalen International School, Västerås',
    location: 'Mälardalen International School, Västerås',
    description: 'A one-day interdisciplinary innovation challenge where student teams tackle a real-world problem — sustainable cities, climate and environment, future schools, energy, accessibility, health, AI or technology for society — and present a concept, model, prototype or digital solution to a jury. Unlike the robotics track, no previous robotics experience is required, so students interested in science, technology, design, creativity or entrepreneurship can take part.',
    curriculumNote: 'For grundskolan, the hackathon supports the broader intentions of Lgr22 by giving students opportunities to use creativity, curiosity, initiative, problem-solving and collaboration in a practical context, following the technology-development process from identifying a need through construction, testing and evaluation. For gymnasium students, it can complement Gy25 through project-based problem-solving, technical development, programming and interdisciplinary work — fitting well with the Technology Programme, where technical processes and links between technology and societal development are important elements.',
    cta: 'ASK ABOUT THE HACKATHON',
    ctaAction: 'register',
  },
];

export const KIT_LEARNING_TAGS = [
  'Construction', 'Mechanics', 'Electricity', 'Electronics', 'Sensors', 'Coding', 'Robotics',
];

export interface WhyParticipateReason {
  title: string;
  desc: string;
  detail: string;
}

export const WHY_SCHOOLS_PARTICIPATE: WhyParticipateReason[] = [
  {
    title: 'Practical STEM Learning',
    desc: 'Students learn by doing.',
    detail: 'Every team leaves the 20-hour project with a functioning robot, design documentation, test results, an engineering reflection and a team presentation — evidence of learning, not just attendance.',
  },
  {
    title: 'Accessible To Beginners',
    desc: 'No previous robotics experience required.',
    detail: 'The programme takes students step by step from understanding components (wheels, axles, gears, motors) to building a working robot — no prior coding or robotics background needed to start.',
  },
  {
    title: 'Teacher-Friendly Structure',
    desc: 'INIAC provides programme, equipment and guidance.',
    detail: 'Kits, gearboxes and arena mats are brought directly into the classroom across ten 2-hour sessions (or a lighter 10–12 hour version for younger cohorts) — no lab budget or equipment purchases needed.',
  },
  {
    title: 'School-To-City Pathway',
    desc: 'Students can represent their school beyond the classroom.',
    detail: 'Winning Explorer and Advanced teams from each school\'s Robo-Sprint qualifiers advance directly to the Västerås Future Innovators Robo-Sprint City Final on December 5, 2026.',
  },
];

export const LGR22_SUBJECTS: Lgr22Subject[] = [
  {
    subject: 'Teknik',
    connections: ['Simple mechanisms', 'Construction', 'Materials and stability', 'Technical development work', 'Testing and improving solutions', 'Control and regulation'],
  },
  {
    subject: 'Matematik',
    connections: ['Measurement', 'Comparison', 'Time', 'Distance', 'Angles and direction', 'Simple data collection', 'Scoring and strategy'],
  },
  {
    subject: 'NO/Fysik',
    connections: ['Force', 'Motion', 'Friction', 'Energy', 'Electricity', 'Motors'],
  },
];

export const AGE_PATHWAYS: AgePathway[] = [
  {
    id: 'explorer',
    grades: 'Grades 3–6',
    name: 'Robo-Sprint Explorer',
    focus: ['Basic mechanisms', 'Construction', 'Movement', 'Motor control', 'Teamwork', 'Testing'],
    message: 'Build a robot that moves reliably, solve the challenge and learn through experimentation.',
    detail: 'The question students ask is simple: "Can we build something that moves reliably and solve the challenge together?" Explorer teams spend the 20-hour STEM project on structure, wheels, axles and motor connection, then apply it in the Robo-Sprint Explorer arena — a 3-minute, ball-transfer match judged 70% on match performance, 20% on robot design & improvement, and 10% on teamwork & explanation.',
  },
  {
    id: 'advanced',
    grades: 'Grades 7–9',
    name: 'Robo-Sprint Advanced',
    focus: ['Engineering design', 'Control', 'Measurement', 'Optimisation', 'Programming/sensors where relevant', 'Technical documentation'],
    message: 'Design, measure and optimise a technical solution for competition.',
    detail: 'The question shifts to: "How can we engineer, measure and optimise a better solution?" Advanced teams go deeper into control, sensors and strategy within the same 20-hour project, then compete in the same 3-minute Robo-Sprint arena — judged 60% on match performance, 25% on engineering & technical design, and 15% on testing, documentation & explanation.',
  },
  {
    id: 'precision',
    grades: 'Gymnasium · 15+',
    name: 'Robo-Precision',
    focus: ['Autonomous control', 'Crane & servo kinematics', 'Balance and stability', 'Precision manipulation', 'Sensor feedback', 'Technical documentation'],
    message: 'Engineer a fully autonomous crane arm that builds the tallest stable tower — zero human touch once the build begins.',
    detail: 'A gymnasium-level track that pairs naturally with Gy25\'s programming and software-development focus. Robo-Precision teams programme the entire build sequence in advance — no manual control once the 5-minute match starts — and are judged 60% on tower height & stability, 30% on engineering & autonomy design, and 10% on documentation & explanation.',
  },
];

export interface Gy25Connection {
  audience: string;
  connections: string[];
  note: string;
}

export const GY25_CONNECTIONS: Gy25Connection = {
  audience: 'Gymnasium Students',
  connections: ['Programming knowledge', 'Methods for software development', 'Solving programming-related problems', 'Analysing and presenting results', 'Individual & collaborative project work'],
  note: 'For participating gymnasium students, Västerås Future Innovators can complement Gy25, particularly within technology and programming-oriented education. Students practise applying programming to practical problems, developing and testing solutions, analysing results, and working individually and collaboratively in a project environment.',
};

export const STEM_PROJECT_SESSIONS: ProjectSession[] = [
  { session: 1, hours: '2h', focus: 'STEM challenge, components, mechanisms, safety' },
  { session: 2, hours: '2h', focus: 'Structure, wheels, axles, gears and movement' },
  { session: 3, hours: '2h', focus: 'Motors, control and basic robot construction' },
  { session: 4, hours: '2h', focus: 'Build the first working robot' },
  { session: 5, hours: '2h', focus: 'Testing: speed, stability, direction and force' },
  { session: 6, hours: '2h', focus: 'Engineering design: improve for Robo-Sprint' },
  { session: 7, hours: '2h', focus: 'Measurement, data, scoring and strategy' },
  { session: 8, hours: '2h', focus: 'Team redesign, troubleshooting and iteration' },
  { session: 9, hours: '2h', focus: 'Documentation, presentation and competition preparation' },
  { session: 10, hours: '2h', focus: 'School Robo-Sprint + reflection and selection for city final' },
];

export const STEM_PROJECT_DELIVERABLES: ProjectDeliverable[] = [
  { title: 'A functioning robot', desc: 'Built and improved by the students.' },
  { title: 'Design documentation', desc: 'Sketches, component choices and changes they made.' },
  { title: 'Test results', desc: 'For example speed, movement accuracy, stability or performance.' },
  { title: 'Engineering reflection', desc: 'What worked? What failed? What did we improve?' },
  { title: 'Team presentation', desc: 'Students explain their technical choices.' },
  { title: 'Competition performance', desc: 'Robo-Sprint becomes the final application of the project.' },
];

export const LEARNING_BLOCKS: LearningBlock[] = [
  {
    tag: 'BUILD',
    desc: 'Structures, wheels, gears, mechanisms and movement',
    detail: 'Sessions 1–4 of the 20-hour project: students explore components and safety, then work through structure, wheels, axles, gears and motor connection until they have a first working robot.',
  },
  {
    tag: 'EXPLORE',
    desc: 'Electricity, circuits, forces, energy and sensors',
    detail: 'Uses the same reusable Blix kit across construction, mechanics, electricity, electronics and sensors — one physical platform that supports different ages and skill levels rather than a robotics-only toolkit.',
  },
  {
    tag: 'CODE',
    desc: 'Logic, control, programming and automation',
    detail: 'Programming and sensor-assisted control come in at the Advanced (Grades 7–9) and Robo-Precision (Gymnasium/Gy25) levels, where teams move from manual control into control logic and autonomy.',
  },
  {
    tag: 'CREATE',
    desc: 'Design, test, improve and solve problems',
    detail: 'Sessions 5–8: testing speed, stability, direction and force, then engineering redesigns, measurement and data-driven strategy ahead of the school Robo-Sprint qualifiers.',
  },
  {
    tag: 'COMPETE',
    desc: 'Apply the learning through Västerås Future Innovators',
    detail: 'Sessions 9–10 close with documentation and presentation prep, then School Robo-Sprint qualifiers — winning teams represent their school at the Robo-Sprint City Final on December 5, 2026.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who can participate in Västerås Future Innovators 2026?',
    answer: 'Students up to Grade 9 are eligible, split into two categories: the Robo-Sprint Explorer league (Grades 3–6) and the Robo-Sprint Advanced league (Grades 7–9).',
    category: 'Eligibility'
  },
  {
    id: 'faq-2',
    question: 'Is prior coding or robotics experience required to join?',
    answer: 'No prior experience is necessary. Every team works through the 20-hour, ten-session in-school STEM project — covering components, assembly, testing and team formation — before matches begin.',
    category: 'Hardware & Kits'
  },
  {
    id: 'faq-3',
    question: 'What does the competition kit include?',
    answer: 'Each team builds with the official Robo-Sprint kit — chassis parts, gearboxes, wheels, a wired transmitter and receiver, battery box, arena ball, and assembly tools.',
    category: 'Hardware & Kits'
  },
  {
    id: 'faq-4',
    question: 'How does the ROBO-SPRINT challenge work?',
    answer: 'It’s an arena ball-transfer challenge. Each match begins with an equal number of balls on both sides, and teams try to move as many as possible into the opponent’s side. Every ball moved across scores 5 points. Both the Explorer and Advanced leagues play 3-minute matches; ties are broken by fewer balls remaining, then a tie-break round, then sudden death.',
    category: 'Competition & Arena'
  },
  {
    id: 'faq-5',
    question: 'What is the competition structure?',
    answer: 'Stage 1 is the RoboSkolan Robo League qualifiers, held within each school across the 20-hour STEM project in October 2026. One winning Explorer team and one winning Advanced team from each school advance directly to the Västerås Future Innovators Robo-Sprint City Final on December 5, 2026.',
    category: 'Schools & Fees'
  },
  {
    id: 'faq-6',
    question: 'What can winning teams take home?',
    answer: 'A total of SEK 3,000 is awarded to winning teams (SEK 1,200 Explorer + SEK 1,800 Advanced), along with cash, trophies, and certificates for all finalists.',
    category: 'Competition & Arena'
  },
  {
    id: 'faq-7',
    question: 'Where does this competition format come from?',
    answer: 'The Robo-Sprint arena format is adapted from Blix-A-Thon, a robotics competition hosted at Techfest, IIT Bombay. In Västerås it is delivered as INIAC’s own STEM programme and pedagogy, with Blix providing the reusable hardware kit as technology partner, and IBK Västerås and SkillSkolan as host and delivery partners.',
    category: 'Eligibility'
  },
  {
    id: 'faq-8',
    question: 'How are participant safety and privacy handled?',
    answer: 'The competition uses low-voltage, school-safe hardware components and follows Swedish school safety protocols and GDPR-compliant handling of student data.',
    category: 'Judging & Safety'
  },
  {
    id: 'faq-9',
    question: 'Can the STEM project be used for classroom assessment under Lgr22?',
    answer: 'The 20-hour project can be planned together with the school so that students produce documented evidence of practical work, technical problem-solving, testing, collaboration and reflection that teachers may use within their ordinary assessment where relevant to the subject and local planning. Curriculum connections depend on age, activity and the school’s own planning; advanced content may be offered as enrichment.',
    category: 'Curriculum & Lgr22'
  }
];
