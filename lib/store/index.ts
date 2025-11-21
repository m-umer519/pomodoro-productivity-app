import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Task, Session, UserStats, AppSettings, TimerStatus, SessionType, Achievement 
} from '../types';
import { 
  calculateStreak, calculateLevel, checkNewAchievements 
} from '../utils';  // ✅ Changed from '../constants' to '../utils'
import { ACHIEVEMENTS, DEFAULT_TIMER_SETTINGS } from '../constants';  // ✅ Keep these from constants

interface AppState {
  // Timer state
  timerStatus: TimerStatus;
  currentSessionType: SessionType;
  timeRemaining: number;
  sessionsUntilLongBreak: number;
  currentTaskId: string | null;
  
  // Data
  tasks: Task[];
  sessions: Session[];
  stats: UserStats;
  settings: AppSettings;
  
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  tick: () => void;
  completeSession: () => void;
  setCurrentTask: (taskId: string | null) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Stats actions
  updateStats: () => void;
  
  // Data management
  clearAllData: () => void;
  exportData: () => any;
  importData: (data: any) => void;
}

const initialSettings: AppSettings = {
  ...DEFAULT_TIMER_SETTINGS,
  theme: 'light',
  soundEnabled: true,
  notificationsEnabled: true,
  ambientSound: null,
  volume: 0.5,
};

const initialStats: UserStats = {
  totalPomodoros: 0,
  totalFocusTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  level: 1,
  xp: 0,
  achievements: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      timerStatus: 'idle',
      currentSessionType: 'focus',
      timeRemaining: DEFAULT_TIMER_SETTINGS.focusDuration,
      sessionsUntilLongBreak: 4,
      currentTaskId: null,
      tasks: [],
      sessions: [],
      stats: initialStats,
      settings: initialSettings,
      
      // Timer actions
      startTimer: () => set({ timerStatus: 'running' }),
      
      pauseTimer: () => set({ timerStatus: 'paused' }),
      
      resetTimer: () => {
        const { currentSessionType, settings } = get();
        const duration = 
          currentSessionType === 'focus' ? settings.focusDuration :
          currentSessionType === 'shortBreak' ? settings.shortBreakDuration :
          settings.longBreakDuration;
        
        set({ timerStatus: 'idle', timeRemaining: duration });
      },
      
      skipSession: () => {
        const { completeSession } = get();
        completeSession();
      },
      
      tick: () => {
        const { timeRemaining, timerStatus } = get();
        
        if (timerStatus !== 'running') return;
        
        if (timeRemaining <= 1) {
          get().completeSession();
        } else {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },
      
      completeSession: () => {
        const { 
          currentSessionType, sessionsUntilLongBreak, currentTaskId, 
          tasks, sessions, settings, stats 
        } = get();
        
        // Create session record
        const newSession: Session = {
          id: crypto.randomUUID(),
          taskId: currentTaskId || undefined,
          type: currentSessionType,
          duration: currentSessionType === 'focus' ? settings.focusDuration :
                    currentSessionType === 'shortBreak' ? settings.shortBreakDuration :
                    settings.longBreakDuration,
          completedAt: new Date(),
          category: currentTaskId 
            ? tasks.find(t => t.id === currentTaskId)?.category || 'personal'
            : 'personal',
        };
        
        // Update task pomodoro count
        let updatedTasks = tasks;
        if (currentSessionType === 'focus' && currentTaskId) {
          updatedTasks = tasks.map(t => 
            t.id === currentTaskId 
              ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 }
              : t
          );
        }
        
        // Determine next session type
        let nextType: SessionType;
        let nextSessions = sessionsUntilLongBreak;
        
        if (currentSessionType === 'focus') {
          nextSessions = sessionsUntilLongBreak - 1;
          nextType = nextSessions === 0 ? 'longBreak' : 'shortBreak';
          if (nextSessions === 0) nextSessions = settings.longBreakInterval;
        } else {
          nextType = 'focus';
        }
        
        const nextDuration = 
          nextType === 'focus' ? settings.focusDuration :
          nextType === 'shortBreak' ? settings.shortBreakDuration :
          settings.longBreakDuration;
        
        // Update state
        set({
          sessions: [...sessions, newSession],
          tasks: updatedTasks,
          currentSessionType: nextType,
          sessionsUntilLongBreak: nextSessions,
          timeRemaining: nextDuration,
          timerStatus: settings.autoStartPomodoros || 
                      (nextType !== 'focus' && settings.autoStartBreaks) 
                      ? 'running' : 'idle',
        });
        
        // Update stats
        get().updateStats();
        
        // Play sound and show notification
        if (settings.soundEnabled) {
          playNotificationSound();
        }
        
        if (settings.notificationsEnabled) {
          showNotification(currentSessionType);
        }
      },
      
      setCurrentTask: (taskId) => set({ currentTaskId: taskId }),
      
      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set(state => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
      },
      
      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== id),
          currentTaskId: state.currentTaskId === id ? null : state.currentTaskId
        }));
      },
      
      toggleTaskComplete: (id) => {
        set(state => ({
          tasks: state.tasks.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        }));
      },
      
      // Settings actions
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      // Stats actions
      updateStats: () => {
        const { sessions, stats } = get();
        const focusSessions = sessions.filter(s => s.type === 'focus');
        
        const totalPomodoros = focusSessions.length;
        const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0);
        const { current, longest } = calculateStreak(sessions);
        const xp = stats.xp + 10; // +10 XP per session
        const level = calculateLevel(xp);
        
        // Check for new achievements
        const tempStats = {
          ...stats,
          totalPomodoros,
          totalFocusTime,
          currentStreak: current,
          longestStreak: longest,
          level,
          xp,
        };
        
        const newAchievements = checkNewAchievements(tempStats, ACHIEVEMENTS);
        
        set({
          stats: {
            ...tempStats,
            achievements: [...stats.achievements, ...newAchievements],
          }
        });
        
        // Show achievement notification
        if (newAchievements.length > 0) {
          newAchievements.forEach(achievement => {
            showAchievementNotification(achievement);
          });
        }
      },
      
      // Data management
      clearAllData: () => {
        set({
          tasks: [],
          sessions: [],
          stats: initialStats,
          timerStatus: 'idle',
          timeRemaining: DEFAULT_TIMER_SETTINGS.focusDuration,
          currentTaskId: null,
        });
      },
      
      exportData: () => {
        const { tasks, sessions, stats } = get();
        return { tasks, sessions, stats, exportedAt: new Date() };
      },
      
      importData: (data) => {
        set({
          tasks: data.tasks || [],
          sessions: data.sessions || [],
          stats: data.stats || initialStats,
        });
      },
    }),
    {
      name: 'pomodoro-app-storage',
    }
  )
);

// Helper functions
function playNotificationSound() {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play().catch(() => {});
}

function showNotification(sessionType: SessionType) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const messages = {
      focus: 'Focus session complete! Time for a break. 🎉',
      shortBreak: 'Break is over. Ready to focus again? 💪',
      longBreak: 'Long break complete. Let\'s get back to work! 🚀',
    };
    
    new Notification('Pomodoro Timer', {
      body: messages[sessionType],
      icon: '/icon.png',
    });
  }
}

function showAchievementNotification(achievement: Achievement) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🏆 Achievement Unlocked!', {
      body: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
      icon: '/icon.png',
    });
  }
}