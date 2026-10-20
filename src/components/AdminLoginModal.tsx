import React, { useState } from 'react';
import { Lock, KeyRound, User, AlertCircle, ArrowRight, X } from 'lucide-react';
import { supabaseService } from '../services/supabase';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await supabaseService.loginAdmin(username, password);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Giriş yapılamadı. Kullanıcı adı veya şifrenizi kontrol ediniz.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-lg text-stone-900">
            Nisan Aydın
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Yönetici Girişi
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınız"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Giriş Yapılıyor...</span>
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
