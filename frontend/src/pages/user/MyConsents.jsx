import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const MyConsents = () => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyConsents = async () => {
        try {
            const response = await api.get('/consents/my');
            setConsents(response.data);
        } catch (error) {
            console.error("Failed to fetch personal consents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyConsents();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your secure records...</div>;

    return (
        <>
            {consents.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✓</div>
                    <h3>No Signed Documents</h3>
                    <p>You haven't signed any documents yet.</p>
                </div>
            ) : (
                <div className="consent-grid" style={{ transitionDelay: '0.3s' }}>
                    {consents.map((c, i) => (
                        <div key={c.id} className="consent-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="consent-card-header">
                                <div>
                                    <div className="consent-card-title">Template #{c.templateId}</div>
                                    <div className="consent-card-org">Signed Record</div>
                                </div>
                                <span className="status-badge status-signed">Active</span>
                            </div>

                            <div style={{ marginTop: '16px', background: 'var(--cream)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '4px' }}>SHA-256 Fingerprint</p>
                                <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--forest)', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={c.signatureHash}>
                                    {c.signatureHash}
                                </p>
                            </div>

                            <div className="consent-card-meta" style={{ marginTop: '20px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'var(--sage)' }}>📅</span> {new Date(c.signedAt).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'var(--sage)' }}>⏰</span> {new Date(c.signedAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MyConsents;
