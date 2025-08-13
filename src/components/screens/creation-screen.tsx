import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

interface CreationScreenProps {
  theme: string;
  t: (text: string) => string;
  setCurrentScreen: (screen: string) => void;
  creationTimer: number;
  formatTime: (seconds: number) => string;
  toggleTimer: () => void;
  resetTimer: () => void;
  isCreating: boolean;
  dailyPrompt: string;
  currentCreation: string;
  setCurrentCreation: (creation: string) => void;
  uploadedFile: File | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
  handleCompleteCreation: () => void;
  showCompletion: boolean;
  handleContinueJourney: () => void;
  completionTime: number;
  streak: number;
}

export const CreationScreen: React.FC<CreationScreenProps> = ({
  theme,
  t,
  setCurrentScreen,
  creationTimer,
  formatTime,
  toggleTimer,
  resetTimer,
  isCreating,
  dailyPrompt,
  currentCreation,
  setCurrentCreation,
  uploadedFile,
  handleFileUpload,
  removeFile,
  handleCompleteCreation,
  showCompletion,
  handleContinueJourney,
  completionTime,
  streak,
}) => {
  // Background gradients for Apple Liquid Glass design
  const BackgroundGradients = () => (
    <>
      <div className={`fixed inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-purple-900/20 via-black to-pink-900/20' : 'from-purple-100/20 via-white to-pink-100/20'} -z-10`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl ${theme === 'dark' ? 'from-blue-900/10 via-transparent to-purple-900/10' : 'from-blue-100/10 via-transparent to-purple-100/10'} -z-10`}></div>
    </>
  );

  return (
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
};
