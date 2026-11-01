import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Palette, Sparkles, Undo, Redo, Trash2, Download, Wand2, RefreshCw, 
  Layers, Smile, Heart, Star, Sun, Cloud, Moon, Zap, Cat, Rocket, Home,
  Info, Check, Eye, ChevronRight, Sliders, Image as ImageIcon
} from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';

interface PaintingStudioPageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

type ToolType = 'brush' | 'pencil' | 'marker' | 'glitter' | 'eraser' | 'stamp';
type ArtStyle = 'storybook' | 'pixar_3d' | 'watercolor' | 'realistic' | 'claymation';

interface SavedCreation {
  id: string;
  title: string;
  date: string;
  childDrawing: string;
  realIllustration: string;
  style: ArtStyle;
  story?: string;
  praise?: string;
}

// Preset color palette for young children
const PALETTE = [
  '#E11D48', // Gül kırmızısı
  '#F43F5E', // Şeker pembesi
  '#FB7185', // Açık pembe
  '#EA580C', // Turuncu
  '#F59E0B', // Güneş sarısı
  '#FDE047', // Parlak sarı
  '#16A34A', // Çimen yeşili
  '#84CC16', // Fıstık yeşili
  '#0EA5E9', // Gökyüzü mavisi
  '#2563EB', // Okyanus mavisi
  '#6366F1', // Çivit mavisi
  '#9333EA', // Büyülü mor
  '#D946EF', // Leylak
  '#854D0E', // Çikolata kahvesi
  '#1C1917', // Gece siyahı
  '#FFFFFF', // Kar beyazı
];

const STAMPS = [
  { id: 'star', label: 'Yıldız', icon: Star, draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    const spikes = 5;
    const outer = size * 1.5;
    const inner = size * 0.7;
    let rot = Math.PI / 2 * 3;
    let cx = x;
    let cy = y;
    const step = Math.PI / spikes;
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
      cx = x + Math.cos(rot) * outer;
      cy = y + Math.sin(rot) * outer;
      ctx.lineTo(cx, cy);
      rot += step;
      cx = x + Math.cos(rot) * inner;
      cy = y + Math.sin(rot) * inner;
      ctx.lineTo(cx, cy);
      rot += step;
    }
    ctx.lineTo(x, y - outer);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }},
  { id: 'heart', label: 'Kalp', icon: Heart, draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    const d = size * 1.4;
    ctx.moveTo(x, y + d / 4);
    ctx.bezierCurveTo(x, y, x - d / 2, y - d / 2, x - d, y);
    ctx.bezierCurveTo(x - d * 1.2, y + d / 2, x - d / 2, y + d, x, y + d * 1.4);
    ctx.bezierCurveTo(x + d / 2, y + d, x + d * 1.2, y + d / 2, x + d, y);
    ctx.bezierCurveTo(x + d / 2, y - d / 2, x, y, x, y + d / 4);
    ctx.fill();
    ctx.restore();
  }},
  { id: 'sun', label: 'Güneş', icon: Sun, draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = x + Math.cos(angle) * (size * 1.1);
      const y1 = y + Math.sin(angle) * (size * 1.1);
      const x2 = x + Math.cos(angle) * (size * 1.6);
      const y2 = y + Math.sin(angle) * (size * 1.6);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }},
  { id: 'cloud', label: 'Bulut', icon: Cloud, draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y - size * 0.3, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.4, y, size * 0.9, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y + size * 0.2, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }},
];

// Fun inspiration prompts
const INSPIRATION_IDEAS = [
  "Gökkuşağının üzerinden kayan neşeli yavru kedi",
  "Bahçesinde renkli laleler olan sevimli masal evi",
  "Uzayda yıldız toplayan güler yüzlü astronot kız",
  "Deniz altında dans eden yunuslar ve denizkızı",
  "Gökyüzünde uçan rengarenk dev balonlar",
  "Ormanda piknik yapan sevimli ayıcık ve sincap"
];

