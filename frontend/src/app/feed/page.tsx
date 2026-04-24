'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Clock, Tag, Plus, MapPin } from 'lucide-react';
import { getRequests, offerHelp } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface HelpRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  urgency: string;
  status: string;
  requester: { _id: string; name: string; trustScore: number };
  helpers: string[];
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Feed() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [offerLoadingId, setOfferLoadingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferHelp = async (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setOfferLoadingId(requestId);
    try {
      await offerHelp(requestId);
      showToast('Help offer sent! The requester will be notified.', 'success');
      await loadRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to offer help';
      showToast(message, 'error');
    } finally {
      setOfferLoadingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = !filterCategory || r.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header Banner */}
      <div className="banner-card">
        <span className="banner-label">Explore / Feed</span>
        <h1>Browse help requests with filterable community context.</h1>
        <p>Filter by category, urgency, skills, and location to surface the best matches.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Sidebar Filters */}
        <div className="card" style={{ padding: '2.5rem', position: 'sticky', top: '2rem' }}>
          <span className="banner-label" style={{ color: 'var(--primary)', opacity: 1 }}>Filters</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2.5rem' }}>Refine the feed</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" style={{ appearance: 'none' }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Career">Career</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Urgency</label>
              <select className="form-input" style={{ appearance: 'none' }}>
                <option value="">All urgency levels</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="form-label">Skills</label>
              <input type="text" className="form-input" placeholder="React, Figma, Git/GitHub" />
            </div>

            <div>
              <label className="form-label">Location</label>
              <input type="text" className="form-input" placeholder="Karachi, Lahore, Remote" />
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="card skeleton" style={{ height: '200px' }}></div>)
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-teal">{request.category}</span>
                    <span className={`badge ${request.urgency === 'critical' || request.urgency === 'high' ? 'badge-red' : 'badge-amber'}`}>
                      {request.urgency}
                    </span>
                    {request.status === 'solved' && <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', color: '#1a2421' }}>Solved</span>}
                  </div>
                  <Link href={`/requests/${request._id}`}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Open details</button>
                  </Link>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>{request.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {request.description}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {request.tags.map(tag => (
                    <span key={tag} className="badge" style={{ background: 'rgba(0,0,0,0.03)', color: '#64748b', padding: '0.25rem 0.75rem' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--card-border)' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{request.requester?.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={12} /> Karachi • {request.helpers?.length || 0} helper interested
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                    <Clock size={14} /> {timeAgo(request.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && filteredRequests.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '5rem' }}>
              <p className="text-muted">No requests found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
