/*
  # Add created_at column to profiles

  1. Changes
    - Adds created_at column to profiles table
    - Sets default value to now()
    - Backfills existing rows
*/

-- Add created_at column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Backfill created_at for existing rows
UPDATE profiles 
SET created_at = updated_at 
WHERE created_at IS NULL;

-- Make created_at NOT NULL
ALTER TABLE profiles 
ALTER COLUMN created_at SET NOT NULL;