# VÄSTERÅS FUTURE INNOVATORS 2026 — PRODUCT STRATEGY & STITCH SPECIFICATION

> **Comprehensive UX Research, Information Architecture, Curricular Alignment & Google Stitch Design Brief**
> *Analyzed directly from the live Swedish School Robotics League & Hackathon platform.*

---

# HACKATHON CONTEXT

## 1. Identity

* **Official Hackathon Name:** Västerås Future Innovators 2026 (incorporating **RoboKidovation** and the **Young Innovators Hackathon**)
* **Short Name / Acronym:** VFI 2026 / RoboKidovation (Internal registration token prefix: `RKV-2026`)
* **Taglines & Mottos:**
  * *"Build Ideas. Test Them. Take Them Further."*
  * *"From Classroom Build to the Arena Finals"*
  * *"Two paths, one championship. Pick the experience that suits your school."*
  * *"Same Arena. Bigger Dreams."*
* **Theme:** Hands-on School Robotics & Real-World Youth Innovation Challenge
* **Host & Organizing Entities:**
  1. **Indisk BarnKlubb (IBK) Västerås** — *Host & Lead Community Organizer*
  2. **INIAC** — *Programme, Curriculum & Pedagogy Partner*
  3. **SkillSkolan** — *Education Delivery Partner*
  4. **Blix / Blix-A-Thon** — *Technology & Kit Hardware Partner*
* **Host Institution & Proposed Venue:** Mälardalen University (MDU), Campus Västerås (Building C2 proposed for finals/hackathon)
* **Location & Country:** Västerås, Västmanland County, Sweden
* **Website Domain:** `robokidovation.se` (Contact: `contact@robokidovation.se`)
* **Social Media Accounts:** `[NOT FOUND]` (No official handles linked on the site)
* **Official Registration Entrypoint:** Built-in interactive registration modal connected to Supabase backend (`registrations` table), supporting both Student/Team and School Intake modes.
* **Official Submission Entrypoint:** Physical on-site judging, live arena match scorekeeping, and portfolio review (no online code repository submission portal required for Grundskola leagues).
* **Important External Platforms & Provenance:**
  * **Techfest, IIT Bombay:** Format origin adapted from Blix-A-Thon India (proven across 2,000+ students).
  * **Skolverket (Swedish National Agency for Education):** Curricular frameworks Lgr22 (compulsory school) and Gy25 (upper secondary/gymnasium).
* **Brand & Message Positioning:**
  * Bridges abstract digital/screen simulations and physical engineering.
  * Turnkey, zero-procurement model: all kits, arena mats, tools, and mentor briefings are brought directly into Swedish classrooms.
  * Fully compliant with low-voltage (6V DC) classroom safety standards and Swedish GDPR student privacy protocols.
* **Visual Identity & Aesthetic:**
  * Swedish civic palette: Deep Navy (`#0A1930`), Sea Blue (`#006AA7`), Swedish Flag Gold/Volt (`#FFCD00`), Soft Ice Gray (`#F2F6FA`).
  * Industrial / Blueprint Brutalism: 0px border radius, monospaced metadata badges (`JetBrains Mono`), bold condensed headline typography (`Prompt` / `Outfit` / `Bebas Neue`), technical grid accents, and high-contrast pill action buttons.

---

## 2. Core Information

* **What the Event Is:** A dual-track youth innovation championship in Västerås combining a structured 20-hour in-school robotics curriculum with competitive school qualifiers and a grand municipal final, alongside an interdisciplinary open innovation hackathon.
* **Main Objectives:**
  1. Give young students practical, tactile engineering confidence using real physical hardware (motors, axles, chassis, gears).
  2. Provide Swedish educators with turn-key, curriculum-aligned evidence of learning for subject assessments under Lgr22 and Gy25.
  3. Provide a clear pathway from regular classroom work to representation in a city-wide arena championship.
* **Target Audience:**
  * Primary / Middle School (*Grundskola*): Grades 3–6 (Explorer) and Grades 7–9 (Advanced).
  * Upper Secondary (*Gymnasium*): Ages 15+ (Robo-Precision autonomous challenge & Young Innovators Hackathon).
  * Educators & Administrators: Teachers of *Teknik*, *Matematik*, and *NO/Fysik*, as well as school principals (*rektorer*).
* **What Participants Build:**
  * **RoboKidovation (Robo-Sprint):** A multi-wheeled motorized rover engineered to clear obstacles, push balls across a divided arena mat, or execute cup-stacking and precision maneuvers.
  * **Robo-Precision:** An autonomous robotic crane arm programmed to construct the tallest self-standing structural tower.
  * **Young Innovators Hackathon:** Interdisciplinary prototypes, concepts, digital applications, or physical models addressing civic and ecological challenges.
* **Technology & Hardware Ecosystem:**
  * Modular Blix engineering kits: 41+ distinct components (chassis plates, brackets, gearboxes, 6V DC motors, axles, pulleys, rack-and-pinion gears, wired transmitter/receiver controllers, rubber drive belts, assembly tools).
  * Roll-out tournament arena mat: 2.44 m × 1.22 m (8 ft × 4 ft) with central boundary barriers and scoring gates.

### Track Breakdown

