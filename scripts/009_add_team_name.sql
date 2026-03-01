-- Add team_name column to profiles
alter table public.profiles
add column if not exists team_name text;
