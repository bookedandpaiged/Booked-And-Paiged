'use client';

import { useData } from './components/DataProvider';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const AFFIRMATIONS = [
  "You are building something real.",
  "Discipline is your love language.",
  "Rest is not retreat.",
  "You have already survived harder.",
  "Own lane. Own race. Own pace.",
  "Go get everything you deserve.",
  "She remembered who she was and the game changed.",
  "You are not behind. You are being prepared.",
  "The woman you are becoming will cost you people, places, comfort, and safety.",
  "Very soon God will show you why He made you wait.",
  "Do not let what is happening around you get inside you and weigh you down.",
  "Life is too short to spend it at war with yourself.",
];

const QUOTES = [
  { text: "Discipline creates freedom.\nFocus builds your future.", sig: "AP" },
  { text: "Strategic thinking.\nMeaningful impact.", sig: "AP" },
  { text: "Aligned intentions create\npowerful outcomes.", sig: "AP" },
  { text: "Small, consistent actions create\nbig, undeniable shifts.", sig: "AP" },
  { text: "Protect your peace.\nPursue your purpose.", sig: "AP" },
  { text: "Move in silence.\nLet the results speak.", sig: "AP" },
];

function getDailySelection(arr, count = 1) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(arr[(dayOfYear + i * 7) % arr.length]);
  }
  return count === 1 ? results[0] : results;
}