#### Track 1: Robo-Sprint Explorer (Category A)
* **Age / Grade:** Grades 3–6 (Grundskola)
* **Match Duration:** 3 minutes per head-to-head match (1 vs 1)
* **Arena:** Standard 2.44 m × 1.22 m divided roll-out mat
* **Control:** Wired dual-switch manual controller (low-voltage 6V)
* **Objective:** Ball-transfer agility challenge. Push/guide starting balls over the central barrier into the opposing team's court.
* **Scoring:** 5 points per ball successfully transferred into the opponent's court at final whistle.
* **Tie-Breaker Hierarchy:** 1) Fewer balls remaining on own side, 2) 1-minute sudden-death tie-break heat, 3) First-ball sudden death.
* **Evaluation Criteria:** Match Performance (70%), Robot Design & Iterative Improvement (20%), Teamwork & Technical Explanation (10%).
* **Robot Constraints:** Max starting footprint: 0.46 m × 0.46 m (46 × 46 cm); no sharp or destructive attachments; no permanent ball entrapment mechanisms.

#### Track 2: Robo-Sprint Advanced (Category B)
* **Age / Grade:** Grades 7–9 (Grundskola)
* **Match Duration:** 3 minutes (or 6-minute multi-phase arena challenge)
* **Arena:** 2.44 m × 1.22 m divided mat with hurdle barriers and podium targets
* **Control:** Multi-channel wired controller with multi-speed / directional switching
* **Objective:** Maneuver obstacles, push balls across barriers, and deploy gear-driven arms or grippers for podium cup manipulation.
* **Scoring:** Scored balls + podium cup placements minus penalty deductions.
* **Evaluation Criteria:** Precision Control & Match Execution (60%), Gearing & Engineering Design (25%), Testing, Documentation & Strategy (15%).
* **Robot Constraints:** Max starting footprint: 0.46 m × 0.46 m; multi-stage gear reduction required; arms must retract within starting boundary prior to referee countdown.

#### Track 3: Robo-Precision (Category C)
* **Age / Grade:** Gymnasium / Upper Secondary (Ages 15+)
* **Match Duration:** 5-minute autonomous run
* **Arena:** Precision stacking target arena
* **Control:** 100% Autonomous sequence (programmed in advance; zero human contact once started)
* **Objective:** Deploy an autonomous crane/manipulator to construct the tallest stable tower within the time limit.
* **Evaluation Criteria:** Tower Height & Structural Stability (60%), Engineering & Autonomous Logic (30%), Technical Documentation (10%).
* **Curriculum Alignment:** Directly mapped to Gy25 programming and software engineering criteria.

#### Track 4: Young Innovators Hackathon
* **Date & Venue:** Saturday, December 5, 2026 at Mälardalen University (MDU), Västerås
* **Format:** 1-day interdisciplinary open innovation sprint
* **Themes / Domains:** Sustainable Cities, Climate & Environment, Future Schools, Clean Energy, Digital Accessibility, Public Health, AI & Technology for Society.
* **Deliverable:** Working concept, physical model, digital prototype, or pitch presentation presented live before an academic and industry jury.
* **Prerequisites:** No previous robotics experience required; open to creative, scientific, design, and entrepreneurial students.

---

## 3. Participant Information

* **Eligibility:** All enrolled students in Swedish Grundskola (Grades 3–9) and Gymnasium within Västerås and Västmanland County.
* **Team Structure:**
  * **Classroom Cohorts:** 15 to 60+ students per participating school.
  * **Match Teams:** 2 to 4 students per robot/project team.
  * **School Representation:** Exactly 1 winning Explorer team and 1 winning Advanced team qualify per school for the City Final.
* **Registration Requirements:**
  * Direct teacher/coordinator intake or parent/mentor registration.
  * Required fields: Team/School Name, Contact Name, Official Email, Phone (+46), Grade League, Estimated Student Cohort Size.
* **Safety & Hardware Requirements:**
  * 100% low-voltage (6V DC battery box).
  * No mains power, soldering irons, or hazardous cutting tools permitted in classrooms.
* **Classroom Facility Requirements:**
  * Standard school classroom or open assembly hall with floor/table space to accommodate a 2.44 m × 1.22 m roll-out arena mat.

---

## 4. Complete Timeline

| Date | Time / Zone | Milestone / Event Name | Description | Location / Platform | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spring – Early Autumn 2026** | Rolling | **School Cohort Intake & Planning** | Principals & coordinators book workshop dates and reserve kit allocations. | Online / In-School Meetings | `ACTIVE` |
| **Early Autumn 2026** | Scheduled by school | **Hardware Kit Classroom Dispatch** | Turnkey kits, arena mats, and teacher briefs delivered directly to schools. | Participating Schools | `UPCOMING` |
| **October 2026** | 10 Sessions (20h) | **20-Hour In-School STEM Project** | Hands-on curriculum: exploration, assembly, testing, measurement, and optimization. | Regular Classrooms | `UPCOMING` |
| **Late October 2026** | Session 10 | **RoboSkolan In-School Qualifiers** | Intramural referee heats on official mat; 1 Explorer + 1 Advanced team advance. | In-School Arena | `UPCOMING` |
| **November 2026** | Scheduled Clinic | **Redesign & Refinement Clinics** | Qualifying teams refine gear ratios, driving tactics, and documentation portfolios. | School Labs / Mentorship | `UPCOMING` |
| **Friday, Dec 4, 2026** | Full Day (CET) | **VFI Grand Finale Day 1: RoboKidovation** | Interschool championship heats, bracket rounds, and robotics showcase. | Västerås Arena / MDU C2 | `UPCOMING` |
| **Saturday, Dec 5, 2026** | Full Day (CET) | **VFI Grand Finale Day 2: Finals & Hackathon** | Championship finals, awards ceremony, and 1-day Young Innovators Hackathon. | Mälardalen University (MDU) | `UPCOMING` |

---

