import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AvailableTemplates from './AvailableTemplates';
import MyConsents from './MyConsents';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="user-screen" className="screen active">
      <Navbar />

      <div className="main-content">
        <div className="page-hero reveal">
          <div className="page-hero-text">
            <h1>Your Consent Portal</h1>
            <p>Review, sign, and manage all your consent documents in one place.</p>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{pendingCount}</div>
            <div className="hero-stat-label">Pending signatures</div>
          </div>
        </div>

        <div className="tabs-bar reveal" style={{ transitionDelay: '0.1s' }}>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            📋 Pending Consents {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'signed' ? 'active' : ''}`}
            onClick={() => setActiveTab('signed')}
          >
            ✅ My Signed Forms
          </button>
        </div>

        <div className="tab-container">
          <div className={`tab-pane ${activeTab === 'pending' ? 'active' : ''}`}>
            <AvailableTemplates setPendingCount={setPendingCount} />
          </div>
          <div className={`tab-pane ${activeTab === 'signed' ? 'active' : ''}`}>
            <MyConsents />
          </div>
        </div>
      </div>

      <style>{`
        .main-content { flex: 1; padding: 60px 48px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .page-hero {
          background: linear-gradient(135deg, var(--forest-dark) 0%, var(--forest-mid) 100%);
          border-radius: 20px;
          padding: 36px 40px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
        }
        .page-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(232,146,58,0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .page-hero-text h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.9rem;
          color: white;
          margin-bottom: 6px;
        }
        .page-hero-text p { color: var(--sage-light); font-size: 0.95rem; }
        .hero-stat {
          text-align: right;
          position: relative;
          z-index: 2;
        }
        .hero-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3rem;
          color: var(--amber-light);
          line-height: 1;
        }
        .hero-stat-label { color: var(--sage-light); font-size: 0.85rem; margin-top: 4px; }
        .tabs-bar {
          display: flex;
          gap: 4px;
          margin-bottom: 28px;
          border-bottom: 2px solid var(--cream-dark);
          padding-bottom: 0;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border: none;
          background: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 2.5px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: var(--forest);
          border-bottom-color: var(--amber);
          font-weight: 600;
        }
        .tab-btn:hover:not(.active) { color: var(--forest); }
        .tab-badge {
          background: var(--amber);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          min-width: 20px;
          text-align: center;
        }
        .tab-container {
          position: relative;
        }
        .tab-pane {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          top: 0; left: 0; right: 0;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .tab-pane.active {
          opacity: 1;
          visibility: visible;
          position: relative;
        }
        
        .consent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .consent-card {
          background: var(--card);
          border-radius: 16px;
          padding: 24px;
          border: 1.5px solid var(--border);
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        .consent-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          background: var(--forest);
          border-radius: 4px 0 0 4px;
          transition: width 0.3s;
        }
        .consent-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .consent-card:hover::before { width: 6px; }
        .consent-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .consent-card-title {
          font-weight: 600;
          font-size: 1rem;
          color: var(--forest-dark);
        }
        .consent-card-org {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 3px;
        }
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-pending { background: rgba(232,146,58,0.12); color: #B8650A; }
        .status-signed { background: rgba(27,77,62,0.1); color: var(--forest); }
        .status-expired { background: rgba(180,30,30,0.1); color: #B41E1E; }
        .consent-card-meta {
          display: flex;
          gap: 16px;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 14px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          text-align: center;
          background: var(--card);
          border-radius: 20px;
          border: 1.5px dashed var(--border);
        }
        .empty-icon {
          width: 72px; height: 72px;
          background: var(--cream);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .empty-state h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: var(--forest-dark);
          margin-bottom: 8px;
        }
        .empty-state p { color: var(--text-muted); font-size: 0.95rem; max-width: 320px; }
        
        @media (max-width: 768px) {
          .main-content { padding: 24px; }
          .page-hero { flex-direction: column; align-items: flex-start; gap: 20px; }
          .hero-stat { text-align: left; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
