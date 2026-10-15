import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';

export const initialSiteConfig: SiteConfig = {
  daughterName: "Nisan Aydın",
  titleBadge: "Kişisel Arşiv & Büyüme Günlüğü",
  birthDate: "23 Nisan 2020",
  tagline: "Merakla öğrenen, düş kuran ve dünyayı keşfeden neşeli bir gezgin.",
  bio: "Nisan Aydın için sevgiyle hazırlanan kişisel büyüme günlüğü ve hatırat arşivi.",
  customDomain: "nisanaydin.com",
  themeColor: "rose",
  seo: {
    title: "Nisan Aydın — Kişisel Büyüme Günlüğü & Dijital Hatırat",
    description: "Nisan Aydın'ın büyüme günlüğü, mektuplar, anılar ve 4 yaş eğitici oyun odası.",
    keywords: "Nisan Aydın, büyüme günlüğü, hatırat, mektuplar, galeri, nisanaydin.com",
    author: "Burak Aydın (Baba)",
    ogImage: ""
  },
  protectionEnabled: false,
  pinCode: "2304",
  kidsPlaygroundEnabled: true
};

// Örnek/sahte veriler gizlilik ve kullanıcının veritabanından doğrudan yönetmesi nedeniyle kaldırılmıştır.
// Tüm veriler Supabase tablolarından dinamik olarak yüklenecektir.
export const initialMilestones: Milestone[] = [];

export const initialBlogPosts: BlogPost[] = [];

export const initialGallery: GalleryItem[] = [];

export const initialGuestbook: GuestbookEntry[] = [];
