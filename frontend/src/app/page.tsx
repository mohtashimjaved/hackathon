import Link from 'next/link';
import { ArrowRight, HeartHandshake, Search, Users, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="container" style={{ padding: '6rem 2rem 4rem', position: 'relative' }}>
      
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '300px', height: '300px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3, zIndex: -1 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px', background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, zIndex: -1 }}></div>

      <section className="hero animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '8rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', marginBottom: '2rem', color: 'var(--accent)', fontWeight: '500', fontSize: '0.9rem', backdropFilter: 'blur(10px)' }}>
          🤝 Join the Helplytics Community
        </div>
        <h1 className="heading-xl">
          Get the Help You Need. <br/> <span className="text-gradient">Share the Skills You Have.</span>
        </h1>
        <p className="text-muted delay-100 animate-fade-in-up" style={{ maxWidth: '700px', margin: '0 auto 3rem', fontSize: '1.25rem', lineHeight: '1.8' }}>
          Helplytics is a community-driven platform bridging the gap between students seeking guidance and experts willing to share their knowledge.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }} className="delay-200 animate-fade-in-up">
          <Link href="/feed" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Explore Requests <ArrowRight style={{ marginLeft: '0.75rem' }} size={20} />
          </Link>
          <Link href="/leaderboard" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            View Leaderboard
          </Link>
        </div>
      </section>

      <section className="features grid grid-cols-3 delay-300 animate-fade-in-up">
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '16px', color: 'var(--primary)', boxShadow: 'inset 0 0 0 1px rgba(79, 70, 229, 0.2)' }}>
            <Search size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: '700' }}>Explore & Find</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>Browse the community feed to find requests matching your skills, or post your own requests.</p>
        </div>
        
        <div className="glass-card" style={{ padding: '3rem 2rem', transform: 'translateY(-20px)' }}>
          <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '16px', color: 'var(--secondary)', boxShadow: 'inset 0 0 0 1px rgba(236, 72, 153, 0.2)' }}>
            <HeartHandshake size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: '700' }}>Connect & Solve</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>Offer your help directly to peers. Collaborate in real-time to solve complex technical problems.</p>
        </div>

        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', color: 'var(--warning)', boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.2)' }}>
            <Trophy size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: '700' }}>Earn Trust</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>Build your reputation. Earn trust points for every solved request and climb the global leaderboard.</p>
        </div>
      </section>
    </div>
  );
}
