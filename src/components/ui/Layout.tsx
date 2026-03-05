import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { C, G } from '../../lib/theme';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Card = ({ children, className, delay = 0 }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg",
      className
    )}
    style={{ borderColor: C.surfaceMid }}
  >
    {children}
  </motion.div>
);

export const Pill = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-default", className)}
    style={{ background: C.surface, borderColor: C.surfaceMid, color: C.muted }}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.background = C.accent;
      el.style.color = '#fff';
      el.style.borderColor = C.accent;
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.background = C.surface;
      el.style.color = C.muted;
      el.style.borderColor = C.surfaceMid;
    }}
  >
    {children}
  </span>
);

export const SectionTitle = ({ children, title, subtitle, icon: Icon }: { children?: React.ReactNode; title?: string; subtitle?: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 rounded-lg text-white" style={{ background: G.accent }}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex flex-col">
      <h2
        className="text-2xl font-black uppercase tracking-wide"
        style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
      >
        {title || children}
      </h2>
      {subtitle && (
        <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: C.muted }}>
          {subtitle}
        </span>
      )}
    </div>
    <div className="h-[2px] flex-grow rounded-full ml-2" style={{ background: G.divider }} />
  </div>
);
