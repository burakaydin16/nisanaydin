export interface LingokidsFriend {
  id: 'billy' | 'elliot' | 'lisa' | 'cobi' | 'babybot';
  name: string;
  role: string;
  roleTr: string;
  emoji: string;
  color: string;
  accentColor: string;
  avatarBg: string;
  greeting: string;
  bioTr: string;
}

export interface LingokidsLevel {
  id: number;
  key: 'food' | 'colors' | 'words' | 'math' | 'teeth' | 'emotions' | 'nature' | 'music';
  title: string;
  titleTr: string;
  category: 'Life Skills' | 'STEM' | 'Literacy' | 'Well-being' | 'Creativity';
  categoryTr: string;
  emoji: string;
  characterId: LingokidsFriend['id'];
  starsTotal: number;
  descTr: string;
  badgeName: string;
  badgeEmoji: string;
}

export interface CollectibleSticker {
  id: string;
  name: string;
  nameTr: string;
  emoji: string;
  levelRequired: number;
  descTr: string;
}

export const LINGOKIDS_FRIENDS: LingokidsFriend[] = [
  {
    id: 'billy',
    name: 'Billy the Chick',
    role: 'Curious Inventor & Puzzles',
    roleTr: 'Akıllı Mucit & Problem Çözücü',
    emoji: '🐥',
    color: 'from-amber-400 to-yellow-500',
    accentColor: 'text-amber-600',
    avatarBg: 'bg-amber-100',
    greeting: 'Tweet! I love science, building gadgets, and solving mysteries with you!',
    bioTr: 'Gözlükleri ve yaratıcı fikirleriyle bilmeceleri çözmeyi çok sever.',
  },
  {
    id: 'elliot',
    name: 'Elliot the Panda',
    role: 'Nature, Art & Mindfulness',
    roleTr: 'Doğa Dostu, Resim & Paylaşma',
    emoji: '🐼',
    color: 'from-emerald-400 to-teal-500',
    accentColor: 'text-emerald-600',
    avatarBg: 'bg-emerald-100',
    greeting: 'Yum! Nature, sweet bamboo, and colorful paintings make every day magical!',
    bioTr: 'Bambu ormanında yaşar, resim yapmayı ve leziz sağlıklı atıştırmalıkları sever.',
  },
  {
    id: 'lisa',
    name: 'Lisa the Cat',
    role: 'Language, Phonics & Stories',
    roleTr: 'Kelime Ustası, Kitap & Hikayeler',
    emoji: '🐱',
    color: 'from-rose-400 to-pink-500',
    accentColor: 'text-rose-600',
    avatarBg: 'bg-rose-100',
    greeting: 'Meow! Words and books open doors to wonderful adventures!',
    bioTr: 'Meraklı bakışlarıyla yeni İngilizce kelimeleri ve masalları keşfeder.',
  },
  {
    id: 'cobi',
    name: 'Cobi the Bull',
    role: 'Sports, Fitness & Energy',
    roleTr: 'Enerjik Sporcu & Sağlıklı Hareket',
    emoji: '🐂',
    color: 'from-orange-400 to-red-500',
    accentColor: 'text-orange-600',
    avatarBg: 'bg-orange-100',
    greeting: 'Let us stretch, jump high, and keep our bodies super strong!',
    bioTr: 'Koşmayı, ip atlamayı ve arkadaşlarıyla takım oyunları oynamayı sever.',
  },
  {
    id: 'babybot',
    name: 'Baby Bot',
    role: 'Coding, Robots & Space',
    roleTr: 'Robotik, Kodlama & Uzay Bilimi',
    emoji: '🤖',
    color: 'from-sky-400 to-blue-500',
    accentColor: 'text-sky-600',
    avatarBg: 'bg-sky-100',
    greeting: 'Beep-boop! Numbers, rhythms, and space exploration activated!',
    bioTr: 'Teknolojiyi çocuklara sevdiren, minik neşeli bir yardımcı robot.',
  },
];

