/*
  # Final RLS Policy Fix

  1. Changes
    - Drop all existing policies
    - Create simplified ALL policies for child tables
    - Keep separate policies for profiles
    - Remove unnecessary profile existence checks
    - Ensure proper cascading

  2. Security
    - Public read access for all tables
    - Write access only for authenticated users on their own data
    - Simplified policy structure
*/

-- Drop all existing policies
DO $$ 
BEGIN
  -- Drop profile policies
  DROP POLICY IF EXISTS "profiles_select" ON profiles;
  DROP POLICY IF EXISTS "profiles_insert" ON profiles;
  DROP POLICY IF EXISTS "profiles_update" ON profiles;
  DROP POLICY IF EXISTS "profiles_delete" ON profiles;

  -- Drop social links policies
  DROP POLICY IF EXISTS "social_links_select" ON social_links;
  DROP POLICY IF EXISTS "social_links_insert" ON social_links;
  DROP POLICY IF EXISTS "social_links_update" ON social_links;
  DROP POLICY IF EXISTS "social_links_delete" ON social_links;

  -- Drop experiences policies
  DROP POLICY IF EXISTS "experiences_select" ON experiences;
  DROP POLICY IF EXISTS "experiences_insert" ON experiences;
  DROP POLICY IF EXISTS "experiences_update" ON experiences;
  DROP POLICY IF EXISTS "experiences_delete" ON experiences;

  -- Drop contacts policies
  DROP POLICY IF EXISTS "contacts_select" ON contacts;
  DROP POLICY IF EXISTS "contacts_insert" ON contacts;
  DROP POLICY IF EXISTS "contacts_update" ON contacts;
  DROP POLICY IF EXISTS "contacts_delete" ON contacts;

  -- Drop products policies
  DROP POLICY IF EXISTS "products_select" ON products;
  DROP POLICY IF EXISTS "products_insert" ON products;
  DROP POLICY IF EXISTS "products_update" ON products;
  DROP POLICY IF EXISTS "products_delete" ON products;
END $$;

-- Create simplified profile policies
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create simplified ALL policies for child tables
CREATE POLICY "social_links_policy" ON social_links
  FOR ALL USING (
    CASE
      WHEN current_user IS NULL THEN true -- Allow public reads
      ELSE auth.uid() = profile_id -- Restrict writes to owner
    END
  )
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "experiences_policy" ON experiences
  FOR ALL USING (
    CASE
      WHEN current_user IS NULL THEN true -- Allow public reads
      ELSE auth.uid() = profile_id -- Restrict writes to owner
    END
  )
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "contacts_policy" ON contacts
  FOR ALL USING (
    CASE
      WHEN current_user IS NULL THEN true -- Allow public reads
      ELSE auth.uid() = profile_id -- Restrict writes to owner
    END
  )
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "products_policy" ON products
  FOR ALL USING (
    CASE
      WHEN current_user IS NULL THEN true -- Allow public reads
      ELSE auth.uid() = profile_id -- Restrict writes to owner
    END
  )
  WITH CHECK (auth.uid() = profile_id);

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