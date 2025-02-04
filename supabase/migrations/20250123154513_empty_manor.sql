/*
  # Add image support for experiences

  1. Changes
    - Add image_url column to experiences table
    - Add type column for experience categorization (Company/Project/Qualification)

  2. Notes
    - Keeping the migration simple to avoid timeouts
    - Storage bucket and policies will be handled in a separate migration
*/

-- Add image_url and type columns to experiences table
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('Company', 'Project', 'Qualification'));