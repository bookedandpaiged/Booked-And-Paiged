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

function getDailyPick(arr, offset = 0) {
  const d = new Date();
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return arr[(day + offset) % arr.length];
}

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Satoshi', -apple-system, sans-serif";

const s = {
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(61,46,34,0.07)',
    borderRadius: '16px',
    padding: '22px 24px',
    boxShadow: '0 1px 4px rgba(61,46,34,0.03)',
  },
  cardTitle: {
    fontFamily: sans,
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: '#3D2E22',
  },
  cardAction: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#9C7B65',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: sans,
    padding: 0,
  },
  sectionLabel: {
    fontFamily: sans,
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#9C7B65',
    marginBottom: '18px',
  },
  barTrack: {
    flex: 1,
    height: '5px',
    background: '#E8DDD2',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: (w) => ({
    width: w,
    height: '100%',
    background: '#9C7B65',
    borderRadius: '3px',
    transition: 'width 0.6s ease',
  }),
};

function ProgressBar({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <span style={{ fontSize: '12px', color: 'rgba(61,46,34,0.55)', fontWeight: 500, minWidth: '48px' }}>{label}</span>
      <div style={s.barTrack}><div style={s.barFill(value)} /></div>
    </div>
  );
}

function GoalBar({ label, pct }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#3D2E22' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#9C7B65', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={s.barTrack}><div style={s.barFill(`${pct}%`)} /></div>
    </div>
  );
}

function MoodIcon({ type }) {
  const base = { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(61,46,34,0.08)', background: '#FAF7F3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' };
  const iconColor = '#9C7B65';
  const icons = {
    low: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/><circle cx="9" cy="9" r="1" fill={iconColor}/><circle cx="15" cy="9" r="1" fill={iconColor}/>
      </svg>
    ),
    okay: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><circle cx="9" cy="9" r="1" fill={iconColor}/><circle cx="15" cy="9" r="1" fill={iconColor}/>
      </svg>
    ),
    good: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="1" fill={iconColor}/><circle cx="15" cy="9" r="1" fill={iconColor}/>
      </svg>
    ),
    great: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/><circle cx="9" cy="9" r="1" fill={iconColor}/><circle cx="15" cy="9" r="1" fill={iconColor}/>
      </svg>
    ),
    amazing: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/><path d="M7 8.5L9.5 9.5L7 10.5"/><path d="M17 8.5L14.5 9.5L17 10.5"/>
      </svg>
    ),
  };
  return <button style={base}>{icons[type]}</button>;
}

