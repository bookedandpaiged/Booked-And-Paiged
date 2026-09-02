'use client';

import { useState, useEffect } from 'react';
import { useData } from './DataProvider';
import Link from 'next/link';

var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';

function highlight(str, q) {
  if (!q || !str) return str;
  var idx = str.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return str;
  return str.slice(0, idx) + '**' + str.slice(idx, idx + q.length) + '**' + str.slice(idx + q.length);
}

function HighlightText({ text: t, query }) {
  if (!query || !t) return <span>{t}</span>;
  var parts = t.split(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'));
  return <span>{parts.map(function(part, i) { return part.toLowerCase() === query.toLowerCase() ? <mark key={i} style={{ background: accent + '30', color: accentDark, borderRadius: '2px', padding: '0 2px' }}>{part}</mark> : part; })}</span>;
}

export default function GlobalSearch({ onClose }) {
  var dataCtx = useData();
  var data = dataCtx.data;
  var queryState = useState('');
  var query = queryState[0]; var setQuery = queryState[1];
  var results = [];

  useEffect(function() {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return function() { document.removeEventListener('keydown', onKey); };
  }, []);

  if (query.trim().length >= 2 && data) {
    var q = query.toLowerCase();

    // Calendar events
    var events = (data.calendarEvents || []);
    events.forEach(function(ev) {
      if ((ev.title || '').toLowerCase().includes(q) || (ev.notes || '').toLowerCase().includes(q)) {
        results.push({ type: 'Calendar', label: ev.title, sub: ev.category + (ev.startDate ? ' · ' + ev.startDate : ''), href: '/calendar', icon: '📅' });
      }
    });

    // Reminders
    var reminders = (data.reminders || []);
    reminders.forEach(function(r) {
      if ((r.label || '').toLowerCase().includes(q)) {
        results.push({ type: 'Reminder', label: r.label, sub: r.freq, href: '/reminders', icon: '🔔' });
      }
    });

    // Notes
    var notes = (data.notes || []);
    notes.forEach(function(n) {
      if ((n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q)) {
        results.push({ type: 'Note', label: n.title || n.body.slice(0, 60), sub: n.category, href: '/notes', icon: '📝' });
      }
    });

    // Trips
    var trips = (data.trips || []);
    trips.forEach(function(t) {
      if ((t.name || '').toLowerCase().includes(q) || (t.destination || '').toLowerCase().includes(q)) {
        results.push({ type: 'Vacation', label: t.name || t.destination, sub: t.destination, href: '/vacation', icon: '✈️' });
      }
    });

    // Habits
    var habits = (data.habits || []);
    habits.forEach(function(h) {
      if ((h.label || '').toLowerCase().includes(q)) {
        results.push({ type: 'Habit', label: h.label, sub: h.category, href: '/habits', icon: '✅' });
      }
    });

    // Weekly reviews
    var reviews = (data.weeklyReviews || []);
    reviews.forEach(function(r) {
      var matched = Object.values(r).some(function(v) { return typeof v === 'string' && v.toLowerCase().includes(q); });
      if (matched) {
        var date = new Date(r.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        results.push({ type: 'Review', label: 'Weekly Review · ' + date, sub: 'Weekly reflection', href: '/review', icon: '📖' });
      }
    });

    // Bills
    var bills = (data.bills || []);
    bills.forEach(function(b) {
      if ((b.label || '').toLowerCase().includes(q)) {
        results.push({ type: 'Bill', label: b.label, sub: b.amount ? '$' + b.amount : '', href: '/reminders', icon: '💳' });
      }
    });

    results = results.slice(0, 12);
  }

  var TYPE_COLORS = { Calendar: '#5b7ec4', Reminder: '#c4903a', Note: '#b86880', Vacation: '#5a9870', Habit: '#9C7B65', Review: '#8060b8', Bill: '#3a8fa8' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,46,34,0.4)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px 20px' }} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}} style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '560px', boxShadow: '0 16px 48px rgba(61,46,34,0.15)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(93,66,51,0.06)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSoft} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input autoFocus value={query} onChange={function(e){setQuery(e.target.value);}} placeholder="Search everything..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', fontFamily: sans, color: text, background: 'transparent' }} />
          {query && <button onClick={function(){setQuery('');}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '18px' }}>×</button>}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px', fontFamily: sans, padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(93,66,51,0.1)' }}>Esc</button>
        </div>

        {query.trim().length < 2 && (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: textMuted, fontFamily: sans }}>Type at least 2 characters to search across all your data.</p>
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: textSoft, fontFamily: sans }}>No results for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.map(function(r, i) {
              var color = TYPE_COLORS[r.type] || accent;
              return (
                <Link key={i} href={r.href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid rgba(93,66,51,0.04)', textDecoration: 'none', background: 'transparent' }}
                  onMouseEnter={function(e){e.currentTarget.style.background='#FAF7F3';}}
                  onMouseLeave={function(e){e.currentTarget.style.background='transparent';}}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', color: brown, fontFamily: sans, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <HighlightText text={r.label} query={query} />
                    </p>
                    {r.sub && <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans, marginTop: '2px' }}>{r.sub}</p>}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: color, background: color + '15', padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: sans, flexShrink: 0 }}>{r.type}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(93,66,51,0.06)', display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>↵ to navigate</span>
          <span style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
