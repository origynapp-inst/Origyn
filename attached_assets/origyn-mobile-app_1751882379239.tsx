import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Code,
  Flame,
  Globe,
  Heart,
  Home,
  Lock,
  Moon,
  MoreHorizontal,
  Music,
  Palette,
  PenTool,
  Plus,
  Send,
  Settings,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  User,
  Video,
  X,
  Zap,
} from 'lucide-react';

const renderHome = () => {
    const selectedDisciplineData = disciplines.find(d => d.id === selectedDiscipline);
    const progressPercentage = (xp % calculateNextLevel()) / calculateNextLevel() * 100;
    
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} pb-20`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{t('welcome')}</p>
              <h1 className="text-2xl font-light">{t('todaysCreation')}</h1>
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
          <div className={`rounded-3xl p-6 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>{t('streak')}</p>
                <p className="text-3xl font-light">{streak} {t('days')}</p>
                {todayCompleted && (
                  <p className="text-sm text-green-500 mt-1">✓ Today completed</p>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeklyData.map((day, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{day.day[0]}</p>
                    <div
                      className={`w-8 h-8 rounded-lg ${
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
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Level {level}</span>
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{xp} / {calculateNextLevel()} XP</span>
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
          <div className={`rounded-3xl p-6 backdrop-blur-xl bg-gradient-to-br ${selectedDisciplineData?.color || 'from-purple-500 to-pink-500'} bg-opacity-20 border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} mb-6`}>
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-6 h-6" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>2-15 min</span>
            </div>
            <h2 className="text-xl font-medium mb-2">Today's Prompt</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6 leading-relaxed`}>{dailyPrompt}</p>
            
            <button 
              onClick={startCreation}
              className={`w-full rounded-2xl py-4 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} font-medium transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              {t('startCreating')}
            </button>
            
            <div className="flex gap-3 mt-3">
              <button 
                id="save-prompt-btn"
                onClick={savePrompt}
                className={`flex-1 rounded-xl py-2 ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'} font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2`}
              >
                <Heart className="w-4 h-4" />
                Save
              </button>
              <button 
                id="new-prompt-btn"
                onClick={generateNewPrompt}
                className={`flex-1 rounded-xl py-2 ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'} font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2`}
              >
                <Zap className="w-4 h-4" />
                New Prompt
              </button>
            </div>
          </div>

          {/* AI Muse Preview */}
          <button 
            onClick={() => setCurrentScreen('muse')}
            className={`w-full rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-black/5 border border-black/10 hover:bg-black/10'} transition-all duration-300 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium">Your Muse</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ready to chat about creativity</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    );
  };

const OrigynApp = () => {
  // Core state
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [mood, setMood] = useState('');
  const [streak, setStreak] = useState(0); // Start from 0
  const [xp, setXp] = useState(0); // Start from 0
  const [level, setLevel] = useState(1); // Start from level 1
  const [dailyPrompt, setDailyPrompt] = useState(() => {
    // Set initial prompt immediately
    if (selectedDiscipline && mood) {
      return generateAIPrompt(selectedDiscipline, mood);
    }
    return 'Loading your personalized prompt...';
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [creationFrequency, setCreationFrequency] = useState('daily');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [subscription, setSubscription] = useState('free');
  const [lastCompletionDate, setLastCompletionDate] = useState(null);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  
  // Feature states
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentCreation, setCurrentCreation] = useState('');
  const [creationTimer, setCreationTimer] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreferences, setShowPreferences] = useState(null); // null, 'notifications', 'theme', 'language', 'discipline'
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Steps', desc: 'Complete your first prompt', icon: Star, unlocked: false, date: null },
    { id: 2, name: 'Week Warrior', desc: '7 day streak', icon: Flame, unlocked: false, date: null },
    { id: 3, name: 'Creative Explorer', desc: 'Try 3 different moods', icon: Brain, unlocked: false },
    { id: 4, name: 'Dedicated Creator', desc: '30 day streak', icon: Award, unlocked: false },
  ]);
  
  // AI Muse state
  const [museMessages, setMuseMessages] = useState([
    { type: 'muse', text: "Hey! I'm your creative companion. How are you feeling about today's creation?" }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isMuseTyping, setIsMuseTyping] = useState(false);
  
  // Weekly data state - properly initialize for current week
  const [weeklyData, setWeeklyData] = useState(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({ day, completed: false, duration: 0 }));
  });

  const [monthlyMood, setMonthlyMood] = useState({
    energized: 0,
    calm: 0,
    inspired: 0,
    drained: 0,
    playful: 0,
    focused: 0
  });

  const messageEndRef = useRef(null);
  const timerInterval = useRef(null);

  const disciplines = [
    { id: 'music', name: 'Music', icon: Music, color: 'from-purple-500 to-pink-500' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'from-blue-500 to-cyan-500' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-orange-500 to-red-500' },
    { id: 'coding', name: 'Coding', icon: Code, color: 'from-green-500 to-emerald-500' },
    { id: 'film', name: 'Filmmaking', icon: Video, color: 'from-indigo-500 to-purple-500' },
    { id: 'other', name: 'Other', icon: MoreHorizontal, color: 'from-gray-500 to-gray-600' }
  ];

  const moods = [
    { id: 'energized', emoji: '⚡', label: 'Energized' },
    { id: 'calm', emoji: '🌊', label: 'Calm' },
    { id: 'inspired', emoji: '✨', label: 'Inspired' },
    { id: 'drained', emoji: '🌙', label: 'Drained' },
    { id: 'playful', emoji: '🎨', label: 'Playful' },
    { id: 'focused', emoji: '🎯', label: 'Focused' }
  ];

  const frequencies = [
    { id: 'daily', label: 'Every day', desc: 'Build a strong habit' },
    { id: 'weekdays', label: 'Weekdays only', desc: 'Mon-Fri routine' },
    { id: 'custom', label: 'Custom schedule', desc: 'Choose your days' }
  ];

  // AI-generated prompts with more variety
  const generateAIPrompt = (discipline, mood) => {
    // Simulating AI prompt generation - in production, this would call your AI API
    const promptTemplates = {
      music: {
        energized: [
          "Create a 30-second beat using only sounds you can make with your body. Record it now!",
          "Make a high-energy loop using three random objects near you as instruments.",
          "Compose a victory fanfare for completing a small task. Keep it under 45 seconds!",
          "Record yourself beatboxing the rhythm of your favorite song, then add a twist."
        ],
        calm: [
          "Compose a 4-bar melody that sounds like morning coffee feels. Use any instrument.",
          "Create ambient sounds using only your breath and whispers. 2 minutes max.",
          "Make a lullaby for your current mood using just 5 notes.",
          "Record the most peaceful chord progression you can imagine."
        ],
        inspired: [
          "Remake your favorite chorus but in a completely different genre. Go wild!",
          "Create a musical conversation between two instruments of your choice.",
          "Compose a theme song for a character from your imagination.",
          "Make a 1-minute soundtrack for a movie scene that doesn't exist yet."
        ],
        drained: [
          "Listen to your favorite song and recreate just the first 4 bars with a twist.",
          "Hum a simple melody and record it. That's enough for today.",
          "Make a 30-second drone sound that matches how you feel.",
          "Create the laziest beat possible using just one finger tapping."
        ],
        playful: [
          "Make a jingle for an imaginary product in under 2 minutes.",
          "Create sound effects for 5 everyday actions using your voice.",
          "Compose a theme song for your pet (real or imaginary).",
          "Make a 30-second song using only silly sounds that make you smile."
        ],
        focused: [
          "Layer 3 different percussion patterns. Each should be exactly 8 bars.",
          "Create a perfect 16-bar loop with intro, buildup, and drop.",
          "Compose using only pentatonic scale. Exactly 1 minute long.",
          "Build a track using only frequencies between 200-800 Hz."
        ]
      },
      writing: {
        energized: [
          "Write a story in exactly 50 words. Your first word must be 'Yesterday'.",
          "Create a manifesto for an everyday object in under 100 words.",
          "Write the most exciting description possible of a boring task.",
          "Craft a news headline from 100 years in the future. Then write the first paragraph."
        ],
        calm: [
          "Describe the view from your window as if it's on another planet.",
          "Write about silence without using the word 'quiet' or 'silent'.",
          "Describe your morning routine as if it's a sacred ritual.",
          "Write a love letter from one household item to another."
        ],
        inspired: [
          "Write a conversation between two objects on your desk.",
          "Create origin story for the last thing you touched.",
          "Write a recipe for an emotion, listing ingredients and steps.",
          "Describe a color to someone who has never seen it."
        ],
        drained: [
          "Write a haiku about something within arm's reach.",
          "List 10 words that describe your current state. Make a poem with just those.",
          "Write one beautiful sentence. That's it. Make it count.",
          "Describe your tiredness as if it's a place you can visit."
        ],
        playful: [
          "Create 5 terrible advice tips for your craft. Make them funny!",
          "Write a product review for something that doesn't exist.",
          "Create a silly superhero based on your biggest weakness.",
          "Write fortune cookie messages that are oddly specific."
        ],
        focused: [
          "Write the opening paragraph of a thriller. Maximum 100 words.",
          "Create a complete story arc using only dialogue. 10 lines max.",
          "Write instructions for a simple task as if it's a complex operation.",
          "Craft a paragraph where each sentence has exactly 10 words."
        ]
      },
      design: {
        energized: [
          "Design a logo using only geometric shapes in 5 minutes.",
          "Create an album cover for your current emotional state.",
          "Design a flag for a micro-nation of your imagination.",
          "Make a bold poster using only typography and one color."
        ],
        calm: [
          "Create a color palette inspired by your current mood using 4 colors.",
          "Design a minimalist representation of peace using 3 elements.",
          "Draw a mandala starting from a single circle.",
          "Create a pattern that could repeat infinitely."
        ],
        inspired: [
          "Redesign a everyday object to be 10x more interesting.",
          "Create a visual metaphor for growth using simple shapes.",
          "Design an impossible architecture that defies physics.",
          "Illustrate an emotion as if it were a creature."
        ],
        drained: [
          "Sketch the first object you see with your non-dominant hand.",
          "Draw continuous circles for 2 minutes. See what emerges.",
          "Make the simplest self-portrait possible. 5 lines maximum.",
          "Create art using only dots. No lines allowed."
        ],
        playful: [
          "Design a movie poster for your day as if it were a film.",
          "Create a warning label for your personality.",
          "Design a merit badge for a useless skill.",
          "Make a treasure map of your workspace."
        ],
        focused: [
          "Create a minimalist icon set with 5 related icons.",
          "Design a complete UI element using only black and white.",
          "Create a logo that works at any size, from tiny to huge.",
          "Design a typeface using only straight lines."
        ]
      },
      coding: {
        energized: [
          "Code a function that generates random compliments. Make it work!",
          "Build a mini password generator with a twist - make it memorable.",
          "Create a script that turns any text into emoji translation.",
          "Code a simple game that can be played in the console."
        ],
        calm: [
          "Write a simple animation using only CSS. Keep it zen.",
          "Create a function that generates calming color gradients.",
          "Build a breathing exercise timer with visual feedback.",
          "Code a peaceful particle system that moves slowly."
        ],
        inspired: [
          "Build a mini-tool that solves a tiny problem you have today.",
          "Create an algorithm inspired by nature (fractals, swarms, growth).",
          "Code a generator for your discipline (music/art/writing).",
          "Build something that makes you smile every time it runs."
        ],
        drained: [
          "Refactor an old piece of code to be more elegant. Just 10 lines.",
          "Write the laziest possible 'Hello World' variation.",
          "Create a function that does nothing useful but works perfectly.",
          "Comment your code as if explaining to a sleepy version of yourself."
        ],
        playful: [
          "Create a useless but fun console.log() animation.",
          "Code a magic 8-ball with ridiculous responses.",
          "Build a generator for silly variable names.",
          "Create ASCII art with code. Make it move!"
        ],
        focused: [
          "Implement a classic algorithm in a language you rarely use.",
          "Optimize a function to run in half the time.",
          "Create a perfect recursive solution for something simple.",
          "Build a one-liner that does something surprisingly complex."
        ]
      },
      film: {
        energized: [
          "Film a 15-second action sequence using only your phone.",
          "Create a hyperlapse of a mundane activity, make it epic.",
          "Film a chase scene where you're both characters.",
          "Make a high-energy montage of your morning routine."
        ],
        calm: [
          "Capture 5 still frames that tell a complete story.",
          "Film clouds or shadows moving for 30 seconds. Find the drama.",
          "Create a meditative sequence using only close-ups of textures.",
          "Record water in any form. Make it cinematic."
        ],
        inspired: [
          "Create a 30-second video using only shadows and light.",
          "Film an everyday object like it's the star of a movie.",
          "Tell a story using only hands - no faces, no words.",
          "Create a visual poem using 10 different shots."
        ],
        drained: [
          "Film one beautiful transition between two shots.",
          "Record 10 seconds of something repetitive. Find the rhythm.",
          "Make a time-lapse of yourself doing nothing.",
          "Film the most boring thing beautifully."
        ],
        playful: [
          "Make a 10-second video that loops perfectly.",
          "Create a mockumentary about an object in your room.",
          "Film a conversation between two inanimate objects.",
          "Make a trailer for your life as a sitcom."
        ],
        focused: [
          "Storyboard a 1-minute short film in 6 panels.",
          "Film a sequence using only one type of shot (all close-ups, etc).",
          "Create a video with exactly 10 cuts. Time them perfectly.",
          "Make a silent film that tells a clear story."
        ]
      }
    };

    // Get the appropriate prompts for the discipline and mood
    const disciplinePrompts = promptTemplates[discipline] || promptTemplates.music;
    const moodPrompts = disciplinePrompts[mood] || disciplinePrompts.energized;
    
    // Randomly select one prompt
    const randomIndex = Math.floor(Math.random() * moodPrompts.length);
    return moodPrompts[randomIndex] || "Create something that expresses how you feel right now. Take your time.";
  };

  const museResponses = {
    greeting: [
      "Ready to create something amazing today?",
      "Your creative spark is waiting! Let's do this.",
      "I've been thinking about your last creation. Ready for more?"
    ],
    encouragement: [
      "Even 2 minutes of creation beats 0 minutes of perfection.",
      "Your streak shows dedication. That's real creative power!",
      "Remember: we're building a practice, not a masterpiece. Yet.",
      "Every great creator started with daily practice. You're on the path!"
    ],
    completion: [
      "That's another one in the books! How did it feel?",
      "You showed up. That's what matters most.",
      "Your creative muscle just got stronger!",
      "I'm genuinely impressed by your consistency."
    ],
    struggle: [
      "Feeling stuck is part of the process. Want to try a different approach?",
      "Sometimes the hardest part is starting. You've got this!",
      "Even master creators have tough days. What matters is showing up.",
      "Let's make this easier. How about we adjust today's prompt?"
    ]
  };

  useEffect(() => {
    if (selectedDiscipline && mood) {
      const prompt = generateAIPrompt(selectedDiscipline, mood);
      setDailyPrompt(prompt);
    }
  }, [selectedDiscipline, mood]);

  useEffect(() => {
    if (isCreating && creationTimer < 900) { // 15 min max
      timerInterval.current = setInterval(() => {
        setCreationTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    
    return () => clearInterval(timerInterval.current);
  }, [isCreating, creationTimer]);

  // Check if it's a new day and reset todayCompleted
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (lastCompletionDate !== today && todayCompleted) {
        setTodayCompleted(false);
      }
    };
    
    // Check on mount and set up interval
    checkNewDay();
    const interval = setInterval(checkNewDay, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [lastCompletionDate, todayCompleted]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateNextLevel = () => {
    return (level + 1) * 500;
  };

  const handleDisciplineSelect = (discipline) => {
    setSelectedDiscipline(discipline);
    setOnboardingStep(2);
  };

  const handleMoodSelect = (moodId) => {
    setMood(moodId);
    setOnboardingStep(3);
  };

  const handleFrequencySelect = (freq) => {
    setCreationFrequency(freq);
    setOnboardingStep(4);
  };

  const completeOnboarding = () => {
    // Generate initial prompt before transitioning
    const initialPrompt = generateAIPrompt(selectedDiscipline, mood);
    setDailyPrompt(initialPrompt);
    
    setCurrentScreen('home');
    // Initialize first journal entry
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      prompt: "Welcome to Origyn! Your creative journey begins.",
      creation: "I'm excited to start my daily creative practice!",
      duration: 0,
      mood: mood,
      reflection: "This is the beginning of something special."
    };
    setJournalEntries([entry]);
  };

  const startCreation = () => {
    setIsCreating(true);
    setCreationTimer(0);
    setCurrentScreen('creating');
  };

  const completeCreation = () => {
    setIsCreating(false);
    const duration = creationTimer;
    const today = new Date().toDateString();
    
    // Check if this is the first completion today
    const isFirstCompletionToday = lastCompletionDate !== today;
    
    // Award XP only if creation is longer than 20 seconds
    if (duration >= 20) {
      const baseXP = 50;
      const timeBonus = Math.min(Math.floor(duration / 10) * 10, 100); // 10 XP per 10 seconds, max 100
      const earnedXP = baseXP + timeBonus;
      
      setXp(prev => {
        const newXP = prev + earnedXP;
        // Check for level up
        if (newXP >= calculateNextLevel()) {
          setLevel(l => l + 1);
          // Unlock achievement
          if (level === 10) {
            setAchievements(prev => prev.map(a => 
              a.id === 3 ? { ...a, unlocked: true, date: new Date().toLocaleDateString() } : a
            ));
          }
        }
        return newXP;
      });
    }

    // Update streak only if this is the first completion today
    if (isFirstCompletionToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = lastCompletionDate === yesterday.toDateString();
      
      if (!lastCompletionDate) {
        // First ever completion
        setStreak(1);
        // Unlock first steps achievement
        setAchievements(prev => prev.map(a => 
          a.id === 1 ? { ...a, unlocked: true, date: new Date().toLocaleDateString() } : a
        ));
      } else if (wasYesterday) {
        // Continue streak
        setStreak(prev => {
          const newStreak = prev + 1;
          // Check for 7-day achievement
          if (newStreak === 7) {
            setAchievements(prevAch => prevAch.map(a => 
              a.id === 2 ? { ...a, unlocked: true, date: new Date().toLocaleDateString() } : a
            ));
          }
          // Check for 30-day achievement
          if (newStreak === 30) {
            setAchievements(prevAch => prevAch.map(a => 
              a.id === 4 ? { ...a, unlocked: true, date: new Date().toLocaleDateString() } : a
            ));
          }
          return newStreak;
        });
      } else {
        // Streak broken - reset to 1
        setStreak(1);
      }
      
      setLastCompletionDate(today);
      setTodayCompleted(true);
      
      // Update weekly data
      const dayIndex = new Date().getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert Sunday = 0 to Sunday = 6
      setWeeklyData(prev => prev.map((day, i) => 
        i === adjustedIndex ? { ...day, completed: true, duration: duration } : day
      ));
    }

    // Update mood tracking
    setMonthlyMood(prev => ({
      ...prev,
      [mood]: prev[mood] + 1
    }));

    // Save to journal with file reference
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      prompt: dailyPrompt,
      creation: currentCreation,
      duration: duration,
      mood: mood,
      reflection: "",
      fileUrl: uploadedFile // Store the uploaded file reference
    };
    setJournalEntries(prev => [entry, ...prev]);
    
    // Generate new prompt automatically
    const newPrompt = generateAIPrompt(selectedDiscipline, mood);
    setDailyPrompt(newPrompt);
    
    // Add completion message from Muse
    const completionMsg = duration < 20 
      ? "Nice try! Remember, creations over 20 seconds earn XP. Keep practicing!"
      : isFirstCompletionToday 
      ? `Great job! You've kept your streak alive and earned ${duration >= 20 ? Math.min(Math.floor(duration / 10) * 10, 100) + 50 : 0} XP. See you tomorrow!`
      : museResponses.completion[Math.floor(Math.random() * museResponses.completion.length)];
    setMuseMessages(prev => [...prev, { type: 'muse', text: completionMsg }]);
    
    // Reset creation state
    setCurrentCreation('');
    setUploadedFile(null);
    
    setCurrentScreen('completion');
  };

  const savePrompt = () => {
    const saved = {
      id: Date.now(),
      prompt: dailyPrompt,
      discipline: selectedDiscipline,
      mood: mood,
      date: new Date().toLocaleDateString()
    };
    setSavedPrompts(prev => [saved, ...prev]);
    
    // Visual feedback
    const button = document.getElementById('save-prompt-btn');
    if (button) {
      button.classList.add('scale-95');
      setTimeout(() => {
        button.classList.remove('scale-95');
      }, 200);
    }
    
    // Add muse acknowledgment
    setMuseMessages(prev => [...prev, { 
      type: 'muse', 
      text: "Great choice! I've saved that prompt for you. Sometimes the best ideas need time to marinate." 
    }]);
  };

  const generateNewPrompt = () => {
    // Generate new prompt with current mood or random mood
    const moodKeys = ['energized', 'calm', 'inspired', 'drained', 'playful', 'focused'];
    const randomMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];
    const newPrompt = generateAIPrompt(selectedDiscipline, randomMood);
    
    setDailyPrompt(newPrompt);
    
    // Muse acknowledges
    setMuseMessages(prev => [...prev, { type: 'muse', text: "Fresh prompt coming up! This one's interesting..." }]);
  };

  // Enhanced AI Muse responses with more personality
  const generateMuseResponse = async (userInput, context) => {
    // In production, this would call GPT-4 or Claude API
    // For now, simulating more intelligent responses based on context
    
    const lowercaseInput = userInput.toLowerCase();
    
    // Analyze user sentiment and intent
    if (lowercaseInput.includes('stuck') || lowercaseInput.includes('help') || lowercaseInput.includes('hard')) {
      const responses = [
        "I hear you. Being stuck is actually a sign you're pushing boundaries. What if we simplified? What's the smallest version of this idea you could create right now?",
        "Creative blocks are just your brain asking for a different angle. Let's flip this: what would be the worst way to do this prompt? Sometimes that unlocks the good stuff.",
        "You know what? Let's take the pressure off. Forget 'good' - just make something weird. The best ideas often come disguised as terrible ones.",
        "Here's a secret: every creator feels this. The magic is in starting badly. Can you give yourself permission to make something imperfect today?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowercaseInput.includes('tired') || lowercaseInput.includes('exhausted') || lowercaseInput.includes('drained')) {
      const responses = [
        "Rest is part of the creative process too. How about we do something super gentle today? Even 30 seconds counts.",
        "Your energy is telling you something. What if today's creation is about capturing this exact feeling? Sometimes the best art comes from our realest moments.",
        "I'm impressed you showed up even feeling this way. That's the mark of a true creator. Want to try the laziest possible version of today's prompt?",
        "Creative energy ebbs and flows like tides. Today might be a low tide day, and that's perfectly okay. What feels manageable right now?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowercaseInput.includes('excited') || lowercaseInput.includes('inspired') || lowercaseInput.includes('ready')) {
      const responses = [
        "YES! I can feel that energy through the screen! Channel all of that into your creation. What wild idea has been bouncing around your head?",
        "This is the feeling we live for! When inspiration strikes, we ride the wave. How can we push today's prompt even further?",
        "Your enthusiasm is contagious! Let's harness this momentum. What would you create if you knew it would be amazing?",
        "I love this energy! Days like these are gifts. Let's make something that captures this exact feeling so you can revisit it anytime."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowercaseInput.includes('proud') || lowercaseInput.includes('did it') || lowercaseInput.includes('finished')) {
      const responses = [
        "You should be proud! Every creation is a victory. What surprised you most about what you made today?",
        "That feeling? That's growth happening in real-time. You showed up, you created, you won. How did it feel in the moment?",
        "This is why we do this! Not for perfection, but for these moments of 'I made that.' What did you discover about yourself today?",
        "Celebrating with you! 🎉 Each creation builds your creative confidence. What part are you most excited about?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Check for questions about the process
    if (lowercaseInput.includes('why') || lowercaseInput.includes('what') || lowercaseInput.includes('how')) {
      const responses = [
        "Great question! I think the answer might be different for everyone. What does your gut tell you?",
        "You're thinking deeply about this - I love it. Sometimes the best answers come from experimenting. What happens if you just try?",
        "That's the kind of curiosity that makes great creators. Instead of me telling you, what if your next creation explores this question?",
        "I could give you the textbook answer, but I think you already know intuitively. What feels right to you?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default encouraging responses
    const defaultResponses = [
      "I'm here with you on this journey. Every day you show up, you're building something bigger than individual creations. You're building a practice.",
      "Your commitment to daily creation is inspiring. Even on the tough days, you're here. That consistency is going to pay off in ways you can't imagine yet.",
      "Something I've noticed: the days we least feel like creating often produce the most interesting work. There's magic in showing up when it's hard.",
      "You know what I love about your approach? You're not waiting for perfect conditions. You're creating in the messy middle of life. That's real artistry."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendToMuse = async () => {
    if (!userMessage.trim()) return;
    
    setMuseMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    const currentMessage = userMessage;
    setUserMessage('');
    setIsMuseTyping(true);
    
    // Simulate AI processing with context awareness
    setTimeout(async () => {
      const context = {
        streak: streak,
        mood: mood,
        recentCreations: journalEntries.slice(0, 3),
        todayCompleted: todayCompleted
      };
      
      const response = await generateMuseResponse(currentMessage, context);
      setMuseMessages(prev => [...prev, { type: 'muse', text: response }]);
      setIsMuseTyping(false);
    }, 1000 + Math.random() * 1000); // Variable delay for more natural feel
  };

  const renderOnboarding = () => {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col">
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-12">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                step <= onboardingStep ? 'bg-white w-8' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {onboardingStep === 1 && (
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-light mb-4">What do you create?</h1>
            <p className="text-gray-400 mb-12">Choose your primary creative discipline</p>
            
            <div className="grid grid-cols-2 gap-4">
              {disciplines.map((discipline) => {
                const Icon = discipline.icon;
                return (
                  <button
                    key={discipline.id}
                    onClick={() => handleDisciplineSelect(discipline.id)}
                    className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${discipline.color} opacity-20`} />
                    <Icon className="w-8 h-8 mb-3 relative z-10" />
                    <p className="text-lg font-medium relative z-10">{discipline.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-light mb-4">How often do you want to create?</h1>
            <p className="text-gray-400 mb-12">Build a sustainable practice</p>
            
            <div className="space-y-4">
              {frequencies.map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => handleFrequencySelect(freq.id)}
                  className="w-full rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 text-left"
                >
                  <p className="text-lg font-medium mb-1">{freq.label}</p>
                  <p className="text-gray-400 text-sm">{freq.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 3 && (
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-light mb-4">How are you feeling?</h1>
            <p className="text-gray-400 mb-12">We'll match today's prompt to your energy</p>
            
            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
                >
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <p className="text-lg font-medium">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 4 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-8 animate-pulse">
              <Flame className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-light mb-4">Welcome to Origyn</h1>
            <p className="text-gray-400 mb-12 max-w-sm">
              Your daily creative practice starts now. Small steps, every day.
            </p>
            
            <button
              onClick={completeOnboarding}
              className="rounded-full px-8 py-4 bg-white text-black font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Begin Creating
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => {
    const selectedDisciplineData = disciplines.find(d => d.id === selectedDiscipline);
    const progressPercentage = (xp % calculateNextLevel()) / calculateNextLevel() * 100;
    
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-gray-400 text-sm">Welcome back</p>
              <h1 className="text-2xl font-light">Today's Creation</h1>
            </div>
            <button 
              onClick={() => setCurrentScreen('profile')}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-lg font-medium">{level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Flame className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>

          {/* Streak & XP Card */}
          <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                <p className="text-3xl font-light">{streak} days</p>
                {todayCompleted && (
                  <p className="text-sm text-green-500 mt-1">✓ Today completed</p>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeklyData.map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{day.day[0]}</p>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        day.completed ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-white/10'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Level {level}</span>
                <span className="text-gray-400">{xp} / {calculateNextLevel()} XP</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Today's Prompt */}
          <div className={`rounded-3xl p-6 backdrop-blur-xl bg-gradient-to-br ${selectedDisciplineData?.color || 'from-purple-500 to-pink-500'} bg-opacity-20 border border-white/10 mb-6`}>
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm text-gray-400">2-15 min</span>
            </div>
            <h2 className="text-xl font-medium mb-2">Today's Prompt</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{dailyPrompt}</p>
            
            <button 
              onClick={startCreation}
              className="w-full rounded-2xl py-4 bg-white text-black font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Creating
            </button>
            
            <div className="flex gap-3 mt-3">
              <button 
                id="save-prompt-btn"
                onClick={savePrompt}
                className="flex-1 rounded-xl py-2 bg-white/10 text-white font-medium transition-all duration-300 hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Save
              </button>
              <button 
                id="new-prompt-btn"
                onClick={generateNewPrompt}
                className="flex-1 rounded-xl py-2 bg-white/10 text-white font-medium transition-all duration-300 hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                New Prompt
              </button>
            </div>
          </div>

          {/* AI Muse Preview */}
          <button 
            onClick={() => setCurrentScreen('muse')}
            className="w-full rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Your Muse</p>
                <p className="text-sm text-gray-400">Ready to chat about creativity</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  };

  const renderCreating = () => {
    const selectedDisciplineData = disciplines.find(d => d.id === selectedDiscipline);
    
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-2xl font-light">
            {formatTime(creationTimer)}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className={`rounded-3xl p-6 backdrop-blur-xl bg-gradient-to-br ${selectedDisciplineData?.color || 'from-purple-500 to-pink-500'} bg-opacity-20 border border-white/10 mb-6`}>
            <h2 className="text-xl font-medium mb-4">Your Prompt</h2>
            <p className="text-gray-300 leading-relaxed">{dailyPrompt}</p>
          </div>

          <textarea
            value={currentCreation}
            onChange={(e) => setCurrentCreation(e.target.value)}
            placeholder="Describe what you're creating..."
            className="w-full h-32 rounded-2xl p-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-white/20 transition-all"
          />
          
          {/* File Upload */}
          <div className="mt-4">
            <label className="block">
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // In production, upload to cloud storage
                    const fileUrl = URL.createObjectURL(file);
                    setUploadedFile(fileUrl);
                  }
                }}
                className="hidden"
              />
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                <span>Upload your creation</span>
              </div>
            </label>
            {uploadedFile && (
              <div className="mt-2 p-2 bg-white/5 rounded-xl text-sm text-gray-400 flex items-center justify-between">
                <span>File uploaded ✓</span>
                <button onClick={() => setUploadedFile(null)} className="text-red-400 hover:text-red-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button 
              onClick={completeCreation}
              className="w-full rounded-2xl py-4 bg-white text-black font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Complete Creation
            </button>
            
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-full rounded-2xl py-4 bg-white/10 text-white font-medium transition-all duration-300 hover:bg-white/20"
            >
              Save for Later
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletion = () => {
    const earnedXP = creationTimer >= 20 ? Math.min(Math.floor(creationTimer / 10) * 10, 100) + 50 : 0;
    
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} p-6 flex flex-col justify-center items-center text-center`}>
        <div className={`w-24 h-24 rounded-full ${creationTimer >= 20 ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-yellow-500 to-orange-500'} flex items-center justify-center mb-6 animate-pulse`}>
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-light mb-4">Creation Complete!</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
          {creationTimer >= 20 
            ? `You earned ${earnedXP} XP!` 
            : 'Keep creating for 20+ seconds to earn XP'}
        </p>
        
        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
            <div className="flex justify-between items-center">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</span>
              <span className="font-medium">{formatTime(creationTimer)}</span>
            </div>
          </div>
          
          <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
            <div className="flex justify-between items-center">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</span>
              <span className="font-medium flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                {streak} days
              </span>
            </div>
          </div>
          
          {creationTimer >= 20 && (
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
              <div className="flex justify-between items-center">
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>XP Earned</span>
                <span className="font-medium text-purple-500">+{earnedXP} XP</span>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setCurrentScreen('home')}
          className={`rounded-full px-8 py-4 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} font-medium transition-all duration-300 hover:scale-105 active:scale-95`}
        >
          Continue
        </button>
      </div>
    );
  };

  const renderJournal = () => {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-light">Creative Journal</h1>
            <span className="text-sm text-gray-400">{journalEntries.length} entries</span>
          </div>

          {journalEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Your creative journey starts with the first entry</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{entry.date}</p>
                      <p className="text-sm text-gray-400">
                        {moods.find(m => m.id === entry.mood)?.emoji} {entry.mood} • {formatTime(entry.duration)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{entry.prompt}</p>
                  {entry.creation && (
                    <p className="text-sm bg-white/5 rounded-xl p-3 mt-2">{entry.creation}</p>
                  )}
                  {entry.reflection && (
                    <p className="text-sm text-gray-400 mt-2 italic">"{entry.reflection}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMuse = () => {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <button onClick={() => setCurrentScreen('home')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium">Your Muse</h1>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {museMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.type === 'user' 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 border border-white/10'
                }`}>
                  {msg.type === 'muse' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-400">Muse</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isMuseTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendToMuse()}
              placeholder="Ask your Muse anything..."
              className="flex-1 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all"
            />
            <button
              onClick={sendToMuse}
              className="rounded-2xl p-3 bg-white text-black transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const totalCreations = journalEntries.length;
    const avgDuration = journalEntries.length > 0 
      ? Math.round(journalEntries.reduce((acc, e) => acc + e.duration, 0) / journalEntries.length)
      : 0;

    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="p-6">
          <h1 className="text-2xl font-light mb-6">Your Progress</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-gray-400">Current Streak</p>
              </div>
              <p className="text-2xl font-light">{streak} days</p>
            </div>
            
            <div className="rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <p className="text-sm text-gray-400">Total Creations</p>
              </div>
              <p className="text-2xl font-light">{totalCreations}</p>
            </div>
            
            <div className="rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-400">Avg Duration</p>
              </div>
              <p className="text-2xl font-light">{formatTime(avgDuration)}</p>
            </div>
            
            <div className="rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-gray-400">Level</p>
              </div>
              <p className="text-2xl font-light">{level}</p>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className={`rounded-2xl p-6 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} mb-6`}>
            <h3 className="text-lg font-medium mb-4">This Week</h3>
            <div className="flex justify-between items-end" style={{ height: '128px' }}>
              {weeklyData.map((day, i) => {
                const maxDuration = Math.max(...weeklyData.map(d => d.duration), 1);
                const barHeight = day.completed && day.duration > 0 ? (day.duration / maxDuration) * 100 : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full px-1">
                    <div className={`w-full max-w-[40px] ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} rounded-t-lg relative`} style={{ height: '100%' }}>
                      {day.completed && (
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500"
                          style={{ height: barHeight > 0 ? `${barHeight}%` : '20%' }}
                        />
                      )}
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>{day.day}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-medium mb-4">Mood Patterns</h3>
            <div className="space-y-3">
              {Object.entries(monthlyMood).map(([moodId, count]) => {
                const moodData = moods.find(m => m.id === moodId);
                const percentage = (count / Object.values(monthlyMood).reduce((a, b) => a + b, 0)) * 100;
                
                return (
                  <div key={moodId}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <span>{moodData?.emoji}</span>
                        <span>{moodData?.label}</span>
                      </span>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentScreen('home')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium">Profile</h1>
            <button onClick={() => setCurrentScreen('settings')}>
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold">{level}</span>
            </div>
            <h2 className="text-2xl font-light mb-1">Level {level} Creator</h2>
            <p className="text-gray-400">{xp} XP • {disciplines.find(d => d.id === selectedDiscipline)?.name}</p>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl p-4 backdrop-blur-xl border transition-all ${
                      achievement.unlocked 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/5 border-white/5 opacity-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${
                      achievement.unlocked ? 'text-yellow-500' : 'text-gray-600'
                    }`} />
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.desc}</p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Prompts */}
          <div>
            <h3 className="text-lg font-medium mb-4">Saved Prompts</h3>
            {savedPrompts.length === 0 ? (
              <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-400 text-sm">No saved prompts yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPrompts.slice(0, 3).map((saved) => (
                  <div key={saved.id} className="rounded-2xl p-4 backdrop-blur-xl bg-white/5 border border-white/10">
                    <p className="text-sm mb-2">{saved.prompt}</p>
                    <p className="text-xs text-gray-400">
                      {moods.find(m => m.id === saved.mood)?.emoji} {saved.date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button onClick={() => setCurrentScreen('profile')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium ml-4">Settings</h1>
          </div>

          {showPreferences === null ? (
            <div className="space-y-6">
              {/* Subscription */}
              <div>
                <h3 className="text-lg font-medium mb-4">Subscription</h3>
                <div className={`rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Free Plan</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Upgrade for unlimited features</p>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <button className={`w-full rounded-xl py-3 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} font-medium transition-all duration-300 hover:scale-105 active:scale-95`}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-4">Preferences</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowPreferences('notifications')}
                    className={`w-full rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">Notifications</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {notificationsEnabled ? `Daily at ${notificationTime}` : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => setShowPreferences('theme')}
                    className={`w-full rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
                      <div className="text-left">
                        <p className="font-medium">Theme</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => setShowPreferences('language')}
                    className={`w-full rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">Language</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {language === 'en' ? 'English' : language === 'es' ? 'Español' : language === 'fr' ? 'Français' : language === 'de' ? 'Deutsch' : language === 'zh' ? '中文' : language === 'ja' ? '日本語' : 'Português'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => setShowPreferences('discipline')}
                    className={`w-full rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">Creative Discipline</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {disciplines.find(d => d.id === selectedDiscipline)?.name || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-lg font-medium mb-4">About</h3>
                <div className={`rounded-2xl p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Origyn v1.0</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>The source of creativity. The starting point of daily practice.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={() => setShowPreferences(null)}
                className="flex items-center gap-2 text-gray-400 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {/* Notifications Settings */}
              {showPreferences === 'notifications' && (
                <div>
                  <h3 className="text-xl font-medium mb-6">Notifications</h3>
                  <div className="space-y-4">
                    <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}>
                      <div>
                        <p className="font-medium">Daily Reminders</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Get reminded to create daily</p>
                      </div>
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`w-12 h-6 rounded-full transition-all ${notificationsEnabled ? 'bg-purple-500' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    
                    {notificationsEnabled && (
                      <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                        <p className="font-medium mb-3">Notification Time</p>
                        <input
                          type="time"
                          value={notificationTime}
                          onChange={(e) => setNotificationTime(e.target.value)}
                          className={`w-full p-3 rounded-xl ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} focus:outline-none`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Theme Settings */}
              {showPreferences === 'theme' && (
                <div>
                  <h3 className="text-xl font-medium mb-6">Theme</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`w-full rounded-2xl p-4 ${theme === 'dark' ? 'bg-white/10 border-2 border-purple-500' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </div>
                      {theme === 'dark' && <CheckCircle className="w-5 h-5 text-purple-500" />}
                    </button>
                    
                    <button
                      onClick={() => setTheme('light')}
                      className={`w-full rounded-2xl p-4 ${theme === 'light' ? 'bg-black/10 border-2 border-purple-500' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5" />
                        <span>Light Mode</span>
                      </div>
                      {theme === 'light' && <CheckCircle className="w-5 h-5 text-purple-500" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Language Settings */}
              {showPreferences === 'language' && (
                <div>
                  <h3 className="text-xl font-medium mb-6">Language</h3>
                  <div className="space-y-3">
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'es', name: 'Español' },
                      { code: 'fr', name: 'Français' },
                      { code: 'de', name: 'Deutsch' },
                      { code: 'zh', name: '中文' },
                      { code: 'ja', name: '日本語' },
                      { code: 'pt', name: 'Português' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full rounded-2xl p-4 ${language === lang.code ? (theme === 'dark' ? 'bg-white/10' : 'bg-black/10') + ' border-2 border-purple-500' : theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} flex items-center justify-between`}
                      >
                        <span>{lang.name}</span>
                        {language === lang.code && <CheckCircle className="w-5 h-5 text-purple-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Discipline Settings */}
              {showPreferences === 'discipline' && (
                <div>
                  <h3 className="text-xl font-medium mb-6">Creative Discipline</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Switch your primary creative focus</p>
                  <div className="grid grid-cols-2 gap-4">
                    {disciplines.map((discipline) => {
                      const Icon = discipline.icon;
                      return (
                        <button
                          key={discipline.id}
                          onClick={() => {
                            setSelectedDiscipline(discipline.id);
                            // Generate new prompt for new discipline
                            const newPrompt = generateAIPrompt(discipline.id, mood);
                            setDailyPrompt(newPrompt);
                            setShowPreferences(null);
                          }}
                          className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl ${selectedDiscipline === discipline.id ? 'border-2 border-purple-500' : ''} ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} transition-all duration-300 hover:scale-105 active:scale-95`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${discipline.color} opacity-20`} />
                          <Icon className="w-8 h-8 mb-3 relative z-10" />
                          <p className="text-lg font-medium relative z-10">{discipline.name}</p>
                          {selectedDiscipline === discipline.id && (
                            <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-purple-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBottomNav = () => {
    if (['onboarding', 'creating', 'completion', 'muse', 'settings'].includes(currentScreen)) return null;

    return (
      <div className={`fixed bottom-0 left-0 right-0 p-4 ${theme === 'dark' ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex justify-around max-w-md mx-auto">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`p-3 ${currentScreen === 'home' ? (theme === 'dark' ? 'text-white' : 'text-black') : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentScreen('journal')}
            className={`p-3 ${currentScreen === 'journal' ? (theme === 'dark' ? 'text-white' : 'text-black') : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button 
            onClick={startCreation}
            className={`p-3 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}
          >
            <Plus className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentScreen('analytics')}
            className={`p-3 ${currentScreen === 'analytics' ? (theme === 'dark' ? 'text-white' : 'text-black') : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <BarChart3 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className={`p-3 ${currentScreen === 'profile' ? (theme === 'dark' ? 'text-white' : 'text-black') : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const screens = {
    onboarding: renderOnboarding,
    home: renderHome,
    creating: renderCreating,
    completion: renderCompletion,
    journal: renderJournal,
    muse: renderMuse,
    analytics: renderAnalytics,
    profile: renderProfile,
    settings: renderSettings
  };

  return (
    <div className={`max-w-md mx-auto ${theme === 'dark' ? 'bg-black' : 'bg-white'} min-h-screen relative`}>
      {screens[currentScreen]?.()}
      {renderBottomNav()}
    </div>
  );
};

export default OrigynApp;