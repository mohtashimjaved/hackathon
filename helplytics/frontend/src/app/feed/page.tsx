'use client';

import { useState } from 'react';
import { Search, Filter, HeartHandshake, Clock, Tag } from 'lucide-react';

const mockRequests = [
  { id: '1', title: 'Need help deploying Next.js app to Vercel', category: 'DevOps', tags: ['Next.js', 'Vercel', 'Deployment'], urgency: 'high', author: 'Alex Chen', time: '2 hours ago' },
  { id: '2', title: 'How to implement JWT authentication in Express?', category: 'Backend', tags: ['Node.js', 'Express', 'JWT'], urgency: 'medium', author: 'Sarah Miller', time: '5 hours ago' },
  { id: '3', title: 'React useEffect dependency array infinite loop', category: 'Frontend', tags: ['React', 'Hooks', 'Bug'], urgency: 'critical', author: 'James Wilson', time: '1 day ago' },
  { id: '4', title: 'Understanding CSS Grid layout for dashboard', category: 'Design', tags: ['CSS', 'Grid', 'UI'], urgency: 'low', author: 'Maria Garcia', time: '2 days ago' },
];

export default function Feed() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = mockRequests.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Community Feed</h1>
          <p className="text-muted">Discover peers who need your expertise, or post your own request.</p>
        </div>
        <button className="btn btn-primary" style={{ borderRadius: '100px', padding: '0.85rem 1.5rem' }}>
          Post a Request
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search requests by title, tags, or category..." 
            style={{ paddingLeft: '3rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', borderRadius: '100px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" style={{ gap: '0.5rem', borderRadius: '100px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid delay-100" style={{ gridTemplateColumns: '1fr' }}>
        {filteredRequests.map((request, index) => (
          <div key={request.id} className="glass-card animate-fade-in-up request-card" style={{ padding: '2rem', animationDelay: `${index * 100}ms`, cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', fontFamily: 'var(--font-heading)' }}>{request.title}</h3>
              <span className={`badge`} style={{ 
                background: request.urgency === 'critical' ? 'rgba(239, 68, 68, 0.1)' : request.urgency === 'high' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: request.urgency === 'critical' ? 'var(--danger)' : request.urgency === 'high' ? 'var(--warning)' : 'var(--success)',
                border: `1px solid ${request.urgency === 'critical' ? 'rgba(239, 68, 68, 0.2)' : request.urgency === 'high' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
              }}>
                {request.urgency} Urgency
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {request.tags.map(tag => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(79, 70, 229, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '100px' }}>
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500', color: '#cbd5e1' }}>{request.author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {request.time}</span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(79, 70, 229, 0.3)' }}>
                <HeartHandshake size={16} /> Offer Help
              </button>
            </div>
          </div>
        ))}
        {filteredRequests.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <p>No requests found matching your search.</p>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .request-card:hover { transform: translateY(-5px); border-color: rgba(79, 70, 229, 0.3); }
      `}} />
    </div>
  );
}
