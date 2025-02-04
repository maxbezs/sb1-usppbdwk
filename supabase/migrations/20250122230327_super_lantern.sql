/*
  # Add headline column to profiles table

  1. Changes
    - Add `headline` column to profiles table for storing job titles/roles
    - Set character limit to 100 characters
    - Make it nullable

  2. Security
    - Inherits existing RLS policies from profiles table
*/

-- Add headline column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS headline text CHECK (char_length(headline) <= 100);