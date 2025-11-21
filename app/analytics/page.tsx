'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Download,
  Calendar,
  ArrowLeft,
  Trophy,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import {
  getSessionsByDateRange,
  getDailyStats,
  getSessionsByCategory,
  getSessionsByHour,
  getTotalFocusTime,
  exportToCSV,
  downloadFile,
  formatDuration,
  getXPProgress,
} from '@/lib/utils';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import AchievementGrid from '@/components/analytics/AchievementGrid';
import { Progress } from '@/components/ui/progress';

const COLORS = {
  work: '#3b82f6',
  study: '#a855f7',
  personal: '#10b981',
  fitness: '#f97316',
  creative: '#ec4899',
};

export default function AnalyticsPage() {
  const { sessions, stats, tasks } = useAppStore();
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  // Calculate data
  const recentSessions = getSessionsByDateRange(sessions, timeRange);
  const focusSessions = recentSessions.filter((s) => s.type === 'focus');
  const dailyStats = getDailyStats(sessions, timeRange);
  const categoryData = getSessionsByCategory(focusSessions);
  const hourlyData = getSessionsByHour(focusSessions);
  const totalFocusTime = getTotalFocusTime(focusSessions);
  const avgSessionsPerDay = focusSessions.length / timeRange;
  const xpProgress = getXPProgress(stats.xp);

  // Prepare chart data
  const dailyChartData = Object.entries(dailyStats)
    .map(([date, count]) => ({
      date: format(new Date(date), 'MMM dd'),
      sessions: count,
    }))
    .reverse();

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    sessions: count,
    color: COLORS[category as keyof typeof COLORS],
  }));

  const hourlyChartData = Object.entries(hourlyData).map(([hour, count]) => ({
    hour: `${hour}:00`,
    sessions: count,
  }));

  const weeklyComparison = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      day: format(date, 'EEE'),
      sessions: dailyStats[dateStr] || 0,
    };
  });

  const productivityMetrics = [
    {
      subject: 'Focus',
      value: Math.min(100, (focusSessions.length / (timeRange * 8)) * 100),
    },
    {
      subject: 'Consistency',
      value: (stats.currentStreak / stats.longestStreak) * 100 || 0,
    },
    {
      subject: 'Completion',
      value:
        (tasks.filter((t) => t.completed).length / Math.max(tasks.length, 1)) * 100,
    },
    {
      subject: 'Variety',
      value: (Object.keys(categoryData).length / 5) * 100,
    },
    {
      subject: 'Efficiency',
      value: Math.min(100, avgSessionsPerDay * 12.5),
    },
  ];

  const handleExport = () => {
    const csv = exportToCSV(sessions);
    downloadFile(csv, `pomodoro-sessions-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your productivity journey
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2 mb-6">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              onClick={() => setTimeRange(days as 7 | 30 | 90)}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              {days} Days
            </Button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {timeRange}d
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{focusSessions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Sessions
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {avgSessionsPerDay.toFixed(1)}/day
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Focus Time
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatDuration(totalFocusTime / 60)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Hours
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDuration(totalFocusTime / 60 / timeRange)}/day
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Days
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Best: {stats.longestStreak} days
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.level}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {xpProgress.current} / {xpProgress.needed} XP
              </div>
              <Progress value={xpProgress.percentage} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Sessions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Daily Sessions
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyChartData}>
                    <defs>
                      <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#sessionGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Weekly Comparison */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  This Week
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="sessions" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Category Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="sessions"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Productivity Radar */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Productivity Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={productivityMetrics}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hourly Activity Pattern</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="#ec4899"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Peak Performance Hours</h3>
                <div className="space-y-3">
                  {Object.entries(hourlyData)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([hour, count]) => (
                      <div key={hour} className="flex items-center gap-3">
                        <div className="w-16 text-sm font-medium">
                          {hour}:00
                        </div>
                        <Progress
                          value={(count / Math.max(...Object.values(hourlyData))) * 100}
                          className="flex-1"
                        />
                        <div className="w-12 text-right text-sm text-gray-600">
                          {count}
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Most Productive Days</h3>
                <div className="space-y-3">
                  {Object.entries(dailyStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center gap-3">
                        <div className="w-24 text-sm font-medium">
                          {format(new Date(date), 'MMM dd')}
                        </div>
                        <Progress
                          value={(count / Math.max(...Object.values(dailyStats))) * 100}
                          className="flex-1"
                        />
                        <div className="w-12 text-right text-sm text-gray-600">
                          {count}
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {Object.entries(categoryData).map(([category, count]) => {
                const categoryTasks = tasks.filter((t) => t.category === category);
                const completedTasks = categoryTasks.filter((t) => t.completed);
                const totalPomodoros = categoryTasks.reduce(
                  (acc, t) => acc + t.pomodorosCompleted,
                  0
                );

                return (
                  <Card key={category} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold capitalize mb-1">
                          {category}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {count} sessions completed
                        </p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{
                          backgroundColor: COLORS[category as keyof typeof COLORS] + '20',
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Tasks
                        </span>
                        <span className="font-medium">
                          {completedTasks.length} / {categoryTasks.length}
                        </span>
                      </div>
                      <Progress
                        value={
                          (completedTasks.length / Math.max(categoryTasks.length, 1)) *
                          100
                        }
                      />

                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Focus Time
                        </span>
                        <span className="font-medium">
                          {formatDuration((count * 25))}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Pomodoros
                        </span>
                        <span className="font-medium">{totalPomodoros}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}