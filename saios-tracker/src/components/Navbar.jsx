import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/physical', label: 'Physical' },
  { to: '/mental', label: 'Mental' },
  { to: '/financial', label: 'Financial' },
  { to: '/addiction', label: 'Addiction' },
  { to: '/rituals', label: 'Rituals' },
  { to: '/journal', label: 'Journal' },
  { to: '/projects', label: 'Projects' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 bg-white dark:bg-black shadow z-10 border-b border-gray-200 dark:border-gray-800">
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
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}