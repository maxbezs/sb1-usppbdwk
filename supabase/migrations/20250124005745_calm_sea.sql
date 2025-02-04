/*
  # Fix RLS Policies

  1. Changes
    - Drop existing policies with proper naming
    - Create new policies with unique names
    - Ensure proper RLS and foreign key constraints
    - Simplify policy structure for better maintainability

  2. Security
    - Enable RLS on all tables
    - Public read access for all tables
    - Authenticated write access for own data only
    - Proper cascading deletes
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Drop profile policies
  DROP POLICY IF EXISTS "profiles_select" ON profiles;
  DROP POLICY IF EXISTS "profiles_insert" ON profiles;
  DROP POLICY IF EXISTS "profiles_update" ON profiles;
  DROP POLICY IF EXISTS "profiles_delete" ON profiles;
  
  -- Drop child table policies
  DROP POLICY IF EXISTS "social_links_select" ON social_links;
  DROP POLICY IF EXISTS "social_links_insert" ON social_links;
  DROP POLICY IF EXISTS "social_links_update" ON social_links;
  DROP POLICY IF EXISTS "social_links_delete" ON social_links;
  
  DROP POLICY IF EXISTS "experiences_select" ON experiences;
  DROP POLICY IF EXISTS "experiences_insert" ON experiences;
  DROP POLICY IF EXISTS "experiences_update" ON experiences;
  DROP POLICY IF EXISTS "experiences_delete" ON experiences;
  
  DROP POLICY IF EXISTS "contacts_select" ON contacts;
  DROP POLICY IF EXISTS "contacts_insert" ON contacts;
  DROP POLICY IF EXISTS "contacts_update" ON contacts;
  DROP POLICY IF EXISTS "contacts_delete" ON contacts;
  
  DROP POLICY IF EXISTS "products_select" ON products;
  DROP POLICY IF EXISTS "products_insert" ON products;
  DROP POLICY IF EXISTS "products_update" ON products;
  DROP POLICY IF EXISTS "products_delete" ON products;
END $$;

-- Create simplified policies for profiles
CREATE POLICY "profiles_read_all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_write_own"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create simplified policies for social_links
CREATE POLICY "social_links_read_all"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "social_links_write_own"
  ON social_links FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create simplified policies for experiences
CREATE POLICY "experiences_read_all"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "experiences_write_own"
  ON experiences FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create simplified policies for contacts
CREATE POLICY "contacts_read_all"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "contacts_write_own"
  ON contacts FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create simplified policies for products
CREATE POLICY "products_read_all"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "products_write_own"
  ON products FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Ensure RLS is enabled
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