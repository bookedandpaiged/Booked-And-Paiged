'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '14px', overflow: 'hidden', marginBottom: '10px' };

var AWARDS_DETAILS = [
  { id: 'stevie-w', color: '#7B6FD4', name: 'Stevie Awards for Women in Business', sub: 'Communications Professional of the Year & Female Employee of the Year', badge: 'Free',
    meta: [['Opens','May 2026'],['Deadline','~Aug-Sept 2026'],['Entry fee','Free (individual)'],['Eligibility','July 1, 2023-present']],
    criteria: 'Professional achievements since July 2023, with emphasis on measurable results, significance relative to peers, and real-world impact.',
    materials: [['Question A - background and history (200 words)','Required'],['Question B - achievements with metrics (250 words)','Required'],['Question C - why unique or significant (250 words)','Required'],['Supporting files - press clippings, work samples, metrics','Recommended']],
    note: 'Lead with AKF (10 placements, 300K+ impressions), HCA (60% engagement increase), USPSTF (15 press releases, 25 interviews), and HRSA (+25% web traffic). Write once for Communications Pro, adapt for Female Employee.',
  },
  { id: 'stevie-g', color: '#7B6FD4', name: 'Stevie Awards - G25 & C27', sub: 'Healthcare Disease Awareness Marketing & Healthcare Communications', badge: 'Verify fee',
    meta: [['Opens','May 2026'],['Deadline','~Aug-Sept 2026'],['Entry fee','Confirm in kit'],['Solo eligibility','Pending email to Stevie']],
    criteria: 'Campaign-based achievement in healthcare communications. Why initiated, planning process, concrete results, significance relative to field.',
    materials: [['Date achievement was initiated','Required'],['Genesis - why initiated, what challenge (250 words)','Required'],['Development - planning and strategy (250 words)','Required'],['Results since July 2023 (250 words)','Required'],['Supporting files - campaign materials, metrics','Recommended']],
    note: 'G25: AKF CKD screening campaign ($5K native ad, 300K+ impressions, 10 placements). C27: AKF + HRSA + USPSTF combined body of work. Confirm individual eligibility via email first.',
  },
  { id: 'marcom', color: '#D4842B', name: 'MarCom Awards', sub: 'Public Relations - Government or Nonprofit', badge: '$125-$195',
    meta: [['Opens','Aug 1, 2026'],['Deadline','Sept 17, 2026'],['Single entry','$125'],['Campaign entry','$195 (3+ pieces)']],
    criteria: 'The work product itself. Budget context is part of scoring - nonprofit work is not compared to global agency production.',
    materials: [['Final work product - press release or campaign materials','Required'],['About project note - 2-3 sentences','Recommended'],['Pro bono entry - Share Our Strength HBCU materials','No extra fee']],
    note: 'Primary: USPSTF press release (Government) or AKF campaign (Nonprofit). Free add-on: Share Our Strength HBCU initiative. About project note: client, challenge, result in 3 plain sentences.',
  },
  { id: 'colorcomm', color: '#2a8f65', name: 'ColorComm Circle Awards', sub: 'Emerging professional recognition - member nomination', badge: 'Verify',
    meta: [['Fee','Verify via membership'],['Deadline','Verify via membership'],['Eligibility','ColorComm members'],['Action','Log in and ask directly']],
    criteria: 'Member nomination. Log into ColorComm account and ask about the 2026 Circle Awards timeline and process.',
    materials: [['Brief professional bio','TBD'],['Professional narrative','TBD'],['Community impact examples','TBD']],
    note: 'Log into ColorComm member account and confirm 2026 timeline, nomination process, and any fee.',
  },
  { id: 'hbcu', color: '#C94040', name: 'HBCU Power Awards', sub: 'Young HBCU alumni achievement', badge: 'Verify',
    meta: [['Fee','Verify at hbcupower.com'],['Deadline','Verify at hbcupower.com'],['Eligibility','HBCU alumni'],['Action','Visit hbcupower.com']],
    criteria: 'Young HBCU alumni achievement. Hampton alumna in public health communications, DEI, and public service is a direct fit.',
    materials: [['Nomination narrative','TBD'],['Supporting materials','TBD']],
    note: 'Go to hbcupower.com and confirm 2026 cycle is open, fee, and materials required.',
  },
];

