'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '@/lib/api';

interface LeaderboardUser {
  _id: string;
  name: string;
  skills: string[];
  trustScore: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', color: 'var(--warning)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}>
          <Trophy size={48} />
        </div>
        <h1 className="heading-xl" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Global Leaderboard</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Recognizing the top contributors in the Helplytics community. Earn trust points by solving requests and helping your peers!
        </p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={loadLeaderboard}
          disabled={loading}
        >
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '0' }}>
        {loading ? (
          <>
            <div className="skeleton" style={{ height: '80px', margin: '1rem' }}></div>
            <div className="skeleton" style={{ height: '80px', margin: '1rem' }}></div>
            <div className="skeleton" style={{ height: '80px', margin: '1rem' }}></div>
            <div className="skeleton" style={{ height: '80px', margin: '1rem' }}></div>
            <div className="skeleton" style={{ height: '80px', margin: '1rem' }}></div>
          </>
        ) : (
          <>
            {users.map((user, index) => (
              <div key={user._id} className="animate-fade-in-up" style={{ 
                display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem 2rem', 
                borderBottom: index !== users.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: index === 0 ? 'linear-gradient(to right, rgba(245, 158, 11, 0.05), transparent)' : 'transparent',
                animationDelay: `${index * 100}ms`,
                transition: 'background 0.3s ease',
              }}>
                
                <div style={{ width: '40px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', color: index === 0 ? 'var(--warning)' : index === 1 ? '#cbd5e1' : index === 2 ? '#b45309' : '#64748b' }}>
                  {index === 0 ? <Medal size={32} color="var(--warning)" /> : `#${index + 1}`}
                </div>
                
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt={user.name} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: index === 0 ? 'var(--warning)' : '#fff' }}>{user.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {(user.skills || []).slice(0, 4).map(skill => (
                      <span key={skill} style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    <Star size={20} fill="var(--primary)" /> {user.trustScore}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>trust points</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                <p>No users on the leaderboard yet. Be the first to earn trust points!</p>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
}
