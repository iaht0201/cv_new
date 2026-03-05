import React from 'react';
import { CVVariant } from '../../types/database';

// ─────────────────────────────────────────────────────────────
// Shared utilities
// ─────────────────────────────────────────────────────────────
export const LABELS = {
  vi: { summary: 'Tóm tắt', exp: 'Kinh nghiệm', portfolio: 'Dự án', skills: 'Kỹ năng', edu: 'Học vấn' },
  en: { summary: 'Summary', exp: 'Work Experience', portfolio: 'Projects', skills: 'Skills', edu: 'Education' },
};

export const CATEGORY_LABELS: Record<string, string> = {
  programming_languages: 'Languages',
  frameworks: 'Frameworks',
  databases: 'Databases',
  cloud_platforms: 'Cloud & Tools',
  tools: 'Tools',
  ai_automation: 'AI & Automation',
  soft_skills: 'Soft Skills',
};

// Helper: render social links as short text
const SocialLinks = ({ p, style }: { p: any; style?: React.CSSProperties }) => {
  const links: { label: string; val: string }[] = [];
  if (p.github_url)   links.push({ label: 'GitHub', val: p.github_url.replace(/^https?:\/\/(www\.)?/, '') });
  if (p.facebook_url) links.push({ label: 'Facebook', val: p.facebook_url.replace(/^https?:\/\/(www\.)?/, '') });
  if (p.zalo_url)     links.push({ label: 'Zalo', val: p.zalo_url.replace(/^https?:\/\/(www\.)?/, '') });
  if (p.telegram_url) links.push({ label: 'Telegram', val: p.telegram_url.replace(/^https?:\/\/(www\.)?/, '') });
  if (!links.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', ...style }}>
      {links.map((l, i) => (
        <span key={i} style={{ fontSize: '8.5px', opacity: 0.85 }}>
          <span style={{ fontWeight: 700 }}>{l.label}:</span> {l.val}
        </span>
      ))}
    </div>
  );
};

export const groupSkills = (skills: Array<{ category: string; name: string }>) =>
  skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

