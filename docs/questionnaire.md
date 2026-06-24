# Manager Decision Questionnaire

This questionnaire captures product, compliance, operations, and rollout decisions that should be clarified before or during the next implementation phase. It intentionally avoids developer-specific implementation details.

## Product Scope

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| User access | Who should be allowed to use the extension? | Any active user with valid login access. | Confirm if all active users are allowed or if access should be limited by role, organization, or customer. |
| First workflow | What must the first release help users do? | Login, recover password, search by patient ID/name, view Home, Patient Details, and Vitals. | Confirm the first-release workflow and remove anything that should wait. |
| Main tabs | Which tabs should be visible in the first release? | Home, Patient Details, Vitals. | Confirm tab names and whether any tab should be renamed, hidden, or added. |
| Home screen | What should users see when they are not on a supported health data website? | Home/search experience. | Confirm required content and actions for this state. |
| Unsupported site behavior | What should users see on unsupported websites? | Non-intrusive state with manual search available. | Confirm wording, actions, and whether the extension should stay quiet by default. |
| Search | Which patient search fields should be supported first? | Patient ID and name. | Confirm whether name search is allowed and whether any additional identifiers are required. |
| No patient found | What should happen when search returns no matching patient? | Show a safe empty state. | Confirm wording and whether users should be able to request access/support. |

## Supported Websites And Launch Scope

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| First supported site | Which health data website should the extension support first? | Not finalized. | Provide the first approved website/domain. |
| Future sites | How should new supported websites be approved? | Add later through a controlled scope process. | Define approval owner and review process. |
| Patient ID location | Where does the first website show the patient ID? | Not finalized. | Provide examples/screenshots or written guidance from the target site. |
| Patient ID reliability | What should happen if the extension cannot detect a patient ID? | Show manual search option. | Confirm fallback behavior and whether users can correct the ID manually. |
| Prompt behavior | Should the small Close/Open prompt appear automatically on supported websites? | Yes, small and non-disruptive. | Confirm when it appears and whether it should remember dismissal. |
| Prompt reappearance | After a user closes the prompt, when should it appear again? | Not finalized. | Choose: next page load, next patient, next session, timed delay, or manual reopen only. |

## Patient Data And Compliance

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| Local storage | What patient information may the extension store locally? | Minimal identifiers and metadata only: patient ID, detail ID, updated-by ID, name, and similar basic info. | Confirm the exact allowed fields. |
| Full details | Can full patient details be stored locally? | No. Full details require authenticated backend access. | Confirm this restriction. |
| Retention | How long may basic patient information remain in local storage? | Not finalized. | Define retention period and cleanup trigger. |
| Compliance | Which compliance requirements must guide the first release? | Future-ready for HIPAA, SOC 2, and related controls. | Confirm required standards and any immediate must-haves. |
| Audit events | Which user actions must be audited? | Not finalized. | Confirm whether login, search, patient view, panel open, export, denied access, and errors need audit events. |
| Sensitive display | Are there fields that should never be shown in the extension UI? | Not finalized. | List restricted fields or categories. |
| Access denied | What should users see if they are logged in but not authorized for a patient? | Safe access-denied state. | Confirm message and support/escalation path. |

## Data Views

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| Patient Details | What information must appear in Patient Details? | Use existing backend data first. | Confirm required fields and priority order. |
| Vitals | What information must appear in Vitals? | Not finalized. | Confirm exact vitals/metrics and date range. |
| Data freshness | How fresh must displayed data be? | Not finalized. | Define acceptable update delay or freshness indicator. |
| Last updated | Should users see when data was last updated and by whom? | Basic metadata may include updated-by ID. | Confirm display requirements. |
| Empty data | What should users see if a patient has no available details or vitals? | Safe empty state. | Confirm wording and next action. |
| Exports | Should extension users be able to export any data? | Not included in first workflow. | Confirm whether exports are allowed now, later, or never. |

## Authentication And Access

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| Login method | Which login method should the extension show? | Email/password through Supabase Auth. | Confirm whether any other login method is required. |
| Forgot password | Should forgot-password be available in the extension? | Yes. | Confirm wording and support flow. |
| Reset password | Should reset-password completion happen inside the extension experience? | Yes, through configured recovery redirect. | Confirm expected user experience. |
| Access requests | Should users request access from inside the extension? | Not finalized. | Decide whether this belongs in extension or a separate admin/web app. |
| Invite acceptance | Should invite acceptance/password setup happen in the extension? | Not finalized. | Decide whether this belongs in extension or a separate admin/web app. |
| Disabled users | What should disabled or inactive users see? | Login blocked/protected app unavailable. | Confirm message and support contact. |

## Rollout And Operations

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| Environments | Which environments are required before launch? | Local first; staging and production later. | Confirm environment names and owners. |
| Pilot users | Who should test the first working version? | Not finalized. | Identify pilot users or teams. |
| Release approval | Who approves extension releases? | Not finalized. | Define approval owner and release checklist. |
| Support path | Where should users go when something fails? | Contact/help page exists as scaffold. | Confirm support email, form, or ticket process. |
| Training | Do users need training or onboarding material? | Not finalized. | Confirm whether a short guide or walkthrough is required. |
| Success metrics | How will managers know the extension is useful? | Not finalized. | Define metrics such as searches, successful patient matches, time saved, or active users. |

## Future Scope

| Area | Question | Current Assumption | Decision Needed |
| --- | --- | --- | --- |
| Additional tabs | What tabs may be added after Home, Patient Details, and Vitals? | Dynamic tab structure should support future additions. | List expected future tabs. |
| Additional search fields | Which search fields may be added later? | Future expansion possible. | List candidate identifiers and approval requirements. |
| Additional sites | Which websites are likely after the first supported site? | Future scope. | List likely next sites and priority. |
| Deeper storage | Could the extension ever cache more data locally? | Avoid until compliance controls are finalized. | Confirm if this is prohibited or possible later with controls. |
| Admin features | Should admin/review features ever be part of the extension? | Possibly separate app. | Decide long-term direction. |

## Open Items To Resolve First

1. First approved health data website/domain.
2. Exact locally allowed patient fields and retention period.
3. Required fields for Patient Details.
4. Required fields for Vitals.
5. Prompt reappearance behavior after close.
6. Audit event requirements.
7. Whether access request and invite flows belong in the extension.