## 5. Prizes

* **Official League Prize Pool:** **SEK 3,000 Cash Purse** (Awarded to winning school teams)
  * **Explorer League (Grades 3–6):** **SEK 1,200** Cash Award
  * **Advanced League (Grades 7–9):** **SEK 1,800** Cash Award
* **Trophies & Hardware:** Official championship trophies awarded to 1st place school teams; tournament medals for runners-up.
* **Certificates:** Official printed diplomas and certificates of achievement for all participating students and qualifying finalists.
* **Educational Grants / Equipment:** School ownership of STEM evidence portfolios and project deliverables.
* **Special Awards:** `[NOT FOUND]` (Specific sponsor-named awards not itemized on current site).
* *Note on Unused Data:* An unrendered file (`hackathonData.ts`) contains generic startup hackathon figures ($1.25M pool, $500k Grand Prize). This was verified as unused leftover template code and is **not** part of the authentic Swedish school league.

---

## 6. Judging System

### Scoring Categories & Weights

| Category / League | Arena Performance | Engineering & Design | Documentation & Explanation |
| :--- | :---: | :---: | :---: |
| **Robo-Sprint Explorer** (Grades 3–6) | **70%** (Ball count & agility) | **20%** (Chassis stability & build) | **10%** (Team collaboration) |
| **Robo-Sprint Advanced** (Grades 7–9) | **60%** (Match & speed control) | **25%** (Gearing, kinematics, arm) | **15%** (Testing data & reflection) |
| **Robo-Precision** (Gymnasium 15+) | **60%** (Tower height & stability) | **30%** (Autonomy & logic design) | **10%** (Code structure & notes) |

* **Judges:** Listed collectively as official Technical Referees and Academic Jury Panel from INIAC, IBK, and MDU. Individual judge biographies: `[NOT FOUND]`.

---

## 7. Mentors & Speakers

* **Mentorship Structure:** In-person pedagogy mentors from INIAC and SkillSkolan who travel to participating schools to co-guide the 10-session project.
* **Named Individual Mentors / Speakers:** `[NOT FOUND]` (Mentors are represented as institutional support teams rather than personal speaker cards).

---

## 8. Sponsors & Partners

1. **Indisk BarnKlubb (IBK) Västerås**
   * *Role:* Lead Host, Community Organizer & Event Sponsor
   * *Logo:* `/ibk logo.png`
2. **INIAC**
   * *Role:* Programme Developer, STEM Pedagogy Partner & Mentor Provider
   * *Logo:* `/iniac logo.png`
3. **SkillSkolan**
   * *Role:* Education Delivery & In-School Training Partner
   * *Logo:* `/skillskolan logo.png`
4. **Blix / Blix-A-Thon**
   * *Role:* Hardware Technology Partner & Official Kit Manufacturer
   * *Logo:* `/blix a thon logo.png`
5. **Mälardalen University (MDU), Campus Västerås**
   * *Role:* Proposed Academic Venue & Higher Education Pathway Partner
6. **Techfest, IIT Bombay**
   * *Role:* International Arena Heritage Partner

---

## 9. Rules & Policies

* **Starting Perimeter:** Robots must start completely within their marked 0.46 m × 0.46 m starting box.
* **Match Countdown:** Students may only touch or adjust their robot prior to the referee's match countdown.
* **No Human Arena Entry:** Participants may not step inside the arena boundary or physically touch balls during active play.
* **Entrapment Prohibition:** Robots may push, deflect, or guide balls across the central barrier, but cannot permanently enclose, cage, or trap them.
* **Reset Rule:** If a robot flips or is disabled, the referee may authorize one manual restart from the home box without pausing the 3-minute match clock.
* **Scoring Threshold:** A ball scores when it has completely crossed the plane of the central barrier line.
* **Fair Play & Penalty Hierarchy:**
  1. *Minor Infringement:* Official verbal referee warning.
  2. *Repeated Infringement:* 5-point deduction from team match score.
  3. *Deliberate Arena Interference:* Immediate forfeiture of the round.
  4. *Intentional Machine Damage:* Immediate disqualification by Head Referee.
* **Safety Protocol:** Strictly 6V DC low-voltage battery power. Zero mains power, soldering, or open blades.
* **Data Privacy:** Full compliance with Swedish GDPR and Skolverket student data privacy laws.

---

## 10. Submission Requirements

* **Online Registration Entry:** Form submission via registration modal (captures school/team name, contact coordinator, phone, email, league choice, and cohort count).
* **Physical Student Deliverables (Produced during 20h project):**
  1. *Functioning Robot:* Complete physical rover assembled from kit parts.
  2. *Design Sketches & Technical Log:* Component selection rationales and modifications.
  3. *Testing Logs:* Documented speed, stability, and gear ratio metrics.
  4. *Engineering Reflection:* "What worked? What failed? What did we iterate?"
  5. *Team Presentation:* Oral presentation explaining technical mechanisms.
* **Event Deck / Prospectus Request:** Email-gated PDF download form for school principals and teachers.

---

## 11. FAQ

### Eligibility & Registration
* *Q: Who can participate in Västerås Future Innovators 2026?*
  *A: Swedish Grundskola students in Grades 3–6 (Explorer) and Grades 7–9 (Advanced), and Gymnasium students (Robo-Precision & Hackathon).*
* *Q: Is prior robotics or coding experience needed?*
  *A: No. The curriculum starts from foundational principles (wheels, axles, gears) before advancing to assembly and competition.*

