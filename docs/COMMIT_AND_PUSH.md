# Commit and Push Procedures

davidlong.tech and Research Studio use **two separate Git repositories**:

| Repo | Path | Remote | Production |
|------|------|--------|------------|
| **Backend** | `davidlong-tech-backend/` | `origin` → GitHub, `heroku` → Heroku | Heroku (davidlong-tech-backend) |
| **Frontend** | `davidlong.tech/` | `origin` → GitHub | Vercel (auto-deploys from GitHub) |

---

## Before You Begin

*The backend is a sibling directory to the frontend (e.g. both under `research_studio/`).*

**Important:** The parent folder `research_studio/` is *not* a git repo. Git commands must be run from inside each repo (`davidlong-tech-backend/` or `davidlong.tech/`). Running `git status` from `research_studio/` will fail with "not a git repository."

1. **Check for changes** in each repo (run from `research_studio/` or use full paths):
   ```bash
   cd davidlong-tech-backend && git status
   cd ../davidlong.tech && git status
   ```
2. Deploy only repos that have changes (modified or untracked files you intend to commit).
3. **Commit message:** Review the diff and write a descriptive message that summarizes what changed.
4. **Order:** If both repos have changes, deploy **backend first**, then frontend.
5. **Database migrations:** Run migrations on Heroku only when this deploy adds new migration or seed scripts.

---

## Repository Locations

```
research_studio/
├── davidlong-tech-backend/    ← Backend repo (.git here)
│   ├── app.py
│   ├── migrations/
│   ├── scripts/
│   └── ...
└── davidlong.tech/            ← Frontend repo (.git here)
    ├── app/
    ├── components/
    └── ...
```

---

## Standard Deploy Procedure

### 1. Backend (API + database logic)

```bash
cd davidlong-tech-backend

# Stage and commit (use selective paths if you have untracked files you don't want)
git add -A
# Or: git add path/to/file1 path/to/file2
git status                    # Review changes
git commit -m "Descriptive message summarizing changes"

# Push to GitHub (backup, history)
git push origin main

# Push to Heroku (production deploy)
git push heroku main
```

**Note:** Heroku builds and deploys when you push. Check logs: `heroku logs --tail -a davidlong-tech-backend`

#### Running Heroku updates (push and migrations)

`git push heroku main` and `heroku run ...` require the Heroku CLI to be **logged in** on the machine where you run them (e.g. your laptop). In environments where Heroku can't prompt for login (CI, some editors), run these steps locally:

1. **Log in to Heroku** (if needed):
   ```bash
   heroku login
   ```
   Or for non-browser auth: `heroku login -i` and use your API key.

2. **Push the backend to Heroku** (from the backend repo):
   ```bash
   cd davidlong-tech-backend
   git push heroku main
   ```
   Wait for the build and deploy to finish.

3. **Run any new migrations** for this deploy (see [Database Migrations (Backend)](#database-migrations-backend)). Example:
   ```bash
   heroku run "psql \$DATABASE_URL -f migrations/001_add_user_table.sql" -a davidlong-tech-backend
   ```

4. **(Optional)** Confirm the app and data:
   ```bash
   heroku open -a davidlong-tech-backend
   heroku run "psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM tbl_user;'" -a davidlong-tech-backend
   ```

### 2. Frontend (Next.js app)

```bash
cd davidlong.tech

# Stage and commit
git add -A
git status                    # Review changes
git commit -m "Descriptive message summarizing changes"

# Push to GitHub (triggers Vercel auto-deploy)
git push origin main
```

**Note:** Vercel deploys automatically when you push to `main`. No separate deploy step.

---

## Quick Reference

| Action | Backend | Frontend |
|--------|---------|----------|
| **Commit** | `cd davidlong-tech-backend && git add -A && git commit -m "msg"` | `cd davidlong.tech && git add -A && git commit -m "msg"` |
| **Push to GitHub** | `git push origin main` | `git push origin main` |
| **Push to production** | `git push heroku main` | (automatic via Vercel) |

---

## Database Migrations (Backend)

### Local development (dev_user / dev123)

Run migrations on the local database as the dev user:

```bash
cd davidlong-tech-backend
PGPASSWORD=dev123 psql -d davidlong_tech -U dev_user -h localhost -f migrations/<migration_file.sql>
```

Or use the run script:

```bash
./scripts/run_migrations.sh
```

### Heroku (production)

Run migrations on Heroku **only when this deploy adds new migration or seed scripts**. Execute **after** the backend deploy completes:

```bash
# Run SQL migrations as needed for this deploy
# (replace <migration_file.sql> with each required file, in order)
heroku run "psql \$DATABASE_URL -f migrations/<migration_file.sql>" -a davidlong-tech-backend

# Run Python migration/seed scripts only when required by the deploy
heroku run "python scripts/<script_name>.py" -a davidlong-tech-backend
```

**Note:** Heroku Eco plan allows only one dyno at a time. If migrations 003 and 004 need to run, combine them:
```bash
heroku run "psql \$DATABASE_URL -f migrations/003_add_research_studio_schema.sql && psql \$DATABASE_URL -f migrations/004_seed_research_studio.sql" -a davidlong-tech-backend
```

### Initial Research Studio migrations (already run)

The initial schema consists of:
- `001_add_user_table.sql`
- `002_add_password_reset_table.sql`
- `003_add_research_studio_schema.sql`
- `004_seed_research_studio.sql`

---

## Remotes

**Backend:**
- `origin` → https://github.com/onareach/davidlong-tech-backend.git
- `heroku` → https://git.heroku.com/davidlong-tech-backend.git

**Frontend:**
- `origin` → https://github.com/onareach/davidlong.tech.git

---

## Troubleshooting

**"fatal: not a git repository"**
- You're in the wrong directory. The parent `research_studio/` has no `.git`. Run git commands from inside `davidlong-tech-backend/` or `davidlong.tech/`.

**Backend not updating on Heroku**
- Ensure you're in `davidlong-tech-backend/` (where `.git` lives)
- Run `git push heroku main` (not `origin`)

**Frontend not updating**
- Vercel deploys from GitHub; push to `origin main` first
- Check Vercel dashboard for build status

**Push did not trigger Vercel build**
1. **Production branch:** In Vercel → Project → **Settings** → **Git** → **Production Branch**. It must be `main` (or whatever branch you push). If it was set to `master` or something else, change it to `main` and save.
2. **Confirm the push reached GitHub:** Open `https://github.com/onareach/davidlong.tech` and check that the latest commit is on `main`.
3. **Trigger a deploy manually:** In Vercel → Project → **Deployments** → click the **⋯** on the latest deployment → **Redeploy**. Or go to **Deployments** → **Create Deployment** and choose branch `main`.
4. **Reconnect Git:** If builds used to work and stopped, in Vercel → **Settings** → **Git** try **Disconnect** then **Connect Git Repository** again (re-select the repo and grant access). Then push again or use **Redeploy**.

**Both repos changed**
- Commit and push each repo separately (they are independent)
- Deploy backend first, then frontend

---

## Tips

**Selective staging when there are untracked files**  
If a repo has many untracked files (e.g. local scripts, backups, one-off migrations) that you do *not* want to commit, use `git add <path>` for only the files you intend to deploy instead of `git add -A`. Example: `git add app.py` or `git add app/sign-in/page.tsx`. Run `git status` before committing to confirm the staged set.

**After pushing**  
Update the day's `DEV_LOG_YYYY-MM-DD.md` with the commit hashes and push targets (e.g. `f709a3e` backend to Heroku, `7d53fbd` frontend to origin/main) so the log reflects what actually reached production.
