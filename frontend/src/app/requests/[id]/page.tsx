'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeartHandshake, CheckCircle2, MessageSquare, Clock, Tag, ArrowLeft, Send, MapPin, User } from 'lucide-react';
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
    try {
      await markSolved(id, helperId);
      showToast('Request marked as solved! Trust scores updated.', 'success');
      await refreshUser();
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to mark as solved';
      showToast(msg, 'error');
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
      await loadRequest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      showToast(msg, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '5rem' }}><div className="card skeleton" style={{ height: '400px' }}></div></div>;
  if (!request) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Request not found.</div>;

  const isOwner = user?.id === request.requester?._id;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      <Link href="/feed" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '600', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to feed
      </Link>

      <div className="banner-card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span className="badge badge-teal" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>{request.category}</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>{request.urgency} Urgency</span>
        </div>
        <h1>{request.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', opacity: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} /> {request.requester?.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} /> Karachi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> {timeAgo(request.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Details */}
          <div className="card" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>Request details</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4b5563', whiteSpace: 'pre-wrap', marginBottom: '2.5rem' }}>
              {request.description}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {request.tags.map(tag => (
                <span key={tag} className="badge" style={{ background: 'rgba(0,0,0,0.03)', color: '#64748b', padding: '0.4rem 1rem' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Discussion */}
          <div className="card" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare size={24} /> Discussion
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              {request.messages?.map((msg) => (
                <div key={msg._id} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {msg.sender?.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700' }}>{msg.sender?.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {(!request.messages || request.messages.length === 0) && (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No messages yet. Be the first to start the conversation!</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type your reply here..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn btn-primary" style={{ padding: '0 2rem' }} onClick={handleSendMessage} disabled={sendingMessage || !message.trim()}>
                {sendingMessage ? '...' : 'Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Actions */}
          {request.status !== 'solved' && (
            <div className="card" style={{ padding: '2.5rem' }}>
              {isOwner ? (
                <>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Manage request</h3>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '2rem' }}>Choose a helper below to mark this request as solved and award trust points.</p>
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => handleMarkSolved()}>Close request</button>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Offer your help</h3>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '2rem' }}>Help Sara Noor solve this and earn trust points on your profile.</p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleOfferHelp} disabled={offeringHelp}>
                    {offeringHelp ? 'Sending...' : 'Offer assistance'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Helpers List */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Interested helpers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {request.helpers?.map(helper => (
                <div key={helper._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {helper.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{helper.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>{helper.trustScore} pts</div>
                    </div>
                  </div>
                  {isOwner && request.status !== 'solved' && (
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleMarkSolved(helper._id)}>Choose</button>
                  )}
                </div>
              ))}
              {(!request.helpers || request.helpers.length === 0) && (
                <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>No helpers yet.</p>
              )}
            </div>
          </div>

          {/* Requester Profile */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>About the requester</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 142, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700' }}>
                {request.requester?.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '700' }}>{request.requester?.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Trust Score: {request.requester?.trustScore}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(request.requester?.skills || []).map(skill => (
                <span key={skill} className="badge" style={{ background: 'rgba(0,0,0,0.03)', color: '#64748b', fontSize: '0.75rem' }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
