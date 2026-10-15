import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Volume2, Shield } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';
import { KidsPlayground } from '../components/KidsPlayground';
import { SiteFooter } from '../components/SiteFooter';
import { soundFx } from '../utils/audioEffects';

interface GamePageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  config,
  onNavigate,
  onOpenAdmin,
}) => {
  // Ensure that if user leaves this page, any ongoing audio/speech is immediately cancelled
  useEffect(() => {
    return () => {
      soundFx.muteAll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col">
      
      {/* Header Banner */}
      <div className="bg-rose-50/70 border-b border-rose-200/70 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-2">
            <button 
              onClick={() => onNavigate('/')} 
              className="hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ana Sayfa</span>
            </button>
            <span>/</span>
            <span className="text-rose-900 font-semibold">Oyun & Öğrenme Odası</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-rose-200 text-rose-900 text-xs font-bold mb-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Nisan Aydın English Kids Lab • 4.5 Yaş</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                Eğlenceli Çocuk Oyun & Keşif Alanı
              </h1>
            </div>

            <div className="text-xs text-stone-600 bg-white/80 border border-rose-200/80 rounded-xl px-3.5 py-2 max-w-sm shadow-2xs">
              <span className="font-semibold text-rose-900 block mb-0.5">🔇 Ses Kontrolü:</span>
              Oyun varsayılan olarak sessizdir. İsterseniz aşağıdaki <strong>"Oyun Sesini Aç 🔊"</strong> butonuyla sesli oynayabilirsiniz.
            </div>
          </div>
        </div>
      </div>

      {/* Game Playground Component */}
      <main className="flex-1 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <KidsPlayground daughterName={config.daughterName} />
      </main>

      {/* Footer with Minimalist Visitor Counter */}
      <SiteFooter
        daughterName={config.daughterName}
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
