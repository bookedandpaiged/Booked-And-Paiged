'use client';
export default function FeedbackPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          App Feedback
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>Notes on what is working, what is not, and what to build next</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#9998;</div><h2>App Feedback</h2><p>Your running list of app improvements, feature requests, and notes for the next iteration will live here.</p></div>
    </div>
  );
}
