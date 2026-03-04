import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, showAdminShield }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-icon" style={showAdminShield ? { background: 'var(--forest-dark)' } : {}}>
            {showAdminShield ?
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22S2 16.5 2 10.5V5.5L12 2L22 5.5V10.5C22 16.5 12 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              :
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            }
          </div>
          {title || 'ConsentFlow'}
        </div>
        <div className="nav-right">
          <span className="nav-user" style={showAdminShield ? { fontSize: '0.82rem', color: 'var(--text-muted)' } : {}}>
            {showAdminShield ? `Logged in as: ${user?.email}` : `Hello, ${user?.name || 'User'} 👋`}
          </span>
          <button className="nav-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>
      <style>{`
                .navbar {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 20px 48px;
                  background: rgba(248,244,238,0.85);
                  backdrop-filter: blur(20px);
                  border-bottom: 2px solid var(--amber);
                  box-shadow: 0 8px 32px rgba(27,77,62,0.06);
                  position: relative;
                  z-index: 50;
                  width: 100%;
                }
                .nav-brand {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  font-family: 'DM Serif Display', serif;
                  font-size: 1.4rem;
                  color: var(--forest-dark);
                }
                .nav-icon {
                  width: 38px; height: 38px;
                  background: var(--forest);
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 18px;
                }
                .nav-right {
                  display: flex;
                  align-items: center;
                  gap: 20px;
                  font-size: 0.9rem;
                  color: var(--text-body);
                }
                .nav-user {
                  font-weight: 500;
                  color: var(--forest);
                }
                .nav-logout {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  background: none;
                  border: 1.5px solid var(--border);
                  border-radius: 8px;
                  padding: 7px 14px;
                  cursor: pointer;
                  font-family: 'Outfit', sans-serif;
                  font-size: 0.85rem;
                  color: var(--text-body);
                  transition: all 0.2s;
                }
                .nav-logout:hover {
                  background: var(--forest);
                  color: white;
                  border-color: var(--forest);
                }
                @media (max-width: 768px) {
                  .navbar { flex-direction: column; gap: 16px; padding: 16px 24px; }
                }
            `}</style>
    </>
  );
};

export default Navbar;
