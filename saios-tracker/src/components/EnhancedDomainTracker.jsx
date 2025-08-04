import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';

export default function EnhancedDomainTracker({ title, fields, storageKey, chartConfig }) {
  const [entries, setEntries] = useLocalStorage(storageKey, []);
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])));

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEntry = () => {
    const newEntry = { 
      ...form, 
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    setEntries([...entries, newEntry]);
    setForm(Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])));
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Prepare chart data for Recharts
  const chartData = useMemo(() => {
    if (!chartConfig) return [];
    
    return entries
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => {
        const dataPoint = { date: entry.date };
        chartConfig.fields.forEach(field => {
          dataPoint[field.name] = Number(entry[field.name] || 0);
        });
        return dataPoint;
      });
  }, [entries, chartConfig]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {fields.map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm mb-1 font-medium" htmlFor={field.name}>{field.label}</label>
            {field.type === 'select' ? (
              <select 
                id={field.name} 
                name={field.name} 
                value={form[field.name]} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="">Select</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={field.name} 
                  name={field.name} 
                  checked={form[field.name]} 
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">{field.label}</span>
              </div>
            ) : (
              <input 
                type={field.type} 
                id={field.name} 
                name={field.name} 
                value={form[field.name]} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder={field.placeholder || ''}
              />
            )}
          </div>
        ))}
        <button 
          onClick={addEntry} 
          className="bg-black dark:bg-white text-white dark:text-black rounded px-4 py-2 h-fit mt-6 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Add Entry
        </button>
      </div>

      {/* Chart */}
      {chartConfig && chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Progress Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              {chartConfig.fields.map((field, index) => (
                <Area
                  key={field.name}
                  type="monotone"
                  dataKey={field.name}
                  stackId="1"
                  stroke={chartConfig.colors[index % chartConfig.colors.length]}
                  fill={chartConfig.colors[index % chartConfig.colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-2 py-3 text-left font-semibold">Date</th>
              {fields.map(f => (
                <th key={f.name} className="px-2 py-3 text-left font-semibold">{f.label}</th>
              ))}
              <th className="px-2 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice().reverse().map(entry => (
              <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-2 py-3">{entry.date}</td>
                {fields.map(f => (
                  <td key={f.name} className="px-2 py-3">
                    {f.type === 'checkbox' ? (entry[f.name] ? '✅' : '❌') : entry[f.name]}
                  </td>
                ))}
                <td className="px-2 py-3">
                  <button 
                    onClick={() => deleteEntry(entry.id)} 
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}