export default function HomePage() {
  const { data, loading } = useData();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  
  const affirmation = getDailySelection(AFFIRMATIONS);
  const quote = getDailySelection(QUOTES);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-soft)', fontFamily: 'var(--font-display)', fontSize: '18px', fontStyle: 'italic' }}>
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-greeting">{greeting}, Paige ✦</p>
          <h1 className="hero-affirmation">{affirmation}</h1>
          
          <div className="hero-quote-block">
            <span className="quote-mark">&ldquo;</span>
            <p className="hero-quote">{quote.text}</p>
            <p className="hero-sig">{quote.sig}</p>
          </div>

          <button className="btn-primary hero-cta">
            Plan My Day
            <span>→</span>
          </button>
          <p className="hero-date">{dateStr}</p>
        </div>

        <div className="hero-collage">
          <div className="collage-grid">
            <div className="collage-item collage-tall" style={{ background: 'linear-gradient(135deg, #D4C5B5, #C4A98E)' }}>
              <div className="collage-placeholder-text">✦</div>
            </div>
            <div className="collage-item" style={{ background: 'linear-gradient(135deg, #E8DDD2, #D4C5B5)' }}>
              <div className="collage-placeholder-text" style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontStyle: 'italic', padding: '20px', lineHeight: 1.5 }}>
                {quote.text.split('\n')[0]}
              </div>
            </div>
            <div className="collage-item" style={{ background: 'linear-gradient(135deg, #C4A98E, #9C7B65)' }}>
              <div className="collage-placeholder-text">✦</div>
            </div>
            <div className="collage-item collage-wide" style={{ background: 'linear-gradient(135deg, #E8DDD2, #D4C5B5)' }}>
              <div className="collage-placeholder-text">✦</div>
            </div>
            <div className="collage-item" style={{ background: 'linear-gradient(135deg, #D4C5B5, #B8A090)' }}>
              <div className="collage-placeholder-text">✦</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Today at a Glance ── */}
      <section className="glance-section">
        <p className="section-label">Today at a Glance</p>
        
        <div className="glance-grid">
          {/* Daily Agenda */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Daily Agenda</span>
              <button className="card-action">View full day</button>
            </div>
            <div className="agenda-items">
              <div className="agenda-item">
                <span className="agenda-time">5:00 AM</span>
                <span className="agenda-label">Morning Routine</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">5:30 AM</span>
                <span className="agenda-label">Gym Session</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">7:30 AM</span>
                <span className="agenda-label">GRE Study Block</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">9:30 AM</span>
                <span className="agenda-label">Workday Begins</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">6:00 PM</span>
                <span className="agenda-label">Therapy</span>
              </div>
            </div>
          </div>

          {/* Top Priorities */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Priorities</span>
              <button className="card-action">Edit</button>
            </div>
            <div className="priority-items">
              <label className="priority-item">
                <input type="checkbox" className="priority-check" />
                <span className="priority-text">GRE practice set</span>
              </label>
              <label className="priority-item">
                <input type="checkbox" className="priority-check" />
                <span className="priority-text">Awards follow-up</span>
              </label>
              <label className="priority-item">
                <input type="checkbox" className="priority-check" />
                <span className="priority-text">Meal prep planning</span>
              </label>
            </div>
          </div>

          {/* Personal Reminders */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Personal Reminders</span>
              <button className="card-action">Add</button>
            </div>
            <div className="reminder-items">
              <div className="reminder-item">
                <span className="reminder-text">Hydrate more today</span>
                <span className="reminder-tag">Daily</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-text">Book eyebrow appointment</span>
                <span className="reminder-tag">This week</span>
              </div>
              <div className="reminder-item">
                <span className="reminder-text">Peanut grooming</span>
                <span className="reminder-tag">Due soon</span>
              </div>
            </div>
          </div>

          {/* Wellness Check-In */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Wellness Check-In</span>
              <button className="card-action">Log →</button>
            </div>
            <p className="wellness-prompt">How are you feeling today?</p>
            <div className="mood-row">
              {['😔','😐','🙂','😊','✨'].map((m, i) => (
                <button key={i} className="mood-btn">{m}</button>
              ))}
            </div>
            <div className="wellness-bars">
              <div className="wellness-bar-row">
                <span className="bar-label">Energy</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '70%' }} /></div>
              </div>
              <div className="wellness-bar-row">
                <span className="bar-label">Sleep</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '80%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Row ── */}
      <section className="bottom-section">
        <div className="bottom-grid">
          {/* Goal Progress */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Goal Progress</span>
              <button className="card-action">View All Goals</button>
            </div>
            <div className="goal-items">
              <div className="goal-item">
                <div className="goal-info"><span>GRE Prep</span><span className="goal-pct">45%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '45%' }} /></div>
              </div>
              <div className="goal-item">
                <div className="goal-info"><span>Wellness</span><span className="goal-pct">72%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '72%' }} /></div>
              </div>
              <div className="goal-item">
                <div className="goal-info"><span>Awards</span><span className="goal-pct">30%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '30%' }} /></div>
              </div>
            </div>
          </div>

          {/* Personal Intentions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Personal Intentions</span>
              <button className="card-action">This Month</button>
            </div>
            <div className="intention-items">
              <div className="intention-item">
                <span className="intention-icon">✦</span>
                <span>Be present in every moment</span>
              </div>
              <div className="intention-item">
                <span className="intention-icon">✦</span>
                <span>Create with purpose and passion</span>
              </div>
              <div className="intention-item">
                <span className="intention-icon">✦</span>
                <span>Protect my peace and my time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Weekly Insight Banner ── */}
      <section className="insight-banner">
        <div className="insight-inner">
          <div>
            <p className="insight-title">Weekly Insight</p>
            <p className="insight-text">Small, consistent actions create big, undeniable shifts.</p>
          </div>
          <button className="btn-primary" style={{ fontSize: '11px', padding: '12px 24px' }}>
            Read This Week&apos;s Insight →
          </button>
        </div>
      </section>

      <style jsx>{`
        .home {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Hero ── */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 48px;
          min-height: 380px;
        }

        .hero-greeting {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--text-soft);
          font-weight: 400;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .hero-affirmation {
          font-family: var(--font-display);
          font-size: 42px;
          font-weight: 400;
          color: var(--text);
          line-height: 1.2;
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }

        .hero-quote-block {
          position: relative;
          margin-bottom: 32px;
          padding-left: 4px;
        }

        .quote-mark {
          font-family: var(--font-display);
          font-size: 48px;
          color: var(--accent-light);
          line-height: 0.6;
          display: block;
          margin-bottom: 4px;
        }

        .hero-quote {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 20px;
          font-weight: 400;
          color: var(--text);
          line-height: 1.5;
          white-space: pre-line;
        }

        .hero-sig {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 18px;
          color: var(--accent);
          margin-top: 8px;
        }

        .hero-cta {
          margin-bottom: 16px;
        }

        .hero-date {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ── Collage ── */
        .collage-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 6px;
          height: 380px;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .collage-item {
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .collage-tall {
          grid-row: span 2;
        }

        .collage-wide {
          grid-column: span 2;
        }

        .collage-placeholder-text {
          color: rgba(255,255,255,0.4);
          font-size: 24px;
        }

        /* ── Glance Section ── */
        .glance-section {
          margin-bottom: 32px;
        }

        .glance-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* ── Agenda ── */
        .agenda-items { display: flex; flex-direction: column; gap: 12px; }
        .agenda-item { display: flex; gap: 14px; align-items: baseline; }
        .agenda-time { font-size: 12px; color: var(--text-muted); font-weight: 500; min-width: 60px; font-variant-numeric: tabular-nums; }
        .agenda-label { font-size: 13px; color: var(--text); font-weight: 400; }

        /* ── Priorities ── */
        .priority-items { display: flex; flex-direction: column; gap: 12px; }
        .priority-item { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .priority-check {
          width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--tertiary);
          appearance: none; -webkit-appearance: none; cursor: pointer;
          transition: all 0.2s; flex-shrink: 0;
        }
        .priority-check:checked {
          background: var(--accent); border-color: var(--accent);
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
          background-size: 12px; background-position: center; background-repeat: no-repeat;
        }
        .priority-text { font-size: 13px; color: var(--text); }

        /* ── Reminders ── */
        .reminder-items { display: flex; flex-direction: column; gap: 12px; }
        .reminder-item { display: flex; justify-content: space-between; align-items: center; }
        .reminder-text { font-size: 13px; color: var(--text); }
        .reminder-tag { font-size: 11px; color: var(--accent); font-weight: 500; }

        /* ── Wellness ── */
        .wellness-prompt { font-size: 13px; color: var(--text-soft); margin-bottom: 12px; }
        .mood-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .mood-btn {
          width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border);
          background: var(--surface-warm); cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .mood-btn:hover { border-color: var(--accent); transform: scale(1.1); }
        .wellness-bars { display: flex; flex-direction: column; gap: 10px; }
        .wellness-bar-row { display: flex; align-items: center; gap: 10px; }
        .bar-label { font-size: 12px; color: var(--text-soft); min-width: 48px; font-weight: 500; }
        .bar-track { flex: 1; height: 6px; background: var(--secondary); border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.6s ease; }

        /* ── Goals ── */
        .goal-items { display: flex; flex-direction: column; gap: 14px; }
        .goal-item { display: flex; flex-direction: column; gap: 6px; }
        .goal-info { display: flex; justify-content: space-between; font-size: 13px; }
        .goal-pct { color: var(--accent); font-weight: 500; }

        /* ── Intentions ── */
        .intention-items { display: flex; flex-direction: column; gap: 14px; }
        .intention-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text); }
        .intention-icon { color: var(--accent); font-size: 10px; }

        /* ── Bottom Section ── */
        .bottom-section { margin-bottom: 32px; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Insight Banner ── */
        .insight-banner {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px 32px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .insight-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .insight-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 4px;
        }
        .insight-text { font-size: 14px; color: var(--text-soft); }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .glance-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 28px;
            min-height: auto;
            margin-bottom: 32px;
          }

          .hero-affirmation {
            font-size: 32px;
          }

          .hero-quote {
            font-size: 17px;
          }

          .collage-grid {
            height: 260px;
          }

          .hero-cta {
            width: 100%;
            justify-content: center;
          }

          .glance-grid {
            grid-template-columns: 1fr;
          }

          .bottom-grid {
            grid-template-columns: 1fr;
          }

          .insight-inner {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
