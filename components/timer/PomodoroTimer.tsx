'use client';

import { useAppStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProgressRing from './ProgressRing';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PomodoroTimer() {
  const {
    timerStatus,
    currentSessionType,
    timeRemaining,
    sessionsUntilLongBreak,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalDuration =
    currentSessionType === 'focus'
      ? settings.focusDuration
      : currentSessionType === 'shortBreak'
      ? settings.shortBreakDuration
      : settings.longBreakDuration;

  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  const sessionConfig = {
    focus: {
      title: 'Focus Time',
      icon: Brain,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/10 to-purple-600/10',
      accentColor: 'text-blue-600 dark:text-blue-400',
    },
    shortBreak: {
      title: 'Short Break',
      icon: Coffee,
      gradient: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-500/10 to-teal-600/10',
      accentColor: 'text-green-600 dark:text-green-400',
    },
    longBreak: {
      title: 'Long Break',
      icon: Zap,
      gradient: 'from-orange-500 to-pink-600',
      bgGradient: 'from-orange-500/10 to-pink-600/10',
      accentColor: 'text-orange-600 dark:text-orange-400',
    },
  };

  const config = sessionConfig[currentSessionType];
  const IconComponent = config.icon;

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50`}
      />

      <div className="relative p-8">
        {/* Session Type Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${config.accentColor}`}>
                {config.title}
              </h2>
              {currentSessionType === 'focus' && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sessionsUntilLongBreak} sessions until long break
                </p>
              )}
            </div>
          </div>

          {/* Session indicators */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < 4 - sessionsUntilLongBreak
                    ? `bg-gradient-to-br ${config.gradient}`
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center py-12">
          <ProgressRing
            progress={progress}
            size={280}
            strokeWidth={12}
            gradient={config.gradient}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={timeRemaining}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div className={`text-7xl font-bold ${config.accentColor} mb-2`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {timerStatus === 'running'
                    ? 'In Progress'
                    : timerStatus === 'paused'
                    ? 'Paused'
                    : 'Ready to Start'}
                </div>
              </motion.div>
            </AnimatePresence>
          </ProgressRing>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            disabled={timerStatus === 'idle'}
            className="h-12 w-12"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            size="lg"
            onClick={timerStatus === 'running' ? pauseTimer : startTimer}
            className={`h-16 w-16 rounded-full bg-gradient-to-br ${config.gradient} hover:opacity-90 transition-all transform hover:scale-105 shadow-xl`}
          >
            {timerStatus === 'running' ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={skipSession}
            className="h-12 w-12"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Motivational message */}
        {timerStatus === 'running' && currentSessionType === 'focus' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "Focus is the gateway to productivity"
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}