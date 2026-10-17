import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText, ChevronRight, Layers } from 'lucide-react';

// Vite raw imports to allow inspecting code directly on mobile or any browser
import animalSafariRaw from './AnimalSafariGame.tsx?raw';
import animalsDataRaw from '../data/animalsData.ts?raw';
import kidsPlaygroundRaw from './KidsPlayground.tsx?raw';
import gamePageRaw from '../pages/GamePage.tsx?raw';
import appRaw from '../App.tsx?raw';
import siteFooterRaw from './SiteFooter.tsx?raw';
import supabaseRaw from '../services/supabase.ts?raw';
import homePageRaw from '../pages/HomePage.tsx?raw';

interface FileItem {
  id: string;
  name: string;
  path: string;
  category: 'Oyun' | 'Sayfa' | 'Bileşen' | 'Veri & Servis';
  content: string;
}

const SOURCE_FILES: FileItem[] = [
  {
    id: 'safari',
    name: 'AnimalSafariGame.tsx',
    path: 'src/components/AnimalSafariGame.tsx',
    category: 'Oyun',
    content: animalSafariRaw,
  },
  {
    id: 'animals-data',
    name: 'animalsData.ts (28 Hayvan & 6 Habitat)',
    path: 'src/data/animalsData.ts',
    category: 'Veri & Servis',
    content: animalsDataRaw,
  },
  {
    id: 'playground',
    name: 'KidsPlayground.tsx (Tüm Mini Oyunlar)',
    path: 'src/components/KidsPlayground.tsx',
    category: 'Oyun',
    content: kidsPlaygroundRaw,
  },
  {
    id: 'game-page',
    name: 'GamePage.tsx (/oyun Sekmesi)',
    path: 'src/pages/GamePage.tsx',
    category: 'Sayfa',
    content: gamePageRaw,
  },
  {
    id: 'app',
    name: 'App.tsx (Ana Omurga & Yönlendirme)',
    path: 'src/App.tsx',
    category: 'Sayfa',
    content: appRaw,
  },
  {
    id: 'footer',
    name: 'SiteFooter.tsx (Ziyaretçi Sayacı)',
    path: 'src/components/SiteFooter.tsx',
    category: 'Bileşen',
    content: siteFooterRaw,
  },
  {
    id: 'supabase',
    name: 'supabase.ts (Veritabanı Entegrasyonu)',
    path: 'src/services/supabase.ts',
    category: 'Veri & Servis',
    content: supabaseRaw,
  },
  {
    id: 'home',
    name: 'HomePage.tsx (Ana Sayfa)',
    path: 'src/pages/HomePage.tsx',
    category: 'Sayfa',
    content: homePageRaw,
  },
];

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('safari');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const currentFile = SOURCE_FILES.find(f => f.id === selectedFileId) || SOURCE_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredFiles = SOURCE_FILES.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-stone-700 w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base">Kaynak Kod Görüntüleyici</h3>
                <span className="hidden xs:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Mobil Uyumlu
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Tüm kaynak dosyaları doğrudan telefonunuzdan inceleyebilir veya kopyalayabilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 active:scale-95 transition-all"
              title="Bu dosyanın kodunu panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-72 bg-stone-950/70 border-b md:border-b-0 md:border-r border-stone-800 p-2 sm:p-3 flex md:flex-col shrink-0 overflow-x-auto md:overflow-y-auto">
            <div className="hidden md:block mb-2">
              <input
                type="text"
                placeholder="Dosya ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div className="flex md:flex-col gap-1 w-full min-w-max md:min-w-0">
              {filteredFiles.map(file => {
                const isActive = file.id === currentFile.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                      isActive 
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-800 font-medium shadow-sm' 
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-rose-400' : 'text-stone-500'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900/80 border border-stone-800 text-stone-500 shrink-0 hidden sm:inline-block">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Content Area */}
          <div className="flex-1 flex flex-col bg-stone-900 overflow-hidden">
            {/* File Path & Line Counter */}
            <div className="px-4 py-2 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono text-emerald-400/90 truncate mr-2">
                {currentFile.path}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-stone-500">
                {currentFile.content.split('\n').length} satır
              </span>
            </div>

            {/* Monospace Code Display */}
            <div className="flex-1 overflow-auto p-3 sm:p-4 bg-[#0d1117] font-mono text-[11px] sm:text-xs leading-relaxed text-stone-300 selection:bg-rose-900 selection:text-white">
              <pre className="whitespace-pre">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info for mobile users */}
        <div className="px-4 py-2 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-2">
          <span>💡 Mobil tarayıcıda masaüstü moduna geçerek AI Studio'nun sol dosya ağacını da açabilirsiniz.</span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white underline text-xs ml-auto"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
