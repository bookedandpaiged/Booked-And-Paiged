'use client';

import { useState, useEffect } from 'react';
import { useData } from './components/DataProvider';
import Link from 'next/link';
import WeatherWidget from './components/WeatherWidget';

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

var DEFAULT_CALENDAR = [
  {id:'d01',title:"Adderall",startTime:"04:15",category:"Medical",recurrence:{type:'daily',days:[1,2,3,4,5]}},
  {id:'d02',title:"Spironolactone 100mg",startTime:"12:30",category:"Medical",recurrence:{type:'daily',days:null}},
  {id:'d03',title:"Ritual Essential Vitamin",startTime:"07:10",category:"Medical",recurrence:{type:'daily',days:null}},
  {id:'d05',title:"Therapy Session",startTime:"18:00",category:"Medical",recurrence:{type:'weekly',days:[4]}},
  {id:'d07',title:"Workout + Sauna",startTime:"05:30",category:"Physical Wellness",recurrence:{type:'weekly',days:[1,2,3,4]}},
  {id:'d08',title:"Morning Smoothie",startTime:"07:00",category:"Physical Wellness",recurrence:{type:'daily',days:null}},
  {id:'d09',title:"Afternoon Protein Snack",startTime:"15:30",category:"Physical Wellness",recurrence:{type:'daily',days:null}},
  {id:'d10',title:"Meal Prep",startTime:"11:00",category:"Physical Wellness",recurrence:{type:'weekly',days:[0]}},
  {id:'d11',title:"Skincare Routine",startTime:"21:00",category:"Physical Wellness",recurrence:{type:'weekly',days:[1,3,5]}},
  {id:'d12',title:"Morning Affirmations",startTime:"05:00",category:"Self Care",recurrence:{type:'daily',days:null}},
  {id:'d16',title:"ICartSwag: Content + Strategy",startTime:"19:00",category:"ICartSwag",recurrence:{type:'weekly',days:[2]}},
  {id:'d17',title:"GRE Study Block",startTime:"20:00",category:"GRE / Grad School",recurrence:{type:'weekly',days:[1,3,5]}},
  {id:'d19',title:"Awards Work Block",startTime:"19:00",category:"Awards",recurrence:{type:'weekly',days:[1]}},
];

var DEFAULT_REMINDERS = [
  { id: 'r1', cat: 'Grooming', label: 'Eyebrow appointment', freq: 'Every 2 weeks', lastDone: null },
  { id: 'r4', cat: 'Pet', label: 'Peanut grooming', freq: 'Monthly', lastDone: null },
  { id: 'r5', cat: 'Medical', label: 'Therapy', freq: 'Weekly (Thursday 6PM)', lastDone: null },
  { id: 'r9', cat: 'Car', label: 'Car wash', freq: 'Every 2 weeks', lastDone: null },
];

function getDailyPick(arr, offset) {
  var d = new Date();
  var day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return arr[(day + (offset || 0)) % arr.length];
}

function fmtTime(t) { if(!t)return''; var p=t.split(':').map(Number); return (p[0]%12||12)+':'+String(p[1]).padStart(2,'0')+(p[0]>=12?' PM':' AM'); }

function getTodayEvents(events) {
  var now = new Date();
  var dow = now.getDay();
  var results = [];
  (events || DEFAULT_CALENDAR).forEach(function(ev) {
    if (!ev.recurrence) return;
    var days = ev.recurrence.days;
    var type = ev.recurrence.type;
    if (type === 'daily' && (!days || days.includes(dow))) results.push(ev);
    else if (type === 'weekly' && days && days.includes(dow)) results.push(ev);
  });
  return results.sort(function(a,b){return (a.startTime||'').localeCompare(b.startTime||'');}).slice(0,6);
}

