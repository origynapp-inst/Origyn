import { useState } from 'react';

import {
  ArrowLeft,
  Award,
  Bell,
  Brain,
  ChevronRight,
  Flame,
  Globe,
  Heart,
  Lock,
  Moon,
  Palette,
  Play,
  RefreshCw,
  Settings,
  Star,
  X,
} from 'lucide-react';

import { useTranslation } from '../hooks/useTranslation';
import { supportedLanguages } from '../services/translationService';

interface ProfileProps {
  onBack: () => void;
  user: any;
  achievements: any[];
  savedPrompts: any[];
  theme: string;
  onThemeChange?: (theme: string) => void;
  onDisciplineChange?: (discipline: string) => void;
  onMoodChange?: (mood: string) => void;
  onLanguageChange?: (language: string) => void;
  onRemoveSavedPrompt?: (promptId: number) => void;
  onStartCreationWithPrompt?: (prompt: string) => void;
}

export default function Profile({ onBack, user, achievements, savedPrompts, theme, onThemeChange, onDisciplineChange, onMoodChange, onLanguageChange, onRemoveSavedPrompt, onStartCreationWithPrompt }: ProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'theme' | 'discipline' | 'mood' | 'notifications' | 'language'>('main');
  const [notificationTime, setNotificationTime] = useState(user?.notificationTime || '09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled || true);
  const [customDisciplineInput, setCustomDisciplineInput] = useState('');
  const [showCustomDisciplineInput, setShowCustomDisciplineInput] = useState(false);
  const { t } = useTranslation(user?.language || 'en');
  
  if (!user) return null;

  const predefinedDisciplines = [
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'visual art', name: 'Visual Art', icon: '🖼️' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'movement', name: 'Movement', icon: '💃' },
    { id: 'crafts', name: 'Crafts', icon: '🛠️' }
  ];

  // Check if user has a custom discipline
  const isCustomDiscipline = !predefinedDisciplines.some(d => d.id === user.selectedDiscipline);
  
  // Create disciplines list including custom if needed
  const disciplines = isCustomDiscipline ? 
    [...predefinedDisciplines, { id: user.selectedDiscipline, name: user.selectedDiscipline, icon: '✨' }] : 
    predefinedDisciplines;

  const moods = [
    { id: 'energized', label: 'Energized', emoji: '⚡' },
    { id: 'calm', label: 'Calm', emoji: '🌊' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAchievementIcon = (id: number) => {
    switch (id) {
      case 1: return <Star className="w-6 h-6 text-yellow-500" />;
      case 2: return <Flame className="w-6 h-6 text-orange-500" />;
      case 3: return <Brain className="w-6 h-6 text-purple-500" />;
      case 4: return <Award className="w-6 h-6 text-blue-500" />;
      default: return <Star className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} main-container prevent-overscroll`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">{t("Profile")}</h1>
        <button
          onClick={() => setShowSettings(true)}
          className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center px-6 mb-8">
        {/* Level Badge */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-white">{user.level}</span>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-semibold mb-2">{t("Level")} {user.level} {t("Creator")}</h2>
        <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>{user.xp} XP</span>
          <span>•</span>
          <span className="capitalize">{user.selectedDiscipline}</span>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t("Achievements")}</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                achievement.unlocked
                  ? `${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`
                  : `${theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100/50 border-gray-300/50'} opacity-60`
              }`}
            >
              <div className="mb-3">
                {getAchievementIcon(achievement.id)}
              </div>
              <h4 className={`font-semibold mb-1 ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                {achievement.name}
              </h4>
              <p className={`text-sm mb-2 ${
                achievement.unlocked 
                  ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                  : 'text-gray-500'
              }`}>
                {achievement.desc}
              </p>
              {achievement.unlocked && achievement.date && (
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatDate(achievement.date)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Saved Prompts Section */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Saved Prompts</h3>
        {savedPrompts.length > 0 ? (
          <div className="space-y-3">
            {savedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} group hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <button
                      onClick={() => onStartCreationWithPrompt && onStartCreationWithPrompt(prompt.prompt)}
                      className={`text-left w-full ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} mb-2 transition-colors cursor-pointer`}
                    >
                      {prompt.prompt}
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-black/10 text-gray-600'}`}>
                        {prompt.discipline}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-black/10 text-gray-600'}`}>
                        {prompt.mood}
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} ml-auto`}>
                        {formatDate(prompt.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartCreationWithPrompt && onStartCreationWithPrompt(prompt.prompt)}
                      className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors opacity-0 group-hover:opacity-100`}
                      title="Start creation with this prompt"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveSavedPrompt && onRemoveSavedPrompt(prompt.id)}
                      className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-500/20'} transition-colors opacity-0 group-hover:opacity-100`}
                      title="Remove saved prompt"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} text-center`}>
            <Heart className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No saved prompts yet
            </p>
          </div>
        )}
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Settings Full Screen */}
      {showSettings && (
        <div className="fixed inset-0 bg-black text-white z-50 overflow-y-auto main-container prevent-overscroll">
          {settingsView === 'main' && (
            <div className="min-h-screen">
              {/* Settings Header */}
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">{t("Settings")}</h1>
              </div>

              <div className="px-6 space-y-8 pb-20">
                {/* Subscription Section */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Subscription</h2>
                  <div className="rounded-2xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 border border-purple-500/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">Free Plan</h3>
                        <p className="text-purple-200 text-sm">Upgrade for unlimited features</p>
                      </div>
                      <Lock className="w-6 h-6 text-purple-300" />
                    </div>
                    <button className="w-full py-3 px-6 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition-colors">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                {/* Preferences Section */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Preferences</h2>
                  <div className="space-y-3">
                    {/* Notifications */}
                    <button 
                      onClick={() => setSettingsView('notifications')}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{t("Notifications")}</p>
                          <p className="text-sm text-gray-400">
                            {notificationsEnabled ? `Daily at ${notificationTime}` : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Theme */}
                    <button 
                      onClick={() => setSettingsView('theme')}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{t("Theme")}</p>
                          <p className="text-sm text-gray-400 capitalize">{theme} mode</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Language */}
                    <button 
                      onClick={() => setSettingsView('language')}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{t("Language")}</p>
                          <p className="text-sm text-gray-400">
                            {supportedLanguages[user.language as keyof typeof supportedLanguages]?.name || 'English'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Creative Discipline */}
                    <button 
                      onClick={() => setSettingsView('discipline')}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">Creative Discipline</p>
                          <p className="text-sm text-gray-400 capitalize">{
                            disciplines.find(d => d.id === user.selectedDiscipline)?.name || user.selectedDiscipline
                          }</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Mood Setting */}
                    <button 
                      onClick={() => setSettingsView('mood')}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">Current Mood</p>
                          <p className="text-sm text-gray-400 capitalize">{user.mood}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h2 className="text-xl font-medium mb-4">About</h2>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-medium mb-2">Origyn v1.0</h3>
                    <p className="text-sm text-gray-400">The source of creativity. The starting point of daily practice.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme Selection */}
          {settingsView === 'theme' && (
            <div className="min-h-screen">
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setSettingsView('main')}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">{t("Theme")}</h1>
              </div>

              <div className="px-6">
                <p className="text-gray-400 mb-6">Choose your preferred theme</p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onThemeChange && onThemeChange('dark');
                      setSettingsView('main');
                    }}
                    className="w-full p-4 rounded-xl border bg-white/10 border-purple-500 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Discipline Selection */}
          {settingsView === 'discipline' && (
            <div className="min-h-screen">
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setSettingsView('main')}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">Creative Discipline</h1>
              </div>

              <div className="px-6">
                <p className="text-gray-400 mb-6">Switch your primary creative focus</p>
                <div className="space-y-3">
                  {disciplines.map((discipline) => (
                    <button
                      key={discipline.id}
                      onClick={() => {
                        onDisciplineChange && onDisciplineChange(discipline.id);
                        setSettingsView('main');
                      }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                        user.selectedDiscipline === discipline.id 
                          ? 'bg-white/10 border-purple-500' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{discipline.icon}</span>
                        <span className="capitalize">{discipline.name}</span>
                      </div>
                      {user.selectedDiscipline === discipline.id && (
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      )}
                    </button>
                  ))}
                  
                  {/* Custom discipline input */}
                  {!showCustomDisciplineInput && (
                    <button
                      onClick={() => setShowCustomDisciplineInput(true)}
                      className="w-full p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors"
                    >
                      <span className="text-lg">✨</span>
                      <span>Add Custom Discipline</span>
                    </button>
                  )}
                  
                  {showCustomDisciplineInput && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customDisciplineInput}
                        onChange={(e) => setCustomDisciplineInput(e.target.value)}
                        placeholder="Enter your creative field..."
                        className="w-full p-4 rounded-xl glass-effect bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (customDisciplineInput.trim()) {
                              onDisciplineChange && onDisciplineChange(customDisciplineInput.trim().toLowerCase());
                              setCustomDisciplineInput('');
                              setShowCustomDisciplineInput(false);
                              setSettingsView('main');
                            }
                          }}
                          disabled={!customDisciplineInput.trim()}
                          className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add "{customDisciplineInput}"
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomDisciplineInput(false);
                            setCustomDisciplineInput('');
                          }}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Selection */}
          {settingsView === 'mood' && (
            <div className="min-h-screen">
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setSettingsView('main')}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">Current Mood</h1>
              </div>

              <div className="px-6">
                <p className="text-gray-400 mb-6">How are you feeling today?</p>
                <div className="space-y-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        onMoodChange && onMoodChange(mood.id);
                        setSettingsView('main');
                      }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                        user.mood === mood.id 
                          ? 'bg-white/10 border-purple-500' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </div>
                      {user.mood === mood.id && (
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {settingsView === 'notifications' && (
            <div className="min-h-screen">
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setSettingsView('main')}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">{t("Notifications")}</h1>
              </div>

              <div className="px-6 space-y-6">
                <p className="text-gray-400">Get reminded to create daily</p>
                
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="font-medium">{t("Enable Notifications")}</p>
                    <p className="text-sm text-gray-400">Daily creative reminders</p>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationsEnabled ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Time Picker */}
                {notificationsEnabled && (
                  <div className="space-y-3">
                    <p className="font-medium">Notification Time</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['09:00', '12:00', '15:00', '18:00', '20:00', '21:00'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setNotificationTime(time)}
                          className={`p-3 rounded-xl border flex items-center justify-center ${
                            notificationTime === time
                              ? 'bg-purple-500 border-purple-500 text-white'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          } transition-colors`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={() => {
                    // Here you would typically save the notification settings
                    console.log('Saving notification settings:', { notificationsEnabled, notificationTime });
                    setSettingsView('main');
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
                >
                  {t("Save Settings")}
                </button>
              </div>
            </div>
          )}

          {/* Language Selection */}
          {settingsView === 'language' && (
            <div className="min-h-screen">
              <div className="flex items-center gap-4 p-6 pt-12">
                <button
                  onClick={() => setSettingsView('main')}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-medium">{t("Language")}</h1>
              </div>

              <div className="px-6">
                <p className="text-gray-400 mb-6">Choose your preferred language for the app</p>
                <div className="space-y-3">
                  {Object.entries(supportedLanguages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        onLanguageChange && onLanguageChange(code);
                        setSettingsView('main');
                      }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                        user.language === code 
                          ? 'bg-white/10 border-purple-500' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {user.language === code && (
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}