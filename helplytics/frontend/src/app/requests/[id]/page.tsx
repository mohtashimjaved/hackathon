'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeartHandshake, CheckCircle2, MessageSquare, Clock, Tag, ArrowLeft, Send, User } from 'lucide-react';
import { getRequestById, offerHelp, markSolved, addMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Helper {
  _id: string;
  name: string;
  trustScore: number;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  text: string;
  createdAt: string;
}

interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  urgency: string;
  status: string;
  requester: { _id: string; name: string; skills: string[]; trustScore: number };
  helpers: Helper[];
  messages: Message[];
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

export default function RequestDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const id = params.id as string;

  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [offeringHelp, setOfferingHelp] = useState(false);
  const [solving, setSolving] = useState(false);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const data = await getRequestById(id);
      setRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferHelp = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setOfferingHelp(true);
    try {
      await offerHelp(id);
      alert('Help offer sent successfully!');
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to offer help';
      alert(msg);
    } finally {
      setOfferingHelp(false);
    }
  };

  const handleMarkSolved = async (helperId?: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setSolving(true);
    try {
      await markSolved(id, helperId);
      alert('Request marked as solved! Trust scores updated.');
      await refreshUser();
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to mark as solved';
      alert(msg);
    } finally {
      setSolving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sendingMessage) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setSendingMessage(true);
    try {
      await addMessage(id, message);
      setMessage('');
      await loadRequest(); // Reload to get new messages
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      alert(msg);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 2rem' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '2rem' }}></div>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card skeleton" style={{ height: '300px' }}></div>
            <div className="glass-card skeleton" style={{ height: '400px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card skeleton" style={{ height: '150px' }}></div>
            <div className="glass-card skeleton" style={{ height: '250px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container" style={{ padding: '10rem 2rem', textAlign: 'center' }}>
        <h2 className="heading-lg">Request not found</h2>
        <Link href="/feed" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Feed</Link>
      </div>
    );
  }

  const urgencyColors: Record<string, { bg: string; color: string; border: string }> = {
    low: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: 'rgba(16, 185, 129, 0.2)' },
    medium: { bg: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', border: 'rgba(79, 70, 229, 0.2)' },
    high: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: 'rgba(245, 158, 11, 0.2)' },
    critical: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'rgba(239, 68, 68, 0.2)' },
  };
  const uc = urgencyColors[request.urgency] || urgencyColors.medium;

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <Link href="/feed" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', marginBottom: '2rem', fontSize: '0.95rem', transition: 'color 0.2s' }}>
        <ArrowLeft size={18} /> Back to Feed
      </Link>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: 0 }}>{request.title}</h1>
              <span className="badge" style={{ background: uc.bg, color: uc.color, border: `1px solid ${uc.border}` }}>
                {request.urgency} Urgency
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Posted by {request.requester?.name || 'Unknown'}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {timeAgo(request.createdAt)}</span>
              <span>•</span>
              <span>Category: {request.category}</span>
              {request.status === 'solved' && (
                <>
                  <span>•</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Solved
                  </span>
                </>
              )}
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

          {/* Discussion */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Discussion ({request.messages?.length || 0})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {request.messages?.map((msg) => (
                <div key={msg._id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0 12px 12px 12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{msg.sender?.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p style={{ color: '#cbd5e1' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {(!request.messages || request.messages.length === 0) && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder={isAuthenticated ? 'Type your message...' : 'Sign in to message...'}
                style={{ flex: 1 }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isAuthenticated || sendingMessage}
              />
              <button
                className="btn btn-primary"
                style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={handleSendMessage}
                disabled={!isAuthenticated || sendingMessage}
              >
                {sendingMessage ? '...' : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {request.status !== 'solved' && (
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Want to help?</h3>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: offeringHelp ? 0.7 : 1 }}
                onClick={handleOfferHelp}
                disabled={offeringHelp}
              >
                <HeartHandshake size={18} /> {offeringHelp ? 'Sending...' : 'Offer Help'}
              </button>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>Earn trust points by successfully resolving this request!</p>
            </div>
          )}

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Current Helpers ({request.helpers?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(request.helpers || []).map(helper => (
                <div key={helper._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{helper.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>★ {helper.trustScore}</span>
                </div>
              ))}
              {(request.helpers || []).length === 0 && (
                <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No helpers yet. Be the first!</p>
              )}
            </div>
            
            {request.status !== 'solved' && user && request.requester?._id === user.id && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Choose a helper to reward:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {request.helpers?.map(helper => (
                    <button 
                      key={helper._id}
                      className="btn btn-secondary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--success)', color: 'var(--success)', opacity: solving ? 0.7 : 1 }}
                      onClick={() => handleMarkSolved(helper._id)}
                      disabled={solving}
                    >
                      <CheckCircle2 size={18} /> Solve with {helper.name}
                    </button>
                  ))}
                  {(!request.helpers || request.helpers.length === 0) && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--success)', color: 'var(--success)', opacity: solving ? 0.7 : 1 }}
                      onClick={() => handleMarkSolved()}
                      disabled={solving}
                    >
                      <CheckCircle2 size={18} /> Mark as Solved
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
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
