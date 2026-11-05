import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Play,
  Pause,
  Clock,
  Menu,
  Shield,
  Bot,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenAuth }) => {
  const {
    timer,
    pauseTimer,
    resumeTimer,
    setActivePage,
    userStats,
    userSettings,
    isAuthenticated,
    workspaces,
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTimerDigits = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeWs = workspaces.find(w => w.id === timer.workspaceId);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/15 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-purple-400/20 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300">
                  FOCUSLY
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PRO
                </span>
              </div>
              <p className="hidden sm:block text-[9px] font-semibold tracking-widest text-purple-400/80 uppercase">
                FOCUS BEYOND LIMITS
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Running Timer Pill if Active */}
        <div className="hidden md:flex items-center gap-3">
          {timer.status !== 'idle' ? (
            <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl glass-panel-glow border border-purple-500/30 animate-pulse-subtle">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeWs?.color || '#8B5CF6' }}
              />
              <span className="text-xs font-semibold text-gray-200 truncate max-w-[120px]">
                {activeWs?.name || 'Focus Session'}
              </span>
              <span className="font-mono text-sm font-bold text-purple-300">
                {formatTimerDigits(timer.remainingSeconds)}
              </span>
              <button
                onClick={timer.status === 'running' ? pauseTimer : resumeTimer}
                className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-600/30 transition-colors"
                title={timer.status === 'running' ? 'Pause' : 'Resume'}
              >
                {timer.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setActivePage('timer')}
                className="text-[11px] text-purple-400 hover:text-purple-200 underline ml-1"
              >
                Open
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-gray-600">•</span>
              <span className="font-mono text-gray-200">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        {/* Right: Gamification Badges, AI Launcher & User status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Level Badge */}
          <button
            onClick={() => setActivePage('achievements')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-purple-300 transition-colors"
            title="XP & Level Progress"
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold font-mono">Lv.{userStats.level}</span>
          </button>

          {/* Streak Counter */}
          <button
            onClick={() => setActivePage('achievements')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-300 transition-colors"
            title="Daily Streak"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            <span className="text-xs font-bold font-mono">{userStats.streakDays}d</span>
          </button>

          {/* FOCUS AI Voice Assistant Quick Button */}
          <button
            onClick={() => setActivePage('voice')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-violet-600/80 hover:from-purple-600 hover:to-violet-600 text-white font-medium text-xs border border-purple-400/30 shadow-md shadow-purple-600/20 transition-all group"
          >
            <Bot className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">FOCUS AI</span>
          </button>

          {/* Cloud Sync / Profile Status */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isAuthenticated
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
            title={isAuthenticated ? 'Cloud Sync Active' : 'Guest Mode (Click to Sync)'}
          >
            <Shield className={`w-3.5 h-3.5 ${isAuthenticated ? 'text-emerald-400' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">{isAuthenticated ? 'Synced' : 'Guest'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
