export interface DeveloperConfig {
  name: string;
  initials: string;
  designation: string;
  portfolio: string;
  email: string;
  phone?: string;
  bio: string;
  avatar: string;
  resume: string;
  socialLinks: {
    name: string;
    url: string;
    icon: string;
    hasDarkIcon: boolean;
    handle: string;
  }[];

  location: {
    city: string;
    country: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };

  education: Array<{
    degree: string;
    institution: string;
    startDate: string;
    logo: string;
    endDate: string;
    location: string;
  }>;
}
export interface Projects {
  icon: string;
  title: string;
  tagline: string;
  date?: string;
  description: Array<string>;
  liveLink?: string;
  repo?: string;
  apkLink?: string;
  docsLink?: string;
  techStack: Array<TechStack>;
  screenshots?: string[];
}

export interface TechStack {
  name: string;
  icon: string;
  hasDarkIcon?: boolean;
  link?: string;
}
export interface Experience {
  company: string;
  logo: string;
  designation: string;
  type: "Full-time" | "Part-time" | "Internship" | "Freelance" | "Contract";
  startDate: string;
  endDate: string;
  description: string[];
  skills: Array<TechStack>;
  isCurrent: boolean;
}
