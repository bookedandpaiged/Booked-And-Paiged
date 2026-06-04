'use client';
export default function NotificationsPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          Notifications
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Reminders, alerts, and upcoming items</p>
      </div>
      <div className="module-placeholder">
        <div className="icon">&#9888;</div>
        <h2>Notifications</h2>
        <p>Push notifications and reminder alerts will live here. This module is coming soon.</p>
      </div>
    </div>
  );
}
