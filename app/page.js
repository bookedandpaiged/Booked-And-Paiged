'use client';

import { useData } from './components/DataProvider';

var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var DAYSOFWEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var AFFIRMATIONS = [
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

var QUOTES = [
  { text: "Discipline creates freedom. Focus builds your future.", sig: "AP" },
  { text: "Strategic thinking. Meaningful impact.", sig: "AP" },
  { text: "Aligned intentions create powerful outcomes.", sig: "AP" },
  { text: "Small, consistent actions create big, undeniable shifts.", sig: "AP" },
  { text: "Protect your peace. Pursue your purpose.", sig: "AP" },
  { text: "Move in silence. Let the results speak.", sig: "AP" },
];

function getDailyPick(arr, offset) {
  var d = new Date();
  var day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return arr[(day + (offset || 0)) % arr.length];
}

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";

/* Color system */
var brown = '#5D4233';       /* section headers, icons - darker */
var text = '#6B5A50';        /* body text - neutral nude brown */
var textSoft = 'rgba(93,66,51,0.55)'; /* secondary text */
var textMuted = 'rgba(93,66,51,0.35)'; /* muted, timestamps */
var accent = '#9C7B65';      /* links, accents */
var quoteColor = '#7A5F4C';  /* quotes, signature, quotation mark */

var card = {
  background: '#FFFFFF',
  border: '1px solid rgba(93,66,51,0.06)',
  borderRadius: '16px',
  padding: '22px 24px',
  boxShadow: '0 1px 4px rgba(93,66,51,0.03)',
};

var cardTitle = { fontFamily: sans, fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', color: brown };
var cardAction = { fontSize: '11px', fontWeight: 500, color: accent, cursor: 'pointer', background: 'none', border: 'none', fontFamily: sans, padding: 0 };
var sectionLabel = { fontFamily: sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, marginBottom: '18px' };
var barTrack = { flex: 1, height: '5px', background: '#E8DDD2', borderRadius: '3px', overflow: 'hidden' };
function barFill(w) { return { width: w, height: '100%', background: accent, borderRadius: '3px', transition: 'width 0.6s ease' }; }

function ProgressBar(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <span style={{ fontSize: '12px', color: textSoft, fontWeight: 500, minWidth: '48px' }}>{props.label}</span>
      <div style={barTrack}><div style={barFill(props.value)} /></div>
    </div>
  );
}

function GoalBar(props) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: text }}>{props.label}</span>
        <span style={{ fontSize: '13px', color: accent, fontWeight: 600 }}>{props.pct}%</span>
      </div>
      <div style={barTrack}><div style={barFill(props.pct + '%')} /></div>
    </div>
  );
}

function MoodIcon(props) {
  var base = { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(93,66,51,0.08)', background: '#FAF7F3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' };
  var c = accent;
  var icons = {
    low: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/><circle cx="9" cy="9" r="1" fill={c}/><circle cx="15" cy="9" r="1" fill={c}/></svg>),
    okay: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><circle cx="9" cy="9" r="1" fill={c}/><circle cx="15" cy="9" r="1" fill={c}/></svg>),
    good: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="1" fill={c}/><circle cx="15" cy="9" r="1" fill={c}/></svg>),
    great: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/><circle cx="9" cy="9" r="1" fill={c}/><circle cx="15" cy="9" r="1" fill={c}/></svg>),
    amazing: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/><path d="M7 8.5L9.5 9.5L7 10.5"/><path d="M17 8.5L14.5 9.5L17 10.5"/></svg>),
  };
  return <button style={base}>{icons[props.type]}</button>;
}

