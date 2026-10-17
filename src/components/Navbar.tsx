import React, { useState } from 'react';
import { Sparkles, LayoutDashboard, Menu, X, Heart } from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';

interface NavbarProps {
  config: SiteConfig;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  adminUser: { username: string; fullName: string; role: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  currentRoute,
  onNavigate,
  adminUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { route: AppRoute; label: string; icon?: React.ReactNode; isSpecial?: boolean }[] = [
    { route: '/', label: 'Ana Sayfa' },
    { route: '/anilar', label: 'Anılarımız' },
    { route: '/galeri', label: 'Galeri' },
    { route: '/mektuplar', label: 'Mektuplar & Defter' },
    { 
      route: '/oyun', 
      label: 'Oyun Odası', 
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      isSpecial: true 
    },
  ];

  const handleLinkClick = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('/')}
              className="group flex items-center gap-2 text-left font-display font-bold text-lg text-stone-900 tracking-tight hover:text-stone-700 transition-colors whitespace-nowrap"
            >
              <span className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </span>
              <span>{config.daughterName}</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-stone-400 font-mono">
              / Aile Arşivi
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-stone-600">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleLinkClick(item.route)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? item.isSpecial
                        ? 'bg-rose-100 text-rose-900 font-semibold shadow-2xs'
                        : 'bg-stone-900 text-white font-semibold shadow-2xs'
                      : item.isSpecial
                        ? 'text-rose-800 hover:bg-rose-50 font-medium'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Admin Access */}
          <div className="flex items-center gap-2 shrink-0">

            <button
              onClick={() => handleLinkClick('/admin')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                currentRoute === '/admin'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{adminUser ? 'Yönetim Paneli' : 'Yönetici'}</span>
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-rose-100 text-rose-900 font-semibold'
                      : 'bg-stone-900 text-white font-semibold'
                    : item.isSpecial
                      ? 'text-rose-800 hover:bg-rose-50'
                      : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-mono opacity-60">{item.route}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-stone-100 mt-2 space-y-1">

            <button
              onClick={() => handleLinkClick('/admin')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                currentRoute === '/admin' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>{adminUser ? 'Yönetim Paneli' : 'Yönetici Girişi'}</span>
              </div>
              <span className="text-xs font-mono opacity-60">/admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
