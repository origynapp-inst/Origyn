import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('origyn_theme') as Theme;
    if (stored && ['light', 'dark'].includes(stored)) {
      return stored;
    }
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    
    return defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('origyn_theme', newTheme);
    
    // Update document class for global theme styling
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no manual preference is stored
      const storedTheme = localStorage.getItem('origyn_theme');
      if (!storedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for theme-aware className generation
export const useThemeClasses = () => {
  const { theme } = useTheme();
  
  return {
    // Background classes
    bg: {
      primary: theme === 'dark' ? 'bg-black' : 'bg-white',
      secondary: theme === 'dark' ? 'bg-white/5' : 'bg-black/5',
      accent: theme === 'dark' ? 'bg-white/10' : 'bg-black/10',
      glass: theme === 'dark' 
        ? 'bg-white/5 border-white/10 backdrop-blur-xl' 
        : 'bg-black/5 border-black/10 backdrop-blur-xl',
    },
    // Text classes  
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-black',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    // Border classes
    border: {
      default: theme === 'dark' ? 'border-white/10' : 'border-black/10',
      accent: theme === 'dark' ? 'border-white/20' : 'border-black/20',
    },
    // Utility function for conditional classes
    conditional: (darkClass: string, lightClass: string) => 
      theme === 'dark' ? darkClass : lightClass,
  };
};
