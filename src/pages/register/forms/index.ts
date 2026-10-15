import type { FormId } from '../flow';
import type { FormDef } from '../ui';
import { bookingForm } from './booking';
import { associationForm } from './association';
import { competitionForm } from './competition';
import { squadForm } from './squad';
import { ideaForm } from './idea';
import { mentorForm, volunteerForm } from './volunteer';
import { partnerForm } from './partner';
import { communityForm } from './community';

export const FORMS: Record<FormId, FormDef> = {
  booking: bookingForm,
  association: associationForm,
  competition: competitionForm,
  squad: squadForm,
  idea: ideaForm,
  volunteer: volunteerForm,
  mentor: mentorForm,
  partner: partnerForm,
  community: communityForm,
};
