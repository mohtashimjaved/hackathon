'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Mail, Lock } from 'lucide-react';

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
    <div className="container animate-fade-in-up" style={{ padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="text-muted">Enter your credentials to access your dashboard.</p>
        </div>
        
        {serverError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', color: 'var(--danger)', fontSize: '0.95rem' }}>
            <AlertCircle size={20} /> {serverError}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>
              <Mail size={18} /> Email Address
            </label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'border-danger' : ''}`}
              placeholder="john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
            />
            {errors.email && <span className="form-error"><AlertCircle size={14} /> {errors.email}</span>}
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>
              <Lock size={18} /> Password
            </label>
            <input
              type="password"
              className={`form-input ${errors.password ? 'border-danger' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
            />
            {errors.password && <span className="form-error"><AlertCircle size={14} /> {errors.password}</span>}
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '1.25rem', opacity: loading ? 0.7 : 1 }} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8' }}>
          Don&apos;t have an account yet? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>Create Account</Link>
        </p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .border-danger { border-color: var(--danger) !important; }
      `}} />
    </div>
  );
}
