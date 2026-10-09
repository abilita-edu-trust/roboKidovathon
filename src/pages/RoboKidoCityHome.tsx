import React from 'react';
import { RoboKidoTeamsFinalDay } from '../components/RoboKidoTeamsFinalDay';
import { CityDetailsSection, CityPathways, CityVoteSection, type CityDetail } from '../components/city/CitySections';
import type { IntakeProgramTab } from './IntakeRegisterPage';

interface RoboKidoCityHomeProps {
  details: CityDetail[];
  onRegister: (tab?: IntakeProgramTab) => void;
  onOpenIdeas: () => void;
}

/**
 * Home-page sections for a RoboKidovation city site (e.g. esk.iniac.se), shown between the
 * shared VFI hero and volunteer banner: the VFI categories/teams/final-day section, event
 * details, the city's idea voting and the forms to take part.
 */
export const RoboKidoCityHome: React.FC<RoboKidoCityHomeProps> = ({ details, onRegister, onOpenIdeas }) => (
  <>
    <RoboKidoTeamsFinalDay />
    <CityDetailsSection details={details} />
    <CityVoteSection onOpenIdeas={onOpenIdeas} onSubmitIdea={() => onRegister('submit-idea')} />
    <CityPathways onRegister={onRegister} onOpenIdeas={onOpenIdeas} />
  </>
);
