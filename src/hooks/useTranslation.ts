import { useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

export const useTranslation = (language: string = 'en') => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test translation service on first load
        if (language !== 'en') {
          await translationService.testConnection();
        }
        
        const translatedTexts = await translationService.getTranslations(language);
        setTranslations(translatedTexts);
      } catch (err) {
        console.error('Failed to load translations:', err);
        setError('Failed to load translations');
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const translateText = async (text: string): Promise<string> => {
    if (language === 'en') return text;
    
    try {
      return await translationService.translateText(text, language);
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    }
  };

  return {
    t,
    translateText,
    isLoading,
    error,
    language,
    translations
  };
};