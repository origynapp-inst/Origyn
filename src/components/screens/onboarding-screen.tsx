import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  X,
} from 'lucide-react';

interface OnboardingScreenProps {
  baseDisciplines: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
  }>;
  moods: Array<{
    id: string;
    emoji: string;
    label: string;
    description: string;
  }>;
  selectedDiscipline: string;
  mood: string;
  handleDisciplineSelect: (discipline: string) => void;
  handleMoodSelect: (mood: string) => void;
  handleFrequencySelect: (frequency: string) => void;
  completeOnboarding: () => void;
  theme: string;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  baseDisciplines,
  moods,
  selectedDiscipline,
  mood,
  handleDisciplineSelect,
  handleMoodSelect,
  handleFrequencySelect,
  completeOnboarding,
  theme,
}) => {
  // Custom onboarding state
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Check if current selection is a custom discipline (not in base list)
  const isCustomDiscipline = selectedDiscipline && !baseDisciplines.some(d => d.id === selectedDiscipline);

  // Background gradients for Apple Liquid Glass design
  const BackgroundGradients = () => (
    <>
      <div className={`fixed inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-purple-900/20 via-black to-pink-900/20' : 'from-purple-100/20 via-white to-pink-100/20'} -z-10`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl ${theme === 'dark' ? 'from-blue-900/10 via-transparent to-purple-900/10' : 'from-blue-100/10 via-transparent to-purple-100/10'} -z-10`}></div>
    </>
  );

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
              <div className="px-6 py-3 rounded-xl glass-effect bg-white-500 border border-white/10 ring-2 ring-purple-500 bg-purple-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium text-white text-sm capitalize">{selectedDiscipline}</span>
                  <button
                    onClick={() => {
                      handleDisciplineSelect('');
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
                  handleDisciplineSelect('');
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
