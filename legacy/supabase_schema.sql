
-- RESET DATABASE
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS cv_variants;
DROP TABLE IF EXISTS profiles;

-- 1. Base Profiles (One per language: 'en', 'vi')
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT NOT NULL UNIQUE, -- 'en' or 'vi'
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    location TEXT,
    facebook_url TEXT,
    birthdate TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CV Variants (The dynamic parts: Summary and Position)
CREATE TABLE cv_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL, -- e.g. 'flutter', 'mmo', 'n8n'
    language TEXT NOT NULL,
    position TEXT,
    summary TEXT,
    UNIQUE (slug, language)
);

-- 3. Shared Data (Linked to Base Profile by Language)
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT,
    position TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    achievements TEXT[],
    display_order INT DEFAULT 0
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT[],
    live_url TEXT,
    github_url TEXT,
    live_urls TEXT[],
    display_order INT DEFAULT 0
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    field_of_study TEXT,
    degree TEXT,
    graduation_date TEXT,
    gpa TEXT
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read" ON cv_variants FOR SELECT USING (true);
CREATE POLICY "Public Read" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public Read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read" ON education FOR SELECT USING (true);
