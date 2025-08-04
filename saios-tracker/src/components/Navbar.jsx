import { NavLink } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/physical', label: 'Physical' },
  { to: '/mental', label: 'Mental' },
  { to: '/financial', label: 'Finance' },
  { to: '/addiction', label: 'Addiction' },
  { to: '/rituals', label: 'Rituals' },
  { to: '/journal', label: 'Journal' },
  { to: '/projects', label: 'Projects' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 bg-white dark:bg-black shadow z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex space-x-4 text-sm font-medium overflow-x-auto">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white whitespace-nowrap'
                  : 'text-gray-500 hover:text-black dark:hover:text-white whitespace-nowrap'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}