import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Physical from './pages/Physical';
import Mental from './pages/Mental';
import Financial from './pages/Financial';
import Work from './pages/Work';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/physical" element={<Physical />} />
        <Route path="/mental" element={<Mental />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/work" element={<Work />} />
      </Routes>
    </Router>
  );
}
