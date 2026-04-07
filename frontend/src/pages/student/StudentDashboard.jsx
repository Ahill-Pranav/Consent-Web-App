import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [signedRecords, setSignedRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tempRes, signedRes] = await Promise.all([
                api.get('/templates'),
                api.get('/consents/my')
            ]);
            
            const fetchedTemplates = tempRes.data?.content || tempRes.data;
            setTemplates(Array.isArray(fetchedTemplates) ? fetchedTemplates : []);
            
            const fetchedRecords = signedRes.data?.content || signedRes.data;
            setSignedRecords(Array.isArray(fetchedRecords) ? fetchedRecords : []);
        } catch (err) {
            console.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async (templateId) => {
        try {
            await api.post(`/consents/${templateId}/sign`, {
                ipAddress: "127.0.0.1",
                userAgent: navigator.userAgent
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to sign doc');
        }
    };

    const pendingTemplates = templates.filter(t => 
        !signedRecords.some(r => r.template?.id === t.id)
    );

    return (
        <div className="min-h-screen bg-cream text-charcoal pb-20">
            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-forest-dark rounded-[32px] p-10 md:p-14 mb-12 shadow-2xl reveal">
                    <div className="absolute -top-[100px] -right-[100px] w-96 h-96 bg-amber/20 rounded-full blur-[80px] animate-pulse-glow z-0"></div>
                    <div className="absolute -bottom-[50px] -left-[50px] w-64 h-64 bg-sage/20 rounded-full blur-[60px] animate-pulse-glow-reverse z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">My Consent Portal</h1>
                            <p className="text-sage-light text-lg">Review and sign pending documents from your mentor.</p>
                        </div>
                        <div className="text-right glass-dark px-6 py-4 rounded-2xl border-white/5">
                            <div className="text-4xl font-serif text-amber-light leading-none">{pendingTemplates.length}</div>
                            <div className="text-sage text-sm font-medium uppercase tracking-wider mt-1">Pending</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b-2 border-forest/10 mb-8 reveal" style={{ transitionDelay: '0.1s' }}>
                    <button 
                        className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === 'pending' ? 'text-forest' : 'text-text-muted hover:text-forest'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Actions
                        {pendingTemplates.length > 0 && (
                            <span className="ml-2 bg-amber text-white px-2 py-0.5 rounded-full text-[10px]">{pendingTemplates.length}</span>
                        )}
                        {activeTab === 'pending' && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-amber rounded-t-full"></div>}
                    </button>
                    <button 
                        className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === 'signed' ? 'text-forest' : 'text-text-muted hover:text-forest'}`}
                        onClick={() => setActiveTab('signed')}
                    >
                        Signed History
                        {activeTab === 'signed' && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-amber rounded-t-full"></div>}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal" style={{ transitionDelay: '0.2s' }}>
                        {activeTab === 'pending' && (
                            pendingTemplates.length === 0 ? (
                                <div className="col-span-full py-20 text-center glass rounded-3xl">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-serif text-forest-dark mb-2">You're all caught up!</h3>
                                    <p className="text-text-muted">No pending consent forms from your mentor.</p>
                                </div>
                            ) : (
                                pendingTemplates.map(template => (
                                    <div key={template.id} className="bg-white p-6 rounded-2xl border border-forest/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber font-serif text-xl group-hover:bg-amber group-hover:text-white transition-colors">{template.title.charAt(0)}</div>
                                            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">Action Required</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-forest-dark mb-1">{template.title}</h3>
                                        <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-grow">{template.description}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-forest/5">
                                            <span className="text-xs font-semibold text-sage uppercase">Version {template.version || 1}.0</span>
                                            <button 
                                                onClick={() => handleSign(template.id)}
                                                className="btn-accent px-4 py-1.5 text-xs shadow-none border border-transparent"
                                            >
                                                Review & Sign
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'signed' && (
                            signedRecords.length === 0 ? (
                                <div className="col-span-full py-20 text-center glass rounded-3xl">
                                    <div className="text-4xl mb-4 opacity-50">📄</div>
                                    <p className="text-text-muted">No signed forms yet.</p>
                                </div>
                            ) : (
                                signedRecords.map(record => (
                                    <div key={record.id} className="bg-white p-6 rounded-2xl border border-forest/5 shadow-sm opacity-80 hover:opacity-100 transition-opacity flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest font-serif text-xl">✓</div>
                                            <span className="px-3 py-1 bg-forest/10 text-forest rounded-full text-[10px] font-bold uppercase tracking-wider">Signed</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-forest-dark mb-1">{record.template?.title || "Legacy Form"}</h3>
                                        <p className="text-xs text-text-muted font-mono bg-charcoal/5 p-2 rounded-lg break-all my-4">Hash: {record.signatureHash.substring(0, 24)}...</p>
                                        <div className="mt-auto pt-4 border-t border-forest/5 flex justify-between items-center text-xs text-sage font-medium">
                                            <span>{new Date(record.signedAt).toLocaleDateString()}</span>
                                            <span>v{record.template?.version || 1}.0</span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
