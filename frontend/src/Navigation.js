import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (!token) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>ERP System</h2>
        </div>
        <div className="nav-links">
          <Link 
            to="/branches" 
            className={location.pathname === '/branches' ? 'active' : ''}
          >
            <i className="fas fa-building"></i>
            Branches
          </Link>
          <Link 
            to="/units" 
            className={location.pathname === '/units' ? 'active' : ''}
          >
            <i className="fas fa-cube"></i>
            Units
          </Link>
        </div>
        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 