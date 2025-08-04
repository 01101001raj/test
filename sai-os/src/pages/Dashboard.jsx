import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  physicalService, 
  mentalService, 
  financeService, 
  addictionService, 
  ritualsService, 
  journalService 
} from '../lib/database';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    physical: [],
    mental: [],
    finance: [],
    addiction: [],
    rituals: [],
    journal: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [physical, mental, finance, addiction, rituals, journal] = await Promise.all([
        physicalService.getAll(),
        mentalService.getAll(),
        financeService.getAll(),
        addictionService.getAll(),
        ritualsService.getAll(),
        journalService.getAll()
      ]);

      // Process data for charts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartData = last7Days.map(date => {
        const physicalCount = physical.filter(p => p.date.startsWith(date)).length;
        const mentalCount = mental.filter(m => m.date.startsWith(date)).length;
        const financeCount = finance.filter(f => f.date.startsWith(date)).length;
        const addictionCount = addiction.filter(a => a.date.startsWith(date)).length;
        const ritualsCount = rituals.filter(r => r.date.startsWith(date) && r.completed).length;
        const journalCount = journal.filter(j => j.date.startsWith(date)).length;

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          physical: physicalCount,
          mental: mentalCount,
          finance: financeCount,
          addiction: addictionCount,
          rituals: ritualsCount,
          journal: journalCount
        };
      });

      setStats({
        physical,
        mental,
        finance,
        addiction,
        rituals,
        journal,
        chartData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDomainStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return [
      {
        name: 'Physical',
        total: stats.physical.length,
        today: stats.physical.filter(p => p.date.startsWith(today)).length,
        color: '#10b981',
        icon: Activity
      },
      {
        name: 'Mental',
        total: stats.mental.length,
        today: stats.mental.filter(m => m.date.startsWith(today)).length,
        color: '#8b5cf6',
        icon: Target
      },
      {
        name: 'Finance',
        total: stats.finance.length,
        today: stats.finance.filter(f => f.date.startsWith(today)).length,
        color: '#f59e0b',
        icon: TrendingUp
      },
      {
        name: 'Addiction',
        total: stats.addiction.length,
        today: stats.addiction.filter(a => a.date.startsWith(today)).length,
        color: '#ef4444',
        icon: TrendingDown
      },
      {
        name: 'Rituals',
        total: stats.rituals.filter(r => r.completed).length,
        today: stats.rituals.filter(r => r.date.startsWith(today) && r.completed).length,
        color: '#06b6d4',
        icon: Target
      },
      {
        name: 'Journal',
        total: stats.journal.length,
        today: stats.journal.filter(j => j.date.startsWith(today)).length,
        color: '#84cc16',
        icon: Activity
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const domainStats = getDomainStats();
  const pieData = domainStats.map(stat => ({
    name: stat.name,
    value: stat.total,
    color: stat.color
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your progress across all domains</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {domainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.total}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Today: {stat.today}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            7-Day Activity Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.chartData}>
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
              <Area
                type="monotone"
                dataKey="physical"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="mental"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="finance"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="rituals"
                stackId="1"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="journal"
                stackId="1"
                stroke="#84cc16"
                fill="#84cc16"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Domain Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
                fontSize={12}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.physical.slice(0, 3).map((entry, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Physical: {entry.type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {stats.mental.slice(0, 2).map((entry, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Mental: {entry.type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;