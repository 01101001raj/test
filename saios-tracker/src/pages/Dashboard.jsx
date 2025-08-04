import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Dashboard() {
  const [physicalEntries] = useLocalStorage('physical-entries', []);
  const [mentalEntries] = useLocalStorage('mental-entries', []);
  const [financeEntries] = useLocalStorage('finance-entries', []);
  const [addictionEntries] = useLocalStorage('addiction-entries', []);
  const [ritualsEntries] = useLocalStorage('rituals-entries', []);
  const [projects] = useLocalStorage('projects', []);

  // Calculate recent activity
  const getRecentActivity = () => {
    const allEntries = [
      ...physicalEntries.map(e => ({ ...e, domain: 'Physical' })),
      ...mentalEntries.map(e => ({ ...e, domain: 'Mental' })),
      ...financeEntries.map(e => ({ ...e, domain: 'Finance' })),
      ...addictionEntries.map(e => ({ ...e, domain: 'Addiction' })),
      ...ritualsEntries.map(e => ({ ...e, domain: 'Rituals' })),
    ];
    
    return allEntries
      .sort((a, b) => new Date(b.date || b.id) - new Date(a.date || a.id))
      .slice(0, 10);
  };

  // Calculate project progress
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => 
    p.tasks.length > 0 && p.tasks.every(t => t.completed)
  ).length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.completed).length, 0
  );

  const recentActivity = getRecentActivity();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">SaiOS Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</h3>
          <p className="text-2xl font-bold">
            {physicalEntries.length + mentalEntries.length + financeEntries.length + addictionEntries.length + ritualsEntries.length}
          </p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h3>
          <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
          <p className="text-2xl font-bold">
            {recentActivity.filter(e => {
              const entryDate = new Date(e.date || e.id);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return entryDate >= weekAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DomainCard to="/physical" title="Physical" count={physicalEntries.length} />
        <DomainCard to="/mental" title="Mental" count={mentalEntries.length} />
        <DomainCard to="/financial" title="Finance" count={financeEntries.length} />
        <DomainCard to="/addiction" title="Addiction" count={addictionEntries.length} />
        <DomainCard to="/rituals" title="Rituals" count={ritualsEntries.length} />
        <DomainCard to="/journal" title="Journal" count={0} />
        <DomainCard to="/projects" title="Projects" count={totalProjects} />
      </div>

      {/* Recent Activity */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No recent activity. Start tracking your domains!
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivity.map(entry => (
              <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <span className="font-medium">{entry.domain}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(entry.date || entry.id).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {Object.keys(entry).filter(key => 
                    !['id', 'date', 'domain'].includes(key) && 
                    entry[key] && 
                    entry[key] !== '0'
                  ).slice(0, 3).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DomainCard({ to, title, count }) {
  return (
    <Link to={to} className="card p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-gray-500">entries</p>
      </div>
    </Link>
  );
}