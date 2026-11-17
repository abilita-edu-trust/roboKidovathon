import type { FormId } from '../flow';
import type { FormDef } from '../ui';
import { bookingForm } from './booking';
import { associationForm } from './association';
import { competitionForm } from './competition';
import { buildPlayForm } from './buildPlay';
import { squadForm } from './squad';
import { youngForm } from './young';
import { ideaForm } from './idea';
import { mentorForm, volunteerForm } from './volunteer';
import { partnerForm } from './partner';
import { communityForm } from './community';
import { kidForm } from './kid';

export const FORMS: Record<FormId, FormDef> = {
  booking: bookingForm,
  association: associationForm,
  competition: competitionForm,
  buildplay: buildPlayForm,
  squad: squadForm,
  young: youngForm,
  idea: ideaForm,
  volunteer: volunteerForm,
  mentor: mentorForm,
  partner: partnerForm,
  community: communityForm,
  kid: kidForm,
};
