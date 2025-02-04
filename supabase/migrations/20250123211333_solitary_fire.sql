/*
  # Add contacts table and related configurations

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `type` (text)
      - `custom_type` (text, nullable)
      - `value` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on contacts table
    - Add policies for public viewing
    - Add policies for authenticated user management
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Phone', 'Telegram', 'Email', 'Address', 'Calendar link', 'Other')),
  custom_type text,
  value text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for everyone"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON contacts FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON contacts FOR DELETE
  USING (auth.uid() = profile_id);

-- Create trigger for updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();