-- People Desk – Supabase schema (v4)
-- Adds a users (app accounts) table. Safe to re-run.

create table if not exists public.users (
  id      bigint primary key,
  name    text not null,
  email   text not null default '',
  role    text not null default 'Employee',
  status  text not null default 'Active',
  created date
);

alter table public.users enable row level security;
drop policy if exists "anon all users" on public.users;
create policy "anon all users" on public.users
  for all using (true) with check (true);
