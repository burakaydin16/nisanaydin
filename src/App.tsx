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
import { DaughterSiteView } from './components/DaughterSiteView';
import { AdminPanel } from './components/AdminPanel';
import { DeploymentRoadmap } from './components/DeploymentRoadmap';
import { CodeExportModal } from './components/CodeExportModal';

export default function App() {
  // Load state with localStorage fallback
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('daughter_site_config');
    return saved ? JSON.parse(saved) : initialSiteConfig;
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

  // Current view mode: 'site' | 'admin' | 'roadmap'
  const [activeView, setActiveView] = useState<'site' | 'admin' | 'roadmap'>('site');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync to localStorage
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

  const handleAddGuestbookEntry = (entryData: Omit<GuestbookEntry, 'id' | 'date' | 'approved'>) => {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      ...entryData,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      approved: false, // requires admin approval
    };
    setGuestbook([newEntry, ...guestbook]);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* 3-Zone Navigation Header */}
      <Navbar
        config={config}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'site' && (
          <DaughterSiteView
            config={config}
            milestones={milestones}
            blogPosts={blogPosts}
            gallery={gallery}
            guestbook={guestbook}
            onAddGuestbookEntry={handleAddGuestbookEntry}
            onOpenAdmin={() => setActiveView('admin')}
          />
        )}

        {activeView === 'admin' && (
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
            onClose={() => setActiveView('site')}
          />
        )}

        {activeView === 'roadmap' && (
          <DeploymentRoadmap
            config={config}
            onOpenExport={() => setIsExportOpen(true)}
            onSwitchToSite={() => setActiveView('site')}
          />
        )}
      </main>

      {/* Code Export Modal */}
      {isExportOpen && (
        <CodeExportModal
          config={config}
          milestones={milestones}
          blogPosts={blogPosts}
          gallery={gallery}
          guestbook={guestbook}
          onClose={() => setIsExportOpen(false)}
        />
      )}

    </div>
  );
}
