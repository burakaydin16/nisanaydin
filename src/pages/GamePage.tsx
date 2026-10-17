import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';
import { KidsPlayground } from '../components/KidsPlayground';
import { soundFx } from '../utils/audioEffects';

interface GamePageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  config,
  onNavigate,
}) => {
  // Turn sound ON immediately when entering the game page as requested.
  // When leaving the game page, immediately mute all sounds so site browsing stays quiet.
  useEffect(() => {
    soundFx.soundEnabled = true;
    soundFx.voiceEnabled = true;

    return () => {
      soundFx.muteAll();
      soundFx.soundEnabled = false;
      soundFx.voiceEnabled = false;
    };
  }, []);

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#FAF8F5] text-stone-800 flex flex-col select-none">
      
      {/* Compact Immersive Game Header */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between shrink-0 z-20 shadow-xs">
        
        {/* Sol Üstte Belirgin Geri Tuşu */}
        <button 
          onClick={() => onNavigate('/')} 
          className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Ana Sayfaya Dön"
        >
          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
          <span>Geri</span>
          <span className="hidden sm:inline text-xs font-normal text-stone-300">| Ana Sayfa</span>
        </button>

        {/* Orta: Oyun Başlığı ve Bilgi */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Nisan'ın Oyun Odası</span>
          </div>
          <h1 className="font-display font-bold text-sm sm:text-lg text-stone-900 flex items-center gap-1.5">
            <span>🦁 Kart Eşleştirme & Doğa Keşfi</span>
          </h1>
        </div>

        {/* Sağ: Ses Durumu Rozeti */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Ses Açık 🔊</span>
            <span className="sm:hidden">Ses 🔊</span>
          </div>
        </div>
      </header>

      {/* Full-Page Game Viewport: No outer page scroll, focused purely on the game */}
      <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden flex flex-col p-2 sm:p-4 max-w-6xl w-full mx-auto">
        <KidsPlayground daughterName={config.daughterName} />
      </main>

    </div>
  );
};
