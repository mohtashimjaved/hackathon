'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, HeartHandshake, Plus, CheckCircle2, TrendingUp } from 'lucide-react';
import { getMyRequests, getTrends } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface MyRequest {
  _id: string;
  title: string;
  status: string;
  urgency: string;
  createdAt: string;
  helpers: { _id: string; name: string }[];
}

interface TrendData {
  name: string;
  requests: number;
  helpGiven: number;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [helpingRequests, setHelpingRequests] = useState<MyRequest[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
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
      const [data, trendData] = await Promise.all([
        getMyRequests(),
        getTrends()
      ]);
      
      setMyRequests(data.requested || []);
      setHelpingRequests(data.helping || []);
      setTrends(trendData);
      
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

  if (loading) return <div className="container" style={{ padding: '5rem' }}><div className="card skeleton" style={{ height: '400px' }}></div></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      <div className="banner-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="banner-label">Dashboard / Overview</span>
          <h1>Welcome back, {user?.name.split(' ')[0]}.</h1>
          <p>Monitor your community activity, trust signals, and contribution momentum.</p>
        </div>
        <Link href="/feed" className="btn btn-primary" style={{ background: 'white', color: 'var(--banner-bg)', height: 'fit-content' }}>
          <Plus size={20} style={{ marginRight: '0.5rem' }} /> New request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(14, 165, 142, 0.1)', color: 'var(--primary)' }}>
              <Activity size={24} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>My requests</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.total}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>{stats.solved} solutions found</div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <HeartHandshake size={24} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Helping others</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.helping}</div>
          <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600' }}>Active contributions</div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Trust Score</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{user?.trustScore || 0}</div>
          <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: '600' }}>Reputation points</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Activity Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>My recent requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myRequests.slice(0, 5).map(req => (
                <Link key={req._id} href={`/requests/${req._id}`} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: 'none' }}>
                  <div style={{ fontWeight: '700' }}>{req.title}</div>
                  <span className={`badge ${req.status === 'solved' ? 'badge-teal' : 'badge-amber'}`}>{req.status}</span>
                </Link>
              ))}
              {myRequests.length === 0 && <p style={{ textAlign: 'center', color: '#64748b' }}>No requests posted yet.</p>}
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Currently helping</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {helpingRequests.slice(0, 5).map(req => (
                <Link key={req._id} href={`/requests/${req._id}`} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: 'none' }}>
                  <div style={{ fontWeight: '700' }}>{req.title}</div>
                  <span className="badge badge-teal">Active</span>
                </Link>
              ))}
              {helpingRequests.length === 0 && <p style={{ textAlign: 'center', color: '#64748b' }}>Not helping anyone yet.</p>}
            </div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Engagement trends</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="requests" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
