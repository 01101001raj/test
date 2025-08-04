import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { journalService } from '../lib/database';
import { Plus, Trash2, BookOpen, Edit3, Save, X } from 'lucide-react';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    mood: ''
  });

  const moodOptions = [
    { value: '😄', label: '😄 Very Happy', score: 5 },
    { value: '😊', label: '😊 Happy', score: 4 },
    { value: '😐', label: '😐 Neutral', score: 3 },
    { value: '😟', label: '😟 Sad', score: 2 },
    { value: '😢', label: '😢 Very Sad', score: 1 }
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await journalService.getAll();
      setEntries(data);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    try {
      if (editingId) {
        await journalService.update(editingId, {
          content: formData.content,
          mood: formData.mood
        });
        setEditingId(null);
      } else {
        await journalService.add({
          content: formData.content,
          mood: formData.mood
        });
      }
      
      setFormData({ content: '', mood: '' });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      content: entry.content,
      mood: entry.mood
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await journalService.delete(id);
        loadEntries();
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ content: '', mood: '' });
    setShowForm(false);
  };

  const getChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayEntries = entries.filter(entry => entry.date.startsWith(date));
      const moodScores = dayEntries
        .filter(e => e.mood)
        .map(e => {
          const moodOption = moodOptions.find(m => m.value === e.mood);
          return moodOption ? moodOption.score : 3;
        });
      
      const avgMood = moodScores.length > 0 
        ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length 
        : 0;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: avgMood.toFixed(1),
        entries: dayEntries.length
      };
    });
  };

  const getJournalStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date();
    thisMonth.setDate(thisMonth.getDate() - 30);

    const todayEntries = entries.filter(e => e.date.startsWith(today)).length;
    const weekEntries = entries.filter(e => new Date(e.date) >= thisWeek).length;
    const monthEntries = entries.filter(e => new Date(e.date) >= thisMonth).length;
    const totalEntries = entries.length;

    // Calculate average mood
    const moodEntries = entries.filter(e => e.mood);
    const avgMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => {
          const moodOption = moodOptions.find(m => m.value === entry.mood);
          return sum + (moodOption ? moodOption.score : 3);
        }, 0) / moodEntries.length
      : 0;

    const avgMoodEmoji = moodOptions.find(m => Math.abs(m.score - avgMood) === Math.min(...moodOptions.map(mo => Math.abs(mo.score - avgMood))))?.value || '😐';

    return {
      today: todayEntries,
      week: weekEntries,
      month: monthEntries,
      total: totalEntries,
      avgMood: avgMood.toFixed(1),
      avgMoodEmoji
    };
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const stats = getJournalStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="mr-3" />
            Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Capture your thoughts and track your mood</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          New Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold text-green-600">{stats.week}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.month}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Mood</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgMoodEmoji}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{stats.avgMood}/5.0</p>
        </div>
      </div>

      {/* Add/Edit Entry Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How are you feeling?
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="input-field"
              >
                <option value="">Select mood (optional)</option>
                {moodOptions.map(mood => (
                  <option key={mood.value} value={mood.value}>{mood.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field"
                rows="8"
                placeholder="Write about your day, thoughts, feelings, experiences..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getWordCount(formData.content)} words
              </p>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex items-center">
                <Save size={16} className="mr-2" />
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
              <button
                type="button"
                onClick={() => editingId ? cancelEdit() : setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mood Chart */}
      {chartData.some(d => d.mood > 0) && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">30-Day Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                domain={[1, 5]}
                tickFormatter={(value) => {
                  const mood = moodOptions.find(m => m.score === Math.round(value));
                  return mood ? mood.value : value;
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                formatter={(value) => {
                  const mood = moodOptions.find(m => Math.abs(m.score - value) < 0.5);
                  return [mood ? `${mood.value} ${value}` : value, 'Mood'];
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Entries List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Journal Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No journal entries yet. Start writing to capture your thoughts and track your mood!
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {entry.mood && (
                      <span className="text-2xl">{entry.mood}</span>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {getWordCount(entry.content)} words
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;