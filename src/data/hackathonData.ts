export interface TrackItem {
  id: string;
  title: string;
  category: string;
  description: string;
  poolShare: string;
  badge: string;
  iconName: 'Cpu' | 'Bot' | 'CreditCard' | 'Leaf' | 'ShieldCheck' | 'Layers';
  techStack: string[];
  spotlightGradient: string;
  accentColor: string;
  featured?: boolean;
}

export interface MilestoneItem {
  id: string;
  phase: string;
  date: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  highlightMetric?: string;
  deliverables: string[];
}

export interface PrizeTier {
  rank: string;
  tierName: string;
  amount: string;
  amountNumeric: number;
  perks: string[];
  badge: string;
  isGrandChampion?: boolean;
  accent: string;
}

export interface MetricItem {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
}

export const METRICS_DATA: MetricItem[] = [
  { label: "GLOBAL PRIZE ALLOCATION", value: "$1,250,000", subtext: "Non-dilutive institutional grants & equity-free cash", highlight: true },
  { label: "PARTICIPATING NATIONS", value: "64+", subtext: "Tier-1 engineering institutions & global tech hubs" },
  { label: "CONTINUOUS SPRINT", value: "48 HRS", subtext: "Synchronized worldwide virtual & hybrid nodes" },
  { label: "VENTURE CAPITAL CAPITALIZATION", value: "$45M+", subtext: "Tier-1 VC syndicates on judging panels" }
];

export const TRACKS_DATA: TrackItem[] = [
  {
    id: "quantum-ai",
    title: "Generative AI & Quantum Computing",
    category: "TRACK 01 // DEEP TECH",
    description: "Architect foundation models, multi-agent reinforcement learning topologies, and hybrid quantum-classical cryptographic algorithms that establish next-generation compute paradigms.",
    poolShare: "$350,000 POOL",
    badge: "HIGH COMPLEXITY",
    iconName: "Cpu",
    techStack: ["PyTorch", "Qiskit", "Triton", "CUDA", "vLLM", "Wasm"],
    spotlightGradient: "from-indigo-500/20 via-transparent to-transparent",
    accentColor: "#6366F1",
    featured: true
  },
  {
    id: "autonomous-systems",
    title: "Autonomous Systems & Spatial Robotics",
    category: "TRACK 02 // PHYSICAL COMPUTING",
    description: "Develop sub-millisecond edge perception stacks, spatial mapping SLAM architectures, and distributed swarming protocols for uncrewed aerial & terrestrial machines.",
    poolShare: "$300,000 POOL",
    badge: "PHYSICAL SIMULATION",
    iconName: "Bot",
    techStack: ["ROS 2", "NVIDIA Isaac Sim", "C++20", "Rust", "WebGPU", "LiDAR"],
    spotlightGradient: "from-cyan-500/20 via-transparent to-transparent",
    accentColor: "#06B6D4"
  },
  {
    id: "fintech-infrastructure",
    title: "Enterprise Fintech & Cryptographic Proofs",
    category: "TRACK 03 // VALUE PROTOCOLS",
    description: "Construct zero-knowledge settlement layers, high-frequency algorithmic liquidity routers, and compliant institutional privacy-preserving state channels.",
    poolShare: "$300,000 POOL",
    badge: "ZERO-KNOWLEDGE",
    iconName: "CreditCard",
    techStack: ["Circom / Halo2", "Solidity", "Go", "gRPC", "Kafka", "Postgres"],
    spotlightGradient: "from-purple-500/20 via-transparent to-transparent",
    accentColor: "#A855F7"
  },
  {
    id: "sustainable-infra",
    title: "Sustainable Infrastructure & Grid Resilience",
    category: "TRACK 04 // PLANETARY SCALE",
    description: "Engineer dynamic power-grid balancing systems, industrial carbon lineage tracking pipelines, and decentralized compute-sharing microgrids.",
    poolShare: "$300,000 POOL",
    badge: "CRITICAL INFRASTRUCTURE",
    iconName: "Leaf",
    techStack: ["TimeScaleDB", "Apache Flink", "Python", "MQTT", "Embedded C", "Docker"],
    spotlightGradient: "from-emerald-500/20 via-transparent to-transparent",
    accentColor: "#10B981"
  }
];

