'use client';

import { useParams } from 'next/navigation';
import { HeartHandshake, CheckCircle2, MessageSquare, Clock, Tag } from 'lucide-react';

export default function RequestDetail() {
  const params = useParams();
  const id = params.id;

  // Mock data for the UI
  const request = {
    title: 'Need help deploying Next.js app to Vercel',
    description: 'I have built a Next.js application but I am struggling to deploy it to Vercel. Every time I push to GitHub, the build fails with an ESLint error that I cannot figure out. Can someone please guide me through the deployment process or help me fix the build error?',
    category: 'DevOps',
    tags: ['Next.js', 'Vercel', 'Deployment', 'Error'],
    urgency: 'high',
    author: 'Alex Chen',
    time: '2 hours ago',
    status: 'open',
    helpers: [
      { name: 'Sarah Miller', trustScore: 1220, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
      { name: 'David Kim', trustScore: 720, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David' }
    ]
  };

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Main Request Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 0 }}>{request.title}</h1>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>High Urgency</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Posted by {request.author}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {request.time}</span>
              <span>•</span>
              <span>Category: {request.category}</span>
            </div>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e2e8f0', marginBottom: '2rem' }}>
              {request.description}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {request.tags.map(tag => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(79, 70, 229, 0.1)', padding: '0.4rem 1rem', borderRadius: '100px' }}>
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interaction / Messaging Mockup */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Discussion
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <img src={request.helpers[0].avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff' }} />
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0 12px 12px 12px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{request.helpers[0].name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>1 hour ago</span>
                </div>
                <p style={{ color: '#cbd5e1' }}>I can help you with this! The ESLint error during Vercel builds usually happens when there's an unused variable. Check your build logs for the exact file.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" className="form-input" placeholder="Type your message..." style={{ flex: 1 }} />
              <button className="btn btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Want to help?</h3>
            <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <HeartHandshake size={18} /> Offer Help
            </button>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>Earn trust points by successfully resolving this request!</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Current Helpers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {request.helpers.map(helper => (
                <div key={helper.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={helper.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff' }} />
                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{helper.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>★ {helper.trustScore}</span>
                </div>
              ))}
            </div>
            
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
              <CheckCircle2 size={18} /> Mark as Solved
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
