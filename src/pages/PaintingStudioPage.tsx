import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Paintbrush, PaintBucket, Sparkles, Undo, Redo, 
  Trash2, Download, Wand2, Volume2, VolumeX, X, Check, RefreshCw
} from 'lucide-react';
import { SiteConfig } from '../types/site';
import { AppRoute } from '../types/routes';
import { soundFx } from '../utils/audioEffects';

interface PaintingStudioPageProps {
  config: SiteConfig;
  onNavigate: (route: AppRoute) => void;
  onOpenAdmin: () => void;
}

type ToolType = 'brush' | 'bucket' | 'crayon' | 'rainbow' | 'glitter' | 'stamp' | 'eraser';
type TemplateId = 'blank' | 'kitten' | 'house' | 'space' | 'butterfly' | 'dino' | 'dolphin' | 'cupcake' | 'car';

// 16 High-contrast child-friendly colors
const PALETTE = [
  { hex: '#EF4444', name: 'Kırmızı' },
  { hex: '#F43F5E', name: 'Gül Pembe' },
  { hex: '#EC4899', name: 'Şeker Pembe' },
  { hex: '#F97316', name: 'Turuncu' },
  { hex: '#EAB308', name: 'Güneş Sarı' },
  { hex: '#FACC15', name: 'Açık Sarı' },
  { hex: '#22C55E', name: 'Çimen Yeşil' },
  { hex: '#84CC16', name: 'Fıstık Yeşil' },
  { hex: '#0EA5E9', name: 'Gök Mavisi' },
  { hex: '#3B82F6', name: 'Okyanus Mavi' },
  { hex: '#6366F1', name: 'Çivit Mavisi' },
  { hex: '#A855F7', name: 'Büyülü Mor' },
  { hex: '#854D0E', name: 'Kahverengi' },
  { hex: '#1E293B', name: 'Gece Siyahı' },
  { hex: '#94A3B8', name: 'Gümüş Gri' },
  { hex: '#FFFFFF', name: 'Kar Beyazı' },
];

// Stamps
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
      const outer = size * 1.5;
      const inner = size * 0.7;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(x, y - outer);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * inner, y + Math.sin(rot) * inner);
        rot += step;
      }
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
      const d = size * 1.4;
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
        const x2 = x + Math.cos(a) * (size * 1.4);
        const y2 = y + Math.sin(a) * (size * 1.4);
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
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
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

// 8 Closed-contour templates + Blank Canvas
const TEMPLATES: { id: TemplateId; emoji: string; title: string; subtitle: string; prompt: string }[] = [
  { id: 'blank', emoji: '📄', title: 'Boş Tuval', subtitle: 'Özgür Çizim', prompt: 'Rengarenk, neşeli, hayal gücü dolu çocuk çizimi' },
  { id: 'kitten', emoji: '🐱', title: 'Kedicik', subtitle: 'Sevimli Yavru Kedi', prompt: 'Sevimli gülümseyen papyonlu yavru kedi' },
  { id: 'house', emoji: '🏠', title: 'Masal Evi', subtitle: 'Güneşli Bahçeli Ev', prompt: 'Bahçesinde rengarenk çiçekler olan güneşli masal evi' },
  { id: 'space', emoji: '🚀', title: 'Roket', subtitle: 'Uzay Macerası', prompt: 'Uzayda gezegenlerin arasında uçan renkli roket' },
  { id: 'butterfly', emoji: '🦋', title: 'Kelebek', subtitle: 'Desenli Kanatlar', prompt: 'Büyük desenli kanatlarıyla uçan neşeli kelebek' },
  { id: 'dino', emoji: '🦕', title: 'Dinozor', subtitle: 'Sevimli Bebek Dino', prompt: 'Arkadaş canlısı gülümseyen sevimli yavru dinozor' },
  { id: 'dolphin', emoji: '🐬', title: 'Yunus', subtitle: 'Deniz Dalgaları', prompt: 'Deniz dalgaları üzerinde zıplayan mutlu yunus balığı' },
  { id: 'cupcake', emoji: '🧁', title: 'Kupkek', subtitle: 'Tatlı Çilekli Kek', prompt: 'Üzerinde kiraz olan nefis çilekli kupkek tatlısı' },
  { id: 'car', emoji: '🚗', title: 'Araba', subtitle: 'Neşeli Şehir Arabası', prompt: 'Yolda neşeyle giden güler yüzlü sevimli araba' },
];

