export interface Profile {
  id: string;
  language: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  facebook_url: string;
  zalo_url?: string;
  telegram_url?: string;
  github_url?: string;
  birthdate: string;
  experiences?: Experience[];
  projects?: Project[];
  skills?: Skill[];
  education?: Education[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role?: string;
  images?: string[];
  start_date?: string;
  end_date?: string;
  live_url?: string;
  github_url?: string;
  live_urls?: string[];
}

export interface Skill {
  id: string;
  category: string;
  name: string;
}

export interface Education {
  id: string;
  institution: string;
  field_of_study: string;
  degree: string;
  graduation_date: string;
  gpa: string;
}

export interface CVVariant {
  slug: string;
  language: string;
  position: string;
  summary: string;
  profiles: Profile;
}
