
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { ShieldAlert, FileSignature } from 'lucide-react';

const ConsentAudit = () => {
    const [consents, setConsents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConsents = async () => {
        try {
            const response = await api.get('/consents/all');
            setConsents(response.data);
        } catch (error) {
            console.error("Failed to fetch consents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsents();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading audit records...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-primary">System Audit Log</h2>
                    <p className="text-sm text-slate-500">Immutable record of all digital signatures across the system.</p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium border border-blue-100">
                    <ShieldAlert className="w-4 h-4" /> Secured via SHA-256
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg font-medium">Record ID</th>
                            <th className="p-4 font-medium">User ID</th>
                            <th className="p-4 font-medium">Template ID</th>
                            <th className="p-4 font-medium">Signed At</th>
                            <th className="p-4 font-medium">IP Address</th>
                            <th className="p-4 rounded-tr-lg font-medium">Signature Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {consents.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-primary">#{c.id}</td>
                                <td className="p-4 text-sm text-slate-600">{c.userId}</td>
                                <td className="p-4 text-sm text-slate-600">{c.templateId}</td>
                                <td className="p-4 text-sm text-slate-600">{new Date(c.signedAt).toLocaleString()}</td>
                                <td className="p-4 text-sm font-mono text-slate-600">{c.ipAddress}</td>
                                <td className="p-4 text-xs font-mono text-slate-400 break-all max-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        <FileSignature className="w-3 h-3 text-accent flex-shrink-0" />
                                        {c.signatureHash}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {consents.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">No consent records found in the system.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsentAudit;
