# Backend Integration Plan

## Source Of Truth

Backend handoff file:

```text
G:/Dev/radeion-backend/docs/frontend-extension-handoff.md
```

The backend is a NestJS API that already supports Supabase Auth validation, application profiles, role/scoped access control, reference data, care coordinator assignments, Databricks-backed reads, saved query presets, audit logs, health checks, and operational exports.

## Frontend Environment

Use Vite environment variables so local and deployed builds can point at different backend/Supabase projects without source changes.

```text
VITE_API_BASE_URL=http://localhost:5001
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_EXTENSION_ENVIRONMENT=local
```

Never expose backend secrets in frontend env:

- `SUPABASE_SECRET_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `DATABRICKS_TOKEN`
- `RESEND_API_KEY`

## Local Backend Checks

The backend usually runs locally on:

```text
http://localhost:5001
```

Verify local readiness with:

```text
GET /health
GET /health/config
GET /health/databricks
```

The backend handoff notes that browser calls may need either backend CORS support or a frontend dev proxy.

## Authentication Flow

Supabase Auth owns login and session tokens.

Frontend flow:

1. Call `GET /auth/methods` before rendering auth choices.
2. Show email/password login when `emailPassword` is available.
3. Use Supabase client-side auth to sign in.
4. Read the Supabase session access token.
5. Send the token to protected backend routes:

```http
Authorization: Bearer <supabase-access-token>
```

Backend behavior:

1. Validates the bearer token with Supabase.
2. Loads the matching application profile.
3. Loads active role assignments.
4. Applies ACL permissions and organization scoping.

Only active application profiles should reach protected app screens.

## Password Recovery And Reset

Forgot password screen:

```http
POST /auth/password-recovery
Content-Type: application/json

{
  "email": "user@example.org"
}
```

The response is always generic. Do not reveal whether an account exists.

Reset password is completed through the Supabase redirect flow configured by the backend with `PASSWORD_RECOVERY_REDIRECT_URL`. The extension frontend needs a reset-password callback screen that can consume the Supabase recovery session and set the new password.

## Protected App Flow

After login, show a protected Home screen.

Home should support:

- Manual patient search.
- Unsupported-site state.
- Supported-site detected state.
- Patient-ID detected state.
- Loading, empty, unauthorized, and error states.

When a user is on an approved health data website:

1. Show a small non-disruptive prompt with Close and Open actions.
2. Detect patient ID when available through a site-specific adapter.
3. Fetch patient data only after auth/session checks and allowed backend access.
4. Open the full panel when the user chooses Open.

## Initial Dynamic Tabs

Start with these tabs:

- Home
- Patient Details
- Vitals

Keep the tab list dynamic/configurable so future tabs can be added without rewriting the panel structure.

## Data Source Scope

The current backend data scope is Databricks-backed reads.

Current protected data routes:

```text
GET /claims
GET /providers
GET /patient-metrics
```

Supported query parameters include:

```text
organizationId
practiceId
providerId
patientId
fromDate
toDate
sortBy
sortDirection
limit
offset
includeResultChunks
```

Use `page.hasNextPage` and `page.nextOffset` for pagination.

Use `includeResultChunks=true` only when the UI explicitly needs extra Databricks chunks.

Use the existing Databricks-backed endpoints first for Patient Details and Vitals. If those routes cannot support the desired UI cleanly, consider a backend aggregate endpoint later.

## API Response Handling

Most protected detail/list routes return:

```json
{
  "data": {}
}
```

Paginated routes return:

```json
{
  "data": [],
  "page": {
    "limit": 25,
    "offset": 0,
    "total": 100,
    "nextOffset": 25,
    "hasNextPage": true
  }
}
```

Databricks data routes return statement metadata plus result data and pagination details.

## Error Handling

- `400`: validation error or invalid state transition.
- `401`: missing/invalid Supabase token; redirect to login.
- `403`: authenticated but lacks permission; show access denied.
- `404`: record not found or not visible under current scope.
- `500`: unexpected backend/integration failure; show safe retry/support message.

Because backend validation rejects unknown fields, frontend payloads should send only documented fields.

## Local Storage Policy

The extension may store only approved basic patient information locally. It should not persist full patient details.

Current allowed-scope assumption:

- Patient ID.
- Detail ID.
- Updated-by ID.
- Name.
- Similar minimal metadata that is not enough to reconstruct full patient details without authenticated backend access.

Before implementation, define:

- Allowed fields.
- Retention duration.
- Cleanup triggers.
- Whether local data must be encrypted.
- Whether any local cache should be disabled in production until HIPAA and SOC 2 controls are finalized.

## Local Development Proxy

Use a Vite dev proxy for local backend calls so browser CORS does not block local frontend work.

## Developer Auth Bypass

For local frontend development only, the extension can bypass the frontend login gate when this env value is provided:

```text
VITE_DEV_AUTH_BYPASS_EMAIL=developer@example.com
```

Optional:

```text
VITE_DEV_AUTH_BYPASS_NAME=Developer
VITE_DEV_AUTH_BYPASS_TOKEN=<local-dev-token>
```

The bypass is disabled when `VITE_EXTENSION_ENVIRONMENT=production`. Without `VITE_DEV_AUTH_BYPASS_TOKEN`, the UI can open but protected backend calls may still fail with `401`, which is useful when testing unauthenticated/error states.

## First Implementation Milestone

1. Add Supabase auth config and client. Done.
2. Replace `src/shared/api/apiClient.ts` with a token-aware API client. Done.
3. Add login and forgot-password behavior. Done.
4. Add reset-password callback screen. Done.
5. Add protected Home screen with manual patient search. Started.
6. Add small supported-site prompt with Close/Open. Done.
7. Add patient-ID detection for the first approved domain after manager/product approval. Adapter ready; domain-specific detection pending.
8. Wire Patient Details and Vitals to backend data routes. Started with existing Databricks-backed route helpers.
9. Add error handling for `401`, `403`, `404`, and `500`. Started in the API/client UI path.
10. Add tests for auth routing, API client behavior, content-script mounting, and patient-ID detection. Pending.
