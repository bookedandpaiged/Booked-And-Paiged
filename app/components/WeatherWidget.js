'use client';

import { useState, useEffect } from 'react';

var sans = "'Satoshi', -apple-system, sans-serif";
var serif = "'Cormorant Garamond', Georgia, serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65';

var LOCATIONS = [
  { label: 'Home', zip: '20772', lat: 38.8462, lon: -76.7427 },
  { label: "Parents'", zip: '19355', lat: 40.0379, lon: -75.5135 },
];

var WX_CODES = {
  0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Snow',
  75: 'Heavy Snow', 80: 'Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Heavy Snow Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

function wxIcon(code) {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

export default function WeatherWidget() {
  var locState = useState(0);
  var locIdx = locState[0]; var setLocIdx = locState[1];
  var wxState = useState(null);
  var wx = wxState[0]; var setWx = wxState[1];
  var loadingState = useState(true);
  var loading = loadingState[0]; var setLoading = loadingState[1];
  var errorState = useState(false);
  var error = errorState[0]; var setError = errorState[1];

  var loc = LOCATIONS[locIdx];

  useEffect(function() {
    setLoading(true);
    setError(false);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon + '&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=4')
      .then(function(r) { return r.json(); })
      .then(function(d) { setWx(d); setLoading(false); })
      .catch(function() { setError(true); setLoading(false); });
  }, [locIdx]);

  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span style={{ fontFamily: sans, fontSize: '13px', fontWeight: 600, color: brown }}>Weather</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {LOCATIONS.map(function(l, i) {
            return <button key={i} onClick={function(){setLocIdx(i);}} style={{ padding: '3px 10px', borderRadius: '20px', border: '1px solid ' + (locIdx === i ? accent : 'rgba(93,66,51,0.12)'), background: locIdx === i ? accent + '15' : 'transparent', color: locIdx === i ? accent : textMuted, fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: sans }}>{l.label}</button>;
          })}
        </div>
      </div>

      {loading && <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans, textAlign: 'center', padding: '12px 0' }}>Loading weather...</p>}
      {error && <p style={{ fontSize: '12px', color: textMuted, fontFamily: sans, textAlign: 'center', padding: '12px 0' }}>Weather unavailable</p>}

      {!loading && !error && wx && wx.current && (
        <div>
          {/* Current */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '42px', fontWeight: 300, color: brown, fontFamily: sans, lineHeight: 1 }}>{Math.round(wx.current.temperature_2m)}</span>
                <span style={{ fontSize: '18px', color: textSoft, fontFamily: sans }}>°F</span>
              </div>
              <p style={{ fontSize: '12px', color: textSoft, fontFamily: sans, marginTop: '2px' }}>{WX_CODES[wx.current.weathercode] || 'Unknown'}</p>
              <p style={{ fontSize: '11px', color: textMuted, fontFamily: sans, marginTop: '2px' }}>Feels like {Math.round(wx.current.apparent_temperature)}° · {wx.current.windspeed_10m} mph wind</p>
            </div>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>{wxIcon(wx.current.weathercode)}</span>
          </div>

          {/* 4-day forecast */}
          {wx.daily && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', borderTop: '1px solid rgba(93,66,51,0.06)', paddingTop: '12px' }}>
              {wx.daily.time.slice(0, 4).map(function(dateStr, i) {
                var d = new Date(dateStr + 'T12:00:00');
                var label = i === 0 ? 'Today' : days[d.getDay()];
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: sans, marginBottom: '4px' }}>{label}</p>
                    <span style={{ fontSize: '20px' }}>{wxIcon(wx.daily.weathercode[i])}</span>
                    <p style={{ fontSize: '11px', color: brown, fontWeight: 600, fontFamily: sans, marginTop: '3px' }}>{Math.round(wx.daily.temperature_2m_max[i])}°</p>
                    <p style={{ fontSize: '10px', color: textMuted, fontFamily: sans }}>{Math.round(wx.daily.temperature_2m_min[i])}°</p>
                    {wx.daily.precipitation_probability_max[i] > 20 && (
                      <p style={{ fontSize: '10px', color: '#5b7ec4', fontFamily: sans, marginTop: '2px' }}>{wx.daily.precipitation_probability_max[i]}%</p>
                    )}
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
