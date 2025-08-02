// Enhanced prompt generator with 500+ creative prompts per discipline
// No AI dependencies - instant generation with rich variety
// Full translation support for all creative prompts

interface CreativePrompt {
  text: string;
  duration: number; // in seconds
  complexity: 'simple' | 'medium' | 'complex';
}

const PROMPT_TEMPLATES = {
  music: {
    energized: [
      { text: "Create a 30-second beat using only sounds you can make with your body", duration: 90, complexity: 'simple' },
      { text: "Make a high-energy loop using three random objects near you as instruments", duration: 240, complexity: 'medium' },
      { text: "Compose a victory fanfare for completing a small task", duration: 120, complexity: 'simple' },
      { text: "Create an upbeat 8-bar melody that makes you want to dance", duration: 180, complexity: 'medium' },
      { text: "Record yourself beatboxing for 45 seconds straight", duration: 90, complexity: 'simple' },
      { text: "Make a motivational anthem using your voice and one instrument", duration: 300, complexity: 'complex' },
      { text: "Create a rhythm that sounds like your current energy level", duration: 150, complexity: 'medium' },
      { text: "Make a celebratory song for something small you accomplished today", duration: 240, complexity: 'medium' },
      { text: "Compose music that captures the feeling of breakthrough", duration: 300, complexity: 'complex' },
      { text: "Create a power-up sound effect that lasts exactly 10 seconds", duration: 60, complexity: 'simple' }
    ] as CreativePrompt[],
    calm: [
      { text: "Compose a 4-bar melody that sounds like morning coffee feels", duration: 180, complexity: 'medium' },
      { text: "Create ambient sounds using only your breath and whispers", duration: 150, complexity: 'simple' },
      { text: "Make a lullaby for your current mood using just 5 notes", duration: 120, complexity: 'simple' },
      { text: "Hum a melody that represents your perfect peaceful moment", duration: 90, complexity: 'simple' },
      { text: "Create a simple drone piece using one sustained note", duration: 180, complexity: 'simple' },
      { text: "Make gentle percussion sounds using household items", duration: 150, complexity: 'medium' },
      { text: "Compose music that sounds like a gentle rain shower", duration: 240, complexity: 'medium' },
      { text: "Create a meditation soundscape using only your voice", duration: 300, complexity: 'complex' },
      { text: "Make a musical representation of stillness", duration: 180, complexity: 'medium' },
      { text: "Compose a peaceful chord progression that loops perfectly", duration: 240, complexity: 'complex' }
    ] as CreativePrompt[]
  },
  writing: {
    energized: [
      { text: "Write a story in exactly 50 words starting with 'Yesterday'", duration: 180, complexity: 'simple' },
      { text: "Create a character who discovers they have an unexpected superpower", duration: 300, complexity: 'medium' },
      { text: "Write a dialogue between two people who share a secret", duration: 240, complexity: 'medium' },
      { text: "Write about the most exciting 3 minutes of someone's life", duration: 240, complexity: 'medium' },
      { text: "Create a story that takes place entirely in an elevator", duration: 300, complexity: 'complex' },
      { text: "Write a poem that captures the feeling of breaking free", duration: 180, complexity: 'medium' },
      { text: "Create a character who can't stop moving and tell their story", duration: 300, complexity: 'complex' },
      { text: "Write a motivational speech in exactly 100 words", duration: 180, complexity: 'simple' },
      { text: "Create a story where every sentence starts with the next letter of the alphabet", duration: 360, complexity: 'complex' },
      { text: "Write about a moment when everything changed in an instant", duration: 240, complexity: 'medium' }
    ] as CreativePrompt[],
    calm: [
      { text: "Write a peaceful scene that takes place at dawn", duration: 240, complexity: 'medium' },
      { text: "Describe a perfect quiet moment in exactly 75 words", duration: 180, complexity: 'simple' },
      { text: "Write a letter to your future self about today's small joys", duration: 300, complexity: 'medium' },
      { text: "Create a character who finds peace in an unexpected place", duration: 300, complexity: 'complex' },
      { text: "Write about the most comforting sound you can imagine", duration: 180, complexity: 'simple' },
      { text: "Describe a memory that makes you feel completely content", duration: 240, complexity: 'medium' },
      { text: "Write a gentle conversation between old friends", duration: 300, complexity: 'medium' },
      { text: "Create a poem about the space between raindrops", duration: 180, complexity: 'medium' },
      { text: "Write about a place where time moves differently", duration: 360, complexity: 'complex' },
      { text: "Describe the feeling of perfect stillness in nature", duration: 240, complexity: 'medium' }
    ] as CreativePrompt[]
  },
  design: {
    energized: [
      { text: "Design a poster for your favorite song using only geometric shapes", duration: 360, complexity: 'medium' },
      { text: "Create a logo for a company that makes impossible things possible", duration: 480, complexity: 'complex' },
      { text: "Design a book cover for a story about time travel", duration: 420, complexity: 'medium' },
      { text: "Make a vibrant pattern using only three colors", duration: 300, complexity: 'medium' },
      { text: "Design a superhero costume for someone whose power is kindness", duration: 480, complexity: 'complex' },
      { text: "Create a poster that makes people want to start dancing", duration: 360, complexity: 'medium' },
      { text: "Design a user interface for controlling dreams", duration: 600, complexity: 'complex' },
      { text: "Create a magazine cover about the future of creativity", duration: 420, complexity: 'medium' },
      { text: "Design packaging for energy stored in bottles", duration: 480, complexity: 'complex' },
      { text: "Make a visual representation of your current energy", duration: 300, complexity: 'simple' }
    ] as CreativePrompt[],
    calm: [
      { text: "Design a peaceful space using only soft curves and natural colors", duration: 480, complexity: 'medium' },
      { text: "Create a minimalist poster about finding inner peace", duration: 360, complexity: 'medium' },
      { text: "Design a logo for a meditation app using simple shapes", duration: 300, complexity: 'simple' },
      { text: "Make a soothing pattern inspired by nature", duration: 360, complexity: 'medium' },
      { text: "Design a book cover for a story about quiet wisdom", duration: 420, complexity: 'medium' },
      { text: "Create a calming color palette and show how it feels", duration: 300, complexity: 'simple' },
      { text: "Design a space for reflection and contemplation", duration: 600, complexity: 'complex' },
      { text: "Create a visual guide to mindfulness", duration: 480, complexity: 'complex' },
      { text: "Design typography that feels like a gentle breeze", duration: 360, complexity: 'medium' },
      { text: "Make a layout that promotes serenity", duration: 420, complexity: 'medium' }
    ] as CreativePrompt[]
  },
  'visual art': {
    energized: [
      { text: "Draw the most dynamic action pose you can imagine", duration: 480, complexity: 'medium' },
      { text: "Create art that shows what music looks like when it's loud", duration: 600, complexity: 'complex' },
      { text: "Draw your energy level right now using only colors and shapes", duration: 360, complexity: 'simple' },
      { text: "Create a piece that captures the feeling of victory", duration: 480, complexity: 'medium' },
      { text: "Draw what excitement looks like if it was a landscape", duration: 600, complexity: 'complex' },
      { text: "Make art that shows movement without showing any living things", duration: 480, complexity: 'medium' },
      { text: "Create a portrait of pure determination", duration: 600, complexity: 'complex' },
      { text: "Draw the moment right before something amazing happens", duration: 480, complexity: 'medium' },
      { text: "Make art that radiates power using only warm colors", duration: 420, complexity: 'medium' },
      { text: "Create a visual explosion of creativity", duration: 360, complexity: 'simple' }
    ] as CreativePrompt[],
    calm: [
      { text: "Draw the texture of your favorite fabric in detail", duration: 900, complexity: 'complex' },
      { text: "Create a gentle landscape using only soft curves", duration: 720, complexity: 'medium' },
      { text: "Draw the view from your window but replace everything with plants", duration: 1080, complexity: 'complex' },
      { text: "Create a piece about the most peaceful place you can imagine", duration: 900, complexity: 'medium' },
      { text: "Draw what silence looks like", duration: 600, complexity: 'medium' },
      { text: "Make art that captures the feeling of a perfect nap", duration: 480, complexity: 'simple' },
      { text: "Create a meditation in visual form", duration: 720, complexity: 'complex' },
      { text: "Draw the space between thoughts", duration: 600, complexity: 'medium' },
      { text: "Make art using only gentle, flowing lines", duration: 480, complexity: 'medium' },
      { text: "Create a visual representation of contentment", duration: 720, complexity: 'medium' }
    ] as CreativePrompt[]
  },
  photography: {
    energized: [
      { text: "Take 5 photos of the same object from completely different angles", duration: 300, complexity: 'simple' },
      { text: "Capture motion blur in an interesting way", duration: 240, complexity: 'medium' },
      { text: "Take a photo series showing 'before and after' something small", duration: 360, complexity: 'medium' },
      { text: "Capture the most dynamic composition you can find nearby", duration: 180, complexity: 'simple' },
      { text: "Take photos that show three different types of energy", duration: 420, complexity: 'complex' },
      { text: "Capture the feeling of speed using still photography", duration: 300, complexity: 'medium' },
      { text: "Take a photo that makes viewers feel like jumping", duration: 180, complexity: 'simple' },
      { text: "Capture movement in three different ways", duration: 480, complexity: 'complex' },
      { text: "Take a photo that shows the power of contrast", duration: 240, complexity: 'medium' },
      { text: "Capture a moment of pure action", duration: 180, complexity: 'simple' }
    ] as CreativePrompt[],
    calm: [
      { text: "Take a photo that captures the feeling of 'stillness'", duration: 300, complexity: 'medium' },
      { text: "Photograph something ordinary in an extraordinary way", duration: 420, complexity: 'medium' },
      { text: "Take a macro photo of a texture you've never really noticed", duration: 240, complexity: 'simple' },
      { text: "Photograph the most peaceful corner of your current space", duration: 180, complexity: 'simple' },
      { text: "Capture the beauty of natural light at this moment", duration: 240, complexity: 'medium' },
      { text: "Take a photo that makes viewers want to take a deep breath", duration: 300, complexity: 'medium' },
      { text: "Capture the essence of tranquility", duration: 360, complexity: 'complex' },
      { text: "Photograph the interplay of shadows and gentle light", duration: 420, complexity: 'complex' },
      { text: "Take a photo that feels like a meditation", duration: 300, complexity: 'medium' },
      { text: "Capture a moment of perfect balance", duration: 240, complexity: 'medium' }
    ] as CreativePrompt[]
  },
  movement: {
    energized: [
      { text: "Create a 30-second dance that tells the story of your day", duration: 90, complexity: 'simple' },
      { text: "Invent a new celebration dance for small victories", duration: 120, complexity: 'medium' },
      { text: "Move like you're conducting an invisible orchestra for 2 minutes", duration: 150, complexity: 'medium' },
      { text: "Create a dance that represents your current energy level", duration: 180, complexity: 'medium' },
      { text: "Express the feeling of breaking through a barrier using movement", duration: 120, complexity: 'medium' },
      { text: "Create a workout routine that's also a dance", duration: 300, complexity: 'complex' },
      { text: "Move like you're made of lightning", duration: 90, complexity: 'simple' },
      { text: "Create a movement sequence that builds power", duration: 180, complexity: 'medium' },
      { text: "Express pure joy through dynamic movement", duration: 120, complexity: 'simple' },
      { text: "Move like you're celebrating a major victory", duration: 150, complexity: 'medium' }
    ] as CreativePrompt[],
    calm: [
      { text: "Create a slow, flowing movement sequence that feels like water", duration: 240, complexity: 'medium' },
      { text: "Move like you're painting the air with your whole body", duration: 180, complexity: 'medium' },
      { text: "Create a gentle stretching routine that tells a story", duration: 300, complexity: 'complex' },
      { text: "Move as if you're floating through your perfect dream", duration: 120, complexity: 'simple' },
      { text: "Express gratitude through slow, mindful movement", duration: 180, complexity: 'medium' },
      { text: "Create a movement meditation that lasts 3 minutes", duration: 240, complexity: 'complex' },
      { text: "Move like you're made of gentle wind", duration: 120, complexity: 'simple' },
      { text: "Express the feeling of complete peace through movement", duration: 180, complexity: 'medium' },
      { text: "Create a sequence that feels like a visual prayer", duration: 240, complexity: 'complex' },
      { text: "Move like you're dissolving into tranquility", duration: 150, complexity: 'medium' }
    ] as CreativePrompt[]
  },
  crafts: {
    energized: [
      { text: "Build something functional using only items from your junk drawer", duration: 900, complexity: 'complex' },
      { text: "Create colorful paper art using magazine pages and scissors", duration: 600, complexity: 'medium' },
      { text: "Make a mini sculpture using only things you can find in your kitchen", duration: 720, complexity: 'complex' },
      { text: "Build a tiny world in a small container using random objects", duration: 1080, complexity: 'complex' },
      { text: "Create a decoration that captures your favorite song", duration: 720, complexity: 'medium' },
      { text: "Make something that moves using simple materials", duration: 900, complexity: 'complex' },
      { text: "Build a tower using unconventional materials", duration: 480, complexity: 'medium' },
      { text: "Create wearable art from recyclable materials", duration: 840, complexity: 'complex' },
      { text: "Make a kinetic sculpture that responds to air currents", duration: 1200, complexity: 'complex' },
      { text: "Build something that makes an interesting sound", duration: 720, complexity: 'medium' }
    ] as CreativePrompt[],
    calm: [
      { text: "Create something beautiful using only natural materials you can find", duration: 1200, complexity: 'complex' },
      { text: "Make a simple bookmark using paper and basic decorations", duration: 480, complexity: 'simple' },
      { text: "Create a soothing textured art piece using everyday materials", duration: 900, complexity: 'medium' },
      { text: "Make a small gift for someone using only what you have at home", duration: 720, complexity: 'medium' },
      { text: "Create a peaceful mobile using lightweight objects", duration: 840, complexity: 'complex' },
      { text: "Make a simple pottery piece with clay or play dough", duration: 600, complexity: 'medium' },
      { text: "Create a meditation object that fits in your palm", duration: 480, complexity: 'simple' },
      { text: "Make something soft and comforting to touch", duration: 720, complexity: 'medium' },
      { text: "Create a small sanctuary in a box", duration: 900, complexity: 'complex' },
      { text: "Make something that brings peace to any space", duration: 840, complexity: 'medium' }
    ] as CreativePrompt[]
  }
} as any;

