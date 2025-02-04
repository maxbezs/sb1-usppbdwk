/*
  # Fix RLS Policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create new simplified policies for all tables
    - Add proper profile existence checks for child tables
    - Ensure proper cascading foreign keys
    - Enable RLS on all tables

  2. Security
    - Public read access for all tables
    - Write access only for authenticated users on their own data
    - Proper foreign key constraints with cascading deletes
*/

-- Drop all existing policies
DO $$ 
BEGIN
  -- Drop profile policies
  DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

  -- Drop social links policies
  DROP POLICY IF EXISTS "social_links_read_policy" ON social_links;
  DROP POLICY IF EXISTS "social_links_insert_policy" ON social_links;
  DROP POLICY IF EXISTS "social_links_update_policy" ON social_links;
  DROP POLICY IF EXISTS "social_links_delete_policy" ON social_links;

  -- Drop experiences policies
  DROP POLICY IF EXISTS "experiences_read_policy" ON experiences;
  DROP POLICY IF EXISTS "experiences_insert_policy" ON experiences;
  DROP POLICY IF EXISTS "experiences_update_policy" ON experiences;
  DROP POLICY IF EXISTS "experiences_delete_policy" ON experiences;

  -- Drop contacts policies
  DROP POLICY IF EXISTS "contacts_read_policy" ON contacts;
  DROP POLICY IF EXISTS "contacts_insert_policy" ON contacts;
  DROP POLICY IF EXISTS "contacts_update_policy" ON contacts;
  DROP POLICY IF EXISTS "contacts_delete_policy" ON contacts;

  -- Drop products policies
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_insert_policy" ON products;
  DROP POLICY IF EXISTS "products_update_policy" ON products;
  DROP POLICY IF EXISTS "products_delete_policy" ON products;
END $$;

-- Create simplified policies for profiles
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create simplified policies for social_links
CREATE POLICY "social_links_select" ON social_links
  FOR SELECT USING (true);

CREATE POLICY "social_links_insert" ON social_links
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "social_links_update" ON social_links
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "social_links_delete" ON social_links
  FOR DELETE USING (auth.uid() = profile_id);

-- Create simplified policies for experiences
CREATE POLICY "experiences_select" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "experiences_insert" ON experiences
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "experiences_update" ON experiences
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "experiences_delete" ON experiences
  FOR DELETE USING (auth.uid() = profile_id);

-- Create simplified policies for contacts
CREATE POLICY "contacts_select" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "contacts_update" ON contacts
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "contacts_delete" ON contacts
  FOR DELETE USING (auth.uid() = profile_id);

-- Create simplified policies for products
CREATE POLICY "products_select" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert" ON products
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "products_update" ON products
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "products_delete" ON products
  FOR DELETE USING (auth.uid() = profile_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Ensure proper cascading foreign keys
ALTER TABLE social_links
DROP CONSTRAINT IF EXISTS social_links_profile_id_fkey,
ADD CONSTRAINT social_links_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE experiences
DROP CONSTRAINT IF EXISTS experiences_profile_id_fkey,
ADD CONSTRAINT experiences_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE contacts
DROP CONSTRAINT IF EXISTS contacts_profile_id_fkey,
ADD CONSTRAINT contacts_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_profile_id_fkey,
ADD CONSTRAINT products_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;