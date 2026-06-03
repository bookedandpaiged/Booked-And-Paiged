'use client';
export default function ReviewPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Weekly Review
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Reflect on your week and set priorities for the next one</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#9671;</div><h2>Weekly Review</h2><p>Your structured weekly check-ins and quarterly deep dives will live here, with a full archive of past reviews.</p></div>
    </div>
  );
}
