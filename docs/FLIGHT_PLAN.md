# Research Studio — Flight Plan

High-level implementation roadmap for integrating Research Studio into davidlong.tech.

---

## Phase 1: Backend Foundation

### Step 1. Create the backend repo
- Create new directory `davidlong-tech-backend` (sibling to `davidlong.tech`)
- Initialize git, connect to GitHub, add Heroku remote

### Step 2. Set up minimal Flask app
- Copy minimal structure from Lingua Formula: `app.py`, `Procfile`, `requirements.txt`
- Include: Flask, CORS, psycopg2, bcrypt, PyJWT
- Add health check route (e.g. `GET /api/health`)

### Step 3. Add auth tables + Research Studio schema
- Create migrations for:
  - `tbl_user` (email, password_hash, display_name)
  - `tbl_password_reset` (optional for MVP)
  - Research Studio tables from `docs/research_studio/schema/research_studio_schema.sql`
- Add `user_id` to `tbl_research_entries` (or skip for single-user MVP)
- Run seed data for branches and mysteries

### Step 4. Implement auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Step 5. Deploy backend to Heroku
- Provision Heroku Postgres
- Run migrations
- Seed a user for yourself
- Set `JWT_SECRET`, `CORS_ORIGINS`, `DATABASE_URL`

---

## Phase 2: Frontend Integration

### Step 6. Add Sign in / auth UI
- Add "Sign in" link to nav
- Create sign-in page (email + password form)
- Create auth client (login, logout, token storage, `authFetch`)
- Add auth context or state for "logged in" vs "logged out"

### Step 7. Configure API proxy
- Add `vercel.json` with rewrites: `/api/*` → Heroku backend URL
- Set `NEXT_PUBLIC_API_URL` for local dev

### Step 8. Protect studio routes
- Add middleware or route guards so `/studio/*` requires auth
- Redirect unauthenticated users to sign-in

### Step 9. Build studio shell
- Layout for authenticated users with nav: Today, Entries, Branches, Mysteries
- `/studio/today` as placeholder page
- Redirect after sign-in to `/studio/today`

---

## Phase 3: Core Loop

### Step 10. Implement today's flow
- Prompt engine (or placeholder prompt)
- Writing editor with autosave
- CRUD for entries via backend API
- AI reflection (optional for MVP)

---

## Architecture Summary

| Component | Location | Production |
|-----------|----------|------------|
| Frontend | `davidlong.tech/` | Vercel |
| Backend | `davidlong-tech-backend/` | Heroku |
| Database | Heroku Postgres | Heroku Postgres |
| Auth | Email + password in Postgres | JWT (cookie + Bearer) |

---

## Reference

- Lingua Formula: `/main_projects/python_projects/linguaformula` (architecture model)
- Research Studio spec: `docs/00_RESEARCH_STUDIO_SPEC.md`
- Schema: `docs/research_studio/schema/`
