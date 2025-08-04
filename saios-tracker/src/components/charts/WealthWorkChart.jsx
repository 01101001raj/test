import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const WealthWorkChart = ({ projects }) => {
  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length
    return Math.round((completedTasks / project.tasks.length) * 100)
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Project Progress Overview',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const project = projects[context.dataIndex]
            const totalTasks = project.tasks?.length || 0
            const completedTasks = project.tasks?.filter(task => task.status === 'Done').length || 0
            return `Progress: ${context.parsed.y}% (${completedTasks}/${totalTasks} tasks)`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      },
    },
  }

  const data = {
    labels: projects.map(project => project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name),
    datasets: [
      {
        label: 'Progress',
        data: projects.map(project => calculateProgress(project)),
        backgroundColor: projects.map(project => {
          const progress = calculateProgress(project)
          if (progress === 100) return 'rgba(34, 197, 94, 0.8)' // Green for completed
          if (progress >= 50) return 'rgba(59, 130, 246, 0.8)' // Blue for in progress
          if (progress > 0) return 'rgba(249, 115, 22, 0.8)' // Orange for started
          return 'rgba(156, 163, 175, 0.8)' // Gray for not started
        }),
        borderColor: projects.map(project => {
          const progress = calculateProgress(project)
          if (progress === 100) return 'rgba(34, 197, 94, 1)'
          if (progress >= 50) return 'rgba(59, 130, 246, 1)'
          if (progress > 0) return 'rgba(249, 115, 22, 1)'
          return 'rgba(156, 163, 175, 1)'
        }),
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="h-96">
      <Bar options={options} data={data} />
    </div>
  )
}

export default WealthWorkChart