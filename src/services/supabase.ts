import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default / fallback keys or from environment variables
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

class SupabaseService {
  private client: SupabaseClient | null = null;
  public url: string = '';
  public anonKey: string = '';

  constructor() {
    this.loadCredentials();
  }

  loadCredentials() {
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('nisan_supabase_url');
      const storedKey = localStorage.getItem('nisan_supabase_anon_key');
      this.url = storedUrl || ENV_SUPABASE_URL;
      this.anonKey = storedKey || ENV_SUPABASE_ANON_KEY;
    } else {
      this.url = ENV_SUPABASE_URL;
      this.anonKey = ENV_SUPABASE_ANON_KEY;
    }

    if (this.url && this.anonKey) {
      try {
        this.client = createClient(this.url, this.anonKey);
      } catch (err) {
        console.error('Failed to init Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  setCredentials(url: string, anonKey: string) {
    this.url = url.trim();
    this.anonKey = anonKey.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('nisan_supabase_url', this.url);
      localStorage.setItem('nisan_supabase_anon_key', this.anonKey);
    }
    this.loadCredentials();
  }

  getClient(): SupabaseClient | null {
    if (!this.client && this.url && this.anonKey) {
      this.loadCredentials();
    }
    return this.client;
  }

  isConfigured(): boolean {
    return Boolean(this.url && this.anonKey);
  }

  /**
   * Admin Authentication
   * 1. Checks public.admin_users table in Supabase
   * 2. Fallbacks to Supabase Auth if email format
   * 3. Fallbacks to demo/offline credentials if Supabase is not yet configured
   */
  async loginAdmin(usernameOrEmail: string, passwordPlain: string): Promise<{
    success: boolean;
    user?: { username: string; fullName: string; role: string };
    error?: string;
  }> {
    const trimmedUser = usernameOrEmail.trim();

    // If Supabase is configured, authenticate against real Supabase database
    if (this.isConfigured()) {
      const client = this.getClient();
      if (!client) {
        return { success: false, error: 'Supabase istemcisi başlatılamadı.' };
      }

      try {
        // Option A: Check admin_users table
        const { data, error } = await client
          .from('admin_users')
          .select('id, username, password, full_name, role, is_active')
          .eq('username', trimmedUser)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          // If table does not exist or permission denied
          console.warn('Supabase admin_users query warning:', error);
          
          // Try Option B: Supabase Auth (if email format)
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
                  role: 'super_admin'
                }
              };
            }
          }

          return { 
            success: false, 
            error: `Supabase hatası: ${error.message}. Lütfen admin_users tablosunu oluşturduğunuzdan emin olun.` 
          };
        }

        if (!data) {
          return { success: false, error: 'Kullanıcı adı bulunamadı veya hesap aktif değil.' };
        }

        // Verify password
        if (data.password === passwordPlain) {
          return {
            success: true,
            user: {
              username: data.username,
              fullName: data.full_name || 'Yönetici',
              role: data.role || 'admin'
            }
          };
        } else {
          return { success: false, error: 'Hatalı şifre. Lütfen tekrar deneyin.' };
        }
      } catch (err: any) {
        return { success: false, error: `Bağlantı hatası: ${err.message || 'Bilinmeyen hata'}` };
      }
    }

    // Offline / Demo Fallback when Supabase credentials are not entered yet
    if (
      (trimmedUser.toLowerCase() === 'admin' || trimmedUser.toLowerCase() === 'burak' || trimmedUser === 'burak@nisanaydin.com') &&
      (passwordPlain === 'Nisan2020!' || passwordPlain === 'admin123' || passwordPlain === 'Nisan2026!')
    ) {
      return {
        success: true,
        user: {
          username: trimmedUser,
          fullName: 'Burak Aydın (Baba)',
          role: 'admin'
        }
      };
    }

    return {
      success: false,
      error: 'Hatalı kullanıcı adı veya şifre! (Demo için: admin / Nisan2020!) veya Supabase URL ve Key bilgilerinizi tanımlayın.'
    };
  }
}

export const supabaseService = new SupabaseService();

// SQL Schema for Supabase
export const SUPABASE_ADMIN_SQL = `-- ========================================================
-- NİSAN AYDIN WEB SİTESİ: SUPABASE ADMİN TABLOSU KURULUMU
-- ========================================================
-- Bu kodu Supabase Dashboard -> SQL Editor bölümüne yapıştırıp "Run" butonuna basın.

-- 1. admin_users tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Güvenlik (Row Level Security - RLS) Etkinleştir
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Anonim kullanıcıların giriş doğrulaması için okuma politikası
CREATE POLICY "Allow public select for admin authentication" 
ON public.admin_users
FOR SELECT 
TO anon, authenticated
USING (is_active = true);

-- 4. İlk Yöneticiyi (Admin) Ekle
INSERT INTO public.admin_users (username, password, full_name, role)
VALUES 
    ('admin', 'Nisan2020!', 'Burak Aydın (Baba)', 'super_admin')
ON CONFLICT (username) 
DO UPDATE SET 
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name;

-- 5. Başarı Kontrolü
SELECT id, username, full_name, role, created_at FROM public.admin_users;
`;
