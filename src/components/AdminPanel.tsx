import React, { useState } from 'react';
import { 
  Settings, Plus, Trash2, Edit3, Check, Save, Eye, Search, 
  FileText, Image as ImageIcon, MessageSquare, Shield, Globe, 
  ExternalLink, Copy, CheckCircle2, Calendar, Database, LogOut, KeyRound
} from 'lucide-react';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';
import { supabaseService, SUPABASE_ADMIN_SQL } from '../services/supabase';

interface AdminPanelProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  milestones: Milestone[];
  onUpdateMilestones: (milestones: Milestone[]) => void;
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (gallery: GalleryItem[]) => void;
  guestbook: GuestbookEntry[];
  onUpdateGuestbook: (guestbook: GuestbookEntry[]) => void;
  onClose: () => void;
  adminUser?: { username: string; fullName: string; role: string } | null;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onUpdateConfig,
  milestones,
  onUpdateMilestones,
  blogPosts,
  onUpdateBlogPosts,
  gallery,
  onUpdateGallery,
  guestbook,
  onUpdateGuestbook,
  onClose,
  adminUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'milestones' | 'blog' | 'gallery' | 'guestbook' | 'seo' | 'supabase'>('settings');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Form states for general settings
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [saveAlert, setSaveAlert] = useState(false);

  // Form states for adding a new milestone
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    year: '2026',
    dateStr: '',
    description: '',
    category: 'ilkler',
    location: '',
    highlight: false,
  });

  // Form states for adding a new blog post
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Burak Aydın (Baba)',
    readTime: '2 dk okuma',
    tags: ['Anılar'],
  });
  const [tagsInput, setTagsInput] = useState('Anılar, Mektuplar');

  // Form states for adding a gallery item
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    title: '',
    caption: '',
    date: '2026',
    category: 'sanat',
    aspectRatio: 'square',
    bgGradient: 'from-rose-50 via-amber-100 to-pink-100',
    iconType: 'palette',
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.description) return;
    const item: Milestone = {
      id: `m-${Date.now()}`,
      title: newMilestone.title || '',
      year: newMilestone.year || '2026',
      dateStr: newMilestone.dateStr || `${newMilestone.year}`,
      description: newMilestone.description || '',
      category: (newMilestone.category as any) || 'ilkler',
      location: newMilestone.location || '',
      highlight: !!newMilestone.highlight,
    };
    onUpdateMilestones([item, ...milestones]);
    setNewMilestone({
      title: '',
      year: '2026',
      dateStr: '',
      description: '',
      category: 'ilkler',
      location: '',
      highlight: false,
    });
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateMilestones(milestones.filter(m => m.id !== id));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const slug = newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const post: BlogPost = {
      id: `p-${Date.now()}`,
      title: newPost.title || '',
      slug: slug || 'yazi',
      excerpt: newPost.excerpt || newPost.content?.slice(0, 100) || '',
      content: newPost.content || '',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: newPost.author || 'Baba',
      readTime: newPost.readTime || '2 dk',
      tags: tags.length ? tags : ['Mektup'],
    };
    onUpdateBlogPosts([post, ...blogPosts]);
    setNewPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Burak Aydın (Baba)',
      readTime: '2 dk okuma',
      tags: ['Anılar'],
    });
  };

  const handleDeletePost = (id: string) => {
    onUpdateBlogPosts(blogPosts.filter(p => p.id !== id));
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title) return;
    const item: GalleryItem = {
      id: `g-${Date.now()}`,
      title: newGalleryItem.title || '',
      caption: newGalleryItem.caption || '',
      date: newGalleryItem.date || '2026',
      category: (newGalleryItem.category as any) || 'sanat',
      aspectRatio: (newGalleryItem.aspectRatio as any) || 'square',
      bgGradient: newGalleryItem.bgGradient || 'from-rose-50 to-amber-100',
      iconType: (newGalleryItem.iconType as any) || 'palette',
    };
    onUpdateGallery([item, ...gallery]);
    setNewGalleryItem({
      title: '',
      caption: '',
      date: '2026',
      category: 'sanat',
      aspectRatio: 'square',
      bgGradient: 'from-rose-50 via-amber-100 to-pink-100',
      iconType: 'palette',
    });
  };

  const handleDeleteGallery = (id: string) => {
    onUpdateGallery(gallery.filter(g => g.id !== id));
  };

  const handleToggleGuestbookApproval = (id: string) => {
    onUpdateGuestbook(guestbook.map(entry => {
      if (entry.id === id) return { ...entry, approved: !entry.approved };
      return entry;
    }));
  };

  const handleDeleteGuestbook = (id: string) => {
    onUpdateGuestbook(guestbook.filter(g => g.id !== id));
  };

  // Generate robots.txt
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: https://${formData.customDomain}/sitemap.xml`;

  // Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${formData.customDomain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${formData.customDomain}/#kilometre-taslari</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${formData.customDomain}/#galeri</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${formData.customDomain}/#mektuplar</loc>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Subheader */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-stone-900">Yönetim Paneli (CMS)</span>
            <span className="text-xs text-stone-400 font-mono">/ {formData.customDomain}</span>
            {adminUser && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span className="font-semibold">{adminUser.fullName}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors"
            >
              Canlı Siteyi Gör
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Yönetici Oturumunu Kapat"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Güvenli Çıkış</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl mb-8 overflow-x-auto">
          {[
            { id: 'settings', label: 'Genel & Profil', icon: Settings },
            { id: 'milestones', label: `Kilometre Taşları (${milestones.length})`, icon: Calendar },
            { id: 'blog', label: `Mektuplar & Blog (${blogPosts.length})`, icon: FileText },
            { id: 'gallery', label: `Fotoğraf & Sanat (${gallery.length})`, icon: ImageIcon },
            { id: 'guestbook', label: `Anı Defteri (${guestbook.length})`, icon: MessageSquare },
            { id: 'seo', label: 'SEO & Meta Tag', icon: Globe },
            { id: 'supabase', label: 'Supabase & SQL', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-900">Site & Profil Bilgileri</h2>
                <p className="text-xs text-stone-500">
                  Kızınızın adı, doğum tarihi, alan adı ve arayüz başlıkları buradan anında değiştirilir.
                </p>
              </div>
              {saveAlert && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ayarlar başarıyla kaydedildi!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kızınızın Adı Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.daughterName}
                    onChange={(e) => setFormData({ ...formData, daughterName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Özel Alan Adınız (Custom Domain)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customDomain}
                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    placeholder="Örn: linaaydin.com"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white font-mono"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Satın aldığınız alan adını buraya yazın (örn: kızınızınadı.com).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Doğum Tarihi / Özel Tarih
                  </label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    placeholder="Örn: 14 Mayıs 2019"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Üst Başlık Rozeti (Kicker)
                  </label>
                  <input
                    type="text"
                    value={formData.titleBadge}
                    onChange={(e) => setFormData({ ...formData, titleBadge: e.target.value })}
                    placeholder="Örn: Kişisel Arşiv & Büyüme Günlüğü"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kısa Slogan / Karşılama Cümlesi
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Giriş & Biyografi Metni
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              {/* Privacy PIN Protection */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Aile İçi PIN Koruması</h4>
                  <p className="text-[11px] text-stone-500">
                    Sitedeki anı ve mektupları yalnızca PIN kodunu bilen yakınların görmesini sağlayın.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.protectionEnabled}
                      onChange={(e) => setFormData({ ...formData, protectionEnabled: e.target.checked })}
                      className="rounded text-stone-900 focus:ring-stone-900"
                    />
                    <span>PIN Aktif</span>
                  </label>
                  {formData.protectionEnabled && (
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder="PIN"
                      className="w-20 px-2 py-1 text-xs border border-stone-300 rounded font-mono text-center"
                    />
                  )}
                </div>
              </div>

              {/* 4 Yaş Eğitici Oyun Odası Toggle */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">4 Yaş Çocuk Eğitici Oyun Odası</h4>
                  <p className="text-[11px] text-stone-500">
                    Sitede çocukların oynaması için renk, şekil, saymaca ve parmak boyama oyunlarını göster.
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.kidsPlaygroundEnabled ?? true}
                      onChange={(e) => setFormData({ ...formData, kidsPlaygroundEnabled: e.target.checked })}
                      className="rounded text-stone-900 focus:ring-stone-900"
                    />
                    <span>Oyun Odası Yayında</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Milestones */}
        {activeTab === 'milestones' && (
          <div className="space-y-8">
            {/* Add Milestone Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Yeni Kilometre Taşı Ekle</span>
              </h3>
              <form onSubmit={handleAddMilestone} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Olay Başlığı</label>
                    <input
                      type="text"
                      required
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      placeholder="Örn: İlk Bisiklet Turu"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Yıl / Tarih</label>
                    <input
                      type="text"
                      value={newMilestone.dateStr}
                      onChange={(e) => setNewMilestone({ ...newMilestone, dateStr: e.target.value, year: e.target.value.slice(-4) || '2026' })}
                      placeholder="Örn: 15 Haziran 2024"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                    <select
                      value={newMilestone.category}
                      onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    >
                      <option value="ilkler">İlkler</option>
                      <option value="egitim">Eğitim & Okul</option>
                      <option value="sanat">Sanat & Çizim</option>
                      <option value="spor">Spor & Doğa</option>
                      <option value="gezi">Gezi & Seyahat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Konum / Şehir</label>
                    <input
                      type="text"
                      value={newMilestone.location}
                      onChange={(e) => setNewMilestone({ ...newMilestone, location: e.target.value })}
                      placeholder="Örn: İstanbul, Park"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMilestone.highlight}
                        onChange={(e) => setNewMilestone({ ...newMilestone, highlight: e.target.checked })}
                        className="rounded text-stone-900 focus:ring-stone-900"
                      />
                      <span>Önemli Dönüm Noktası Olarak İşaretle</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Anı Açıklaması</label>
                  <textarea
                    required
                    rows={2}
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    placeholder="O gün yaşananları ve hislerinizi özetleyin..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Kilometre Taşını Kaydet
                </button>
              </form>
            </div>

            {/* Existing Milestones List */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-stone-900 mb-4">
                Kayıtlı Anılar ({milestones.length})
              </h3>
              <div className="divide-y divide-stone-100">
                {milestones.map((m) => (
                  <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-bold text-stone-900">{m.dateStr}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{m.category}</span>
                        {m.location && <span>({m.location})</span>}
                      </div>
                      <h4 className="font-semibold text-stone-900 text-sm mt-0.5">{m.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-1">{m.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Blog Posts / Letters */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Yeni Mektup veya Blog Yazısı Yaz</span>
              </h3>
              <form onSubmit={handleAddPost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mektup Başlığı</label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Örn: 10 Yaşındaki Kızım İçin Hayat Öğütleri"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Yazar</label>
                    <input
                      type="text"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      placeholder="Burak Aydın (Baba)"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kısa Özet (Excerpt)</label>
                  <input
                    type="text"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    placeholder="Kart üzerinde görünecek 1-2 cümlelik özet"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mektup İçeriği</label>
                  <textarea
                    required
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Sevgili kızım, bu mektubu okuduğunda..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Etiketler (Virgülle ayırın)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Mektuplar, Büyüme, Sanat"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Mektubu Yayınla
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-stone-900 mb-4">
                Yayındaki Mektuplar & Yazılar ({blogPosts.length})
              </h3>
              <div className="divide-y divide-stone-100">
                {blogPosts.map((post) => (
                  <div key={post.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span>{post.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.author}</span>
                      </div>
                      <h4 className="font-semibold text-stone-900 text-sm mt-0.5">{post.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-1">{post.excerpt}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Yeni Galeri Kartı Ekle</span>
              </h3>
              <form onSubmit={handleAddGalleryItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Kart Başlığı</label>
                    <input
                      type="text"
                      required
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                      placeholder="Örn: İlk Doğa Gezisi"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Tarih / Yıl</label>
                    <input
                      type="text"
                      value={newGalleryItem.date}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, date: e.target.value })}
                      placeholder="2026"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    >
                      <option value="sanat">Sanat & Çizim</option>
                      <option value="tatil">Tatil & Doğa</option>
                      <option value="etkinlik">Etkinlik & Müzik</option>
                      <option value="portre">Portre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">İkon Tipi</label>
                    <select
                      value={newGalleryItem.iconType}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, iconType: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    >
                      <option value="palette">Palet / Boya</option>
                      <option value="heart">Kalp</option>
                      <option value="star">Yıldız</option>
                      <option value="music">Müzik</option>
                      <option value="sun">Güneş / Doğa</option>
                      <option value="camera">Kamera</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Düzen Oranı</label>
                    <select
                      value={newGalleryItem.aspectRatio}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, aspectRatio: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                    >
                      <option value="square">Kare (1:1)</option>
                      <option value="wide">Geniş (2x1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Açıklama / Not</label>
                  <input
                    type="text"
                    value={newGalleryItem.caption}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption: e.target.value })}
                    placeholder="Fotoğraf veya çizim hakkında kısa anı"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Galeriye Ekle
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-stone-900 mb-4">
                Galeri İçerikleri ({gallery.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.map(item => (
                  <div key={item.id} className="p-4 border border-stone-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-stone-900">{item.title}</h4>
                      <p className="text-xs text-stone-500">{item.caption}</p>
                      <span className="text-[11px] text-stone-400 capitalize">{item.category} · {item.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Guestbook management */}
        {activeTab === 'guestbook' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Gelen Ziyaretçi Defteri Mesajları ({guestbook.length})
              </h3>
              <p className="text-xs text-stone-500">
                Akraba ve arkadaşların bıraktığı notları inceleyip onaylayabilir veya silebilirsiniz.
              </p>
            </div>

            <div className="space-y-4">
              {guestbook.map(entry => (
                <div key={entry.id} className="p-4 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">{entry.name}</span>
                      <span className="text-xs text-stone-500">({entry.relationship})</span>
                      <span className="text-xs text-stone-400">· {entry.date}</span>
                    </div>
                    <p className="text-xs text-stone-700">"{entry.message}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleGuestbookApproval(entry.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        entry.approved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {entry.approved ? 'Yayında (Onaylı)' : 'Onayla & Yayınla'}
                    </button>
                    <button
                      onClick={() => handleDeleteGuestbook(entry.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: SEO & Meta Tag Management */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            {/* Google SERP Preview */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Google Arama Sonucu Önizlemesi (SERP Simulator)</span>
              </h3>
              
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 max-w-2xl font-sans">
                <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                  <div className="w-4 h-4 rounded-full bg-stone-300 flex items-center justify-center text-[10px]">🌐</div>
                  <span className="font-medium text-stone-800">https://{formData.customDomain}</span>
                </div>
                <div className="text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-tight mb-1">
                  {formData.seo.title}
                </div>
                <div className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {formData.seo.description}
                </div>
              </div>
            </div>

            {/* SEO Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-stone-900 mb-2">
                Meta Tag ve Arama Motoru Ayarları
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Meta Title (Başlık - Maks 60 Karakter)
                </label>
                <input
                  type="text"
                  value={formData.seo.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Meta Description (Açıklama - 150-160 Karakter)
                </label>
                <textarea
                  rows={2}
                  value={formData.seo.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Anahtar Kelimeler (Keywords)
                </label>
                <input
                  type="text"
                  value={formData.seo.keywords}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, keywords: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
                >
                  SEO Ayarlarını Kaydet
                </button>
              </div>
            </div>

            {/* Generated robots.txt and sitemap.xml */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* robots.txt */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-stone-900">robots.txt Dosyası</h4>
                  <button
                    onClick={() => handleCopy(robotsTxt, 'robots')}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    {copiedItem === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedItem === 'robots' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono overflow-x-auto">
                  {robotsTxt}
                </pre>
              </div>

              {/* sitemap.xml */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-stone-900">sitemap.xml Dosyası</h4>
                  <button
                    onClick={() => handleCopy(sitemapXml, 'sitemap')}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    {copiedItem === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedItem === 'sitemap' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono overflow-x-auto max-h-36">
                  {sitemapXml}
                </pre>
              </div>
            </div>

          </div>
        )}

        {/* Tab 7: Supabase Database & Auth Settings */}
        {activeTab === 'supabase' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>Supabase Veritabanı & Admin Giriş Ayarları</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Admin paneli kullanıcı adı ve şifresi bu Supabase projenizdeki <code>admin_users</code> tablosunda tutulur.
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  supabaseService.isConfigured()
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {supabaseService.isConfigured() ? '✓ Supabase Bağlı' : 'Önizleme / Demo Modu'}
                </div>
              </div>

              {/* API Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseService.url}
                    onChange={(e) => supabaseService.setCredentials(e.target.value, supabaseService.anonKey)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    value={supabaseService.anonKey}
                    onChange={(e) => supabaseService.setCredentials(supabaseService.url, e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                💡 <strong>Not:</strong> Bu bilgileri ayrıca Vercel'de projenizin <strong>Settings &rarr; Environment Variables</strong> bölümüne <code>VITE_SUPABASE_URL</code> ve <code>VITE_SUPABASE_ANON_KEY</code> olarak ekleyebilirsiniz.
              </div>
            </div>

            {/* Ready to Run SQL Schema for Supabase */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-display font-bold text-base text-stone-900">
                    Supabase SQL Tablo Kodu (admin_users)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Supabase Dashboard &rarr; <strong>SQL Editor</strong> bölümüne aşağıdaki kodu yapıştırıp <strong>"Run"</strong> butonuna basmanız yeterlidir:
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(SUPABASE_ADMIN_SQL, 'supabase_sql')}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedItem === 'supabase_sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedItem === 'supabase_sql' ? 'Kopyalandı!' : 'SQL Tablosunu Kopyala'}</span>
                </button>
              </div>

              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                {SUPABASE_ADMIN_SQL}
              </pre>

              <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-600">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 mb-0.5">Varsayılan Kullanıcı:</strong>
                  <code>admin</code>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 mb-0.5">Varsayılan Şifre:</strong>
                  <code>Nisan2020!</code>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <strong className="block text-stone-900 mb-0.5">Güvenlik (RLS):</strong>
                  <span>Aktif & Otomatik Yetkilendirilmiş</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