function getUpcomingReminders(reminders) {
  var items = reminders || DEFAULT_REMINDERS;
  return items.filter(function(r){return !r.lastDone;}).slice(0,3).map(function(r){
    return { label: r.label, freq: r.freq, cat: r.cat };
  });
}

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var quoteColor = '#7A5F4C';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px 24px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)' };
var cardTitle = { fontFamily: sans, fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', color: brown };
var cardAction = { fontSize: '11px', fontWeight: 500, color: accent, cursor: 'pointer', background: 'none', border: 'none', fontFamily: sans, padding: 0, textDecoration: 'none' };
var sectionLabel = { fontFamily: sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, marginBottom: '18px' };
var barTrack = { flex: 1, height: '5px', background: '#E8DDD2', borderRadius: '3px', overflow: 'hidden' };
function barFill(w) { return { width: w, height: '100%', background: accent, borderRadius: '3px', transition: 'width 0.6s ease' }; }

function GoalBar(props) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: text, fontFamily: sans }}>{props.label}</span>
        <span style={{ fontSize: '13px', color: accent, fontWeight: 600, fontFamily: sans }}>{props.pct}%</span>
      </div>
      <div style={barTrack}><div style={barFill(props.pct + '%')} /></div>
    </div>
  );
}

var CAT_DOTS = { "Physical Wellness": "#5a9870", "GRE / Grad School": "#5b7ec4", "Awards": "#c4903a", "ICartSwag": "#c4604a", "Self Care": "#b86880", "Medical": "#8060b8", "Work": "#3a8fa8" };

