import React, { useState } from 'react';
import { 
  Heart, Calendar, MapPin, Sparkles, BookOpen, MessageSquare, 
  Send, X, Palette, Star, Camera, Music, Sun, Award, Clock, ArrowRight,
  ShieldCheck, Lock, Unlock, Gamepad2
} from 'lucide-react';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';
import { KidsPlayground } from './KidsPlayground';

interface DaughterSiteViewProps {
  config: SiteConfig;
  milestones: Milestone[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  guestbook: GuestbookEntry[];
  onAddGuestbookEntry: (entry: Omit<GuestbookEntry, 'id' | 'date' | 'approved'>) => void;
  onOpenAdmin: () => void;
}

export const DaughterSiteView: React.FC<DaughterSiteViewProps> = ({
  config,
  milestones,
  blogPosts,
  gallery,
  guestbook,
  onAddGuestbookEntry,
  onOpenAdmin,
}) => {
  // Category filter for milestones
  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');
  
  // Selected blog post for modal reading
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Selected gallery item for modal lightbox
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // Guestbook submission form state
  const [guestName, setGuestName] = useState('');
  const [guestRel, setGuestRel] = useState('Aile Dostu');
  const [guestMsg, setGuestMsg] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // PIN protection for private memories
  const [isUnlocked, setIsUnlocked] = useState(!config.protectionEnabled);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.pinCode) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMsg.trim()) return;

    onAddGuestbookEntry({
      name: guestName.trim(),
      relationship: guestRel,
      message: guestMsg.trim()
    });

    setGuestName('');
    setGuestMsg('');
    setSubmittedStatus('Mesajınız sevgiyle kaydedildi! Admin onayından sonra defterde görünecektir.');
    setTimeout(() => setSubmittedStatus(null), 5000);
  };

  // Filtered milestones
  const filteredMilestones = milestoneFilter === 'all'
    ? milestones
    : milestones.filter(m => m.category === milestoneFilter);

  // Approved guestbook entries
  const approvedEntries = guestbook.filter(e => e.approved);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Notification Bar if domain is set */}
      <div className="bg-stone-100/80 border-b border-stone-200/60 py-2 px-4 text-center text-xs text-stone-600">
        <span className="font-medium text-stone-900">{config.customDomain}</span> için hazırlanmış özel dijital büyüme günlüğü ve kişisel arşiv sitesi.
      </div>

      {/* Hero Section */}
      <section id="hikaye" className="relative pt-16 pb-20 overflow-hidden border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-800 tracking-wider uppercase">
                <span>{config.titleBadge}</span>
                <span aria-hidden="true">·</span>
                <span>{config.birthDate}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
                {config.daughterName}
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 font-light leading-relaxed max-w-xl">
                {config.tagline}
              </p>

              <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-xl">
                {config.bio}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#kilometre-taslari"
                  className="px-5 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>Anıları Keşfet</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#mektuplar"
                  className="px-5 py-2.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-stone-400" />
                  <span>Babadan Mektuplar</span>
                </a>

                <a
                  href="#oyunlar"
                  className="px-5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold hover:bg-rose-100 transition-colors inline-flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4 text-rose-700" />
                  <span>English Kids Lab (4.5 Yaş) 🚀</span>
                </a>

                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-4"
                >
                  Siteyi Yönet (Admin)
                </button>
              </div>
            </div>

            {/* Right Column: High aesthetic visual composition */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="relative rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border border-stone-200/80 p-6 shadow-sm">
                  
                  {/* Subtle corner badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200/50 text-xs text-stone-500">
                    <span className="flex items-center gap-1.5 font-medium text-stone-800">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      Ömürlük Dijital Miras
                    </span>
                    <span className="font-mono text-[11px] text-stone-400">EST. {config.birthDate.slice(-4)}</span>
                  </div>

                  {/* Visual artwork container */}
                  <div className="my-6 aspect-square rounded-xl bg-white/80 border border-stone-200/70 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-200 to-amber-200 flex items-center justify-center mb-4 shadow-inner">
                      <Sparkles className="w-10 h-10 text-stone-700/80" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-1">
                      {config.daughterName}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-xs">
                      "Çocuklar dünyanın en narin çiçekleridir; her günleri yeni bir mucize."
                    </p>
                    
                    {/* Live age or milestone counter */}
                    <div className="mt-4 pt-4 border-t border-stone-100 w-full flex items-center justify-around text-xs text-stone-600">
                      <div>
                        <span className="block font-bold text-stone-900 text-sm font-mono">{milestones.length}</span>
                        <span className="text-[11px] text-stone-400">Kilometre Taşı</span>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <span className="block font-bold text-stone-900 text-sm font-mono">{gallery.length}</span>
                        <span className="text-[11px] text-stone-400">Anı Albümü</span>
                      </div>
                      <div className="w-px h-6 bg-stone-200" />
                      <div>
                        <span className="block font-bold text-stone-900 text-sm font-mono">{blogPosts.length}</span>
                        <span className="text-[11px] text-stone-400">Özel Mektup</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom reassurance card */}
                  <div className="bg-white/90 rounded-lg p-3 text-xs text-stone-600 border border-stone-200/50 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Kalıcı Domain & SSL Güvenliği
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">{config.customDomain}</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* KPI Proof Strip below split */}
          <div className="mt-16 pt-8 border-t border-stone-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl font-bold font-display text-stone-900">0 TL</span>
              <p className="text-xs text-stone-500">Ömür Boyu Ücretsiz Vercel Dağıtımı</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold font-display text-stone-900">100/100</span>
              <p className="text-xs text-stone-500">Mobil Uyum & Hız Skoru</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold font-display text-stone-900">Özel CMS</span>
              <p className="text-xs text-stone-500">Kolay Türkçe Admin Paneli</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold font-display text-stone-900">Tam Mülkiyet</span>
              <p className="text-xs text-stone-500">Kendi Alan Adınızda Bağımsız</p>
            </div>
          </div>

        </div>
      </section>

      {/* PIN Protection Gate (if enabled) */}
      {config.protectionEnabled && !isUnlocked && (
        <section className="py-16 bg-stone-100 border-b border-stone-200 text-center">
          <div className="max-w-md mx-auto px-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-stone-700" />
            </div>
            <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
              Aile Arşivi PIN Korumalı
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Bu sitedeki özel anı ve fotoğraflar aile güvenliği için PIN ile korunmaktadır.
            </p>
            <form onSubmit={handlePinSubmit} className="flex gap-2 justify-center">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Giriniz (Varsayılan: 1405)"
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-center w-48 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
              >
                Giriş
              </button>
            </form>
            {pinError && (
              <p className="text-xs text-red-600 mt-2">Hatalı PIN kodu. Tekrar deneyiniz.</p>
            )}
          </div>
        </section>
      )}

      {/* Main Content (visible if unlocked) */}
      {isUnlocked && (
        <>
          {/* Section 1: Milestones & Timeline */}
          <section id="kilometre-taslari" className="py-20 border-b border-stone-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Kronolojik Hatırat
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-900">
                    Büyüme Yolculuğu & Kilometre Taşları
                  </h2>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto">
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'ilkler', label: 'İlkler' },
                    { id: 'egitim', label: 'Eğitim & Okul' },
                    { id: 'sanat', label: 'Sanat & Resim' },
                    { id: 'spor', label: 'Spor & Doğa' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMilestoneFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        milestoneFilter === tab.id
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Container */}
              {filteredMilestones.length === 0 ? (
                <div className="py-12 px-6 bg-white rounded-2xl border border-stone-200/80 text-center max-w-md mx-auto shadow-sm">
                  <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-stone-800 text-sm">Henüz Anı veya Kilometre Taşı Eklenmedi</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Veritabanı tablosundan veya yönetici panelinden eklendikçe burada kronolojik olarak listelenecektir.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-stone-200 ml-4 md:ml-32 space-y-12">
                  {filteredMilestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-6 md:pl-10 group">
                      
                      {/* Circle Node */}
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-900 group-hover:scale-125 transition-transform" />

                      {/* Left Year Label on Desktop */}
                      <div className="hidden md:block absolute -left-32 top-1 w-24 text-right">
                        <span className="font-display font-bold text-stone-900 text-lg">
                          {milestone.year}
                        </span>
                        <span className="block text-[11px] text-stone-400">
                          {milestone.dateStr.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>

                      {/* Milestone Card */}
                      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm hover:border-stone-300 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                          <span className="md:hidden font-bold text-stone-900">{milestone.dateStr}</span>
                          <span className="md:hidden" aria-hidden="true">·</span>
                          <span className="capitalize">{milestone.category}</span>
                          {milestone.location && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                {milestone.location}
                              </span>
                            </>
                          )}
                          {milestone.highlight && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-rose-700 font-medium">Önemli Dönüm Noktası</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display font-semibold text-lg text-stone-900 mb-2">
                          {milestone.title}
                        </h3>

                        <p className="text-sm text-stone-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* Section 2: Curated Gallery & Moments */}
          <section id="galeri" className="py-20 border-b border-stone-200/60 bg-stone-50/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Görsel Anı Defteri
                  </div>
                  <h2 className="font-display text-3xl font-bold text-stone-900">
                    Özel Anlar & Sanat Eserleri
                  </h2>
                </div>
                <p className="text-xs text-stone-500 max-w-sm">
                  Kızınızın büyüme sürecindeki çizimleri, aile gezileri ve unutulmaz anları için minimalist galeri.
                </p>
              </div>

              {/* Bento Grid Gallery */}
              {gallery.length === 0 ? (
                <div className="py-12 px-6 bg-white rounded-2xl border border-stone-200/80 text-center max-w-md mx-auto shadow-sm">
                  <Camera className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-stone-800 text-sm">Henüz Görsel Eklenmedi</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fotoğraf ve çizimler veritabanı tablosundan veya yönetici panelinden eklendiğinde burada sergilenecektir.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => {
                    const getIcon = () => {
                      switch (item.iconType) {
                        case 'palette': return <Palette className="w-6 h-6 text-stone-700" />;
                        case 'camera': return <Camera className="w-6 h-6 text-stone-700" />;
                        case 'heart': return <Heart className="w-6 h-6 text-stone-700" />;
                        case 'star': return <Star className="w-6 h-6 text-stone-700" />;
                        case 'music': return <Music className="w-6 h-6 text-stone-700" />;
                        case 'sun': return <Sun className="w-6 h-6 text-stone-700" />;
                        default: return <Sparkles className="w-6 h-6 text-stone-700" />;
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGalleryItem(item)}
                        className={`group relative rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                          item.aspectRatio === 'wide' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        {/* Image representation container */}
                        <div className={`h-48 sm:h-56 w-full bg-gradient-to-br ${item.bgGradient} flex flex-col items-center justify-center relative p-6 transition-transform group-hover:scale-[1.02]`}>
                          <div className="w-12 h-12 rounded-full bg-white/90 shadow-sm flex items-center justify-center mb-3">
                            {getIcon()}
                          </div>
                          <span className="text-xs font-medium text-stone-600 bg-white/60 px-2.5 py-1 rounded-full">
                            {item.title}
                          </span>
                        </div>

                        {/* Caption box */}
                        <div className="p-4 bg-white">
                          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                            <span className="capitalize">{item.category}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="font-display font-semibold text-stone-900 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {item.caption}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </section>

          {/* Section: 4 Yaş Çocuk Eğitici Oyun Odası */}
          {config.kidsPlaygroundEnabled !== false && (
            <section id="oyunlar" className="scroll-mt-16">
              <KidsPlayground daughterName={config.daughterName} />
            </section>
          )}

          {/* Section 3: Letters & Blog */}
          <section id="mektuplar" className="py-20 border-b border-stone-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="mb-12">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Kişisel Mektuplar & Düşünceler
                </div>
                <h2 className="font-display text-3xl font-bold text-stone-900">
                  Gelecekteki Sana Notlar & Blog
                </h2>
                <p className="text-sm text-stone-500 mt-2 max-w-xl">
                  Büyüdüğünde geriye dönüp okuyabilmesi için babası ve ailesi tarafından kaleme alınan sevgi dolu notlar.
                </p>
              </div>

              {/* Blog Post List */}
              {blogPosts.length === 0 ? (
                <div className="py-12 px-6 bg-white rounded-2xl border border-stone-200/80 text-center max-w-md mx-auto shadow-sm">
                  <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-stone-800 text-sm">Henüz Mektup veya Yazı Bulunmuyor</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Kızınız için geleceğe yazılan mektuplar veritabanından veya yönetim panelinden eklendikçe burada görüntülenecektir.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {blogPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bg-white rounded-xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-stone-400 transition-colors cursor-pointer shadow-sm group"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                          <span>{post.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="font-display font-semibold text-lg text-stone-900 group-hover:text-stone-700 transition-colors leading-snug mb-3">
                          {post.title}
                        </h3>

                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">{post.author}</span>
                        <span className="text-stone-900 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Mektubu Oku <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* Section 4: Guestbook / Anı Defteri */}
          <section id="ani-defteri" className="py-20 border-b border-stone-200/60 bg-stone-50/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Message display */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Sevgi Köşesi
                    </div>
                    <h2 className="font-display text-3xl font-bold text-stone-900">
                      Aile ve Ziyaretçi Defteri
                    </h2>
                    <p className="text-sm text-stone-500 mt-2">
                      Akrabaların, öğretmenlerin ve dostların kızınız için bıraktığı iyi dilekler.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {approvedEntries.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">Henüz onaylanmış mesaj bulunmuyor.</p>
                    ) : (
                      approvedEntries.map((entry) => (
                        <div key={entry.id} className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm">
                          <p className="text-sm text-stone-700 leading-relaxed mb-3">
                            "{entry.message}"
                          </p>
                          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                            <span className="font-semibold text-stone-900">
                              {entry.name} <span className="font-normal text-stone-500">({entry.relationship})</span>
                            </span>
                            <span>{entry.date}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Message form */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-lg text-stone-900 mb-1">
                      {config.daughterName} İçin Not Bırakın
                    </h3>
                    <p className="text-xs text-stone-500 mb-6">
                      Mesajınız sitede yayınlanmak üzere doğrudan babasına iletilir.
                    </p>

                    {submittedStatus && (
                      <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        {submittedStatus}
                      </div>
                    )}

                    <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Adınız Soyadınız
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Örn: Burak Aydın"
                          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Yakınlığınız
                        </label>
                        <select
                          value={guestRel}
                          onChange={(e) => setGuestRel(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                        >
                          <option value="Baba">Baba</option>
                          <option value="Anne">Anne</option>
                          <option value="Dede / Anneanne / Babaanne">Dede / Büyükanne</option>
                          <option value="Amca / Dayı / Teyze / Hala">Akraba</option>
                          <option value="Öğretmen">Öğretmen</option>
                          <option value="Aile Dostu">Aile Dostu</option>
                          <option value="Kuzen / Arkadaş">Arkadaş</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          İyi Dilekleriniz / Anınız
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={guestMsg}
                          onChange={(e) => setGuestMsg(e.target.value)}
                          placeholder="Geleceğe bırakmak istediğiniz sevgi dolu bir mesaj..."
                          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Notu Sevgiyle Gönder</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>

            </div>
          </section>
        </>
      )}

      {/* Minimalist Footer */}
      <footer className="py-12 bg-white border-t border-stone-200 text-stone-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-stone-800">{config.daughterName}</span> — Kişisel Büyüme & Hatırat Arşivi.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Alan Adı: {config.customDomain}</span>
            <span aria-hidden="true">·</span>
            <span>Vercel & Global CDN Uyumlu</span>
            <span aria-hidden="true">·</span>
            <button onClick={onOpenAdmin} className="text-stone-700 hover:underline">
              Yönetici Girişi
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Full Blog Post Reader */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative border border-stone-200">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
              <span>{selectedPost.date}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedPost.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>Yazar: {selectedPost.author}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-6 leading-tight">
              {selectedPost.title}
            </h2>

            <div className="prose prose-stone text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-light">
              {selectedPost.content}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-stone-500 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Gallery Lightbox */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-stone-200">
            <button
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`aspect-video rounded-xl bg-gradient-to-br ${selectedGalleryItem.bgGradient} flex flex-col items-center justify-center p-6 mb-4`}>
              <div className="w-16 h-16 rounded-full bg-white/90 shadow-sm flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-stone-700" />
              </div>
              <span className="text-xs font-mono text-stone-500">{selectedGalleryItem.date}</span>
            </div>

            <h3 className="font-display font-bold text-xl text-stone-900 mb-1">
              {selectedGalleryItem.title}
            </h3>

            <p className="text-sm text-stone-600 mb-4">
              {selectedGalleryItem.caption}
            </p>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
              <span className="capitalize">Kategori: {selectedGalleryItem.category}</span>
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="text-stone-900 font-medium hover:underline"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
