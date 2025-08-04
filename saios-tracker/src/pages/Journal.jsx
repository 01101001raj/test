import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Journal() {
  const [entries, setEntries] = useLocalStorage('journal-entries', []);
  const [content, setContent] = useState('');

  const addEntry = () => {
    if (content.trim()) {
      const newEntry = {
        id: Date.now(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };
      setEntries([newEntry, ...entries]);
      setContent('');
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Daily Journal</h1>

      {/* Add Entry Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">New Journal Entry</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Today's Entry
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field min-h-32 resize-none"
              placeholder="Write your thoughts, experiences, or reflections for today..."
              rows={6}
            />
          </div>
          <button 
            onClick={addEntry}
            disabled={!content.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium mb-4">Recent Entries</h2>
        {entries.length === 0 ? (
          <div className="card p-6 text-center text-gray-500">
            No journal entries yet. Start writing your first entry above.
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="card p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}