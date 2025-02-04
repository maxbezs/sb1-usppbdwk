-- Add has_advanced_access column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS has_advanced_access boolean NOT NULL DEFAULT false;