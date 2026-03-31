import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TemplateManager from './TemplateManager';
import ConsentAudit from './ConsentAudit';
import UserManager from './UserManager';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('templates');
    const [templateCount, setTemplateCount] = useState(0);
    const [auditCount, setAuditCount] = useState(0);

    return (
        <div className="min-h-screen bg-cream text-charcoal pb-20">
            <div className="max-w-7xl flex-1 px-6 md:px-12 mx-auto w-full mt-12">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-[32px] p-10 md:p-14 mb-12 shadow-2xl reveal flex flex-col md:flex-row justify-between items-center">
                    {/* Background accoutrements */}
                    <div className="absolute -top-[20%] -right-[5%] w-[300px] h-[300px] bg-white opacity-5 rotate-12 rounded-3xl pointer-events-none"></div>
                    <div className="absolute top-10 left-10 w-96 h-96 bg-sage/20 rounded-full blur-[80px] z-0"></div>

                    <div className="relative z-10 w-full mb-8 md:mb-0">
                        <div className="inline-block bg-amber/20 text-amber-light px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-amber/30">
                            Admin Privileges Active
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl tracking-tight color-white text-white mb-2">System Administration</h1>
                        <p className="text-sage-light text-lg">Manage consent templates and monitor audit logs across the platform.</p>
                    </div>
                    
                    <div className="relative z-10 flex gap-4 w-full md:w-auto">
                        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[140px] text-center">
                            <div className="font-serif text-4xl text-white leading-none mb-1">{templateCount}</div>
                            <div className="text-sage-light text-[10px] uppercase tracking-widest font-bold">Templates</div>
                        </div>
                        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[140px] text-center">
                            <div className="font-serif text-4xl text-amber-light leading-none mb-1">{auditCount}</div>
                            <div className="text-sage-light text-[10px] uppercase tracking-widest font-bold">Audits</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-8 border-b-2 border-cream-dark pb-0 reveal" style={{ transitionDelay: '0.1s' }}>
                    <button
                        className={`flex items-center gap-2 px-4 pb-3 border-b-[3px] font-sans text-sm font-semibold transition-all ${activeTab === 'templates' ? 'text-forest border-amber' : 'text-text-muted border-transparent hover:text-forest'}`}
                        onClick={() => setActiveTab('templates')}
                    >
                        📝 Templates
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 pb-3 border-b-[3px] font-sans text-sm font-semibold transition-all ${activeTab === 'users' ? 'text-forest border-amber' : 'text-text-muted border-transparent hover:text-forest'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                    <button
                        className={`flex items-center gap-2 px-4 pb-3 border-b-[3px] font-sans text-sm font-semibold transition-all ${activeTab === 'audits' ? 'text-forest border-amber' : 'text-text-muted border-transparent hover:text-forest'}`}
                        onClick={() => setActiveTab('audits')}
                    >
                        🛡️ Audits
                    </button>
                </div>

                <div className="relative">
                    <div className={`transition-all duration-300 ${activeTab === 'templates' ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                        <TemplateManager setTemplateCount={setTemplateCount} />
                    </div>
                    <div className={`transition-all duration-300 ${activeTab === 'users' ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                        <UserManager />
                    </div>
                    <div className={`transition-all duration-300 ${activeTab === 'audits' ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                        <ConsentAudit setAuditCount={setAuditCount} />
                    </div>
                </div>
            </div>
            
            {/* Inject minimal global admin table styles into head or here safely. These map nicely to existing classNames inside TemplateManager and ConsentAudit */}
            <style>{`
                .admin-table-container { background: white; border-radius: 16px; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); }
                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th { background: var(--cream); padding: 16px 24px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
                .admin-table td { padding: 16px 24px; border-bottom: 1px solid var(--border); font-size: 0.95rem; color: var(--text-body); }
                .admin-table tr:last-child td { border-bottom: none; }
                .admin-table tr:hover { background: var(--warm-white); }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
