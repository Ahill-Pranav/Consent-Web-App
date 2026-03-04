import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import TemplateManager from './TemplateManager';
import ConsentAudit from './ConsentAudit';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('templates');
    const [templateCount, setTemplateCount] = useState(0);
    const [auditCount, setAuditCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="admin-screen" className="screen active">
            <Navbar />

            <div className="main-content">
                <div className="page-hero reveal admin-hero">
                    <div className="page-hero-text" style={{ zIndex: 2, position: 'relative' }}>
                        <div className="hero-badge">Admin Privileges Active</div>
                        <h1>System Administration</h1>
                        <p>Manage consent templates and monitor audit logs across the platform.</p>
                    </div>
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-value">{templateCount}</div>
                            <div className="stat-label">Active Templates</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{auditCount}</div>
                            <div className="stat-label">Consents Recorded</div>
                        </div>
                    </div>
                </div>

                <div className="tabs-bar reveal" style={{ transitionDelay: '0.1s' }}>
                    <button
                        className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
                        onClick={() => setActiveTab('templates')}
                    >
                        📝 Template Management
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'audits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('audits')}
                    >
                        🛡️ Audit Logs
                    </button>
                </div>

                <div className="tab-container">
                    <div className={`tab-pane ${activeTab === 'templates' ? 'active' : ''}`}>
                        <TemplateManager setTemplateCount={setTemplateCount} />
                    </div>
                    <div className={`tab-pane ${activeTab === 'audits' ? 'active' : ''}`}>
                        <ConsentAudit setAuditCount={setAuditCount} />
                    </div>
                </div>
            </div>

            <style>{`
                .main-content { flex: 1; padding: 60px 48px; max-width: 1200px; margin: 0 auto; width: 100%; }
                .admin-hero {
                    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
                }
                .admin-hero::before {
                    background: radial-gradient(circle, rgba(90,138,117,0.3) 0%, transparent 70%);
                }
                .admin-hero::after {
                    content: '';
                    position: absolute;
                    top: -20%; right: 5%;
                    width: 300px; height: 300px;
                    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z' fill='none' stroke='white' stroke-width='1' opacity='0.04'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-size: contain;
                    pointer-events: none;
                    z-index: 1;
                    transform: rotate(15deg);
                }
                .page-hero {
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
                    border-radius: 50%;
                    animation: pulse-glow 4s ease-in-out infinite;
                }
                .page-hero-text h1 {
                    font-family: 'DM Serif Display', serif;
                    font-size: 2.8rem;
                    letter-spacing: -0.02em;
                    color: white;
                    margin-bottom: 8px;
                }
                .page-hero-text p { color: var(--sage-light); font-size: 1.05rem; }
                .hero-badge {
                    display: inline-block;
                    background: rgba(232, 146, 58, 0.2);
                    color: var(--amber-light);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    border: 1px solid rgba(232, 146, 58, 0.3);
                }
                .stats-row {
                    display: flex;
                    gap: 16px;
                    position: relative;
                    z-index: 2;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 20px 24px;
                    min-width: 160px;
                }
                .stat-value {
                    font-family: 'DM Serif Display', serif;
                    font-size: 2.5rem;
                    color: white;
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .stat-label {
                    color: var(--sage-light);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
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
                
                @media (max-width: 768px) {
                    .main-content { padding: 24px; }
                    .page-hero { flex-direction: column; align-items: flex-start; gap: 24px; }
                    .stats-row { width: 100%; flex-wrap: wrap; }
                    .stat-card { flex: 1; min-width: 140px; }
                }

                /* Admin Table Styles (used by child components) */
                .admin-table-container {
                  background: white;
                  border-radius: 16px;
                  border: 1px solid var(--border);
                  overflow: hidden;
                  box-shadow: var(--shadow);
                }
                .admin-table {
                  width: 100%;
                  border-collapse: collapse;
                  text-align: left;
                }
                .admin-table th {
                  background: var(--cream);
                  padding: 16px 24px;
                  font-size: 0.8rem;
                  font-weight: 700;
                  color: var(--text-muted);
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  border-bottom: 1px solid var(--border);
                }
                .admin-table td {
                  padding: 16px 24px;
                  border-bottom: 1px solid var(--border);
                  font-size: 0.95rem;
                  color: var(--text-body);
                }
                .admin-table tr:last-child td { border-bottom: none; }
                .admin-table tr:hover { background: var(--warm-white); }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
