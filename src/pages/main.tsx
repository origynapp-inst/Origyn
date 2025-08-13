import React, { useEffect, useRef, useState } from 'react';

import { Brush, Camera, Music, Palette, PenTool, X, Zap } from 'lucide-react';

import {
  CreationScreen,
  HomeScreen,
  JournalScreen,
  OnboardingScreen,
} from '../components/screens';
import { useOrigyn } from '../hooks/useOrigyn';
import { getTranslatedText } from '../lib/translations';
import { MuseScreen, ProfileScreen, ProgressSccreen } from './';

export const Main = () => {
  const {
    // State
    currentScreen,
    setCurrentScreen,
    // onboardingStep,
    // setOnboardingStep,
    selectedDiscipline,
    setSelectedDiscipline,
    mood,
    // setMood,
    // creationFrequency,
    // setCreationFrequency,
    user,
    setUser,
    dailyPrompt,
    // setDailyPrompt,
    estimatedDuration,
    theme,
    setTheme,
    language,
    setLanguage,
    currentCreation,
    setCurrentCreation,
    creationTimer,
    setCreationTimer,
    completionTime,
    isCreating,
    // setIsCreating,
    uploadedFile,
    setUploadedFile,
    museMessages,
    userMessage,
    setUserMessage,
    isMuseTyping,
    // showPreferences,
    // setShowPreferences,
    achievements,
    weeklyData,
    // monthlyMood,
    savedPrompts,
    journalEntries,

    // Actions
    handleDisciplineSelect,
    handleMoodSelect,
    handleFrequencySelect,
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
    // progressPercentage,

    // Loading states
    isLoading,
    isGeneratingPrompt,
    isSavingPrompt,
    showSaveSuccess,
    error,

    // Mutations
    // updateUserMutation,
  } = useOrigyn();

  const messageEndRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Custom onboarding state
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleContinueJourney = () => {
    setShowCompletion(false);
    setCurrentCreation('');
    setUploadedFile(null);
    setCurrentScreen('home');
    generateNewPrompt();
  };

  // Custom completion handler that shows overlay instead of screen
  const handleCompleteCreation = async () => {
    // Show overlay immediately
    setShowCompletion(true);

    // Call the original completion logic but intercept the screen change
    await completeCreation();
  };

  // Intercept completion screen and show overlay instead
  useEffect(() => {
    if (currentScreen === 'completion') {
      setCurrentScreen('creation'); // Stay on creation screen
    }
  }, [currentScreen, setCurrentScreen]);

  const baseDisciplines = [
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'visual art',
      name: 'Visual Art',
      icon: Brush,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: Camera,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'movement',
      name: 'Movement',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  // Check if current selection is a custom discipline (not in base list)
  const isCustomDiscipline =
    selectedDiscipline &&
    !baseDisciplines.some(d => d.id === selectedDiscipline);

  // Create disciplines array with custom discipline if selected
  // const disciplines = isCustomDiscipline ? [
  //   ...baseDisciplines,
  //   { id: selectedDiscipline, name: selectedDiscipline, icon: Sparkles, color: 'from-purple-500 to-pink-500' }
  // ] : baseDisciplines;

  const moods = [
    {
      id: 'energized',
      emoji: '⚡',
      label: 'Energized',
      description: 'High energy, dynamic',
    },
    {
      id: 'calm',
      emoji: '🌊',
      label: 'Calm',
      description: 'Peaceful, meditative',
    },
  ];

  // const frequencies = [
  //   { id: 'daily', label: 'Every day', desc: 'Build a strong habit' },
  //   { id: 'weekdays', label: 'Weekdays only', desc: 'Mon-Fri routine' },
  //   { id: 'custom', label: 'Custom schedule', desc: 'Choose your days' }
  // ];

  // const languages = [
  //   { id: 'en', name: 'English', flag: '🇺🇸' },
  //   { id: 'es', name: 'Español', flag: '🇪🇸' },
  //   { id: 'fr', name: 'Français', flag: '🇫🇷' },
  //   { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  //   { id: 'zh', name: '中文', flag: '🇨🇳' },
  //   { id: 'ja', name: '日本語', flag: '🇯🇵' },
  //   { id: 'pt', name: 'Português', flag: '🇵🇹' }
  // ];

  // Use the comprehensive translation system
  const t = (englishText: string): string => {
    const currentLang = user?.language || language;
    const translated = getTranslatedText(englishText, currentLang);
    return translated;
  };

  // Timer effect
  useEffect(() => {
    if (isCreating && creationTimer < 900) {
      // 15 min max
      timerInterval.current = setInterval(() => {
        setCreationTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isCreating, creationTimer, setCreationTimer]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [museMessages]);

  // Ensure user starts with fresh onboarding
  useEffect(() => {
    if (!user && currentScreen !== 'onboarding') {
      setCurrentScreen('onboarding');
    }
  }, [user, currentScreen, setCurrentScreen]);

  // const selectedDisciplineData = disciplines.find(d => d.id === selectedDiscipline);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        } flex items-center justify-center`}
      >
        <div
          className={`${
            theme === 'dark' ? 'text-white' : 'text-black'
          } text-center`}
        >
          <div
            className={`w-3 h-3 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-ping"></div>
          </div>
          <p
            className={`text-lg font-light tracking-wide ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            } animate-pulse`}
          >
            thinking...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-8 h-8" />
          </div>
          <p className="text-lg text-red-400">Something went wrong</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Background gradients for Apple Liquid Glass design
  const BackgroundGradients = () => (
    <>
      <div
        className={`fixed inset-0 bg-gradient-to-br ${
          theme === 'dark'
            ? 'from-purple-900/20 via-black to-pink-900/20'
            : 'from-purple-100/20 via-white to-pink-100/20'
        } -z-10`}
      ></div>
      <div
        className={`fixed inset-0 bg-gradient-to-tl ${
          theme === 'dark'
            ? 'from-blue-900/10 via-transparent to-purple-900/10'
            : 'from-blue-100/10 via-transparent to-purple-100/10'
        } -z-10`}
      ></div>
    </>
  );

  // Enhanced Onboarding Flow
  const renderOnboarding = () => {
    return (
      <OnboardingScreen
        baseDisciplines={baseDisciplines}
        moods={moods}
        selectedDiscipline={selectedDiscipline}
        mood={mood}
        handleDisciplineSelect={handleDisciplineSelect}
        handleMoodSelect={handleMoodSelect}
        handleFrequencySelect={handleFrequencySelect}
        completeOnboarding={completeOnboarding}
        theme={theme}
      />
    );
  };

  // Home Screen
  const renderHome = () => {
    return (
      <HomeScreen
        theme={theme}
        t={t}
        setCurrentScreen={setCurrentScreen}
        currentScreen={currentScreen}
        level={level}
        xp={xp}
        calculateNextLevel={calculateNextLevel}
        streak={streak}
        todayCompleted={todayCompleted}
        weeklyData={weeklyData}
        dailyPrompt={dailyPrompt}
        estimatedDuration={estimatedDuration}
        startCreation={startCreation}
        savePrompt={savePrompt}
        savedPrompts={savedPrompts}
        generateNewPrompt={generateNewPrompt}
        isGeneratingPrompt={isGeneratingPrompt}
        isSavingPrompt={isSavingPrompt}
        showSaveSuccess={showSaveSuccess}
      />
    );
  };

  // Creation Screen
  const renderCreation = () => (
    <CreationScreen
      theme={theme}
      t={t}
      setCurrentScreen={setCurrentScreen}
      creationTimer={creationTimer}
      formatTime={formatTime}
      toggleTimer={toggleTimer}
      resetTimer={resetTimer}
      isCreating={isCreating}
      dailyPrompt={dailyPrompt}
      currentCreation={currentCreation}
      setCurrentCreation={setCurrentCreation}
      uploadedFile={uploadedFile}
      handleFileUpload={handleFileUpload}
      removeFile={removeFile}
      handleCompleteCreation={handleCompleteCreation}
      showCompletion={showCompletion}
      handleContinueJourney={handleContinueJourney}
      completionTime={completionTime}
      streak={streak}
    />
  );

  // Progress Screen
  const renderProgress = () => (
    <ProgressSccreen
      theme={theme}
      t={t}
      setCurrentScreen={setCurrentScreen}
      currentScreen={currentScreen}
      streak={streak}
      level={level}
      weeklyData={weeklyData}
      achievements={achievements}
    />
  );

  // Muse Screen
  const renderMuse = () => (
    <MuseScreen
      theme={theme}
      t={t}
      setCurrentScreen={setCurrentScreen}
      currentScreen={currentScreen}
      museMessages={museMessages}
      isMuseTyping={isMuseTyping}
      userMessage={userMessage}
      setUserMessage={setUserMessage}
      sendMuseMessage={sendMuseMessage}
    />
  );

  // Profile Screen
  const renderProfile = () => {
    return (
      <ProfileScreen
        onBack={() => setCurrentScreen('home')}
        user={user}
        achievements={achievements}
        savedPrompts={savedPrompts}
        theme={theme}
        onThemeChange={newTheme => {
          setTheme(newTheme);
          // Update local user state
          if (user) {
            setUser({ ...user, theme: newTheme });
          }
        }}
        onDisciplineChange={newDiscipline => {
          // Update discipline and generate new prompt automatically
          handleDisciplineSelect(newDiscipline);

          // Update local user state
          if (user) {
            setUser({ ...user, selectedDiscipline: newDiscipline });
          }
        }}
        onMoodChange={newMood => {
          // Update mood and generate new prompt automatically
          handleMoodSelect(newMood);

          // Update local user state
          if (user) {
            setUser({ ...user, mood: newMood });
          }
        }}
        onLanguageChange={newLanguage => {
          // Update user language preference
          if (user) {
            const updatedUser = { ...user, language: newLanguage };
            setUser(updatedUser);
            setLanguage(newLanguage);

            // Store in localStorage before reload
            localStorage.setItem('origyn_language', newLanguage);
            localStorage.setItem('origyn_user', JSON.stringify(updatedUser));

            console.log(`Language changed to: ${newLanguage}`);
            // Force immediate re-render
            window.location.reload();
          }
        }}
        onRemoveSavedPrompt={removeSavedPrompt}
        onStartCreationWithPrompt={startCreationWithSavedPrompt}
      />
    );
  };

  // Journal Screen
  const renderJournal = () => {
    return (
      <JournalScreen
        theme={theme}
        t={t}
        setCurrentScreen={setCurrentScreen}
        currentScreen={currentScreen}
        journalEntries={journalEntries}
      />
    );
  };

  // Main render logic with global overscroll prevention
  const renderCurrentScreen = () => {
    if (currentScreen === 'onboarding') {
      return renderOnboarding();
    } else if (currentScreen === 'creation') {
      return renderCreation();
    } else if (currentScreen === 'progress') {
      return renderProgress();
    } else if (currentScreen === 'muse') {
      return renderMuse();
    } else if (currentScreen === 'profile') {
      return renderProfile();
    } else if (currentScreen === 'journal') {
      return renderJournal();
    } else {
      return renderHome();
    }
  };

  return (
    <div
      className="main-container prevent-overscroll"
      style={{
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        overscrollBehaviorX: 'none',
      }}
    >
      {renderCurrentScreen()}
    </div>
  );
};
