# Deployment Guide

This document walks through getting **People Desk** (an HR management app in a single `hr-management.html`) live on Vercel.
```
index.html           root entry that opens the dashboard
hr-management.html   the whole app (HTML/CSS/JS, data in localStorage)
```

Because there is no build step or backend requirement, Vercel serves the static files directly. The root `index.html` redirects to `hr-management.html` so the project URL does not produce a 404.
Because there is no build step and no backend API, deployment is trivial. `api/vercel.js` reads `hr-management.html` and returns it; `vercel.json` maps all routes to that function.

> Note: Vercel only auto-detects serverless functions inside `/api`. Older versions of this repo placed the function at the root, which produced a 404 — keep it in `api/`.

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account
- (Optional) [Git](https://git-scm.com)

## 1. Local run (verify before deploying)

```bash
npx serve .
```

Open `http://localhost:3000/`. All data is stored in the browser's `localStorage` under the key `peopledesk_v2`, so nothing needs a server.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/hr-management.git
git push -u origin main
```

## 3. Deploy with the Vercel CLI

Install the CLI once:

```bash
npm i -g vercel
```

Link and deploy:

```bash
vercel            # first run: log in, link the project, preview
vercel --prod     # deploy to production
```

On first run `vercel` will:

1. Ask you to log in (opens a browser / shows a device code).
2. Ask to link to an existing project or create a new one.
3. Print a preview URL. `vercel --prod` then prints the production URL.

The output is committed to `.vercel/` locally, which is ignored by git.

## 4. Auto-deploy from GitHub (recommended)

1. Log in to the Vercel dashboard → **Add New Project**.
2. Import the `hr-management` GitHub repo.
3. Accept the defaults (Framework Preset: **Other**, Build Command: none, Output Directory: none). Vercel serves the static files automatically.
4. Click **Deploy**.

From then on, every push to the default branch triggers an automatic production deployment. Preview deployments are created for each pull request.

## Rollback

In the dashboard: **Deployments** → open the ellipsis menu on a deployment → **Promote to Production**.

## Useful commands

```bash
vercel dev       # run locally with the serverless function
vercel --prod    # deploy to production
vercel ls        # list deployments
vercel alias     # manage custom domains
```

## Custom domains

In the dashboard: your project → **Settings** → **Domains** → add your domain and update DNS per the Vercel instructions.