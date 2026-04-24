'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'both',
    skills: '',
    interests: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
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

        {/* Right: Register Form */}
        <div className="card" style={{ padding: '3.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="banner-label" style={{ color: 'var(--primary)', opacity: 1 }}>Sign up</span>
            <h2 className="heading-lg">Authenticate your community profile</h2>
          </div>

          {serverError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {serverError}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input 
                name="name"
                className="form-input" 
                placeholder="Ayesha Khan" 
                value={formData.name} 
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Email</label>
                <input
                  name="email"
                  className="form-input"
                  placeholder="community@helphub.ai"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Role Selection</label>
              <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                <option value="both">Both (Need help & Can help)</option>
                <option value="need_help">I need help with projects</option>
                <option value="can_help">I want to help others</option>
              </select>
            </div>

            <div>
              <label className="form-label">Skills (comma separated)</label>
              <input 
                name="skills"
                className="form-input" 
                placeholder="React, Figma, Git/GitHub" 
                value={formData.skills} 
                onChange={handleChange}
              />
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }} 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating profile...' : 'Continue to dashboard'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
