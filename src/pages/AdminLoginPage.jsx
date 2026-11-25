import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Footprints, Lock, User, KeyRound, AlertCircle, ShieldCheck, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/client';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);
      if (data && data.token) {
        login(data.user, data.token);
        // Navigate explicitly to /admin
        navigate('/admin', { replace: true });
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 60%)'
    }}>
      {/* Expanded Split Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '940px',
        minHeight: '540px',
        backgroundColor: '#ffffff',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Left Side: Premium Sneaker Visual & Branding Banner */}
        <div style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(10, 14, 23, 0.92) 100%), url("https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)',
              marginBottom: '1.5rem'
            }}>
              <Footprints size={26} color="#ffffff" />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Management Console
            </div>

            <h2 style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '2.1rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              XTREME <br />
              <span style={{ color: 'var(--primary)' }}>SUPERKICKS</span>
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '340px' }}>
              Control product catalogs, live inventory, categories, and manage sneaker drop releases with MongoDB Atlas.
            </p>
          </div>

          {/* Feature Badges */}
          
        </div>

        {/* Right Side: Login Form ("Administrator" removed, Orange Sign In Button) */}
        <div style={{
          padding: '3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '1.95rem',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem'
            }}>
              Sign In
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Enter your credentials to access the store portal.
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#334155', fontSize: '0.78rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a'
                  }}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ color: '#334155', fontSize: '0.78rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a'
                  }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Sign In Button: VIBRANT ORANGE COLOR as requested */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                backgroundColor: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.625rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                transition: 'background-color 0.2s, transform 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ea580c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f97316'; e.currentTarget.style.transform = 'translateY(0)'; }}
              disabled={loading}
            >
              <Lock size={16} />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

              
        </div>

      </div>
    </div>
  );
}
