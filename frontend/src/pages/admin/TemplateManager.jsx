import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Plus, Edit2, Trash2, X, Check, Eye } from 'lucide-react';

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', content: '', isActive: true });

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await api.get('/templates');
            setTemplates(response.data);
        } catch (error) {
            console.error("Failed to fetch templates", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const openModal = (template = null) => {
        if (template) {
            setCurrentTemplate(template);
            setFormData({
                title: template.title,
                description: template.description || '',
                content: template.content,
                isActive: template.isActive
            });
        } else {
            setCurrentTemplate(null);
            setFormData({ title: '', description: '', content: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTemplate(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentTemplate) {
                await api.put(`/templates/${currentTemplate.id}`, formData);
            } else {
                await api.post('/templates', formData);
            }
            fetchTemplates();
            closeModal();
        } catch (error) {
            console.error("Failed to save template", error);
            alert("Error saving template. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete (deactivate) this template?")) {
            try {
                await api.delete(`/templates/${id}`);
                fetchTemplates();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading templates...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-primary">Consent Templates</h2>
                    <p className="text-sm text-slate-500">Create and manage forms users will sign.</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Template
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg font-medium">Title</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Created On</th>
                            <th className="p-4 rounded-tr-lg font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {templates.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-primary">{t.title}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-xs">{t.description}</div>
                                </td>
                                <td className="p-4">
                                    {t.isActive ?
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Check className="w-3 h-3" /> Active
                                        </span> :
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <X className="w-3 h-3" /> Inactive
                                        </span>
                                    }
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    <button onClick={() => openModal(t)} className="p-2 text-slate-400 hover:text-accent bg-white border border-slate-200 rounded-md shadow-sm transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-md shadow-sm transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {templates.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">No templates found. Create one.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-primary">{currentTemplate ? 'Edit Template' : 'New Template'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="templateForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input type="text" required className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <input type="text" className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Consent Content</label>
                                    <textarea required rows="8" className="input-field font-mono text-sm resize-y" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Draft your legal consent content here..."></textarea>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-accent rounded border-slate-300 focus:ring-accent" />
                                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Set as Active (visible to users)</label>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button type="submit" form="templateForm" className="btn-primary">Save Template</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManager;
