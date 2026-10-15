# Register page: question flow (vfi, esk, vxo)

Approved 2026-10-15. Reference: `eskilstuna_robokidovation_registration.html` and
`vasteras_future_innovators_registration_fixed.html` (flow only; our stack, palette and questions).

## Flow

Card choices, one question per step. A card is selected, then Continue. A bar under the
heading shows the chosen programme (date, venue) and every answer with ✎ to change it.
Progress shows "Step n of N". Last two steps: the form, then Review → Submit.

| Site | Step 1 (programme) |
|---|---|
| vfi | RoboKidovation (4–5 Dec, MISV) · Young Inno Hack (4–5 Dec, venue TBC) · Community |
| esk | RoboKidovation (2 Dec, IES Eskilstuna) · Bring your idea · Community |
| vxo | none: RoboHack Växjö is fixed |

- RoboKidovation: joining as School-Teacher / Existing team / Individual-Parent / Association-club → Demo / Workshop / Competition → form.
- Hackathon: joining as School-Teacher / Existing team / Individual → Register idea / Participate, then a theme card → form.
- Bring your idea (esk): area card → idea form.
- Community: Join community / Volunteer / Mentor / Partner → form.

## Forms (our existing questions, minus what the steps already answered)

| Path | Form | Stored as |
|---|---|---|
| School × demo/workshop | booking, school mode | registrations, form_type demo/workshop |
| Team or Individual × demo/workshop | booking, interest card + guardian | same, registration_type student |
| Association × demo/workshop | association, activity pre-ticked | form_type association |
| Any × Competition | new team entry: name, contact, category, members, number of teams | form_type competition, members in intake_details |
| Hackathon × Participate | squad (theme = challenge area); individual may be a squad of 1 | form_type hackathon |
| Hackathon × Register idea, esk ideas | idea (theme = area) | idea_submissions |
| Volunteer / Mentor | volunteer form; Mentor pre-selects the new mentor role | volunteer_registrations |
| Partner | partner form (vxo's, now on every site) | eu_skola_partners |
| Join community | new: name, email, phone, organisation, interests | form_type community |

Theme cards use our idea areas and challenge areas. Accuracy and GDPR boxes sit on the Review step.

## Links

`?tab=` still works and fills the steps it implies (workshop, demo, association, competition,
submit-idea, hackathon, volunteer, mentor, partner, community). vxo's partner and volunteer links
keep working though they are not in vxo's question flow.

## Admin (www-iniac-se)

Labels for competition and community entries (table, details dialog, email audience, receipt
programme name) and the Mentor volunteer role. No schema change.
