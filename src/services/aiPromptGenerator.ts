// Lightweight AI prompt generator using Transformers.js
// Runs completely in the browser, no API calls needed
class AIPromptGenerator {
  private generator: any = null;
  private isLoading = false;

  async initialize() {
    if (this.generator || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Dynamically import Transformers.js to avoid bundling issues
      const { pipeline } = await import('@xenova/transformers');
      
      // Use a lightweight text generation model that runs well in browsers
      this.generator = await pipeline('text-generation', 'Xenova/distilgpt2', {
        // device: 'webgpu', // Removed as 'device' is not a valid property in PretrainedOptions
        // dtype: 'fp16' // Use half precision for faster inference
      });
      console.log('AI prompt generator initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI prompt generator:', error);
      // Don't throw error, just log it - we'll use fallback prompts
    } finally {
      this.isLoading = false;
    }
  }

  async generateCreativePrompt(discipline: string, mood: string): Promise<string> {
    // Always start with fallback prompts for instant response
    // AI will be available for future use once initialized
    if (!this.generator) {
      // Initialize AI in background for next time
      this.initialize();
      return this.getFallbackPrompt(discipline, mood);
    }

    const prompts = this.createPromptTemplates(discipline, mood);
    const seed = prompts[Math.floor(Math.random() * prompts.length)];

    try {
      // Generate creative prompt using AI
      const result = await this.generator(seed, {
        max_new_tokens: 50,
        temperature: 0.8,
        do_sample: true,
        top_p: 0.9,
        repetition_penalty: 1.1
      });

      // Extract and clean the generated text
      let generatedText = result[0].generated_text;
      
      // Remove the seed prompt from the result
      generatedText = generatedText.replace(seed, '').trim();
      
      // Clean up the text to ensure it's a proper creative prompt
      generatedText = this.cleanAndFormat(generatedText, discipline);
      
      // If the AI generation didn't work well, fall back to curated prompts
      if (!generatedText || generatedText.length < 20) {
        return this.getFallbackPrompt(discipline, mood);
      }

      console.log('AI-generated prompt:', generatedText);
      return generatedText;
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      return this.getFallbackPrompt(discipline, mood);
    }
  }

  private createPromptTemplates(discipline: string, mood: string): string[] {
    const moodPrefix = mood === 'energized' ? 'Create an energetic' : 'Create a peaceful';
    
    const templates: { [key: string]: string[] } = {
      'music': [
        `${moodPrefix} musical piece that`,
        `Compose a ${mood} melody that`,
        `Make a ${mood} rhythm that`,
        `Create a musical composition that`
      ],
      'writing': [
        `Write a ${mood} story about`,
        `Create a ${mood} narrative that`,
        `Write a creative piece that`,
        `Develop a ${mood} character who`
      ],
      'design': [
        `Design a ${mood} visual concept that`,
        `Create a ${mood} design that`,
        `Design something that`,
        `Develop a visual idea that`
      ],
      'visual art': [
        `Create a ${mood} artwork that`,
        `Draw or paint something that`,
        `Make a visual piece that`,
        `Create art that expresses`
      ],
      'photography': [
        `Capture a ${mood} photograph that`,
        `Take a photo that`,
        `Create a photographic composition that`,
        `Photograph something that`
      ],
      'movement': [
        `Create a ${mood} movement that`,
        `Express through movement`,
        `Develop a physical expression that`,
        `Move in a way that`
      ],
      'crafts': [
        `Make a ${mood} handmade piece that`,
        `Craft something that`,
        `Create with your hands something that`,
        `Build or make something that`
      ]
    };

    return templates[discipline] || templates['writing'];
  }

  private cleanAndFormat(text: string, discipline: string): string {
    // Remove incomplete sentences and weird characters
    text = text.replace(/[^\w\s.,!?-]/g, '');
    
    // Split into sentences and take the first complete one
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length === 0) return '';
    
    let prompt = sentences[0].trim();
    
    // Ensure it's a proper creative prompt format
    if (!prompt.toLowerCase().includes('create') && 
        !prompt.toLowerCase().includes('make') && 
        !prompt.toLowerCase().includes('write') &&
        !prompt.toLowerCase().includes('design') &&
        !prompt.toLowerCase().includes('compose')) {
      
      const actionWords: { [key: string]: string } = {
        'music': 'Create',
        'writing': 'Write',
        'design': 'Design',
        'visual art': 'Create',
        'photography': 'Capture',
        'movement': 'Express',
        'crafts': 'Make'
      };
      
      prompt = `${actionWords[discipline] || 'Create'} ${prompt.toLowerCase()}`;
    }