export default function HomePage() {
  const { data, loading } = useData();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  const affirmation = getDailyPick(AFFIRMATIONS);
  const quote = getDailyPick(QUOTES, 3);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'rgba(61,46,34,0.5)', fontFamily: serif, fontSize: '20px', fontStyle: 'italic' }}>
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>

      {/* ── HERO ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '52px', minHeight: '420px' }}>
        <div>
          <p style={{ fontFamily: sans, fontSize: '15px', color: 'rgba(61,46,34,0.5)', marginBottom: '12px' }}>
            {greeting}, Paige ✦
          </p>

          <h1 style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '44px', fontWeight: 400, color: '#3D2E22', lineHeight: 1.18, marginBottom: '32px', letterSpacing: '-0.01em' }}>
            {affirmation}
          </h1>

          <div style={{ marginBottom: '36px', paddingLeft: '2px' }}>
            <span style={{ fontFamily: serif, fontSize: '52px', color: 'rgba(196,169,142,0.5)', lineHeight: 0.5, display: 'block', marginBottom: '10px' }}>&ldquo;</span>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '21px', color: '#3D2E22', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
              {quote.text}
            </p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '18px', color: '#9C7B65', marginTop: '10px' }}>
              {quote.sig}
            </p>
          </div>

          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 36px',
            background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px',
            fontFamily: sans, fontSize: '11.5px', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            Plan My Day <span>→</span>
          </button>

          <p style={{ fontSize: '10.5px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(61,46,34,0.3)', marginTop: '18px', fontFamily: sans }}>
            {dateStr}
          </p>
        </div>

        {/* Collage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '140px 120px 120px', gap: '5px', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ gridRow: 'span 2', background: 'linear-gradient(160deg, #D4C5B5 0%, #B8A090 100%)', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
            <span style={{ fontFamily: serif, fontSize: '13px', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>Images load with<br/>Unsplash integration</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8DDD2 0%, #D4C5B5 100%)' }} />
          <div style={{ background: 'linear-gradient(135deg, #C4A98E 0%, #9C7B65 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.45, padding: '12px' }}>
              own lane.<br/>own race.<br/>own pace.
            </span>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #E2D6CA 0%, #C4A98E 100%)' }} />
        </div>
      </section>

      {/* ── TODAY AT A GLANCE ── */}
      <section style={{ marginBottom: '28px' }}>
        <p style={s.sectionLabel}>Today at a Glance</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>

          {/* Daily Agenda */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={s.cardTitle}>Daily Agenda</span>
              <button style={s.cardAction}>View full day</button>
            </div>
            {[
              ['5:00 AM', 'Morning Routine'],
              ['5:30 AM', 'Gym Session'],
              ['7:30 AM', 'GRE Study Block'],
              ['9:30 AM', 'Workday Begins'],
              ['6:00 PM', 'Therapy'],
            ].map(([time, label], i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'baseline', marginBottom: '11px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(61,46,34,0.38)', fontWeight: 500, minWidth: '58px', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
                <span style={{ fontSize: '13px', color: '#3D2E22' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Top Priorities */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={s.cardTitle}>Top Priorities</span>
              <button style={s.cardAction}>Edit</button>
            </div>
            {['GRE practice set', 'Awards follow-up', 'Meal prep planning'].map((text, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px', cursor: 'pointer' }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: '1.5px solid #D4C5B5', display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{ fontSize: '13px', color: '#3D2E22' }}>{text}</span>
              </label>
            ))}
          </div>

          {/* Personal Reminders */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={s.cardTitle}>Personal Reminders</span>
              <button style={s.cardAction}>Add</button>
            </div>
            {[
              ['Hydrate more today', 'Daily'],
              ['Book eyebrow appointment', 'This week'],
              ['Peanut grooming', 'Due soon'],
            ].map(([text, tag], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '13px', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#3D2E22', flex: 1 }}>{text}</span>
                <span style={{ fontSize: '10px', color: '#9C7B65', fontWeight: 600, letterSpacing: '0.04em', flexShrink: 0, paddingTop: '2px' }}>{tag}</span>
              </div>
            ))}
          </div>

          {/* Wellness Check-In */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={s.cardTitle}>Wellness Check-In</span>
              <button style={s.cardAction}>Log →</button>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(61,46,34,0.55)', marginBottom: '14px' }}>How are you feeling today?</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <MoodIcon type="low" />
              <MoodIcon type="okay" />
              <MoodIcon type="good" />
              <MoodIcon type="great" />
              <MoodIcon type="amazing" />
            </div>
            <ProgressBar label="Energy" value="70%" />
            <ProgressBar label="Sleep" value="80%" />
          </div>
        </div>
      </section>

      {/* ── BOTTOM ROW ── */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* Goal Progress */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={s.cardTitle}>Goal Progress</span>
              <button style={s.cardAction}>View All Goals</button>
            </div>
            <GoalBar label="GRE Prep" pct={45} />
            <GoalBar label="Wellness" pct={72} />
            <GoalBar label="Awards" pct={30} />
          </div>

          {/* Personal Intentions */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={s.cardTitle}>Personal Intentions</span>
              <button style={s.cardAction}>This Month</button>
            </div>
            {['Be present in every moment', 'Create with purpose and passion', 'Protect my peace and my time'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ color: '#9C7B65', fontSize: '8px' }}>✦</span>
                <span style={{ fontSize: '13.5px', color: '#3D2E22', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WEEKLY INSIGHT ── */}
      <section style={{
        ...s.card,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        padding: '28px 32px', marginBottom: '32px',
      }}>
        <div>
          <p style={{fontFamily: sans, fontSize: '18px', fontWeight: 600, color: '#3D2E22', marginBottom: '4px' }}>Weekly Insight</p>
          <p style={{ fontSize: '14px', color: 'rgba(61,46,34,0.55)', fontFamily: sans }}>Small, consistent actions create big, undeniable shifts.</p>
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
          background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px',
          fontFamily: sans, fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Read This Week&apos;s Insight →
        </button>
      </section>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
