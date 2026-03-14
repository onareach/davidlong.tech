# Session handoff — read this when starting a new session

**Last updated:** March 13, 2026

This file is the main “breadcrumb” for resuming work. It tells you where the project is in the plan and which documents to read first.

---

## Where we are in the development plan

- **Overall plan:** `docs/FLIGHT_PLAN.md` (Phases 1–3).
- **Current phase:** **Phase 3 (Core loop).**
- **Done so far:**
  - **Phase 1 & 2:** Backend on Heroku, auth, Postgres schema, sign-in, studio shell, protected routes, API proxy. ✅
  - **Phase 3, Step 10:** Today’s flow (prompt engine / fallback prompts, writing editor with autosave, CRUD for entries). ✅  
  - **Extra:** “Edit for clarity” (AI light edit) on entries; Entries page with list, filters, editor, branch/mystery/status, incomplete indicators. ✅  
  - **Internal tool:** “ABCs of AI” playground at `/studio/abc` (no nav link)—test prompts, model, persona, and params. ✅
- **Not yet done (from FLIGHT_PLAN / spec):** Deeper AI reflection, continuity-driven prompts from prior writing, synthesis, branches/mysteries as first-class flows, publication path. See `docs/00_RESEARCH_STUDIO_SPEC.md` for full product vision.

---

## Two repos (don’t forget)

| Repo | Path | Production |
|------|------|------------|
| **Frontend** | `davidlong.tech/` (this repo) | Vercel |
| **Backend** | `davidlong-tech-backend/` (sibling directory) | Heroku |

Git, commit, and push are **per repo**. See `docs/COMMIT_AND_PUSH.md` for deploy steps (backend first, then frontend).

---

## Documents to read when restarting (in order)

1. **This file** — `SESSION_HANDOFF.md` (you are here).
2. **Latest dev log** — `DEV_LOG_2026-03-13.md` for the most recent work (AI params doc, ABCs playground, nav change). Older: `DEV_LOG_2026-03-10.md` (portfolio, Research Studio backend, auth, Phase 3 deploy).
3. **Roadmap** — `docs/FLIGHT_PLAN.md` for phases and steps.
4. **Product spec** — `docs/00_RESEARCH_STUDIO_SPEC.md` for purpose, core loop, design principles, and MVP scope.
5. **Deploy** — `docs/COMMIT_AND_PUSH.md` when you need to commit and push to production.
6. **Backend AI** — `docs/BACKEND_AI_PARAMETERS.md` for what the backend sends to the AI (light-edit and ABC playground).
7. **Architecture** — `docs/research_studio/ARCHITECTURE.md` and schema in `docs/research_studio/schema/` when touching data or APIs.
8. **Tests** — `docs/research_studio/FUNCTIONAL_SPEC_TESTS.md` maps spec to E2E tests; run `npm run test:e2e` from frontend repo.

---

## Quick local setup reminder

- **Frontend:** From `davidlong.tech/`: `cp .env.example .env.local` then `npm run dev`.
- **Backend:** From `davidlong-tech-backend/`: create `.env` (see backend README), run `python app.py` (or `./run.sh`). Backend uses port 5000; frontend `NEXT_PUBLIC_API_URL` in `.env.local` can point to `http://localhost:5000` to hit local backend.
- **ABCs page:** Direct URL `/studio/abc` (no nav link). Requires sign-in.

---

## If the next session is about…

- **Continuing the core loop / AI** → Read spec (00_RESEARCH_STUDIO_SPEC), FLIGHT_PLAN, BACKEND_AI_PARAMETERS; consider ROLE_OF_THE_ENTRIES_PAGE if focusing on entries.
- **Deploying** → COMMIT_AND_PUSH; run git from inside each repo.
- **Understanding what’s built** → DEV_LOG_2026-03-13, then FLIGHT_PLAN and 00_RESEARCH_STUDIO_SPEC.
- **Fixing or extending ABCs / AI params** → BACKEND_AI_PARAMETERS, `app/studio/abc/page.tsx`, backend `app.py` route `POST /api/abc`.

---

## Dev log index

| Date | File | Summary |
|------|------|--------|
| Mar 10 | `DEV_LOG_2026-03-10.md` | Portfolio site, Node 18, Tailwind v3, Git/Vercel/DNS; Research Studio backend + auth; studio nav, E2E tests; Phase 3 deploy (Today flow, entries). |
| Mar 13 | `DEV_LOG_2026-03-13.md` | BACKEND_AI_PARAMETERS doc; ABCs of AI playground; production deploy of light-edit/entries; ABCs nav removed; persona in request body. |
