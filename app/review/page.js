'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };
var inp = { width: '100%', padding: '10px 14px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '10px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '12px', resize: 'vertical' };
var lbl = { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, display: 'block', marginBottom: '5px', fontFamily: sans };

var WEEKLY_QUESTIONS = [
  { id: 'done', label: 'What got done this week?', placeholder: 'Key wins, completed tasks, things you actually showed up for...', rows: 3 },
  { id: 'carried', label: 'What carried over?', placeholder: 'What didn\'t get done, what shifted, what needs to move to next week...', rows: 2 },
  { id: 'priority', label: 'Top priority for next week', placeholder: 'The one thing that must move forward...', rows: 2 },
  { id: 'adjustments', label: 'Any schedule adjustments needed?', placeholder: 'Gym, study blocks, work, routines — anything that needs to shift...', rows: 2 },
  { id: 'win', label: 'One personal win from this week', placeholder: 'Something you\'re proud of, big or small...', rows: 2 },
];

var QUARTERLY_QUESTIONS = [
  { id: 'gre', label: 'GRE + MBA progress', placeholder: 'Score movement, milestones hit, study consistency...', rows: 3 },
  { id: 'awards', label: 'Awards submissions status', placeholder: 'What\'s submitted, what\'s in progress, what\'s pending...', rows: 2 },
  { id: 'wellness', label: 'Wellness + body composition', placeholder: 'Weight trends, energy, consistency, what\'s working...', rows: 2 },
  { id: 'professional', label: 'Professional development', placeholder: 'Career milestones, Sachs Media wins, skills built...', rows: 2 },
  { id: 'working', label: 'What\'s working', placeholder: 'Systems, habits, routines that are actually serving you...', rows: 2 },
  { id: 'change', label: 'What needs to change', placeholder: 'What to drop, adjust, or rebuild next quarter...', rows: 2 },
  { id: 'financial', label: 'Financial check-in', placeholder: 'Bills, savings, upcoming expenses, anything to plan for...', rows: 2 },
  { id: 'personal', label: 'Personal life check-in', placeholder: 'Relationships, self-care, rest, mental health, joy...', rows: 2 },
];

function ReviewForm({ questions, onSave, saving }) {
  var formState = useState({});
  var form = formState[0]; var setForm = formState[1];
  function update(id, val) { setForm(function(f) { return Object.assign({}, f, { [id]: val }); }); }
  var filled = Object.values(form).some(function(v) { return v && v.trim(); });
  return (
    <div>
      {questions.map(function(q) {
        return (
          <div key={q.id} style={{ marginBottom: '16px' }}>
            <label style={lbl}>{q.label}</label>
            <textarea value={form[q.id] || ''} onChange={function(e){update(q.id, e.target.value);}} placeholder={q.placeholder} rows={q.rows} style={inp} />
          </div>
        );
      })}
      <button onClick={function(){onSave(form); setForm({});}} disabled={!filled} style={{ width: '100%', padding: '13px', borderRadius: '50px', border: 'none', background: filled ? accentDark : '#EDE5DA', color: filled ? '#fff' : textMuted, fontWeight: 600, cursor: filled ? 'pointer' : 'default', fontSize: '13px', fontFamily: sans }}>
        {saving ? 'Saving...' : 'Save Review'}
      </button>
    </div>
  );
}

