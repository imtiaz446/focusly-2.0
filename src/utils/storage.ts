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
} from '../types';

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-photoshop',
    name: 'Photoshop',
    icon: 'Image',
    color: '#31A8FF',
    dailyGoalMinutes: 90,
    totalFocusMinutes: 420,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'ws-illustrator',
    name: 'Illustrator',
    icon: 'PenTool',
    color: '#FF9A00',
    dailyGoalMinutes: 60,
    totalFocusMinutes: 260,
    createdAt: new Date(Date.now() - 13 * 86400000).toISOString(),
  },
  {
    id: 'ws-premiere',
    name: 'Premiere Pro',
    icon: 'Film',
    color: '#EA77FF',
    dailyGoalMinutes: 120,
    totalFocusMinutes: 580,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'ws-aftereffects',
    name: 'After Effects',
    icon: 'Sparkles',
    color: '#9999FF',
    dailyGoalMinutes: 90,
    totalFocusMinutes: 340,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'ws-motion',
    name: 'Motion Graphics',
    icon: 'Zap',
    color: '#A855F7',
    dailyGoalMinutes: 60,
    totalFocusMinutes: 180,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'ws-graphicdesign',
    name: 'Graphic Design',
    icon: 'Layers',
    color: '#EC4899',
    dailyGoalMinutes: 90,
    totalFocusMinutes: 490,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'ws-videoediting',
    name: 'Video Editing',
    icon: 'Video',
    color: '#06B6D4',
    dailyGoalMinutes: 120,
    totalFocusMinutes: 620,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'ws-learning',
    name: 'Learning',
    icon: 'BookOpen',
    color: '#10B981',
    dailyGoalMinutes: 60,
    totalFocusMinutes: 310,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'ws-business',
    name: 'Business',
    icon: 'Briefcase',
    color: '#F59E0B',
    dailyGoalMinutes: 45,
    totalFocusMinutes: 150,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'ws-personal',
    name: 'Personal',
    icon: 'User',
    color: '#6366F1',
    dailyGoalMinutes: 30,
    totalFocusMinutes: 110,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-cyber-branding',
    name: 'NeoCyber Brand Overhaul',
    description: 'Complete visual identity, logo iterations, and brand guidelines system.',
    workspaceId: 'ws-photoshop',
    color: '#8B5CF6',
    status: 'in_progress',
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    progressPct: 65,
    totalMinutesSpent: 280,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'proj-youtube-series',
    name: 'Cinematic Reel 2026',
    description: '4K video edit, sound design, color grade, and dynamic title sequencing.',
    workspaceId: 'ws-premiere',
    color: '#EC4899',
    status: 'in_progress',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    progressPct: 40,
    totalMinutesSpent: 320,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'proj-vector-system',
    name: 'Futuristic UI Vector Icons',
    description: 'Icon library with 120 vector glyphs exported for SVG and Figma.',
    workspaceId: 'ws-illustrator',
    color: '#F59E0B',
    status: 'planning',
    deadline: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    progressPct: 15,
    totalMinutesSpent: 90,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'proj-motion-intro',
    name: '3D Hologram Splash Animation',
    description: 'VFX particle burst and logo reveal in After Effects with optical flares.',
    workspaceId: 'ws-aftereffects',
    color: '#06B6D4',
    status: 'completed',
    deadline: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    progressPct: 100,
    totalMinutesSpent: 210,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Cyberpunk Key visual poster in Photoshop',
    notes: 'Apply glitch distortion layer, color balance highlights, and export 300DPI TIFF.',
    priority: 'urgent',
    status: 'in_progress',
    estimatedMinutes: 45,
    actualMinutesSpent: 30,
    workspaceId: 'ws-photoshop',
    projectId: 'proj-cyber-branding',
    deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1-1', title: 'Curate reference moodboard', completed: true },
      { id: 'sub-1-2', title: 'Layer blending & shadow curves', completed: true },
      { id: 'sub-1-3', title: 'Chromatic aberration adjustments', completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Cut A-roll timeline & multi-cam sync in Premiere Pro',
    notes: 'Sync 48kHz audio stems and tag good takes.',
    priority: 'high',
    status: 'todo',
    estimatedMinutes: 60,
    actualMinutesSpent: 0,
    workspaceId: 'ws-premiere',
    projectId: 'proj-youtube-series',
    deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-2-1', title: 'Audio waveform alignment', completed: false },
      { id: 'sub-2-2', title: 'Rough cut rough assembly', completed: false },
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Draw geometric neon logo variations in Illustrator',
    notes: 'Explore sacred geometry and cyberpunk grid layouts.',
    priority: 'medium',
    status: 'todo',
    estimatedMinutes: 45,
    actualMinutesSpent: 0,
    workspaceId: 'ws-illustrator',
    projectId: 'proj-vector-system',
    deadline: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    subtasks: [],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Render optical flare intro loop in After Effects',
    notes: 'Render in ProRes 422 with alpha channel.',
    priority: 'medium',
    status: 'completed',
    estimatedMinutes: 30,
    actualMinutesSpent: 35,
    workspaceId: 'ws-aftereffects',
    projectId: 'proj-motion-intro',
    deadline: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-4-1', title: 'Camera motion blur setup', completed: true },
      { id: 'sub-4-2', title: 'Color grading pass', completed: true },
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Study 3D Gaussian Splatting workflow tutorial',
    notes: 'Watch SIGGRAPH deep dive and document key node tricks.',
    priority: 'low',
    status: 'in_progress',
    estimatedMinutes: 40,
    actualMinutesSpent: 20,
    workspaceId: 'ws-learning',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    subtasks: [],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_SESSIONS: FocusSession[] = [
  {
    id: 'sess-1',
    workspaceId: 'ws-photoshop',
    workspaceName: 'Photoshop',
    projectId: 'proj-cyber-branding',
    taskId: 'task-1',
    taskTitle: 'Cyberpunk Key visual poster',
    durationMinutes: 45,
    actualSeconds: 2700,
    startedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 2.25 * 3600000).toISOString(),
    status: 'completed',
    notes: 'Flawless flow state, finished color balance.',
    rating: 5,
    xpEarned: 150,
  },
  {
    id: 'sess-2',
    workspaceId: 'ws-premiere',
    workspaceName: 'Premiere Pro',
    projectId: 'proj-youtube-series',
    durationMinutes: 60,
    actualSeconds: 3600,
    startedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 25 * 3600000).toISOString(),
    status: 'completed',
    notes: 'Audio stems organized.',
    rating: 4,
    xpEarned: 200,
  },
  {
    id: 'sess-3',
    workspaceId: 'ws-aftereffects',
    workspaceName: 'After Effects',
    projectId: 'proj-motion-intro',
    durationMinutes: 30,
    actualSeconds: 1800,
    startedAt: new Date(Date.now() - 50 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 49.5 * 3600000).toISOString(),
    status: 'completed',
    notes: 'Completed rendering.',
    rating: 5,
    xpEarned: 100,
  },
  {
    id: 'sess-4',
    workspaceId: 'ws-learning',
    workspaceName: 'Learning',
    durationMinutes: 25,
    actualSeconds: 1500,
    startedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 71.58 * 3600000).toISOString(),
    status: 'completed',
    notes: 'Read design systems paper.',
    rating: 4,
    xpEarned: 80,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-flow',
    title: 'First Flow State',
    description: 'Complete your first 25-minute uninterrupted focus session.',
    icon: 'Zap',
    category: 'focus',
    xpReward: 100,
    unlockedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'ach-streak-fire',
    title: 'Hyperfocus Streak',
    description: 'Maintain a 5-day daily focus streak.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 250,
    unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    progress: 5,
    maxProgress: 5,
  },
  {
    id: 'ach-century-club',
    title: 'Deep Diver',
    description: 'Complete a single 90-minute marathon focus session.',
    icon: 'Clock',
    category: 'focus',
    xpReward: 300,
    progress: 60,
    maxProgress: 90,
  },
  {
    id: 'ach-task-slayer',
    title: 'Task Executioner',
    description: 'Complete 25 tasks across all workspaces.',
    icon: 'CheckCircle2',
    category: 'tasks',
    xpReward: 200,
    progress: 14,
    maxProgress: 25,
  },
  {
    id: 'ach-workspace-architect',
    title: 'Studio Polymath',
    description: 'Log at least 2 hours of focus in 5 different workspaces.',
    icon: 'Grid',
    category: 'mastery',
    xpReward: 400,
    progress: 4,
    maxProgress: 5,
  },
  {
    id: 'ach-cosmic-mind',
    title: 'Transcendent Focus',
    description: 'Accumulate 50 total hours of deep work logged in FOCUSLY.',
    icon: 'Sparkles',
    category: 'focus',
    xpReward: 1000,
    progress: 32,
    maxProgress: 50,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-daily-1',
    title: 'Daily Deep Sprint',
    description: 'Complete 2 focus sessions of 25+ minutes today.',
    type: 'daily',
    xpReward: 120,
    targetCount: 2,
    currentCount: 1,
    completed: false,
    expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
  },
  {
    id: 'chal-daily-2',
    title: 'Workspace Warrior',
    description: 'Complete at least 1 task in your primary workspace.',
    type: 'daily',
    xpReward: 90,
    targetCount: 1,
    currentCount: 1,
    completed: true,
    expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
  },
  {
    id: 'chal-weekly-1',
    title: 'Weekly 10-Hour Mastery',
    description: 'Log 600 minutes of deep focus throughout the week.',
    type: 'weekly',
    xpReward: 500,
    targetCount: 600,
    currentCount: 380,
    completed: false,
    expiresAt: new Date(Date.now() + 4 * 86400000).toISOString(),
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Deep Focus: Key visual design',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    type: 'scheduled_block',
    workspaceId: 'ws-photoshop',
    workspaceColor: '#31A8FF',
    description: 'Poster composition and styling in Photoshop',
  },
  {
    id: 'cal-2',
    title: 'Rough Cut Sync & Edit',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    type: 'scheduled_block',
    workspaceId: 'ws-premiere',
    workspaceColor: '#EA77FF',
    description: 'YouTube episode editing sprint',
  },
  {
    id: 'cal-3',
    title: 'Deadline: Poster Art Submission',
    startTime: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
    type: 'task_deadline',
    workspaceId: 'ws-photoshop',
    workspaceColor: '#31A8FF',
    description: 'Client review package upload',
  },
];

