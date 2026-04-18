'use client';

import { Trophy, Medal, Star } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'Alex Chen', skills: ['React', 'Next.js', 'Node.js'], score: 1450, solved: 145, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex' },
  { rank: 2, name: 'Sarah Miller', skills: ['Python', 'Django', 'SQL'], score: 1220, solved: 122, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
  { rank: 3, name: 'James Wilson', skills: ['UI/UX', 'Figma', 'CSS'], score: 980, solved: 98, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=James' },
  { rank: 4, name: 'Maria Garcia', skills: ['Java', 'Spring', 'AWS'], score: 850, solved: 85, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Maria' },
  { rank: 5, name: 'David Kim', skills: ['C++', 'Algorithms', 'Go'], score: 720, solved: 72, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David' },
];

export default function Leaderboard() {
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
      </div>

      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '0' }}>
        {mockLeaderboard.map((user, index) => (
          <div key={user.name} className="animate-fade-in-up" style={{ 
            display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem 2rem', 
            borderBottom: index !== mockLeaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            background: index === 0 ? 'linear-gradient(to right, rgba(245, 158, 11, 0.05), transparent)' : 'transparent',
            animationDelay: `${index * 100}ms`
          }}>
            
            <div style={{ width: '40px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', color: index === 0 ? 'var(--warning)' : index === 1 ? '#cbd5e1' : index === 2 ? '#b45309' : '#64748b' }}>
              {index === 0 ? <Medal size={32} color="var(--warning)" /> : `#${user.rank}`}
            </div>
            
            <img src={user.avatar} alt={user.name} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: index === 0 ? 'var(--warning)' : '#fff' }}>{user.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {user.skills.map(skill => (
                  <span key={skill} style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{skill}</span>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                <Star size={20} fill="var(--primary)" /> {user.score}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{user.solved} requests solved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
