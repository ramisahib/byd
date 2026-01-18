
export interface BydApp {
  id: string;
  name: string;
  version: string;
  developer: string;
  category: AppCategory;
  description: string;
  size: string;
  uploadDate: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  iconUrl: string;
}

export enum AppCategory {
  ENTERTAINMENT = 'Entertainment',
  NAVIGATION = 'Navigation',
  UTILITIES = 'Utilities',
  SMART_HOME = 'Smart Home',
  DIAGNOSTICS = 'Diagnostics'
}

export interface AiAnalysisResult {
  securityScore: number;
  compatibility: string;
  recommendations: string[];
  vulnerabilitiesFound: number;
}
