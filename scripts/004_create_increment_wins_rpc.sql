-- Function to increment wins for a character
create or replace function public.increment_wins(char_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.characters
  set wins = wins + 1
  where id = char_id;
end;
$$;
