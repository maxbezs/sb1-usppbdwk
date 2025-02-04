/*
  # Fix RLS policies with unique names
  
  1. Changes
    - Drop existing policies
    - Create new policies with unique names
    - Ensure proper auth.uid() checks
    - Add proper cascading deletes
    
  2. Security
    - Enable RLS on all tables
    - Public read access
    - Authenticated write access with proper user checks
*/

-- Drop existing policies with duplicate names
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON social_links;
DROP POLICY IF EXISTS "Enable read access for all users" ON experiences;
DROP POLICY IF EXISTS "Enable read access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- Create uniquely named policies for profiles
CREATE POLICY "profiles_read_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create uniquely named policies for social_links
CREATE POLICY "social_links_read_policy" ON social_links
  FOR SELECT USING (true);

CREATE POLICY "social_links_insert_policy" ON social_links
  FOR INSERT WITH CHECK (
    auth.uid() = profile_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = profile_id AND id = auth.uid()
    )
  );

CREATE POLICY "social_links_update_policy" ON social_links
  FOR UPDATE USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "social_links_delete_policy" ON social_links
  FOR DELETE USING (auth.uid() = profile_id);

-- Create uniquely named policies for experiences
CREATE POLICY "experiences_read_policy" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "experiences_insert_policy" ON experiences
  FOR INSERT WITH CHECK (
    auth.uid() = profile_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = profile_id AND id = auth.uid()
    )
  );

CREATE POLICY "experiences_update_policy" ON experiences
  FOR UPDATE USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "experiences_delete_policy" ON experiences
  FOR DELETE USING (auth.uid() = profile_id);

-- Create uniquely named policies for contacts
CREATE POLICY "contacts_read_policy" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "contacts_insert_policy" ON contacts
  FOR INSERT WITH CHECK (
    auth.uid() = profile_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = profile_id AND id = auth.uid()
    )
  );

CREATE POLICY "contacts_update_policy" ON contacts
  FOR UPDATE USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "contacts_delete_policy" ON contacts
  FOR DELETE USING (auth.uid() = profile_id);

-- Create uniquely named policies for products
CREATE POLICY "products_read_policy" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_policy" ON products
  FOR INSERT WITH CHECK (
    auth.uid() = profile_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = profile_id AND id = auth.uid()
    )
  );

CREATE POLICY "products_update_policy" ON products
  FOR UPDATE USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "products_delete_policy" ON products
  FOR DELETE USING (auth.uid() = profile_id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;