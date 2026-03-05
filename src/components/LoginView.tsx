import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { C, G } from '../lib/theme';
import { Mail, Lock, LogIn, AlertCircle, X, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginView = ({ onClose, onSuccess }: LoginViewProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Invalid login credentials' 
        ? 'Email hoặc mật khẩu không chính xác.' 
        : authError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-surface-mid overflow-hidden relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 pt-16">
          <div className="mb-10 text-center">
            <div className="inline-flex p-5 rounded-3xl bg-surface mb-6 text-accent">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ color: C.foreground }}>
              ADMIN <span style={{ color: C.accent }}>LOGIN</span>
            </h2>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Truy cập Studio để quản lý nội dung</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-surface-mid text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent bg-surface/50 hover:bg-surface/80"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 pl-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-surface-mid text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent bg-surface/50 hover:bg-surface/80"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
              style={{ background: G.full }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ĐANG KIỂM TRA...
                </>
              ) : (
                <>
                  ĐĂNG NHẬP STUDIO
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.2em] text-center mt-10">
            PROTECTED BY SUPABASE AUTH
          </p>
        </div>
      </motion.div>
    </div>
  );
};
