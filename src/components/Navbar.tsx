import React, { useState } from 'react';
import { Shield, Sparkles, LayoutDashboard, Compass, ExternalLink, Menu, X, ArrowUpRight } from 'lucide-react';
import { SiteConfig } from '../types/site';

interface NavbarProps {
  config: SiteConfig;
  activeView: 'site' | 'admin' | 'roadmap';
  setActiveView: (view: 'site' | 'admin' | 'roadmap') => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  activeView,
  setActiveView,
  onOpenExport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('site')}
              className="text-left font-display font-bold text-lg text-stone-900 tracking-tight hover:text-stone-700 transition-colors whitespace-nowrap"
            >
              {config.customDomain || config.daughterName}
            </button>
            <span className="hidden sm:inline-block text-xs text-stone-400 font-mono">
              / {config.daughterName}
            </span>
          </div>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            {activeView === 'site' ? (
              <>
                <a href="#hikaye" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
                  Hikaye
                </a>
                <a href="#kilometre-taslari" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
                  Kilometre Taşları
                </a>
                <a href="#galeri" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
                  Fotoğraflar
                </a>
                <a href="#oyunlar" className="hover:text-rose-700 text-rose-800 font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>English Kids Lab (4.5 Yaş)</span>
                </a>
                <a href="#mektuplar" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
                  Mektuplar & Blog
                </a>
                <a href="#ani-defteri" className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0">
                  Anı Defteri
                </a>
              </>
            ) : (
              <span className="text-xs text-stone-500 font-normal">
                {activeView === 'admin'
                  ? 'Yönetim Modu: İçerik, SEO ve site ayarları anında güncellenir'
                  : 'Rehber Modu: Vercel, Dokploy, Domain DNS ve teknoloji karşılaştırması'}
              </span>
            )}
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveView(activeView === 'roadmap' ? 'site' : 'roadmap')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'roadmap'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kurulum &</span> Dağıtım Rehberi
            </button>

            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {activeView === 'admin' ? 'Siteye Dön' : 'Admin Paneli'}
            </button>

            <button
              onClick={onOpenExport}
              title="Hazır Proje Kodunu Dışa Aktar"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-950 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors whitespace-nowrap"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Dışa Aktar</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-600 hover:text-stone-900"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {activeView === 'site' && (
            <div className="flex flex-col space-y-2 text-sm font-medium text-stone-700 pb-2 border-b border-stone-100">
              <a
                href="#hikaye"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-stone-950"
              >
                Hikaye & Tanıtım
              </a>
              <a
                href="#kilometre-taslari"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-stone-950"
              >
                Kilometre Taşları
              </a>
              <a
                href="#galeri"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-stone-950"
              >
                Fotoğraflar
              </a>
              <a
                href="#oyunlar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 font-semibold text-rose-800 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>English Kids Lab (4.5 Yaş) 🚀</span>
              </a>
              <a
                href="#mektuplar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-stone-950"
              >
                Mektuplar & Blog
              </a>
              <a
                href="#ani-defteri"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-stone-950"
              >
                Anı Defteri
              </a>
            </div>
          )}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveView('site');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                activeView === 'site' ? 'bg-stone-100 font-semibold' : 'text-stone-700'
              }`}
            >
              Canlı Siteyi İncele
            </button>
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                activeView === 'admin' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700'
              }`}
            >
              Admin Paneli (İçerik Yönetimi)
            </button>
            <button
              onClick={() => {
                setActiveView('roadmap');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                activeView === 'roadmap' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-stone-700'
              }`}
            >
              Dağıtım & Mimari Rehberi (Vercel vs Dokploy)
            </button>
            <button
              onClick={() => {
                onOpenExport();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg border border-stone-200 text-stone-700"
            >
              Projeyi ve Kodları İndir / Kopyala
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
