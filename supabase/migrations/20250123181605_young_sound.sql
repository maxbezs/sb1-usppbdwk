/*
  # Fix RLS policies and profile creation

  1. Changes
    - Simplify profile policies to ensure proper access
    - Fix profile creation trigger
    - Add missing policies for all tables
    - Ensure proper cascading deletes
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for all operations
    - Use security definer for sensitive operations
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Create simpler profile policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "New users can create their profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fix profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure proper cascading deletes
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

ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_profile_id_fkey,
ADD CONSTRAINT products_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- Fix social links policies
DROP POLICY IF EXISTS "Enable read access for all users" ON social_links;
DROP POLICY IF EXISTS "Enable insert for users based on profile_id" ON social_links;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON social_links;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON social_links;

CREATE POLICY "Anyone can view social links"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own social links"
  ON social_links FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Fix experiences policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON experiences;
DROP POLICY IF EXISTS "Enable insert for users based on profile_id" ON experiences;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON experiences;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON experiences;

CREATE POLICY "Anyone can view experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own experiences"
  ON experiences FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Fix products policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON products;
DROP POLICY IF EXISTS "Enable insert for users based on profile_id" ON products;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON products;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON products;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own products"
  ON products FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Create function to handle profile queries
CREATE OR REPLACE FUNCTION get_full_profile(profile_id uuid)
RETURNS json AS $$
DECLARE
  profile_data json;
BEGIN
  SELECT json_build_object(
    'id', p.id,
    'display_name', p.display_name,
    'username', p.username,
    'bio', p.bio,
    'avatar_url', p.avatar_url,
    'headline', p.headline,
    'permission_level', p.permission_level,
    'social_links', COALESCE(
      (SELECT json_agg(row_to_json(sl) ORDER BY sl.order)
       FROM social_links sl
       WHERE sl.profile_id = p.id),
      '[]'::json
    ),
    'experiences', COALESCE(
      (SELECT json_agg(row_to_json(e) ORDER BY e.order)
       FROM experiences e
       WHERE e.profile_id = p.id),
      '[]'::json
    ),
    'products', COALESCE(
      (SELECT json_agg(row_to_json(pr) ORDER BY pr.order)
       FROM products pr
       WHERE pr.profile_id = p.id),
      '[]'::json
    )
  ) INTO profile_data
  FROM profiles p
  WHERE p.id = profile_id;

  RETURN profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;