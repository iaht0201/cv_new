import { Project } from '../types/database';
import { SectionTitle, Card } from './ui/Layout';
import { Code, Github, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { C, G } from '../lib/theme';
import React from 'react';

interface PortfolioSectionProps {
  projects: Project[];
  labels: any;
}

const InkDeco = ({ idx }: { idx: number }) => {
  const pos: React.CSSProperties = idx % 3 === 0
    ? { top: '-12px', right: '-8px' }
    : idx % 3 === 1
      ? { top: '-10px', left: '-8px' }
      : { bottom: '-12px', right: '-8px' };
  return (
    <svg
      style={{ position: 'absolute', width: '60px', height: '38px', opacity: 0.07, pointerEvents: 'none', ...pos }}
      viewBox="0 0 80 50"
      fill={idx % 2 === 0 ? C.accent : C.accentWarm}
    >
      <ellipse cx="38" cy="28" rx="32" ry="18" />
      <circle cx="5" cy="8" r="5" /><circle cx="72" cy="42" r="4" /><circle cx="65" cy="5" r="3" />
    </svg>
  );
};

export const PortfolioSection = ({ projects, labels }: PortfolioSectionProps) => {
  return (
    <section className="space-y-6">
      <SectionTitle icon={Code}>{labels.portfolio}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((pj, idx) => (
          <Card key={pj.id} delay={idx * 0.1} className="relative overflow-hidden group border border-surface-mid hover:border-accent/40 transition-all duration-500">
            <InkDeco idx={idx} />

            <div className="flex flex-col h-full">
              {/* Optional Project Image Preview */}
              {pj.images && pj.images.length > 0 && (
                <div className="relative -mx-6 -mt-6 mb-6 h-44 overflow-hidden bg-surface-mid">
                  <img 
                    src={pj.images[0]} 
                    alt={pj.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                  {pj.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[9px] font-bold rounded-md backdrop-blur-sm">
                      +{pj.images.length - 1} IMAGES
                    </span>
                  )}
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-black text-white w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: idx % 2 === 0 ? G.accent : G.warm,
                        fontFamily: 'Montserrat, Inter, sans-serif',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="text-lg font-black leading-tight tracking-tight"
                      style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
                    >
                      {pj.name}
                    </h3>
                  </div>

                  {/* Role & Time */}
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest pl-7" style={{ color: C.accent }}>
                    {pj.role && (
                      <span className="flex items-center">
                        {pj.role}
                      </span>
                    )}
                    {(pj.start_date || pj.end_date) && (
                      <span className="opacity-60 font-medium">
                        [{pj.start_date || '?'} — {pj.end_date || 'NOW'}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Link buttons */}
                <div className="flex gap-1.5 ml-2">
                  {[
                    pj.live_url && { href: pj.live_url, Icon: ExternalLink },
                    pj.github_url && { href: pj.github_url, Icon: Github },
                  ].filter(Boolean).map((btn: any, i) => (
                    <a
                      key={i}
                      href={btn.href}
                      target="_blank"
                      className="p-2 rounded-lg border transition-all"
                      style={{ background: C.surface, borderColor: C.surfaceMid, color: C.muted }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = C.accent;
                        el.style.color = '#fff';
                        el.style.borderColor = C.accent;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = C.surface;
                        el.style.color = C.muted;
                        el.style.borderColor = C.surfaceMid;
                      }}
                    >
                      <btn.Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-5 line-clamp-3 group-hover:line-clamp-none transition-all mt-2" style={{ color: C.muted }}>
                {pj.description}
              </p>

              {/* Footer: Tech tags + Demos */}
              <div className="mt-auto space-y-4">
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {pj.technologies?.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all"
                      style={{ background: C.surface, borderColor: C.surfaceMid, color: C.muted }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Demos/Live URLs */}
                {pj.live_urls && pj.live_urls.length > 0 && (
                  <div className="flex flex-wrap gap-4 py-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {pj.live_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        className="text-xs font-black flex items-center gap-1.5 uppercase tracking-wide border-b-2 border-transparent hover:border-current transition-all"
                        style={{ color: C.accent }}
                      >
                        {pj.live_urls && pj.live_urls.length > 1 ? `DEMO ${i + 1}` : 'PROD VIEW'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
