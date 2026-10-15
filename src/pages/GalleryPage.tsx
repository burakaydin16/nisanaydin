import React, { useState } from 'react';
import { 
  Camera, ArrowLeft, Palette, Heart, Star, Music, Sun, Sparkles, X, Plus
} from 'lucide-react';
import { SiteConfig, GalleryItem } from '../types/site';
import { AppRoute } from '../types/routes';
import { SiteFooter } from '../components/SiteFooter';

interface GalleryPageProps {
  config: SiteConfig;
  gallery: GalleryItem[];
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  config,
  gallery,
  onNavigate,
  onOpenAdmin,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredGallery = categoryFilter === 'all'
    ? gallery
    : gallery.filter(g => g.category.toLowerCase() === categoryFilter.toLowerCase());

  const getIcon = (type: string) => {
    switch (type) {
      case 'palette': return <Palette className="w-5 h-5 text-stone-700" />;
      case 'camera': return <Camera className="w-5 h-5 text-stone-700" />;
      case 'heart': return <Heart className="w-5 h-5 text-rose-600 fill-rose-100" />;
      case 'star': return <Star className="w-5 h-5 text-amber-500 fill-amber-300" />;
      case 'music': return <Music className="w-5 h-5 text-stone-700" />;
      case 'sun': return <Sun className="w-5 h-5 text-amber-500" />;
      default: return <Sparkles className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col">
      
      {/* Header */}
      <div className="bg-stone-50/80 border-b border-stone-200/80 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-3">
            <button 
              onClick={() => onNavigate('/')} 
              className="hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ana Sayfa</span>
            </button>
            <span>/</span>
            <span className="text-stone-800 font-semibold">Galeri</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold mb-2">
                <Camera className="w-3 h-3" />
                <span>Görsel Hatıra Albümü</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                {config.daughterName}'ın Fotoğraf & Çizim Galerisi
              </h1>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Büyüme sürecindeki çizimler, aile gezileri, ilk sanat denemeleri ve hayatın en neşeli anları.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto shrink-0">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'sanat', label: 'Sanat & Çizim' },
                { id: 'aile', label: 'Aile & Gezi' },
                { id: 'okul', label: 'Okul & Anaokulu' },
                { id: 'oyun', label: 'Oyun' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {filteredGallery.length === 0 ? (
          <div className="py-16 px-6 bg-white rounded-3xl border border-stone-200 text-center max-w-md mx-auto shadow-sm">
            <Camera className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-stone-800 text-base">
              Henüz Görsel Bulunmuyor
            </h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              Yönetici panelinden dilediğiniz zaman yeni fotoğraflar, çizimler ve albümler ekleyebilirsiniz.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Görsel Yüklemek İçin Admin Paneli</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group relative rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer ${
                  item.aspectRatio === 'wide' ? 'sm:col-span-2' : ''
                }`}
              >
                {/* Visual Area */}
                {item.imageUrl ? (
                  <div className="h-56 sm:h-64 w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className={`h-56 sm:h-64 w-full bg-gradient-to-br ${item.bgGradient || 'from-rose-50 to-amber-50'} flex flex-col items-center justify-center relative p-6 transition-transform group-hover:scale-[1.02]`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-md flex items-center justify-center mb-3">
                      {getIcon(item.iconType)}
                    </div>
                    <span className="text-xs font-semibold text-stone-700 bg-white/80 px-3 py-1 rounded-full shadow-2xs">
                      {item.title}
                    </span>
                  </div>
                )}

                {/* Caption Strip */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium mb-1">
                    <span className="capitalize">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-display font-bold text-stone-900 text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-stone-700 rounded-full shadow transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.imageUrl ? (
              <div className="max-h-[70vh] bg-stone-900 flex items-center justify-center">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
            ) : (
              <div className={`h-72 w-full bg-gradient-to-br ${selectedItem.bgGradient || 'from-rose-50 to-amber-50'} flex flex-col items-center justify-center p-8`}>
                <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-md flex items-center justify-center mb-4">
                  {getIcon(selectedItem.iconType)}
                </div>
                <h3 className="font-display font-bold text-2xl text-stone-900">
                  {selectedItem.title}
                </h3>
              </div>
            )}

            <div className="p-6 bg-white">
              <div className="flex items-center justify-between text-xs text-stone-400 font-medium mb-2">
                <span className="uppercase tracking-wider">{selectedItem.category}</span>
                <span>{selectedItem.date}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter
        daughterName={config.daughterName}
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
