import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { addictionService } from '../lib/database';
import { Plus, Trash2, Shield, AlertTriangle } from 'lucide-react';

const Addiction = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    count: '',
    notes: ''
  });

  const addictionTypes = [
    'Cigarettes',
    'Porn',
    'Screen Time',
    'Social Media',
    'Gaming',
    'Alcohol',
    'Junk Food'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await addictionService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading addiction entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.count) return;

    try {
      await addictionService.add({
        type: formData.type,
        count: parseInt(formData.count) || 0,
        notes: formData.notes
      });
      
      setFormData({ type: '', count: '', notes: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding addiction entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await addictionService.delete(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting addiction entry:', error);
    }
  };

  const getChartData = () => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split('T')[0];
    });

    return last14Days.map(date => {
      const dayEntries = entries.filter(entry => entry.date.startsWith(date));
      const cigarettes = dayEntries
        .filter(e => e.type === 'Cigarettes')
        .reduce((sum, e) => sum + e.count, 0);
      const screenTime = dayEntries
        .filter(e => e.type === 'Screen Time')
        .reduce((sum, e) => sum + e.count, 0);
      const porn = dayEntries
        .filter(e => e.type === 'Porn')
        .reduce((sum, e) => sum + e.count, 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cigarettes,
        screenTime,
        porn
      };
    });
  };

  const getAddictionStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 14);

    const todayTotal = entries
      .filter(e => e.date.startsWith(today))
      .reduce((sum, e) => sum + e.count, 0);

    const thisWeekTotal = entries
      .filter(e => new Date(e.date) >= thisWeek)
      .reduce((sum, e) => sum + e.count, 0);

    const lastWeekTotal = entries
      .filter(e => new Date(e.date) >= lastWeek && new Date(e.date) < thisWeek)
      .reduce((sum, e) => sum + e.count, 0);

    const improvement = lastWeekTotal > 0 ? ((lastWeekTotal - thisWeekTotal) / lastWeekTotal * 100) : 0;

    return {
      today: todayTotal,
      thisWeek: thisWeekTotal,
      lastWeek: lastWeekTotal,
      improvement: improvement.toFixed(1)
    };
  };

  const getStreakData = () => {
    const streaks = {};
    addictionTypes.forEach(type => {
      const typeEntries = entries
        .filter(e => e.type === type)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (typeEntries.length === 0) {
        streaks[type] = 0;
        return;
      }

      const today = new Date();
      const lastEntry = new Date(typeEntries[0].date);
      const daysSinceLastEntry = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));
      
      streaks[type] = daysSinceLastEntry;
    });

    return streaks;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const stats = getAddictionStats();
  const streaks = getStreakData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="mr-3" />
            Addiction Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and overcome addictive behaviors</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</h3>
              <p className="text-2xl font-bold text-red-600">{stats.today}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.thisWeek}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Week</h3>
          <p className="text-2xl font-bold text-gray-600">{stats.lastWeek}</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Improvement</h3>
              <p className={`text-2xl font-bold ${parseFloat(stats.improvement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.improvement}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Cards */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Clean Streaks (Days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(streaks).map(([type, days]) => (
            <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{type}</p>
              <p className={`text-3xl font-bold ${days >= 7 ? 'text-green-600' : days >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                {days}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {days === 1 ? 'day' : 'days'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Addiction Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select type</option>
                {addictionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count/Duration
              </label>
              <input
                type="number"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                className="input-field"
                placeholder="e.g., 5 cigarettes, 120 minutes"
                required
                min="0"
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
                placeholder="Triggers, feelings, circumstances..."
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

      {/* Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">14-Day Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
            <Line
              type="monotone"
              dataKey="cigarettes"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Cigarettes"
            />
            <Line
              type="monotone"
              dataKey="screenTime"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="Screen Time (hrs)"
            />
            <Line
              type="monotone"
              dataKey="porn"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              name="Porn"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No entries yet. Start tracking to build awareness and overcome addictions.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {entry.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.count} {entry.type === 'Screen Time' ? 'minutes' : 'times'}
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

export default Addiction;