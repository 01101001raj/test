import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format } from 'date-fns'
import FinancialChart from './charts/FinancialChart'

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Subscription', 'Misc']

const FinancialDomain = () => {
  const [data, setData] = useLocalStorage('financial-data', [])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense', // 'income' or 'expense'
    amount: 0,
    category: 'Food',
    description: '',
    investmentDone: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isEditing) {
      setData(data.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ))
      setIsEditing(false)
      setEditingId(null)
    } else {
      const newEntry = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      setData([...data, newEntry])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      amount: 0,
      category: 'Food',
      description: '',
      investmentDone: false
    })
  }

  const handleEdit = (item) => {
    setFormData(item)
    setIsEditing(true)
    setEditingId(item.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter(item => item.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }))
  }

  // Sort data by date (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Calculate totals
  const totalIncome = data.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = data.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const netAmount = totalIncome - totalExpenses

  // Category breakdown
  const categoryTotals = EXPENSE_CATEGORIES.reduce((acc, category) => {
    acc[category] = data.filter(item => item.type === 'expense' && item.category === category)
                       .reduce((sum, item) => sum + item.amount, 0)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Domain</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span>{data.length} transactions</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Income
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  ₹{totalIncome.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Expenses
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  ₹{totalExpenses.toLocaleString()}
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
      </div>

      {/* Charts */}
      {data.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <FinancialChart data={sortedData} categoryTotals={categoryTotals} />
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="input-field"
              required
            />
          </div>

          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}

          <div className={formData.type === 'expense' ? 'md:col-span-1' : 'md:col-span-2'}>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="investmentDone"
                checked={formData.investmentDone}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Investment Done</span>
            </label>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex space-x-2">
            <button type="submit" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Table */}
      {data.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Investment</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="table-cell font-medium">{item.date}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {item.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={`table-cell font-medium ${
                      item.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                    </td>
                    <td className="table-cell">{item.type === 'expense' ? item.category : '-'}</td>
                    <td className="table-cell">{item.description || '-'}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.investmentDone 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {item.investmentDone ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <DollarSign className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No financial data yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start tracking your finances by adding your first transaction above.
          </p>
        </div>
      )}
    </div>
  )
}

export default FinancialDomain