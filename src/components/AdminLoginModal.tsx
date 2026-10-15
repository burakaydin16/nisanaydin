import React, { useState } from 'react';
import { 
  Lock, KeyRound, User, Database, Check, Copy, 
  ExternalLink, AlertCircle, ArrowRight, ShieldCheck, X 
} from 'lucide-react';
import { supabaseService, SUPABASE_ADMIN_SQL } from '../services/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { username: string; fullName: string; role: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Nisan2020!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Supabase Settings view toggle
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseService.url);
  const [supabaseKey, setSupabaseKey] = useState(supabaseService.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedConfigAlert, setSavedConfigAlert] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await supabaseService.loginAdmin(username, password);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Giriş başarısız.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    supabaseService.setCredentials(supabaseUrl, supabaseKey);
    setSavedConfigAlert(true);
    setTimeout(() => setSavedConfigAlert(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_ADMIN_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isConfigured = supabaseService.isConfigured();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl text-stone-900">
            Nisan Aydın — Yönetici Girişi
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Site içeriğini ve anıları yönetmek için Supabase korumalı oturum açın.
          </p>

          {/* Database Connection Status Pill */}
          <div className="mt-3 flex items-center justify-between">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isConfigured 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Bağlantısı Aktif' : 'Önizleme / Demo Modu'}</span>
            </div>

            <button
              onClick={() => setShowSupabaseConfig(!showSupabaseConfig)}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline underline-offset-4 flex items-center gap-1"
            >
              {showSupabaseConfig ? 'Girişe Dön' : 'Supabase Ayarları & SQL'}
            </button>
          </div>
        </div>

        {/* Tab A: Normal Login Form */}
        {!showSupabaseConfig ? (
          <form onSubmit={handleLogin} className="p-6 sm:p-8 pt-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kullanıcı Adı veya E-posta
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin veya e-posta"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                />
              </div>
            </div>

            {!isConfigured && (
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-500">
                💡 <strong>Hızlı Test İçin:</strong> Kullanıcı: <code className="bg-white px-1 py-0.5 rounded font-bold text-stone-800">admin</code> / Şifre: <code className="bg-white px-1 py-0.5 rounded font-bold text-stone-800">Nisan2020!</code>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <span>Admin Paneline Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Tab B: Supabase Connection & SQL Table Generator */
          <div className="p-6 sm:p-8 pt-4 space-y-5 max-h-[70vh] overflow-y-auto">
            <div>
              <h3 className="font-display font-bold text-sm text-stone-900 mb-1">
                Supabase Proje Bilgileri
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Supabase Dashboard &rarr; Project Settings &rarr; API bölümündeki bilgileri buraya girin:
              </p>

              {savedConfigAlert && (
                <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Supabase bağlantı bilgileri kaydedildi!</span>
                </div>
              )}

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
                  >
                    Bağlantıyı Kaydet
                  </button>
                </div>
              </form>
            </div>

            {/* Ready to Run SQL Script */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Supabase SQL Tablo Kodu (admin_users)</span>
                </span>
                <button
                  onClick={handleCopySql}
                  className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Kopyalandı' : 'SQL Kopyala'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mb-2">
                Bu kodu <strong>Supabase &rarr; SQL Editor</strong> sayfasına yapıştırıp <strong>"Run"</strong> butonuna basın:
              </p>
              <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-[11px] font-mono max-h-48 overflow-y-auto leading-relaxed">
                {SUPABASE_ADMIN_SQL}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
