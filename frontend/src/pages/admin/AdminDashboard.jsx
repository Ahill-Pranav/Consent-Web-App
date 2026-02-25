import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, FileText, ShieldCheck } from 'lucide-react';
import TemplateManager from './TemplateManager';
import ConsentAudit from './ConsentAudit';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('templates');

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <ShieldCheck className="h-8 w-8 text-accent" />
                            <span className="ml-2 text-xl font-bold text-primary">Admin Control Panel</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 font-medium">Logged in as: {user?.email}</span>
                            <button
                                onClick={logout}
                                className="text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'templates'
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Manage Templates
                    </button>
                    <button
                        onClick={() => setActiveTab('audits')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'audits'
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Consent Audits
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
                    {activeTab === 'templates' ? <TemplateManager /> : <ConsentAudit />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
