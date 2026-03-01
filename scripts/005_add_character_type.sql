-- Migration to add character_type column to characters table
ALTER TABLE characters 
ADD COLUMN character_type TEXT DEFAULT 'knight';

COMMENT ON COLUMN characters.character_type IS 'Visual class of the character (e.g., knight, archer, skeleton, etc.)';
