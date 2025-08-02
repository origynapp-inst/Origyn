import {
  useEffect,
  useState,
} from 'react';

import {
  Clock,
  FileText,
  Music,
  Video,
} from 'lucide-react';

import { useOrigyn } from '@/hooks/useOrigyn';
import { getTranslatedText } from '@/lib/translations';

interface JournalProps {
  onBack: () => void;
}

export default function Journal({ onBack }: JournalProps) {
  // Remove unused variable warning
  void onBack;
  const { journalEntries, theme, user } = useOrigyn();
  
  // Debug: Log journal entries to see their structure
  console.log('Journal entries:', journalEntries);
  console.log('Entries with files:', journalEntries.filter(entry => entry.fileUrl));
  console.log('Journal entries length:', journalEntries.length);
  const localStorageData = localStorage.getItem('origyn_journal_entries');
  console.log('LocalStorage journal entries RAW:', localStorageData);
  if (localStorageData) {
    try {
      const parsed = JSON.parse(localStorageData);
      console.log('LocalStorage journal entries PARSED:', parsed);
      console.log('LocalStorage entries count:', parsed.length);
      console.log('Sample entry structure:', parsed[0]);
    } catch (e) {
      console.log('LocalStorage parsing error:', e);
    }
  }
  
  // Force re-render when entries change
  const [forceRender, setForceRender] = useState(0);
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [journalEntries]);
  
  // Translation helper
  const t = (text: string) => getTranslatedText(text, user?.language || 'en');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // const getFileIcon = (fileUrl: string) => {
  //   const extension = fileUrl.split('.').pop()?.toLowerCase();
  //   switch (extension) {
  //     case 'jpg':
  //     case 'jpeg':
  //     case 'png':
  //     case 'gif':
  //     case 'webp':
  //       return Image;
  //     case 'mp3':
  //     case 'wav':
  //     case 'ogg':
  //     case 'm4a':
  //       return Music;
  //     case 'mp4':
  //     case 'avi':
  //     case 'mov':
  //     case 'wmv':
  //       return Video;
  //     default:
  //       return FileText;
  //   }
  // };

  const isImageFile = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  const isAudioFile = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    console.log('Checking audio file:', fileUrl, 'Extension:', extension);
    const result = ['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '');
    console.log('isAudioFile result:', result);
    return result;
  };

  const isVideoFile = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv'].includes(extension || '');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="text-center p-6 pt-12">
        <h1 className="text-xl font-semibold">{t("Creative Journal")}</h1>
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {journalEntries.length} {t("entries")}
        </span>
      </div>

      {/* Journal Entries */}
      <div className="px-6 space-y-4 pb-24">
        {/* Debug info */}
        <div className="text-xs text-gray-500 mb-4">
          DEBUG: Entries count: {journalEntries.length} | LocalStorage: {localStorage.getItem('origyn_journal_entries') ? 'has data' : 'empty'}
        </div>
        
        {/* LocalStorage raw data */}
        <div className="text-xs text-orange-500 mb-4 max-w-full break-words">
          LocalStorage raw: {JSON.stringify(localStorage.getItem('origyn_journal_entries')?.substring(0, 200))}...
        </div>
        
        {/* Manual test of audio detection */}
        <div className="text-xs text-purple-500 mb-4">
          Manual test: isAudioFile('/uploads/1751941075212-262359333.mp3') = {isAudioFile('/uploads/1751941075212-262359333.mp3').toString()}
        </div>
        
        {/* Force render indicator */}
        <div className="text-xs text-green-500 mb-2">
          Render count: {forceRender} | Entries to display: {journalEntries.length}
        </div>
        
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
            .map((entry: any) => (
              <div 
                key={entry.id}
                className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
              >
                {/* Entry Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{formatDate(entry.date)}</h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTime(entry.duration)}
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

                {/* Uploaded File */}
                {entry.fileUrl && (
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} mb-4`}>
                    <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t("Uploaded Creation")}
                    </h4>
                    <div className="text-xs text-gray-500 mb-2">File: {entry.fileUrl}</div>
                    <div className="text-xs text-blue-500 mb-2">Debug: File URL exists = {!!entry.fileUrl}</div>
                    <div className="text-xs text-red-500 mb-2">
                      isAudioFile result: {isAudioFile(entry.fileUrl).toString()} | 
                      Extension: {entry.fileUrl.split('.').pop()?.toLowerCase()}
                    </div>
                    <button 
                      onClick={() => window.open(entry.fileUrl || '', '_blank')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-2"
                    >
                      Test: Open File Directly
                    </button>
                    
                    {/* Image Display */}
                    {isImageFile(entry.fileUrl) && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={entry.fileUrl} 
                          alt="Uploaded creation" 
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Audio Player */}
                    {isAudioFile(entry.fileUrl) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          <span className="text-sm">{t("Audio Recording")}</span>
                        </div>
                        <div className="text-xs text-green-500 mb-2">DEBUG: Audio file detected: {entry.fileUrl}</div>
                        <audio controls className="w-full" preload="none">
                          <source src={entry.fileUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        <div className="text-xs text-blue-500">
                          <a href={entry.fileUrl} target="_blank" rel="noopener noreferrer">Open audio file directly</a>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {isVideoFile(entry.fileUrl) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span className="text-sm">{t("Video Recording")}</span>
                        </div>
                        <video controls className="w-full rounded-lg max-h-64">
                          <source src={entry.fileUrl} />
                          Your browser does not support the video element.
                        </video>
                      </div>
                    )}
                    
                    {/* Other File Types */}
                    {!isImageFile(entry.fileUrl) && !isAudioFile(entry.fileUrl) && !isVideoFile(entry.fileUrl) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{t("Uploaded File")}</span>
                        </div>
                        <a 
                          href={entry.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-block px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
                        >
                          {t("View File")}
                        </a>
                      </div>
                    )}
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
}