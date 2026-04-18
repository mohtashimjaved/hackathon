'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, HeartHandshake, TrendingUp } from 'lucide-react';

const mockData = [
  { name: 'Mon', requests: 12, helpGiven: 8 },
  { name: 'Tue', requests: 19, helpGiven: 15 },
  { name: 'Wed', requests: 15, helpGiven: 12 },
  { name: 'Thu', requests: 22, helpGiven: 18 },
  { name: 'Fri', requests: 28, helpGiven: 24 },
  { name: 'Sat', requests: 10, helpGiven: 9 },
  { name: 'Sun', requests: 8, helpGiven: 8 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container animate-fade-in-up" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Platform Insights</h1>
          <p className="text-muted">Monitor community activity and impact metrics.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
          <TrendingUp size={18} /> Export Analytics
        </button>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '3rem' }}>
        <div className="glass-card delay-100" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', boxShadow: 'inset 0 0 0 1px rgba(79, 70, 229, 0.2)' }}>
            <Activity size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Community Requests</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>1,284</h2>
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>+12% this week</p>
          </div>
        </div>

        <div className="glass-card delay-200" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)' }}>
            <HeartHandshake size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Help Offers</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>1,102</h2>
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>85% match rate</p>
          </div>
        </div>

        <div className="glass-card delay-300" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.2)' }}>
            <Clock size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Response</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>4.2h</h2>
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '600' }}>-5% vs last week</p>
          </div>
        </div>
      </div>

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
            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
