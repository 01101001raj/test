import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { physicalService } from '../lib/database';
import { Plus, Trash2, Dumbbell } from 'lucide-react';

const Physical = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    notes: ''
  });

  const physicalTypes = [
    'Workout',
    'Weight',
    'Water Intake',
    'Steps',
    'Sleep Hours',
    'Heart Rate',
    'Blood Pressure'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await physicalService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading physical entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.value) return;

    try {
      await physicalService.add({
        type: formData.type,
        value: parseFloat(formData.value) || formData.value,
        notes: formData.notes
      });
      
      setFormData({ type: '', value: '', notes: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding physical entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await physicalService.delete(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting physical entry:', error);
    }
  };

  const getChartData = () => {
    // Group entries by date and type for weight tracking
    const weightEntries = entries
      .filter(entry => entry.type === 'Weight')
      .slice(-30) // Last 30 entries
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseFloat(entry.value) || 0
      }));

    return weightEntries;
  };

  const getWorkoutStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const todayWorkouts = entries.filter(e => 
      e.type === 'Workout' && e.date.startsWith(today)
    ).length;

    const weekWorkouts = entries.filter(e => 
      e.type === 'Workout' && new Date(e.date) >= thisWeek
    ).length;

    const totalWorkouts = entries.filter(e => e.type === 'Workout').length;

    return { today: todayWorkouts, week: weekWorkouts, total: totalWorkouts };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const workoutStats = getWorkoutStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Dumbbell className="mr-3" />
            Physical
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your physical health and fitness</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Workouts</h3>
          <p className="text-2xl font-bold text-green-600">{workoutStats.today}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold text-blue-600">{workoutStats.week}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workouts</h3>
          <p className="text-2xl font-bold text-purple-600">{workoutStats.total}</p>
        </div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Physical Entry</h2>
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
                {physicalTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="input-field"
                placeholder="e.g., 70 kg, 30 minutes, 8000 steps"
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
                placeholder="Additional notes..."
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

      {/* Weight Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weight Trend</h3>
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
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No entries yet. Add your first physical activity!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {entry.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.value}
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

export default Physical;