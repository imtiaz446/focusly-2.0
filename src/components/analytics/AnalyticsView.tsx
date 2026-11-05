import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { sessions, tasks, workspaces, projects, userStats, userSettings } = useApp();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Daily focus minutes
  const dailyFocusMinutes = sessions
    .filter(s => s.completedAt.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Weekly focus minutes (last 7 days)
  const weekStart = new Date(now.getTime() - 7 * 86400000);
  const weeklyFocusMinutes = sessions
    .filter(s => new Date(s.completedAt) >= weekStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Monthly focus minutes (last 30 days)
  const monthStart = new Date(now.getTime() - 30 * 86400000);
  const monthlyFocusMinutes = sessions
    .filter(s => new Date(s.completedAt) >= monthStart)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Day of Week Focus Chart Data
  const getDayOfWeekData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    sessions.forEach(s => {
      const d = new Date(s.completedAt);
      counts[d.getDay()] += s.durationMinutes;
    });

    return days.map((day, idx) => ({
      day: day.slice(0, 3),
      hours: Number((counts[idx] / 60).toFixed(1)),
      minutes: counts[idx],
    }));
  };

  const dayOfWeekData = getDayOfWeekData();

  // Workspace Focus Distribution for Donut Chart
  const getWorkspaceChartData = () => {
    const map: Record<string, number> = {};

    sessions.forEach(s => {
      const ws = workspaces.find(w => w.id === s.workspaceId);
      const name = ws ? ws.name : s.workspaceName || 'General';
      map[name] = (map[name] || 0) + s.durationMinutes;
    });

    const result = Object.entries(map).map(([name, minutes]) => {
      const ws = workspaces.find(w => w.name === name);
      return {
        name,
        minutes,
        hours: Number((minutes / 60).toFixed(1)),
        color: ws?.color || '#8B5CF6',
      };
    });

    // If no sessions, provide fallback sample from workspaces totalFocusMinutes
    if (result.length === 0) {
      return workspaces.slice(0, 5).map(ws => ({
        name: ws.name,
        minutes: ws.totalFocusMinutes,
        hours: Number((ws.totalFocusMinutes / 60).toFixed(1)),
        color: ws.color,
      }));
    }

    return result.sort((a, b) => b.minutes - a.minutes);
  };

  const workspaceDistribution = getWorkspaceChartData();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Productivity Intelligence</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              REAL STORAGE DATA
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Quantitative analysis of deep work sessions, workspace breakdown, and focus distribution
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-medium">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === 'day' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === 'week' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg transition-all ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {timeRange === 'day' ? 'Today Focus' : timeRange === 'week' ? 'Weekly Focus' : 'Monthly Focus'}
            </span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white font-mono">
            {timeRange === 'day'
              ? `${Math.floor(dailyFocusMinutes / 60)}h ${dailyFocusMinutes % 60}m`
              : timeRange === 'week'
              ? `${Math.floor(weeklyFocusMinutes / 60)}h ${weeklyFocusMinutes % 60}m`
              : `${Math.floor(monthlyFocusMinutes / 60)}h ${monthlyFocusMinutes % 60}m`}
          </div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Optimal Flow Velocity</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Completed Sessions</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white font-mono">
            {sessions.length}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Across {workspaces.length} workspaces
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white font-mono">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            {tasks.filter(t => t.status !== 'completed').length} remaining
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel-interactive border border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Longest Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-400 font-mono">
            {userStats.streakDays} Consecutive Days
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Level {userStats.level} • {userStats.xp} Total XP
          </p>
        </div>
      </div>

      {/* Main Charts Grid: Day of Week Trend + Workspace Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day of Week Focus Bar Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Daily Deep Work Pattern</span>
              </h3>
              <p className="text-xs text-gray-400">Total hours focused across days of the week</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  formatter={(val: any) => [`${val} hours`, 'Focus']}
                />
                <Bar
                  dataKey="hours"
                  fill="#8B5CF6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workspace Focus Distribution Donut Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <span>Workspace Distribution</span>
            </h3>
            <p className="text-xs text-gray-400">Time allocation across active creative zones</p>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workspaceDistribution}
                    dataKey="minutes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    isAnimationActive={false}
                  >
                    {workspaceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 15, 28, 0.95)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Math.floor(Number(val) / 60)}h ${Number(val) % 60}m`, 'Time Logged']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Workspace Distribution Percentages */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              {workspaceDistribution.slice(0, 4).map((ws, i) => {
                const totalMinutes = workspaceDistribution.reduce((acc, curr) => acc + curr.minutes, 0);
                const pct = totalMinutes > 0 ? Math.round((ws.minutes / totalMinutes) * 100) : 0;
                return (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ws.color }} />
                      <span className="text-gray-300 font-medium">{ws.name}</span>
                    </div>
                    <span className="font-mono text-gray-400">{ws.hours}h ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
