import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Star, Trophy, Award, Heart, Volume2, 
  RotateCcw, ArrowRight, CheckCircle2, Play, BookOpen, 
  Smile, ShieldCheck, Sun, Droplets, Trash2, Apple, 
  Compass, Flame, Gift, Check, ChevronRight
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface LingokidsPlaygroundProps {
  daughterName: string;
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
}

// Lingokids Characters
interface Character {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  greeting: string;
  quote: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'cowy',
    name: 'Cowy the Cow',
    role: 'Sanat & Neşe',
    emoji: '🐮',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    greeting: "Hi! I'm Cowy! Let's laugh, sing and play together!",
    quote: "Her gün yeni bir şarkı ve renk keşfet!"
  },
  {
    id: 'billy',
    name: 'Billy the Beaver',
    role: 'İcatlar & Bilim',
    emoji: '🦫',
    color: 'text-orange-800',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    greeting: "Hello there! I'm Billy! Let's build, fix and discover amazing things!",
    quote: "Merak et, parçaları birleştir, çözümü bul!"
  },
  {
    id: 'elliot',
    name: 'Elliot the Panda',
    role: 'Doğa & Spor',
    emoji: '🐼',
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    greeting: "Hey friend! I'm Elliot! I love trees, animals and green nature!",
    quote: "Doğayı koruyalım, hayvanları sevelim!"
  },
  {
    id: 'lisa',
    name: 'Lisa the Cat',
    role: 'Harfler & Kelimeler',
    emoji: '🐱',
    color: 'text-rose-700',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-300',
    greeting: "Meow! I'm Lisa! Let's read wonderful words and stories!",
    quote: "Kitaplar ve İngilizce kelimeler sihir gibidir!"
  },
  {
    id: 'babybot',
    name: 'Baby Bot',
    role: 'Sayılar & Matematik',
    emoji: '🤖',
    color: 'text-sky-800',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-300',
    greeting: "Beep boop! I am Baby Bot! Let's count stars and numbers!",
    quote: "1, 2, 3... Sayılarla oynamak çok eğlenceli!"
  }
];

// Lingokids Learning Adventure Levels (İlerleme Haritası)
interface AdventureLevel {
  id: number;
  title: string;
  category: 'words' | 'math' | 'habits' | 'nature' | 'logic';
  categoryLabel: string;
  character: Character;
  desc: string;
  icon: string;
  starsTarget: number;
}

const ADVENTURE_LEVELS: AdventureLevel[] = [
  {
    id: 1,
    title: "Lisa'nın Kelime Balonları",
    category: 'words',
    categoryLabel: 'İngilizce & Harfler',
    character: CHARACTERS[3], // Lisa
    desc: 'Doğru İngilizce kelimeyi ve meyveyi bul!',
    icon: '🍎',
    starsTarget: 3
  },
  {
    id: 2,
    title: "Baby Bot Sayı İstasyonu",
    category: 'math',
    categoryLabel: 'Erken Matematik',
    character: CHARACTERS[4], // Baby Bot
    desc: 'Yıldızları ve elmaları sayıp doğru rakamı seç!',
    icon: '🔢',
    starsTarget: 3
  },
  {
    id: 3,
    title: "Billy ile Diş Fırçalama",
    category: 'habits',
    categoryLabel: 'Sağlık & Öz Bakım',
    character: CHARACTERS[1], // Billy
    desc: 'Mikropları fırçala, bembeyaz parlayan gülümseme kazan!',
    icon: '🪥',
    starsTarget: 3
  },
  {
    id: 4,
    title: "Elliot'ın Geri Dönüşüm Çiftliği",
    category: 'nature',
    categoryLabel: 'Doğa & Çevre Bilinci',
    character: CHARACTERS[2], // Elliot
    desc: 'Atıkları doğru kutulara ayırarak dünyayı temizle!',
    icon: '♻️',
    starsTarget: 3
  },
  {
    id: 5,
    title: "Cowy'nin Sağlıklı Tabak Şefi",
    category: 'habits',
    categoryLabel: 'Beslenme Alışkanlığı',
    character: CHARACTERS[0], // Cowy
    desc: 'Sağlıklı meyve ve sebzelerle tabağını doldur!',
    icon: '🥗',
    starsTarget: 3
  },
  {
    id: 6,
    title: "Gölge & Şekil Dedektifi",
    category: 'logic',
    categoryLabel: 'Görsel Mantık & Zeka',
    character: CHARACTERS[1], // Billy
    desc: 'Her sevimli figürü gizli gölgesiyle eşleştir!',
    icon: '🧩',
    starsTarget: 3
  }
];

