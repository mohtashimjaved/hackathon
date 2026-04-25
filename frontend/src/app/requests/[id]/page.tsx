'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeartHandshake, CheckCircle2, MessageSquare, Clock, Tag, ArrowLeft, Send, User } from 'lucide-react';
import { getRequestById, offerHelp, markSolved, addMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
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
  const { showToast } = useToast();
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
      showToast('Help offer sent successfully!', 'success');
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to offer help';
      showToast(msg, 'error');
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
      showToast('Request marked as solved! Trust scores updated.', 'success');
      await refreshUser();
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to mark as solved';
      showToast(msg, 'error');
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
      showToast(msg, 'error');
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

  if (!request) return <div className="container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>Request not found.</div>;

  const isOwner = user?.id === request.requester?._id;

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <Link href="/feed" className="btn-back" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '2rem', width: 'fit-content' }}>
        <ArrowLeft size={18} /> Back to Feed
      </Link>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Content */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h1 className="heading-lg" style={{ marginBottom: 0, fontSize: '2.2rem' }}>{request.title}</h1>
              <span className="badge" style={{ 
                background: request.urgency === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                color: request.urgency === 'critical' ? 'var(--danger)' : 'var(--primary)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {request.urgency.toUpperCase()}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} />
                </div>
                <span style={{ color: '#fff', fontWeight: '500' }}>{request.requester?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {timeAgo(request.createdAt)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={16} /> {request.category}</div>
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
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '50px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
              >
                {sendingMessage ? '...' : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {request.status !== 'solved' && (!user || user.role !== 'need_help') && (
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
              {request.helpers?.map(helper => (
                <div key={helper._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {helper.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{helper.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Score: {helper.trustScore}</p>
                    </div>
                  </div>
                  {isOwner && request.status !== 'solved' && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px' }}
                      onClick={() => handleMarkSolved(helper._id)}
                    >
                      Choose
                    </button>
                  )}
                </div>
              ))}
              {(!request.helpers || request.helpers.length === 0) && (
                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>No helpers yet.</p>
              )}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Requester Info</h3>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{request.requester?.name}</p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Trust Score: {request.requester?.trustScore}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {request.requester?.skills?.map(skill => (
                  <span key={skill} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .badge-resolved { background: rgba(16, 185, 129, 0.1); color: var(--success); border-color: rgba(16, 185, 129, 0.2); }
        .btn-back:hover { color: #fff !important; transform: translateX(-5px); }
      `}} />
    </div>
  );
}
