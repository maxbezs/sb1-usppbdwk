-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all permission levels" ON profiles;
DROP POLICY IF EXISTS "Admins can update permission levels" ON profiles;
DROP POLICY IF EXISTS "Users can upsert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;

-- Create cleaner profile policies
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fix products policies
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

CREATE POLICY "Enable read access for all authenticated users"
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

-- Fix experiences policies
DROP POLICY IF EXISTS "Users can insert own experiences" ON experiences;
DROP POLICY IF EXISTS "Users can update own experiences" ON experiences;
DROP POLICY IF EXISTS "Users can delete own experiences" ON experiences;

CREATE POLICY "Enable read access for all authenticated users"
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

-- Create experiences bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('experiences', 'experiences')
ON CONFLICT DO NOTHING;

-- Add storage policies for experience images
CREATE POLICY "Experience images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'experiences');

CREATE POLICY "Users can upload experience images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'experiences' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own experience images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'experiences' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own experience images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'experiences' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );