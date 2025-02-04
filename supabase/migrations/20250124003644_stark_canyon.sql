-- Drop all existing policies
DO $$ 
BEGIN
  -- Drop profile policies
  DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
  DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

  -- Drop child table policies
  DROP POLICY IF EXISTS "social_links_policy" ON social_links;
  DROP POLICY IF EXISTS "experiences_policy" ON experiences;
  DROP POLICY IF EXISTS "contacts_policy" ON contacts;
  DROP POLICY IF EXISTS "products_policy" ON products;
END $$;

-- Create profile policies
CREATE POLICY "Allow public read access for profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create social links policies
CREATE POLICY "Allow public read access for social links"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own social links"
  ON social_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = social_links.profile_id
      AND id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = social_links.profile_id
      AND id = auth.uid()
    )
  );

-- Create experiences policies
CREATE POLICY "Allow public read access for experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own experiences"
  ON experiences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = experiences.profile_id
      AND id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = experiences.profile_id
      AND id = auth.uid()
    )
  );

-- Create contacts policies
CREATE POLICY "Allow public read access for contacts"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own contacts"
  ON contacts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = contacts.profile_id
      AND id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = contacts.profile_id
      AND id = auth.uid()
    )
  );

-- Create products policies
CREATE POLICY "Allow public read access for products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow users to manage their own products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = products.profile_id
      AND id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = products.profile_id
      AND id = auth.uid()
    )
  );

-- Ensure RLS is enabled on all tables
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