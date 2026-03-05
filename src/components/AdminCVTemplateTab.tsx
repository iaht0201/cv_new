import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { Download, Check, Eye, X, Pencil, Trash2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { CVVariant } from '../types/database';
import { CV_TEMPLATES, CVTemplateRenderer, TemplateId } from './cv-templates';
import { supabase } from '../lib/supabase';
import { G, C } from '../lib/theme';

// ─── Cloning util ─────────────────────────────────────────────
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

// ─── Stable form primitives (outside any component) ───────────
const FInput = ({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <label style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8' }}>
      {label}
    </label>
    <input
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 12px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px',
        background: 'rgba(255,255,255,0.07)', color: '#e2e8f0',
        outline: 'none', transition: 'border-color .2s',
        fontFamily: 'Inter, sans-serif',
      }}
      onFocus={e => (e.target.style.borderColor = 'rgba(99,179,237,0.6)')}
      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
    />
  </div>
);

const FTextarea = ({
  label, value, onChange, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <label style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8' }}>
      {label}
    </label>
    <textarea
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      style={{
        width: '100%', padding: '8px 12px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px',
        background: 'rgba(255,255,255,0.07)', color: '#e2e8f0',
        outline: 'none', resize: 'none', lineHeight: 1.6,
        fontFamily: 'Inter, sans-serif', transition: 'border-color .2s',
      }}
      onFocus={e => (e.target.style.borderColor = 'rgba(99,179,237,0.6)')}
      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
    />
  </div>
);

// Collapsible section — stable outside component so React doesn't remount
const EditorSection = ({
  title, children, defaultOpen = false,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', marginBottom: '8px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
          border: 'none', color: '#cbd5e1', fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '1.5px',
        }}
      >
        {title}
        {open
          ? <ChevronUp style={{ width: '14px', height: '14px', opacity: 0.5 }} />
          : <ChevronDown style={{ width: '14px', height: '14px', opacity: 0.5 }} />
        }
      </button>
      {open && (
        <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Editor Panel ─────────────────────────────────────────────
const CVEditorPanel = ({
  draft, onChange, onReset,
}: {
  draft: CVVariant;
  onChange: (d: CVVariant) => void;
  onReset: () => void;
}) => {
  // Generic deep-path updater
  const upd = (path: string, val: any) => {
    const next = deepClone(draft);
    const parts = path.split('.');
    let cur: any = next;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = val;
    onChange(next);
  };

  const p = draft.profiles;

  const updExp = (i: number, key: string, val: any) => {
    const arr = deepClone((p.experiences || []) as any[]);
    arr[i][key] = val;
    upd('profiles.experiences', arr);
  };

  const updProj = (i: number, key: string, val: any) => {
    const arr = deepClone((p.projects || []) as any[]);
    arr[i][key] = val;
    upd('profiles.projects', arr);
  };

  const updSkill = (i: number, key: string, val: any) => {
    const arr = deepClone((p.skills || []) as any[]);
    arr[i][key] = val;
    upd('profiles.skills', arr);
  };

  const updEdu = (i: number, key: string, val: any) => {
    const arr = deepClone((p.education || []) as any[]);
    arr[i][key] = val;
    upd('profiles.education', arr);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1a2236' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          ✏️ Chỉnh nội dung
        </span>
        <button
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', fontSize: '10px', cursor: 'pointer', fontWeight: 700 }}
          title="Reset về dữ liệu gốc"
        >
          <RefreshCw style={{ width: '12px', height: '12px' }} /> Reset
        </button>
      </div>

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>

        <EditorSection title="Thông tin cơ bản" defaultOpen>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <FInput label="Họ và tên" value={p.full_name || ''} onChange={v => upd('profiles.full_name', v)} />
            <FInput label="Vị trí" value={draft.position || ''} onChange={v => upd('position', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <FInput label="Email" value={p.email || ''} onChange={v => upd('profiles.email', v)} />
            <FInput label="Điện thoại" value={p.phone || ''} onChange={v => upd('profiles.phone', v)} />
          </div>
          <FInput label="Địa chỉ" value={p.location || ''} onChange={v => upd('profiles.location', v)} />
          <FInput label="Ngày sinh (vd: 01/01/2000)" value={p.birthdate || ''} onChange={v => upd('profiles.birthdate', v)} />
        </EditorSection>

        <EditorSection title="Tóm tắt" defaultOpen>
          <FTextarea label="Summary" value={draft.summary || ''} onChange={v => upd('summary', v)} rows={5} />
        </EditorSection>

        <EditorSection title={`Kinh nghiệm (${(p.experiences || []).length})`}>
          {(p.experiences || []).map((exp: any, i: number) => (
            <div key={exp.id || i} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>#{i + 1}</span>
                <button onClick={() => { const arr = deepClone((p.experiences || []) as any[]); arr.splice(i, 1); upd('profiles.experiences', arr); }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FInput label="Chức vụ" value={exp.position || ''} onChange={v => updExp(i, 'position', v)} />
                <FInput label="Công ty" value={exp.company || ''} onChange={v => updExp(i, 'company', v)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FInput label="Bắt đầu" value={exp.start_date || ''} onChange={v => updExp(i, 'start_date', v)} />
                <FInput label="Kết thúc" value={exp.end_date || ''} onChange={v => updExp(i, 'end_date', v)} />
              </div>
              <FTextarea label="Mô tả" value={exp.description || ''} rows={2} onChange={v => updExp(i, 'description', v)} />
              <FInput label="Thành tựu (cách nhau bởi dấu phẩy)" value={(exp.achievements || []).join(', ')} onChange={v => updExp(i, 'achievements', v.split(',').map((s: string) => s.trim()).filter(Boolean))} />
            </div>
          ))}
        </EditorSection>

        <EditorSection title={`Dự án (${(p.projects || []).length})`}>
          {(p.projects || []).map((pj: any, i: number) => (
            <div key={pj.id || i} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>#{i + 1}</span>
                <button onClick={() => { const arr = deepClone((p.projects || []) as any[]); arr.splice(i, 1); upd('profiles.projects', arr); }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                </button>
              </div>
              <FInput label="Tên dự án" value={pj.name || ''} onChange={v => updProj(i, 'name', v)} />
              <FTextarea label="Mô tả" value={pj.description || ''} rows={2} onChange={v => updProj(i, 'description', v)} />
              <FInput label="Công nghệ (dấu phẩy)" value={(pj.technologies || []).join(', ')} onChange={v => updProj(i, 'technologies', v.split(',').map((s: string) => s.trim()).filter(Boolean))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FInput label="Link Live" value={pj.live_url || ''} onChange={v => updProj(i, 'live_url', v)} />
                <FInput label="Github" value={pj.github_url || ''} onChange={v => updProj(i, 'github_url', v)} />
              </div>
            </div>
          ))}
        </EditorSection>

        <EditorSection title={`Kỹ năng (${(p.skills || []).length})`}>
          {(p.skills || []).map((sk: any, i: number) => (
            <div key={sk.id || i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                value={sk.category || ''}
                onChange={e => updSkill(i, 'category', e.target.value)}
                style={{ padding: '6px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '10px', fontWeight: 700 }}
              >
                <option value="programming_languages">Ngôn ngữ</option>
                <option value="frameworks">Framework</option>
                <option value="databases">Database</option>
                <option value="cloud_platforms">Cloud</option>
                <option value="tools">Công cụ</option>
                <option value="ai_automation">AI & Auto</option>
                <option value="soft_skills">Kỹ năng mềm</option>
              </select>
              <input
                value={sk.name || ''}
                onChange={e => updSkill(i, 'name', e.target.value)}
                style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', fontSize: '12px' }}
              />
              <button onClick={() => { const arr = deepClone((p.skills || []) as any[]); arr.splice(i, 1); upd('profiles.skills', arr); }}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                <Trash2 style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
          ))}
        </EditorSection>

        <EditorSection title={`Học vấn (${(p.education || []).length})`}>
          {(p.education || []).map((edu: any, i: number) => (
            <div key={edu.id || i} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <FInput label="Trường" value={edu.institution || ''} onChange={v => updEdu(i, 'institution', v)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FInput label="Ngành học" value={edu.field_of_study || ''} onChange={v => updEdu(i, 'field_of_study', v)} />
                <FInput label="GPA" value={edu.gpa || ''} onChange={v => updEdu(i, 'gpa', v)} />
              </div>
            </div>
          ))}
        </EditorSection>

      </div>
    </div>
  );
};

// ─── Main Tab ──────────────────────────────────────────────────
interface Props {
  cv: CVVariant;
  slug: string;
  lang: 'vi' | 'en';
  onTemplateChange: (id: TemplateId) => void;
}

export const AdminCVTemplateTab = ({ cv, slug, lang, onTemplateChange }: Props) => {
  const [selectedId, setSelectedId] = useState<TemplateId>(
    ((cv as any).template_id as TemplateId) || 'modern'
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);
  const [draft, setDraft] = useState<CVVariant | null>(null);
  // Draft save state
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(!!(cv as any).cv_data_override);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `CV_${draft?.profiles?.full_name?.replace(/\s/g, '_') || 'CV'}_${previewId || selectedId}`,
    pageStyle: `@page { size: A4; margin: 0mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`,
  });

  // Open editor: prefer saved draft JSON, fallback to live cv data
  const openPreview = (id: TemplateId) => {
    setPreviewId(id);
    const saved = (cv as any).cv_data_override;
    setDraft(saved ? deepClone(saved) : deepClone(cv));
  };

  // Save draft JSON to cv_variants.cv_data_override
  const saveDraft = async () => {
    if (!supabase || !draft) return;
    setDraftSaving(true);
    try {
      const { error } = await supabase
        .from('cv_variants')
        .update({ cv_data_override: draft })
        .eq('slug', slug)
        .eq('language', lang);
      if (error) throw error;
      // Patch the cv prop in memory too
      (cv as any).cv_data_override = deepClone(draft);
      setHasSavedDraft(true);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    } catch (err: any) {
      alert('Lỗi lưu: ' + err.message);
    } finally {
      setDraftSaving(false);
    }
  };

  // Clear saved draft (reset to live profile data)
  const clearDraft = async () => {
    if (!supabase) return;
    try {
      await supabase
        .from('cv_variants')
        .update({ cv_data_override: null })
        .eq('slug', slug)
        .eq('language', lang);
      (cv as any).cv_data_override = null;
      setHasSavedDraft(false);
      setDraft(deepClone(cv));
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleSaveTemplate = async (id: TemplateId) => {
    setSelectedId(id);
    onTemplateChange(id);
    if (!supabase) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('cv_variants')
        .update({ template_id: id })
        .eq('slug', slug)
        .eq('language', lang);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tplList = Object.values(CV_TEMPLATES);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: C.foreground }}>
            MẪU <span style={{ color: C.accent }}>CV</span>
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs font-medium text-muted">Chọn mẫu · Sửa trước khi tải · Tải xuống PDF</p>
            {hasSavedDraft && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
                  ✓ Có bản nháp đã lưu
                </span>
                <button onClick={clearDraft} className="text-[9px] font-bold text-red-400 hover:text-red-600 transition-all underline">
                  Xóa bản nháp
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => openPreview(selectedId)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 shadow-lg"
          style={{ background: G.full }}
        >
          <Pencil className="w-4 h-4" />
          Sửa &amp; Tải CV ({CV_TEMPLATES[selectedId]?.name})
        </button>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-3 gap-5">
        {tplList.map(tpl => {
          const isActive = selectedId === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`relative rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer group ${isActive ? 'shadow-xl scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md'}`}
              style={{ borderColor: isActive ? tpl.accent : C.surfaceMid }}
              onClick={() => handleSaveTemplate(tpl.id as TemplateId)}
            >
              {isActive && (
                <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ background: tpl.accent }}>
                  {saving ? '…' : <Check className="w-3.5 h-3.5" />}
                </div>
              )}
              {/* Thumbnail */}
              <div className="h-44 overflow-hidden relative" style={{ background: '#f4f4f4' }}>
                <div className="pointer-events-none select-none" style={{ transform: 'scale(0.33)', transformOrigin: 'top left', width: '297mm' }}>
                  <CVTemplateRenderer cv={cv} lang={lang} templateId={tpl.id as TemplateId} />
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={e => { e.stopPropagation(); openPreview(tpl.id as TemplateId); }}
                    className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow"
                  >
                    <Pencil className="w-3 h-3" /> Sửa &amp; Tải
                  </button>
                </div>
              </div>
              {/* Label */}
              <div className="px-4 py-3 border-t" style={{ background: isActive ? `${tpl.accent}08` : '#fff', borderColor: isActive ? `${tpl.accent}30` : C.surfaceMid }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: tpl.accent }} />
                  <span className="text-sm font-black" style={{ color: C.foreground }}>{tpl.name}</span>
                </div>
                <p className="text-[10px]" style={{ color: C.muted }}>{tpl.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── EDITOR + PREVIEW MODAL ── */}
      {previewId && draft && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#0f172a', display: 'flex', flexDirection: 'column' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3fb950' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Chỉnh trước khi tải — <span style={{ color: '#58a6ff' }}>{CV_TEMPLATES[previewId]?.name}</span>
              </span>
              <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.07)', color: '#64748b', fontWeight: 600 }}>
                Không ảnh hưởng website
              </span>
              {hasSavedDraft && (
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(63,185,80,0.15)', color: '#3fb950', fontWeight: 700, border: '1px solid rgba(63,185,80,0.3)' }}>
                  ✓ Đang dùng bản nháp đã lưu
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Save draft */}
              <button
                onClick={saveDraft}
                disabled={draftSaving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '12px',
                  background: draftSaved ? 'rgba(63,185,80,0.15)' : 'rgba(255,255,255,0.07)',
                  color: draftSaved ? '#3fb950' : '#94a3b8',
                  fontSize: '11px', fontWeight: 700,
                  border: `1px solid ${draftSaved ? 'rgba(63,185,80,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  cursor: draftSaving ? 'wait' : 'pointer',
                  transition: 'all .25s',
                }}
              >
                {draftSaving ? 'Đang lưu…' : draftSaved ? '✓ Đã lưu!' : '💾 Lưu bản nháp'}
              </button>
              {/* Print */}
              <button
                onClick={() => handlePrint()}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #a07850, #c4622d)', color: '#fff', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                <Download style={{ width: '14px', height: '14px' }} /> Tải xuống PDF
              </button>
              <button
                onClick={() => { setPreviewId(null); setDraft(null); }}
                style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', cursor: 'pointer' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Body: Editor | Preview */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* LEFT: Editor */}
            <div style={{ width: '360px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <CVEditorPanel
                draft={draft}
                onChange={setDraft}
                onReset={() => setDraft(deepClone(cv))}
              />
            </div>

            {/* RIGHT: Live preview */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <CVTemplateRenderer ref={printRef} cv={draft} lang={lang} templateId={previewId} />
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
};
