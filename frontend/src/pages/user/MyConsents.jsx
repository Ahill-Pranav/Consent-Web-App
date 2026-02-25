import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { FileCheck2, Fingerprint } from 'lucide-react';

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

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your secure records...</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">My Signed Documents</h2>

            <div className="space-y-4">
                {consents.map(c => (
                    <div key={c.id} className="border border-slate-200 rounded-xl p-5 hover:border-success/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-50 p-3 rounded-full shrink-0">
                                <FileCheck2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Template #{c.templateId}</h4>
                                <div className="text-sm text-slate-500 mt-1 flex flex-col sm:flex-row sm:gap-4">
                                    <span>Signed: {new Date(c.signedAt).toLocaleString()}</span>
                                    <span>Status: <strong className="text-emerald-600">Active</strong></span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-slate-400 shrink-0" />
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">SHA-256 Digital Fingerprint</p>
                                <p className="font-mono text-xs text-slate-600 truncate max-w-[200px]" title={c.signatureHash}>
                                    {c.signatureHash}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {consents.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500">You haven't signed any documents yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyConsents;
