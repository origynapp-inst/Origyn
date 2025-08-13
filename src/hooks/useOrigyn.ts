import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from '../lib/queryClient';

// Duration estimation helper function
// const estimatePromptDuration = (prompt: string, discipline: string): number => {
//   // Base duration by discipline (in seconds)
//   const baseDurations: { [key: string]: number } = {
//     'music': 120,        // 2 minutes
//     'writing': 240,      // 4 minutes
//     'design': 360,       // 6 minutes
//     'visual art': 600,   // 10 minutes
//     'photography': 180,  // 3 minutes
//     'movement': 120,     // 2 minutes
//     'crafts': 600        // 10 minutes
//   };

//   let baseDuration = baseDurations[discipline] || 300;

//   // Adjust based on prompt complexity
//   const complexity = prompt.split(' ').length;
//   if (complexity > 15) baseDuration *= 1.2;
//   if (complexity < 8) baseDuration *= 0.8;

//   return Math.round(baseDuration);
// };

export interface User {
  id: number;
  username: string;
  selectedDiscipline: string;
  mood: string;
  creationFrequency: string;
  streak: number;
  xp: number;
  level: number;
  theme: string;
  language: string;
  notificationsEnabled: boolean;
  notificationTime: string;
  lastCompletionDate: string | null;
  todayCompleted: boolean;
  createdAt: Date;
}

export interface MuseMessage {
  id: number;
  userId: number;
  type: 'user' | 'muse';
  message: string;
  createdAt: Date;
}

export interface Achievement {
  id: number;
  userId: number;
  achievementId: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate: string | null;
  createdAt: Date;
}

export interface WeeklyData {
  day: string;
  completed: boolean;
  duration: number;
}

interface LocalJournalEntry {
  id: number;
  date: string;
  prompt: string;
  creation: string;
  duration: number;
  mood: string;
  reflection: string;
  fileUrl?: string | null;
}

interface LocalSavedPrompt {
  id: number;
  prompt: string;
  discipline: string;
  mood: string;
  date: string;
}

interface LocalAchievement {
  id: number;
  name: string;
  desc: string;
  icon: any;
  unlocked: boolean;
  date: string | null;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File; // Add the actual file for server upload
}

