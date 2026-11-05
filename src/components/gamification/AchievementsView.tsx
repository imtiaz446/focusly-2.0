import React from 'react';
import {
  Award,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  Target,
  Clock,
  Grid,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Achievement, Challenge } from '../../types';

export const AchievementsView: React.FC = () => {
  const {
    userStats,
    achievements,
    challenges,
    claimChallengeReward,
  } = useApp();

  const currentLevel = userStats.level;
  const xpCurrent = userStats.xp % 500;
  const xpToNext = 500 - xpCurrent;
  const xpPct = Math.min(100, Math.round((xpCurrent / 500) * 100));

  // Determine Level Title
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 10) return 'Transcendent Focus Master';
    if (lvl >= 7) return 'Cosmic Flow State Polymath';
    if (lvl >= 5) return 'Hyperfocus Architect';
    if (lvl >= 3) return 'Deep Work Specialist';
    return 'Flow State Apprentice';
  };

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gamification & Mastery</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              LEVEL {currentLevel}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Level up through deep work, complete daily challenges, and unlock achievement badges
          </p>
        </div>
      </div>

      {/* Main Hero Card: Level Progress & Streak */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow border border-purple-500/30 p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 via-violet-600 to-indigo-500 shadow-xl shadow-purple-600/30">
              <Trophy className="w-10 h-10 text-white" />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold font-mono">
                LVL {currentLevel}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Current Title
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {getLevelTitle(currentLevel)}
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Total XP: <span className="font-mono text-purple-300 font-bold">{userStats.xp.toLocaleString()} XP</span>
              </p>
            </div>
          </div>

          {/* Streak Flame Box */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <Flame className="w-8 h-8 text-amber-400 fill-amber-400/30" />
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {userStats.streakDays} Days
              </div>
              <p className="text-[11px] text-gray-300">Continuous Daily Focus Streak</p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
            <span>Progress to Level {currentLevel + 1}</span>
            <span className="font-mono text-purple-300">{xpToNext} XP needed</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-400 rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>{xpCurrent} / 500 XP</span>
            <span>{xpPct}% Complete</span>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <span>Active Quests & Challenges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map(ch => {
            const isCompleted = ch.completed;
            const isClaimed = ch.xpReward === 0;
            const pct = Math.min(100, Math.round((ch.currentCount / ch.targetCount) * 100));

            return (
              <div
                key={ch.id}
                className="rounded-2xl glass-panel border border-white/5 p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-white/5 text-purple-300">
                      {ch.type} Quest
                    </span>
                    {!isClaimed && (
                      <span className="font-mono text-amber-400 font-bold">
                        +{ch.xpReward} XP
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{ch.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{ch.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-gray-400">
                      <span>Progress</span>
                      <span>{ch.currentCount}/{ch.targetCount}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {isCompleted ? (
                    isClaimed ? (
                      <div className="py-2 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        Claimed ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => claimChallengeReward(ch.id)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 fill-black" />
                        <span>Claim {ch.xpReward} XP</span>
                      </button>
                    )
                  ) : (
                    <div className="py-2 text-center text-[11px] text-gray-500 font-mono">
                      In Progress ({pct}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Achievement Badges</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">
            {unlockedCount} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <div
                key={ach.id}
                className={`rounded-2xl glass-panel border p-5 flex items-start gap-4 transition-all ${
                  isUnlocked
                    ? 'border-purple-500/30 bg-purple-900/[0.08]'
                    : 'border-white/5 opacity-55'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-600/20'
                      : 'bg-white/5 text-gray-500 border border-white/5'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{ach.description}</p>
                  {isUnlocked && ach.unlockedAt && (
                    <p className="text-[10px] text-purple-400 font-mono pt-1">
                      Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
