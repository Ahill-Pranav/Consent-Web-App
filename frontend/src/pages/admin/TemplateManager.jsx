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
    const [formData, setFormData] = useState({ title: '', description: '', content: '', isActive: true });

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

    const openModal = (template = null) => {
        if (template) {
            setCurrentTemplate(template);
            setFormData({
                title: template.title,
                description: template.description || '',
                content: template.content,
                active: template.active
            });
        } else {
            setCurrentTemplate(null);
            setFormData({ title: '', description: '', content: '', active: true });
        }
        setIsModalOpen(true);
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
        if (window.confirm("Are you sure you want to delete (deactivate) this template?")) {
            const loadToast = toast.loading("Deactivating template...");
            try {
                await api.delete(`/templates/${id}`);
                toast.success("Template deactivated", { id: loadToast });
                fetchTemplates();
            } catch (error) {
                toast.error("Failed to deactivate template", { id: loadToast });
            }
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading templates...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-forest/10 shadow-sm">
                <div>
                     <h2 className="text-2xl font-serif text-forest-dark">Consent Templates</h2>
                     <p className="text-xs text-text-muted mt-1 italic">Administrators manage master versions of all platform forms.</p>
                </div>
                <div className="relative w-full md:w-72">
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
                            <tr key={t.id} className={t.active ? 'row-active' : 'row-inactive'} style={{ position: 'relative' }}>
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
                                        onClick={() => openModal(t)}
                                        style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', marginRight: '8px', color: 'var(--forest)' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', color: '#B41E1E' }}
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
