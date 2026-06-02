'use client';

import { useData } from './DataProvider';

export default function StatusBar() {
  const { saving, lastSaved, error } = useData();

  return (
    <>
      <div className="status-bar">
        {error && <span className="status-error">⚠ {error}</span>}
        {saving && <span className="status-saving">Saving...</span>}
        {!saving && lastSaved && (
          <span className="status-saved">
            Saved {lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        )}
      </div>
      <style jsx>{`
        .status-bar {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 200;
          font-size: 11px;
          font-weight: 400;
        }

        .status-saving {
          color: var(--accent);
          background: var(--accent-light);
          padding: 5px 12px;
          border-radius: 20px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .status-saved {
          color: var(--text-muted);
          background: var(--surface);
          border: 1px solid var(--border-light);
          padding: 5px 12px;
          border-radius: 20px;
        }

        .status-error {
          color: #b44;
          background: #fef0f0;
          padding: 5px 12px;
          border-radius: 20px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .status-bar {
            bottom: calc(var(--mobile-nav-height) + 12px);
            right: 12px;
          }
        }
      `}</style>
    </>
  );
}