### Hardware & Kits
* *Q: What is included in the competition kit?*
  *A: 41+ piece official kit: chassis beams, gearboxes, wheels, 6V battery box, wired transmitter/receiver, balls, and tools.*
* *Q: Do schools need to buy equipment?*
  *A: No. All kits and arena mats are delivered directly to the school on a turnkey basis.*

### Competition & Arena
* *Q: How does the Robo-Sprint match work?*
  *A: A 3-minute head-to-head ball-transfer agility match on an official 244 × 122 cm arena mat. Moving balls into the opponent's court scores 5 points each.*
* *Q: What are the prizes?*
  *A: A total cash purse of SEK 3,000 (SEK 1,200 Explorer + SEK 1,800 Advanced), plus trophies and medals.*

### Curriculum & Assessment
* *Q: Can teachers use this for Lgr22 assessment?*
  *A: Yes. The 20-hour curriculum generates tangible student portfolios in *Teknik*, *Matematik*, and *NO/Fysik* that align with syllabus evaluation criteria.*

### Safety & Privacy
* *Q: How is student safety and data handled?*
  *A: Robots operate on safe 6V DC battery packs. All data is managed strictly under Swedish GDPR guidelines.*

---

## 12. Current Information Architecture

```
PORTAL ROOT (App.tsx)
├── Sticky Glass Navigation Bar (Navbar.tsx)
│   ├── Internal Navigation: Competition, Workflow, Events, About, Contact
│   └── Primary CTA: "REGISTER SCHOOL / TEAM" (Triggers RegisterModal)
│
├── Page 01: HOME VIEW (App.tsx route: 'home')
│   ├── 01. Hero Section with Video Background & Headline (RefHero.tsx)
│   ├── 02. Partner Marquee Ticker (RefHeroMarquee.tsx)
│   ├── 03. Dual Experience Pathways (RefTheExperience.tsx)
│   ├── 04. STEM Workflow MindMap (RefWorkflowMindMap.tsx)
│   ├── 05. Competition Tracks 3-Card Grid (RefTrackComparison.tsx)
│   ├── 06. Hardware & Arena Ecosystem (RefKioskShowcase.tsx)
│   ├── 07. 3-Stage Milestone Journey (RefCompetitionFlow.tsx)
│   ├── 08. Authentic Tournament Highlights Bento & Lightbox (RefPhotoStrip.tsx)
│   └── 09. Pre-Footer School CTA Banner (RefWorkshopTapeBanner.tsx)
│
├── Page 02: TECHNICAL RULEBOOK (ChallengesPage.tsx route: 'challenges')
│   ├── Track Comparison Matrix (Explorer vs Advanced vs Precision)
│   ├── Expandable Technical Specifications & Judging Weights
│   ├── 244 × 122 cm Arena Schematic & 41-Piece Hardware Inventory Lightbox
│   └── General Match Regulations & Infringement Penalties
│
├── Page 03: HOW IT WORKS (HowItWorksPage.tsx route: 'how-it-works')
│   ├── 6-Stage Full Participant Journey
│   ├── 5 Core Learning Competencies (Build, Explore, Code, Create, Compete)
│   ├── 20-Hour Session-by-Session Curriculum Table (Sessions 01 to 10)
│   └── Tangible Student Deliverables Grid
│
├── Page 04: STEM WORKFLOW & MDU PROPOSAL (WorkflowPage.tsx route: 'workflow')
│   ├── MDU C2 Institutional Value Pillars
│   ├── Dual Learning Depth Comparison (Explorer vs Advanced)
│   └── 6-Step MindMap (Explore ⟶ Build ⟶ Test ⟶ Improve ⟶ School Sprint ⟶ City Final)
│
├── Page 05: FOR SCHOOLS & EDUCATORS (ForSchoolsPage.tsx route: 'for-schools')
│   ├── 3-Step School Onboarding Workflow
│   ├── Educational Value & Zero-Procurement Model
│   ├── School Facilities & Commitment Checklist
│   └── Principal & Educator FAQ Accordion
│
├── Page 06: LGR22 & GY25 CURRICULAR FIT (Lgr22Page.tsx route: 'lgr22')
│   ├── Core Subject Syllabus Maps (Teknik, Matematik, NO/Fysik)
│   ├── Age-Specific Pedagogical Pathways
│   └── Upper Secondary Gy25 Programming Connections
│
├── Page 07: TOURNAMENT CALENDAR & EVENTS (EventsPage.tsx route: 'events')
│   ├── Stage 01: In-School Qualifiers (October 2026)
│   ├── Stage 02: City Final (December 4 & 5, 2026)
│   └── Saturday Innovation Hackathon (December 5, 2026 at MDU)
│
├── Page 08: ABOUT THE LEAGUE (AboutPage.tsx route: 'about')
│   ├── Origins, Heritage from Techfest IIT Bombay & Swedish Adaptation
│   └── 4 Organizing Partner Profiles (IBK, INIAC, SkillSkolan, Blix)
│
├── Global Persistent Footer (RefFooter.tsx)
│   ├── League Mission & Age Range
│   ├── Programme Navigation Directory
│   ├── Organization Credentials & Swedish Contact
│   └── Partner Logo Row & Swedish School Compliance Badges
│
└── Interactive Modals:
    ├── RegisterModal.tsx (Student/Team & School Intake Form with Supabase integration)
    └── EventDeckModal.tsx (Email-gated PDF Prospectus Download)
```

---

## 13. Current UX Analysis

