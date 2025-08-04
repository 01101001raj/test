# SaiOS Tracker & Dashboard

A comprehensive personal life tracking system built with React and Tailwind CSS. Track your physical activities, mental wellness, finances, and work projects all in one place.

## Features

### 🧠 Four Tracking Domains

#### 1. Physical Domain
- Wake/Sleep time tracking
- Cigarette consumption monitoring
- Screen time tracking
- Gym sessions and workout duration
- Cold shower and boxing practice tracking
- Visual charts showing trends

#### 2. Mental Domain
- Deep work hours tracking
- NoFap progress
- Journaling completion
- Temple visit tracking
- Full journal entry system with date-based entries
- Mental activity trend charts

#### 3. Financial Domain
- Income and expense tracking
- Category-based expense classification (Food, Travel, Subscription, Misc)
- Investment tracking
- Financial overview charts (Income vs Expenses, Category breakdown)
- Multiple transactions per day support

#### 4. Wealth/Work Domain
- Project management with progress tracking
- Task management with status tracking (To Do, In Progress, Done)
- Automatic progress bars based on task completion
- Project and task relationship management

### 📊 Dashboard & Analytics
- Comprehensive overview dashboard combining all domains
- Interactive charts using Chart.js
- Activity trends and statistics
- Domain distribution visualization
- Recent activity summaries

### 🎯 Additional Features
- **Dark/Light Mode Toggle**: Full theme switching capability
- **Data Persistence**: All data stored locally using localStorage
- **Export/Import**: Backup your data as JSON files
- **Responsive Design**: Mobile-friendly interface
- **Clean UI**: Minimalist black and white design with color accents in charts
- **Real-time Updates**: All charts and statistics update automatically

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: localStorage for data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
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

### Building for Production

```bash
npm run build
```

## Usage

1. **Start Tracking**: Navigate to any domain tab and start adding your daily entries
2. **View Progress**: Check the Dashboard for an overview of all your activities
3. **Analyze Trends**: Use the charts in each domain to understand your patterns
4. **Manage Projects**: Create projects and break them down into manageable tasks
5. **Journal**: Document your thoughts and experiences in the Mental domain
6. **Export Data**: Use the export feature to backup your data regularly

## Data Structure

All data is stored locally in your browser's localStorage. The app creates separate storage keys for each domain:

- `physical-data`: Physical activity entries
- `mental-data`: Mental activity entries
- `financial-data`: Financial transactions
- `projects-data`: Projects and tasks
- `journal-entries`: Journal entries
- `darkMode`: Theme preference

## Features in Detail

### Physical Tracking
Track daily physical activities including sleep patterns, workout sessions, and habits. Visual charts help you identify trends and maintain consistency.

### Mental Wellness
Monitor your mental health through deep work tracking, journaling, and spiritual practices. The journal system allows for detailed reflection and growth tracking.

### Financial Management
Keep track of income, expenses, and investments. Categorized expenses help you understand spending patterns, while charts provide visual insights into your financial health.

### Project Management
Organize your work and personal projects with a built-in task management system. Progress bars automatically update based on task completion status.

### Dashboard Analytics
Get a bird's-eye view of all your activities with comprehensive charts and statistics. Track your overall progress across all life domains.

## Contributing

This is a personal tracking application. Feel free to fork and customize it for your own needs.

## License

MIT License - feel free to use and modify as needed.

---

**SaiOS Tracker** - Your personal life operating system for tracking and optimizing all aspects of your life.
