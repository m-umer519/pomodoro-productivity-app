import { Achievement, TaskCategory } from '../types';

export const CATEGORY_COLORS: Record<TaskCategory, { bg: string; text: string; border: string }> = {
  work: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  study: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  personal: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  fitness: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  creative: { bg: 'bg-pink-100 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
};

export const PRIORITY_COLORS = {
  high: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-300' },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300' },
  low: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300' },
};

export const DEFAULT_TIMER_SETTINGS = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Session', description: 'Complete your first Pomodoro', icon: '🎯', threshold: 1, type: 'sessions' },
  { id: 'starter', title: 'Getting Started', description: 'Complete 10 Pomodoros', icon: '🚀', threshold: 10, type: 'sessions' },
  { id: 'focused', title: 'Focused Mind', description: 'Complete 50 Pomodoros', icon: '🧠', threshold: 50, type: 'sessions' },
  { id: 'master', title: 'Productivity Master', description: 'Complete 100 Pomodoros', icon: '👑', threshold: 100, type: 'sessions' },
  { id: 'marathon', title: 'Marathon Runner', description: 'Complete 500 Pomodoros', icon: '🏆', threshold: 500, type: 'sessions' },
  { id: 'week', title: 'Weekly Warrior', description: '7-day streak', icon: '⚡', threshold: 7, type: 'streak' },
  { id: 'month', title: 'Monthly Champion', description: '30-day streak', icon: '🔥', threshold: 30, type: 'streak' },
];

export const MOTIVATIONAL_QUOTES = [
  "Great work! You're building momentum! 🚀",
  "Focus is the gateway to productivity! 💪",
  "Another step closer to your goals! 🎯",
  "You're on fire! Keep it up! 🔥",
  "Consistency is the key to success! ⭐",
  "Amazing focus! You're unstoppable! 💎",
];

export const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Rain', url: '/sounds/rain.mp3' },
  { id: 'cafe', name: 'Café', url: '/sounds/cafe.mp3' },
  { id: 'forest', name: 'Forest', url: '/sounds/forest.mp3' },
  { id: 'ocean', name: 'Ocean Waves', url: '/sounds/ocean.mp3' },
  { id: 'white-noise', name: 'White Noise', url: '/sounds/white-noise.mp3' },
];