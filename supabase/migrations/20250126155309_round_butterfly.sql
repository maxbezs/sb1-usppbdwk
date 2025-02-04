/*
  # Add Advanced Mode Access Control

  1. Changes
    - Add has_advanced_access boolean column to profiles table
    - Set default value to false
    - Add NOT NULL constraint
*/

-- Add has_advanced_access column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS has_advanced_access boolean NOT NULL DEFAULT false;