import { useState, useEffect, useCallback } from 'react';
import { AppRoute } from '../types/routes';

export function normalizePath(path: string): AppRoute {
  // Strip trailing slashes (except root)
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  
  if (clean === '' || clean === '/' || clean === '/anasayfa' || clean === '/index.html') {
    return '/';
  }
  if (clean.startsWith('/anilar') || clean.startsWith('/anilarimiz') || clean.startsWith('/timeline')) {
    return '/anilar';
  }
  if (clean.startsWith('/galeri') || clean.startsWith('/fotograflar') || clean.startsWith('/gallery')) {
    return '/galeri';
  }
  if (clean.startsWith('/mektuplar') || clean.startsWith('/defter') || clean.startsWith('/blog') || clean.startsWith('/mesajlar')) {
    return '/mektuplar';
  }
  if (clean.startsWith('/oyun') || clean.startsWith('/oyunlar') || clean.startsWith('/kids') || clean.startsWith('/lab')) {
    return '/oyun';
  }
  if (clean.startsWith('/admin') || clean.startsWith('/yonetim') || clean.startsWith('/panel')) {
    return '/admin';
  }
  return '/';
}

export function useAppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return '/';
    return normalizePath(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      const next = normalizePath(window.location.pathname);
      setCurrentRoute(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((route: AppRoute, options?: { replace?: boolean }) => {
    const target = normalizePath(route);
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState(null, '', target);
      } else {
        window.history.pushState(null, '', target);
      }
      setCurrentRoute(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { currentRoute, navigate };
}
