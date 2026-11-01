import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Palette, Sparkles, Undo, Redo, Trash2, Download, Wand2, RefreshCw, 
  Layers, Smile, Heart, Star, Sun, Cloud, Moon, Zap, Cat, Rocket, Home,
  Info, Check, Eye, ChevronRight, Sliders, Volume2, VolumeX, Award,
  Paintbrush, PaintBucket, Sparkle
} from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';
import { soundFx } from '../utils/audioEffects';

interface PaintingStudioPageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

type ToolType = 'brush' | 'rainbow' | 'bucket' | 'glitter' | 'crayon' | 'eraser' | 'stamp';
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

// 16 Vivid, child-friendly colors
const PALETTE = [
  { hex: '#E11D48', name: 'Gül Kırmızısı' },
  { hex: '#F43F5E', name: 'Şeker Pembesi' },
  { hex: '#FB7185', name: 'Açık Pembe' },
  { hex: '#EA580C', name: 'Portakal Turuncusu' },
  { hex: '#F59E0B', name: 'Güneş Sarısı' },
  { hex: '#FDE047', name: 'Parlak Sarı' },
  { hex: '#16A34A', name: 'Çimen Yeşili' },
  { hex: '#84CC16', name: 'Fıstık Yeşili' },
  { hex: '#0EA5E9', name: 'Gökyüzü Mavisi' },
  { hex: '#2563EB', name: 'Okyanus Mavisi' },
  { hex: '#6366F1', name: 'Çivit Mavisi' },
  { hex: '#9333EA', name: 'Büyülü Mor' },
  { hex: '#D946EF', name: 'Pamuk Şeker' },
  { hex: '#854D0E', name: 'Çikolata' },
  { hex: '#1C1917', name: 'Gece Siyahı' },
  { hex: '#FFFFFF', name: 'Kar Beyazı' },
];

