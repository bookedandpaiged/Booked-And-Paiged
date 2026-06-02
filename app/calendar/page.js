'use client';

import { useData } from '../components/DataProvider';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STARTER_AFFIRMATIONS = [
  "You are building something real.",
  "Discipline is your love language.",
  "Rest is not retreat.",
  "You have already survived harder.",
  "Own lane. Own race. Own pace.",
  "Go get everything you deserve.",
  "She remembered who she was and the game changed.",
  "You are not behind. You are being prepared.",
];

function getAffirmationsForToday() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const shuffled = [...STARTER_AFFIRMATIONS].sort(
    (a, b) => Math.sin(dayOfYear * 7 + STARTER_AFFIRMATIONS.indexOf(a)) -
              Math.sin(dayOfYear * 7 + STARTER_AFFIRMATIONS.indexOf(b))
  );
  return shuffled.slice(0, 4);
}

export default function CalendarPage() {
  const { data, loading } = useData();
  const today = new Date();
  const affirmations = getAffirmationsForToday();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', fontWeight: 300 }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Greeting + Date */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          color: 'var(--text)',
          marginBottom: '4px',
        }}>
          Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}, Paige
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-dim)',
          fontWeight: 300,
        }}>
          {DAYS[today.getDay()]}, {MONTHS[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </p>
      </div>

      {/* Affirmations */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {affirmations.map((text, i) => (
            <div key={i} style={{
              padding: '16px 20px',
              background: i === 0 ? 'var(--accent-light)' : 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              borderLeft: `3px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontStyle: 'italic',
                color: i === 0 ? 'var(--accent)' : 'var(--text)',
                lineHeight: 1.5,
                fontWeight: 400,
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar placeholder */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        minHeight: '400px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 400,
          }}>
            {MONTHS[today.getMonth()]} {today.getFullYear()}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Month', 'Week', 'Day'].map((v) => (
              <button key={v} style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: v === 'Month' ? 'none' : '1px solid var(--border)',
                background: v === 'Month' ? 'var(--accent-light)' : 'transparent',
                color: v === 'Month' ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: '12px',
                fontWeight: v === 'Month' ? 500 : 400,
                cursor: 'pointer',
              }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar grid header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          marginBottom: '4px',
        }}>
          {DAYS.map((d) => (
            <div key={d} style={{
              textAlign: 'center',
              padding: '8px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          background: 'var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          {(() => {
            const year = today.getFullYear();
            const month = today.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const cells = [];

            for (let i = 0; i < firstDay; i++) {
              const prevDate = new Date(year, month, -firstDay + i + 1);
              cells.push(
                <div key={`prev-${i}`} style={{
                  background: 'var(--surface-warm)',
                  padding: '8px',
                  minHeight: '72px',
                  opacity: 0.4,
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{prevDate.getDate()}</span>
                </div>
              );
            }

            for (let d = 1; d <= daysInMonth; d++) {
              const isToday = d === today.getDate();
              cells.push(
                <div key={d} style={{
                  background: isToday ? 'var(--accent-light)' : 'var(--surface)',
                  padding: '8px',
                  minHeight: '72px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isToday ? 600 : 400,
                    color: isToday ? 'var(--accent)' : 'var(--text)',
                    background: isToday ? 'var(--accent)' : 'none',
                    color: isToday ? '#fff' : 'var(--text)',
                    width: isToday ? '24px' : 'auto',
                    height: isToday ? '24px' : 'auto',
                    borderRadius: '50%',
                    display: isToday ? 'flex' : 'inline',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {d}
                  </span>
                </div>
              );
            }

            const remaining = 42 - cells.length;
            for (let i = 1; i <= remaining; i++) {
              cells.push(
                <div key={`next-${i}`} style={{
                  background: 'var(--surface-warm)',
                  padding: '8px',
                  minHeight: '72px',
                  opacity: 0.4,
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{i}</span>
                </div>
              );
            }

            return cells;
          })()}
        </div>
      </div>
    </div>
  );
}
