import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { FileSignature, AlertCircle, CheckCircle2 } from 'lucide-react';

const AvailableTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Signing Modal State
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [signAgreement, setSignAgreement] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signSuccess, setSignSuccess] = useState(false);

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

    const openSigningModal = (template) => {
        setSelectedTemplate(template);
        setSignAgreement(false);
        setSignSuccess(false);
    };

    const handleSign = async () => {
        try {
            setSigning(true);
            await api.post(`/consents/${selectedTemplate.id}/sign`);
            setSignSuccess(true);

            // Re-fetch to potentially remove from active list if you only want to show unsigned
            // For now we keep it simple or let them see it and we can just show success msg.
        } catch (error) {
            console.error("Signing failed", error);
            alert(error.response?.data?.message || "Failed to sign document");
        } finally {
            setSigning(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading templates...</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">Documents Requiring Consent</h2>

            <div className="grid gap-6 md:grid-cols-2">
                {templates.map(t => (
                    <div key={t.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-slate-50/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg text-accent">
                                <FileSignature className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-primary mb-2 line-clamp-1">{t.title}</h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">{t.description || "Review this document and provide your digital consent."}</p>

                        <button
                            onClick={() => openSigningModal(t)}
                            className="w-full btn-success bg-white border border-success text-success hover:bg-success hover:text-white pb-3"
                        >
                            Review & Sign
                        </button>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600">All Caught Up!</h3>
                    <p className="text-slate-500 mt-1">There are no pending documents requiring your consent.</p>
                </div>
            )}

            {selectedTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                            <div>
                                <h3 className="text-xl font-bold text-primary">{selectedTemplate.title}</h3>
                                <p className="text-sm text-slate-500 mt-1">Review the legal terms below</p>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            {signSuccess ? (
                                <div className="text-center py-12">
                                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-800 mb-2">Consent Recorded</h2>
                                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                        Your digital signature has been securely hashed and recorded in the audit log.
                                    </p>
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className="btn-success px-8 h-12"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="prose prose-sm max-w-none text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200 min-h-[200px] whitespace-pre-wrap">
                                        {selectedTemplate.content}
                                    </div>

                                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-semibold mb-1">Digital Signature Acknowledgment</p>
                                            <p>By checking the box below, you agree that your digital signature is the legally binding equivalent of your handwritten signature.</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="agree"
                                            className="w-5 h-5 text-success rounded border-slate-300 focus:ring-success cursor-pointer"
                                            checked={signAgreement}
                                            onChange={(e) => setSignAgreement(e.target.checked)}
                                        />
                                        <label htmlFor="agree" className="text-slate-700 font-medium cursor-pointer select-none">
                                            I have read and agree to the terms outlined above.
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>

                        {!signSuccess && (
                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                    disabled={signing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSign}
                                    disabled={!signAgreement || signing}
                                    className={`px-8 py-2.5 rounded-lg font-medium text-white transition-all shadow-sm
                                        ${signAgreement && !signing ? 'bg-success hover:bg-emerald-600 hover:shadow-md' : 'bg-success/50 cursor-not-allowed'}
                                    `}
                                >
                                    {signing ? 'Processing...' : 'Sign Document'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailableTemplates;
