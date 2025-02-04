-- Add purchase_type column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS purchase_type text CHECK (purchase_type IN ('paypal', 'link')) DEFAULT 'link';

-- Update existing rows to have the default purchase type
UPDATE products
SET purchase_type = 'link'
WHERE purchase_type IS NULL;