export interface CVTemplateProps {
  cv: CVVariant;
  lang: 'vi' | 'en';
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 1: MODERN (Blue gradient header, 2-col)
// ─────────────────────────────────────────────────────────────
export const CVTemplateModern = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);

    const styles = {
      tag: { display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '1px 7px', fontSize: '9px', fontWeight: 600, margin: '2px 3px 2px 0' } as React.CSSProperties,
      pill: { display: 'inline-block', background: '#f4f4f5', color: '#52525b', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '2px 9px', fontSize: '9px', fontWeight: 500, margin: '2px 3px 2px 0' } as React.CSSProperties,
      sectionTitle: { fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2px', color: '#2563eb', borderBottom: '1.5px solid #dbeafe', paddingBottom: '5px', margin: '0 0 14px' } as React.CSSProperties,
    };

    return (
      <div ref={ref} style={{ fontFamily: "'Inter', Arial, sans-serif", background: '#fff', color: '#18181b', fontSize: '10.5px', lineHeight: 1.55, width: '210mm' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '28px 32px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: 140, width: 130, height: 130, borderRadius: '50%', background: 'rgba(59,130,246,0.12)' }} />
          <div style={{ position: 'absolute', bottom: -25, right: 50, width: 90, height: 90, borderRadius: '50%', background: 'rgba(139,92,246,0.1)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '10px' }}>{p.full_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '22px', height: '2.5px', background: '#3b82f6', borderRadius: '2px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa', fontStyle: 'italic' }}>{cv.position}</div>
            </div>
            <SocialLinks p={p} style={{ color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', justifyContent: 'center' }}>
            {[{ icon: '✉', val: p.email }, { icon: '☎', val: p.phone }, { icon: '📍', val: p.location }, { icon: '🎂', val: p.birthdate }].filter(x => x.val).map((item, i) => (
              <div key={i} style={{ fontSize: '9.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ opacity: 0.7 }}>{item.icon}</span><span>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)' }} />

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', minHeight: '257mm' }}>
          {/* Left */}
          <div style={{ padding: '24px 20px 24px 32px', borderRight: '1px solid #f1f5f9' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={styles.sectionTitle}>{labels.summary}</div>
              <p style={{ margin: 0, color: '#374151', fontStyle: 'italic', lineHeight: 1.7 }}>{cv.summary}</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={styles.sectionTitle}>{labels.exp}</div>
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '18px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{exp.position}</div>
                    <div style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '8px' }}>{exp.start_date} – {exp.end_date}</div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#2563eb', fontWeight: 600, margin: '2px 0 5px' }}>{exp.company}<span style={{ color: '#9ca3af', fontWeight: 400 }}> · {exp.location}</span></div>
                  <p style={{ margin: '0 0 6px', color: '#52525b', lineHeight: 1.65 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && <ul style={{ margin: 0, paddingLeft: '14px', color: '#6b7280' }}>{exp.achievements.map((a, j) => <li key={j} style={{ marginBottom: '2px' }}>{a}</li>)}</ul>}
                </div>
              ))}
            </div>
            <div>
              <div style={styles.sectionTitle}>{labels.portfolio}</div>
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '14px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: '11px', color: '#111827' }}>{pj.name}</div>
                    {pj.role && <span style={{ fontSize: '8.5px', color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '1px 7px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '6px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '3px 0 5px', color: '#52525b', lineHeight: 1.6 }}>{pj.description}</p>
                  <div>{pj.technologies?.map((t, ti) => <span key={ti} style={styles.tag}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ padding: '24px 28px 24px 20px', background: '#fafbff' }}>
            <div style={{ marginBottom: '26px' }}>
              <div style={styles.sectionTitle}>{labels.skills}</div>
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '13px' }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9ca3af', marginBottom: '5px' }}>{CATEGORY_LABELS[cat] || cat}</div>
                  <div>{names.map((n, i) => <span key={i} style={styles.pill}>{n}</span>)}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={styles.sectionTitle}>{labels.edu}</div>
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#111827', marginBottom: '2px' }}>{edu.institution}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{edu.field_of_study}</div>
                  {edu.gpa && <div style={{ display: 'inline-block', marginTop: '5px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '1px 8px', fontSize: '9px', fontWeight: 700 }}>GPA {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '8px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#9ca3af', background: '#fafbff' }}>
          <span>{p.email}</span>
          <span style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.5px' }}>{p.full_name?.toUpperCase()} — {cv.position?.toUpperCase()}</span>
          <span>{p.phone}</span>
        </div>
      </div>
    );
  }
);
CVTemplateModern.displayName = 'CVTemplateModern';

// ─────────────────────────────────────────────────────────────
// TEMPLATE 2: MINIMAL (Clean, simple, ATS-friendly)
// ─────────────────────────────────────────────────────────────
export const CVTemplateMinimal = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);

    const HR = () => <hr style={{ border: 'none', borderTop: '1.5px solid #e5e7eb', margin: '0 0 14px' }} />;
    const SecTitle = ({ children }: { children: string }) => (
      <div style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2.5px', color: '#111827', margin: '0 0 10px' }}>{children}</div>
    );

    return (
      <div ref={ref} style={{ fontFamily: "'Inter', Arial, sans-serif", background: '#fff', color: '#111827', fontSize: '10px', lineHeight: 1.6, width: '210mm', padding: '0' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* Header */}
        <div style={{ padding: '36px 40px 24px', borderBottom: '2px solid #111827' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '8px', color: '#111827' }}>{p.full_name}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', letterSpacing: '0.5px' }}>{cv.position}</div>
          <SocialLinks p={p} style={{ color: '#374151', marginBottom: '8px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {[p.email, p.phone, p.location, p.birthdate].filter(Boolean).map((val, i) => (
              <span key={i} style={{ fontSize: '9px', color: '#374151' }}>{val}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px', minHeight: '257mm' }}>
          {/* Left */}
          <div>
            {cv.summary && (
              <div style={{ marginBottom: '22px' }}>
                <SecTitle>{labels.summary}</SecTitle>
                <HR />
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.75 }}>{cv.summary}</p>
              </div>
            )}
            <div style={{ marginBottom: '22px' }}>
              <SecTitle>{labels.exp}</SecTitle>
              <HR />
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '11px' }}>{exp.position}</span>
                    <span style={{ fontSize: '9px', color: '#6b7280' }}>{exp.start_date} – {exp.end_date}</span>
                  </div>
                  <div style={{ color: '#374151', fontSize: '10px', margin: '2px 0 5px' }}>{exp.company} · {exp.location}</div>
                  <p style={{ margin: '0 0 5px', color: '#6b7280', lineHeight: 1.65 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '14px', color: '#6b7280' }}>
                      {exp.achievements.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.portfolio}</SecTitle>
              <HR />
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '10.5px' }}>{pj.name}</span>
                    {pj.role && <span style={{ fontSize: '8px', color: '#111827', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '3px', padding: '1px 6px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '6px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '2px 0 4px', color: '#6b7280', lineHeight: 1.5 }}>{pj.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {pj.technologies?.map((t, ti) => (
                      <span key={ti} style={{ fontSize: '8.5px', background: '#f3f4f6', padding: '1px 6px', borderRadius: '3px', color: '#374151', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ marginBottom: '22px' }}>
              <SecTitle>{labels.skills}</SecTitle>
              <HR />
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#374151', marginBottom: '3px', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>{CATEGORY_LABELS[cat] || cat}</div>
                  <div style={{ color: '#6b7280', fontSize: '9.5px' }}>{names.join(', ')}</div>
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.edu}</SecTitle>
              <HR />
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '10.5px' }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280' }}>{edu.field_of_study}</div>
                  {edu.gpa && <div style={{ fontSize: '9px', color: '#374151', marginTop: '2px' }}>GPA: {edu.gpa}</div>}
                  {edu.graduation_date && <div style={{ fontSize: '9px', color: '#9ca3af' }}>{edu.graduation_date}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CVTemplateMinimal.displayName = 'CVTemplateMinimal';

// ─────────────────────────────────────────────────────────────
// TEMPLATE 3: CREATIVE (Dark sidebar, vibrant accent)
// ─────────────────────────────────────────────────────────────
export const CVTemplateCreative = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);
    const ACC = '#c05b2a'; // warm accent
    const SIDE_BG = '#1a1a2e';
    const SIDE_TEXT = '#e2d4c0';

    const SecTitle = ({ children, dark = false }: { children: string; dark?: boolean }) => (
      <div style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '3px', color: dark ? SIDE_TEXT : ACC, borderLeft: `3px solid ${ACC}`, paddingLeft: '7px', margin: '0 0 12px' }}>{children}</div>
    );

    return (
      <div ref={ref} style={{ fontFamily: "'Inter', Arial, sans-serif", background: '#fff', color: '#111827', fontSize: '10.5px', lineHeight: 1.6, width: '210mm', display: 'grid', gridTemplateColumns: '38% 62%', minHeight: '297mm' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* LEFT SIDEBAR */}
        <div style={{ background: SIDE_BG, color: SIDE_TEXT, padding: '36px 24px' }}>
          {/* Name */}
          <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: `2px solid ${ACC}` }}>
            <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '8px', color: '#fff' }}>{p.full_name}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: ACC, letterSpacing: '0.5px', marginBottom: '8px' }}>{cv.position}</div>
            <SocialLinks p={p} style={{ color: SIDE_TEXT }} />
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '28px' }}>
            <SecTitle dark>Liên hệ</SecTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[{ label: '✉', val: p.email }, { label: '☎', val: p.phone }, { label: '📍', val: p.location }, { label: '🎂', val: p.birthdate }].filter(x => x.val).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '9.5px' }}>
                  <span style={{ color: ACC }}>{item.label}</span>
                  <span style={{ color: '#c8b8a2', wordBreak: 'break-all' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '28px' }}>
            <SecTitle dark>{labels.skills}</SecTitle>
            {Object.entries(skills).map(([cat, names]) => (
              <div key={cat} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '1.2px', marginBottom: '5px' }}>{CATEGORY_LABELS[cat] || cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {names.map((n, i) => (
                    <span key={i} style={{ fontSize: '8.5px', background: 'rgba(192,91,42,0.15)', border: `1px solid rgba(192,91,42,0.4)`, color: '#e8c9a0', borderRadius: '3px', padding: '1px 6px' }}>{n}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <SecTitle dark>{labels.edu}</SecTitle>
            {(p.education || []).map((edu) => (
              <div key={edu.id} style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#fff' }}>{edu.institution}</div>
                <div style={{ fontSize: '9.5px', color: '#9ca3af', margin: '2px 0' }}>{edu.field_of_study}</div>
                {edu.gpa && <div style={{ fontSize: '8.5px', color: ACC }}>GPA {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN */}
        <div style={{ padding: '36px 32px' }}>
          {/* Summary */}
          {cv.summary && (
            <div style={{ marginBottom: '26px', padding: '14px 18px', background: '#fdf8f3', borderLeft: `4px solid ${ACC}`, borderRadius: '0 8px 8px 0' }}>
              <SecTitle>{labels.summary}</SecTitle>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.75, fontStyle: 'italic' }}>{cv.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div style={{ marginBottom: '26px' }}>
            <SecTitle>{labels.exp}</SecTitle>
            {(p.experiences || []).map((exp, i, arr) => (
              <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '20px' : 0, position: 'relative', paddingLeft: '14px', borderLeft: '2px solid #e5e7eb' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', background: ACC, borderRadius: '50%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '11.5px', color: '#111827' }}>{exp.position}</span>
                  <span style={{ fontSize: '8.5px', background: '#fdf8f3', color: ACC, border: `1px solid ${ACC}40`, padding: '1px 7px', borderRadius: '10px', fontWeight: 600 }}>{exp.start_date} – {exp.end_date}</span>
                </div>
                <div style={{ fontSize: '9.5px', color: '#6b7280', margin: '2px 0 5px' }}>{exp.company} · {exp.location}</div>
                <p style={{ margin: '0 0 5px', color: '#4b5563', lineHeight: 1.65 }}>{exp.description}</p>
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
            <SecTitle>{labels.portfolio}</SecTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(p.projects || []).map((pj) => (
                <div key={pj.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#111827' }}>{pj.name}</div>
                    {pj.role && <span style={{ fontSize: '7.5px', color: ACC, background: `${ACC}15`, border: `1px solid ${ACC}40`, borderRadius: '3px', padding: '1px 5px', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '4px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '9.5px', lineHeight: 1.5 }}>{pj.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                    {pj.technologies?.map((t, ti) => (
                      <span key={ti} style={{ fontSize: '8px', background: `${ACC}15`, color: ACC, borderRadius: '2px', padding: '1px 5px', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CVTemplateCreative.displayName = 'CVTemplateCreative';

// ─────────────────────────────────────────────────────────────
// TEMPLATE 4: EXECUTIVE (Corporate, green accent, left-border)
// ─────────────────────────────────────────────────────────────
export const CVTemplateExecutive = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);
    const ACC = '#065f46'; // emerald-900
    const ACC2 = '#10b981'; // emerald-500

    const SecTitle = ({ children }: { children: string }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 14px' }}>
        <div style={{ width: '4px', height: '18px', background: ACC, borderRadius: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2.5px', color: ACC }}>{children}</span>
      </div>
    );

    return (
      <div ref={ref} style={{ fontFamily: "'Inter', Arial, sans-serif", background: '#fff', color: '#111827', fontSize: '10.5px', lineHeight: 1.6, width: '210mm' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* Header */}
        <div style={{ padding: '32px 36px 28px', borderTop: `6px solid ${ACC}`, background: '#f0fdf4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', color: '#064e3b', lineHeight: 1.1, marginBottom: '6px' }}>{p.full_name}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: ACC2, letterSpacing: '0.3px', marginBottom: '6px' }}>{cv.position}</div>
              <SocialLinks p={p} style={{ color: '#374151' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
              {[{ v: p.email, icon: '✉' }, { v: p.phone, icon: '☎' }, { v: p.location, icon: '📍' }, { v: p.birthdate, icon: '🎂' }].filter(x => x.v).map((x, i) => (
                <div key={i} style={{ fontSize: '9px', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '8px', opacity: 0.6 }}>{x.icon}</span>
                  <span>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', minHeight: '257mm' }}>
          {/* Left */}
          <div style={{ padding: '26px 22px 26px 36px', borderRight: '1px solid #d1fae5' }}>
            {cv.summary && (
              <div style={{ marginBottom: '22px', padding: '12px 16px', background: '#f0fdf4', borderRadius: '6px', borderLeft: `3px solid ${ACC2}` }}>
                <div style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2px', color: ACC, marginBottom: '8px' }}>{labels.summary}</div>
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.75 }}>{cv.summary}</p>
              </div>
            )}
            <div style={{ marginBottom: '22px' }}>
              <SecTitle>{labels.exp}</SecTitle>
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '18px' : 0, paddingBottom: i < arr.length - 1 ? '18px' : 0, borderBottom: i < arr.length - 1 ? '1px solid #d1fae5' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '11.5px', color: '#111827' }}>{exp.position}</span>
                    <span style={{ fontSize: '8.5px', color: '#fff', background: ACC, padding: '1px 8px', borderRadius: '10px', fontWeight: 600 }}>{exp.start_date} – {exp.end_date}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: ACC2, fontWeight: 600, margin: '3px 0 6px' }}>{exp.company}<span style={{ color: '#9ca3af', fontWeight: 400 }}> · {exp.location}</span></div>
                  <p style={{ margin: '0 0 5px', color: '#52525b', lineHeight: 1.65 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && <ul style={{ margin: 0, paddingLeft: '14px', color: '#6b7280' }}>{exp.achievements.map((a, j) => <li key={j} style={{ marginBottom: '2px' }}>{a}</li>)}</ul>}
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.portfolio}</SecTitle>
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '10.5px', color: '#064e3b' }}>{pj.name}</span>
                    {pj.role && <span style={{ fontSize: '8px', color: ACC, background: '#ecfdf5', border: `1px solid ${ACC2}40`, borderRadius: '3px', padding: '1px 6px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '6px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '2px 0 4px', color: '#6b7280', lineHeight: 1.5 }}>{pj.description}</p>
                  <div>{pj.technologies?.map((t, ti) => <span key={ti} style={{ display: 'inline-block', fontSize: '8.5px', background: '#ecfdf5', color: ACC, border: `1px solid ${ACC2}40`, borderRadius: '3px', padding: '1px 7px', margin: '1px 3px 1px 0', fontWeight: 600 }}>{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ padding: '26px 28px 26px 22px', background: '#fafffe' }}>
            <div style={{ marginBottom: '22px' }}>
              <SecTitle>{labels.skills}</SecTitle>
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#9ca3af', marginBottom: '4px' }}>{CATEGORY_LABELS[cat] || cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>{names.map((n, i) => <span key={i} style={{ fontSize: '8.5px', background: '#ecfdf5', color: ACC, border: `1px solid #6ee7b740`, borderRadius: '4px', padding: '2px 8px', fontWeight: 500 }}>{n}</span>)}</div>
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.edu}</SecTitle>
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '14px', padding: '10px 12px', background: '#f0fdf4', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#064e3b' }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280', margin: '2px 0' }}>{edu.field_of_study}</div>
                  {edu.gpa && <div style={{ fontSize: '9px', fontWeight: 700, color: ACC2 }}>GPA {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CVTemplateExecutive.displayName = 'CVTemplateExecutive';

// ─────────────────────────────────────────────────────────────
// TEMPLATE 5: TECH (Developer, dark top bar, monospace accents)
// ─────────────────────────────────────────────────────────────
export const CVTemplateTech = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);
    const BG_DARK = '#0d1117';
    const ACC = '#58a6ff';   // github blue
    const ACC2 = '#3fb950';  // github green

    const SecTitle = ({ children }: { children: string }) => (
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 700, color: ACC2, margin: '0 0 12px', letterSpacing: '1px' }}>
        <span style={{ color: ACC, marginRight: '6px' }}>{'>'}</span>{children.toUpperCase()}
      </div>
    );

    return (
      <div ref={ref} style={{ fontFamily: "'Inter', Arial, sans-serif", background: '#fff', color: '#24292f', fontSize: '10.5px', lineHeight: 1.6, width: '210mm' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* Dark header bar */}
        <div style={{ background: BG_DARK, padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '9px', color: ACC2, marginBottom: '6px', letterSpacing: '1px' }}>$ whoami</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{p.full_name}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color: ACC, marginTop: '5px', marginBottom: '8px' }}>{cv.position}</div>
            <SocialLinks p={p} style={{ color: '#8b949e', fontFamily: "'Courier New', monospace" }} />
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[p.email, p.phone, p.location, p.birthdate].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontFamily: "'Courier New', monospace", fontSize: '8.5px', color: '#8b949e' }}>{v}</div>
            ))}
          </div>
        </div>
        {/* Colorful accent bar */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${ACC2}, ${ACC}, #f778ba, ${ACC2})` }} />

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', minHeight: '257mm' }}>
          {/* Left */}
          <div style={{ padding: '22px 20px 22px 36px', borderRight: '1px solid #e5e7eb' }}>
            {cv.summary && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f6f8fa', borderLeft: `3px solid ${ACC}`, borderRadius: '0 6px 6px 0', fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#374151', lineHeight: 1.7 }}>
                {cv.summary}
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <SecTitle>{labels.exp}</SecTitle>
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '16px' : 0, paddingLeft: '12px', borderLeft: '2px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '11.5px', color: '#111827' }}>{exp.position}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', color: ACC2, background: '#f0fff4', border: `1px solid ${ACC2}50`, padding: '1px 6px', borderRadius: '3px' }}>{exp.start_date} → {exp.end_date}</span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: ACC, fontWeight: 600, margin: '2px 0 5px' }}>{exp.company} <span style={{ color: '#9ca3af', fontWeight: 400 }}>@ {exp.location}</span></div>
                  <p style={{ margin: '0 0 5px', color: '#52525b', lineHeight: 1.65 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && <ul style={{ margin: 0, paddingLeft: '14px', color: '#6b7280' }}>{exp.achievements.map((a, j) => <li key={j} style={{ marginBottom: '2px' }}>{a}</li>)}</ul>}
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.portfolio}</SecTitle>
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '10.5px', color: '#0d1117' }}>{pj.name}</span>
                    {pj.role && <span style={{ fontFamily: "'Courier New', monospace", fontSize: '7.5px', color: ACC2, background: '#f0fff4', border: `1px solid ${ACC2}50`, borderRadius: '3px', padding: '1px 6px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '6px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '2px 0 4px', color: '#6b7280', lineHeight: 1.5 }}>{pj.description}</p>
                  <div style={{ marginBottom: '4px' }}>{pj.technologies?.map((t, ti) => <span key={ti} style={{ display: 'inline-block', fontFamily: "'Courier New', monospace", fontSize: '8px', background: BG_DARK, color: ACC2, borderRadius: '3px', padding: '1px 7px', margin: '1px 3px 1px 0', fontWeight: 600 }}>{t}</span>)}</div>
                  {(pj.live_url || pj.github_url) && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {pj.live_url && (
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', color: ACC, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span style={{ color: ACC2, fontWeight: 700 }}>🔗</span> {pj.live_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </span>
                      )}
                      {pj.github_url && (
                        <span style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', color: '#8b949e', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span style={{ fontWeight: 700 }}>⌥</span> {pj.github_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ padding: '22px 28px 22px 20px', background: '#f6f8fa' }}>
            <div style={{ marginBottom: '22px' }}>
              <SecTitle>{labels.skills}</SecTitle>
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '12px' }}>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', color: '#9ca3af', marginBottom: '5px' }}># {CATEGORY_LABELS[cat] || cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>{names.map((n, i) => <span key={i} style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', background: BG_DARK, color: '#c9d1d9', borderRadius: '3px', padding: '2px 7px' }}>{n}</span>)}</div>
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.edu}</SecTitle>
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px', padding: '10px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#24292f' }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280', margin: '2px 0' }}>{edu.field_of_study}</div>
                  {edu.gpa && <div style={{ fontFamily: "'Courier New', monospace", fontSize: '8.5px', color: ACC2 }}>gpa: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CVTemplateTech.displayName = 'CVTemplateTech';

// ─────────────────────────────────────────────────────────────
// TEMPLATE 6: ELEGANT (Serif-inspired, gold accent, premium)
// ─────────────────────────────────────────────────────────────
export const CVTemplateElegant = React.forwardRef<HTMLDivElement, CVTemplateProps>(
  ({ cv, lang }, ref) => {
    const p = cv.profiles;
    const labels = LABELS[lang];
    const skills = groupSkills(p.skills || []);
    const GOLD = '#b8860b';   // dark goldenrod
    const GOLD2 = '#d4a017';  // lighter gold
    const CREAM = '#fdf6e3';  // cream

    const SecTitle = ({ children }: { children: string }) => (
      <div style={{ margin: '0 0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          <span style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '3px', color: GOLD }}>{children}</span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(270deg, ${GOLD}, transparent)` }} />
        </div>
      </div>
    );

    return (
      <div ref={ref} style={{ fontFamily: "Georgia, 'Times New Roman', serif", background: '#fff', color: '#2c2416', fontSize: '10.5px', lineHeight: 1.65, width: '210mm' }}>
        <style>{`@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>

        {/* Header */}
        <div style={{ background: CREAM, padding: '40px 40px 30px', textAlign: 'center', borderBottom: `2px solid ${GOLD2}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${GOLD}, ${GOLD2}, ${GOLD})` }} />
          {/* Decorative divider */}
          <div style={{ fontSize: '9px', color: GOLD, letterSpacing: '4px', marginBottom: '12px', opacity: 0.6 }}>✦ ✦ ✦</div>
          <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '3px', color: '#1a1008', lineHeight: 1.1, marginBottom: '8px', fontFamily: "Georgia, serif" }}>{p.full_name?.toUpperCase()}</div>
          <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2.5px', marginBottom: '10px', fontStyle: 'italic' }}>{cv.position}</div>
          <SocialLinks p={p} style={{ justifyContent: 'center', color: '#6b5a3e', marginBottom: '10px' }} />
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {[p.email, p.phone, p.location, p.birthdate].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: '9px', color: '#6b5a3e', letterSpacing: '0.3px' }}>{v}</span>
            ))}
          </div>
          <div style={{ fontSize: '9px', color: GOLD, letterSpacing: '4px', marginTop: '14px', opacity: 0.6 }}>✦ ✦ ✦</div>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', minHeight: '247mm' }}>
          {/* Left */}
          <div style={{ padding: '28px 22px 28px 40px', borderRight: `1px solid ${GOLD2}50` }}>
            {cv.summary && (
              <div style={{ marginBottom: '24px' }}>
                <SecTitle>{labels.summary}</SecTitle>
                <p style={{ margin: 0, color: '#4a3926', fontStyle: 'italic', lineHeight: 1.85, fontSize: '10.5px' }}>&ldquo;{cv.summary}&rdquo;</p>
              </div>
            )}
            <div style={{ marginBottom: '24px' }}>
              <SecTitle>{labels.exp}</SecTitle>
              {(p.experiences || []).map((exp, i, arr) => (
                <div key={exp.id} style={{ marginBottom: i < arr.length - 1 ? '18px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '11.5px', color: '#1a1008', fontFamily: "Georgia, serif" }}>{exp.position}</span>
                    <span style={{ fontSize: '8.5px', color: GOLD, fontStyle: 'italic' }}>{exp.start_date} — {exp.end_date}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: GOLD2, fontWeight: 600, margin: '2px 0 5px', fontStyle: 'italic' }}>{exp.company}<span style={{ color: '#9c8b74', fontWeight: 400 }}>, {exp.location}</span></div>
                  <p style={{ margin: '0 0 5px', color: '#52442e', lineHeight: 1.7 }}>{exp.description}</p>
                  {exp.achievements?.length > 0 && <ul style={{ margin: 0, paddingLeft: '14px', color: '#7a6a54' }}>{exp.achievements.map((a, j) => <li key={j} style={{ marginBottom: '2px', listStyleType: '"◆ "' }}>{a}</li>)}</ul>}
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.portfolio}</SecTitle>
              {(p.projects || []).map((pj, i, arr) => (
                <div key={pj.id} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '10.5px', color: '#1a1008', fontFamily: "Georgia, serif" }}>{pj.name}</span>
                    {pj.role && <span style={{ fontSize: '8px', color: GOLD, border: `1px solid ${GOLD2}80`, borderRadius: '2px', padding: '1px 6px', fontStyle: 'italic', whiteSpace: 'nowrap', marginLeft: '6px' }}>{pj.role}</span>}
                  </div>
                  <p style={{ margin: '2px 0 4px', color: '#7a6a54', lineHeight: 1.6 }}>{pj.description}</p>
                  <div>{pj.technologies?.map((t, ti) => <span key={ti} style={{ display: 'inline-block', fontSize: '8.5px', border: `1px solid ${GOLD2}80`, color: GOLD, borderRadius: '2px', padding: '1px 7px', margin: '1px 3px 1px 0' }}>{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ padding: '28px 36px 28px 22px', background: CREAM }}>
            <div style={{ marginBottom: '24px' }}>
              <SecTitle>{labels.skills}</SecTitle>
              {Object.entries(skills).map(([cat, names]) => (
                <div key={cat} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: GOLD, textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '5px', fontStyle: 'italic' }}>{CATEGORY_LABELS[cat] || cat}</div>
                  <div style={{ color: '#52442e', fontSize: '9.5px', lineHeight: 1.6 }}>{names.join(' · ')}</div>
                </div>
              ))}
            </div>
            <div>
              <SecTitle>{labels.edu}</SecTitle>
              {(p.education || []).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#1a1008', fontFamily: "Georgia, serif" }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#7a6a54', fontStyle: 'italic', margin: '2px 0' }}>{edu.field_of_study}</div>
                  {edu.gpa && <div style={{ fontSize: '9px', color: GOLD, fontWeight: 700 }}>GPA {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: CREAM, borderTop: `1px solid ${GOLD2}50`, padding: '8px 40px', display: 'flex', justifyContent: 'center', fontSize: '7.5px', color: GOLD, letterSpacing: '2px', opacity: 0.7 }}>
          {p.full_name?.toUpperCase()} · {cv.position?.toUpperCase()}
        </div>
      </div>
    );
  }
);
CVTemplateElegant.displayName = 'CVTemplateElegant';

// ─────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────
export const CV_TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Header tối gradient, 2 cột, chuyên nghiệp',
    accent: '#2563eb',
    component: CVTemplateModern,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Đơn giản, trắng sạch, thân thiện ATS',
    accent: '#111827',
    component: CVTemplateMinimal,
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Sidebar tối, điểm nhấn warm, sáng tạo',
    accent: '#c05b2a',
    component: CVTemplateCreative,
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Corporate xanh lá, đường viền accent, chuyên nghiệp cao cấp',
    accent: '#065f46',
    component: CVTemplateExecutive,
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Dark terminal header, monospace, dành cho dev',
    accent: '#58a6ff',
    component: CVTemplateTech,
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Serif typography, gold accent, sang trọng tinh tế',
    accent: '#b8860b',
    component: CVTemplateElegant,
  },
} as const;

export type TemplateId = keyof typeof CV_TEMPLATES;

// Dynamic renderer
export const CVTemplateRenderer = React.forwardRef<HTMLDivElement, CVTemplateProps & { templateId?: TemplateId }>(
  ({ cv, lang, templateId = 'modern' }, ref) => {
    const Tpl = CV_TEMPLATES[templateId]?.component ?? CVTemplateModern;
    return <Tpl ref={ref} cv={cv} lang={lang} />;
  }
);
CVTemplateRenderer.displayName = 'CVTemplateRenderer';