### What Works Well
* **Clear Value Proposition:** Clear messaging targeting Swedish schools (*"Zero lab budget required," "Turnkey kit delivery," "Lgr22 aligned"*).
* **Curricular Trust:** Dedicated sub-pages for teachers (*Lgr22*, *For Schools*) addressing curriculum and administrative concerns.
* **Dual Registration Architecture:** Modal handles both individual teams and whole-school cohort bookings cleanly.
* **Authentic Imagery:** Strong use of actual student competition photos from Blix-A-Thon instead of generic stock images.

### UX Friction & Outdated Patterns
* **Single-Page Application Route Switching:** Sub-pages are rendered via internal state (`currentRoute`) rather than URL-addressable routes, breaking browser back/forward buttons and preventing deep linking to specific tracks.
* **Dense Information Density:** The homepage presents an extensive amount of content sequentially without an interactive filter or role-based navigation (e.g., "I am a Teacher" vs "I am a Student").
* **Low Contrast in Secondary Labels:** Small monospaced tags (`9px`–`10px`) in muted slate can be hard to read on mobile viewports.
* **Buried Rulebook:** Deep technical arena parameters (ball counts, tie-breakers, dimension limits) are hidden inside accordion toggles on a secondary page.

---

## 14. Visual / Design Analysis

* **Color System:**
  * Primary Ink: Deep Navy (`#0A1930`)
  * Secondary Blue: Swedish Blue (`#006AA7`)
  * Deep Midnight: Swedish Blue Deep (`#013A63`)
  * Accent / Action: Swedish Flag Yellow / Volt (`#FFCD00`, hover `#E6B800`)
  * Neutral Surfaces: Pure White (`#FFFFFF`), Soft Ice Gray (`#F2F6FA`), Muted Border Slate (`#E1E7EF` / `#CBD5E1`)
* **Typography:**
  * Headline: `Prompt`, `Outfit`, `Bebas Neue` (Bold, uppercase, tracking `0.02em`–`0.04em`, line-height `1.02`–`1.12`)
  * Body: `Poppins`, `Outfit`, `Inter` (Weights 300 to 500, clean line-height `1.6`)
  * Technical Meta / Numbers: `JetBrains Mono` (All-caps, wide letter spacing `0.15em`–`0.25em`)
  * Display Accent: Outlined stroke text (`-webkit-text-stroke: 1.5px #0A1930; color: transparent;`)
* **Border & Corner Treatment:** Strict architectural `border-radius: 0px !important;` across all elements (buttons, cards, badges, modals).
* **Component Styling:**
  * High-contrast pill buttons (`.btn-pill-lime` using `#FFCD00`).
  * Technical blueprint background grid (`48px × 48px` subtle cyan lines).
  * Bento-style image gallery with high-contrast text overlays and fullscreen lightboxes.

---

## 15. Content Inventory & Hierarchy

| Section / Content Block | Purpose | Source File | Priority |
| :--- | :--- | :--- | :---: |
| **Hero & Value Hook** | Immediate orientation, core dates, video showcase, and primary register CTA | `RefHero.tsx` | **P0** |
| **Registration Flow** | Dual-track modal for students and school coordinators | `RegisterModal.tsx` | **P0** |
| **Competition Tracks** | 3-way league comparison (Explorer, Advanced, Precision) | `RefTrackComparison.tsx` | **P0** |
| **Timeline & Key Dates** | Clear autumn dates (October qualifiers, Dec 4–5 Grand Finale) | `RefCompetitionFlow.tsx` | **P0** |
| **Dual Experience Cards** | Distinguish Friday RoboKidovation from Saturday Hackathon | `RefTheExperience.tsx` | **P1** |
| **Hardware & Arena Showcase** | Explain the 41-piece kit and 244 × 122 cm arena mat | `RefKioskShowcase.tsx` | **P1** |
| **For Schools & Curricular Fit** | Lgr22/Gy25 syllabus connection, teacher FAQ, and safety assurances | `ForSchoolsPage.tsx` | **P1** |
| **Workflow MindMap** | Step-by-step pedagogical progression (Explore ⟶ Compete) | `RefWorkflowMindMap.tsx` | **P1** |
| **Authentic Photo Highlights** | Social proof showing genuine students and real tournament arena heats | `RefPhotoStrip.tsx` | **P1** |
| **Partner Ecosystem & Credits** | Institutional logos and credentials (IBK, INIAC, SkillSkolan, Blix) | `RefFooter.tsx` | **P2** |
| **Prospectus PDF Download** | Email-gated technical deck for school principals | `EventDeckModal.tsx` | **P2** |

---

## 16. User Journeys

### Journey 1: The School Principal / STEM Teacher (Primary Buyer)
* **Entry Point:** Homepage Hero or "For Schools" link
* **Goal:** Confirm that the programme is safe, low-cost, fits the school calendar, and meets Skolverket Lgr22 goals.
* **Information Needed:** Cost model (zero kit procurement fee), required classroom hours (20h), safety certification (6V DC), and assessment evidence.
* **Conversion Action:** Clicks `"BOOK A SCHOOL MEETING"` or downloads the Prospectus PDF.

### Journey 2: The Student Competitor / Parent
* **Entry Point:** Homepage
* **Goal:** Learn what they will build, whether beginners can join, match format, and how to qualify for the Grand Finale.
* **Information Needed:** Grade breakdown, kit photos, arena rules, match duration (3 min), and prize pool (SEK 3,000 + trophies).
* **Conversion Action:** Clicks `"REGISTER SCHOOL / TEAM"` and submits student team details.

