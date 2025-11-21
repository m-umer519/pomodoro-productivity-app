import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // ✅ Make sure this line is present
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pomodoro Focus - Productivity Timer & Task Manager',
  description:
    'A modern, feature-rich Pomodoro timer with task management, analytics, and gamification.',
  keywords: [
    'pomodoro',
    'productivity',
    'timer',
    'task management',
    'focus',
    'time tracking',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(inter.className, 'antialiased')}>{children}</body>
    </html>
  );
}