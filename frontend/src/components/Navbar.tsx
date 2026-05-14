'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '100px',
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #059669, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
            textShadow: '0 2px 10px rgba(16, 185, 129, 0.2)'
          }}>
            Helplytics
          </Link>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            <Link href="/feed" style={{ fontWeight: '600', color: '#475569', transition: 'all 0.3s ease', fontSize: '0.95rem' }} className="nav-link">Explore</Link>
            <Link href="/dashboard" style={{ fontWeight: '600', color: '#475569', transition: 'all 0.3s ease', fontSize: '0.95rem' }} className="nav-link">Dashboard</Link>
            <Link href="/leaderboard" style={{ fontWeight: '600', color: '#475569', transition: 'all 0.3s ease', fontSize: '0.95rem' }} className="nav-link">Leaderboard</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(5, 150, 105, 0.08)', padding: '0.4rem 0.6rem 0.4rem 1rem', borderRadius: '100px', border: '1px solid rgba(5, 150, 105, 0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                  className="user-menu-btn"
                >
                  <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>{user?.name?.split(' ')[0]}</span>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: user?.avatar === 'avatar2' ? 'linear-gradient(135deg, #3b82f6, #2dd4bf)' :
                               user?.avatar === 'avatar3' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                               user?.avatar === 'avatar4' ? 'linear-gradient(135deg, #10b981, #3b82f6)' :
                               user?.avatar === 'avatar5' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' :
                               user?.avatar === 'avatar6' ? 'linear-gradient(135deg, #0f172a, #334155)' :
                               'linear-gradient(135deg, #6366f1, #a855f7)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '0.9rem' 
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {showDropdown && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setShowDropdown(false)}></div>
                    <div className="glass-card animate-fade-in-up" style={{ position: 'absolute', top: '120%', right: 0, padding: '1.25rem', minWidth: '220px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                      <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
                        <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700', background: 'rgba(217, 119, 6, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '100px', width: 'fit-content' }}>
                          Trust Score: {user?.trustScore || 0}
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setShowDropdown(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }}>
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={() => { setShowDropdown(false); handleLogout(); }}
                        className="dropdown-item"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/login">
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', borderRadius: '100px', fontWeight: '700' }}>Sign In</button>
              </Link>
              <Link href="/register">
                <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', borderRadius: '100px', fontWeight: '700' }}>Join Free</button>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <style dangerouslySetInnerHTML={{
        __html: `
        .nav-link:hover { color: var(--primary) !important; transform: translateY(-1px); }
        .user-menu-btn:hover { background: rgba(5, 150, 105, 0.12) !important; }
        .dropdown-item:hover { background: #f8fafc !important; }
      `}} />
    </div>
  );
}