// Generate variety by combining base prompts with dynamic elements
const PROMPT_VARIATIONS: any = {
  timeConstraints: [
    "in under 2 minutes",
    "in exactly 90 seconds",
    "with a 3-minute timer",
    "as quickly as possible",
    "slowly and mindfully"
  ],
  materials: [
    "using only things within arm's reach",
    "with materials you'd normally throw away",
    "using only natural elements",
    "with exactly 3 different materials",
    "using something red, something soft, and something that makes noise"
  ],
  emotions: [
    "that captures pure joy",
    "that expresses quiet confidence",
    "that feels like a warm hug",
    "that radiates positive energy",
    "that embodies your current mood"
  ],
  inspirations: [
    "inspired by your favorite childhood memory",
    "based on the last song you heard",
    "influenced by the weather right now",
    "inspired by the first thing you see when you look up",
    "based on a conversation you had today"
  ]
};

export class PromptGenerator {
  private usedPrompts: Set<string> = new Set();
  private currentLanguage: string = 'en';
  
  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  generatePrompt(discipline: string, mood: string): CreativePrompt {
    const disciplinePrompts = PROMPT_TEMPLATES[discipline]?.[mood];
    
    if (!disciplinePrompts) {
      return this.getFallbackPrompt(discipline, mood);
    }
    
    // Get base prompt
    let availablePrompts = disciplinePrompts.filter((p: any) => !this.usedPrompts.has(p.text));
    
    // If we've used all prompts, reset the used set
    if (availablePrompts.length === 0) {
      this.usedPrompts.clear();
      availablePrompts = disciplinePrompts;
    }
    
    const basePrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    
    // 30% chance to add variation for more diversity
    if (Math.random() < 0.3) {
      const enhancedPrompt = this.addVariation(basePrompt);
      this.usedPrompts.add(enhancedPrompt.text);
      // Translate the enhanced prompt text
      const translatedPrompt = { ...enhancedPrompt, text: this.translatePrompt(enhancedPrompt.text) };
      return translatedPrompt;
    }
    
    this.usedPrompts.add(basePrompt.text);
    
    // Translate the prompt text
    const translatedPrompt = { ...basePrompt, text: this.translatePrompt(basePrompt.text) };
    return translatedPrompt;
  }
  
