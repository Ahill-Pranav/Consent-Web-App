import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const MentorDashboard = () => {
    const { user, logout } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [assignedStudentIds, setAssignedStudentIds] = useState([]);
    const [allMyStudents, setAllMyStudents] = useState([]);

    useEffect(() => {
        fetchTemplates();
        fetchMyStudents();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/templates');
            setTemplates(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch templates");
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
        try {
            const payload = { title, description, content, isActive: true, assignedStudentIds };
            if (editingId) {
                // Editing creates a new version
                await api.put(`/templates/${editingId}`, payload);
            } else {
                await api.post('/templates', payload);
            }
            setShowModal(false);
            fetchTemplates();
        } catch (err) {
            alert('Failed to save template. Check console.');
        }
    };

    const toggleStudent = (id) => {
        setAssignedStudentIds(prev => 
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-cream text-charcoal pb-20">
            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-forest rounded-[32px] p-10 md:p-14 mb-12 shadow-xl reveal flex flex-col md:flex-row justify-between items-center border border-forest-mid">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-light/20 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 blur-[80px]"></div>
                    
                    <div className="relative z-10 w-full">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Manage Forms</h1>
                        <p className="text-sage-light text-lg mb-8 max-w-xl">Create and version-control consent templates for your assigned students.</p>
                        
                        <button 
                            onClick={() => handleOpenModal()} 
                            className="btn-accent inline-flex w-auto px-8"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Create New Template
                        </button>
                    </div>

                    <div className="relative z-10 mt-8 md:mt-0 glass-dark p-6 rounded-2xl w-full md:w-auto text-center shrink-0 border border-white/10">
                        <div className="text-5xl font-serif text-amber-light leading-none">{templates.filter(t => t.isActive).length}</div>
                        <div className="text-sage text-sm font-medium uppercase tracking-wider mt-2">Active Forms</div>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="mb-6 flex justify-between items-end reveal" style={{ transitionDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold text-forest-dark">Your Templates</h2>
                    <span className="text-sm text-text-muted">Viewing all generated forms</span>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal" style={{ transitionDelay: '0.2s' }}>
                        {templates.map(template => (
                            <div key={template.id} className={`bg-white p-6 rounded-2xl border ${template.isActive ? 'border-forest/10 shadow-md' : 'border-gray-200 opacity-60 bg-gray-50'} transition-all duration-300 flex flex-col`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-xl ${template.isActive ? 'bg-amber/10 text-amber' : 'bg-gray-200 text-gray-500'}`}>
                                            {template.title.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-forest uppercase tracking-wider">v{template.version || 1}.0</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${template.isActive ? 'bg-sage/10 text-forest border-sage/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        {template.isActive ? 'Active' : 'Archived'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-forest-dark mb-2">{template.title}</h3>
                                <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-grow">{template.description}</p>
                                
                                {template.isActive && (
                                    <div className="mt-auto pt-4 border-t border-forest/5 text-right">
                                        <button 
                                            onClick={() => handleOpenModal(template)}
                                            className="text-xs font-bold text-amber hover:text-forest transition-colors uppercase tracking-wider flex items-center justify-end gap-1 w-full"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            Create New Version
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="glass bg-white/95 w-full max-w-2xl rounded-3xl p-8 relative z-10 animate-reveal-up shadow-2xl border border-white translate-y-0">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif text-forest-dark">{editingId ? 'Edit Draft / New Version' : 'Create Template'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {editingId && (
                            <div className="mb-6 p-4 bg-amber/10 border border-amber/20 rounded-xl text-sm text-forest-dark flex items-start gap-3">
                                <span className="text-amber">ℹ️</span>
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
                                                {assignedStudentIds.includes(student.id) && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
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
        </div>
    );
};

export default MentorDashboard;
