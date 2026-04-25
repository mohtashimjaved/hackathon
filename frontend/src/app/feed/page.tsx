'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, HeartHandshake, Clock, Tag, Plus, X, AlertCircle } from 'lucide-react';
import { getRequests, createRequest, offerHelp } from '@/lib/api';
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
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create form state
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    tags: '',
    urgency: 'medium',
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
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

  const validateCreate = () => {
    const errs: Record<string, string> = {};
    if (!createData.title.trim()) errs.title = 'Title is required';
    if (!createData.description.trim()) errs.description = 'Description is required';
    if (createData.description.length < 20) errs.description = 'Please provide more details (min 20 chars)';
    if (!createData.category) errs.category = 'Category is required';
    
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
    if (createErrors[name]) {
      setCreateErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }
    
    if (!validateCreate()) return;

    setCreating(true);
    try {
      await createRequest({
        ...createData,
        tags: createData.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setShowCreateModal(false);
      setCreateData({ title: '', description: '', category: 'Frontend', tags: '', urgency: 'medium' });
      showToast('Request published successfully!', 'success');
      await loadRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create request';
      showToast(message, 'error');
    } finally {
      setCreating(false);
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

  const categories = Array.from(new Set(requests.map(r => r.category)));

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Community Feed</h1>
          <p className="text-muted">Discover peers who need your expertise, or post your own request.</p>
        </div>
        {(!user || user.role !== 'can_help') && (
          <button
            className="btn btn-primary"
            style={{ borderRadius: '100px', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => isAuthenticated ? setShowCreateModal(true) : router.push('/register')}
          >
            <Plus size={18} /> Post a Request
          </button>
        )}
      </div>

      {/* Search and filter bar */}
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
        <button
          className="btn btn-secondary"
          style={{ gap: '0.5rem', borderRadius: '100px', background: showFilters ? 'rgba(79,70,229,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="glass-card animate-fade-in-up" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.9rem' }}>Category:</span>
            <button
              onClick={() => setFilterCategory('')}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', borderRadius: '100px', background: !filterCategory ? 'rgba(79,70,229,0.2)' : undefined, borderColor: !filterCategory ? 'var(--primary)' : undefined }}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', borderRadius: '100px', background: filterCategory === cat ? 'rgba(79,70,229,0.2)' : undefined, borderColor: filterCategory === cat ? 'var(--primary)' : undefined }}
              >{cat}</button>
            ))}
          </div>
        </div>
      )}

      {/* Request cards */}
      <div className="grid delay-100" style={{ gridTemplateColumns: '1fr' }}>
        {loading ? (
          <>
            <div className="glass-card skeleton" style={{ height: '180px', marginBottom: '1.5rem' }}></div>
            <div className="glass-card skeleton" style={{ height: '180px', marginBottom: '1.5rem' }}></div>
            <div className="glass-card skeleton" style={{ height: '180px', marginBottom: '1.5rem' }}></div>
          </>
        ) : (
          <>
            {filteredRequests.map((request, index) => (
              <Link key={request._id} href={`/requests/${request._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card animate-fade-in-up request-card" style={{ padding: '2rem', animationDelay: `${index * 100}ms`, cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '600', fontFamily: 'var(--font-heading)' }}>{request.title}</h3>
                    <span className="badge" style={{ 
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
                      <span style={{ fontWeight: '500', color: '#cbd5e1' }}>{request.requester?.name || 'Anonymous'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {timeAgo(request.createdAt)}</span>
                    </div>
                    {(!user || user.role !== 'need_help') && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem', color: 'var(--primary)', borderColor: 'rgba(79, 70, 229, 0.3)', opacity: offerLoadingId === request._id ? 0.6 : 1 }}
                        onClick={(e) => handleOfferHelp(e, request._id)}
                        disabled={offerLoadingId === request._id}
                      >
                        <HeartHandshake size={16} /> {offerLoadingId === request._id ? 'Sending...' : 'Offer Help'}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {filteredRequests.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                <p>No requests found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setShowCreateModal(false)}
        >
          <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: '650px', padding: '3rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 className="heading-lg" style={{ marginBottom: 0, fontSize: '2rem' }}>Post a Help Request</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={28} /></button>
            </div>
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>Request Title</label>
                <input 
                  name="title"
                  type="text" 
                  className={`form-input ${createErrors.title ? 'border-danger' : ''}`} 
                  placeholder="e.g. Need help debugging React state issue" 
                  value={createData.title} 
                  onChange={handleCreateChange}
                />
                {createErrors.title && <span className="form-error"><AlertCircle size={14} /> {createErrors.title}</span>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>Detailed Description</label>
                <textarea 
                  name="description"
                  className={`form-input ${createErrors.description ? 'border-danger' : ''}`} 
                  placeholder="Describe your problem in detail so others can help..." 
                  value={createData.description} 
                  onChange={handleCreateChange}
                  style={{ minHeight: '150px', resize: 'vertical' }} 
                />
                {createErrors.description && <span className="form-error"><AlertCircle size={14} /> {createErrors.description}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>Category</label>
                  <select 
                    name="category"
                    className="form-input form-select" 
                    value={createData.category} 
                    onChange={handleCreateChange}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Database">Database</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>Urgency Level</label>
                  <select 
                    name="urgency"
                    className="form-input form-select" 
                    value={createData.urgency} 
                    onChange={handleCreateChange}
                  >
                    <option value="low">Low - Take your time</option>
                    <option value="medium">Medium - Within a few days</option>
                    <option value="high">High - Needed soon</option>
                    <option value="critical">Critical - Blocking progress</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>Tags (comma separated)</label>
                <input 
                  name="tags"
                  type="text" 
                  className="form-input" 
                  placeholder="React, CSS, bug..." 
                  value={createData.tags} 
                  onChange={handleCreateChange} 
                />
              </div>
              <button className="btn btn-primary" type="submit" style={{ padding: '1.25rem', marginTop: '1rem', opacity: creating ? 0.7 : 1 }} disabled={creating}>
                {creating ? 'Publishing Request...' : 'Publish Help Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .request-card:hover { transform: translateY(-5px); border-color: rgba(79, 70, 229, 0.3); }
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
        .border-danger { border-color: var(--danger) !important; }
      `}} />
    </div>
  );
}
