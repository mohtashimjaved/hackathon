'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, Search, User, Clock, Check, MoreVertical } from 'lucide-react';
import { getConversations, getConversationMessages, sendPrivateMessage } from '@/lib/api';

interface Message {
  _id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: { _id: string; name: string; avatar?: string }[];
  lastMessage?: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientIdFromQuery = searchParams.get('to');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation._id);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await getConversationMessages(id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    const recipient = activeConversation.participants.find(p => p._id !== user?.id);
    if (!recipient) return;

    setSending(true);
    try {
      await sendPrivateMessage(recipient._id, newMessage);
      setNewMessage('');
      loadMessages(activeConversation._id);
      loadConversations(); // Refresh last message in list
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== user?.id);
  };

  if (loading) return <div className="container" style={{ padding: '5rem' }}><div className="card skeleton" style={{ height: '500px' }}></div></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 120px)' }}>
      <div className="card" style={{ padding: '0', display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', overflow: 'hidden' }}>
        
        {/* Left Sidebar: Conversation List */}
        <div style={{ borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search conversations..." 
                style={{ paddingLeft: '3rem', fontSize: '0.9rem', padding: '0.75rem 3rem' }} 
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConversation?._id === conv._id;
              return (
                <div 
                  key={conv._id} 
                  onClick={() => setActiveConversation(conv)}
                  style={{ 
                    padding: '1.5rem 2rem', 
                    cursor: 'pointer', 
                    background: isActive ? 'rgba(14, 165, 142, 0.05)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                  className="conv-item"
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
                    {other?.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{other?.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>12:45</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.lastMessage || 'Start a conversation'}
                    </p>
                  </div>
                </div>
              );
            })}
            {conversations.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <p>No active conversations.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Main: Chat Area */}
        {activeConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{ padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 142, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700' }}>
                  {getOtherParticipant(activeConversation)?.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700' }}>{getOtherParticipant(activeConversation)?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div> Active now
                  </div>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><MoreVertical size={20} /></button>
            </div>

            {/* Message List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ 
                      padding: '1rem 1.5rem', 
                      borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                      background: isMe ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                      color: isMe ? 'white' : 'var(--foreground)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem', textAlign: isMe ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '0.25rem' }}>
                      12:46 PM {isMe && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', opacity: 0.5 }}>
                  <div style={{ textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ marginBottom: '1rem' }} />
                    <p>Send a message to start the conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div style={{ padding: '2rem 2.5rem', borderTop: '1px solid var(--card-border)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type your message here..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ width: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Send size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Your Messages</h3>
              <p>Select a conversation to start chatting with the community.</p>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .conv-item:hover { background: rgba(0,0,0,0.02); }
      `}} />
    </div>
  );
}

function MessageSquare({ size, style }: { size: number, style?: React.CSSProperties }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={style}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
