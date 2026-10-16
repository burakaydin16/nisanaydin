import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RotateCcw, HelpCircle, Trophy, Globe, 
  Search, CheckCircle2, Volume2, ArrowRight, BookOpen,
  Award, Shuffle, Star, Heart, Compass
} from 'lucide-react';
import { 
  MASTER_SAFARI_ANIMALS, SAFARI_HABITATS, 
  SafariAnimal, SafariHabitat 
} from '../data/animalsData';
import { soundFx } from '../utils/audioEffects';

interface AnimalSafariGameProps {
  daughterName: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  speakPrompt: (text: string) => void;
  onScore: (points: number) => void;
}

type SafariSubMode = 'memory' | 'habitat' | 'riddle' | 'encyclopedia';
type DeckPairCount = 4 | 6 | 8;
type HabitatFilter = 'all' | 'savannah' | 'ocean' | 'forest' | 'polar' | 'jungle' | 'garden';

interface MemoryCard {
  cardId: number;
  animal: SafariAnimal;
  flipped: boolean;
  matched: boolean;
}

export const AnimalSafariGame: React.FC<AnimalSafariGameProps> = ({
  daughterName,
  soundEnabled,
  voiceEnabled,
  speakPrompt,
  onScore,
}) => {
  const [subMode, setSubMode] = useState<SafariSubMode>('memory');

  // --- MEMORY MATCH STATES ---
  const [habitatFilter, setHabitatFilter] = useState<HabitatFilter>('all');
  const [pairCount, setPairCount] = useState<DeckPairCount>(4);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [pairsCompleted, setPairsCompleted] = useState(0);
  const [matchedAnimalsHistory, setMatchedAnimalsHistory] = useState<string[]>([]);
  const [lastMatchedAnimal, setLastMatchedAnimal] = useState<SafariAnimal | null>(null);

  // --- HABITAT MATCH STATES ---
  const [habitatCurrentAnimal, setHabitatCurrentAnimal] = useState<SafariAnimal>(MASTER_SAFARI_ANIMALS[0]);
  const [habitatOptions, setHabitatOptions] = useState<SafariHabitat[]>([]);
  const [habitatFeedback, setHabitatFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [habitatStreak, setHabitatStreak] = useState(0);

  // --- RIDDLE DETECTIVE STATES ---
  const [riddleAnimal, setRiddleAnimal] = useState<SafariAnimal>(MASTER_SAFARI_ANIMALS[1]);
  const [riddleOptions, setRiddleOptions] = useState<SafariAnimal[]>([]);
  const [riddleFeedback, setRiddleFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [riddleStreak, setRiddleStreak] = useState(0);

  // --- ENCYCLOPEDIA STATES ---
  const [selectedAnimalDetail, setSelectedAnimalDetail] = useState<SafariAnimal | null>(null);
  const [encyclopediaHabitat, setEncyclopediaHabitat] = useState<HabitatFilter>('all');

  // Helper: Get filtered pool of animals
  const getFilteredAnimals = (filter: HabitatFilter): SafariAnimal[] => {
    if (filter === 'all') return MASTER_SAFARI_ANIMALS;
    return MASTER_SAFARI_ANIMALS.filter(a => a.habitatId === filter);
  };

  // Initialize Memory Game with selected combinations (habitat & pair count)
  const initMemoryGame = (
    currentFilter = habitatFilter, 
    currentPairCount = pairCount
  ) => {
    let pool = getFilteredAnimals(currentFilter);
    // If pool has fewer items than pairCount, fallback to all
    if (pool.length < currentPairCount) {
      pool = MASTER_SAFARI_ANIMALS;
    }

    // Shuffle and pick pairCount animals
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffledPool.slice(0, currentPairCount);

    const deck: MemoryCard[] = [];
    let count = 1;
    picked.forEach(animal => {
      deck.push({ cardId: count++, animal, flipped: false, matched: false });
      deck.push({ cardId: count++, animal, flipped: false, matched: false });
    });

    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setPairsCompleted(0);
    setLastMatchedAnimal(null);

    if (soundEnabled && voiceEnabled) {
      speakPrompt("Match the animal pairs! Discover their habitats!");
    }
  };

  // Initialize Habitat Match Game
  const initHabitatRound = () => {
    const randomAnimal = MASTER_SAFARI_ANIMALS[Math.floor(Math.random() * MASTER_SAFARI_ANIMALS.length)];
    setHabitatCurrentAnimal(randomAnimal);
    setHabitatFeedback('idle');

    // Create 4 habitat options: 1 correct, 3 distinct wrong
    const correctHabitat = SAFARI_HABITATS.find(h => h.id === randomAnimal.habitatId)!;
    const otherHabitats = SAFARI_HABITATS.filter(h => h.id !== randomAnimal.habitatId).sort(() => 0.5 - Math.random()).slice(0, 3);
    const combinedHabitats = [correctHabitat, ...otherHabitats].sort(() => 0.5 - Math.random());
    setHabitatOptions(combinedHabitats);

    if (soundEnabled && voiceEnabled) {
      speakPrompt(`Where does the ${randomAnimal.name} live?`);
    }
  };

  // Initialize Riddle Quiz Round
  const initRiddleRound = () => {
    const randomAnimal = MASTER_SAFARI_ANIMALS[Math.floor(Math.random() * MASTER_SAFARI_ANIMALS.length)];
    setRiddleAnimal(randomAnimal);
    setRiddleFeedback('idle');

    // Create 3 animal options: 1 correct, 2 distractors
    const distractors = MASTER_SAFARI_ANIMALS.filter(a => a.id !== randomAnimal.id).sort(() => 0.5 - Math.random()).slice(0, 2);
    const combined = [randomAnimal, ...distractors].sort(() => 0.5 - Math.random());
    setRiddleOptions(combined);

    if (soundEnabled && voiceEnabled) {
      speakPrompt(randomAnimal.clueRiddle);
    }
  };

  // Run on mount or submode change
  useEffect(() => {
    if (subMode === 'memory') {
      initMemoryGame(habitatFilter, pairCount);
    } else if (subMode === 'habitat') {
      initHabitatRound();
    } else if (subMode === 'riddle') {
      initRiddleRound();
    }
  }, [subMode]);

  // Card Flip Handler for Memory Match
  const handleFlipCard = (cardId: number) => {
    if (flippedIds.length === 2) return;
    const target = cards.find(c => c.cardId === cardId);
    if (!target || target.flipped || target.matched) return;

    soundFx.playPop();
    const updated = cards.map(c => c.cardId === cardId ? { ...c, flipped: true } : c);
    setCards(updated);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const first = cards.find(c => c.cardId === newFlipped[0]);
      const second = cards.find(c => c.cardId === newFlipped[1]);

      if (first && second && first.animal.id === second.animal.id) {
        soundFx.playSuccess();
        const matchedAnimal = first.animal;
        setLastMatchedAnimal(matchedAnimal);
        setMatchedAnimalsHistory(prev => Array.from(new Set([...prev, matchedAnimal.id])));

        speakPrompt(`Great match! ${matchedAnimal.name}! ${matchedAnimal.soundQuote}`);

        setTimeout(() => {
          setCards(prev => prev.map(c => c.animal.id === matchedAnimal.id ? { ...c, matched: true } : c));
          setFlippedIds([]);
          setPairsCompleted(p => {
            const next = p + 1;
            onScore(2);
            if (next === pairCount) {
              soundFx.playSuccess();
              speakPrompt(`Incredible ${daughterName}! You completed all ${pairCount} animal pairs! You are a Safari Master!`);
              onScore(5);
            }
            return next;
          });
        }, 700);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.cardId) ? { ...c, flipped: false } : c));
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  // Habitat Guess Handler
  const handleHabitatSelect = (habitatId: string) => {
    if (habitatFeedback === 'correct') return;

    if (habitatId === habitatCurrentAnimal.habitatId) {
      soundFx.playSuccess();
      setHabitatFeedback('correct');
      setHabitatStreak(s => s + 1);
      onScore(3);
      speakPrompt(`Correct! ${habitatCurrentAnimal.name} lives in the ${habitatCurrentAnimal.habitatName}! ${habitatCurrentAnimal.soundQuote}`);
    } else {
      soundFx.playPop();
      setHabitatFeedback('wrong');
      speakPrompt(`Not quite! Let's think, where does the ${habitatCurrentAnimal.name} feel most at home?`);
    }
  };

  // Riddle Guess Handler
  const handleRiddleSelect = (guessedAnimalId: string) => {
    if (riddleFeedback === 'correct') return;

    if (guessedAnimalId === riddleAnimal.id) {
      soundFx.playSuccess();
      setRiddleFeedback('correct');
      setRiddleStreak(s => s + 1);
      onScore(3);
      speakPrompt(`Bravo ${daughterName}! It is the ${riddleAnimal.name}! ${riddleAnimal.soundQuote}`);
    } else {
      soundFx.playPop();
      setRiddleFeedback('wrong');
      speakPrompt("Listen closely to the clue and try another friendly animal!");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-8 shadow-sm">
      
      {/* Safari Title & Sub-mode Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-stone-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Animal Safari Discovery Lab • 28 Hayvan & 6 Habitat</span>
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
            <span>🦁 Animal Safari & Doğa Keşfi</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              Yeni Kombinasyonlar
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Farklı zorluk dereceleri, yaşam alanı filtreleri, bilmeceler ve interaktif sesli hayvan atlası ile zenginleştirilmiş öğrenme alanı.
          </p>
        </div>

        {/* Sub-mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setSubMode('memory')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              subMode === 'memory'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🧩 Hafıza Kartları</span>
          </button>
          <button
            onClick={() => setSubMode('habitat')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              subMode === 'habitat'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🌍 Yaşam Alanı Bul</span>
          </button>
          <button
            onClick={() => setSubMode('riddle')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              subMode === 'riddle'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🔍 Bilmece Dedektifi</span>
          </button>
          <button
            onClick={() => setSubMode('encyclopedia')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              subMode === 'encyclopedia'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>📖 Safari Atlası (28)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SAFARI MEMORY MATCH (WITH VARIETY & COMBINATIONS)     */}
      {/* ======================================================== */}
      {subMode === 'memory' && (
        <div>
          {/* Combinations Toolbar */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Habitat Combination Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1 mr-1">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span>Habitat / Bölge:</span>
              </span>
              {(
                [
                  { id: 'all', label: '🌍 Tüm Habitats', emoji: '🌍' },
                  { id: 'savannah', label: '🌾 Savana', emoji: '🦁' },
                  { id: 'ocean', label: '🌊 Okyanus', emoji: '🐬' },
                  { id: 'forest', label: '🌲 Orman', emoji: '🦉' },
                  { id: 'polar', label: '❄️ Kutup', emoji: '🐧' },
                  { id: 'jungle', label: '🌴 Yağmur Ormanı', emoji: '🐯' },
                  { id: 'garden', label: '🌸 Çiçek Bahçesi', emoji: '🦋' },
                ] as const
              ).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setHabitatFilter(item.id);
                    initMemoryGame(item.id, pairCount);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                    habitatFilter === item.id
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-white/80 text-stone-700 hover:bg-white border border-amber-200/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Pair Count / Difficulty Combination */}
            <div className="flex items-center gap-2 self-start md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-amber-200/50">
              <span className="text-xs font-bold text-amber-950">Kart Çeşidi:</span>
              {(
                [
                  { count: 4, label: '4 Çift (8 Kart)' },
                  { count: 6, label: '6 Çift (12 Kart)' },
                  { count: 8, label: '8 Çift (16 Kart)' },
                ] as const
              ).map(item => (
                <button
                  key={item.count}
                  onClick={() => {
                    setPairCount(item.count);
                    initMemoryGame(habitatFilter, item.count);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pairCount === item.count
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Stats & Progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">Tamamlanan Çiftler:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                {pairsCompleted} / {pairCount}
              </span>
              {pairsCompleted === pairCount && (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold animate-bounce">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Harika Başarı!
                </span>
              )}
            </div>

            <button
              onClick={() => initMemoryGame(habitatFilter, pairCount)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kartları Yeniden Karıştır</span>
            </button>
          </div>

          {/* Dynamic Grid: 4 columns on mobile, adapts to 4-8 pairs */}
          <div className={`grid gap-3 sm:gap-4 max-w-3xl mx-auto mb-6 ${
            pairCount === 4 
              ? 'grid-cols-2 sm:grid-cols-4' 
              : pairCount === 6 
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
              : 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4'
          }`}>
            {cards.map(card => {
              const isShowing = card.flipped || card.matched;
              return (
                <button
                  key={card.cardId}
                  onClick={() => handleFlipCard(card.cardId)}
                  disabled={card.matched}
                  className={`h-32 sm:h-36 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 relative active:scale-95 ${
                    card.matched
                      ? 'border-emerald-300 bg-emerald-50/80 shadow-xs'
                      : isShowing
                      ? 'border-amber-400 bg-white shadow-md ring-2 ring-amber-100'
                      : 'border-stone-200 bg-gradient-to-b from-amber-50/60 to-orange-50/40 hover:border-amber-300 shadow-2xs hover:shadow-sm'
                  }`}
                >
                  {isShowing ? (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl sm:text-5xl block mb-1 transform transition-transform hover:scale-110">
                        {card.animal.emoji}
                      </span>
                      <span className="text-xs font-bold text-stone-900 leading-tight">
                        {card.animal.name}
                      </span>
                      <span className="text-[10px] text-stone-600 font-medium">
                        {card.animal.turkishName}
                      </span>
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md mt-0.5 border border-amber-200/50">
                        {card.animal.habitatTurkish}
                      </span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center shadow-inner">
                      <HelpCircle className="w-6 h-6 text-amber-700/60" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Last Matched Animal Card Spotlight */}
          {lastMatchedAnimal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-white rounded-2xl border border-emerald-200 shadow-xs">
                  {lastMatchedAnimal.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-950 text-sm">
                      {lastMatchedAnimal.name} ({lastMatchedAnimal.turkishName})
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      {lastMatchedAnimal.habitatTurkish}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900/80 mt-0.5">
                    "{lastMatchedAnimal.funFactTr}"
                  </p>
                </div>
              </div>

              {soundEnabled && voiceEnabled && (
                <button
                  onClick={() => speakPrompt(`${lastMatchedAnimal.name}. ${lastMatchedAnimal.soundQuote}`)}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-auto shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sesi Dinle</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HABITAT MATCH: "WHERE DO I LIVE?"                     */}
      {/* ======================================================== */}
      {subMode === 'habitat' && (
        <div className="text-center py-2 max-w-2xl mx-auto">
          
          {/* Header prompt */}
          <div className="mb-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Doğal Yaşam Alanı Eşleştirme
            </span>
            <h4 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              Bu Sevimli Hayvan Nerede Yaşar? 🌍
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Hayvanı incele ve doğru doğal habitat kartına dokun!
            </p>
          </div>

          {/* Animal Spotlight Card */}
          <div className="bg-gradient-to-b from-amber-50/80 to-yellow-50/40 border-2 border-amber-200 rounded-3xl p-6 mb-8 max-w-md mx-auto shadow-xs">
            <span className="text-6xl sm:text-7xl block mb-2 animate-bounce">
              {habitatCurrentAnimal.emoji}
            </span>
            <h5 className="font-display font-bold text-2xl text-stone-900">
              {habitatCurrentAnimal.name}
            </h5>
            <span className="text-sm font-semibold text-stone-500 block mb-2">
              {habitatCurrentAnimal.turkishName}
            </span>
            <p className="text-xs text-stone-600 italic bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
              "{habitatCurrentAnimal.soundQuote}"
            </p>

            {soundEnabled && voiceEnabled && (
              <button
                onClick={() => speakPrompt(`Where does the ${habitatCurrentAnimal.name} live?`)}
                className="mt-3 px-3 py-1 bg-white hover:bg-stone-50 rounded-lg text-xs font-semibold text-amber-800 border border-amber-200 inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>İngilizce Dinle</span>
              </button>
            )}
          </div>

          {/* 4 Habitat Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {habitatOptions.map(habitat => {
              const isSelected = habitatFeedback === 'correct' && habitat.id === habitatCurrentAnimal.habitatId;
              return (
                <button
                  key={habitat.id}
                  onClick={() => handleHabitatSelect(habitat.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex items-center gap-3.5 active:scale-98 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 shadow-md'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <span className="text-3xl p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                    {habitat.emoji}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-stone-900 text-sm block">
                      {habitat.turkishName}
                    </span>
                    <span className="text-xs text-stone-500 font-medium block">
                      {habitat.name}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {habitatFeedback === 'correct' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Mükemmel! Doğru Cevap!</span>
              </div>
              <p className="text-xs text-emerald-800 max-w-md mx-auto mb-3">
                {habitatCurrentAnimal.funFactTr}
              </p>
              <button
                onClick={initHabitatRound}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Sıradaki Sevimli Hayvana Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : habitatFeedback === 'wrong' ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
              <span>Tekrar dene! Bu hayvan nerede yüzüyor veya koşuyor olabilir?</span>
            </div>
          ) : (
            <button
              onClick={initHabitatRound}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Başka Hayvan Getir</span>
            </button>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. RIDDLE DETECTIVE: "WHO AM I?"                         */}
      {/* ======================================================== */}
      {subMode === 'riddle' && (
        <div className="text-center py-2 max-w-2xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Akıllı İpuçları & Hayvan Bilmeceleri
            </span>
            <h4 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              Ben Kimim? Bilmeceyi Çöz! 🔍
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              İpucunu oku veya dinle, hangi hayvan olduğunu tahmin et!
            </p>
          </div>

          {/* Clue Riddle Box */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-6 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-inner">
              ?
            </div>

            <p className="text-base sm:text-lg font-serif italic text-stone-900 mb-2 leading-relaxed">
              "{riddleAnimal.clueRiddle}"
            </p>
            <p className="text-xs text-stone-500 mb-4">
              (Türkçe İpucu: {riddleAnimal.clueRiddleTr})
            </p>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-semibold bg-white/90 border border-amber-200 px-3 py-1 rounded-full text-amber-900">
                Habitat: {riddleAnimal.habitatTurkish}
              </span>
              <span className="text-[11px] font-semibold bg-white/90 border border-amber-200 px-3 py-1 rounded-full text-stone-700">
                Beslenme: {riddleAnimal.diet}
              </span>
              {soundEnabled && voiceEnabled && (
                <button
                  onClick={() => speakPrompt(riddleAnimal.clueRiddle)}
                  className="px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Seslendir</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Animal Candidates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {riddleOptions.map(option => {
              const isSelected = riddleFeedback === 'correct' && option.id === riddleAnimal.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleRiddleSelect(option.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center active:scale-95 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 shadow-md'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <span className="text-5xl block mb-2">
                    {option.emoji}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    {option.name}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {option.turkishName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {riddleFeedback === 'correct' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-center gap-2 text-emerald-950 font-bold text-sm mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Harikasın {daughterName}! Doğru Hayvanı Buldun!</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3">
                {riddleAnimal.funFactTr}
              </p>
              <button
                onClick={initRiddleRound}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Yeni Bir Bilmeceye Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : riddleFeedback === 'wrong' ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
              <span>İpucunu tekrar oku ve bir daha dene!</span>
            </div>
          ) : (
            <button
              onClick={initRiddleRound}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Başka Bilmece Göster</span>
            </button>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SAFARI ENCYCLOPEDIA & AUDIO ATLAS (ALL 28 ANIMALS)    */}
      {/* ======================================================== */}
      {subMode === 'encyclopedia' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                Safari Saha Rehberi & Hayvan Atlası
              </span>
              <h4 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                Tüm Safari Hayvanları ({MASTER_SAFARI_ANIMALS.length} Canlı) 📖
              </h4>
              <p className="text-xs text-stone-500">
                Herhangi bir karta dokunarak sesini, yaşam alanını ve eğlenceli bilgilerini keşfet.
              </p>
            </div>

            {/* Habitat filter pills */}
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: 'all', label: 'Tümü' },
                  { id: 'savannah', label: '🌾 Savana' },
                  { id: 'ocean', label: '🌊 Okyanus' },
                  { id: 'forest', label: '🌲 Orman' },
                  { id: 'polar', label: '❄️ Kutup' },
                  { id: 'jungle', label: '🌴 Yağmur Ormanı' },
                  { id: 'garden', label: '🌸 Bahçe' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setEncyclopediaHabitat(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    encyclopediaHabitat === tab.id
                      ? 'bg-amber-600 text-white shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 28 Animals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {getFilteredAnimals(encyclopediaHabitat).map(animal => {
              const isSelected = selectedAnimalDetail?.id === animal.id;
              const hasBeenMatched = matchedAnimalsHistory.includes(animal.id);

              return (
                <button
                  key={animal.id}
                  onClick={() => {
                    setSelectedAnimalDetail(animal);
                    if (soundEnabled && voiceEnabled) {
                      speakPrompt(`${animal.name}. ${animal.soundQuote}`);
                    }
                  }}
                  className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center relative active:scale-95 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-200 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/20'
                  }`}
                >
                  {hasBeenMatched && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl block mb-1">
                    {animal.emoji}
                  </span>
                  <span className="font-bold text-stone-900 text-xs block leading-tight">
                    {animal.name}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    {animal.turkishName}
                  </span>
                  <span className="text-[9px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded mt-1 border border-amber-200/40">
                    {animal.habitatTurkish}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Animal Modal/Card */}
          {selectedAnimalDetail && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50 border-2 border-amber-300 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm animate-in fade-in">
              <span className="text-6xl sm:text-7xl p-4 bg-white rounded-3xl border border-amber-200 shadow-xs shrink-0">
                {selectedAnimalDetail.emoji}
              </span>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <h5 className="font-display font-bold text-2xl text-stone-900">
                    {selectedAnimalDetail.name}
                  </h5>
                  <span className="text-base font-semibold text-stone-600">
                    ({selectedAnimalDetail.turkishName})
                  </span>
                  <span className="text-xs bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedAnimalDetail.habitatTurkish}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 font-medium mb-2 leading-relaxed">
                  💡 {selectedAnimalDetail.funFactTr}
                </p>

                <p className="text-xs text-stone-500 italic mb-4 bg-white/70 p-2 rounded-xl border border-amber-200/50">
                  English fact: "{selectedAnimalDetail.funFactEn}"
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-xs font-semibold text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    Beslenme: {selectedAnimalDetail.diet}
                  </span>
                  {soundEnabled && voiceEnabled && (
                    <button
                      onClick={() => speakPrompt(`${selectedAnimalDetail.name}. ${selectedAnimalDetail.soundQuote}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>İngilizce Telaffuz ve Cümleyi Dinle</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safari Explorer Footer Stats */}
      <div className="mt-8 pt-4 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <span>
            Keşfedilen Hayvan Çiftleri: <strong>{matchedAnimalsHistory.length} / {MASTER_SAFARI_ANIMALS.length}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-stone-500">
          <span>🌾 Savana</span>
          <span>·</span>
          <span>🌊 Okyanus</span>
          <span>·</span>
          <span>🌲 Orman</span>
          <span>·</span>
          <span>❄️ Kutup</span>
          <span>·</span>
          <span>🌴 Yağmur Ormanı</span>
          <span>·</span>
          <span>🌸 Çiçek Bahçesi</span>
        </div>
      </div>

    </div>
  );
};