var TASKS = [
  { id: 'v', color: '#4a7fc1', name: 'Pending Verifications', sub: 'Complete this week', tasks: [
    { id: 'v1', text: 'Email Stevie Awards asking if individual agency employee can self-nominate in G25 and C27' },
    { id: 'v2', text: 'Log into ColorComm and ask about 2026 Circle Awards: timeline, process, fee' },
    { id: 'v3', text: 'Go to hbcupower.com and confirm 2026 cycle is open' },
    { id: 'v4', text: 'Go to stevieawards.com/women and submit form to receive 2026 entry kit' },
  ]},
  { id: 'sw', color: '#7B6FD4', name: 'Stevie - Women in Business', tasks: [
    { id: 'sw1', phase: 'Setup', text: 'Read full entry kit and note exact deadlines' },
    { id: 'sw2', phase: 'Setup', text: 'Spend 30 min reading 3-5 past winners' },
    { id: 'sw3', phase: 'Setup', text: 'Create account on Stevie entry platform' },
    { id: 'sw4', phase: 'Drafting', text: 'Draft Question A (200 words): background and history since July 2023' },
    { id: 'sw5', phase: 'Drafting', text: 'Draft Question B (250 words): achievements with metrics' },
    { id: 'sw6', phase: 'Drafting', text: 'Draft Question C (250 words): why work stands out' },
    { id: 'sw7', phase: 'Drafting', text: 'Gather supporting files: 2-3 media PDFs, HCA metrics, one work sample' },
    { id: 'sw8', phase: 'Drafting', text: 'Adapt Questions A-C for Female Employee of the Year' },
    { id: 'sw9', phase: 'Review', text: 'First proofread: read every answer out loud' },
    { id: 'sw10', phase: 'Review', text: 'Send to Reviewer 1 (trusted colleague)' },
    { id: 'sw11', phase: 'Review', text: 'Incorporate feedback, send to Reviewer 2' },
    { id: 'sw12', phase: 'Submission', text: 'Submit Communications Professional of the Year entry' },
    { id: 'sw13', phase: 'Submission', text: 'Submit Female Employee of the Year entry' },
  ]},
  { id: 'mc', color: '#D4842B', name: 'MarCom Awards', tasks: [
    { id: 'mc1', phase: 'Prep', text: 'Decide primary entry: USPSTF (Government) or AKF (Nonprofit)' },
    { id: 'mc2', phase: 'Prep', text: 'Pull and format primary work product as clean PDF' },
    { id: 'mc3', phase: 'Prep', text: 'Locate Share Our Strength pro bono entry materials' },
    { id: 'mc4', phase: 'Entry', text: 'Register at enter.marcomawards.com' },
    { id: 'mc5', phase: 'Entry', text: 'Write "about project" note (2-3 sentences)' },
    { id: 'mc6', phase: 'Entry', text: 'Enter primary submission and pro bono entry' },
    { id: 'mc7', phase: 'Submission', text: 'Final proofread' },
    { id: 'mc8', phase: 'Submission', text: 'Submit both entries by September 7' },
  ]},
  { id: 'cc', color: '#2a8f65', name: 'ColorComm Circle Awards', tasks: [
    { id: 'cc1', text: 'Confirm 2026 timeline and process via membership' },
    { id: 'cc2', text: 'Note deadline and add to schedule' },
    { id: 'cc3', text: 'Draft professional narrative, bio, and community impact' },
    { id: 'cc4', text: 'Proofread and submit one week before deadline' },
  ]},
  { id: 'hb', color: '#C94040', name: 'HBCU Power Awards', tasks: [
    { id: 'hb1', text: 'Go to hbcupower.com and confirm 2026 cycle details' },
    { id: 'hb2', text: 'Note deadline and add to schedule' },
    { id: 'hb3', text: 'Draft nomination narrative' },
    { id: 'hb4', text: 'Proofread and submit one week before deadline' },
  ]},
];

