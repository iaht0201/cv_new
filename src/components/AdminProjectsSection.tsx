import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, ExternalLink, Github, Pencil, X, Save, Trash2, Plus, Check,
} from 'lucide-react';
import { C, G } from '../lib/theme';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role?: string;
  start_date?: string;
  end_date?: string;
  live_url?: string;
  github_url?: string;
  order_index?: number;
  profile_id?: string;
}

interface Props {
  projects: Project[];
  profileId: string;
  newItems: Set<string>;
  onChange: (projects: Project[]) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSaved: () => void;
  onNewItemSaved: (id: string) => void;
}

// ─── Sortable Card ────────────────────────────────────────────────────────────
function SortableProjectCard({
  pj, idx, total, profileId, isNew,
  onChange, onDelete, onSaved, onNewItemSaved,
}: {
  pj: Project; idx: number; total: number; profileId: string; isNew: boolean;
  onChange: (updated: Project) => void;
  onDelete: () => void;
  onSaved: () => void;
  onNewItemSaved: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(isNew); // new items start expanded
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        profile_id: profileId,
        name: pj.name,
        description: pj.description,
        role: pj.role,
        start_date: pj.start_date,
        end_date: pj.end_date,
        live_url: pj.live_url,
        github_url: pj.github_url,
        technologies: pj.technologies,
        order_index: idx,
      };
      let error;
      if (isNew) {
        const { error: e } = await supabase.from('projects').insert([{ ...payload, id: pj.id }]);
        error = e;
        if (!e) onNewItemSaved(pj.id);
      } else {
        const { error: e } = await supabase.from('projects').update(payload).eq('id', pj.id);
        error = e;
      }
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setExpanded(false);
      onSaved();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof Project, val: any) => onChange({ ...pj, [key]: val });

  return (
    <div ref={setNodeRef} style={style as any} className="relative">
      {/* Card header — always visible */}
      <div
        className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden
          ${expanded ? 'border-accent/50 shadow-lg shadow-accent/5' : 'border-surface-mid hover:border-accent/30'}`}
      >
        {/* Compact preview row */}
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Drag handle */}
          <button
            {...attributes} {...listeners}
            className="p-1.5 text-muted/30 hover:text-muted cursor-grab active:cursor-grabbing shrink-0 touch-none"
            title="Kéo để sắp xếp"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Index badge */}
          <span
            className="text-[10px] font-black text-white w-6 h-6 rounded flex items-center justify-center shrink-0"
            style={{ background: idx % 2 === 0 ? G.accent : G.warm, fontFamily: 'Montserrat, sans-serif' }}
          >
            {String(idx + 1).padStart(2, '0')}
          </span>

          {/* Name + tech preview */}
          <div className="flex-grow min-w-0">
            <p className="text-sm font-black truncate tracking-tight" style={{ color: C.foreground }}>
              {pj.name || 'Dự án mới'}
            </p>
            <div className="flex gap-1.5 flex-wrap mt-1">
              {pj.technologies?.slice(0, 4).map((t, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full font-bold border"
                  style={{ background: C.surface, borderColor: C.surfaceMid, color: C.muted }}>
                  {t}
                </span>
              ))}
              {(pj.technologies?.length ?? 0) > 4 && (
                <span className="text-[9px] text-muted">+{pj.technologies!.length - 4}</span>
              )}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 shrink-0">
            {pj.live_url && (
              <a href={pj.live_url} target="_blank" rel="noreferrer"
                className="p-2 rounded-xl hover:bg-surface text-muted/40 hover:text-accent transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {pj.github_url && (
              <a href={pj.github_url} target="_blank" rel="noreferrer"
                className="p-2 rounded-xl hover:bg-surface text-muted/40 hover:text-accent transition-all">
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {saved && (
              <span className="p-2 text-green-500">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-xl transition-all ${expanded ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-accent'}`}
              title={expanded ? 'Thu gọn' : 'Chỉnh sửa'}
            >
              {expanded ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl bg-surface text-red-400 hover:bg-red-50 transition-all"
              title="Xóa"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded edit form */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2 space-y-4 border-t border-surface-mid">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-3">
                  <InlineInput label="Tên dự án" value={pj.name} onChange={v => update('name', v)} />
                  <InlineInput label="Vai trò" value={pj.role || ''} onChange={v => update('role', v)} />
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-3">
                  <InlineInput label="Bắt đầu" value={pj.start_date || ''} onChange={v => update('start_date', v)} />
                  <InlineInput label="Kết thúc" value={pj.end_date || ''} onChange={v => update('end_date', v)} />
                </div>
                {/* Description */}
                <InlineTextarea
                  label="Mô tả"
                  value={pj.description}
                  onChange={v => update('description', v)}
                />
                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-3">
                  <InlineInput label="Link Live" value={pj.live_url || ''} onChange={v => update('live_url', v)} />
                  <InlineInput label="Link Github" value={pj.github_url || ''} onChange={v => update('github_url', v)} />
                </div>
                {/* Technologies */}
                <InlineInput
                  label="Công nghệ (phẩy nhau)"
                  value={pj.technologies?.join(', ') || ''}
                  onChange={v => update('technologies', v.split(',').map(s => s.trim()).filter(Boolean))}
                />
                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{ background: G.full }}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'ĐANG LƯU...' : 'LƯU DỰ ÁN'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tiny sub-components ──────────────────────────────────────────────────────
const InlineInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-muted/50">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl border border-surface-mid text-xs font-bold outline-none focus:border-accent bg-surface/50 transition-all"
      style={{ color: C.foreground }}
    />
  </div>
);

const InlineTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-muted/50">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className="w-full px-3 py-2.5 rounded-xl border border-surface-mid text-xs font-medium leading-relaxed outline-none focus:border-accent bg-surface/50 transition-all resize-none"
      style={{ color: C.foreground }}
    />
  </div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────
export const AdminProjectsSection = ({
  projects, profileId, newItems, onChange, onDelete, onAdd, onSaved, onNewItemSaved,
}: Props) => {
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex(p => p.id === active.id);
    const newIdx = projects.findIndex(p => p.id === over.id);
    const reordered = arrayMove(projects, oldIdx, newIdx).map((p, i) => ({ ...p, order_index: i }));
    onChange(reordered);
  };

  const saveOrder = async () => {
    if (!supabase) return;
    setSavingOrder(true);
    try {
      // Batch update order_index for all non-new items
      await Promise.all(
        projects
          .filter(p => !newItems.has(p.id))
          .map((p, i) => supabase!.from('projects').update({ order_index: i }).eq('id', p.id))
      );
      setOrderSaved(true);
      setTimeout(() => setOrderSaved(false), 2000);
    } catch (err: any) {
      alert('Lỗi lưu thứ tự: ' + err.message);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: C.foreground }}>
            DỰ ÁN <span style={{ color: C.accent }}>PORTFOLIO</span>
          </h3>
          <p className="text-xs font-medium text-muted">Kéo ☰ để sắp xếp · Click ✏️ để chỉnh sửa</p>
        </div>
        <div className="flex gap-3">
          {/* Save order button */}
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-mid text-[10px] font-black uppercase tracking-widest transition-all hover:border-accent hover:text-accent disabled:opacity-50"
            style={{ color: orderSaved ? C.accent : C.muted }}
          >
            {orderSaved ? <Check className="w-3.5 h-3.5" /> : <GripVertical className="w-3.5 h-3.5" />}
            {savingOrder ? 'ĐANG LƯU...' : orderSaved ? 'ĐÃ LƯU THỨ TỰ' : 'LƯU THỨ TỰ'}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
            style={{ background: G.full }}
          >
            <Plus className="w-4 h-4" /> THÊM DỰ ÁN
          </button>
        </div>
      </div>

      {/* Drag & drop grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4">
            {projects.map((pj, idx) => (
              <SortableProjectCard
                key={pj.id}
                pj={pj}
                idx={idx}
                total={projects.length}
                profileId={profileId}
                isNew={newItems.has(pj.id)}
                onChange={updated => {
                  const newList = [...projects];
                  newList[idx] = updated;
                  onChange(newList);
                }}
                onDelete={() => onDelete(pj.id)}
                onSaved={onSaved}
                onNewItemSaved={onNewItemSaved}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projects.length === 0 && (
        <div className="text-center py-16 text-muted text-sm font-medium opacity-50">
          Chưa có dự án nào. Nhấn + thêm mới.
        </div>
      )}
    </motion.div>
  );
};
