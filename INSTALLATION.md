# Installation & Setup Guide

## Quick Start

### 1. Create Next.js Project
```bash
npx create-next-app@latest pomodoro-productivity-app --typescript --tailwind --app
cd pomodoro-productivity-app
```

### 2. Install Dependencies
```bash
npm install zustand recharts date-fns framer-motion lucide-react \
  @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-switch \
  @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-label \
  @radix-ui/react-progress @radix-ui/react-dropdown-menu \
  @radix-ui/react-alert-dialog @radix-ui/react-slot \
  class-variance-authority clsx tailwind-merge
```

### 3. Add Tailwind Animate Plugin
```bash
npm install tailwindcss-animate
```

### 4. Copy All Files
Copy all the provided files into your project following the structure:
- Copy type definitions to `lib/types/index.ts`
- Copy constants to `lib/constants/index.ts`
- Copy utilities to `lib/utils/index.ts`
- Copy store to `lib/store/index.ts`
- Copy all components to their respective folders
- Copy page files to `app/` directory
- Replace `tailwind.config.js`
- Replace `app/globals.css`

### 5. Create Public Assets (Optional)
Create a `public/sounds/` folder and add:
- `notification.mp3` - Timer completion sound
- Ambient sound files (rain, cafe, forest, ocean, white-noise)

You can find free sounds at:
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)

### 6. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Build for Production
```bash
npm run build
npm run start
```

## Troubleshooting

### Module Not Found Errors
Make sure all dependencies are installed:
```bash
npm install
```

### TypeScript Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Dark Mode Not Working
Add this to your `app/layout.tsx`:
```typescript
useEffect(() => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
}, []);
```

## Optional Enhancements

### Add Sound Files
Place MP3 files in `public/sounds/` with these names:
- `notification.mp3`
- `rain.mp3`
- `cafe.mp3`
- `forest.mp3`
- `ocean.mp3`
- `white-noise.mp3`

### Add Favicon
Replace `public/favicon.ico` with your custom icon.

### Environment Variables
Create `.env.local` for future features:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Support
If you encounter issues, check:
1. Node.js version (18+)
2. All dependencies installed
3. File paths match exactly
4. TypeScript compilation succeeds

Happy coding! 🚀