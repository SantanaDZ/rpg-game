-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  email text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
-- Allow anyone to read profiles (needed for username lookup during login)
create policy "profiles_select_all" on public.profiles
  for select using (true);

-- Allow users to update their own profile
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Function to handle profile creation on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, team_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'team_name'
  );
  return new;
end;
$$;

-- Trigger for auto-creating profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger for auto-updating updated_at (using the function from 001_create_characters.sql)
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- Backfill existing users
insert into public.profiles (id, username, email)
select id, split_part(email, '@', 1), email from auth.users
on conflict (id) do nothing;

-- Set "adm" for the first user or a specific user if known. 
-- Since I don't know the ID of the existing user, I'll set it for the one with the earliest created_at or just "adm" if there's only one.
-- Let's try to set it for the oldest account.
update public.profiles
set username = 'adm'
where id = (select id from auth.users order by created_at asc limit 1);
