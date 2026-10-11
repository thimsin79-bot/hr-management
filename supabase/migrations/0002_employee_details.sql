-- People Desk – Supabase schema (v2)
-- Adds personal detail fields to employees. Safe to re-run.

alter table public.employees
  add column if not exists gender         text not null default '',
  add column if not exists dob            date,
  add column if not exists nationality    text not null default '',
  add column if not exists id_no          text not null default '',
  add column if not exists contact        text not null default '',
  add column if not exists place_of_birth text not null default '',
  add column if not exists address        text not null default '';
