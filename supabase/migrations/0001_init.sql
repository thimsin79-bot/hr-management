-- People Desk – Supabase schema (v1)
-- Run this in: Supabase Dashboard -> SQL Editor -> New query.
-- Creates all tables used by the app and grants the anon role full access
-- (the app authenticates as "anon" and manages its own data like the old
-- localStorage build did).

-- Employees ---------------------------------------------------------------

create table if not exists public.employees (
  id     bigint primary key,
  name   text not null,
  role   text not null default '',
  dept   text not null default '',
  type   text not null default '',
  status text not null default 'Active',
  start  date,
  salary numeric not null default 0,
  email  text
);

alter table public.employees enable row level security;
drop policy if exists "anon all employees" on public.employees;
create policy "anon all employees" on public.employees
  for all using (true) with check (true);

-- Departments (name -> head employee id) ----------------------------------

create table if not exists public.departments (
  name text primary key,
  head bigint
);

alter table public.departments enable row level security;
drop policy if exists "anon all departments" on public.departments;
create policy "anon all departments" on public.departments
  for all using (true) with check (true);

-- Leave requests ----------------------------------------------------------

create table if not exists public.leaves (
  id     bigint primary key,
  emp    bigint not null,
  type   text not null,
  "from" date not null,
  "to"   date not null,
  status text not null default 'Pending'
);

alter table public.leaves enable row level security;
drop policy if exists "anon all leaves" on public.leaves;
create policy "anon all leaves" on public.leaves
  for all using (true) with check (true);

-- Recruitment -------------------------------------------------------------

create table if not exists public.jobs (
  id       bigint primary key,
  title    text not null,
  dept     text not null,
  openings int not null default 1
);

alter table public.jobs enable row level security;
drop policy if exists "anon all jobs" on public.jobs;
create policy "anon all jobs" on public.jobs
  for all using (true) with check (true);

create table if not exists public.stages (
  position int primary key,
  name     text not null
);

alter table public.stages enable row level security;
drop policy if exists "anon all stages" on public.stages;
create policy "anon all stages" on public.stages
  for all using (true) with check (true);

create table if not exists public.candidates (
  id     bigint primary key,
  name   text not null,
  role   text not null,
  stage  text not null,
  source text not null
);

alter table public.candidates enable row level security;
drop policy if exists "anon all candidates" on public.candidates;
create policy "anon all candidates" on public.candidates
  for all using (true) with check (true);

-- Onboarding --------------------------------------------------------------

create table if not exists public.onboarding (
  id    bigint primary key,
  emp   bigint not null,
  tasks jsonb not null default '[]'::jsonb
);

alter table public.onboarding enable row level security;
drop policy if exists "anon all onboarding" on public.onboarding;
create policy "anon all onboarding" on public.onboarding
  for all using (true) with check (true);

-- Attendance --------------------------------------------------------------

create table if not exists public.attendance (
  emp       bigint primary key,
  check_in  text,
  check_out text
);

alter table public.attendance enable row level security;
drop policy if exists "anon all attendance" on public.attendance;
create policy "anon all attendance" on public.attendance
  for all using (true) with check (true);

-- Payroll ---------------------------------------------------------------

create table if not exists public.payroll (
  id     bigint primary key default 1,
  period text not null,
  status text not null default 'Draft'
);

alter table public.payroll enable row level security;
drop policy if exists "anon all payroll" on public.payroll;
create policy "anon all payroll" on public.payroll
  for all using (true) with check (true);

-- Performance -------------------------------------------------------------

create table if not exists public.performance (
  id       bigint generated always as identity primary key,
  emp      bigint not null,
  goal     text not null,
  progress numeric not null default 0,
  rating   numeric not null default 0
);

alter table public.performance enable row level security;
drop policy if exists "anon all performance" on public.performance;
create policy "anon all performance" on public.performance
  for all using (true) with check (true);

-- Training ----------------------------------------------------------------

create table if not exists public.courses (
  id        bigint primary key,
  title     text not null,
  hours     numeric not null,
  mandatory boolean not null default false
);

alter table public.courses enable row level security;
drop policy if exists "anon all courses" on public.courses;
create policy "anon all courses" on public.courses
  for all using (true) with check (true);

create table if not exists public.assignments (
  id       bigint primary key,
  emp      bigint not null,
  course   bigint not null,
  progress numeric not null default 0
);

alter table public.assignments enable row level security;
drop policy if exists "anon all assignments" on public.assignments;
create policy "anon all assignments" on public.assignments
  for all using (true) with check (true);

-- Benefits ----------------------------------------------------------------

create table if not exists public.plans (
  id       bigint primary key,
  name     text not null,
  type     text not null,
  provider text not null,
  cost     numeric not null default 0
);

alter table public.plans enable row level security;
drop policy if exists "anon all plans" on public.plans;
create policy "anon all plans" on public.plans
  for all using (true) with check (true);

create table if not exists public.enrolments (
  emp  bigint not null,
  plan bigint not null,
  primary key (emp, plan)
);

alter table public.enrolments enable row level security;
drop policy if exists "anon all enrolments" on public.enrolments;
create policy "anon all enrolments" on public.enrolments
  for all using (true) with check (true);

-- Documents ---------------------------------------------------------------

create table if not exists public.documents (
  id      bigint primary key,
  name    text not null,
  emp     bigint not null default 0,
  type    text not null,
  updated date,
  status  text not null,
  cand    text
);

alter table public.documents enable row level security;
drop policy if exists "anon all documents" on public.documents;
create policy "anon all documents" on public.documents
  for all using (true) with check (true);

-- Employee relations (cases) ----------------------------------------------

create table if not exists public.cases (
  id     bigint primary key,
  type   text not null,
  emp    bigint not null,
  opened date,
  status text not null default 'Open',
  sev    text not null default 'Medium'
);

alter table public.cases enable row level security;
drop policy if exists "anon all cases" on public.cases;
create policy "anon all cases" on public.cases
  for all using (true) with check (true);

-- Offboarding -------------------------------------------------------------

create table if not exists public.offboarding (
  id     bigint primary key,
  emp    bigint not null,
  last   date,
  reason text not null,
  tasks  jsonb not null default '[]'::jsonb
);

alter table public.offboarding enable row level security;
drop policy if exists "anon all offboarding" on public.offboarding;
create policy "anon all offboarding" on public.offboarding
  for all using (true) with check (true);

-- Notifications -----------------------------------------------------------

create table if not exists public.notes (
  id   bigint primary key,
  text text not null,
  time text not null,
  read boolean not null default false,
  go   text not null
);

alter table public.notes enable row level security;
drop policy if exists "anon all notes" on public.notes;
create policy "anon all notes" on public.notes
  for all using (true) with check (true);

-- Settings (single row) ---------------------------------------------------

create table if not exists public.settings (
  id          bigint primary key default 1,
  company     text not null,
  work_start  text not null,
  grace       int  not null default 15,
  annual_days int  not null default 18,
  deduction   int  not null default 14,
  theme       text not null default 'light'
);

alter table public.settings enable row level security;
drop policy if exists "anon all settings" on public.settings;
create policy "anon all settings" on public.settings
  for all using (true) with check (true);