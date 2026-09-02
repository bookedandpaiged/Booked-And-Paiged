'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };

var NOTE_CATEGORIES = ['All', 'Ideas', 'Reflections', 'GRE', 'MBA', 'Work', 'Personal'];
var CAT_COLORS = { Ideas: '#c4903a', Reflections: '#b86880', GRE: '#5b7ec4', MBA: '#8060b8', Work: '#3a8fa8', Personal: '#5a9870' };

export default function NotesPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;

  var filterState = useState('All');
  var filter = filterState[0]; var setFilter = filterState[1];
  var editingState = useState(null);
  var editing = editingState[0]; var setEditing = editingState[1];
  var showNewState = useState(false);
  var showNew = showNewState[0]; var setShowNew = showNewState[1];
  var searchState = useState('');
  var search = searchState[0]; var setSearch = searchState[1];
  var formState = useState({ title: '', body: '', category: 'Ideas' });
  var form = formState[0]; var setForm = formState[1];

  var notes = (data && data.notes) || [];

  function saveNotes(fn) { updateData(function(p) { return Object.assign({}, p, { notes: fn(p && p.notes || []) }); }); }

  function openNew() {
    setForm({ title: '', body: '', category: 'Ideas' });
    setEditing(null);
    setShowNew(true);
  }

  function openEdit(note) {
    setForm({ title: note.title, body: note.body, category: note.category });
    setEditing(note.id);
    setShowNew(true);
  }

  function save() {
    if (!form.body.trim()) return;
    var note = { id: editing || 'note-' + Date.now(), title: form.title, body: form.body, category: form.category, savedAt: editing ? (notes.find(function(n){return n.id===editing;}) || {}).savedAt || new Date().toISOString() : new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (editing) {
      saveNotes(function(ns) { return ns.map(function(n) { return n.id === editing ? note : n; }); });
    } else {
      saveNotes(function(ns) { return [note].concat(ns); });
    }
    setShowNew(false);
    setEditing(null);
  }

  function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    saveNotes(function(ns) { return ns.filter(function(n) { return n.id !== id; }); });
  }

  if (loading) return null;

  var filtered = notes.filter(function(n) {
    var matchCat = filter === 'All' || n.category === filter;
    var matchSearch = !search || (n.title || '').toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  var lbl = { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, display: 'block', marginBottom: '6px', fontFamily: sans };
  var inp = { width: '100%', padding: '10px 14px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '10px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '12px' };

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Notes
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Ideas, reflections, and free-form writing</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search notes..." style={{ padding: '9px 14px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '50px', fontSize: '13px', fontFamily: sans, color: text, background: '#fff', outline: 'none', width: '220px' }} />
        <button onClick={openNew} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: accentDark, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>+ New Note</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {NOTE_CATEGORIES.map(function(cat) {
          var active = filter === cat;
          var color = CAT_COLORS[cat] || accent;
          return <button key={cat} onClick={function(){setFilter(cat);}} style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid ' + (active ? (cat === 'All' ? accentDark : color) : 'rgba(93,66,51,0.12)'), background: active ? (cat === 'All' ? accentDark : color + '15') : 'transparent', color: active ? (cat === 'All' ? '#fff' : color) : textSoft, fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: sans }}>{cat}</button>;
        })}
      </div>

      {showNew && (
        <div style={{ ...card, border: '1px solid ' + accentDark + '30', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown }}>{editing ? 'Edit Note' : 'New Note'}</p>
            <button onClick={function(){setShowNew(false);}} style={{ background: 'none', border: 'none', color: textMuted, fontSize: '22px', cursor: 'pointer' }}>×</button>
          </div>
          <label style={lbl}>Title (optional)</label>
          <input value={form.title} onChange={function(e){setForm(function(f){return Object.assign({},f,{title:e.target.value});});}} placeholder="Give it a title..." style={inp} />
          <label style={lbl}>Category</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {NOTE_CATEGORIES.filter(function(c){return c!=='All';}).map(function(cat) {
              var active = form.category === cat;
              var color = CAT_COLORS[cat] || accent;
              return <button key={cat} onClick={function(){setForm(function(f){return Object.assign({},f,{category:cat});});}} style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid ' + (active ? color : 'rgba(93,66,51,0.12)'), background: active ? color + '15' : 'transparent', color: active ? color : textSoft, fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>{cat}</button>;
            })}
          </div>
          <label style={lbl}>Note</label>
          <textarea value={form.body} onChange={function(e){setForm(function(f){return Object.assign({},f,{body:e.target.value});});}} placeholder="Write anything..." rows={6} style={{ ...inp, resize: 'vertical', height: '140px', marginBottom: '14px' }} />
          <button onClick={save} style={{ width: '100%', padding: '12px', borderRadius: '50px', border: 'none', background: form.body.trim() ? accentDark : '#EDE5DA', color: form.body.trim() ? '#fff' : textMuted, fontWeight: 600, cursor: form.body.trim() ? 'pointer' : 'default', fontSize: '13px', fontFamily: sans }}>Save Note</button>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '8px' }}>{notes.length === 0 ? 'Your notes live here' : 'No notes match'}</p>
          <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>{notes.length === 0 ? 'Ideas, reflections, or anything else worth keeping.' : 'Try a different filter or search term.'}</p>
        </div>
      )}

      {filtered.map(function(note) {
        var color = CAT_COLORS[note.category] || accent;
        var date = new Date(note.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return (
          <div key={note.id} style={{ ...card, borderLeft: '3px solid ' + color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                {note.title && <p style={{ fontSize: '15px', fontWeight: 600, color: brown, fontFamily: sans, marginBottom: '3px' }}>{note.title}</p>}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: sans }}>{note.category}</span>
                  <span style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>{date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={function(){openEdit(note);}} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: sans }}>Edit</button>
                <button onClick={function(){deleteNote(note.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px', fontFamily: sans }}>Delete</button>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: text, lineHeight: 1.65, fontFamily: sans, whiteSpace: 'pre-wrap' }}>{note.body.length > 300 ? note.body.slice(0, 300) + '...' : note.body}</p>
          </div>
        );
      })}
    </div>
  );
}
