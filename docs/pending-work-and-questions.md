# Pending Work, Answered Decisions, And Questions

## Answered Decisions

- Access model: any active user with valid login access can use the extension. Backend role assignments and ACL/scoping still decide which protected data each user can see.
- Version-one workflow: support login, forgot password, reset-password handoff, and a protected home screen after login.
- Site behavior: if the user is not on an approved health data website, show the home/search experience. If the user is on an approved site and a patient ID can be detected, fetch patient data from the backend.
- First data source scope: Databricks-backed data is the current source scope. More sources/sites can be added later through configuration and manifest host permission updates.
- Authentication: Supabase Auth owns email/password login and session tokens. The extension sends `Authorization: Bearer <supabase-access-token>` to protected backend APIs.
- Local PHI storage: basic patient information may be stored locally if needed, but full patient details should not be persisted. This must remain compliance-ready for future HIPAA, SOC 2, and related controls.
- Backend ownership: the existing Radeion backend owns auth validation, application profiles, roles/scopes, Databricks-backed reads, access requests, invites, users, organizations, audit logs, and health checks.
- Environment handling: frontend should use environment variables for API and Supabase config so local development can target the local backend and deployment can swap values without source edits.
- Floating panel UX: on supported pages, show a small non-disruptive box with close and open actions. The full panel opens only after user intent.
- Main protected navigation: start with dynamic tabs for Home, Patient Details, and Vitals. The tab set should be data/config-driven enough to change later.
- Basic local storage scope: store only minimal identifiers and non-sensitive display metadata such as patient ID, detail ID, updated-by ID, and name when needed. Full details must require authentication and backend access.
- First supported domain: not finalized. Use a scoped placeholder and add the real health data website after manager/product approval.
- Patient ID extraction: not finalized. Build detection behind an adapter so the selector/URL/DOM parsing strategy can be updated when the first website is confirmed.
- Patient Details and Vitals data source: use existing backend Databricks-backed endpoints first. Consider a new aggregate endpoint only if existing routes do not support the UI cleanly.
- Search scope: support patient ID and name first. Add other identifiers later if approved.
- Local browser API access: use a Vite dev proxy for local development.

## Pending Product Decisions

- Confirm the exact role labels that should appear in the UI, even though backend ACL/scoping owns enforcement.
- Define the minimum fields for Home, Patient Details, and Vitals.
- Refine the exact approved local-storage fields for basic patient information as compliance/product decisions mature.
- Decide how much Databricks query detail should be visible to end users.
- Decide whether access request and invite flows belong inside the extension first release or only in a separate admin frontend.

## Pending Technical Work

- Finish connecting frontend screens to the existing Radeion backend API.
- Expand the token-aware API boundary in `src/shared/api/apiClient.ts` as more endpoints are wired.
- Complete Supabase client-side auth, session loading, and token refresh validation against the real Supabase project.
- Validate `GET /auth/methods` discovery against local backend.
- Validate password recovery using `POST /auth/password-recovery`.
- Validate reset-password callback handling using the Supabase redirect flow configured by the backend.
- Add supported-site detection logic, starting with the approved health data website scope.
- Add patient-ID detection behind a site-specific adapter once the first approved website and ID pattern are known.
- Implement Chrome runtime message handlers beyond the current health check.
- Refine popup actions for login, home/search, and panel-open behavior.
- Refine the small supported-site box with close and open behavior.
- Refine full floating-panel controls for open, minimize, close, dashboard navigation, and dynamic tab selection.
- Decide how UI state should persist through `chrome.storage`.
- Add loading, empty, error, unauthorized, and disconnected states for all data-backed surfaces.
- Add Databricks-backed API calls for patient metrics/vitals and other patient data views.
- Add test coverage once behavior exists.

## Pending Security And Compliance Work

- Define the final basic patient fields allowed in local storage.
- Define local storage retention and cleanup rules.
- Confirm encryption requirements for any sensitive local state.
- Add frontend audit-event requirements for panel open, patient lookup, search, export, and denied access if the backend exposes/accepts those events.
- Define frontend behavior for backend `401` and `403` responses.
- Confirm supported healthcare domains before adding host permissions. Databricks is a backend data source, not necessarily a browser host permission.
- Document which page data can be read by content scripts.
- Add a process for reviewing new Chrome permissions.

## Pending Backend And API Work

- Use the existing Radeion backend handoff as the source of truth for current APIs.
- Start with existing Databricks-backed routes for patient details and vitals. Current routes include `GET /claims`, `GET /providers`, and `GET /patient-metrics`.
- Consider a future patient-focused aggregate endpoint if existing routes force too much frontend joining or transformation.
- Decide whether OpenAPI or another schema source will generate frontend types.
- Define API error formats and retry behavior.
- Define rate limits and offline behavior.
- Define deployed API base URLs and Supabase publishable config for staging and production.

## Pending UI And UX Work

- Finalize the design system.
- Design the small supported-site prompt with close and open actions.
- Decide whether the full floating panel should be draggable, resizable, collapsible, and dockable after it opens.
- Define protected navigation around dynamic tabs: Home, Patient Details, Vitals, and future tabs.
- Search by patient ID and name from the home screen first.
- Decide how the extension indicates unsupported sites while still allowing manual search.
- Design states for unauthenticated, unauthorized, loading, stale data, and no patient selected.
- Confirm accessibility requirements for keyboard navigation and screen readers.

## Pending Development Setup

- Add a test runner if needed.
- Add extension-specific testing guidance.
- Add local Chrome extension loading instructions.
- Decide whether build artifacts in `dist` should stay ignored.
- Decide whether CI should run lint, typecheck, build, and tests.

## Remaining Questions For The Team

1. How long may the extension keep basic patient information in Chrome storage?
2. Which website domain should be approved first for the health data website scope?
3. What should the extension show when patient ID detection fails on a supported site?
4. Should access request and invite flows be included in this extension or handled by a separate admin/web app?
5. What audit events must the extension emit or trigger through backend APIs?
6. What are the staging and production values for API base URL, Supabase URL, and Supabase publishable key?
7. Should the small supported-site prompt reappear after close on navigation, after a time delay, or only when manually reopened?
8. Which checks must CI run before merging extension work?

## Suggested Priority Order

1. Add frontend environment config and Supabase auth wiring.
2. Implement API client with bearer-token injection and `401`/`403` handling.
3. Implement login, forgot password, and reset-password callback flow.
4. Implement protected Home with manual patient search.
5. Add supported-site prompt, domain scope, and patient-ID detection.
6. Wire Patient Details and Vitals using Databricks-backed backend APIs.
7. Add local storage policy for only approved basic patient fields.
8. Add tests and CI gates.
9. Prepare Chrome extension packaging and release notes.
