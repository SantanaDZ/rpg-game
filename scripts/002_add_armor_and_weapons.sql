-- Add armor_type and weapon_type to characters table
alter table public.characters 
add column if not exists armor_type text not null default 'none',
add column if not exists weapon_type text not null default 'none';
