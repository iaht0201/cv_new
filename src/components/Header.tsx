import React from 'react';
import { motion } from 'framer-motion';
import { Download, Menu, X, Lock, LogOut } from 'lucide-react';
import { C, G } from '../lib/theme';


interface HeaderProps {
  fullName: string;
  position: string;
  lang: 'vi' | 'en';
  mode: 'cv' | 'portfolio';
  setLang: (l: 'vi' | 'en') => void;
  setMode: (m: 'cv' | 'portfolio') => void;
  onExportPdf?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

const InkSplat = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 200 120" fill="currentColor">
    <ellipse cx="100" cy="60" rx="95" ry="50" />
    <circle cx="15" cy="20" r="12" />
    <circle cx="185" cy="90" r="9" />
    <circle cx="170" cy="18" r="7" />
    <circle cx="30" cy="100" r="6" />
    <ellipse cx="155" cy="30" rx="8" ry="5" transform="rotate(30 155 30)" />
  </svg>
);

export const Header = ({ 
  fullName, position, lang, mode, setLang, setMode, onExportPdf,
  isLoggedIn, onLogout, onLoginClick 
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'work',       label: 'Dự án' },
    { id: 'resume',     label: 'Resume' },
    { id: 'experience', label: 'Kinh nghiệm' },
    { id: 'contact',    label: 'Liên hệ' },
  ];

  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    /* fixed top header */
    <header
      className="fixed top-0 left-0 right-0 overflow-hidden border-b bg-white/90 backdrop-blur-md z-[100] transition-shadow duration-300"
      style={{ borderColor: C.surfaceMid, boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none' }}
    >
      {/* Top gradient accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-50"
        style={{ background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent}, ${C.accentWarm})` }}
      />

      {/* Decorative large splats */}
      <InkSplat className="absolute -right-20 -top-10 w-96 h-72 opacity-[0.03] pointer-events-none" style={{ color: C.accent }} />
      <InkSplat className="absolute -left-10 bottom-[-30px] w-64 h-48 opacity-[0.04] pointer-events-none" style={{ color: C.accentWarm }} />

      <div className="container mx-auto px-6 py-4 lg:py-6">
        <div className="flex items-center justify-between gap-8">

          {/* Left: Branding */}
          <div className="flex-1 flex flex-col items-start z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none"
                style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
              >
                {fullName.split(' ').map((word, i, arr) => (
                  <span key={i} className="mr-1.5 last:mr-0" style={i === arr.length - 1 ? { color: C.accent } : {}}>
                    {word}
                  </span>
                ))}
              </h1>
              <div
                className="text-[9px] font-black tracking-[0.3em] uppercase mt-0.5 opacity-60"
                style={{ color: C.muted, fontFamily: 'Montserrat, Inter, sans-serif' }}
              >
                {position}
              </div>
            </motion.div>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 z-20">
            {navLinks.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                onClick={() => handleScroll(link.id)}
                className="group relative py-2 text-[11px] font-black tracking-[0.3em] uppercase transition-colors"
                style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
              >
                <span className="relative z-10 group-hover:text-accent transition-colors">
                  {link.label}
                </span>
                <span
                  className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"
                  style={{ opacity: 0.6 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 z-10">

            {/* PDF Download Button */}
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="hidden sm:flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black text-white hover:scale-105 transition-all shadow-md active:scale-95 uppercase tracking-widest border border-white/10"
                style={{ background: G.full }}
              >
                <Download className="w-3.5 h-3.5" />
                Resume
              </button>
            )}

            {/* Auth Button */}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="hidden lg:flex items-center gap-2 p-2.5 rounded-xl bg-surface border hover:bg-red-50 hover:text-red-500 transition-all"
                style={{ borderColor: C.surfaceMid, color: C.muted }}
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden lg:flex items-center gap-2 p-2.5 rounded-xl bg-surface border hover:bg-accent/10 hover:text-accent transition-all"
                style={{ borderColor: C.surfaceMid, color: C.muted }}
                title="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-surface border"
              style={{ borderColor: C.surfaceMid, color: C.foreground }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden bg-white border-t"
        style={{ borderColor: C.surfaceMid }}
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="text-left py-3 text-xs font-black tracking-widest uppercase border-b border-surface"
              style={{ color: C.foreground, fontFamily: 'Montserrat, Inter, sans-serif' }}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center justify-end pt-2">
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="px-6 py-2 rounded-lg text-[10px] font-black text-white uppercase"
                style={{ background: G.full }}
              >
                Resume
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
};
