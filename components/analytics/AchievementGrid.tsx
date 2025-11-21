'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { ACHIEVEMENTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { format } from 'date-fns';

export default function AchievementGrid() {
  const { stats } = useAppStore();
  const unlockedIds = new Set(stats.achievements.map((a) => a.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedIds.has(achievement.id);
        const userAchievement = stats.achievements.find((a) => a.id === achievement.id);
        const progress =
          achievement.type === 'sessions'
            ? Math.min(100, (stats.totalPomodoros / achievement.threshold) * 100)
            : Math.min(100, (stats.currentStreak / achievement.threshold) * 100);

        return (
          <Card
            key={achievement.id}
            className={cn(
              'p-6 relative overflow-hidden transition-all',
              isUnlocked
                ? 'border-2 border-yellow-400 shadow-lg'
                : 'opacity-60 grayscale'
            )}
          >
            {isUnlocked && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -mr-16 -mt-16" />
            )}

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{achievement.icon}</div>
                {!isUnlocked && (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {achievement.description}
              </p>

              {!isUnlocked && (
                <>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}

              {isUnlocked && userAchievement?.unlockedAt && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Unlocked on{' '}
                  {format(new Date(userAchievement.unlockedAt), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}