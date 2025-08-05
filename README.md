# HackHunt CTF Platform - Frontend

A modern cyberpunk-themed Capture The Flag (CTF) platform frontend built with React, TypeScript, and Vite.

## 🚀 Features

- **Cyberpunk UI**: Dark theme with neon accents, glitch effects, and terminal-inspired design
- **Google OAuth**: Secure authentication with email whitelist verification
- **Live Updates**: HTTP polling for timer and leaderboard updates
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Challenge System**: Interactive challenge interface with hints and skip options
- **Global Timer**: Real-time countdown with event status indicators
- **Leaderboard**: Live participant rankings and scores

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Cyberpunk CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Google OAuth 2.0 + JWT

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth 2.0 Client ID

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd client
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google Identity Services
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:5173` (development)
   - Your production domain
6. Copy Client ID to `.env`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChallengePage.tsx   # Challenge interface
│   ├── GlobalTimer.tsx     # Event timer
│   ├── LoginPage.tsx       # Google OAuth login
│   ├── WaitingRoom.tsx     # Pre-event lobby
│   └── WinnerPage.tsx      # Results page
├── contexts/            # React contexts
│   ├── AuthContext.tsx     # Authentication state
│   └── EventContext.tsx    # Event/timer state
└── styles/
    └── cyberpunk.css       # Custom cyberpunk styling
```

## 🎮 User Flow

1. **Login**: Google OAuth authentication
2. **Waiting Room**: Pre-event lobby with countdown
3. **Challenge**: Solve CTF challenges with hints
4. **Results**: Final leaderboard and rankings

## 🔄 Polling Strategy

The app uses HTTP polling for live updates:

- **Timer**: Every 2 seconds (`/api/timer`)
- **Leaderboard**: Every 5 seconds (`/api/leaderboard`)
- **Results**: Every 5 seconds (`/api/results/status`)

## 🎨 Cyberpunk Design

- Matrix rain animation background
- Neon glow effects and borders
- Terminal-inspired typography (JetBrains Mono)
- Glitch effects and scan lines
- Responsive grid layouts

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly buttons and inputs
- Optimized for various screen sizes

## 🔒 Security Features

- Google OAuth 2.0 integration
- JWT token management
- Secure token storage (localStorage)
- Input validation and sanitization

## 🚀 Deployment

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

The build outputs to `/dist` directory, ready for static hosting.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID

## 🔧 Customization

### Colors (CSS Variables)

```css
:root {
  --cyber-primary: #00d9ff; /* Cyan */
  --cyber-secondary: #39ff14; /* Green */
  --cyber-accent: #ff1493; /* Pink */
  --cyber-warning: #ffa500; /* Orange */
  --cyber-danger: #ff0040; /* Red */
}
```

### Polling Intervals

Edit `src/contexts/EventContext.tsx`:

```typescript
const timerInterval = setInterval(fetchTimerData, 2000); // 2s
const leaderboardInterval = setInterval(fetchLeaderboard, 5000); // 5s
```

## 📞 Support

For issues and questions:

1. Check browser console for errors
2. Verify Google OAuth configuration
3. Ensure backend API is running
4. Create an issue with detailed information

---

**Built for the cybersecurity community** 🔐