export default function HomePage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var editIntentions = useState(false);
  var isEditing = editIntentions[0]; var setIsEditing = editIntentions[1];
  var photosState = useState([]);
  var photos = photosState[0]; var setPhotos = photosState[1];

  useEffect(function() {
    var key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (!key) return;
    var queries = [
      'black woman travel luxury',
      'black couple aesthetic love',
      'black woman fashion editorial',
      'luxury interior design home',
      'black art portrait painting',
      'black woman fitness gym',
      'autumn fall cozy lifestyle',
      'luxury hotel travel lifestyle',
      'black woman natural hair beauty',
      'black friends dinner restaurant',
      'luxury spa self care wellness',
      'black woman boss office',
      'tropical travel adventure woman',
      'black couple luxury lifestyle',
      'modern interior architecture home',
    ];
    var q = queries[Math.floor(Math.random() * queries.length)];
    fetch('https://api.unsplash.com/photos/random?count=5&query=' + encodeURIComponent(q) + '&client_id=' + key)
      .then(function(r) { return r.json(); })
      .then(function(data) { if (Array.isArray(data)) setPhotos(data); })
      .catch(function() {});
  }, []);

  var now = new Date();
  var hour = now.getHours();
  var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  var dateStr = DAYSOFWEEK[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

  var affirmation = getDailyPick(AFFIRMATIONS);
  var quote = getDailyPick(QUOTES, 3);

  if (loading) {
    return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #EDE5DA', borderTopColor: accent, animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: textSoft, fontFamily: serif, fontSize: '20px', fontStyle: 'italic' }}>Loading your dashboard...</p>
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>);
  }

  var todayEvents = getTodayEvents(data && data.calendarEvents);
  var reminders = getUpcomingReminders(data && data.reminders);
  var intentions = (data && data.intentions) || ['Be present in every moment', 'Create with purpose and passion', 'Protect my peace and my time'];
  var greData = data && data.greChecks || {};
  var greTotal = 30; var greDone = Object.keys(greData).filter(function(k){return greData[k];}).length;
  var grePct = Math.round((greDone / greTotal) * 100);
  var wellnessWeek = data && data.currentWeek;
  var wellnessPct = wellnessWeek ? 65 : 0;
  var awardsData = data && data.awardsChecks || {};
  var awardsTotal = 25; var awardsDone = Object.keys(awardsData).filter(function(k){return awardsData[k];}).length;
  var awardsPct = Math.round((awardsDone / awardsTotal) * 100);

  function saveIntentions(newList) {
    updateData(function(p){return Object.assign({},p,{intentions:newList});});
  }

  return (
    <div>
      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '40px', alignItems: 'center', marginBottom: '0', minHeight: '420px' }}>
        <div>
          <h1 style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '36px', fontWeight: 400, color: quoteColor, lineHeight: 1.18, marginBottom: '32px', maxWidth: '360px' }}>{affirmation}</h1>
          <div style={{ marginBottom: '36px' }}>
            <p style={{ fontFamily: sans, fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: textMuted, marginBottom: '10px' }}>Quote of the Day</p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '26px', color: quoteColor, lineHeight: 1.5, maxWidth: '420px' }}>
              <span style={{ fontSize: '36px', marginRight: '4px', verticalAlign: 'top', lineHeight: '0.9' }}>&ldquo;</span>{quote.text}
            </p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: quoteColor, marginTop: '10px' }}>- {quote.sig}</p>
          </div>
          <Link href="/calendar" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 36px', background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px', fontFamily: sans, fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Plan My Day <span style={{ fontSize: '14px' }}>&#8594;</span>
          </Link>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: textSoft, marginTop: '18px', fontFamily: sans }}>{dateStr}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '140px 120px 120px', gap: '5px', borderRadius: '20px', overflow: 'hidden' }} className="hero-collage">
          {photos.length >= 5 ? (
            <>
              <div style={{ gridRow: 'span 2', backgroundImage: 'url(' + photos[0].urls.regular + ')', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,46,34,0.3) 0%, transparent 60%)' }} />
              </div>
              <div style={{ backgroundImage: 'url(' + photos[1].urls.regular + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ backgroundImage: 'url(' + photos[2].urls.regular + ')', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,46,34,0.25)' }} />
                <span style={{ position: 'relative', fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.45, padding: '12px' }}>own lane.<br/>own race.<br/>own pace.</span>
              </div>
              <div style={{ backgroundImage: 'url(' + photos[3].urls.regular + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ backgroundImage: 'url(' + photos[4].urls.regular + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </>
          ) : (
            <>
              <div style={{ gridRow: 'span 2', background: 'linear-gradient(160deg, #D4C5B5 0%, #B8A090 100%)' }} />
              <div style={{ background: 'linear-gradient(135deg, #E8DDD2 0%, #D4C5B5 100%)' }} />
              <div style={{ background: 'linear-gradient(135deg, #C4A98E 0%, #9C7B65 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.45, padding: '12px' }}>own lane.<br/>own race.<br/>own pace.</span>
              </div>
              <div style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #E2D6CA 0%, #C4A98E 100%)' }} />
            </>
          )}
        </div>
      </section>

      {/* TODAY AT A GLANCE */}
      <div style={{ background: '#EDE5DA', margin: '0 -48px', padding: '40px 48px' }}>
        <p style={sectionLabel}>Today at a Glance</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>

          {/* Daily Agenda - LIVE */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/></svg>
                <span style={cardTitle}>Daily Agenda</span>
              </div>
              <Link href="/calendar" style={cardAction}>View Full Day</Link>
            </div>
            {todayEvents.length === 0
              ? <p style={{ fontSize: '13px', color: textMuted, fontStyle: 'italic', fontFamily: sans }}>Nothing scheduled today.</p>
              : todayEvents.map(function(ev) {
                var dot = CAT_DOTS[ev.category] || accent;
                return (<div key={ev.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: textMuted, fontWeight: 500, minWidth: '54px', fontVariantNumeric: 'tabular-nums', fontFamily: sans }}>{fmtTime(ev.startTime)}</span>
                  <span style={{ fontSize: '13px', color: text, fontFamily: sans }}>{ev.title}</span>
                </div>);
              })
            }
          </div>

          {/* Top Priorities */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span style={cardTitle}>Top Priorities</span>
              </div>
            </div>
            {[
              todayEvents.some(function(e){return e.category==='GRE / Grad School';}) ? 'GRE study block tonight' : 'Review GRE materials',
              todayEvents.some(function(e){return e.category==='Awards';}) ? 'Awards work block' : 'Check awards deadlines',
              wellnessWeek ? 'Follow today\'s meal plan' : 'Plan this week\'s meals',
            ].map(function(txt, i) {
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #D4C5B5', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: text, fontFamily: sans }}>{txt}</span>
              </div>);
            })}
          </div>

          {/* Personal Reminders - LIVE */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span style={cardTitle}>Reminders</span>
              </div>
              <Link href="/reminders" style={cardAction}>View All</Link>
            </div>
            {reminders.length === 0
              ? <p style={{ fontSize: '13px', color: textMuted, fontStyle: 'italic', fontFamily: sans }}>All caught up.</p>
              : reminders.map(function(r, i) {
                return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #D4C5B5', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: text, flex: 1, fontFamily: sans }}>{r.label}</span>
                  <span style={{ fontSize: '10px', color: accent, fontWeight: 600, flexShrink: 0, fontFamily: sans }}>{r.freq}</span>
                </div>);
              })
            }
          </div>

          {/* Wellness */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span style={cardTitle}>Wellness</span>
              </div>
              <Link href="/wellness" style={cardAction}>View Plan</Link>
            </div>
            {wellnessWeek
              ? <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: brown, marginBottom: '6px', fontFamily: sans }}>{wellnessWeek.title}</p>
                  <p style={{ fontSize: '12px', color: textSoft, marginBottom: '10px', fontFamily: sans }}>{wellnessWeek.phase}</p>
                  <p style={{ fontSize: '12px', color: text, lineHeight: 1.5, fontFamily: sans }}>{wellnessWeek.overview}</p>
                </div>
              : <div>
                  <p style={{ fontSize: '13px', color: textSoft, marginBottom: '10px', fontFamily: sans }}>No plan for this week yet.</p>
                  <Link href="/wellness" style={{ fontSize: '12px', color: accent, fontWeight: 600, fontFamily: sans }}>Plan your week &#8594;</Link>
                </div>
            }
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <section style={{ marginTop: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Goal Progress - LIVE */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <span style={cardTitle}>Goal Progress</span>
              </div>
            </div>
            <GoalBar label="GRE Prep" pct={grePct} />
            <GoalBar label="Wellness" pct={wellnessPct} />
            <GoalBar label="Awards" pct={awardsPct} />
          </div>

          {/* Personal Intentions - EDITABLE */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span style={cardTitle}>Personal Intentions</span>
              </div>
              <button onClick={function(){setIsEditing(!isEditing);}} style={cardAction}>{isEditing ? 'Done' : 'Edit'}</button>
            </div>
            {isEditing
              ? intentions.map(function(txt, i) {
                  return <input key={i} value={txt} onChange={function(e){var n=intentions.slice();n[i]=e.target.value;saveIntentions(n);}} style={{ display: 'block', width: '100%', padding: '8px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '8px' }} />;
                })
              : intentions.map(function(txt, i) {
                  var icons = [
                    <svg key="0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                    <svg key="1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
                    <svg key="2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                  ];
                  return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    {icons[i % 3]}
                    <span style={{ fontSize: '13.5px', color: text, lineHeight: 1.5, fontFamily: sans }}>{txt}</span>
                  </div>);
                })
            }
          </div>
        </div>
      </section>

      {/* WEATHER */}
      <section style={{ marginBottom: '14px' }}>
        <WeatherWidget />
      </section>

      {/* WEEKLY INSIGHT */}
      <section style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '24px 28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #D4C5B5, #B8A090)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: brown, marginBottom: '3px' }}>Weekly Insight</p>
            <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>{getDailyPick(QUOTES, 7).text}</p>
          </div>
        </div>
        <Link href="/review" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#6B4F3E', color: '#fff', border: 'none', borderRadius: '50px', fontFamily: sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Weekly Review &#8594;
        </Link>
      </section>
    </div>
  );
}
