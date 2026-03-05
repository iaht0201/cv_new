
import json
import os
import uuid

def escape_sql(val):
    if val is None:
        return "NULL"
    if isinstance(val, str):
        return "'" + val.replace("'", "''") + "'"
    if isinstance(val, list):
        items = [v.replace("'", "''") for v in val if isinstance(v, str)]
        return "ARRAY[" + ", ".join([f"'{i}'" for i in items]) + "]"
    return str(val)

def generate_sql():
    # We use cv-tong-quan.json as the MASTER for experience, projects, skills, etc.
    master_file = 'cv-tong-quan.json'
    with open(master_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
    
    sql_statements = ["-- CLEAN REFINED SEED DATA\n", "BEGIN;\n"]
    
    profile_ids = {} # language -> uuid
    
    # 1. Insert Base Profiles (EN and VI)
    for lang in ['en', 'vi']:
        p_id = str(uuid.uuid4())
        profile_ids[lang] = p_id
        p_info = master_data[lang]['personal_info']
        
        sql_statements.append(f"""
INSERT INTO profiles (id, language, full_name, email, phone, location, facebook_url, birthdate)
VALUES ('{p_id}', '{lang}', {escape_sql(p_info.get('name'))}, {escape_sql(p_info.get('email'))}, {escape_sql(p_info.get('phone'))}, {escape_sql(p_info.get('location'))}, {escape_sql(p_info.get('facebook'))}, {escape_sql(p_info.get('birthdate'))});""")

        # 2. Insert Shared Data for each profile (Experiences, Projects, Skills, etc.)
        cv = master_data[lang]
        
        for exp in cv.get('experience', []):
            sql_statements.append(f"INSERT INTO experiences (profile_id, company, position, location, start_date, end_date, description, achievements) VALUES ('{p_id}', {escape_sql(exp.get('company'))}, {escape_sql(exp.get('position'))}, {escape_sql(exp.get('location'))}, {escape_sql(exp.get('start_date'))}, {escape_sql(exp.get('end_date'))}, {escape_sql(exp.get('description'))}, {escape_sql(exp.get('achievements'))});")

        for proj in cv.get('projects', []):
            sql_statements.append(f"INSERT INTO projects (profile_id, name, description, technologies, live_url, github_url, live_urls) VALUES ('{p_id}', {escape_sql(proj.get('name'))}, {escape_sql(proj.get('description'))}, {escape_sql(proj.get('technologies'))}, {escape_sql(proj.get('live_url'))}, {escape_sql(proj.get('github_url'))}, {escape_sql(proj.get('live_urls'))});")

        for cat, names in cv.get('skills', {}).items():
            if isinstance(names, list):
                for name in names:
                    sql_statements.append(f"INSERT INTO skills (profile_id, category, name) VALUES ('{p_id}', {escape_sql(cat)}, {escape_sql(name)});")

        for edu in cv.get('education', []):
            sql_statements.append(f"INSERT INTO education (profile_id, institution, field_of_study, degree, graduation_date, gpa) VALUES ('{p_id}', {escape_sql(edu.get('institution'))}, {escape_sql(edu.get('field_of_study'))}, {escape_sql(edu.get('degree'))}, {escape_sql(edu.get('graduation_date'))}, {escape_sql(edu.get('gpa'))});")

    # 3. Insert CV Variants (Summaries and Positions from ALL files)
    files = [f for f in os.listdir('.') if f.startswith('cv-') and f.endswith('.json')]
    for filename in files:
        slug = filename.replace('cv-', '').replace('.json', '')
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except: continue
            
            for lang in ['en', 'vi']:
                if lang in data:
                    cv = data[lang]
                    p_id = profile_ids[lang]
                    sql_statements.append(f"INSERT INTO cv_variants (profile_id, slug, language, position, summary) VALUES ('{p_id}', '{slug}', '{lang}', {escape_sql(cv.get('personal_info', {}).get('position'))}, {escape_sql(cv.get('summary', {}).get('professional_summary'))});")

    sql_statements.append("\nCOMMIT;")
    
    with open('seed_data.sql', 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_statements))

if __name__ == "__main__":
    generate_sql()
    print("Regenerated seed_data.sql with shared profile structure!")