export const useOrigyn = () => {
  // Core state - check for existing user first
  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    const savedUser = localStorage.getItem('origyn_user');
    return savedUser ? 'home' : 'onboarding';
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [mood, setMood] = useState('');
  const [creationFrequency, setCreationFrequency] = useState('');
  const [dailyPrompt, setDailyPrompt] = useState(
    'crafting the ideal daily prompt for you!'
  );
  const [estimatedDuration, setEstimatedDuration] = useState(300); // Default 5 minutes
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('origyn_language');
    return stored || 'en';
  });

  // Creation state
  const [currentCreation, setCurrentCreation] = useState('');
  const [currentReflection, setCurrentReflection] = useState('');
  const [creationTimer, setCreationTimer] = useState(0);
  const [completionTime, setCompletionTime] = useState(0); // Store completion time for display
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Muse state
  const [museMessages, setMuseMessages] = useState<MuseMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isMuseTyping, setIsMuseTyping] = useState(false);

  // UI state
  const [showPreferences, setShowPreferences] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Local data state
  const [journalEntries, setJournalEntries] = useState<LocalJournalEntry[]>(
    () => {
      const saved = localStorage.getItem('origyn_journal_entries');
      return saved ? JSON.parse(saved) : [];
    }
  );
  const [savedPrompts, setSavedPrompts] = useState<LocalSavedPrompt[]>([]);
  const [achievements, setAchievements] = useState<LocalAchievement[]>([
    {
      id: 1,
      name: 'First Creation',
      desc: 'Complete your first creative session',
      icon: null,
      unlocked: false,
      date: null,
    },
    {
      id: 2,
      name: '3-Day Streak',
      desc: 'Create for 3 days in a row',
      icon: null,
      unlocked: false,
      date: null,
    },
    {
      id: 3,
      name: 'Week Warrior',
      desc: 'Complete a full week',
      icon: null,
      unlocked: false,
      date: null,
    },
    {
      id: 4,
      name: 'Level Up',
      desc: 'Reach Level 2',
      icon: null,
      unlocked: false,
      date: null,
    },
  ]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyMood, setMonthlyMood] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Mock user query for now
  // Local user state (for demo purposes)
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('origyn_user');
    return stored ? JSON.parse(stored) : null;
  });
  const userLoading = false;

  // Computed values
  const level = Math.floor((user?.xp || 0) / 500) + 1;
  const xp = user?.xp || 0;
  const streak = user?.streak || 0;
  const todayCompleted = user?.todayCompleted || false;

  const calculateNextLevel = useCallback(() => {
    return level * 500;
  }, [level]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progressPercentage =
    ((xp % calculateNextLevel()) / calculateNextLevel()) * 100;

  // Initialize user data from localStorage on first load
  useEffect(() => {
    const savedUser = localStorage.getItem('origyn_user');
    console.log('🔍 Loading saved user:', savedUser);

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('✅ Parsed user data:', parsedUser);

        // Always set user data regardless of current state
        setUser(parsedUser);
        setSelectedDiscipline(parsedUser.selectedDiscipline || 'music');
        setMood(parsedUser.mood || 'energized');
        setCreationFrequency(parsedUser.creationFrequency || 'daily');
        setTheme(parsedUser.theme || 'dark');
        setLanguage(parsedUser.language || 'en');
        setCurrentScreen('home');

        // SINGLE PROMPT GENERATION - prevent duplicates
        console.log(
          '🔄 About to generate fresh prompt. User discipline:',
          parsedUser.selectedDiscipline
        );

        // Generate fresh prompt immediately - no conditions
        (async () => {
          try {
            console.log(
              '🚀 Generating fresh prompt on app load for:',
              parsedUser.selectedDiscipline,
              parsedUser.mood
            );

            // Get recent prompts to avoid repetition
            const savedEntries = JSON.parse(
              localStorage.getItem('origyn_journal_entries') || '[]'
            );
            const recentPrompts = savedEntries
              .slice(-5)
              .map((entry: any) => entry.prompt)
              .filter(Boolean);

            const response = await fetch('/api/prompts/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                discipline: parsedUser.selectedDiscipline,
                mood: parsedUser.mood,
                previousPrompts: recentPrompts,
                language: parsedUser.language,
              }),
            });

            if (response.ok) {
              const { prompt, estimatedDuration } = await response.json();
              console.log('🎯 Fresh prompt generated on app load:', prompt);
              setDailyPrompt(prompt);
              setEstimatedDuration(estimatedDuration);
            } else {
              console.error('❌ API response not ok:', response.status);
              // Show loading message and retry
              setDailyPrompt('Generating your creative prompt...');
              setEstimatedDuration(300);
            }
          } catch (error) {
            console.error(
              '❌ Error generating fresh prompt on app load:',
              error
            );
            // Show loading message and retry
            setDailyPrompt('Generating your creative prompt...');
            setEstimatedDuration(300);
          }
        })();

        console.log('✅ User loaded successfully, going to home screen');
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        setCurrentScreen('onboarding');
      }
    } else {
      console.log('🔄 No saved user found, starting onboarding');
      setCurrentScreen('onboarding');
    }
  }, []); // Remove dependency to prevent infinite loops

  // Auto-save journal entries to localStorage
  useEffect(() => {
    localStorage.setItem(
      'origyn_journal_entries',
      JSON.stringify(journalEntries)
    );
  }, [journalEntries]);

  // Calculate weekly data based on actual journal entries
  useEffect(() => {
    const calculateWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date();

      // Get the start of this week (Monday)
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const newWeeklyData = days.map((dayName, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        const dayString = currentDay.toDateString();

        // Check if this day has any journal entries
        const dayEntries = journalEntries.filter((entry) => {
          const entryDate = new Date(entry.date).toDateString();
          return entryDate === dayString;
        });

        const totalDuration = dayEntries.reduce(
          (sum, entry) => sum + entry.duration,
          0
        );

        return {
          day: dayName,
          completed: dayEntries.length > 0,
          duration: totalDuration,
        };
      });

      setWeeklyData(newWeeklyData);
    };

    calculateWeeklyData();
  }, [journalEntries]);

  // Initialize muse messages
  useEffect(() => {
    if (museMessages.length === 0) {
      setMuseMessages([
        {
          id: 1,
          userId: 1,
          type: 'muse',
          message:
            "Hello! I'm your creative muse. I'm here to inspire, guide, and support your artistic journey. What would you like to create today?",
          createdAt: new Date(),
        },
      ]);
    }
  }, [museMessages.length]);

  // User update mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!user?.id) {
        throw new Error('No user ID available');
      }
      return apiRequest('GET', `/api/user/${user.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error) => {
      console.error('User update failed:', error);
    },
  });

  // Action handlers
  const handleDisciplineSelect = useCallback(
    async (discipline: string) => {
      setSelectedDiscipline(discipline);

      // Update user object and save to localStorage
      if (user) {
        const updatedUser = { ...user, selectedDiscipline: discipline };
        setUser(updatedUser);
        localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
      }

      // Generate new prompt for the selected discipline using AI
      if (discipline) {
        try {
          console.log(
            '🚀 Generating fresh prompt for discipline change:',
            discipline,
            mood
          );

          // Get recent prompts to avoid repetition
          const savedEntries = JSON.parse(
            localStorage.getItem('origyn_journal_entries') || '[]'
          );
          const recentPrompts = savedEntries
            .slice(-5)
            .map((entry: any) => entry.prompt)
            .filter(Boolean);

          const response = await fetch('/api/prompts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discipline: discipline,
              mood: mood,
              previousPrompts: recentPrompts,
              language: language,
            }),
          });

          if (response.ok) {
            const { prompt, estimatedDuration } = await response.json();
            console.log(
              '✅ Fresh prompt generated for discipline change:',
              prompt
            );
            setDailyPrompt(prompt);
            setEstimatedDuration(estimatedDuration);
          } else {
            console.error('❌ Failed to generate prompt for discipline change');
            // Show loading state
            setDailyPrompt('Crafting your perfect prompt...');
            setEstimatedDuration(300);
          }
        } catch (error) {
          console.error(
            '❌ Error generating prompt for discipline change:',
            error
          );
          // Show loading state
          setDailyPrompt('Crafting your perfect prompt...');
          setEstimatedDuration(300);
        }
      }
    },
    [mood, language, user]
  );

  const handleMoodSelect = useCallback(
    async (selectedMood: string) => {
      setMood(selectedMood);

      // Update user object and save to localStorage
      if (user) {
        const updatedUser = { ...user, mood: selectedMood };
        setUser(updatedUser);
        localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
      }

      // Generate new AI prompt for the selected mood
      if (selectedDiscipline) {
        try {
          console.log(
            '🚀 Generating fresh prompt for mood change:',
            selectedDiscipline,
            selectedMood
          );

          // Get recent prompts to avoid repetition
          const savedEntries = JSON.parse(
            localStorage.getItem('origyn_journal_entries') || '[]'
          );
          const recentPrompts = savedEntries
            .slice(-5)
            .map((entry: any) => entry.prompt)
            .filter(Boolean);

          const response = await fetch('/api/prompts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discipline: selectedDiscipline,
              mood: selectedMood,
              previousPrompts: recentPrompts,
              language: language,
            }),
          });

          if (response.ok) {
            const { prompt, estimatedDuration } = await response.json();
            console.log('✅ Fresh prompt generated for mood change:', prompt);
            setDailyPrompt(prompt);
            setEstimatedDuration(estimatedDuration);
          } else {
            console.error('❌ Failed to generate prompt for mood change');
            // Show loading state
            setDailyPrompt('Crafting your perfect prompt...');
            setEstimatedDuration(300);
          }
        } catch (error) {
          console.error('❌ Error generating prompt for mood change:', error);
          // Show loading state
          setDailyPrompt('Crafting your perfect prompt...');
          setEstimatedDuration(300);
        }
      }
    },
    [selectedDiscipline, language, user]
  );

  const handleFrequencySelect = useCallback(
    (frequency: string) => {
      setCreationFrequency(frequency);

      // Update user object and save to localStorage
      if (user) {
        const updatedUser = { ...user, creationFrequency: frequency };
        setUser(updatedUser);
        localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
      }
    },
    [user]
  );

  const handleThemeChange = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);

      // Update user object and save to localStorage
      if (user) {
        const updatedUser = { ...user, theme: newTheme };
        setUser(updatedUser);
        localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
      }
    },
    [user]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);

      // Update user object and save to localStorage
      if (user) {
        const updatedUser = { ...user, language: newLanguage };
        setUser(updatedUser);
        localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
      }
    },
    [user]
  );

  const completeOnboarding = useCallback(async () => {
    try {
      // Create user profile
      const newUser: User = {
        id: 1,
        username: 'Creative Explorer',
        selectedDiscipline: selectedDiscipline,
        mood: mood,
        creationFrequency: creationFrequency,
        streak: 0,
        xp: 0,
        level: 1,
        theme: theme,
        language: language,
        notificationsEnabled: true,
        notificationTime: '09:00',
        lastCompletionDate: null,
        todayCompleted: false,
        createdAt: new Date(),
      };

      setUser(newUser);

      // Save to localStorage
      localStorage.setItem('origyn_user', JSON.stringify(newUser));
      localStorage.setItem('origyn_language', newUser.language);

      // Show loading animation immediately
      setDailyPrompt('crafting the ideal daily prompt for you!');
      setEstimatedDuration(300);

      // Move to home screen - let the user initialization handle prompt generation
      setCurrentScreen('home');

      // DON'T generate prompt here - let the app reload handle it to prevent duplicates
      console.log(
        '✅ Onboarding completed, user will be initialized on next load'
      );
    } catch (err) {
      setError('Failed to complete onboarding');
    }
  }, [selectedDiscipline, mood, creationFrequency, theme, language]);

  const startCreation = useCallback(() => {
    setCurrentScreen('creation');
    setCreationTimer(0);
    setCurrentCreation('');
    setUploadedFile(null);
    setIsCreating(true); // Automatically start the timer
  }, []);

  const completeCreation = useCallback(async () => {
    if (!currentCreation.trim() || creationTimer < 10) return;

    console.log('=== COMPLETE CREATION DEBUG ===');
    console.log('Has uploaded file:', !!uploadedFile);
    console.log('Uploaded file details:', uploadedFile);

    let serverFileUrl = null;

    // Upload file to server if exists
    if (uploadedFile?.file) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile.file);
        formData.append('userId', user?.id?.toString() || '1');
        formData.append('prompt', dailyPrompt);
        formData.append('creation', currentCreation);
        formData.append('duration', creationTimer.toString());
        formData.append('mood', mood);
        formData.append('date', new Date().toISOString().split('T')[0]);

        const response = await fetch('/api/journal', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          serverFileUrl = data.entry?.fileUrl;
          console.log('File upload successful:', data);
          console.log('Server file URL:', serverFileUrl);
        } else {
          console.error('File upload failed:', response.status);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    // If we have a file, we should have uploaded it to the server already
    // Use the server URL if available, otherwise fallback to local URL for preview
    const finalFileUrl = serverFileUrl || uploadedFile?.url || null;

    // Add to local journal entries
    const newEntry: LocalJournalEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      prompt: dailyPrompt,
      creation: currentCreation,
      duration: creationTimer,
      mood: mood,
      reflection: '',
      fileUrl: finalFileUrl,
    };

    console.log('Creating journal entry with fileUrl:', newEntry.fileUrl);
    console.log('Server file URL was:', serverFileUrl);
    console.log('Uploaded file URL was:', uploadedFile?.url);
    console.log('Final file URL:', finalFileUrl);

    setJournalEntries((prev) => [...prev, newEntry]);

    // Update user stats and achievements
    if (user) {
      const baseXP = 50;
      const timeBonus = Math.min(Math.floor(creationTimer / 10) * 10, 100);
      const earnedXP = baseXP + timeBonus;

      const newXP = user.xp + earnedXP;
      const newLevel = Math.floor(newXP / 500) + 1;

      // Update streak - only increment once per day
      const today = new Date().toDateString();
      let newStreak = user.streak;

      if (user.lastCompletionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (!user.lastCompletionDate) {
          // First time completing
          newStreak = 1;
        } else if (user.lastCompletionDate === yesterdayStr) {
          // Consecutive day
          newStreak = user.streak + 1;
        } else {
          // Gap in streak, reset to 1
          newStreak = 1;
        }
      }

      const updatedUser = {
        ...user,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastCompletionDate: today,
        todayCompleted: true,
      };

      setUser(updatedUser);
      // Save updated user to localStorage
      localStorage.setItem('origyn_user', JSON.stringify(updatedUser));
    }

    // Check for achievements
    if (journalEntries.length === 0) {
      setAchievements((prev) =>
        prev.map((ach) =>
          ach.id === 1
            ? { ...ach, unlocked: true, date: new Date().toISOString() }
            : ach
        )
      );
    }

    if (journalEntries.length >= 2) {
      setAchievements((prev) =>
        prev.map((ach) =>
          ach.id === 2
            ? { ...ach, unlocked: true, date: new Date().toISOString() }
            : ach
        )
      );
    }

    if (journalEntries.length >= 6) {
      setAchievements((prevAch) =>
        prevAch.map((ach) =>
          ach.id === 3
            ? { ...ach, unlocked: true, date: new Date().toISOString() }
            : ach
        )
      );
    }

    if (level >= 2) {
      setAchievements((prevAch) =>
        prevAch.map((ach) =>
          ach.id === 4
            ? { ...ach, unlocked: true, date: new Date().toISOString() }
            : ach
        )
      );
    }

    // Store completion time before resetting timer
    setCompletionTime(creationTimer);

    // Show completion screen first
    setCurrentScreen('completion');
    setCreationTimer(0);
    setIsCreating(false);

    // Auto-generate new prompt for tomorrow - instant background generation
    setTimeout(async () => {
      try {
        const recentPrompts = journalEntries
          .slice(-5)
          .map((entry) => entry.prompt)
          .filter((prompt) => prompt !== dailyPrompt);

        const response = await fetch('/api/prompts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discipline: selectedDiscipline,
            mood: mood,
            previousPrompts: recentPrompts,
          }),
        });

        if (response.ok) {
          const { prompt, estimatedDuration } = await response.json();
          setDailyPrompt(prompt);
          setEstimatedDuration(estimatedDuration);
        }
      } catch (error) {
        console.error('Error generating new prompt:', error);
      }
    }, 1500); // Reduced delay for faster prompt generation
  }, [
    currentCreation,
    creationTimer,
    dailyPrompt,
    mood,
    uploadedFile,
    journalEntries.length,
    level,
    selectedDiscipline,
    journalEntries,
  ]);

  const savePrompt = useCallback(async () => {
    // Prevent saving during initial loading
    if (dailyPrompt === 'crafting the ideal daily prompt for you!') {
      return;
    }

    setIsSavingPrompt(true);

    // Check if prompt already exists
    const promptExists = savedPrompts.some(
      (saved) => saved.prompt === dailyPrompt
    );

    if (!promptExists) {
      const newPrompt: LocalSavedPrompt = {
        id: Date.now(),
        prompt: dailyPrompt,
        discipline: selectedDiscipline,
        mood: mood,
        date: new Date().toISOString(),
      };

      // Simulate brief animation for good UX
      setTimeout(() => {
        setSavedPrompts((prev) => [...prev, newPrompt]);
        setIsSavingPrompt(false);
        setShowSaveSuccess(true);

        // Hide success message after 2 seconds
        setTimeout(() => setShowSaveSuccess(false), 2000);
      }, 500);
    } else {
      // Already saved, just show success briefly
      setTimeout(() => {
        setIsSavingPrompt(false);
        setShowSaveSuccess(true);

        // Hide success message after 2 seconds
        setTimeout(() => setShowSaveSuccess(false), 2000);
      }, 500);
    }
  }, [dailyPrompt, selectedDiscipline, mood, savedPrompts]);

  const removeSavedPrompt = useCallback((promptId: number) => {
    setSavedPrompts((prev) => prev.filter((prompt) => prompt.id !== promptId));
  }, []);

  const startCreationWithSavedPrompt = useCallback((prompt: string) => {
    setDailyPrompt(prompt);
    setCurrentScreen('creation');
    setCreationTimer(0);
    setCurrentCreation('');
    setUploadedFile(null);
    setCurrentReflection('');
    setIsCreating(true); // Auto-start timer when using saved prompts
  }, []);

  const generateNewPrompt = useCallback(async () => {
    // Always use user's current discipline and mood from the user object or fallback to state
    const currentDiscipline =
      user?.selectedDiscipline || selectedDiscipline || 'music';
    const currentMood = user?.mood || mood || 'energized';
    const currentLanguage = user?.language || language || 'en';

    console.log(
      'generateNewPrompt called with discipline:',
      currentDiscipline,
      'mood:',
      currentMood
    );

    setIsGeneratingPrompt(true);

    try {
      // Get recent prompts to avoid repetition - include current daily prompt too
      const recentPrompts = [
        dailyPrompt,
        ...journalEntries.slice(-5).map((entry) => entry.prompt),
      ].filter(
        (prompt) => prompt && prompt !== 'Loading your creative prompt...'
      );

      // Call instant prompt generation API
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: currentDiscipline,
          mood: currentMood,
          previousPrompts: recentPrompts,
          language: currentLanguage,
        }),
      });

      if (response.ok) {
        const { prompt, estimatedDuration, source } = await response.json();
        console.log(`Generated new prompt from ${source}:`, prompt);
        setDailyPrompt(prompt);
        setEstimatedDuration(estimatedDuration);
        setIsGeneratingPrompt(false);
        return;
      }
    } catch (error) {
      console.error('Error generating new prompt:', error);
      // Show loading state and retry
      setDailyPrompt('Crafting your perfect prompt...');
      setEstimatedDuration(300);
      setIsGeneratingPrompt(false);
    }
  }, [user, selectedDiscipline, mood, language, dailyPrompt, journalEntries]);

  const sendMuseMessage = useCallback(async () => {
    if (!userMessage.trim()) return;

    const newUserMessage: MuseMessage = {
      id: Date.now(),
      userId: 1,
      type: 'user',
      message: userMessage,
      createdAt: new Date(),
    };

    setMuseMessages((prev) => [...prev, newUserMessage]);
    setUserMessage('');
    setIsMuseTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a wonderful perspective! How does that connect to your creative practice?",
        'I love that idea. What if you explored that feeling through your art?',
        'Interesting! What would happen if you approached that differently?',
        'That reminds me of something beautiful. Can you capture that essence?',
        'Great insight! How might that inspire your next creation?',
        "I can sense the creativity flowing. What's calling to you right now?",
      ];

      const museResponse: MuseMessage = {
        id: Date.now() + 1,
        userId: 1,
        type: 'muse',
        message: responses[Math.floor(Math.random() * responses.length)],
        createdAt: new Date(),
      };

      setMuseMessages((prev) => [...prev, museResponse]);
      setIsMuseTyping(false);
    }, 1500);
  }, [userMessage]);

  const toggleTimer = useCallback(() => {
    setIsCreating(!isCreating);
  }, [isCreating]);

  const resetTimer = useCallback(() => {
    setCreationTimer(0);
    setIsCreating(false);
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Create a temporary local URL for preview
        const localUrl = URL.createObjectURL(file);
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          url: localUrl,
          file: file, // Store the actual file for later upload
        });
      }
    },
    []
  );

  const removeFile = useCallback(() => {
    setUploadedFile(null);
  }, []);

  return {
    // State
    currentScreen,
    setCurrentScreen,
    onboardingStep,
    setOnboardingStep,
    selectedDiscipline,
    setSelectedDiscipline,
    mood,
    setMood,
    creationFrequency,
    setCreationFrequency,
    user: user as User | undefined,
    setUser,
    dailyPrompt,
    setDailyPrompt,
    estimatedDuration,
    theme,
    setTheme,
    language,
    setLanguage,
    currentCreation,
    setCurrentCreation,
    currentReflection,
    setCurrentReflection,
    creationTimer,
    setCreationTimer,
    completionTime,
    setCompletionTime,
    isCreating,
    setIsCreating,
    uploadedFile,
    setUploadedFile,
    museMessages,
    userMessage,
    setUserMessage,
    isMuseTyping,
    showPreferences,
    setShowPreferences,
    achievements,
    weeklyData,
    monthlyMood,
    savedPrompts,
    journalEntries,

    // Actions
    handleDisciplineSelect,
    handleMoodSelect,
    handleFrequencySelect,
    handleThemeChange,
    handleLanguageChange,
    completeOnboarding,
    startCreation,
    completeCreation,
    savePrompt,
    removeSavedPrompt,
    startCreationWithSavedPrompt,
    generateNewPrompt,
    sendMuseMessage,
    toggleTimer,
    resetTimer,
    handleFileUpload,
    removeFile,

    // Computed values
    level,
    xp,
    streak,
    todayCompleted,
    calculateNextLevel,
    formatTime,
    progressPercentage,

    // Loading states
    isLoading: isLoading || userLoading,
    isGeneratingPrompt,
    isSavingPrompt,
    showSaveSuccess,
    error,

    // Mutations
    updateUserMutation,
  };
};
