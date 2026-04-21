import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Train, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <Train size={32} color="var(--primary)" />
          <span>CaptainTrains</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/trains" className={`nav-link ${location.pathname === '/trains' ? 'active' : ''}`}>Book Ticket</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                  <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: 'var(--accent)' }}>Admin Panel</Link>
              )}
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <User size={18} /> Logout ({user.name.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '20px' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
