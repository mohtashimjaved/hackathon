import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Side: Hero Content */}
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>
            Grand Coding Night 2026
          </span>
          <h1 className="heading-xl" style={{ marginBottom: '2.5rem' }}>
            Find help faster. <br/>
            <span style={{ color: 'var(--primary)' }}>Become help that matters.</span>
          </h1>
          <p className="text-muted" style={{ maxWidth: '600px', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
            HelpHub AI is a community-powered support network for students, mentors, creators, and builders. 
            Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '5rem' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '1.125rem 2.5rem' }}>
              Open product demo
            </Link>
            <Link href="/feed" className="btn btn-secondary" style={{ padding: '1.125rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Post a request <Plus size={20} />
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Members', value: '384+', desc: 'Students, mentors, and helpers in the loop.' },
              { label: 'Requests', value: '72+', desc: 'Support posts shared across learning journeys.' },
              { label: 'Solved', value: '69+', desc: 'Problems resolved through fast community action.' }
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: '2rem 1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.5rem', display: 'block' }}>{stat.label}</span>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stat.value}</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Ecosystem Card */}
        <div className="banner-card" style={{ padding: '3.5rem 2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <span className="banner-label">Live product feel</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            More than a form. <br/>
            More like an <span style={{ color: 'var(--primary)' }}>ecosystem.</span>
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '3rem', lineHeight: '1.6' }}>
            A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, 
            contribution signals, and leaderboard momentum built directly in HTML, CSS, JavaScript, and Cookies.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { title: 'AI request intelligence', text: 'Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.' },
              { title: 'Community trust graph', text: 'Badges, helper rankings, trust score boosts, and visible contribution history.' },
              { title: '100%', text: 'Top trust score currently active across the sample mentor network.' }
            ].map(item => (
              <div key={item.title} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Problems Section */}
      <section style={{ marginTop: '10rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <span className="banner-label" style={{ color: 'var(--primary)', opacity: 1 }}>Featured Requests</span>
            <h2 className="heading-lg">Community problems currently in motion</h2>
          </div>
          <Link href="/feed" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
            View full feed
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { category: 'Web Development', urgency: 'High', status: 'Solved', title: 'Need help making my portfolio responsive before demo day', author: 'Sara Noor', helpers: '1 helper interested' },
            { category: 'Design', urgency: 'Medium', status: 'Open', title: 'Looking for Figma feedback on a volunteer event poster', author: 'Ayesha Khan', helpers: '1 helper interested' },
            { category: 'Career', urgency: 'Low', status: 'Solved', title: 'Need mock interview support for internship applications', author: 'Sara Noor', helpers: '2 helpers interested' }
          ].map((req, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge badge-teal">{req.category}</span>
                <span className={`badge ${req.urgency === 'High' ? 'badge-red' : 'badge-amber'}`}>{req.urgency}</span>
                {req.status === 'Solved' && <span className="badge badge-teal" style={{ background: 'rgba(0,0,0,0.05)', color: '#1a2421' }}>{req.status}</span>}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', flex: 1 }}>{req.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{req.author}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{req.helpers}</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Open details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '4rem 0', borderTop: '1px solid var(--card-border)', opacity: 0.6, fontSize: '0.9rem' }}>
        HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and Cookies.
      </footer>
    </div>
  );
}
