import { useEffect, useState, useRef } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { CVVariant } from './types/database';
import { Header } from './components/Header';
import { ExperienceSection } from './components/ExperienceSection';
import { PortfolioSection } from './components/PortfolioSection';
import { SidebarSection } from './components/SidebarSection';
import { CVTemplateRenderer } from './components/cv-templates';
import { SectionTitle } from './components/ui/Layout';
import { Globe, ArrowRight, Settings, Layout, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { C, G } from './lib/theme';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { Session } from '@supabase/supabase-js';

const LABELS = {
  vi: { language: "Ngôn ngữ", summary: "Tóm tắt", exp: "Kinh nghiệm", contact: "Liên hệ", skills: "Kỹ năng", portfolio: "Dự án", langs: "Ngôn ngữ", edu: "Học vấn", companySuffix: "tại" },
  en: { language: "Language", summary: "Summary", exp: "Experience", contact: "Contact", skills: "Skills", portfolio: "Portfolio", langs: "Languages", edu: "Education", companySuffix: "at" }
};

// Ink splatter decorative SVG – reused across page
const PageInkDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 130" fill="currentColor">
    <ellipse cx="105" cy="68" rx="90" ry="55" />
    <circle cx="12" cy="18" r="11" />
    <circle cx="190" cy="110" r="8" />
    <circle cx="178" cy="15" r="7" />
    <circle cx="28" cy="112" r="6" />
    <ellipse cx="162" cy="32" rx="9" ry="6" transform="rotate(32 162 32)" />
    <ellipse cx="40" cy="80" rx="7" ry="4" transform="rotate(-22 40 80)" />
    <circle cx="192" cy="55" r="5" />
  </svg>
);

