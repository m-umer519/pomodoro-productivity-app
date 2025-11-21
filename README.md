# 🍅 Pomodoro Focus - Advanced Productivity App

A modern, feature-rich Pomodoro timer application built with Next.js 14, TypeScript, and Tailwind CSS. Track your productivity with beautiful analytics, manage tasks efficiently, and gamify your focus sessions.

![Pomodoro Focus](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

### 🎯 Core Pomodoro Functionality
- **Customizable Timer**: Adjust focus (5-60 min), short break (1-15 min), and long break (10-30 min) durations
- **Auto-Start Options**: Automatically start breaks or focus sessions
- **Session Tracking**: Visual indicators for sessions until long break
- **Smart Controls**: Play, pause, reset, and skip session controls

### 📋 Task Management
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Rich Task Properties**:
  - Title and description
  - Category (Work, Study, Personal, Fitness, Creative)
  - Priority levels (High, Medium, Low)
  - Deadlines with calendar picker
  - Estimated Pomodoros vs Completed tracking
- **Task Assignment**: Link tasks to focus sessions
- **Completion Tracking**: Mark tasks as complete with visual feedback

### 📊 Advanced Analytics Dashboard
- **8+ Chart Types**:
  - Daily sessions area chart
  - Weekly comparison bar chart
  - Category distribution pie chart
  - Productivity metrics radar chart
  - Hourly activity heatmap
  - Peak performance analysis
- **Time Range Filters**: View stats for 7, 30, or 90 days
- **Category Insights**: Deep dive into each category with task completion rates
- **Productivity Score**: AI-calculated score based on your activity

### 🏆 Gamification System
- **XP & Leveling**: Earn 10 XP per completed session
- **7 Achievements**: Unlock badges for milestones
  - First Session 🎯
  - Getting Started (10 sessions) 🚀
  - Focused Mind (50 sessions) 🧠
  - Productivity Master (100 sessions) 👑
  - Marathon Runner (500 sessions) 🏆
  - Weekly Warrior (7-day streak) ⚡
  - Monthly Champion (30-day streak) 🔥
- **Streak Tracking**: Current and longest streak calculation
- **Progress Visualization**: Level progress bars and achievement grids

### 🎨 Modern UX/UI
- **Glassmorphism Design**: Beautiful frosted glass effects
- **Dark Mode Support**: Toggle between light and dark themes
- **Gradient Accents**: Dynamic color gradients for each session type
- **Responsive Layout**: Fully mobile-optimized
- **Smooth Animations**: Framer Motion powered transitions
- **Progress Rings**: Circular progress indicators for timer

### 🔔 Notifications & Sounds
- **Desktop Notifications**: Browser push notifications
- **Completion Sounds**: Audio feedback for session completion
- **Ambient Sounds**: 5 focus-enhancing background sounds
  - Rain ☔
  - Café ☕
  - Forest 🌲
  - Ocean Waves 🌊
  - White Noise 📻
- **Volume Control**: Adjustable sound levels

### 💾 Data Management
- **Local Storage**: All data persists in browser
- **Export Functionality**: Download sessions as CSV
- **Full Backup**: Export all data as JSON
- **Data Import**: Restore from backup files
- **Clear Data**: Nuclear option with confirmation dialog

### 📈 Statistics Tracked
- Total Pomodoros completed
- Total focus time (hours)
- Current streak (days)
- Longest streak (days)
- Level and XP
- Sessions per day average
- Category distribution
- Hourly productivity patterns
- Daily/weekly/monthly trends
- Task completion rates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/m-umer519/pomodoro-productivity-app.git
cd pomodoro-productivity-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
pomodoro-productivity-app/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── analytics/page.tsx    # Analytics dashboard
│   ├── settings/page.tsx     # Settings page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── timer/                # Timer components
│   ├── tasks/                # Task management
│   ├── analytics/            # Analytics components
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── store/                # Zustand store
│   ├── types/                # TypeScript types
│   ├── constants/            # App constants
│   └── utils/                # Utility functions
└── public/                   # Static assets
```

## 🎯 Usage Guide

### Creating a Task
1. Click the "Add" button in the Tasks panel
2. Fill in task details (title, category, priority, deadline, estimated Pomodoros)
3. Click "Create Task"

### Starting a Focus Session
1. Select a task (optional) by clicking the play icon
2. Click the large play button in the timer
3. Focus until the timer completes
4. Take a break when prompted

### Viewing Analytics
1. Click "Analytics" in the header
2. Select time range (7, 30, or 90 days)
3. Explore different tabs:
   - **Overview**: Charts and weekly comparison
   - **Trends**: Hourly patterns and top days
   - **Categories**: Category-specific insights
   - **Achievements**: Unlock progress

### Customizing Settings
1. Click the settings icon
2. Adjust timer durations
3. Configure notifications and sounds
4. Toggle dark mode
5. Export or clear data

## 🎨 Customization

### Changing Colors
Edit `lib/constants/index.ts` to modify category and priority colors:

```typescript
export const CATEGORY_COLORS = {
  work: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  // ... add your colors
};
```

### Adding New Categories
1. Update `TaskCategory` type in `lib/types/index.ts`
2. Add colors to `CATEGORY_COLORS` in `lib/constants/index.ts`
3. Add option in `TaskDialog.tsx`

### Custom Achievements
Edit `ACHIEVEMENTS` array in `lib/constants/index.ts`:

```typescript
{
  id: 'custom',
  title: 'Custom Achievement',
  description: 'Your description',
  icon: '🎯',
  threshold: 100,
  type: 'sessions'
}
```

## 📝 Roadmap

- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Team collaboration features
- [ ] Cloud sync with authentication
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Pomodoro templates
- [ ] Focus mode (block distracting sites)
- [ ] Spotify integration
- [ ] AI-powered task suggestions
- [ ] Weekly/monthly reports via email

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- UI Design inspired by Linear, Notion, and Stripe
- Icons by Lucide
- Charts by Recharts

## 💬 Support

For support, email support@pomodorofocus.app or open an issue on GitHub.

---

**Built with ❤️ using Next.js 14**