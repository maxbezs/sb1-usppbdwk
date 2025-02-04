/*
  # Add insert policy for profiles table

  1. Changes
    - Add insert policy for profiles table to allow authenticated users to create their own profile
  
  2. Security
    - Only allows users to create a profile with their own user ID
    - Maintains existing RLS policies
*/

-- Add insert policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add policy for users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);