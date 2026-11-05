import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Briefcase,
  CheckSquare,
  FolderKanban,
  Bot,
  BarChart3,
  History,
  Calendar,
  Award,
  Settings,
  X,
  Play,
  Zap,
} from 'lucide-react';
import { useApp, AppPage } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  isSpecial?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activePage,
    setActivePage,
    tasks,
    timer,
    startTimer,
    userStats,
    userSettings,
  } = useApp();

  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'timer',
      label: 'Focus Timer',
      icon: Timer,
      badge: timer.status === 'running' ? 'LIVE' : undefined,
    },
    { id: 'workspaces', label: 'My Workspace', icon: Briefcase },
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    {
      id: 'voice',
      label: 'AI Assistant',
      icon: Bot,
      isSpecial: true,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: AppPage) => {
    setActivePage(page);
    onClose();
  };

  const xpProgressInLevel = userStats.xp % 500;
  const xpPct = Math.min(100, Math.round((xpProgressInLevel / 500) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-purple-500/15 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">
              Command Core
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/20 text-white border border-purple-500/40 shadow-lg shadow-purple-600/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-400 group-hover:text-purple-300 group-hover:bg-purple-500/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={isActive ? 'font-semibold text-white' : ''}>
                    {item.label}
                  </span>
                </div>

                {/* Badges */}
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === 'LIVE'
                        ? 'bg-purple-500 text-white animate-pulse'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.isSpecial && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Launch & User Profile Footer */}
        <div className="p-3 border-t border-white/5 space-y-3">
          {/* Quick Start Focus Button */}
          {timer.status === 'idle' && (
            <button
              onClick={() => {
                startTimer(25);
                setActivePage('timer');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all group"
            >
              <Play className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
              <span>Quick Focus (25m)</span>
            </button>
          )}

          {/* User Progress Snippet */}
          <div
            onClick={() => setActivePage('achievements')}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-gray-200 truncate max-w-[120px]">
                {userSettings.userName}
              </span>
              <span className="text-[10px] font-bold font-mono text-purple-400">
                Lv.{userStats.level}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>{xpProgressInLevel} / 500 XP</span>
              <span>{xpPct}%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
