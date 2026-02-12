export interface Project {
  slug: string;
  title: string;
  role: string;
  company: string;
  year: number;
  image: string;
  images?: string[];
  team?: string[];
}

export interface SiteConfig {
  name: string;
  year: number;
  bio: string;
  aboutImage: string;
  links: {
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}
