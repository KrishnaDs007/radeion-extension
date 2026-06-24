# Radeion Extension Project Summary

## Purpose

Radeion Extension is a frontend-only Chrome extension scaffold for a healthcare companion workflow. It defines the browser extension shell, React UI surfaces, shared frontend boundaries, and placeholder messaging/storage types that connect to the separate Radeion backend.

The current repository intentionally avoids implementing production patient extraction, full PHI storage, RBAC/ACL decisions, audit logging, or production healthcare-site access inside the frontend. Those responsibilities should remain controlled by backend contracts and compliance decisions.

## Current Stack

- React 18 for extension UI surfaces.
- TypeScript for typed frontend contracts.
- Vite for local development and builds.
- CRXJS for Manifest V3 Chrome extension bundling.
- ESLint for source linting.
- TanStack Query, Zustand, Zod, and React Hook Form are installed for planned data, state, validation, and form workflows.
- Lucide React provides icons for the UI.

## Main Extension Surfaces

- Toolbar popup: `src/ui/popup`
- Injected floating panel: `src/ui/floating-panel`
- Full dashboard page: `src/ui/dashboard`
- Login page: `src/ui/login`
- Forgot password page: `src/ui/forgot-password`
- Contact/help page: `src/ui/contact`
- Options/settings page: `src/ui/options`
- Content script mount: `src/content`
- Background service worker: `src/background`

## Current Capabilities

- Manifest V3 extension metadata lives in `manifest.ts`.
- The toolbar popup renders session/site placeholders and basic action buttons.
- The content script mounts a non-disruptive Close/Open prompt and can open the floating panel.
- The floating panel uses dynamic tabs for Home, Patient Details, and Vitals.
- The dashboard page has a protected shell with manual search by patient ID and name.
- Login, forgot-password, reset-password, contact, and options pages exist.
- Supabase client setup and token-aware backend API helpers are in place.
- Vite local proxy support is configured for backend calls.
- Shared UI components provide basic button, page shell, and status pill patterns.
- Shared types define early site-context, extension message, auth, API, patient metadata, and UI-storage boundaries.
- The background service worker responds to a `RADEION_HEALTH_CHECK` runtime message.
- Backend handoff documentation exists at `G:/Dev/radeion-backend/docs/frontend-extension-handoff.md`.

## Explicit Non-Goals In The Current Repo

- No backend service implementation in this repository.
- No production-complete frontend authentication flow yet.
- No production patient lookup or domain-specific patient ID extraction yet.
- No full PHI persistence.
- No supported-site registry.
- No finalized patient details/vitals data mapping yet.
- No frontend-owned RBAC, ACL, audit logging, or compliance enforcement.
- No production healthcare domain permissions.

## Build And Quality Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

Use a Node version compatible with the `engines` field in `package.json`.

## Key Architecture Notes

The project uses a boundary-first scaffold. UI surfaces are present, but risky healthcare behavior is held behind explicit placeholders until backend contracts and compliance rules are finalized.

`src/shared/api/apiClient.ts` currently throws by design. This prevents accidental frontend assumptions about backend behavior before the API contract exists.

`manifest.ts` keeps host permissions narrow. Replace placeholder domains only after the supported-site approval process is defined.

Chrome storage types exist for panel layout and UI state. They should not be extended to store PHI unless a formal storage, encryption, and retention policy is approved.

## Recommended Next Milestones

1. Add Supabase Auth wiring for login, forgot password, and reset-password callback handling.
2. Replace the placeholder API client with a bearer-token backend client.
3. Implement protected Home with manual patient search.
4. Add supported-site detection and patient-ID extraction for the first approved health data website.
5. Add the small supported-site prompt with Close/Open actions.
6. Wire dynamic tabs for Home, Patient Details, and Vitals.
7. Add tests around auth routing, message handling, site detection, API behavior, and local data safety rules.
