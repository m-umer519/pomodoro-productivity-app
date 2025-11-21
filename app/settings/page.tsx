'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Clock,
  Bell,
  Volume2,
  Trash2,
  Download,
  Moon,
  Sun,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { AMBIENT_SOUNDS } from '@/lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { settings, updateSettings, clearAllData, exportData } = useAppStore();
  const [isDarkMode, setIsDarkMode] = useState(settings.theme === 'dark');

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleExportData = () => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your productivity experience
            </p>
          </div>
        </div>

        <Tabs defaultValue="timer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Timer Settings */}
          <TabsContent value="timer" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold">Timer Durations</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="focus-duration">Focus Session (minutes)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="focus-duration"
                      min={5}
                      max={60}
                      step={5}
                      value={[settings.focusDuration / 60]}
                      onValueChange={([value]) =>
                        updateSettings({ focusDuration: value * 60 })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={settings.focusDuration / 60}
                      onChange={(e) =>
                        updateSettings({
                          focusDuration: parseInt(e.target.value) * 60,
                        })
                      }
                      className="w-20"
                      min={5}
                      max={60}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="short-break">Short Break (minutes)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="short-break"
                      min={1}
                      max={15}
                      step={1}
                      value={[settings.shortBreakDuration / 60]}
                      onValueChange={([value]) =>
                        updateSettings({ shortBreakDuration: value * 60 })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={settings.shortBreakDuration / 60}
                      onChange={(e) =>
                        updateSettings({
                          shortBreakDuration: parseInt(e.target.value) * 60,
                        })
                      }
                      className="w-20"
                      min={1}
                      max={15}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="long-break">Long Break (minutes)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="long-break"
                      min={10}
                      max={30}
                      step={5}
                      value={[settings.longBreakDuration / 60]}
                      onValueChange={([value]) =>
                        updateSettings({ longBreakDuration: value * 60 })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={settings.longBreakDuration / 60}
                      onChange={(e) =>
                        updateSettings({
                          longBreakDuration: parseInt(e.target.value) * 60,
                        })
                      }
                      className="w-20"
                      min={10}
                      max={30}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="long-break-interval">
                    Long Break Interval (sessions)
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="long-break-interval"
                      min={2}
                      max={8}
                      step={1}
                      value={[settings.longBreakInterval]}
                      onValueChange={([value]) =>
                        updateSettings({ longBreakInterval: value })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={settings.longBreakInterval}
                      onChange={(e) =>
                        updateSettings({
                          longBreakInterval: parseInt(e.target.value),
                        })
                      }
                      className="w-20"
                      min={2}
                      max={8}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Auto-Start Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-breaks">Auto-start Breaks</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically start break timer after focus session
                    </p>
                  </div>
                  <Switch
                    id="auto-breaks"
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoStartBreaks: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-pomodoros">Auto-start Pomodoros</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically start focus session after break
                    </p>
                  </div>
                  <Switch
                    id="auto-pomodoros"
                    checked={settings.autoStartPomodoros}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoStartPomodoros: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-enabled">
                      Desktop Notifications
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified when sessions complete
                    </p>
                  </div>
                  <Switch
                    id="notifications-enabled"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings({ notificationsEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-enabled">Sound Effects</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play sound when timer completes
                    </p>
                  </div>
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      updateSettings({ soundEnabled: checked })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h2 className="text-xl font-semibold">Audio Settings</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="volume">Volume</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.volume * 100]}
                      onValueChange={([value]) =>
                        updateSettings({ volume: value / 100 })
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-right text-sm font-medium">
                      {Math.round(settings.volume * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ambient-sound">Ambient Sound</Label>
                  <Select
                    value={settings.ambientSound || 'none'}
                    onValueChange={(value) =>
                      updateSettings({
                        ambientSound: value === 'none' ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select ambient sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {AMBIENT_SOUNDS.map((sound) => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-orange-600" />
                )}
                <h2 className="text-xl font-semibold">Theme</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Color Preview</h3>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { name: 'Work', color: 'bg-blue-500' },
                  { name: 'Study', color: 'bg-purple-500' },
                  { name: 'Personal', color: 'bg-green-500' },
                  { name: 'Fitness', color: 'bg-orange-500' },
                  { name: 'Creative', color: 'bg-pink-500' },
                ].map((item) => (
                  <div key={item.name} className="text-center">
                    <div
                      className={`${item.color} w-full h-16 rounded-lg mb-2 shadow-md`}
                    />
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold">Export Data</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Download all your tasks, sessions, and statistics as a JSON backup
                file.
              </p>

              <Button onClick={handleExportData} className="gap-2">
                <Download className="w-4 h-4" />
                Export All Data
              </Button>
            </Card>

            <Card className="p-6 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Danger Zone
                </h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Permanently delete all your data including tasks, sessions, and
                statistics. This action cannot be undone.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your tasks, sessions,
                      achievements, and statistics. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAllData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}