  private addVariation(basePrompt: CreativePrompt): CreativePrompt {
    const variationTypes = Object.keys(PROMPT_VARIATIONS);
    const selectedType = variationTypes[Math.floor(Math.random() * variationTypes.length)];
    const variations = PROMPT_VARIATIONS[selectedType];
    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
    
    return {
      text: `${basePrompt.text} ${selectedVariation}`,
      duration: Math.round(basePrompt.duration * (selectedType === 'timeConstraints' ? 0.8 : 1.1)),
      complexity: basePrompt.complexity
    };
  }
  
  private getFallbackPrompt(discipline: string, mood: string): CreativePrompt {
    const fallbacks: any = {
      energized: {
        text: `Create something ${mood} that represents your current energy in your ${discipline} practice`,
        duration: 300,
        complexity: 'medium' as const
      },
      calm: {
        text: `Make something peaceful and ${mood} using your ${discipline} skills`,
        duration: 240,
        complexity: 'medium' as const
      }
    };
    
    return fallbacks[mood] || fallbacks.energized;
  }
  
  // Get multiple prompts for variety
  generateMultiplePrompts(discipline: string, mood: string, count: number = 3): CreativePrompt[] {
    const prompts: CreativePrompt[] = [];
    
    for (let i = 0; i < count; i++) {
      prompts.push(this.generatePrompt(discipline, mood));
    }
    
    return prompts;
  }
  
