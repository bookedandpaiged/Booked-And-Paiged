'use client';
export default function CalendarPage() {
  var now = new Date();
  var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = now.getFullYear();
  var month = now.getMonth();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
          Planner
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Your unified calendar across all modules</p>
      </div>
      <div className="card" style={{ padding: '28px 32px', background: '#fff', border: '1px solid rgba(61,46,34,0.07)', borderRadius: '16px', boxShadow: '0 1px 4px rgba(61,46,34,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 400 }}>{MONTHS[month]} {year}</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Month','Week','Day'].map(function(v) {
              return <button key={v} style={{ padding: '7px 16px', borderRadius: '20px', border: v === 'Month' ? 'none' : '1px solid rgba(61,46,34,0.07)', background: v === 'Month' ? '#6B4F3E' : 'transparent', color: v === 'Month' ? '#fff' : 'rgba(61,46,34,0.55)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Satoshi', sans-serif" }}>{v}</button>;
            })}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
          {DAYS.map(function(d) { return <div key={d} style={{ textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: 600, color: 'rgba(61,46,34,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</div>; })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(61,46,34,0.04)', borderRadius: '10px', overflow: 'hidden' }}>
          {Array.from({ length: firstDay }).map(function(_, i) {
            var d = new Date(year, month, -firstDay + i + 1);
            return <div key={'p'+i} style={{ background: '#F6F1EB', padding: '10px', minHeight: '80px', opacity: 0.4 }}><span style={{ fontSize: '12px', color: 'rgba(61,46,34,0.3)' }}>{d.getDate()}</span></div>;
          })}
          {Array.from({ length: daysInMonth }).map(function(_, i) {
            var d = i + 1;
            var isToday = d === now.getDate();
            return <div key={d} style={{ background: isToday ? 'rgba(156,123,101,0.06)' : '#fff', padding: '10px', minHeight: '80px', cursor: 'pointer' }}>
              {isToday ? <span style={{ fontSize: '12px', fontWeight: 600, background: '#6B4F3E', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{d}</span> : <span style={{ fontSize: '12px', color: '#3D2E22' }}>{d}</span>}
            </div>;
          })}
          {Array.from({ length: 42 - firstDay - daysInMonth }).map(function(_, i) {
            return <div key={'n'+i} style={{ background: '#F6F1EB', padding: '10px', minHeight: '80px', opacity: 0.4 }}><span style={{ fontSize: '12px', color: 'rgba(61,46,34,0.3)' }}>{i+1}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
}
