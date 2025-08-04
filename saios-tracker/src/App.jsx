import { useState, useEffect } from 'react'
import { 
  Activity, 
  Brain, 
  DollarSign, 
  Briefcase, 
  BarChart3, 
  Moon, 
  Sun,
  Download,
  Upload
} from 'lucide-react'
import PhysicalDomain from './components/PhysicalDomain'
import MentalDomain from './components/MentalDomain'
import FinancialDomain from './components/FinancialDomain'
import WealthWorkDomain from './components/WealthWorkDomain'
import Dashboard from './components/Dashboard'
import { useLocalStorage } from './hooks/useLocalStorage'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'physical', label: 'Physical', icon: Activity },
  { id: 'mental', label: 'Mental', icon: Brain },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'wealth-work', label: 'Wealth/Work', icon: Briefcase },
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const exportData = () => {
    const data = {
      physical: JSON.parse(localStorage.getItem('physical-data') || '[]'),
      mental: JSON.parse(localStorage.getItem('mental-data') || '[]'),
      financial: JSON.parse(localStorage.getItem('financial-data') || '[]'),
      wealthWork: JSON.parse(localStorage.getItem('wealth-work-data') || '[]'),
      projects: JSON.parse(localStorage.getItem('projects-data') || '[]'),
      journalEntries: JSON.parse(localStorage.getItem('journal-entries') || '[]'),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saios-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.physical) localStorage.setItem('physical-data', JSON.stringify(data.physical))
        if (data.mental) localStorage.setItem('mental-data', JSON.stringify(data.mental))
        if (data.financial) localStorage.setItem('financial-data', JSON.stringify(data.financial))
        if (data.wealthWork) localStorage.setItem('wealth-work-data', JSON.stringify(data.wealthWork))
        if (data.projects) localStorage.setItem('projects-data', JSON.stringify(data.projects))
        if (data.journalEntries) localStorage.setItem('journal-entries', JSON.stringify(data.journalEntries))
        
        alert('Data imported successfully! Please refresh the page.')
      } catch (error) {
        alert('Error importing data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'physical':
        return <PhysicalDomain />
      case 'mental':
        return <MentalDomain />
      case 'financial':
        return <FinancialDomain />
      case 'wealth-work':
        return <WealthWorkDomain />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                SaiOS Tracker
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Export/Import */}
              <button
                onClick={exportData}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Export Data"
              >
                <Download className="h-5 w-5" />
              </button>
              
              <label className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" title="Import Data">
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
