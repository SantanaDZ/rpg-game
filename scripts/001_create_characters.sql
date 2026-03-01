-- Create characters table
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  strength integer not null default 5 check (strength >= 1 and strength <= 10),
  intelligence integer not null default 5 check (intelligence >= 1 and intelligence <= 10),
  agility integer not null default 5 check (agility >= 1 and agility <= 10),
  endurance integer not null default 5 check (endurance >= 1 and endurance <= 10),
  charisma integer not null default 5 check (charisma >= 1 and charisma <= 10),
  skin_color text not null default '#c8a27a',
  hair_color text not null default '#2c1b0e',
  hair_style text not null default 'curto',
  eye_color text not null default '#4a3728',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.characters enable row level security;

-- RLS Policies
create policy "characters_select_own" on public.characters
  for select using (auth.uid() = user_id);

create policy "characters_insert_own" on public.characters
  for insert with check (auth.uid() = user_id);

create policy "characters_update_own" on public.characters
  for update using (auth.uid() = user_id);

create policy "characters_delete_own" on public.characters
  for delete using (auth.uid() = user_id);

-- Function to auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for auto-updating updated_at
drop trigger if exists characters_updated_at on public.characters;
create trigger characters_updated_at
  before update on public.characters
  for each row
  execute function public.update_updated_at();
