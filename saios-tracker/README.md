# SaiOS - Personal Life Tracker

A comprehensive React web application for tracking various aspects of your life across multiple domains. Built with a clean, minimalist black-and-white UI that's fully mobile-responsive.

## Features

### 📊 Multi-Domain Tracking
- **Physical Health**: Workouts, weight, water intake, steps, sleep
- **Mental Health**: Meditation, mood tracking, therapy sessions, deep work
- **Finance**: Income, expenses, savings, investments
- **Addiction Recovery**: Cigarettes, porn, screen time, gaming, social media
- **Daily Rituals**: Early wake-up, temple visits, walks, cold showers
- **Journal**: Daily text entries with timestamps
- **Projects**: Project management with tasks and progress tracking

### 🎨 Design Features
- Clean, minimalist black-and-white UI
- Dark/light theme switcher (default: dark)
- Fully mobile-responsive design
- Area charts using Recharts for data visualization
- Offline-capable with localStorage persistence

### 📱 Mobile-First Design
- Responsive navigation with horizontal scrolling
- Touch-friendly interface
- Optimized for mobile devices
- Works offline

## Tech Stack

- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful charts and data visualization
- **React Router** - Client-side routing
- **LocalStorage** - Data persistence
- **Vite** - Fast build tool and dev server

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Dashboard
The main dashboard provides an overview of all your tracking data with:
- Quick stats (total entries, active projects, tasks completed)
- Domain cards showing entry counts
- Recent activity feed

### Adding Entries
Each domain has a form to add new entries:
1. Fill in the relevant fields
2. Click "Add Entry" to save
3. View your data in the table below
4. See progress visualized in area charts

### Projects
Create and manage projects:
1. Enter a project name and click "Create Project"
2. Add tasks to each project
3. Check off completed tasks
4. View progress bars for each project

### Journal
Write daily journal entries:
1. Enter your thoughts in the text area
2. Click "Save Entry" to timestamp and save
3. View all entries in chronological order

## Deployment to Vercel

### Automatic Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the React app and deploy

### Manual Deployment
1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npx vercel --prod
```

### Environment Variables
No environment variables are required as all data is stored locally.

## Data Persistence

All data is stored in the browser's localStorage, which means:
- ✅ Data persists between sessions
- ✅ Works offline
- ✅ No server required
- ⚠️ Data is device-specific (not synced across devices)
- ⚠️ Data can be cleared by clearing browser data

## Customization

### Adding New Domains
1. Create a new page component in `src/pages/`
2. Define fields and chart configuration
3. Add the route to `App.jsx`
4. Add navigation link to `Navbar.jsx`

### Styling
The app uses Tailwind CSS with custom components defined in `src/index.css`. You can:
- Modify the color scheme in the CSS variables
- Add new utility classes
- Customize the dark/light theme

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

---

Built with ❤️ for personal development and life tracking.
