import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend
)

const MentalChart = ({ data }) => {
  // Take last 30 days of data
  const chartData = data.slice(0, 30).reverse()

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Deep Work Hours (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mental Activities Summary (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) {
            return value === 1 ? 'Yes' : 'No'
          }
        }
      },
    },
  }

  const deepWorkData = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: 'Deep Work Hours',
        data: chartData.map(item => item.deepWork),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.1,
      },
    ],
  }

  const activitiesData = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: 'NoFap',
        data: chartData.map(item => item.noFap ? 1 : 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Journaling Done',
        data: chartData.map(item => item.journalingDone ? 1 : 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Temple Visit',
        data: chartData.map(item => item.templeVisit ? 1 : 0),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="h-96">
        <Line options={lineOptions} data={deepWorkData} />
      </div>
      <div className="h-96">
        <Bar options={barOptions} data={activitiesData} />
      </div>
    </div>
  )
}

export default MentalChart