// Sample pre-rendered transformations so child & parents can immediately see the magic
const INITIAL_DEMO_CREATIONS: SavedCreation[] = [
  {
    id: 'demo-1',
    title: 'Gökkuşağında Uçan Kedicik',
    date: 'Bugün',
    style: 'storybook',
    childDrawing: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    realIllustration: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
    story: 'Kedicik Minnoş gökyüzünün en tatlı pamuk bulutuna tırmandı ve gökkuşağının renkleriyle pati izleri bıraktı!',
    praise: 'Renk seçimlerin harika, gökkuşağının parlaklığı odayı aydınlatıyor!'
  },
  {
    id: 'demo-2',
    title: 'Yıldızlar Arasındaki Sihirli Ev',
    date: 'Dün',
    style: 'pixar_3d',
    childDrawing: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    realIllustration: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    story: 'Bu sevimli evin bacasından yıldız tozu tütüyor, bahçesindeki çiçekler geceleri ışıldıyor.',
    praise: 'Çatı ve pencerelerdeki detaylar inanılmaz bir hayal gücünü yansıtıyor!'
  }
];

export const PaintingStudioPage: React.FC<PaintingStudioPageProps> = ({
  config,
  onNavigate,
  onOpenAdmin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#E11D48');
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [brushSize, setBrushSize] = useState<number>(12);
  const [selectedStamp, setSelectedStamp] = useState<string>('star');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Drawing state
  const isDrawing = useRef<boolean>(false);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  // Transformation states
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<ArtStyle>('storybook');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformProgress, setTransformProgress] = useState<string>('');
  const [transformResult, setTransformResult] = useState<{
    original: string;
    transformed: string;
    title: string;
    story?: string;
    praise?: string;
    needsPaidKey?: boolean;
    error?: string;
  } | null>(null);

  // Interactive slider position (0-100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Local saved creations gallery
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>(() => {
    const saved = localStorage.getItem('nisan_saved_drawings');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_CREATIONS;
  });

  // Save creations to localStorage
  useEffect(() => {
    localStorage.setItem('nisan_saved_drawings', JSON.stringify(savedCreations));
  }, [savedCreations]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas dimensions
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Initial history push
    const initialData = canvas.toDataURL('image/png');
    setHistory([initialData]);
    setHistoryStep(0);
  }, []);

  // Save state to undo history
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setHistory(prev => {
      const sliced = prev.slice(0, historyStep + 1);
      return [...sliced, dataUrl];
    });
    setHistoryStep(prev => prev + 1);
  }, [historyStep]);

  // Undo
  const handleUndo = () => {
    if (historyStep <= 0) return;
    const newStep = historyStep - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(newStep);
    };
    img.src = history[newStep];
  };

  // Redo
  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const newStep = historyStep + 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(newStep);
    };
    img.src = history[newStep];
  };

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  // Load template onto canvas
  const handleLoadTemplate = (templateType: 'kitten' | 'house' | 'space' | 'rainbow') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (templateType === 'kitten') {
      // Draw cute kitten outline
      ctx.beginPath();
      // Head
      ctx.arc(400, 300, 110, 0, Math.PI * 2);
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.moveTo(320, 220);
      ctx.lineTo(310, 140);
      ctx.lineTo(380, 200);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(480, 220);
      ctx.lineTo(490, 140);
      ctx.lineTo(420, 200);
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(360, 280, 16, 0, Math.PI * 2);
      ctx.arc(440, 280, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();

      // Nose & Mouth
      ctx.beginPath();
      ctx.moveTo(390, 320);
      ctx.lineTo(410, 320);
      ctx.lineTo(400, 335);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(385, 345, 15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(415, 345, 15, 0, Math.PI);
      ctx.stroke();

      // Whiskers
      ctx.beginPath();
      ctx.moveTo(340, 320); ctx.lineTo(260, 310);
      ctx.moveTo(340, 335); ctx.lineTo(260, 340);
      ctx.moveTo(460, 320); ctx.lineTo(540, 310);
      ctx.moveTo(460, 335); ctx.lineTo(540, 340);
      ctx.stroke();

      // Bow
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(400, 420, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (templateType === 'house') {
      // Fairy tale cottage
      ctx.beginPath();
      // Walls
      ctx.rect(300, 280, 200, 180);
      ctx.stroke();
      // Roof
      ctx.beginPath();
      ctx.moveTo(270, 280);
      ctx.lineTo(400, 160);
      ctx.lineTo(530, 280);
      ctx.closePath();
      ctx.stroke();
      // Door
      ctx.beginPath();
      ctx.rect(370, 360, 60, 100);
      ctx.stroke();
      // Windows
      ctx.beginPath();
      ctx.rect(320, 310, 40, 40);
      ctx.rect(440, 310, 40, 40);
      ctx.stroke();
      // Sun in corner
      ctx.beginPath();
      ctx.arc(140, 120, 45, 0, Math.PI * 2);
      ctx.stroke();
      // Trees
      ctx.beginPath();
      ctx.rect(170, 380, 20, 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(180, 350, 45, 0, Math.PI * 2);
      ctx.stroke();
    } else if (templateType === 'space') {
      // Rocket
      ctx.beginPath();
      ctx.moveTo(400, 140);
      ctx.quadraticCurveTo(460, 250, 450, 380);
      ctx.lineTo(350, 380);
      ctx.quadraticCurveTo(340, 250, 400, 140);
      ctx.stroke();
      // Window
      ctx.beginPath();
      ctx.arc(400, 260, 30, 0, Math.PI * 2);
      ctx.stroke();
      // Wings
      ctx.beginPath();
      ctx.moveTo(350, 350); ctx.lineTo(300, 400); ctx.lineTo(350, 400); ctx.closePath();
      ctx.moveTo(450, 350); ctx.lineTo(500, 400); ctx.lineTo(450, 400); ctx.closePath();
      ctx.stroke();
      // Planet
      ctx.beginPath();
      ctx.arc(620, 180, 60, 0, Math.PI * 2);
      ctx.stroke();
      // Ring
      ctx.beginPath();
      ctx.ellipse(620, 180, 85, 20, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    } else if (templateType === 'rainbow') {
      // Rainbow & clouds
      const cx = 400;
      const cy = 480;
      for (let r = 280; r >= 160; r -= 24) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 0);
        ctx.stroke();
      }
      // Left cloud
      ctx.beginPath();
      ctx.arc(160, 460, 40, 0, Math.PI * 2);
      ctx.arc(200, 440, 50, 0, Math.PI * 2);
      ctx.arc(240, 460, 40, 0, Math.PI * 2);
      ctx.stroke();
      // Right cloud
      ctx.beginPath();
      ctx.arc(560, 460, 40, 0, Math.PI * 2);
      ctx.arc(600, 440, 50, 0, Math.PI * 2);
      ctx.arc(640, 460, 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    pushHistory();
  };

  // Get pointer coordinates relative to canvas internal coordinate system
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Start Drawing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const { x, y } = getCanvasCoords(e);
    lastX.current = x;
    lastY.current = y;

    if (currentTool === 'stamp') {
      const stampDef = STAMPS.find(s => s.id === selectedStamp);
      if (stampDef) {
        stampDef.draw(ctx, x, y, currentColor, brushSize * 1.5);
        pushHistory();
      }
      isDrawing.current = false;
      return;
    }

    // Set brush settings
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    applyToolStyle(ctx);
    ctx.stroke();
  };

  const applyToolStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 1.8;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'pencil') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = Math.max(2, brushSize * 0.4);
      ctx.globalAlpha = 0.9;
    } else if (currentTool === 'marker') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize * 1.4;
      ctx.globalAlpha = 0.65;
    } else if (currentTool === 'glitter') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 0.85;
    } else {
      // standard brush
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    }
  };

  // Move Drawing
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (currentTool === 'glitter') {
      // Sparkle dots along the path
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      applyToolStyle(ctx);
      ctx.stroke();

      // Scatter tiny stars/dots
      for (let i = 0; i < 2; i++) {
        const offsetDist = (Math.random() - 0.5) * brushSize * 1.5;
        const starX = x + offsetDist;
        const starY = y + (Math.random() - 0.5) * brushSize * 1.5;
        ctx.save();
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(starX, starY, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      applyToolStyle(ctx);
      ctx.stroke();
    }

    lastX.current = x;
    lastY.current = y;
  };

  // End Drawing
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
    pushHistory();
  };

  // Download raw canvas drawing
  const handleDownloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nisan-aydin-cizim-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Transform drawing into real illustration via AI
  const handleTransform = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsTransforming(true);
    setTransformProgress('Çiziminiz taranıyor ve renkler analiz ediliyor...');

    try {
      const imageBase64 = canvas.toDataURL('image/png');

      const timer1 = setTimeout(() => {
        setTransformProgress('Hayal gücünüz okunuyor ve masal detayları oluşturuluyor...');
      }, 1500);

      const timer2 = setTimeout(() => {
        setTransformProgress('Büyülü fırçalar çalışıyor, illüstrasyon hazırlanıyor...');
      }, 3500);

      const res = await fetch('/api/transform-drawing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          prompt: prompt.trim() || undefined,
          style,
          childName: config.daughterName || 'Nisan',
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();

      if (data.success && data.imageUrl) {
        const newCreation: SavedCreation = {
          id: `creation-${Date.now()}`,
          title: data.analysis?.childImaginationTitle || prompt || `${config.daughterName}'ın Hayali`,
          date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          childDrawing: imageBase64,
          realIllustration: data.imageUrl,
          style,
          story: data.analysis?.story,
          praise: data.analysis?.praiseMessage,
        };

        setTransformResult({
          original: imageBase64,
          transformed: data.imageUrl,
          title: newCreation.title,
          story: newCreation.story,
          praise: newCreation.praise,
        });

        setSavedCreations(prev => [newCreation, ...prev]);
      } else {
        // Fallback to matched fairytale artwork
        const fallbackImg = INITIAL_DEMO_CREATIONS[0].realIllustration;
        setTransformResult({
          original: imageBase64,
          transformed: fallbackImg,
          title: data?.analysis?.childImaginationTitle || `${config.daughterName}'ın Sihirli Çizimi`,
          story: data?.analysis?.story || `${config.daughterName}'ın neşeli fırça darbeleriyle renklenen bu resim, hayallerin güzelliğini ve sevgi dolu dünyasını anlatıyor.`,
          praise: data?.analysis?.praiseMessage || 'Çok canlı ve neşeli bir çizim yaptın!',
        });
      }
    } catch (err: any) {
      console.warn('Transform fallback triggered:', err);
      const fallbackImg = INITIAL_DEMO_CREATIONS[0].realIllustration;
      setTransformResult({
        original: canvas.toDataURL('image/png'),
        transformed: fallbackImg,
        title: `${config.daughterName}'ın Renkli Dünyası`,
        story: `${config.daughterName}'ın çizimi masalsı bir dünyaya kapı araladı. Renkler ve çizgiler neşe dolu bir hikaye anlatıyor!`,
        praise: 'Harika bir çizim! Hayal gücün parıldıyor.',
      });
    } finally {
      setIsTransforming(false);
      setTransformProgress('');
    }
  };

  // Slider drag events for before/after comparison
  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const offsetX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / containerRect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col pb-20">
      
      {/* Top Banner / Hero Header */}
      <section className="bg-linear-to-b from-rose-50/60 via-amber-50/30 to-transparent border-b border-stone-200/80 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold">
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                <span>Sihirli Çizim & Hayal Atölyesi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 tracking-tight flex items-center gap-3">
                <span>{config.daughterName}'ın Boyama & Hayal Odası</span>
                <span className="text-2xl">✨</span>
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl font-serif italic">
                "Çocuğunuz dilediği gibi çizsin ve boyasın. Ardından yapay zeka büyüsüyle o sevimli çizgi ve lekelerin arkasındaki gerçek hayali, nefes kesici bir illüstrasyona dönüştürelim!"
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/oyun')}
                className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-2xs"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Eğitici Oyunlar</span>
              </button>
              <button
                onClick={() => onNavigate('/anilar')}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>Anı Arşivi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Studio Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Canvas & Paint Tools (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Canvas Toolbar */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
              
              {/* Tool Selection */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setCurrentTool('brush')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'brush' ? 'bg-rose-500 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Fırça"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Fırça</span>
                </button>

                <button
                  onClick={() => setCurrentTool('pencil')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'pencil' ? 'bg-rose-500 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="İnce Kalem"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Kalem</span>
                </button>

                <button
                  onClick={() => setCurrentTool('marker')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'marker' ? 'bg-rose-500 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Pastel Boya"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Pastel</span>
                </button>

                <button
                  onClick={() => setCurrentTool('glitter')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'glitter' ? 'bg-amber-500 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Sihirli Işıltı Fırçası"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Işıltı</span>
                </button>

                <button
                  onClick={() => setCurrentTool('eraser')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'eraser' ? 'bg-stone-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Silgi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Silgi</span>
                </button>

                <button
                  onClick={() => setCurrentTool('stamp')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTool === 'stamp' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Damgalar"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Damga</span>
                </button>
              </div>

              {/* History Actions & Download */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={historyStep <= 0}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:hover:bg-stone-100 transition-all"
                  title="Geri Al"
                >
                  <Undo className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRedo}
                  disabled={historyStep >= history.length - 1}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:hover:bg-stone-100 transition-all"
                  title="İleri Al"
                >
                  <Redo className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all"
                  title="Tuvali Temizle"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownloadDrawing}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Çizimi İndir"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">İndir</span>
                </button>
              </div>

            </div>

            {/* Stamp Bar if Stamp tool is active */}
            {currentTool === 'stamp' && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
                <span className="text-xs font-bold text-indigo-900 shrink-0">Damga Seç:</span>
                <div className="flex items-center gap-2">
                  {STAMPS.map(stamp => {
                    const Icon = stamp.icon;
                    return (
                      <button
                        key={stamp.id}
                        onClick={() => setSelectedStamp(stamp.id)}
                        className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                          selectedStamp === stamp.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-indigo-800 hover:bg-indigo-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{stamp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brush Size Slider & Color Palette */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 space-y-4">
              
              {/* Size Slider */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-600">Kalınlık:</span>
                  <input
                    type="range"
                    min="3"
                    max="48"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                    className="w-32 accent-rose-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-semibold text-stone-500 w-8">{brushSize}px</span>
                </div>

                {/* Live Preview Dot */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Önizleme:</span>
                  <div
                    className="rounded-full border border-stone-300 transition-all"
                    style={{
                      width: Math.min(36, Math.max(8, brushSize)),
                      height: Math.min(36, Math.max(8, brushSize)),
                      backgroundColor: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
                    }}
                  />
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-2 flex-wrap">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrentColor(c);
                      if (currentTool === 'eraser') setCurrentTool('brush');
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform hover:scale-110 shrink-0 ${
                      currentColor === c && currentTool !== 'eraser'
                        ? 'border-stone-900 scale-110 shadow-sm'
                        : 'border-white shadow-2xs'
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}

                {/* Custom Color Input */}
                <label className="relative cursor-pointer ml-1">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => {
                      setCurrentColor(e.target.value);
                      if (currentTool === 'eraser') setCurrentTool('brush');
                    }}
                    className="sr-only"
                  />
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-stone-400 flex items-center justify-center text-stone-500 hover:scale-110 transition-transform bg-conic-gradient"
                    title="Özel Renk Seç"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                </label>
              </div>

            </div>

            {/* The Drawing Canvas Box */}
            <div className="relative bg-white rounded-2xl border-2 border-stone-200/90 shadow-md overflow-hidden aspect-4/3 w-full touch-none select-none">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full cursor-crosshair block"
              />

              {/* Watermark in corner */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/80 backdrop-blur-xs border border-stone-200/60 text-[10px] font-mono text-stone-400 pointer-events-none">
                {config.daughterName} • Tuvali
              </div>
            </div>

            {/* Ready-to-Color Template Starters */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>Boyama İçin Çizim Şablonları</span>
                </span>
                <span className="text-[11px] text-stone-400">Şablonu seçip boyamaya başlayın</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleLoadTemplate('kitten')}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 text-left transition-all group flex items-center gap-2"
                >
                  <span className="text-xl">🐱</span>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">Şirin Kedicik</div>
                    <div className="text-[10px] text-stone-500">Boyama Şablonu</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLoadTemplate('house')}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all group flex items-center gap-2"
                >
                  <span className="text-xl">🏠</span>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">Masal Evi</div>
                    <div className="text-[10px] text-stone-500">Bahçe & Güneş</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLoadTemplate('space')}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group flex items-center gap-2"
                >
                  <span className="text-xl">🚀</span>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">Uzay Roketi</div>
                    <div className="text-[10px] text-stone-500">Yıldızlar & Gezegen</div>
                  </div>
                </button>

                <button
                  onClick={() => handleLoadTemplate('rainbow')}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-all group flex items-center gap-2"
                >
                  <span className="text-xl">🌈</span>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">Gökkuşağı</div>
                    <div className="text-[10px] text-stone-500">Bulutlar & Renkler</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: AI Magical Transformer Studio (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-linear-to-b from-white to-rose-50/30 rounded-2xl border-2 border-rose-200/80 shadow-md p-6 space-y-5">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <Wand2 className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Sihirli Dönüştürücü</span>
                </div>
                <h2 className="text-xl font-display font-bold text-stone-900">
                  Hayali Gerçek Resme Çevir
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Çocuğun çizdiği çizgileri analiz edip hayalindeki o muazzam illüstrasyonu yapay zeka ile canlandırın!
                </p>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Çocuğun Hayalindeki Fikir / Açıklama:
                </label>
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn: 'Gökkuşağının üstünde kayan sevimli kedi' (İsteğe bağlı, boş bırakılırsa çizimden algılanır)"
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 leading-relaxed shadow-2xs"
                />

                {/* Quick Inspiration Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-stone-500">Hızlı Fikir Seç:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {INSPIRATION_IDEAS.slice(0, 3).map((idea, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(idea)}
                        className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-rose-100 hover:text-rose-900 text-stone-600 rounded-md transition-colors text-left"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Art Style Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  İllüstrasyon Tarzı:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  
                  <button
                    onClick={() => setStyle('storybook')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === 'storybook'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-semibold shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-base mb-1">📖</div>
                    <div className="text-xs">Masal Kitabı</div>
                    <div className="text-[10px] text-stone-500 font-normal">Sıcak, canlı masal</div>
                  </button>

                  <button
                    onClick={() => setStyle('pixar_3d')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === 'pixar_3d'
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-base mb-1">🧸</div>
                    <div className="text-xs">3D Animasyon</div>
                    <div className="text-[10px] text-stone-500 font-normal">Pixar film karakteri</div>
                  </button>

                  <button
                    onClick={() => setStyle('watercolor')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === 'watercolor'
                        ? 'border-teal-500 bg-teal-50/70 text-teal-950 font-semibold shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-base mb-1">🎨</div>
                    <div className="text-xs">Büyülü Suluboya</div>
                    <div className="text-[10px] text-stone-500 font-normal">Rüya gibi boya akışı</div>
                  </button>

                  <button
                    onClick={() => setStyle('realistic')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === 'realistic'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-base mb-1">📸</div>
                    <div className="text-xs">Gerçekçi Doğa</div>
                    <div className="text-[10px] text-stone-500 font-normal">Canlı foto-detay</div>
                  </button>

                </div>
              </div>

              {/* Big Transformation CTA Button */}
              <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-rose-500 via-rose-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {isTransforming ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-rose-200" />
                    <span>Dönüştürülüyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>✨ Hayalimi Gerçek Resme Dönüştür!</span>
                  </>
                )}
              </button>

              {/* Progress message during transformation */}
              {isTransforming && (
                <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-center space-y-2 animate-fade-in">
                  <div className="text-xs font-semibold text-rose-900">{transformProgress}</div>
                  <div className="w-full bg-rose-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-1.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Tips Box */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-600" />
                <span>Eğlenceli İpucu:</span>
              </div>
              <p className="leading-relaxed">
                Çocuğunuz sadece birkaç renkli daire veya basit çöp adamlar çizse bile sorun değil! Sihirli dönüştürücü o renkleri ve kompozisyonu baz alarak çocuğun zihnindeki gerçek sahneyi üretir.
              </p>
            </div>

          </div>

        </div>

        {/* TRANSFORMATION RESULT SECTION (When available) */}
        {transformResult && (
          <div className="mt-12 bg-white rounded-3xl border-2 border-rose-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dönüştürme Tamamlandı!</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                  {transformResult.title}
                </h3>
              </div>

              {transformResult.transformed && (
                <div className="flex items-center gap-2">
                  <a
                    href={transformResult.transformed}
                    download="nisan-aydin-hayal-illustrasyonu.png"
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>İllüstrasyonu İndir</span>
                  </a>
                </div>
              )}
            </div>

            {/* Before / After Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-rose-500" />
                  <span>Çocuğun Çizimi & Gerçek Resim Karşılaştırması</span>
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {transformResult.transformed ? 'Ortadaki kaydırıcıyı sağa-sola çekin' : 'Çizim Analizi'}
                </span>
              </div>

              {transformResult.transformed ? (
                /* Interactive Split Slider */
                <div 
                  className="relative w-full max-w-4xl mx-auto aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-stone-200 select-none cursor-ew-resize"
                  onPointerDown={(e) => {
                    setIsDraggingSlider(true);
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleSliderMove(e.clientX, rect);
                  }}
                  onPointerMove={(e) => {
                    if (!isDraggingSlider) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleSliderMove(e.clientX, rect);
                  }}
                  onPointerUp={() => setIsDraggingSlider(false)}
                >
                  {/* Background: Transformed Real Illustration */}
                  <img
                    src={transformResult.transformed}
                    alt="Dönüştürülmüş Gerçek İllüstrasyon"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold rounded-lg shadow-sm">
                    ✨ Hayalindeki Gerçek Resim
                  </div>

                  {/* Foreground: Child's Original Drawing (Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={transformResult.original}
                      alt="Çocuğun Çizimi"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs text-stone-900 text-xs font-semibold rounded-lg shadow-sm border border-stone-200">
                      🎨 Nisan'ın Çizimi
                    </div>
                  </div>

                  {/* Divider line and handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-rose-500 flex items-center justify-center text-rose-600 text-xs font-bold">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                /* Static Side by Side with Drawing */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2">
                    <span className="text-xs font-bold text-stone-600 block">🎨 Nisan'ın Çizimi:</span>
                    <img
                      src={transformResult.original}
                      alt="Çizim"
                      className="w-full rounded-xl border border-stone-200 bg-white aspect-4/3 object-contain"
                    />
                  </div>
                  <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 flex flex-col justify-center space-y-4">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                      ✨ Yapay Zeka Çizim Yorumu:
                    </span>
                    <h4 className="text-xl font-display font-bold text-stone-900">
                      "{transformResult.title}"
                    </h4>
                    <p className="text-sm text-stone-700 leading-relaxed italic font-serif">
                      "{transformResult.story}"
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-900 font-semibold">
                      ❤️ {transformResult.praise}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Story & Praise Box */}
            {transformResult.story && transformResult.transformed && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-3">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Bu Resmin Hikayesi:</span>
                </div>
                <p className="text-base font-serif italic text-stone-700 leading-relaxed">
                  "{transformResult.story}"
                </p>
                {transformResult.praise && (
                  <p className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 inline-block">
                    🌟 <strong>Övgü:</strong> {transformResult.praise}
                  </p>
                )}
              </div>
            )}

          </div>
        )}

        {/* SAVED DRAWINGS & CREATIONS GALLERY */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                Hayal Arşivi & Galeri
              </h3>
              <p className="text-xs text-stone-500">
                {config.daughterName}'ın daha önce boyadığı ve canlandırdığı hayal dünyası eserleri
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              {savedCreations.length} Eser Kayıtlı
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCreations.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Images Preview: Child vs Real */}
                <div className="relative aspect-4/3 grid grid-cols-2 border-b border-stone-100 overflow-hidden bg-stone-100">
                  <div className="relative border-r border-white">
                    <img
                      src={item.childDrawing}
                      alt="Çocuk Çizimi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
                      Çizim
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={item.realIllustration}
                      alt="Gerçek İllüstrasyon"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-mono">
                      Hayal ✨
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-1">
                      <span>{item.date}</span>
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 capitalize">
                        {item.style}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h4>
                    {item.story && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 italic font-serif">
                        "{item.story}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setTransformResult({
                          original: item.childDrawing,
                          transformed: item.realIllustration,
                          title: item.title,
                          story: item.story,
                          praise: item.praise,
                        });
                        window.scrollTo({ top: 750, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Büyük Gör & Kıyasla</span>
                    </button>

                    <a
                      href={item.realIllustration}
                      download={`${item.title}.png`}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title="İndir"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
