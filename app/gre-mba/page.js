'use client';

import { useState, useCallback } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)', marginBottom: '10px' };

var DAYS_DATA = {
  mon: { note: 'Monday - 7:30 to 9AM study window. Quant focus day.', blocks: [
    { time: '7:30 AM', label: 'Vocab - encode', dur: '8 min', steps: [
      { id: 'mon_v1', text: 'Open Magoosh. Learn 2 new vocab words. Read each word, definition, and example sentence out loud.', why: 'Make up a personal sentence for each word. Emotional memory is stronger.' },
      { id: 'mon_v2', text: 'Close the app. Write both words and sentences from memory.', why: 'Writing from memory forces first encoding. Do not look at the app.' },
    ]},
    { time: '7:40 AM', label: 'Quant - concept video', dur: '20 min', steps: [
      { id: 'mon_q1', text: 'Watch assigned Gregmat or Khan Academy quant video. Pause after each key point and explain out loud.', why: 'If you cannot explain it without looking at the screen, rewind.' },
      { id: 'mon_q2', text: 'After the video: say what concept you learned and what GRE problem type would test it.', why: 'Connecting concept to question type builds pattern recognition.' },
    ]},
    { time: '8:00 AM', label: 'Quant - practice problems', dur: '20 min', steps: [
      { id: 'mon_q3', text: 'Do assigned practice problems. Before writing, say: "This asks for X. My approach is Y."', why: 'Saying the approach before writing prevents impulsive wrong answers.' },
      { id: 'mon_q4', text: 'Log every wrong answer in your error log.', why: 'Log: section, type, your answer, correct answer, why you got it wrong.' },
    ]},
    { time: '8:50 AM', label: 'Vocab - recall', dur: '5 min', recall: true, steps: [
      { id: 'mon_v3', text: 'Without opening Magoosh, recall both vocab words from 7:30AM.', why: '80 minutes after encoding is the optimal first recall window.' },
    ]},
  ]},
  tue: { note: 'Tuesday - 7:30 to 9AM study window. Verbal focus day.', blocks: [
    { time: '7:30 AM', label: 'Vocab - encode', dur: '8 min', steps: [
      { id: 'tue_v1', text: 'Open Magoosh. Learn 2 new vocab words. Read out loud.', why: 'Personal sentence for each word.' },
      { id: 'tue_v2', text: 'Close app. Write both words from memory.', why: 'First encoding through recall.' },
    ]},
    { time: '7:40 AM', label: 'Verbal - strategy video', dur: '20 min', steps: [
      { id: 'tue_v3', text: 'Watch assigned Gregmat verbal video. Pause and say how you would apply each strategy.', why: 'Strategies are only useful if you can apply them under pressure.' },
    ]},
    { time: '8:00 AM', label: 'Verbal - practice drills', dur: '20 min', steps: [
      { id: 'tue_v5', text: 'Complete assigned verbal practice. Identify pivot words before looking at answers.', why: 'The pivot word tells you the tone and direction of the blank.' },
      { id: 'tue_v7', text: 'Log every wrong answer in your error log.', why: 'Same format as Monday.' },
    ]},
    { time: '8:50 AM', label: 'Vocab - recall', dur: '5 min', recall: true, steps: [
      { id: 'tue_v8', text: 'Recall today\'s 2 vocab words without opening the app.', why: '80-minute spaced recall window.' },
    ]},
  ]},
  wed: { note: 'Wednesday - 7:30 to 9AM. Quant focus + error patterns.', blocks: [
    { time: '7:30 AM', label: 'Vocab - encode', dur: '8 min', steps: [
      { id: 'wed_v1', text: 'Learn 2 new vocab words. Read out loud with personal sentences.', why: 'Make it specific to your life.' },
    ]},
    { time: '7:40 AM', label: 'Quant - error pattern drill', dur: '25 min', steps: [
      { id: 'wed_q1', text: 'Open error log. For each Monday wrong answer, do one fresh problem of the same type.', why: 'A fresh problem tests understanding, not memory.' },
      { id: 'wed_q2', text: 'Before each problem say: "This is a [type] problem. The approach is [approach]."', why: 'Naming the pattern prevents repeat errors.' },
    ]},
    { time: '8:50 AM', label: 'Vocab - recall', dur: '5 min', recall: true, steps: [
      { id: 'wed_v4', text: 'Recall today\'s words plus Monday\'s words.', why: 'Cumulative recall across the week.' },
    ]},
  ]},
  thu: { note: 'Thursday - 7:30 to 9AM. Verbal focus + voice memo.', blocks: [
    { time: '7:30 AM', label: 'Vocab - encode', dur: '8 min', steps: [
      { id: 'thu_v1', text: 'Learn 2 new vocab words.', why: 'That\'s 8 words this week.' },
    ]},
    { time: '7:40 AM', label: 'Verbal - reading comp focus', dur: '25 min', steps: [
      { id: 'thu_v3', text: 'Complete assigned reading comp passages. Find evidence in the text before selecting any answer.', why: 'Never answer reading comp from memory.' },
    ]},
    { time: '8:45 AM', label: 'Voice memo + recall', dur: '10 min', steps: [
      { id: 'thu_vm', text: 'Record a 60-second voice memo explaining one wrong answer as if teaching someone.', why: 'Teaching forces understanding. You will play this back on Sunday.' },
      { id: 'thu_v5', text: 'Recall all 8 vocab words from the week.', why: 'Full week cumulative recall before the weekend gap.' },
    ]},
  ]},
  fri: { note: 'Friday - Rest day. No GRE study. Let your brain consolidate.', rest: true, msg: 'Your brain consolidates learning during rest periods. Taking Friday off after four consecutive study days is not optional — it is part of the system.' },
  sat: { note: 'Saturday - Light day. Optional review only.', rest: true, msg: 'If you feel like studying, do 10 minutes of vocab flashcards max. Otherwise, rest. Do not start new material on Saturdays.' },
  sun: { note: 'Sunday - Longer session. Section drill or practice test as assigned.', blocks: [
    { time: '10:00 AM', label: 'Section drill or practice test', dur: '60-240 min', steps: [
      { id: 'sun_s1', text: 'Complete your assigned Sunday session per your current phase.', why: 'Phase 1-2: 60-min section drill. Phase 3-4: full-length practice test.' },
    ]},
    { time: 'After drill', label: 'Error log review', dur: '15 min', steps: [
      { id: 'sun_s2', text: 'Review error log. Name your top 2 error patterns for next week.', why: 'Sets up Monday with a specific focus rather than a general one.' },
      { id: 'sun_s3', text: 'Play back Thursday\'s voice memo. Does your explanation still make sense?', why: 'If not, re-record a corrected version.' },
    ]},
  ]},
};

