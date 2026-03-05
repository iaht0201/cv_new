-- Thêm cột order_index vào các bảng cần sắp xếp
ALTER TABLE projects    ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE education   ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE skills      ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Gán order_index ban đầu theo thứ tự tạo (ctid)
UPDATE projects    SET order_index = sub.rn FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY ctid) - 1 AS rn FROM projects) sub WHERE projects.id = sub.id;
UPDATE experiences SET order_index = sub.rn FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY ctid) - 1 AS rn FROM experiences) sub WHERE experiences.id = sub.id;
UPDATE education   SET order_index = sub.rn FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY ctid) - 1 AS rn FROM education) sub WHERE education.id = sub.id;
UPDATE skills      SET order_index = sub.rn FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY ctid) - 1 AS rn FROM skills) sub WHERE skills.id = sub.id;
