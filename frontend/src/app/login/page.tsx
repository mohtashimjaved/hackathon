'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '1100px' }}>
        
        {/* Left: Info Card */}
        <div className="banner-card" style={{ padding: '4rem 3.5rem', marginBottom: 0, height: '100%' }}>
          <span className="banner-label">Community Access</span>
          <h1>Enter the support network.</h1>
          <p style={{ marginBottom: '3rem' }}>
            Choose a demo identity, set your role, and jump into a multi-page product flow designed for asking, offering, and tracking help with a premium interface.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.9 }}>
            {[
              'Role-based entry for Need Help, Can Help, or Both',
              'Direct path into dashboard, requests, AI Center, and community feed',
              'Persistent demo session powered by Cookies'
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '0.6rem' }}></div>
                <span style={{ fontSize: '1rem' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Login Form */}
        <div className="card" style={{ padding: '4rem 3.5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span className="banner-label" style={{ color: 'var(--primary)', opacity: 1 }}>Login / Signup</span>
            <h2 className="heading-lg">Authenticate your community profile</h2>
          </div>

          {serverError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {serverError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <label className="form-label">Select demo user</label>
              <select className="form-input" style={{ appearance: 'none' }} defaultValue="ayesha">
                <option value="ayesha">Ayesha Khan</option>
                <option value="hassan">Hassan Ali</option>
                <option value="sara">Sara Noor</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="community@helphub.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }} 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Continue to dashboard'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#64748b', fontSize: '0.95rem' }}>
            New to the community? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
