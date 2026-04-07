import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const TemplateManager = ({ setTemplateCount }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Search
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [statsModalOpen, setStatsModalOpen] = useState(false);
    const [statsTemplate, setStatsTemplate] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', content: '', active: true, assignedStudentIds: [] });
    const [allStudents, setAllStudents] = useState([]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/templates?page=${page}&size=10&search=${search}`);
            if (res.data.content) {
                setTemplates(res.data.content);
                setTotalPages(res.data.totalPages);
                if (setTemplateCount) setTemplateCount(res.data.totalElements);
            } else {
                setTemplates(Array.isArray(res.data) ? res.data : []);
            }
        } catch (error) {
            toast.error("Failed to fetch templates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [page, search, setTemplateCount]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/auth/users');
                setAllStudents(res.data.filter(u => u.role === 'STUDENT'));
            } catch (error) {
                console.error("Failed to load students", error);
            }
        };
        fetchStudents();
    }, []);

    const openModal = (template = null) => {
        if (template) {
            setCurrentTemplate(template);
            setFormData({
                title: template.title,
                description: template.description || '',
                content: template.content,
                active: template.active !== undefined ? template.active : true,
                assignedStudentIds: template.assignedStudentIds || []
            });
        } else {
            setCurrentTemplate(null);
            setFormData({ title: '', description: '', content: '', active: true, assignedStudentIds: [] });
        }
        setIsModalOpen(true);
    };

    const handleStudentToggle = (studentId) => {
        setFormData(prev => {
            const isAssigned = prev.assignedStudentIds.includes(studentId);
            return {
                ...prev,
                assignedStudentIds: isAssigned 
                    ? prev.assignedStudentIds.filter(id => id !== studentId)
                    : [...prev.assignedStudentIds, studentId]
            };
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTemplate(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(currentTemplate ? "Updating template..." : "Creating template...");
        try {
            if (currentTemplate) {
                await api.put(`/templates/${currentTemplate.id}`, formData);
                toast.success("Template updated successfully", { id: loadToast });
            } else {
                await api.post('/templates', formData);
                toast.success("Template created successfully", { id: loadToast });
            }
            fetchTemplates();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save template", { id: loadToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete (soft delete) this template?")) {
            const loadToast = toast.loading("Deleting template...");
            try {
                await api.delete(`/templates/${id}`);
                toast.success("Template deleted", { id: loadToast });
                fetchTemplates();
            } catch (error) {
                toast.error("Failed to delete template", { id: loadToast });
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const loadToast = toast.loading(currentStatus ? "Deactivating template..." : "Activating template...");
        try {
            await api.patch(`/templates/${id}/status?active=${!currentStatus}`);
            toast.success(currentStatus ? "Template deactivated" : "Template activated", { id: loadToast });
            fetchTemplates();
        } catch (error) {
            toast.error("Failed to toggle status", { id: loadToast });
        }
    };

    const handleRowClick = async (template) => {
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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading templates...</div>;

    return (
        <div className="reveal" style={{ animationDelay: '0.1s' }}>
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-forest-dark mb-2">Consent Templates</h2>
                    <p className="text-text-muted text-sm">Administrators manage master versions of all platform forms.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        type="search" 
                        placeholder="Search templates..." 
                        className="form-input pl-10 text-sm py-2 bg-cream/30"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title & Description</th>
                            <th>Status</th>
                            <th>Created On</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map(t => (
                            <tr key={t.id} onClick={() => handleRowClick(t)} className={`hover:bg-forest/5 cursor-pointer transition-colors ${t.active ? 'row-active' : 'row-inactive'}`} style={{ position: 'relative' }}>
                                <td style={{ position: 'relative', paddingLeft: '32px' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '4px' }}>{t.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.description || "No description provided."}</div>
                                </td>
                                <td>
                                    {t.active ?
                                        <span className="status-badge status-signed" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--forest)' }}></span>Active</span> :
                                        <span className="status-badge status-expired" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#B41E1E', animation: 'pulse-dot 2s infinite' }}></span>Draft</span>
                                    }
                                </td>
                                <td>
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(t); }}
                                        className="bg-cream border border-gray-200 rounded-md px-3 py-1.5 text-xs cursor-pointer mr-2 text-forest font-medium hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(t.id, t.active); }}
                                        className="bg-cream border border-gray-200 rounded-md px-3 py-1.5 text-xs cursor-pointer mr-2 text-forest-dark font-medium hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        {t.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                        className="bg-cream border border-gray-200 rounded-md px-3 py-1.5 text-xs cursor-pointer text-red-600 font-medium hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {templates.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '0' }}>
                                    <div style={{ padding: '80px 40px', textAlign: 'center', position: 'relative', background: 'var(--cream)' }}>
                                        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '180px', height: '180px', opacity: '0.04', color: 'var(--forest-dark)' }} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                        </svg>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>No templates found</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Get started by creating your first consent template.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-3">
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 rounded-lg border border-forest/10 hover:bg-forest/5 disabled:opacity-20 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-forest" />
                    </button>
                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${page === i ? 'bg-forest text-white' : 'bg-white border border-forest/5 text-forest hover:bg-forest/5'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={page === totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 rounded-lg border border-forest/10 hover:bg-forest/5 disabled:opacity-20 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-forest" />
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(13,43,34,0.6)', backdropFilter: 'blur(8px)', zIndex: 100, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="modal reveal" style={{ background: 'var(--cream)', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 120px rgba(13,43,34,0.3)', border: '1px solid var(--border)', borderTop: '6px solid var(--forest)' }}>
                        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Step 1 of 1</div>
                                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--forest-dark)', marginBottom: '0', letterSpacing: '-0.02em', lineHeight: '1' }}>{currentTemplate ? 'Edit Template' : 'New Template'}</h3>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                            <form id="templateForm" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input"
                                        style={{ background: 'white' }}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ background: 'white' }}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consent Content</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="form-input"
                                        style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5', background: 'white', minHeight: '100px' }}
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Draft your legal consent content here..."
                                    ></textarea>
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assign Students ({formData.assignedStudentIds.length} Selected)</label>
                                    <div className="bg-white border border-gray-200 rounded-xl max-h-[160px] overflow-y-auto p-2 space-y-1">
                                        {allStudents.map(student => (
                                            <label key={student.id} className="flex items-center p-2 hover:bg-forest/5 rounded-lg cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-forest accent-forest rounded border-gray-300 mr-3"
                                                    checked={formData.assignedStudentIds.includes(student.id)}
                                                    onChange={() => handleStudentToggle(student.id)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-forest-dark">{student.name}</span>
                                                    <span className="text-xs text-text-muted">{student.email}</span>
                                                </div>
                                            </label>
                                        ))}
                                        {allStudents.length === 0 && <div className="text-xs text-text-muted p-2">Loading students...</div>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', background: 'rgba(27,77,62,0.04)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--forest)' }}
                                    />
                                    <label htmlFor="active" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--forest-dark)', cursor: 'pointer' }}>
                                        Set as Active (visible to users)
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer" style={{ padding: '24px 32px', borderTop: '2px solid var(--cream-dark)', background: '#FAFAFA', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button type="button" onClick={closeModal} style={{ padding: '12px 24px', background: 'transparent', border: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" form="templateForm" className="btn-primary" style={{ padding: '14px 36px', width: 'auto', minWidth: '180px' }}>Save Template</button>
                        </div>
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
            <style>{`
                .admin-table td:first-child::before {
                    content: '';
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: calc(100% - 32px);
                    border-radius: 4px;
                }
                .row-active td:first-child::before { background: var(--forest); }
                .row-inactive td:first-child::before { background: var(--amber); }
                
                @keyframes pulse-dot {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default TemplateManager;
