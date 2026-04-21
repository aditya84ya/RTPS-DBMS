import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TrainsList from './pages/TrainsList';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
        <Router>
        <div className="railway-bg">
            <div className="track"></div>
            <div className="ties"></div>
        </div>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trains" element={<TrainsList />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
