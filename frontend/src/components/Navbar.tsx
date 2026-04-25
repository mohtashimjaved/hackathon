'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '100px',
        width: '100%',
        maxWidth: '1200px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #fff, var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            Helplytics
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/feed" style={{ fontWeight: '500', color: '#cbd5e1', transition: 'color 0.3s ease' }} className="nav-link">Explore</Link>
            <Link href="/dashboard" style={{ fontWeight: '500', color: '#cbd5e1', transition: 'color 0.3s ease' }} className="nav-link">Dashboard</Link>
            <Link href="/leaderboard" style={{ fontWeight: '500', color: '#cbd5e1', transition: 'color 0.3s ease' }} className="nav-link">Leaderboard</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={16} /> {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', borderRadius: '100px' }}>Sign In</button>
            </Link>
          )}
        </div>
      </nav>
      <style dangerouslySetInnerHTML={{
        __html: `
        .nav-link:hover { color: #fff !important; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
      `}} />
    </div>
  );
}
