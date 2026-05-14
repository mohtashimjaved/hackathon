'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import GuestOverlay from '@/components/GuestOverlay';

interface LeaderboardUser {
  _id: string;
  name: string;
  skills: string[];
  trustScore: number;
}

export default function Leaderboard() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const DUMMY_USERS: LeaderboardUser[] = [
    { _id: '1', name: 'Alex Johnson', trustScore: 2450, skills: ['React', 'Node.js', 'TypeScript'] },
    { _id: '2', name: 'Sarah Chen', trustScore: 1820, skills: ['UI/UX', 'Figma', 'Frontend'] },
    { _id: '3', name: 'Michael Smith', trustScore: 1540, skills: ['Python', 'Django', 'ML'] },
    { _id: '4', name: 'Emily Davis', trustScore: 1210, skills: ['DevOps', 'Docker', 'AWS'] },
    { _id: '5', name: 'David Wilson', trustScore: 980, skills: ['PostgreSQL', 'Redis', 'Backend'] },
  ];

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(DUMMY_USERS);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setUsers(DUMMY_USERS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in-up" style={{ padding: '4rem 2rem' }}>
      <GuestOverlay show={!isAuthenticated} message="You're viewing the global leaderboard as a guest. Sign in to start climbing the ranks!">
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{ display: 'inline-block', padding: '1.25rem', background: 'rgba(217, 119, 6, 0.12)', borderRadius: '30%', color: 'var(--secondary)', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(217, 119, 6, 0.15)' }}>
          <Trophy size={56} />
        </div>
        <h1 className="heading-xl" style={{ fontSize: '4rem', marginBottom: '1.25rem', color: '#0f172a' }}>Global Leaderboard</h1>
        <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.15rem', color: '#64748b' }}>
          Recognizing the top contributors in the Helplytics community. Earn trust points by solving requests and helping your peers!
        </p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.75rem', borderRadius: '100px', fontWeight: '700' }}
          onClick={loadLeaderboard}
          disabled={loading}
        >
          <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh Rankings
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem', background: 'white', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ padding: '1rem' }}>
            <div className="skeleton" style={{ height: '100px', marginBottom: '1.5rem', borderRadius: '20px' }}></div>
            <div className="skeleton" style={{ height: '100px', marginBottom: '1.5rem', borderRadius: '20px' }}></div>
            <div className="skeleton" style={{ height: '100px', marginBottom: '1.5rem', borderRadius: '20px' }}></div>
            <div className="skeleton" style={{ height: '100px', marginBottom: '1.5rem', borderRadius: '20px' }}></div>
            <div className="skeleton" style={{ height: '100px', marginBottom: '1.5rem', borderRadius: '20px' }}></div>
          </div>
        ) : (
          <>
            {users.map((user, index) => (
              <div key={user._id} className="animate-fade-in-up leaderboard-row" style={{ 
                display: 'flex', alignItems: 'center', gap: '2.5rem', padding: '2rem', 
                borderBottom: index !== users.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                background: index === 0 ? 'linear-gradient(to right, rgba(217, 119, 6, 0.04), transparent)' : 'transparent',
                animationDelay: `${index * 100}ms`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                borderRadius: '24px'
              }}>
                
                <div style={{ width: '50px', textAlign: 'center', fontSize: '1.75rem', fontWeight: '900', color: index === 0 ? 'var(--secondary)' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#cbd5e1' }}>
                  {index === 0 ? <Medal size={40} color="var(--secondary)" /> : `#${index + 1}`}
                </div>
                
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt={user.name} style={{ width: '72px', height: '72px', borderRadius: '24px', background: '#f1f5f9', border: '1px solid rgba(0,0,0,0.05)' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: index === 0 ? 'var(--secondary)' : '#1e293b' }}>{user.name}</h3>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {(user.skills || []).slice(0, 4).map(skill => (
                      <span key={skill} style={{ fontSize: '0.85rem', color: '#475569', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontWeight: '600' }}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end', fontSize: '1.75rem', fontWeight: '900', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    <Star size={24} fill="var(--primary)" style={{ color: 'var(--primary)' }} /> {user.trustScore}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust points</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div style={{ padding: '6rem', textAlign: 'center', color: '#94a3b8' }}>
                <Trophy size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                <p style={{ fontSize: '1.2rem' }}>No users on the leaderboard yet. Be the first to earn trust points!</p>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .leaderboard-row:hover { transform: scale(1.01); background: #f8fafc !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
      </GuestOverlay>
    </div>
  );
}
