-- Update bio character limit in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_bio_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_bio_check CHECK (char_length(bio) <= 777);