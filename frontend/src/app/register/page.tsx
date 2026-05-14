'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, User, Mail, Lock, Globe, Briefcase, Heart } from 'lucide-react';

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
    if (!formData.role) newErrors.role = 'Please select a role';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
    <div className="container animate-fade-in-up" style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '800px', padding: '4rem', background: 'white', boxShadow: '0 40px 100px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '2.5rem' }}>Join the Community</h1>
          <p className="text-muted" style={{ fontSize: '1.05rem' }}>Create your profile to start getting and offering help.</p>
        </div>

        {serverError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2.5rem', color: 'var(--danger)', fontSize: '0.95rem', fontWeight: '500', gridColumn: 'span 2' }}>
            <AlertCircle size={20} /> {serverError}
          </div>
        )}
        
        <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Full Name */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <User size={18} style={{ color: 'var(--primary)' }} /> Full Name
            </label>
            <input 
              name="name"
              type="text" 
              className={`form-input ${errors.name ? 'border-danger' : ''}`} 
              placeholder="Enter your full name" 
              value={formData.name} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
            {errors.name && <span className="form-error"><AlertCircle size={14} /> {errors.name}</span>}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} /> Email Address
            </label>
            <input 
              name="email"
              type="email" 
              className={`form-input ${errors.email ? 'border-danger' : ''}`} 
              placeholder="john@example.com" 
              value={formData.email} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
            {errors.email && <span className="form-error"><AlertCircle size={14} /> {errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Lock size={18} style={{ color: 'var(--primary)' }} /> Password
            </label>
            <input 
              name="password"
              type="password" 
              className={`form-input ${errors.password ? 'border-danger' : ''}`} 
              placeholder="Min 6 characters" 
              value={formData.password} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
            {errors.password && <span className="form-error"><AlertCircle size={14} /> {errors.password}</span>}
          </div>
          
          {/* Role Dropdown */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Your Goal
            </label>
            <select 
              name="role"
              className={`form-input form-select ${errors.role ? 'border-danger' : ''}`} 
              value={formData.role} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            >
              <option value="both">Get Help &amp; Offer Help</option>
              <option value="need_help">I need help with projects</option>
              <option value="can_help">I want to help others</option>
            </select>
            {errors.role && <span className="form-error"><AlertCircle size={14} /> {errors.role}</span>}
          </div>

          {/* Skills */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Skills (comma separated)
            </label>
            <input 
              name="skills"
              type="text" 
              className="form-input" 
              placeholder="React, Python, UI Design..." 
              value={formData.skills} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
          </div>

          {/* Interests */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Heart size={18} style={{ color: 'var(--primary)' }} /> Interests
            </label>
            <input 
              name="interests"
              type="text" 
              className="form-input" 
              placeholder="AI, Web3, Photography..." 
              value={formData.interests} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} /> Location
            </label>
            <input 
              name="location"
              type="text" 
              className="form-input" 
              placeholder="City, Country" 
              value={formData.location} 
              onChange={handleChange}
              style={{ background: '#f8fafc' }}
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ gridColumn: 'span 2', marginTop: '1.5rem', padding: '1.4rem', fontSize: '1.1rem' }} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b', fontSize: '1.05rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', borderBottom: '2px solid var(--primary)' }}>Sign In</Link>
        </p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .border-danger { border-color: var(--danger) !important; }
      `}} />
    </div>
  );
}
