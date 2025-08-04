import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ritualsService } from '../lib/database';
import { Plus, Trash2, Calendar, Check, X } from 'lucide-react';

const Rituals = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    completed: false,
    notes: ''
  });

  const ritualTypes = [
    'Early Wake-up',
    'Temple Visit',
    'Morning Walk',
    'Evening Walk',
    'Prayer',
    'Reading',
    'Exercise',
    'Meditation'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await ritualsService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading ritual entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) return;

    try {
      await ritualsService.add({
        type: formData.type,
        completed: formData.completed,
        notes: formData.notes
      });
      
      setFormData({ type: '', completed: false, notes: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding ritual entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ritualsService.delete(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting ritual entry:', error);
    }
  };

  const toggleCompleted = async (id, currentStatus) => {
    try {
      await ritualsService.update(id, { completed: !currentStatus });
      loadEntries();
    } catch (error) {
      console.error('Error updating ritual:', error);
    }
  };

  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayEntries = entries.filter(entry => entry.date.startsWith(date));
      const completed = dayEntries.filter(e => e.completed).length;
      const total = dayEntries.length;
      const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0;

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        total,
        completionRate: parseFloat(completionRate)
      };
    });
  };

  const getRitualStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const todayEntries = entries.filter(e => e.date.startsWith(today));
    const todayCompleted = todayEntries.filter(e => e.completed).length;
    const todayTotal = todayEntries.length;

    const weekEntries = entries.filter(e => new Date(e.date) >= thisWeek);
    const weekCompleted = weekEntries.filter(e => e.completed).length;
    const weekTotal = weekEntries.length;

    const totalCompleted = entries.filter(e => e.completed).length;
    const totalEntries = entries.length;

    return {
      today: {
        completed: todayCompleted,
        total: todayTotal,
        rate: todayTotal > 0 ? (todayCompleted / todayTotal * 100).toFixed(1) : 0
      },
      week: {
        completed: weekCompleted,
        total: weekTotal,
        rate: weekTotal > 0 ? (weekCompleted / weekTotal * 100).toFixed(1) : 0
      },
      overall: {
        completed: totalCompleted,
        total: totalEntries,
        rate: totalEntries > 0 ? (totalCompleted / totalEntries * 100).toFixed(1) : 0
      }
    };
  };

  const getStreakData = () => {
    const streaks = {};
    ritualTypes.forEach(type => {
      const typeEntries = entries
        .filter(e => e.type === type && e.completed)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (typeEntries.length === 0) {
        streaks[type] = 0;
        return;
      }

      let currentStreak = 0;
      const today = new Date();
      
      for (let i = 0; i < typeEntries.length; i++) {
        const entryDate = new Date(typeEntries[i].date);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (entryDate.toDateString() === expectedDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      streaks[type] = currentStreak;
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
  const stats = getRitualStats();
  const streaks = getStreakData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-3" />
            Rituals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your daily rituals and habits</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Ritual
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.today.completed}/{stats.today.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{stats.today.rate}% completion</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.week.completed}/{stats.week.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{stats.week.rate}% completion</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.overall.completed}/{stats.overall.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{stats.overall.rate}% completion</p>
        </div>
      </div>

      {/* Streak Cards */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Streaks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(streaks).map(([type, days]) => (
            <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{type}</p>
              <p className={`text-3xl font-bold ${days >= 7 ? 'text-green-600' : days >= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Ritual Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ritual Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select ritual</option>
                {ritualTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="completed" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Completed
              </label>
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
                placeholder="How did it go? Any observations..."
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Ritual
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

      {/* Completion Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Completion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
            <Bar 
              dataKey="completionRate" 
              fill="#06b6d4" 
              name="Completion Rate (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Rituals</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No rituals yet. Start building positive habits!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCompleted(entry.id, entry.completed)}
                      className={`p-1 rounded-full ${
                        entry.completed 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-gray-500'
                      }`}
                    >
                      {entry.completed ? <Check size={16} /> : <X size={16} />}
                    </button>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.completed
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {entry.type}
                    </span>
                    <span className={`text-sm font-medium ${
                      entry.completed ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {entry.completed ? 'Completed' : 'Pending'}
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

export default Rituals;