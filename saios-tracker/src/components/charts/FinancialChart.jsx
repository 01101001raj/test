import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const FinancialChart = ({ data, categoryTotals }) => {
  // Group data by month for income vs expense chart
  const monthlyData = data.reduce((acc, item) => {
    const month = item.date.substring(0, 7) // YYYY-MM format
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 }
    }
    acc[month][item.type] += item.amount
    return acc
  }, {})

  const months = Object.keys(monthlyData).sort().slice(-12) // Last 12 months

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses (Last 12 Months)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString()
          }
        }
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expense Categories Breakdown',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ₹' + context.parsed.toLocaleString()
          }
        }
      }
    },
  }

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(month => monthlyData[month]?.income || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: months.map(month => monthlyData[month]?.expense || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const pieData = {
    labels: Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0),
    datasets: [
      {
        data: Object.values(categoryTotals).filter(value => value > 0),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for Food
          'rgba(59, 130, 246, 0.8)',  // Blue for Travel
          'rgba(168, 85, 247, 0.8)',  // Purple for Subscription
          'rgba(34, 197, 94, 0.8)',   // Green for Misc
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const hasExpenseData = Object.values(categoryTotals).some(value => value > 0)

  return (
    <div className="space-y-8">
      <div className="h-96">
        <Bar options={barOptions} data={barData} />
      </div>
      
      {hasExpenseData && (
        <div className="h-96">
          <Pie options={pieOptions} data={pieData} />
        </div>
      )}
    </div>
  )
}

export default FinancialChart