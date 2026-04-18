'use client';

import Link from 'next/link';

export default function Register() {
  return (
    <div className="container animate-fade-in-up" style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Account</h1>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Onboarding: Set up your profile and skills.</p>
        
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Email</label>
            <input type="email" className="form-input" placeholder="john@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>I want to...</label>
            <select className="form-input" style={{ appearance: 'none' }}>
              <option value="both">Get Help & Offer Help</option>
              <option value="need_help">Only Get Help</option>
              <option value="can_help">Only Offer Help</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Skills (comma separated)</label>
            <input type="text" className="form-input" placeholder="React, Node.js, Python..." />
          </div>

          <button className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1rem' }} type="button">
            Complete Registration
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
