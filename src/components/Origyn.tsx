import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  BookOpen,
  Brush,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Flame,
  Heart,
  Home,
  Lock,
  Music,
  Palette,
  Pause,
  PenTool,
  Play,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  X,
  Zap,
} from 'lucide-react';

import { useOrigyn } from '../hooks/useOrigyn';
import { getTranslatedText } from '../lib/translations';
import Profile from '../pages/Profile';

const Origyn = () => {
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
    { id: 'music', name: 'Music', icon: Music, color: 'from-purple-500 to-pink-500' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'from-blue-500 to-cyan-500' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-orange-500 to-red-500' },
    { id: 'visual art', name: 'Visual Art', icon: Brush, color: 'from-pink-500 to-rose-500' },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'from-indigo-500 to-blue-500' },
    { id: 'movement', name: 'Movement', icon: Zap, color: 'from-green-500 to-emerald-500' }
  ];
  
  // Check if current selection is a custom discipline (not in base list)
  const isCustomDiscipline = selectedDiscipline && !baseDisciplines.some(d => d.id === selectedDiscipline);
  
  // Create disciplines array with custom discipline if selected
  // const disciplines = isCustomDiscipline ? [
  //   ...baseDisciplines,
  //   { id: selectedDiscipline, name: selectedDiscipline, icon: Sparkles, color: 'from-purple-500 to-pink-500' }
  // ] : baseDisciplines;

  const moods = [
    { id: 'energized', emoji: '⚡', label: 'Energized', description: 'High energy, dynamic' },
    { id: 'calm', emoji: '🌊', label: 'Calm', description: 'Peaceful, meditative' }
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
    console.log(`Direct UI Translation: "${englishText}" → "${translated}" (${currentLang})`);
    return translated;
  };

  // Timer effect
  useEffect(() => {
    if (isCreating && creationTimer < 900) { // 15 min max
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
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-center`}>
          <div className={`w-3 h-3 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse`}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-ping"></div>
          </div>
          <p className={`text-lg font-light tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} animate-pulse`}>
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
      <div className={`fixed inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-purple-900/20 via-black to-pink-900/20' : 'from-purple-100/20 via-white to-pink-100/20'} -z-10`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl ${theme === 'dark' ? 'from-blue-900/10 via-transparent to-purple-900/10' : 'from-blue-100/10 via-transparent to-purple-100/10'} -z-10`}></div>
    </>
  );

  // Enhanced Onboarding Flow
  const renderOnboarding = () => {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center p-6 relative overflow-hidden main-container prevent-overscroll">
        <BackgroundGradients />
        
        {/* Single-step onboarding */}
        <div className="animate-slide-up relative z-10 max-w-md mx-auto w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass-effect bg-white/5 border border-white/10 flex items-center justify-center animate-float">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl font-light mb-4">
              <span className="text-white">Welcome to </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Origyn</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto mb-8">
              Your creative companion for daily artistic habits
            </p>
          </div>
          
          {/* Quick discipline selection */}
          <div className="mb-8">
            <p className="text-gray-300 text-center text-sm mb-4">What do you create?</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {baseDisciplines.map((discipline) => {
                const Icon = discipline.icon;
                return (
                  <button
                    key={discipline.id}
                    onClick={() => {
                      handleDisciplineSelect(discipline.id);
                      setShowCustomInput(false);
                      setCustomDiscipline('');
                    }}
                    className={`p-3 rounded-xl glass-effect bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 active:scale-95 ${
                      selectedDiscipline === discipline.id && !showCustomInput ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${discipline.color} flex items-center justify-center mb-2 mx-auto`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-medium text-white text-xs text-center">
                      {discipline.name}
                    </h3>
                  </button>
                );
              })}
            </div>
            
            {/* Custom discipline - show selected custom discipline OR "Other" button */}
            {isCustomDiscipline ? (
              <div className="flex justify-center mb-6">
                <div className="px-6 py-3 rounded-xl glass-effect bg-white/5 border border-white/10 ring-2 ring-purple-500 bg-purple-500/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-white text-sm capitalize">{selectedDiscipline}</span>
                    <button
                      onClick={() => {
                        setSelectedDiscipline('');
                        setShowCustomInput(true);
                      }}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => {
                    // Clear any previous selection when opening custom input
                    setSelectedDiscipline('');
                    setShowCustomInput(true);
                  }}
                  className={`px-6 py-3 rounded-xl glass-effect bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 active:scale-95 ${
                    showCustomInput ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-white text-sm">Other</span>
                  </div>
                </button>
              </div>
            )}
            
            {/* Custom discipline input */}
            {showCustomInput && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customDiscipline}
                  onChange={(e) => setCustomDiscipline(e.target.value)}
                  placeholder="Enter your creative field..."
                  className="w-full p-3 rounded-xl glass-effect bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => {
                    if (customDiscipline.trim()) {
                      handleDisciplineSelect(customDiscipline.trim().toLowerCase());
                      setShowCustomInput(false);
                    }
                  }}
                  disabled={!customDiscipline.trim()}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Add "{customDiscipline}"
                </button>
              </div>
            )}
          </div>

          {/* Compact mood selection */}
          <div className="mb-8">
            <p className="text-gray-300 text-center text-sm mb-4">How are you feeling?</p>
            <div className="flex gap-3 justify-center">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.id}
                  onClick={() => handleMoodSelect(moodOption.id)}
                  className={`px-6 py-3 rounded-xl glass-effect bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 active:scale-95 text-center ${
                    mood === moodOption.id ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
                  }`}
                >
                  <span className="text-lg mr-2">{moodOption.emoji}</span>
                  <span className="font-medium text-white text-sm">{moodOption.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Start button */}
          <button 
            onClick={() => {
              // Set default frequency and complete onboarding
              handleFrequencySelect('daily');
              setTimeout(() => completeOnboarding(), 100);
            }}
            disabled={!selectedDiscipline || !mood}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Start Creating
          </button>
          
          <p className="text-gray-500 text-xs text-center mt-4">
            You can change these settings later in your profile
          </p>
        </div>
      </div>
    );
  };

  // Home Screen
  const renderHome = () => {
    // Use user's actual discipline, not local state
    // const currentDiscipline = user?.selectedDiscipline || selectedDiscipline;
    // const selectedDisciplineData = disciplines.find(d => d.id === currentDiscipline);
    const progressPercentage = (xp % calculateNextLevel()) / calculateNextLevel() * 100;
    
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} pb-20 relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}>
        <BackgroundGradients />
        <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{t("Welcome back")}</p>
            <h1 className="text-2xl font-light">{t("Today's Creation")}</h1>
          </div>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-lg font-medium text-white">{level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        {/* Streak & XP Card */}
        <div className={`rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>{t("Streak")}</p>
              <p className="text-xl font-light">{streak} {t("days")}</p>
              {todayCompleted && (
                <p className="text-sm text-green-500 mt-1">✓ {t("Today completed")}</p>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weeklyData.map((day, i) => (
                <div key={i} className="text-center">
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{day.day[0]}</p>
                  <div
                    className={`w-7 h-7 rounded-lg ${
                      day.completed ? 'bg-gradient-to-br from-orange-500 to-red-500' : theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t("Level")} {level}</span>
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{xp} / {calculateNextLevel()} {t("XP")}</span>
            </div>
            <div className={`h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today's Prompt */}
        <div className="relative mb-6">
          {/* External animated border */}
          <div className="absolute -inset-0.5 rounded-3xl overflow-hidden">
            <div 
              className={`absolute inset-0 rounded-3xl ${
                dailyPrompt === 'crafting the ideal daily prompt for you!' || isGeneratingPrompt
                  ? 'animate-border-fast' 
                  : 'animate-border-slow'
              }`}
              style={{
                background: `conic-gradient(from 0deg, 
                  transparent 0deg, 
                  transparent 350deg, 
                  rgba(168, 85, 247, 1) 355deg, 
                  rgba(236, 72, 153, 1) 360deg)`
              }}
            />
          </div>
          
          {/* Main content box */}
          <div className={`rounded-3xl p-6 glass-effect bg-black/80 backdrop-blur-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} relative z-10`}>
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-6 h-6" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.ceil(estimatedDuration / 60)} {t("min")}
              </span>
            </div>
            <h2 className="text-xl font-medium mb-2">{t("Today's Prompt")}</h2>
            {dailyPrompt === 'crafting the ideal daily prompt for you!' ? (
              <div className="mb-6 leading-relaxed flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-pulse">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-ping"></div>
                </div>
                <span className="animate-pulse bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium">crafting the ideal daily prompt for you!</span>
              </div>
            ) : (
              <p className="text-gray-200 mb-6 leading-relaxed cursor-pointer transition-all duration-300 hover:text-white font-medium animate-pulse-glow"
                 style={{ 
                   lineHeight: '1.7',
                   letterSpacing: '0.01em',
                   animation: 'pulse-glow 4s ease-in-out infinite'
                 }}
              >
                {dailyPrompt}
              </p>
            )}
            
            <button 
              onClick={startCreation}
              disabled={isGeneratingPrompt || dailyPrompt === 'crafting the ideal daily prompt for you!'}
              className={`w-full rounded-2xl py-4 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${isGeneratingPrompt || dailyPrompt === 'crafting the ideal daily prompt for you!' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t("Start Creating")}
            </button>
            
            <div className="flex gap-3 mt-3">
              <button 
                onClick={savePrompt}
                disabled={isSavingPrompt || dailyPrompt === 'crafting the ideal daily prompt for you!' || savedPrompts.some(saved => saved.prompt === dailyPrompt)}
                className={`flex-1 rounded-xl py-3 font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 relative ${
                  savedPrompts.some(saved => saved.prompt === dailyPrompt)
                    ? `${theme === 'dark' ? 'bg-green-900/30 text-green-400 border border-green-600/30' : 'bg-green-100 text-green-700 border border-green-300'} cursor-default`
                    : `${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'} ${isSavingPrompt || dailyPrompt === 'crafting the ideal daily prompt for you!' ? 'opacity-75 cursor-not-allowed' : ''}`
                }`}
            >
              {isSavingPrompt ? (
                <>
                  <div className="w-3 h-3 text-red-500 animate-pulse">
                    <Heart className="w-full h-full animate-ping" />
                  </div>
                  <span className="animate-pulse">saving...</span>
                </>
              ) : savedPrompts.some(saved => saved.prompt === dailyPrompt) ? (
                <>
                  <Heart className="w-4 h-4 fill-current" />
                  Saved
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  {t("Save")}
                </>
              )}
              {/* Success message */}
              {showSaveSuccess && (
                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${theme === 'dark' ? 'bg-green-900/90 text-green-100' : 'bg-green-100 text-green-900'} px-3 py-1 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border ${theme === 'dark' ? 'border-green-700' : 'border-green-300'} animate-pulse shadow-lg`}>
                  prompt saved under your profile
                </div>
              )}
            </button>
            <button 
              onClick={generateNewPrompt}
              disabled={isGeneratingPrompt}
              className={`flex-1 rounded-xl py-3 ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'} font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${isGeneratingPrompt ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isGeneratingPrompt ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-ping"></div>
                  </div>
                  <span className="animate-pulse">thinking...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {t("New Prompt")}
                </>
              )}
            </button>
          </div>
          </div>
        </div>

        {/* AI Muse Preview */}
        <button 
          onClick={() => setCurrentScreen('muse')}
          className={`w-full rounded-2xl p-4 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-black/5 border border-black/10 hover:bg-black/10'} transition-all duration-300 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t("Your Muse")}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t("Ready to chat about creativity")}</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className={`nav-bar-fixed ${theme === 'dark' ? 'backdrop-blur-glass' : 'backdrop-blur-glass light'} px-6`}>
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">{t("Home")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('journal')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'journal' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">{t("Journal")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('progress')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'progress' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">{t("Progress")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('muse')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'muse' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">{t("Muse")}</span>
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Creation Screen
  const renderCreation = () => (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} pb-20 relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}>
      <BackgroundGradients />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} flex items-center justify-center transition-all duration-300`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-medium">Create</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Timer */}
        <div className={`rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6 text-center`}>
          <div className="text-4xl font-light mb-4">{formatTime(creationTimer)}</div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={toggleTimer}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white transition-all duration-300 active:scale-95"
            >
              {isCreating ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button 
              onClick={resetTimer}
              className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} flex items-center justify-center transition-all duration-300 active:scale-95`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Prompt Display */}
        <div className="relative mb-6">
          {/* External animated border */}
          <div className="absolute -inset-0.5 rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 rounded-3xl animate-border-slow"
              style={{
                background: `conic-gradient(from 0deg, 
                  transparent 0deg, 
                  transparent 350deg, 
                  rgba(168, 85, 247, 1) 355deg, 
                  rgba(236, 72, 153, 1) 360deg)`
              }}
            />
          </div>
          
          {/* Main prompt container */}
          <div className={`relative rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-black/80 border border-white/10' : 'bg-white/80 border border-black/10'} backdrop-blur-sm`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium">Today's Prompt</h3>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-glow-pulse`}>{dailyPrompt}</p>
          </div>
        </div>

        {/* Creation Notes */}
        <div className={`rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6`}>
          <textarea
            value={currentCreation}
            onChange={(e) => setCurrentCreation(e.target.value)}
            placeholder="Describe what you're creating..."
            className={`w-full h-32 bg-transparent resize-none outline-none placeholder:${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          />
          
          {/* File Upload */}
          <div className="mt-4 border-t border-gray-500/20 pt-4">
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} cursor-pointer transition-colors duration-300`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload your creation (optional)</span>
            </label>
            
            {uploadedFile && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-purple-400 flex-1">{uploadedFile.name}</span>
                <button
                  onClick={removeFile}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complete Button */}
        <button 
          onClick={handleCompleteCreation}
          disabled={!currentCreation.trim() || creationTimer < 10}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("Complete Creation")}
          {creationTimer < 10 && (
            <span className="block text-sm opacity-70 mt-1">
              {t("Create for at least 10 seconds to earn XP")}
            </span>
          )}
        </button>
      </div>
      
      {/* Completion Overlay Modal */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glass overlay with blur effect */}
          <div className={`absolute inset-0 backdrop-blur-3xl ${theme === 'dark' ? 'bg-black/60' : 'bg-white/60'}`}></div>
          
          <div className={`relative z-10 max-w-md mx-auto w-full text-center ${theme === 'dark' ? 'text-white' : 'text-black'} p-6`}>
            {/* Success Animation */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center relative animate-pulse">
              <CheckCircle className="w-10 h-10 text-purple-400 relative z-10" />
            </div>
            
            <h1 className="text-3xl font-light mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("Creation Complete!")}
            </h1>
            
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
              {t("Well done! Your creative session is now part of your journey.")}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-xl glass-effect ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border backdrop-blur-sm`}>
                <div className="text-2xl font-bold text-purple-400">+{(() => {
                  const baseXP = 50;
                  const timeBonus = Math.min(Math.floor(completionTime / 10) * 10, 100);
                  return baseXP + timeBonus;
                })()}XP</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Experience Gained</div>
              </div>
              <div className={`p-4 rounded-xl glass-effect ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border backdrop-blur-sm`}>
                <div className="text-2xl font-bold text-pink-400">{streak}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
              </div>
            </div>
            
            {/* Time Spent */}
            <div className={`p-4 rounded-xl glass-effect ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border backdrop-blur-sm mb-8`}>
              <div className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{formatTime(completionTime)}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time Creating</div>
            </div>
            
            {/* Continue Button */}
            <button
              onClick={handleContinueJourney}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95"
            >
              {t("Continue Journey")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Progress Screen
  const renderProgress = () => (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}>
      <BackgroundGradients />
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-xl font-semibold">Your Progress</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-2xl p-4 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-400">Current Streak</span>
            </div>
            <div className="text-2xl font-light">{streak} days</div>
          </div>
          
          <div className={`rounded-2xl p-4 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-400">Current Level</span>
            </div>
            <div className="text-2xl font-light">Level {level}</div>
          </div>
        </div>

        {/* This Week Chart */}
        <div className={`rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6`}>
          <h3 className="font-medium mb-4">This Week</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-lg transition-all duration-500 ${
                    day.completed 
                      ? 'bg-gradient-to-t from-purple-500 to-pink-500' 
                      : theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                  }`}
                  style={{ 
                    height: day.duration > 0 
                      ? `${Math.max(20, (day.duration / 900) * 100)}%` 
                      : day.completed ? '20%' : '8px'
                  }}
                />
                <span className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-3xl p-6 glass-effect ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
          <h3 className="font-medium mb-4">{t("Achievements")}</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20' 
                    : theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-black/5 border border-black/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                }`}>
                  {achievement.unlocked ? (
                    <Star className="w-5 h-5 text-white" />
                  ) : (
                    <Lock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  {/*<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>*/}
                </div>
                {achievement.unlocked && (
                  <div className="text-xs text-green-500 font-medium">
                    {t("Unlocked!")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`nav-bar-fixed ${theme === 'dark' ? 'backdrop-blur-glass' : 'backdrop-blur-glass light'} px-6`}>
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('journal')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'journal' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">{t("Journal")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('progress')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'progress' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">{t("Progress")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('muse')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'muse' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">{t("Muse")}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Muse Screen
  const renderMuse = () => (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}>
      <BackgroundGradients />
      
      {/* Header */}
      <div className="text-center p-6 pt-12">
        <h1 className="text-xl font-semibold">Your Muse</h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Creative companion</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto pb-32 smooth-scroll">
        <div className="space-y-4">
          {museMessages.map((message, index) => (
            <div 
              key={index}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'muse' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
              }`}>
                <p className="leading-relaxed">{message.message}</p>
              </div>
            </div>
          ))}
          
          {isMuseTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-20 left-0 right-0 p-6 bg-black/80 backdrop-blur-xl z-40">
        <div className="flex gap-3">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMuseMessage()}
            placeholder={t("Share your thoughts...")}
            className={`flex-1 px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 placeholder:text-gray-500' : 'bg-black/10 placeholder:text-gray-400'} outline-none border-0`}
          />
          <button
            onClick={sendMuseMessage}
            disabled={!userMessage.trim() || isMuseTyping}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`nav-bar-fixed ${theme === 'dark' ? 'backdrop-blur-glass' : 'backdrop-blur-glass light'} px-6`}>
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('journal')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'journal' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">{t("Journal")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('progress')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'progress' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">{t("Progress")}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('muse')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'muse' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">{t("Muse")}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Screen
  const renderProfile = () => {
    return (
      <Profile 
        onBack={() => setCurrentScreen('home')}
        user={user}
        achievements={achievements}
        savedPrompts={savedPrompts}
        theme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          // Update local user state
          if (user) {
            setUser({ ...user, theme: newTheme });
          }
        }}
        onDisciplineChange={(newDiscipline) => {
          // Update discipline and generate new prompt automatically
          handleDisciplineSelect(newDiscipline);
          
          // Update local user state
          if (user) {
            setUser({ ...user, selectedDiscipline: newDiscipline });
          }
        }}
        onMoodChange={(newMood) => {
          // Update mood and generate new prompt automatically
          handleMoodSelect(newMood);
          
          // Update local user state
          if (user) {
            setUser({ ...user, mood: newMood });
          }
        }}
        onLanguageChange={(newLanguage) => {
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
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} prevent-scroll screen-transition main-container prevent-overscroll`}>
        <BackgroundGradients />
        
        {/* Header */}
        <div className="text-center p-6 pt-12 relative z-10">
          <h1 className="text-xl font-semibold">Creative Journal</h1>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {journalEntries.length} entries
          </span>
        </div>

        {/* Journal Entries */}
        <div className="px-6 space-y-4 pb-24 relative z-10 smooth-scroll">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📖</div>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t("No journal entries yet")}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {t("Complete your first creation to start your journal!")}
              </p>
            </div>
          ) : (
            journalEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div 
                  key={entry.id}
                  className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                >
                  {/* Entry Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{new Date(entry.date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="mb-4">
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {entry.prompt}
                    </p>
                  </div>

                  {/* Creation Content */}
                  {entry.creation && (
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} mb-4`}>
                      <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} leading-relaxed`}>
                        {entry.creation}
                      </p>
                    </div>
                  )}

                  {/* Reflection */}
                  {entry.reflection && (
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} italic`}>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                        "{entry.reflection}"
                      </p>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Navigation Bar */}
        <div className={`nav-bar-fixed ${theme === 'dark' ? 'backdrop-blur-glass' : 'backdrop-blur-glass light'} px-6`}>
          <div className="flex justify-around">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('journal')}
              className={`flex flex-col items-center gap-1 ${currentScreen === 'journal' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">{t("Journal")}</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('progress')}
              className={`flex flex-col items-center gap-1 ${currentScreen === 'progress' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">{t("Progress")}</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('muse')}
              className={`flex flex-col items-center gap-1 ${currentScreen === 'muse' ? 'text-purple-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs">{t("Muse")}</span>
            </button>
          </div>
        </div>
      </div>
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
    <div className="main-container prevent-overscroll" style={{ overscrollBehavior: 'none', overscrollBehaviorY: 'none', overscrollBehaviorX: 'none' }}>
      {renderCurrentScreen()}
    </div>
  );
};

export default Origyn;