import { useState, useEffect } from 'react'
import { Activity, Brain, DollarSign, Briefcase, TrendingUp, TrendingDown, Calendar, Target, BookOpen } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [physicalData] = useLocalStorage('physical-data', [])
  const [mentalData] = useLocalStorage('mental-data', [])
  const [financialData] = useLocalStorage('financial-data', [])
  const [projects] = useLocalStorage('projects-data', [])
  const [journalEntries] = useLocalStorage('journal-entries', [])

  // Calculate stats
  const totalEntries = physicalData.length + mentalData.length + financialData.length
  const totalIncome = financialData.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = financialData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const netAmount = totalIncome - totalExpenses

  const completedProjects = projects.filter(project => {
    if (!project.tasks || project.tasks.length === 0) return false
    return project.tasks.every(task => task.status === 'Done')
  }).length

  const totalTasks = projects.reduce((sum, project) => sum + (project.tasks?.length || 0), 0)
  const completedTasks = projects.reduce((sum, project) => 
    sum + (project.tasks?.filter(task => task.status === 'Done').length || 0), 0
  )

  // Recent activity (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const recentPhysical = last7Days.map(date => 
    physicalData.find(item => item.date === date)
  )

  const recentMental = last7Days.map(date => 
    mentalData.find(item => item.date === date)
  )

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activity Trends (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Domain Activity Distribution',
      },
    },
  }

  // Chart data
  const activityTrendData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Deep Work (hours)',
        data: recentMental.map(item => item?.deepWork || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Workout Duration (minutes)',
        data: recentPhysical.map(item => item?.workoutDuration || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Screen Time (hours)',
        data: recentPhysical.map(item => item?.screenTime || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
      },
    ],
  }

  const domainDistributionData = {
    labels: ['Physical', 'Mental', 'Financial', 'Work Projects'],
    datasets: [
      {
        data: [physicalData.length, mentalData.length, financialData.length, projects.length],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Physical Entries
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {physicalData.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Mental Entries
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {mentalData.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className={`h-8 w-8 ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Net Amount
                </dt>
                <dd className={`text-lg font-medium ${netAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{netAmount.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Active Projects
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {projects.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
            </div>
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Completed</span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Journal Entries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{journalEntries.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Keep documenting your thoughts
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialData.length}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">₹{totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm">₹{totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {totalEntries > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
            <div className="h-80">
              <Line options={lineOptions} data={activityTrendData} />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Domain Distribution</h3>
            <div className="h-80">
              <Doughnut options={doughnutOptions} data={domainDistributionData} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Summary */}
      {totalEntries > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Physical</h4>
              <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <p>Gym sessions: {physicalData.filter(item => item.gym).length}</p>
                <p>Cold showers: {physicalData.filter(item => item.coldShower).length}</p>
                <p>Boxing sessions: {physicalData.filter(item => item.boxingPracticed).length}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Mental</h4>
              <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <p>Deep work sessions: {mentalData.filter(item => item.deepWork > 0).length}</p>
                <p>Journal entries: {journalEntries.length}</p>
                <p>Temple visits: {mentalData.filter(item => item.templeVisit).length}</p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Financial</h4>
              <div className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                <p>Income entries: {financialData.filter(item => item.type === 'income').length}</p>
                <p>Expense entries: {financialData.filter(item => item.type === 'expense').length}</p>
                <p>Investments: {financialData.filter(item => item.investmentDone).length}</p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Work</h4>
              <div className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                <p>Active projects: {projects.length}</p>
                <p>Completed projects: {completedProjects}</p>
                <p>Task completion: {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalEntries === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Activity className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome to SaiOS Tracker!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start tracking your life by adding entries to any domain.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Physical
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Brain className="h-3 w-3 mr-1" />
              Mental
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              <DollarSign className="h-3 w-3 mr-1" />
              Financial
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Briefcase className="h-3 w-3 mr-1" />
              Work
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard