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
      // 1. If user entered an email address with '@', try Supabase Auth signInWithPassword
      if (trimmedUser.includes('@')) {
        try {
          const authRes = await client.auth.signInWithPassword({
            email: trimmedUser,
            password: passwordPlain,
          });
          if (authRes.data?.user) {
            return {
              success: true,
              user: {
                username: authRes.data.user.email || trimmedUser,
                fullName: authRes.data.user.user_metadata?.full_name || trimmedUser,
                role: 'admin'
              }
            };
          }
        } catch {
          // If auth with email fails, fall through to admin_users table query
        }
      }

      // 2. Try secure PostgreSQL RPC function first (keeps passwords hidden from public API)
      try {
        const { data: rpcRes, error: rpcErr } = await client.rpc('verify_admin_login', {
          p_username: trimmedUser,
          p_password: passwordPlain
        });
        if (!rpcErr && rpcRes) {
          if (rpcRes.success) {
            return {
              success: true,
              user: {
                username: rpcRes.username || trimmedUser,
                fullName: rpcRes.fullName || trimmedUser,
                role: rpcRes.role || 'admin'
              }
            };
          } else if (rpcRes.error) {
            return {
              success: false,
              error: rpcRes.error
            };
          }
        }
      } catch {
        // If RPC is not created yet, continue to fallback
      }

      // 3. Fallback: Query admin_users table in Supabase by username (case-insensitive)
      // Note: admin_users table uses 'username' and 'password' (there is no email column)
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .ilike('username', trimmedUser)
        .maybeSingle();

      if (error) {
        console.warn('Supabase admin_users query notice:', error.message);
        return {
          success: false,
          error: `Veritabanı hatası: ${error.message}`
        };
      }

      if (!data) {
        return { 
          success: false, 
          error: `"${trimmedUser}" kullanıcı adı bulunamadı. Lütfen veritabanındaki kullanıcı adınızı kontrol ediniz.` 
        };
      }

      // Check if account is active (if is_active field is present)
      if (data.is_active === false) {
        return { 
          success: false, 
          error: 'Bu kullanıcı hesabı pasif durumdadır.' 
        };
      }

      // Compare password against database record
      const dbPassword = String(data.password ?? '');
      const inputPassword = String(passwordPlain ?? '');

      if (dbPassword === inputPassword || dbPassword.trim() === inputPassword.trim()) {
        return {
          success: true,
          user: {
            username: data.username,
            fullName: data.full_name || data.username,
            role: data.role || 'admin'
          }
        };
      } else {
        return { 
          success: false, 
          error: 'Hatalı şifre girdiniz. Lütfen şifrenizi kontrol ediniz.' 
        };
      }
    } catch (err: any) {
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
        author: row.author || 'Aile',
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

  /**
   * Fetch visitor count from Supabase table 'site_visits' or localStorage
   */
  async fetchVisitorCount(): Promise<number> {
    const client = this.getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('site_visits')
          .select('count')
          .eq('id', 'total_visits')
          .maybeSingle();
        if (!error && data && typeof data.count === 'number') {
          localStorage.setItem('nisan_visitor_count', String(data.count));
          return data.count;
        }
      } catch {
        // Fallback to localStorage
      }
    }
    const local = localStorage.getItem('nisan_visitor_count');
    return local ? parseInt(local, 10) : 1;
  }

  /**
   * Record a new visitor (counted once per browsing session)
   */
  async recordVisit(): Promise<number> {
    const hasVisitedThisSession = typeof window !== 'undefined' && sessionStorage.getItem('nisan_session_visited');
    const localCount = typeof window !== 'undefined' 
      ? parseInt(localStorage.getItem('nisan_visitor_count') || '1', 10) 
      : 1;

    const client = this.getClient();
    if (!client) {
      if (!hasVisitedThisSession && typeof window !== 'undefined') {
        const newCount = localCount + 1;
        localStorage.setItem('nisan_visitor_count', String(newCount));
        sessionStorage.setItem('nisan_session_visited', 'true');
        return newCount;
      }
      return localCount;
    }

    try {
      const { data, error } = await client
        .from('site_visits')
        .select('count')
        .eq('id', 'total_visits')
        .maybeSingle();

      let current = (!error && data && typeof data.count === 'number') ? data.count : localCount;

      if (!hasVisitedThisSession) {
        current = current + 1;
        await client.from('site_visits').upsert([
          { id: 'total_visits', count: current, updated_at: new Date().toISOString() }
        ]);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('nisan_session_visited', 'true');
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('nisan_visitor_count', String(current));
      }
      return current;
    } catch {
      if (!hasVisitedThisSession && typeof window !== 'undefined') {
        const newCount = localCount + 1;
        localStorage.setItem('nisan_visitor_count', String(newCount));
        sessionStorage.setItem('nisan_session_visited', 'true');
        return newCount;
      }
      return localCount;
    }
  }
}

export const supabaseService = new SupabaseService();
