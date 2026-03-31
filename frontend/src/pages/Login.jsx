import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoRole, setDemoRole] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleDemoRole = (role) => {
        setDemoRole(role);
        if (role === 'admin') setEmail('admin@consent.app');
        if (role === 'mentor') setEmail('mentor@consent.app');
        if (role === 'student') setEmail('student@consent.app');
        setPassword('password'); // Setup based on mock users
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full relative overflow-hidden bg-forest-dark">
            {/* Animated Background Orbs */}
            <div className="absolute -top-[150px] -right-[100px] w-[500px] h-[500px] bg-amber/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none"></div>
            <div className="absolute -bottom-[150px] -left-[100px] w-[600px] h-[600px] bg-sage/20 rounded-full blur-3xl animate-pulse-glow-reverse pointer-events-none"></div>

            <div className="w-full h-full flex flex-col md:flex-row max-w-[1440px] mx-auto z-10">
                {/* Left Side Marketing */}
                <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative">
                    <div className="reveal">
                        <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
                            Consent<span className="text-amber">Flow</span><br />Platform
                        </h1>
                        <p className="text-sage-light text-lg md:text-xl max-w-md font-light leading-relaxed mb-12">
                            Secure, version-controlled digital consent forms with multi-tier role approvals.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Tamper-proof audit trails for every signature",
                                "Hierarchical approvals (Admin, Mentor, Student)",
                                "Version-based document locking",
                                "Zero-friction onboarding"
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center text-white/80 gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_10px_rgba(232,146,58,0.8)]"></div>
                                    <span className="font-medium tracking-wide">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side Auth Form */}
                <div className="md:w-1/2 flex items-center justify-center p-8">
                    <div className="glass w-full max-w-[480px] p-10 md:p-14 rounded-3xl reveal" style={{ transitionDelay: '0.2s' }}>
                        <h2 className="text-3xl font-serif text-forest-dark mb-2">Welcome Back</h2>
                        <p className="text-text-muted mb-8">Please enter your details to sign in.</p>

                        {/* Demo Accounts Toggle */}
                        <div className="flex gap-2 mb-8 bg-forest/5 p-1.5 rounded-2xl">
                            {['student', 'mentor', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleDemoRole(role)}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                                        demoRole === role 
                                        ? 'bg-white text-forest shadow-sm' 
                                        : 'text-text-muted hover:text-forest'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                <div className="flex justify-between mb-2">
                                    <label className="form-label !mb-0">Password</label>
                                    <a href="#" className="text-xs font-semibold text-amber hover:text-amber-light">Forgot?</a>
                                </div>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary mt-4" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : "Sign In"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-forest hover:text-sage transition-colors">
                                Register Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
