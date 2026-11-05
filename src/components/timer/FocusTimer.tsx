import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CloudRain,
  Radio,
  Compass,
  Wind,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FocusTimer: React.FC = () => {
  const {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimerEarly,
    cancelTimer,
    setTimerAmbientSound,
    workspaces,
    tasks,
  } = useApp();

  const [customMinutes, setCustomMinutes] = useState('50');
  const [selectedWsId, setSelectedWsId] = useState(timer.workspaceId || workspaces[0]?.id || 'ws-photoshop');
  const [selectedTaskId, setSelectedTaskId] = useState(timer.taskId || '');
  const [isZenMode, setIsZenMode] = useState(false);

  // Calculate times
  const totalSeconds = timer.durationSeconds || 25 * 60;
  const remainingSeconds = timer.remainingSeconds;
  const elapsedSeconds = totalSeconds - remainingSeconds;

  const minutesRemaining = Math.floor(remainingSeconds / 60);
  const secondsRemaining = remainingSeconds % 60;

  const minutesElapsed = Math.floor(elapsedSeconds / 60);
  const secondsElapsed = elapsedSeconds % 60;

  // Circular progress SVG calculations
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  const strokeDashoffset = circumference - (1 - progressRatio) * circumference;

  const currentWorkspace = workspaces.find(w => w.id === (timer.workspaceId || selectedWsId));
  const activeColor = currentWorkspace?.color || '#8B5CF6';

  const presets = [25, 45, 60, 90];

  const handleStartPreset = (mins: number) => {
    const boundTask = tasks.find(t => t.id === selectedTaskId);
    startTimer(mins, selectedWsId, selectedTaskId, boundTask?.title);
  };

  const handleStartCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 240) {
      const boundTask = tasks.find(t => t.id === selectedTaskId);
      startTimer(val, selectedWsId, selectedTaskId, boundTask?.title);
    }
  };

  const ambientSoundOptions: Array<{
    id: 'none' | 'whitenoise' | 'rain' | 'binaural' | 'cosmic';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'none', label: 'Mute', icon: VolumeX },
    { id: 'whitenoise', label: 'White Noise', icon: Wind },
    { id: 'rain', label: 'Zen Rain', icon: CloudRain },
    { id: 'binaural', label: 'Binaural Alpha', icon: Radio },
    { id: 'cosmic', label: 'Cosmic Drone', icon: Compass },
  ];

  return (
    <div className={`space-y-6 ${isZenMode ? 'fixed inset-0 z-50 bg-[#080810] p-8 flex flex-col justify-center items-center overflow-y-auto' : 'pb-12'}`}>
      {/* Top Banner / Workspace Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quantum Focus Timer</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ACCURATE TIMESTAMPS
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Flow-state pomodoro engine with synchronized audio synthesis
          </p>
        </div>

        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="self-start sm:self-center flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors"
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isZenMode ? 'Exit Zen Mode' : 'Zen Focus Mode'}</span>
        </button>
      </div>

      {/* Main Glassmorphic Timer Card */}
      <div className="relative w-full max-w-4xl mx-auto rounded-3xl glass-panel-glow border border-purple-500/30 p-6 sm:p-10 flex flex-col items-center shadow-2xl overflow-hidden">
        {/* Ambient background glows */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeColor }}
        />

        {/* Workspace & Task selector header */}
        <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 z-10">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Active Workspace
            </label>
            <select
              value={timer.status !== 'idle' ? timer.workspaceId : selectedWsId}
              disabled={timer.status !== 'idle'}
              onChange={e => setSelectedWsId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white disabled:opacity-60 cursor-pointer"
            >
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id} className="bg-[#0f0f1c] text-white">
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Bound Task (Optional)
            </label>
            <select
              value={timer.status !== 'idle' ? timer.taskId || '' : selectedTaskId}
              disabled={timer.status !== 'idle'}
              onChange={e => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white disabled:opacity-60 cursor-pointer"
            >
              <option value="" className="bg-[#0f0f1c] text-gray-400">
                None (General Session)
              </option>
              {tasks
                .filter(t => t.status !== 'completed')
                .map(t => (
                  <option key={t.id} value={t.id} className="bg-[#0f0f1c] text-white">
                    {t.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Circular Progress Display */}
        <div className="relative flex items-center justify-center my-2 z-10">
          <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="text-white/5"
              strokeWidth="14"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={activeColor}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
                filter: `drop-shadow(0 0 12px ${activeColor}80)`,
              }}
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1"
              style={{ backgroundColor: `${activeColor}25`, color: activeColor }}
            >
              {currentWorkspace?.name || 'Focus Session'}
            </span>

            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-lg">
              {String(minutesRemaining).padStart(2, '0')}:{String(secondsRemaining).padStart(2, '0')}
            </div>

            <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-gray-400">
              <span>Elapsed: {String(minutesElapsed).padStart(2, '0')}:{String(secondsElapsed).padStart(2, '0')}</span>
              <span>•</span>
              <span className="capitalize">{timer.status}</span>
            </div>

            {timer.taskName && (
              <p className="mt-2 text-xs text-purple-300 font-medium max-w-[200px] truncate">
                {timer.taskName}
              </p>
            )}
          </div>
        </div>

        {/* Timer Main Controls */}
        <div className="flex items-center gap-3 mt-8 z-10">
          {timer.status === 'idle' && (
            <button
              onClick={() => handleStartPreset(25)}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Session</span>
            </button>
          )}

          {timer.status === 'running' && (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-base shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-black" />
              <span>Pause</span>
            </button>
          )}

          {timer.status === 'paused' && (
            <button
              onClick={resumeTimer}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Resume</span>
            </button>
          )}

          {timer.status !== 'idle' && (
            <>
              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={completeTimerEarly}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                title="Mark Finished & Log XP"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Early</span>
              </button>

              <button
                onClick={cancelTimer}
                className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                title="Cancel Session"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Preset Duration Buttons */}
        {timer.status === 'idle' && (
          <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col items-center gap-4 z-10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Duration Presets
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {presets.map(mins => (
                <button
                  key={mins}
                  onClick={() => handleStartPreset(mins)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-xs font-bold text-gray-200 hover:text-white transition-all font-mono"
                >
                  {mins} min
                </button>
              ))}

              {/* Custom Input */}
              <form onSubmit={handleStartCustom} className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="240"
                  value={customMinutes}
                  onChange={e => setCustomMinutes(e.target.value)}
                  className="w-16 px-2.5 py-1.5 rounded-xl glass-input text-xs text-center font-mono text-white"
                  placeholder="Custom"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 transition-colors"
                >
                  Set
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Procedural Ambient Sound Generator */}
        <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col items-center gap-3 z-10">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Procedural Soundscapes (Live Web Audio)</span>
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {ambientSoundOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = timer.ambientSound === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTimerAmbientSound(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/25'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
