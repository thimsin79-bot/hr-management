-- People Desk – Supabase schema (v3)
-- Adds a qualification field to employees. Safe to re-run.

alter table public.employees
  add column if not exists qualification text not null default '';
