# People Desk – HR Management

A self-contained HR management dashboard built with **Next.js (App Router) + TypeScript**.
Everything (employees, onboarding, payroll, leave, training, benefits, cases, offboarding) runs
client-side. Data is persisted to **Supabase** when configured, and otherwise falls back to
`localStorage` so the app works offline out of the box.

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

## Getting started

Requires Node.js 18.17+.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
```

## Project structure

```
app/                 App Router pages and root layout
  [slug]/page.tsx    one page per section (renders the matching feature component)
  layout.tsx         shell: sidebar, topbar, providers, theme, fonts
  globals.css        all styling (design tokens, dark mode)
components/
  features/          17 section views (one component per feature)
  layout/            Sidebar, Topbar, Shell
  providers/         AppProvider: store, persist, toast, modals, forms
  ui/                shared primitives (avatar, pill, progress, bars)
lib/
  constants.ts       nav, icons, departments, days-off defaults
  db.ts              Supabase load/persist (maps app state <-> tables)
  seed.ts            sample data restored by "Reset sample data"
  supabase.ts        Supabase client (null when env vars are absent)
  types.ts           data model (employees, leave, payroll, …)
  utils.ts           money/date/working-day helpers
supabase/
  migrations/        SQL schema + RLS policies to run in Supabase
```

## How data works

State lives in a single object. On load it tries Supabase first (when configured),
then falls back to `localStorage` (key `peopledesk_v2`), then the sample dataset.
Writes are mirrored to `localStorage` and, when connected, synced to Supabase by
diffing changed sections and writing them back.

`Settings → Reset sample data` restores the sample set.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/migrations/0001_init.sql` (creates tables + policies).
3. Copy `.env.example` to `.env.local` and fill in your values from **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
   ```

4. Restart `npm run dev`. The sample data is pushed to Supabase on first run; the
   **Settings** page shows whether the cloud database is connected.

The schema enables Row Level Security with open `anon` policies so the client can read
and write. Tighten these policies (or add Supabase Auth) before using real data.

## Legacy single-file app

The original no-dependency prototype is still at `hr-management.html` (from before
the Next.js migration). The Next.js app is now the active implementation; the
`index.html`/`api/vercel.js`/`vercel.json`/`deploy.md` files are leftovers from that
prototype deployment and can be deleted once you are happy with the migration.

## Deploying

The project is a standard Next.js app and deploys directly to Vercel: push the repo
to GitHub, import it, and Vercel will run `next build` on every push.