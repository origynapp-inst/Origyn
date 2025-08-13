import React, { type FC } from 'react';

import {
  BookOpen,
  Flame,
  Home,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';

interface Achievement {
  id: string;
  name: string;
  unlocked: boolean;
}

interface ProgressScreenProps {
  theme: string;
  t: (text: string) => string;
  setCurrentScreen: (screen: string) => void;
  currentScreen: string;
  streak: number;
  level: number;
  weeklyData: Array<{
    day: string;
    completed: boolean;
    duration: number;
  }>;
  achievements: Achievement[];
}

export const ProgressSccreen: FC = () => {
  const {theme} = useTheme();

  const streak = 5; // Example streak value
  const level = 3; // Example level value

  const weeklyData = [
    { day: 'Mon', completed: true, duration: 1200 },
    { day: 'Tue', completed: false, duration: 0 },
    { day: 'Wed', completed: true, duration: 900 },
    { day: 'Thu', completed: true, duration: 1500 },
    { day: 'Fri', completed: false, duration: 0 },
    { day: 'Sat', completed: true, duration: 1800 },
    { day: 'Sun', completed: true, duration: 600 },

  ]; // Example weekly data
  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', unlocked: true },
    { id: '2', name: 'Weekly Warrior', unlocked: false },
    { id: '3', name: 'Streak Master', unlocked: true },
  ]; // Example achievements

  const {t, setCurrentScreen, currentScreen} = {
    t: (text: string) => text, // Placeholder translation function
    setCurrentScreen: (screen: string) => console.log(`Switching to ${screen}`), // Placeholder function
    currentScreen: 'progress', // Placeholder current screen
  };
  
  // Background gradients for Apple Liquid Glass design
  const BackgroundGradients = () => (
    <>
      <div className={`fixed inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-purple-900/20 via-black to-pink-900/20' : 'from-purple-100/20 via-white to-pink-100/20'} -z-10`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl ${theme === 'dark' ? 'from-blue-900/10 via-transparent to-purple-900/10' : 'from-blue-100/10 via-transparent to-purple-100/10'} -z-10`}></div>
    </>
  );

  return (
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
};
