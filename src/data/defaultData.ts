import { SiteConfig, Milestone, BlogPost, GalleryItem, GuestbookEntry } from '../types/site';

export const initialSiteConfig: SiteConfig = {
  daughterName: "Nisan Aydın",
  titleBadge: "Kişisel Arşiv & Büyüme Günlüğü",
  birthDate: "23 Nisan 2020",
  tagline: "Merakla öğrenen, düş kuran ve dünyayı keşfeden neşeli bir gezgin.",
  bio: "Bu site, kızımız Nisan'ın hayata attığı ilk adımlardan çizdiği ilk resimlere, okul anılarından gelecekteki kendisine bırakılan mektuplara kadar her değerli anı bir arada saklamak ve kendi özel domaininde kalıcı bir dijital miras oluşturmak için sevgiyle hazırlandı.",
  customDomain: "nisanaydin.com",
  themeColor: "rose",
  seo: {
    title: "Nisan Aydın — Kişisel Büyüme Günlüğü & Dijital Hatırat",
    description: "Nisan Aydın'ın çocukluk anıları, fotoğraf galerisi, sanatsal çalışmaları ve geleceğe mektuplar içeren minimalist dijital günlüğü.",
    keywords: "Nisan Aydın, çocukluk anıları, dijital arşiv, büyüme günlüğü, mektuplar, galeri, nisanaydin.com",
    author: "Burak Aydın (Baba)",
    ogImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
  },
  protectionEnabled: false,
  pinCode: "2304",
  kidsPlaygroundEnabled: true
};

