# Radeion Extension

Frontend-only Chrome extension scaffold for the Radeion healthcare companion experience.

This setup follows the healthcare extension guidelines in the provided project document while keeping backend work separate. It includes extension UI surfaces, TypeScript boundaries, shared components, and a scalable folder structure, but it does not implement patient extraction, backend APIs, auth flows, RBAC/ACL logic, or PHI handling.

## Stack

- React 18
- TypeScript
- Vite
- CRXJS for Manifest V3 extension builds
- TanStack Query, Zustand, Zod, React Hook Form installed for future UI/data wiring
- CSS with shared component classes

Use Node `22.13.0` or newer LTS-compatible versions from the `engines` field. This avoids odd-version Node warnings from frontend tooling.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Extension Surfaces

- Toolbar popup: `src/ui/popup`
- Floating panel: `src/ui/floating-panel`
- Full dashboard page: `src/ui/dashboard`
- Login page: `src/ui/login`
- Forgot password page: `src/ui/forgot-password`
- Contact/help page: `src/ui/contact`
- Options page: `src/ui/options`
- Background service worker: `src/background`
- Content script mount: `src/content`

## Notes

- Backend setup and code should live separately.
- Use `.env.example` as the template for frontend environment values.
- Keep Chrome permissions narrow. Add real supported healthcare domains only after approval.
- See `docs/project-structure.md` for a beginner-friendly map of the codebase.
