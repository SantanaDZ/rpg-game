-- Add hat_type and wins column to characters table
alter table public.characters 
add column if not exists hat_type text not null default 'none',
add column if not exists wins integer not null default 0;
