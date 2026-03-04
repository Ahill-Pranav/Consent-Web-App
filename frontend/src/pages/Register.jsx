import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="login-screen" className="screen active" style={{ minHeight: '100vh', display: 'flex' }}>
            <div className="login-split">
                {/* Left Side */}
                <div className="login-left">
                    <div className="login-brand reveal">Consent<span>Flow</span><br />Platform</div>
                    <p className="login-tagline reveal" style={{ transitionDelay: '0.1s' }}>
                        Join us to securely manage digital consents for healthcare, research, and beyond.
                    </p>
                    <div className="login-features reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="login-feature"><div className="login-feature-dot"></div>Tamper-proof audit trails on every signature</div>
                        <div className="login-feature"><div className="login-feature-dot"></div>Multi-role access for admins and participants</div>
                        <div className="login-feature"><div className="login-feature-dot"></div>Real-time notifications and form tracking</div>
                        <div className="login-feature"><div className="login-feature-dot"></div>Legally compliant digital consent records</div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="login-right">
                    <div className="login-card reveal" style={{ transitionDelay: '0.3s' }}>
                        <div className="login-heading" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>Create an Account</div>
                        <p className="login-subheading" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '40px' }}>Join us to manage digital consents</p>

                        {error && (
                            <div style={{ background: 'rgba(180,30,30,0.1)', color: '#B41E1E', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="name@organisation.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginBottom: '20px' }}>
                                <span>{loading ? 'Registering...' : 'Register'}</span>
                            </button>
                        </form>

                        <div className="login-footer" style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .login-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          width: 100%;
        }
        .login-left {
          background: var(--forest-dark);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 64px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(232,146,58,0.25) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(90,138,117,0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-glow 5s ease-in-out infinite reverse;
        }
        .login-brand {
          font-family: 'DM Serif Display', serif;
          font-size: 2.6rem;
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        .login-brand span { color: var(--amber-light); }
        .login-tagline {
          font-size: 1rem;
          color: var(--sage-light);
          line-height: 1.7;
          max-width: 360px;
          position: relative;
          z-index: 2;
        }
        .login-features {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 2;
        }
        .login-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }
        .login-feature-dot {
          width: 8px; height: 8px;
          background: var(--amber);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: var(--warm-white);
        }
        .login-card {
          width: 100%;
          max-width: 420px;
        }
        @media (max-width: 900px) {
          .login-split {
            grid-template-columns: 1fr;
          }
          .login-left {
            padding: 40px;
            min-height: 300px;
          }
        }
      `}</style>
        </div>
    );
};

export default Register;