var WG = [
  { id: 'wg1', text: 'Complete all four weekday study sessions (Mon-Thu, 7:30-8:55AM)' },
  { id: 'wg2', text: 'Complete Sunday longer session - section drill or practice test' },
  { id: 'wg3', text: 'Record Thursday voice memo explaining one wrong answer' },
  { id: 'wg4', text: 'Complete Sunday error log review - name top 2 patterns' },
  { id: 'wg5', text: 'Accumulate 8 new vocab words this week with spaced recall' },
];
var WM = [
  { id: 'wm1', text: 'Add 3+ entries to Application Evidence Bank (Google Drive)' },
  { id: 'wm2', text: 'Complete one rotating MBA school research task' },
  { id: 'wm3', text: 'Spend 20 min on the next funding source - read eligibility, note deadline' },
];
var MG = [
  { id: 'mg1', text: 'Download Magoosh GRE Vocabulary app', due: 'May 2, 2026' },
  { id: 'mg2', text: 'Take ETS PowerPrep Practice Test 1 - full length, timed', due: 'May 3-18, 2026' },
  { id: 'mg3', text: 'Complete gap analysis - points needed per section', due: 'By May 11, 2026' },
  { id: 'mg4', text: 'Take ETS PowerPrep Practice Test 2', due: 'Week of Jun 23, 2026' },
  { id: 'mg5', text: 'Purchase and take PowerPrep Plus Test 3 ($40)', due: 'Week of Jul 7, 2026' },
  { id: 'mg6', text: 'Purchase and take PowerPrep Plus Test 4 ($40)', due: 'Week of Jul 21, 2026' },
  { id: 'mg7', text: 'Register for GRE at ets.org - book August 8', due: 'By July 1, 2026' },
  { id: 'mg8', text: 'Book dog sitter for morning of August 8', due: 'By mid-July, 2026' },
  { id: 'mg9', text: 'Sit official GRE exam', due: 'August 8, 2026' },
];
var MM = [
  { id: 'mm1', text: 'Create Application Evidence Bank - add first 3 bullets', due: 'This week' },
  { id: 'mm2', text: 'Build deadline spreadsheet for all 10 schools', due: 'May-Jun 2026' },
  { id: 'mm3', text: 'Register for one MBA info session or diversity event', due: 'May-Aug 2026' },
  { id: 'mm4', text: 'Build one-page school dossier for Wharton', due: 'Jun-Jul 2026' },
  { id: 'mm5', text: 'Build dossiers for remaining 9 programs (one per week)', due: 'Jun-Sep 2026' },
  { id: 'mm6', text: 'Attend one PRSA, ColorComm, or NBMBAA event', due: '2026' },
  { id: 'mm7', text: 'Submit MBA applications - target Round 1', due: 'Fall 2027' },
];
var MF = [
  { id: 'mf1', text: 'Check ETS GRE fee reduction eligibility', due: 'Before July 1' },
  { id: 'mf2', text: 'Register on Forte Foundation as MBA-bound candidate', due: 'May-Jun 2026' },
  { id: 'mf3', text: 'Read Consortium overview and note 2027 timeline', due: 'Jun 2026' },
  { id: 'mf4', text: 'Find AKA EAF graduate scholarship window', due: 'Jun 2026' },
  { id: 'mf5', text: 'Find NBMBAA scholarship deadline and conference date', due: 'Jun-Jul 2026' },
  { id: 'mf6', text: 'Search UNCF for graduate fellowships', due: 'Jul 2026' },
  { id: 'mf7', text: 'Research Robert Toigo Foundation fellowship', due: 'Jul-Aug 2026' },
  { id: 'mf8', text: 'Attend MBA diversity weekend or virtual event', due: 'Fall 2026' },
  { id: 'mf9', text: 'Discuss tuition assistance with manager', due: '2027' },
];

