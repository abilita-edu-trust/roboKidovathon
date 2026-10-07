// YNG RoboHack Växjö — the first RoboHack event. To launch another city, copy this file,
// change the content, and register it in ./index.ts (plus ROUTE_PATHS and .htaccess).
import {
  Bot, Code2, Rocket, School, Eye, Lightbulb, BookOpen, Hammer, FlaskConical, Megaphone,
  Compass, Target, Users, Mic, Scale, Trophy,
} from 'lucide-react';
import type { RoboHackEvent } from './types';

export const vaxjo: RoboHackEvent = {
  route: 'vxo',
  meta: {
    title: 'YNG RoboHack Växjö',
    description:
      'YNG RoboHack Växjö, 20–21 November 2026 at Linnaeus University. One event, three tracks: Robotics, Code and Hack. You see the problem, you bring the idea, we help you build it.',
  },
  brand: { name: 'YNG RoboHack', city: 'Växjö' },
  location: { countrySlug: 'sweden', citySlug: 'vaxjo', countryName: 'Sweden', cityName: 'Växjö' },

  hero: {
    eyebrow: { en: 'Future innovators', sv: 'Framtidens innovatörer' },
    lines: [
      { en: 'You see the problem.', sv: 'Du ser problemet.' },
      { en: 'You bring the idea.', sv: 'Du kommer med idén.' },
      { en: 'We help you build it.', sv: 'Vi hjälper dig att bygga den.' },
    ],
    intro: {
      en: 'A youth innovation platform where curiosity becomes STEM learning, ideas become prototypes, and young people become future innovators.',
      sv: 'En innovationsplattform för unga där nyfikenhet blir STEM-lärande, idéer blir prototyper och unga blir framtidens innovatörer.',
    },
    keywords: ['Robotics', 'Coding', 'STEM', 'AI', 'Innovation'],
  },

  platform: {
    title: { en: 'We are a youth innovation platform', sv: 'Vi är en innovationsplattform för unga' },
    intro: {
      en: 'We connect young people with schools, universities, companies and mentors to help them:',
      sv: 'Vi kopplar ihop unga med skolor, universitet, företag och mentorer för att hjälpa dem att:',
    },
    flow: [
      { en: 'Explore problems', sv: 'Utforska problem' },
      { en: 'Develop ideas', sv: 'Utveckla idéer' },
      { en: 'Learn STEM', sv: 'Lära sig STEM' },
      { en: 'Build prototypes', sv: 'Bygga prototyper' },
      { en: 'Test solutions', sv: 'Testa lösningar' },
      { en: 'Present their future', sv: 'Presentera sin framtid' },
    ],
  },

  problem: {
    title: { en: 'Bring the problem. Build the future.', sv: 'Kom med problemet. Bygg framtiden.' },
    question: {
      en: 'What would you change in your school, community or everyday life?',
      sv: 'Vad skulle du vilja ändra i din skola, ditt samhälle eller din vardag?',
    },
    body: [
      {
        en: 'Young people are surrounded by problems worth solving, but they are rarely asked for their ideas.',
        sv: 'Unga är omgivna av problem som är värda att lösa, men de blir sällan tillfrågade om sina idéer.',
      },
      {
        en: 'At YNG RoboHack, you bring the problem statement. We help you:',
        sv: 'På YNG RoboHack kommer du med problemformuleringen. Vi hjälper dig att:',
      },
    ],
    flow: [
      { en: 'Identify the problem', sv: 'Identifiera problemet' },
      { en: 'Explore ideas', sv: 'Utforska idéer' },
      { en: 'Learn STEM & Robotics', sv: 'Lära dig STEM och robotik' },
      { en: 'Build a prototype', sv: 'Bygga en prototyp' },
      { en: 'Test it', sv: 'Testa den' },
      { en: 'Present your solution', sv: 'Presentera din lösning' },
    ],
    cards: [
      { icon: Eye, title: { en: 'See', sv: 'Se' }, description: { en: 'Identify a problem.', sv: 'Identifiera ett problem.' } },
      { icon: Lightbulb, title: { en: 'Imagine', sv: 'Föreställ dig' }, description: { en: 'Develop your idea.', sv: 'Utveckla din idé.' } },
      {
        icon: BookOpen,
        title: { en: 'Learn', sv: 'Lär' },
        description: { en: 'Explore robotics, coding and STEM.', sv: 'Utforska robotik, programmering och STEM.' },
      },
      { icon: Hammer, title: { en: 'Build', sv: 'Bygg' }, description: { en: 'Create your prototype.', sv: 'Skapa din prototyp.' } },
      { icon: FlaskConical, title: { en: 'Test', sv: 'Testa' }, description: { en: 'Improve your solution.', sv: 'Förbättra din lösning.' } },
      {
        icon: Megaphone,
        title: { en: 'Share', sv: 'Dela' },
        description: {
          en: 'Present it to mentors, companies and communities.',
          sv: 'Presentera den för mentorer, företag och samhället.',
        },
      },
    ],
    ideasTitle: { en: 'Your idea could be about', sv: 'Din idé kan handla om' },
    ideas: [
      { en: 'Education and the future classroom', sv: 'Utbildning och framtidens klassrum' },
      { en: 'Sustainability and climate', sv: 'Hållbarhet och klimat' },
      { en: 'Accessibility and inclusion', sv: 'Tillgänglighet och inkludering' },
      { en: 'Girls in STEM', sv: 'Tjejer inom STEM' },
      { en: 'Smart schools and communities', sv: 'Smarta skolor och samhällen' },
      { en: 'Health and wellbeing', sv: 'Hälsa och välmående' },
      { en: 'Robotics in everyday life', sv: 'Robotik i vardagen' },
    ],
    closing: [
      {
        en: "You don't need to know how to code or build a robot before you join.",
        sv: 'Du behöver inte kunna programmera eller bygga en robot innan du är med.',
      },
      {
        en: 'Bring your curiosity and the problem you want to solve. We will help you build the future.',
        sv: 'Ta med din nyfikenhet och problemet du vill lösa. Vi hjälper dig att bygga framtiden.',
      },
    ],
  },

  event: {
    title: { en: 'Build. Code. Create. Solve.', sv: 'Bygg. Koda. Skapa. Lös.' },
    intro: {
      en: 'A hands-on innovation challenge bringing together students, developers and young innovators to solve real-world problems using AI, coding, robotics and technology.',
      sv: 'En praktisk innovationsutmaning som samlar elever, utvecklare och unga innovatörer för att lösa verkliga problem med AI, programmering, robotik och teknik.',
    },
    name: 'RoboHack 2026',
    venue: { en: 'Linnaeus University, Växjö', sv: 'Linnéuniversitetet, Växjö' },
    dates: { en: '20–21 November 2026', sv: '20–21 november 2026' },
    poweredBy: 'INIAC × LNU AI Society',
  },

  tracks: [
    {
      id: 'robotics',
      icon: Bot,
      enabled: true,
      title: { en: 'Robotics', sv: 'Robotik' },
      tagline: { en: 'Build & Control', sv: 'Bygg och styr' },
      description: {
        en: 'Design, build or program robotic solutions addressing practical challenges.',
        sv: 'Designa, bygg eller programmera robotlösningar som tar sig an praktiska utmaningar.',
      },
      interests: [
        { en: 'Robotics', sv: 'Robotik' },
        { en: 'Sensors', sv: 'Sensorer' },
        { en: 'ESP32', sv: 'ESP32' },
        { en: 'Automation', sv: 'Automation' },
        { en: 'IoT', sv: 'IoT' },
      ],
    },
    {
      id: 'code',
      icon: Code2,
      enabled: true,
      title: { en: 'Code', sv: 'Kod' },
      tagline: { en: 'Code & Create', sv: 'Koda och skapa' },
      description: {
        en: 'Develop software, AI applications or digital solutions for real problems.',
        sv: 'Utveckla mjukvara, AI-applikationer eller digitala lösningar för verkliga problem.',
      },
      interests: [
        { en: 'AI', sv: 'AI' },
        { en: 'Web', sv: 'Webb' },
        { en: 'Apps', sv: 'Appar' },
        { en: 'Data', sv: 'Data' },
        { en: 'Software', sv: 'Mjukvara' },
      ],
    },
    {
      id: 'hack',
      icon: Rocket,
      enabled: true,
      title: { en: 'Hack', sv: 'Hack' },
      tagline: { en: 'Solve & Innovate', sv: 'Lös och innovera' },
      description: {
        en: 'Take a real problem from a company, university or society and turn it into a practical solution.',
        sv: 'Ta ett verkligt problem från ett företag, ett universitet eller samhället och gör det till en praktisk lösning.',
      },
      interests: [
        { en: 'Innovation', sv: 'Innovation' },
        { en: 'Entrepreneurship', sv: 'Entreprenörskap' },
        { en: 'Sustainability', sv: 'Hållbarhet' },
        { en: 'Product Design', sv: 'Produktdesign' },
      ],
    },
    {
      // Hidden for now. Set enabled: true to activate it for a city/event.
      id: 'school',
      icon: School,
      enabled: false,
      title: { en: 'School Programme', sv: 'Skolprogram' },
      tagline: { en: 'For schools and classes', sv: 'För skolor och klasser' },
      description: {
        en: 'A dedicated track for schools and classes, set up together with the schools in each city.',
        sv: 'Ett eget spår för skolor och klasser, upplagt tillsammans med skolorna i varje stad.',
      },
      interests: [],
    },
  ],

  journey: [
    { icon: Compass, title: { en: 'Choose Track', sv: 'Välj spår' }, description: { en: 'Pick Robotics, Code or Hack.', sv: 'Välj Robotik, Kod eller Hack.' } },
    {
      icon: Target,
      title: { en: 'Select or Receive Challenge', sv: 'Välj eller få en utmaning' },
      description: {
        en: 'Bring your own problem, or receive one from a company, university or the organisers.',
        sv: 'Kom med ett eget problem, eller få ett från ett företag, ett universitet eller arrangörerna.',
      },
    },
    {
      icon: Users,
      title: { en: 'Form Team', sv: 'Bilda lag' },
      description: { en: 'Team up with mentors and split the roles.', sv: 'Bilda lag med mentorer och fördela rollerna.' },
    },
    { icon: Hammer, title: { en: 'Build', sv: 'Bygg' }, description: { en: 'Turn the idea into a working prototype.', sv: 'Gör idén till en fungerande prototyp.' } },
    { icon: FlaskConical, title: { en: 'Test', sv: 'Testa' }, description: { en: 'Try it against the challenge and improve it.', sv: 'Prova lösningen mot utmaningen och förbättra den.' } },
    { icon: Mic, title: { en: 'Pitch', sv: 'Pitcha' }, description: { en: 'Present the problem, your solution and a demo.', sv: 'Presentera problemet, er lösning och en demo.' } },
    { icon: Scale, title: { en: 'Judging', sv: 'Bedömning' }, description: { en: 'The jury reviews every team.', sv: 'Juryn bedömer varje lag.' } },
    { icon: Trophy, title: { en: 'Final Showcase', sv: 'Final och utställning' }, description: { en: 'Teams show their solutions to the audience.', sv: 'Lagen visar upp sina lösningar för publiken.' } },
  ],

  challenges: {
    question: {
      en: 'How can we make STEM exciting, accessible and relevant for every young person?',
      sv: 'Hur kan vi göra STEM spännande, tillgängligt och relevant för alla unga?',
    },
    intro: {
      en: 'Our challenges focus on robotics, education and inclusion, helping children and young people move from curiosity to creating real solutions.',
      sv: 'Våra utmaningar handlar om robotik, utbildning och inkludering, och hjälper barn och unga att gå från nyfikenhet till att skapa verkliga lösningar.',
    },
    items: [
      {
        title: { en: 'Robotics for Young Learners', sv: 'Robotik för unga elever' },
        question: {
          en: 'How can we make robotics simple, playful and engaging for children aged roughly 8–12?',
          sv: 'Hur kan vi göra robotik enkelt, lekfullt och engagerande för barn i ungefär 8–12 års ålder?',
        },
        examples: [
          { en: 'Build a robot that helps children learn science or mathematics.', sv: 'Bygg en robot som hjälper barn att lära sig naturvetenskap eller matematik.' },
          { en: 'Create a beginner-friendly robotics activity for classrooms.', sv: 'Skapa en nybörjarvänlig robotikaktivitet för klassrummet.' },
          { en: 'Design a robotics game that teaches problem-solving.', sv: 'Designa ett robotspel som lär ut problemlösning.' },
          { en: 'Make robotics understandable without requiring previous coding experience.', sv: 'Gör robotik begripligt utan krav på tidigare programmeringserfarenhet.' },
        ],
      },
      {
        title: { en: 'Future STEM Classroom', sv: 'Framtidens STEM-klassrum' },
        question: {
          en: 'What should hands-on STEM education look like in the future?',
          sv: 'Hur ska praktisk STEM-undervisning se ut i framtiden?',
        },
        examples: [
          { en: 'Robotics integrated with science, mathematics and sustainability.', sv: 'Robotik integrerat med naturvetenskap, matematik och hållbarhet.' },
          { en: 'AI-assisted learning activities.', sv: 'AI-stödda lärandeaktiviteter.' },
          { en: 'Affordable classroom robotics.', sv: 'Prisvärd robotik för klassrummet.' },
          { en: 'Team-based STEM challenges instead of traditional lectures.', sv: 'Lagbaserade STEM-utmaningar i stället för traditionella föreläsningar.' },
          { en: 'Tools teachers can easily use without being robotics experts.', sv: 'Verktyg som lärare enkelt kan använda utan att vara robotikexperter.' },
        ],
      },
      {
        title: { en: 'STEM for Everyone', sv: 'STEM för alla' },
        question: {
          en: 'How do we make robotics and technology accessible regardless of background, school or previous experience?',
          sv: 'Hur gör vi robotik och teknik tillgängligt oavsett bakgrund, skola eller tidigare erfarenhet?',
        },
        examples: [
          { en: 'Low-cost robotics kits.', sv: 'Robotikkit till låg kostnad.' },
          { en: 'Accessible learning for children with different abilities.', sv: 'Tillgängligt lärande för barn med olika förutsättningar.' },
          { en: 'Multilingual STEM learning.', sv: 'Flerspråkigt STEM-lärande.' },
          { en: 'Activities that work in schools with limited technology resources.', sv: 'Aktiviteter som fungerar i skolor med begränsade tekniska resurser.' },
          { en: 'Community-based robotics clubs.', sv: 'Lokala robotikklubbar.' },
        ],
      },
      {
        title: { en: 'Robotics for a Better World', sv: 'Robotik för en bättre värld' },
        question: {
          en: 'Let young people solve problems they can actually understand.',
          sv: 'Låt unga lösa problem som de faktiskt kan förstå.',
        },
        examples: [
          { en: 'Waste sorting robot.', sv: 'Robot som sorterar avfall.' },
          { en: 'Energy-saving classroom.', sv: 'Energisnålt klassrum.' },
          { en: 'Smart school garden.', sv: 'Smart skolträdgård.' },
          { en: 'Robot supporting elderly people.', sv: 'Robot som stöttar äldre.' },
          { en: 'Safer school environment.', sv: 'Tryggare skolmiljö.' },
          { en: 'Sustainable transport.', sv: 'Hållbara transporter.' },
          { en: 'Helping people with disabilities.', sv: 'Hjälp till personer med funktionsnedsättning.' },
        ],
      },
      {
        title: { en: 'Future Cities & Schools', sv: 'Framtidens städer och skolor' },
        question: { en: 'How could our schools and cities become smarter?', sv: 'Hur kan våra skolor och städer bli smartare?' },
        examples: [],
      },
    ],
    closing: {
      en: "Don't just teach children technology. Give them a reason to use it.",
      sv: 'Lär inte bara barn teknik. Ge dem en anledning att använda den.',
    },
    flow: [
      { en: 'Explore', sv: 'Utforska' },
      { en: 'Build', sv: 'Bygg' },
      { en: 'Experiment', sv: 'Experimentera' },
      { en: 'Fail', sv: 'Misslyckas' },
      { en: 'Learn', sv: 'Lär' },
      { en: 'Create', sv: 'Skapa' },
      { en: 'Inspire', sv: 'Inspirera' },
    ],
  },

  programmes: [
    {
      name: 'Robo Kidovation',
      audience: { en: 'For younger innovators · Grades approximately 3–9', sv: 'För yngre innovatörer · Ungefär årskurs 3–9' },
      description: {
        en: 'Hands-on robotics and STEM activities where students learn by building, experimenting and solving real problems.',
        sv: 'Praktiska robotik- och STEM-aktiviteter där elever lär sig genom att bygga, experimentera och lösa verkliga problem.',
      },
      flow: [
        { en: 'Learn', sv: 'Lär' },
        { en: 'Build', sv: 'Bygg' },
        { en: 'Compete', sv: 'Tävla' },
        { en: 'Innovate', sv: 'Innovera' },
      ],
    },
    {
      name: 'YNG RoboHack',
      audience: { en: 'For youth & young adults', sv: 'För unga och unga vuxna' },
      description: {
        en: 'Students bring ideas or choose real-world problems and build solutions through robotics, software, AI and engineering.',
        sv: 'Elever kommer med idéer eller väljer verkliga problem och bygger lösningar med robotik, mjukvara, AI och teknik.',
      },
      flow: [
        { en: 'Problem', sv: 'Problem' },
        { en: 'Team', sv: 'Lag' },
        { en: 'Prototype', sv: 'Prototyp' },
        { en: 'Pitch', sv: 'Pitch' },
      ],
    },
  ],

  partners: {
    headline: {
      en: "Don't just sponsor the future. Help young people build it.",
      sv: 'Sponsra inte bara framtiden. Hjälp unga att bygga den.',
    },
    intro: { en: 'Companies can participate by:', sv: 'Företag kan delta genom att:' },
    ways: [
      { en: 'Bringing real-world problem statements', sv: 'Bidra med verkliga problemformuleringar' },
      { en: 'Providing mentors', sv: 'Ställa upp med mentorer' },
      { en: 'Hosting workshops', sv: 'Hålla workshoppar' },
      { en: 'Supporting technology or equipment', sv: 'Bidra med teknik eller utrustning' },
      { en: 'Sponsoring challenges', sv: 'Sponsra utmaningar' },
      { en: 'Supporting girls in STEM', sv: 'Stötta tjejer inom STEM' },
      { en: 'Helping validate promising ideas', sv: 'Hjälpa till att validera lovande idéer' },
    ],
    cta: { en: 'Become a Partner', sv: 'Bli partner' },
  },

  // Fill in each value as it is confirmed. null renders as "TBC".
  details: [
    { label: { en: 'Dates', sv: 'Datum' }, value: { en: '20–21 November 2026', sv: '20–21 november 2026' } },
    { label: { en: 'Venue', sv: 'Plats' }, value: { en: 'Linnaeus University, Växjö', sv: 'Linnéuniversitetet, Växjö' } },
    { label: { en: 'Tracks', sv: 'Spår' }, value: { en: 'Robotics · Code · Hack', sv: 'Robotik · Kod · Hack' } },
    {
      label: { en: 'Who can join', sv: 'Vem kan delta' },
      value: { en: 'Students, developers and young innovators', sv: 'Elever, utvecklare och unga innovatörer' },
    },
    { label: { en: 'Team size', sv: 'Lagstorlek' }, value: null },
    { label: { en: 'Powered by', sv: 'Arrangeras av' }, value: { en: 'INIAC × LNU AI Society', sv: 'INIAC × LNU AI Society' } },
  ],

  contactEmail: '',
};
