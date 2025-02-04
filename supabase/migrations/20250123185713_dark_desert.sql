-- Add paypal_username column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS paypal_username text;