import React from 'react';

import { Clock } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  duration: number;
  prompt: string;
  creation?: string;
  reflection?: string;
}

interface JournalScreenProps {
  theme: string;
  t: (text: string) => string;
  setCurrentScreen: (screen: string) => void;
  currentScreen: string;
  journalEntries: JournalEntry[];
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  theme,
  t,
  setCurrentScreen,
  currentScreen,
  journalEntries,
}) => {
  // Background gradients for Apple Liquid Glass design
  const BackgroundGradients = () => (
    <>
      <div className={`fixed inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-purple-900/20 via-black to-pink-900/20' : 'from-purple-100/20 via-white to-pink-100/20'} -z-10`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl ${theme === 'dark' ? 'from-blue-900/10 via-transparent to-purple-900/10' : 'from-blue-100/10 via-transparent to-purple-100/10'} -z-10`}></div>
    </>
  );

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
    </div>
  );
};
