import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Style definition map for artistic transformation
const STYLE_PROMPTS: Record<string, string> = {
  storybook: "whimsical picture book illustration, vibrant lively color palette, charming gentle fairy-tale lighting, soft detailed storybook art for children, warm joyful atmosphere, award-winning picture book style",
  pixar_3d: "Pixar 3D animated feature film render, cute expressive character design, soft subsurface scattering skin and textures, cinematic volumetric lighting, 8k cute 3D CGI animation style",
  watercolor: "magical luminous watercolor painting, gentle wet-on-wet paint bleeds, visible artistic paper texture, dreamy flowing color gradients, soft pastel highlights",
  realistic: "realistic cinematic photograph, highly detailed natural textures, cinematic depth of field, warm ambient golden hour lighting, lifelike photographic quality",
  claymation: "handcrafted clay animation and stop-motion miniature, adorable plasticine texture, tangible clay fingerprints, warm studio tabletop lighting, Aardman aesthetic"
};

// API: Transform child drawing into real illustration
// Thematic high-quality illustrated artwork for child imagination themes
const THEME_ARTWORKS: Record<string, Record<string, string>> = {
  sweet_kitten: {
    storybook: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1000&auto=format&fit=crop&q=85',
  },
  puppy_dog: {
    storybook: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop&q=85',
  },
  fairy_cottage: {
    storybook: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
  },
  space_explorer: {
    storybook: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=85',
  },
  rainbow_sky: {
    storybook: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&auto=format&fit=crop&q=85',
  },
  underwater_magic: {
    storybook: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=1000&auto=format&fit=crop&q=85',
  },
  butterfly_garden: {
    storybook: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=85',
  },
  nature_flowers: {
    storybook: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1000&auto=format&fit=crop&q=85',
  },
  magical_unicorn: {
    storybook: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1000&auto=format&fit=crop&q=85',
  },
  friendly_dino: {
    storybook: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=85',
  },
  yummy_treats: {
    storybook: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=85',
  },
  fast_car: {
    storybook: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1000&auto=format&fit=crop&q=85',
    pixar_3d: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&auto=format&fit=crop&q=85',
    watercolor: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1000&auto=format&fit=crop&q=85',
    realistic: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&auto=format&fit=crop&q=85',
    claymation: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&auto=format&fit=crop&q=85',
  },
};

