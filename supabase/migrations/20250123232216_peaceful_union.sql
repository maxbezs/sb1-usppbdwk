/*
  # Fix RLS policies for all tables

  1. Changes
    - Drop and recreate all RLS policies with proper profile_id checks
    - Ensure consistent policy naming
    - Add proper cascade delete references
    - Fix policy permissions for all operations

  2. Security
    - Enable RLS on all tables
    - Ensure proper authentication checks
    - Allow public read access but restrict write operations
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access for profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to delete their own profile" ON profiles;

DROP POLICY IF EXISTS "Allow public read access for social_links" ON social_links;
DROP POLICY IF EXISTS "Allow users to manage their own social_links" ON social_links;

DROP POLICY IF EXISTS "Allow public read access for experiences" ON experiences;
DROP POLICY IF EXISTS "Allow users to manage their own experiences" ON experiences;

DROP POLICY IF EXISTS "Allow public read access for contacts" ON contacts;
DROP POLICY IF EXISTS "Allow users to manage their own contacts" ON contacts;

DROP POLICY IF EXISTS "Allow public read access for products" ON products;
DROP POLICY IF EXISTS "Allow users to manage their own products" ON products;

-- Create new policies for profiles
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on auth.uid()"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on auth.uid()"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on auth.uid()"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Create new policies for social_links
CREATE POLICY "Enable read access for all users"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on profile_id"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON social_links FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON social_links FOR DELETE
  USING (auth.uid() = profile_id);

-- Create new policies for experiences
CREATE POLICY "Enable read access for all users"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on profile_id"
  ON experiences FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON experiences FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON experiences FOR DELETE
  USING (auth.uid() = profile_id);

-- Create new policies for contacts
CREATE POLICY "Enable read access for all users"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on profile_id"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON contacts FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON contacts FOR DELETE
  USING (auth.uid() = profile_id);

-- Create new policies for products
CREATE POLICY "Enable read access for all users"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on profile_id"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON products FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON products FOR DELETE
  USING (auth.uid() = profile_id);

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Fix foreign key constraints to ensure proper cascading
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