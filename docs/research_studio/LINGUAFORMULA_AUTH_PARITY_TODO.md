# LinguaFormula → davidlong.tech / Studio — Auth & Admin Parity To-Do

This document summarizes how **LinguaFormula** handles registration, sign-in, account maintenance, admin privileges, and password reset, and lists work to align **davidlong.tech** (Research Studio) with that model so both environments feel the same.

**Reference project (studied):**  
`/Users/davidlong/main_projects/python_projects/linguaformula`

- **Backend:** `backend/linguaformula/app.py`
- **Frontend:** `frontend/src/` (auth, admin, account, forgot/reset)

---

## How LinguaFormula Does It (Summary)

### Database

- **`tbl_user`:** `user_id`, `email`, `password_hash`, `display_name`, `is_admin` (BOOLEAN NOT NULL DEFAULT false), `updated_at` (and `created_at` as applicable).
- **`tbl_password_reset`:** `email`, `token_lookup` (SHA-256 of raw token, unique), `token_hash` (bcrypt of raw token), `expires_at`; one row per active reset request (old rows for same email deleted on new request).

### JWT & session

- JWT payload: **`sub` (user_id), `email`** — **not** `is_admin`. Admin status is always read from the database on each `/api/auth/me` and inside `_require_admin()`.
- Cookie + `Authorization: Bearer` (mobile / cross-origin).
- LinguaFormula stores JWT in **localStorage** and uses a **sessionStorage** flag so closing the tab clears the logical session; davidlong.tech currently uses **sessionStorage** for JWT only — parity is “same behavior,” not necessarily identical storage keys.

### Auth API (Flask)

| Endpoint | Behavior |
|----------|----------|
| `POST /api/auth/register` | email, password, optional display_name; rejects duplicate email; sets cookie + returns `{ user, token }`; new users get `is_admin = false`. |
| `POST /api/auth/login` | Returns user **including `is_admin`** from DB; sets cookie + token. |
| `POST /api/auth/logout` | Clears cookie. |
| `GET /api/auth/me` | Returns `{ user: null }` or full user with **`is_admin`**. |
| `PATCH /api/auth/me` | Authenticated: change **email** (unique check), **display_name**, **password** (`new_password` + `current_password`). |
| `POST /api/auth/forgot-password` | Body `{ email }`; if unknown email, returns generic success-style message (no user enumeration); else inserts reset row, builds `FRONTEND_URL/reset-password?token=...`, emails via SendGrid or logs link if no key. |
| `POST /api/auth/reset-password` | Body `{ token, new_password }`; validates token + expiry; updates `tbl_user.password_hash`; deletes reset row. |

### Admin API

- **`_require_admin()`:** Authenticated + `is_admin` true in DB → else 401/403.
- **`GET /api/admin/users`:** List all users (`id`, `email`, `display_name`, `is_admin`).
- **`PATCH /api/admin/users/<id>`:** Body `{ is_admin: boolean }`; **cannot revoke own admin if sole admin**.

### Frontend patterns

- **`User` type** includes `is_admin?: boolean` from `/api/auth/me`.
- **`/register`**, **`/sign-in`** (link to register + forgot password), **`/forgot-password`**, **`/reset-password?token=`**, **`/account`** (profile + change password via `updateProfile`).
- **`/admin`:** Lists users; toggles admin (calls admin API); redirects non-admins to home.
- **Navigation:** Admin-only links (e.g. Setup, Admin) gated on `user?.is_admin`.
- **Admin-only routes:** `useEffect` + `router.replace` if `!user?.is_admin` (e.g. `/setup`, `/admin`).
- **Forgot/reset:** LinguaFormula uses **Next.js Route Handlers** under `src/app/api/auth/forgot-password` and `reset-password` to proxy to the backend (same-origin from browser → avoids CORS issues for unauthenticated POSTs).

### Email / env (password reset)

