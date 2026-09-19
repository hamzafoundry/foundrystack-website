export interface ServiceItem {
  id: string;
  title: string;
  badge?: string;
  badgeType?: 'active' | 'building';
  tagline: string;
  description: string;
  keyFeatures: string[];
  iconName: string;
}

export interface SolutionExample {
  id: string;
  category: string;
  categoryKey?: string;
  title: string;
  description: string;
  architectureSummary: string;
  techStack: string[];
  useCase: string;
  iconName: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget: string;
  website_url_hp?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  inquiryId?: string;
  error?: string;
}

export interface CapabilityHighlight {
  title: string;
  description: string;
  detail: string;
  icon: string;
}
