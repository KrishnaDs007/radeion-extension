# Radeion Extension Project Structure

This repository is currently a frontend-only Chrome extension scaffold. Backend services, real authentication, patient search, supported-site registry, RBAC, ACL, and audit logging should be implemented separately and then connected through typed frontend boundaries.

## Main folders

```txt
src/
  app/                  Shared React app providers and rendering helper
  background/           Manifest V3 service worker entry
  content/              Content-script entry that mounts the floating UI
  shared/               Reusable code for all extension surfaces
    api/                Backend API boundary placeholders
    auth/               Auth/session-related frontend types
    components/         Small shared UI components
    config/             Environment config
    messaging/          Chrome runtime message types
    storage/            Chrome storage state types/defaults
    types/              Domain-facing frontend types
  styles/               Global extension styles
  ui/
    contact/            Contact/help page
    dashboard/          Full-page extension dashboard
    floating-panel/     Injected floating panel UI
    forgot-password/    Password recovery page
    login/              Login page
    options/            Extension settings page
    popup/              Toolbar popup
```

## Current boundaries

- `src/shared/api/apiClient.ts` exists only as a future backend integration boundary.
- `manifest.ts` intentionally uses narrow placeholder host permissions.
- UI pages are static scaffolds with forms and layout only.
- No patient extraction, backend calls, RBAC/ACL decisions, or PHI storage have been implemented.

## Suggested next setup decisions

Before implementing extension behavior, decide:

1. Whether auth will use enterprise OIDC/SSO or username/password.
2. Which healthcare domains should be allowed in `manifest.ts`.
3. Whether the backend will provide OpenAPI schemas so frontend types can be generated.
4. Which design system, if any, the extension should match.
