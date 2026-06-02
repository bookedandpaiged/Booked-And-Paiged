'use client';

export default function CalendarPage() {
  const now = new Date();
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div>
      <div className="module-header">
        <h1>Planner</h1>
        <p>Your unified calendar across all modules</p>
      </div>

      <div className="card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400 }}>
            {MONTHS[month]} {year}
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Month','Week','Day'].map((v) => (
              <button key={v} style={{
                padding: '7px 16px',
                borderRadius: '20px',
                border: v === 'Month' ? 'none' : '1px solid var(--border)',
                background: v === 'Month' ? 'var(--accent-dark)' : 'transparent',
                color: v === 'Month' ? '#fff' : 'var(--text-soft)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}>{v}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '4px' }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-soft)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {Array.from({ length: firstDay }).map((_, i) => {
            const d = new Date(year, month, -firstDay + i + 1);
            return <div key={`p${i}`} style={{ background: 'var(--bg)', padding: '10px', minHeight: '80px', opacity: 0.4 }}><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.getDate()}</span></div>;
          })}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const isToday = d === now.getDate();
            return (
              <div key={d} style={{ background: isToday ? 'rgba(156,123,101,0.06)' : 'var(--surface)', padding: '10px', minHeight: '80px', cursor: 'pointer', transition: 'background 0.15s' }}>
                <span style={{
                  fontSize: '12px', fontWeight: isToday ? 600 : 400,
                  ...(isToday ? { background: 'var(--accent-dark)', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } : { color: 'var(--text)' }),
                }}>{d}</span>
              </div>
            );
          })}
          {Array.from({ length: 42 - firstDay - daysInMonth }).map((_, i) => (
            <div key={`n${i}`} style={{ background: 'var(--bg)', padding: '10px', minHeight: '80px', opacity: 0.4 }}><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
