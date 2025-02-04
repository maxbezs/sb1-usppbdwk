/*
  # Add User Permission Levels

  1. Changes
    - Add permission_level column to profiles table
    - Set default permission level to 'User'
    - Create function to set initial admin user
    
  2. Security
    - Only admins can view permission levels
    - Only admins can modify permission levels
*/

-- Add permission_level enum type
DO $$ BEGIN
  CREATE TYPE user_permission_level AS ENUM ('User', 'Admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add permission_level column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS permission_level user_permission_level NOT NULL DEFAULT 'User';

-- Create index for permission level queries
CREATE INDEX IF NOT EXISTS idx_profiles_permission_level 
ON profiles(permission_level);

-- Function to set initial admin user
CREATE OR REPLACE FUNCTION set_initial_admin()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET permission_level = 'Admin'
  WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'raminhoodeh@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to set initial admin
SELECT set_initial_admin();

-- Create policies for permission level access
CREATE POLICY "Admins can view all permission levels"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id 
      FROM profiles 
      WHERE permission_level = 'Admin'
    )
  );

CREATE POLICY "Admins can update permission levels"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id 
      FROM profiles 
      WHERE permission_level = 'Admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id 
      FROM profiles 
      WHERE permission_level = 'Admin'
    )
  );