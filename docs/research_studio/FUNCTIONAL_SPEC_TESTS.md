# Functional Spec Tests

This document maps functional rules from the Research Studio spec documents to automated tests. As we add features, we add tests to keep the app technically sound and true to these rules.

**Sources:** `00_RESEARCH_STUDIO_SPEC.md`, `ARCHITECTURE.md`, `The Core Idea.md`

---

## Rules Enshrined in Tests

### 1. Site Integration — Public vs Private Navigation

**Spec (00_RESEARCH_STUDIO_SPEC.md):** *"The private studio should not appear in the public navigation."*

| Rule | Test |
|------|------|
| When logged out, nav shows: About, Teaching Philosophy, Teaching with Technology Example, Sign in | `e2e/nav.spec.ts` |
| When logged out, nav does NOT show: Today, Entries, Branches, Mysteries | `e2e/nav.spec.ts` |
| When logged in, nav shows: Today, Entries, Branches, Mysteries, Sign out | `e2e/nav.spec.ts` |
| When logged in, nav does NOT show: About, Teaching Philosophy, Teaching with Technology Example | `e2e/nav.spec.ts` |

### 2. Authentication — Studio Routes Protected

**Spec (ARCHITECTURE.md):** *"Routes beginning with /studio must be protected."*

| Rule | Test |
|------|------|
| Unauthenticated access to /studio redirects to sign-in | `e2e/auth.spec.ts` |
| Unauthenticated access to /studio/today redirects to sign-in | `e2e/auth.spec.ts` |
| Unauthenticated access to /studio/entries redirects to sign-in | `e2e/auth.spec.ts` |
| Unauthenticated access to /studio/branches redirects to sign-in | `e2e/auth.spec.ts` |
| Unauthenticated access to /studio/mysteries redirects to sign-in | `e2e/auth.spec.ts` |

### 3. MVP Routes Exist

**Spec (00_RESEARCH_STUDIO_SPEC.md):** *"MVP Routes: /studio/today, /studio/entries, /studio/entries/[id], /studio/branches, /studio/mysteries"*

| Rule | Test |
|------|------|
| /studio/today renders when authenticated | `e2e/routes.spec.ts` |
| /studio/entries renders when authenticated | `e2e/routes.spec.ts` |
| /studio/branches renders when authenticated | `e2e/routes.spec.ts` |
| /studio/mysteries renders when authenticated | `e2e/routes.spec.ts` |

### 4. Public Routes Accessible

**Spec (00_RESEARCH_STUDIO_SPEC.md):** *"Public Site Routes: /, about, research, projects, writing, teaching/..."*

| Rule | Test |
|------|------|
| / redirects to /about | `e2e/routes.spec.ts` |
| /about is accessible | `e2e/routes.spec.ts` |
| /philosophy (teaching) is accessible | `e2e/routes.spec.ts` |
| /implementation (teaching) is accessible | `e2e/routes.spec.ts` |

### 5. Studio Default and Redirects

**Spec (ARCHITECTURE.md):** *"Primary route: /studio/today"*

| Rule | Test |
|------|------|
| /studio redirects to /studio/today when authenticated | `e2e/routes.spec.ts` |

### 6. Sign Out Returns to Public Site

**Spec (implied):** Sign out should return user to public landing.

| Rule | Test |
|------|------|
| After sign out, user sees public nav (About, Sign in) | `e2e/auth.spec.ts` |

### 7. Today Page: Prompt Controls and New Prompt

**Spec / design (FEATURE_ADDITIONS.md):** Today page must support replacing the prompt, editing the current prompt, and starting a new prompt so the user can write on more than one topic per day. The prompt shown must be the one that generated the current entry when an entry exists.

| Rule | Test |
|------|------|
| Today page shows “Today’s prompt” section when prompt is loaded | `e2e/today-entries.spec.ts` |
| Today page has “Replace prompt” link under the prompt | `e2e/today-entries.spec.ts` |
| Today page has “Edit” link under the prompt | `e2e/today-entries.spec.ts` |
| Today page has “New prompt” link next to the Today heading | `e2e/today-entries.spec.ts` |

### 8. Entries Page: Add Branch / Add Mystery

**Spec / design (FEATURE_ADDITIONS.md):** When an entry is selected, the user can add a new branch or mystery from the editor so the database does not record a wrong prompt–entry link and so branches/mysteries can be created in context.

| Rule | Test |
|------|------|
| Entries page shows “Add branch” when an entry is selected | `e2e/today-entries.spec.ts` |
| Entries page shows “Add mystery” when an entry is selected | `e2e/today-entries.spec.ts` |

---

## Running Tests

```bash
# E2E tests (Playwright starts dev server automatically)
npm test
# or
npm run test:e2e

# E2E with UI (interactive debugging)
npm run test:e2e:ui
```

Tests mock `/api/auth/me` and `/api/auth/logout`. Today/Entries feature tests also mock `/api/entries/today`, `/api/entries`, `/api/branches`, `/api/mysteries` as needed — no backend required.

**Note:** If port 3000 is in use, run `PLAYWRIGHT_PORT=3002 npm test` (and ensure dev server is on 3002, or let Playwright start it).

---

## Adding New Rules

When adding features from the spec:

1. **Record the feature** in `docs/research_studio/FEATURE_ADDITIONS.md` (what was added and why).
2. Add the rule to this document with its spec source (and reference FEATURE_ADDITIONS when the rule comes from a new feature).
3. Add or extend the corresponding test (e.g. in `e2e/` with API mocks as needed).
4. Ensure `npm test` passes before merging.
