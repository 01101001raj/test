import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';

export default function EnhancedDomainTracker({ 
  title, 
  fields, 
  storageKey, 
  chartConfig,
  showDate = true 
}) {
  const [entries, setEntries] = useLocalStorage(storageKey, []);
  const [form, setForm] = useState(() => 
    Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : '']))
  );

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEntry = () => {
    const newEntry = {
      ...form,
      id: Date.now(),
      date: showDate ? new Date().toISOString().split('T')[0] : new Date().toISOString()
    };
    setEntries([...entries, newEntry]);
    setForm(Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])));
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!chartConfig) return [];
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date || a.id) - new Date(b.date || b.id)
    );
    
    return sortedEntries.map(entry => {
      const dataPoint = {
        date: entry.date || new Date(entry.id).toISOString().split('T')[0],
        ...chartConfig.fields.reduce((acc, field) => {
          acc[field.name] = Number(entry[field.name] || 0);
          return acc;
        }, {})
      };
      return dataPoint;
    });
  }, [entries, chartConfig]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>

      {/* Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Add New Entry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map(field => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-medium mb-2" htmlFor={field.name}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select 
                  id={field.name} 
                  name={field.name} 
                  value={form[field.name]} 
                  onChange={handleChange} 
                  className="input-field"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
                  <label htmlFor={field.name} className="text-sm">{field.label}</label>
                </div>
              ) : (
                <input 
                  type={field.type} 
                  id={field.name} 
                  name={field.name} 
                  value={form[field.name]} 
                  onChange={handleChange} 
                  className="input-field"
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          <div className="flex items-end">
            <button onClick={addEntry} className="btn-primary w-full">
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartConfig && chartData.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Progress Chart</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
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
        </div>
      )}

      {/* Table */}
      <div className="card p-6">
        <h2 className="text-lg font-medium mb-4">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {showDate && <th className="px-3 py-2 text-left font-medium">Date</th>}
                {fields.map(f => (
                  <th key={f.name} className="px-3 py-2 text-left font-medium">
                    {f.label}
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice().reverse().map(entry => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {showDate && (
                    <td className="px-3 py-2">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                    </td>
                  )}
                  {fields.map(f => (
                    <td key={f.name} className="px-3 py-2">
                      {f.type === 'checkbox' ? (entry[f.name] ? '✅' : '❌') : entry[f.name]}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <button 
                      onClick={() => deleteEntry(entry.id)} 
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
    </div>
  );
}