export const initialMilestones: Milestone[] = [
  {
    id: "m-1",
    year: "2020",
    dateStr: "23 Nisan 2020",
    title: "Dünyaya Hoş Geldin Güzel Kızım Nisan",
    description: "Gözlerini açtığın ilk an hayatımızın en aydınlık sabahı oldu. Minik parmaklarınla parmağımı sıktığın o saniye, bir ömür sürecek sevgi yolculuğumuz başladı.",
    category: "ilkler",
    location: "İstanbul",
    photoColor: "from-rose-100 to-amber-100",
    highlight: true
  },
  {
    id: "m-2",
    year: "2021",
    dateStr: "15 Ağustos 2021",
    title: "İlk Adımlar ve İlk Sözcükler",
    description: "Salonda sehpayı bırakıp kollarını açarak babaya doğru attığın o cesur adımlar... Düştüğünde ağlamak yerine kahkaha atman hayattaki direncinin ilk işaretiydi.",
    category: "ilkler",
    location: "Evimiz",
    photoColor: "from-amber-100 to-orange-100"
  },
  {
    id: "m-3",
    year: "2023",
    dateStr: "18 Eylül 2023",
    title: "Anaokuluna İlk Merhaba",
    description: "Sarı sırt çantan ve kocaman gülümsemenle okul kapısından el salladın. Arkana bakmadan koşarak yeni arkadaşlarınla boya kalemlerine sarıldın.",
    category: "egitim",
    location: "Neşeli Çocuklar Yuvası",
    photoColor: "from-blue-100 to-indigo-100"
  },
  {
    id: "m-4",
    year: "2024",
    dateStr: "10 Haziran 2024",
    title: "İlk Suluboya Sergisi: 'Mavi Kuş ve Güneş'",
    description: "Parmak boyası ve suluboyayla yaptığın gökyüzü tablosu okul sergisinde baş köşeye asıldı. Renkleri karıştırırken duyduğun o saf neşe paha biçilemezdi.",
    category: "sanat",
    location: "Atölye",
    photoColor: "from-purple-100 to-pink-100",
    highlight: true
  },
  {
    id: "m-5",
    year: "2024",
    dateStr: "22 Temmuz 2024",
    title: "Ege Denizinde İlk Kulaçlar",
    description: "Simidi bırakıp deniz gözlüğünle suyun altındaki balıkları kovalamaya başladın. Doğaya olan hayranlığın ve cesaretin her geçen gün büyüyor.",
    category: "spor",
    location: "Ayvalık",
    photoColor: "from-emerald-100 to-teal-100"
  },
  {
    id: "m-6",
    year: "2025",
    dateStr: "12 Ekim 2025",
    title: "İlk Kodlama & Robotik Denemesi",
    description: "Blok kodlama ile ekrandaki sevimli robotu labirentten çıkardığında gözlerinde yanan o keşif ışıltısı babanı inanılmaz gururlandırdı.",
    category: "egitim",
    location: "Bilim Atölyesi",
    photoColor: "from-cyan-100 to-sky-100"
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "p-1",
    title: "18 Yaşındaki Sana Babadan Mektup: Kendi Yolunu Çizerken",
    slug: "18-yasina-mektup",
    excerpt: "Bu satırları sen henüz küçük bir çocukken yazıyorum. Bir gün kendi kanatlarınla uçarken hayatında daima tutunabileceğin birkaç temel prensip.",
    content: `Sevgili Kızım Nisan,\n\nBu mektubu okuduğunda muhtemelen reşit olmuş, üniversiteye ya da kendi seçtiğin hayat macerasına adım atıyor olacaksın. Bu web sitesini henüz küçükken adına kaydettiğim nisanaydin.com alan adında senin için inşa ettim.\n\nSana hayatta vermek istediğim en büyük tavsiye: Başkalarının beklentileri yerine kendi merakının ve vicdanının sesini dinle. Hata yapmaktan asla korkma; en büyük keşifler tökezledikten sonra ayağa kalkarken öğrenilir.\n\nBil ki ne olursa olsun, nerede olursan ol, bu dünyada arkanda seni her halinle seven ve sana sonsuz inanan bir ailen var.\n\nSeni çok seven baban.`,
    date: "23 Nisan 2024",
    author: "Burak Aydın (Baba)",
    readTime: "3 dk okuma",
    tags: ["Mektuplar", "Geleceğe Notlar", "Tavsiyeler"]
  },
  {
    id: "p-2",
    title: "Pazar Sabahları, Çizdiğimiz Hayvanlar ve Hayal Gücü",
    slug: "pazar-sabahlari-ve-hayal-gucu",
    excerpt: "Birlikte masaya serdiğimiz dev rulo kağıtlara uydurduğumuz mor zürafalar, uçan kaplumbağalar ve hayal kurmanın gücü üzerine kısa bir not.",
    content: `Çocukların dünyayı algılama biçimi yetişkinlerin unuttuğu mucizelerle doludur.\n\nGeçen pazar Nisan eline pastel boyayı alıp "Baba zürafaların neden sadece boynu uzun olsun, sırtlarında bulut taşıyorlar ya!" dedi. O an anladım ki tasarım ve yaratıcılık kalıpları yıkmaktan ibaret.\n\nHayatın boyunca bu çocuksu merakı ve sınır tanımayan hayal gücünü koruman dileğiyle güzel kızım.`,
    date: "12 Kasım 2024",
    author: "Burak Aydın (Baba)",
    readTime: "2 dk okuma",
    tags: ["Çocukluk", "Sanat", "Farkındalık"]
  },
  {
    id: "p-3",
    title: "Kütüphanemizin En Sevilen Masalları: Küçük Prens ve Nisan",
    slug: "kucuk-prens-ve-nisan",
    excerpt: "Her gece uyumadan önce okuduğumuz kitaplar arasından Nisan'ın tekrar tekrar dinlemek istediği o unutulmaz cümleler.",
    content: `"Asıl önemli olan gözle görülmez, sadece kalple bakıldığında gerçeği görebilirsin."\n\nKüçük Prens'i ilk okuduğumuzda tilkinin evcilleştirme tanımını Nisan öyle güzel yorumladı ki: "Yani birbirimize zaman ayırınca arkadaş oluyoruz değil mi baba?"\n\nZaman ayırmak... Bu sitenin ve bu anıların asıl var oluş sebebi tam da bu.`,
    date: "28 Ocak 2025",
    author: "Burak Aydın (Baba)",
    readTime: "2 dk okuma",
    tags: ["Kitaplar", "Masallar", "Akşam Rutinleri"]
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "g-1",
    title: "İlk Suluboya Denemesi",
    caption: "Mavi bulutlar ve sarı güneş temalı ilk özgün çizim çalışması",
    date: "2023",
    category: "sanat",
    aspectRatio: "wide",
    bgGradient: "from-pink-50 via-rose-100 to-amber-100",
    iconType: "palette"
  },
  {
    id: "g-2",
    title: "Doğayla İlk Tanışma",
    caption: "Kaz Dağları yürüyüşünde çam kozalakları toplayan minik kaşif Nisan",
    date: "2024",
    category: "tatil",
    aspectRatio: "square",
    bgGradient: "from-emerald-50 via-teal-100 to-green-100",
    iconType: "sun"
  },
  {
    id: "g-3",
    title: "Gitar ve Müzik Saati",
    caption: "Babasının gitar tellerine minik parmaklarıyla dokunarak çıkardığı ilk melodiler",
    date: "2024",
    category: "etkinlik",
    aspectRatio: "tall",
    bgGradient: "from-amber-50 via-orange-100 to-yellow-100",
    iconType: "music"
  },
  {
    id: "g-4",
    title: "Okul Öncesi Bilim Günü",
    caption: "Su damlası ve büyüteç deneyinde hayret dolu gözlerle inceleme anı",
    date: "2025",
    category: "etkinlik",
    aspectRatio: "square",
    bgGradient: "from-sky-50 via-cyan-100 to-blue-100",
    iconType: "star"
  },
  {
    id: "g-5",
    title: "Aile Bahçesinde Çiçek Dikimi",
    caption: "Kendi diktiği fesleğeni her sabah özenle sulayan küçük bahçıvan",
    date: "2025",
    category: "tatil",
    aspectRatio: "wide",
    bgGradient: "from-violet-50 via-purple-100 to-pink-100",
    iconType: "heart"
  }
];

export const initialGuestbook: GuestbookEntry[] = [
  {
    id: "gb-1",
    name: "Ayşe Teyze",
    relationship: "Teyze",
    message: "Gözlerimizin nuru güzel Nisan, her gülüşün hayatımıza neşe katıyor. Bu site senin gibi pırıl pırıl olmuş!",
    date: "23 Nisan 2024",
    approved: true
  },
  {
    id: "gb-2",
    name: "Mehmet Dede",
    relationship: "Dede",
    message: "Büyüdüğünü görmek en büyük mutluluğum canım torunum Nisan. Yolun açık, kalbin hep sevgi dolu olsun.",
    date: "10 Haziran 2024",
    approved: true
  },
  {
    id: "gb-3",
    name: "Selin Öğretmen",
    relationship: "Okul Öncesi Eğitmeni",
    message: "Sınıfımızın en meraklı ve yardımsever minik öğrencisi Nisan! Başarıların ve neşen daim olsun.",
    date: "20 Ocak 2025",
    approved: true
  }
];
