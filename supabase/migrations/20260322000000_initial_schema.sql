-- Zenite Perfumaria - Initial Schema
-- All tables for the admin panel and storefront
-- Uses DROP + CREATE to ensure clean state

-- Drop existing tables if they exist
DROP TABLE IF EXISTS footer_legal_pages CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2) DEFAULT 0,
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  category TEXT DEFAULT '',
  category_slug TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  sold_count INT DEFAULT 0,
  stock INT DEFAULT 100,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Banners
CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  image_url TEXT DEFAULT '',
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  link TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total NUMERIC(10,2) DEFAULT 0,
  items INT DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Store settings (single row)
CREATE TABLE store_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings JSONB DEFAULT '{"ai":{"enabled":false,"endpointUrl":"","apiKey":"","model":"gpt"},"whatsapp":{"enabled":false,"url":""},"payment":{"provider":"pix","config":{}}}',
  logo_url TEXT DEFAULT '',
  footer_contact JSONB DEFAULT '{"email":"","phone":"","address":""}',
  footer_social JSONB DEFAULT '{"instagram":"","facebook":"","twitter":"","tiktok":"","youtube":""}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Footer legal pages
CREATE TABLE footer_legal_pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings row
INSERT INTO store_settings (id) VALUES (1);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_legal_pages ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon (no auth required for now)
CREATE POLICY "anon_all" ON products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON banners FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON store_settings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON footer_legal_pages FOR ALL TO anon USING (true) WITH CHECK (true);

-- Storage bucket for images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "anon_upload" ON storage.objects;
DROP POLICY IF EXISTS "anon_select" ON storage.objects;
DROP POLICY IF EXISTS "anon_update" ON storage.objects;
DROP POLICY IF EXISTS "anon_delete" ON storage.objects;

-- Storage policies for anonymous access
CREATE POLICY "anon_upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'images');
CREATE POLICY "anon_select" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'images');
CREATE POLICY "anon_update" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'images');
CREATE POLICY "anon_delete" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'images');
