'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Target, Clock, Flame, TrendingUp } from 'lucide-react';
import { getTotalFocusTime, getSessionsByDateRange, calculateProductivityScore } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

export default function QuickStats() {
  const { sessions, stats } = useAppStore();
  const todaySessions = getSessionsByDateRange(sessions, 1).filter(s => s.type === 'focus');
  const todayFocusTime = getTotalFocusTime(todaySessions);
  const productivityScore = calculateProductivityScore(sessions, 7);

  const statsData = [
    {
      label: 'Today',
      value: todaySessions.length,
      subtext: formatDuration(todayFocusTime / 60),
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      label: 'Total Sessions',
      value: stats.totalPomodoros,
      subtext: formatDuration(stats.totalFocusTime / 60),
      icon: Clock,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-500/10 to-pink-500/10',
    },
    {
      label: 'Current Streak',
      value: stats.currentStreak,
      subtext: `Best: ${stats.longestStreak} days`,
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      bg: 'from-orange-500/10 to-red-500/10',
    },
    {
      label: 'Productivity',
      value: `${productivityScore}%`,
      subtext: `Level ${stats.level}`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-teal-500',
      bg: 'from-green-500/10 to-teal-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50`} />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{stat.subtext}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}