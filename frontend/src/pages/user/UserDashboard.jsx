import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, FileText, CheckSquare } from 'lucide-react';
import AvailableTemplates from './AvailableTemplates';
import MyConsents from './MyConsents';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('available');

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <CheckSquare className="h-8 w-8 text-success" />
                            <span className="ml-2 text-xl font-bold text-primary">Consent Portal</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 font-medium">Hello, {user?.name}</span>
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex space-x-4 mb-6 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'available'
                                ? 'text-success border-b-2 border-success'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Pending Consents
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'my'
                                ? 'text-success border-b-2 border-success'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <CheckSquare className="h-4 w-4" />
                        My Signed Forms
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
                    {activeTab === 'available' ? <AvailableTemplates /> : <MyConsents />}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
