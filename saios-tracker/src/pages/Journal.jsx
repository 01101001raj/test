import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Journal() {
  const [entries, setEntries] = useLocalStorage('journal', []);
  const [currentEntry, setCurrentEntry] = useState('');

  const addEntry = () => {
    if (currentEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        text: currentEntry,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };
      setEntries([...entries, newEntry]);
      setCurrentEntry('');
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Daily Journal</h1>

      {/* Entry Form */}
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="journal-entry">
            Today's Entry
          </label>
          <textarea
            id="journal-entry"
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white resize-none"
            placeholder="Write your thoughts, feelings, or experiences for today..."
          />
        </div>
        <button
          onClick={addEntry}
          disabled={!currentEntry.trim()}
          className="bg-black dark:bg-white text-white dark:text-black rounded px-6 py-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
        {entries.slice().reverse().map(entry => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(entry.timestamp)}
              </span>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {entry.text}
            </p>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No journal entries yet. Start writing your first entry above.
          </p>
        )}
      </div>
    </div>
  );
}