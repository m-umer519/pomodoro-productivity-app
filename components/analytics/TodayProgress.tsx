'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy } from 'lucide-react';
import { getSessionsByDateRange } from '@/lib/utils';

export default function TodayProgress() {
  const { sessions } = useAppStore();
  const todayGoal = 8; // Default daily goal
  const todaySessions = getSessionsByDateRange(sessions, 1).filter(s => s.type === 'focus');
  const progress = (todaySessions.length / todayGoal) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold">Today's Goal</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Trophy className="w-4 h-4" />
          {todaySessions.length} / {todayGoal} sessions
        </div>
      </div>

      <Progress value={progress} className="h-3 mb-2" />
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {progress >= 100
          ? '🎉 Amazing! You\'ve reached your daily goal!'
          : `${Math.ceil(todayGoal - todaySessions.length)} more sessions to reach your goal`}
      </p>
    </Card>
  );
}