- **`SENDGRID_API_KEY`**, optional **`SENDGRID_BCC`**, **`RESET_EMAIL_FROM`**, **`FRONTEND_URL`** (reset link base).
- Without SendGrid, link is **logged** server-side (dev).

---

## davidlong.tech Current State (Gap)

- **`tbl_user`:** No **`is_admin`** column yet (see `migrations/001_add_user_table.sql`).
- **Auth:** Register, login, logout, `GET /api/auth/me` — **no** `is_admin` in responses; **no** `PATCH /api/auth/me`; **no** forgot/reset; **`tbl_password_reset`** may exist in migration `002` — verify and align with LinguaFormula token flow if present.
- **Admin:** No `_require_admin`, no `/api/admin/users` endpoints.
- **Frontend:** `AuthContext` user type has no `is_admin`; no register/forgot/reset/account pages in nav flow comparable to LF; no `/studio/admin` or admin-gated studio areas.

---

## To-Do List (Parity with LinguaFormula)

### A. Database & migrations (davidlong-tech-backend)

1. **Add `is_admin`** to `tbl_user` (BOOLEAN NOT NULL DEFAULT false), matching LinguaFormula’s `add_user_is_admin.sql` pattern.
2. **Seed or document** how the first admin is set. **davidlong.tech:** After `is_admin` exists, set **`is_admin = true`** for the existing user with email **`onareach@yahoo.com`** (same pattern as LinguaFormula’s migration that targeted a specific admin email). Include this in the migration SQL or a documented one-time `UPDATE` for Heroku.
3. **Confirm `tbl_password_reset`** exists and matches LF schema (`token_lookup` unique, `token_hash`, `expires_at`, `email`). If missing or different, add/alter migration to match LF’s reset flow.

### B. Backend — user model & responses

4. **`_user_response` / all auth responses:** Include **`is_admin`** (COALESCE false) everywhere user JSON is returned (register, login, me).
5. **`SELECT` statements** for login and me: Include `is_admin` from `tbl_user`.
6. **`PATCH /api/auth/me`:** Implement same fields as LinguaFormula: `email`, `display_name`, `new_password` + `current_password` (validate current password before change).

### C. Backend — password reset

7. **`POST /api/auth/forgot-password`** — Same contract as LF: email in body, no enumeration, delete prior row for email, store `token_lookup` + `token_hash` + `expires_at`, build reset URL with **`FRONTEND_URL`** (davidlong.tech, not linguaformula.com).
8. **`POST /api/auth/reset-password`** — Validate token, update password, delete reset row.
9. **`_send_password_reset_email`** — Port SendGrid logic (or shared helper pattern); log link when no API key; document env vars in backend README.

### D. Backend — admin

10. **`_require_admin()`** — Mirror LF: JWT → load `is_admin` from DB.
11. **`GET /api/admin/users`** — List users with `is_admin`.
12. **`PATCH /api/admin/users/<id>`** — Set `is_admin`; enforce **sole-admin** rule when revoking self.

### E. Backend — protect sensitive routes (optional but recommended)

13. Decide which existing routes are **admin-only** (e.g. destructive ops, future “site settings”) vs **any authenticated user**. Today, Research Studio is mostly single-user; you may still want **`/api/admin/*`** only for user management and reserve **`_require_admin`** for future studio admin tools.
14. Document in **FEATURE_ADDITIONS** or **ARCHITECTURE** which API routes require admin vs authenticated user.

### F. Frontend — auth client & context

15. **Extend `User` type** with `is_admin?: boolean` (or required boolean after me always returns it).
16. **`login` / `register` / `refetch`:** Persist `is_admin` from API responses.
17. **`updateProfile`:** Add to `AuthContext` (or equivalent) calling `PATCH /api/auth/me` like LinguaFormula’s `AuthContext.tsx`.

### G. Frontend — pages & routes

