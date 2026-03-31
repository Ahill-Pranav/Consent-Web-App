import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [mentorId, setMentorId] = useState('');
    
    const [mentors, setMentors] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Fetch active mentors for dropdown
        const fetchMentors = async () => {
            try {
                const response = await api.get('/auth/mentors');
                setMentors(response.data);
            } catch (err) {
                console.error("Failed to fetch mentors", err);
            }
        };
        fetchMentors();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (role === 'STUDENT' && !mentorId) {
            setError("Students must select an assigned Mentor.");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password, role, mentorId || null);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full relative overflow-hidden bg-forest-dark">
            {/* Animated Background Orbs */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-amber/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-sage/20 rounded-full blur-[140px] animate-pulse-glow-reverse pointer-events-none"></div>

            <div className="w-full h-full flex flex-col justify-center items-center py-12 px-4 z-10 min-h-screen">
                <Link to="/login" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Login
                </Link>

                <div className="glass w-full max-w-[540px] p-8 md:p-12 rounded-3xl reveal shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif text-forest-dark mb-3">Create Account</h2>
                        <p className="text-text-muted">Join the secure consent platform today.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('STUDENT')}
                                className={`px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border-2 ${
                                    role === 'STUDENT'
                                    ? 'border-forest bg-forest text-white'
                                    : 'border-forest/10 bg-white/50 text-text-muted hover:border-forest/30'
                                }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setRole('MENTOR');
                                    setMentorId(''); // wipe mentor ID selection if switching to mentor
                                }}
                                className={`px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border-2 ${
                                    role === 'MENTOR'
                                    ? 'border-amber bg-amber text-white shadow-[0_4px_20px_rgba(232,146,58,0.3)]'
                                    : 'border-forest/10 bg-white/50 text-text-muted hover:border-amber/30'
                                }`}
                            >
                                Mentor / Admin
                            </button>
                        </div>

                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Aarav Sharma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="6"
                                required
                            />
                        </div>

                        {/* Conditional Dropdown for Students */}
                        {role === 'STUDENT' && (
                            <div className="reveal">
                                <label className="form-label text-amber">Assign Mentor *</label>
                                <select 
                                    className="form-input bg-white cursor-pointer appearance-none"
                                    value={mentorId}
                                    onChange={(e) => setMentorId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select your managing mentor</option>
                                    {mentors.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button type="submit" className="btn-primary mt-6 tracking-wide" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Finish Registration'}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center text-sm font-medium text-text-muted">
                        Already registered?{' '}
                        <Link to="/login" className="font-bold text-forest hover:text-amber transition-colors">
                            Sign in to your portal
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