export default function HomePage() {
  var dataCtx = useData();
  var loading = dataCtx.loading;
  var now = new Date();
  var hour = now.getHours();
  var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  var dateStr = DAYSOFWEEK[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

  var affirmation = getDailyPick(AFFIRMATIONS);
  var quote = getDailyPick(QUOTES, 3);

  if (loading) {
    return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><p style={{ color: textSoft, fontFamily: serif, fontSize: '20px', fontStyle: 'italic' }}>Loading your dashboard...</p></div>);
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>

      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '40px', alignItems: 'center', marginBottom: '0', minHeight: '420px' }}>
        <div>
          <h1 style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '36px', fontWeight: 400, color: '#7D6450', lineHeight: 1.18, marginBottom: '32px', maxWidth: '360px' }}>
            {affirmation}
          </h1>

          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontFamily: sans, fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>Quote of the day</p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '26px', color: '#7D6450', lineHeight: 1.5, maxWidth: '420px' }}>
              <span style={{ fontSize: '36px', marginRight: '4px', verticalAlign: 'top', lineHeight: '0.9' }}>&ldquo;</span>
              {quote.text}
            </p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: '#7D6450', marginTop: '10px' }}>
              - {quote.sig}
            </p>
          </div>

          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 36px',
            background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px',
            fontFamily: sans, fontSize: '11.5px', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            Plan My Day <span style={{ fontSize: '14px' }}>&#8594;</span>
          </button>

          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: textSoft, marginTop: '18px', fontFamily: sans }}>
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
            <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.45, padding: '12px' }}>own lane.<br/>own race.<br/>own pace.</span>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #E2D6CA 0%, #C4A98E 100%)' }} />
        </div>
      </section>

      {/* TODAY AT A GLANCE - different background */}
      <div style={{ background: '#EDE5DA', margin: '0 -48px', padding: '40px 48px' }}>

        {/* Small image + icon strip */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #D4C5B5, #B8A090)', flexShrink: 0 }} />
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #C4A98E, #9C7B65)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #E8DDD2, #D4C5B5)', flexShrink: 0 }} />
          <div style={{ flex: 1 }} />
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '14px', color: '#8B6E5A' }}>Your day, intentionally designed.</p>
        </div>

        <p style={sectionLabel}>Today at a Glance</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>

          {/* Daily Agenda */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/></svg>
                <span style={cardTitle}>Daily Agenda</span>
              </div>
              <button style={cardAction}>View full day</button>
            </div>
            {[['5:00 AM','Morning Routine'],['5:30 AM','Gym Session'],['7:30 AM','GRE Study Block'],['9:30 AM','Workday Begins'],['6:00 PM','Therapy']].map(function(item, i) {
              return (<div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'baseline', marginBottom: '11px' }}>
                <span style={{ fontSize: '12px', color: textMuted, fontWeight: 500, minWidth: '58px', fontVariantNumeric: 'tabular-nums' }}>{item[0]}</span>
                <span style={{ fontSize: '13px', color: text }}>{item[1]}</span>
              </div>);
            })}
          </div>

          {/* Top Priorities */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span style={cardTitle}>Top Priorities</span>
              </div>
              <button style={cardAction}>Edit</button>
            </div>
            {['GRE practice set','Awards follow-up','Meal prep planning'].map(function(txt, i) {
              return (<label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px', cursor: 'pointer' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #D4C5B5', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: text }}>{txt}</span>
              </label>);
            })}
          </div>

          {/* Personal Reminders */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span style={cardTitle}>Personal Reminders</span>
              </div>
              <button style={cardAction}>Add</button>
            </div>
            {[['Hydrate more today','Daily'],['Book eyebrow appointment','This week'],['Peanut grooming','Due soon']].map(function(item, i) {
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #D4C5B5', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: text, flex: 1 }}>{item[0]}</span>
                <span style={{ fontSize: '10px', color: accent, fontWeight: 600, flexShrink: 0 }}>{item[1]}</span>
              </div>);
            })}
          </div>

          {/* Wellness Check-In */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span style={cardTitle}>Wellness Check-In</span>
              </div>
              <button style={cardAction}>Log &#8594;</button>
            </div>
            <p style={{ fontSize: '13px', color: textSoft, marginBottom: '14px' }}>How are you feeling today?</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <MoodIcon type="low" /><MoodIcon type="okay" /><MoodIcon type="good" /><MoodIcon type="great" /><MoodIcon type="amazing" />
            </div>
            <ProgressBar label="Energy" value="70%" />
            <ProgressBar label="Sleep" value="80%" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - back to main bg */}
      <section style={{ marginTop: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <span style={cardTitle}>Goal Progress</span>
              </div>
              <button style={cardAction}>View All Goals</button>
            </div>
            <GoalBar label="GRE Prep" pct={45} />
            <GoalBar label="Wellness" pct={72} />
            <GoalBar label="Awards" pct={30} />
          </div>

          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span style={cardTitle}>Personal Intentions</span>
              </div>
              <button style={cardAction}>This Month</button>
            </div>
            {[
              ['Be present in every moment', <svg key="0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>],
              ['Create with purpose and passion', <svg key="1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>],
              ['Protect my peace and my time', <svg key="2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>],
            ].map(function(item, i) {
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                {item[1]}
                <span style={{ fontSize: '13.5px', color: text, lineHeight: 1.5 }}>{item[0]}</span>
              </div>);
            })}
          </div>
        </div>
      </section>

      {/* WEEKLY INSIGHT */}
      <section style={{
        ...card,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        padding: '24px 28px', marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #D4C5B5, #B8A090)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: brown, marginBottom: '3px' }}>Weekly Insight</p>
            <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>Small, consistent actions create big, undeniable shifts.</p>
          </div>
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
          background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px',
          fontFamily: sans, fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Read This Week&#39;s Insight &#8594;
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
