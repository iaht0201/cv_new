-- Thêm cột template_id vào cv_variants để lưu template đã chọn
ALTER TABLE cv_variants ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern';

-- Gán template mặc định cho các variant hiện có
UPDATE cv_variants SET template_id = 'modern' WHERE template_id IS NULL;
