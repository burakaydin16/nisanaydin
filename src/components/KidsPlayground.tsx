import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Volume2, VolumeX, RotateCcw, Award, Heart, 
  Circle, Square, Triangle, Star, Smile, RefreshCw, Palette, 
  Check, ArrowRight, Music, HelpCircle, Volume1, Trophy, Zap
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { AnimalSafariGame } from './AnimalSafariGame';

interface KidsPlaygroundProps {
  daughterName: string;
}

type GameMode = 'phonics' | 'patterns' | 'counting' | 'shapes' | 'animals';

export const KidsPlayground: React.FC<KidsPlaygroundProps> = ({ daughterName }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('animals');
  // Sound is enabled by default in the game room as requested
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [score, setScore] = useState(0);

  // Sync sound settings
  useEffect(() => {
    soundFx.soundEnabled = soundEnabled;
    if (!soundEnabled) {
      soundFx.muteAll();
    }
  }, [soundEnabled]);

  useEffect(() => {
    soundFx.voiceEnabled = voiceEnabled;
    if (!voiceEnabled) {
      soundFx.muteAll();
    }
  }, [voiceEnabled]);

  // Clean up and ensure silence whenever user leaves or navigates away
  useEffect(() => {
    return () => {
      soundFx.muteAll();
    };
  }, []);

  const speakPrompt = (text: string) => {
    if (!soundEnabled || !voiceEnabled) return;
    soundFx.speak(text, 'en-US');
  };

  // ----------------------------------------------------
  // GAME 1: PHONICS & FIRST LETTER SOUNDS (Age 4.5 Pre-K)
  // ----------------------------------------------------
  const phonicsList = [
    {
      letter: 'B',
      phonics: '/b/ /b/',
      word: 'Bear',
      emoji: '🐻',
      options: [
        { word: 'Bear', emoji: '🐻', correct: true },
        { word: 'Apple', emoji: '🍎', correct: false },
        { word: 'Car', emoji: '🚗', correct: false },
      ]
    },
    {
      letter: 'S',
      phonics: '/s/ /s/',
      word: 'Sun',
      emoji: '☀️',
      options: [
        { word: 'Fish', emoji: '🐠', correct: false },
        { word: 'Sun', emoji: '☀️', correct: true },
        { word: 'Dog', emoji: '🐶', correct: false },
      ]
    },
    {
      letter: 'D',
      phonics: '/d/ /d/',
      word: 'Dolphin',
      emoji: '🐬',
      options: [
        { word: 'Dolphin', emoji: '🐬', correct: true },
        { word: 'Cat', emoji: '🐱', correct: false },
        { word: 'Banana', emoji: '🍌', correct: false },
      ]
    },
    {
      letter: 'L',
      phonics: '/l/ /l/',
      word: 'Lion',
      emoji: '🦁',
      options: [
        { word: 'Hat', emoji: '👒', correct: false },
        { word: 'Tree', emoji: '🌳', correct: false },
        { word: 'Lion', emoji: '🦁', correct: true },
      ]
    },
    {
      letter: 'A',
      phonics: '/æ/ /æ/',
      word: 'Astronaut',
      emoji: '🚀',
      options: [
        { word: 'Astronaut', emoji: '🚀', correct: true },
        { word: 'Duck', emoji: '🦆', correct: false },
        { word: 'Pizza', emoji: '🍕', correct: false },
      ]
    },
    {
      letter: 'M',
      phonics: '/m/ /m/',
      word: 'Moon',
      emoji: '🌙',
      options: [
        { word: 'Flower', emoji: '🌸', correct: false },
        { word: 'Moon', emoji: '🌙', correct: true },
        { word: 'Robot', emoji: '🤖', correct: false },
      ]
    },
  ];

  const [phonicsIndex, setPhonicsIndex] = useState(0);
  const [phonicsFeedback, setPhonicsFeedback] = useState<string | null>(null);

  const currentPhonics = phonicsList[phonicsIndex];

  useEffect(() => {
    if (activeGame === 'phonics') {
      speakPrompt(`Which word starts with letter ${currentPhonics.letter}?`);
    }
  }, [phonicsIndex, activeGame]);

  const handleSelectPhonics = (opt: { word: string; emoji: string; correct: boolean }) => {
    if (opt.correct) {
      soundFx.playSuccess();
      speakPrompt(`Super job ${daughterName}! Letter ${currentPhonics.letter} is for ${opt.word}!`);
      setPhonicsFeedback(`Brilliant! ${currentPhonics.letter} is for ${opt.word}! ⭐`);
      setScore(s => s + 2);
      setTimeout(() => {
        setPhonicsFeedback(null);
        setPhonicsIndex((prev) => (prev + 1) % phonicsList.length);
      }, 1800);
    } else {
      soundFx.playGentleBeep(260);
      speakPrompt(`Let's try again! Listen for the sound: ${currentPhonics.letter}!`);
      setPhonicsFeedback(`Almost! Try again!`);
      setTimeout(() => setPhonicsFeedback(null), 1200);
    }
  };

  // ----------------------------------------------------
  // GAME 2: LOGIC & PATTERN SEQUENCES (Age 4.5 Cognitive)
  // ----------------------------------------------------
  const patternList = [
    {
      sequence: [
        { emoji: '🔴', name: 'Red Circle' },
        { emoji: '🔷', name: 'Blue Diamond' },
        { emoji: '🔴', name: 'Red Circle' },
        { emoji: '🔷', name: 'Blue Diamond' },
      ],
      missingIndex: 4,
      answer: { emoji: '🔴', name: 'Red Circle' },
      choices: [
        { emoji: '🔴', name: 'Red Circle', correct: true },
        { emoji: '🔷', name: 'Blue Diamond', correct: false },
        { emoji: '⭐', name: 'Yellow Star', correct: false },
      ]
    },
    {
      sequence: [
        { emoji: '🐱', name: 'Cat' },
        { emoji: '🐱', name: 'Cat' },
        { emoji: '🐶', name: 'Puppy' },
        { emoji: '🐱', name: 'Cat' },
        { emoji: '🐱', name: 'Cat' },
      ],
      missingIndex: 5,
      answer: { emoji: '🐶', name: 'Puppy' },
      choices: [
        { emoji: '🐰', name: 'Bunny', correct: false },
        { emoji: '🐶', name: 'Puppy', correct: true },
        { emoji: '🐱', name: 'Cat', correct: false },
      ]
    },
    {
      sequence: [
        { emoji: '⭐', name: 'Star' },
        { emoji: '🌙', name: 'Moon' },
        { emoji: '⭐', name: 'Star' },
        { emoji: '🌙', name: 'Moon' },
      ],
      missingIndex: 4,
      answer: { emoji: '⭐', name: 'Star' },
      choices: [
        { emoji: '☀️', name: 'Sun', correct: false },
        { emoji: '⭐', name: 'Star', correct: true },
        { emoji: '🌙', name: 'Moon', correct: false },
      ]
    },
    {
      sequence: [
        { emoji: '🍎', name: 'Apple' },
        { emoji: '🍌', name: 'Banana' },
        { emoji: '🍊', name: 'Orange' },
        { emoji: '🍎', name: 'Apple' },
        { emoji: '🍌', name: 'Banana' },
      ],
      missingIndex: 5,
      answer: { emoji: '🍊', name: 'Orange' },
      choices: [
        { emoji: '🍊', name: 'Orange', correct: true },
        { emoji: '🍎', name: 'Apple', correct: false },
        { emoji: '🍇', name: 'Grapes', correct: false },
      ]
    },
  ];

  const [patternIndex, setPatternIndex] = useState(0);
  const [patternFeedback, setPatternFeedback] = useState<string | null>(null);

  const currentPattern = patternList[patternIndex];

  useEffect(() => {
    if (activeGame === 'patterns') {
      speakPrompt("What comes next in the pattern?");
    }
  }, [patternIndex, activeGame]);

  const handleSelectPattern = (choice: { emoji: string; name: string; correct: boolean }) => {
    if (choice.correct) {
      soundFx.playSuccess();
      speakPrompt(`You got it! ${choice.name} completes the pattern!`);
      setPatternFeedback(`Awesome! That's right! 🎉`);
      setScore(s => s + 2);
      setTimeout(() => {
        setPatternFeedback(null);
        setPatternIndex((prev) => (prev + 1) % patternList.length);
      }, 1800);
    } else {
      soundFx.playGentleBeep(260);
      speakPrompt("Look closely at the pattern and try once more!");
      setPatternFeedback("Check the pattern again!");
      setTimeout(() => setPatternFeedback(null), 1200);
    }
  };

  // ----------------------------------------------------
  // GAME 3: NUMBERS 1-10 & VISUAL ADDITION (Math Explorer)
  // ----------------------------------------------------
  interface MathQuestion {
    groupA: number;
    groupB: number;
    emoji: string;
    itemWord: string;
    targetTotal: number;
    choices: number[];
  }

  const mathQuestions: MathQuestion[] = [
    { groupA: 3, groupB: 2, emoji: '🎈', itemWord: 'balloons', targetTotal: 5, choices: [4, 5, 6] },
    { groupA: 4, groupB: 3, emoji: '🍓', itemWord: 'strawberries', targetTotal: 7, choices: [6, 7, 8] },
    { groupA: 5, groupB: 1, emoji: '🚗', itemWord: 'cars', targetTotal: 6, choices: [5, 6, 7] },
    { groupA: 4, groupB: 4, emoji: '⭐', itemWord: 'stars', targetTotal: 8, choices: [7, 8, 9] },
    { groupA: 6, groupB: 3, emoji: '🍎', itemWord: 'apples', targetTotal: 9, choices: [8, 9, 10] },
    { groupA: 5, groupB: 5, emoji: '🦋', itemWord: 'butterflies', targetTotal: 10, choices: [9, 10, 8] },
  ];

  const [mathIndex, setMathIndex] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const [tappedItems, setTappedItems] = useState<number[]>([]);

  const currentMath = mathQuestions[mathIndex];

  useEffect(() => {
    if (activeGame === 'counting') {
      setTappedItems([]);
      speakPrompt(`How many ${currentMath.itemWord} are there in total? Let's count!`);
    }
  }, [mathIndex, activeGame]);

  const handleTapCountItem = (index: number) => {
    soundFx.playPop();
    if (!tappedItems.includes(index)) {
      const next = [...tappedItems, index];
      setTappedItems(next);
      speakPrompt(`${next.length}`);
    }
  };

  const handleGuessMath = (guessed: number) => {
    if (guessed === currentMath.targetTotal) {
      soundFx.playSuccess();
      speakPrompt(`Fantastic ${daughterName}! ${currentMath.groupA} plus ${currentMath.groupB} equals ${currentMath.targetTotal}!`);
      setMathFeedback(`Correct! ${currentMath.groupA} + ${currentMath.groupB} = ${currentMath.targetTotal}! 🌟`);
      setScore(s => s + 2);
      setTimeout(() => {
        setMathFeedback(null);
        setTappedItems([]);
        setMathIndex(prev => (prev + 1) % mathQuestions.length);
      }, 2000);
    } else {
      soundFx.playGentleBeep(260);
      speakPrompt(`Let's count together! Try again!`);
      setMathFeedback(`Count once more!`);
      setTimeout(() => setMathFeedback(null), 1200);
    }
  };

  // ----------------------------------------------------
  // GAME 4: ADVANCED SHAPES & COLORS (Geometry & Pre-K)
  // ----------------------------------------------------
  const shapeQuestions = [
    {
      id: 1,
      targetName: 'Purple Diamond',
      shape: 'diamond',
      colorClass: 'bg-purple-500',
      description: '4 angled equal sides',
      options: [
        { name: 'Purple Diamond', shape: 'diamond', color: 'bg-purple-500', correct: true },
        { name: 'Red Circle', shape: 'circle', color: 'bg-red-500', correct: false },
        { name: 'Yellow Rectangle', shape: 'rectangle', color: 'bg-amber-400', correct: false },
      ]
    },
    {
      id: 2,
      targetName: 'Cyan Oval',
      shape: 'oval',
      colorClass: 'bg-cyan-500',
      description: 'Like a stretched circle',
      options: [
        { name: 'Green Triangle', shape: 'triangle', color: 'bg-emerald-500', correct: false },
        { name: 'Cyan Oval', shape: 'oval', color: 'bg-cyan-500', correct: true },
        { name: 'Pink Heart', shape: 'heart', color: 'bg-pink-500', correct: false },
      ]
    },
    {
      id: 3,
      targetName: 'Emerald Pentagon',
      shape: 'pentagon',
      colorClass: 'bg-emerald-600',
      description: 'A shape with 5 strong sides',
      options: [
        { name: 'Orange Star', shape: 'star', color: 'bg-orange-500', correct: false },
        { name: 'Blue Square', shape: 'square', color: 'bg-blue-600', correct: false },
        { name: 'Emerald Pentagon', shape: 'pentagon', color: 'bg-emerald-600', correct: true },
      ]
    },
    {
      id: 4,
      targetName: 'Golden Star',
      shape: 'star',
      colorClass: 'bg-amber-400',
      description: 'A 5-pointed shining star',
      options: [
        { name: 'Golden Star', shape: 'star', color: 'bg-amber-400', correct: true },
        { name: 'Purple Diamond', shape: 'diamond', color: 'bg-purple-500', correct: false },
        { name: 'Red Crescent', shape: 'crescent', color: 'bg-rose-500', correct: false },
      ]
    },
    {
      id: 5,
      targetName: 'Rose Heart',
      shape: 'heart',
      colorClass: 'bg-rose-500',
      description: 'Symbol of love and kindness',
      options: [
        { name: 'Blue Oval', shape: 'oval', color: 'bg-sky-500', correct: false },
        { name: 'Rose Heart', shape: 'heart', color: 'bg-rose-500', correct: true },
        { name: 'Emerald Triangle', shape: 'triangle', color: 'bg-emerald-500', correct: false },
      ]
    },
  ];

  const [shapeIndex, setShapeIndex] = useState(0);
  const [shapeFeedback, setShapeFeedback] = useState<string | null>(null);

  const currentShape = shapeQuestions[shapeIndex];

  useEffect(() => {
    if (activeGame === 'shapes') {
      speakPrompt(`Can you find the ${currentShape.targetName}?`);
    }
  }, [shapeIndex, activeGame]);

  const handleSelectShape = (opt: { name: string; correct: boolean }) => {
    if (opt.correct) {
      soundFx.playSuccess();
      speakPrompt(`Excellent! That is the ${currentShape.targetName}!`);
      setShapeFeedback(`Splendid! ${currentShape.targetName}! ✨`);
      setScore(s => s + 2);
      setTimeout(() => {
        setShapeFeedback(null);
        setShapeIndex(prev => (prev + 1) % shapeQuestions.length);
      }, 1800);
    } else {
      soundFx.playGentleBeep(260);
      speakPrompt(`Look for the ${currentShape.targetName}! Try again!`);
      setShapeFeedback(`Try again!`);
      setTimeout(() => setShapeFeedback(null), 1200);
    }
  };

  const renderShapeIcon = (shape: string, colorClass: string) => {
    switch (shape) {
      case 'circle': return <div className={`w-16 h-16 rounded-full ${colorClass}`} />;
      case 'square': return <div className={`w-16 h-16 rounded-xl ${colorClass}`} />;
      case 'rectangle': return <div className={`w-20 h-12 rounded-xl ${colorClass}`} />;
      case 'oval': return <div className={`w-20 h-12 rounded-[50%] ${colorClass}`} />;
      case 'diamond': return <div className={`w-14 h-14 rotate-45 rounded-md ${colorClass}`} />;
      case 'pentagon': 
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 fill-current text-emerald-600">
              <polygon points="50,5 95,38 78,92 22,92 5,38" />
            </svg>
          </div>
        );
      case 'star': 
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            <Star className="w-16 h-16 fill-amber-400 text-amber-500" />
          </div>
        );
      case 'heart': 
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            <Heart className="w-16 h-16 fill-rose-500 text-rose-600" />
          </div>
        );
      case 'triangle': 
        return (
          <div className="w-16 h-16 flex items-center justify-center">
            <Triangle className="w-16 h-16 fill-emerald-500 text-emerald-600" />
          </div>
        );
      default: return <div className={`w-14 h-14 rounded-full ${colorClass}`} />;
    }
  };

  // ----------------------------------------------------
  // GAME 5: ANIMAL SAFARI (28 Animals, 6 Habitats, Multiple Submodes & Varieties)
  // Handled by the modular <AnimalSafariGame /> component
  // ----------------------------------------------------

  return (
    <div className="w-full flex-1 flex flex-col justify-start">
      <div className="w-full">
        
        {/* Compact Sub-header: Score & Audio Controls */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
              🦁 Nisan Aydın Eğitici Oyun Odası (4.5 Yaş)
            </span>
          </div>

          {/* Audio & Score Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
              <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{score} Yıldız</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                setVoiceEnabled(next);
                soundFx.soundEnabled = next;
                soundFx.voiceEnabled = next;
                if (!next) {
                  soundFx.muteAll();
                } else {
                  soundFx.playPop();
                  if (activeGame === 'animals') speakPrompt("Welcome to Kart Eşleştirme!");
                  if (activeGame === 'phonics') speakPrompt(`Which word starts with letter ${currentPhonics.letter}?`);
                }
              }}
              title={soundEnabled ? 'Oyun sesini kapat' : 'Oyun sesini ve seslendirmeyi aç'}
              className={`px-3 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
                  : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Ses Açık</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-300" />
                  <span>Sesi Aç 🔊</span>
                </>
              )}
            </button>

            {/* Repeat Audio Voiceover Button */}
            {soundEnabled && (
              <button
                onClick={() => {
                  if (activeGame === 'animals') speakPrompt("Match the animal pairs in Kart Eşleştirme!");
                  if (activeGame === 'phonics') speakPrompt(`Which word starts with letter ${currentPhonics.letter}?`);
                  if (activeGame === 'patterns') speakPrompt("What comes next in the pattern?");
                  if (activeGame === 'counting') speakPrompt(`How many ${currentMath.itemWord} are there in total? Let's count!`);
                  if (activeGame === 'shapes') speakPrompt(`Can you find the ${currentShape.targetName}?`);
                }}
                title="İngilizce sesi tekrar dinle"
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-medium text-stone-700 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Volume1 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Tekrar Dinle</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Tactile 4.5-Year-Old Game Tabs (KART EŞLEŞTİRME IS FIRST & PROMINENT) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mb-4">
          {[
            { 
              id: 'animals', 
              label: 'Kart Eşleştirme', 
              emoji: '🦁', 
              desc: 'Hafıza & Doğa', 
              badge: '⭐ 1. Oyun / Ana Oyun',
              isPrimary: true 
            },
            { id: 'phonics', label: 'ABC Phonics', emoji: '🔤', desc: 'Harf Sesleri' },
            { id: 'patterns', label: 'Logic Patterns', emoji: '🔷', desc: 'Dizi Bulmacası' },
            { id: 'counting', label: 'Math & Count', emoji: '➕', desc: 'Sayılar & Toplama' },
            { id: 'shapes', label: 'Shapes Lab', emoji: '💎', desc: 'Geometri & Renk' },
          ].map((tab) => {
            const isActive = activeGame === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveGame(tab.id as any);
                  soundFx.playPop();
                  if (tab.id === 'animals') speakPrompt("Welcome to Kart Eşleştirme! Let's match the animal pairs!");
                }}
                className={`p-2 sm:p-2.5 rounded-2xl border text-center transition-all relative ${
                  isActive
                    ? tab.isPrimary
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-500 text-white shadow-md scale-[1.03] ring-2 ring-amber-300'
                      : 'bg-stone-900 border-stone-900 text-white shadow-md scale-[1.02]'
                    : tab.isPrimary
                      ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400 font-semibold ring-1 ring-amber-200/80 shadow-xs'
                      : 'bg-white border-stone-200/90 hover:border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {tab.badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                    {tab.badge}
                  </span>
                )}
                <span className="text-xl sm:text-2xl block mb-0.5">{tab.emoji}</span>
                <span className="font-bold text-xs block leading-tight">{tab.label}</span>
                <span className={`text-[10px] block opacity-75 ${isActive ? 'text-white/90' : 'text-stone-500'}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* GAME 1: PHONICS & LETTER SOUNDS */}
        {activeGame === 'phonics' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 block mb-1">
                Phonics Mission · Age 4.5
              </span>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-5xl sm:text-6xl font-display font-black text-stone-900 px-6 py-2 bg-rose-50 rounded-2xl border-2 border-rose-200 shadow-inner">
                  {currentPhonics.letter}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                Which word starts with letter <span className="text-rose-600 font-extrabold">{currentPhonics.letter}</span>?
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Sound: <strong className="font-mono text-stone-700">{currentPhonics.phonics}</strong>
              </p>
            </div>

            {phonicsFeedback && (
              <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold animate-bounce shadow-sm">
                {phonicsFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto pt-2">
              {currentPhonics.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPhonics(opt)}
                  className="h-44 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center p-6 bg-stone-50/50 group"
                >
                  <span className="text-5xl block mb-2 transition-transform group-hover:scale-125">
                    {opt.emoji}
                  </span>
                  <span className="font-bold text-base text-stone-800">
                    {opt.word}
                  </span>
                  <span className="text-[11px] text-stone-400 mt-0.5">
                    Starts with {opt.word[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-xs text-stone-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap the speaker button anytime to hear the English prompt again!</span>
            </div>
          </div>
        )}

        {/* GAME 2: LOGIC & PATTERN SEQUENCES */}
        {activeGame === 'patterns' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 block mb-1">
                Cognitive Sequence Logic
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                What Comes Next in the Pattern?
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Look at the repeating rhythm, then choose the missing item to complete it!
              </p>
            </div>

            {patternFeedback && (
              <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold animate-bounce shadow-sm">
                {patternFeedback}
              </div>
            )}

            {/* Pattern Train Visual */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 mb-8 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 shadow-inner">
              {currentPattern.sequence.map((item, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-3xl sm:text-4xl"
                >
                  {item.emoji}
                </div>
              ))}

              {/* The Question Mark Box */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-rose-400 bg-rose-50/50 flex items-center justify-center text-2xl font-bold text-rose-600 animate-pulse">
                ?
              </div>
            </div>

            {/* Answer Options */}
            <div className="max-w-md mx-auto">
              <span className="text-xs font-semibold text-stone-500 block mb-3">Choose the next one:</span>
              <div className="grid grid-cols-3 gap-4">
                {currentPattern.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPattern(choice)}
                    className="h-24 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:shadow-md bg-white flex flex-col items-center justify-center p-3 transition-all active:scale-95 group"
                  >
                    <span className="text-4xl block transition-transform group-hover:scale-125 mb-1">
                      {choice.emoji}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {choice.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GAME 3: NUMBERS 1-10 & VISUAL ADDITION */}
        {activeGame === 'counting' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 block mb-1">
                Early Math & Addition (1 to 10)
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                Count the {currentMath.itemWord}!
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Touch each object to count out loud: <strong>{currentMath.groupA} + {currentMath.groupB} = ?</strong>
              </p>
            </div>

            {mathFeedback && (
              <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold animate-bounce shadow-sm">
                {mathFeedback}
              </div>
            )}

            {/* Visual Groups with a Plus Sign in the middle */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 shadow-inner">
              
              {/* Group A */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-xl border border-stone-200 min-w-36">
                {Array.from({ length: currentMath.groupA }).map((_, idx) => (
                  <button
                    key={`a-${idx}`}
                    onClick={() => handleTapCountItem(idx)}
                    className={`text-4xl sm:text-5xl transition-transform active:scale-125 ${
                      tappedItems.includes(idx) ? 'scale-110 drop-shadow-md' : 'hover:scale-105'
                    }`}
                  >
                    {currentMath.emoji}
                  </button>
                ))}
              </div>

              {/* Plus symbol */}
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow">
                +
              </div>

              {/* Group B */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-xl border border-stone-200 min-w-36">
                {Array.from({ length: currentMath.groupB }).map((_, idx) => {
                  const globalIdx = currentMath.groupA + idx;
                  return (
                    <button
                      key={`b-${idx}`}
                      onClick={() => handleTapCountItem(globalIdx)}
                      className={`text-4xl sm:text-5xl transition-transform active:scale-125 ${
                        tappedItems.includes(globalIdx) ? 'scale-110 drop-shadow-md' : 'hover:scale-105'
                      }`}
                    >
                      {currentMath.emoji}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Answer Choices */}
            <div className="max-w-xs mx-auto">
              <span className="text-xs font-semibold text-stone-500 block mb-3">How many in total?</span>
              <div className="grid grid-cols-3 gap-3">
                {currentMath.choices.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleGuessMath(num)}
                    className="h-16 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-900 hover:text-white bg-white text-stone-900 font-display font-bold text-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GAME 4: ADVANCED SHAPES LAB */}
        {activeGame === 'shapes' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 block mb-1">
                Geometry & Colors Lab · Pre-K
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                Can You Find the <span className="text-rose-600 underline underline-offset-4">{currentShape.targetName}</span>?
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Clue: {currentShape.description}
              </p>
            </div>

            {shapeFeedback && (
              <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold animate-bounce shadow-sm">
                {shapeFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
              {currentShape.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectShape(opt)}
                  className="h-44 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center p-6 bg-stone-50/50 group"
                >
                  <div className="mb-3 transition-transform group-hover:scale-110">
                    {renderShapeIcon(opt.shape, opt.color)}
                  </div>
                  <span className="font-bold text-sm text-stone-800 mt-2">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 5: ANIMAL SAFARI DISCOVERY LAB (Rich Combinations, Habitats & Submodes) */}
        {activeGame === 'animals' && (
          <AnimalSafariGame
            daughterName={daughterName}
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            speakPrompt={speakPrompt}
            onScore={(points) => setScore((s) => s + points)}
          />
        )}

      </div>
    </div>
  );
};
