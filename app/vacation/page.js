'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };

var PHASES = [
  { id: 'brainstorm', label: 'Brainstorming', color: '#9C7B65' },
  { id: 'planning', label: 'Planning', color: '#5b7ec4' },
  { id: 'archived', label: 'Past Trips', color: textMuted },
];

var STATUS_COLORS = { 'Not started': '#9C7B65', 'In progress': '#c4903a', 'Booked': '#5a9870', 'Completed': '#8060b8' };

function exportAsWord(trip) {
  var html = '<html><head><meta charset="utf-8"><style>body{font-family:Calibri,sans-serif;padding:40px;color:#333}h1{font-size:24px;margin-bottom:4px}h2{font-size:16px;color:#666;margin-top:20px;border-bottom:1px solid #ddd;padding-bottom:4px}p{margin:4px 0}table{border-collapse:collapse;width:100%;margin-top:8px}td{padding:6px 12px;border:1px solid #ddd;font-size:14px}</style></head><body>';
  html += '<h1>' + (trip.name || 'Untitled Trip') + '</h1>';
  if (trip.destination) html += '<p><strong>Destination:</strong> ' + trip.destination + '</p>';
  if (trip.budget) html += '<p><strong>Budget:</strong> ' + trip.budget + '</p>';
  if (trip.dates) html += '<p><strong>Dates:</strong> ' + trip.dates + '</p>';
  if (trip.ptoDays) html += '<p><strong>PTO Days:</strong> ' + trip.ptoDays + ' &middot; ' + trip.ptoStatus + '</p>';
  if (trip.status && trip.status !== 'Not started') html += '<p><strong>Status:</strong> ' + trip.status + '</p>';
  if (trip.notes) { html += '<h2>Notes</h2><p>' + trip.notes.replace(/\n/g, '<br>') + '</p>'; }
  if (trip.excursions && trip.excursions.length > 0) {
    html += '<h2>Excursions</h2><table><tr><th style="text-align:left;padding:6px 12px;border:1px solid #ddd;background:#f5f5f5">Excursion</th><th style="text-align:left;padding:6px 12px;border:1px solid #ddd;background:#f5f5f5">Status</th></tr>';
    trip.excursions.forEach(function(e) { html += '<tr><td>' + e.text + '</td><td>' + (e.done ? 'Done' : 'Pending') + '</td></tr>'; });
    html += '</table>';
  }
  if (trip.todos && trip.todos.length > 0) {
    html += '<h2>To-Do List</h2><table><tr><th style="text-align:left;padding:6px 12px;border:1px solid #ddd;background:#f5f5f5">Task</th><th style="text-align:left;padding:6px 12px;border:1px solid #ddd;background:#f5f5f5">Status</th></tr>';
    trip.todos.forEach(function(t) { html += '<tr><td>' + t.text + '</td><td>' + (t.done ? 'Done' : 'Pending') + '</td></tr>'; });
    html += '</table>';
  }
  html += '</body></html>';
  var blob = new Blob([html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = (trip.name || 'trip') .replace(/[^a-zA-Z0-9]/g, '_') + '.doc';
  a.click();
  URL.revokeObjectURL(url);
}

function exportAsExcel(trip) {
  var rows = [];
  rows.push(['Field', 'Value']);
  rows.push(['Trip Name', trip.name || '']);
  rows.push(['Destination', trip.destination || '']);
  rows.push(['Budget', trip.budget || '']);
  if (trip.dates) rows.push(['Dates', trip.dates]);
  if (trip.ptoDays) rows.push(['PTO Days', trip.ptoDays]);
  if (trip.ptoStatus) rows.push(['PTO Status', trip.ptoStatus]);
  if (trip.status) rows.push(['Status', trip.status]);
  if (trip.notes) rows.push(['Notes', trip.notes.replace(/\n/g, ' ')]);
  rows.push([]);
  if (trip.excursions && trip.excursions.length > 0) {
    rows.push(['Excursions', 'Status']);
    trip.excursions.forEach(function(e) { rows.push([e.text, e.done ? 'Done' : 'Pending']); });
    rows.push([]);
  }
  if (trip.todos && trip.todos.length > 0) {
    rows.push(['To-Do', 'Status']);
    trip.todos.forEach(function(t) { rows.push([t.text, t.done ? 'Done' : 'Pending']); });
  }
  var csv = rows.map(function(r) { return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = (trip.name || 'trip').replace(/[^a-zA-Z0-9]/g, '_') + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function CheckList({ items, onChange, placeholder }) {
  var inputState = useState('');
  var val = inputState[0]; var setVal = inputState[1];
  function add() {
    if (!val.trim()) return;
    onChange(items.concat([{ id: 'item-' + Date.now(), text: val.trim(), done: false }]));
    setVal('');
  }
  function toggle(id) { onChange(items.map(function(t) { return t.id === id ? Object.assign({}, t, { done: !t.done }) : t; })); }
  function remove(id) { onChange(items.filter(function(t) { return t.id !== id; })); }
  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <input value={val} onChange={function(e){setVal(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter')add();}} placeholder={placeholder || 'Add item and press Enter'} style={{ flex: 1, padding: '8px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '12px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none' }} />
        <button onClick={add} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: accentDark, color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: sans }}>Add</button>
      </div>
      {items.map(function(t) {
        return (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', borderBottom: '1px solid rgba(93,66,51,0.03)' }}>
            <span onClick={function(){toggle(t.id);}} style={{ width: '16px', height: '16px', minWidth: '16px', borderRadius: '4px', border: '1.5px solid ' + (t.done ? '#5a9870' : 'rgba(93,66,51,0.2)'), background: t.done ? '#e8f5f0' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2a8f65', fontSize: '10px', fontWeight: 700 }}>{t.done ? '\u2713' : ''}</span>
            <span style={{ flex: 1, fontSize: '13px', color: t.done ? textMuted : text, textDecoration: t.done ? 'line-through' : 'none', fontFamily: sans }}>{t.text}</span>
            <button onClick={function(){remove(t.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>\u00d7</button>
          </div>
        );
      })}
    </div>
  );
}

export default function VacationPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var phaseState = useState('brainstorm');
  var activePhase = phaseState[0]; var setActivePhase = phaseState[1];
  var editingState = useState(null);
  var editing = editingState[0]; var setEditing = editingState[1];
  var showNewState = useState(false);
  var showNew = showNewState[0]; var setShowNew = showNewState[1];
  var formState = useState({ id: '', name: '', destination: '', phase: 'brainstorm', dates: '', ptoDays: '', ptoStatus: 'Not submitted', budget: '', notes: '', todos: [], excursions: [], status: 'Not started', archived: false, createdAt: '' });
  var form = formState[0]; var setForm = formState[1];

  var trips = (data && data.trips) || [];

  function saveTrips(fn) { updateData(function(p) { return Object.assign({}, p, { trips: fn(p && p.trips || []) }); }); }

  function openNew() {
    setForm({ id: 'trip-' + Date.now(), name: '', destination: '', phase: activePhase === 'archived' ? 'brainstorm' : activePhase, dates: '', ptoDays: '', ptoStatus: 'Not submitted', budget: '', notes: '', todos: [], excursions: [], status: 'Not started', archived: false, createdAt: new Date().toISOString() });
    setEditing(null);
    setShowNew(true);
  }

  function openEdit(trip) {
    setForm(Object.assign({}, trip, { excursions: trip.excursions || [], todos: trip.todos || [] }));
    setEditing(trip.id);
    setShowNew(true);
  }

  function saveForm() {
    if (!form.name && !form.destination) return;
    if (editing) {
      saveTrips(function(ts) { return ts.map(function(t) { return t.id === editing ? form : t; }); });
    } else {
      saveTrips(function(ts) { return ts.concat([form]); });
    }
    setShowNew(false);
    setEditing(null);
  }

  function archive(id) {
    saveTrips(function(ts) { return ts.map(function(t) { return t.id === id ? Object.assign({}, t, { archived: true, phase: 'archived' }) : t; }); });
  }

  function deleteTrip(id) {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return;
    saveTrips(function(ts) { return ts.filter(function(t) { return t.id !== id; }); });
  }

  if (loading) return null;

  var filtered = trips.filter(function(t) {
    if (activePhase === 'archived') return t.archived || t.phase === 'archived';
    return t.phase === activePhase && !t.archived;
  });

  var isBrainstorm = form.phase === 'brainstorm';
  var inp = { width: '100%', padding: '9px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '10px' };
  var lblStyle = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, display: 'block', marginBottom: '4px', fontFamily: sans };

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          Vacation Planning
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Trip ideas, itineraries, and PTO tracking</p>
      </div>

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '20px', border: '1px solid rgba(93,66,51,0.06)' }}>
        {PHASES.map(function(p) {
          var active = activePhase === p.id;
          var count = trips.filter(function(t) { return p.id === 'archived' ? (t.archived || t.phase === 'archived') : (t.phase === p.id && !t.archived); }).length;
          return <button key={p.id} onClick={function(){setActivePhase(p.id);}} style={{ flex: 1, fontFamily: sans, fontSize: '12px', fontWeight: active ? 600 : 400, padding: '9px 4px', borderRadius: '8px', border: 'none', background: active ? '#fff' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none' }}>
            {p.label}{count > 0 ? ' (' + count + ')' : ''}
          </button>;
        })}
      </div>

      {/* Add button */}
      {activePhase !== 'archived' && !showNew && (
        <button onClick={openNew} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px dashed rgba(93,66,51,0.2)', background: 'transparent', color: textSoft, fontSize: '13px', cursor: 'pointer', fontFamily: sans, marginBottom: '16px' }}>
          {activePhase === 'brainstorm' ? '+ Add Trip Idea' : '+ Add Trip Plan'}
        </button>
      )}

      {/* New/Edit Form */}
      {showNew && (
        <div style={{ ...card, border: '1px solid ' + accentDark + '30', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '22px', color: brown }}>{editing ? 'Edit Trip' : activePhase === 'brainstorm' ? 'New Trip Idea' : 'New Trip Plan'}</p>
            <button onClick={function(){setShowNew(false);}} style={{ background: 'none', border: 'none', color: textMuted, fontSize: '20px', cursor: 'pointer' }}>\u00d7</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={lblStyle}>Trip Name</span>
              <input value={form.name} onChange={function(e){setForm(function(f){return Object.assign({},f,{name:e.target.value});});}} placeholder="e.g. Italy Summer 2027" style={inp} />
            </div>
            <div>
              <span style={lblStyle}>Destination</span>
              <input value={form.destination} onChange={function(e){setForm(function(f){return Object.assign({},f,{destination:e.target.value});});}} placeholder="City, Country" style={inp} />
            </div>
            <div>
              <span style={lblStyle}>Budget Estimate</span>
              <input value={form.budget} onChange={function(e){setForm(function(f){return Object.assign({},f,{budget:e.target.value});});}} placeholder="e.g. $3,000" style={inp} />
            </div>
            {!isBrainstorm && (
              <>
                <div>
                  <span style={lblStyle}>Dates</span>
                  <input value={form.dates} onChange={function(e){setForm(function(f){return Object.assign({},f,{dates:e.target.value});});}} placeholder="e.g. Aug 10-17, 2027" style={inp} />
                </div>
                <div>
                  <span style={lblStyle}>Status</span>
                  <select value={form.status} onChange={function(e){setForm(function(f){return Object.assign({},f,{status:e.target.value});});}} style={inp}>
                    <option>Not started</option>
                    <option>In progress</option>
                    <option>Booked</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <span style={lblStyle}>PTO Days Needed</span>
                  <input value={form.ptoDays} onChange={function(e){setForm(function(f){return Object.assign({},f,{ptoDays:e.target.value});});}} placeholder="e.g. 5" style={inp} />
                </div>
                <div>
                  <span style={lblStyle}>PTO Status</span>
                  <select value={form.ptoStatus} onChange={function(e){setForm(function(f){return Object.assign({},f,{ptoStatus:e.target.value});});}} style={inp}>
                    <option>Not submitted</option>
                    <option>Submitted</option>
                    <option>Approved</option>
                    <option>Denied</option>
                  </select>
                </div>
              </>
            )}
            <div style={{ gridColumn: 'span 2' }}>
              <span style={lblStyle}>Notes / Ideas</span>
              <textarea value={form.notes} onChange={function(e){setForm(function(f){return Object.assign({},f,{notes:e.target.value});});}} placeholder="Destinations, ideas, inspiration..." style={Object.assign({},inp,{height:'80px',resize:'vertical'})} />
            </div>
            {!isBrainstorm && (
              <>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={lblStyle}>Excursion List</span>
                  <CheckList items={form.excursions || []} onChange={function(v){setForm(function(f){return Object.assign({},f,{excursions:v});});}} placeholder="Add excursion and press Enter" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={lblStyle}>To-Do List</span>
                  <CheckList items={form.todos || []} onChange={function(v){setForm(function(f){return Object.assign({},f,{todos:v});});}} placeholder="Add to-do and press Enter" />
                </div>
              </>
            )}
            <div style={{ gridColumn: 'span 2' }}>
              <span style={lblStyle}>Phase</span>
              <select value={form.phase} onChange={function(e){setForm(function(f){return Object.assign({},f,{phase:e.target.value});});}} style={inp}>
                <option value="brainstorm">Brainstorming</option>
                <option value="planning">Planning</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={saveForm} style={{ flex: 1, padding: '12px', borderRadius: '50px', border: 'none', background: accentDark, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>Save Trip</button>
            {editing && <button onClick={function(){archive(editing);setShowNew(false);}} style={{ padding: '12px 18px', borderRadius: '50px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>Archive</button>}
          </div>
        </div>
      )}

      {/* Trip cards */}
      {filtered.length === 0 && !showNew && (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '8px' }}>
            {activePhase === 'brainstorm' ? 'Where do you want to go?' : activePhase === 'planning' ? 'No trips in planning yet' : 'No past trips yet'}
          </p>
          <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>
            {activePhase === 'brainstorm' ? 'Add a destination idea, dream trip, or travel concept.' : activePhase === 'planning' ? 'Move a brainstorm idea to planning when you\'re ready to commit.' : 'Completed and archived trips appear here.'}
          </p>
        </div>
      )}

      {filtered.map(function(trip) {
        var statusColor = STATUS_COLORS[trip.status] || accent;
        var doneTodos = (trip.todos || []).filter(function(t){return t.done;}).length;
        var doneExcursions = (trip.excursions || []).filter(function(e){return e.done;}).length;
        return (
          <div key={trip.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown }}>{trip.name || 'Untitled Trip'}</p>
                {trip.destination && <p style={{ fontSize: '13px', color: textSoft, marginTop: '2px', fontFamily: sans }}>{trip.destination}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {trip.status && trip.status !== 'Not started' && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: statusColor + '15', color: statusColor, fontFamily: sans }}>{trip.status}</span>}
                <button onClick={function(){openEdit(trip);}} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: sans }}>Edit</button>
                {!trip.archived && <button onClick={function(){archive(trip.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px', fontFamily: sans }}>Archive</button>}
                {trip.archived && <button onClick={function(){deleteTrip(trip.id);}} style={{ background: 'none', border: 'none', color: '#C94040', cursor: 'pointer', fontSize: '12px', fontFamily: sans }}>Delete</button>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: (trip.notes || (trip.todos && trip.todos.length > 0) || (trip.excursions && trip.excursions.length > 0)) ? '14px' : 0 }}>
              {trip.budget && <div style={{ background: '#FAF7F3', borderRadius: '8px', padding: '10px 12px' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '3px', fontFamily: sans }}>Budget</p><p style={{ fontSize: '13px', fontWeight: 600, color: brown, fontFamily: sans }}>{trip.budget}</p></div>}
              {trip.dates && <div style={{ background: '#FAF7F3', borderRadius: '8px', padding: '10px 12px' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '3px', fontFamily: sans }}>Dates</p><p style={{ fontSize: '13px', fontWeight: 600, color: brown, fontFamily: sans }}>{trip.dates}</p></div>}
              {trip.ptoDays && <div style={{ background: '#FAF7F3', borderRadius: '8px', padding: '10px 12px' }}><p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '3px', fontFamily: sans }}>PTO</p><p style={{ fontSize: '13px', fontWeight: 600, color: brown, fontFamily: sans }}>{trip.ptoDays} days &middot; {trip.ptoStatus}</p></div>}
            </div>

            {trip.notes && <p style={{ fontSize: '13px', color: textSoft, lineHeight: 1.6, fontFamily: sans, marginBottom: ((trip.todos && trip.todos.length > 0) || (trip.excursions && trip.excursions.length > 0)) ? '12px' : 0 }}>{trip.notes}</p>}

            {trip.excursions && trip.excursions.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(93,66,51,0.06)', paddingTop: '12px', marginBottom: trip.todos && trip.todos.length > 0 ? '12px' : 0 }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, marginBottom: '8px', fontFamily: sans }}>Excursions &middot; {doneExcursions}/{trip.excursions.length}</p>
                {trip.excursions.slice(0, 3).map(function(e) {
                  return <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ width: '14px', height: '14px', minWidth: '14px', borderRadius: '3px', border: '1.5px solid ' + (e.done ? '#5a9870' : 'rgba(93,66,51,0.2)'), background: e.done ? '#e8f5f0' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2a8f65', fontSize: '9px', fontWeight: 700 }}>{e.done ? '\u2713' : ''}</span>
                    <span style={{ fontSize: '13px', color: e.done ? textMuted : text, textDecoration: e.done ? 'line-through' : 'none', fontFamily: sans }}>{e.text}</span>
                  </div>;
                })}
                {trip.excursions.length > 3 && <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>+{trip.excursions.length - 3} more</p>}
              </div>
            )}

            {trip.todos && trip.todos.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(93,66,51,0.06)', paddingTop: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, marginBottom: '8px', fontFamily: sans }}>To-Do &middot; {doneTodos}/{trip.todos.length}</p>
                {trip.todos.slice(0, 3).map(function(t) {
                  return <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ width: '14px', height: '14px', minWidth: '14px', borderRadius: '3px', border: '1.5px solid ' + (t.done ? '#5a9870' : 'rgba(93,66,51,0.2)'), background: t.done ? '#e8f5f0' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2a8f65', fontSize: '9px', fontWeight: 700 }}>{t.done ? '\u2713' : ''}</span>
                    <span style={{ fontSize: '13px', color: t.done ? textMuted : text, textDecoration: t.done ? 'line-through' : 'none', fontFamily: sans }}>{t.text}</span>
                  </div>;
                })}
                {trip.todos.length > 3 && <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>+{trip.todos.length - 3} more</p>}
              </div>
            )}

            {/* Export buttons */}
            <div style={{ borderTop: '1px solid rgba(93,66,51,0.06)', paddingTop: '12px', marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button onClick={function(){exportAsWord(trip);}} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>Export as Word</button>
              <button onClick={function(){exportAsExcel(trip);}} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>Export as CSV</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
