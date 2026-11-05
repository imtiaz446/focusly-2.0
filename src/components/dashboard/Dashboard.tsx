import React from 'react';
import { motion } from 'motion/react';
import {
  Timer,
  CheckCircle2,
  Target,
  FolderKanban,
  Play,
  Plus,
  Bot,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Clock,
  Briefcase,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const {
    userSettings,
    userStats,
    todayFocusMinutes,
    todayCompletedTasksCount,
    dailyGoalProgressPct,
    workspaces,
    projects,
    tasks,
    sessions,
    startTimer,
    setActivePage,
  } = useApp();

  // Personalized Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Compute Weekly Productivity data for Recharts (last 7 days)
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      const dayMinutes = sessions
        .filter(s => s.completedAt.startsWith(dateStr))
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      result.push({
        day: i === 0 ? 'Today' : dayName,
        minutes: dayMinutes,
        hours: Number((dayMinutes / 60).toFixed(1)),
      });
    }
    return result;
  };

  const weeklyData = getWeeklyData();
  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);
  const recentSessions = sessions.slice(0, 4);

  const formatHoursMins = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Futuristic Glow */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-8 border border-purple-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hyperfocus Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">{userSettings.userName}</span>
            </h1>
            <p className="text-sm text-gray-300">
              Your focus momentum is primed. You’re on a <span className="text-amber-400 font-bold">{userStats.streakDays}-day streak</span> with {dailyGoalProgressPct}% of today's target achieved.
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                startTimer(25);
                setActivePage('timer');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 25m Timer</span>
            </button>

            <button
              onClick={() => setActivePage('tasks')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>New Task</span>
            </button>

            <button
              onClick={() => setActivePage('voice')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium text-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today Focus */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-medium">Daily Focus Time</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatHoursMins(todayFocusMinutes)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Deep Work</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-medium">Tasks Completed Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {todayCompletedTasksCount}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {tasks.filter(t => t.status !== 'completed').length} pending in backlog
            </p>
          </div>
        </div>

        {/* Metric 3: Daily Goal Progress */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-medium">Daily Goal Target</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white font-mono">{dailyGoalProgressPct}%</span>
              <span className="text-xs text-gray-400 font-mono">
                {todayFocusMinutes}/{userSettings.dailyGoalMinutes}m
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-700"
                style={{ width: `${dailyGoalProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Streak & XP */}
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-medium">Streak & Level</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{userStats.streakDays} Days</span>
              <span className="text-xs font-bold text-purple-300 font-mono">Lv.{userStats.level}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 font-mono">
              Total XP: {userStats.xp.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Chart + Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Chart (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Weekly Productivity Velocity</span>
              </h2>
              <p className="text-xs text-gray-400">Focus hours recorded across all workspaces</p>
            </div>
            <button
              onClick={() => setActivePage('analytics')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              <span>View Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  unit="h"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 15, 28, 0.95)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} hours`, 'Focus Time']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects (1 column) */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-purple-400" />
                <span>Active Projects</span>
              </h2>
              <button
                onClick={() => setActivePage('projects')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                All Projects
              </button>
            </div>

            <div className="space-y-3.5">
              {activeProjects.slice(0, 3).map(proj => {
                const ws = workspaces.find(w => w.id === proj.workspaceId);
                return (
                  <div
                    key={proj.id}
                    onClick={() => setActivePage('projects')}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white truncate max-w-[160px]">
                        {proj.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-mono" style={{ backgroundColor: `${proj.color}20`, color: proj.color }}>
                        {proj.progressPct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPct}%`, backgroundColor: proj.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 font-mono">
                      <span>{ws?.name || 'Workspace'}</span>
                      <span>{Math.round(proj.totalMinutesSpent / 60)}h logged</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActivePage('projects')}
            className="w-full mt-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-gray-300 transition-colors text-center"
          >
            Manage Projects Board
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Top Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Focus Tasks */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Priority Tasks Backlog</span>
            </h2>
            <button
              onClick={() => setActivePage('tasks')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              View All ({tasks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map(task => {
              const ws = workspaces.find(w => w.id === task.workspaceId);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ws?.color || '#8B5CF6' }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-200 truncate">{task.title}</p>
                      <p className="text-[10px] text-gray-400">{ws?.name} • ~{task.estimatedMinutes}m</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      startTimer(task.estimatedMinutes || 25, task.workspaceId, task.id, task.title);
                      setActivePage('timer');
                    }}
                    className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-600/30 transition-colors"
                    title="Focus on this task"
                  >
                    <Play className="w-3.5 h-3.5 fill-purple-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Focus Sessions */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Recent Focus Sessions</span>
            </h2>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              Session History
            </button>
          </div>

          <div className="space-y-2.5">
            {recentSessions.map(sess => (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs"
              >
                <div>
                  <p className="font-semibold text-gray-200">
                    {sess.taskTitle || sess.workspaceName || 'Deep Work Session'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(sess.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sess.workspaceName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-purple-300">{sess.durationMinutes}m</span>
                  <span className="block text-[10px] text-amber-400 font-mono">+{sess.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
