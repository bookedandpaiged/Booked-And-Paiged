'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };

var DEFAULT_HABITS = [
  { id: 'h1', label: 'Drink 4 tumblers of water', icon: '💧', category: 'Wellness' },
  { id: 'h2', label: 'Take all medications', icon: '💊', category: 'Health' },
  { id: 'h3', label: 'Morning affirmations', icon: '✨', category: 'Mindset' },
  { id: 'h4', label: 'GRE study block', icon: '📚', category: 'GRE' },
  { id: 'h5', label: 'Skincare routine', icon: '🌿', category: 'Wellness' },
  { id: 'h6', label: 'No late-night snacking', icon: '🌙', category: 'Wellness' },
];

var DAYS = ['S','M','T','W','T','F','S'];

export default function HabitsPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var addingState = useState(false);
  var adding = addingState[0]; var setAdding = addingState[1];
  var newLabelState = useState('');
  var newLabel = newLabelState[0]; var setNewLabel = newLabelState[1];
  var newCatState = useState('Wellness');
  var newCat = newCatState[0]; var setNewCat = newCatState[1];

  var habits = (data && data.habits) || DEFAULT_HABITS;
  var habitLogs = (data && data.habitLogs) || {};

  var today = new Date().toISOString().slice(0, 10);
  var todayLogs = habitLogs[today] || [];

  // Build last 7 days
  var last7 = [];
  for (var i = 6; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    last7.push(d.toISOString().slice(0, 10));
  }

  function toggle(habitId) {
    var logs = (habitLogs[today] || []).slice();
    var idx = logs.indexOf(habitId);
    if (idx >= 0) logs.splice(idx, 1);
    else logs.push(habitId);
    updateData(function(p) {
      var newLogs = Object.assign({}, p && p.habitLogs || {});
      newLogs[today] = logs;
      return Object.assign({}, p, { habitLogs: newLogs });
    });
  }

  function addHabit() {
    if (!newLabel.trim()) return;
    var newHabit = { id: 'h-' + Date.now(), label: newLabel.trim(), icon: '⭐', category: newCat };
    updateData(function(p) { return Object.assign({}, p, { habits: (p && p.habits || DEFAULT_HABITS).concat([newHabit]) }); });
    setNewLabel('');
    setAdding(false);
  }

  function deleteHabit(id) {
    if (!confirm('Remove this habit?')) return;
    updateData(function(p) { return Object.assign({}, p, { habits: (p && p.habits || DEFAULT_HABITS).filter(function(h){return h.id !== id;}) }); });
  }

  function calcStreak(habitId) {
    var streak = 0;
    for (var i = 0; i < 30; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var key = d.toISOString().slice(0, 10);
      if ((habitLogs[key] || []).includes(habitId)) streak++;
      else break;
    }
    return streak;
  }

  if (loading) return null;

  var doneToday = todayLogs.length;
  var pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Habit Tracker
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Daily habits that keep you grounded</p>
      </div>

      {/* Today summary */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '6px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div style={{ height: '6px', background: '#EDE5DA', borderRadius: '3px', overflow: 'hidden', width: '100%', maxWidth: '300px' }}>
            <div style={{ height: '100%', width: pct + '%', background: accentDark, borderRadius: '3px', transition: 'width 0.4s' }} />
          </div>
          <p style={{ fontSize: '12px', color: textSoft, marginTop: '5px', fontFamily: sans }}>{doneToday} of {habits.length} habits done today</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '40px', fontWeight: 700, color: brown, lineHeight: 1, fontFamily: sans }}>{pct}%</p>
          <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>today</p>
        </div>
      </div>

      {/* Habits list */}
      <div style={{ marginBottom: '16px' }}>
        {habits.map(function(habit) {
          var done = todayLogs.includes(habit.id);
          var streak = calcStreak(habit.id);
          return (
            <div key={habit.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={function(){toggle(habit.id);}}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{habit.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: done ? 400 : 500, color: done ? textMuted : brown, textDecoration: done ? 'line-through' : 'none', fontFamily: sans }}>{habit.label}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px' }}>
                  <span style={{ fontSize: '10px', color: textMuted, fontFamily: sans }}>{habit.category}</span>
                  {streak > 0 && <span style={{ fontSize: '10px', fontWeight: 600, color: accentDark, fontFamily: sans }}>🔥 {streak} day streak</span>}
                </div>
                {/* 7-day history dots */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {last7.map(function(day, i) {
                    var logged = (habitLogs[day] || []).includes(habit.id);
                    var isToday = day === today;
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: logged ? (isToday ? accentDark : accent + '80') : '#EDE5DA', border: isToday ? '2px solid ' + accentDark : 'none' }} />
                        <p style={{ fontSize: '8px', color: textMuted, marginTop: '2px', fontFamily: sans }}>{DAYS[new Date(day + 'T12:00:00').getDay()]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid ' + (done ? accentDark : 'rgba(93,66,51,0.2)'), background: done ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{done ? '✓' : ''}</div>
                <button onClick={function(e){e.stopPropagation();deleteHabit(habit.id);}} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '12px', padding: '2px', fontFamily: sans }}>×</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add habit */}
      {adding ? (
        <div style={card}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '18px', color: brown, marginBottom: '14px' }}>Add Habit</p>
          <input value={newLabel} onChange={function(e){setNewLabel(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter')addHabit();}} placeholder="e.g. Read for 15 minutes" autoFocus style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '10px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['Wellness','Health','Mindset','GRE','Work','Personal'].map(function(cat) {
              var active = newCat === cat;
              return <button key={cat} onClick={function(){setNewCat(cat);}} style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid ' + (active ? accentDark : 'rgba(93,66,51,0.12)'), background: active ? accentDark : 'transparent', color: active ? '#fff' : textSoft, fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>{cat}</button>;
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addHabit} style={{ flex: 1, padding: '11px', borderRadius: '50px', border: 'none', background: accentDark, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>Add Habit</button>
            <button onClick={function(){setAdding(false);}} style={{ padding: '11px 18px', borderRadius: '50px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={function(){setAdding(true);}} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px dashed rgba(93,66,51,0.2)', background: 'transparent', color: textSoft, fontSize: '13px', cursor: 'pointer', fontFamily: sans }}>+ Add Habit</button>
      )}
    </div>
  );
}
