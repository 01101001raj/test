import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const domainKeys = [
  { key: 'physicalData', label: 'Physical', color: '#4ade80' },
  { key: 'mentalData', label: 'Mental', color: '#60a5fa' },
  { key: 'financialData', label: 'Financial', color: '#facc15' },
  { key: 'addictionData', label: 'Addiction', color: '#f87171' },
  { key: 'ritualsData', label: 'Rituals', color: '#34d399' },
  { key: 'journalData', label: 'Journal', color: '#a78bfa' },
  { key: 'projectsData', label: 'Projects', color: '#f472b6' },
];

export default function Dashboard() {
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    const map = new Map();
    domainKeys.forEach(({ key }) => {
      const entries = JSON.parse(localStorage.getItem(key) || '[]');
      entries.forEach((e) => {
        const date = e.date || 'Unknown';
        if (!map.has(date)) map.set(date, { date });
        map.get(date)[key] = (map.get(date)[key] || 0) + 1;
      });
    });
    const arr = Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    setAggregatedData(arr);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">SaiOS Tracker Dashboard</h1>

      {aggregatedData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow h-64 mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {domainKeys.map((d) => (
                <Area
                  key={d.key}
                  type="monotone"
                  dataKey={d.key}
                  stroke={d.color}
                  fill={d.color}
                  fillOpacity={0.1}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mb-4">Select a domain to start tracking your life metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DomainCard to="/physical" title="Physical" />
        <DomainCard to="/mental" title="Mental" />
        <DomainCard to="/financial" title="Financial" />
        <DomainCard to="/addiction" title="Addiction" />
        <DomainCard to="/rituals" title="Rituals" />
        <DomainCard to="/journal" title="Journal" />
        <DomainCard to="/projects" title="Projects" />
      </div>
    </div>
  );
}

function DomainCard({ to, title }) {
  return (
    <Link to={to} className="border rounded p-6 hover:bg-gray-100 dark:hover:bg-gray-800 flex justify-center items-center text-xl font-medium h-32">
      {title}
    </Link>
  );
}