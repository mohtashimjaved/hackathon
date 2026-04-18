'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, HeartHandshake, TrendingUp, Plus, CheckCircle2 } from 'lucide-react';
import { getMyRequests } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const weeklyData = [
  { name: 'Mon', requests: 12, helpGiven: 8 },
  { name: 'Tue', requests: 19, helpGiven: 15 },
  { name: 'Wed', requests: 15, helpGiven: 12 },
  { name: 'Thu', requests: 22, helpGiven: 18 },
  { name: 'Fri', requests: 28, helpGiven: 24 },
  { name: 'Sat', requests: 10, helpGiven: 9 },
  { name: 'Sun', requests: 8, helpGiven: 8 },
];

interface MyRequest {
  _id: string;
  title: string;
  status: string;
  urgency: string;
  createdAt: string;
  helpers: { _id: string; name: string }[];
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [helpingRequests, setHelpingRequests] = useState<MyRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, helping: 0, solved: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      loadMyData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadMyData = async () => {
    setLoading(true);
    try {
      const data = await getMyRequests();
      setMyRequests(data.requested || []);
      setHelpingRequests(data.helping || []);
      const solvedCount = (data.requested || []).filter((r: MyRequest) => r.status === 'solved').length;
      setStats({
        total: (data.requested || []).length,
        helping: (data.helping || []).length,
        solved: solvedCount,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div className="skeleton" style={{ width: '300px', height: '40px' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '40px' }}></div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
          <div className="glass-card skeleton" style={{ height: '120px' }}></div>
          <div className="glass-card skeleton" style={{ height: '120px' }}></div>
          <div className="glass-card skeleton" style={{ height: '120px' }}></div>
        </div>
        <div className="glass-card skeleton" style={{ height: '400px' }}></div>
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

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
            {isAuthenticated ? `Welcome, ${user?.name}` : 'Platform Insights'}
          </h1>
          <p className="text-muted">
            {isAuthenticated ? 'Your personal dashboard and activity overview.' : 'Monitor community activity and impact metrics.'}
          </p>
        </div>
        <Link href="/feed">
          <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
            <Plus size={18} /> New Request
          </button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '3rem' }}>
        <div className="glass-card delay-100" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', boxShadow: 'inset 0 0 0 1px rgba(79, 70, 229, 0.2)' }}>
            <Activity size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isAuthenticated ? 'My Requests' : 'Community Requests'}
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              {isAuthenticated ? stats.total : '1,284'}
            </h2>
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>
              {isAuthenticated ? `${stats.solved} solved` : '+12% this week'}
            </p>
          </div>
        </div>

        <div className="glass-card delay-200" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
            <HeartHandshake size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isAuthenticated ? 'Helping Others' : 'Help Offers'}
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              {isAuthenticated ? stats.helping : '1,102'}
            </h2>
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>
              {isAuthenticated ? 'active contributions' : '85% match rate'}
            </p>
          </div>
        </div>

        <div className="glass-card delay-300" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.2)' }}>
            <Clock size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isAuthenticated ? 'Trust Score' : 'Avg Response'}
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              {isAuthenticated ? (user?.trustScore || 0) : '4.2h'}
            </h2>
            <p style={{ color: isAuthenticated ? 'var(--primary)' : 'var(--danger)', fontSize: '0.85rem', fontWeight: '600' }}>
              {isAuthenticated ? 'reputation points' : '-5% vs last week'}
            </p>
          </div>
        </div>
      </div>

      {/* My Requests List (only when authenticated) */}
      {isAuthenticated && (myRequests.length > 0 || helpingRequests.length > 0) && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>My Requests</h3>
            {myRequests.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No requests posted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myRequests.slice(0, 5).map(req => (
                  <Link key={req._id} href={`/requests/${req._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{req.title}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.helpers?.length || 0} helpers</p>
                      </div>
                      <span className={`badge badge-${req.status === 'solved' ? 'resolved' : req.status}`} style={{
                        background: req.status === 'solved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: req.status === 'solved' ? 'var(--success)' : 'var(--warning)',
                        border: `1px solid ${req.status === 'solved' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                      }}>
                        {req.status === 'solved' ? <><CheckCircle2 size={12} /> Solved</> : req.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Helping Others</h3>
            {helpingRequests.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Not helping anyone yet. <Link href="/feed" style={{ color: 'var(--primary)' }}>Explore requests</Link></p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {helpingRequests.slice(0, 5).map(req => (
                  <Link key={req._id} href={`/requests/${req._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{req.title}</p>
                      <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>Active</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass-card delay-300" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>Engagement Trends</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></span> Requests
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }}></span> Help Given
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHelpGiven" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: '500' }}
              />
              <Area type="monotone" dataKey="requests" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary)' }} />
              <Area type="monotone" dataKey="helpGiven" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorHelpGiven)" activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--success)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
