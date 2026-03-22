ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS promo_banner jsonb DEFAULT '{"imageUrl":"","title":"","subtitle":""}'::jsonb;
