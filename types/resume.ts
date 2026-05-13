export interface SkillCategory {
  id: string;
  category: string;
  skills: string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  bullets: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  yearFrom: string;
  yearTo: string;
}

export interface Certification {
  id: string;
  provider: string;
  course: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  bullets: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
  location: string;
  summary: string;
  skills: SkillCategory[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  experience: Experience[];
}
