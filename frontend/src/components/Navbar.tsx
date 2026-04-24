'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/feed' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1320px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--primary)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '800'
            }}>
              H
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--foreground)'
            }}>
              HelpHub AI
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              style={{ 
                fontWeight: '500', 
                color: pathname === link.href ? 'var(--foreground)' : '#64748b',
                transition: 'all 0.2s ease',
                position: 'relative',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: pathname === link.href ? 'rgba(0,0,0,0.03)' : 'transparent'
              }}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 142, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <User size={18} />
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{ 
                  background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: '500'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
              <Link href="/login" style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--foreground)' }}>Sign In</Link>
              <Link href="/register">
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>Join platform</button>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <style dangerouslySetInnerHTML={{
        __html: `
        .nav-link:hover { color: var(--foreground) !important; background: rgba(0,0,0,0.03); }
      `}} />
    </div>
  );
}
