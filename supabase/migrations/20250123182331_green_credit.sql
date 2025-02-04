-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "New users can create their profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view social links" ON social_links;
DROP POLICY IF EXISTS "Users can manage their own social links" ON social_links;
DROP POLICY IF EXISTS "Anyone can view experiences" ON experiences;
DROP POLICY IF EXISTS "Users can manage their own experiences" ON experiences;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Users can manage their own products" ON products;

-- Create simpler, more permissive policies for profiles
CREATE POLICY "Enable read access for everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Create simpler policies for social links
CREATE POLICY "Enable read access for everyone"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON social_links FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON social_links FOR DELETE
  USING (auth.uid() = profile_id);

-- Create simpler policies for experiences
CREATE POLICY "Enable read access for everyone"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON experiences FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON experiences FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON experiences FOR DELETE
  USING (auth.uid() = profile_id);

-- Create simpler policies for products
CREATE POLICY "Enable read access for everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON products FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON products FOR DELETE
  USING (auth.uid() = profile_id);

-- Improve profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO UPDATE
  SET updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;