### Journey 3: The Gymnasium / Innovation Student
* **Entry Point:** Homepage "Young Innovators Hackathon" or "Robo-Precision"
* **Goal:** Explore open problem statements in sustainability, health, AI, or smart cities.
* **Information Needed:** Saturday Dec 5 date, Mälardalen University venue, challenge themes, and judging criteria.
* **Conversion Action:** Clicks `"EXPLORE THE HACKATHON"` and requests cohort details.

---

## 17. New Website Requirements

### Must Have (P0)
1. **Clear Homepage Identity:** Instantly communicate that this is a Swedish school robotics league and hackathon in Västerås culminating December 4 & 5, 2026.
2. **Dual-Audience Portal View:** Direct paths for **Educators/Schools** (Lgr22, logistics, turnkey model) and **Students/Teams** (tracks, kits, match excitement).
3. **Structured Interactive Track Matrix:** Side-by-side comparison of Explorer (Grades 3–6), Advanced (Grades 7–9), Precision (Gymnasium), and Young Innovators Hackathon.
4. **Interactive Timeline:** Step-by-step breakdown from classroom intake to in-school October qualifiers to December Grand Finale.
5. **Integrated Dual Registration Flow:** Seamless modal or dedicated route for team entry and school meetings.
6. **Rulebook & Hardware Schematics:** Direct access to arena dimensions (244 × 122 cm) and kit specs without buried navigation.

### Should Have (P1)
1. **Interactive Lgr22 Subject Mapper:** Clickable tool for teachers to filter curriculum goals by subject (*Teknik*, *Matematik*, *NO/Fysik*).
2. **Interactive 20-Hour Curriculum Explorer:** Visual breakdown of all 10 classroom sessions with expected deliverables.
3. **Downloadable Teacher Deck Gate:** Streamlined one-click prospectus delivery.
4. **Deep URL Routing:** Real URL-addressable routes (`/tracks`, `/for-schools`, `/curriculum`, `/timeline`) to allow direct teacher sharing.

### Nice to Have (P2)
1. **Live Match Simulator / Interactive Arena Graphic:** Interactive preview of the 244 × 122 cm court showing scoring zones and ball flow.
2. **Bilingual Toggle:** Swedish (`Svenska`) default with English (`EN`) international toggle for international school cohorts.

---

## 18. Recommended Information Architecture (Sitemap)

```
NEW ARCHITECTURE
├── / (Home Portal)
│   ├── Hero (Video, Live Badge, Dates, Dual CTAs)
│   ├── Role Gate ("For Schools & Teachers" vs "For Students & Teams")
│   ├── The Experience Pathways (RoboKidovation & Young Innovators)
│   ├── Competition Tracks Matrix (Explorer, Advanced, Precision)
│   ├── The 20-Hour STEM Journey & Arena Timeline
│   ├── Hardware Kit & Arena Ecosystem Showcase
│   ├── Authentic Tournament Gallery
│   ├── Prize Pool & Laurels
│   └── Partner Credibility Strip
│
├── /tracks (Competition Rulebook & Tracks)
│   ├── Track Comparison (Grades, Control, Match Length, Scoring)
│   ├── Deep-Dive Rulebook (Explorer, Advanced, Precision)
│   └── Arena Schematics & 41-Piece Hardware Inventory
│
├── /for-schools (Educator & Principal Hub)
│   ├── Turnkey Delivery Model & Zero Lab Budget Breakdown
│   ├── 10-Session Curriculum Breakdown
│   ├── Lgr22 & Gy25 Syllabus Mapping Matrix
│   ├── Swedish School Safety (6V DC) & GDPR Protocols
│   └── Book a Meeting Booking Widget
│
├── /timeline (Tournament Calendar & Milestones)
│   ├── School Intake (Rolling)
│   ├── In-School 20h Project & Qualifiers (October 2026)
│   ├── Grand Finale Days 1 & 2 (December 4 & 5, 2026 at MDU)
│   └── Saturday Innovation Hackathon Schedule
│
├── /about (League Origins & Organizers)
│   ├── Mission & Swedish Pedagogical Vision
│   ├── Heritage from Blix-A-Thon & Techfest IIT Bombay
│   └── Host Profiles: IBK Västerås, INIAC, SkillSkolan, Blix, MDU
│
└── Modals / Overlays
    ├── Register Team / School Intake Form
    └── Prospectus PDF Download Gate
```

---

## 19. Homepage Content Architecture

1. **Top Utility / Header Strip:**
   * *Content:* Date badge (`DECEMBER 4 & 5, 2026 · VÄSTERÅS, SWEDEN`), Lgr22 syllabus tag, and primary action button (`REGISTER SCHOOL / TEAM`).
2. **Hero Section:**
   * *Headline:* `BUILD IDEAS. TEST THEM. TAKE THEM FURTHER.`
   * *Subhead:* Hands-on robotics and youth innovation for Swedish schools (Grades 3–9 & Gymnasium).
   * *Key Stats Ribbon:* 4 Host Partners · 20H STEM Project · SEK 3,000 Prize Pool · Dec 4 & 5 Grand Finale.
   * *Actions:* Primary: `REGISTER SCHOOL / TEAM` (Yellow pill); Secondary: `EXPLORE TRACKS`.
3. **Role-Based Fast Nav:**
   * *Two Entry Doors:* `I am an Educator / Principal` (directs to Lgr22 alignment & school intake) vs `I am a Student / Parent` (directs to tracks & arena rules).
4. **Dual Pathway Showcase (The Experience):**
   * *Card 1:* `RoboKidovation` (Friday, Dec 4) — Hands-on mechanical rover building & Robo-Sprint arena competition.
   * *Card 2:* `Young Innovators Hackathon` (Saturday, Dec 5) — Open innovation challenge at Mälardalen University solving sustainability, health, and AI problems.
