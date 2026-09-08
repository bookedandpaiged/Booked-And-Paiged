'use client';

import { useState, useEffect, useRef } from 'react';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';

var PRESETS = [
  { label: 'GRE Block', minutes: 25, color: '#5b7ec4' },
  { label: 'Deep Work', minutes: 50, color: accentDark },
  { label: 'Quick Task', minutes: 15, color: '#5a9870' },
  { label: 'Reading', minutes: 30, color: '#c4903a' },
  { label: 'Custom', minutes: null, color: accent },
];

var AFFIRMATIONS = [
  "Discipline creates freedom.",
  "One block at a time.",
  "Work hard in silence.",
  "She remembered who she was.",
  "Move in silence. Let results speak.",
  "You are not behind. You are being prepared.",
  "Own lane. Own race. Own pace.",
  "Small actions. Big shifts.",
];

export default function FocusPage() {
  var timerState = useState(25 * 60);
  var timeLeft = timerState[0]; var setTimeLeft = timerState[1];
  var runningState = useState(false);
  var running = runningState[0]; var setRunning = runningState[1];
  var totalState = useState(25 * 60);
  var total = totalState[0]; var setTotal = totalState[1];
  var taskState = useState('');
  var task = taskState[0]; var setTask = taskState[1];
  var customState = useState(25);
  var custom = customState[0]; var setCustom = customState[1];
  var selectedState = useState(0);
  var selected = selectedState[0]; var setSelected = selectedState[1];
  var doneState = useState(false);
  var done = doneState[0]; var setDone = doneState[1];
  var affirmState = useState(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  var affirmation = affirmState[0];
  var intervalRef = useRef(null);

  useEffect(function() {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(function() {
        setTimeLeft(function(t) {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return function() { clearInterval(intervalRef.current); };
  }, [running]);

  function selectPreset(i) {
    setSelected(i);
    setRunning(false);
    setDone(false);
    var mins = PRESETS[i].minutes || custom;
    var secs = mins * 60;
    setTimeLeft(secs);
    setTotal(secs);
  }

  function setCustomTime(v) {
    var mins = Math.max(1, Math.min(120, parseInt(v) || 25));
    setCustom(mins);
    if (selected === 4) {
      setTimeLeft(mins * 60);
      setTotal(mins * 60);
    }
  }

  function toggle() {
    if (done) return;
    setRunning(function(r) { return !r; });
  }

  function reset() {
    setRunning(false);
    setDone(false);
    var mins = (PRESETS[selected].minutes || custom);
    var secs = mins * 60;
    setTimeLeft(secs);
    setTotal(secs);
  }

  var mins = Math.floor(timeLeft / 60);
  var secs = timeLeft % 60;
  var pct = total > 0 ? (timeLeft / total) * 100 : 100;
  var radius = 88;
  var circ = 2 * Math.PI * radius;
  var dash = (pct / 100) * circ;
  var color = PRESETS[selected].color;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#F6F1EB' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '28px', color: brown, marginBottom: '6px' }}>Focus Mode</p>
          <p style={{ fontSize: '13px', color: textSoft, fontFamily: sans }}>{affirmation}</p>
        </div>

        {/* Preset selector */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
          {PRESETS.map(function(p, i) {
            var active = selected === i;
            return <button key={i} onClick={function(){selectPreset(i);}} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (active ? p.color : 'rgba(93,66,51,0.12)'), background: active ? p.color + '15' : 'transparent', color: active ? p.color : textSoft, fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: sans }}>{p.label}{p.minutes ? ' · ' + p.minutes + 'm' : ''}</button>;
          })}
        </div>

        {/* Custom time input */}
        {selected === 4 && !running && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <input type="number" min="1" max="120" value={custom} onChange={function(e){setCustomTime(e.target.value);}} style={{ width: '70px', padding: '8px 10px', border: '1px solid rgba(93,66,51,0.15)', borderRadius: '8px', fontSize: '18px', fontWeight: 600, color: brown, textAlign: 'center', background: '#fff', fontFamily: sans, outline: 'none' }} />
            <span style={{ fontSize: '14px', color: textSoft, fontFamily: sans }}>minutes</span>
          </div>
        )}

        {/* Task input */}
        {!running && !done && (
          <div style={{ marginBottom: '24px' }}>
            <input value={task} onChange={function(e){setTask(e.target.value);}} placeholder="What are you focusing on?" style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '12px', fontSize: '14px', fontFamily: sans, color: text, background: '#fff', outline: 'none', textAlign: 'center' }} />
          </div>
        )}

        {/* Timer ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', width: '220px', height: '220px' }}>
            <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="110" cy="110" r={radius} fill="none" stroke="#EDE5DA" strokeWidth="8" />
              <circle cx="110" cy="110" r={radius} fill="none" stroke={done ? '#5a9870' : color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - dash} style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {done ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '36px', marginBottom: '4px' }}>✓</p>
                  <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '18px', color: '#2a8f65' }}>Done!</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: sans, fontSize: '44px', fontWeight: 600, color: brown, lineHeight: 1, letterSpacing: '-0.02em' }}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</p>
                  {task && <p style={{ fontSize: '12px', color: textSoft, marginTop: '6px', fontFamily: sans, maxWidth: '140px', textAlign: 'center', lineHeight: 1.3 }}>{task}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {!done ? (
            <>
              <button onClick={toggle} style={{ padding: '14px 40px', borderRadius: '50px', border: 'none', background: running ? '#EDE5DA' : accentDark, color: running ? textSoft : '#fff', fontFamily: sans, fontSize: '14px', fontWeight: 600, cursor: 'pointer', minWidth: '140px' }}>
                {running ? 'Pause' : timeLeft < total ? 'Resume' : 'Start'}
              </button>
              {timeLeft < total && <button onClick={reset} style={{ padding: '14px 20px', borderRadius: '50px', border: '1px solid rgba(93,66,51,0.12)', background: 'transparent', color: textSoft, fontFamily: sans, fontSize: '13px', cursor: 'pointer' }}>Reset</button>}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: '#2a8f65', marginBottom: '16px' }}>Session complete. Well done.</p>
              <button onClick={reset} style={{ padding: '14px 32px', borderRadius: '50px', border: 'none', background: accentDark, color: '#fff', fontFamily: sans, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Start Another</button>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ fontSize: '12px', color: textMuted, fontFamily: sans, textDecoration: 'none' }}>← Back to dashboard</a>
        </div>
      </div>
    </div>
  );
}
