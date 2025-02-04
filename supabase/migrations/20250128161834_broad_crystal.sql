/*
  # Add media fields to experiences table

  1. Changes
    - Add media_type field to specify the type of media (image/youtube/vimeo)
    - Add media_url field to store the URL of the media
*/

ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS media_type text CHECK (media_type IN ('image', 'youtube', 'vimeo')),
ADD COLUMN IF NOT EXISTS media_url text;