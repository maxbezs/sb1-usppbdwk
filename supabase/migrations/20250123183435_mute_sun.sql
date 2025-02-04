/*
  # Set Admin User

  1. Changes
    - Sets raminhoodeh@gmail.com as an Admin user
    - Ensures permission_level column exists
    - Adds admin-specific policies
*/

-- Ensure permission_level column exists with proper type
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'permission_level'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN permission_level text 
    CHECK (permission_level IN ('User', 'Admin')) 
    NOT NULL 
    DEFAULT 'User';
  END IF;
END $$;

-- Set raminhoodeh@gmail.com as admin
UPDATE profiles
SET permission_level = 'Admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'raminhoodeh@gmail.com'
);

-- Add admin-specific policies
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  USING (
    (auth.uid() IN (
      SELECT id 
      FROM profiles 
      WHERE permission_level = 'Admin'
    ))
    OR
    (auth.uid() = id)
  );