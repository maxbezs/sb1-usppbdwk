/*
  # Add Products & Services

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `name` (text, product/service name)
      - `price` (text, price with currency)
      - `purchase_url` (text, link to purchase)
      - `image_url` (text, product image)
      - `order` (integer, display order)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  name text NOT NULL,
  price text NOT NULL,
  purchase_url text,
  image_url text,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own products"
  ON products FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create products bucket for images
INSERT INTO storage.buckets (id, name)
VALUES ('products', 'products')
ON CONFLICT DO NOTHING;

-- Add storage policies for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

CREATE POLICY "Users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'products' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'products' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'products' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );