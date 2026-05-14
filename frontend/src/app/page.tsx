import Link from 'next/link';
import { ArrowRight, HeartHandshake, Search, Users, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="container" style={{ padding: '6rem 2rem 4rem', position: 'relative' }}>
      
      {/* Decorative Orbs */}
      <div className="float-orb" style={{ position: 'absolute', top: '-5%', right: '5%', width: '400px', height: '400px', background: 'linear-gradient(135deg, var(--primary), #0ea5e9)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.25, zIndex: -1 }}></div>
      <div className="float-orb-delayed" style={{ position: 'absolute', bottom: '15%', left: '-5%', width: '350px', height: '350px', background: 'linear-gradient(135deg, var(--secondary), #ec4899)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, zIndex: -1 }}></div>
      <div className="float-orb" style={{ position: 'absolute', top: '40%', left: '30%', width: '200px', height: '200px', background: 'linear-gradient(135deg, #8b5cf6, var(--primary))', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: -1, animationDuration: '12s' }}></div>

      <section className="hero animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '8rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '100px', marginBottom: '2.5rem', color: '#0f172a', fontWeight: '700', fontSize: '0.9rem', backdropFilter: 'blur(20px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <span style={{ display: 'flex', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></span>
          Join the Helplytics Community
        </div>
        <h1 className="heading-xl">
          Get the Help You Need. <br/> <span className="text-gradient">Share the Skills You Have.</span>
        </h1>
        <p className="text-muted delay-100 animate-fade-in-up" style={{ maxWidth: '750px', margin: '0 auto 3.5rem', fontSize: '1.25rem', lineHeight: '1.8', color: '#475569' }}>
          Helplytics is a community-driven platform bridging the gap between students seeking guidance and experts willing to share their knowledge.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }} className="delay-200 animate-fade-in-up">
          <Link href="/feed" className="btn btn-primary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
            Explore Requests <ArrowRight style={{ marginLeft: '0.75rem' }} size={20} />
          </Link>
          <Link href="/leaderboard" className="btn btn-secondary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
            View Leaderboard
          </Link>
        </div>
      </section>

      <section className="features grid grid-cols-3 delay-300 animate-fade-in-up" style={{ perspective: '1000px' }}>
        <div className="glass-card float-hover" style={{ padding: '3.5rem 2.5rem' }}>
          <div style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1))', borderRadius: '24px', color: 'var(--primary)', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.12)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
            <Search size={32} />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: '800', color: '#0f172a' }}>Explore & Find</h3>
          <p className="text-muted" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7' }}>Browse the community feed to find requests matching your skills, or post your own requests.</p>
        </div>
        
        <div className="glass-card float-hover-delayed" style={{ padding: '3.5rem 2.5rem', transform: 'translateY(-20px)' }}>
          <div style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(245, 158, 11, 0.1))', borderRadius: '24px', color: 'var(--secondary)', boxShadow: '0 8px 24px rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
            <HeartHandshake size={32} />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: '800', color: '#0f172a' }}>Connect & Solve</h3>
          <p className="text-muted" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7' }}>Offer your help directly to peers. Collaborate in real-time to solve complex technical problems.</p>
        </div>

        <div className="glass-card float-hover" style={{ padding: '3.5rem 2.5rem' }}>
          <div style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))', borderRadius: '24px', color: 'var(--success)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Trophy size={32} />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: '800', color: '#0f172a' }}>Earn Trust</h3>
          <p className="text-muted" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7' }}>Build your reputation. Earn trust points for every solved request and climb the global leaderboard.</p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works delay-300 animate-fade-in-up" style={{ marginTop: '8rem', textAlign: 'center' }}>
        <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>How It Works</h2>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>A simple, intuitive process to get help or start helping others.</p>
        
        <div className="grid grid-cols-3" style={{ position: 'relative' }}>
          {/* Connecting Line */}
          <div style={{ position: 'absolute', top: '40px', left: '15%', right: '15%', height: '2px', background: 'linear-gradient(to right, rgba(5, 150, 105, 0.2), rgba(217, 119, 6, 0.2))', zIndex: 0 }} className="hidden-mobile"></div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.1)' }}>1</div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Post a Request</h4>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Describe your technical issue, tag it, and set the urgency.</p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: '4px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(217, 119, 6, 0.1)' }}>2</div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Get Assistance</h4>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Experts in the community review your request and offer help.</p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: '4px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.1)' }}>3</div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Solve & Reward</h4>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Collaborate via chat, resolve the issue, and award Trust Points.</p>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="cta animate-fade-in-up" style={{ marginTop: '8rem', padding: '4rem', background: 'linear-gradient(135deg, var(--primary), #10b981)', borderRadius: '32px', textAlign: 'center', color: 'white', boxShadow: '0 20px 40px rgba(5, 150, 105, 0.2)' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: '800', marginBottom: '1.5rem' }}>Ready to join the revolution?</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>Whether you need help with a tricky bug or want to share your expertise, Helplytics is the place for you.</p>
        <Link href="/register">
          <button className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '100px' }}>Get Started for Free</button>
        </Link>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .float-orb {
          animation: float 8s ease-in-out infinite;
        }
        .float-orb-delayed {
          animation: float 10s ease-in-out infinite reverse;
        }
        .float-hover {
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .float-hover:hover {
          transform: translateY(-15px) scale(1.02);
          z-index: 10;
        }
        .float-hover-delayed {
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .float-hover-delayed:hover {
          transform: translateY(-35px) scale(1.02);
          z-index: 10;
        }
      `}} />
    </div>
  );
}