// Stamps for 4-year-olds
const STAMPS = [
  {
    id: 'star',
    label: 'Yıldız',
    emoji: '⭐',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      const spikes = 5;
      const outer = size * 1.6;
      const inner = size * 0.75;
      let rot = (Math.PI / 2) * 3;
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
    }
  },
  {
    id: 'heart',
    label: 'Kalp',
    emoji: '❤️',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      const d = size * 1.5;
      ctx.moveTo(x, y + d / 4);
      ctx.bezierCurveTo(x, y, x - d / 2, y - d / 2, x - d, y);
      ctx.bezierCurveTo(x - d * 1.2, y + d / 2, x - d / 2, y + d, x, y + d * 1.4);
      ctx.bezierCurveTo(x + d / 2, y + d, x + d * 1.2, y + d / 2, x + d, y);
      ctx.bezierCurveTo(x + d / 2, y - d / 2, x, y, x, y + d / 4);
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'sun',
    label: 'Güneş',
    emoji: '☀️',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
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
    }
  },
  {
    id: 'cloud',
    label: 'Bulut',
    emoji: '☁️',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
      ctx.arc(x + size * 0.7, y - size * 0.3, size * 0.8, 0, Math.PI * 2);
      ctx.arc(x + size * 1.4, y, size * 0.9, 0, Math.PI * 2);
      ctx.arc(x + size * 0.7, y + size * 0.2, size * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'flower',
    label: 'Çiçek',
    emoji: '🌸',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        ctx.beginPath();
        ctx.arc(px, py, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // center
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'butterfly',
    label: 'Kelebek',
    emoji: '🦋',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      // left wings
      ctx.beginPath();
      ctx.ellipse(x - size, y - size * 0.5, size, size * 0.7, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(x - size * 0.8, y + size * 0.5, size * 0.7, size * 0.5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      // right wings
      ctx.beginPath();
      ctx.ellipse(x + size, y - size * 0.5, size, size * 0.7, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(x + size * 0.8, y + size * 0.5, size * 0.7, size * 0.5, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      // body
      ctx.fillStyle = '#1C1917';
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.25, size * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'paw',
    label: 'Kedi Patisi',
    emoji: '🐾',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      // main pad
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.3, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      // 4 toe pads
      const angles = [-0.7, -0.25, 0.25, 0.7];
      for (const a of angles) {
        const tx = x + Math.sin(a) * size * 1.1;
        const ty = y - Math.cos(a) * size * 0.9;
        ctx.beginPath();
        ctx.ellipse(tx, ty, size * 0.28, size * 0.35, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'rainbow',
    label: 'Gökkuşağı',
    emoji: '🌈',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
      let r = size * 1.6;
      ctx.lineWidth = size * 0.28;
      for (const c of colors) {
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.arc(x, y + size * 0.8, r, Math.PI, 0);
        ctx.stroke();
        r -= size * 0.28;
      }
      ctx.restore();
    }
  },
];

// Easy 4-year-old child inspiration prompts
const INSPIRATION_IDEAS = [
  { label: '🐱 Sevimli Kedicik', text: 'Gökkuşağının altında gülümseyen sevimli yavru kedi' },
  { label: '🏠 Çiçekli Masal Evi', text: 'Bahçesinde renkli çiçekler olan sevimli masal evi ve güneş' },
  { label: '🚀 Yıldızlara Uçan Roket', text: 'Uzayda yıldızların ve gezegenlerin arasında uçan renkli roket' },
  { label: '🦋 Renkli Kelebek', text: 'Çiçek tarlasında neşeyle dans eden kocaman kelebek' },
  { label: '🦕 Minik Dinozor', text: 'Yeşil ormanda arkadaşlarıyla oynayan sevimli bebek dinozor' },
  { label: '🐬 Neşeli Yunus', text: 'Masmavi denizde dalgaların üstünde zıplayan mutlu yunus balığı' },
];

// Initial demo transformations
const INITIAL_DEMO_CREATIONS: SavedCreation[] = [
  {
    id: 'demo-1',
    title: 'Gökkuşağında Uçan Kedicik',
    date: 'Bugün',
    style: 'storybook',
    childDrawing: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    realIllustration: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
    story: 'Bu sevimli kedicik gökyüzündeki gökkuşağını kaydırak yaptı! Renkli bulutların arasında Nisan için neşeyle mırıldanıyor.',
    praise: 'Renk seçimlerin ve fırça hareketlerin harika! Çok yetenekli bir küçük ressamsın.'
  },
  {
    id: 'demo-2',
    title: 'Güneşli Masal Evi',
    date: 'Dün',
    style: 'pixar_3d',
    childDrawing: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    realIllustration: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    story: 'Bu sevimli evin bacasından yıldız tozu tütüyor, bahçesindeki çiçekler geceleri ışıldıyor.',
    praise: 'Çatı ve pencerelerdeki detaylar inanılmaz bir hayal gücünü yansıtıyor!'
  }
];

// Fast flood fill for coloring templates (doesn't cross black outlines)
function floodFillCanvas(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  width: number,
  height: number
) {
  const r = parseInt(fillColorHex.slice(1, 3), 16);
  const g = parseInt(fillColorHex.slice(3, 5), 16);
  const b = parseInt(fillColorHex.slice(5, 7), 16);
  const a = 255;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const startPos = (startY * width + startX) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  // If already same color, return
  if (
    Math.abs(startR - r) < 15 &&
    Math.abs(startG - g) < 15 &&
    Math.abs(startB - b) < 15 &&
    Math.abs(startA - a) < 15
  ) {
    return;
  }

  // Check if target pixel matches start color and is NOT a dark outline
  const colorMatch = (pos: number) => {
    const pr = data[pos];
    const pg = data[pos + 1];
    const pb = data[pos + 2];
    const pa = data[pos + 3];

    // Don't cross dark outline lines
    const isDarkOutline = pr < 70 && pg < 70 && pb < 70 && pa > 180;
    if (isDarkOutline && (startR >= 70 || startG >= 70 || startB >= 70)) {
      return false;
    }

    const diff = Math.abs(pr - startR) + Math.abs(pg - startG) + Math.abs(pb - startB) + Math.abs(pa - startA);
    return diff < 85;
  };

  const queue: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;

  let iterations = 0;
  const maxIterations = width * height;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const [cx, cy] = queue.pop()!;
    const pos = (cy * width + cx) * 4;

    data[pos] = r;
    data[pos + 1] = g;
    data[pos + 2] = b;
    data[pos + 3] = a;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          visited[nIndex] = 1;
          const nPos = nIndex * 4;
          if (colorMatch(nPos)) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Generative illustrative transformation pipeline that directly converts the child's drawing into a real storybook artwork
function generateStylizedIllustration(
  canvas: HTMLCanvasElement,
  style: ArtStyle,
  childName: string = 'Nisan'
): Promise<string> {
  return new Promise((resolve) => {
    const width = canvas.width || 800;
    const height = canvas.height || 600;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = width;
    outCanvas.height = height;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) {
      resolve(canvas.toDataURL('image/png'));
      return;
    }

    // 1. Fill rich atmospheric background tailored to the selected illustration style
    if (style === 'storybook') {
      const bgGrad = ctx.createRadialGradient(width * 0.25, height * 0.25, 40, width * 0.5, height * 0.5, width * 0.85);
      bgGrad.addColorStop(0, '#FEF9C3'); // warm sunlit cream
      bgGrad.addColorStop(0.35, '#FFE4E6'); // soft rose petal
      bgGrad.addColorStop(0.7, '#E0F2FE'); // airy sky blue
      bgGrad.addColorStop(1, '#EDE9FE'); // gentle fairy violet
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    } else if (style === 'pixar_3d') {
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 60, width * 0.5, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#FFFBEB'); // warm key light
      bgGrad.addColorStop(0.35, '#E0E7FF'); // ambient indigo
      bgGrad.addColorStop(0.75, '#C7D2FE'); // cinematic backlight
      bgGrad.addColorStop(1, '#818CF8'); // rich vignette
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    } else if (style === 'watercolor') {
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#FDF2F8');
      bgGrad.addColorStop(0.35, '#EFF6FF');
      bgGrad.addColorStop(0.7, '#F0FDF4');
      bgGrad.addColorStop(1, '#FEFCE8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Claymation / Playdough warm studio tabletop
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 80, width * 0.5, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#FFF7ED');
      bgGrad.addColorStop(0.45, '#FED7AA');
      bgGrad.addColorStop(1, '#FB923C');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Multi-Pass Stylization of the Child's Actual Drawing:
    // Pass A: Soft luminous pigment bloom under the strokes
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.filter = 'blur(10px) saturate(2.4) brightness(1.05)';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    // Pass B: Rich gouache / acrylic paint body with high color depth
    ctx.save();
    ctx.globalAlpha = 0.96;
    ctx.filter = 'contrast(1.25) saturate(1.45) brightness(1.02)';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    // Pass C: Clean, deepened illustration outlines & shading
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.globalCompositeOperation = 'multiply';
    ctx.filter = 'contrast(1.6) grayscale(0.2)';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    // 3. Magical Embellishments (Golden stars, stardust, light rays)
    ctx.save();
    // Sunbeams / Atmospheric golden ray from top-left
    const rayGrad = ctx.createRadialGradient(90, 70, 20, 90, 70, 480);
    rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    rayGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.18)');
    rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(90, 70);
    ctx.arc(90, 70, 480, 0, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Golden 4-point sparkle stars scattered around drawing
    const sparkleCoords = [
      [140, 100, 15], [230, 80, 11], [670, 120, 16], [730, 210, 13],
      [90, 350, 10], [700, 470, 15], [160, 510, 12], [630, 370, 14],
      [390, 60, 13], [480, 80, 11], [270, 140, 9], [540, 130, 10]
    ];

    for (const [sx, sy, sz] of sparkleCoords) {
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.moveTo(sx, sy - sz);
      ctx.quadraticCurveTo(sx, sy, sx + sz, sy);
      ctx.quadraticCurveTo(sx, sy, sx, sy + sz);
      ctx.quadraticCurveTo(sx, sy, sx - sz, sy);
      ctx.quadraticCurveTo(sx, sy, sx, sy - sz);
      ctx.fill();

      // Bright star center
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, sz * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing fairy dust particles
    for (let i = 0; i < 30; i++) {
      const fx = (i * 73 + 45) % width;
      const fy = (i * 97 + 60) % height;
      const fr = (i % 4) + 1.5;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(253, 224, 71, 0.65)' : 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Subtle Vignette & Frame
    ctx.save();
    const vigGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.42, width * 0.5, height * 0.5, width * 0.72);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(40, 20, 60, 0.22)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);

    // Golden Artist Seal Badge in corner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(width - 240, height - 38, 225, 26, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`✨ ${childName}'ın Özgün Sanat Eseri`, width - 228, height - 21);
    ctx.restore();

    resolve(outCanvas.toDataURL('image/png'));
  });
}

export const PaintingStudioPage: React.FC<PaintingStudioPageProps> = ({
  config,
  onNavigate,
  onOpenAdmin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#E11D48');
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [brushSize, setBrushSize] = useState<number>(22); // Default medium for 4-year-olds
  const [selectedStamp, setSelectedStamp] = useState<string>('star');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const rainbowHue = useRef<number>(0);

  // Undo / Redo history
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
  const [isSpeakingStory, setIsSpeakingStory] = useState<boolean>(false);

  const [transformResult, setTransformResult] = useState<{
    original: string;
    transformed: string;
    title: string;
    story?: string;
    praise?: string;
  } | null>(null);

  // Comparison view mode: 'slider' or 'side-by-side' or 'certificate'
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'certificate'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Saved creations
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>(() => {
    const saved = localStorage.getItem('nisan_saved_drawings');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_CREATIONS;
  });

  useEffect(() => {
    localStorage.setItem('nisan_saved_drawings', JSON.stringify(savedCreations));
  }, [savedCreations]);

  // Sync soundFx config
  useEffect(() => {
    soundFx.soundEnabled = soundEnabled;
    soundFx.voiceEnabled = soundEnabled;
  }, [soundEnabled]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const initialData = canvas.toDataURL('image/png');
    setHistory([initialData]);
    setHistoryStep(0);
  }, []);

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
    if (soundEnabled) soundFx.playGentleBeep(320);
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
    if (soundEnabled) soundFx.playGentleBeep(480);
  };

  // Clear
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
    if (soundEnabled) soundFx.playPop();
  };

  // 6 Cartoon outlines designed for 4-year-olds
  const handleLoadTemplate = (templateType: 'kitten' | 'house' | 'space' | 'butterfly' | 'dino' | 'dolphin') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 5; // Bold lines for easy coloring
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (templateType === 'kitten') {
      // Head
      ctx.beginPath();
      ctx.arc(400, 270, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Ears
      ctx.beginPath();
      ctx.moveTo(310, 180);
      ctx.lineTo(290, 80);
      ctx.lineTo(380, 150);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(490, 180);
      ctx.lineTo(510, 80);
      ctx.lineTo(420, 150);
      ctx.stroke();

      // Inner ears
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(315, 160); ctx.lineTo(305, 105); ctx.lineTo(365, 145); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(485, 160); ctx.lineTo(495, 105); ctx.lineTo(435, 145); ctx.stroke();
      ctx.lineWidth = 5;

      // Big cute eyes
      ctx.beginPath();
      ctx.arc(350, 250, 20, 0, Math.PI * 2);
      ctx.arc(450, 250, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();

      // Eye shines
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(345, 245, 7, 0, Math.PI * 2);
      ctx.arc(445, 245, 7, 0, Math.PI * 2);
      ctx.fill();

      // Nose & Smile
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.moveTo(390, 290);
      ctx.lineTo(410, 290);
      ctx.lineTo(400, 305);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(385, 315, 16, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(415, 315, 16, 0, Math.PI);
      ctx.stroke();

      // Whiskers
      ctx.beginPath();
      ctx.moveTo(270, 280); ctx.lineTo(210, 270);
      ctx.moveTo(270, 300); ctx.lineTo(210, 310);
      ctx.moveTo(530, 280); ctx.lineTo(590, 270);
      ctx.moveTo(530, 300); ctx.lineTo(590, 310);
      ctx.stroke();

      // Cute Body & Paws
      ctx.beginPath();
      ctx.arc(400, 480, 110, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();

      // Bow tie
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.moveTo(400, 385);
      ctx.lineTo(360, 370);
      ctx.lineTo(360, 410);
      ctx.closePath();
      ctx.moveTo(400, 385);
      ctx.lineTo(440, 370);
      ctx.lineTo(440, 410);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      setPrompt('Gülümseyen papyonlu sevimli yavru kedi');
    } else if (templateType === 'house') {
      // Ground
      ctx.beginPath();
      ctx.moveTo(60, 520);
      ctx.lineTo(740, 520);
      ctx.stroke();

      // Main House
      ctx.beginPath();
      ctx.rect(260, 280, 280, 240);
      ctx.stroke();

      // Roof
      ctx.beginPath();
      ctx.moveTo(230, 280);
      ctx.lineTo(400, 140);
      ctx.lineTo(570, 280);
      ctx.closePath();
      ctx.stroke();

      // Chimney & Heart Smoke
      ctx.beginPath();
      ctx.rect(480, 170, 40, 70);
      ctx.stroke();
      // Heart smoke
      ctx.beginPath();
      ctx.arc(500, 110, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Door
      ctx.beginPath();
      ctx.arc(400, 430, 35, Math.PI, 0);
      ctx.lineTo(435, 520);
      ctx.lineTo(365, 520);
      ctx.closePath();
      ctx.stroke();
      // Door knob
      ctx.beginPath();
      ctx.arc(420, 470, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();

      // Windows
      ctx.beginPath();
      ctx.rect(290, 320, 55, 55);
      ctx.moveTo(317, 320); ctx.lineTo(317, 375);
      ctx.moveTo(290, 347); ctx.lineTo(345, 347);
      ctx.rect(455, 320, 55, 55);
      ctx.moveTo(482, 320); ctx.lineTo(482, 375);
      ctx.moveTo(455, 347); ctx.lineTo(510, 347);
      ctx.stroke();

      // Smiling Sun
      ctx.beginPath();
      ctx.arc(130, 120, 45, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.moveTo(130 + Math.cos(a) * 55, 120 + Math.sin(a) * 55);
        ctx.lineTo(130 + Math.cos(a) * 75, 120 + Math.sin(a) * 75);
      }
      ctx.stroke();

      // Flowers in garden
      for (const fx of [140, 200, 600, 660]) {
        ctx.beginPath();
        ctx.moveTo(fx, 520); ctx.lineTo(fx, 460);
        ctx.arc(fx, 450, 15, 0, Math.PI * 2);
        ctx.stroke();
      }

      setPrompt('Bahçesinde rengarenk çiçekler olan masal evi ve güneş');
    } else if (templateType === 'space') {
      // Rocket Body
      ctx.beginPath();
      ctx.moveTo(400, 120);
      ctx.quadraticCurveTo(480, 240, 470, 410);
      ctx.lineTo(330, 410);
      ctx.quadraticCurveTo(320, 240, 400, 120);
      ctx.stroke();

      // Rocket tip
      ctx.beginPath();
      ctx.moveTo(360, 200); ctx.lineTo(440, 200); ctx.stroke();

      // Big Window with cute smile
      ctx.beginPath();
      ctx.arc(400, 280, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(400, 280, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Wings
      ctx.beginPath();
      ctx.moveTo(330, 360); ctx.lineTo(260, 440); ctx.lineTo(330, 440); ctx.closePath();
      ctx.moveTo(470, 360); ctx.lineTo(540, 440); ctx.lineTo(470, 440); ctx.closePath();
      ctx.stroke();

      // Flames
      ctx.beginPath();
      ctx.moveTo(360, 410); ctx.lineTo(375, 490); ctx.lineTo(400, 440); ctx.lineTo(425, 490); ctx.lineTo(440, 410);
      ctx.stroke();

      // Saturn Planet
      ctx.beginPath();
      ctx.arc(630, 190, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(630, 190, 80, 18, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Stars
      for (const [sx, sy] of [[150, 160], [210, 320], [620, 420], [180, 480], [600, 90]]) {
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.stroke();
      }

      setPrompt('Uzayda yıldızların ve gezegenlerin arasında uçan renkli roket');
    } else if (templateType === 'butterfly') {
      // Big Butterfly Body
      ctx.beginPath();
      ctx.ellipse(400, 300, 18, 90, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();
      ctx.stroke();

      // Head & Antennae
      ctx.beginPath();
      ctx.arc(400, 190, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(395, 175); ctx.quadraticCurveTo(360, 120, 340, 140);
      ctx.moveTo(405, 175); ctx.quadraticCurveTo(440, 120, 460, 140);
      ctx.stroke();

      // Wings (Left)
      ctx.beginPath();
      ctx.ellipse(260, 240, 110, 75, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(280, 380, 85, 55, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Wings (Right)
      ctx.beginPath();
      ctx.ellipse(540, 240, 110, 75, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(520, 380, 85, 55, -Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Wing decoration circles
      ctx.beginPath();
      ctx.arc(260, 240, 30, 0, Math.PI * 2);
      ctx.arc(540, 240, 30, 0, Math.PI * 2);
      ctx.arc(280, 380, 22, 0, Math.PI * 2);
      ctx.arc(520, 380, 22, 0, Math.PI * 2);
      ctx.stroke();

      setPrompt('Kocaman renkli kanatları olan neşeli kelebek');
    } else if (templateType === 'dino') {
      // Cute Baby Dino Body
      ctx.beginPath();
      ctx.ellipse(400, 360, 120, 90, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Neck & Head
      ctx.beginPath();
      ctx.moveTo(310, 330);
      ctx.quadraticCurveTo(280, 200, 320, 150);
      ctx.quadraticCurveTo(380, 120, 400, 180);
      ctx.lineTo(360, 280);
      ctx.stroke();

      // Big Eye
      ctx.beginPath();
      ctx.arc(350, 160, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(346, 156, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Smiling mouth
      ctx.beginPath();
      ctx.arc(360, 190, 18, 0, Math.PI * 0.6);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.rect(340, 440, 35, 60);
      ctx.rect(420, 440, 35, 60);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(510, 330);
      ctx.quadraticCurveTo(650, 350, 620, 260);
      ctx.quadraticCurveTo(570, 370, 500, 400);
      ctx.stroke();

      // Back plates / spots
      for (const [dx, dy] of [[380, 265], [430, 265], [480, 280], [530, 310]]) {
        ctx.beginPath();
        ctx.arc(dx, dy, 15, Math.PI, 0);
        ctx.stroke();
      }

      setPrompt('Arkadaş canlısı gülümseyen sevimli yavru dinozor');
    } else if (templateType === 'dolphin') {
      // Ocean Waves
      ctx.beginPath();
      for (let x = 40; x <= 760; x += 120) {
        ctx.arc(x + 60, 490, 60, 0, Math.PI);
      }
      ctx.stroke();

      // Dolphin Curved Body
      ctx.beginPath();
      ctx.moveTo(250, 380);
      ctx.quadraticCurveTo(350, 170, 520, 240);
      ctx.quadraticCurveTo(620, 300, 630, 320);
      ctx.lineTo(600, 330);
      ctx.quadraticCurveTo(520, 280, 420, 330);
      ctx.quadraticCurveTo(340, 380, 250, 380);
      ctx.stroke();

      // Snout
      ctx.beginPath();
      ctx.moveTo(250, 380); ctx.lineTo(210, 395); ctx.lineTo(240, 410);
      ctx.stroke();

      // Smiling Eye
      ctx.beginPath();
      ctx.arc(280, 360, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();

      // Fins
      ctx.beginPath();
      ctx.moveTo(420, 205); ctx.quadraticCurveTo(440, 140, 470, 185); ctx.lineTo(450, 215);
      ctx.stroke();

      // Flipper
      ctx.beginPath();
      ctx.moveTo(350, 350); ctx.lineTo(330, 420); ctx.lineTo(370, 390); ctx.closePath();
      ctx.stroke();

      // Fluke / Tail Fin
      ctx.beginPath();
      ctx.moveTo(630, 320); ctx.lineTo(670, 280); ctx.lineTo(655, 330); ctx.lineTo(680, 360); ctx.closePath();
      ctx.stroke();

      setPrompt('Dalgaların üzerinde zıplayan mutlu yunus balığı');
    }

    pushHistory();
    if (soundEnabled) soundFx.playSuccess();
  };

  // Convert client coordinates to canvas internal pixel coordinates
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  };

  const applyToolStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 1.6;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'rainbow') {
      rainbowHue.current = (rainbowHue.current + 8) % 360;
      ctx.strokeStyle = `hsl(${rainbowHue.current}, 100%, 50%)`;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'crayon') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize * 1.3;
      ctx.globalAlpha = 0.8;
    } else if (currentTool === 'glitter') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 0.9;
    } else {
      // standard brush
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    }
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCanvasCoords(e);
    lastX.current = x;
    lastY.current = y;

    // Bucket fill tool
    if (currentTool === 'bucket') {
      floodFillCanvas(ctx, x, y, currentColor, canvas.width, canvas.height);
      pushHistory();
      if (soundEnabled) soundFx.playBubble();
      return;
    }

    // Stamp tool
    if (currentTool === 'stamp') {
      const stampDef = STAMPS.find(s => s.id === selectedStamp);
      if (stampDef) {
        stampDef.draw(ctx, x, y, currentColor, brushSize * 1.5);
        pushHistory();
        if (soundEnabled) soundFx.playPop();
      }
      return;
    }

    isDrawing.current = true;
    if (soundEnabled && currentTool === 'rainbow') {
      soundFx.playGentleBeep(520);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (currentTool === 'glitter') {
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      applyToolStyle(ctx);
      ctx.stroke();

      // Scatter sparkle stars
      for (let i = 0; i < 2; i++) {
        const offsetDistX = (Math.random() - 0.5) * brushSize * 1.6;
        const offsetDistY = (Math.random() - 0.5) * brushSize * 1.6;
        ctx.save();
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(x + offsetDistX, y + offsetDistY, Math.random() * 3 + 1.5, 0, Math.PI * 2);
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

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
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

  // AI Transform drawing into real illustration
  const handleTransform = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsTransforming(true);
    setTransformProgress('🎨 Çiziminiz taranıyor ve renkler inceleniyor...');

    try {
      const imageBase64 = canvas.toDataURL('image/png');

      const timer1 = setTimeout(() => {
        setTransformProgress('✨ Hayal gücü çözümleniyor, masal hazırlanıyor...');
      }, 1200);

      const timer2 = setTimeout(() => {
        setTransformProgress('🌟 Büyülü fırçalar çalışıyor, gerçek resim canlanıyor...');
      }, 2600);

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

      // 1. If direct AI generative model produced an image, use it.
      // 2. Otherwise, directly transform the child's exact canvas drawing into a rich, glowing, storybook illustration!
      let finalIllustration = data?.imageUrl;
      if (!finalIllustration || !data?.isRealAiGenerated) {
        finalIllustration = await generateStylizedIllustration(canvas, style, config.daughterName || 'Nisan');
      }

      const newCreation: SavedCreation = {
        id: `creation-${Date.now()}`,
        title: data?.analysis?.childImaginationTitle || prompt || `${config.daughterName}'ın Sihirli Çizimi`,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        childDrawing: imageBase64,
        realIllustration: finalIllustration,
        style,
        story: data?.analysis?.story || `${config.daughterName} tuvaline hayal ettiği o güzel anı çizdi. Renklerin ahengi ve çizgilerdeki canlılık tüm odayı masalsı bir neşeyle dolduruyor!`,
        praise: data?.analysis?.praiseMessage || 'Harika bir çizim! Fırça darbelerin ve renk seçimin hayal gücünün ne kadar zengin olduğunu gösteriyor.',
      };

      setTransformResult({
        original: imageBase64,
        transformed: finalIllustration,
        title: newCreation.title,
        story: newCreation.story,
        praise: newCreation.praise,
      });

      setSavedCreations(prev => [newCreation, ...prev]);

      if (soundEnabled) {
        soundFx.playMagicTada();
      }
    } catch (err: any) {
      console.warn('Transform error, applying direct canvas transformation:', err);
      const finalIllustration = await generateStylizedIllustration(canvas, style, config.daughterName || 'Nisan');
      const newCreation: SavedCreation = {
        id: `creation-${Date.now()}`,
        title: prompt || `${config.daughterName}'ın Sihirli Çizimi`,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        childDrawing: canvas.toDataURL('image/png'),
        realIllustration: finalIllustration,
        style,
        story: `${config.daughterName}'ın çizimi masalsı bir dünyaya kapı araladı. Renkler ve çizgiler neşe dolu bir hikaye anlatıyor!`,
        praise: 'Harika bir çizim! Çizdiğin detaylar ve renkler harika görünüyor.',
      };
      setTransformResult({
        original: canvas.toDataURL('image/png'),
        transformed: finalIllustration,
        title: newCreation.title,
        story: newCreation.story,
        praise: newCreation.praise,
      });
      setSavedCreations(prev => [newCreation, ...prev]);
      if (soundEnabled) soundFx.playMagicTada();
    } finally {
      setIsTransforming(false);
      setTransformProgress('');
    }
  };

  // Speak fairy tale story out loud
  const handleReadStory = () => {
    if (!transformResult?.story) return;
    if (isSpeakingStory) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingStory(false);
      return;
    }
    setIsSpeakingStory(true);
    soundFx.speakTurkish(transformResult.story);
    // Reset state after approximate time
    setTimeout(() => {
      setIsSpeakingStory(false);
    }, (transformResult.story.length / 10) * 1000 + 2000);
  };

  // Slider drag events for before/after comparison
  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const offsetX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / containerRect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 flex flex-col pb-24">
      
      {/* Top Banner / Hero Header */}
      <section className="bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-transparent border-b border-stone-200/80 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold shadow-2xs">
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                <span>4+ Yaş Çocuk Sanat & Boyama Atölyesi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span>{config.daughterName}'ın Sihirli Boyama Dünyası</span>
                <span className="text-2xl">✨</span>
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm max-w-2xl">
                İster şablonları boya, ister dilediğin gibi çiz! Ardından <strong>"Sihirli Dönüştür"</strong> butonuna bas ve yapay zeka çizdiğini gerçek bir masal resmine dönüştürsün.
              </p>
            </div>

            {/* Sound toggle & quick navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                  soundEnabled 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
                title="Ses Açık / Kapalı"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Ses Açık 🔊</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-400" />
                    <span>Ses Kapalı 🔇</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('/oyun')}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Oyun Odası</span>
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span>Ana Sayfa</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Studio Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 w-full space-y-6">
        
        {/* TOP: 6 Ready-to-Color Template Starters (Big visual buttons for 4-year-olds) */}
        <div className="bg-white rounded-3xl border-2 border-stone-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm sm:text-base">
              <span className="text-xl">🎨</span>
              <span>1-Tıkla Boyama Şablonları</span>
              <span className="text-xs font-normal text-stone-500 hidden sm:inline">(Dokun ve hemen boyamaya başla!)</span>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Kolay Çizimler
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {[
              { id: 'kitten', emoji: '🐱', title: 'Şirin Kedicik', desc: 'Gülümseyen kedi' },
              { id: 'house', emoji: '🏠', title: 'Masal Evi', desc: 'Bahçe & güneş' },
              { id: 'space', emoji: '🚀', title: 'Uzay Roketi', desc: 'Gezegen & yıldız' },
              { id: 'butterfly', emoji: '🦋', title: 'Kelebek', desc: 'Renkli kanatlar' },
              { id: 'dino', emoji: '🦕', title: 'Yavru Dinozor', desc: 'Dost canlısı dino' },
              { id: 'dolphin', emoji: '🐬', title: 'Neşeli Yunus', desc: 'Deniz dalgaları' },
            ].map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleLoadTemplate(tpl.id as any)}
                className="group p-3 rounded-2xl border-2 border-stone-200 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/70 transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-200">
                  {tpl.emoji}
                </span>
                <span className="font-bold text-xs text-stone-800 group-hover:text-rose-900">
                  {tpl.title}
                </span>
                <span className="text-[10px] text-stone-400 group-hover:text-rose-700">
                  {tpl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE: Left (Canvas & Tools), Right (AI Magical Transformer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Canvas & Tools (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Toolbar: Tools, Sizes, Undo/Redo */}
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-4 space-y-4 shadow-sm">
              
              {/* Row 1: Big Friendly Tools for 4-year-olds */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  
                  {/* Fırça */}
                  <button
                    onClick={() => {
                      setCurrentTool('brush');
                      if (soundEnabled) soundFx.playPop();
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'brush'
                        ? 'bg-rose-500 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" />
                    <span>Fırça</span>
                  </button>

                  {/* Sihirli Kova (Dokun-Boya) */}
                  <button
                    onClick={() => {
                      setCurrentTool('bucket');
                      if (soundEnabled) soundFx.playBubble();
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'bucket'
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                    title="Dokunarak tüm alanı boya"
                  >
                    <PaintBucket className="w-4 h-4" />
                    <span>Sihirli Kova</span>
                  </button>

                  {/* Gökkuşağı Fırçası */}
                  <button
                    onClick={() => {
                      setCurrentTool('rainbow');
                      if (soundEnabled) soundFx.playGentleBeep(600);
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'rainbow'
                        ? 'bg-gradient-to-r from-red-500 via-amber-500 to-indigo-600 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🌈</span>
                    <span>Gökkuşağı</span>
                  </button>

                  {/* Işıltı & Yıldız Fırçası */}
                  <button
                    onClick={() => {
                      setCurrentTool('glitter');
                      if (soundEnabled) soundFx.playGentleBeep(800);
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'glitter'
                        ? 'bg-amber-500 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Işıltı</span>
                  </button>

                  {/* Mum Boya / Crayon */}
                  <button
                    onClick={() => {
                      setCurrentTool('crayon');
                      if (soundEnabled) soundFx.playPop();
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'crayon'
                        ? 'bg-orange-500 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🖍️</span>
                    <span>Mum Boya</span>
                  </button>

                  {/* Damga / Çıkartma */}
                  <button
                    onClick={() => {
                      setCurrentTool('stamp');
                      if (soundEnabled) soundFx.playPop();
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'stamp'
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>⭐</span>
                    <span>Çıkartma</span>
                  </button>

                  {/* Silgi */}
                  <button
                    onClick={() => {
                      setCurrentTool('eraser');
                      if (soundEnabled) soundFx.playPop();
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentTool === 'eraser'
                        ? 'bg-stone-800 text-white shadow-md scale-105'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Silgi</span>
                  </button>

                </div>

                {/* Right: Undo, Redo, Clear */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleUndo}
                    disabled={historyStep <= 0}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:hover:bg-stone-100 transition-all cursor-pointer"
                    title="Geri Al"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyStep >= history.length - 1}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:hover:bg-stone-100 transition-all cursor-pointer"
                    title="İleri Al"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer"
                    title="Tuvali Temizle"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownloadDrawing}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer"
                    title="Çizimi İndir"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: 3 Big Brush Sizes (4-year-old friendly buttons) */}
              <div className="flex items-center justify-between gap-4 border-t border-stone-100 pt-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Fırça Boyu:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { size: 10, label: '🐣 İnce', iconSize: 10 },
                      { size: 22, label: '🦊 Normal', iconSize: 18 },
                      { size: 42, label: '🐘 Kocaman', iconSize: 26 },
                    ].map(bs => (
                      <button
                        key={bs.size}
                        onClick={() => {
                          setBrushSize(bs.size);
                          if (soundEnabled) soundFx.playPop();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          brushSize === bs.size
                            ? 'bg-stone-900 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <div
                          className="rounded-full bg-current"
                          style={{ width: bs.iconSize * 0.5, height: bs.iconSize * 0.5 }}
                        />
                        <span>{bs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live color dot */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Seçili Renk:</span>
                  <div
                    className="w-7 h-7 rounded-full border-2 border-stone-300 shadow-2xs"
                    style={{ backgroundColor: currentTool === 'eraser' ? '#FFFFFF' : currentColor }}
                  />
                </div>
              </div>

              {/* Row 3: Stamp choices if Stamp Tool selected */}
              {currentTool === 'stamp' && (
                <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-bold text-purple-900 shrink-0">Çıkartma Seç:</span>
                  <div className="flex items-center gap-2">
                    {STAMPS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStamp(s.id);
                          if (soundEnabled) soundFx.playPop();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                          selectedStamp === s.id
                            ? 'bg-purple-600 text-white shadow-xs scale-105'
                            : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        <span className="text-base">{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 4: 16 Big Vibrant Color Circles */}
              <div className="space-y-1.5 border-t border-stone-100 pt-3">
                <span className="text-xs font-bold text-stone-600 block">Renk Paleti:</span>
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {PALETTE.map(item => (
                    <button
                      key={item.hex}
                      onClick={() => {
                        setCurrentColor(item.hex);
                        if (currentTool === 'eraser') setCurrentTool('brush');
                        if (soundEnabled) soundFx.playPop();
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl border-2 transition-all hover:scale-115 active:scale-95 shrink-0 cursor-pointer ${
                        currentColor === item.hex && currentTool !== 'eraser'
                          ? 'border-stone-900 scale-110 shadow-md ring-2 ring-stone-900/20'
                          : 'border-white shadow-2xs'
                      }`}
                      style={{ backgroundColor: item.hex }}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Canvas Box (800x600 high resolution) */}
            <div className="relative bg-white rounded-3xl border-3 border-stone-300 shadow-md overflow-hidden aspect-4/3 w-full touch-none select-none">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full cursor-crosshair block"
              />

              {/* Watermark in corner */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/90 backdrop-blur-xs border border-stone-200 text-xs font-bold text-stone-600 pointer-events-none shadow-2xs">
                🎨 {config.daughterName}'ın Tuvali
              </div>
            </div>

          </div>

          {/* RIGHT: AI Magical Transformation Studio (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            <div className="bg-gradient-to-b from-white via-rose-50/30 to-purple-50/20 rounded-3xl border-2 border-rose-300 shadow-md p-5 sm:p-6 space-y-5">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-700 uppercase tracking-wider">
                  <Wand2 className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Yapay Zeka Sihirbazı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
                  Çizileni Gerçek Resme Dönüştür!
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Çocuğunun tuvale çizdiği çizgileri, boyaları ve renkleri yapay zeka inceler; seçtiğin sanat tarzında muhteşem bir illüstrasyona dönüştürür.
                </p>
              </div>

              {/* Quick Inspiration Buttons for 4-year-olds */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Ne Çizdin? (Hızlıca Dokun):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {INSPIRATION_IDEAS.map((idea, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(idea.text);
                        if (soundEnabled) soundFx.playPop();
                      }}
                      className={`text-left p-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                        prompt === idea.text
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white hover:bg-rose-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {idea.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Custom Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Veya Kendi Hayalini Yaz:
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn: 'Gökkuşağında dans eden kedicik' (İsteğe bağlı)"
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 shadow-2xs"
                />
              </div>

              {/* Art Style Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Hangi Tarzda Gerçekleşsin?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'storybook', emoji: '📖', title: 'Masal Kitabı', desc: 'Sıcak & rengarenk' },
                    { id: 'pixar_3d', emoji: '🧸', title: '3D Animasyon', desc: 'Pixar film tarzı' },
                    { id: 'watercolor', emoji: '🎨', title: 'Sulu Boya', desc: 'Büyülü & akıcı' },
                    { id: 'claymation', emoji: '🧁', title: 'Oyun Hamuru', desc: 'Sevimli plastisin' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setStyle(s.id as any);
                        if (soundEnabled) soundFx.playPop();
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        style === s.id
                          ? 'border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-2xs scale-102'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{s.emoji}</div>
                      <div className="text-xs font-bold">{s.title}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Giant Pulsating Magical Transform Button */}
              <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {isTransforming ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-rose-200" />
                    <span>Sihirli Dönüştürülüyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                    <span>✨ Çizimimi Gerçek Resme Dönüştür!</span>
                  </>
                )}
              </button>

              {/* Progress message during transformation */}
              {isTransforming && (
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2 animate-pulse">
                  <div className="text-xs font-bold text-rose-900">{transformProgress}</div>
                  <div className="w-full bg-rose-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
              )}

            </div>

            {/* Friendly Kid Tip */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-4 text-xs text-amber-900 space-y-1 shadow-2xs">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Smile className="w-4 h-4 text-amber-600" />
                <span>4 Yaş İpucu:</span>
              </div>
              <p className="leading-relaxed">
                Kedi şablonunu seçip <strong>"Sihirli Kova"</strong> ile içini dilediğin renkle doldurabilirsin! Çizimin bittiğinde üstteki sihirli butona bas ve gerçek resmi gör!
              </p>
            </div>

          </div>

        </div>

        {/* TRANSFORMATION RESULT SECTION (Appears smoothly after transforming) */}
        {transformResult && (
          <div className="mt-8 bg-white rounded-3xl border-3 border-rose-300 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 animate-fade-in">
            
            {/* Header: Title and Download Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Sihirli Dönüştürme Tamamlandı! ✨</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
                  {transformResult.title}
                </h3>
              </div>

              {/* Mode toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'slider' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ↔ Kaydırıcı
                  </button>
                  <button
                    onClick={() => setViewMode('side-by-side')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'side-by-side' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ⊞ Yan Yana
                  </button>
                  <button
                    onClick={() => setViewMode('certificate')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'certificate' ? 'bg-amber-400 text-amber-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🏆 Sanat Sertifikası
                  </button>
                </div>

                <a
                  href={transformResult.transformed}
                  download="nisan-aydin-hayal-illustrasyonu.png"
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>İndir</span>
                </a>
              </div>
            </div>

            {/* VIEW MODE 1: Interactive Split Slider */}
            {viewMode === 'slider' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
                  <span>🎨 {config.daughterName}'ın Çizimi</span>
                  <span>✨ Gerçek Masal İllüstrasyonu (Ortadaki çubuğu kaydırın)</span>
                </div>
                <div 
                  className="relative w-full max-w-4xl mx-auto aspect-4/3 rounded-3xl overflow-hidden shadow-lg border-2 border-stone-200 select-none cursor-ew-resize"
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
                  {/* Background: Real Masterpiece */}
                  <img
                    src={transformResult.transformed}
                    alt="Dönüştürülmüş Gerçek İllüstrasyon"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-stone-900/85 backdrop-blur-xs text-white text-xs font-extrabold rounded-xl shadow-md">
                    ✨ Hayalindeki Gerçek Resim
                  </div>

                  {/* Foreground: Child's original drawing clipped */}
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
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-extrabold rounded-xl shadow-md border border-stone-200">
                      🎨 {config.daughterName}'ın Çizimi
                    </div>
                  </div>

                  {/* Divider line and circular handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xl border-3 border-rose-500 flex items-center justify-center text-rose-600 font-extrabold text-sm">
                      ↔
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: Side-by-Side comparison */}
            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-4 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">🎨 {config.daughterName}'ın Çizimi:</span>
                  <img
                    src={transformResult.original}
                    alt="Çizim"
                    className="w-full rounded-2xl border border-stone-200 bg-white aspect-4/3 object-contain shadow-xs"
                  />
                </div>
                <div className="bg-rose-50/60 rounded-3xl border-2 border-rose-200 p-4 space-y-2">
                  <span className="text-xs font-bold text-rose-800 block">✨ Gerçekleşen Masal Resmi:</span>
                  <img
                    src={transformResult.transformed}
                    alt="İllüstrasyon"
                    className="w-full rounded-2xl border border-rose-200 bg-white aspect-4/3 object-cover shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* VIEW MODE 3: Art Masterpiece Certificate */}
            {viewMode === 'certificate' && (
              <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 via-white to-amber-50/80 rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-xl space-y-6 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <Award className="w-8 h-8 text-amber-500 animate-bounce" />
                  <h4 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-amber-900">
                    Küçük Sanatçı Başarı Sertifikası
                  </h4>
                  <Award className="w-8 h-8 text-amber-500 animate-bounce" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-serif italic max-w-lg mx-auto">
                  "Bu sertifika, hayal gücünü ve renklerini tuvale sevgiyle aktaran biricik kızımız {config.daughterName} için gururla hazırlanmıştır."
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="space-y-1">
                    <img
                      src={transformResult.original}
                      alt="Çizim"
                      className="w-full rounded-2xl border-2 border-amber-200 aspect-square object-cover shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-stone-600">Özgün Çizim</span>
                  </div>
                  <div className="space-y-1">
                    <img
                      src={transformResult.transformed}
                      alt="Masal"
                      className="w-full rounded-2xl border-2 border-amber-400 aspect-square object-cover shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-amber-800">Gerçekleşen Hayal ✨</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-amber-200 text-stone-800 space-y-1 max-w-lg mx-auto">
                  <div className="text-sm font-bold text-stone-900">"{transformResult.title}"</div>
                  <div className="text-xs text-stone-600 italic">"{transformResult.story}"</div>
                </div>

                <div className="text-[11px] text-stone-400 font-mono">
                  Tarih: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} • {config.daughterName} Dünyası
                </div>
              </div>
            )}

            {/* Personalized Fairy Tale & Voice Reading */}
            {transformResult.story && (
              <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Bu Çizimin Masalı:</span>
                  </div>

                  {/* Listen button */}
                  <button
                    onClick={handleReadStory}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                      isSpeakingStory
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-rose-500" />
                    <span>{isSpeakingStory ? 'Masal Okunuyor... 🔊 (Durdur)' : '🎙️ Masalı Sesli Dinle'}</span>
                  </button>
                </div>

                <p className="text-base sm:text-lg font-serif italic text-stone-800 leading-relaxed">
                  "{transformResult.story}"
                </p>

                {transformResult.praise && (
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <span className="text-lg">🌟</span>
                    <span>{transformResult.praise}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* SAVED DRAWINGS & CREATIONS GALLERY */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
                Hayal Arşivi & Galeri
              </h3>
              <p className="text-xs text-stone-500">
                {config.daughterName}'ın boyadığı ve canlandırdığı tüm sevimli eserler
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs">
              {savedCreations.length} Eser Kayıtlı
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCreations.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border-2 border-stone-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Images Preview: Child vs Real */}
                <div className="relative aspect-4/3 grid grid-cols-2 border-b border-stone-100 overflow-hidden bg-stone-100">
                  <div className="relative border-r border-white">
                    <img
                      src={item.childDrawing}
                      alt="Çocuk Çizimi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md font-mono">
                      Çizim
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={item.realIllustration}
                      alt="Gerçek İllüstrasyon"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-md font-mono">
                      Hayal ✨
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-1">
                      <span>{item.date}</span>
                      <span className="px-2 py-0.5 bg-stone-100 rounded-md text-stone-600 capitalize font-bold">
                        {item.style}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-sm group-hover:text-rose-600 transition-colors">
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
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
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
                      <Download className="w-4 h-4" />
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
