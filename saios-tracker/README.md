# SaiOS - Personal Life Tracking System

A comprehensive React web application for tracking various aspects of your life across multiple domains. Built with a clean, minimalist black-and-white design that's fully mobile-responsive.

## Features

### 📊 Dashboard
- Aggregated view of all domains
- Recent activity charts using Recharts
- Quick stats overview
- Mobile-friendly navigation

### 🏃‍♂️ Physical Health
- Workout tracking (Cardio, Strength, Yoga, Running, Walking)
- Weight monitoring
- Water intake tracking
- Steps counting
- Sleep hours logging

### 🧠 Mental Health
- Meditation sessions
- Mood tracking
- Therapy session logging
- Reading time
- Gratitude practice
- Stress level monitoring

### 💰 Financial Health
- Income tracking
- Expense monitoring
- Savings goals
- Investment tracking
- Category-based organization

### 🚫 Addiction Recovery
- Cigarette tracking
- Screen time monitoring
- Porn usage tracking
- Alcohol consumption
- Gaming time
- Social media usage

### 🙏 Daily Rituals
- Early wake-up tracking
- Temple visits
- Walking sessions
- Prayer time
- Cold shower logging
- Fasting tracking
- Meditation sessions

### 📝 Journal
- Daily text entries
- Timestamped entries
- Rich text support
- Entry management

### 📋 Projects
- Project creation and management
- Task tracking within projects
- Progress bars based on completion
- Task completion toggling

## Tech Stack

- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful charts and data visualization
- **React Router** - Client-side routing
- **LocalStorage** - Data persistence
- **Vite** - Fast build tool

## Key Features

- ✅ **100% Mobile-Friendly** - Responsive design that works on all devices
- ✅ **Dark/Light Theme** - Toggle between black-and-white themes
- ✅ **Offline Capable** - Works without internet connection
- ✅ **Fast Loading** - Optimized for performance
- ✅ **Data Persistence** - All data stored in LocalStorage
- ✅ **No Backend Required** - Pure frontend application
- ✅ **Vercel Ready** - Easy deployment to Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saios-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Vite project
4. Deploy with default settings

### Option 3: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder contents to your hosting provider

## Data Storage

All data is stored locally in the browser's LocalStorage. This means:
- No server required
- Data persists between sessions
- Works offline
- Data is private and secure

## Customization

### Adding New Domains

1. Create a new page component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Add navigation link to `src/components/Navbar.jsx`
4. Update the dashboard to include the new domain

### Modifying Fields

Each domain page uses the `EnhancedDomainTracker` component. You can customize:
- Field types (text, number, select, checkbox, time)
- Chart configuration
- Color schemes
- Storage keys

### Theme Customization

The app uses Tailwind CSS with a custom dark mode implementation. You can modify:
- Colors in `tailwind.config.js`
- Theme logic in `src/contexts/ThemeContext.jsx`
- CSS variables in `src/index.css`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**SaiOS** - Track your life, master your habits, achieve your goals.
