import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mentalService } from '../lib/database';
import { Plus, Trash2, Brain } from 'lucide-react';

const Mental = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    notes: ''
  });

  const mentalTypes = [
    'Meditation',
    'Therapy',
    'Mood',
    'Anxiety Level',
    'Stress Level',
    'Sleep Quality',
    'Energy Level'
  ];

  const moodOptions = ['😢 Very Sad', '😟 Sad', '😐 Neutral', '😊 Happy', '😄 Very Happy'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await mentalService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading mental entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.value) return;

    try {
      await mentalService.add({
        type: formData.type,
        value: formData.value,
        notes: formData.notes
      });
      
      setFormData({ type: '', value: '', notes: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error adding mental entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await mentalService.delete(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting mental entry:', error);
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
      const meditation = dayEntries.filter(e => e.type === 'Meditation').length;
      const therapy = dayEntries.filter(e => e.type === 'Therapy').length;
      const mood = dayEntries.filter(e => e.type === 'Mood').length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        meditation,
        therapy,
        mood
      };
    });
  };

  const getMentalStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const todayMeditation = entries.filter(e => 
      e.type === 'Meditation' && e.date.startsWith(today)
    ).length;

    const weekMeditation = entries.filter(e => 
      e.type === 'Meditation' && new Date(e.date) >= thisWeek
    ).length;

    const totalMeditation = entries.filter(e => e.type === 'Meditation').length;

    return { today: todayMeditation, week: weekMeditation, total: totalMeditation };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const mentalStats = getMentalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Brain className="mr-3" />
            Mental
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your mental health and wellbeing</p>
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
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Meditation</h3>
          <p className="text-2xl font-bold text-purple-600">{mentalStats.today}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold text-blue-600">{mentalStats.week}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</h3>
          <p className="text-2xl font-bold text-green-600">{mentalStats.total}</p>
        </div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Mental Health Entry</h2>
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
                {mentalTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              {formData.type === 'Mood' ? (
                <select
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select mood</option>
                  {moodOptions.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 20 minutes, 8/10, completed session"
                  required
                />
              )}
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
                placeholder="How are you feeling? What did you work on?"
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

      {/* Activity Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Mental Health Activity</h3>
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
            <Bar dataKey="meditation" fill="#8b5cf6" name="Meditation" />
            <Bar dataKey="therapy" fill="#06b6d4" name="Therapy" />
            <Bar dataKey="mood" fill="#84cc16" name="Mood Check" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No entries yet. Start tracking your mental health!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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

export default Mental;