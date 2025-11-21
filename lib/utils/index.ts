import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, startOfDay, endOfDay, subDays, isToday, isYesterday, differenceInDays } from 'date-fns';
import { Session, UserStats, Achievement } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time formatting
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Session analytics
export function getSessionsByDateRange(sessions: Session[], days: number) {
  const now = new Date();
  const startDate = startOfDay(subDays(now, days - 1));
  return sessions.filter(s => new Date(s.completedAt) >= startDate);
}

export function getTotalFocusTime(sessions: Session[]): number {
  return sessions
    .filter(s => s.type === 'focus')
    .reduce((acc, s) => acc + s.duration, 0);
}

export function getSessionsByCategory(sessions: Session[]) {
  const categoryMap: Record<string, number> = {};
  sessions
    .filter(s => s.type === 'focus')
    .forEach(s => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
    });
  return categoryMap;
}

export function getSessionsByHour(sessions: Session[]) {
  const hourMap: Record<number, number> = {};
  for (let i = 0; i < 24; i++) hourMap[i] = 0;
  
  sessions
    .filter(s => s.type === 'focus')
    .forEach(s => {
      const hour = new Date(s.completedAt).getHours();
      hourMap[hour]++;
    });
  return hourMap;
}

export function getDailyStats(sessions: Session[], days: number) {
  const stats: Record<string, number> = {};
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = subDays(now, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    stats[dateStr] = 0;
  }
  
  sessions
    .filter(s => s.type === 'focus')
    .forEach(s => {
      const dateStr = format(new Date(s.completedAt), 'yyyy-MM-dd');
      if (stats.hasOwnProperty(dateStr)) {
        stats[dateStr]++;
      }
    });
  
  return stats;
}

// Streak calculation
export function calculateStreak(sessions: Session[]): { current: number; longest: number } {
  if (sessions.length === 0) return { current: 0, longest: 0 };
  
  const focusSessions = sessions
    .filter(s => s.type === 'focus')
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  
  if (focusSessions.length === 0) return { current: 0, longest: 0 };
  
  const lastSession = new Date(focusSessions[0].completedAt);
  const today = new Date();
  const daysSinceLastSession = differenceInDays(startOfDay(today), startOfDay(lastSession));
  
  // If last session was more than 1 day ago, streak is broken
  if (daysSinceLastSession > 1) {
    return { current: 0, longest: calculateLongestStreak(focusSessions) };
  }
  
  // Calculate current streak
  let currentStreak = 0;
  let checkDate = startOfDay(today);
  const sessionDates = new Set(
    focusSessions.map(s => format(startOfDay(new Date(s.completedAt)), 'yyyy-MM-dd'))
  );
  
  while (sessionDates.has(format(checkDate, 'yyyy-MM-dd'))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }
  
  return { 
    current: currentStreak, 
    longest: Math.max(currentStreak, calculateLongestStreak(focusSessions)) 
  };
}

function calculateLongestStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  
  const sessionDates = Array.from(
    new Set(sessions.map(s => format(startOfDay(new Date(s.completedAt)), 'yyyy-MM-dd')))
  ).sort();
  
  let longest = 1;
  let current = 1;
  
  for (let i = 1; i < sessionDates.length; i++) {
    const prevDate = new Date(sessionDates[i - 1]);
    const currDate = new Date(sessionDates[i]);
    const diff = differenceInDays(currDate, prevDate);
    
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  
  return longest;
}

// XP and Level calculation
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * currentLevel * 100;
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = calculateLevel(xp);
  const currentLevelXP = (level - 1) * (level - 1) * 100;
  const nextLevelXP = level * level * 100;
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const percentage = (current / needed) * 100;
  
  return { current, needed, percentage };
}

// Achievement checking
export function checkNewAchievements(
  stats: UserStats,
  achievements: Achievement[]
): Achievement[] {
  const unlockedIds = new Set(stats.achievements.map(a => a.id));
  const newAchievements: Achievement[] = [];
  
  achievements.forEach(achievement => {
    if (unlockedIds.has(achievement.id)) return;
    
    const shouldUnlock = 
      (achievement.type === 'sessions' && stats.totalPomodoros >= achievement.threshold) ||
      (achievement.type === 'streak' && stats.currentStreak >= achievement.threshold);
    
    if (shouldUnlock) {
      newAchievements.push({ ...achievement, unlockedAt: new Date() });
    }
  });
  
  return newAchievements;
}

// Productivity score
export function calculateProductivityScore(sessions: Session[], days: number = 7): number {
  const recentSessions = getSessionsByDateRange(sessions, days);
  const focusSessions = recentSessions.filter(s => s.type === 'focus');
  
  if (focusSessions.length === 0) return 0;
  
  const avgPerDay = focusSessions.length / days;
  const score = Math.min(100, (avgPerDay / 8) * 100); // 8 sessions = 100%
  
  return Math.round(score);
}

// Export data
export function exportToCSV(sessions: Session[]): string {
  const headers = ['Date', 'Type', 'Category', 'Duration (min)', 'Task ID'];
  const rows = sessions.map(s => [
    format(new Date(s.completedAt), 'yyyy-MM-dd HH:mm:ss'),
    s.type,
    s.category,
    Math.round(s.duration / 60),
    s.taskId || 'N/A'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

export function exportToJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}