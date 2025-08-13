import React from 'react';

import { ChevronRight, Flame, Heart, Sparkles, Zap } from 'lucide-react';

interface HomeScreenProps {
  theme: string;
  t: (text: string) => string;
  setCurrentScreen: (screen: string) => void;
  currentScreen: string;
  level: number;
  xp: number;
  calculateNextLevel: () => number;
  streak: number;
  todayCompleted: boolean;
  weeklyData: Array<{
    day: string;
    completed: boolean;
    duration: number;
  }>;
  dailyPrompt: string;
  estimatedDuration: number;
  startCreation: () => void;
  savePrompt: () => void;
  savedPrompts: Array<{ prompt: string }>;
  generateNewPrompt: () => void;
  isGeneratingPrompt: boolean;
  isSavingPrompt: boolean;
  showSaveSuccess: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  t,
  setCurrentScreen,
  currentScreen,
  level,
  xp,
  calculateNextLevel,
  streak,
  todayCompleted,
  weeklyData,
  dailyPrompt,
  estimatedDuration,
  startCreation,
  savePrompt,
  savedPrompts,
  generateNewPrompt,
  isGeneratingPrompt,
  isSavingPrompt,
  showSaveSuccess,
}) => {
  const progressPercentage =
    ((xp % calculateNextLevel()) / calculateNextLevel()) * 100;

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

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      } pb-20 relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}
    >
      <BackgroundGradients />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p
              className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              } text-sm`}
            >
              {t('Welcome back')}
            </p>
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
        <div
          className={`rounded-3xl p-6 glass-effect ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-black/5 border border-black/10'
          } mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } text-sm mb-1`}
              >
                {t('Streak')}
              </p>
              <p className="text-3xl font-light">
                {streak} {t('days')}
              </p>
              {todayCompleted && (
                <p className="text-sm text-green-500 mt-1">
                  ✓ {t('Today completed')}
                </p>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weeklyData.map((day, i) => (
                <div key={i} className="text-center">
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    } mb-1`}
                  >
                    {day.day[0]}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-lg ${
                      day.completed
                        ? 'bg-gradient-to-br from-orange-500 to-red-500'
                        : theme === 'dark'
                        ? 'bg-white/10'
                        : 'bg-black/10'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span
                className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('Level')} {level}
              </span>
              <span
                className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {xp} / {calculateNextLevel()} {t('XP')}
              </span>
            </div>
            <div
              className={`h-2 ${
                theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
              } rounded-full overflow-hidden`}
            >
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
                dailyPrompt === 'crafting the ideal daily prompt for you!' ||
                isGeneratingPrompt
                  ? 'animate-border-fast'
                  : 'animate-border-slow'
              }`}
              style={{
                background: `conic-gradient(from 0deg, 
                  transparent 0deg, 
                  transparent 350deg, 
                  rgba(168, 85, 247, 1) 355deg, 
                  rgba(236, 72, 153, 1) 360deg)`,
              }}
            />
          </div>

          {/* Main content box */}
          <div
            className={`rounded-3xl p-6 glass-effect bg-black/80 backdrop-blur-xl border ${
              theme === 'dark' ? 'border-white/10' : 'border-black/10'
            } relative z-10`}
          >
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-6 h-6" />
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {Math.ceil(estimatedDuration / 60)} {t('min')}
              </span>
            </div>
            <h2 className="text-xl font-medium mb-2">{t("Today's Prompt")}</h2>
            {dailyPrompt === 'crafting the ideal daily prompt for you!' ? (
              <div className="mb-6 leading-relaxed flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-pulse">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-ping"></div>
                </div>
                <span className="animate-pulse bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium">
                  crafting the ideal daily prompt for you!
                </span>
              </div>
            ) : (
              <p
                className="text-gray-200 mb-6 leading-relaxed cursor-pointer transition-all duration-300 hover:text-white font-medium animate-pulse-glow"
                style={{
                  lineHeight: '1.7',
                  letterSpacing: '0.01em',
                  animation: 'pulse-glow 4s ease-in-out infinite',
                }}
              >
                {dailyPrompt}
              </p>
            )}

            <button
              onClick={startCreation}
              disabled={
                isGeneratingPrompt ||
                dailyPrompt === 'crafting the ideal daily prompt for you!'
              }
              className={`w-full rounded-2xl py-4 ${
                theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
              } font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                isGeneratingPrompt ||
                dailyPrompt === 'crafting the ideal daily prompt for you!'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {t('Start Creating')}
            </button>

            <div className="flex gap-3 mt-3">
              <button
                onClick={savePrompt}
                disabled={
                  isSavingPrompt ||
                  dailyPrompt === 'crafting the ideal daily prompt for you!' ||
                  savedPrompts.some(saved => saved.prompt === dailyPrompt)
                }
                className={`flex-1 rounded-xl py-3 font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 relative ${
                  savedPrompts.some(saved => saved.prompt === dailyPrompt)
                    ? `${
                        theme === 'dark'
                          ? 'bg-green-900/30 text-green-400 border border-green-600/30'
                          : 'bg-green-100 text-green-700 border border-green-300'
                      } cursor-default`
                    : `${
                        theme === 'dark'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-black/10 text-black hover:bg-black/20'
                      } ${
                        isSavingPrompt ||
                        dailyPrompt ===
                          'crafting the ideal daily prompt for you!'
                          ? 'opacity-75 cursor-not-allowed'
                          : ''
                      }`
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
                    {t('Save')}
                  </>
                )}
                {/* Success message */}
                {showSaveSuccess && (
                  <div
                    className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${
                      theme === 'dark'
                        ? 'bg-green-900/90 text-green-100'
                        : 'bg-green-100 text-green-900'
                    } px-3 py-1 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border ${
                      theme === 'dark' ? 'border-green-700' : 'border-green-300'
                    } animate-pulse shadow-lg`}
                  >
                    prompt saved under your profile
                  </div>
                )}
              </button>
              <button
                onClick={generateNewPrompt}
                disabled={isGeneratingPrompt}
                className={`flex-1 rounded-xl py-3 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-black/10 text-black hover:bg-black/20'
                } font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                  isGeneratingPrompt ? 'opacity-75 cursor-not-allowed' : ''
                }`}
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
                    {t('New Prompt')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Muse Preview */}
        <button
          onClick={() => setCurrentScreen('muse')}
          className={`w-full rounded-2xl p-4 glass-effect ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10 hover:bg-white/10'
              : 'bg-black/5 border border-black/10 hover:bg-black/10'
          } transition-all duration-300 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium">{t('Your Muse')}</p>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('Ready to chat about creativity')}
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
