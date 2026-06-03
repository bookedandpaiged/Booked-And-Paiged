'use client';
export default function GreMbaPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
          GRE + MBA Goals
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Daily study blocks, weekly tasks, monthly milestones, and score tracking</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#9672;</div><h2>GRE + MBA Goals</h2><p>Your study schedule, task checklists, GRE score tracker, and MBA milestone progress will live here.</p></div>
    </div>
  );
}
