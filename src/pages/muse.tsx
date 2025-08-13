import React, { type FC, useEffect, useRef } from 'react';

import { Send, Sparkles } from 'lucide-react';

import { useOrigyn } from '@/hooks/useOrigyn';
import { getTranslatedText } from '@/lib/translations';

interface MuseMessage {
  type: 'user' | 'muse';
  message: string;
}

export const MuseScreen: FC = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const {
    museMessages,
    isMuseTyping,
    userMessage,
    setUserMessage,
    sendMuseMessage,
    user,
    language,
    theme,
    currentScreen,
  } = useOrigyn();

  const t = (englishText: string): string => {
    const currentLang = user?.language || language;
    const translated = getTranslatedText(englishText, currentLang);
    return translated;
  };

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

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [museMessages]);

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      } flex flex-col relative z-10 prevent-scroll screen-transition main-container prevent-overscroll`}
    >
      <BackgroundGradients />

      {/* Header */}
      <div className="text-center p-6 pt-12">
        <h1 className="text-xl font-semibold">Your Muse</h1>
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Creative companion
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto pb-32 smooth-scroll">
        <div className="space-y-4">
          {museMessages.map((message: any, index: number) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'muse' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : theme === 'dark'
                    ? 'bg-white/10'
                    : 'bg-black/10'
                }`}
              >
                <p className="leading-relaxed">{message.message}</p>
              </div>
            </div>
          ))}

          {isMuseTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
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
            onChange={e => setUserMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMuseMessage()}
            placeholder={t('Share your thoughts...')}
            className={`flex-1 px-4 py-3 rounded-2xl ${
              theme === 'dark'
                ? 'bg-white/10 placeholder:text-gray-500'
                : 'bg-black/10 placeholder:text-gray-400'
            } outline-none border-0`}
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
    </div>
  );
};
