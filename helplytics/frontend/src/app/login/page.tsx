'use client';

import Link from 'next/link';

export default function Login() {
  return (
    <div className="container animate-fade-in-up" style={{ padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Email Address</label>
            <input type="email" className="form-input" placeholder="john@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }} type="button">
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
          Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
