'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };

var CATS = [
  { id: 'working', label: 'Working well', color: '#5a9870' },
  { id: 'broken', label: 'Not working / broken', color: '#C94040' },
  { id: 'request', label: 'Feature request', color: '#5b7ec4' },
  { id: 'other', label: 'Other', color: '#9C7B65' },
];

export default function FeedbackPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var noteState = useState('');
  var note = noteState[0]; var setNote = noteState[1];
  var catState = useState('working');
  var cat = catState[0]; var setCat = catState[1];
  var savedState = useState(false);
  var saved = savedState[0]; var setSaved = savedState[1];

  var entries = (data && data.feedback) || [];

  function submit() {
    if (!note.trim()) return;
    var entry = { id: 'fb-' + Date.now(), text: note.trim(), cat: cat, savedAt: new Date().toISOString() };
    updateData(function(p) { return Object.assign({}, p, { feedback: [entry].concat(p && p.feedback || []) }); });
    setNote('');
    setSaved(true);
    setTimeout(function(){setSaved(false);}, 2000);
  }

  function deleteEntry(id) {
    updateData(function(p) { return Object.assign({}, p, { feedback: (p && p.feedback || []).filter(function(e){return e.id !== id;}) }); });
  }

  if (loading) return null;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          App Feedback
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Notes on what is working, what is not, and what to build next</p>
      </div>

      <div style={card}>
        <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans, marginBottom: '14px', lineHeight: 1.6 }}>Log notes about the app here. When you come back to iterate, everything is in one place.</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {CATS.map(function(c) {
            var active = cat === c.id;
            return <button key={c.id} onClick={function(){setCat(c.id);}} style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid ' + (active ? c.color : 'rgba(93,66,51,0.12)'), background: active ? c.color + '15' : 'transparent', color: active ? c.color : textSoft, fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: sans }}>{c.label}</button>;
          })}
        </div>
        <textarea value={note} onChange={function(e){setNote(e.target.value);}} placeholder="What do you want to note?" rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '10px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', resize: 'vertical', marginBottom: '10px' }} />
        <button onClick={submit} style={{ width: '100%', padding: '12px', borderRadius: '50px', border: 'none', background: note.trim() ? accentDark : '#EDE5DA', color: note.trim() ? '#fff' : textMuted, fontWeight: 600, cursor: note.trim() ? 'pointer' : 'default', fontSize: '13px', fontFamily: sans }}>
          {saved ? 'Saved ✓' : 'Save Note'}
        </button>
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9C7B65', marginBottom: '10px', fontFamily: sans }}>Previous Notes</p>
          {entries.map(function(e) {
            var c = CATS.find(function(c){return c.id === e.cat;}) || CATS[3];
            var date = new Date(e.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={e.id} style={{ ...card, borderLeft: '3px solid ' + c.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: sans }}>{c.label}</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>{date}</span>
                    <button onClick={function(){deleteEntry(e.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>×</button>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: text, lineHeight: 1.6, fontFamily: sans }}>{e.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
