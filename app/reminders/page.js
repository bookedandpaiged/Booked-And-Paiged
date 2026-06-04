'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var border = 'rgba(93,66,51,0.06)';
var card = { background: '#FFFFFF', border: '1px solid ' + border, borderRadius: '14px', padding: '20px 22px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };
var sectionLabel = { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: '10px', marginTop: '24px', display: 'block', fontFamily: sans };

var TABS = ['Reminders', 'Bills', 'Cleaning', 'To-Do'];

var DEFAULT_REMINDERS = [
  { id: 'r1', cat: 'Grooming', label: 'Eyebrow appointment', freq: 'Every 2 weeks', note: 'Book Friday or Saturday. App reminds 3 days before.', color: '#b86880', lastDone: null },
  { id: 'r2', cat: 'Grooming', label: 'Hair salon (wash)', freq: 'Monthly', note: 'Professional wash. Book 1 week in advance.', color: '#b86880', lastDone: null },
  { id: 'r3', cat: 'Grooming', label: 'Hair trim', freq: 'Every 6 weeks', note: 'Track separately from regular salon visits.', color: '#b86880', lastDone: null },
  { id: 'r4', cat: 'Pet', label: 'Peanut grooming', freq: 'Monthly', note: 'Book 1 week in advance.', color: '#c4903a', lastDone: null },
  { id: 'r5', cat: 'Medical', label: 'Therapy', freq: 'Weekly (Thursday 6PM)', note: 'Recurring. Notification 1 hour before.', color: '#8060b8', lastDone: null },
  { id: 'r6', cat: 'Medical', label: 'Medication management', freq: 'Monthly', note: 'Check-in for Spironolactone and Adderall.', color: '#8060b8', lastDone: null },
  { id: 'r7', cat: 'Medical', label: 'Dentist', freq: 'Every 6 months', note: 'Reminder 1 month before to schedule.', color: '#8060b8', lastDone: null },
  { id: 'r8', cat: 'Medical', label: 'Primary care doctor', freq: 'Annual', note: 'Reminder 2 months before to schedule.', color: '#8060b8', lastDone: null },
  { id: 'r9', cat: 'Car', label: 'Car wash', freq: 'Every 2 weeks', note: 'Configurable frequency.', color: '#3a8fa8', lastDone: null },
  { id: 'r10', cat: 'Car', label: 'Oil change', freq: 'Every 5,000 miles / 6 months', note: 'Track last service date.', color: '#3a8fa8', lastDone: null },
  { id: 'r11', cat: 'Car', label: 'Annual inspection', freq: 'Yearly', note: 'Reminder 1 month before expiration.', color: '#3a8fa8', lastDone: null },
  { id: 'r12', cat: 'Car', label: 'Tire rotation', freq: 'Every 6 months', note: 'Log when done to track next rotation.', color: '#3a8fa8', lastDone: null },
];

var DEFAULT_BILLS = [
  { id: 'b1', label: 'Utility bills', dueDay: 15, amount: '', paid: false, notes: '' },
  { id: 'b2', label: 'Student loans', dueDay: 1, amount: '', paid: false, notes: '' },
  { id: 'b3', label: 'Car loan', dueDay: 5, amount: '', paid: false, notes: '' },
];

var DEFAULT_CLEANING = [
  { id: 'c1', task: 'Vacuum bedroom', day: 'Monday', done: false },
  { id: 'c2', task: 'Swiffer bathrooms', day: 'Tuesday', done: false },
  { id: 'c3', task: 'Swiffer kitchen', day: 'Wednesday', done: false },
  { id: 'c4', task: 'Laundry', day: 'Thursday', done: false },
  { id: 'c5', task: 'Vacuum living room', day: 'Saturday', done: false },
];

var CAT_COLORS = { Grooming: '#b86880', Pet: '#c4903a', Medical: '#8060b8', Car: '#3a8fa8' };
var DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function RemindersPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var tabState = useState('Reminders');
  var tab = tabState[0]; var setTab = tabState[1];
  var addTodoState = useState('');
  var newTodo = addTodoState[0]; var setNewTodo = addTodoState[1];
  var addBillState = useState(false);
  var showAddBill = addBillState[0]; var setShowAddBill = addBillState[1];

  var reminders = (data && data.reminders) || DEFAULT_REMINDERS;
  var bills = (data && data.bills) || DEFAULT_BILLS;
  var cleaning = (data && data.cleaning) || DEFAULT_CLEANING;
  var todos = (data && data.todos) || [];

  function updateReminders(fn) { updateData(function(p) { return Object.assign({}, p, { reminders: fn(p && p.reminders || DEFAULT_REMINDERS) }); }); }
  function updateBills(fn) { updateData(function(p) { return Object.assign({}, p, { bills: fn(p && p.bills || DEFAULT_BILLS) }); }); }
  function updateCleaning(fn) { updateData(function(p) { return Object.assign({}, p, { cleaning: fn(p && p.cleaning || DEFAULT_CLEANING) }); }); }
  function updateTodos(fn) { updateData(function(p) { return Object.assign({}, p, { todos: fn(p && p.todos || []) }); }); }

  function markDone(id) {
    updateReminders(function(rs) { return rs.map(function(r) { return r.id === id ? Object.assign({}, r, { lastDone: new Date().toISOString() }) : r; }); });
  }

  function toggleBillPaid(id) {
    updateBills(function(bs) { return bs.map(function(b) { return b.id === id ? Object.assign({}, b, { paid: !b.paid }) : b; }); });
  }

  function toggleCleaning(id) {
    updateCleaning(function(cs) { return cs.map(function(c) { return c.id === id ? Object.assign({}, c, { done: !c.done }) : c; }); });
  }

  function addTodo() {
    if (!newTodo.trim()) return;
    var id = 'todo-' + Date.now();
    updateTodos(function(ts) { return ts.concat([{ id: id, text: newTodo.trim(), done: false, createdAt: new Date().toISOString() }]); });
    setNewTodo('');
  }

  function toggleTodo(id) {
    updateTodos(function(ts) { return ts.map(function(t) { return t.id === id ? Object.assign({}, t, { done: !t.done }) : t; }); });
  }

  function deleteTodo(id) {
    updateTodos(function(ts) { return ts.filter(function(t) { return t.id !== id; }); });
  }

  function daysTillDue(dueDay) {
    var now = new Date(); var d = now.getDate();
    if (dueDay >= d) return dueDay - d;
    var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, dueDay);
    return Math.round((nextMonth - now) / 86400000);
  }

  function daysAgo(iso) {
    if (!iso) return null;
    return Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  }

  if (loading) return null;

  var cats = ['Grooming','Pet','Medical','Car'];
  var today = DAYS_OF_WEEK[new Date().getDay()];

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          Reminders
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Bills, grooming, pet care, car maintenance, cleaning, and to-dos</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '20px', border: '1px solid rgba(93,66,51,0.06)' }}>
        {TABS.map(function(t) {
          var active = tab === t;
          return <button key={t} onClick={function(){setTab(t);}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '9px 6px', borderRadius: '8px', border: 'none', background: active ? '#fff' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none' }}>{t}</button>;
        })}
      </div>

      {/* REMINDERS */}
      {tab === 'Reminders' && cats.map(function(cat) {
        var items = reminders.filter(function(r) { return r.cat === cat; });
        var color = CAT_COLORS[cat];
        return (
          <div key={cat}>
            <span style={sectionLabel}>{cat}</span>
            {items.map(function(r) {
              var ago = daysAgo(r.lastDone);
              return (
                <div key={r.id} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: brown, fontFamily: sans }}>{r.label}</p>
                    <p style={{ fontSize: '12px', color: textSoft, marginTop: '2px', fontFamily: sans }}>{r.freq}</p>
                    <p style={{ fontSize: '12px', color: textMuted, marginTop: '2px', fontStyle: 'italic', fontFamily: sans }}>{r.note}</p>
                    {ago !== null && <p style={{ fontSize: '11px', color: accent, marginTop: '4px', fontWeight: 500, fontFamily: sans }}>Last done: {ago === 0 ? 'today' : ago + ' days ago'}</p>}
                  </div>
                  <button onClick={function(){markDone(r.id);}} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap', flexShrink: 0 }}>Mark Done</button>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* BILLS */}
      {tab === 'Bills' && (
        <div>
          <p style={{ fontSize: '14px', color: textSoft, fontStyle: 'italic', fontFamily: sans, marginBottom: '16px' }}>Track upcoming due dates, amounts, and paid status. Reminder is sent 3 days before due date.</p>
          {bills.map(function(b) {
            var days = daysTillDue(b.dueDay);
            var urgent = days <= 3 && !b.paid;
            return (
              <div key={b.id} style={{ ...card, borderLeft: '3px solid ' + (b.paid ? '#5a9870' : urgent ? '#C94040' : accentDark), display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: b.paid ? textMuted : brown, fontFamily: sans, textDecoration: b.paid ? 'line-through' : 'none' }}>{b.label}</p>
                  <p style={{ fontSize: '12px', color: textSoft, marginTop: '2px', fontFamily: sans }}>Due on the {b.dueDay}{b.dueDay === 1 ? 'st' : b.dueDay === 2 ? 'nd' : b.dueDay === 3 ? 'rd' : 'th'} of each month</p>
                  {b.amount && <p style={{ fontSize: '12px', color: accent, marginTop: '2px', fontFamily: sans }}>${b.amount}</p>}
                </div>
                {!b.paid && <p style={{ fontSize: '11px', fontWeight: 700, color: urgent ? '#C94040' : textSoft, fontFamily: sans, flexShrink: 0 }}>Due in {days} day{days !== 1 ? 's' : ''}</p>}
                {b.paid && <p style={{ fontSize: '11px', fontWeight: 700, color: '#5a9870', fontFamily: sans }}>Paid ✓</p>}
                <button onClick={function(){toggleBillPaid(b.id);}} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(93,66,51,0.12)', background: b.paid ? '#e8f5f0' : 'transparent', color: b.paid ? '#2a8f65' : textSoft, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: sans, flexShrink: 0 }}>{b.paid ? 'Undo' : 'Mark Paid'}</button>
              </div>
            );
          })}
          <button onClick={function(){setShowAddBill(!showAddBill);}} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px dashed rgba(93,66,51,0.15)', background: 'transparent', color: textSoft, fontSize: '13px', cursor: 'pointer', fontFamily: sans, marginTop: '6px' }}>+ Add Bill</button>
          {showAddBill && (
            <div style={{ ...card, marginTop: '10px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: brown, marginBottom: '12px', fontFamily: sans }}>Add a bill</p>
              <input placeholder="Bill name" style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '8px' }}
                onKeyDown={function(e) {
                  if (e.key === 'Enter') {
                    var label = e.target.value.trim();
                    if (label) {
                      updateBills(function(bs) { return bs.concat([{ id: 'b-' + Date.now(), label: label, dueDay: 1, amount: '', paid: false, notes: '' }]); });
                      setShowAddBill(false);
                    }
                  }
                }}
              />
              <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>Press Enter to add</p>
            </div>
          )}
        </div>
      )}

      {/* CLEANING */}
      {tab === 'Cleaning' && (
        <div>
          <p style={{ fontSize: '14px', color: textSoft, fontStyle: 'italic', fontFamily: sans, marginBottom: '16px' }}>Weekly cleaning tasks. Check off as you go — they reset each week.</p>
          {cleaning.map(function(c) {
            var isToday = c.day === today;
            return (
              <div key={c.id} onClick={function(){toggleCleaning(c.id);}} style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderLeft: isToday ? '3px solid ' + accentDark : '3px solid transparent', opacity: c.done ? 0.5 : 1 }}>
                <span style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '6px', border: '1.5px solid ' + (c.done ? '#5a9870' : 'rgba(93,66,51,0.18)'), background: c.done ? '#e8f5f0' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2a8f65', fontSize: '12px', fontWeight: 700 }}>{c.done ? '✓' : ''}</span>
                <p style={{ flex: 1, fontSize: '14px', color: brown, textDecoration: c.done ? 'line-through' : 'none', fontFamily: sans }}>{c.task}</p>
                <span style={{ fontSize: '11px', fontWeight: isToday ? 700 : 400, color: isToday ? accentDark : textMuted, fontFamily: sans }}>{c.day}{isToday ? ' · Today' : ''}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* TO-DO */}
      {tab === 'To-Do' && (
        <div>
          <p style={{ fontSize: '14px', color: textSoft, fontStyle: 'italic', fontFamily: sans, marginBottom: '16px' }}>One-off tasks that need to get done. Completed items stay until you delete them.</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              value={newTodo}
              onChange={function(e){setNewTodo(e.target.value);}}
              onKeyDown={function(e){if(e.key==='Enter')addTodo();}}
              placeholder="Add a task and press Enter..."
              style={{ flex: 1, padding: '11px 16px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '12px', fontSize: '13px', fontFamily: sans, color: text, background: '#fff', outline: 'none' }}
            />
            <button onClick={addTodo} style={{ padding: '11px 20px', borderRadius: '12px', border: 'none', background: accentDark, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: sans }}>Add</button>
          </div>

          {todos.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '18px', color: brown, marginBottom: '6px' }}>Nothing here yet</p>
              <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>Add tasks above. Examples: schedule carpet cleaner, book personal trainer, call dentist.</p>
            </div>
          )}

          {todos.filter(function(t){return !t.done;}).map(function(t) {
            return (
              <div key={t.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span onClick={function(){toggleTodo(t.id);}} style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', border: '1.5px solid rgba(93,66,51,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} />
                <p style={{ flex: 1, fontSize: '14px', color: brown, fontFamily: sans }}>{t.text}</p>
                <button onClick={function(){deleteTodo(t.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>
              </div>
            );
          })}

          {todos.filter(function(t){return t.done;}).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <span style={{ ...sectionLabel, marginTop: 0 }}>Completed</span>
              {todos.filter(function(t){return t.done;}).map(function(t) {
                return (
                  <div key={t.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
                    <span onClick={function(){toggleTodo(t.id);}} style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', border: '1.5px solid #5a9870', background: '#e8f5f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2a8f65', fontSize: '12px', fontWeight: 700 }}>✓</span>
                    <p style={{ flex: 1, fontSize: '14px', color: textMuted, textDecoration: 'line-through', fontFamily: sans }}>{t.text}</p>
                    <button onClick={function(){deleteTodo(t.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