export const INITIAL_USER_SETTINGS: UserSettings = {
  userName: 'Alex Vance',
  email: 'creator@focusly.ai',
  dailyGoalMinutes: 120,
  defaultTimerDuration: 25,
  soundEnabled: true,
  soundVolume: 0.7,
  ambientVolume: 0.35,
  voicePitch: 1.0,
  voiceRate: 1.0,
  notificationsEnabled: true,
  cloudSyncEnabled: false,
  themeColor: '#8B5CF6',
};

export const INITIAL_USER_STATS: UserStats = {
  xp: 1480,
  level: 4,
  streakDays: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalFocusMinutes: 1920,
  totalCompletedSessions: 38,
  totalCompletedTasks: 19,
};

// Storage keys
const STORAGE_PREFIX = 'focusly_v1_';

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// Full data export for backups
export function exportAllData(): string {
  const data = {
    workspaces: loadFromStorage('workspaces', DEFAULT_WORKSPACES),
    projects: loadFromStorage('projects', INITIAL_PROJECTS),
    tasks: loadFromStorage('tasks', INITIAL_TASKS),
    sessions: loadFromStorage('sessions', INITIAL_SESSIONS),
    achievements: loadFromStorage('achievements', INITIAL_ACHIEVEMENTS),
    challenges: loadFromStorage('challenges', INITIAL_CHALLENGES),
    calendarEvents: loadFromStorage('calendarEvents', INITIAL_CALENDAR_EVENTS),
    userSettings: loadFromStorage('userSettings', INITIAL_USER_SETTINGS),
    userStats: loadFromStorage('userStats', INITIAL_USER_STATS),
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
  return JSON.stringify(data, null, 2);
}

// Data import with validation
export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.workspaces && Array.isArray(data.workspaces)) {
      saveToStorage('workspaces', data.workspaces);
    }
    if (data.projects && Array.isArray(data.projects)) {
      saveToStorage('projects', data.projects);
    }
    if (data.tasks && Array.isArray(data.tasks)) {
      saveToStorage('tasks', data.tasks);
    }
    if (data.sessions && Array.isArray(data.sessions)) {
      saveToStorage('sessions', data.sessions);
    }
    if (data.achievements && Array.isArray(data.achievements)) {
      saveToStorage('achievements', data.achievements);
    }
    if (data.challenges && Array.isArray(data.challenges)) {
      saveToStorage('challenges', data.challenges);
    }
    if (data.calendarEvents && Array.isArray(data.calendarEvents)) {
      saveToStorage('calendarEvents', data.calendarEvents);
    }
    if (data.userSettings) {
      saveToStorage('userSettings', data.userSettings);
    }
    if (data.userStats) {
      saveToStorage('userStats', data.userStats);
    }
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

// Generate complete Supabase PostgreSQL Migration script
export function generateSupabaseMigrationSQL(): string {
  return `-- FOCUSLY: SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Generated for full cloud sync & multi-device security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  daily_goal_minutes INTEGER DEFAULT 120,
  theme_color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'Layers',
  color TEXT DEFAULT '#8B5CF6',
  daily_goal_minutes INTEGER DEFAULT 60,
  total_focus_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  deadline DATE,
  progress_pct INTEGER DEFAULT 0,
  total_minutes_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  estimated_minutes INTEGER DEFAULT 30,
  actual_minutes_spent INTEGER DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. TASK SUBTASKS TABLE
CREATE TABLE IF NOT EXISTS public.task_subtasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FOCUS SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  actual_seconds INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'interrupted', 'abandoned')),
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  xp_earned INTEGER DEFAULT 0
);

-- 7. CALENDAR EVENTS
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  type TEXT DEFAULT 'scheduled_block',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACHIEVEMENTS & USER UNLOCKS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own workspaces" ON public.workspaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own subtasks" ON public.task_subtasks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_subtasks.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users access own focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own calendar events" ON public.calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
`;
}
