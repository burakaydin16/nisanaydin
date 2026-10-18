import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Trophy, Star, Heart, Volume2, RotateCcw, 
  CheckCircle2, ArrowRight, BookOpen, Award, Compass, 
  Smile, Frown, Coffee, Zap, Palette, Music, Flame, Check
} from 'lucide-react';
import { 
  LINGOKIDS_FRIENDS, LINGOKIDS_LEVELS, LINGOKIDS_STICKERS,
  LingokidsFriend, LingokidsLevel, CollectibleSticker 
} from '../data/lingokidsData';
import { soundFx } from '../utils/audioEffects';

interface LingokidsPlaylearningGameProps {
  daughterName: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  speakPrompt: (text: string) => void;
  onScore: (points: number) => void;
}

type MainTab = 'journey' | 'games' | 'stickers';

export const LingokidsPlaylearningGame: React.FC<LingokidsPlaylearningGameProps> = ({
  daughterName,
  soundEnabled,
  voiceEnabled,
  speakPrompt,
  onScore,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('journey');
  const [selectedFriend, setSelectedFriend] = useState<LingokidsFriend>(LINGOKIDS_FRIENDS[0]);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([1]);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({ 1: 3 });

  // ----------------------------------------------------
  // MINI-GAME 1: HEALTHY PICNIC BASKET
  // ----------------------------------------------------
  const healthyFoods = [
    { id: 'apple', name: 'Apple', tr: 'Elma', emoji: '🍎', healthy: true },
    { id: 'broccoli', name: 'Broccoli', tr: 'Brokoli', emoji: '🥦', healthy: true },
    { id: 'banana', name: 'Banana', tr: 'Muz', emoji: '🍌', healthy: true },
    { id: 'carrot', name: 'Carrot', tr: 'Havuç', emoji: '🥕', healthy: true },
    { id: 'strawberry', name: 'Strawberry', tr: 'Çilek', emoji: '🍓', healthy: true },
    { id: 'donut', name: 'Donut', tr: 'Tatlı Donut', emoji: '🍩', healthy: false },
    { id: 'fries', name: 'Fries', tr: 'Kızartma', emoji: '🍟', healthy: false },
    { id: 'lollipop', name: 'Lollipop', tr: 'Şeker', emoji: '🍭', healthy: false },
  ];
  const [basketItems, setBasketItems] = useState<string[]>([]);
  const [foodFeedback, setFoodFeedback] = useState<string | null>(null);

  // ----------------------------------------------------
  // MINI-GAME 2: MAGIC COLOR MIXING LAB
  // ----------------------------------------------------
  const [selectedColor1, setSelectedColor1] = useState<string | null>(null);
  const [selectedColor2, setSelectedColor2] = useState<string | null>(null);
  const [mixedColorResult, setMixedColorResult] = useState<{
    name: string;
    nameTr: string;
    bgClass: string;
    emoji: string;
  } | null>(null);

  // ----------------------------------------------------
  // MINI-GAME 3: WORD BALLOONS & PHONICS
  // ----------------------------------------------------
  const wordPuzzles = [
    { word: 'CAT', letters: ['C', 'A', 'T'], emoji: '🐱', hint: 'Kedi (Cat)', soundQuote: 'C-A-T! Cat! A cute little kitten!' },
    { word: 'SUN', letters: ['S', 'U', 'N'], emoji: '☀️', hint: 'Güneş (Sun)', soundQuote: 'S-U-N! Sun! Warm golden sunshine!' },
    { word: 'STAR', letters: ['S', 'T', 'A', 'R'], emoji: '⭐', hint: 'Yıldız (Star)', soundQuote: 'S-T-A-R! Star! Sparkling bright in the night sky!' },
    { word: 'BEE', letters: ['B', 'E', 'E'], emoji: '🐝', hint: 'Bal Arısı (Bee)', soundQuote: 'B-E-E! Bee! Busy little honey maker!' },
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [wordComplete, setWordComplete] = useState(false);

  // ----------------------------------------------------
  // MINI-GAME 4: PANDA ELLIOT'S BAMBOO COUNT
  // ----------------------------------------------------
  const [targetBambooCount, setTargetBambooCount] = useState<number>(4);
  const [fedBambooCount, setFedBambooCount] = useState<number>(0);
  const [pandaHappy, setPandaHappy] = useState(false);

  // ----------------------------------------------------
  // MINI-GAME 5: SPARKLING TEETH CARE
  // ----------------------------------------------------
  const [cleanTeeth, setCleanTeeth] = useState<number[]>([]);

  // ----------------------------------------------------
  // MINI-GAME 6: EMOTIONS EXPLORER
  // ----------------------------------------------------
  const emotionQuestions = [
    {
      scenario: 'Billy the Chick just received a surprise birthday present! 🎁',
      scenarioTr: 'Billy sürpriz bir doğum günü hediyesi aldı! Nasıl hissediyor?',
      character: '🐥',
      options: [
        { label: 'Happy & Excited 😊', labelTr: 'Mutlu & Heyecanlı', correct: true },
        { label: 'Sad & Crying 😢', labelTr: 'Üzgün', correct: false },
        { label: 'Sleepy 😴', labelTr: 'Uykulu', correct: false },
      ],
      quote: 'Hooray! Billy is so happy and grateful!'
    },
    {
      scenario: 'Elliot the Panda accidentally dropped his drawing into a puddle! 🎨',
      scenarioTr: 'Elliot güzel resmini yanlışlıkla su birikintisine düşürdü! Nasıl hissediyor?',
      character: '🐼',
      options: [
        { label: 'Sad & Needs a Hug 😢', labelTr: 'Üzgün & Sarılmak İstiyor', correct: true },
        { label: 'Angry & Roaring 😡', labelTr: 'Kızgın', correct: false },
        { label: 'Silly & Giggling 🤪', labelTr: 'Şakacı', correct: false },
      ],
      quote: 'It is okay Elliot, friends help each other and we can draw a new one together!'
    },
    {
      scenario: 'Cobi the Bull practiced running all afternoon and it is time for bed! 🌙',
      scenarioTr: 'Cobi bütün gün spor yaptı ve uyku saati geldi! Nasıl hissediyor?',
      character: '🐂',
      options: [
        { label: 'Sleepy & Peaceful 😴', labelTr: 'Uykulu & Huzurlu', correct: true },
        { label: 'Super Energetic ⚡', labelTr: 'Aşırı Enerjik', correct: false },
        { label: 'Hungry for Pizza 🍕', labelTr: 'Pizza İstiyor', correct: false },
      ],
      quote: 'Yawn! Good night Cobi, sweet dreams!'
    },
  ];
  const [emotionIdx, setEmotionIdx] = useState(0);
  const [emotionAnswered, setEmotionAnswered] = useState(false);

  // ----------------------------------------------------
  // MINI-GAME 7: RECYCLING HERO
  // ----------------------------------------------------
  const recycleItems = [
    { id: 'bottle', name: 'Plastic Bottle', nameTr: 'Plastik Şişe', emoji: '🧴', bin: 'plastic' },
    { id: 'paper', name: 'Newspaper', nameTr: 'Eski Gazete', emoji: '🗞️', bin: 'paper' },
    { id: 'can', name: 'Juice Can', nameTr: 'Metal Kutu', emoji: '🥫', bin: 'metal' },
    { id: 'appleCore', name: 'Apple Core', nameTr: 'Elma Çöpü', emoji: '🍎', bin: 'organic' },
  ];
  const [recycledCount, setRecycledCount] = useState<number>(0);

  // ----------------------------------------------------
  // MINI-GAME 8: MUSIC PARTY JAM
  // ----------------------------------------------------
  const instruments = [
    { id: 'piano-do', note: 'Do', soundNote: 'C5', emoji: '🎹', color: 'bg-red-400' },
    { id: 'piano-re', note: 'Re', soundNote: 'D5', emoji: '🎵', color: 'bg-orange-400' },
    { id: 'piano-mi', note: 'Mi', soundNote: 'E5', emoji: '🔔', color: 'bg-yellow-400' },
    { id: 'piano-fa', note: 'Fa', soundNote: 'F5', emoji: '🥁', color: 'bg-emerald-400' },
    { id: 'piano-sol', note: 'Sol', soundNote: 'G5', emoji: '🎷', color: 'bg-cyan-400' },
    { id: 'piano-la', note: 'La', soundNote: 'A5', emoji: '🎸', color: 'bg-indigo-400' },
    { id: 'piano-ti', note: 'Ti', soundNote: 'B5', emoji: '🎺', color: 'bg-purple-400' },
  ];

  // Helper to mark level complete and give rewards
  const completeLevel = (lvlId: number) => {
    soundFx.playFanfare();
    setLevelStars(prev => ({ ...prev, [lvlId]: 3 }));
    setCompletedLevels(prev => Array.from(new Set([...prev, lvlId, lvlId + 1])));
    onScore(10);
    speakPrompt(`Congratulations ${daughterName}! Level ${lvlId} completed! You earned 3 stars!`);
  };

  // HANDLERS
  const handleFoodClick = (item: typeof healthyFoods[0]) => {
    if (item.healthy) {
      if (!basketItems.includes(item.id)) {
        soundFx.playSuccess();
        const next = [...basketItems, item.id];
        setBasketItems(next);
        setFoodFeedback(`Bravo! ${item.name} (${item.tr}) sepete eklendi!`);
        speakPrompt(`${item.name}! Delicious and full of healthy vitamins!`);
        if (next.length === 5) {
          completeLevel(1);
        }
      }
    } else {
      soundFx.playPop();
      setFoodFeedback(`${item.tr} ara sıra yenir! Sağlıklı taze meyve ve sebzeleri seçelim!`);
      speakPrompt("Sweet treats are for special days! Let us pick healthy foods first!");
    }
  };

  const handleColorPick = (color: string) => {
    soundFx.playBubble();
    if (!selectedColor1) {
      setSelectedColor1(color);
      setMixedColorResult(null);
      speakPrompt(`You selected ${color}! Now pick another color to mix!`);
    } else if (!selectedColor2) {
      setSelectedColor2(color);
      // Determine mix
      const pair = [selectedColor1, color].sort().join('+');
      let result = { name: 'Colorful Wonder', nameTr: 'Gökkuşağı Rengi', bgClass: 'bg-gradient-to-r from-pink-400 to-amber-400', emoji: '✨' };

      if (pair === 'red+yellow') {
        result = { name: 'ORANGE', nameTr: 'Turuncu (Orange)', bgClass: 'bg-orange-500', emoji: '🟠' };
      } else if (pair === 'blue+yellow') {
        result = { name: 'GREEN', nameTr: 'Yeşil (Green)', bgClass: 'bg-emerald-500', emoji: '🟢' };
      } else if (pair === 'blue+red') {
        result = { name: 'PURPLE', nameTr: 'Mor (Purple)', bgClass: 'bg-purple-500', emoji: '🟣' };
      } else if (pair === 'red+white') {
        result = { name: 'PINK', nameTr: 'Pembe (Pink)', bgClass: 'bg-rose-400', emoji: '🌸' };
      }

      setMixedColorResult(result);
      soundFx.playSuccess();
      speakPrompt(`${selectedColor1} and ${color} make ${result.name}! Amazing color mixing!`);
      completeLevel(2);
    } else {
      setSelectedColor1(color);
      setSelectedColor2(null);
      setMixedColorResult(null);
    }
  };

  const handleLetterClick = (letter: string) => {
    const puzzle = wordPuzzles[currentWordIdx];
    const expectedLetter = puzzle.letters[spelledLetters.length];

    if (letter === expectedLetter) {
      soundFx.playBubble();
      const updated = [...spelledLetters, letter];
      setSpelledLetters(updated);
      speakPrompt(letter);

      if (updated.length === puzzle.letters.length) {
        soundFx.playFanfare();
        setWordComplete(true);
        speakPrompt(puzzle.soundQuote);
        completeLevel(3);
      }
    } else {
      soundFx.playPop();
      speakPrompt(`Try letter ${expectedLetter}!`);
    }
  };

  const handleFeedBamboo = () => {
    if (fedBambooCount < targetBambooCount) {
      const next = fedBambooCount + 1;
      setFedBambooCount(next);
      soundFx.playBubble();
      speakPrompt(`${next}! Crunchy bamboo!`);
      if (next === targetBambooCount) {
        setPandaHappy(true);
        soundFx.playFanfare();
        speakPrompt(`Yum yum! Thank you ${daughterName}! Elliot the Panda is full and happy!`);
        completeLevel(4);
      }
    }
  };

  const handleBrushTooth = (toothIdx: number) => {
    if (!cleanTeeth.includes(toothIdx)) {
      soundFx.playBubble();
      const updated = [...cleanTeeth, toothIdx];
      setCleanTeeth(updated);
      speakPrompt("Brush brush brush! Shiny clean!");
      if (updated.length === 6) {
        soundFx.playFanfare();
        speakPrompt(`Sparkling clean smile ${daughterName}! All sugar bugs are gone!`);
        completeLevel(5);
      }
    }
  };

  const handleEmotionSelect = (isCorrect: boolean, quote: string) => {
    if (isCorrect) {
      soundFx.playSuccess();
      setEmotionAnswered(true);
      speakPrompt(quote);
      completeLevel(6);
    } else {
      soundFx.playPop();
      speakPrompt("Let us look closely at their friendly face again!");
    }
  };

  const currentLevelObj = LINGOKIDS_LEVELS.find(l => l.id === currentLevelId) || LINGOKIDS_LEVELS[0];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-3 sm:p-5 shadow-sm flex flex-col w-full">
      
      {/* ---------------------------------------------------- */}
      {/* LINGOKIDS HERO HEADER BAR                            */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-3 border-b border-stone-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 text-white flex items-center justify-center text-2xl shadow-sm shadow-indigo-100 shrink-0">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
              <span>Playlearning™ World</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 font-medium">Lingokids Eğitici Akademi</span>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 flex items-center gap-2">
              <span>{daughterName}'in Lingokids Keşif Dünyası</span>
              <span className="text-[10px] bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-black px-2 py-0.5 rounded-full shadow-2xs">
                Öğren & Oyna
              </span>
            </h3>
          </div>
        </div>

        {/* Lingokids Friends Picker */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-stone-100/80 p-1 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 px-2 hidden sm:inline">Arkadaşın:</span>
          {LINGOKIDS_FRIENDS.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFriend(f);
                soundFx.playPop();
                speakPrompt(f.greeting);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedFriend.id === f.id
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200 scale-105'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title={`${f.name} - ${f.roleTr}`}
            >
              <span>{f.emoji}</span>
              <span className="hidden lg:inline">{f.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3 TOP NAVIGATION TABS (JOURNEY / MINI-GAMES / STICKERS) */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-2 mb-3 bg-sky-50/70 p-1.5 rounded-2xl border border-sky-100 text-xs font-semibold">
        <button
          onClick={() => { setActiveTab('journey'); soundFx.playPop(); }}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'journey'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-sky-900 hover:bg-white/60'
          }`}
        >
          <span>🗺️ Öğrenme Haritası & Seviyeler</span>
        </button>

        <button
          onClick={() => { setActiveTab('games'); soundFx.playPop(); }}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'games'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-sky-900 hover:bg-white/60'
          }`}
        >
          <span>🎮 Eğitici Mini Oyunlar ({LINGOKIDS_LEVELS.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('stickers'); soundFx.playPop(); }}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'stickers'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-sky-900 hover:bg-white/60'
          }`}
        >
          <span>⭐ Çıkartma Albümü ({completedLevels.length}/{LINGOKIDS_STICKERS.length})</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: PLAYLEARNING JOURNEY MAP                      */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'journey' && (
        <div className="flex-1 flex flex-col">
          {/* Stepper Progress Bar */}
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200/80 rounded-2xl p-3 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-sky-950 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Lingokids İlerleme Yolculuğu:</span>
                <span className="text-sky-700 font-extrabold">{completedLevels.length} / {LINGOKIDS_LEVELS.length} Seviye Açık</span>
              </span>
              <span className="font-mono text-xs font-bold text-indigo-700">
                %{Math.round((completedLevels.length / LINGOKIDS_LEVELS.length) * 100)} Tamamlandı
              </span>
            </div>

            {/* Visual Level Nodes on a Winding Path */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {LINGOKIDS_LEVELS.map(lvl => {
                const isCompleted = completedLevels.includes(lvl.id);
                const isCurrent = currentLevelId === lvl.id;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setCurrentLevelId(lvl.id);
                      soundFx.playPop();
                      speakPrompt(`Level ${lvl.id}: ${lvl.title}!`);
                    }}
                    className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative cursor-pointer active:scale-95 ${
                      isCurrent
                        ? 'border-sky-500 bg-white shadow-md ring-2 ring-sky-300 scale-105'
                        : isCompleted
                        ? 'border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/60'
                        : 'border-stone-200 bg-stone-50/80 hover:bg-stone-100 opacity-60'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl block mb-0.5">{lvl.emoji}</span>
                    <span className="text-[10px] font-bold text-stone-900 truncate w-full text-center">
                      Lvl {lvl.id}
                    </span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3].map(st => (
                        <Star 
                          key={st} 
                          className={`w-2.5 h-2.5 ${
                            isCompleted ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Level Spotlight Banner */}
          <div className="bg-white border-2 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-xs mb-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-5xl sm:text-6xl p-3 bg-sky-50 rounded-2xl border border-sky-200 shadow-inner shrink-0">
                {currentLevelObj.emoji}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                    Seviye {currentLevelObj.id} · {currentLevelObj.categoryTr}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Rozet: {currentLevelObj.badgeEmoji} {currentLevelObj.badgeName}
                  </span>
                </div>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  {currentLevelObj.titleTr} ({currentLevelObj.title})
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xl">
                  {currentLevelObj.descTr}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('games');
                  soundFx.playPop();
                  speakPrompt(`Let's play ${currentLevelObj.title}!`);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Hemen Oyna & Yıldız Kazan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: INTERACTIVE MINI-GAMES                        */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'games' || activeTab === 'journey') && (
        <div className="mt-1">
          {/* LEVEL 1: HEALTHY FOOD BASKET */}
          {currentLevelId === 1 && (
            <div className="bg-amber-50/50 border-2 border-amber-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Life Skills · Seviye 1
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🧺 Sağlıklı Piknik Sepetini Dolduralım!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Aşağıdaki yiyeceklerden <strong>sağlıklı vitamin deposu 5 taze besini</strong> seçip sepete koy!
                </p>
              </div>

              {/* Picnic Basket Counter */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-amber-300 rounded-2xl shadow-2xs mb-4">
                <span className="text-2xl">🧺</span>
                <span className="text-xs font-bold text-amber-950">
                  Sepetteki Sağlıklı Besinler: {basketItems.length} / 5
                </span>
                {basketItems.length === 5 && (
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" /> Harika Beslenme!
                  </span>
                )}
              </div>

              {/* Food items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-4">
                {healthyFoods.map(food => {
                  const inBasket = basketItems.includes(food.id);
                  return (
                    <button
                      key={food.id}
                      onClick={() => handleFoodClick(food)}
                      disabled={inBasket}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center active:scale-95 ${
                        inBasket
                          ? 'border-emerald-400 bg-emerald-50 opacity-80'
                          : 'border-stone-200 bg-white hover:border-amber-400 hover:shadow-xs'
                      }`}
                    >
                      <span className="text-4xl block mb-1">{food.emoji}</span>
                      <span className="font-bold text-xs text-stone-900 leading-tight">{food.name}</span>
                      <span className="text-[10px] text-stone-500">{food.tr}</span>
                      {inBasket && (
                        <span className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-0.5">
                          ✓ Sepette
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {foodFeedback && (
                <div className="p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-amber-950 max-w-md mx-auto mb-3">
                  {foodFeedback}
                </div>
              )}

              {basketItems.length === 5 && (
                <button
                  onClick={() => {
                    setCurrentLevelId(2);
                    soundFx.playPop();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <span>2. Seviyeye Geç (Sihirli Renkler)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* LEVEL 2: MAGIC COLOR MIXING LAB */}
          {currentLevelId === 2 && (
            <div className="bg-purple-50/50 border-2 border-purple-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Sanat & Bilim · Seviye 2
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🎨 Sihirli Renk Laboratuvarı!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  İki farklı tüp rengine dokun, karıştır ve ortaya çıkan sihirli rengi keşfet!
                </p>
              </div>

              {/* Mixing Beaker Display */}
              <div className="p-4 bg-white border-2 border-purple-300 rounded-2xl max-w-md mx-auto mb-5 shadow-xs flex items-center justify-center gap-4">
                <div className="text-center">
                  <span className="text-xs font-semibold text-stone-500 block mb-1">1. Renk</span>
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold ${selectedColor1 ? 'border-purple-400 bg-purple-50' : 'border-dashed border-stone-300 text-stone-400'}`}>
                    {selectedColor1 === 'red' ? '🔴' : selectedColor1 === 'yellow' ? '🟡' : selectedColor1 === 'blue' ? '🔵' : selectedColor1 === 'white' ? '⚪' : '?'}
                  </div>
                </div>

                <span className="text-2xl font-bold text-purple-400">+</span>

                <div className="text-center">
                  <span className="text-xs font-semibold text-stone-500 block mb-1">2. Renk</span>
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold ${selectedColor2 ? 'border-purple-400 bg-purple-50' : 'border-dashed border-stone-300 text-stone-400'}`}>
                    {selectedColor2 === 'red' ? '🔴' : selectedColor2 === 'yellow' ? '🟡' : selectedColor2 === 'blue' ? '🔵' : selectedColor2 === 'white' ? '⚪' : '?'}
                  </div>
                </div>

                <span className="text-2xl font-bold text-purple-400">=</span>

                <div className="text-center">
                  <span className="text-xs font-semibold text-stone-500 block mb-1">Sonuç</span>
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold ${mixedColorResult ? `${mixedColorResult.bgClass} text-white shadow-md animate-bounce` : 'border-dashed border-stone-300 text-stone-400'}`}>
                    {mixedColorResult ? mixedColorResult.emoji : '🧪'}
                  </div>
                </div>
              </div>

              {/* Color Palette Choices */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                {[
                  { id: 'red', name: 'Kırmızı (Red)', emoji: '🔴', bg: 'bg-red-500' },
                  { id: 'yellow', name: 'Sarı (Yellow)', emoji: '🟡', bg: 'bg-yellow-400' },
                  { id: 'blue', name: 'Mavi (Blue)', emoji: '🔵', bg: 'bg-blue-500' },
                  { id: 'white', name: 'Beyaz (White)', emoji: '⚪', bg: 'bg-stone-200' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleColorPick(c.id)}
                    className="px-4 py-2 rounded-xl border-2 border-stone-200 bg-white hover:border-purple-400 hover:shadow-xs font-bold text-xs text-stone-800 flex items-center gap-2 active:scale-95"
                  >
                    <span className="text-lg">{c.emoji}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>

              {mixedColorResult && (
                <div className="p-3 bg-white border border-purple-300 rounded-xl max-w-md mx-auto mb-4 animate-in fade-in">
                  <span className="text-xs font-bold text-purple-950 block">
                    ✨ Sihirli Karışım: {mixedColorResult.nameTr}!
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    İki ana rengi birleştirerek yepyeni bir ara renk oluşturdun!
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => { setSelectedColor1(null); setSelectedColor2(null); setMixedColorResult(null); }}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Tüpleri Temizle
                </button>
                {mixedColorResult && (
                  <button
                    onClick={() => { setCurrentLevelId(3); soundFx.playPop(); }}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <span>3. Seviyeye Geç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* LEVEL 3: WORD BALLOONS & PHONICS */}
          {currentLevelId === 3 && (
            <div className="bg-rose-50/50 border-2 border-rose-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Okuma & Kelimeler · Seviye 3
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🎈 Kelime Balonlarını Patlatalım!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Aşağıdaki harf balonlarına doğru sırayla dokunup İngilizce kelimeyi oluştur!
                </p>
              </div>

              {/* Target Word Spotlight */}
              {(() => {
                const puzzle = wordPuzzles[currentWordIdx];
                return (
                  <div className="p-4 bg-white border border-rose-200 rounded-2xl max-w-sm mx-auto mb-5 shadow-xs">
                    <span className="text-5xl block mb-1">{puzzle.emoji}</span>
                    <span className="text-sm font-bold text-stone-800 block mb-2">{puzzle.hint}</span>

                    {/* Word Letter Slots */}
                    <div className="flex items-center justify-center gap-2">
                      {puzzle.letters.map((lettr, idx) => {
                        const isFilled = spelledLetters.length > idx;
                        return (
                          <div
                            key={idx}
                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-display font-black text-xl ${
                              isFilled
                                ? 'border-rose-400 bg-rose-500 text-white shadow-xs animate-in zoom-in-75'
                                : 'border-dashed border-rose-300 text-rose-300 bg-rose-50/40'
                            }`}
                          >
                            {isFilled ? spelledLetters[idx] : '_'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Scrambled Floating Balloons */}
              {!wordComplete ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  {wordPuzzles[currentWordIdx].letters
                    .slice()
                    .reverse()
                    .map((char, i) => (
                      <button
                        key={i}
                        onClick={() => handleLetterClick(char)}
                        className="w-14 h-16 rounded-full bg-gradient-to-t from-rose-500 to-pink-400 hover:from-rose-600 hover:to-pink-500 text-white font-display font-black text-2xl shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center transform hover:-translate-y-1 transition-all"
                      >
                        {char}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl max-w-sm mx-auto mb-4 animate-in fade-in">
                  <span className="text-xs font-bold text-emerald-900 block">
                    🎉 Harika! {wordPuzzles[currentWordIdx].word} kelimesini başarıyla yazdın!
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        setCurrentWordIdx((prev) => (prev + 1) % wordPuzzles.length);
                        setSpelledLetters([]);
                        setWordComplete(false);
                        soundFx.playPop();
                      }}
                      className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold"
                    >
                      Sıradaki Kelimeye Geç 🔄
                    </button>
                    <button
                      onClick={() => { setCurrentLevelId(4); soundFx.playPop(); }}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      4. Seviyeye Geç ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEVEL 4: PANDA ELLIOT'S BAMBOO COUNT */}
          {currentLevelId === 4 && (
            <div className="bg-emerald-50/50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Erken Matematik · Seviye 4
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🎋 Sevimli Panda Elliot'ı Besleyelim!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Elliot acıkmış! Bambu çubuklarına dokunarak tam <strong>{targetBambooCount} adet</strong> çıtır bambu yedir!
                </p>
              </div>

              {/* Panda Character & Count */}
              <div className="p-4 bg-white border-2 border-emerald-300 rounded-2xl max-w-sm mx-auto mb-4 shadow-xs">
                <span className={`text-6xl block mb-2 transition-transform ${pandaHappy ? 'scale-110 animate-bounce' : ''}`}>
                  🐼
                </span>
                <span className="text-sm font-bold text-stone-900 block">
                  Yenilen Bambu: {fedBambooCount} / {targetBambooCount}
                </span>

                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {Array.from({ length: targetBambooCount }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-2xl transition-opacity ${i < fedBambooCount ? 'opacity-100 scale-110' : 'opacity-20'}`}
                    >
                      🎋
                    </span>
                  ))}
                </div>
              </div>

              {!pandaHappy ? (
                <button
                  onClick={handleFeedBamboo}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md active:scale-95 inline-flex items-center gap-2 mb-3"
                >
                  <span>Bambu Yedir (+1) 🎋</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl max-w-sm mx-auto mb-3">
                  <span className="text-xs font-bold text-emerald-950 block">
                    🎋 Elliot çok doydu ve mutlu oldu!
                  </span>
                  <button
                    onClick={() => { setCurrentLevelId(5); soundFx.playPop(); }}
                    className="mt-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                  >
                    <span>5. Seviyeye Geç (Diş Fırçalama)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LEVEL 5: SPARKLING TEETH CARE */}
          {currentLevelId === 5 && (
            <div className="bg-sky-50/50 border-2 border-sky-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Öz Bakım & Sağlık · Seviye 5
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🪥 Işıl Işıl Diş Fırçalama Macerası!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Şeker lekeli dişlerin üzerine dokunarak fırçala ve pırıl pırıl parlat!
                </p>
              </div>

              {/* Tooth Canvas */}
              <div className="p-5 bg-white border-2 border-sky-300 rounded-3xl max-w-md mx-auto mb-4 shadow-xs">
                <span className="text-4xl block mb-2">😀</span>
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6].map(tooth => {
                    const isClean = cleanTeeth.includes(tooth);
                    return (
                      <button
                        key={tooth}
                        onClick={() => handleBrushTooth(tooth)}
                        className={`h-16 rounded-2xl border-2 transition-all flex flex-col items-center justify-center active:scale-95 ${
                          isClean
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-600 shadow-2xs'
                            : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        <span className="text-2xl">{isClean ? '✨' : '👾'}</span>
                        <span className="text-[10px] font-bold mt-0.5">{isClean ? 'Temiz!' : 'Fırçala!'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {cleanTeeth.length === 6 && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl max-w-sm mx-auto mb-3">
                  <span className="text-xs font-bold text-emerald-950 block">
                    ✨ Bembeyaz ışıldayan bir gülümseme kazandın!
                  </span>
                  <button
                    onClick={() => { setCurrentLevelId(6); soundFx.playPop(); }}
                    className="mt-2 px-4 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                  >
                    <span>6. Seviyeye Geç (Duygular)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LEVEL 6: EMOTIONS EXPLORER */}
          {currentLevelId === 6 && (
            <div className="bg-pink-50/50 border-2 border-pink-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-pink-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Sosyal & Duygusal Zeka · Seviye 6
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  💖 Duygularımızı Tanıyalım!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Hikayeyi dinle ve arkadaşımızın nasıl hissettiğini bul!
                </p>
              </div>

              {/* Scenario Box */}
              {(() => {
                const item = emotionQuestions[emotionIdx];
                return (
                  <div className="p-5 bg-white border-2 border-pink-300 rounded-2xl max-w-md mx-auto mb-4 shadow-xs">
                    <span className="text-5xl block mb-2">{item.character}</span>
                    <p className="text-sm font-bold text-stone-900 mb-1 leading-snug">
                      "{item.scenario}"
                    </p>
                    <p className="text-xs text-stone-500 mb-4">
                      {item.scenarioTr}
                    </p>

                    {/* Choices */}
                    <div className="space-y-2">
                      {item.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleEmotionSelect(opt.correct, item.quote)}
                          className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-pink-400 hover:bg-pink-50/50 text-left flex items-center justify-between text-xs font-bold text-stone-800 transition-all active:scale-98"
                        >
                          <span>{opt.label}</span>
                          <span className="text-[11px] text-stone-400 font-normal">{opt.labelTr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {emotionAnswered && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEmotionIdx((prev) => (prev + 1) % emotionQuestions.length);
                      setEmotionAnswered(false);
                      soundFx.playPop();
                    }}
                    className="px-3.5 py-1.5 bg-white border border-pink-300 text-pink-900 text-xs font-bold rounded-xl"
                  >
                    Başka Bir Duygu Keşfet 🔄
                  </button>
                  <button
                    onClick={() => { setCurrentLevelId(7); soundFx.playPop(); }}
                    className="px-4 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1"
                  >
                    <span>7. Seviyeye Geç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LEVEL 7: RECYCLING HERO */}
          {currentLevelId === 7 && (
            <div className="bg-teal-50/50 border-2 border-teal-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Çevre Bilinci · Seviye 7
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  ♻️ Temiz Gezegen & Geri Dönüşüm!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Atıklara dokunarak doğru geri dönüşüm kutularına ayıralım!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-4">
                {recycleItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundFx.playBubble();
                      setRecycledCount(r => {
                        const next = r + 1;
                        if (next >= 4) completeLevel(7);
                        return next;
                      });
                      speakPrompt(`Great job recycling the ${item.name}!`);
                    }}
                    className="p-3 bg-white border border-teal-200 hover:border-teal-400 rounded-2xl flex flex-col items-center justify-center active:scale-95 shadow-xs"
                  >
                    <span className="text-4xl block mb-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-stone-900">{item.name}</span>
                    <span className="text-[10px] text-teal-700 font-semibold">{item.nameTr}</span>
                  </button>
                ))}
              </div>

              {recycledCount >= 4 && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl max-w-sm mx-auto mb-3">
                  <span className="text-xs font-bold text-emerald-950 block">
                    🌍 Harika! Doğayı koruyan bir Çevre Kahramanısın!
                  </span>
                  <button
                    onClick={() => { setCurrentLevelId(8); soundFx.playPop(); }}
                    className="mt-2 px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                  >
                    <span>8. Seviyeye Geç (Müzik Partisi)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LEVEL 8: MUSIC PARTY JAM */}
          {currentLevelId === 8 && (
            <div className="bg-indigo-50/50 border-2 border-indigo-200 rounded-3xl p-4 sm:p-6 text-center">
              <div className="max-w-xl mx-auto mb-4">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-0.5">
                  Lingokids Ritim & Sanat · Seviye 8
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  🎵 Neşeli Müzik Partisi!
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Rengarenk tuşlara dokun, kendi melodini çal ve müzik ritmine katıl!
                </p>
              </div>

              {/* Musical Keys */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-lg mx-auto mb-4">
                {instruments.map(inst => (
                  <button
                    key={inst.id}
                    onClick={() => {
                      soundFx.playBubble();
                      completeLevel(8);
                    }}
                    className={`w-14 sm:w-16 h-24 rounded-2xl ${inst.color} text-white font-bold flex flex-col items-center justify-between p-2 shadow-md hover:shadow-xl active:scale-95 transition-all cursor-pointer`}
                  >
                    <span className="text-xl">{inst.emoji}</span>
                    <span className="text-sm font-black">{inst.note}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-white border border-indigo-200 rounded-xl max-w-sm mx-auto">
                <span className="text-xs font-bold text-indigo-950 block">
                  🎉 Tebrikler {daughterName}! Tüm 8 Lingokids seviyesini tamamladın!
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: STICKER BOOK / PASSPORT                       */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'stickers' && (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
              Lingokids Başarı Koleksiyonu
            </span>
            <h4 className="font-display font-bold text-lg sm:text-xl text-stone-900">
              {daughterName}'in Çıkartma Defteri ({completedLevels.length} / {LINGOKIDS_STICKERS.length} Açık) ⭐
            </h4>
            <p className="text-xs text-stone-500">
              Oyunları ve seviyeleri bitirdikçe yeni çıkartmaların kilidi açılır. Dokunarak sesini dinle!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {LINGOKIDS_STICKERS.map(stk => {
              const isUnlocked = completedLevels.length >= stk.levelRequired;
              return (
                <button
                  key={stk.id}
                  onClick={() => {
                    if (isUnlocked) {
                      soundFx.playFanfare();
                      speakPrompt(`Sticker unlocked! ${stk.name}! ${stk.descTr}`);
                    } else {
                      soundFx.playPop();
                      speakPrompt(`Complete Level ${stk.levelRequired} to unlock this sticker!`);
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center relative ${
                    isUnlocked
                      ? 'border-amber-300 bg-amber-50/60 shadow-xs hover:scale-105'
                      : 'border-stone-200 bg-stone-50 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-4xl block mb-1">{isUnlocked ? stk.emoji : '🔒'}</span>
                  <span className="font-bold text-xs text-stone-900 leading-tight">
                    {stk.nameTr}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    {isUnlocked ? 'Kazanıldı ✓' : `${stk.levelRequired}. Seviye`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lingokids Character Mascot Banner Footer */}
      <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedFriend.emoji}</span>
          <span className="text-stone-700 font-semibold">
            {selectedFriend.name}: "{selectedFriend.bioTr}"
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
          <span>Playlearning™ Kids Pre-K 4.5+</span>
        </div>
      </div>

    </div>
  );
};
