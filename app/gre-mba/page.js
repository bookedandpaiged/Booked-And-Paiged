'use client';
export default function GreMbaPage() {
  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
          GRE + MBA Goals
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>Daily study blocks, weekly tasks, monthly milestones, and score tracking</p>
      </div>
      <div className="module-placeholder"><div className="icon">&#9672;</div><h2>GRE + MBA Goals</h2><p>Your study schedule, task checklists, GRE score tracker, and MBA milestone progress will live here.</p></div>
    </div>
  );
}
