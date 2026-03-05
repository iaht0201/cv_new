import React from 'react';
import { CVVariant } from '../types/database';

interface CVPrintViewProps {
  cv: CVVariant;
  lang: 'vi' | 'en';
}

const LABELS = {
  vi: { summary: "Tóm tắt", exp: "Kinh nghiệm làm việc", portfolio: "Dự án", skills: "Kỹ năng", edu: "Học vấn", companySuffix: "tại" },
  en: { summary: "Summary", exp: "Work Experience", portfolio: "Projects", skills: "Skills", edu: "Education", companySuffix: "at" }
};

const CATEGORY_LABELS: Record<string, string> = {
  programming_languages: "Languages",
  frameworks: "Frameworks",
  databases: "Databases",
  cloud_platforms: "Cloud & Tools",
  tools: "Tools",
  soft_skills: "Soft Skills",
};

const groupSkills = (skills: Array<{category:string; name:string}>) =>
  skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

export const CVPrintView = React.forwardRef<HTMLDivElement, CVPrintViewProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          background: '#fff',
          color: '#18181b',
          fontSize: '10.5px',
          lineHeight: 1.55,
          margin: 0,
          padding: 0,
          width: '210mm',
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          /* ── Suppress browser print header (date/title/url) ── */
          @page {
            size: A4;
            margin: 0mm;
          }

          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          .cv-tag {
            display: inline-block;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            border-radius: 4px;
            padding: 1px 7px;
            font-size: 9px;
            font-weight: 600;
            margin: 2px 3px 2px 0;
          }
          .cv-pill {
            display: inline-block;
            background: #f4f4f5;
            color: #52525b;
            border: 1px solid #e4e4e7;
            border-radius: 20px;
            padding: 2px 9px;
            font-size: 9px;
            font-weight: 500;
            margin: 2px 3px 2px 0;
          }
          .cv-section-title {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #2563eb;
            border-bottom: 1.5px solid #dbeafe;
            padding-bottom: 5px;
            margin: 0 0 14px;
          }
        `}</style>

        {/* ─── HEADER ─────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          padding: '28px 32px 24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -30, right: 140, width: 130, height: 130, borderRadius: '50%', background: 'rgba(59,130,246,0.12)' }} />
          <div style={{ position: 'absolute', bottom: -25, right: 50, width: 90, height: 90, borderRadius: '50%', background: 'rgba(139,92,246,0.1)' }} />

          {/* Left: Name + Position */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1px', color: '#fff', lineHeight: 1.1, marginBottom: '10px' }}>
              {p.full_name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '2.5px', background: '#3b82f6', borderRadius: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa', fontStyle: 'italic' }}>
                {cv.position}
              </div>
            </div>
          </div>

          {/* Right: Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', justifyContent: 'center' }}>
            {[
              { icon: '✉', val: p.email },
              { icon: '☎', val: p.phone },
              { icon: '📍', val: p.location },
              { icon: '↗', val: 'facebook.com/iaht0201' },
            ].filter(x => x.val).map((item, i) => (
              <div key={i} style={{ fontSize: '9.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ opacity: 0.7 }}>{item.icon}</span>
                <span>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accent gradient bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)' }} />

        {/* ─── BODY ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', minHeight: '257mm' }}>

          {/* LEFT COLUMN */}
          <div style={{ padding: '24px 20px 24px 32px', borderRight: '1px solid #f1f5f9' }}>

            {/* Summary */}
            <div style={{ marginBottom: '24px' }}>
              <div className="cv-section-title">{labels.summary}</div>
              <p style={{ margin: 0, color: '#374151', fontStyle: 'italic', lineHeight: 1.7 }}>
                {cv.summary}
              </p>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '24px' }}>
              <div className="cv-section-title">{labels.exp}</div>
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '18px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0 }}>{exp.position}</div>
                    <div style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {exp.start_date} – {exp.end_date}
                    </div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#2563eb', fontWeight: 600, margin: '2px 0 5px' }}>
                    {exp.company}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {exp.location}</span>
                  </div>
                  <p style={{ margin: '0 0 6px', color: '#52525b', lineHeight: 1.65 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '14px', color: '#6b7280' }}>
                      {exp.achievements.map((a, j) => <li key={j} style={{ marginBottom: '2px' }}>{a}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <div className="cv-section-title">{labels.portfolio}</div>
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '14px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '11px', color: '#111827' }}>{pj.name}</div>
                    <div style={{ fontSize: '8.5px', color: '#3b82f6', flexShrink: 0 }}>
                      {pj.live_url || pj.live_urls?.[0] || pj.github_url}
                    </div>
                  </div>
                  <p style={{ margin: '3px 0 5px', color: '#52525b', lineHeight: 1.6 }}>{pj.description}</p>
                  <div>{pj.technologies?.map((t, ti) => <span key={ti} className="cv-tag">{t}</span>)}</div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div style={{ padding: '24px 28px 24px 20px', background: '#fafbff' }}>

            {/* Skills */}
            <div style={{ marginBottom: '26px' }}>
              <div className="cv-section-title">{labels.skills}</div>
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '13px' }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#9ca3af', marginBottom: '5px' }}>
                    {CATEGORY_LABELS[cat] || cat}
                  </div>
                  <div>{names.map((n, i) => <span key={i} className="cv-pill">{n}</span>)}</div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="cv-section-title">{labels.edu}</div>
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#111827', marginBottom: '2px' }}>{edu.institution}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{edu.field_of_study}</div>
                  {edu.gpa && (
                    <div style={{
                      display: 'inline-block',
                      marginTop: '5px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      padding: '1px 8px',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}>GPA {edu.gpa}</div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          padding: '8px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '8px',
          color: '#9ca3af',
          background: '#fafbff',
        }}>
          <span>{p.email}</span>
          <span style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.5px' }}>
            {p.full_name?.toUpperCase()} — {cv.position?.toUpperCase()}
          </span>
          <span>{p.phone}</span>
        </div>
      </div>
    );
  }
);

CVPrintView.displayName = 'CVPrintView';
