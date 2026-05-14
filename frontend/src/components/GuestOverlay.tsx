'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface GuestOverlayProps {
  children: React.ReactNode;
  show: boolean;
  message?: string;
}

export default function GuestOverlay({ children, show, message = "You're viewing demo data. Sign in to see your personalized dashboard." }: GuestOverlayProps) {
  if (!show) return <>{children}</>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(2px)',
        borderRadius: '24px',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'relative',
          marginTop: '2rem',
          margin: '0 2rem',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '1.25rem 2rem',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          zIndex: 20,
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--primary)', 
              padding: '0.6rem', 
              borderRadius: '50%',
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
              <Lock size={18} />
            </div>
            <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{message}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login">
              <button className="btn" style={{ 
                background: 'transparent', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.6rem 1.5rem',
                fontSize: '0.85rem'
              }}>
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary" style={{ 
                padding: '0.6rem 1.5rem',
                fontSize: '0.85rem'
              }}>
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ opacity: 0.6, pointerEvents: 'none', filter: 'grayscale(0.5)' }}>
        {children}
      </div>
    </div>
  );
}
