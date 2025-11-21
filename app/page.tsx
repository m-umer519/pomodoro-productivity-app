'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import PomodoroTimer from '@/components/timer/PomodoroTimer';
import TaskList from '@/components/tasks/TaskList';
import QuickStats from '@/components/analytics/QuickStats';
import TodayProgress from '@/components/analytics/TodayProgress';
import { Button } from '@/components/ui/button';
import { BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { timerStatus, tick } = useAppStore();

  // Timer tick effect
  useEffect(() => {
    if (timerStatus !== 'running') return;
    
    const interval = setInterval(() => {
      tick();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerStatus, tick]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pomodoro Focus
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay focused, be productive
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/analytics">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Timer */}
          <div className="lg:col-span-2 space-y-6">
            <PomodoroTimer />
            <QuickStats />
            <TodayProgress />
          </div>

          {/* Right Column - Tasks */}
          <div className="lg:col-span-1">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}