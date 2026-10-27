// The two programme boxes of the journey section (vfi): RoboKidovation and Young Future InnoHack, each with
// its own audiences. Every audience has its own steps, image, "Why participate?" benefits and button.
import { bi, type Bi, type CmsLink } from '../core';

export interface ProgrammeStep {
  title: Bi;
  description: Bi;
}

export interface ProgrammeAudience {
  /** Stable key for the tab (letters and dashes). */
  id: string;
  icon: string;
  label: Bi;
  heading: Bi;
  description: Bi;
  steps: ProgrammeStep[];
  /** Uploaded image address; empty shows a placeholder. */
  image: string;
  imageAlt: Bi;
  /** Which part of the image stays in view when it is cropped. */
  imagePosition: string;
  benefitsHeading: Bi;
  benefits: Bi[];
  cta: CmsLink;
}

export interface ProgrammeJourney {
  id: string;
  title: Bi;
  subtitle: Bi;
  dateLabel: Bi;
  accent: string;
  audiences: ProgrammeAudience[];
}

export const IMAGE_POSITIONS = ['center', 'top', 'bottom', 'left', 'right'] as const;

const steps = (...list: [string, string, string, string][]): ProgrammeStep[] =>
  list.map(([title, titleSv, description, descriptionSv]) => ({ title: bi(title, titleSv), description: bi(description, descriptionSv) }));

const WHY = bi('Why participate?', 'Varför delta?');

