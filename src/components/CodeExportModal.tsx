import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Code, Sparkles, FileJson } from 'lucide-react';
import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';

interface CodeExportModalProps {
  config: SiteConfig;
  milestones: Milestone[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  guestbook: GuestbookEntry[];
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  config,
  milestones,
  blogPosts,
  gallery,
  guestbook,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'git' | 'json' | 'package'>('git');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fullDataPackage = {
    siteConfig: config,
    milestones,
    blogPosts,
    gallery,
    guestbook,
    exportedAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(fullDataPackage, null, 2);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.customDomain || 'kizimin-sitesi'}-veriler.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gitCommands = `# 1. Proje klasörünüze gidin ve git başlatın:
git init
git add .
git commit -m "feat: Kızımın web sitesi başlangıç sürümü"

# 2. GitHub'da oluşturduğunuz repoyu bağlayın:
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/${config.customDomain ? config.customDomain.replace('.', '-') : 'kizimin-sitesi'}.git
git push -u origin main

# 3. Vercel.com'a gidip bu repoyu seçin ve 'Deploy'a basın!
# Domain ayarlarından ${config.customDomain || 'alanadiniz.com'} adresinizi ekleyin.`;

  const packageJsonContent = `{
  "name": "${config.customDomain ? config.customDomain.replace(/[^a-z0-9-]/gi, '') : 'daughter-website'}",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              Proje Kodları & Vercel Dağıtım Paketi
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Hazırladığınız siteyi kendi GitHub ve Vercel hesabınıza aktarmak için hazır araçlar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-stone-200 bg-white">
          <button
            onClick={() => setActiveTab('git')}
            className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'git'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>GitHub & Vercel Komutları</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'json'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Tüm Verileri İndir (JSON)</span>
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'package'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>package.json</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'git' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">
                  Terminalinizde çalıştırabileceğiniz hızlı kurulum komutları:
                </span>
                <button
                  onClick={() => handleCopy(gitCommands, 'git')}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'git' ? 'Kopyalandı' : 'Komutları Kopyala'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                {gitCommands}
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600">
                  Panelde düzenlediğiniz tüm anılar, mektuplar, galeri ve SEO ayarları bu pakette yer alır:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="px-3 py-1 bg-stone-900 text-white text-xs rounded-md font-medium flex items-center gap-1.5 hover:bg-stone-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON İndir</span>
                  </button>
                  <button
                    onClick={() => handleCopy(jsonString, 'json')}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs rounded-md font-medium flex items-center gap-1.5"
                  >
                    {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'json' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto max-h-72">
                {jsonString}
              </pre>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600">
                  Vercel / Vite uyumlu minimal modern bağımlılık listesi:
                </span>
                <button
                  onClick={() => handleCopy(packageJsonContent, 'package')}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs rounded-md font-medium flex items-center gap-1.5"
                >
                  {copiedKey === 'package' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'package' ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto">
                {packageJsonContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
