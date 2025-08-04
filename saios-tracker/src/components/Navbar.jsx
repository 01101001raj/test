import { NavLink } from 'react-router-dom';
import React from 'react';

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
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="sticky top-0 bg-white dark:bg-black shadow z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 text-sm font-medium">
        <div className="flex space-x-4">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="border rounded px-2 py-1"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}