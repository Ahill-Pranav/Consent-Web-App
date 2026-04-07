import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Plus, Info, Check, X, Clock, Power, Edit3, History } from 'lucide-react';

const MentorDashboard = () => {
    const { user, logout } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    
    // Stats Modal State
    const [statsModalOpen, setStatsModalOpen] = useState(false);
    const [statsTemplate, setStatsTemplate] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    
    // Pagination & Search State
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [assignedStudentIds, setAssignedStudentIds] = useState([]);
    const [allMyStudents, setAllMyStudents] = useState([]);

    useEffect(() => {
        fetchTemplates();
    }, [page, search]);

    useEffect(() => {
        fetchMyStudents();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/templates?page=${page}&size=6&search=${search}`);
            // Backend returns a Page object now
            if (res.data.content) {
                setTemplates(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                setTemplates(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            toast.error("Failed to fetch templates");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyStudents = async () => {
        try {
            const res = await api.get('/auth/my-students');
            setAllMyStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students");
        }
    };

    const handleOpenModal = (template = null) => {
        if (template) {
            setEditingId(template.id);
            setTitle(template.title);
            setDescription(template.description);
            setContent(template.content);
            setAssignedStudentIds(template.assignedStudentIds || []);
        } else {
            setEditingId(null);
            setTitle('');
            setDescription('');
            setContent('');
            setAssignedStudentIds([]);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(editingId ? "Publishing new version..." : "Creating template...");
        try {
            const payload = { title, description, content, isActive: true, assignedStudentIds };
            if (editingId) {
                await api.put(`/templates/${editingId}`, payload);
                toast.success("New version published successfully", { id: loadToast });
            } else {
                await api.post('/templates', payload);
                toast.success("Template created successfully", { id: loadToast });
            }
            setShowModal(false);
            fetchTemplates();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save template", { id: loadToast });
        }
    };

    const toggleStudent = (id) => {
        setAssignedStudentIds(prev => 
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await api.patch(`/templates/${id}/status?active=${!currentStatus}`);
            toast.success(currentStatus ? "Template archived" : "Template activated");
            fetchTemplates();
        } catch (err) {
            toast.error("Failed to toggle status");
        }
    };

    const handleOpenHistory = async (templateId) => {
        setHistoryLoading(true);
        setShowHistoryModal(true);
        setHistoryData([]);
        try {
            const res = await api.get(`/templates/${templateId}/history`);
            setHistoryData(res.data);
        } catch (err) {
            toast.error("Failed to fetch history");
            setShowHistoryModal(false);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleOpenStats = async (template) => {
        setStatsTemplate(template);
        setStatsData(null);
        setStatsLoading(true);
        setStatsModalOpen(true);
        try {
            const res = await api.get(`/templates/${template.id}/stats`);
            setStatsData(res.data);
        } catch (error) {
            toast.error("Failed to load template statistics.");
        } finally {
            setStatsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream text-charcoal pb-20">
            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-forest rounded-[32px] p-10 md:p-14 mb-12 shadow-xl reveal flex flex-col md:flex-row justify-between items-center border border-forest-mid">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-bl from-amber-light/20 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 blur-[80px]"></div>
                    
                    <div className="relative z-10 w-full">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Manage Forms</h1>
                        <p className="text-sage-light text-lg mb-8 max-w-xl">Create and version-control consent templates for your assigned students.</p>
                        
                        <button 
                            onClick={() => handleOpenModal()} 
                            className="btn-accent inline-flex w-auto px-8 gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Template
                        </button>
                    </div>

                    <div className="relative z-10 mt-8 md:mt-0 glass-dark p-6 rounded-2xl w-full md:w-auto text-center shrink-0 border border-white/10">
                        <div className="text-5xl font-serif text-amber-light leading-none">{templates.filter(t => t.active).length}</div>
                        <div className="text-sage text-sm font-medium uppercase tracking-wider mt-2">Visible Here</div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between reveal" style={{ transitionDelay: '0.1s' }}>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search templates..." 
                            className="form-input pl-12 bg-white"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-forest-dark hidden md:block">Your Templates</h2>
                        <span className="text-xs text-text-muted hidden md:block bg-forest/5 px-3 py-1 rounded-full">Showing {templates.length} results</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal" style={{ transitionDelay: '0.2s' }}>
                        {templates.map(template => (
                            <div key={template.id} className={`bg-white p-6 rounded-2xl border ${template.active ? 'border-forest/10 shadow-md' : 'border-gray-200 opacity-60 bg-gray-50'} transition-all duration-300 flex flex-col`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-xl ${template.active ? 'bg-amber/10 text-amber' : 'bg-gray-200 text-gray-500'}`}>
                                            {template.title.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-forest uppercase tracking-wider">v{template.version || 1}.0</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${template.active ? 'bg-sage/10 text-forest border-sage/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        {template.active ? 'Active' : 'Archived'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-forest-dark mb-2">{template.title}</h3>
                                <p className="text-sm text-text-muted line-clamp-2 mb-6 grow">{template.description}</p>
                                
                                {/* Action Buttons */}
                                <div className="mt-auto pt-4 border-t border-forest/5 flex flex-wrap gap-2 justify-end">
                                    <button 
                                        onClick={() => handleToggleStatus(template.id, template.active)}
                                        className="btn-accent bg-none! bg-white! text-forest! border border-forest/20 shadow-none hover:shadow-none hover:bg-forest/5 px-3 py-1.5 text-xs gap-1"
                                    >
                                        <Power className="w-3.5 h-3.5" />
                                        {template.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        onClick={() => handleOpenHistory(template.id)}
                                        className="btn-accent bg-none! bg-white! text-forest! border border-forest/20 shadow-none hover:shadow-none hover:bg-forest/5 px-3 py-1.5 text-xs gap-1"
                                    >
                                        <History className="w-3.5 h-3.5" />
                                        History
                                    </button>
                                    <button 
                                        onClick={() => handleOpenStats(template)}
                                        className="btn-accent bg-none! bg-white! text-forest! border border-forest/20 shadow-none hover:shadow-none hover:bg-forest/5 px-3 py-1.5 text-xs gap-1"
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                        Stats
                                    </button>
                                    <button 
                                        onClick={() => handleOpenModal(template)}
                                        className="btn-accent px-3 py-1.5 text-xs gap-1 shadow-none"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-4 reveal">
                            <button 
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-xl border border-forest/10 hover:bg-forest/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-forest" />
                            </button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i ? 'bg-forest text-white shadow-lg' : 'bg-white border border-forest/5 text-forest hover:bg-forest/5'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={page === totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-xl border border-forest/10 hover:bg-forest/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-forest" />
                            </button>
                        </div>
                    )}
                    </>
                )}
            </main>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="glass bg-white/95 w-full max-w-2xl rounded-3xl p-8 relative z-10 animate-reveal-up shadow-2xl border border-white translate-y-0">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif text-forest-dark">{editingId ? 'Edit Draft / New Version' : 'Create Template'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {editingId && (
                            <div className="mb-6 p-4 bg-amber/10 border border-amber/20 rounded-xl text-sm text-forest-dark flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber shrink-0" />
                                <p>Saving edits will automatically publish a <strong>new version</strong> of this form, archiving the previous version to protect existing signatures.</p>
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="form-label">Title</label>
                                <input required type="text" className="form-input bg-white" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Field Trip Consent Form" />
                            </div>
                            <div>
                                <label className="form-label">Short Description</label>
                                <input required type="text" className="form-input bg-white" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary for students..." />
                            </div>
                            <div>
                                <label className="form-label">Full Consent Document</label>
                                <textarea required rows="6" className="form-input bg-white resize-none" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter the full legal/consent text here..."></textarea>
                            </div>
                            
                            <div>
                                <label className="form-label">Assign Students</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    {allMyStudents.length > 0 ? allMyStudents.map(student => (
                                        <div 
                                            key={student.id} 
                                            onClick={() => toggleStudent(student.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${assignedStudentIds.includes(student.id) ? 'bg-forest/10 border-forest text-forest shadow-sm' : 'bg-white border-gray-100 text-text-muted hover:border-forest/20'}`}
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${assignedStudentIds.includes(student.id) ? 'bg-forest border-forest text-white' : 'border-gray-300'}`}>
                                                {assignedStudentIds.includes(student.id) && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold leading-none">{student.name}</span>
                                                <span className="text-[10px] opacity-70 leading-normal">{student.email}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 text-center py-4 text-xs text-text-muted italic">No students assigned to you.</div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-text-muted hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary w-auto px-8">{editingId ? 'Publish New Version' : 'Publish Template'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* History Modal */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}></div>
                    <div className="glass bg-white/95 w-full max-w-lg rounded-3xl p-8 relative z-10 animate-reveal-up shadow-2xl border border-white">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-2xl font-serif text-forest-dark flex items-center gap-2"><Clock className="w-6 h-6 text-amber" /> Version History</h3>
                            <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {historyLoading ? (
                            <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin"></div></div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {historyData.map((hist, idx) => (
                                    <div key={hist.id} className="relative pl-6 pb-4 border-l-2 border-forest/10 last:border-0 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cream border-2 border-amber"></div>
                                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-forest">Version {hist.version}.0</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${hist.active ? 'bg-sage/20 text-forest' : 'bg-gray-200 text-gray-500'}`}>{hist.active ? 'Active' : 'Archived'}</span>
                                            </div>
                                            <div className="text-xs text-text-muted mb-2">Created on {new Date(hist.createdAt).toLocaleDateString()}</div>
                                            <p className="text-sm text-charcoal line-clamp-3">{hist.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Stats Modal */}
            {statsModalOpen && statsTemplate && (
                <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(13,43,34,0.6)', backdropFilter: 'blur(8px)', zIndex: 100, alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setStatsModalOpen(false)}>
                    <div className="modal animate-reveal-up" onClick={e => e.stopPropagation()} style={{ background: 'var(--cream)', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 120px rgba(13,43,34,0.3)', border: '1px solid var(--border)', borderTop: '6px solid var(--forest)' }}>
                        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--forest-dark)', marginBottom: '0', lineHeight: '1' }}>Form Statistics</h3>
                            <button onClick={() => setStatsModalOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.2rem', color: 'var(--text-muted)' }}>✕</button>
                        </div>
                        <div className="modal-body overflow-y-auto" style={{ padding: '32px' }}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Signed</span>
                                    <span className="text-2xl font-serif text-forest">{statsLoading ? '-' : statsData?.totalSigned || 0}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Pending</span>
                                    <span className="text-2xl font-serif text-amber">{statsLoading ? '-' : statsData?.totalPending || 0}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Created By</span>
                                    <span className="text-forest-dark font-medium">{statsTemplate.createdBy || 'System Admin'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Version</span>
                                    <span className="text-forest-dark font-medium">v{statsTemplate.version || 1}.0</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statsTemplate.active ? 'bg-forest/10 text-forest' : 'bg-red-100 text-red-600'}`}>{statsTemplate.active ? 'Active' : 'Archived / Draft'}</span>
                                </div>
                            </div>

                            <h4 className="font-bold text-forest-dark mb-4 uppercase tracking-wider text-sm">Assigned Students</h4>
                            
                            {statsLoading ? (
                                <div className="flex justify-center p-6 text-sage"><div className="w-6 h-6 animate-spin rounded-full border-2 border-sage border-t-transparent"></div></div>
                            ) : statsData?.students && statsData.students.length > 0 ? (
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                                    {statsData.students.map(student => (
                                        <div key={student.id} className="flex flex-wrap items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-forest-dark text-sm">{student.name}</span>
                                                <span className="text-xs text-text-muted">{student.email}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                {student.hasSigned ? (
                                                    <>
                                                        <span className="text-xs font-bold text-forest bg-forest/10 px-2 py-1 rounded-md">Signed</span>
                                                        <span className="text-[10px] text-text-muted mt-1">{new Date(student.signedAt).toLocaleDateString()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-bold text-amber bg-amber/10 px-2 py-1 rounded-md">Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 text-text-muted bg-gray-50 rounded-xl border border-gray-100 text-sm">
                                    No students have been assigned to this template.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
