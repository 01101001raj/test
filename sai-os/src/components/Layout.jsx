import { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  Brain, 
  DollarSign, 
  Shield, 
  Calendar, 
  BookOpen, 
  FolderOpen,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children, currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'physical', name: 'Physical', icon: Dumbbell },
    { id: 'mental', name: 'Mental', icon: Brain },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'addiction', name: 'Addiction', icon: Shield },
    { id: 'rituals', name: 'Rituals', icon: Calendar },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sai OS</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sai OS</h1>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        currentPage === item.id
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} className="mr-3" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;