export const TIMELINE_DATA: MilestoneItem[] = [
  {
    id: "milestone-1",
    phase: "PHASE 01",
    date: "15 MARCH 2026",
    time: "23:59 UTC",
    title: "Global Registration & Vetting Gate",
    description: "Cohort registration locks. Automated algorithmic review of applicant GitHub repositories and credential verification across institutional portals.",
    status: "completed",
    deliverables: ["Team formation lock (2-4 engineers)", "Architecture RFC submission", "Compute credits allocation ($5k/team)"]
  },
  {
    id: "milestone-2",
    phase: "PHASE 02",
    date: "3 APRIL 2026",
    time: "14:00 UTC",
    title: "Worldwide Synchronized Kickoff & Keynote",
    description: "Challenge brief disclosure and API credential distribution. Keynote stream featuring partner engineering VPs and chief AI architects.",
    status: "active",
    highlightMetric: "LIVE GLOBAL BROADCAST",
    deliverables: ["Private repository repo dispatch", "Sandbox environment credentials", "Mentor hours reservation portal"]
  },
  {
    id: "milestone-3",
    phase: "PHASE 03",
    date: "4 APRIL 2026",
    time: "18:00 UTC",
    title: "Mid-Point Technical Checkpoint & Benchmarking",
    description: "Automated latency, concurrency, and security benchmark checks on live endpoints. Architectural review sessions with designated enterprise mentors.",
    status: "upcoming",
    deliverables: ["Docker containerized test run", "Preliminary telemetry validation", "1-on-1 advisor clinic"]
  },
  {
    id: "milestone-4",
    phase: "PHASE 04",
    date: "5 APRIL 2026",
    time: "14:00 UTC",
    title: "Hard Code Freeze & Submission Verification",
    description: "Final commits locked on main branch. Automated CI/CD build artifact verification and Loom video presentation processing.",
    status: "upcoming",
    deliverables: ["Public open-source repository", "2-minute technical demo video", "Live hosted endpoint"]
  },
  {
    id: "milestone-5",
    phase: "PHASE 05",
    date: "6 APRIL 2026",
    time: "19:00 UTC",
    title: "Grand Virtual Demo Day & Executive Jury Awards",
    description: "Top 12 finalist teams present live in front of a venture partner and CTO jury panel. Real-time announcement of $1.25M prize allocations.",
    status: "upcoming",
    deliverables: ["5-minute live pitch & technical Q&A", "Immediate non-dilutive contract signing", "Global press release syndication"]
  }
];

export const PRIZE_TIERS: PrizeTier[] = [
  {
    rank: "RANK 02",
    tierName: "SILVER LAUREATE",
    amount: "$250,000",
    amountNumeric: 250000,
    badge: "GLOBAL RUNNER UP",
    accent: "text-slate-300",
    perks: [
      "$250k Direct Non-Dilutive Grant",
      "$100k AWS/GCP Institutional Cloud Credits",
      "Fast-Track Partner Incubator Admission",
      "Executive Mentorship with Tier-1 CTOs",
      "Apex Global Hardware Trophy & Medal"
    ]
  },
  {
    rank: "RANK 01",
    tierName: "APEX GRAND CHAMPION",
    amount: "$500,000",
    amountNumeric: 500000,
    badge: "WORLD CHAMPIONSHIP PRIZE",
    isGrandChampion: true,
    accent: "text-indigo-400",
    perks: [
      "$500,000 Unrestricted Non-Dilutive Seed Capital",
      "$250,000 Enterprise Cloud & GPU Compute Credits",
      "Guaranteed Term-Sheet Review by Apex VC Syndicate",
      "Global Feature in Bloomberg Tech & TechCrunch",
      "1-Year Dedicated Enterprise Advisory & Legal Sandbox",
      "Custom Titanium Apex 2026 Championship Trophy"
    ]
  },
  {
    rank: "RANK 03",
    tierName: "BRONZE LAUREATE",
    amount: "$150,000",
    amountNumeric: 150000,
    badge: "THIRD PLACE OVERALL",
    accent: "text-amber-300/80",
    perks: [
      "$150k Direct Non-Dilutive Grant",
      "$50k GPU Cluster Compute Access",
      "Incubator Technical Showcase Entry",
      "Full Apex Global Alumni Network Access",
      "Apex Bronze Commemorative Plaque"
    ]
  }
];

export const CATEGORY_AWARDS = [
  { title: "Best Technical Architecture", amount: "$50,000", sponsor: "Systems & Cloud Guild" },
  { title: "Most Novel AI Model Optimization", amount: "$50,000", sponsor: "DeepTech Frontier Lab" },
  { title: "Zero-Knowledge Cryptography Award", amount: "$50,000", sponsor: "Protocol Research Labs" },
  { title: "Planetary Impact & Sustainability", amount: "$50,000", sponsor: "Clean Energy Alliance" },
  { title: "Undergraduate Rising Pioneer", amount: "$50,000", sponsor: "NextGen Fellows Fund" },
  { title: "Community Choice & Open Innovation", amount: "$50,000", sponsor: "Open Source Collective" }
];
