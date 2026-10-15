import React, { useState } from 'react';
import { 
  Calendar, Lock, Unlock, ArrowLeft, Plus, Award, Star
} from 'lucide-react';
import { SiteConfig, Milestone } from '../types/site';
import { AppRoute } from '../types/routes';
import { SiteFooter } from '../components/SiteFooter';

interface MilestonesPageProps {
  config: SiteConfig;
  milestones: Milestone[];
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const MilestonesPage: React.FC<MilestonesPageProps> = ({
  config,
  milestones,
  onNavigate,
  onOpenAdmin,
}) => {
  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');
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

  const filteredMilestones = milestoneFilter === 'all'
    ? milestones
    : milestones.filter(m => m.category === milestoneFilter);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col">
      
      {/* Page Header */}
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
            <span className="text-stone-800 font-semibold">Anılarımız</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
                <Calendar className="w-3 h-3" />
                <span>Kronolojik Hatırat</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                {config.daughterName}'ın Büyüme Yolculuğu
              </h1>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                İlk adımlarından ilk sözlerine, okula başladığı günden tatlı anılarına kadar her anın özenle saklandığı zaman çizelgesi.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto shrink-0">
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
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
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* PIN Lock Barrier if enabled */}
        {config.protectionEnabled && !isUnlocked && (
          <div className="my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-md mx-auto text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
              Özel Aile Anıları Korumalıdır
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Bu bölümdeki aile fotoğraflarını ve anıları görüntülemek için lütfen aile PIN kodunu giriniz.
            </p>
            <form onSubmit={handlePinSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Kodunu Giriniz"
                className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-center w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Giriş
              </button>
            </form>
            {pinError && (
              <p className="text-xs text-rose-600 font-medium mt-3">Hatalı PIN kodu. Lütfen tekrar deneyiniz.</p>
            )}
          </div>
        )}

        {/* Milestone Timeline */}
        {isUnlocked && (
          <div>
            {filteredMilestones.length === 0 ? (
              <div className="py-16 px-6 bg-white rounded-3xl border border-stone-200 text-center max-w-md mx-auto shadow-sm">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-display font-bold text-stone-800 text-base">
                  Bu Kategoride Henüz Anı Bulunmuyor
                </h3>
                <p className="text-xs text-stone-500 mt-2 mb-6">
                  Yönetici panelinden yeni anı ekleyebilir veya diğer kategorileri seçebilirsiniz.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yönetici Paneline Git</span>
                </button>
              </div>
            ) : (
              <div className="relative border-l-2 border-stone-200 ml-4 md:ml-36 space-y-12">
                {filteredMilestones.map((milestone) => (
                  <div key={milestone.id} className="relative pl-6 md:pl-10 group">
                    
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-900 group-hover:scale-125 transition-transform" />

                    {/* Date on Desktop Left */}
                    <div className="hidden md:block absolute -left-36 top-1 w-28 text-right font-mono text-xs font-semibold text-stone-600">
                      {milestone.dateStr || milestone.year}
                    </div>

                    {/* Card Container */}
                    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm group-hover:shadow-md transition-shadow">
                      
                      {/* Mobile Date & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="md:hidden font-mono text-xs font-semibold text-stone-500">
                          {milestone.dateStr || milestone.year}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{milestone.category}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
                        {milestone.title}
                      </h3>

                      <p className="text-sm text-stone-600 leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Optional Photo */}
                      {milestone.imageUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-stone-100 max-h-80 bg-stone-50">
                          <img
                            src={milestone.imageUrl}
                            alt={milestone.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <SiteFooter
        daughterName={config.daughterName}
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