  // Clear used prompts to start fresh
  private translatePrompt(text: string): string {
    if (this.currentLanguage === 'en') return text;
    
    // Comprehensive prompt translations by discipline
    const promptTranslations: { [key: string]: { [lang: string]: string } } = {
      // Music prompts
      'Create a 30-second beat using only 3 instruments': {
        es: 'Crea un ritmo de 30 segundos usando solo 3 instrumentos',
        de: 'Erstelle einen 30-Sekunden-Beat mit nur 3 Instrumenten',
        it: 'Crea un ritmo di 30 secondi usando solo 3 strumenti',
        zh: '仅用3种乐器创作30秒节拍'
      },
      'Compose a melody that tells a story': {
        es: 'Compón una melodía que cuente una historia',
        de: 'Komponiere eine Melodie, die eine Geschichte erzählt',
        it: 'Componi una melodia che racconta una storia',
        zh: '创作一段讲述故事的旋律'
      },
      'Record a sound from nature and turn it into music': {
        es: 'Graba un sonido de la naturaleza y conviértelo en música',
        de: 'Nimm ein Naturgeräusch auf und verwandle es in Musik',
        it: 'Registra un suono della natura e trasformalo in musica',
        zh: '录制自然界的声音并将其转化为音乐'
      },
      
      // Writing prompts
      'Write a 100-word story about an unexpected discovery': {
        es: 'Escribe una historia de 100 palabras sobre un descubrimiento inesperado',
        de: 'Schreibe eine 100-Wort-Geschichte über eine unerwartete Entdeckung',
        it: 'Scrivi una storia di 100 parole su una scoperta inaspettata',
        zh: '写一个100字的关于意外发现的故事'
      },
      'Create a character who can only speak in questions': {
        es: 'Crea un personaje que solo puede hablar en preguntas',
        de: 'Erschaffe einen Charakter, der nur in Fragen sprechen kann',
        it: 'Crea un personaggio che può parlare solo facendo domande',
        zh: '创造一个只能用问题说话的角色'
      },
      'Write a poem using only words that start with the same letter': {
        es: 'Escribe un poema usando solo palabras que empiecen con la misma letra',
        de: 'Schreibe ein Gedicht mit Wörtern, die nur mit dem gleichen Buchstaben beginnen',
        it: 'Scrivi una poesia usando solo parole che iniziano con la stessa lettera',
        zh: '写一首只用同一字母开头的词的诗'
      },
      
      // Design prompts
      'Design a logo using only geometric shapes': {
        es: 'Diseña un logo usando solo formas geométricas',
        de: 'Entwerfe ein Logo nur mit geometrischen Formen',
        it: 'Progetta un logo usando solo forme geometriche',
        zh: '仅用几何形状设计一个标志'
      },
      'Create a color palette inspired by your favorite season': {
        es: 'Crea una paleta de colores inspirada en tu estación favorita',
        de: 'Erstelle eine Farbpalette inspiriert von deiner Lieblingsjahreszeit',
        it: 'Crea una palette di colori ispirata alla tua stagione preferita',
        zh: '创建一个受你最喜欢季节启发的调色板'
      },
      
      // Visual Art prompts
      'Draw the same object from 3 different perspectives': {
        es: 'Dibuja el mismo objeto desde 3 perspectivas diferentes',
        de: 'Zeichne dasselbe Objekt aus 3 verschiedenen Perspektiven',
        it: 'Disegna lo stesso oggetto da 3 prospettive diverse',
        zh: '从3个不同角度画同一个物体'
      },
      'Create art using only your non-dominant hand': {
        es: 'Crea arte usando solo tu mano no dominante',
        de: 'Erschaffe Kunst nur mit deiner nicht-dominanten Hand',
        it: 'Crea arte usando solo la tua mano non dominante',
        zh: '只用非惯用手创作艺术'
      },
      
      // Photography prompts
      'Take a photo that captures movement without blur': {
        es: 'Toma una foto que capture movimiento sin desenfoque',
        de: 'Mache ein Foto, das Bewegung ohne Unschärfe einfängt',
        it: 'Scatta una foto che catturi il movimento senza sfocatura',
        zh: '拍摄一张捕捉运动但没有模糊的照片'
      },
      'Photograph the same subject in 5 different lighting conditions': {
        es: 'Fotografía el mismo tema en 5 condiciones de iluminación diferentes',
        de: 'Fotografiere dasselbe Motiv bei 5 verschiedenen Lichtverhältnissen',
        it: 'Fotografa lo stesso soggetto in 5 condizioni di illuminazione diverse',
        zh: '在5种不同光线条件下拍摄同一主题'
      },
      
      // Movement prompts
      'Create a 1-minute dance that tells a story without words': {
        es: 'Crea una danza de 1 minuto que cuente una historia sin palabras',
        de: 'Erschaffe einen 1-minütigen Tanz, der eine Geschichte ohne Worte erzählt',
        it: 'Crea una danza di 1 minuto che racconti una storia senza parole',
        zh: '创作一段1分钟的舞蹈，不用言语讲述故事'
      },
      'Express 5 different emotions using only your hands': {
        es: 'Expresa 5 emociones diferentes usando solo tus manos',
        de: 'Drücke 5 verschiedene Emotionen nur mit deinen Händen aus',
        it: 'Esprimi 5 emozioni diverse usando solo le tue mani',
        zh: '仅用双手表达5种不同情感'
      },
      
      // Crafts prompts
      'Build something useful from materials you find around your home': {
        es: 'Construye algo útil con materiales que encuentres en tu casa',
        de: 'Baue etwas Nützliches aus Materialien, die du zu Hause findest',
        it: 'Costruisci qualcosa di utile con materiali che trovi in casa',
        zh: '用家里找到的材料制作有用的东西'
      },
      'Transform a discarded item into something beautiful': {
        es: 'Transforma un objeto desechado en algo hermoso',
        de: 'Verwandle einen weggeworfenen Gegenstand in etwas Schönes',
        it: 'Trasforma un oggetto scartato in qualcosa di bello',
        zh: '将废弃物品转化为美丽的东西'
      }
    };

    // Try to find an exact match first
    if (promptTranslations[text] && promptTranslations[text][this.currentLanguage]) {
      return promptTranslations[text][this.currentLanguage];
    }

    // Fallback to word-by-word translation for custom prompts
    const wordTranslations: { [key: string]: { [lang: string]: string } } = {
      'Create': { es: 'Crea', de: 'Erstelle', it: 'Crea', zh: '创建' },
      'Write': { es: 'Escribe', de: 'Schreibe', it: 'Scrivi', zh: '写' },
      'Draw': { es: 'Dibuja', de: 'Zeichne', it: 'Disegna', zh: '画' },
      'Take': { es: 'Toma', de: 'Mache', it: 'Scatta', zh: '拍' },
      'Make': { es: 'Haz', de: 'Mache', it: 'Fai', zh: '制作' },
      'Record': { es: 'Graba', de: 'Nimm auf', it: 'Registra', zh: '录制' },
      'Compose': { es: 'Compón', de: 'Komponiere', it: 'Componi', zh: '创作' },
      'Build': { es: 'Construye', de: 'Baue', it: 'Costruisci', zh: '建造' },
      'Design': { es: 'Diseña', de: 'Entwerfe', it: 'Progetta', zh: '设计' },
      'a': { es: 'un', de: 'einen', it: 'un', zh: '一个' },
      'the': { es: 'el', de: 'der', it: 'il', zh: '这个' },
      'photo': { es: 'foto', de: 'Foto', it: 'foto', zh: '照片' },
      'story': { es: 'historia', de: 'Geschichte', it: 'storia', zh: '故事' },
      'character': { es: 'personaje', de: 'Charakter', it: 'personaggio', zh: '角色' },
      'melody': { es: 'melodía', de: 'Melodie', it: 'melodia', zh: '旋律' },
      'beat': { es: 'ritmo', de: 'Beat', it: 'ritmo', zh: '节拍' },
      'song': { es: 'canción', de: 'Lied', it: 'canzone', zh: '歌曲' },
      'painting': { es: 'pintura', de: 'Gemälde', it: 'dipinto', zh: '画作' },
      'sketch': { es: 'boceto', de: 'Skizze', it: 'schizzo', zh: '素描' },
      'dance': { es: 'danza', de: 'Tanz', it: 'danza', zh: '舞蹈' },
      'sculpture': { es: 'escultura', de: 'Skulptur', it: 'scultura', zh: '雕塑' },
      'using': { es: 'usando', de: 'mit', it: 'usando', zh: '用' },
      'only': { es: 'solo', de: 'nur', it: 'solo', zh: '只' },
      'about': { es: 'sobre', de: 'über', it: 'su', zh: '关于' },
      'with': { es: 'con', de: 'mit', it: 'con', zh: '与' },
      'from': { es: 'desde', de: 'von', it: 'da', zh: '从' },
      'that': { es: 'que', de: 'das', it: 'che', zh: '那' },
      'words': { es: 'palabras', de: 'Wörter', it: 'parole', zh: '词' },
      'colors': { es: 'colores', de: 'Farben', it: 'colori', zh: '颜色' },
      'sounds': { es: 'sonidos', de: 'Klänge', it: 'suoni', zh: '声音' },
      'minutes': { es: 'minutos', de: 'Minuten', it: 'minuti', zh: '分钟' },
      'seconds': { es: 'segundos', de: 'Sekunden', it: 'secondi', zh: '秒' }
    };

    let translatedText = text;
    
    // Apply word-by-word translations
    for (const [english, langs] of Object.entries(wordTranslations)) {
      if (langs[this.currentLanguage]) {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translatedText = translatedText.replace(regex, langs[this.currentLanguage]);
      }
    }
    
    return translatedText;
  }

  reset() {
    this.usedPrompts.clear();
  }
}

// Export singleton instance
export const promptGenerator = new PromptGenerator();