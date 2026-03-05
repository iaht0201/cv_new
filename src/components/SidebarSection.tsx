import { Profile } from '../types/database';
import { Card, Pill } from './ui/Layout';
import { Mail, Phone, MapPin, Facebook, Calendar, Code, GraduationCap, Send, MessageCircle } from 'lucide-react';
import { C, G } from '../lib/theme';
import React from 'react';

interface SidebarSectionProps {
  profile: Profile;
  labels: any;
}

const InkDeco = () => (
  <svg className="absolute -right-2 -top-2 w-14 h-9 pointer-events-none" viewBox="0 0 80 50" fill={C.accent} opacity={0.08}>
    <ellipse cx="40" cy="28" rx="35" ry="20" /><circle cx="5" cy="8" r="5" />
    <circle cx="74" cy="42" r="4" /><circle cx="68" cy="6" r="3" />
  </svg>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-1 h-6 rounded-full" style={{ background: G.warm }} />
    <h3
      className="text-base font-black uppercase tracking-wide"
      style={{ fontFamily: 'Montserrat, Inter, sans-serif', color: C.foreground }}
    >
      {children}
    </h3>
  </div>
);

export const SidebarSection = ({ profile, labels }: SidebarSectionProps) => {
  const groupedSkills = (profile.skills || []).reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

  const contactItems = [
    { icon: Mail,     label: profile.email,     href: `mailto:${profile.email}` },
    { icon: Phone,    label: profile.phone,      href: `tel:${profile.phone}` },
    { icon: Facebook, label: 'Facebook',         href: profile.facebook_url },
    { icon: MessageCircle, label: 'Zalo',         href: profile.zalo_url },
    { icon: Send,     label: 'Telegram',       href: profile.telegram_url },
    { icon: MapPin,   label: profile.location },
    { icon: Calendar, label: profile.birthdate },
  ];

  return (
    <aside className="space-y-6">

      {/* Contact */}
      <Card>
        <div className="relative overflow-hidden">
          <InkDeco />
          <SectionLabel>{labels.contact}</SectionLabel>
          <ul className="space-y-4">
            {contactItems.filter(i => i.label).map((item, i) => (
              <li key={i} className="flex items-center gap-3 group">
                <div
                  className="p-2 rounded-lg border transition-all duration-300"
                  style={{ background: C.surface, borderColor: C.surfaceMid }}
                >
                  <item.icon className="w-3.5 h-3.5 transition-colors" style={{ color: C.accent }} />
                </div>
                {item.href ? (
                  <a href={item.href} target="_blank"
                    className="text-sm truncate font-medium transition-colors hover:underline"
                    style={{ color: C.muted }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-sm truncate font-medium" style={{ color: C.muted }}>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Skills */}
      <Card delay={0.1}>
        <div className="relative overflow-hidden">
          <InkDeco />
          <SectionLabel>{labels.skills}</SectionLabel>
          <div className="space-y-5">
            {Object.entries(groupedSkills).map(([cat, names]) => (
              <div key={cat} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[1.5px] inline-block" style={{ background: C.accentLight }} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.muted }}>
                    {cat.replace(/_/g, ' ')}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {names.map((name, i) => <Pill key={i}>{name}</Pill>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card delay={0.2}>
        <div className="relative overflow-hidden">
          <InkDeco />
          <SectionLabel>{labels.edu}</SectionLabel>
          <div className="space-y-6">
            {profile.education?.map((edu) => (
              <div key={edu.id} className="group cursor-default relative pl-4 border-l-2 transition-colors duration-300"
                style={{ borderColor: C.surfaceMid }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.surfaceMid)}
              >
                <h4 className="font-bold text-sm leading-snug transition-colors" style={{ color: C.foreground }}>
                  {edu.institution}
                </h4>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{edu.field_of_study}</p>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-tight text-white px-2 py-0.5 rounded"
                    style={{ background: G.accent }}
                  >
                    {edu.graduation_date}
                  </span>
                  {edu.gpa && (
                    <span className="text-[10px] font-black tracking-wide" style={{ color: C.accent }}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </aside>
  );
};