5. **Interactive Competition Tracks Matrix:**
   * Side-by-side cards for **Explorer League** (Grades 3–6), **Advanced League** (Grades 7–9), and **Robo-Precision** (Gymnasium).
   * Displays arena sizes, match times, scoring formulas, and clear technical rules.
6. **Classroom-to-Arena Milestone Journey:**
   * Visual 3-step progress bar: Stage 1: In-School 20h Project (October) ⟶ Stage 2: In-School Qualifiers ⟶ Stage 3: Municipal Grand Finale at MDU (December 4 & 5).
7. **Hardware & Arena Ecosystem:**
   * High-contrast blueprint presentation of the official 41-piece kit and the 244 × 122 cm roll-out dual-court arena mat.
8. **Curricular Confidence Banner:**
   * Direct syllabus evidence points for *Teknik*, *Matematik*, and *NO/Fysik*.
9. **Authentic Competition Photo Reel:**
   * Bento gallery showcasing real student excitement, robot designs, and arena heats with interactive zoom.
10. **Persistent Pre-Footer CTA:**
    * *Headline:* `BRING HANDS-ON STEM TO YOUR SCHOOL.`
    * *Actions:* `BOOK A SCHOOL MEETING` and `DOWNLOAD EVENT PROSPECTUS (PDF)`.

---

## 20. Stitch-Ready Design Brief

* **Project Name:** Västerås Future Innovators 2026 Web Experience
* **Project Type:** High-Conversion Hackathon, STEM League & School Intake Portal
* **Target Users:**
  1. Swedish primary & secondary educators (*Lärare & Rektorer*).
  2. Swedish school students aged 9–19 and their parents.
  3. Municipal education leaders, STEM sponsors, and university partners.
* **Brand Personality:** Scandinavian, rigorous, hands-on, high-energy, technically credible, educational, and institutional.
* **Visual Direction:**
  * **Brutalist / Industrial Precision:** Strict 0px corner radii, bold condensed uppercase headlines, high-contrast framing lines, and monospaced technical annotation badges.
  * **Color Palette:**
    * Primary Ink: `#0A1930` (Swedish Navy)
    * Accent Hero: `#FFCD00` (Swedish Flag Yellow)
    * Primary Brand: `#006AA7` (Swedish Flag Blue)
    * Deep Layer: `#013A63` (Ocean Blue)
    * Surface Base: `#FFFFFF` and `#F2F6FA`
  * **Typography:**
    * Headlines: High-impact condensed sans (`Prompt`, `Outfit`, `Bebas Neue`) in bold uppercase.
    * Body: Clean geometric sans (`Poppins`, `Outfit`, `Inter`).
    * Data / Badges: `JetBrains Mono` for technical specifications, dimensions, and timestamps.
* **Interaction Principles:**
  * Micro-hover lifts (`-2px` translation) on cards with subtle glow borders.
  * Tabbed matrices for comparing competition categories without page reload.
  * Interactive schematics with high-resolution lightbox inspection for arena mats and hardware piece lists.
  * Low-friction modal intake supporting dual personas (individual teams and institutional school bookings).

---

## 21. FINAL STITCH PROMPT

