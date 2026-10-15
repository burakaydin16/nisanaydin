import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';

// Supabase project credentials (configured directly into project)
const DEFAULT_SUPABASE_URL = 'https://ckucuagmojmmpzpyuaeo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_1BPMlN2c2OW6QwnAiUQHIA_NWZ232Y4';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

class SupabaseService {
  private client: SupabaseClient | null = null;
  public url: string = SUPABASE_URL;
  public anonKey: string = SUPABASE_ANON_KEY;

  constructor() {
    this.initClient();
  }

  private initClient() {
    if (this.url && this.anonKey) {
      try {
        this.client = createClient(this.url, this.anonKey);
      } catch (err) {
        console.error('Supabase client error:', err);
        this.client = null;
      }
    }
  }

  getClient(): SupabaseClient | null {
    if (!this.client) {
      this.initClient();
    }
    return this.client;
  }

  isConfigured(): boolean {
    return Boolean(this.client && this.url && this.anonKey);
  }

  /**
   * Admin Authentication against public.admin_users
   */
  async loginAdmin(usernameOrEmail: string, passwordPlain: string): Promise<{
    success: boolean;
    user?: { username: string; fullName: string; role: string };
    error?: string;
  }> {
    const trimmedUser = usernameOrEmail.trim();
    const client = this.getClient();

    if (!client) {
      return { success: false, error: 'Veritabanı bağlantısı kurulamadı.' };
    }

    try {
      // 1. Query admin_users table in Supabase
      const { data, error } = await client
        .from('admin_users')
        .select('id, username, password, full_name, role, is_active')
        .or(`username.eq.${trimmedUser},email.eq.${trimmedUser}`)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.warn('Supabase admin_users query notice:', error.message);
        
        // Also check exact username match if or query failed
        const fallback = await client
          .from('admin_users')
          .select('id, username, password, full_name, role, is_active')
          .eq('username', trimmedUser)
          .eq('is_active', true)
          .maybeSingle();

        if (fallback.data && fallback.data.password === passwordPlain) {
          return {
            success: true,
            user: {
              username: fallback.data.username,
              fullName: fallback.data.full_name || 'Burak Aydın',
              role: fallback.data.role || 'admin'
            }
          };
        }

        // Try Supabase Auth signInWithPassword if credentials are in auth.users
        if (trimmedUser.includes('@')) {
          const authRes = await client.auth.signInWithPassword({
            email: trimmedUser,
            password: passwordPlain,
          });
          if (authRes.data.user) {
            return {
              success: true,
              user: {
                username: authRes.data.user.email || trimmedUser,
                fullName: authRes.data.user.user_metadata?.full_name || 'Burak Aydın',
                role: 'admin'
              }
            };
          }
        }

        return {
          success: false,
          error: 'Kullanıcı adı veya şifre hatalı. Lütfen Supabase tablosundaki bilgilerinizi kontrol ediniz.'
        };
      }

      if (!data) {
        // Fallback for initial father account if table is not yet seeded
        if (
          (trimmedUser.toLowerCase() === 'admin' || trimmedUser.toLowerCase() === 'burak') &&
          (passwordPlain === 'Nisan2020!' || passwordPlain === 'Nisan2026!')
        ) {
          return {
            success: true,
            user: {
              username: trimmedUser,
              fullName: 'Burak Aydın (Baba)',
              role: 'super_admin'
            }
          };
        }
        return { success: false, error: 'Kullanıcı adı bulunamadı veya hesap aktif değil.' };
      }

      // Check password match
      if (data.password === passwordPlain) {
        return {
          success: true,
          user: {
            username: data.username,
            fullName: data.full_name || 'Burak Aydın',
            role: data.role || 'admin'
          }
        };
      } else {
        return { success: false, error: 'Hatalı şifre. Lütfen tekrar deneyiniz.' };
      }
    } catch (err: any) {
      // Local fallback for initial access
      if (
        (trimmedUser.toLowerCase() === 'admin' || trimmedUser.toLowerCase() === 'burak') &&
        (passwordPlain === 'Nisan2020!' || passwordPlain === 'Nisan2026!')
      ) {
        return {
          success: true,
          user: {
            username: trimmedUser,
            fullName: 'Burak Aydın (Baba)',
            role: 'super_admin'
          }
        };
      }
      return { success: false, error: `Giriş yapılamadı: ${err.message || 'Bilinmeyen hata'}` };
    }
  }

  /**
   * Fetch Milestones from Supabase table 'milestones'
   */
  async fetchMilestones(): Promise<Milestone[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('milestones')
        .select('*')
        .order('year', { ascending: false });
      if (error || !data) return null;
      return data.map((row: any) => ({
        id: String(row.id),
        year: String(row.year || ''),
        dateStr: row.date_str || row.date || '',
        title: row.title || '',
        description: row.description || '',
        category: row.category || 'ilkler',
        location: row.location || '',
        photoColor: row.photo_color || 'from-rose-100 to-amber-100',
        highlight: Boolean(row.highlight),
      }));
    } catch {
      return null;
    }
  }

  /**
   * Fetch Blog / Letters from Supabase table 'blog_posts'
   */
  async fetchBlogPosts(): Promise<BlogPost[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map((row: any) => ({
        id: String(row.id),
        title: row.title || '',
        slug: row.slug || String(row.id),
        date: row.date_str || row.date || '',
        excerpt: row.excerpt || '',
        content: row.content || '',
        readTime: row.read_time || '3 dk okuma',
        category: row.category || 'mektup',
        author: row.author || 'Burak Aydın (Baba)',
        tags: Array.isArray(row.tags) ? row.tags : [],
      }));
    } catch {
      return null;
    }
  }

  /**
   * Fetch Gallery Items from Supabase table 'gallery_items'
   */
  async fetchGallery(): Promise<GalleryItem[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map((row: any) => ({
        id: String(row.id),
        title: row.title || '',
        date: row.date_str || row.date || '',
        category: row.category || 'anilar',
        caption: row.caption || '',
        aspectRatio: row.aspect_ratio || 'square',
        bgGradient: row.bg_gradient || 'from-amber-100 via-rose-50 to-orange-100',
        iconType: row.icon_type || 'camera',
      }));
    } catch {
      return null;
    }
  }

  /**
   * Fetch Guestbook from Supabase table 'guestbook'
   */
  async fetchGuestbook(): Promise<GuestbookEntry[] | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map((row: any) => ({
        id: String(row.id),
        name: row.name || '',
        relationship: row.relationship || 'Akraba / Ziyaretçi',
        message: row.message || '',
        date: row.date_str || row.date || '',
        approved: Boolean(row.approved),
      }));
    } catch {
      return null;
    }
  }

  /**
   * Submit Guestbook Entry to Supabase table 'guestbook'
   */
  async insertGuestbook(entry: {
    name: string;
    relationship: string;
    message: string;
    date: string;
  }): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const { error } = await client.from('guestbook').insert([
        {
          name: entry.name,
          relationship: entry.relationship,
          message: entry.message,
          date_str: entry.date,
          approved: false, // requires admin approval
        }
      ]);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch Site Config from Supabase table 'site_config'
   */
  async fetchSiteConfig(): Promise<Partial<SiteConfig> | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('site_config')
        .select('*')
        .maybeSingle();
      if (error || !data) return null;
      return {
        daughterName: data.daughter_name || undefined,
        titleBadge: data.title_badge || undefined,
        birthDate: data.birth_date || undefined,
        tagline: data.tagline || undefined,
        bio: data.bio || undefined,
        customDomain: data.custom_domain || undefined,
        themeColor: data.theme_color || undefined,
        protectionEnabled: data.protection_enabled !== undefined ? Boolean(data.protection_enabled) : undefined,
        kidsPlaygroundEnabled: data.kids_playground_enabled !== undefined ? Boolean(data.kids_playground_enabled) : undefined,
      };
    } catch {
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();
