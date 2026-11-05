/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ConfirmationModal } from './components/layout/ConfirmationModal';
import { AuthModal } from './components/auth/AuthModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { FocusTimer } from './components/timer/FocusTimer';
import { WorkspaceList } from './components/workspaces/WorkspaceList';
import { TaskManager } from './components/tasks/TaskManager';
import { ProjectManager } from './components/projects/ProjectManager';
import { VoiceAssistant } from './components/voice/VoiceAssistant';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { FocusHistory } from './components/history/FocusHistory';
import { CalendarView } from './components/calendar/CalendarView';
import { AchievementsView } from './components/gamification/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Render active page component
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'timer':
        return <FocusTimer />;
      case 'workspaces':
        return <WorkspaceList />;
      case 'tasks':
        return <TaskManager />;
      case 'projects':
        return <ProjectManager />;
      case 'voice':
        return <VoiceAssistant />;
      case 'analytics':
        return <AnalyticsView />;
      case 'history':
        return <FocusHistory />;
      case 'calendar':
        return <CalendarView />;
      case 'achievements':
        return <AchievementsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080810] text-[#F3F4F6] flex">
      {/* Ambient background lighting */}
      <div className="ambient-glow-purple -top-20 -left-20" />
      <div className="ambient-glow-cyan top-1/2 -right-20" />

      {/* Left Navigation Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Sticky Header */}
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Viewport Content with page transition animation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating FOCUS AI quick launcher button when not already on voice page */}
      {activePage !== 'voice' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setActivePage('voice')}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 text-white shadow-2xl shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group border border-purple-400/40"
          title="Open FOCUS AI Voice Assistant"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold">
            FOCUS AI
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-400 animate-ping" />
        </motion.button>
      )}

      {/* Confirmation & Auth Modals */}
      <ConfirmationModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
