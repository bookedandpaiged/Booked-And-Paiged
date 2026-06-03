'use client';
export default function WellnessPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          Weekly Wellness
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Workouts, meals, skincare, grocery lists, and meal prep</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#10022;</div><h2>Wellness Module</h2><p>Your weekly wellness plan with workout schedules, meal plans, skincare routines, grocery lists, and Sunday prep instructions will be built next.</p></div>
    </div>
  );
}
