import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import useLocalStorage from '../hooks/useLocalStorage';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function DomainTracker({ title, fields, storageKey, chartConfig }) {
  const [entries, setEntries] = useLocalStorage(storageKey, []);
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])));

  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEntry = () => {
    setEntries([...entries, { ...form, id: Date.now() }]);
    setForm(Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])));
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Prepare chart data if chartConfig provided
  const chartData = React.useMemo(() => {
    if (!chartConfig) return null;
    const labels = entries.map(e => e.date || '')
    const datasets = chartConfig.fields.map((field, idx) => ({
      label: field.label,
      data: entries.map(e => Number(e[field.name] || 0)),
      borderColor: chartConfig.colors[idx % chartConfig.colors.length],
      backgroundColor: chartConfig.colors[idx % chartConfig.colors.length],
    }));
    return { labels, datasets };
  }, [entries, chartConfig]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {fields.map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm mb-1" htmlFor={field.name}>{field.label}</label>
            {field.type === 'select' ? (
              <select id={field.name} name={field.name} value={form[field.name]} onChange={handleChange} className="border rounded p-2">
                <option value="">Select</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'checkbox' ? (
              <input type="checkbox" id={field.name} name={field.name} checked={form[field.name]} onChange={handleChange} />
            ) : (
              <input type={field.type} id={field.name} name={field.name} value={form[field.name]} onChange={handleChange} className="border rounded p-2" />
            )}
          </div>
        ))}
        <button onClick={addEntry} className="bg-black text-white rounded px-4 py-2 h-fit mt-6">Add</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              {fields.map(f => <th key={f.name} className="px-2 py-1 text-left">{f.label}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.slice().reverse().map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                {fields.map(f => (
                  <td key={f.name} className="px-2 py-1">
                    {f.type === 'checkbox' ? (entry[f.name] ? '✔️' : '') : entry[f.name]}
                  </td>
                ))}
                <td className="px-2 py-1"><button onClick={() => deleteEntry(entry.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      {chartConfig && chartData && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          {chartConfig.type === 'bar' ? (
            <Bar data={chartData} />
          ) : (
            <Line data={chartData} />
          )}
        </div>
      )}
    </div>
  );
}