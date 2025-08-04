import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/physical', label: 'Physical' },
  { to: '/mental', label: 'Mental' },
  { to: '/financial', label: 'Financial' },
  { to: '/work', label: 'Work/Wealth' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white dark:bg-black shadow z-10">
      <div className="max-w-6xl mx-auto flex space-x-4 p-4 text-sm font-medium">
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
    </nav>
  );
}