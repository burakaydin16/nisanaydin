import React, { useState, useEffect } from 'react';
import { Eye, Heart, Sparkles } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import { AppRoute } from '../types/routes';

interface SiteFooterProps {
  daughterName: string;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  daughterName,
  onNavigate,
  onOpenAdmin,
}) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    supabaseService.recordVisit()
      .then(count => setVisitorCount(count))
      .catch(() => {
        const local = typeof window !== 'undefined' ? localStorage.getItem('nisan_visitor_count') : null;
        setVisitorCount(local ? parseInt(local, 10) : 1);
      });
  }, []);

  return (
    <footer className="py-10 bg-white border-t border-stone-200 text-stone-500 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Link Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-stone-600 font-medium">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-stone-900 transition-colors"
          >
            Ana Sayfa
          </button>
          <button 
            onClick={() => onNavigate('/anilar')} 
            className="hover:text-stone-900 transition-colors"
          >
            Anılarımız
          </button>
          <button 
            onClick={() => onNavigate('/galeri')} 
            className="hover:text-stone-900 transition-colors"
          >
            Galeri
          </button>
          <button 
            onClick={() => onNavigate('/mektuplar')} 
            className="hover:text-stone-900 transition-colors"
          >
            Mektuplar & Notlar
          </button>
          <button 
            onClick={() => onNavigate('/oyun')} 
            className="hover:text-rose-700 text-rose-800 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Oyun Alanı</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
          {/* Identity */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100 shrink-0" />
            <span className="font-semibold text-stone-800">{daughterName}</span>
            <span className="text-stone-400">— Kişisel Büyüme & Hatırat Arşivi</span>
          </div>

          {/* Minimalist Ziyaretçi Sayacı */}
          <div 
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-stone-600 text-xs shadow-2xs select-none"
            title="Siteye yapılan toplam ziyaret sayısı"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400">Ziyaretçi:</span>
            <span className="font-mono font-semibold text-stone-800">
              {visitorCount !== null ? visitorCount.toLocaleString('tr-TR') : '...'}
            </span>
          </div>

          {/* Admin Girişi */}
          <div className="flex items-center gap-4 text-stone-400">
            <button 
              onClick={onOpenAdmin} 
              className="text-stone-600 hover:text-stone-900 transition-colors underline-offset-4 hover:underline"
            >
              Yönetici Girişi
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
