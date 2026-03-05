import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CVVariant, Project, Experience, Skill, Education, Profile } from '../types/database';
import { AdminProjectsSection } from './AdminProjectsSection';
import { AdminCVTemplateTab } from './AdminCVTemplateTab';
import { 
  Settings, User, Briefcase, Check, AlertCircle,
  Code, Globe, X, ChevronRight, ChevronUp, ChevronDown, Plus, Trash2, UserCheck, Layout, GraduationCap, Save, FileText
} from 'lucide-react';
import { C, G } from '../lib/theme';

interface AdminViewProps {
  onClose: () => void;
  lang: 'vi' | 'en';
  slug: string;
}

export const AdminView = ({ onClose, lang, slug }: AdminViewProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'variants' | 'templates' | 'projects' | 'experience' | 'skills' | 'education'>('profile');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for all fields
  const [localData, setLocalData] = useState<CVVariant | null>(null);
  
  // Track which items are new (need INSERT) vs existing (need UPDATE)
  const [newItems, setNewItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [lang, slug]);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data: cvData, error } = await supabase
      .from('cv_variants')
      .select(`
        *,
        profiles (
          *,
          experiences (*, order_index),
          projects (*, order_index),
          skills (*, order_index),
          education (*, order_index)
        )
      `)
      .eq('slug', slug)
      .eq('language', lang)
      .single();

    if (!error && cvData) {
      // Sort nested arrays by order_index
      const d = cvData as any;
      if (d?.profiles) {
        const byOrder = (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0);
        if (d.profiles.projects)    d.profiles.projects.sort(byOrder);
        if (d.profiles.experiences) d.profiles.experiences.sort(byOrder);
        if (d.profiles.skills)      d.profiles.skills.sort(byOrder);
        if (d.profiles.education)   d.profiles.education.sort(byOrder);
      }
      setLocalData(d);
      setNewItems(new Set());
    }
    setLoading(false);
  };

  const handleUpdateLocal = (path: string, value: any) => {
    if (!localData) return;
    const newData = { ...localData };
    
    // Simple path resolver (only handles basic nesting for our schema)
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setLocalData(newData);
  };

  const saveToDB = async (table: string, id: string, payload: any, isNew: boolean) => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      let error;
      if (isNew) {
        const { error: err } = await supabase.from(table).insert([{ ...payload, id }]);
        error = err;
        if (!error) {
          const updatedNewItems = new Set(newItems);
          updatedNewItems.delete(id);
          setNewItems(updatedNewItems);
        }
      } else {
        const { error: err } = await supabase.from(table).update(payload).eq('id', id);
        error = err;
      }

      if (error) throw error;
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // cv_variants dùng slug + language làm key, không phải uuid
  const saveVariantToDB = async (payload: { position: string; summary: string }) => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('cv_variants')
        .update(payload)
        .eq('slug', slug)
        .eq('language', lang);
      if (error) throw error;
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = (type: 'projects' | 'experiences' | 'education' | 'skills') => {
    if (!localData?.profiles.id) return;
    const profileId = localData.profiles.id;
    const newId = crypto.randomUUID();
    
    const newItem: any = { id: newId, profile_id: profileId };
    
    if (type === 'projects') {
      Object.assign(newItem, { name: 'Dự án mới', description: '', technologies: [], role: '', start_date: '', end_date: '' });
      const projects = [...(localData.profiles.projects || []), newItem];
      handleUpdateLocal('profiles.projects', projects);
    } else if (type === 'experiences') {
      Object.assign(newItem, { company: 'Công ty mới', position: '', location: '', start_date: '', end_date: '', description: '', achievements: [] });
      const exps = [...(localData.profiles.experiences || []), newItem];
      handleUpdateLocal('profiles.experiences', exps);
    } else if (type === 'education') {
      Object.assign(newItem, { institution: 'Trường mới', field_of_study: '', graduation_date: '', gpa: '' });
      const edus = [...(localData.profiles.education || []), newItem];
      handleUpdateLocal('profiles.education', edus);
    } else if (type === 'skills') {
      Object.assign(newItem, { category: 'programming_languages', name: 'Kỹ năng mới' });
      const skills = [...(localData.profiles.skills || []), newItem];
      handleUpdateLocal('profiles.skills', skills);
    }

    setNewItems(prev => new Set(prev).add(newId));
    
    // Jump to the tab if not already there
    const tabMap: any = { projects: 'projects', experiences: 'experience', education: 'education', skills: 'skills' };
    setActiveTab(tabMap[type]);
  };

  const handleDelete = async (table: string, id: string, type: string) => {
    if (!supabase || !localData) return;
    if (!window.confirm('Xác nhận xóa?')) return;

    if (!newItems.has(id)) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        alert('Lỗi khi xóa khỏi DB: ' + error.message);
        return;
      }
    }

    // Remove from local state
    const newData = { ...localData };
    if (type === 'projects') newData.profiles.projects = (newData.profiles.projects || []).filter((i: any) => i.id !== id);
    if (type === 'experiences') newData.profiles.experiences = (newData.profiles.experiences || []).filter((i: any) => i.id !== id);
    if (type === 'education') newData.profiles.education = (newData.profiles.education || []).filter((i: any) => i.id !== id);
    if (type === 'skills') newData.profiles.skills = (newData.profiles.skills || []).filter((i: any) => i.id !== id);
    
    setLocalData(newData);
    const updatedNewItems = new Set(newItems);
    updatedNewItems.delete(id);
    setNewItems(updatedNewItems);
  };

  // Hoán đổi vị trí 2 item trong mảng (local state only, lưu khi user bấm Save)
  const handleReorder = (
    type: 'projects' | 'experiences' | 'education' | 'skills',
    fromIdx: number,
    toIdx: number
  ) => {
    if (!localData) return;
    const key = type === 'experiences' ? 'experiences' : type;
    const arr = [...((localData.profiles as any)[key] || [])];
    if (toIdx < 0 || toIdx >= arr.length) return;
    [arr[fromIdx], arr[toIdx]] = [arr[toIdx], arr[fromIdx]];
    // Cập nhật order_index theo vị trí mới
    arr.forEach((item: any, i: number) => { item.order_index = i; });
    handleUpdateLocal(`profiles.${key}`, arr);
  };

  if (loading) return <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[1000] flex flex-col items-center justify-center space-y-4">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full" />
    <span className="font-black text-xs uppercase tracking-widest text-muted">Đang tải dữ liệu...</span>
  </div>;

  const tabs = [
    { id: 'profile',    label: 'Thông tin cá nhân', icon: User },
    { id: 'variants',   label: 'Biến thể CV',        icon: UserCheck },
    { id: 'templates',  label: 'Mẫu CV & Download',  icon: FileText },
    { id: 'projects',   label: 'Dự án',              icon: Code },
    { id: 'experience', label: 'Kinh nghiệm',        icon: Briefcase },
    { id: 'education',  label: 'Học vấn',            icon: GraduationCap },
    { id: 'skills',     label: 'Kỹ năng',            icon: Globe },
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[1000] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-surface-mid bg-white p-8 flex flex-col gap-10 bg-gradient-to-b from-white to-surface/20">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: C.foreground }}>
            ADMIN <span style={{ color: C.accent }}>STUDIO</span>
          </h2>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Quản lý nội dung AI Portfolio</p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'text-white shadow-xl translate-x-2' 
                : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
              style={activeTab === tab.id ? { background: G.full } : {}}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
           <div className="bg-surface p-4 rounded-2xl border border-surface-mid flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
             <p className="text-[9px] font-black uppercase tracking-widest text-muted">Chế độ chỉnh sửa trực tiếp</p>
           </div>
           
           <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-surface-mid text-xs font-black uppercase tracking-widest text-muted hover:border-accent hover:text-accent transition-all bg-white"
          >
            <X className="w-4 h-4" /> THOÁT ADMIN
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-12 bg-[#faf9f6]/50">
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
          
          <AnimatePresence mode="wait">
            {!localData ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-3xl border border-surface-mid p-12 shadow-sm">
                <div className="p-8 rounded-full bg-surface">
                  <Layout className="w-12 h-12 text-muted opacity-20" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Không tìm thấy dữ liệu</h3>
                  <p className="text-sm text-muted mt-2 max-w-sm">Dữ liệu cho Slug \"{slug}\" ({lang}) chưa được khởi tạo. Bạn có thể nhấn nút bên dưới để thử tải lại.</p>
                </div>
                <button 
                  onClick={fetchData}
                  className="px-10 py-4 bg-foreground text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-black/10"
                >
                  TẢI LẠI TRANG
                </button>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* 1. PROFILE SECTION */}
                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex justify-between items-end">
                      <SectionHeader title="Thông tin cá nhân" subtitle="Dữ liệu cơ bản hiển thị trên Portfolio" icon={User} />
                      <SaveButton onClick={() => saveToDB('profiles', localData.profiles.id, {
                        full_name: localData.profiles.full_name,
                        email: localData.profiles.email,
                        phone: localData.profiles.phone,
                        location: localData.profiles.location,
                        facebook_url: localData.profiles.facebook_url,
                        zalo_url: localData.profiles.zalo_url,
                        telegram_url: localData.profiles.telegram_url,
                        github_url: (localData.profiles as any).github_url,
                        birthdate: localData.profiles.birthdate,
                      }, false)} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-surface-mid shadow-sm relative overflow-hidden">
                      <Input label="Họ và Tên" value={localData.profiles.full_name} onChange={(v: string) => handleUpdateLocal('profiles.full_name', v)} />
                      <Input label="Email" value={localData.profiles.email} onChange={(v: string) => handleUpdateLocal('profiles.email', v)} />
                      <Input label="Số điện thoại" value={localData.profiles.phone} onChange={(v: string) => handleUpdateLocal('profiles.phone', v)} />
                      <Input label="Địa chỉ" value={localData.profiles.location} onChange={(v: string) => handleUpdateLocal('profiles.location', v)} />
                      <Input label="Facebook URL" value={localData.profiles.facebook_url || ''} onChange={(v: string) => handleUpdateLocal('profiles.facebook_url', v)} />
                      <Input label="Zalo URL" value={localData.profiles.zalo_url || ''} onChange={(v: string) => handleUpdateLocal('profiles.zalo_url', v)} />
                      <Input label="Telegram URL" value={localData.profiles.telegram_url || ''} onChange={(v: string) => handleUpdateLocal('profiles.telegram_url', v)} />
                      <Input label="GitHub URL" value={(localData.profiles as any).github_url || ''} onChange={(v: string) => handleUpdateLocal('profiles.github_url', v)} />
                      <Input label="Ngày sinh" value={localData.profiles.birthdate || ''} onChange={(v: string) => handleUpdateLocal('profiles.birthdate', v)} />
                    </div>
                  </motion.div>
                )}

                {/* 2. VARIANTS SECTION */}
                {activeTab === 'variants' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex justify-between items-end">
                       <SectionHeader title="Biến thể CV" subtitle="Summary riêng cho từng vị trí ứng tuyển" icon={UserCheck} />
                       <SaveButton onClick={() => saveVariantToDB({ position: localData.position, summary: localData.summary })} />
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-surface-mid shadow-sm space-y-6">
                      <Input label="Vị trí ứng tuyển" value={localData.position} onChange={(v: string) => handleUpdateLocal('position', v)} />
                      <Textarea label="Tóm tắt sự nghiệp (AI Generated)" value={localData.summary} onChange={(v: string) => handleUpdateLocal('summary', v)} rows={8} />
                    </div>
                  </motion.div>
                )}
                {/* 2b. CV TEMPLATES SECTION */}
                {activeTab === 'templates' && (
                  <AdminCVTemplateTab
                    cv={localData}
                    slug={slug}
                    lang={lang}
                    onTemplateChange={(id) => handleUpdateLocal('template_id', id)}
                  />
                )}

                {/* 3. PROJECTS SECTION */}
                {activeTab === 'projects' && (
                  <AdminProjectsSection
                    projects={localData.profiles.projects || []}
                    profileId={localData.profiles.id}
                    newItems={newItems}
                    onChange={(updated) => handleUpdateLocal('profiles.projects', updated)}
                    onDelete={(id) => handleDelete('projects', id, 'projects')}
                    onAdd={() => handleAdd('projects')}
                    onSaved={() => {}}
                    onNewItemSaved={(id) => {
                      const updatedNewItems = new Set(newItems);
                      updatedNewItems.delete(id);
                      setNewItems(updatedNewItems);
                    }}
                  />
                )}

                {/* 4. EXPERIENCE SECTION */}
                {activeTab === 'experience' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex justify-between items-center">
                      <SectionHeader title="Kinh nghiệm làm việc" subtitle="Lịch sử sự nghiệp" icon={Briefcase} />
                      <button onClick={() => handleAdd('experiences')} className="flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg">
                        <Plus className="w-4 h-4" /> THÊM KINH NGHIỆM
                      </button>
                    </div>
                    <div className="grid gap-8">
                      {localData.profiles.experiences?.map((exp: any, idx: number) => (
                        <CardItem 
                          key={exp.id}
                          index={idx}
                          total={localData.profiles.experiences!.length}
                          onMoveUp={() => handleReorder('experiences', idx, idx - 1)}
                          onMoveDown={() => handleReorder('experiences', idx, idx + 1)}
                          onDelete={() => handleDelete('experiences', exp.id, 'experiences')} 
                          onSave={() => saveToDB('experiences', exp.id, { 
                            profile_id: localData.profiles.id,
                            company: exp.company, 
                            position: exp.position, 
                            location: exp.location, 
                            start_date: exp.start_date, 
                            end_date: exp.end_date, 
                            description: exp.description, 
                            achievements: exp.achievements,
                            order_index: idx
                          }, newItems.has(exp.id))}
                        >
                          <div className="space-y-4">
                            <Input label="Công ty" value={exp.company} onChange={(v: string) => {
                               const newList = [...(localData.profiles.experiences || [])];
                               newList[idx] = { ...exp, company: v };
                               handleUpdateLocal('profiles.experiences', newList);
                            }} />
                            <div className="grid grid-cols-2 gap-4">
                              <Input label="Vị trí" value={exp.position} onChange={(v: string) => {
                                 const newList = [...(localData.profiles.experiences || [])];
                                 newList[idx] = { ...exp, position: v };
                                 handleUpdateLocal('profiles.experiences', newList);
                              }} />
                              <div className="grid grid-cols-2 gap-2">
                                <Input label="Bắt đầu" value={exp.start_date} onChange={(v: string) => {
                                   const newList = [...(localData.profiles.experiences || [])];
                                   newList[idx] = { ...exp, start_date: v };
                                   handleUpdateLocal('profiles.experiences', newList);
                                }} />
                                <Input label="Kết thúc" value={exp.end_date} onChange={(v: string) => {
                                   const newList = [...(localData.profiles.experiences || [])];
                                   newList[idx] = { ...exp, end_date: v };
                                   handleUpdateLocal('profiles.experiences', newList);
                                }} />
                              </div>
                            </div>
                            <Textarea label="Mô tả công việc" value={exp.description} onChange={(v: string) => {
                               const newList = [...(localData.profiles.experiences || [])];
                               newList[idx] = { ...exp, description: v };
                               handleUpdateLocal('profiles.experiences', newList);
                            }} />
                            <Input label="Thành tựu (Dùng dấu phẩy ngăn cách)" value={exp.achievements?.join(', ') || ''} onChange={(v: string) => {
                               const newList = [...(localData.profiles.experiences || [])];
                               newList[idx] = { ...exp, achievements: v.split(',').map(s => s.trim()) };
                               handleUpdateLocal('profiles.experiences', newList);
                            }} />
                          </div>
                        </CardItem>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 5. EDUCATION SECTION */}
                {activeTab === 'education' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex justify-between items-center">
                      <SectionHeader title="Học vấn" subtitle="Bằng cấp và chứng chỉ" icon={GraduationCap} />
                      <button onClick={() => handleAdd('education')} className="flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                        <Plus className="w-4 h-4" /> THÊM HỌC VẤN
                      </button>
                    </div>
                    <div className="grid gap-6">
                      {localData.profiles.education?.map((edu: any, idx: number) => (
                        <CardItem 
                          key={edu.id}
                          index={idx}
                          total={localData.profiles.education!.length}
                          onMoveUp={() => handleReorder('education', idx, idx - 1)}
                          onMoveDown={() => handleReorder('education', idx, idx + 1)}
                          onDelete={() => handleDelete('education', edu.id, 'education')} 
                          onSave={() => saveToDB('education', edu.id, { 
                            profile_id: localData.profiles.id,
                            institution: edu.institution, 
                            field_of_study: edu.field_of_study, 
                            graduation_date: edu.graduation_date, 
                            gpa: edu.gpa,
                            order_index: idx
                          }, newItems.has(edu.id))}
                        >
                          <div className="grid gap-4">
                            <Input label="Trường / Cơ sở đào tạo" value={edu.institution} onChange={(v: string) => {
                               const newList = [...(localData.profiles.education || [])];
                               newList[idx] = { ...edu, institution: v };
                               handleUpdateLocal('profiles.education', newList);
                            }} />
                            <div className="grid grid-cols-2 gap-4">
                              <Input label="Ngành học" value={edu.field_of_study} onChange={(v: string) => {
                                const newList = [...(localData.profiles.education || [])];
                                newList[idx] = { ...edu, field_of_study: v };
                                handleUpdateLocal('profiles.education', newList);
                              }} />
                              <div className="grid grid-cols-2 gap-2">
                                <Input label="Năm tốt nghiệp" value={edu.graduation_date} onChange={(v: string) => {
                                  const newList = [...(localData.profiles.education || [])];
                                  newList[idx] = { ...edu, graduation_date: v };
                                  handleUpdateLocal('profiles.education', newList);
                                }} />
                                <Input label="GPA" value={edu.gpa || ''} onChange={(v: string) => {
                                  const newList = [...(localData.profiles.education || [])];
                                  newList[idx] = { ...edu, gpa: v };
                                  handleUpdateLocal('profiles.education', newList);
                                }} />
                              </div>
                            </div>
                          </div>
                        </CardItem>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 6. SKILLS SECTION */}
                {activeTab === 'skills' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex justify-between items-center">
                      <SectionHeader title="Kỹ năng & Chuyên môn" subtitle="Nhóm các kỹ năng theo danh mục" icon={Globe} />
                      <button onClick={() => handleAdd('skills')} className="flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                        <Plus className="w-4 h-4" /> THÊM KỸ NĂNG
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {localData.profiles.skills?.map((skill: any, idx: number) => (
                        <div key={skill.id} className="bg-white px-6 py-4 rounded-3xl border border-surface-mid flex items-center gap-4 group hover:border-accent/40 shadow-sm transition-all">
                          {/* Order controls */}
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button
                              onClick={() => handleReorder('skills', idx, idx - 1)}
                              disabled={idx === 0}
                              className="p-0.5 text-muted hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed"
                            ><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={() => handleReorder('skills', idx, idx + 1)}
                              disabled={idx === (localData.profiles.skills?.length ?? 0) - 1}
                              className="p-0.5 text-muted hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed"
                            ><ChevronDown className="w-3.5 h-3.5" /></button>
                          </div>
                          <span className="text-[10px] font-black text-muted/30 w-5 text-center shrink-0">{idx + 1}</span>
                          <select 
                            value={skill.category} 
                            onChange={(e) => {
                               const newList = [...(localData.profiles.skills || [])];
                               newList[idx] = { ...skill, category: e.target.value };
                               handleUpdateLocal('profiles.skills', newList);
                            }}
                            className="bg-surface text-[10px] font-bold uppercase px-3 py-2 rounded-xl outline-none border-none border-r border-surface-mid"
                          >
                            <option value="programming_languages">Ngôn ngữ</option>
                            <option value="frameworks">Frameworks</option>
                            <option value="databases">Databases</option>
                            <option value="tools">Công cụ</option>
                            <option value="ai_automation">AI & Auto</option>
                            <option value="soft_skills">Kỹ năng mềm</option>
                          </select>
                          <input 
                            value={skill.name} 
                            onChange={(e) => {
                               const newList = [...(localData.profiles.skills || [])];
                               newList[idx] = { ...skill, name: e.target.value };
                               handleUpdateLocal('profiles.skills', newList);
                            }}
                            className="flex-grow text-xs font-black outline-none border-b border-transparent focus:border-accent bg-transparent"
                          />
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => saveToDB('skills', skill.id, { 
                                profile_id: localData.profiles.id,
                                category: skill.category, 
                                name: skill.name,
                                order_index: idx
                              }, newItems.has(skill.id))} className="p-2 text-accent hover:bg-accent/10 rounded-lg">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete('skills', skill.id, 'skills')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Global Saving Overlay */}
      <AnimatePresence>
        {isSaving && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            className="fixed inset-0 bg-white/20 z-[2000] flex items-center justify-center pointer-events-none"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-foreground text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 font-black text-xs uppercase tracking-widest border border-white/20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
              ĐANG ĐỒNG BỘ DỮ LIỆU...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center gap-6 mb-2">
    <div className="p-4 rounded-2xl bg-white border border-surface-mid shadow-sm text-accent">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: C.foreground }}>{title}</h3>
      <p className="text-xs font-medium text-muted">{subtitle}</p>
    </div>
  </div>
);

const SaveButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
  >
    <Save className="w-4 h-4" /> LƯU THAY ĐỔI
  </button>
);

const CardItem = ({ children, onDelete, onSave, onMoveUp, onMoveDown, index, total }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-surface-mid shadow-sm hover:border-accent/30 transition-all group relative">
    {/* Order badge */}
    <div className="absolute top-5 left-8 flex items-center gap-2">
      <span className="text-[10px] font-black text-muted/30 uppercase tracking-widest">#{index + 1}</span>
    </div>
    <div className="flex justify-between items-start pt-4">
      <div className="flex-grow pr-4">
        {children}
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        {/* Move up */}
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-3 bg-surface text-muted hover:bg-accent/10 hover:text-accent rounded-2xl transition-all shadow-sm disabled:opacity-20 disabled:cursor-not-allowed"
          title="Di chuyển lên"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        {/* Move down */}
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-3 bg-surface text-muted hover:bg-accent/10 hover:text-accent rounded-2xl transition-all shadow-sm disabled:opacity-20 disabled:cursor-not-allowed"
          title="Di chuyển xuống"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        {/* Save */}
        <button onClick={onSave} className="p-3 bg-surface text-accent hover:bg-accent hover:text-white rounded-2xl transition-all shadow-sm" title="Lưu">
          <Save className="w-4 h-4" />
        </button>
        {/* Delete */}
        <button onClick={onDelete} className="p-3 bg-surface text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm" title="Xóa">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const Input = ({ label, value, onChange, icon: Icon }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 pl-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-50" />}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-5 py-4 rounded-2xl border border-surface-mid text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent bg-surface/50 hover:bg-surface/80 ${Icon ? 'pl-12' : ''}`}
        style={{ color: C.foreground }}
      />
    </div>
  </div>
);

const Textarea = ({ label, value, onChange, rows = 3 }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 pl-1">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full px-5 py-4 rounded-2xl border border-surface-mid text-sm font-medium leading-relaxed transition-all outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 bg-surface/50 hover:bg-surface/80"
      style={{ color: C.foreground }}
    />
  </div>
);