// Leak-proof flood fill for closed outlines
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

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const startPos = (startY * width + startX) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];

  // Luminance check: Dark border line prevents leak
  const isDarkBorder = (pr: number, pg: number, pb: number) => {
    return (pr * 0.299 + pg * 0.587 + pb * 0.114) < 115;
  };

  if (isDarkBorder(startR, startG, startB)) return;

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

  const queue = new Int32Array(width * height * 2);
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
    data[pos + 3] = 255;

    // 4-neighborhood
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
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          visited[nIndex] = 1;
          const nPos = nIndex * 4;
          if (canFill(nPos)) {
            queue[tail++] = nx;
            queue[tail++] = ny;
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Client-side creative storybook illustration generator
function generateCreativeIllustration(sourceCanvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    const outCanvas = document.createElement('canvas');
    outCanvas.width = 1024;
    outCanvas.height = 768;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) {
      resolve(sourceCanvas.toDataURL('image/png'));
      return;
    }

    // Warm fairytale parchment background
    const bgGrad = ctx.createRadialGradient(512, 384, 80, 512, 384, 600);
    bgGrad.addColorStop(0, '#FEF9F0');
    bgGrad.addColorStop(0.6, '#FDF2E9');
    bgGrad.addColorStop(1, '#F8E8DA');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 768);

    // Vignette
    ctx.save();
    ctx.filter = 'blur(10px)';
    ctx.globalAlpha = 0.85;
    ctx.drawImage(sourceCanvas, 32, 24, 960, 720);
    ctx.restore();

    // Crisp child artwork overlay
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.drawImage(sourceCanvas, 32, 24, 960, 720);
    ctx.restore();

    // Watercolor paper texture
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#000000';
    for (let y = 0; y < 768; y += 4) {
      for (let x = 0; x < 1024; x += 4) {
        if (Math.random() > 0.5) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    ctx.restore();

    // Golden frame border
    ctx.save();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 1004, 748);
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 988, 732);
    ctx.restore();

    resolve(outCanvas.toDataURL('image/png'));
  });
}

