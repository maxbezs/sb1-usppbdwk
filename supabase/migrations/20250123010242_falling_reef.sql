/*
  # Add missing storage bucket and policies for products

  1. Storage
    - Create products bucket if not exists
    - Add storage policies for product images
*/

-- Create products bucket for images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('products', 'products')
  ON CONFLICT DO NOTHING;
END $$;

-- Add storage policies for product images if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Product images are publicly accessible'
  ) THEN
    CREATE POLICY "Product images are publicly accessible"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'products');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload product images'
  ) THEN
    CREATE POLICY "Users can upload product images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'products' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update own product images'
  ) THEN
    CREATE POLICY "Users can update own product images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'products' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete own product images'
  ) THEN
    CREATE POLICY "Users can delete own product images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'products' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;