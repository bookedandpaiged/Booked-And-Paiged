'use client';

import { useState, useRef } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '24px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(93,66,51,0.02)' };
var cardTitle = { fontFamily: sans, fontSize: '13px', fontWeight: 600, color: brown, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(93,66,51,0.06)' };
var sectionLabel = { fontFamily: sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, marginBottom: '16px', marginTop: '28px' };

var COLOR_SCHEMES = [
  { id: 'warm', label: 'Warm Beige', bg: '#F6F1EB', accent: '#9C7B65', preview: ['#F6F1EB','#9C7B65','#6B4F3E'] },
  { id: 'sage', label: 'Sage & Cream', bg: '#F2F4F0', accent: '#7A9E7E', preview: ['#F2F4F0','#7A9E7E','#4A6B4E'] },
  { id: 'slate', label: 'Slate & Sand', bg: '#F0F1F4', accent: '#7B8EB8', preview: ['#F0F1F4','#7B8EB8','#4A5B8A'] },
  { id: 'rose', label: 'Rose & Ivory', bg: '#FAF0F0', accent: '#C48BA0', preview: ['#FAF0F0','#C48BA0','#8B5A6E'] },
];

var LAYOUTS = [
  { id: 'default', label: 'Default', desc: 'Hero left, collage right, glance below' },
  { id: 'focused', label: 'Focused', desc: 'Full-width agenda, compact hero' },
  { id: 'minimal', label: 'Minimal', desc: 'Affirmation only, agenda front and center' },
];

export default function SettingsPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var fileRef = useRef(null);
  var savedState = useState(false);
  var saved = savedState[0]; var setSaved = savedState[1];

  var settings = (data && data.settings) || {};
  var darkMode = settings.darkMode || false;
  var colorScheme = settings.colorScheme || 'warm';
  var layout = settings.layout || 'default';
  var profilePic = settings.profilePic || null;
  var displayName = settings.displayName || 'Paige';

  function saveSetting(key, val) {
    updateData(function(p) {
      return Object.assign({}, p, { settings: Object.assign({}, p && p.settings || {}, { [key]: val }) });
    });
    setSaved(true);
    setTimeout(function(){setSaved(false);}, 1500);
  }

  function handlePhotoUpload(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) { saveSetting('profilePic', ev.target.result); };
    reader.readAsDataURL(file);
  }

  if (loading) return null;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          Settings
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Profile, appearance, and layout preferences</p>
      </div>

      {saved && (
        <div style={{ background: '#e8f5f0', border: '1px solid rgba(90,152,112,0.2)', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#2a8f65', fontFamily: sans, fontWeight: 500 }}>
          Settings saved ✓
        </div>
      )}

      {/* PROFILE */}
      <p style={sectionLabel}>Profile</p>
      <div style={card}>
        <p style={cardTitle}>Your Profile</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            {profilePic
              ? <img src={profilePic} alt="Profile" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(93,66,51,0.1)' }} />
              : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: accentDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, color: '#fff', fontFamily: sans }}>{displayName.charAt(0)}</div>
            }
            <button onClick={function(){fileRef.current && fileRef.current.click();}} style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderRadius: '50%', background: accentDark, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: brown, fontFamily: sans }}>{displayName}</p>
            <button onClick={function(){fileRef.current && fileRef.current.click();}} style={{ fontSize: '12px', color: accent, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: sans, padding: 0, marginTop: '4px' }}>Change photo</button>
          </div>
        </div>
        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, display: 'block', marginBottom: '6px', fontFamily: sans }}>Display Name</label>
        <input value={displayName} onChange={function(e){saveSetting('displayName', e.target.value);}} style={{ width: '100%', maxWidth: '280px', padding: '9px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none' }} />
      </div>

      {/* APPEARANCE */}
      <p style={sectionLabel}>Appearance</p>

      <div style={card}>
        <p style={cardTitle}>Dark Mode</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>Switch to a darker color palette</p>
            <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans, marginTop: '2px' }}>Coming soon — full dark mode is in progress</p>
          </div>
          <button onClick={function(){saveSetting('darkMode', !darkMode);}} style={{ width: '44px', height: '24px', borderRadius: '12px', background: darkMode ? accentDark : '#E8DDD2', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <span style={{ position: 'absolute', top: '3px', left: darkMode ? '22px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'left 0.2s', display: 'block' }} />
          </button>
        </div>
      </div>

      <div style={card}>
        <p style={cardTitle}>Color Scheme</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {COLOR_SCHEMES.map(function(scheme) {
            var active = colorScheme === scheme.id;
            return (
              <button key={scheme.id} onClick={function(){saveSetting('colorScheme', scheme.id);}} style={{ padding: '14px', borderRadius: '12px', border: '2px solid ' + (active ? accentDark : 'rgba(93,66,51,0.1)'), background: active ? accentDark + '08' : '#FAF7F3', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  {scheme.preview.map(function(c, i) { return <span key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.06)', display: 'inline-block' }} />; })}
                </div>
                <p style={{ fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? accentDark : text, fontFamily: sans }}>{scheme.label}</p>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '11px', color: textMuted, marginTop: '10px', fontFamily: sans, fontStyle: 'italic' }}>Color scheme changes apply on your next visit.</p>
      </div>

      {/* LAYOUT */}
      <p style={sectionLabel}>Layout</p>
      <div style={card}>
        <p style={cardTitle}>Dashboard Layout</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {LAYOUTS.map(function(l) {
            var active = layout === l.id;
            return (
              <button key={l.id} onClick={function(){saveSetting('layout', l.id);}} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', border: '2px solid ' + (active ? accentDark : 'rgba(93,66,51,0.1)'), background: active ? accentDark + '08' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid ' + (active ? accentDark : 'rgba(93,66,51,0.2)'), background: active ? accentDark : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {active && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', display: 'block' }} />}
                </span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? accentDark : text, fontFamily: sans }}>{l.label}</p>
                  <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans, marginTop: '2px' }}>{l.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '11px', color: textMuted, marginTop: '10px', fontFamily: sans, fontStyle: 'italic' }}>Layout changes apply when you reload the dashboard.</p>
      </div>

      {/* DATA */}
      <p style={sectionLabel}>Data & Backup</p>
      <div style={card}>
        <p style={cardTitle}>Export Your Data</p>
        <p style={{ fontSize: '13px', color: textSoft, marginBottom: '14px', fontFamily: sans, lineHeight: 1.6 }}>Download everything in your app as a JSON file. Use this as a backup or to restore your data.</p>
        <button onClick={function() {
          var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'booked-and-paiged-backup-' + new Date().toISOString().slice(0,10) + '.json';
          a.click();
          URL.revokeObjectURL(url);
        }} style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', background: accentDark, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: sans }}>
          Download Backup
        </button>
      </div>
    </div>
  );
}