var DAILY = [
  { id: 'daily', color: '#9C7B65', name: 'Every Day', sub: 'Under 10 minutes', tasks: [
    { id: 'd1', text: 'Check email for Stevie entry kit, ColorComm or HBCU replies' },
    { id: 'd2', text: 'Note any work metric or achievement from today for future submissions' },
  ]},
  { id: 'stevie-d', color: '#7B6FD4', name: 'Stevie Awards', sub: 'During active submission work', tasks: [
    { id: 'ds1', phase: 'During drafting', text: 'Write or revise at least one question answer' },
    { id: 'ds2', phase: 'During drafting', text: 'Read draft out loud before saving' },
    { id: 'ds3', phase: 'During review', text: 'Follow up with reviewer if no response in 5 business days' },
    { id: 'ds4', phase: 'During review', text: 'Act on feedback the same day it arrives' },
  ]},
  { id: 'marcom-d', color: '#D4842B', name: 'MarCom Awards', sub: 'Active August 2026', tasks: [
    { id: 'dm1', text: 'Pull relevant work samples and metrics' },
    { id: 'dm2', text: 'Review "about project" note' },
  ]},
  { id: 'cc-d', color: '#2a8f65', name: 'ColorComm & HBCU', sub: 'Once timeline is confirmed', tasks: [
    { id: 'dc1', text: 'Block submission windows on your calendar' },
    { id: 'dc2', text: 'Draft professional narrative' },
  ]},
  { id: 'weekly', color: '#9C7B65', name: 'Weekly Rhythm', sub: 'Mondays and Fridays', tasks: [
    { id: 'dw1', phase: 'Mondays', text: 'Review task list and identify the one thing that must move forward this week' },
    { id: 'dw2', phase: 'Mondays', text: 'Block at least one 30-minute window for award work' },
    { id: 'dw3', phase: 'Fridays', text: 'Scan all active tasks and reprioritize' },
    { id: 'dw4', phase: 'Fridays', text: 'Check upcoming deadlines for all five awards' },
  ]},
];

function Checkbox({ done, onClick }) {
  return (
    <span onClick={onClick} style={{ width: '18px', height: '18px', minWidth: '18px', borderRadius: '5px', border: '1.5px solid ' + (done ? '#2a8f65' : 'rgba(93,66,51,0.18)'), background: done ? '#e8f5f0' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '11px', color: '#2a8f65', fontWeight: 700, marginTop: '1px' }}>{done ? '✓' : ''}</span>
  );
}

