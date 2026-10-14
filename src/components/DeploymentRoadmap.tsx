import React, { useState } from 'react';
import { 
  Server, Cloud, ShieldAlert, CheckCircle, Zap, DollarSign, 
  ArrowRight, ExternalLink, Globe, HelpCircle, Layers, Check,
  Copy, Sparkles, Terminal, FileCode2
} from 'lucide-react';
import { SiteConfig } from '../types/site';

interface DeploymentRoadmapProps {
  config: SiteConfig;
  onOpenExport: () => void;
  onSwitchToSite: () => void;
}

export const DeploymentRoadmap: React.FC<DeploymentRoadmapProps> = ({
  config,
  onOpenExport,
  onSwitchToSite,
}) => {
  const [selectedTech, setSelectedTech] = useState<'stack1' | 'stack2' | 'stack3'>('stack1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Roadmap step checkboxes state
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const domain = config.customDomain || 'kizinizinadi.com';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-900 pb-24">
      
      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-2">
            <span>Teknoloji & Dağıtım Danışmanı</span>
            <span aria-hidden="true">·</span>
            <span>Özel Alan Adı Rehberi</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Kızınızın Web Sitesi İçin En Doğru Teknoloji ve Dağıtım Rehberi
          </h1>
          <p className="text-base text-stone-600 max-w-3xl leading-relaxed">
            Elinizdeki özel alan adı (<strong>{domain}</strong>) ile modern, mobil uyumlu, hızlı, SEO dostu ve 
            kolay yönetilebilir bir site kurmak için adım adım yol haritası. Dokploy, Vercel, CMS seçenekleri ve sıfır maliyetli kurulum adımları.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">

        {/* Question 1: Dokploy vs Vercel Karşılaştırması */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Kritik Soru 1
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">
            "Dokploy'a gerek var mı, yoksa Vercel gibi platformlar mı?"
          </h2>

          <div className="prose prose-stone text-sm text-stone-600 mb-6 leading-relaxed">
            <p>
              <strong>Net Cevap: Hayır, Dokploy'a kesinlikle gerek yoktur.</strong> Bu proje için Vercel veya Cloudflare Pages 
              katbekat daha avantajlı, sıfır maliyetli ve sorunsuzdur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vercel Card */}
            <div className="rounded-xl border-2 border-emerald-500/80 bg-emerald-50/20 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-600" />
                    Vercel / Cloudflare Pages
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Önerilen (En İyi)
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-stone-700 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>0 TL Maliyet:</strong> Kişisel/aile siteleri için ömür boyu tamamen ücretsizdir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Otomatik SSL (HTTPS):</strong> Alan adınızı bağladığınız anda ücretsiz SSL anında kurulur ve otomatik yenilenir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Sıfır Sunucu Bakımı:</strong> Gece sunucunuz çökmez, Linux güncellemesi veya Docker hatasıyla uğraşmazsınız.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Global Edge CDN:</strong> Türkiye ve dünyadaki ziyaretçilere 100/100 hızla saniyeler altında açılır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>GitHub Entegrasyonu:</strong> Kodda veya içerikte her güncellemede 20 saniyede otomatik yayına girer.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-emerald-200/60 text-xs text-emerald-900 font-medium">
                Sonuç: Kızınızın anıları ve sitesi için en güvenli, en zarif ve kafa rahatlatıcı seçenek.
              </div>
            </div>

            {/* Dokploy Card */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Server className="w-5 h-5 text-stone-500" />
                    Dokploy (Self-Hosted)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200 text-stone-700">
                    Gereksiz (Overkill)
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-stone-600 mb-6">
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Aylık Sunucu Masrafı:</strong> Dokploy çalıştırmak için Hetzner veya DigitalOcean'dan aylık 4€-6€ VPS kiralamanız gerekir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Sunucu Güvenlik Sorumluluğu:</strong> Ubuntu güncellemeleri, SSH portları, Docker bellek aşımı ve disk dolması riskleri size aittir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Aşırı Karmaşık Mimari:</strong> Dokploy büyük mikroservisler ve veritabanı kümeleri için harikadır; ancak kişisel bir hatırat/blog sitesi için gereksiz iş yüküdür.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
                Dokploy ne zaman lazımdır? Şirket içi 10 farklı Docker servisi barındırıyorsanız uygundur; kişisel site için değil.
              </div>
            </div>
          </div>
        </section>

        {/* Question 2: Hangi Teknolojiler ve CMS'ler Önerilir? */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Kritik Soru 2
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">
            Hangi Teknolojiler ve İçerik Yönetim Sistemleri (CMS) Kullanılmalı?
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            İhtiyacınıza göre seçebileceğiniz en modern 3 mimari alternatif:
          </p>

          {/* Architecture Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSelectedTech('stack1')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedTech === 'stack1'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Seçenek 1 (En Tavsiye Edilen)</div>
              <div className="font-bold text-sm mb-1">Astro / Next.js + Tailwind</div>
              <div className="text-xs opacity-80">0 Masraf · 100/100 Hız · En Modern</div>
            </button>

            <button
              onClick={() => setSelectedTech('stack2')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedTech === 'stack2'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Seçenek 2 (Görsel CMS)</div>
              <div className="font-bold text-sm mb-1">Next.js + Sanity.io CMS</div>
              <div className="text-xs opacity-80">Telefondan/Tarayıcıdan İçerik Girme</div>
            </button>

            <button
              onClick={() => setSelectedTech('stack3')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedTech === 'stack3'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Seçenek 3 (Klasik)</div>
              <div className="font-bold text-sm mb-1">WordPress / Ghost</div>
              <div className="text-xs opacity-80">Eski Usul · Aylık Hosting Gerekir</div>
            </button>
          </div>

          {/* Details for Selected Tech */}
          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
            {selectedTech === 'stack1' && (
              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-sm">Neden Astro veya Next.js + Tailwind CSS?</h4>
                <p>
                  <strong>Astro</strong> özellikle blog, biyografi ve hatırat siteleri için dünyanın en popüler modern çerçevesidir. 
                  Sayfaları derleme anında saf HTML ve CSS'e dönüştürür; bu sayede siteniz mobilde anında (0.2 saniyede) açılır ve Google PageSpeed skoru 100 üzerinden 100 olur.
                </p>
                <p>
                  <strong>Admin Paneli Nasıl Çalışır?</strong> Bu uygulamada oluşturduğumuz gibi yerleşik bir yönetici arayüzü ile veya 
                  GitHub tabanlı ücretsiz <em>Decap CMS / TinaCMS</em> ekleyerek hiçbir veritabanı sunucusu kiralamadan içeriklerinizi güvenle yönetebilirsiniz.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="font-semibold text-stone-900">Hosting:</span> Vercel (Ücretsiz)
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-stone-900">Maliyet:</span> 0 TL
                </div>
              </div>
            )}

            {selectedTech === 'stack2' && (
              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-sm">Next.js + Sanity.io / Supabase Headless CMS</h4>
                <p>
                  Eğer kod dosyalarına hiç dokunmadan, cep telefonunuzdan veya iş bilgisayarınızdan tıpkı Medium veya Notion gibi zengin bir panelden 
                  kızınızın fotoğraflarını ve mektuplarını girmek istiyorsanız <strong>Sanity.io</strong> mükemmeldir.
                </p>
                <p>
                  Sanity'nin ücretsiz paketi (Free Tier) ayda binlerce belge ve görsel depolamaya izin verir. Frontend'i Next.js ile Vercel'e atarsınız, 
                  içerik panelini ise `sizinsiteniz.com/studio` adresinden şifrenizle açıp yönetirsiniz.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="font-semibold text-stone-900">Hosting:</span> Vercel + Sanity Free
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-stone-900">Maliyet:</span> 0 TL
                </div>
              </div>
            )}

            {selectedTech === 'stack3' && (
              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-sm">WordPress veya Ghost</h4>
                <p>
                  Geleneksel web siteleri için yaygın olsa da, kızınız için özel, minimalist ve hızlı bir site yaparken 
                  WordPress önermiyoruz. Çünkü:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  <li>Her ay PHP/MySQL destekli hosting (Turhost, Natro vb.) faturası ödemeniz gerekir.</li>
                  <li>Eklentiler zamanla sitenizi ağırlaştırır ve güvenlik açıklarına yol açabilir.</li>
                  <li>Vercel/Astro'nun sunduğu modern tipografi ve sıfır gecikmeli mobil deneyimi yakalamak zordur.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Yeni Eklenen: Astro, Next.js ve Tailwind CSS Nedir? Basit Rehber */}
          <div className="mt-8 pt-8 border-t border-stone-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
              Temel Kavramlar Rehberi
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900 mb-4">
              Astro, Next.js ve Tailwind CSS Nedir? (Basit Terimlerle)
            </h3>

            {/* Ev Benzetmesi */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 mb-6 text-xs text-stone-700 leading-relaxed">
              <span className="font-bold text-stone-900 block mb-1">🏠 Basit Bir Ev Benzetmesi:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                  <strong className="text-stone-900 block mb-0.5">1. Tailwind CSS</strong>
                  <span>Evin duvar boyası, mobilyaları, ışıklandırması ve dekorasyonudur (Sitenin tasarımı ve renkleri).</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                  <strong className="text-stone-900 block mb-0.5">2. Next.js</strong>
                  <span>Evin akıllı tesisatı, dinamik sunucusu ve çok odalı gelişmiş asansör sistemidir (Tam teşekküllü web çatısı).</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                  <strong className="text-stone-900 block mb-0.5">3. Astro</strong>
                  <span>Gereksiz hiçbir yükü olmayan, şimşek hızında açılan hafif ve yalıtımlı modern villa mimarisidir (İçerik odaklı hızlı çatı).</span>
                </div>
              </div>
            </div>

            {/* 3 Detay Kartı */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tailwind Card */}
              <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-stone-900">Tailwind CSS</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded">Tasarım</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    Web sitenizin güzel, modern ve mobil uyumlu görünmesini sağlayan bir <strong>CSS tasarım sistemidir</strong>.
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-4">
                    <li>Eski usul sayfalarca CSS kodu yazmak yerine hazır yardımcı sınıflar kullanılır (örnek: <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">bg-white text-xl rounded-lg</code>).</li>
                    <li>Sitenizin dosya boyutunu minicik tutar; açılış hızını zirveye çıkarır.</li>
                    <li>Şu anda incelediğiniz bu sitenin tüm pastel renkleri ve butonları Tailwind ile kodlanmıştır.</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                  Rolü: Görünüm ve estetik.
                </div>
              </div>

              {/* Next.js Card */}
              <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-stone-900">Next.js</span>
                    <span className="text-[10px] bg-stone-900 text-white font-semibold px-2 py-0.5 rounded">Full-Stack Framework</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    React tabanlı, dünyanın en popüler ve güçlü <strong>tam teşekküllü web uygulama çatısıdır</strong> (Vercel tarafından geliştirilir).
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-4">
                    <li><strong>Sunucu Gücü (SSR):</strong> Sayfalar sunucuda hazırlandığı için Google arama motorları içeriği mükemmel okur (SEO şampiyonu).</li>
                    <li><strong>Vercel ile Kusursuz Uyumluluk:</strong> 1 tıkla Vercel'e atılır, sıfır ayar gerektirir.</li>
                    <li>Hem kullanıcı arayüzünü hem de arka plan veri tabanı/API isteklerini tek çatı altında çözer.</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                  Rolü: Güçlü, dinamik motor ve sunucu.
                </div>
              </div>

              {/* Astro Card */}
              <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-stone-900">Astro</span>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded">Hız & İçerik Şampiyonu</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    Özellikle blog, biyografi, kişisel anı ve portfolyo siteleri için geliştirilmiş <strong>dünyanın en hızlı web çatısıdır</strong>.
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-4">
                    <li><strong>Zero JavaScript:</strong> Sayfaları tarayıcıya saf HTML ve CSS olarak gönderir; bu yüzden cep telefonlarında 0.2 saniyede açılır.</li>
                    <li><strong>Adalar Mimarisi:</strong> Sitenin yazıları statik ve hızlı kalırken, yalnızca oyun veya anı defteri gibi yerler etkileşimli çalışır.</li>
                    <li>Google PageSpeed skoru doğrudan 100/100 çıkar.</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                  Rolü: Maksimum hız ve sıfır gecikme.
                </div>
              </div>

            </div>

            {/* Hangisini Seçmelisiniz? Tavsiye */}
            <div className="mt-6 p-4 rounded-xl bg-stone-900 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">💡 Kızınızın Sitesi İçin En İyi Formül:</span>
                <span className="text-stone-300">
                  <strong>Astro + Tailwind CSS</strong> (veya <strong>Next.js + Tailwind CSS</strong>) ikilisi Vercel üzerinde 0 TL maliyetle dünyanın en modern ve hızlı sitesini oluşturur.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* YENİ: İleride .NET Web API & Veritabanı ve Sunucu Entegrasyonu Planı */}
        <section className="bg-white rounded-2xl border-2 border-stone-900 p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <span>Özel Senaryo & En Mantıklı Çözüm</span>
            <span aria-hidden="true">·</span>
            <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded">Vercel + .NET Web API</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">
            En Mantıklı Seçenek: Saf React (Vite) veya Next.js + Tailwind (Frontend) & İleride .NET API
          </h2>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            <strong>Evet, frontend'i doğrudan SAF REACT (Vite) yapabilirsiniz!</strong> Hatta şu anda ekranınızda çalışan bu projenin kendisi 
            birebir <strong>React 19 + TypeScript + Vite</strong> ile kodlanmıştır. Vercel'e atıp doğrudan C# / .NET Web API ve veritabanına bağlayabilirsiniz.
          </p>

          {/* Mimari Görsel Şeması */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 mb-6 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              
              {/* Box 1: Frontend */}
              <div className="p-4 bg-white rounded-xl border-2 border-stone-900 shadow-sm">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">ÖNYÜZ (FRONTEND)</span>
                <span className="font-bold text-stone-900 text-sm block">Vercel</span>
                <span className="text-xs text-stone-600 block mt-0.5">Saf React (Vite) + Tailwind</span>
                <span className="text-[10px] text-stone-400 block mt-2">Alan Adı: kiziminsitesi.com</span>
              </div>

              {/* Arrow 1 */}
              <div className="flex flex-col items-center justify-center text-stone-500 py-2">
                <span className="text-[11px] font-sans font-semibold text-stone-700">REST API / JSON</span>
                <span className="text-xl">⇄</span>
                <span className="text-[10px] text-stone-400">HTTPS İstekleri (fetch/axios)</span>
              </div>

              {/* Box 2: Backend */}
              <div className="p-4 bg-white rounded-xl border-2 border-blue-600 shadow-sm">
                <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">ARKA PLAN (BACKEND)</span>
                <span className="font-bold text-stone-900 text-sm block">ASP.NET Core Web API</span>
                <span className="text-xs text-stone-600 block mt-0.5">C# + Entity Framework</span>
                <span className="text-[10px] text-stone-400 block mt-2">Alan Adı: api.kiziminsitesi.com</span>
              </div>

            </div>

            {/* Sub-storage row */}
            <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block">🗄️ Veritabanı</span>
                <span className="text-stone-500 text-[11px]">PostgreSQL veya Microsoft SQL Server (Anılar, yazılar, defter kayıtları)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block">🖼️ Resim & Dosya Deposu</span>
                <span className="text-stone-500 text-[11px]">Sunucu Klasörü (/uploads) veya S3/MinIO (API üzerinden yükleme)</span>
              </div>
            </div>
          </div>

          {/* Neden Next.js En Mantıklı? 4 Neden */}
          <div className="space-y-3 mb-6">
            <h4 className="font-display font-bold text-stone-900 text-sm">
              Neden Bu Senaryoda KESİNLİKLE Next.js + Tailwind Seçmelisiniz?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">1. İki Aşama (Adım Adım Büyüme):</strong>
                <span>
                  <strong>Bugün:</strong> .NET API yazmakla vakit kaybetmeden, projedeki hazır veri katmanıyla sitenizi Vercel'de anında yayına alırsınız (0 TL).<br/>
                  <strong>Yarın:</strong> .NET API'nizi yazdığınızda, sadece API URL'sini bağlarsınız; arayüzünüzün tek bir satırını bile baştan yazmak zorunda kalmazsınız.
                </span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">2. Decoupled (Tamamen Bağımsız) Güç:</strong>
                <span>
                  Frontend Vercel'in küresel CDN'inde durduğu için dünya hız rekortmeni olur. .NET API'niz bir gün bakıma girse bile sitenizin ön yüzü asla çökmez.
                </span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">3. Resim Optimizasyonu (next/image):</strong>
                <span>
                  .NET API'nizden veya sunucunuzdan 10 MB'lık büyük bir fotoğraf gelse bile, Next.js onu ziyaretçinin telefon ekranına göre otomatik olarak 100 KB WebP formatına sıkıştırıp sunar.
                </span>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">4. Sıfır CORS & Proxy Yeteneği:</strong>
                <span>
                  Next.js'in içindeki Route Handlers sayesinde `.NET Web API`'nize sunucu arkasından istek atabilir, tarayıcı CORS hatalarıyla ve güvenlik token sızıntılarıyla uğraşmazsınız.
                </span>
              </div>
            </div>
          </div>

          {/* Kod Örneği: .NET API'ye Hazır Servis */}
          <div className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono">
            <span className="text-stone-400 block mb-2">// Projemize eklediğimiz servis katmanı (src/services/api.ts):</span>
            <span className="text-emerald-400">const</span> API_URL = process.env.NEXT_PUBLIC_API_URL || <span className="text-amber-300">"https://api.kiziminsitesi.com/api"</span>;<br/><br/>
            <span className="text-stone-400">// .NET API'niz hazır olduğunda tek yapacağınız:</span><br/>
            <span className="text-blue-400">export async function</span> <span className="text-yellow-300">getMilestones</span>() &#123;<br/>
            &nbsp;&nbsp;<span className="text-emerald-400">const</span> res = <span className="text-emerald-400">await</span> fetch(<span className="text-amber-300">`$&#123;API_URL&#125;/milestones`</span>);<br/>
            &nbsp;&nbsp;<span className="text-blue-400">return</span> res.json(); <span className="text-stone-400">// C# Controller: [HttpGet("milestones")]</span><br/>
            &#125;
          </div>
        </section>

        {/* Question 3: Ekstra Üyelik ve Maliyet Tablosu */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Kritik Soru 3
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
            Ekstra Almam Gereken Bir Üyelik veya Ortam Var mıdır?
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Bütçe ve hesap kontrol listesi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-lg">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Gereksinim</th>
                  <th className="py-2.5 px-4">Önerilen Servis</th>
                  <th className="py-2.5 px-4">Maliyet</th>
                  <th className="py-2.5 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-stone-900">Özel Alan Adı (Domain)</td>
                  <td className="py-2.5 px-4">Mevcut aldığınız domain ({domain})</td>
                  <td className="py-2.5 px-4">Yıllık yenileme</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-medium">✓ Zaten Satın Aldınız</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-stone-900">Web Barındırma (Hosting & CDN)</td>
                  <td className="py-2.5 px-4">Vercel veya Cloudflare Pages</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">0 TL (Ömür boyu ücretsiz)</td>
                  <td className="py-2.5 px-4">Ücretsiz hesap açılacak (1 dk)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-stone-900">Kod Deposu (Version Control)</td>
                  <td className="py-2.5 px-4">GitHub.com</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">0 TL (Tamamen ücretsiz)</td>
                  <td className="py-2.5 px-4">Ücretsiz hesap açılacak</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-stone-900">Güvenlik Sertifikası (SSL / HTTPS)</td>
                  <td className="py-2.5 px-4">Vercel Let's Encrypt / Cloudflare</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">0 TL (Otomatik tanımlanır)</td>
                  <td className="py-2.5 px-4">Ek ayar gerekmez</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-stone-900">SEO & Arama Kaydı</td>
                  <td className="py-2.5 px-4">Google Search Console</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">0 TL (Google ücretsiz)</td>
                  <td className="py-2.5 px-4">Site açılınca eklenecek</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span>🎉 <strong>Özet:</strong> Hiçbir ücretli ek aboneliğe veya pahalı sunucuya ihtiyacınız yoktur.</span>
            <span className="font-bold">Toplam Ek Gider: 0 TL</span>
          </div>
        </section>

        {/* Step-by-Step Action Roadmap */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Uygulama Planı
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900">
                Nelerden Başlamalısınız? (6 Aşamalı Başlangıç Rehberi)
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
              {completedSteps.length} / 6 Tamamlandı
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "1. Adım: GitHub'da Ücretsiz Hesap Açın",
                desc: "GitHub.com adresine giderek ücretsiz bir hesap oluşturun. Sitenizin kodları burada güvenle saklanacak ve Vercel buradan otomatik derleme yapacaktır.",
              },
              {
                step: 2,
                title: "2. Adım: Sitenin Şablonunu ve Kodlarını Alın",
                desc: "Bu uygulamadaki 'Dışa Aktar' butonuna tıklayarak oluşturduğumuz modern şablonu, sayfa yapılarını ve CMS kodunu doğrudan bilgisayarınıza indirin veya kopyalayın.",
              },
              {
                step: 3,
                title: "3. Adım: Vercel Hesabı Açıp Repoyu Bağlayın",
                desc: "Vercel.com'a 'Continue with GitHub' diyerek giriş yapın. 'Add New Project' butonuna tıklayıp GitHub'daki deponuzu seçin. 'Deploy' dediğinizde siteniz 30 saniye içinde dünya çapında yayına girer.",
              },
              {
                step: 4,
                title: `4. Adım: Satın Aldığınız Alan Adını (${domain}) Vercel'e Bağlayın`,
                desc: "Vercel proje panelinde Settings -> Domains bölümüne girip alan adınızı yazın. Aşağıdaki DNS kayıtlarını domain aldığınız panelde (GoDaddy, Natro, Turhost vb.) tanımlayın.",
              },
              {
                step: 5,
                title: "5. Adım: Admin Paneli ile İlk Anıları & Mektupları Ekleyin",
                desc: "Hazırladığımız Türkçe Admin panelinden kızınızın doğum anısını, ilk adımlarını, fotoğraflarını ve geleceğe mektuplarınızı yükleyin.",
              },
              {
                step: 6,
                title: "6. Adım: Google Search Console Kaydı ve SEO Aktivasyonu",
                desc: "Sitemizin ürettiği sitemap.xml dosyasını Google Search Console'a ekleyin. Böylece akrabalarınız veya kızınızın adını arayanlar ilk sırada bu güzel hatıratı bulacaktır.",
              },
            ].map(item => (
              <div 
                key={item.step}
                onClick={() => toggleStep(item.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  completedSteps.includes(item.step)
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                  completedSteps.includes(item.step)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}>
                  {completedSteps.includes(item.step) ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-stone-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Domain DNS Simulator */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Teknik Kurulum Aracı
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
            Alan Adı (Domain) DNS Ayar Rehberi
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Domain firmanızın (GoDaddy, Natro, Turhost, Namecheap, İsimtescil vb.) DNS yönetim paneline girip eklemeniz gereken 2 kayıt:
          </p>

          <div className="space-y-4">
            {/* Record 1: A Record */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-stone-800">
                  1. Kayıt: Kök Alan Adı Yönlendirmesi (A Kaydı)
                </span>
                <button
                  onClick={() => copyToClipboard('76.76.21.21', 'arecord')}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'arecord' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'arecord' ? 'Kopyalandı' : 'Değeri Kopyala'}</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-white p-3 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">TİP</span>
                  <span className="font-bold text-stone-900">A</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">İSİM / HOST</span>
                  <span className="text-stone-700">@ (veya boşluk)</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">DEĞER / IP</span>
                  <span className="font-bold text-emerald-700">76.76.21.21</span>
                </div>
              </div>
            </div>

            {/* Record 2: CNAME Record */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-stone-800">
                  2. Kayıt: www Alt Alan Adı Yönlendirmesi (CNAME Kaydı)
                </span>
                <button
                  onClick={() => copyToClipboard('cname.vercel-dns.com', 'cnamerecord')}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'cnamerecord' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cnamerecord' ? 'Kopyalandı' : 'Değeri Kopyala'}</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-white p-3 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">TİP</span>
                  <span className="font-bold text-stone-900">CNAME</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">İSİM / HOST</span>
                  <span className="text-stone-700">www</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">HEDEF DEĞER</span>
                  <span className="font-bold text-emerald-700">cname.vercel-dns.com</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 mt-4">
            💡 <em>İpucu:</em> DNS kayıtlarını kaydettikten sonra tüm dünyada aktif olması genellikle 5 ile 30 dakika arasında sürer. 
            Bu süre sonunda `https://{domain}` adresiniz yeşil kilitli (SSL) olarak açılacaktır.
          </p>
        </section>

        {/* Action Bottom Bar */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl mb-1">
              Hazır mısınız? Canlı Önizlemeyi İnceleyin veya Kodları Alın
            </h3>
            <p className="text-xs text-stone-400 max-w-lg">
              Kızınızın web sitesini canlı test edebilir, admin panelinden yeni içerikler ekleyebilir ve tek tıkla kod paketini alabilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenExport}
              className="px-4 py-2.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-medium transition-colors flex items-center gap-2"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Kod Paketini Al</span>
            </button>
            <button
              onClick={onSwitchToSite}
              className="px-5 py-2.5 rounded-lg bg-white text-stone-900 hover:bg-stone-100 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <span>Canlı Siteyi Gör</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