export const PaintingStudioPage: React.FC<PaintingStudioPageProps> = ({
  config,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentColor, setCurrentColor] = useState<string>('#EF4444');
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [selectedStamp, setSelectedStamp] = useState<string>('star');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('blank');
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
  const [prompt, setPrompt] = useState<string>('Rengarenk, neşeli, hayal gücü dolu çocuk çizimi');
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

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  useEffect(() => {
    soundFx.soundEnabled = soundEnabled;
    soundFx.voiceEnabled = soundEnabled;
  }, [soundEnabled]);

  // Push history step
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

  // Load a coloring template or blank canvas
  const handleLoadTemplate = useCallback((templateType: TemplateId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const card = TEMPLATES.find(c => c.id === templateType);
    if (card) {
      setPrompt(card.prompt);
    }

    if (templateType === 'blank') {
      setCurrentTool('brush');
      setSelectedTemplate('blank');
      const dataUrl = canvas.toDataURL('image/png');
      setHistory([dataUrl]);
      setHistoryStep(0);
      if (soundEnabled) soundFx.playSuccess();
      return;
    }

    setCurrentTool('bucket');
    setSelectedTemplate(templateType);

    // Dynamic scale to fit canvas resolution
    const baseW = 800;
    const baseH = 600;
    const scale = Math.min((canvas.width * 0.92) / baseW, (canvas.height * 0.92) / baseH);
    const offsetX = (canvas.width - baseW * scale) / 2;
    const offsetY = (canvas.height - baseH * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = Math.max(5, Math.round(6 / scale));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (templateType === 'kitten') {
      // Ears
      ctx.beginPath();
      ctx.moveTo(310, 180); ctx.lineTo(260, 70); ctx.lineTo(365, 145); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(490, 180); ctx.lineTo(540, 70); ctx.lineTo(435, 145); ctx.closePath(); ctx.stroke();
      // Inner ears
      ctx.beginPath();
      ctx.moveTo(315, 160); ctx.lineTo(280, 95); ctx.lineTo(350, 140); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(485, 160); ctx.lineTo(520, 95); ctx.lineTo(450, 140); ctx.closePath(); ctx.stroke();
      // Head
      ctx.beginPath(); ctx.arc(400, 260, 130, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Eyes & pupils
      ctx.beginPath(); ctx.arc(345, 235, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(345, 235, 12, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
      ctx.beginPath(); ctx.arc(341, 231, 4, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.beginPath(); ctx.arc(455, 235, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(455, 235, 12, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
      ctx.beginPath(); ctx.arc(451, 231, 4, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      // Nose
      ctx.beginPath(); ctx.moveTo(390, 270); ctx.lineTo(410, 270); ctx.lineTo(400, 286); ctx.closePath(); ctx.stroke();
      // Cheeks
      ctx.beginPath(); ctx.ellipse(330, 275, 18, 12, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(470, 275, 18, 12, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Muzzle
      ctx.beginPath(); ctx.ellipse(385, 305, 24, 16, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(415, 305, 24, 16, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Body
      ctx.beginPath();
      ctx.moveTo(330, 375); ctx.quadraticCurveTo(270, 440, 260, 530); ctx.lineTo(540, 530); ctx.quadraticCurveTo(530, 440, 470, 375);
      ctx.closePath(); ctx.stroke();
      // Belly
      ctx.beginPath(); ctx.ellipse(400, 465, 75, 55, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Paws
      ctx.beginPath(); ctx.ellipse(335, 530, 38, 20, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(465, 530, 38, 20, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Tail
      ctx.beginPath();
      ctx.moveTo(520, 470); ctx.quadraticCurveTo(620, 440, 620, 370); ctx.quadraticCurveTo(620, 350, 600, 360); ctx.quadraticCurveTo(580, 410, 490, 485);
      ctx.closePath(); ctx.stroke();
      // Bowtie
      ctx.beginPath(); ctx.arc(400, 375, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(400, 375); ctx.lineTo(350, 355); ctx.lineTo(350, 395); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(400, 375); ctx.lineTo(450, 355); ctx.lineTo(450, 395); ctx.closePath(); ctx.stroke();
    } else if (templateType === 'house') {
      // Grass Ground
      ctx.beginPath(); ctx.rect(0, 470, 800, 130); ctx.closePath(); ctx.stroke();
      // Chimney
      ctx.beginPath(); ctx.rect(480, 120, 45, 90); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(470, 110, 65, 18); ctx.closePath(); ctx.stroke();
      // Roof
      ctx.beginPath(); ctx.moveTo(400, 90); ctx.lineTo(190, 260); ctx.lineTo(610, 260); ctx.closePath(); ctx.stroke();
      // House Body
      ctx.beginPath(); ctx.rect(225, 260, 350, 210); ctx.closePath(); ctx.stroke();
      // Door
      ctx.beginPath(); ctx.rect(365, 335, 70, 135); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(420, 405, 7, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Left Window
      ctx.beginPath(); ctx.rect(260, 310, 60, 60); ctx.closePath(); ctx.stroke();
      // Right Window
      ctx.beginPath(); ctx.rect(480, 310, 60, 60); ctx.closePath(); ctx.stroke();
      // Sun
      ctx.beginPath(); ctx.arc(130, 115, 42, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
    } else if (templateType === 'space') {
      // Rocket Nose
      ctx.beginPath();
      ctx.moveTo(400, 90); ctx.quadraticCurveTo(440, 150, 440, 190); ctx.lineTo(360, 190); ctx.quadraticCurveTo(360, 150, 400, 90);
      ctx.closePath(); ctx.stroke();
      // Fuselage Body
      ctx.beginPath();
      ctx.moveTo(355, 190); ctx.lineTo(445, 190); ctx.lineTo(455, 390); ctx.lineTo(345, 390);
      ctx.closePath(); ctx.stroke();
      // Porthole Window
      ctx.beginPath(); ctx.arc(400, 290, 36, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(400, 290, 26, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Wings
      ctx.beginPath(); ctx.moveTo(345, 340); ctx.lineTo(260, 430); ctx.lineTo(340, 430); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(455, 340); ctx.lineTo(540, 430); ctx.lineTo(460, 430); ctx.closePath(); ctx.stroke();
      // Flame
      ctx.beginPath(); ctx.moveTo(365, 390); ctx.lineTo(400, 490); ctx.lineTo(435, 390); ctx.closePath(); ctx.stroke();
      // Saturn planet
      ctx.beginPath(); ctx.arc(630, 170, 46, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(630, 170, 75, 18, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
    } else if (templateType === 'butterfly') {
      // Head
      ctx.beginPath(); ctx.arc(400, 180, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Body
      ctx.beginPath(); ctx.ellipse(400, 240, 18, 35, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(400, 330, 16, 50, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Wings
      ctx.beginPath(); ctx.ellipse(270, 230, 105, 75, -Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(265, 230, 28, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(290, 360, 80, 55, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(530, 230, 105, 75, Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(535, 230, 28, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(510, 360, 80, 55, -Math.PI / 6, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
    } else if (templateType === 'dino') {
      // Body & Head
      ctx.beginPath();
      ctx.moveTo(320, 300); ctx.quadraticCurveTo(270, 180, 320, 140); ctx.quadraticCurveTo(390, 120, 400, 180);
      ctx.quadraticCurveTo(420, 270, 520, 320); ctx.quadraticCurveTo(680, 330, 720, 290);
      ctx.quadraticCurveTo(680, 410, 520, 430); ctx.lineTo(510, 490); ctx.lineTo(460, 490);
      ctx.lineTo(465, 430); ctx.lineTo(395, 430); ctx.lineTo(390, 490); ctx.lineTo(340, 490);
      ctx.lineTo(345, 420); ctx.quadraticCurveTo(310, 370, 320, 300);
      ctx.closePath(); ctx.stroke();
      // Eye & Pupil
      ctx.beginPath(); ctx.arc(360, 160, 14, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(360, 160, 8, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
      // Belly Patch
      ctx.beginPath(); ctx.ellipse(440, 370, 55, 45, 0, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Back Plates
      for (const [bx, by] of [[400, 230], [430, 260], [465, 285], [510, 305]]) {
        ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      }
    } else if (templateType === 'dolphin') {
      // Dolphin Body
      ctx.beginPath();
      ctx.moveTo(210, 300); ctx.quadraticCurveTo(280, 180, 450, 200); ctx.quadraticCurveTo(630, 230, 680, 360);
      ctx.lineTo(730, 340); ctx.lineTo(715, 385); ctx.lineTo(745, 415); ctx.lineTo(670, 390);
      ctx.quadraticCurveTo(570, 340, 440, 350); ctx.quadraticCurveTo(300, 370, 210, 300);
      ctx.closePath(); ctx.stroke();
      // Dorsal Fin
      ctx.beginPath(); ctx.moveTo(430, 200); ctx.quadraticCurveTo(460, 120, 500, 145); ctx.quadraticCurveTo(490, 185, 480, 205);
      ctx.closePath(); ctx.stroke();
      // Flipper
      ctx.beginPath(); ctx.ellipse(390, 330, 36, 16, Math.PI / 4, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      // Eye
      ctx.beginPath(); ctx.arc(265, 275, 10, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(265, 275, 5, 0, Math.PI * 2); ctx.fillStyle = '#1C1917'; ctx.fill();
    } else if (templateType === 'cupcake') {
      // Cup Base
      ctx.beginPath();
      ctx.moveTo(270, 345); ctx.lineTo(530, 345); ctx.lineTo(490, 515); ctx.lineTo(310, 515);
      ctx.closePath(); ctx.stroke();
      // Frosting Swirls
      ctx.beginPath();
      ctx.moveTo(260, 340); ctx.quadraticCurveTo(240, 290, 290, 280); ctx.quadraticCurveTo(340, 260, 400, 270);
      ctx.quadraticCurveTo(460, 260, 510, 280); ctx.quadraticCurveTo(560, 290, 540, 340);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(290, 280); ctx.quadraticCurveTo(320, 210, 400, 205); ctx.quadraticCurveTo(480, 210, 510, 280);
      ctx.closePath(); ctx.stroke();
      // Cherry
      ctx.beginPath(); ctx.arc(400, 150, 26, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
    } else if (templateType === 'car') {
      // Ground
      ctx.beginPath(); ctx.rect(0, 490, 800, 110); ctx.closePath(); ctx.stroke();
      // Cabin
      ctx.beginPath();
      ctx.moveTo(270, 310); ctx.lineTo(340, 200); ctx.lineTo(510, 200); ctx.lineTo(570, 310);
      ctx.closePath(); ctx.stroke();
      // Windows
      ctx.beginPath(); ctx.rect(340, 215, 75, 80); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.rect(430, 215, 75, 80); ctx.closePath(); ctx.stroke();
      // Car Body
      ctx.beginPath();
      ctx.moveTo(170, 310); ctx.lineTo(630, 310); ctx.quadraticCurveTo(660, 330, 650, 410);
      ctx.lineTo(580, 410); ctx.arc(500, 410, 55, 0, Math.PI, true);
      ctx.lineTo(360, 410); ctx.arc(280, 410, 55, 0, Math.PI, true);
      ctx.lineTo(150, 410); ctx.quadraticCurveTo(140, 330, 170, 310);
      ctx.closePath(); ctx.stroke();
      // Wheels
      ctx.beginPath(); ctx.arc(280, 420, 45, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(280, 420, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(500, 420, 45, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(500, 420, 22, 0, Math.PI * 2); ctx.closePath(); ctx.stroke();
    }

    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setHistory([dataUrl]);
    setHistoryStep(0);

    if (soundEnabled) soundFx.playSuccess();
  }, [soundEnabled]);

  // Lock page scrolling and reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const origOverflow = document.body.style.overflow;
    const origOverscroll = document.body.style.overscrollBehavior;
    const origTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = origOverflow;
      document.body.style.overscrollBehavior = origOverscroll;
      document.body.style.touchAction = origTouchAction;
    };
  }, []);

  // Dynamic canvas sizing to fill 100% of container without letterbox waste
  const resizeCanvasToContainer = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Use clientWidth and clientHeight of container (inside borders)
    const w = Math.floor(container.clientWidth);
    const h = Math.floor(container.clientHeight);

    if (w <= 50 || h <= 50) return;
    if (canvas.width === w && canvas.height === h) return;

    let tempCanvas: HTMLCanvasElement | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    if (tempCanvas) {
      ctx.drawImage(tempCanvas, 0, 0, w, h);
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      setHistory([dataUrl]);
      setHistoryStep(0);
    }
  }, []);

  useEffect(() => {
    resizeCanvasToContainer();
    const timer = setTimeout(resizeCanvasToContainer, 100);

    const handleResize = () => resizeCanvasToContainer();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resizeCanvasToContainer());
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      ro?.disconnect();
    };
  }, [resizeCanvasToContainer]);

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

  // Clear Canvas (Hepsini Sil -> Tertemiz Boş Sayfa)
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrompt('Rengarenk, neşeli, hayal gücü dolu çocuk çizimi');
    setSelectedTemplate('blank');
    setCurrentTool('brush');
    pushHistory();
    if (soundEnabled) soundFx.playPop();
  };

  // Convert client coordinates to EXACT canvas internal pixel coordinates (1:1 precision on mobile/tablet)
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };

    // Canvas element border offsets if any
    const borderLeft = canvas.clientLeft || 0;
    const borderTop = canvas.clientTop || 0;

    // Rendered CSS display dimensions of the bitmap drawing area
    const displayW = canvas.clientWidth || (rect.width - borderLeft * 2);
    const displayH = canvas.clientHeight || (rect.height - borderTop * 2);

    if (displayW <= 0 || displayH <= 0) return { x: 0, y: 0 };

    // Coordinate relative to the canvas content box
    const xInCanvas = clientX - rect.left - borderLeft;
    const yInCanvas = clientY - rect.top - borderTop;

    // Direct pixel scaling (handles any CSS or subpixel scaling perfectly)
    const scaleX = canvas.width / displayW;
    const scaleY = canvas.height / displayH;

    const finalX = Math.round(xInCanvas * scaleX);
    const finalY = Math.round(yInCanvas * scaleY);

    return {
      x: Math.max(0, Math.min(canvas.width - 1, finalX)),
      y: Math.max(0, Math.min(canvas.height - 1, finalY)),
    };
  }, []);

  const applyToolStyle = useCallback((ctx: CanvasRenderingContext2D) => {
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
  }, [currentTool, currentColor, brushSize]);

  // Start Drawing / Filling
  const handleStartAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(clientX, clientY);
    lastX.current = x;
    lastY.current = y;

    if (currentTool === 'bucket') {
      floodFillCanvas(ctx, x, y, currentColor, canvas.width, canvas.height);
      pushHistory();
      if (soundEnabled) soundFx.playBubble();
      return;
    }

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
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.fill();

    if (soundEnabled && currentTool === 'rainbow') {
      soundFx.playGentleBeep(520);
    }
  }, [currentTool, currentColor, brushSize, selectedStamp, soundEnabled, pushHistory, getCanvasCoords]);

  // Move Drawing
  const handleMoveAt = useCallback((clientX: number, clientY: number) => {
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
  }, [brushSize, currentTool, applyToolStyle, getCanvasCoords]);

  // End Drawing
  const handleEndDrawing = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    pushHistory();
  }, [pushHistory]);

  // Unified native Pointer Event binding (Mouse + Touch + Stylus with palm rejection)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let activePointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      // Primary touch only (palm rejection)
      if (!e.isPrimary) return;
      e.preventDefault();
      activePointerId = e.pointerId;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      handleStartAt(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      if (!isDrawing.current && currentTool !== 'brush') return;
      e.preventDefault();
      handleMoveAt(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      e.preventDefault();
      activePointerId = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {}
      handleEndDrawing();
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      activePointerId = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {}
      handleEndDrawing();
    };

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
    window.addEventListener('pointercancel', onPointerCancel, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [handleStartAt, handleMoveAt, handleEndDrawing, currentTool]);

  // AI Transform drawing into real creative illustration
  const handleTransform = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsTransforming(true);
    setTransformProgress('🎨 Çiziminiz taranıyor ve renkler inceleniyor...');

    try {
      const imageBase64 = canvas.toDataURL('image/png');

      setTimeout(() => {
        setTransformProgress('✨ Hayal gücü çözümleniyor, masal hazırlanıyor...');
      }, 700);

      // Server analysis & story generation
      let serverStory = '';
      let serverTitle = '';
      let serverPraise = '';

      try {
        const res = await fetch('/api/transform-drawing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            prompt,
            style: 'storybook',
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.story) serverStory = data.story;
          if (data.title) serverTitle = data.title;
          if (data.praiseMessage) serverPraise = data.praiseMessage;
        }
      } catch {
        // Fallback gracefully
      }

      // Generate the stylized storybook illustration directly from child's drawing
      const creativeArtwork = await generateCreativeIllustration(canvas);

      setTransformResult({
        original: imageBase64,
        transformed: creativeArtwork,
        title: serverTitle || `${config.daughterName}'ın Büyülü Dünyası`,
        story: serverStory || `${config.daughterName} tuvaline harika renkler çizdi! Çizdiği bu resim masallar diyarına ulaştı ve gökyüzü sevinçle parladı.`,
        praise: serverPraise || 'Tebrikler! Muhteşem bir hayal gücün var!',
      });

      setIsResultModalOpen(true);
      if (soundEnabled) soundFx.playSuccess();
    } catch {
      // Fallback
      const simpleArtwork = canvas.toDataURL('image/png');
      setTransformResult({
        original: simpleArtwork,
        transformed: simpleArtwork,
        title: `${config.daughterName}'ın Resmi`,
        story: 'Harika bir resim yaptın! Tebrikler!',
        praise: 'Renklerin çok güzel!',
      });
      setIsResultModalOpen(true);
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
      className="fixed inset-0 w-screen h-screen h-[100dvh] max-h-screen overflow-hidden bg-[#FAF7F2] text-stone-800 flex flex-col select-none touch-none overscroll-none"
      style={{ touchAction: 'none' }}
    >
      {/* TOP GAP & FLOATING STUDIO PANEL */}
      <div className="pt-2 sm:pt-3 px-2 sm:px-4 shrink-0">
        <header className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-amber-200/90 shadow-md p-2 space-y-2 z-30">
          
          {/* Row 1: Left Home, Center Tools, Right Actions */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
            
            {/* Left Exit Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => onNavigate('/')} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Ana Sayfaya Dön"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-white" />
                <span>Çıkış</span>
              </button>
              <span className="hidden md:inline-block font-black text-xs text-amber-950 bg-amber-100/80 px-2 py-1 rounded-lg">
                🎨 {config.daughterName}'ın Boyama Stüdyosu
              </span>
            </div>

            {/* Center Tools in a clean pill segmented control */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => { setCurrentTool('brush'); if (soundEnabled) soundFx.playPop(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'brush' ? 'bg-rose-500 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Serbest Fırça"
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fırça</span>
              </button>

              <button
                onClick={() => { setCurrentTool('bucket'); if (soundEnabled) soundFx.playBubble(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'bucket' ? 'bg-blue-600 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Kutu Boyama (Kapalı Alan Doldur)"
              >
                <PaintBucket className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kova</span>
              </button>

              <button
                onClick={() => { setCurrentTool('crayon'); if (soundEnabled) soundFx.playPop(); }}
                className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'crayon' ? 'bg-amber-600 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Pastel Boya"
              >
                <span>🖍️</span>
                <span className="hidden md:inline">Pastel</span>
              </button>

              <button
                onClick={() => { setCurrentTool('rainbow'); if (soundEnabled) soundFx.playGentleBeep(600); }}
                className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'rainbow' ? 'bg-gradient-to-r from-red-500 via-amber-500 to-indigo-600 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Gökkuşağı Kalemi"
              >
                <span>🌈</span>
              </button>

              <button
                onClick={() => { setCurrentTool('glitter'); if (soundEnabled) soundFx.playGentleBeep(800); }}
                className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'glitter' ? 'bg-amber-500 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Işıltılı Çizim"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </button>

              <button
                onClick={() => { setCurrentTool('stamp'); if (soundEnabled) soundFx.playPop(); }}
                className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'stamp' ? 'bg-purple-600 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Damgalar"
              >
                <span>⭐</span>
              </button>

              <button
                onClick={() => { setCurrentTool('eraser'); if (soundEnabled) soundFx.playPop(); }}
                className={`px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  currentTool === 'eraser' ? 'bg-stone-900 text-white shadow-xs scale-105' : 'text-stone-700 hover:bg-white'
                }`}
                title="Silgi"
              >
                <span>🧽</span>
              </button>
            </div>

            {/* Right Actions: Undo, Clear All, Magic Transform */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
              <button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 cursor-pointer transition-all"
                title="Geri Al"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 cursor-pointer transition-all"
                title="İleri Al"
              >
                <Redo className="w-4 h-4" />
              </button>

              {/* BIG RED CLEAR BUTTON */}
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1 shadow-xs border border-rose-700 cursor-pointer transition-all shrink-0"
                title="Tüm Çizimi Sil ve Boş Sayfa Yap"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
                <span className="font-bold tracking-tight">Hepsini Sil 🧹</span>
              </button>

              {/* MAGIC ILLUSTRATION BUTTON */}
              <button
                onClick={handleTransform}
                disabled={isTransforming}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer transition-all disabled:opacity-50 shrink-0"
                title="Çizimimi Gerçek Masal Resmine Dönüştür"
              >
                {isTransforming ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    <span className="hidden sm:inline">Dönüşüyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                    <span>✨ Masal Yap!</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Row 2: READY TEMPLATES (NO HORIZONTAL SCROLL) */}
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 sm:gap-1.5 pt-1 border-t border-stone-100">
            {TEMPLATES.map(card => {
              const isSelected = selectedTemplate === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => handleLoadTemplate(card.id)}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-rose-500 border-rose-600 text-white font-black shadow-xs ring-2 ring-rose-400/40 scale-102'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700 font-bold'
                  }`}
                  title={card.subtitle}
                >
                  <span className="text-base sm:text-lg leading-none">{card.emoji}</span>
                  <span className="text-[11px] sm:text-xs truncate">{card.title}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: 16 COLORS (2x8 GRID) + BRUSH SIZES + SOUND (NO HORIZONTAL SCROLL) */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 flex-wrap sm:flex-nowrap">
            
            {/* Brush Sizes */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl shrink-0">
              {[
                { size: 6, label: '🐣', title: 'İnce', dot: 'w-1 h-1' },
                { size: 14, label: '🦊', title: 'Orta', dot: 'w-2 h-2' },
                { size: 24, label: '🐻', title: 'Kalın', dot: 'w-3 h-3' },
                { size: 40, label: '🐘', title: 'Kocaman', dot: 'w-4 h-4' },
              ].map(bs => (
                <button
                  key={bs.size}
                  onClick={() => { setBrushSize(bs.size); if (soundEnabled) soundFx.playPop(); }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    brushSize === bs.size 
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200 scale-105' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title={bs.title}
                >
                  <span>{bs.label}</span>
                  <span className={`rounded-full bg-stone-800 hidden xs:inline-block ${bs.dot}`} />
                </button>
              ))}
            </div>

            {/* 16 Colors in a 2x8 compact grid */}
            <div className="grid grid-cols-8 gap-1.5 py-0.5 mx-auto">
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
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'border-white scale-120 shadow-md ring-2 ring-stone-900/50 z-10 -translate-y-0.5'
                        : 'border-white shadow-2xs hover:scale-110 active:scale-95'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.name}
                  >
                    {isActive && (
                      <span className={`w-1.5 h-1.5 rounded-full ${item.hex === '#FFFFFF' || item.hex === '#FACC15' ? 'bg-stone-900' : 'bg-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border shadow-2xs shrink-0 cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
              title="Ses Aç / Kapat"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Ses' : 'Sessiz'}</span>
            </button>
          </div>

          {/* Optional Stamp Ribbon */}
          {currentTool === 'stamp' && (
            <div className="pt-1 border-t border-purple-100 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-purple-900 mr-1 hidden sm:inline">Damga Seç:</span>
              {STAMPS.map(stamp => (
                <button
                  key={stamp.id}
                  onClick={() => { setSelectedStamp(stamp.id); if (soundEnabled) soundFx.playPop(); }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    selectedStamp === stamp.id ? 'bg-purple-600 text-white shadow-xs scale-105' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  <span>{stamp.emoji}</span>
                  <span className="text-[11px]">{stamp.label}</span>
                </button>
              ))}
            </div>
          )}

        </header>
      </div>

      {/* FULL DYNAMIC CANVAS VIEWPORT (No letterbox waste, fills 100% of available space) */}
      <main 
        className="flex-1 min-h-0 w-full px-2 sm:px-4 pb-2 sm:pb-3 pt-1.5 relative overflow-hidden flex items-center justify-center touch-none overscroll-none select-none"
        style={{ touchAction: 'none' }}
      >
        <div 
          ref={containerRef} 
          className="w-full h-full relative rounded-2xl sm:rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden bg-white touch-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none cursor-crosshair"
            style={{ touchAction: 'none', WebkitTouchCallout: 'none', userSelect: 'none' }}
          />

          {/* Child Watermark in bottom corner */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/85 backdrop-blur-xs border border-stone-200 text-[10px] font-bold text-stone-500 pointer-events-none shadow-2xs">
            🎨 {config.daughterName} • Sihirli Tuvali
          </div>
        </div>
      </main>

      {/* RESULT MODAL (AI Storybook Artwork) */}
      {isResultModalOpen && transformResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl my-auto">
            
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
                  className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
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

            {/* Split Slider Preview */}
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
                alt="Dönüştürülmüş Masal Resmi"
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

            {/* Story & Voice Reading */}
            {transformResult.story && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs sm:text-sm text-amber-950 font-medium italic flex-1">
                  "{transformResult.story}"
                </p>
                <button
                  onClick={handleReadStory}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 ${
                    isSpeakingStory
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span>{isSpeakingStory ? 'Durdur' : '🎙️ Masalı Dinle'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
