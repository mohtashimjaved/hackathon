'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, RefreshCw, Award } from 'lucide-react';
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
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header Banner */}
      <div className="banner-card">
        <span className="banner-label">Ecosystem / Community</span>
        <h1>Recognize the people who keep the community moving.</h1>
        <p>The leaderboard tracks contribution momentum, trust signals, and overall impact across the HelpHub AI network.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Main Rankings */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Platform rankings</h2>
            <button className="btn btn-secondary" onClick={loadLeaderboard} disabled={loading} style={{ padding: '0.6rem 1rem' }}>
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '100px', margin: '1rem 2.5rem' }}></div>)
            ) : (
              users.map((user, index) => (
                <div key={user._id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem 2.5rem', 
                  borderBottom: index !== users.length - 1 ? '1px solid var(--card-border)' : 'none',
                  background: index < 3 ? 'rgba(14, 165, 142, 0.02)' : 'transparent'
                }}>
                  <div style={{ width: '40px', fontSize: '1.5rem', fontWeight: '800', color: index === 0 ? 'var(--primary)' : '#64748b', textAlign: 'center' }}>
                    {index + 1}
                  </div>

                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {user.name.charAt(0)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{user.name}</h3>
                      {index === 0 && <span className="badge badge-teal"><Award size={14} /> Top Helper</span>}
                      {index === 1 && <span className="badge badge-teal" style={{ opacity: 0.7 }}>Rising Star</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(user.skills || []).slice(0, 3).map(skill => (
                        <span key={skill} className="badge" style={{ background: 'rgba(0,0,0,0.03)', color: '#64748b' }}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Star size={24} fill="var(--primary)" /> {user.trustScore}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>trust points earned</div>
                  </div>
                </div>
              ))
            )}
            {!loading && users.length === 0 && (
              <div style={{ padding: '5rem', textAlign: 'center', color: '#64748b' }}>
                <Trophy size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                <p>No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <span className="banner-label" style={{ color: 'var(--primary)', opacity: 1 }}>Scoring</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>How trust points work</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>+10 Points</div>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>For every help request successfully solved and marked by the requester.</p>
              </div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>+5 Points</div>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>For offering high-quality responses that get upvoted by others.</p>
              </div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Badge Multipliers</div>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Expert badges grant 1.2x multipliers on certain skill-based solutions.</p>
              </div>
            </div>
          </div>

          <div className="banner-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.25rem' }}>Ready to climb?</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: '2rem' }}>Start by exploring open requests and offering your expertise to peers in need.</p>
            <Link href="/feed" className="btn btn-primary" style={{ width: '100%' }}>Explore requests</Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
