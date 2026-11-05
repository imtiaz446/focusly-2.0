import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Workspace,
  Project,
  Task,
  FocusSession,
  Achievement,
  Challenge,
  UserStats,
  UserSettings,
  CalendarEvent,
  ActiveTimerState,
  AIMessage,
  TimerMode,
  Priority,
  TaskStatus,
  ProjectStatus,
} from '../types';
import {
  DEFAULT_WORKSPACES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_USER_SETTINGS,
  INITIAL_USER_STATS,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';
import { soundEngine } from '../utils/audio';

export type AppPage =
  | 'dashboard'
  | 'timer'
  | 'workspaces'
  | 'tasks'
  | 'projects'
  | 'voice'
  | 'analytics'
  | 'history'
  | 'calendar'
  | 'achievements'
  | 'settings';

interface ConfirmationRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;

  // Workspaces
  workspaces: Workspace[];
  addWorkspace: (ws: Omit<Workspace, 'id' | 'createdAt' | 'totalFocusMinutes'>) => Workspace;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'totalMinutesSpent' | 'progressPct'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualMinutesSpent'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  // Timer
  timer: ActiveTimerState;
  startTimer: (durationMinutes: number, workspaceId?: string, taskId?: string, taskName?: string, mode?: TimerMode) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimerEarly: () => void;
  cancelTimer: () => void;
  setTimerAmbientSound: (ambient: 'none' | 'whitenoise' | 'rain' | 'binaural' | 'cosmic') => void;

  // Focus Sessions
  sessions: FocusSession[];
  logSession: (session: Omit<FocusSession, 'id'>) => void;
  deleteSession: (id: string) => void;

  // Gamification
  userStats: UserStats;
  achievements: Achievement[];
  challenges: Challenge[];
  claimChallengeReward: (id: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteCalendarEvent: (id: string) => void;

  // User Settings & Auth
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  // AI Assistant
  aiMessages: AIMessage[];
  isAILoading: boolean;
  sendAIMessage: (text: string) => Promise<void>;
  clearAIMessages: () => void;
  bengaliExplanationMode: boolean;
  setBengaliExplanationMode: (val: boolean) => void;

  // Confirmation modal
  confirmation: ConfirmationRequest | null;
  requestConfirmation: (req: ConfirmationRequest) => void;
  closeConfirmation: () => void;

  // Quick stats helpers
  todayFocusMinutes: number;
  todayCompletedTasksCount: number;
  dailyGoalProgressPct: number;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() =>
    loadFromStorage('workspaces', DEFAULT_WORKSPACES)
  );

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage('projects', INITIAL_PROJECTS)
  );

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage('tasks', INITIAL_TASKS)
  );

  // Sessions state
  const [sessions, setSessions] = useState<FocusSession[]>(() =>
    loadFromStorage('sessions', INITIAL_SESSIONS)
  );

  // Achievements & Challenges
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    loadFromStorage('achievements', INITIAL_ACHIEVEMENTS)
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    loadFromStorage('challenges', INITIAL_CHALLENGES)
  );

  // Stats & Settings
  const [userStats, setUserStats] = useState<UserStats>(() =>
    loadFromStorage('userStats', INITIAL_USER_STATS)
  );
  const [userSettings, setUserSettings] = useState<UserSettings>(() =>
    loadFromStorage('userSettings', INITIAL_USER_SETTINGS)
  );

  // Calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() =>
    loadFromStorage('calendarEvents', INITIAL_CALENDAR_EVENTS)
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage('isAuthenticated', false)
  );

  // Confirmation modal
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);

  // Active Timer state
  const defaultInitialTimer: ActiveTimerState = {
    status: 'idle',
    durationSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    startTimestamp: null,
    pausedRemainingSeconds: 25 * 60,
    workspaceId: workspaces[0]?.id || 'ws-photoshop',
    mode: 'pomodoro',
    ambientSound: 'none',
  };

  const [timer, setTimer] = useState<ActiveTimerState>(() => {
    const saved = loadFromStorage<ActiveTimerState>('activeTimer', defaultInitialTimer);
    // If it was running when user refreshed, recompute remaining seconds via timestamp
    if (saved.status === 'running' && saved.startTimestamp) {
      const elapsed = Math.floor((Date.now() - saved.startTimestamp) / 1000);
      const remaining = Math.max(0, saved.pausedRemainingSeconds - elapsed);
      return {
        ...saved,
        remainingSeconds: remaining,
        status: remaining > 0 ? 'running' : 'idle',
      };
    }
    return saved;
  });

  // AI Assistant Messages state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() =>
    loadFromStorage('aiMessages', [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Greetings Creator. I am FOCUS AI. Ready to amplify your creative flow? Say "Start a 45-minute focus session", "Create a Photoshop task", or ask me anything about your productivity. বাংলা এবং বাংলিশ ভয়েস কমান্ড সম্পূর্ণরূপে সক্রিয় আছে!',
        timestamp: new Date().toISOString(),
        suggestedFollowUps: [
          'Photoshop এ একটা টাস্ক বানাও',
          '৪৫ মিনিটের ফোকাস সেশন শুরু করো',
          'আজকে আমি কতক্ষণ কাজ করেছি?',
          'কালকের জন্য রুটিন প্ল্যান করো',
        ],
      },
    ])
  );
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [bengaliExplanationMode, setBengaliExplanationMode] = useState<boolean>(() =>
    loadFromStorage('bengaliExplanationMode', true)
  );

  // Save states to local storage on changes
  useEffect(() => saveToStorage('workspaces', workspaces), [workspaces]);
  useEffect(() => saveToStorage('projects', projects), [projects]);
  useEffect(() => saveToStorage('tasks', tasks), [tasks]);
  useEffect(() => saveToStorage('sessions', sessions), [sessions]);
  useEffect(() => saveToStorage('bengaliExplanationMode', bengaliExplanationMode), [bengaliExplanationMode]);
  useEffect(() => saveToStorage('achievements', achievements), [achievements]);
  useEffect(() => saveToStorage('challenges', challenges), [challenges]);
  useEffect(() => saveToStorage('userStats', userStats), [userStats]);
  useEffect(() => saveToStorage('userSettings', userSettings), [userSettings]);
  useEffect(() => saveToStorage('calendarEvents', calendarEvents), [calendarEvents]);
  useEffect(() => saveToStorage('activeTimer', timer), [timer]);
  useEffect(() => saveToStorage('aiMessages', aiMessages), [aiMessages]);
  useEffect(() => saveToStorage('isAuthenticated', isAuthenticated), [isAuthenticated]);

  // Request browser notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Timer Tick loop using timestamps for 100% accuracy
  useEffect(() => {
    if (timer.status !== 'running' || !timer.startTimestamp) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timer.startTimestamp!) / 1000);
      const remaining = Math.max(0, timer.pausedRemainingSeconds - elapsed);

      if (remaining <= 0) {
        clearInterval(interval);
        handleTimerCompleted();
      } else {
        setTimer(prev => ({
          ...prev,
          remainingSeconds: remaining,
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [timer.status, timer.startTimestamp, timer.pausedRemainingSeconds]);

  // Handle successful timer completion
  const handleTimerCompleted = useCallback(() => {
    soundEngine.stopAmbient();
    soundEngine.playCompletionChime(userSettings.soundVolume);

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
      });
    } catch (e) {}

    // Send browser notification
    if (userSettings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('FOCUSLY — Focus Beyond Limits!', {
          body: `Superb! You finished your ${Math.round(timer.durationSeconds / 60)}-minute focus session.`,
          icon: '/favicon.ico',
        });
      } catch (e) {}
    }

    // Award XP
    const durationMinutes = Math.round(timer.durationSeconds / 60);
    const xpGained = durationMinutes * 4 + 20;

    const ws = workspaces.find(w => w.id === timer.workspaceId);
    const wsName = ws ? ws.name : 'General';

    // Log the session
    const newSession: FocusSession = {
      id: 'sess-' + Date.now(),
      workspaceId: timer.workspaceId,
      workspaceName: wsName,
      taskId: timer.taskId,
      taskTitle: timer.taskName,
      durationMinutes: durationMinutes,
      actualSeconds: timer.durationSeconds,
      startedAt: new Date(Date.now() - timer.durationSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
      xpEarned: xpGained,
      rating: 5,
    };

    setSessions(prev => [newSession, ...prev]);

    // Update workspace total minutes
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === timer.workspaceId
          ? { ...w, totalFocusMinutes: w.totalFocusMinutes + durationMinutes }
          : w
      )
    );

    // Update task actual minutes spent if bound to task
    if (timer.taskId) {
      setTasks(prev =>
        prev.map(t =>
          t.id === timer.taskId
            ? { ...t, actualMinutesSpent: t.actualMinutesSpent + durationMinutes }
            : t
        )
      );
    }

    // Update User Stats
    setUserStats(prev => {
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 500) + 1;
      if (newLevel > prev.level) {
        soundEngine.playFanfare();
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalFocusMinutes: prev.totalFocusMinutes + durationMinutes,
        totalCompletedSessions: prev.totalCompletedSessions + 1,
      };
    });

    // Check challenges progress
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.type === 'daily' && !ch.completed) {
          const nextCount = ch.currentCount + 1;
          const completed = nextCount >= ch.targetCount;
          return { ...ch, currentCount: nextCount, completed };
        }
        if (ch.type === 'weekly' && !ch.completed) {
          const nextCount = ch.currentCount + durationMinutes;
          const completed = nextCount >= ch.targetCount;
          return { ...ch, currentCount: nextCount, completed };
        }
        return ch;
      })
    );

    // Reset timer
    setTimer(prev => ({
      ...prev,
      status: 'idle',
      remainingSeconds: prev.durationSeconds,
      startTimestamp: null,
      pausedRemainingSeconds: prev.durationSeconds,
    }));
  }, [timer, workspaces, userSettings]);

  // Timer controls
  const startTimer = useCallback(
    (durationMinutes: number, workspaceId?: string, taskId?: string, taskName?: string, mode: TimerMode = 'pomodoro') => {
      soundEngine.playClick(userSettings.soundVolume);
      soundEngine.playStart(userSettings.soundVolume);

      const targetWsId = workspaceId || timer.workspaceId || workspaces[0]?.id || 'ws-photoshop';
      const durationSecs = durationMinutes * 60;

      if (timer.ambientSound !== 'none') {
        soundEngine.startAmbient(timer.ambientSound, userSettings.ambientVolume);
      }

      setTimer({
        status: 'running',
        durationSeconds: durationSecs,
        remainingSeconds: durationSecs,
        startTimestamp: Date.now(),
        pausedRemainingSeconds: durationSecs,
        workspaceId: targetWsId,
        taskId: taskId,
        taskName: taskName,
        mode: mode,
        ambientSound: timer.ambientSound,
      });
    },
    [timer.workspaceId, timer.ambientSound, workspaces, userSettings]
  );

  const pauseTimer = useCallback(() => {
    soundEngine.playClick(userSettings.soundVolume);
    soundEngine.stopAmbient();

    if (timer.status !== 'running' || !timer.startTimestamp) return;

    const elapsed = Math.floor((Date.now() - timer.startTimestamp) / 1000);
    const remaining = Math.max(0, timer.pausedRemainingSeconds - elapsed);

    setTimer(prev => ({
      ...prev,
      status: 'paused',
      remainingSeconds: remaining,
      pausedRemainingSeconds: remaining,
      startTimestamp: null,
    }));
  }, [timer, userSettings]);

  const resumeTimer = useCallback(() => {
    soundEngine.playClick(userSettings.soundVolume);
    if (timer.ambientSound !== 'none') {
      soundEngine.startAmbient(timer.ambientSound, userSettings.ambientVolume);
    }

    setTimer(prev => ({
      ...prev,
      status: 'running',
      startTimestamp: Date.now(),
    }));
  }, [timer.ambientSound, userSettings]);

  const resetTimer = useCallback(() => {
    soundEngine.playClick(userSettings.soundVolume);
    soundEngine.stopAmbient();

    setTimer(prev => ({
      ...prev,
      status: 'idle',
      remainingSeconds: prev.durationSeconds,
      pausedRemainingSeconds: prev.durationSeconds,
      startTimestamp: null,
    }));
  }, [userSettings]);

  const completeTimerEarly = useCallback(() => {
    handleTimerCompleted();
  }, [handleTimerCompleted]);

  const cancelTimer = useCallback(() => {
    soundEngine.playClick(userSettings.soundVolume);
    soundEngine.stopAmbient();

    setTimer(prev => ({
      ...prev,
      status: 'idle',
      remainingSeconds: prev.durationSeconds,
      pausedRemainingSeconds: prev.durationSeconds,
      startTimestamp: null,
    }));
  }, [userSettings]);

  const setTimerAmbientSound = useCallback(
    (ambient: 'none' | 'whitenoise' | 'rain' | 'binaural' | 'cosmic') => {
      soundEngine.playClick(userSettings.soundVolume);
      if (ambient === 'none') {
        soundEngine.stopAmbient();
      } else if (timer.status === 'running') {
        soundEngine.startAmbient(ambient, userSettings.ambientVolume);
      }
      setTimer(prev => ({ ...prev, ambientSound: ambient }));
    },
    [timer.status, userSettings]
  );

  // Workspace Actions
  const addWorkspace = useCallback(
    (ws: Omit<Workspace, 'id' | 'createdAt' | 'totalFocusMinutes'>): Workspace => {
      const created: Workspace = {
        ...ws,
        id: 'ws-' + Date.now(),
        createdAt: new Date().toISOString(),
        totalFocusMinutes: 0,
      };
      setWorkspaces(prev => [...prev, created]);
      return created;
    },
    []
  );

  const updateWorkspace = useCallback((id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id));
  }, []);

  // Project Actions
  const addProject = useCallback(
    (proj: Omit<Project, 'id' | 'createdAt' | 'totalMinutesSpent' | 'progressPct'>): Project => {
      const created: Project = {
        ...proj,
        id: 'proj-' + Date.now(),
        createdAt: new Date().toISOString(),
        totalMinutesSpent: 0,
        progressPct: 0,
      };
      setProjects(prev => [...prev, created]);
      return created;
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // Task Actions
  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'createdAt' | 'actualMinutesSpent'>): Task => {
      const created: Task = {
        ...task,
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString(),
        actualMinutesSpent: 0,
      };
      setTasks(prev => [created, ...prev]);
      return created;
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const toggleTaskCompleted = useCallback(
    (id: string) => {
      soundEngine.playClick(userSettings.soundVolume);
      setTasks(prev =>
        prev.map(t => {
          if (t.id === id) {
            const nextStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
            const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
            if (nextStatus === 'completed') {
              soundEngine.playFanfare(userSettings.soundVolume * 0.7);
              setUserStats(s => ({
                ...s,
                xp: s.xp + 40,
                totalCompletedTasks: s.totalCompletedTasks + 1,
              }));
            }
            return {
              ...t,
              status: nextStatus,
              completedAt,
            };
          }
          return t;
        })
      );
    },
    [userSettings]
  );

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Focus Sessions
  const logSession = useCallback((session: Omit<FocusSession, 'id'>) => {
    const created: FocusSession = {
      ...session,
      id: 'sess-' + Date.now(),
    };
    setSessions(prev => [created, ...prev]);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Calendar
  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const created: CalendarEvent = {
      ...event,
      id: 'cal-' + Date.now(),
    };
    setCalendarEvents(prev => [...prev, created]);
    return created;
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  // Gamification: Claim Challenge
  const claimChallengeReward = useCallback((id: string) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id === id && ch.completed) {
          soundEngine.playFanfare();
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch (e) {}
          setUserStats(s => ({
            ...s,
            xp: s.xp + ch.xpReward,
          }));
          return { ...ch, xpReward: 0 }; // claimed
        }
        return ch;
      })
    );
  }, []);

  // User Settings
  const updateUserSettings = useCallback((updates: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Confirmation Request
  const requestConfirmation = useCallback((req: ConfirmationRequest) => {
    setConfirmation(req);
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  // AI Assistant Integration
  const sendAIMessage = useCallback(
    async (text: string) => {
      const userMsg: AIMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text,
        timestamp: new Date().toISOString(),
      };
      setAiMessages(prev => [...prev, userMsg]);
      setIsAILoading(true);

      // Prepare context for FOCUS AI
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = sessions.filter(s => s.completedAt.startsWith(today));
      const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

      const contextData = {
        workspaces: workspaces.map(w => ({ id: w.id, name: w.name, totalMinutes: w.totalFocusMinutes })),
        projects: projects.map(p => ({ id: p.id, name: p.name, status: p.status, progressPct: p.progressPct })),
        pendingTasksCount: tasks.filter(t => t.status !== 'completed').length,
        todayFocusMinutes: todayMinutes,
        dailyGoalMinutes: userSettings.dailyGoalMinutes,
        userLevel: userStats.level,
        userXp: userStats.xp,
        streakDays: userStats.streakDays,
      };

      try {
        const response = await fetch('/api/gemini/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            context: contextData,
            bengaliExplanationMode,
            conversationHistory: aiMessages.slice(-6).map(m => ({ role: m.sender, text: m.text })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        // Process any returned structured actions
        if (data.actions && Array.isArray(data.actions)) {
          for (const action of data.actions) {
            if (action.needsConfirmation) {
              requestConfirmation({
                title: 'Action Requires Approval',
                message: action.confirmationMessage || `FOCUS AI is requesting to execute: ${action.type}`,
                isDestructive: true,
                onConfirm: () => {
                  executeAIAction(action);
                  closeConfirmation();
                },
              });
            } else {
              executeAIAction(action);
            }
          }
        }

        const botMsg: AIMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: data.reply || 'Request understood and executed.',
          timestamp: new Date().toISOString(),
          actions: data.actions,
          suggestedFollowUps: data.suggestedFollowUps || [],
        };

        setAiMessages(prev => [...prev, botMsg]);

        // Speak aloud via SpeechSynthesis if voice is supported & enabled
        if (userSettings.soundEnabled && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(data.reply);
            utterance.rate = userSettings.voiceRate || 1.0;
            utterance.pitch = userSettings.voicePitch || 1.0;

            const isBengali = /[\u0980-\u09FF]/.test(data.reply);
            if (isBengali) {
              utterance.lang = 'bn-BD';
              const voices = window.speechSynthesis.getVoices();
              const bnVoice = voices.find(v => v.lang.startsWith('bn'));
              if (bnVoice) utterance.voice = bnVoice;
            }

            window.speechSynthesis.speak(utterance);
          } catch (e) {}
        }
      } catch (err: any) {
        console.error('AI assistant error:', err);
        const errMsg: AIMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: `I ran into an issue connecting to my neural core, but I've noted your request. You can also trigger timer presets directly.`,
          timestamp: new Date().toISOString(),
          suggestedFollowUps: ['Start a 25-minute focus session', 'Show my pending tasks'],
        };
        setAiMessages(prev => [...prev, errMsg]);
      } finally {
        setIsAILoading(false);
      }
    },
    [
      aiMessages,
      sessions,
      workspaces,
      projects,
      tasks,
      userSettings,
      userStats,
      bengaliExplanationMode,
      requestConfirmation,
      closeConfirmation,
    ]
  );

  // Helper to execute actions returned by AI
  const executeAIAction = useCallback(
    (action: any) => {
      if (!action || !action.type) return;

      switch (action.type) {
        case 'create_task': {
          const payload = action.payload || {};
          let targetWs = workspaces.find(
            w => w.name.toLowerCase() === (payload.workspaceName || '').toLowerCase()
          );
          if (!targetWs) targetWs = workspaces[0];

          addTask({
            title: payload.title || 'AI Generated Task',
            notes: payload.notes || 'Created via FOCUS AI assistant',
            priority: (payload.priority as Priority) || 'medium',
            status: 'todo',
            estimatedMinutes: payload.estimatedMinutes || 30,
            workspaceId: targetWs ? targetWs.id : 'ws-photoshop',
            subtasks: [],
          });
          break;
        }

        case 'start_timer': {
          const payload = action.payload || {};
          const duration = payload.durationMinutes || 25;
          let targetWs = workspaces.find(
            w => w.name.toLowerCase() === (payload.workspaceName || '').toLowerCase()
          );
          startTimer(duration, targetWs?.id, undefined, payload.taskName || 'AI Focus Sprint');
          setActivePage('timer');
          break;
        }

        case 'create_project': {
          const payload = action.payload || {};
          addProject({
            name: payload.name || 'New Project',
            description: payload.description || 'Created by FOCUS AI',
            workspaceId: workspaces[0]?.id || 'ws-photoshop',
            color: payload.color || '#8B5CF6',
            status: 'planning',
            deadline: payload.deadline,
          });
          break;
        }

        case 'plan_schedule': {
          const payload = action.payload || {};
          if (payload.blocks && Array.isArray(payload.blocks)) {
            const today = new Date();
            payload.blocks.forEach((b: any, i: number) => {
              const start = new Date(today);
              start.setHours(9 + i * 2, 0, 0, 0);
              const end = new Date(today);
              end.setHours(10 + i * 2 + 1, 0, 0, 0);

              addCalendarEvent({
                title: b.title || 'AI Planned Focus Block',
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                type: 'scheduled_block',
                workspaceId: workspaces[i % workspaces.length]?.id,
                workspaceColor: workspaces[i % workspaces.length]?.color,
                description: b.time || 'Suggested deep focus session',
              });
            });
            setActivePage('calendar');
          }
          break;
        }

        default:
          console.log('Unhandled AI action:', action);
      }
    },
    [workspaces, addTask, startTimer, addProject, addCalendarEvent]
  );

  const clearAIMessages = useCallback(() => {
    setAiMessages([]);
  }, []);

  // Computed helper statistics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.completedAt.startsWith(todayDateStr));
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayCompletedTasksCount = tasks.filter(
    t => t.status === 'completed' && t.completedAt && t.completedAt.startsWith(todayDateStr)
  ).length;
  const dailyGoalProgressPct = Math.min(
    100,
    Math.round((todayFocusMinutes / (userSettings.dailyGoalMinutes || 120)) * 100)
  );

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        workspaces,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        projects,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        completeTimerEarly,
        cancelTimer,
        setTimerAmbientSound,
        sessions,
        logSession,
        deleteSession,
        userStats,
        achievements,
        challenges,
        claimChallengeReward,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        userSettings,
        updateUserSettings,
        isAuthenticated,
        setIsAuthenticated,
        aiMessages,
        isAILoading,
        sendAIMessage,
        clearAIMessages,
        bengaliExplanationMode,
        setBengaliExplanationMode,
        confirmation,
        requestConfirmation,
        closeConfirmation,
        todayFocusMinutes,
        todayCompletedTasksCount,
        dailyGoalProgressPct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
