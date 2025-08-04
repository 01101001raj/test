import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { financeService } from '../lib/database';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Finance = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    category: '',
    notes: ''
  });

  const financeTypes = ['Income', 'Expense', 'Savings'];
  const categories = {
    Income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
    Expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'],
    Savings: ['Emergency Fund', 'Investment', 'Retirement', 'Goal', 'Other']
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await financeService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading finance entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.amount || !formData.category) return;

    try {
      await financeService.add({
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes
      });
      
      setFormData({ type: '', amount: '', category: '', notes: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding finance entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await financeService.delete(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting finance entry:', error);
    }
  };

  const getFinanceStats = () => {
    const totalIncome = entries
      .filter(e => e.type === 'Income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = entries
      .filter(e => e.type === 'Expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavings = entries
      .filter(e => e.type === 'Savings')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalSavings,
      balance: totalIncome - totalExpenses
    };
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    entries.forEach(entry => {
      if (!categoryTotals[entry.category]) {
        categoryTotals[entry.category] = 0;
      }
      categoryTotals[entry.category] += entry.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  };

  const getChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayEntries = entries.filter(entry => entry.date.startsWith(date));
      const income = dayEntries
        .filter(e => e.type === 'Income')
        .reduce((sum, e) => sum + e.amount, 0);
      const expenses = dayEntries
        .filter(e => e.type === 'Expense')
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income,
        expenses,
        balance: income - expenses
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const stats = getFinanceStats();
  const categoryData = getCategoryData();
  const chartData = getChartData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="mr-3" />
            Finance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your income, expenses, and savings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">${stats.income.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">${stats.expenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Savings</h3>
              <p className="text-2xl font-bold text-blue-600">${stats.savings.toFixed(2)}</p>
            </div>
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</h3>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.balance.toFixed(2)}
              </p>
            </div>
            {stats.balance >= 0 ? 
              <TrendingUp className="text-green-600" size={24} /> : 
              <TrendingDown className="text-red-600" size={24} />
            }
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Finance Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                className="input-field"
                required
              >
                <option value="">Select type</option>
                {financeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {formData.type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {categories[formData.type]?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Additional details..."
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">30-Day Financial Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value}`}
                  labelLine={false}
                  fontSize={12}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No entries yet. Start tracking your finances!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.type === 'Income' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : entry.type === 'Expense'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {entry.type}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{entry.category}</span>
                    <span className={`text-sm font-medium ${
                      entry.type === 'Income' ? 'text-green-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      ${entry.amount.toFixed(2)}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;