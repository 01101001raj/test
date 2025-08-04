import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Physical from './pages/Physical';
import Mental from './pages/Mental';
import Financial from './pages/Financial';
import Addiction from './pages/Addiction';
import Rituals from './pages/Rituals';
import Journal from './pages/Journal';
import Projects from './pages/Projects';
import ThemeProvider from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/physical" element={<Physical />} />
          <Route path="/mental" element={<Mental />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/addiction" element={<Addiction />} />
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
