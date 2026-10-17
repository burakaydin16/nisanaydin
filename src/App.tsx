/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from './types/site';
import { 
  initialSiteConfig, initialMilestones, initialBlogPosts, 
  initialGallery, initialGuestbook 
} from './data/defaultData';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MilestonesPage } from './pages/MilestonesPage';
import { GalleryPage } from './pages/GalleryPage';
import { LettersPage } from './pages/LettersPage';
import { GamePage } from './pages/GamePage';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { supabaseService } from './services/supabase';
import { useAppRouter } from './hooks/useAppRouter';
import { AppRoute } from './types/routes';
import { Shield, Lock } from 'lucide-react';

export default function App() {
  const { currentRoute, navigate } = useAppRouter();

  // Clear any old mock demo data stored from previous sessions to respect user's privacy request
  useEffect(() => {
    const versionKey = 'nisan_privacy_clean_v3';
    if (!localStorage.getItem(versionKey)) {
      localStorage.removeItem('daughter_site_milestones');
      localStorage.removeItem('daughter_site_blog');
      localStorage.removeItem('daughter_site_gallery');
      localStorage.removeItem('daughter_site_guestbook');
      localStorage.setItem(versionKey, 'true');
    }
  }, []);

  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('daughter_site_config');
    if (!saved) return initialSiteConfig;
    try {
      const parsed = JSON.parse(saved);
      return { ...initialSiteConfig, ...parsed, daughterName: 'Nisan Aydın' };
    } catch {
      return initialSiteConfig;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('daughter_site_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('daughter_site_blog');
    return saved ? JSON.parse(saved) : initialBlogPosts;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('daughter_site_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('daughter_site_guestbook');
    return saved ? JSON.parse(saved) : initialGuestbook;
  });

  // Fetch live tables from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseData() {
      try {
        const [remoteConfig, remoteMilestones, remotePosts, remoteGallery, remoteGuestbook] = await Promise.all([
          supabaseService.fetchSiteConfig(),
          supabaseService.fetchMilestones(),
          supabaseService.fetchBlogPosts(),
          supabaseService.fetchGallery(),
          supabaseService.fetchGuestbook(),
        ]);

        if (!isMounted) return;

        if (remoteConfig) {
          setConfig(prev => ({ ...prev, ...remoteConfig }));
        }
        if (remoteMilestones !== null) {
          setMilestones(remoteMilestones);
        }
        if (remotePosts !== null) {
          setBlogPosts(remotePosts);
        }
        if (remoteGallery !== null) {
          setGallery(remoteGallery);
        }
        if (remoteGuestbook !== null) {
          setGuestbook(remoteGuestbook);
        }
      } catch (err) {
        console.warn('Supabase initial fetch info:', err);
      }
    }

    loadSupabaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Admin authentication state
  const [adminUser, setAdminUser] = useState<{ username: string; fullName: string; role: string } | null>(() => {
    const saved = sessionStorage.getItem('nisan_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('daughter_site_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('daughter_site_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('daughter_site_blog', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('daughter_site_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('daughter_site_guestbook', JSON.stringify(guestbook));
  }, [guestbook]);

  const handleAddGuestbookEntry = async (entryData: Omit<GuestbookEntry, 'id' | 'date' | 'approved'>) => {
    const formattedDate = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      ...entryData,
      date: formattedDate,
      approved: false,
    };

    // Update local state immediately
    setGuestbook(prev => [newEntry, ...prev]);

    // Send to Supabase guestbook table
    await supabaseService.insertGuestbook({
      name: entryData.name,
      relationship: entryData.relationship,
      message: entryData.message,
      date: formattedDate,
    });
  };

  const handleOpenAdmin = () => {
    if (adminUser) {
      navigate('/admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: { username: string; fullName: string; role: string }) => {
    setAdminUser(user);
    sessionStorage.setItem('nisan_admin_user', JSON.stringify(user));
    setIsLoginModalOpen(false);
    navigate('/admin');
  };

  const handleLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('nisan_admin_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Multi-Page Navigation Header with clean / paths (Hidden on /oyun for full-screen immersive game) */}
      {currentRoute !== '/oyun' && (
        <Navbar
          config={config}
          currentRoute={currentRoute}
          onNavigate={navigate}
          adminUser={adminUser}
        />
      )}

      {/* Path-based Multi-Page Views */}
      <main className="flex-1 flex flex-col">
        {currentRoute === '/' && (
          <HomePage
            config={config}
            milestones={milestones}
            blogPosts={blogPosts}
            gallery={gallery}
            guestbook={guestbook}
            onNavigate={navigate}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentRoute === '/anilar' && (
          <MilestonesPage
            config={config}
            milestones={milestones}
            onNavigate={navigate}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentRoute === '/galeri' && (
          <GalleryPage
            config={config}
            gallery={gallery}
            onNavigate={navigate}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentRoute === '/mektuplar' && (
          <LettersPage
            config={config}
            blogPosts={blogPosts}
            guestbook={guestbook}
            onAddGuestbookEntry={handleAddGuestbookEntry}
            onNavigate={navigate}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentRoute === '/oyun' && (
          <GamePage
            config={config}
            onNavigate={navigate}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentRoute === '/admin' && (
          adminUser ? (
            <AdminPanel
              config={config}
              onUpdateConfig={setConfig}
              milestones={milestones}
              onUpdateMilestones={setMilestones}
              blogPosts={blogPosts}
              onUpdateBlogPosts={setBlogPosts}
              gallery={gallery}
              onUpdateGallery={setGallery}
              guestbook={guestbook}
              onUpdateGuestbook={setGuestbook}
              onClose={() => navigate('/')}
              adminUser={adminUser}
              onLogout={handleLogout}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 py-20">
              <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-lg text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-stone-900">
                    Yönetici Paneli Girişi
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    İçerik, anı ve ayarları yönetmek için lütfen Supabase yetkili kullanıcı adı ve şifrenizle giriş yapın.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    Siteye Geri Dön
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Admin Login Modal (secure, checks credentials against Supabase admin_users table) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

    </div>
  );
}