export const LINGOKIDS_LEVELS: LingokidsLevel[] = [
  {
    id: 1,
    key: 'food',
    title: 'Healthy Picnic Basket',
    titleTr: 'Sağlıklı Beslenme Pikniği',
    category: 'Life Skills',
    categoryTr: 'Yaşam Becerisi',
    emoji: '🍎',
    characterId: 'cobi',
    starsTotal: 3,
    descTr: 'Piknik sepetine vitamin dolu taze meyve ve sebzeleri toplayalım!',
    badgeName: 'Vitamin Kahramanı',
    badgeEmoji: '🍏',
  },
  {
    id: 2,
    key: 'colors',
    title: 'Magic Color Mixing Lab',
    titleTr: 'Sihirli Renk Laboratuvarı',
    category: 'Creativity',
    categoryTr: 'Yaratıcılık',
    emoji: '🎨',
    characterId: 'elliot',
    starsTotal: 3,
    descTr: 'İki rengi bir tüpte karıştırıp yepyeni sihirli renkler üretelim!',
    badgeName: 'Renk Büyücüsü',
    badgeEmoji: '🌈',
  },
  {
    id: 3,
    key: 'words',
    title: 'Word Balloons & Phonics',
    titleTr: 'Kelime Balonları & Yazım',
    category: 'Literacy',
    categoryTr: 'İngilizce Okuma',
    emoji: '🎈',
    characterId: 'lisa',
    starsTotal: 3,
    descTr: 'Doğru harf balonlarına dokunup İngilizce kelimeleri tamamlayalım!',
    badgeName: 'Kelime Ustası',
    badgeEmoji: '📚',
  },
  {
    id: 4,
    key: 'math',
    title: "Panda Elliot's Bamboo Count",
    titleTr: 'Elliot ile Bambu Saymaca',
    category: 'STEM',
    categoryTr: 'Erken Matematik',
    emoji: '🎋',
    characterId: 'elliot',
    starsTotal: 3,
    descTr: 'Açıkmış tatlı pandamıza tam istenen sayıda çıtır bambu yedirelim!',
    badgeName: 'Minik Sayı Dehası',
    badgeEmoji: '🔢',
  },
  {
    id: 5,
    key: 'teeth',
    title: 'Sparkling Tooth Brush Hero',
    titleTr: 'Işıl Işıl Diş Fırçalama',
    category: 'Life Skills',
    categoryTr: 'Öz Bakım & Sağlık',
    emoji: '🪥',
    characterId: 'billy',
    starsTotal: 3,
    descTr: 'Karakterimizin dişlerindeki şeker mikroplarını fırçalayıp parlatalım!',
    badgeName: 'Gülümseme Şampiyonu',
    badgeEmoji: '✨',
  },
  {
    id: 6,
    key: 'emotions',
    title: 'Emotions & Friendly Feelings',
    titleTr: 'Duygularımızı Tanıyalım',
    category: 'Well-being',
    categoryTr: 'Sosyal-Duygusal Gelişim',
    emoji: '😊',
    characterId: 'lisa',
    starsTotal: 3,
    descTr: 'Karakterlerin yüz ifadelerine bakıp nasıl hissettiklerini bulalım!',
    badgeName: 'Duygu Dedektifi',
    badgeEmoji: '💖',
  },
  {
    id: 7,
    key: 'nature',
    title: 'Clean Earth Recycling Hero',
    titleTr: 'Temiz Dünya & Geri Dönüşüm',
    category: 'STEM',
    categoryTr: 'Çevre Bilinci',
    emoji: '♻️',
    characterId: 'babybot',
    starsTotal: 3,
    descTr: 'Plastik, kağıt ve cam atıkları doğru geri dönüşüm kutusuna ayıralım!',
    badgeName: 'Gezegen Koruyucusu',
    badgeEmoji: '🌍',
  },
  {
    id: 8,
    key: 'music',
    title: 'Music Party Jam',
    titleTr: 'Neşeli Müzik Partisi',
    category: 'Creativity',
    categoryTr: 'Ritim & Sanat',
    emoji: '🎵',
    characterId: 'cobi',
    starsTotal: 3,
    descTr: 'Piyano, ksilofon ve davullarla kendi melodini çal, dans et!',
    badgeName: 'Ritim Ustası',
    badgeEmoji: '🥁',
  },
];

export const LINGOKIDS_STICKERS: CollectibleSticker[] = [
  { id: 'stk-billy', name: 'Billy Chick Sticker', nameTr: 'Akıllı Billy Çıkartması', emoji: '🐥', levelRequired: 1, descTr: '1. Seviyeyi tamamlayınca açılır' },
  { id: 'stk-apple', name: 'Crisp Apple Sticker', nameTr: 'Kıpkırmızı Elma', emoji: '🍎', levelRequired: 1, descTr: 'Sağlıklı beslenme ödülü' },
  { id: 'stk-palette', name: 'Rainbow Palette', nameTr: 'Gökkuşağı Paleti', emoji: '🎨', levelRequired: 2, descTr: 'Renk laboratuvarı ödülü' },
  { id: 'stk-lisa', name: 'Lisa Cat Sticker', nameTr: 'Kaşif Kedi Lisa', emoji: '🐱', levelRequired: 3, descTr: '3. Seviyeyi tamamlayınca açılır' },
  { id: 'stk-balloon', name: 'Golden Balloon', nameTr: 'Uçan Altın Balon', emoji: '🎈', levelRequired: 3, descTr: 'Kelime kurma başarısı' },
  { id: 'stk-elliot', name: 'Panda Elliot Sticker', nameTr: 'Sevimli Panda Elliot', emoji: '🐼', levelRequired: 4, descTr: '4. Seviyeyi tamamlayınca açılır' },
  { id: 'stk-bamboo', name: 'Lucky Bamboo', nameTr: 'Şanslı Yeşil Bambu', emoji: '🎋', levelRequired: 4, descTr: 'Sayı sayma başarısı' },
  { id: 'stk-sparkle', name: 'Shiny Tooth Star', nameTr: 'Pırıl Pırıl Diş Yıldızı', emoji: '✨', levelRequired: 5, descTr: '5. Seviyeyi tamamlayınca açılır' },
  { id: 'stk-heart', name: 'Happy Heart', nameTr: 'Mutlu Sevgi Kalbi', emoji: '💖', levelRequired: 6, descTr: 'Duyguları anlama ödülü' },
  { id: 'stk-earth', name: 'Earth Hero', nameTr: 'Mavi Gezegen Kahramanı', emoji: '🌍', levelRequired: 7, descTr: 'Doğa temizliği ödülü' },
  { id: 'stk-cobi', name: 'Cobi Bull Sticker', nameTr: 'Şampiyon Cobi', emoji: '🐂', levelRequired: 8, descTr: '8. Seviyeyi tamamlayınca açılır' },
  { id: 'stk-trophy', name: 'Grand Playlearning Trophy', nameTr: 'Büyük Lingokids Kupası', emoji: '🏆', levelRequired: 8, descTr: 'Tüm aşamaları bitiren Nisan Aydın için!' },
];
