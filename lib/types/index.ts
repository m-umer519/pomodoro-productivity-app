export type TaskCategory = 'work' | 'study' | 'personal' | 'fitness' | 'creative';
export type Priority = 'high' | 'medium' | 'low';
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  deadline?: Date;
  completed: boolean;
  pomodorosCompleted: number;
  pomodorosEstimated: number;
  createdAt: Date;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Session {
  id: string;
  taskId?: string;
  type: SessionType;
  duration: number;
  completedAt: Date;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  threshold: number;
  type: 'sessions' | 'streak';
}

export interface UserStats {
  totalPomodoros: number;
  totalFocusTime: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  achievements: Achievement[];
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export interface AppSettings extends TimerSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  ambientSound: string | null;
  volume: number;
}