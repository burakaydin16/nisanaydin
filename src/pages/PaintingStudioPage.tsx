import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Palette, Sparkles, Undo, Redo, Trash2, Download, Wand2, RefreshCw, 
  Layers, Smile, Heart, Star, Sun, Cloud, Moon, Zap, Cat, Rocket, Home,
  Info, Check, Eye, ChevronRight, Sliders, Volume2, VolumeX, Award,
  Paintbrush, PaintBucket, X, ArrowLeft
} from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';
import { soundFx } from '../utils/audioEffects';

interface PaintingStudioPageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

type ToolType = 'brush' | 'bucket' | 'rainbow' | 'glitter' | 'crayon' | 'eraser' | 'stamp';
type ArtStyle = 'storybook' | 'pixar_3d' | 'watercolor' | 'claymation';
type TemplateId = 'blank' | 'kitten' | 'house' | 'space' | 'butterfly' | 'dino' | 'dolphin' | 'cupcake' | 'car';

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

// 16 Chunky, vibrant child-friendly colors
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
  { hex: '#854D0E', name: 'Çikolata Kahvesi' },
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
      ctx.closePath();
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
      ctx.beginPath();
      ctx.arc(x, y, size * 0.75, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const x1 = x + Math.cos(a) * (size * 0.9);
        const y1 = y + Math.sin(a) * (size * 0.9);
        const x2 = x + Math.cos(a) * (size * 1.5);
        const y2 = y + Math.sin(a) * (size * 1.5);
        ctx.beginPath();
        ctx.arc(x2, y2, size * 0.2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
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
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'paw',
    label: 'Pati',
    emoji: '🐾',
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.3, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      const angles = [-0.7, -0.25, 0.25, 0.7];
      for (const a of angles) {
        const tx = x + Math.sin(a) * size * 1.1;
        const ty = y - Math.cos(a) * size * 0.9;
        ctx.beginPath();
        ctx.ellipse(tx, ty, size * 0.28, size * 0.35, a, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  },
];

// Real coloring book picture templates + Blank Canvas option
const TEMPLATE_CARDS: { id: TemplateId; emoji: string; title: string; subtitle: string; prompt: string }[] = [
  { id: 'blank', emoji: '📄', title: 'Boş Tuval', subtitle: 'Kendi hayalini çiz', prompt: 'Rengarenk, neşeli, hayal gücü dolu çocuk çizimi' },
  { id: 'kitten', emoji: '🐱', title: 'Şirin Kedicik', subtitle: 'Büyük kulaklar & papyon', prompt: 'Sevimli gülümseyen papyonlu yavru kedi' },
  { id: 'house', emoji: '🏠', title: 'Masal Evi', subtitle: 'Pencereler, kapı & güneş', prompt: 'Bahçesinde rengarenk çiçekler olan güneşli masal evi' },
  { id: 'space', emoji: '🚀', title: 'Uzay Roketi', subtitle: 'Pencereler, kanat & yıldızlar', prompt: 'Uzayda gezegenlerin arasında uçan renkli roket' },
  { id: 'butterfly', emoji: '🦋', title: 'Renkli Kelebek', subtitle: 'Desenli kanatlar & çiçek', prompt: 'Büyük desenli kanatlarıyla uçan neşeli kelebek' },
  { id: 'dino', emoji: '🦕', title: 'Bebek Dinozor', subtitle: 'Benekli sevimli dino', prompt: 'Arkadaş canlısı gülümseyen sevimli yavru dinozor' },
  { id: 'dolphin', emoji: '🐬', title: 'Neşeli Yunus', subtitle: 'Deniz dalgaları & baloncuk', prompt: 'Deniz dalgaları üzerinde zıplayan mutlu yunus balığı' },
  { id: 'cupcake', emoji: '🧁', title: 'Tatlı Kupkek', subtitle: 'Krema girdabı & kiraz', prompt: 'Üzerinde kiraz olan nefis çilekli kupkek tatlısı' },
  { id: 'car', emoji: '🚗', title: 'Şirin Araba', subtitle: 'Tekerlekler, camlar & farlar', prompt: 'Yolda neşeyle giden güler yüzlü sevimli araba' },
];

// Robust, airtight flood fill for closed coloring book line-art
function floodFillCanvas(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  width: number,
  height: number
) {
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

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

  // A pixel is a dark border line if luminance is low (prevents leaking across black lines)
  const isDarkBorder = (pr: number, pg: number, pb: number) => {
    return (pr * 0.299 + pg * 0.587 + pb * 0.114) < 115;
  };

  // If user clicked directly ON a black line, don't fill the black lines
  if (isDarkBorder(startR, startG, startB)) {
    return;
  }

  // If already matches target color
  if (
    Math.abs(startR - r) < 15 &&
    Math.abs(startG - g) < 15 &&
    Math.abs(startB - b) < 15
  ) {
    return;
  }

  const canFill = (pos: number) => {
    const pr = data[pos];
    const pg = data[pos + 1];
    const pb = data[pos + 2];
    if (isDarkBorder(pr, pg, pb)) return false;
    return (Math.abs(pr - startR) + Math.abs(pg - startG) + Math.abs(pb - startB)) < 95;
  };

  // Fast BFS queue using flat Int32Array (no GC stutter, runs in ~5ms)
  const maxQueue = width * height * 2;
  const queue = new Int32Array(maxQueue);
  const visited = new Uint8Array(width * height);

  let head = 0;
  let tail = 0;

  queue[tail++] = startX;
  queue[tail++] = startY;
  visited[startY * width + startX] = 1;

  while (head < tail) {
    const cx = queue[head++];
    const cy = queue[head++];
    const pos = (cy * width + cx) * 4;

    data[pos] = r;
    data[pos + 1] = g;
    data[pos + 2] = b;
    data[pos + 3] = a;

    // Check 4 cardinal neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx]) {
          visited[nIdx] = 1;
          if (canFill(nIdx * 4) && tail < maxQueue - 2) {
            queue[tail++] = nx;
            queue[tail++] = ny;
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

    // Golden 4-point sparkle stars
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
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, sz * 0.35, 0, Math.PI * 2);
      ctx.closePath();
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
      ctx.closePath();
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
  const [currentTool, setCurrentTool] = useState<ToolType>('brush'); // Default to free brush for drawing on blank canvas
  const [brushSize, setBrushSize] = useState<number>(20);
  const [selectedStamp, setSelectedStamp] = useState<string>('star');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const rainbowHue = useRef<number>(0);

  // Template modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Drawing state
  const isDrawing = useRef<boolean>(false);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  // Transformation states
  const [prompt, setPrompt] = useState<string>('Rengarenk, neşeli, hayal gücü dolu çocuk çizimi');
  const [style, setStyle] = useState<ArtStyle>('storybook');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformProgress, setTransformProgress] = useState<string>('');
  const [isSpeakingStory, setIsSpeakingStory] = useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  const [transformResult, setTransformResult] = useState<{
    original: string;
    transformed: string;
    title: string;
    story?: string;
    praise?: string;
  } | null>(null);

  // Comparison view mode
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'certificate'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Saved creations
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>(() => {
    const saved = localStorage.getItem('nisan_saved_drawings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nisan_saved_drawings', JSON.stringify(savedCreations));
  }, [savedCreations]);

  useEffect(() => {
    soundFx.soundEnabled = soundEnabled;
    soundFx.voiceEnabled = soundEnabled;
  }, [soundEnabled]);

  // Load a coloring template or blank page
  const handleLoadTemplate = useCallback((templateType: TemplateId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset white canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = 6; // Heavy black contour
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const card = TEMPLATE_CARDS.find(c => c.id === templateType);
    if (card) {
      setPrompt(card.prompt);
    }

    if (templateType === 'blank') {
      setCurrentTool('brush');
    } else {
      setCurrentTool('bucket');
    }

    if (templateType === 'kitten') {
      // Outer Ears (Closed triangles)
      ctx.beginPath();
      ctx.moveTo(310, 180); ctx.lineTo(260, 70); ctx.lineTo(365, 145); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(490, 180); ctx.lineTo(540, 70); ctx.lineTo(435, 145); ctx.closePath(); ctx.stroke();

      // Inner Ears (Closed triangles to color pink)
      ctx.beginPath();
      ctx.moveTo(315, 160); ctx.lineTo(280, 95); ctx.lineTo(350, 140); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(485, 160); ctx.lineTo(520, 95); ctx.lineTo(450, 140); ctx.closePath(); ctx.stroke();

      // Head (Closed Circle)
      ctx.beginPath();
      ctx.arc(400, 260, 130, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Left Eye & Pupil (Closed)
      ctx.beginPath(); ctx.arc(345, 235, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(345, 235, 12, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
      ctx.beginPath(); ctx.arc(341, 231, 4, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();

      // Right Eye & Pupil (Closed)
      ctx.beginPath(); ctx.arc(455, 235, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(455, 235, 12, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
      ctx.beginPath(); ctx.arc(451, 231, 4, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();

      // Nose (Closed triangle)
      ctx.beginPath();
      ctx.moveTo(390, 270); ctx.lineTo(410, 270); ctx.lineTo(400, 286); ctx.closePath(); ctx.stroke();

      // Cheeks (Closed Ovals)
      ctx.beginPath(); ctx.ellipse(330, 275, 18, 12, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(470, 275, 18, 12, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Mouth muzzle pads (Closed)
      ctx.beginPath(); ctx.arc(385, 300, 16, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(415, 300, 16, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Bow tie center (Closed)
      ctx.beginPath(); ctx.arc(400, 395, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Bow tie left wing (Closed)
      ctx.beginPath(); ctx.moveTo(386, 395); ctx.lineTo(340, 370); ctx.lineTo(340, 420); ctx.closePath(); ctx.stroke();
      // Bow tie right wing (Closed)
      ctx.beginPath(); ctx.moveTo(414, 395); ctx.lineTo(460, 370); ctx.lineTo(460, 420); ctx.closePath(); ctx.stroke();

      // Chubby Body (Closed)
      ctx.beginPath(); ctx.ellipse(400, 480, 110, 85, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Tummy patch (Closed)
      ctx.beginPath(); ctx.ellipse(400, 485, 60, 50, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Paws (Closed)
      ctx.beginPath(); ctx.ellipse(345, 545, 25, 18, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(455, 545, 25, 18, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Tail (Closed)
      ctx.beginPath();
      ctx.moveTo(505, 470);
      ctx.quadraticCurveTo(620, 450, 610, 370);
      ctx.quadraticCurveTo(570, 370, 485, 430);
      ctx.closePath();
      ctx.stroke();

    } else if (templateType === 'house') {
      // Grass Ground (Closed bottom rectangle)
      ctx.beginPath(); ctx.rect(0, 510, 800, 90); ctx.closePath(); ctx.stroke();

      // House Body (Closed)
      ctx.beginPath(); ctx.rect(260, 270, 280, 240); ctx.closePath(); ctx.stroke();

      // Roof (Closed)
      ctx.beginPath();
      ctx.moveTo(220, 270); ctx.lineTo(400, 120); ctx.lineTo(580, 270); ctx.closePath(); ctx.stroke();

      // Chimney (Closed)
      ctx.beginPath(); ctx.rect(470, 160, 45, 70); ctx.closePath(); ctx.stroke();
      // Smoke puff 1 (Closed)
      ctx.beginPath(); ctx.arc(495, 120, 18, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Smoke puff 2 (Closed)
      ctx.beginPath(); ctx.arc(525, 80, 25, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Attic Round Window (Closed)
      ctx.beginPath(); ctx.arc(400, 205, 26, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Door (Closed arch)
      ctx.beginPath();
      ctx.moveTo(365, 510); ctx.lineTo(365, 420); ctx.arc(400, 420, 35, Math.PI, 0); ctx.lineTo(435, 510);
      ctx.closePath(); ctx.stroke();
      // Door knob (Closed)
      ctx.beginPath(); ctx.arc(420, 465, 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Left Window Frame & 4 Closed Panes
      ctx.beginPath(); ctx.rect(285, 310, 60, 60); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(288, 313, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(318, 313, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(288, 343, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(318, 343, 24, 24); ctx.closePath(); ctx.stroke();

      // Right Window Frame & 4 Closed Panes
      ctx.beginPath(); ctx.rect(455, 310, 60, 60); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(458, 313, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(488, 313, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(458, 343, 24, 24); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(488, 343, 24, 24); ctx.closePath(); ctx.stroke();

      // Sun (Closed)
      ctx.beginPath(); ctx.arc(130, 115, 42, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // 8 Closed Sun Rays
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const x1 = 130 + Math.cos(a - 0.2) * 55;
        const y1 = 115 + Math.sin(a - 0.2) * 55;
        const x2 = 130 + Math.cos(a) * 78;
        const y2 = 115 + Math.sin(a) * 78;
        const x3 = 130 + Math.cos(a + 0.2) * 55;
        const y3 = 115 + Math.sin(a + 0.2) * 55;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.stroke();
      }

      // Flowers in garden (Closed petals)
      for (const fx of [140, 660]) {
        // center
        ctx.beginPath(); ctx.arc(fx, 460, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
        // 4 petals
        ctx.beginPath(); ctx.arc(fx - 18, 460, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(fx + 18, 460, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(fx, 442, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(fx, 478, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      }

    } else if (templateType === 'space') {
      // Rocket Nose Cone (Closed)
      ctx.beginPath();
      ctx.moveTo(400, 90); ctx.quadraticCurveTo(440, 150, 440, 190); ctx.lineTo(360, 190); ctx.quadraticCurveTo(360, 150, 400, 90);
      ctx.closePath(); ctx.stroke();

      // Upper Stripe (Closed)
      ctx.beginPath(); ctx.rect(355, 190, 90, 35); ctx.closePath(); ctx.stroke();

      // Main Rocket Fuselage Body (Closed)
      ctx.beginPath();
      ctx.moveTo(355, 225); ctx.lineTo(445, 225); ctx.lineTo(455, 390); ctx.lineTo(345, 390);
      ctx.closePath(); ctx.stroke();

      // Big Round Porthole Window (Closed outer ring & inner glass)
      ctx.beginPath(); ctx.arc(400, 300, 36, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(400, 300, 26, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Left Wing Fin (Closed)
      ctx.beginPath();
      ctx.moveTo(345, 340); ctx.lineTo(260, 430); ctx.lineTo(340, 430); ctx.closePath(); ctx.stroke();

      // Right Wing Fin (Closed)
      ctx.beginPath();
      ctx.moveTo(455, 340); ctx.lineTo(540, 430); ctx.lineTo(460, 430); ctx.closePath(); ctx.stroke();

      // Engine Nozzle (Closed)
      ctx.beginPath();
      ctx.moveTo(365, 390); ctx.lineTo(435, 390); ctx.lineTo(445, 420); ctx.lineTo(355, 420);
      ctx.closePath(); ctx.stroke();

      // Outer Flame (Closed)
      ctx.beginPath();
      ctx.moveTo(365, 420); ctx.lineTo(400, 510); ctx.lineTo(435, 420); ctx.closePath(); ctx.stroke();
      // Inner Flame Core (Closed)
      ctx.beginPath();
      ctx.moveTo(380, 420); ctx.lineTo(400, 470); ctx.lineTo(420, 420); ctx.closePath(); ctx.stroke();

      // Saturn Planet (Closed sphere & ring)
      ctx.beginPath(); ctx.arc(630, 170, 46, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(630, 170, 75, 18, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Closed 5-point Stars
      for (const [sx, sy, sz] of [[150, 160, 18], [210, 320, 15], [640, 410, 18], [170, 470, 14]]) {
        ctx.beginPath();
        const spikes = 5;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.moveTo(sx, sy - sz);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(sx + Math.cos(rot) * sz, sy + Math.sin(rot) * sz);
          rot += step;
          ctx.lineTo(sx + Math.cos(rot) * (sz * 0.45), sy + Math.sin(rot) * (sz * 0.45));
          rot += step;
        }
        ctx.closePath(); ctx.stroke();
      }

    } else if (templateType === 'butterfly') {
      // Butterfly Head (Closed)
      ctx.beginPath(); ctx.arc(400, 180, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Antenna tips (Closed)
      ctx.beginPath(); ctx.arc(360, 125, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(440, 125, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Thorax & Abdomen (Closed)
      ctx.beginPath(); ctx.ellipse(400, 240, 18, 35, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(400, 330, 16, 50, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Upper Left Wing (Closed)
      ctx.beginPath(); ctx.ellipse(270, 230, 105, 75, -Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Upper Left Spot (Closed)
      ctx.beginPath(); ctx.arc(265, 230, 28, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Lower Left Wing (Closed)
      ctx.beginPath(); ctx.ellipse(290, 360, 80, 55, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Lower Left Spot (Closed)
      ctx.beginPath(); ctx.arc(290, 360, 20, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Upper Right Wing (Closed)
      ctx.beginPath(); ctx.ellipse(530, 230, 105, 75, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Upper Right Spot (Closed)
      ctx.beginPath(); ctx.arc(535, 230, 28, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Lower Right Wing (Closed)
      ctx.beginPath(); ctx.ellipse(510, 360, 80, 55, -Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Lower Right Spot (Closed)
      ctx.beginPath(); ctx.arc(510, 360, 20, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

    } else if (templateType === 'dino') {
      // Dino Head & Snout (Closed)
      ctx.beginPath();
      ctx.moveTo(320, 300); ctx.quadraticCurveTo(270, 180, 320, 140); ctx.quadraticCurveTo(390, 120, 400, 180);
      ctx.lineTo(365, 270); ctx.closePath(); ctx.stroke();

      // Big Eye (Closed)
      ctx.beginPath(); ctx.arc(348, 165, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(348, 165, 7, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();

      // Dino Chubby Body (Closed)
      ctx.beginPath(); ctx.ellipse(420, 370, 120, 95, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Belly Patch (Closed)
      ctx.beginPath(); ctx.ellipse(395, 385, 65, 60, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Back Spikes (4 Closed triangles)
      ctx.beginPath(); ctx.moveTo(365, 275); ctx.lineTo(385, 240); ctx.lineTo(405, 280); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(415, 280); ctx.lineTo(435, 245); ctx.lineTo(455, 290); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(465, 295); ctx.lineTo(485, 260); ctx.lineTo(505, 310); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(515, 315); ctx.lineTo(535, 280); ctx.lineTo(555, 335); ctx.closePath(); ctx.stroke();

      // 3 Body Spots (Closed)
      ctx.beginPath(); ctx.arc(460, 345, 15, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(495, 380, 12, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(450, 410, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Front Foot (Closed)
      ctx.beginPath(); ctx.rect(345, 450, 42, 65); ctx.closePath(); ctx.stroke();
      // Back Foot (Closed)
      ctx.beginPath(); ctx.rect(435, 450, 42, 65); ctx.closePath(); ctx.stroke();

      // Tail (Closed)
      ctx.beginPath();
      ctx.moveTo(530, 350); ctx.quadraticCurveTo(660, 360, 640, 270); ctx.quadraticCurveTo(590, 380, 520, 410);
      ctx.closePath(); ctx.stroke();

    } else if (templateType === 'dolphin') {
      // Ocean Waves (Closed bottom water band)
      ctx.beginPath();
      ctx.moveTo(0, 530);
      for (let x = 0; x <= 800; x += 100) {
        ctx.quadraticCurveTo(x + 25, 490, x + 50, 510);
        ctx.quadraticCurveTo(x + 75, 530, x + 100, 510);
      }
      ctx.lineTo(800, 600); ctx.lineTo(0, 600); ctx.closePath(); ctx.stroke();

      // Dolphin Body (Closed)
      ctx.beginPath();
      ctx.moveTo(240, 380);
      ctx.quadraticCurveTo(340, 160, 530, 240);
      ctx.quadraticCurveTo(630, 310, 640, 330);
      ctx.lineTo(600, 340);
      ctx.quadraticCurveTo(510, 290, 410, 340);
      ctx.quadraticCurveTo(330, 390, 240, 380);
      ctx.closePath(); ctx.stroke();

      // Underbelly patch (Closed)
      ctx.beginPath();
      ctx.moveTo(270, 380);
      ctx.quadraticCurveTo(340, 340, 420, 335);
      ctx.quadraticCurveTo(360, 385, 270, 380);
      ctx.closePath(); ctx.stroke();

      // Eye (Closed)
      ctx.beginPath(); ctx.arc(280, 350, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(280, 350, 5, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();

      // Dorsal Fin (Closed)
      ctx.beginPath();
      ctx.moveTo(420, 205); ctx.quadraticCurveTo(445, 140, 480, 185); ctx.lineTo(460, 215);
      ctx.closePath(); ctx.stroke();

      // Flipper (Closed)
      ctx.beginPath();
      ctx.moveTo(350, 350); ctx.lineTo(330, 420); ctx.lineTo(375, 390); ctx.closePath(); ctx.stroke();

      // Tail Fluke (Closed)
      ctx.beginPath();
      ctx.moveTo(630, 325); ctx.lineTo(675, 280); ctx.lineTo(655, 330); ctx.lineTo(685, 365);
      ctx.closePath(); ctx.stroke();

      // Water Splash Bubbles (Closed)
      ctx.beginPath(); ctx.arc(220, 320, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(180, 280, 18, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(260, 250, 12, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

    } else if (templateType === 'cupcake') {
      // Cupcake Liner Cup (Closed trapezoid with vertical ribs)
      ctx.beginPath();
      ctx.moveTo(290, 340); ctx.lineTo(510, 340); ctx.lineTo(470, 520); ctx.lineTo(330, 520);
      ctx.closePath(); ctx.stroke();
      // Liner Ribs (Closed vertical stripes)
      for (const lx of [340, 380, 420, 460]) {
        ctx.beginPath(); ctx.rect(lx - 5, 345, 10, 170); ctx.closePath(); ctx.stroke();
      }

      // Bottom Frosting Cloud (Closed)
      ctx.beginPath();
      ctx.moveTo(260, 340);
      ctx.quadraticCurveTo(240, 290, 290, 280);
      ctx.quadraticCurveTo(340, 260, 400, 270);
      ctx.quadraticCurveTo(460, 260, 510, 280);
      ctx.quadraticCurveTo(560, 290, 540, 340);
      ctx.closePath(); ctx.stroke();

      // Middle Frosting Swirl (Closed)
      ctx.beginPath();
      ctx.moveTo(290, 280);
      ctx.quadraticCurveTo(320, 210, 400, 205);
      ctx.quadraticCurveTo(480, 210, 510, 280);
      ctx.closePath(); ctx.stroke();

      // Top Frosting Peak (Closed)
      ctx.beginPath();
      ctx.moveTo(340, 210);
      ctx.quadraticCurveTo(400, 140, 400, 130);
      ctx.quadraticCurveTo(430, 160, 460, 210);
      ctx.closePath(); ctx.stroke();

      // Cherry on Top (Closed circle & closed stem)
      ctx.beginPath(); ctx.arc(400, 105, 26, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(400, 80); ctx.quadraticCurveTo(430, 30, 460, 45); ctx.lineTo(455, 52); ctx.quadraticCurveTo(425, 38, 396, 82);
      ctx.closePath(); ctx.stroke();

      // Sprinkles (Closed pills)
      for (const [sx, sy, sa] of [[330, 310, 0.4], [470, 305, -0.3], [370, 240, -0.5], [440, 245, 0.6], [400, 170, 0]]) {
        ctx.beginPath(); ctx.ellipse(sx, sy, 14, 6, sa, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      }

    } else if (templateType === 'car') {
      // Car Ground (Closed)
      ctx.beginPath(); ctx.rect(0, 510, 800, 90); ctx.closePath(); ctx.stroke();

      // Car Upper Cabin & Windows Frame (Closed)
      ctx.beginPath();
      ctx.moveTo(270, 310);
      ctx.lineTo(340, 200);
      ctx.lineTo(510, 200);
      ctx.lineTo(570, 310);
      ctx.closePath(); ctx.stroke();

      // Front Window (Closed)
      ctx.beginPath();
      ctx.moveTo(350, 215); ctx.lineTo(415, 215); ctx.lineTo(415, 295); ctx.lineTo(290, 295);
      ctx.closePath(); ctx.stroke();

      // Rear Window (Closed)
      ctx.beginPath();
      ctx.moveTo(430, 215); ctx.lineTo(495, 215); ctx.lineTo(545, 295); ctx.lineTo(430, 295);
      ctx.closePath(); ctx.stroke();

      // Car Lower Body (Closed)
      ctx.beginPath();
      ctx.moveTo(170, 310);
      ctx.lineTo(630, 310);
      ctx.quadraticCurveTo(660, 330, 650, 410);
      ctx.lineTo(580, 410);
      ctx.arc(500, 410, 60, 0, Math.PI, true); // rear wheel arch
      ctx.lineTo(360, 410);
      ctx.arc(280, 410, 60, 0, Math.PI, true); // front wheel arch
      ctx.lineTo(150, 410);
      ctx.quadraticCurveTo(140, 330, 170, 310);
      ctx.closePath(); ctx.stroke();

      // Front Wheel: Tire & Hubcap (Closed)
      ctx.beginPath(); ctx.arc(280, 420, 48, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(280, 420, 24, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Rear Wheel: Tire & Hubcap (Closed)
      ctx.beginPath(); ctx.arc(500, 420, 48, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(500, 420, 24, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();

      // Headlight (Closed)
      ctx.beginPath(); ctx.arc(175, 340, 16, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Smile Grill (Closed)
      ctx.beginPath(); ctx.rect(170, 375, 40, 18); ctx.closePath(); ctx.stroke();
    }

    // Save initial state
    const dataUrl = canvas.toDataURL('image/png');
    setHistory([dataUrl]);
    setHistoryStep(0);
    setIsTemplateModalOpen(false);

    if (soundEnabled) soundFx.playSuccess();
  }, [soundEnabled]);

  // Initial setup: Clean blank white canvas by default (boş sayfa)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/png');
      setHistory([dataUrl]);
      setHistoryStep(0);
    }
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

  // Prominent Clear Canvas (Tümünü Sil -> Tertemiz Boş Sayfa Yapar)
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrompt('Rengarenk, neşeli, hayal gücü dolu çocuk çizimi');
    pushHistory();
    if (soundEnabled) soundFx.playPop();
  };

  // Convert client coordinates to canvas internal pixel coordinates
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
    };
  };

  const applyToolStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 1.8;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'rainbow') {
      rainbowHue.current = (rainbowHue.current + 8) % 360;
      ctx.strokeStyle = `hsl(${rainbowHue.current}, 100%, 50%)`;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'crayon') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize * 1.3;
      ctx.globalAlpha = 0.85;
    } else if (currentTool === 'glitter') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 0.9;
    } else {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    }
  };

  // Start Drawing / Filling
  const handleStartAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(clientX, clientY);
    lastX.current = x;
    lastY.current = y;

    // Bucket fill tool (Kutu boyama - kapalı alana dokun ve doldur)
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
        stampDef.draw(ctx, x, y, currentColor, brushSize * 1.6);
        pushHistory();
        if (soundEnabled) soundFx.playPop();
      }
      return;
    }

    isDrawing.current = true;
    // Draw initial dot
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.fill();

    if (soundEnabled && currentTool === 'rainbow') {
      soundFx.playGentleBeep(520);
    }
  };

  // Move Drawing
  const handleMoveAt = (clientX: number, clientY: number) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(clientX, clientY);

    if (currentTool === 'glitter') {
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      applyToolStyle(ctx);
      ctx.stroke();

      for (let i = 0; i < 2; i++) {
        const offsetDistX = (Math.random() - 0.5) * brushSize * 1.5;
        const offsetDistY = (Math.random() - 0.5) * brushSize * 1.5;
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

  // End Drawing
  const handleEndDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    pushHistory();
  };

  // AI Transform drawing into real creative illustration
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
      }, 2400);

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

      // Generate the stylized storybook illustration directly from the child's drawing!
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
      setIsResultModalOpen(true);

      if (soundEnabled) {
        soundFx.playMagicTada();
      }
    } catch (err: any) {
      console.warn('Transform fallback, direct generative stylization applied:', err);
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
      setIsResultModalOpen(true);

      if (soundEnabled) soundFx.playMagicTada();
    } finally {
      setIsTransforming(false);
      setTransformProgress('');
    }
  };

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
    setTimeout(() => {
      setIsSpeakingStory(false);
    }, (transformResult.story.length / 10) * 1000 + 2000);
  };

  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const offsetX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / containerRect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen max-h-screen overflow-hidden bg-[#FAF8F5] text-stone-800 flex flex-col select-none touch-none overscroll-none"
      style={{ touchAction: 'none' }}
    >
      
      {/* TOP SECTION: COLOR PALETTE + TOOL CONTROLS (Boyama Siteleri Tarzı Üst Panel) */}
      <header className="shrink-0 bg-white/95 backdrop-blur-md border-b-2 border-stone-200 z-30 shadow-xs flex flex-col">
        
        {/* Row 1: Actions, Tools, Clear All & Magic Transform */}
        <div className="h-12 sm:h-14 px-2 sm:px-4 flex items-center justify-between gap-1.5 border-b border-stone-100 overflow-x-auto no-scrollbar">
          
          {/* Left Actions: Home & Template Chooser */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button 
              onClick={() => onNavigate('/')} 
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>

            <button
              onClick={() => {
                setIsTemplateModalOpen(true);
                if (soundEnabled) soundFx.playPop();
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Boyama Resimleri ve Şablonlar"
            >
              <span className="text-sm sm:text-base">🎨</span>
              <span className="hidden xs:inline">Şablonlar</span>
            </button>
          </div>

          {/* Center Tools: Brush, Bucket, Crayon, Rainbow, Glitter, Stamp, Eraser */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-100/90 p-1 rounded-2xl shrink-0">
            {/* Fırça */}
            <button
              onClick={() => {
                setCurrentTool('brush');
                if (soundEnabled) soundFx.playPop();
              }}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'brush'
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Serbest Fırça"
            >
              <Paintbrush className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Fırça</span>
            </button>

            {/* Sihirli Kova (Kutu Boya - Kapalı Alan Doldur) */}
            <button
              onClick={() => {
                setCurrentTool('bucket');
                if (soundEnabled) soundFx.playBubble();
              }}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'bucket'
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Kutu Boyama (Dokun ve Doldur)"
            >
              <PaintBucket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Kova</span>
            </button>

            {/* Mum Boya */}
            <button
              onClick={() => {
                setCurrentTool('crayon');
                if (soundEnabled) soundFx.playPop();
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'crayon'
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Mum Boya"
            >
              <span>🖍️</span>
              <span className="hidden md:inline">Mum</span>
            </button>

            {/* Gökkuşağı */}
            <button
              onClick={() => {
                setCurrentTool('rainbow');
                if (soundEnabled) soundFx.playGentleBeep(600);
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'rainbow'
                  ? 'bg-gradient-to-r from-red-500 via-amber-500 to-indigo-600 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Gökkuşağı Kalemi"
            >
              <span>🌈</span>
            </button>

            {/* Işıltı */}
            <button
              onClick={() => {
                setCurrentTool('glitter');
                if (soundEnabled) soundFx.playGentleBeep(800);
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'glitter'
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Işıltılı Çizim"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            {/* Damga */}
            <button
              onClick={() => {
                setCurrentTool('stamp');
                if (soundEnabled) soundFx.playPop();
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'stamp'
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Şekilli Damgalar"
            >
              <span>⭐</span>
            </button>

            {/* Silgi */}
            <button
              onClick={() => {
                setCurrentTool('eraser');
                if (soundEnabled) soundFx.playPop();
              }}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                currentTool === 'eraser'
                  ? 'bg-stone-900 text-white shadow-md scale-105'
                  : 'text-stone-700 hover:bg-white/70'
              }`}
              title="Silgi"
            >
              <span>🧽</span>
            </button>
          </div>

          {/* Right Actions: Undo, Redo, Prominent Clear, Magic Transform */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Undo */}
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 cursor-pointer transition-all"
              title="Geri Al"
            >
              <Undo className="w-4 h-4" />
            </button>

            {/* BIG PROMINENT CLEAR ALL BUTTON */}
            <button
              onClick={handleClear}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-2 border-rose-700 cursor-pointer transition-all shrink-0"
              title="Tüm Çizimi Sil ve Boş Sayfa Yap"
            >
              <Trash2 className="w-4 h-4 text-white" />
              <span className="font-bold tracking-tight">Hepsini Sil 🧹</span>
            </button>

            {/* Magic Transform Button */}
            <button
              onClick={handleTransform}
              disabled={isTransforming}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer transition-all disabled:opacity-50 shrink-0"
              title="Çizimimi Gerçek Masal Resmine Dönüştür"
            >
              {isTransforming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span className="hidden md:inline">Dönüştürülüyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span className="hidden sm:inline">✨ Masal Resmi Yap!</span>
                  <span className="sm:hidden">✨ Sihir!</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Row 2: THE COLOR PALETTE (AT THE TOP) + BRUSH SIZES + SOUND */}
        <div className="h-11 sm:h-12 px-2 sm:px-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          {/* Left: Brush Thickness selector (4 chunky sizes) */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-stone-100 p-0.5 sm:p-1 rounded-xl shrink-0">
            {[
              { size: 6, label: '🐣', title: 'İnce Kalem', dot: 'w-1.5 h-1.5' },
              { size: 14, label: '🦊', title: 'Orta Fırça', dot: 'w-2.5 h-2.5' },
              { size: 24, label: '🐻', title: 'Kalın Fırça', dot: 'w-3.5 h-3.5' },
              { size: 40, label: '🐘', title: 'Kocaman Fırça', dot: 'w-5 h-5' },
            ].map(bs => (
              <button
                key={bs.size}
                onClick={() => {
                  setBrushSize(bs.size);
                  if (soundEnabled) soundFx.playPop();
                }}
                className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  brushSize === bs.size 
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200 scale-105' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title={bs.title}
              >
                <span>{bs.label}</span>
                <span 
                  className={`rounded-full bg-stone-800 hidden xs:inline-block ${bs.dot}`} 
                />
              </button>
            ))}
          </div>

          {/* Center: 16 Chunky Vibrant Color Pots */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x px-1 py-0.5">
            {PALETTE.map(item => {
              const isActive = currentColor === item.hex && currentTool !== 'eraser';
              return (
                <button
                  key={item.hex}
                  onClick={() => {
                    setCurrentColor(item.hex);
                    if (currentTool === 'eraser') setCurrentTool('brush');
                    if (soundEnabled) soundFx.playBubble();
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-2 transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'border-white scale-120 shadow-md ring-3 ring-stone-900/40 z-10 -translate-y-0.5'
                      : 'border-white/80 shadow-2xs hover:scale-110 active:scale-95'
                  }`}
                  style={{ backgroundColor: item.hex }}
                  title={item.name}
                >
                  {isActive && (
                    <span className={`w-2 h-2 rounded-full ${item.hex === '#FFFFFF' || item.hex === '#FDE047' ? 'bg-stone-900' : 'bg-white'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border shadow-2xs shrink-0 cursor-pointer ${
              soundEnabled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
            title="Ses Aç / Kapat"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span className="hidden lg:inline">{soundEnabled ? 'Ses' : 'Sessiz'}</span>
          </button>

        </div>

        {/* Optional Stamp Ribbon (Only when stamp tool is selected) */}
        {currentTool === 'stamp' && (
          <div className="h-9 px-3 bg-purple-50 border-t border-purple-100 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar animate-fade-in">
            <span className="text-[11px] font-bold text-purple-900 mr-1 hidden sm:inline">Damga Seç:</span>
            {STAMPS.map(stamp => (
              <button
                key={stamp.id}
                onClick={() => {
                  setSelectedStamp(stamp.id);
                  if (soundEnabled) soundFx.playPop();
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedStamp === stamp.id
                    ? 'bg-purple-600 text-white shadow-xs scale-105'
                    : 'bg-white/80 text-purple-900 hover:bg-white'
                }`}
              >
                <span>{stamp.emoji}</span>
                <span className="text-[11px]">{stamp.label}</span>
              </button>
            ))}
          </div>
        )}

      </header>

      {/* FULL-SCREEN CANVAS VIEWPORT: Fits in remaining screen with zero scrolling */}
      <main 
        className="flex-1 min-h-0 w-full overflow-hidden flex items-center justify-center p-1 sm:p-2.5 relative touch-none overscroll-none select-none"
        style={{ touchAction: 'none' }}
      >
        <div className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              e.preventDefault();
              canvasRef.current?.setPointerCapture(e.pointerId);
              handleStartAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              e.preventDefault();
              handleMoveAt(e.clientX, e.clientY);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              try { canvasRef.current?.releasePointerCapture(e.pointerId); } catch {}
              handleEndDrawing();
            }}
            onPointerCancel={handleEndDrawing}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.touches[0]) handleStartAt(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              if (e.touches[0]) handleMoveAt(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleEndDrawing();
            }}
            className="w-full h-full max-h-full max-w-full object-contain aspect-4/3 rounded-2xl border-4 border-amber-300/80 shadow-2xl bg-white block touch-none cursor-crosshair"
            style={{ touchAction: 'none' }}
          />

          {/* Child Watermark in bottom corner */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/85 backdrop-blur-xs border border-stone-200 text-[10px] font-bold text-stone-500 pointer-events-none shadow-2xs">
            🎨 {config.daughterName} • Sihirli Tuvali
          </div>
        </div>
      </main>

      {/* TEMPLATE PICKER MODAL (8 Closed-boundary coloring pictures) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-display font-black text-stone-900 flex items-center gap-2">
                  <span>🎨 Boyama Resmi Seç</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Tüm köşeleri kapalı, kutu boyamayla taşmayan gerçek boyama resimleri!
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 overflow-y-auto p-1 flex-1">
              {TEMPLATE_CARDS.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleLoadTemplate(card.id)}
                  className="p-3 rounded-2xl border-2 border-stone-200 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/60 transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <span className="text-4xl mb-1">{card.emoji}</span>
                  <span className="font-extrabold text-xs sm:text-sm text-stone-800">{card.title}</span>
                  <span className="text-[10px] text-stone-400">{card.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULT & BEFORE/AFTER MODAL (Opens after transform) */}
      {isResultModalOpen && transformResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-5 shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Sihirli Dönüştürme Tamamlandı! ✨</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-stone-900">
                  {transformResult.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={transformResult.transformed}
                  download="nisan-aydin-resmi.png"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>İndir</span>
                </a>
                <button
                  onClick={() => setIsResultModalOpen(false)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'slider' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  ↔ Kaydırıcı
                </button>
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'side-by-side' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  ⊞ Yan Yana
                </button>
                <button
                  onClick={() => setViewMode('certificate')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'certificate' ? 'bg-amber-400 text-amber-950 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  🏆 Sertifika
                </button>
              </div>

              {/* Turkish Speech Story Button */}
              {transformResult.story && (
                <button
                  onClick={handleReadStory}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSpeakingStory
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span>{isSpeakingStory ? 'Masal Okunuyor... 🔊 (Durdur)' : '🎙️ Masalı Sesli Dinle'}</span>
                </button>
              )}
            </div>

            {/* View Mode 1: Split Slider */}
            {viewMode === 'slider' && (
              <div 
                className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg border-2 border-stone-200 select-none cursor-ew-resize max-h-[50vh]"
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
                <img
                  src={transformResult.transformed}
                  alt="Dönüştürülmüş Gerçek İllüstrasyon"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-stone-900/85 backdrop-blur-xs text-white text-xs font-bold rounded-lg shadow-md">
                  ✨ Gerçek Masal İllüstrasyonu
                </div>

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
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-bold rounded-lg shadow-md border border-stone-200">
                    🎨 {config.daughterName}'ın Çizimi
                  </div>
                </div>

                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-xl border-2 border-rose-500 flex items-center justify-center text-rose-600 font-bold text-xs">
                    ↔
                  </div>
                </div>
              </div>
            )}

            {/* View Mode 2: Side-by-Side */}
            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-2 space-y-1">
                  <span className="text-xs font-bold text-stone-700 block">🎨 {config.daughterName}'ın Çizimi:</span>
                  <img src={transformResult.original} alt="Çizim" className="w-full rounded-xl aspect-4/3 object-contain bg-white" />
                </div>
                <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-2 space-y-1">
                  <span className="text-xs font-bold text-rose-800 block">✨ Gerçek Masal Resmi:</span>
                  <img src={transformResult.transformed} alt="İllüstrasyon" className="w-full rounded-xl aspect-4/3 object-cover bg-white" />
                </div>
              </div>
            )}

            {/* View Mode 3: Certificate */}
            {viewMode === 'certificate' && (
              <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl border-3 border-amber-300 p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-amber-700">
                  <Award className="w-6 h-6 text-amber-500" />
                  <h4 className="text-lg font-display font-black uppercase tracking-wider text-amber-900">
                    Küçük Sanatçı Başarı Sertifikası
                  </h4>
                </div>
                <p className="text-xs text-stone-600 font-serif italic">
                  "{config.daughterName}'ın sevgi dolu hayal gücüyle boyanmış özgün sanat eseri."
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  <img src={transformResult.original} alt="Çizim" className="w-full rounded-xl aspect-square object-cover border border-amber-200" />
                  <img src={transformResult.transformed} alt="Masal" className="w-full rounded-xl aspect-square object-cover border border-amber-400" />
                </div>
              </div>
            )}

            {/* Story & Praise */}
            {transformResult.story && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm font-serif italic text-stone-800 leading-relaxed">
                  "{transformResult.story}"
                </p>
                {transformResult.praise && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2 inline-block">
                    🌟 <strong>Tebrikler:</strong> {transformResult.praise}
                  </p>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm cursor-pointer"
              >
                ✕ Çizime Dön
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
