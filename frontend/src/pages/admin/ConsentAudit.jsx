
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ConsentAudit = ({ setAuditCount }) => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConsents = async () => {
        try {
            const response = await api.get('/consents/all');
            setConsents(response.data);
            if (setAuditCount) setAuditCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch consents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsents();
    }, [setAuditCount]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading audit records...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--forest-dark)' }}>System Audit Log</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Immutable record of all digital signatures across the system.</p>
                </div>
                <div style={{ background: 'var(--cream-dark)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest-dark)', border: '1px solid var(--border)' }}>
                    🔒 Secured via SHA-256
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Record ID</th>
                            <th>User ID</th>
                            <th>Template ID</th>
                            <th>Signed At</th>
                            <th>IP Address</th>
                            <th style={{ width: '25%' }}>Signature Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consents.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: 600, color: 'var(--forest)' }}>#{c.id}</td>
                                <td>User {c.userId}</td>
                                <td>Tpl {c.templateId}</td>
                                <td>
                                    <div>{new Date(c.signedAt).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(c.signedAt).toLocaleTimeString()}</div>
                                </td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{c.ipAddress || '127.0.0.1'}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                                    {c.signatureHash}
                                </td>
                            </tr>
                        ))}
                        {consents.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No consent records found in the system.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsentAudit;
