# Radeion Extension Developer Notes

## Mental Model

Think of this repository as the browser-extension frontend shell. It is ready for UI iteration and backend integration work. The backend handoff now exists in `G:/Dev/radeion-backend/docs/frontend-extension-handoff.md`.

The safest development path is to keep every real-world integration behind typed boundaries, use the backend as the authorization source of truth, and avoid local PHI persistence beyond approved basic fields.

## Source Map

```txt
src/
  app/                  Shared React app providers and render helper
  background/           MV3 service worker entry
  content/              Content script entry that mounts injected UI
  shared/               Reusable components, types, config, messaging, storage, API boundary
  styles/               Global extension styles
  ui/                   Individual extension pages and panels
```

## Important Files

- `manifest.ts` defines Chrome extension permissions, surfaces, content scripts, and web-accessible resources.
- `src/background/service-worker.ts` handles background lifecycle and runtime messages.
- `src/content/index.tsx` mounts the floating panel into the page.
- `src/ui/floating-panel/FloatingPanelApp.tsx` contains the injected patient workspace scaffold.
- `src/ui/popup/main.tsx` contains the toolbar popup shell.
- `src/ui/dashboard/main.tsx` contains the full dashboard scaffold.
- `src/shared/api/apiClient.ts` is the future backend integration boundary.
- `src/shared/messaging/messages.ts` defines message contracts used between extension pieces.
- `src/shared/storage/uiState.ts` defines local UI state shape for the panel.
- `src/shared/types/siteContext.ts` defines early supported-site and patient-context shape.

## Development Workflow

1. Install dependencies with `npm install`.
2. Run `npm run dev` for local Vite development.
3. Run `npm run typecheck` before committing TypeScript changes.
4. Run `npm run lint` before committing source changes.
5. Run `npm run build` before packaging or testing the Chrome extension build output.

## Environment Setup

Create `.env` from `.env.example` for local development.

```text
VITE_API_BASE_URL=http://localhost:5001
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_EXTENSION_ENVIRONMENT=local
```

Do not put backend secrets in frontend env files.

## Current Progress

- Project scaffold exists around multiple Chrome extension entry points.
- Shared React rendering is centralized through `src/app/renderApp.tsx`.
- Shared providers are centralized through `src/app/AppProviders.tsx`.
- UI pages are present for popup, floating panel, dashboard, login, forgot password, reset password, contact, and options.
- Shared boundaries exist for API calls, auth/session access, runtime messages, patient metadata storage, storage state, and site context.
- Manifest host permissions remain intentionally locked down to placeholder values.
- Backend support exists separately and should be integrated with Supabase Auth plus token-authenticated API calls.
- Vite proxy support is configured through `VITE_BACKEND_PROXY_TARGET`.

## Integration Guidelines

- Keep Chrome permissions narrow. Add approved domains only when they are needed.
- Treat backend ACL/scoping as the source of truth for protected data access.
- Store only approved basic patient information locally, never full patient details.
- Keep API integration inside `src/shared/api`.
- Keep runtime message names typed in `src/shared/messaging/messages.ts`.
- Add schema validation for data crossing backend or page-boundary edges.
- Prefer generated types from backend contracts once those contracts exist.
- Use `GET /auth/methods` to drive auth UI assumptions.
- Send Supabase access tokens to protected backend APIs as bearer tokens.
- Keep site-specific patient ID detection inside `src/shared/site/supportedSites.ts`.
- Keep tab definitions inside `src/shared/patient/patientTabs.tsx`.

## Testing Notes

The current repository has lint, typecheck, and build scripts but does not yet include a dedicated test runner. When behavior becomes non-trivial, add focused tests around:

- Background message handling.
- Content-script mounting and duplicate-mount prevention.
- Supported-site detection.
- API request behavior and error states.
- Storage serialization and migration.
- PHI safety and permission restrictions.

## Local Learning Notes

The folder `docs/local-learning/` is ignored by Git. Use it for working notes, experiments, learning summaries, temporary onboarding notes, and current-progress scratch docs that should not become repository documentation.
