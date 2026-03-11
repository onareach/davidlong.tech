# GitHub + Vercel setup

Local git is already initialized with commits. Follow these steps to push to GitHub and get automatic deploys on Vercel.

---

## 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Set **Repository name** (e.g. `davidlong.tech` or `portfolio`).
3. Choose **Public**.
4. Do **not** add a README, .gitignore, or license (this project already has them).
5. Click **Create repository**.

---

## 2. Connect local repo and push

In your project directory, run (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 3. Connect Vercel for automatic deploys

1. Go to [vercel.com](https://vercel.com) and sign in (use **Continue with GitHub** if you have a GitHub account).
2. Click **Add New…** → **Project**.
3. **Import** the GitHub repository you just pushed (e.g. `davidlong.tech` or `portfolio`).
4. Leave the defaults (Framework: Next.js, Root Directory: `./`, Build Command: `next build`, etc.).
5. Click **Deploy**.

After this, every push to `main` will trigger a new Vercel deployment.

---

## 4. (Optional) Custom domain

To use **davidlong.tech**:

1. In the Vercel project, go to **Settings** → **Domains**.
2. Add `davidlong.tech` (and optionally `www.davidlong.tech`).
3. In GoDaddy (or your DNS provider), add the records Vercel shows (usually an A record and/or CNAME). Details are in the plan: `00_PORTFOLIO_SITE_PLAN.md` → “Domain connection plan”.
