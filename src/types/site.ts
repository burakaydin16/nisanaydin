export type ThemeColor = 'rose' | 'amber' | 'emerald' | 'violet' | 'slate' | 'sky';

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogImage: string;
}

export interface SiteConfig {
  daughterName: string;
  titleBadge: string;
  birthDate: string;
  tagline: string;
  bio: string;
  customDomain: string;
  themeColor: ThemeColor;
  seo: SeoConfig;
  protectionEnabled: boolean;
  pinCode: string;
  kidsPlaygroundEnabled?: boolean;
  heroImageUrl?: string;
}

export interface Milestone {
  id: string;
  year: string;
  dateStr: string;
  title: string;
  description: string;
  category: 'ilkler' | 'egitim' | 'sanat' | 'spor' | 'gezi';
  location?: string;
  photoColor?: string;
  highlight?: boolean;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  category: 'portre' | 'etkinlik' | 'sanat' | 'tatil';
  aspectRatio: 'square' | 'wide' | 'tall';
  bgGradient: string;
  iconType: 'camera' | 'palette' | 'heart' | 'star' | 'music' | 'sun';
  imageUrl?: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  relationship: string;
  message: string;
  date: string;
  approved: boolean;
}
