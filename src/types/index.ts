export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export type SessionStatus = 'completed' | 'interrupted' | 'abandoned';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  actualMinutesSpent: number;
  workspaceId: string;
  projectId?: string;
  deadline?: string;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  dailyGoalMinutes: number;
  totalFocusMinutes: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  color: string;
  status: ProjectStatus;
  deadline?: string;
  progressPct: number;
  totalMinutesSpent: number;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  workspaceId: string;
  workspaceName?: string;
  projectId?: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  actualSeconds: number;
  startedAt: string;
  completedAt: string;
  status: SessionStatus;
  notes?: string;
  rating?: number; // 1 to 5 stars
  xpEarned: number;
}

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break';

export interface ActiveTimerState {
  status: 'idle' | 'running' | 'paused';
  durationSeconds: number;
  remainingSeconds: number;
  startTimestamp: number | null; // epoch ms when last resumed
  pausedRemainingSeconds: number; // captured when paused
  workspaceId: string;
  taskId?: string;
  taskName?: string;
  mode: TimerMode;
  ambientSound: 'none' | 'whitenoise' | 'rain' | 'binaural' | 'cosmic';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'focus' | 'streak' | 'tasks' | 'mastery';
  xpReward: number;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  xpReward: number;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  expiresAt: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  totalFocusMinutes: number;
  totalCompletedSessions: number;
  totalCompletedTasks: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  type: 'focus_session' | 'task_deadline' | 'scheduled_block' | 'meeting';
  workspaceId?: string;
  workspaceColor?: string;
  description?: string;
}

export interface UserSettings {
  userName: string;
  email: string;
  dailyGoalMinutes: number;
  defaultTimerDuration: number; // in minutes
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  ambientVolume: number; // 0 to 1
  voicePitch: number;
  voiceRate: number;
  notificationsEnabled: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  cloudSyncEnabled: boolean;
  themeColor: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  actions?: Array<{
    type: string;
    payload: any;
    needsConfirmation?: boolean;
    confirmationMessage?: string;
    executed?: boolean;
  }>;
  suggestedFollowUps?: string[];
}
