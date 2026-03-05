-- Thêm các cột social URLs còn thiếu vào bảng profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zalo_url    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url  TEXT;

-- Reload schema cache sau khi chạy xong:
-- Vào Supabase Dashboard → Project Settings → API → "Reload Schema Cache"
