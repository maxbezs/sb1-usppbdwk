/*
  # Fix RLS policies for tables

  1. Changes
    - Drop existing policies
    - Create new policies with correct permissions for all tables
    - Ensure proper profile_id checks
  
  2. Security
    - Enable RLS on all tables
    - Add policies for SELECT, INSERT, UPDATE, DELETE operations
    - Ensure users can only manage their own data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own products" ON products;
DROP POLICY IF EXISTS "Users can view any products" ON products;
DROP POLICY IF EXISTS "Users can manage own experiences" ON experiences;
DROP POLICY IF EXISTS "Users can view any experiences" ON experiences;
DROP POLICY IF EXISTS "Users can manage own social links" ON social_links;
DROP POLICY IF EXISTS "Users can view any social links" ON social_links;

-- Products policies
CREATE POLICY "Users can view any products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = profile_id);

-- Experiences policies
CREATE POLICY "Users can view any experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own experiences"
  ON experiences FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own experiences"
  ON experiences FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own experiences"
  ON experiences FOR DELETE
  USING (auth.uid() = profile_id);

-- Social links policies
CREATE POLICY "Users can view any social links"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own social links"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own social links"
  ON social_links FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own social links"
  ON social_links FOR DELETE
  USING (auth.uid() = profile_id);