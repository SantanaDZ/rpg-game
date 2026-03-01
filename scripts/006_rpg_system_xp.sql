-- Migration to add XP column to characters table
ALTER TABLE characters 
ADD COLUMN xp INTEGER DEFAULT 0;

COMMENT ON COLUMN characters.xp IS 'Experience points earned by the character through victories';

-- RPC to increment wins
CREATE OR REPLACE FUNCTION increment_wins(char_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE characters
  SET wins = wins + 1
  WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;

-- RPC to increment XP
CREATE OR REPLACE FUNCTION increment_xp(char_id UUID, xp_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE characters
  SET xp = xp + xp_amount
  WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;