// API: Transform child drawing into real illustration
app.post('/api/transform-drawing', async (req, res) => {
  try {
    const { imageBase64, prompt, style = 'storybook', childName = 'Nisan' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Çizim verisi (imageBase64) zorunludur.' });
    }

    // Clean base64 string
    let base64Data = imageBase64;
    let mimeType = 'image/png';
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/png';
      base64Data = parts[1];
    }

    const chosenStyleDescription = STYLE_PROMPTS[style] || STYLE_PROMPTS.storybook;

    // Default analysis fallback
    let analysisData = {
      detectedSubjects: ['renkli fırça darbeleri', 'neşeli figürler'],
      childImaginationTitle: prompt || `${childName}'ın Sihirli Hayal Dünyası`,
      story: `${childName} tuvaline hayal ettiği o güzel anı çizdi. Renklerin ahengi ve çizgilerdeki canlılık tüm odayı masalsı bir neşeyle dolduruyor!`,
      praiseMessage: 'Harika bir çizim! Fırça darbelerin ve renk seçimin hayal gücünün ne kadar zengin olduğunu gösteriyor.',
      theme: 'fairy_cottage',
    };

    // Analyze drawing with gemini-3.8-flash vision
    if (process.env.GEMINI_API_KEY) {
      try {
        const analysisResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: `Sen 4 yaşındaki ${childName} adlı çocuğun çizimlerini anlayan sevgi dolu bir masal anlatıcısı ve çocuk sanatçısısın.
Kullanıcının hayal notu: "${prompt || 'Belirtilmedi'}".
Çocuğun çizimini dikkatle incele.
Resmin ana konusuna göre 'theme' alanını şu seçeneklerden biri olarak belirle:
- "sweet_kitten" (kedi, sevimli yavru kedi)
- "puppy_dog" (köpek, sevimli yavru köpek, evcil hayvan)
- "fairy_cottage" (ev, şato, kulübe, bina, kale, saray, bahçe evi)
- "space_explorer" (roket, yıldız, uzay, gezegen, astronot, ay)
- "rainbow_sky" (gökkuşağı, güneş, bulutlar, gökyüzü, uçan balon)
- "underwater_magic" (balık, deniz, su altı, yunus, denizkızı, ahtapot)
- "butterfly_garden" (kelebek, kanatlar, çiçekli çayır, uğur böceği)
- "nature_flowers" (çiçek, ağaç, bahçe, orman, yapraklar)
- "magical_unicorn" (tekboynuzlu at, peri, kanatlı at, sihirli yaratıklar)
- "friendly_dino" (dinazor, tarih öncesi, sevimli ejderha, T-Rex)
- "yummy_treats" (dondurma, pasta, kek, şeker, meyveler)
- "fast_car" (araba, kamyon, itfaiye, uçak, tren, taşıtlar)

SADECE geçerli bir JSON objesi döndür:
{
  "detectedSubjects": ["çizimde gördüğün 2-4 nesne/renk"],
  "childImaginationTitle": "Çocuğun hayalindeki dünyaya uygun şiirsel ve sevimli Türkçe başlık",
  "story": "Bu çizimi anlatan 2-3 cümlelik çok tatlı, sıcacık Türkçe mini çocuk masalı.",
  "praiseMessage": "Çocuğun hayal gücünü ve renklerini öven coşkulu 1 cümlelik Türkçe tebrik mesajı.",
  "theme": "sweet_kitten | puppy_dog | fairy_cottage | space_explorer | rainbow_sky | underwater_magic | butterfly_garden | nature_flowers | magical_unicorn | friendly_dino | yummy_treats | fast_car",
  "artisticPromptEn": "Detailed English artistic description of the scene"
}`
              }
            ]
          },
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (analysisResponse.text) {
          try {
            const parsed = JSON.parse(analysisResponse.text);
            analysisData = { ...analysisData, ...parsed };
          } catch {
            // Keep default analysis
          }
        }
      } catch (analysisErr) {
        console.warn('Vision analysis info:', analysisErr);
      }
    }

    // 2. Direct AI Image Generation from Child's Drawing using gemini-3.1-flash-lite-image
    let generatedImageUrl: string | null = null;
    let isRealAiGenerated = false;

    if (process.env.GEMINI_API_KEY) {
      try {
        const imageGenPrompt = `You are an award-winning children's book illustrator and digital concept artist.
Analyze and transform this exact child's hand-drawn sketch and coloring into a breathtaking, fully rendered masterpiece illustration in ${chosenStyleDescription} style.
Key instructions:
- Directly translate the child's drawn shapes, subjects, characters, and color choices from this sketch into the scene.
- Scene concept: "${prompt || (analysisData as any).artisticPromptEn || (analysisData as any).childImaginationTitle || 'magical child imagination'}".
- Upgrade crude lines and fills into lush, highly detailed, gorgeous digital artwork with volumetric lighting and rich textures.
- Full background environment, clean finished picture, warm whimsical fairytale atmosphere.`;

        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: imageGenPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const partMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${partMime};base64,${part.inlineData.data}`;
            isRealAiGenerated = true;
            break;
          }
        }
      } catch (imageErr: any) {
        console.warn('gemini-3.1-flash-lite-image info:', imageErr?.message || imageErr);
      }
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      isRealAiGenerated,
      analysis: analysisData,
    });

  } catch (err: any) {
    console.error('General server error in /api/transform-drawing:', err);
    res.status(500).json({ success: false, error: err.message || 'Sunucu hatası oluştu.' });
  }
});

// API: Analyze drawing only (fast text & story)
app.post('/api/analyze-drawing', async (req, res) => {
  try {
    const { imageBase64, childName = 'Nisan' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 gereklidir.' });
    }

    let base64Data = imageBase64;
    let mimeType = 'image/png';
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/png';
      base64Data = parts[1];
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        detectedSubjects: ['renkli çizgiler', 'güzel şekiller'],
        childImaginationTitle: `${childName}'ın Sevimli Çizimi`,
        story: `${childName} fırçasıyla harikalar yarattı! Bu renkli resim onun masum ve zengin dünyasını yansıtıyor.`,
        praiseMessage: 'Harika bir çizim! Çok yeteneklisin.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Bu resim ${childName} adlı çocuk tarafından çizildi. Resmi sevgiyle incele ve aşağıdaki JSON formatında yanıt ver:
{
  "detectedSubjects": ["çizimde gördüğün 2-4 nesne"],
  "childImaginationTitle": "Çocuğun hayalindeki dünyaya uygun tatlı bir Türkçe başlık",
  "story": "Bu sahneyi anlatan 2-3 cümlelik çok tatlı, sıcacık Türkçe mini masal.",
  "praiseMessage": "Çocuğu neşelendiren 1 cümlelik övgü mesajı."
}`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start dev server with Vite middleware or serve static
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
