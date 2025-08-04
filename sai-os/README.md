# Sai OS

A comprehensive personal life tracking and management system built with React. Track your physical health, mental wellbeing, finances, habits, rituals, journal entries, and projects all in one place.

## Features

### 🏃‍♂️ Physical Health
- Track workouts, weight, water intake, steps, sleep hours
- Visual weight trend charts
- Daily, weekly, and total statistics

### 🧠 Mental Health
- Log meditation sessions, therapy visits, mood tracking
- Anxiety and stress level monitoring
- 7-day activity trends with interactive charts

### 💰 Finance Management
- Income, expense, and savings tracking
- Category-based organization
- Financial trend analysis and pie charts
- Balance calculations and insights

### 🚫 Addiction Tracking
- Monitor cigarettes, screen time, porn, and other habits
- Clean streak tracking with visual indicators
- Progress improvement calculations
- 14-day trend analysis

### 🕯️ Rituals & Habits
- Track daily rituals like early wake-up, temple visits, walks
- Completion rate monitoring
- Streak tracking for consistent habits
- Weekly completion charts

### 📖 Journal
- Daily journal entries with mood tracking
- Word count and writing statistics
- 30-day mood trend visualization
- Full-text entry management with edit capabilities

### 📋 Project Management
- Create and manage multiple projects
- Add tasks to projects with completion tracking
- Progress bars and completion percentages
- Visual project progress charts

### 🎨 Design & Features
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Mobile-First**: Fully responsive design optimized for mobile devices
- **Offline Capable**: Works offline with IndexedDB storage
- **Fast Loading**: Optimized performance with lazy loading
- **Clean UI**: Minimalist black-and-white design with Tailwind CSS

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with custom components
- **Database**: IndexedDB with Dexie.js for persistent local storage
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel-ready with SPA configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sai-os
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration and deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your web server
3. Configure your server to serve `index.html` for all routes (SPA configuration)

## Data Storage

All data is stored locally in your browser using IndexedDB, ensuring:
- **Privacy**: Your data never leaves your device
- **Offline Access**: Full functionality without internet connection
- **Persistence**: Data survives browser restarts and updates
- **Performance**: Fast local data access

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 10+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Sai OS** - Your personal life management system. Track, analyze, and improve your life across all domains.
