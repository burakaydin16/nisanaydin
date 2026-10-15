import React from 'react';
import { 
  Heart, Calendar, MapPin, Sparkles, BookOpen, 
  Camera, ArrowRight, ShieldCheck, Gamepad2, Award, Clock
} from 'lucide-react';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';
import { AppRoute } from '../types/routes';
import { SiteFooter } from '../components/SiteFooter';

interface HomePageProps {
  config: SiteConfig;
  milestones: Milestone[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  guestbook: GuestbookEntry[];
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  config,
  milestones,
  blogPosts,
  gallery,
  guestbook,
  onNavigate,
  onOpenAdmin,
}) => {
  const latestMilestone = milestones.length > 0 ? milestones[0] : null;
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const approvedGuestbookCount = guestbook.filter(e => e.approved).length;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-stone-200/70">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Story & Greeting */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Kişisel Çocukluk & Büyüme Hatıratı</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
                Hoş Geldiniz, Burası{' '}
                <span className="text-stone-900 underline decoration-rose-300 decoration-wavy decoration-2">
                  {config.daughterName}
                </span>
                'ın Dünyası
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-serif italic">
                "{config.tagline || 'Hayatımızın en güzel melodisi, attığı her adımda bize dünyayı yeniden öğreten biricik kızımız.'}"
              </p>

              {/* Bio block */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-sm text-stone-700 leading-relaxed">
                {config.bio || 'Bu arşiv; ilk adımlarından komik sözlerine, anaokulu anılarından aile mektuplarına kadar Nisan Aydın için sevgiyle biriktirdiğimiz anıların kalıcı yuvasıdır.'}
              </div>

              {/* Quick Profile Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Doğum: <strong>{config.birthDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Yaş: <strong>4.5 Yaş (Pre-K)</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>İstanbul, Türkiye</span>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigate('/anilar')}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 group"
                >
                  <span>Anı Yolculuğunu Keşfet</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/oyun')}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Oyun & Öğrenme Odası</span>
                </button>
              </div>

            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm rounded-3xl border border-stone-200 bg-white p-4 shadow-xl">
                
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-gradient-to-tr from-rose-100 via-amber-50 to-stone-100 flex items-center justify-center">
                  {config.heroImageUrl ? (
                    <img
                      src={config.heroImageUrl}
                      alt={config.daughterName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-md flex items-center justify-center text-3xl">
                        👧
                      </div>
                      <h3 className="font-display font-bold text-xl text-stone-900">
                        {config.daughterName}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Sevgiyle büyüyen, öğrenmeyi ve şarkı söylemeyi çok seven neşe kaynağımız.
                      </p>
                    </div>
                  )}

                  {/* Age Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-stone-800 shadow-sm border border-stone-200/60">
                    4.5 Yaşında 🌸
                  </div>
                </div>

                {/* Warm family guarantee card */}
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Ömürlük Dijital Aile Arşivi</span>
                  </span>
                  <span className="font-mono font-medium text-stone-700">2026</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Pages: 4 Dedicated Page Cards */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Ayrı Sayfalarda Yönetilen Arşiv
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            {config.daughterName} İçin Hazırlanan Özel Bölümler
          </h2>
          <p className="text-sm text-stone-500 mt-2">
            İstediğiniz bölüme tıklayarak ayrı sayfasında detaylı inceleyebilir ve yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Milestones */}
          <div 
            onClick={() => onNavigate('/anilar')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-stone-400 mb-1">/anilar</div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                Anılar & Kilometre Taşları
              </h3>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                {latestMilestone 
                  ? `Son Anı: "${latestMilestone.title}" (${latestMilestone.dateStr || latestMilestone.year}). Tüm kronolojik büyüme adımları.`
                  : 'İlk adımlar, komik sözler ve büyüme sürecindeki tüm unutulmaz ilkler.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
              <span>Anıları İncele</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Gallery */}
          <div 
            onClick={() => onNavigate('/galeri')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-stone-400 mb-1">/galeri</div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                Fotoğraf & Resim Galerisi
              </h3>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                Nisan'ın rengarenk çizimleri, aile gezileri, tatil hatıraları ve özel fotoğraf albümleri.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
              <span>{gallery.length} Görseli Aç</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Letters & Guestbook */}
          <div 
            onClick={() => onNavigate('/mektuplar')}
            className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-stone-400 mb-1">/mektuplar</div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                Mektuplar & Mesaj Defteri
              </h3>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                {latestPost
                  ? `Mektup: "${latestPost.title}". Aile yazıları ve ziyaretçilerin bıraktığı iyi dilekler.`
                  : 'Gelecekteki Nisan Aydın için kaleme alınan mektuplar ve ziyaretçi notları.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
              <span>{approvedGuestbookCount} Mesaj & Mektuplar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Game / Kids Lab */}
          <div 
            onClick={() => onNavigate('/oyun')}
            className="group p-6 rounded-2xl bg-rose-50/60 border border-rose-200 hover:border-rose-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
              4.5 YAŞ
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-rose-400 mb-1">/oyun</div>
              <h3 className="font-display font-bold text-lg text-rose-950 mb-2 flex items-center gap-1.5">
                <span>Oyun & Öğrenme Odası</span>
              </h3>
              <p className="text-xs text-rose-800 line-clamp-3 leading-relaxed">
                İngilizce harfler, fonetik sesler, örüntü mantığı, sayma ve hayvan eşleştirme oyunları. (Sessiz açılır, istendiğinde sesli oynanır)
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-900 group-hover:text-rose-700 transition-colors">
              <span>Oyun Odasına Gir 🚀</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Warm Quote Banner */}
      <section className="py-12 bg-stone-100/60 border-t border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-100 mx-auto mb-3" />
          <blockquote className="font-serif italic text-lg sm:text-xl text-stone-800 max-w-2xl mx-auto">
            "Bir çocuğun büyümesine tanıklık etmek, dünyadaki tüm mucizeleri her gün yeniden izlemektir."
          </blockquote>
          <div className="text-xs font-medium text-stone-500 mt-3">
            Nisan Aydın Aile Arşivi
          </div>
        </div>
      </section>

      {/* Footer with Minimalist Visitor Counter */}
      <SiteFooter 
        daughterName={config.daughterName}
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
