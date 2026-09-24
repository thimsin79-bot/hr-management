# People Desk – HR Management

A self-contained HR management dashboard in a single HTML file. Everything (employees, onboarding, payroll, leave, training, benefits, cases, offboarding) runs client-side with data persisted in `localStorage`. No build step, no dependencies.

## Features

- **Dashboard** – attention queue, headcount by department, coming up
- **Employees** – searchable directory, add/view employees, start offboarding
- **Organization** – departments, heads and members
- **Recruitment** – job openings and a kanban candidate pipeline
- **Onboarding** – per-employee task checklists
- **Attendance** – clock in/out, late detection with grace period
- **Leave** – requests with approve/decline workflow
- **Payroll** – monthly run with deductions
- **Performance** – goals, progress and ratings
- **Training** – courses and assignments
- **Benefits** – plans and enrolments
- **Documents** – contract/offer/policy records
- **Employee Relations** – cases with priorities
- **Offboarding** – exit checklists
- **Reports** – headcount, leave, pay and sourcing charts
- **Notifications** – unread feed
- **Settings** – company name, times, theme (system/light/dark)

## Running locally

Open `hr-management.html` directly in a browser, or serve it:

```bash
npx serve .
```

## Deploying

The app deploys to Vercel as a serverless function that serves the HTML file.

- `vercel.js` – the serverless function entry point
- `vercel.json` – routes all traffic to the function

### With the Vercel CLI

```bash
npm i -g vercel
vercel          # link and preview deploy
vercel --prod   # production deploy
```

### Auto-deploy from GitHub

1. Push this repo to GitHub.
2. In the Vercel dashboard, **Add New Project** → import the GitHub repo.
3. Vercel builds and deploys on every push to the default branch.

See [deploy.md](deploy.md) for the full walkthrough.