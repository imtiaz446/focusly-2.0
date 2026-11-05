import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Zap,
  Play,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Languages,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VoiceAssistant: React.FC = () => {
  const {
    aiMessages,
    isAILoading,
    sendAIMessage,
    clearAIMessages,
    userSettings,
    bengaliExplanationMode,
    setBengaliExplanationMode,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speechLang, setSpeechLang] = useState<'bn' | 'en'>('bn');
  const [promptCategory, setPromptCategory] = useState<'bn' | 'banglish' | 'en'>('bn');
  const [showBengaliGuide, setShowBengaliGuide] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API for voice input if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLang === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendAIMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission blocked. Please enable in browser settings.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Monitor speech synthesis
    const checkSpeaking = setInterval(() => {
      if ('speechSynthesis' in window) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 200);

    return () => clearInterval(checkSpeaking);
  }, [sendAIMessage, speechLang]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAILoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = speechLang === 'bn' ? 'bn-BD' : 'en-US';
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAILoading) return;
    sendAIMessage(inputQuery.trim());
    setInputQuery('');
  };

  const bengaliPrompts = [
    { label: 'Photoshop এ একটা টাস্ক বানাও', query: 'Photoshop এ একটা টাস্ক বানাও' },
    { label: '৪৫ মিনিটের ফোকাস সেশন শুরু করো', query: '৪৫ মিনিটের ফোকাস সেশন শুরু করো' },
    { label: 'আজকে আমি কতক্ষণ কাজ করেছি?', query: 'আজকে আমি কতক্ষণ কাজ করেছি?' },
    { label: 'আমার পেন্ডিং কাজগুলো দেখাও', query: 'আমার পেন্ডিং কাজগুলো দেখাও' },
    { label: 'কালকের জন্য রুটিন প্ল্যান করো', query: 'কালকের জন্য রুটিন প্ল্যান করো' },
  ];

  const banglishPrompts = [
    { label: 'Photoshop e ekta task banao', query: 'Photoshop e ekta task banao' },
    { label: '45 min focus session shuru koro', query: '45 min focus session shuru koro' },
    { label: 'ajke ami koto shomoy kaj korechi?', query: 'ajke ami koto shomoy kaj korechi?' },
    { label: 'amar pending task gulo dekhao', query: 'amar pending task gulo dekhao' },
    { label: 'kalker schedule plan koro', query: 'kalker schedule plan koro' },
  ];

  const englishPrompts = [
    { label: 'Create a Photoshop task', query: 'Create a Photoshop task' },
    { label: 'Start a 45-minute focus session', query: 'Start a 45-minute focus session' },
    { label: 'How much time did I work today?', query: 'How much time did I work today?' },
    { label: 'Show my pending tasks', query: 'Show my pending tasks' },
    { label: 'Plan my work for tomorrow', query: 'Plan my work for tomorrow' },
  ];

  const activePromptList =
    promptCategory === 'bn' ? bengaliPrompts : promptCategory === 'banglish' ? banglishPrompts : englishPrompts;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">FOCUS AI Voice Assistant</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              BENGALI & BANGLISH ENABLED
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Voice-enabled productivity intelligence. Speaks & understands Bengali (বাংলা), Banglish, and English.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bengali Explanation Mode Toggle */}
          <button
            onClick={() => setBengaliExplanationMode(!bengaliExplanationMode)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              bengaliExplanationMode
                ? 'bg-purple-600/30 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-600/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Bengali Explanation Mode for AI responses and instructions"
          >
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span>বাংলা ব্যাখ্যা মোড:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                bengaliExplanationMode ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {bengaliExplanationMode ? 'চালু' : 'বন্ধ'}
            </span>
          </button>

          {/* Bengali Guide Accordion Toggle */}
          <button
            onClick={() => setShowBengaliGuide(!showBengaliGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-xs text-purple-300 hover:text-purple-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ব্যবহার সহায়িকা</span>
            {showBengaliGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={clearAIMessages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Bengali Explanation Mode Banner if Active */}
      {bengaliExplanationMode && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              <strong>বাংলা ব্যাখ্যা মোড সক্রিয়:</strong> FOCUS AI আপনার প্রতিটি প্রশ্নের সহজ ও বিস্তারিত ব্যাখ্যা বাংলায় প্রদান করবে।
            </span>
          </div>
          <span className="text-[10px] text-purple-400 hidden sm:inline">Bangla & Banglish Supported</span>
        </div>
      )}

      {/* Expandable Bengali User Guide Panel */}
      <AnimatePresence>
        {showBengaliGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-3xl glass-panel border border-purple-500/30 p-6 space-y-5 bg-gradient-to-br from-purple-950/30 via-black/40 to-indigo-950/20">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">FOCUSLY ব্যবহার নির্দেশিকা ও ফিচার পরিচিতি</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>1. ড্যাশবোর্ড (Dashboard)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    আপনার সারাদিনের ফোকাস টাইম, সম্পূর্ণ করা টাস্কের সংখ্যা এবং সাপ্তাহিক কাজের পরিসংখ্যান একনজরে দেখার কেন্দ্রীয় ড্যাশবোর্ড।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>2. ফোকাস টাইমার (Focus Timer)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    ২৫, ৪৫, ৬০ বা ৯০ মিনিটের পমোডোরো সেশন পরিচালনা করুন। টাইমস্ট্যাম্প ভিত্তিক নিখুঁত গণনা এবং জেন সাউন্ডস্কেপ (White Noise, Rain, Binaural Beats) সংযুক্ত।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>3. মাই ওয়ার্কস্পেস (My Workspace)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Photoshop, Illustrator, Premiere Pro এবং After Effects সহ ১০টি ডিফল্ট সফটওয়্যার ক্যাটাগরি রয়েছে। প্রতিটি ওয়ার্কস্পেসে কাজের সময় আলাদাভাবে ট্র্যাক হয়।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>4. টাস্ক ও প্রজেক্ট ম্যানেজার (Tasks & Projects)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    টাস্ক তৈরি করুন, সাব-টাস্ক যুক্ত করুন এবং কানবান (Kanban) বোর্ডে ড্র্যাগ/মুভ করে কাজের গতি পর্যবেক্ষণ করুন।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>5. এআই ভয়েস অ্যাসিস্ট্যান্ট (FOCUS AI)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    বাংলা ও বাংলিশে ভয়েস কমান্ড দিন। যেমন: "৪৫ মিনিটের সেশন শুরু করো", "Photoshop এ টাস্ক বানাও", "আজকে কতক্ষণ কাজ করেছি?"।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center gap-2">
                    <span>6. অ্যানালিটিক্স ও অর্জন (Analytics & XP)</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    প্রতিটি সেশন সফলভাবে শেষ করলে XP পয়েন্ট ও লেভেল বাড়ে। ডেটা ব্যাকআপ ও Supabase ক্লাউড সিঙ্ক ফিচার রয়েছে।
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Voice Orb & Status Card */}
      <div className="relative rounded-3xl glass-panel-glow border border-purple-500/30 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Ambient radial blur */}
        <div className="absolute w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Dynamic Glowing Particle Voice Orb */}
        <div className="relative flex items-center justify-center my-4">
          {/* Animated concentric rings */}
          <div
            className={`absolute w-44 h-44 rounded-full border border-purple-500/20 transition-all duration-700 ${
              isListening ? 'scale-125 animate-ping opacity-30 border-purple-400' : isSpeaking ? 'scale-115 animate-pulse border-indigo-400' : 'opacity-40'
            }`}
          />
          <div
            className={`absolute w-36 h-36 rounded-full border border-purple-500/40 transition-all duration-500 ${
              isListening ? 'scale-110 border-purple-300' : isSpeaking ? 'scale-105 border-indigo-300' : 'opacity-60'
            }`}
          />

          {/* Central Glowing Core Orb */}
          <motion.div
            animate={{
              scale: isListening ? [1, 1.15, 1] : isSpeaking ? [1, 1.08, 0.98, 1] : [1, 1.04, 1],
              boxShadow: isListening
                ? '0 0 50px rgba(168, 85, 247, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.5)'
                : isSpeaking
                ? '0 0 45px rgba(99, 102, 241, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4)'
                : '0 0 30px rgba(139, 92, 246, 0.35)',
            }}
            transition={{ repeat: Infinity, duration: isListening ? 1.2 : 2.5, ease: 'easeInOut' }}
            className={`w-28 h-28 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors ${
              isListening
                ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500'
                : isSpeaking
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500'
                : 'bg-gradient-to-tr from-purple-800 via-purple-600 to-indigo-700'
            }`}
            onClick={toggleListening}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Bot className="w-10 h-10 text-white" />
            )}
          </motion.div>
        </div>

        {/* State Label & Voice Waveform */}
        <div className="z-10 mt-3 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-semibold">
            {isListening ? (
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Listening to your command...
              </span>
            ) : isAILoading ? (
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Gemini is synthesizing thoughts...
              </span>
            ) : isSpeaking ? (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Volume2 className="w-3.5 h-3.5" />
                Speaking response...
              </span>
            ) : (
              <span className="text-gray-400">Click Orb or Microphone to Speak</span>
            )}
          </div>

          {/* Audio Waveform simulation bars */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center gap-1 h-6">
              {[40, 70, 100, 60, 90, 45, 80, 50, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-purple-400 rounded-full animate-pulse"
                  style={{
                    height: `${(h / 100) * 24}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {voiceError && (
            <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{voiceError}</span>
            </p>
          )}

          {/* Action buttons (Mute/Stop speech) */}
          {isSpeaking && (
            <button
              onClick={handleStopSpeaking}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs border border-red-500/30 transition-colors"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Speaking</span>
            </button>
          )}
        </div>

        {/* Speech Recognition Language Selector & Prompt Categories */}
        <div className="mt-6 pt-4 border-t border-white/5 w-full flex flex-col items-center gap-3 z-10">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Mic Language:</span>
            <button
              type="button"
              onClick={() => setSpeechLang('bn')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                speechLang === 'bn'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              বাংলা / Banglish (bn-BD)
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang('en')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                speechLang === 'en'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              English (en-US)
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setPromptCategory('bn')}
              className={`px-3 py-1 rounded-lg transition-all ${
                promptCategory === 'bn' ? 'bg-purple-600/40 text-purple-200 border border-purple-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              বাংলা Prompts
            </button>
            <button
              type="button"
              onClick={() => setPromptCategory('banglish')}
              className={`px-3 py-1 rounded-lg transition-all ${
                promptCategory === 'banglish' ? 'bg-purple-600/40 text-purple-200 border border-purple-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Banglish Prompts
            </button>
            <button
              type="button"
              onClick={() => setPromptCategory('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                promptCategory === 'en' ? 'bg-purple-600/40 text-purple-200 border border-purple-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              English Prompts
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            {activePromptList.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendAIMessage(p.query)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-xs text-gray-200 hover:text-white transition-all text-left shadow-sm"
              >
                "{p.label}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Conversation Stream
        </h3>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {aiMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-purple-600/30 border border-purple-500/40 text-white rounded-tr-none'
                      : 'bg-white/[0.03] border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Actions summary if executed */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-1">
                      {msg.actions.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] text-purple-300 font-mono bg-purple-500/10 px-2 py-1 rounded-lg"
                        >
                          <Zap className="w-3 h-3 text-purple-400" />
                          <span>Action Triggered: {act.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow up suggestions */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((followUp, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendAIMessage(followUp)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/20"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isAILoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-purple-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>FOCUS AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleTextSubmit} className="pt-4 border-t border-white/5 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Type a request (e.g. 'Start a 30-min timer on Premiere Pro')..."
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white"
            disabled={isAILoading}
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-purple-300'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isAILoading}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
