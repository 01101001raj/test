import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">SaiOS Tracker Dashboard</h1>
      <p className="mb-4">Welcome! Select a domain to start tracking your life metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DomainCard to="/physical" title="Physical" />
        <DomainCard to="/mental" title="Mental" />
        <DomainCard to="/financial" title="Financial" />
        <DomainCard to="/work" title="Work/Wealth" />
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