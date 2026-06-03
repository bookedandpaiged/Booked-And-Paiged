'use client';
export default function AwardsPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          Awards Campaign
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Award details, submission tasks, and daily checklist</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#10023;</div><h2>Awards Campaign</h2><p>Your 2026 awards campaign tracker with submission timelines, required materials, and daily rhythm tasks will live here.</p></div>
    </div>
  );
}
