/**
 * API Service Abstraction Layer
 * 
 * BU KATMANIN AMACI:
 * Bugün: Veriler LocalStorage / JSON üzerinden çalışır.
 * İleride (.NET Web API yazdığınızda):
 * Yalnızca aşağıdaki BASE_URL ve fetch fonksiyonlarını gerçek .NET API endpoint'lerinize bağlarsınız.
 * Frontend bileşenlerinizde hiçbir şeyi değiştirmeniz gerekmez!
 */

import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';

// İleride buraya .NET API adresinizi yazacaksınız: örn: 'https://api.kizinizinadi.com/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiService = {
  // 1. Site Konfigürasyonu
  async getConfig(): Promise<SiteConfig | null> {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/config`);
      return res.json();
    }
    const local = localStorage.getItem('daughter_site_config');
    return local ? JSON.parse(local) : null;
  },

  async saveConfig(config: SiteConfig): Promise<boolean> {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return res.ok;
    }
    localStorage.setItem('daughter_site_config', JSON.stringify(config));
    return true;
  },

  // 2. Kilometre Taşları & Anılar (.NET: GET /api/milestones)
  async getMilestones(): Promise<Milestone[]> {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/milestones`);
      return res.json();
    }
    const local = localStorage.getItem('daughter_site_milestones');
    return local ? JSON.parse(local) : [];
  },

  async addMilestone(item: Milestone): Promise<Milestone> {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return res.json();
    }
    return item;
  },

  // 3. Mektuplar & Blog (.NET: GET /api/posts)
  async getBlogPosts(): Promise<BlogPost[]> {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/posts`);
      return res.json();
    }
    const local = localStorage.getItem('daughter_site_blog');
    return local ? JSON.parse(local) : [];
  },

  // 4. Fotoğraf & Medya Yükleme (.NET: POST /api/media/upload)
  async uploadPhoto(file: File): Promise<{ url: string }> {
    if (API_BASE_URL) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData
      });
      return res.json();
    }
    // Yerel önizleme fallback
    return { url: URL.createObjectURL(file) };
  }
};
