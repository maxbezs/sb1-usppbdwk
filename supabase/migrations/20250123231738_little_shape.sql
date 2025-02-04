/*
  # Fix RLS policies for all tables

  1. Changes
    - Drop all existing policies
    - Create new simplified policies for all tables
    - Ensure proper profile_id checks
    - Enable public read access where needed
    - Restrict write operations to authenticated users

  2. Security
    - Enable RLS on all tables
    - Add proper profile_id checks for all write operations
    - Allow public read access for profile data
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for everyone" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "New users can create their profile" ON profiles;

DROP POLICY IF EXISTS "Enable read access for everyone" ON social_links;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON social_links;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON social_links;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON social_links;

DROP POLICY IF EXISTS "Enable read access for everyone" ON experiences;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON experiences;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON experiences;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON experiences;

DROP POLICY IF EXISTS "Enable read access for everyone" ON contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON contacts;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON contacts;

DROP POLICY IF EXISTS "Enable read access for everyone" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON products;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON products;

-- Create new policies for profiles
CREATE POLICY "Allow public read access for profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Create new policies for social_links
CREATE POLICY "Allow public read access for social_links"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own social_links"
  ON social_links FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create new policies for experiences
CREATE POLICY "Allow public read access for experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own experiences"
  ON experiences FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create new policies for contacts
CREATE POLICY "Allow public read access for contacts"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own contacts"
  ON contacts FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create new policies for products
CREATE POLICY "Allow public read access for products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own products"
  ON products FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;