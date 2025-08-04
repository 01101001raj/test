import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const PhysicalChart = ({ data }) => {
  // Take last 30 days of data
  const chartData = data.slice(0, 30).reverse()

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Physical Activity Trends (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const chartDataConfig = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: 'Screen Time (hours)',
        data: chartData.map(item => item.screenTime),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Workout Duration (minutes)',
        data: chartData.map(item => item.workoutDuration),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Cigarettes',
        data: chartData.map(item => item.cigarettes),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="h-96">
      <Line options={options} data={chartDataConfig} />
    </div>
  )
}

export default PhysicalChart