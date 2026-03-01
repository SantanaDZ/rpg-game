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
