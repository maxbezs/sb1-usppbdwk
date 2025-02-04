/*
  # Fix profile creation and RLS policies

  1. Changes
    - Add upsert policy for profiles to handle both insert and update
    - Add storage policies for avatar uploads
    - Add bucket for avatars if it doesn't exist
  
  2. Security
    - Ensures users can only manage their own profiles
    - Allows avatar uploads and management
*/

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars')
  ON CONFLICT DO NOTHING;
END $$;

-- Update profile policies to use upsert
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can upsert own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );