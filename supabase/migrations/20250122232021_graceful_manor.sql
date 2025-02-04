/*
  # Fix username validation

  1. Changes
    - Update username validation constraint to properly handle 3-20 character alphanumeric usernames
    - Remove old constraint and add new one with proper regex pattern
    - Ensure case insensitive matching

  2. Security
    - Maintains existing RLS policies
    - No data loss - only constraint modification
*/

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_check;

-- Add the new constraint with proper validation
ALTER TABLE profiles ADD CONSTRAINT profiles_username_check 
  CHECK (username ~ '^[a-zA-Z0-9]{3,20}$');

-- Add a unique index for case-insensitive username lookups
DROP INDEX IF EXISTS profiles_username_lower_idx;
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (LOWER(username)) WHERE username IS NOT NULL;