export default function AwardsPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var tabState = useState('details');
  var tab = tabState[0]; var setTab = tabState[1];
  var openState = useState({ 'stevie-w': true });
  var openCards = openState[0]; var setOpenCards = openState[1];

  var checked = (data && data.awardsChecked) || {};

  function toggle(id) {
    var n = Object.assign({}, checked);
    n[id] = !n[id];
    updateData(function(prev) { return Object.assign({}, prev, { awardsChecked: n }); });
  }

  function toggleCard(id) {
    setOpenCards(function(prev) { var n = Object.assign({}, prev); n[id] = !n[id]; return n; });
  }

  var allDaily = DAILY.reduce(function(a, g) { return a.concat(g.tasks); }, []);
  var dailyDone = allDaily.filter(function(t) { return checked[t.id]; }).length;
  var dailyPct = allDaily.length ? Math.round(dailyDone / allDaily.length * 100) : 0;

  if (loading) return null;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          Awards Campaign
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Award details, submission tasks, and daily checklist</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '20px', border: '1px solid rgba(93,66,51,0.06)' }}>
        {[['details','Award Details'],['tasks','Task List'],['daily','Daily Checklist']].map(function(v) {
          var active = tab === v[0];
          return <button key={v[0]} onClick={function(){setTab(v[0]);}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '9px 6px', borderRadius: '8px', border: 'none', background: active ? '#fff' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none' }}>{v[1]}</button>;
        })}
      </div>

      {/* AWARD DETAILS */}
      {tab === 'details' && AWARDS_DETAILS.map(function(award) {
        var open = openCards[award.id];
        return (
          <div key={award.id} style={card}>
            <button onClick={function(){toggleCard(award.id);}} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: award.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: brown, fontFamily: sans }}>{award.name}</p>
                <p style={{ fontSize: '12px', color: textMuted, marginTop: '1px', fontFamily: sans }}>{award.sub}</p>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', background: award.badge === 'Free' ? '#e6f4ec' : award.badge.includes('$') ? '#fef3e2' : '#eaf0fb', color: award.badge === 'Free' ? '#2a7a45' : award.badge.includes('$') ? '#9a5c00' : '#3060a8', fontFamily: sans }}>{award.badge}</span>
              <span style={{ fontSize: '11px', color: textMuted, transform: open ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {open && (
              <div style={{ borderTop: '1px solid rgba(93,66,51,0.06)', padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {award.meta.map(function(m) {
                    return <div key={m[0]} style={{ background: '#FAF7F3', borderRadius: '8px', padding: '10px 12px' }}>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '3px', fontFamily: sans }}>{m[0]}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: brown, fontFamily: sans }}>{m[1]}</p>
                    </div>;
                  })}
                </div>
                <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '8px', fontFamily: sans }}>Judging Criteria</p>
                <div style={{ background: '#FAF7F3', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.7, color: textSoft, marginBottom: '14px', fontFamily: sans }}>{award.criteria}</div>
                <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '8px', fontFamily: sans }}>Required Materials</p>
                <div style={{ marginBottom: '14px' }}>
                  {award.materials.map(function(m, i) {
                    return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', fontSize: '13px', color: text, fontFamily: sans }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: textMuted, flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{m[0]}</span>
                      <span style={{ fontSize: '10px', color: m[1] === 'Required' ? '#C94040' : textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{m[1]}</span>
                    </div>;
                  })}
                </div>
                <div style={{ background: '#f4f2ee', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.7, color: textSoft, fontFamily: sans }}>{award.note}</div>
              </div>
            )}
          </div>
        );
      })}

      {/* TASK LIST */}
      {tab === 'tasks' && TASKS.map(function(group) {
        var done = group.tasks.filter(function(t){return checked[t.id];}).length;
        return (
          <div key={group.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: group.color }} />
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, fontFamily: sans }}>{group.name}</p>
              <span style={{ fontSize: '11px', color: textMuted, marginLeft: 'auto', fontFamily: sans }}>{done}/{group.tasks.length}</span>
            </div>
            {(function() {
              var lastPhase = null;
              return group.tasks.map(function(t) {
                var phaseLabel = null;
                if (t.phase && t.phase !== lastPhase) { lastPhase = t.phase; phaseLabel = t.phase; }
                return (
                  <div key={t.id}>
                    {phaseLabel && <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, padding: '10px 0 6px', fontFamily: sans }}>{phaseLabel}</p>}
                    <div onClick={function(){toggle(t.id);}} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 14px', background: '#fff', border: '1px solid rgba(93,66,51,0.05)', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer' }}>
                      <Checkbox done={checked[t.id]} onClick={function(e){e.stopPropagation();toggle(t.id);}} />
                      <p style={{ fontSize: '13px', color: checked[t.id] ? textMuted : text, textDecoration: checked[t.id] ? 'line-through' : 'none', lineHeight: 1.5, flex: 1, fontFamily: sans }}>{t.text}</p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        );
      })}

      {/* DAILY CHECKLIST */}
      {tab === 'daily' && (
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid rgba(93,66,51,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '5px', background: '#EDE5DA', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: dailyPct + '%', background: '#2a8f65', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: '12px', color: textMuted, whiteSpace: 'nowrap', fontFamily: sans }}>{dailyDone} of {allDaily.length} done</p>
          </div>

          {DAILY.map(function(group) {
            return (
              <div key={group.id} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid rgba(93,66,51,0.04)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: group.color }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: brown, fontFamily: sans }}>{group.name}</p>
                    <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans }}>{group.sub}</p>
                  </div>
                </div>
                <div style={{ padding: '8px 16px' }}>
                  {(function() {
                    var lastPhase = null;
                    return group.tasks.map(function(t) {
                      var phaseLabel = null;
                      if (t.phase && t.phase !== lastPhase) { lastPhase = t.phase; phaseLabel = t.phase; }
                      return (
                        <div key={t.id}>
                          {phaseLabel && <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, padding: '8px 0 4px', fontFamily: sans }}>{phaseLabel}</p>}
                          <div onClick={function(){toggle(t.id);}} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(93,66,51,0.03)', cursor: 'pointer' }}>
                            <Checkbox done={checked[t.id]} onClick={function(e){e.stopPropagation();toggle(t.id);}} />
                            <p style={{ fontSize: '13px', color: checked[t.id] ? textMuted : text, textDecoration: checked[t.id] ? 'line-through' : 'none', lineHeight: 1.5, flex: 1, fontFamily: sans }}>{t.text}</p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
