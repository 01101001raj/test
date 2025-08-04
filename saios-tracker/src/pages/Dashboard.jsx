import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Dashboard() {
  const [physicalData] = useLocalStorage('physical', []);
  const [mentalData] = useLocalStorage('mental', []);
  const [financialData] = useLocalStorage('financial', []);
  const [addictionData] = useLocalStorage('addiction', []);
  const [ritualsData] = useLocalStorage('rituals', []);
  const [projectsData] = useLocalStorage('projects', []);
  const [journalData] = useLocalStorage('journal', []);

  // Calculate recent activity (last 7 days)
  const getRecentActivity = (data, field) => {
    const last7Days = data.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });
    return last7Days.length;
  };

  const domains = [
    { 
      to: '/physical', 
      title: 'Physical', 
      icon: '💪',
      activity: getRecentActivity(physicalData, 'workout'),
      color: 'bg-blue-500'
    },
    { 
      to: '/mental', 
      title: 'Mental', 
      icon: '🧠',
      activity: getRecentActivity(mentalData, 'meditation'),
      color: 'bg-purple-500'
    },
    { 
      to: '/financial', 
      title: 'Financial', 
      icon: '💰',
      activity: getRecentActivity(financialData, 'income'),
      color: 'bg-green-500'
    },
    { 
      to: '/addiction', 
      title: 'Addiction', 
      icon: '🚫',
      activity: getRecentActivity(addictionData, 'cigarettes'),
      color: 'bg-red-500'
    },
    { 
      to: '/rituals', 
      title: 'Rituals', 
      icon: '🙏',
      activity: getRecentActivity(ritualsData, 'meditation'),
      color: 'bg-yellow-500'
    },
    { 
      to: '/journal', 
      title: 'Journal', 
      icon: '📝',
      activity: journalData.length,
      color: 'bg-indigo-500'
    },
    { 
      to: '/projects', 
      title: 'Projects', 
      icon: '📋',
      activity: projectsData.length,
      color: 'bg-gray-500'
    },
  ];

  // Prepare chart data for overall progress
  const chartData = domains.map(domain => ({
    domain: domain.title,
    entries: domain.activity,
  }));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">SaiOS Dashboard</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="text-2xl font-bold">{physicalData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Physical Entries</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="text-2xl font-bold">{mentalData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mental Entries</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="text-2xl font-bold">{journalData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="text-2xl font-bold">{projectsData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
        </div>
      </div>

      {/* Activity Chart */}
      {chartData.some(d => d.entries > 0) && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Recent Activity (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="domain" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="entries"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map(domain => (
          <DomainCard key={domain.to} {...domain} />
        ))}
      </div>
    </div>
  );
}

function DomainCard({ to, title, icon, activity, color }) {
  return (
    <Link to={to} className="bg-white dark:bg-gray-900 p-6 rounded shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
          {activity} entries
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Track your {title.toLowerCase()} progress and habits
      </p>
    </Link>
  );
}