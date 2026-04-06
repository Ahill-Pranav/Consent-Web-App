
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ConsentAudit = ({ setAuditCount }) => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchConsents = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/consents/all?page=${page}&size=10&sort=id,desc`);
            if (response.data.content) {
                setConsents(response.data.content);
                setTotalPages(response.data.totalPages);
                if (setAuditCount) setAuditCount(response.data.totalElements);
            } else {
                setConsents(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            toast.error("Audit log sync failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsents();
    }, [page, setAuditCount]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading audit records...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-forest/10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-serif text-forest-dark">System Audit Log</h2>
                    <p className="text-xs text-text-muted mt-1 italic">Immutable cryptographic record of all digital signatures.</p>
                </div>
                <div className="flex items-center gap-2 bg-amber/10 text-forest px-4 py-2 rounded-xl border border-amber/20 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber" />
                    SHA-256 Secured
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

            {/* Pagination Controls */}
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
        </div>
    );
};

export default ConsentAudit;
