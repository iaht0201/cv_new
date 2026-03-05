-- =================================================================
-- INSERT PROJECTS cho cả 2 ngôn ngữ (VI + EN)
-- Chạy trong Supabase SQL Editor
-- Script dùng subquery để tự động lấy profile_id theo language
-- =================================================================

-- Xóa projects cũ nếu muốn chạy lại (bỏ comment dòng dưới nếu cần)
-- DELETE FROM projects WHERE profile_id IN (SELECT id FROM profiles WHERE language IN ('vi', 'en'));


-- ====================
-- TIẾNG ANH (EN)
-- ====================
DO $$
DECLARE
  pid_en UUID;
BEGIN
  SELECT id INTO pid_en FROM profiles WHERE language = 'en' LIMIT 1;

  IF pid_en IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy profile ngôn ngữ EN. Kiểm tra lại bảng profiles.';
  END IF;

  INSERT INTO projects (id, profile_id, name, description, technologies, live_url, github_url, live_urls)
  VALUES
    (
      gen_random_uuid(), pid_en,
      'Flonova n8n Automation',
      'Built a responsive landing page for Flonova''s n8n automation services, serving as the developer. Implemented the UI in React and used Supabase for data and backend services.',
      ARRAY['ReactJS', 'Supabase'],
      'https://flonova.io.vn/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'Hathi Cosmetic',
      'Developed an SEO-friendly e-commerce website as a full-stack developer.',
      ARRAY['NextJS', 'PostgreSQL'],
      'https://hathibeauty.com/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'YouTube Crawling & Script Design',
      'Used n8n, Excel, and AI (Gemini, ChatGPT, Supadata, …) to collect competitor channel data and auto-generate new script ideas.',
      ARRAY['N8N', 'Gemini', 'Supadata', 'Excel', 'ChatGPT'],
      NULL, NULL, NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'MED IOT',
      'Developed & optimized UI, fixed UI/UX issues, and integrated APIs for a desktop application.',
      ARRAY['Flutter', 'Dart', 'API Integration'],
      NULL, NULL, NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'DJC',
      'Built UI/UX, optimized performance, deployed Flutter app to Apple Store & Google Play; fixed web bugs and video features with Python & JavaScript.',
      ARRAY['Flutter', 'Dart', 'Python', 'JavaScript'],
      NULL, NULL,
      ARRAY['https://play.google.com/store/apps/details?id=com.app.djc_ddl', 'https://apps.apple.com/us/app/djc/id1559700733']
    ),
    (
      gen_random_uuid(), pid_en,
      'HueJobs',
      'Developed a recruitment application as a Flutter Developer, building UI/UX and connecting data.',
      ARRAY['Flutter', 'Dart'],
      NULL, 'https://github.com/iaht0201/huejob-s', NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'HIENNGUYEN SOPRANO',
      'Developed a personal website as a freelancer; built UI/UX and optimized the portfolio site.',
      ARRAY['HTML', 'CSS', 'JavaScript'],
      'https://hiennguyensoprano.com/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_en,
      'MotChill - Movie App',
      'Developed website and mobile application for movie streaming; implemented video playback, optimized UI, and handled system operations.',
      ARRAY['Flutter', 'Dart', 'JavaScript', 'HTML', 'SCSS'],
      'https://motchill-iaht.vercel.app/', NULL, NULL
    );

  RAISE NOTICE 'Đã thêm 8 projects cho profile EN (id: %)', pid_en;
END;
$$;


-- ====================
-- TIẾNG VIỆT (VI)
-- ====================
DO $$
DECLARE
  pid_vi UUID;
BEGIN
  SELECT id INTO pid_vi FROM profiles WHERE language = 'vi' LIMIT 1;

  IF pid_vi IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy profile ngôn ngữ VI. Kiểm tra lại bảng profiles.';
  END IF;

  INSERT INTO projects (id, profile_id, name, description, technologies, live_url, github_url, live_urls)
  VALUES
    (
      gen_random_uuid(), pid_vi,
      'Flonova n8n Automation',
      'Xây dựng landing page cho dịch vụ tự động hóa n8n của Flonova với vai trò developer. Triển khai giao diện bằng React và sử dụng Supabase cho dữ liệu và dịch vụ backend.',
      ARRAY['React', 'Supabase'],
      'https://flonova.io.vn/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'Hathi Cosmetic',
      'Xây dựng website thương mại điện tử chuẩn SEO với vai trò full‑stack.',
      ARRAY['NextJS', 'PostgreSQL'],
      'https://hathibeauty.com/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'Crawl YouTube & Thiết Kế Kịch Bản',
      'Sử dụng n8n, Excel, AI (Gemini, ChatGPT, Supadata, …) để lấy dữ liệu kênh đối thủ và tự động tạo ý tưởng kịch bản mới.',
      ARRAY['N8N', 'Gemini', 'Supadata', 'Excel', 'ChatGPT'],
      NULL, NULL, NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'MED IOT',
      'Phát triển & tối ưu giao diện, sửa lỗi UI/UX và tích hợp API cho ứng dụng desktop.',
      ARRAY['Flutter', 'Dart', 'API Integration'],
      NULL, NULL, NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'DJC',
      'Xây dựng UI/UX, tối ưu hiệu năng, triển khai app Flutter lên Apple Store & CH Play; fix bug web và tính năng video bằng Python & JavaScript.',
      ARRAY['Flutter', 'Dart', 'Python', 'JavaScript'],
      NULL, NULL,
      ARRAY['https://play.google.com/store/apps/details?id=com.app.djc_ddl', 'https://apps.apple.com/us/app/djc/id1559700733']
    ),
    (
      gen_random_uuid(), pid_vi,
      'HueJobs',
      'Phát triển ứng dụng tuyển dụng với vai trò Flutter Developer, xây dựng UI/UX và kết nối dữ liệu.',
      ARRAY['Flutter', 'Dart'],
      NULL, 'https://github.com/iaht0201/huejob-s', NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'HIENNGUYEN SOPRANO',
      'Phát triển website cá nhân với vai trò freelancer, xây dựng UI/UX và tối ưu website.',
      ARRAY['HTML', 'CSS', 'JavaScript'],
      'https://hiennguyensoprano.com/', NULL, NULL
    ),
    (
      gen_random_uuid(), pid_vi,
      'MotChill - App Xem Phim',
      'Xây dựng website và ứng dụng xem phim; phát triển tính năng phát video, tối ưu giao diện và vận hành hệ thống.',
      ARRAY['Flutter', 'Dart', 'JavaScript', 'HTML', 'SCSS'],
      'https://motchill-iaht.vercel.app/', NULL, NULL
    );

  RAISE NOTICE 'Đã thêm 8 projects cho profile VI (id: %)', pid_vi;
END;
$$;


-- Kiểm tra kết quả
SELECT 
  p.language,
  pr.name,
  pr.technologies,
  pr.live_url,
  pr.github_url
FROM projects pr
JOIN profiles p ON pr.profile_id = p.id
ORDER BY p.language, pr.name;
