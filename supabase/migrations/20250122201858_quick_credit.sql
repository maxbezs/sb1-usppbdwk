/*
  # Create profiles and related tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text)
      - `username` (text, unique)
      - `bio` (text)
      - `avatar_url` (text)
      - `updated_at` (timestamp)
    - `social_links`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `title` (text)
      - `url` (text)
      - `order` (integer)
    - `experiences`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `company` (text)
      - `role` (text)
      - `description` (text)
      - `order` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text,
  username text UNIQUE CHECK (username ~* '^[a-zA-Z0-9]{3,20}$'),
  bio text CHECK (char_length(bio) <= 150),
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  company text NOT NULL,
  role text NOT NULL,
  description text CHECK (char_length(description) <= 300),
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view any social links"
  ON social_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own social links"
  ON social_links FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can view any experiences"
  ON experiences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own experiences"
  ON experiences FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();