var DAY_KEYS = ['sun','mon','tue','wed','thu','fri','sat'];
var DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function prog(items, checked) { var d = items.filter(function(i){return checked[i.id];}).length; return { d: d, t: items.length, p: items.length ? Math.round(d / items.length * 100) : 0 }; }

export default function GreMbaPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var viewState = useState('daily');
  var view = viewState[0]; var setView = viewState[1];
  var dayState = useState(DAY_KEYS[new Date().getDay()]);
  var day = dayState[0]; var setDay = dayState[1];

  var checked = (data && data.greChecked) || {};
  var scores = (data && data.greScores) || {};

  function toggle(id) {
    var newChecked = Object.assign({}, checked);
    newChecked[id] = !newChecked[id];
    updateData(function(prev) { return Object.assign({}, prev, { greChecked: newChecked }); });
  }

  function saveScore(key, val) {
    var v = parseInt(val);
    if (v >= 130 && v <= 170) {
      var newScores = Object.assign({}, scores);
      newScores[key] = v;
      updateData(function(prev) { return Object.assign({}, prev, { greScores: newScores }); });
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><p style={{ color: textSoft, fontFamily: serif, fontStyle: 'italic' }}>Loading...</p></div>;

  var dayData = DAYS_DATA[day];
  var allDaySteps = dayData && dayData.blocks ? dayData.blocks.reduce(function(a, b) { return a.concat(b.steps); }, []) : [];
  var doneToday = allDaySteps.filter(function(s) { return checked[s.id]; }).length;
  var allWeekly = WG.concat(WM);
  var weekProg = prog(allWeekly, checked);
  var vScore = scores.v || 0;
  var qScore = scores.q || 0;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          GRE + MBA Goals
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Daily study blocks, weekly tasks, monthly milestones</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[[doneToday + '', 'Done today'], ['0', 'Day streak'], [allDaySteps.length + '', 'Steps today'], [weekProg.p + '%', 'Week done']].map(function(s, i) {
          return <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(93,66,51,0.06)' }}>
            <p style={{ fontSize: '26px', fontWeight: 600, color: i === 1 ? accentDark : brown, lineHeight: 1, fontFamily: sans }}>{s[0]}</p>
            <p style={{ fontSize: '11px', color: textMuted, marginTop: '4px', fontFamily: sans }}>{s[1]}</p>
          </div>;
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '20px', border: '1px solid rgba(93,66,51,0.06)' }}>
        {['daily','weekly','monthly'].map(function(v) {
          var active = view === v;
          return <button key={v} onClick={function(){setView(v);}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '9px 6px', borderRadius: '8px', border: 'none', background: active ? '#fff' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none', textTransform: 'capitalize' }}>{v}</button>;
        })}
      </div>

      {/* DAILY VIEW */}
      {view === 'daily' && (
        <div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {DAY_KEYS.map(function(d, i) {
              var active = day === d;
              return <button key={d} onClick={function(){setDay(d);}} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '20px', border: '1px solid ' + (active ? accentDark : 'rgba(93,66,51,0.1)'), background: active ? accentDark : '#fff', color: active ? '#fff' : text, cursor: 'pointer', fontFamily: sans }}>{DAY_LABELS[i]}</button>;
            })}
          </div>
          <p style={{ fontSize: '12px', color: textSoft, fontStyle: 'italic', marginBottom: '16px', fontFamily: sans }}>{dayData.note}</p>

          {dayData.rest ? (
            <div style={{ ...card, background: '#FAF7F3', textAlign: 'center', padding: '40px 24px' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: brown, marginBottom: '10px' }}>{day === 'fri' ? 'Rest Day' : 'Light Day'}</p>
              <p style={{ fontSize: '14px', color: textSoft, lineHeight: 1.6, maxWidth: '440px', margin: '0 auto', fontFamily: sans }}>{dayData.msg}</p>
            </div>
          ) : (
            <div>
              {dayData.blocks.map(function(block, bi) {
                var blockDone = block.steps.filter(function(s){return checked[s.id];}).length;
                return (
                  <div key={bi} style={{ ...card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: '#FAF7F3', borderBottom: '1px solid rgba(93,66,51,0.04)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: accentDark, minWidth: '70px', fontFamily: sans }}>{block.time}</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: brown, fontFamily: sans }}>{block.label}</span>
                      {block.recall && <span style={{ fontSize: '10px', fontWeight: 600, background: '#FDF6EC', color: '#A07850', padding: '2px 8px', borderRadius: '20px' }}>Recall</span>}
                      <span style={{ fontSize: '11px', color: textMuted, marginLeft: 'auto', fontFamily: sans }}>{block.dur} · {blockDone}/{block.steps.length}</span>
                    </div>
                    {block.steps.map(function(step) {
                      var done = checked[step.id];
                      return (
                        <div key={step.id} onClick={function(){toggle(step.id);}} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderBottom: '1px solid rgba(93,66,51,0.03)', cursor: 'pointer', opacity: done ? 0.45 : 1 }}>
                          <span style={{ width: '17px', height: '17px', minWidth: '17px', borderRadius: '4px', border: '1.5px solid ' + (done ? accentDark : 'rgba(93,66,51,0.2)'), background: done ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{done ? '✓' : ''}</span>
                          <div>
                            <p style={{ fontSize: '14px', color: brown, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.45, fontFamily: sans }}>{step.text}</p>
                            {step.why && <p style={{ fontSize: '12px', color: textSoft, marginTop: '5px', lineHeight: 1.45, fontStyle: 'italic', fontFamily: sans }}>{step.why}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WEEKLY VIEW */}
      {view === 'weekly' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, fontFamily: sans }}>GRE - This Week</p>
              <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans }}>{prog(WG, checked).d}/{WG.length}</p>
            </div>
            {WG.map(function(item) {
              var done = checked[item.id];
              return (
                <div key={item.id} onClick={function(){toggle(item.id);}} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', opacity: done ? 0.45 : 1 }}>
                  <span style={{ width: '17px', height: '17px', minWidth: '17px', borderRadius: '4px', border: '1.5px solid ' + (done ? accentDark : 'rgba(93,66,51,0.2)'), background: done ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{done ? '✓' : ''}</span>
                  <p style={{ fontSize: '14px', color: brown, textDecoration: done ? 'line-through' : 'none', fontFamily: sans }}>{item.text}</p>
                </div>
              );
            })}
          </div>
          <div style={{ height: '1px', background: 'rgba(93,66,51,0.06)', margin: '20px 0' }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, fontFamily: sans }}>MBA + Profile - This Week</p>
              <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans }}>{prog(WM, checked).d}/{WM.length}</p>
            </div>
            {WM.map(function(item) {
              var done = checked[item.id];
              return (
                <div key={item.id} onClick={function(){toggle(item.id);}} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', opacity: done ? 0.45 : 1 }}>
                  <span style={{ width: '17px', height: '17px', minWidth: '17px', borderRadius: '4px', border: '1.5px solid ' + (done ? accentDark : 'rgba(93,66,51,0.2)'), background: done ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{done ? '✓' : ''}</span>
                  <p style={{ fontSize: '14px', color: brown, textDecoration: done ? 'line-through' : 'none', fontFamily: sans }}>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTHLY VIEW */}
      {view === 'monthly' && (
        <div>
          {/* Score tracker */}
          <div style={card}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, marginBottom: '14px', fontFamily: sans }}>Score Tracker</p>
            {[['GRE Verbal', 'v', vScore], ['GRE Quant', 'q', qScore]].map(function(item) {
              var pct = item[2] ? Math.min(100, Math.round((item[2] - 130) / 30 * 100)) : 0;
              return (
                <div key={item[0]} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: brown, fontFamily: sans }}>{item[0]}</span>
                    <span style={{ fontSize: '12px', color: textMuted, fontFamily: sans }}>Target: 160+</span>
                  </div>
                  <div style={{ height: '6px', background: '#EDE5DA', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pct + '%', background: accentDark, borderRadius: '3px', transition: 'width 0.4s' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: textMuted, marginTop: '4px', fontFamily: sans }}>{item[2] ? 'Current: ' + item[2] + ' (' + pct + '% to goal)' : 'No score entered yet'}</p>
                </div>
              );
            })}
            {(vScore && qScore) ? (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: brown, fontFamily: sans }}>Composite</span>
                  <span style={{ fontSize: '12px', color: textMuted, fontFamily: sans }}>Target: 320+</span>
                </div>
                <div style={{ height: '6px', background: '#EDE5DA', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: Math.min(100, Math.round(((vScore + qScore - 260) / 60) * 100)) + '%', background: accentDark, borderRadius: '3px' }} />
                </div>
                <p style={{ fontSize: '11px', color: textMuted, marginTop: '4px', fontFamily: sans }}>Composite: {vScore + qScore} · Test date: Aug 8, 2026</p>
              </div>
            ) : null}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: textSoft, display: 'block', marginBottom: '5px', fontFamily: sans }}>Verbal (130-170)</label>
                <input type="number" min="130" max="170" defaultValue={vScore || ''} placeholder="e.g. 152" onChange={function(e){saveScore('v', e.target.value);}} style={{ width: '100%', padding: '8px 12px', fontSize: '14px', border: '1px solid rgba(93,66,51,0.15)', borderRadius: '8px', background: '#FAF7F3', color: brown, fontFamily: sans, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: textSoft, display: 'block', marginBottom: '5px', fontFamily: sans }}>Quant (130-170)</label>
                <input type="number" min="130" max="170" defaultValue={qScore || ''} placeholder="e.g. 148" onChange={function(e){saveScore('q', e.target.value);}} style={{ width: '100%', padding: '8px 12px', fontSize: '14px', border: '1px solid rgba(93,66,51,0.15)', borderRadius: '8px', background: '#FAF7F3', color: brown, fontFamily: sans, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Milestones */}
          {[['GRE Milestones', MG], ['MBA + Profile Milestones', MM], ['Funding Milestones', MF]].map(function(section) {
            var p = prog(section[1], checked);
            return (
              <div key={section[0]} style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, fontFamily: sans }}>{section[0]}</p>
                  <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans }}>{p.d}/{p.t}</p>
                </div>
                {section[1].map(function(item) {
                  var done = checked[item.id];
                  return (
                    <div key={item.id} onClick={function(){toggle(item.id);}} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', opacity: done ? 0.45 : 1 }}>
                      <span style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', border: '1.5px solid ' + (done ? accentDark : 'rgba(93,66,51,0.2)'), background: done ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>{done ? '✓' : ''}</span>
                      <div>
                        <p style={{ fontSize: '14px', color: brown, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.45, fontFamily: sans }}>{item.text}</p>
                        {item.due && <p style={{ fontSize: '11px', color: textMuted, marginTop: '4px', fontFamily: sans }}>{item.due}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
