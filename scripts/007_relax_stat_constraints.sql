-- Relax stat constraints for characters table
-- The previous limits were hardcoded to 10, which blocks the new RPG progression system

-- Drop existing inline constraints (PostgreSQL usually names them automatically if not specified, 
-- but in the original script they were inline. We can drop them by name if we know them, 
-- or use a more generic approach by dropping and adding.)

ALTER TABLE public.characters
  DROP CONSTRAINT IF EXISTS characters_strength_check,
  DROP CONSTRAINT IF EXISTS characters_intelligence_check,
  DROP CONSTRAINT IF EXISTS characters_agility_check,
  DROP CONSTRAINT IF EXISTS characters_endurance_check,
  DROP CONSTRAINT IF EXISTS characters_charisma_check;

-- Add updated constraints (allowing up to 100 for future growth)
ALTER TABLE public.characters
  ADD CONSTRAINT characters_strength_check CHECK (strength >= 1 AND strength <= 100),
  ADD CONSTRAINT characters_intelligence_check CHECK (intelligence >= 1 AND intelligence <= 100),
  ADD CONSTRAINT characters_agility_check CHECK (agility >= 1 AND agility <= 100),
  ADD CONSTRAINT characters_endurance_check CHECK (endurance >= 1 AND endurance <= 100),
  ADD CONSTRAINT characters_charisma_check CHECK (charisma >= 1 AND charisma <= 100);

COMMENT ON TABLE public.characters IS 'Character table with relaxed stat constraints (max 100) for RPG progression';
