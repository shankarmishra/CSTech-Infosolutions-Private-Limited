import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MERN Admin Dashboard
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/agents" className={isActive('/agents')}>
              Agents
            </Link>
          </li>
          <li>
            <Link to="/lists" className={isActive('/lists')}>
              Lists
            </Link>
          </li>
          <li style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUser />
              {user?.name}
            </span>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <FiLogOut />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 