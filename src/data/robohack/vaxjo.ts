// YNG RoboHack Växjö — the first RoboHack event. To launch another city, copy this file,
// change the content, and register it in ./index.ts (plus ROUTE_PATHS and .htaccess).
import { Code2, Cpu, School, Compass, Target, Users, Hammer, FlaskConical, Mic, Scale, Trophy } from 'lucide-react';
import type { RoboHackEvent } from './types';

export const vaxjo: RoboHackEvent = {
  route: 'vxo',
  meta: {
    title: 'YNG RoboHack Växjö',
    description:
      'YNG RoboHack Växjö — a hackathon for young innovators with a Coding track and a Physical track. Choose a track, take on a challenge, build, test and pitch.',
  },
  brand: { name: 'YNG RoboHack', city: 'Växjö' },
  hero: {
    eyebrow: { en: 'Young innovators hackathon', sv: 'Hackathon för unga innovatörer' },
    intro: {
      en: 'Choose a track, take on a real challenge, build your solution as a team and pitch it to the judges.',
      sv: 'Välj ett spår, anta en verklig utmaning, bygg er lösning i lag och pitcha den för juryn.',
    },
  },

  // Fill in each value as it is confirmed. null renders as "TBC".
  details: [
    { label: { en: 'Date', sv: 'Datum' }, value: null },
    { label: { en: 'Venue', sv: 'Plats' }, value: null },
    { label: { en: 'Team size', sv: 'Lagstorlek' }, value: null },
    { label: { en: 'Who can join', sv: 'Vem kan delta' }, value: null },
    { label: { en: 'Registration deadline', sv: 'Sista anmälningsdag' }, value: null },
    { label: { en: 'Prizes', sv: 'Priser' }, value: null },
  ],

  tracks: [
    {
      id: 'coding',
      icon: Code2,
      enabled: true,
      title: { en: 'Coding Hackathon', sv: 'Kodhackathon' },
      description: {
        en: 'Teams solve problem statements using programming, software, AI or digital solutions.',
        sv: 'Lagen löser problemformuleringar med programmering, mjukvara, AI eller digitala lösningar.',
      },
      buildWith: [
        { en: 'Programming', sv: 'Programmering' },
        { en: 'Software', sv: 'Mjukvara' },
        { en: 'AI', sv: 'AI' },
        { en: 'Digital solutions', sv: 'Digitala lösningar' },
      ],
      challenges: [],
    },
    {
      id: 'physical',
      icon: Cpu,
      enabled: true,
      title: { en: 'Physical Hackathon', sv: 'Fysiskt hackathon' },
      description: {
        en: 'Teams solve problem statements by building physical solutions using electronics, robotics, sensors, IoT, hardware or prototypes.',
        sv: 'Lagen löser problemformuleringar genom att bygga fysiska lösningar med elektronik, robotik, sensorer, IoT, hårdvara eller prototyper.',
      },
      buildWith: [
        { en: 'Electronics', sv: 'Elektronik' },
        { en: 'Robotics', sv: 'Robotik' },
        { en: 'Sensors', sv: 'Sensorer' },
        { en: 'IoT', sv: 'IoT' },
        { en: 'Hardware', sv: 'Hårdvara' },
        { en: 'Prototypes', sv: 'Prototyper' },
      ],
      challenges: [],
    },
    {
      // Hidden for now. Set enabled: true to activate it for a city/event.
      id: 'school',
      icon: School,
      enabled: false,
      title: { en: 'School Programme', sv: 'Skolprogram' },
      description: {
        en: 'A dedicated track for schools and classes, set up together with the schools in each city.',
        sv: 'Ett eget spår för skolor och klasser, upplagt tillsammans med skolorna i varje stad.',
      },
      buildWith: [],
      challenges: [],
    },
  ],

  journey: [
    {
      icon: Compass,
      title: { en: 'Choose Track', sv: 'Välj spår' },
      description: { en: 'Pick the Coding or the Physical track.', sv: 'Välj kodspåret eller det fysiska spåret.' },
    },
    {
      icon: Target,
      title: { en: 'Select or Receive Challenge', sv: 'Välj eller få en utmaning' },
      description: {
        en: 'Choose a problem statement, or receive one from the organisers.',
        sv: 'Välj en problemformulering, eller få en av arrangörerna.',
      },
    },
    {
      icon: Users,
      title: { en: 'Form Team', sv: 'Bilda lag' },
      description: { en: 'Team up and split the roles.', sv: 'Bilda lag och fördela rollerna.' },
    },
    {
      icon: Hammer,
      title: { en: 'Build', sv: 'Bygg' },
      description: {
        en: 'Turn the idea into code or a working prototype.',
        sv: 'Gör idén till kod eller en fungerande prototyp.',
      },
    },
    {
      icon: FlaskConical,
      title: { en: 'Test', sv: 'Testa' },
      description: {
        en: 'Try it against the challenge and improve it.',
        sv: 'Prova lösningen mot utmaningen och förbättra den.',
      },
    },
    {
      icon: Mic,
      title: { en: 'Pitch', sv: 'Pitcha' },
      description: {
        en: 'Present the problem, your solution and a demo.',
        sv: 'Presentera problemet, er lösning och en demo.',
      },
    },
    {
      icon: Scale,
      title: { en: 'Judging', sv: 'Bedömning' },
      description: { en: 'The jury reviews every team.', sv: 'Juryn bedömer varje lag.' },
    },
    {
      icon: Trophy,
      title: { en: 'Final Showcase', sv: 'Final och utställning' },
      description: {
        en: 'Teams show their solutions to the audience.',
        sv: 'Lagen visar upp sina lösningar för publiken.',
      },
    },
  ],

  // Add a mailto: or form link to turn on the "Register interest" buttons.
  registerHref: '',
  contactEmail: '',
  partners: [],
};
