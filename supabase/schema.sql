-- A Day in Croatia — optional Supabase schema.
-- Run in the Supabase SQL editor, then set VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY in Netlify (Site settings → Environment variables).

create table if not exists public.daily_results (
  id            bigint generated always as identity primary key,
  player_id     text        not null,
  date_key      date        not null,
  puzzle_number integer     not null,
  challenge_id  text        not null,
  plan          jsonb       not null,
  total         smallint    not null check (total between 0 and 100),
  components    jsonb       not null,
  created_at    timestamptz not null default now(),
  unique (player_id, date_key)
);

alter table public.daily_results enable row level security;

-- Anonymous players may insert their own result; nobody can read raw rows.
create policy "anon can insert results"
  on public.daily_results for insert
  to anon
  with check (true);

-- Aggregated, anonymous distribution in 10-point buckets.
create or replace view public.daily_distribution
with (security_invoker = false) as
  select date_key,
         least(width_bucket(total, 0, 100, 10) - 1, 9) * 10 as bucket,
         count(*)::int as players
    from public.daily_results
   group by date_key, bucket;

grant select on public.daily_distribution to anon;
