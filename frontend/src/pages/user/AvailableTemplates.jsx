import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useToast } from '../../components/ToastProvider';

const AvailableTemplates = ({ setPendingCount }) => {
    const { showToast } = useToast();
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
            if (setPendingCount) {
                setPendingCount(response.data.length);
            }
        } catch (error) {
            console.error("Failed to fetch templates", error);
            showToast("Failed to fetch templates", "✕");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [setPendingCount]);

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
            showToast("Document signed successfully!");
            // Re-fetch to update pending count and list
            fetchTemplates();
        } catch (error) {
            console.error("Signing failed", error);
            showToast(error.response?.data?.message || "Failed to sign document", "✕");
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading documents...</div>;
    }

    return (
        <>
            {templates.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h3>All Caught Up!</h3>
                    <p>There are no pending documents requiring your consent at this time. Check your signed forms tab for past records.</p>
                </div>
            ) : (
                <div className="consent-grid" style={{ transitionDelay: '0.3s' }}>
                    {templates.map((t, i) => (
                        <div key={t.id} className="consent-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="consent-card-header">
                                <div>
                                    <div className="consent-card-title">{t.title}</div>
                                    <div className="consent-card-org">ConsentForm App</div>
                                </div>
                                <span className="status-badge status-pending">Action Required</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginTop: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {t.description || "Review this document and provide your digital consent."}
                            </p>
                            <div className="consent-card-meta">
                                <span>Requires e-signature</span>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ marginTop: '20px', padding: '12px', fontSize: '0.9rem' }}
                                onClick={() => openSigningModal(t)}
                            >
                                Review & Sign
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedTemplate && (
                <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(13,43,34,0.6)', backdropFilter: 'blur(8px)', zIndex: 100, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="modal reveal" style={{ background: 'var(--cream)', borderRadius: '24px', width: '100%', maxWidth: '840px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(13,43,34,0.4)' }}>
                        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                            <div>
                                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: 'var(--forest-dark)', marginBottom: '4px' }}>Review Agreement</h2>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedTemplate.title}</div>
                            </div>
                            {!signSuccess && (
                                <button
                                    className="modal-close"
                                    onClick={() => setSelectedTemplate(null)}
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="modal-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, position: 'relative' }}>
                            {signSuccess ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'var(--forest)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px', animation: 'reveal-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>✅</div>
                                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: 'var(--forest-dark)', marginBottom: '12px' }}>Consent Recorded</h3>
                                    <p style={{ color: 'var(--text-body)', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto 32px' }}>Your digital signature has been securely hashed and recorded in the audit log.</p>
                                    <button onClick={() => setSelectedTemplate(null)} className="btn-primary" style={{ maxWidth: '240px' }}>Return to Dashboard</button>
                                </div>
                            ) : (
                                <>
                                    <div className="document-view" style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '32px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)', whiteSpace: 'pre-wrap' }}>
                                        {selectedTemplate.content}
                                    </div>

                                    <div className="sign-area" style={{ background: 'var(--amber-pale)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(232,146,58,0.2)' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                            <div style={{ color: 'var(--amber)' }}>⚠</div>
                                            <div>
                                                <h4 style={{ color: '#B8650A', marginBottom: '8px', fontSize: '0.95rem' }}>Digital Signature Acknowledgment</h4>
                                                <p style={{ color: 'var(--text-body)', fontSize: '0.88rem', marginBottom: '16px' }}>By checking the box below, you agree that your digital signature is the legally binding equivalent of your handwritten signature.</p>

                                                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={signAgreement}
                                                        onChange={(e) => setSignAgreement(e.target.checked)}
                                                        style={{ width: '20px', height: '20px', accentColor: 'var(--forest)', cursor: 'pointer' }}
                                                    />
                                                    <span style={{ fontWeight: 500, color: 'var(--forest-dark)' }}>I have read and agree to the terms outlined above.</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {!signSuccess && (
                            <div className="modal-footer" style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    disabled={signing}
                                    style={{ padding: '14px 24px', background: 'transparent', border: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSign}
                                    disabled={!signAgreement || signing}
                                    className="btn-primary"
                                    style={{ width: 'auto', padding: '14px 32px' }}
                                >
                                    {signing ? 'Processing...' : 'Sign Document'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AvailableTemplates;