/** The default programmes; `register(tab)` is the site's register page on that form. */
export function vfiProgrammes(register: (tab: string) => string): ProgrammeJourney[] {
  const audience = (a: Omit<ProgrammeAudience, 'image' | 'imagePosition' | 'benefitsHeading' | 'cta'> & { cta: [string, string, string] }): ProgrammeAudience => ({
    id: a.id,
    icon: a.icon,
    label: a.label,
    heading: a.heading,
    description: a.description,
    steps: a.steps,
    image: '',
    imageAlt: a.imageAlt,
    imagePosition: 'center',
    benefitsHeading: WHY,
    benefits: a.benefits,
    cta: { label: bi(a.cta[0], a.cta[1]), href: register(a.cta[2]) },
  });

  return [
    {
      id: 'robokidovation',
      title: bi('RoboKidovation'),
      subtitle: bi('Robotics competition · Grades 3–9', 'Robottävling · Årskurs 3–9'),
      dateLabel: bi('5 December 2026', '5 december 2026'),
      accent: 'blue',
      audiences: [
        audience({
          id: 'students',
          icon: 'GraduationCap',
          label: bi('Students', 'Elever'),
          heading: bi('Build, code and compete', 'Bygg, programmera och tävla'),
          description: bi(
            'Work in a team to build a robot, program it to solve real challenges and show what it can do at the final.',
            'Arbeta i lag, bygg en robot, programmera den att lösa riktiga uppdrag och visa vad den kan på finalen.'
          ),
          steps: steps(
            ['Join a team', 'Gå med i ett lag', 'Team up with classmates or friends, or sign up alone and we find you a team.', 'Gå ihop med klasskompisar eller vänner, eller anmäl dig själv så hittar vi ett lag.'],
            ['Learn the basics', 'Lär dig grunderna', 'Discover motors, sensors and simple code in hands-on sessions.', 'Upptäck motorer, sensorer och enkel kod i praktiska pass.'],
            ['Build your robot', 'Bygg er robot', 'Assemble the official kit and make your robot move, turn and sense.', 'Montera det officiella kitet och få roboten att köra, svänga och känna av omgivningen.'],
            ['Practise the challenges', 'Träna på uppdragen', 'Test runs on the 244 × 122 cm arena mat and improve after every try.', 'Provkör på arenamattan (244 × 122 cm) och förbättra efter varje försök.'],
            ['Compete at the final', 'Tävla på finalen', 'Show your robot at MISV, Västerås on 5 December 2026.', 'Visa er robot på MISV i Västerås den 5 december 2026.'],
          ),
          imageAlt: bi('Schoolchildren building and testing a robotics project together', 'Skolbarn som bygger och testar ett robotikprojekt tillsammans'),
          benefits: [
            bi('Learn robotics through hands-on projects', 'Lär dig robotik genom praktiska projekt'),
            bi('Build confidence and teamwork', 'Bygg självförtroende och samarbete'),
            bi('Compete and celebrate achievements', 'Tävla och fira det ni har åstadkommit'),
          ],
          cta: ['Register a student team', 'Anmäl ett elevlag', 'competition'],
        }),
        audience({
          id: 'parents',
          icon: 'HandHeart',
          label: bi('Parents', 'Föräldrar'),
          heading: bi("Support your child's first robot", 'Stötta ditt barns första robot'),
          description: bi(
            'No experience needed. Your child learns engineering, coding and teamwork, and you can follow along all the way to the final.',
            'Ingen förkunskap behövs. Ditt barn lär sig teknik, programmering och samarbete, och du kan följa med hela vägen till finalen.'
          ),
          steps: steps(
            ['Explore the programme', 'Utforska programmet', 'See what children learn and how the season runs from workshop to final.', 'Se vad barnen lär sig och hur säsongen går från workshop till final.'],
            ['Check the details', 'Kolla detaljerna', 'Grades 3–9. Kits, tools and instructors are provided.', 'Årskurs 3–9. Kit, verktyg och instruktörer ingår.'],
            ['Register your child', 'Anmäl ditt barn', 'Sign up a team, or your child alone and we place them in one.', 'Anmäl ett lag, eller ditt barn själv så placerar vi hen i ett.'],
            ['Follow their progress', 'Följ utvecklingen', 'Encourage building and testing at home between sessions.', 'Uppmuntra byggande och testande hemma mellan passen.'],
            ['Celebrate at the final', 'Fira på finalen', 'Cheer the team on at MISV, Västerås on 5 December 2026.', 'Heja på laget på MISV i Västerås den 5 december 2026.'],
          ),
          imageAlt: bi('A parent helping a child build and program a small robot', 'En förälder som hjälper ett barn att bygga och programmera en liten robot'),
          benefits: [
            bi('Support practical STEM learning', 'Stötta praktiskt STEM-lärande'),
            bi('Encourage creativity and problem-solving', 'Uppmuntra kreativitet och problemlösning'),
            bi("See your child's progress and achievements", 'Se ditt barns utveckling och framgångar'),
          ],
          cta: ['Register your child', 'Anmäl ditt barn', 'competition'],
        }),
        audience({
          id: 'teachers',
          icon: 'School',
          label: bi('Teachers & Schools', 'Lärare och skolor'),
          heading: bi('Bring robotics into your classroom', 'Ta in robotik i klassrummet'),
          description: bi(
            'Lgr22-aligned workshops with kits and instructors, leading to an inter-school final for your best teams.',
            'Lgr22-anpassade workshoppar med kit och instruktörer, som leder till en final mellan skolor för era bästa lag.'
          ),
          steps: steps(
            ['Book a workshop', 'Boka en workshop', 'Choose dates that suit your timetable.', 'Välj datum som passar ert schema.'],
            ['Plan with Lgr22', 'Planera med Lgr22', 'Link the sessions to technology and maths goals.', 'Koppla passen till målen i teknik och matematik.'],
            ['Run the sessions', 'Genomför passen', 'Our instructors bring kits and mats and teach alongside you.', 'Våra instruktörer tar med kit och mattor och undervisar tillsammans med dig.'],
            ['Hold school qualifiers', 'Håll skolkval', 'Teams compete in school on 12–25 November 2026.', 'Lagen tävlar på skolan den 12–25 november 2026.'],
            ['Send teams to the final', 'Skicka lag till finalen', 'Up to 4 teams per school compete at MISV on 5 December 2026.', 'Upp till 4 lag per skola tävlar på MISV den 5 december 2026.'],
          ),
          imageAlt: bi('A teacher guiding students during a classroom robotics workshop', 'En lärare som handleder elever under en robotikworkshop i klassrummet'),
          benefits: [
            bi('Connect learning to LGR22', 'Koppla undervisningen till Lgr22'),
            bi('Bring practical STEM into classrooms', 'Ta in praktisk STEM i klassrummet'),
            bi('Give students a meaningful competition experience', 'Ge eleverna en meningsfull tävlingsupplevelse'),
          ],
          cta: ['Book a school workshop', 'Boka en skolworkshop', 'workshop'],
        }),
      ],
    },
    {
      id: 'innohack',
      title: bi('Young Future InnoHack'),
      subtitle: bi('Innovation hackathon · Gymnasium to professionals', 'Innovationshackathon · Gymnasium till yrkesverksamma'),
      dateLabel: bi('11–12 December 2026', '11–12 december 2026'),
      accent: 'yellow',
      audiences: [
        audience({
          id: 'gymnasium',
          icon: 'Lightbulb',
          label: bi('Gymnasium'),
          heading: bi('Turn ideas into solutions', 'Gör idéer till lösningar'),
          description: bi(
            'Form a team, pick a real-world challenge and develop a solution you pitch to mentors and judges.',
            'Bilda ett lag, välj en verklig utmaning och utveckla en lösning som ni presenterar för mentorer och jury.'
          ),
          steps: steps(
            ['Form your team', 'Bilda ert lag', 'Team up with classmates, or join alone and meet new teammates.', 'Gå ihop med klasskompisar, eller kom själv och träffa nya lagkamrater.'],
            ['Choose a challenge', 'Välj en utmaning', 'Pick a challenge from schools, companies or the city.', 'Välj en utmaning från skolor, företag eller kommunen.'],
            ['Brainstorm and plan', 'Brainstorma och planera', 'Explore the problem and sketch possible solutions.', 'Utforska problemet och skissa på möjliga lösningar.'],
            ['Build a prototype', 'Bygg en prototyp', 'Develop your idea with help from mentors.', 'Utveckla idén med stöd från mentorer.'],
            ['Pitch to the judges', 'Pitcha för juryn', 'Present your solution on 11–12 December 2026.', 'Presentera er lösning den 11–12 december 2026.'],
          ),
          imageAlt: bi('Upper-secondary students brainstorming ideas on sticky notes around a table', 'Gymnasieelever som brainstormar idéer på lappar runt ett bord'),
          benefits: [
            bi('Solve real-world challenges', 'Lös verkliga utmaningar'),
            bi('Gain experience working in teams', 'Få erfarenhet av att arbeta i lag'),
            bi('Present ideas to mentors and judges', 'Presentera idéer för mentorer och jury'),
          ],
          cta: ['Register for the hackathon', 'Anmäl dig till hackathonet', 'hackathon'],
        }),
        audience({
          id: 'university',
          icon: 'Code2',
          label: bi('University', 'Universitet'),
          heading: bi('Build and ship a digital solution', 'Bygg och lansera en digital lösning'),
          description: bi(
            'Code, design and prototype an app or service for a real challenge, together with mentors from industry.',
            'Koda, designa och ta fram en prototyp av en app eller tjänst för en verklig utmaning, tillsammans med mentorer från näringslivet.'
          ),
          steps: steps(
            ['Register your team', 'Anmäl ert lag', 'Sign up as a team or on your own.', 'Anmäl er som lag eller på egen hand.'],
            ['Pick a challenge', 'Välj en utmaning', 'Choose a problem set by companies and organisations.', 'Välj ett problem från företag och organisationer.'],
            ['Design the solution', 'Designa lösningen', 'Map users, needs and the features that matter most.', 'Kartlägg användare, behov och de viktigaste funktionerna.'],
            ['Code a prototype', 'Koda en prototyp', 'Build a working demo with feedback from mentors.', 'Bygg en fungerande demo med återkoppling från mentorer.'],
            ['Demo and pitch', 'Demo och pitch', 'Show your prototype to the jury on 11–12 December 2026.', 'Visa er prototyp för juryn den 11–12 december 2026.'],
          ),
          imageAlt: bi('University students coding and prototyping an app together on laptops', 'Universitetsstudenter som kodar och tar fram en app tillsammans på sina datorer'),
          benefits: [
            bi('Develop practical portfolio projects', 'Ta fram praktiska portfolioprojekt'),
            bi('Collaborate with companies and mentors', 'Samarbeta med företag och mentorer'),
            bi('Build and demonstrate innovative solutions', 'Bygg och visa innovativa lösningar'),
          ],
          cta: ['Register as a university team', 'Anmäl ett universitetslag', 'hackathon'],
        }),
        audience({
          id: 'professionals',
          icon: 'Handshake',
          label: bi('Professionals', 'Yrkesverksamma'),
          heading: bi('Mentor the next generation', 'Bli mentor för nästa generation'),
          description: bi(
            'Share your expertise: set a challenge, coach teams during the hackathon or join the jury.',
            'Dela med dig av din kunskap: ge en utmaning, coacha lag under hackathonet eller sitt i juryn.'
          ),
          steps: steps(
            ['Choose your role', 'Välj din roll', 'Mentor, challenge owner or judge.', 'Mentor, utmaningsägare eller jurymedlem.'],
            ['Share a challenge', 'Dela en utmaning', 'Bring a real problem from your organisation.', 'Ta med ett verkligt problem från din organisation.'],
            ['Meet the teams', 'Träffa lagen', 'Get to know the participants and their ideas.', 'Lär känna deltagarna och deras idéer.'],
            ['Coach and give feedback', 'Coacha och ge återkoppling', 'Help teams sharpen their solutions during the event.', 'Hjälp lagen att vässa sina lösningar under evenemanget.'],
            ['Evaluate the pitches', 'Bedöm pitcharna', 'Judge the final presentations on 11–12 December 2026.', 'Bedöm slutpresentationerna den 11–12 december 2026.'],
          ),
          imageAlt: bi('An industry mentor giving feedback to a student team during a pitch', 'En mentor från näringslivet som ger återkoppling till ett studentlag under en pitch'),
          benefits: [
            bi('Mentor emerging talent', 'Var mentor för morgondagens talanger'),
            bi('Contribute industry challenges', 'Bidra med utmaningar från näringslivet'),
            bi('Discover new ideas and collaboration opportunities', 'Upptäck nya idéer och samarbeten'),
          ],
          cta: ['Become a mentor', 'Bli mentor', 'mentor'],
        }),
      ],
    },
  ];
}