18. **`/register`** — If not public yet, add page matching LF flow (email, password, display name); link from sign-in.
19. **`/forgot-password`** — Form posting to backend; use **Next.js rewrite/proxy** or **Route Handler** same as LF if browser must call same-origin `/api/...` for CORS.
20. **`/reset-password`** — Read `token` query param; POST to reset endpoint; link to sign-in.
21. **`/account`** (or **`/studio/account`**) — Profile (email, display name) + change password; mirror LF `/account` behavior.
22. **`/studio/admin`** (or **`/admin`**) — User list + toggle admin; redirect non-admins (e.g. to `/studio/today` or `/about`).

### H. Frontend — navigation & access control

23. **Site nav / studio nav:** Show **Admin** (or **Users**) link only when `user?.is_admin`.
24. **Protect admin-only studio routes:** `useEffect` + redirect if not admin (same pattern as LF `setup/page.tsx` and `admin/page.tsx`).
25. **Optional:** Hide or disable **internal** tools (e.g. `/studio/abc`) for non-admins if you want only admins to use them.

### I. Configuration & deploy

26. **Heroku / env:** Set `FRONTEND_URL` (https://davidlong.tech), `SENDGRID_API_KEY`, `RESET_EMAIL_FROM`, optional `SENDGRID_BCC`.
27. **Vercel:** Ensure forgot/reset requests reach the backend (rewrites already proxy `/api/*` — confirm unauthenticated `POST` for forgot-password works through proxy).
28. **CORS:** If forgot-password is called from browser directly to Heroku, CORS must allow it; LF avoids this with Next route handlers — **recommend same pattern for davidlong.tech**.

### J. Documentation & tests

29. Update **`FUNCTIONAL_SPEC_TESTS.md`** with rules: admin-only routes, password reset happy path (mocked).
30. Add **Playwright** tests: sign-in shows forgot link; admin page redirects non-admin; optional mocked forgot-password.
31. Update **`SESSION_HANDOFF.md`** / **`00_RESEARCH_STUDIO_SPEC.md`** with admin + account maintenance expectations.

### K. Intentional differences (document)

32. **JWT storage:** LF uses localStorage + session flag; davidlong uses sessionStorage for JWT — **document** that both achieve “tab close signs out” for davidlong; no need to copy localStorage unless you want identical implementation.
33. **Cookie name:** `davidlong_tech_token` vs LinguaFormula’s cookie — fine; document in parity doc.
34. **Scope of admin UI:** LinguaFormula admin covers formulas/courses; davidlong admin may **only** be user/privilege management at first — that’s OK if documented.

---

## Quick Reference — LinguaFormula Files

| Area | Path |
|------|------|
| Auth + admin + reset | `backend/linguaformula/app.py` (search `_require_admin`, `auth_forgot`, `admin_list_users`) |
| `is_admin` migration | `backend/linguaformula/migrations/add_user_is_admin.sql` |
| Password reset table | `backend/linguaformula/migrations/add_password_reset_table.sql` |
| Auth context | `frontend/src/context/AuthContext.tsx` |
| Auth client | `frontend/src/lib/authClient.ts` |
| Admin UI | `frontend/src/app/admin/page.tsx` |
| Account | `frontend/src/app/account/page.tsx` |
| Forgot / reset pages | `frontend/src/app/forgot-password/page.tsx`, `reset-password/page.tsx` |
| API proxies | `frontend/src/app/api/auth/forgot-password/route.ts`, `reset-password/route.ts` |

---

## Suggested implementation order

1. Migration: `is_admin` + verify password_reset table.  
2. Backend: `_user_response` + login/me with `is_admin`; `PATCH /me`.  
3. Backend: forgot-password + reset-password + email helper.  
4. Backend: `_require_admin` + admin user list + patch.  
5. Frontend: User type + `updateProfile` + `/account`.  
6. Frontend: `/forgot-password`, `/reset-password` + Next proxies if needed.  
7. Frontend: `/studio/admin` + nav gating + route guards.  
8. Env, docs, E2E.

When this list is complete, account and privilege structure for **davidlong.tech/studio** should closely match **linguaformula.com** without reinventing divergent patterns.
