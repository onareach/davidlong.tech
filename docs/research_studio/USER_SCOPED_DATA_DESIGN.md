# User-discrete studio data (entries, branches, mysteries)

## Current state: entries

**Research entries are already scoped per user** in the API (`davidlong-tech-backend/app.py`):

- List, create, today, get-by-id, patch, and light-edit all use **`WHERE ... user_id = %s`** with the authenticated user’s id from the JWT.
- New entries are inserted with **`user_id = claims["user_id"]`**.

So **another user logging in does not see your entries** through the normal app API, as long as every code path keeps that filter. If anything ever looked like “everyone sees everything,” it was likely a single shared test account, cached UI, or a bug to audit—not intentional global listing.

**Spec rule:** Any new entry-related endpoint must include **`AND user_id = %s`** (or equivalent) and never return another user’s rows.

---

## Gap: branches and mysteries (global today)

**`tbl_research_branches`** and **`tbl_research_mysteries`** have **no `user_id`**. Seed data is **shared**: every user sees the same catalog and any **Add branch / Add mystery** creates rows **visible to everyone**.

To make branches and mysteries **maintainable per user** without duplicating the whole schema:

### Recommended model: optional `user_id` (catalog + private rows)

Add to each table:

- **`user_id BIGINT NULL REFERENCES tbl_user(user_id) ON DELETE CASCADE`**
- **Semantics:**
  - **`user_id IS NULL`** — **System / catalog** row (seeded defaults, or admin-inserted). Read-only for normal users in UI, or editable only by admins if you add that later.
  - **`user_id = N`** — **Owned by user N**. Only that user should see it in lists and be allowed to update/delete it (except admin override, optional).

**List API (efficient):**

```sql
SELECT ... FROM tbl_research_branches
WHERE user_id IS NULL OR user_id = %s
ORDER BY research_branch_name;
```

Same pattern for mysteries. One index: **`(user_id)`** or composite **`(user_id, research_branch_name)`** if needed for large catalogs.

**Create API:** Always set **`user_id = claims["user_id"]`** for user-created branches/mysteries (never NULL for user-created rows).

**Assign to entries:** Existing FKs on **`tbl_research_entries`** stay as they are; entries only reference branch/mystery ids the user is allowed to see, so dropdowns are naturally limited to the union of catalog + own rows.

**Migration:**

1. `ALTER TABLE ... ADD COLUMN user_id BIGINT NULL REFERENCES tbl_user(user_id) ON DELETE CASCADE;`
2. `UPDATE tbl_research_branches SET user_id = NULL WHERE ...` (all existing rows become catalog).
3. Optional: **copy catalog into per-user rows** for power users who want to edit names without touching global rows—usually **not** needed if catalog stays read-only and users use “Add branch” for custom ones.

**Why this is efficient**

- One table per entity (no parallel `tbl_user_branches` unless you outgrow this).
- Simple queries with one `WHERE (user_id IS NULL OR user_id = %s)`.
- Handles **shared defaults** + **private extensions** the way many multi-tenant apps handle “system templates.”

---

## Optional later: prompts

**`tbl_research_prompts`** is currently global. If you later want user-private prompts, the same **`user_id NULL | N`** pattern applies; out of scope unless you need it.

---

## Admin account seed

When **`is_admin`** is added (see `LINGUAFORMULA_AUTH_PARITY_TODO.md`), the migration or one-time SQL should set:

- **`is_admin = true`** for **`onareach@yahoo.com`** (the row must exist in `tbl_user`).

Document in the migration comment so production Heroku runs match local intent.
