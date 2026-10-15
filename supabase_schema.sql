-- =========================================================================
-- NİSAN AYDIN WEB SİTESİ: SUPABASE VERİTABANI VE TABLO KURULUMU
-- =========================================================================
-- Bu SQL kodlarını Supabase Dashboard -> SQL Editor sayfasına yapıştırıp 
-- sağ alttaki "Run" (Çalıştır) butonuna basınız.
-- =========================================================================

-- 1. ADMIN KULLANICILARI TABLOSU (Admin Girişi İçin)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select active admin users" ON public.admin_users;
CREATE POLICY "Allow select active admin users"
ON public.admin_users
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- İlk Yönetici Hesabı (Kullanıcı Adı: admin, Şifre: Nisan2020!)
INSERT INTO public.admin_users (username, password, full_name, role)
VALUES ('admin', 'Nisan2020!', 'Burak Aydın (Baba)', 'super_admin')
ON CONFLICT (username) 
DO UPDATE SET 
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name;


-- 2. SİTE GENEL AYARLARI TABLOSU
CREATE TABLE IF NOT EXISTS public.site_config (
    id INT PRIMARY KEY DEFAULT 1,
    daughter_name TEXT NOT NULL DEFAULT 'Nisan Aydın',
    title_badge TEXT DEFAULT 'Kişisel Arşiv & Büyüme Günlüğü',
    birth_date TEXT DEFAULT '23 Nisan 2020',
    tagline TEXT DEFAULT 'Merakla öğrenen, düş kuran ve dünyayı keşfeden neşeli bir gezgin.',
    bio TEXT DEFAULT 'Nisan Aydın için sevgiyle hazırlanan kişisel büyüme günlüğü ve hatırat arşivi.',
    custom_domain TEXT DEFAULT 'nisanaydin.com',
    theme_color TEXT DEFAULT 'rose',
    protection_enabled BOOLEAN DEFAULT false,
    kids_playground_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site config" ON public.site_config;
CREATE POLICY "Public can view site config" 
ON public.site_config FOR SELECT 
TO anon, authenticated USING (true);

INSERT INTO public.site_config (id, daughter_name)
VALUES (1, 'Nisan Aydın')
ON CONFLICT (id) DO NOTHING;


-- 3. KİLOMETRE TAŞLARI & ANILAR TABLOSU
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    date_str TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'ilkler',
    location TEXT,
    photo_color TEXT DEFAULT 'from-rose-100 to-amber-100',
    highlight BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view milestones" ON public.milestones;
CREATE POLICY "Public can view milestones" 
ON public.milestones FOR SELECT 
TO anon, authenticated USING (true);


-- 4. MEKTUPLAR & BLOG TABLOSU
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date_str TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    read_time TEXT DEFAULT '3 dk okuma',
    category TEXT DEFAULT 'mektup',
    author TEXT DEFAULT 'Burak Aydın (Baba)',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" 
ON public.blog_posts FOR SELECT 
TO anon, authenticated USING (published = true);


-- 5. FOTOĞRAF & SANAT GALERİSİ TABLOSU
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date_str TEXT,
    category TEXT DEFAULT 'anilar',
    caption TEXT,
    aspect_ratio TEXT DEFAULT 'square',
    bg_gradient TEXT DEFAULT 'from-amber-100 via-rose-50 to-orange-100',
    icon_type TEXT DEFAULT 'camera',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery_items;
CREATE POLICY "Public can view gallery" 
ON public.gallery_items FOR SELECT 
TO anon, authenticated USING (true);


-- 6. ANILAR VE ZİYARETÇİ DEFTERİ TABLOSU
CREATE TABLE IF NOT EXISTS public.guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    relationship TEXT DEFAULT 'Akraba / Ziyaretçi',
    message TEXT NOT NULL,
    date_str TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved guestbook entries" ON public.guestbook;
CREATE POLICY "Public can read approved guestbook entries" 
ON public.guestbook FOR SELECT 
TO anon, authenticated USING (approved = true);

DROP POLICY IF EXISTS "Public can submit guestbook entries" ON public.guestbook;
CREATE POLICY "Public can submit guestbook entries" 
ON public.guestbook FOR INSERT 
TO anon, authenticated WITH CHECK (true);
