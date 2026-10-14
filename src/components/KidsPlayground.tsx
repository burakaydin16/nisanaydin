import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Volume2, VolumeX, RotateCcw, Award, Heart, 
  Circle, Square, Triangle, Star, Smile, RefreshCw, Palette, 
  Check, ArrowRight, Music, HelpCircle, Volume1, Trophy, Zap
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface KidsPlaygroundProps {
  daughterName: string;
}

type GameMode = 'phonics' | 'patterns' | 'counting' | 'shapes' | 'animals';

export const KidsPlayground: React.FC<KidsPlaygroundProps> = ({ daughterName }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('phonics');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [score, setScore] = useState(0);

  // Sync sound settings
  useEffect(() => {
    soundFx.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    soundFx.voiceEnabled = voiceEnabled;
  }, [voiceEnabled]);

  const speakPrompt = (text: string) => {
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
  // GAME 5: ANIMAL HABITATS & MEMORY (8 Cards / 4 Pairs)
  // ----------------------------------------------------
  interface AnimalCard {
    cardId: number;
    animalId: string;
    name: string;
    habitat: string;
    emoji: string;
    soundQuote: string;
    flipped: boolean;
    matched: boolean;
  }

  const masterAnimals = [
    { id: 'lion', name: 'Lion', habitat: 'Savannah', emoji: '🦁', soundQuote: 'The mighty lion roars in the golden savannah!' },
    { id: 'dolphin', name: 'Dolphin', habitat: 'Ocean', emoji: '🐬', soundQuote: 'The playful dolphin leaps in the blue ocean!' },
    { id: 'owl', name: 'Owl', habitat: 'Forest', emoji: '🦉', soundQuote: 'The wise owl hoots in the quiet forest!' },
    { id: 'panda', name: 'Panda', habitat: 'Bamboo Grove', emoji: '🐼', soundQuote: 'The cute panda munches bamboo!' },
    { id: 'penguin', name: 'Penguin', habitat: 'Polar Ice', emoji: '🐧', soundQuote: 'The brave penguin waddles on polar ice!' },
    { id: 'butterfly', name: 'Butterfly', habitat: 'Flower Garden', emoji: '🦋', soundQuote: 'The gentle butterfly flutters in the flower garden!' },
  ];

  const [cards, setCards] = useState<AnimalCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [pairsCompleted, setPairsCompleted] = useState(0);

  const initAnimalMemory = () => {
    // Pick 4 animals for 4.5yo (8 cards = 4 pairs)
    const picked = masterAnimals.sort(() => 0.5 - Math.random()).slice(0, 4);
    const deck: AnimalCard[] = [];
    let count = 1;
    picked.forEach(item => {
      deck.push({ ...item, cardId: count++, animalId: item.id, flipped: false, matched: false });
      deck.push({ ...item, cardId: count++, animalId: item.id, flipped: false, matched: false });
    });
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setPairsCompleted(0);
  };

  useEffect(() => {
    if (activeGame === 'animals') {
      initAnimalMemory();
      speakPrompt("Match the animal pairs and discover their habitats!");
    }
  }, [activeGame]);

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

      if (first && second && first.animalId === second.animalId) {
        soundFx.playSuccess();
        speakPrompt(`Great match! ${first.name}! It lives in the ${first.habitat}!`);
        setTimeout(() => {
          setCards(prev => prev.map(c => c.animalId === first.animalId ? { ...c, matched: true } : c));
          setFlippedIds([]);
          setPairsCompleted(p => {
            const next = p + 1;
            if (next === 4) {
              speakPrompt(`Congratulations ${daughterName}! You found all four animal families!`);
              setScore(s => s + 4);
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

  return (
    <div className="bg-[#FAF8F5] border-y border-stone-200 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
              <span>{daughterName}'s English Learning & Discovery Lab</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-stone-900 bg-amber-100 px-2 py-0.5 rounded-md">Age 4.5+ Pre-K Ready</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Interactive English Adventure 🚀
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Phonics sounds, pattern logic, pre-math addition, advanced shapes, and animal habitats with friendly English voiceover.
            </p>
          </div>

          {/* Audio & Score Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
              <Trophy className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{score} Stars</span>
            </div>

            {/* Repeat Audio Voiceover Button */}
            <button
              onClick={() => {
                if (activeGame === 'phonics') speakPrompt(`Which word starts with letter ${currentPhonics.letter}?`);
                if (activeGame === 'patterns') speakPrompt("What comes next in the pattern?");
                if (activeGame === 'counting') speakPrompt(`How many ${currentMath.itemWord} are there in total? Let's count!`);
                if (activeGame === 'shapes') speakPrompt(`Can you find the ${currentShape.targetName}?`);
                if (activeGame === 'animals') speakPrompt("Match the animal pairs!");
              }}
              title="Hear English Prompt Again"
              className="px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-medium text-stone-800 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Volume1 className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Repeat Voice</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) soundFx.playPop();
              }}
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
                soundEnabled 
                  ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50' 
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Voice Speech Toggle */}
            <button
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (next) speakPrompt('English audio guide is now on!');
              }}
              title={voiceEnabled ? 'Mute English Voice' : 'Turn On English Voice'}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                voiceEnabled 
                  ? 'bg-rose-50 border-rose-200 text-rose-800' 
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
            >
              <span>{voiceEnabled ? 'English Voice Active' : 'Voice Muted'}</span>
            </button>
          </div>
        </div>

        {/* Big Tactile 4.5-Year-Old Game Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {[
            { id: 'phonics', label: 'ABC Phonics', emoji: '🔤', desc: 'Letter Sounds' },
            { id: 'patterns', label: 'Logic Patterns', emoji: '🔷', desc: 'Sequence Puzzle' },
            { id: 'counting', label: 'Math & Count', emoji: '➕', desc: 'Numbers to 10' },
            { id: 'shapes', label: 'Shapes Lab', emoji: '💎', desc: 'Geometry Discovery' },
            { id: 'animals', label: 'Animal Safari', emoji: '🦁', desc: 'Habitats & Memory' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveGame(tab.id as any);
                soundFx.playPop();
              }}
              className={`p-3 rounded-2xl border text-center transition-all ${
                activeGame === tab.id
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md scale-[1.02]'
                  : 'bg-white border-stone-200/90 hover:border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl block mb-1">{tab.emoji}</span>
              <span className="font-bold text-xs block leading-tight">{tab.label}</span>
              <span className={`text-[10px] block opacity-70 ${activeGame === tab.id ? 'text-stone-300' : 'text-stone-400'}`}>
                {tab.desc}
              </span>
            </button>
          ))}
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

        {/* GAME 5: ANIMAL HABITATS & MEMORY (8 Cards) */}
        {activeGame === 'animals' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 block mb-1">
                Nature Explorer & Memory Pairs
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                Match the Animal Pairs! 🦁
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Pairs completed: <strong>{pairsCompleted} / 4</strong> · Discover their natural habitats!
              </p>
            </div>

            {/* 8 Cards Grid (4x2 on mobile/tablet) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
              {cards.map((card) => {
                const isShowing = card.flipped || card.matched;
                return (
                  <button
                    key={card.cardId}
                    onClick={() => handleFlipCard(card.cardId)}
                    disabled={card.matched}
                    className={`h-36 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 relative active:scale-95 ${
                      card.matched
                        ? 'border-emerald-300 bg-emerald-50/70 opacity-90'
                        : isShowing
                        ? 'border-stone-500 bg-white shadow-md'
                        : 'border-stone-200 bg-amber-50/40 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    {isShowing ? (
                      <>
                        <span className="text-4xl block mb-1 animate-in zoom-in-50">
                          {card.emoji}
                        </span>
                        <span className="text-xs font-bold text-stone-900 leading-tight">
                          {card.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {card.habitat}
                        </span>
                      </>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-amber-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={initAnimalMemory}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle New Animals</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