export default function App() {
  const [cv, setCv] = useState<CVVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [mode, setMode] = useState<'cv' | 'portfolio'>('portfolio');
  const [error, setError] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: '',
    pageStyle: `
      @page { size: A4; margin: 0mm; }
      @media print { body { margin: 0; } }
    `,
  });

  const qs = new URLSearchParams(window.location.search);
  const slug = (qs.get('type') || 'tong-quan').toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const company = qs.get('company') || (lang === 'vi' ? 'công ty' : 'company');

  useEffect(() => {
    const urlLang = (qs.get('lang') || 'vi').toLowerCase().startsWith('en') ? 'en' : 'vi';
    setLang(urlLang as 'vi' | 'en');

    // Check for admin param
    if (qs.get('admin') === 'true') {
      if (session) {
        setIsAdminOpen(true);
      } else {
        setIsLoginOpen(true);
      }
    }

    // Auth listener
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) setIsLoginOpen(false);
      });

      return () => subscription.unsubscribe();
    }
  }, [session]);

  useEffect(() => {
    async function fetchData() {
      if (!isConfigured || !supabase) {
        setError('⚙️ Supabase chưa được cấu hình. Vui lòng điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cv_variants')
          .select(`
            position,
            summary,
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

        if (error) throw error;
        // Sort nested arrays by order_index client-side (most reliable)
        const sorted = data as any;
        if (sorted?.profiles) {
          const p = sorted.profiles;
          const byOrder = (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0);
          if (p.projects)    p.projects.sort(byOrder);
          if (p.experiences) p.experiences.sort(byOrder);
          if (p.skills)      p.skills.sort(byOrder);
          if (p.education)   p.education.sort(byOrder);
        }
        setCv(sorted as unknown as CVVariant);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lang]);

  const handleLangChange = (l: 'vi' | 'en') => {
    setLang(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState({}, '', url);
  };

  // ─── Loading State ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center space-y-6">
          {/* Animated mocha ink drops */}
          <div className="flex gap-3 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [-8, 8, -8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 rounded-full bg-accent"
              />
            ))}
          </div>
          <p
            className="text-sm font-black uppercase tracking-widest text-muted"
            style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────
  if (error || !cv) {
    const isSetupError = !isConfigured;
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-lg w-full rounded-2xl border border-surface-mid bg-white p-10 shadow-xl space-y-6">
          <div className="text-5xl">{isSetupError ? '🔑' : '🔌'}</div>
          <h1
            className="text-3xl font-black text-foreground uppercase"
            style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
          >
            {isSetupError ? 'Cần cấu hình Supabase' : 'Không tìm thấy dữ liệu'}
          </h1>
          {isSetupError ? (
            <div className="text-left space-y-4">
              <p className="text-muted text-sm">Điền thông tin Supabase vào file <code className="text-accent bg-surface px-2 py-0.5 rounded">.env</code>:</p>
              <div className="bg-surface rounded-xl p-4 font-mono text-xs text-left border border-surface-mid space-y-1">
                <p className="text-green-700"># .env</p>
                <p><span className="text-muted">VITE_SUPABASE_URL</span>=<span className="text-accent">https://xxxx.supabase.co</span></p>
                <p><span className="text-muted">VITE_SUPABASE_ANON_KEY</span>=<span className="text-accent">eyJh...</span></p>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">
              Slug <span className="text-accent font-bold">"{slug}"</span> không tồn tại hoặc có lỗi kết nối.
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl text-white text-sm font-black transition-all uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #7A5C38, #C4622D)' }}
          >
            THỬ LẠI
          </button>
        </div>
      </div>
    );
  }

  const profile = cv.profiles;
  const labels = LABELS[lang];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Subtle top accent line */}

      <Header
        fullName={profile.full_name}
        position={cv.position}
        lang={lang}
        mode={mode}
        setLang={handleLangChange}
        setMode={setMode}
        onExportPdf={handlePrint}
        isLoggedIn={!!session}
        onLogout={() => supabase?.auth.signOut()}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Admin Toggle Button (Hidden unless ?admin=true is in URL or logged in) */}
      {(qs.get('admin') === 'true' || session) && (
        <button
          onClick={() => session ? setIsAdminOpen(true) : setIsLoginOpen(true)}
          className="fixed bottom-8 left-8 p-4 rounded-full bg-white shadow-2xl border-2 border-surface-mid text-accent hover:scale-110 active:scale-95 transition-all z-[500] group"
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}

      {/* Login Overlay */}
      <AnimatePresence>
        {isLoginOpen && (
          <LoginView 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => {
              setIsLoginOpen(false);
              setIsAdminOpen(true);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Admin Dashboard Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminView
            lang={lang}
            slug={slug}
            onClose={() => {
              setIsAdminOpen(false);
              // Clean URL param when closing
              const url = new URL(window.location.href);
              url.searchParams.delete('admin');
              window.history.replaceState({}, '', url);
            }}
          />
        )}
      </AnimatePresence>

      <main className="container mx-auto px-6 py-12 pt-28">
        <AnimatePresence mode="wait">
          {mode === 'cv' ? (
            <motion.div
              key="cv-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Main Column */}
              <div className="lg:col-span-8 space-y-14">

                {/* About/Summary Section */}
                <section className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #7A5C38, #A07850)' }}>
                      <Globe className="w-4 h-4" />
                    </div>
                    <h2
                      className="text-2xl font-black uppercase tracking-wide text-foreground"
                      style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
                    >
                      {labels.summary}
                    </h2>
                    <div className="h-[2px] flex-grow ml-2 rounded-full" style={{ background: 'linear-gradient(90deg, #A07850 0%, transparent 100%)' }} />
                  </div>

                  {/* Summary text highlighted */}
                  <div className="relative pl-5" style={{ borderLeft: '3px solid #A07850' }}>
                    {/* Ink dot */}
                    <div className="absolute -left-[7px] top-0 w-[11px] h-[11px] rounded-full" style={{ background: '#A07850' }} />
                    <p className="text-lg text-muted leading-relaxed font-medium italic">
                      "{cv.summary?.replaceAll("__COMPANY__", company)}"
                    </p>
                  </div>
                </section>

                <ExperienceSection experiences={profile.experiences || []} labels={labels} />
                <PortfolioSection projects={profile.projects || []} labels={labels} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-6">
                  <SidebarSection profile={profile} labels={labels} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="portfolio-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-20"
            >
              {/* Portfolio Hero Section */}
              <section className="relative py-2">
                {/* Big ink splatter behind headline */}
                <PageInkDeco className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] text-accent opacity-[0.04] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <div className="relative group">
                      {/* Decorative glow behind photo */}
                      <div 
                        className="absolute -inset-1 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ background: G.accent }}
                      />
                      <img 
                        src="/banner.png"
                        alt={profile.full_name}
                        className="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-2xl z-10"
                      />
                    </div>
                  </motion.div>
                 
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2 text-xs font-black tracking-widest uppercase text-white"
                    style={{ clipPath: 'polygon(0 0, 98% 0, 100% 100%, 2% 100%)', background: G.accent }}
                  >
                    Creative Developer & AI Enthusiast
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-none"
                    style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
                  >
                    {profile.full_name.split(' ').map((word, i, arr) => (
                      <span key={i} style={i === arr.length - 1 ? { color: C.accent } : {}}>{word} </span>
                    ))}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-muted max-w-5xl mx-auto leading-relaxed text-justify"
                  >
                    {cv.summary?.replaceAll("__COMPANY__", company)}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center gap-3 px-8 py-4 text-white font-black rounded-none transition-all shadow-xl hover:-translate-y-1 uppercase tracking-wider"
                      style={{ fontFamily: 'Montserrat, Inter, sans-serif', clipPath: 'polygon(0 0, 97% 0, 100% 100%, 3% 100%)', background: 'linear-gradient(135deg, #7A5C38, #C4622D)' }}
                    >
                      CÁC DƯ ÁN <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* Work section */}
              <div id="work" className="space-y-20 pt-2" style={{ scrollMarginTop: '100px' }}>
                <PortfolioSection projects={profile.projects || []} labels={labels} />
              </div>

              {/* Resume Section */}
              <section id="resume" className="space-y-10" style={{ scrollMarginTop: '100px' }}>
                <SectionTitle 
                  title={lang === 'vi' ? "Bản CV Tech" : "Tech Resume"} 
                  subtitle={lang === 'vi' ? "Thiết kế Terminal Monospace tối giản" : "Minimal Terminal Monospace Design"} 
                  icon={FileText} 
                />
                
                <div className="flex justify-center">
                  <div className="w-full max-w-[900px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-surface-mid overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(160,120,80,0.15)] transition-all duration-700">
                    <div className="overflow-x-auto overflow-y-hidden p-6 md:p-12 bg-surface/30">
                      <div className="min-w-[800px] flex justify-center origin-top transform scale-[0.6] sm:scale-[0.8] md:scale-[1] md:mb-[-200px] sm:mb-[-100px]">
                        <div className="shadow-2xl border border-[#e1e4e8] rounded-sm">
                          <CVTemplateRenderer cv={cv} lang={lang} templateId="tech" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white border-t border-surface-mid flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                          {lang === 'vi' ? "Dữ liệu được đồng bộ trực tiếp" : "Real-time Synced Data"}
                        </span>
                      </div>
                      <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:-translate-y-0.5 transition-all shadow-lg active:scale-95"
                      >
                        <Download className="w-4 h-4" /> {lang === 'vi' ? "TẢI PDF BẢN TECH" : "DOWNLOAD TECH PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div id="experience" style={{ scrollMarginTop: '100px' }}>
                  <ExperienceSection experiences={profile.experiences || []} labels={labels} />
                </div>
                <div id="contact" style={{ scrollMarginTop: '100px' }}>
                  <SidebarSection profile={profile} labels={labels} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-surface-mid">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p
            className="text-foreground text-sm font-black tracking-tighter uppercase"
            style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
          >
            © {new Date().getFullYear()} {profile.full_name.toUpperCase()}
            <span className="text-accent ml-2">·</span>
            <span className="text-muted ml-2 font-medium normal-case">Portfolio...</span>
          </p>
          <div className="flex gap-6 items-center">
        
              <span
                className="text-[10px] text-muted font-black tracking-widest uppercase hover:text-accent transition-colors cursor-default"
              >
                "Cảm ơn mọi người đã ghé thăm portfolio của Thái! "
              </span>
            
          </div>
        </div>
      </footer>

      {/* Hidden Print View */}
      <div style={{ position: 'absolute', top: '-99999px', left: '-99999px' }}>
        <CVTemplateRenderer ref={printRef} cv={cv} lang={lang} templateId={(cv as any).template_id || 'modern'} />
      </div>
    </div>
  );
}
