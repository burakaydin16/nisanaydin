import React, { useState } from 'react';
import { 
  BookOpen, ArrowLeft, Heart, Send, MessageSquare, X, Plus, Calendar, Clock
} from 'lucide-react';
import { SiteConfig, BlogPost, GuestbookEntry } from '../types/site';
import { AppRoute } from '../types/routes';
import { SiteFooter } from '../components/SiteFooter';

interface LettersPageProps {
  config: SiteConfig;
  blogPosts: BlogPost[];
  guestbook: GuestbookEntry[];
  onAddGuestbookEntry: (entry: Omit<GuestbookEntry, 'id' | 'date' | 'approved'>) => void;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

export const LettersPage: React.FC<LettersPageProps> = ({
  config,
  blogPosts,
  guestbook,
  onAddGuestbookEntry,
  onNavigate,
  onOpenAdmin,
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'letters' | 'guestbook'>('letters');

  // Guestbook submission state
  const [guestName, setGuestName] = useState('');
  const [guestRel, setGuestRel] = useState('Aile Dostu');
  const [guestMsg, setGuestMsg] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMsg.trim()) return;

    onAddGuestbookEntry({
      name: guestName.trim(),
      relationship: guestRel,
      message: guestMsg.trim()
    });

    setGuestName('');
    setGuestMsg('');
    setSubmittedStatus('Mesajınız sevgiyle kaydedildi! Yönetici onayından sonra defterde görünecektir.');
    setTimeout(() => setSubmittedStatus(null), 5000);
  };

  const approvedEntries = guestbook.filter(e => e.approved);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col">
      
      {/* Header */}
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
            <span className="text-stone-800 font-semibold">Mektuplar & Defter</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold mb-2">
                <Heart className="w-3 h-3 text-purple-600 fill-purple-200" />
                <span>Yazılar & Hatıralar</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                {config.daughterName}'a Mektuplar & Sevgi Defteri
              </h1>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Büyüdüğünde okuyacağı aile mektupları ve sevdiklerinin bıraktığı en samimi hatıra notları.
              </p>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('letters')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'letters'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Aile Mektupları ({blogPosts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('guestbook')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'guestbook'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ziyaretçi Defteri ({approvedEntries.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* TAB 1: LETTERS */}
        {activeTab === 'letters' && (
          <div>
            {blogPosts.length === 0 ? (
              <div className="py-16 px-6 bg-white rounded-3xl border border-stone-200 text-center max-w-md mx-auto shadow-sm">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-display font-bold text-stone-800 text-base">
                  Henüz Mektup Eklenmedi
                </h3>
                <p className="text-xs text-stone-500 mt-2 mb-6">
                  {config.daughterName} için ilk sevgi mektubunu veya hatıra yazısını yönetici panelinden yazabilirsiniz.
                </p>
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mektup Yazmak İçin Giriş Yap</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group bg-white rounded-3xl border border-stone-200/90 p-7 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-semibold">
                          {post.author}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-rose-700 transition-colors mb-3 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-sm text-stone-600 line-clamp-4 leading-relaxed font-serif">
                        {post.excerpt || post.content}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-rose-600 transition-colors">
                      <span>Mektubun Tamamını Oku</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GUESTBOOK */}
        {activeTab === 'guestbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Approved Messages List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-stone-900">
                  Kaydedilen Güzel Mesajlar
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                  {approvedEntries.length} Mesaj
                </span>
              </div>

              {approvedEntries.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center">
                  <p className="text-xs text-stone-500 italic">
                    Henüz onaylanmış mesaj bulunmuyor. Yandaki formu doldurarak ilk güzel dileği siz bırakabilirsiniz!
                  </p>
                </div>
              ) : (
                approvedEntries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs hover:shadow-sm transition-shadow">
                    <p className="text-sm text-stone-700 leading-relaxed font-serif italic mb-4">
                      "{entry.message}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 font-sans">
                      <span className="font-semibold text-stone-900">
                        {entry.name} <span className="font-normal text-stone-500">({entry.relationship})</span>
                      </span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Message Submission Form */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    {config.daughterName} İçin Not Bırakın
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mb-6">
                  İyi dilekleriniz ve hatıranız ömür boyu saklanmak üzere kaydedilir.
                </p>

                {submittedStatus && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                    {submittedStatus}
                  </div>
                )}

                <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Örn: Burak Aydın"
                      className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Yakınlığınız
                    </label>
                    <select
                      value={guestRel}
                      onChange={(e) => setGuestRel(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                    >
                      <option value="Baba">Baba</option>
                      <option value="Anne">Anne</option>
                      <option value="Dede / Büyükanne">Dede / Büyükanne</option>
                      <option value="Akraba / Kuzen">Akraba / Kuzen</option>
                      <option value="Öğretmen">Öğretmen</option>
                      <option value="Aile Dostu">Aile Dostu</option>
                      <option value="Arkadaş">Arkadaş</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mesajınız / İyi Dileğiniz
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={guestMsg}
                      onChange={(e) => setGuestMsg(e.target.value)}
                      placeholder="Gelecekte okuduğunda onu gülümsetecek bir hatıra veya sevgi dolu bir mesaj..."
                      className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notu Sevgiyle Gönder</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Post Reading Modal */}
      {selectedPost && (
        <div 
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-2">
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span className="font-semibold text-stone-800">{selectedPost.author}</span>
            </div>

            <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
              {selectedPost.title}
            </h2>

            <div className="text-base text-stone-700 leading-relaxed font-serif space-y-4 whitespace-pre-wrap">
              {selectedPost.content}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>{config.daughterName} İçin Saklandı</span>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter
        daughterName={config.daughterName}
        onNavigate={onNavigate}
        onOpenAdmin={onOpenAdmin}
      />

    </div>
  );
};
