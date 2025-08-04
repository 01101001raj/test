import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Physical from './pages/Physical';
import Mental from './pages/Mental';
import Finance from './pages/Finance';
import Addiction from './pages/Addiction';
import Rituals from './pages/Rituals';
import Journal from './pages/Journal';
import Projects from './pages/Projects';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'physical':
        return <Physical />;
      case 'mental':
        return <Mental />;
      case 'finance':
        return <Finance />;
      case 'addiction':
        return <Addiction />;
      case 'rituals':
        return <Rituals />;
      case 'journal':
        return <Journal />;
      case 'projects':
        return <Projects />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