    // Ensure it ends with proper punctuation
    if (!prompt.endsWith('.') && !prompt.endsWith('!') && !prompt.endsWith('?')) {
      prompt += '.';
    }

    return prompt;
  }

  private getFallbackPrompt(discipline: string, mood: string): string {
    const fallbackPrompts: { [key: string]: { [key: string]: string[] } } = {
      'music': {
        'energized': [
          'Create a high-energy beat that makes you want to move.',
          'Compose a melody that captures the feeling of victory.',
          'Make a rhythm that sounds like pure excitement.',
          'Create a musical piece that energizes everyone who hears it.'
        ],
        'calm': [
          'Compose a peaceful melody that soothes the soul.',
          'Create ambient sounds that help you relax.',
          'Make a gentle tune that feels like a warm hug.',
          'Compose music that sounds like tranquility itself.'
        ]
      },
      'writing': {
        'energized': [
          'Write an adventure story that keeps readers on the edge of their seats.',
          'Create a character who discovers they have an amazing superpower.',
          'Write about the most exciting day of someone\'s life.',
          'Create a story that starts with an unexpected discovery.'
        ],
        'calm': [
          'Write about a peaceful moment that changed everything.',
          'Describe a place where time seems to stand still.',
          'Create a story about finding inner peace.',
          'Write about a quiet conversation that reveals deep truths.'
        ]
      },
      'design': {
        'energized': [
          'Design something that captures the energy of a lightning storm.',
          'Create a visual that makes people feel instantly motivated.',
          'Design a logo that radiates power and confidence.',
          'Create something that looks like pure energy in visual form.'
        ],
        'calm': [
          'Design something that feels like a gentle breeze.',
          'Create a peaceful space that promotes relaxation.',
          'Design a visual that makes people feel at peace.',
          'Create something that looks like serenity.'
        ]
      },
      'visual art': {
        'energized': [
          'Create art that bursts with life and energy.',
          'Draw something that captures the feeling of breaking free.',
          'Make art that radiates power and strength.',
          'Create a piece that makes viewers feel energized.'
        ],
        'calm': [
          'Create art that feels like a quiet sanctuary.',
          'Draw something that promotes inner peace.',
          'Make art that soothes and comforts.',
          'Create a piece that feels like a gentle meditation.'
        ]
      },
      'photography': {
        'energized': [
          'Capture a moment of pure action and energy.',
          'Photograph something that shows power in motion.',
          'Take a picture that radiates excitement.',
          'Capture the energy of a perfect moment.'
        ],
        'calm': [
          'Capture a moment of perfect stillness.',
          'Photograph something that promotes peace.',
          'Take a picture that feels like a deep breath.',
          'Capture the beauty of quiet moments.'
        ]
      },
      'movement': {
        'energized': [
          'Express explosive energy through dynamic movement.',
          'Create a dance that radiates power and confidence.',
          'Move like you\'re breaking through barriers.',
          'Express the feeling of unstoppable momentum.'
        ],
        'calm': [
          'Move like water flowing gently downstream.',
          'Express peace through slow, mindful movement.',
          'Create movement that feels like meditation in motion.',
          'Express the feeling of being completely centered.'
        ]
      },
      'crafts': {
        'energized': [
          'Make something that captures your passion and drive.',
          'Create with bold colors and dynamic shapes.',
          'Build something that represents breaking through limits.',
          'Make something that radiates positive energy.'
        ],
        'calm': [
          'Create something that brings peace to any space.',
          'Make something using soft, natural materials.',
          'Build something that promotes relaxation.',
          'Create something that feels like a gentle embrace.'
        ]
      }
    };

    const disciplinePrompts = fallbackPrompts[discipline] || fallbackPrompts['writing'];
    const moodPrompts = disciplinePrompts[mood] || disciplinePrompts['energized'];
    
    return moodPrompts[Math.floor(Math.random() * moodPrompts.length)];
  }

  // Check if the AI model is ready
  isReady(): boolean {
    return this.generator !== null && !this.isLoading;
  }

  // Get loading status
  isInitializing(): boolean {
    return this.isLoading;
  }
}

// Export singleton instance
export const aiPromptGenerator = new AIPromptGenerator();