function ReviewEntry({ entry, type }) {
  var openState = useState(false);
  var open = openState[0]; var setOpen = openState[1];
  var questions = type === 'weekly' ? WEEKLY_QUESTIONS : QUARTERLY_QUESTIONS;
  var date = new Date(entry.savedAt);
  var dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div style={{ ...card, marginBottom: '8px' }}>
      <button onClick={function(){setOpen(!open);}} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', color: brown }}>{dateStr}</p>
        <span style={{ fontSize: '11px', color: textMuted, transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(93,66,51,0.06)' }}>
          {questions.map(function(q) {
            if (!entry[q.id]) return null;
            return (
              <div key={q.id} style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '4px', fontFamily: sans }}>{q.label}</p>
                <p style={{ fontSize: '14px', color: text, lineHeight: 1.6, fontFamily: sans }}>{entry[q.id]}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var tabState = useState('weekly');
  var tab = tabState[0]; var setTab = tabState[1];
  var viewState = useState('new');
  var view = viewState[0]; var setView = viewState[1];
  var savingState = useState(false);
  var saving = savingState[0]; var setSaving = savingState[1];

  var weeklyReviews = (data && data.weeklyReviews) || [];
  var quarterlyReviews = (data && data.quarterlyReviews) || [];

  function saveWeekly(form) {
    setSaving(true);
    var entry = Object.assign({}, form, { id: 'wr-' + Date.now(), savedAt: new Date().toISOString() });
    updateData(function(p) { return Object.assign({}, p, { weeklyReviews: [entry].concat(p && p.weeklyReviews || []) }); });
    setTimeout(function(){setSaving(false); setView('archive');}, 400);
  }

  function saveQuarterly(form) {
    setSaving(true);
    var entry = Object.assign({}, form, { id: 'qr-' + Date.now(), savedAt: new Date().toISOString() });
    updateData(function(p) { return Object.assign({}, p, { quarterlyReviews: [entry].concat(p && p.quarterlyReviews || []) }); });
    setTimeout(function(){setSaving(false); setView('archive');}, 400);
  }

  if (loading) return null;

  var now = new Date();
  var weekOf = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  var quarter = 'Q' + (Math.ceil((now.getMonth() + 1) / 3)) + ' ' + now.getFullYear();

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Reviews
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Weekly and quarterly reflections</p>
      </div>

      {/* Type tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '16px', border: '1px solid rgba(93,66,51,0.06)' }}>
        {[['weekly','Weekly Review'],['quarterly','Quarterly Review']].map(function(t) {
          var active = tab === t[0];
          return <button key={t[0]} onClick={function(){setTab(t[0]); setView('new');}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '9px 6px', borderRadius: '8px', border: 'none', background: active ? '#fff' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none' }}>{t[1]}</button>;
        })}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={function(){setView('new');}} style={{ padding: '7px 18px', borderRadius: '20px', border: 'none', background: view === 'new' ? accentDark : 'transparent', color: view === 'new' ? '#fff' : textSoft, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>New Entry</button>
        <button onClick={function(){setView('archive');}} style={{ padding: '7px 18px', borderRadius: '20px', border: '1px solid rgba(93,66,51,0.1)', background: view === 'archive' ? accentDark : 'transparent', color: view === 'archive' ? '#fff' : textSoft, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>
          Past Reviews {tab === 'weekly' && weeklyReviews.length > 0 ? '(' + weeklyReviews.length + ')' : ''}
          {tab === 'quarterly' && quarterlyReviews.length > 0 ? '(' + quarterlyReviews.length + ')' : ''}
        </button>
      </div>

      {view === 'new' && tab === 'weekly' && (
        <div>
          <div style={{ ...card, borderLeft: '3px solid ' + accentDark, marginBottom: '20px' }}>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '4px' }}>Weekly Review</p>
            <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>Week of {weekOf}</p>
          </div>
          <ReviewForm questions={WEEKLY_QUESTIONS} onSave={saveWeekly} saving={saving} />
        </div>
      )}

      {view === 'new' && tab === 'quarterly' && (
        <div>
          <div style={{ ...card, borderLeft: '3px solid ' + accent, marginBottom: '20px' }}>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '4px' }}>Quarterly Review</p>
            <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>{quarter} · Deeper reflection across all areas</p>
          </div>
          <ReviewForm questions={QUARTERLY_QUESTIONS} onSave={saveQuarterly} saving={saving} />
        </div>
      )}

      {view === 'archive' && tab === 'weekly' && (
        <div>
          {weeklyReviews.length === 0
            ? <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}><p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '8px' }}>No reviews yet</p><p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>Complete your first weekly review to build your archive.</p></div>
            : weeklyReviews.map(function(e) { return <ReviewEntry key={e.id} entry={e} type="weekly" />; })
          }
        </div>
      )}

      {view === 'archive' && tab === 'quarterly' && (
        <div>
          {quarterlyReviews.length === 0
            ? <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}><p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '8px' }}>No reviews yet</p><p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>Complete your first quarterly review to build your archive.</p></div>
            : quarterlyReviews.map(function(e) { return <ReviewEntry key={e.id} entry={e} type="quarterly" />; })
          }
        </div>
      )}
    </div>
  );
}
