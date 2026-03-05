import { Experience } from '../types/database';
import { SectionTitle } from './ui/Layout';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { C, G } from '../lib/theme';

interface ExperienceSectionProps {
  experiences: Experience[];
  labels: any;
}

export const ExperienceSection = ({ experiences, labels }: ExperienceSectionProps) => {
  return (
    <section className="space-y-6">
      <SectionTitle icon={Briefcase}>{labels.exp}</SectionTitle>
      <div className="space-y-8">
        {[...experiences].sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)).map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="group relative"
          >
            {/* Animated left border */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-500"
              style={{ background: C.surfaceMid }}
              onMouseEnter={() => {}}  // handled by group parent
              ref={el => {
                if (!el) return;
                const parent = el.closest('.group');
                if (!parent) return;
                const enter = () => (el.style.background = G.warm);
                const leave = () => (el.style.background = C.surfaceMid);
                parent.addEventListener('mouseenter', enter);
                parent.addEventListener('mouseleave', leave);
              }}
            />

            <div className="pl-6 space-y-3">
              {/* Position + date */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3
                  className="text-xl font-black transition-colors"
                  style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
                >
                  {exp.position}
                </h3>
                <span
                  className="text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full whitespace-nowrap"
                  style={{ background: G.full }}
                >
                  {exp.start_date} – {exp.end_date}
                </span>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: C.accent }}>{exp.company}</span>
                {exp.location && (
                  <>
                    <span style={{ color: C.surfaceMid }}>·</span>
                    <span className="text-sm italic" style={{ color: C.muted }}>{exp.location}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="leading-relaxed text-sm" style={{ color: C.muted }}>
                {exp.description}
              </p>

              {/* Achievements */}
              {exp.achievements?.length > 0 && (
                <ul className="space-y-2 pt-1">
                  {exp.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span
                        className="mt-1.5 h-[6px] w-[6px] rounded-full flex-shrink-0"
                        style={{ background: C.accentLight }}
                      />
                      <span style={{ color: C.muted }}>{ach}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