// Interactive Activity 1: Words
const WORD_TASKS = [
  { word: 'Apple', turkish: 'Elma', emoji: '🍎', sound: 'Apple starts with A!', options: ['🍎', '🚗', '🐱'], correct: '🍎' },
  { word: 'Butterfly', turkish: 'Kelebek', emoji: '🦋', sound: 'Butterfly has beautiful wings!', options: ['🐶', '🦋', '⚽'], correct: '🦋' },
  { word: 'Rainbow', turkish: 'Gökkuşağı', emoji: '🌈', sound: 'Rainbow has 7 colors!', options: ['🌈', '🍕', '🚗'], correct: '🌈' },
  { word: 'Elephant', turkish: 'Fil', emoji: '🐘', sound: 'Elephant has a long trunk!', options: ['🐱', '🐸', '🐘'], correct: '🐘' },
  { word: 'Sun', turkish: 'Güneş', emoji: '☀️', sound: 'Sun gives warm golden light!', options: ['🌧️', '☀️', '🌙'], correct: '☀️' },
  { word: 'Guitar', turkish: 'Gitar', emoji: '🎸', sound: 'Guitar plays sweet music!', options: ['🎸', '🍎', '🧸'], correct: '🎸' }
];

// Interactive Activity 2: Math
const MATH_TASKS = [
  { question: 'Kaç tane sevimli kurabiye var?', items: ['🍪', '🍪', '🍪'], count: 3, word: 'Three Cookies', options: [2, 3, 4] },
  { question: 'Kaç tane parlak yıldız görüyorsun?', items: ['⭐', '⭐', '⭐', '⭐', '⭐'], count: 5, word: 'Five Stars', options: [4, 5, 6] },
  { question: 'Baby Bot kaç roket saydı?', items: ['🚀', '🚀'], count: 2, word: 'Two Rockets', options: [1, 2, 3] },
  { question: 'Kaç leziz çilek var?', items: ['🍓', '🍓', '🍓', '🍓'], count: 4, word: 'Four Strawberries', options: [3, 4, 5] },
  { question: 'Gökyüzündeki neşeli balonları say!', items: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'], count: 6, word: 'Six Balloons', options: [5, 6, 7] }
];

// Interactive Activity 3: Toothbrushing Germs
interface Germ {
  id: number;
  x: number;
  y: number;
  cleaned: boolean;
  color: string;
}

// Interactive Activity 4: Eco Recycling
const ECO_ITEMS = [
  { id: '1', name: 'Plastik Şişe', english: 'Plastic Bottle', emoji: '🧴', type: 'recycle', binLabel: '♻️ Geri Dönüşüm' },
  { id: '2', name: 'Muz Kabuğu', english: 'Banana Peel', emoji: '🍌', type: 'organic', binLabel: '🍂 Organik / Kompost' },
  { id: '3', name: 'Karton Kutu', english: 'Cardboard Box', emoji: '📦', type: 'recycle', binLabel: '♻️ Geri Dönüşüm' },
  { id: '4', name: 'Elma Çöpü', english: 'Apple Core', emoji: '🍏', type: 'organic', binLabel: '🍂 Organik / Kompost' },
  { id: '5', name: 'Cam Şişe', english: 'Glass Bottle', emoji: '🍾', type: 'recycle', binLabel: '♻️ Geri Dönüşüm' },
  { id: '6', name: 'Havuç Yaprağı', english: 'Carrot Top', emoji: '🥕', type: 'organic', binLabel: '🍂 Organik / Kompost' }
];

// Interactive Activity 5: Healthy Chef
const CHEF_FOODS = [
  { id: 'f1', name: 'Brokoli', english: 'Broccoli', emoji: '🥦', healthy: true },
  { id: 'f2', name: 'Şekerleme', english: 'Candy', emoji: '🍬', healthy: false },
  { id: 'f3', name: 'Taze Balık', english: 'Fish', emoji: '🐟', healthy: true },
  { id: 'f4', name: 'Gazlı İçecek', english: 'Soda', emoji: '🥤', healthy: false },
  { id: 'f5', name: 'Kırmızı Elma', english: 'Red Apple', emoji: '🍎', healthy: true },
  { id: 'f6', name: 'Havuç', english: 'Carrot', emoji: '🥕', healthy: true },
  { id: 'f7', name: 'Lolipop', english: 'Lollipop', emoji: '🍭', healthy: false },
  { id: 'f8', name: 'Yumurta', english: 'Boiled Egg', emoji: '🥚', healthy: true }
];

// Collectible Stickers
interface Sticker {
  id: string;
  name: string;
  emoji: string;
  unlockedStars: number;
  tag: string;
}

const STICKERS: Sticker[] = [
  { id: 's1', name: 'Süper Yıldız', emoji: '🌟', unlockedStars: 2, tag: 'İlk Başarı' },
  { id: 's2', name: 'Cowy Dostluk Kalbi', emoji: '🐮', unlockedStars: 5, tag: 'Lingokids' },
  { id: 's3', name: 'Billy Mucit Rozeti', emoji: '🦫', unlockedStars: 8, tag: 'Bilim Kahramanı' },
  { id: 's4', name: 'Lisa Kelime Ustası', emoji: '🐱', unlockedStars: 12, tag: 'İngilizce Yıldızı' },
  { id: 's5', name: 'Baby Bot Roketi', emoji: '🚀', unlockedStars: 15, tag: 'Matematik Kaşifi' },
  { id: 's6', name: 'Elliot Doğa Koruyucu', emoji: '🌿', unlockedStars: 18, tag: 'Çevre Elçisi' },
  { id: 's7', name: 'Parıldayan Gülüş', emoji: '✨', unlockedStars: 22, tag: 'Sağlıklı Yaşam' },
  { id: 's8', name: 'Büyük Şampiyon Tacı', emoji: '👑', unlockedStars: 25, tag: 'Süper Başarı' }
];

export const LingokidsPlayground: React.FC<LingokidsPlaygroundProps> = ({
  daughterName,
  soundEnabled,
  onAddScore
}) => {
  // Navigation tabs inside Lingokids mode
  const [activeTab, setActiveTab] = useState<'map' | 'game' | 'stickers'>('map');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({ 1: 3, 2: 2, 3: 1, 4: 0, 5: 0, 6: 0 });
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);

  // Mini-Game 1: Words State
  const [wordIdx, setWordIdx] = useState(0);
  const [wordFeedback, setWordFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Mini-Game 2: Math State
  const [mathIdx, setMathIdx] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Mini-Game 3: Toothbrushing State
  const [germs, setGerms] = useState<Germ[]>([
    { id: 1, x: 25, y: 35, cleaned: false, color: 'bg-rose-500' },
    { id: 2, x: 50, y: 30, cleaned: false, color: 'bg-purple-500' },
    { id: 3, x: 75, y: 38, cleaned: false, color: 'bg-amber-500' },
    { id: 4, x: 35, y: 65, cleaned: false, color: 'bg-emerald-500' },
    { id: 5, x: 65, y: 65, cleaned: false, color: 'bg-indigo-500' }
  ]);
  const [brushingComplete, setBrushingComplete] = useState(false);

  // Mini-Game 4: Eco Recycling State
  const [ecoIdx, setEcoIdx] = useState(0);
  const [ecoFeedback, setEcoFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Mini-Game 5: Healthy Plate State
  const [plateFoods, setPlateFoods] = useState<string[]>([]);
  const [chefFeedback, setChefFeedback] = useState<string | null>(null);

  // Total Stars calculated from levels
  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  const speak = (text: string) => {
    if (!soundEnabled) return;
    soundFx.speak(text, 'en-US');
  };

  // Launch a specific adventure level
  const startLevel = (lvlId: number) => {
    setCurrentLevelId(lvlId);
    setActiveTab('game');
    soundFx.playPop();

    const lvl = ADVENTURE_LEVELS.find(l => l.id === lvlId);
    if (lvl) {
      speak(`Welcome to ${lvl.title}! ${lvl.desc}`);
    }
  };

  // Award stars to a level
  const completeLevelSuccess = (lvlId: number, starsEarned: number) => {
    soundFx.playSuccess();
    setLevelStars(prev => ({
      ...prev,
      [lvlId]: Math.max(prev[lvlId] || 0, starsEarned)
    }));
    onAddScore(starsEarned * 2);
    speak(`Super job ${daughterName}! You earned ${starsEarned} stars! Playlearning is wonderful!`);
  };

  // Words Game Handler
  const handleWordSelect = (chosen: string) => {
    const current = WORD_TASKS[wordIdx];
    if (chosen === current.correct) {
      soundFx.playSuccess();
      setWordFeedback('correct');
      speak(`Excellent! ${current.word}! ${current.sound}`);
      completeLevelSuccess(1, 3);
      setTimeout(() => {
        setWordFeedback(null);
        setWordIdx((prev) => (prev + 1) % WORD_TASKS.length);
      }, 1500);
    } else {
      soundFx.playPop();
      setWordFeedback('wrong');
      speak(`Try again! Can you find the ${current.word}?`);
      setTimeout(() => setWordFeedback(null), 1200);
    }
  };

  // Math Game Handler
  const handleMathSelect = (chosen: number) => {
    const current = MATH_TASKS[mathIdx];
    if (chosen === current.count) {
      soundFx.playSuccess();
      setMathFeedback('correct');
      speak(`Awesome! ${current.word}! You are great at math!`);
      completeLevelSuccess(2, 3);
      setTimeout(() => {
        setMathFeedback(null);
        setMathIdx((prev) => (prev + 1) % MATH_TASKS.length);
      }, 1500);
    } else {
      soundFx.playPop();
      setMathFeedback('wrong');
      speak("Let's count together! One, two, three... Try again!");
      setTimeout(() => setMathFeedback(null), 1200);
    }
  };

  // Brush Tooth Germs Handler
  const handleBrushGerm = (id: number) => {
    soundFx.playPop();
    const updated = germs.map(g => g.id === id ? { ...g, cleaned: true } : g);
    setGerms(updated);

    if (updated.every(g => g.cleaned)) {
      setBrushingComplete(true);
      completeLevelSuccess(3, 3);
      speak(`Sparkling white smile! You brushed away all the germs with Billy!`);
    }
  };

  const resetToothbrushing = () => {
    soundFx.playPop();
    setGerms([
      { id: 1, x: 25, y: 35, cleaned: false, color: 'bg-rose-500' },
      { id: 2, x: 50, y: 30, cleaned: false, color: 'bg-purple-500' },
      { id: 3, x: 75, y: 38, cleaned: false, color: 'bg-amber-500' },
      { id: 4, x: 35, y: 65, cleaned: false, color: 'bg-emerald-500' },
      { id: 5, x: 65, y: 65, cleaned: false, color: 'bg-indigo-500' }
    ]);
    setBrushingComplete(false);
  };

  // Eco Recycling Game Handler
  const handleEcoSort = (chosenType: 'recycle' | 'organic') => {
    const current = ECO_ITEMS[ecoIdx];
    if (chosenType === current.type) {
      soundFx.playSuccess();
      setEcoFeedback('correct');
      speak(`Great eco-hero! ${current.name} goes into ${current.binLabel}!`);
      completeLevelSuccess(4, 3);
      setTimeout(() => {
        setEcoFeedback(null);
        setEcoIdx((prev) => (prev + 1) % ECO_ITEMS.length);
      }, 1400);
    } else {
      soundFx.playPop();
      setEcoFeedback('wrong');
      speak(`Think about Elliot's nature rule: is it organic food or recyclable material?`);
      setTimeout(() => setEcoFeedback(null), 1200);
    }
  };

  // Healthy Chef Food Toggle
  const handleChefFoodToggle = (food: typeof CHEF_FOODS[0]) => {
    soundFx.playPop();
    if (!food.healthy) {
      setChefFeedback(`Aman dikkat! ${food.name} çok fazla şeker içerir, nadiren yemeliyiz! 🍬`);
      speak(`Oops! Candies are for special treats! Let's choose healthy colorful foods!`);
      setTimeout(() => setChefFeedback(null), 1800);
      return;
    }

    if (plateFoods.includes(food.id)) {
      setPlateFoods(plateFoods.filter(id => id !== food.id));
    } else {
      const nextPlate = [...plateFoods, food.id];
      setPlateFoods(nextPlate);
      speak(`Yummy ${food.english}! Very healthy and good for growing strong!`);

      if (nextPlate.length >= 4) {
        completeLevelSuccess(5, 3);
        setChefFeedback(`Harika Tabak! Cowy ve Nisan mükemmel bir vitamin tabağı hazırladı! 🥗✨`);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-3 sm:p-5 shadow-sm flex flex-col gap-4">
      
      {/* 1. Lingokids Header & Playlearning Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-0.5">
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-lg font-black flex items-center gap-1">
              🚀 Lingokids Playlearning™
            </span>
            <span>4-8 Yaş Müfredat & Eğitici Macera</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900 flex items-center gap-2">
            <span>✨ Lingokids Dünyası: Eğitici Oyunlar & İlerleme</span>
          </h2>
        </div>

        {/* Navigation Mode Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('map');
              soundFx.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🗺️ Macera Haritası</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('game');
              soundFx.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'game'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🎮 Oyun İstasyonu</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('stickers');
              soundFx.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'stickers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🏆 Çıkartma Albümü</span>
            <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
              {totalStars} ⭐
            </span>
          </button>
        </div>
      </div>

      {/* 2. Lingokids Character Friends Bar (Interactive greetings) */}
      <div className="bg-gradient-to-r from-sky-50 via-amber-50 to-emerald-50 rounded-2xl p-2.5 border border-sky-100 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider">
            Lingokids Dostları:
          </span>
        </div>
        <div className="flex items-center gap-2">
          {CHARACTERS.map(c => {
            const isSelected = selectedCharacter.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCharacter(c);
                  soundFx.playPop();
                  speak(c.greeting);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? `${c.bgColor} ${c.borderColor} ${c.color} ring-2 ring-sky-300 scale-105 shadow-2xs`
                    : 'bg-white/90 border-stone-200/80 text-stone-700 hover:bg-white'
                }`}
                title={c.greeting}
              >
                <span className="text-base">{c.emoji}</span>
                <span className="hidden sm:inline">{c.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Character Voice Quote */}
      <div className="bg-white rounded-xl border border-stone-200/80 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCharacter.emoji}</span>
          <span className="font-bold text-stone-800">{selectedCharacter.name}:</span>
          <span className="text-stone-600 italic">"{selectedCharacter.quote}"</span>
        </div>
        <button
          onClick={() => speak(selectedCharacter.greeting)}
          className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>İngilizce Dinle</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: LINGOKIDS MACERA HARİTASI (PROGRESS MAP)        */}
      {/* ======================================================== */}
      {activeTab === 'map' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 flex items-center gap-1.5">
                <span>🗺️ Nisan'ın Öğrenme Macera Yolu</span>
              </h3>
              <p className="text-xs text-stone-600">
                Seviyeleri tamamlayarak yıldızları topla, rozetleri aç ve yeni oyunların kilidini aç!
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Toplam: {totalStars} / 18 Yıldız</span>
            </div>
          </div>

          {/* Connected Level Roadmap Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ADVENTURE_LEVELS.map((lvl, index) => {
              const stars = levelStars[lvl.id] || 0;
              const isUnlocked = index === 0 || (levelStars[ADVENTURE_LEVELS[index - 1].id] || 0) > 0;
              const isCurrent = currentLevelId === lvl.id;

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'border-sky-500 bg-sky-50/60 shadow-md ring-2 ring-sky-200'
                      : isUnlocked
                      ? 'border-stone-200 bg-white hover:border-sky-300 hover:shadow-sm'
                      : 'border-stone-200 bg-stone-50 opacity-60'
                  }`}
                >
                  {/* Top Bar: Level Number & Category Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-stone-900 text-white">
                      Seviye {lvl.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {lvl.categoryLabel}
                    </span>
                  </div>

                  {/* Level Content */}
                  <div className="flex items-start gap-3 my-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-2xl shrink-0">
                      {lvl.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 leading-snug">
                        {lvl.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {lvl.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500">
                        <span>Rehber: {lvl.character.emoji} {lvl.character.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Star Rating & Play Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map(starNum => (
                        <Star
                          key={starNum}
                          className={`w-4 h-4 ${
                            starNum <= stars
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => startLevel(lvl.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                        stars === 3
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-xs'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{stars > 0 ? 'Tekrar Oyna' : 'Başla'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: LINGOKIDS OYUN İSTASYONU (ACTIVE PLAY ZONE)      */}
      {/* ======================================================== */}
      {activeTab === 'game' && (
        <div className="flex flex-col gap-4">
          
          {/* Level Switcher Header */}
          <div className="flex flex-wrap items-center justify-between bg-stone-50 p-2.5 rounded-2xl border border-stone-200 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                {currentLevelId}
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  Aktif Lingokids Seviyesi:
                </span>
                <h4 className="font-bold text-sm text-stone-900 leading-tight">
                  {ADVENTURE_LEVELS.find(l => l.id === currentLevelId)?.title}
                </h4>
              </div>
            </div>

            {/* Quick Level Selector Buttons */}
            <div className="flex items-center gap-1">
              {ADVENTURE_LEVELS.map(l => (
                <button
                  key={l.id}
                  onClick={() => startLevel(l.id)}
                  className={`w-7 h-7 rounded-xl font-bold text-xs transition-all ${
                    currentLevelId === l.id
                      ? 'bg-stone-900 text-white shadow-xs scale-105'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {l.id}
                </button>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* LEVEL 1: LISA'S VOCABULARY & WORDS                  */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 1 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-rose-50/50 to-white rounded-3xl border border-rose-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🐱</span>
                <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                  Lisa's Word Challenge • İngilizce Kelime & Meyve
                </span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mb-1">
                "{WORD_TASKS[wordIdx].word}"
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4">
                Türkçe Anlamı: <strong className="text-rose-700">{WORD_TASKS[wordIdx].turkish}</strong> • Hangi resim bu kelimeye aittir?
              </p>

              {/* 3 Large Word Choice Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-md mb-4">
                {WORD_TASKS[wordIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleWordSelect(opt)}
                    className="h-28 sm:h-32 rounded-3xl bg-white border-2 border-stone-200 hover:border-rose-400 hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center p-2 cursor-pointer shadow-xs"
                  >
                    <span className="text-5xl sm:text-6xl transform transition-transform hover:scale-110">
                      {opt}
                    </span>
                  </button>
                ))}
              </div>

              {/* Word Feedback Banner */}
              {wordFeedback === 'correct' && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-sm flex items-center gap-2 animate-bounce">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Harika Lisa! {WORD_TASKS[wordIdx].word} doğru eşleşti! ⭐⭐⭐</span>
                </div>
              )}
              {wordFeedback === 'wrong' && (
                <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
                  Tekrar dene! İngilizce telaffuzu dinle! 🔊
                </div>
              )}

              <button
                onClick={() => speak(WORD_TASKS[wordIdx].word)}
                className="mt-3 text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 px-3 py-1.5 bg-rose-100/70 rounded-xl"
              >
                <Volume2 className="w-4 h-4" />
                <span>Kelimeyi Dinle: "{WORD_TASKS[wordIdx].word}"</span>
              </button>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LEVEL 2: BABY BOT'S MATH & COUNTING                 */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 2 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-sky-50/50 to-white rounded-3xl border border-sky-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
                  Baby Bot Math Lab • Erken Matematik & Sayma
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-3">
                {MATH_TASKS[mathIdx].question}
              </h3>

              {/* Interactive Item Count Visuals */}
              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-sky-100/50 rounded-2xl border border-sky-200 max-w-md w-full mb-4">
                {MATH_TASKS[mathIdx].items.map((emoji, idx) => (
                  <span
                    key={idx}
                    className="text-4xl sm:text-5xl transform hover:scale-125 transition-transform cursor-pointer"
                    onClick={() => {
                      soundFx.playPop();
                      speak(`${idx + 1}`);
                    }}
                    title={`Dokun ve say: ${idx + 1}`}
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              {/* Number Buttons */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                {MATH_TASKS[mathIdx].options.map(num => (
                  <button
                    key={num}
                    onClick={() => handleMathSelect(num)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-stone-200 hover:border-sky-500 font-display font-black text-2xl sm:text-3xl text-stone-900 hover:text-sky-600 transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>

              {mathFeedback === 'correct' && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-sm flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Süper Baby Bot! Doğru cevap: {MATH_TASKS[mathIdx].count}! ⭐⭐⭐</span>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LEVEL 3: BILLY'S TOOTHBRUSHING & SELF-CARE          */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 3 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-orange-50/50 to-white rounded-3xl border border-orange-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🦫</span>
                <span className="text-xs font-black uppercase text-orange-700 tracking-wider">
                  Billy's Health & Habits • Diş Fırçalama Oyunu
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-1">
                Mikropları Fırçala ve Parlat! 🪥
              </h3>
              <p className="text-xs text-stone-600 mb-4 max-w-md">
                Dişlerin üzerindeki renkli mikroplara dokunarak onları fırçala ve pırıl pırıl bembeyaz bir gülümseme kazan!
              </p>

              {/* Tooth Canvas with Germs to Tap */}
              <div className="relative w-72 h-44 sm:w-80 sm:h-52 bg-white rounded-3xl border-4 border-orange-200 shadow-inner flex items-center justify-center overflow-hidden mb-4">
                <span className="text-8xl sm:text-9xl opacity-90 select-none">
                  {brushingComplete ? '😁' : '🦷'}
                </span>

                {/* Floating Germs */}
                {!brushingComplete && germs.map(g => !g.cleaned && (
                  <button
                    key={g.id}
                    onClick={() => handleBrushGerm(g.id)}
                    style={{ left: `${g.x}%`, top: `${g.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full ${g.color} text-white font-black text-xs flex items-center justify-center shadow-md animate-pulse cursor-pointer hover:scale-125 transition-transform`}
                    title="Fırçalamak için dokun!"
                  >
                    🦠
                  </button>
                ))}

                {brushingComplete && (
                  <div className="absolute inset-0 bg-emerald-50/90 flex flex-col items-center justify-center p-3">
                    <Sparkles className="w-10 h-10 text-emerald-500 animate-spin mb-1" />
                    <span className="font-display font-black text-lg text-emerald-900">
                      Bembeyaz Parıldayan Gülüş! ✨
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      Günde 2 defa 2 dakika fırçalamayı unutmuyoruz!
                    </span>
                  </div>
                )}
              </div>

              {/* Reset or Replay Brush */}
              <button
                onClick={resetToothbrushing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tekrar Fırçala</span>
              </button>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LEVEL 4: ELLIOT'S ECO RECYCLING                     */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 4 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl border border-emerald-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🐼</span>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  Elliot's Green Earth • Geri Dönüşüm & Çevre
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-1">
                Bu Atık Hangi Kutuya Gider? ♻️
              </h3>
              <p className="text-xs text-stone-600 mb-4">
                Doğayı korumak için atıkları geri dönüşüm veya organik kompost kutusuna ayır!
              </p>

              {/* Current Waste Item Card */}
              <div className="w-48 h-36 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm flex flex-col items-center justify-center p-3 mb-5">
                <span className="text-6xl mb-1">{ECO_ITEMS[ecoIdx].emoji}</span>
                <span className="font-bold text-sm text-stone-900">{ECO_ITEMS[ecoIdx].name}</span>
                <span className="text-xs text-stone-500 font-medium">({ECO_ITEMS[ecoIdx].english})</span>
              </div>

              {/* 2 Recycle Bins */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-4">
                <button
                  onClick={() => handleEcoSort('recycle')}
                  className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-400 hover:bg-blue-100 flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="text-4xl mb-1">♻️</span>
                  <span className="font-bold text-xs sm:text-sm text-blue-900">Geri Dönüşüm</span>
                  <span className="text-[10px] text-blue-700">Plastik, Kağıt, Cam</span>
                </button>

                <button
                  onClick={() => handleEcoSort('organic')}
                  className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 hover:bg-amber-100 flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="text-4xl mb-1">🍂</span>
                  <span className="font-bold text-xs sm:text-sm text-amber-900">Organik / Kompost</span>
                  <span className="text-[10px] text-amber-700">Meyve, Sebze Kabuğu</span>
                </button>
              </div>

              {ecoFeedback === 'correct' && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-sm flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Harika Çevre Kahramanı! Doğru kutuya attın! ⭐⭐⭐</span>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LEVEL 5: COWY'S HEALTHY LUNCHBOX CHEF               */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 5 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-amber-50/50 to-white rounded-3xl border border-amber-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🐮</span>
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  Cowy's Kitchen • Sağlıklı Tabak Şefi
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-1">
                Tabağını Sağlıklı Yiyeceklerle Doldur! 🥗
              </h3>
              <p className="text-xs text-stone-600 mb-3">
                Besleyici meyve, sebze ve proteinleri seç; şeker ve gazlı içeceklerden uzak dur!
              </p>

              {/* Feedback toast */}
              {chefFeedback && (
                <div className="p-2 px-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 animate-fade-in">
                  {chefFeedback}
                </div>
              )}

              {/* Plate View */}
              <div className="w-full max-w-sm h-28 rounded-3xl bg-amber-100/60 border-2 border-dashed border-amber-300 flex items-center justify-center gap-3 px-4 mb-4">
                {plateFoods.length === 0 ? (
                  <span className="text-xs text-stone-500 font-medium italic">
                    Aşağıdan sağlıklı yiyeceklere dokunarak tabağa ekle...
                  </span>
                ) : (
                  plateFoods.map(fid => {
                    const food = CHEF_FOODS.find(f => f.id === fid);
                    return (
                      <span key={fid} className="text-4xl animate-bounce">
                        {food?.emoji}
                      </span>
                    );
                  })
                )}
              </div>

              {/* Foods Grid */}
              <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                {CHEF_FOODS.map(f => {
                  const isSelected = plateFoods.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleChefFoodToggle(f)}
                      className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 shadow-xs ring-2 ring-emerald-200'
                          : 'border-stone-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <span className="text-3xl mb-0.5">{f.emoji}</span>
                      <span className="text-[11px] font-bold text-stone-800">{f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LEVEL 6: SHAPE & LOGIC DETECTIVE                    */}
          {/* ---------------------------------------------------- */}
          {currentLevelId === 6 && (
            <div className="p-4 sm:p-6 bg-gradient-to-b from-purple-50/50 to-white rounded-3xl border border-purple-200 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧩</span>
                <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
                  Logic & Brain Training • Mantık & Şekiller
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-1">
                Gölge & Şekil Dedektifi 🔍
              </h3>
              <p className="text-xs text-stone-600 mb-4">
                Renk dizisini tamamla: Hangi renk sıradaki boşluğa gelmelidir?
              </p>

              {/* Sequence Puzzle: Red, Blue, Red, Blue, ? */}
              <div className="flex items-center justify-center gap-2.5 p-4 bg-purple-100/50 rounded-2xl border border-purple-200 mb-5">
                <span className="text-4xl">🔴</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <span className="text-4xl">🔵</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <span className="text-4xl">🔴</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <span className="text-4xl">🔵</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-purple-400 bg-white flex items-center justify-center text-xl font-bold text-purple-500">
                  ?
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    completeLevelSuccess(6, 3);
                    speak("Bravo! Red ball completes the pattern!");
                  }}
                  className="px-6 py-3 rounded-2xl bg-white border-2 border-stone-200 hover:border-rose-500 shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-3xl">🔴</span>
                  <span className="font-bold text-xs sm:text-sm text-stone-800">Kırmızı Top</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playPop();
                    speak("Look at the pattern: Red, Blue, Red, Blue... What comes after blue?");
                  }}
                  className="px-6 py-3 rounded-2xl bg-white border-2 border-stone-200 hover:border-blue-500 shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="text-3xl">🔵</span>
                  <span className="font-bold text-xs sm:text-sm text-stone-800">Mavi Top</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Back to Map Button */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              <span>🗺️ Haritaya Dön ve Başka Seviye Seç</span>
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: LINGOKIDS ÇIKARTMA ALBÜMÜ (STICKER BOOK)         */}
      {/* ======================================================== */}
      {activeTab === 'stickers' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 flex items-center gap-1.5">
                <span>🏆 Nisan'ın Lingokids Çıkartma Albümü</span>
              </h3>
              <p className="text-xs text-stone-600">
                Seviyeleri geçip yıldız topladıkça yeni karakter çıkartmalarının kilidi açılır!
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-bold">
              {STICKERS.filter(s => totalStars >= s.unlockedStars).length} / {STICKERS.length} Açıldı
            </div>
          </div>

          {/* Sticker Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STICKERS.map(s => {
              const isUnlocked = totalStars >= s.unlockedStars;
              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    isUnlocked
                      ? 'border-emerald-300 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 bg-stone-50 opacity-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-3xl sm:text-4xl shadow-2xs mb-2">
                    {isUnlocked ? s.emoji : '🔒'}
                  </div>
                  <span className="font-bold text-xs text-stone-900 leading-tight">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    {s.tag}
                  </span>
                  <div className="mt-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {isUnlocked ? 'Kazanıldı ⭐' : `${s.unlockedStars} Yıldız Gerekli`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