```text
Design a world-class, premium, modern website for "Västerås Future Innovators 2026" (featuring RoboKidovation and the Young Innovators Hackathon), Sweden's official school robotics championship and youth innovation league.

CORE BRAND & AESTHETIC DIRECTION:
- Visual Style: Editorial Scandinavian brutalism fused with high-tech engineering precision. Avoid generic dark crypto or SaaS tropes. Use pure white surfaces (#FFFFFF), crisp ice gray panels (#F2F6FA), deep Swedish navy typography (#0A1930), Swedish royal blue (#006AA7), and high-visibility Swedish flag gold/volt (#FFCD00) for high-conversion action items.
- Architectural DNA: Strict 0px border radii across all elements, sharp borders, technical blueprint grid accents (48px subtle grid), monospaced data tags, and high-impact condensed uppercase typography (Prompt/Outfit paired with clean Poppins body text and JetBrains Mono metadata).

ESSENTIAL FACTUAL CONTEXT TO PRESERVE:
- Organizers: Indisk BarnKlubb (IBK) Västerås (Host), INIAC (Pedagogy & Programme Partner), SkillSkolan (Delivery Partner), and Blix (Technology Partner).
- Dates & Venue: October 2026 In-School Qualifiers; Grand Finale December 4 & 5, 2026 at Mälardalen University (MDU), Västerås, Sweden.
- Audience & Leagues:
  1. Robo-Sprint Explorer (Grades 3–6): 3-minute ball-transfer arena match, wired dual-switch control, judged on match (70%), design (20%), teamwork (10%).
  2. Robo-Sprint Advanced (Grades 7–9): 3-minute obstacle and gear-reduction challenge, judged on control & match (60%), gearing (25%), documentation (15%).
  3. Robo-Precision (Gymnasium 15+): 5-minute autonomous crane tower-building challenge aligned with Gy25 programming.
  4. Young Innovators Hackathon (Saturday, Dec 5 at MDU): Open 1-day challenge tackling Sustainability, Future Cities, Health, and AI for society.
- Turnkey School Model: Zero lab budget required; all 41+ piece hardware kits and 2.44 m × 1.22 m roll-out arena mats are delivered directly to Swedish schools. Aligned with Skolverket Lgr22 curriculum (Teknik, Matematik, NO/Fysik).
- Prize Structure: SEK 3,000 cash pool (SEK 1,200 Explorer + SEK 1,800 Advanced), plus official trophies and medals.

HOMEPAGE COMPOSITION & UX FLOW:
1. Top Notification Bar: Display date (Dec 4 & 5, 2026), city (Västerås, Sweden), Lgr22 alignment badge, and contact email (contact@robokidovation.se).
2. Navigation: Sleek glass navbar with clean logo, route links (Tracks, For Schools, How It Works, Timeline, About), and a bold yellow CTA: "REGISTER SCHOOL / TEAM".
3. Hero Section: Asymmetric editorial composition with bold headline: "BUILD IDEAS. TEST THEM. TAKE THEM FURTHER." Include video/action media container, subhead explaining the school-to-arena pathway, key metrics ribbon (4 Partners · 20H STEM Project · SEK 3,000 Prize Pool · Dec 4 & 5 Grand Finale), and dual CTAs ("REGISTER SCHOOL / TEAM" and "EXPLORE TRACKS").
4. Audience Gate: Dual pathways for "School Principals & Teachers" (Lgr22 fit, zero procurement, meeting booking) and "Students & Teams" (challenges, rules, prizes).
5. Dual Experience Showcase: High-contrast split cards contrasting Friday's hands-on "RoboKidovation" with Saturday's "Young Innovators Hackathon" at MDU.
6. Technical Track Matrix: Comparative interactive cards for Explorer, Advanced, and Precision leagues displaying arena footprint (2.44 m × 1.22 m), match length, scoring rules, and judging percentages.
7. Hardware & Arena Blueprint Showcase: High-contrast technical layout showcasing the 41-piece modular kit parts list and the 244 × 122 cm roll-out arena mat with interactive zoom preview.
8. 3-Stage Milestone Journey: Clear visual timeline showing October In-School Qualifiers feeding into the December 4 & 5 Grand Finale.
9. Authentic Tournament Media Bento: High-impact photo reel of genuine student teams assembling, racing, and competing.
10. Curricular Trust Section: Lgr22 syllabus mapping (Teknik, Matematik, NO/Fysik) and safety certification (safe 6V low-voltage DC hardware, Swedish GDPR compliance).
11. Pre-Footer Action Banner: Bold card with headline "BRING HANDS-ON STEM TO YOUR SCHOOL" with "BOOK A SCHOOL MEETING" and "DOWNLOAD PROSPECTUS (PDF)" buttons.
12. Footer: Complete directory, partner logos (IBK, INIAC, SkillSkolan, Blix), Swedish compliance notices, and copyright.

INTERACTIVE MODAL INTAKE:
- Design a high-converting multi-role registration modal supporting both "Student / Team" and "School Cohort Intake" with fields for team/school name, coordinator name, Swedish phone (+46), official email, league selector, and student capacity counters.
```

---

# MISSING / UNVERIFIED INFORMATION

* `[NOT FOUND]` **Individual Judge & Mentor Biographies:** Individual judges and mentors are mentioned collectively as INIAC technical referees and university jury members; specific individual names, photos, and LinkedIn profiles are not listed.
* `[NOT FOUND]` **Social Media Profiles:** Dedicated league social media accounts (Instagram, LinkedIn, X, YouTube) are not linked on the website.
* `[NOT FOUND]` **Sponsor-Specific Special Award List:** Individual sponsor cash allocations beyond the SEK 3,000 primary pool (Explorer SEK 1,200 / Advanced SEK 1,800) are not specified.
* `[NOT FOUND]` **Young Innovators Hackathon Detailed Rubric:** While challenge themes (Sustainability, Health, AI) and the MDU venue are defined, the explicit scoring weight breakdown for the Saturday hackathon is not published.
* `[NOT FOUND]` **Registration Pricing / Fees:** The website emphasizes the "Zero Lab Budget" and turnkey kit delivery model for schools, but does not explicitly state whether school participation is free, municipal grant-subsidized, or carries a cohort registration fee.

---

# SOURCE MAP

* **Hero, Partners & Live Stats:** `src/components/RefHero.tsx`, `src/data/roboData.ts` (`STATS_DATA`, `PARTNER_LOGOS`)
* **Dual Experience Pathways (RoboKidovation & Hackathon):** `src/components/RefTheExperience.tsx`
* **Competition Tracks, Arena Rules & Specs:** `src/data/roboData.ts` (`COMPETITION_CATEGORIES`), `src/pages/ChallengesPage.tsx`
* **Hardware Kit & 41-Piece Inventory:** `src/data/roboData.ts` (`KIT_PIECES`), `src/components/RefKioskShowcase.tsx`
* **20-Hour STEM Project & 10-Session Curriculum:** `src/data/roboData.ts` (`STEM_PROJECT_SESSIONS`), `src/pages/HowItWorksPage.tsx`
* **Lgr22 & Gy25 Swedish Curriculum Alignment:** `src/data/roboData.ts` (`LGR22_SUBJECTS`, `GY25_CONNECTIONS`), `src/pages/Lgr22Page.tsx`
* **School Onboarding & Administrative FAQ:** `src/pages/ForSchoolsPage.tsx`
* **Tournament Calendar & Milestone Dates:** `src/data/roboData.ts` (`CHAMPIONSHIP_STAGES`, `UPCOMING_EVENTS`), `src/pages/EventsPage.tsx`
* **Registration & Prospectus Data Capture:** `src/components/RegisterModal.tsx`, `src/components/EventDeckModal.tsx`
* **Design Tokens, Typography & Color Palette:** `tailwind.config.js`, `src/index.css`
