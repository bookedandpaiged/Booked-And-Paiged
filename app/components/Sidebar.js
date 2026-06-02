'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/calendar', label: 'Calendar', icon: '◆' },
  { href: '/wellness', label: 'Wellness', icon: '✦' },
  { href: '/gre-mba', label: 'GRE + MBA', icon: '◈' },
  { href: '/awards', label: 'Awards', icon: '✧' },
  { href: '/reminders', label: 'Reminders', icon: '○' },
  { href: '/vacation', label: 'Vacation', icon: '△' },
];

const BOTTOM_ITEMS = [
  { href: '/review', label: 'Weekly Review' },
  { href: '/feedback', label: 'App Feedback' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-brand">
          <span className="sidebar-label">Personal Dashboard</span>
          <h1 className="sidebar-title">Booked & Paiged</h1>
        </div>

        <div className="sidebar-section">
          <button className="sidebar-new-btn">+ New Event</button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Views</span>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {BOTTOM_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-bottom-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx>{`
        .sidebar-desktop {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar-brand {
          padding: 28px 24px 22px;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .sidebar-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--text);
          line-height: 1.2;
        }

        .sidebar-section {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-new-btn {
          width: 100%;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          border: none;
          background: var(--accent);
          color: #FFFFFF;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .sidebar-new-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 58, 34, 0.2);
        }

        .sidebar-new-btn:active {
          transform: translateY(0);
        }

        .sidebar-nav {
          padding: 16px 12px;
          flex: 1;
        }

        .sidebar-nav-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 12px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          text-align: left;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-dim);
          font-size: 13.5px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          margin-bottom: 1px;
        }

        .sidebar-nav-item:hover {
          background: var(--accent-glow);
          color: var(--text);
        }

        .sidebar-nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          font-weight: 500;
        }

        .nav-icon {
          font-size: 11px;
          width: 18px;
          text-align: center;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .sidebar-nav-item.active .nav-icon {
          opacity: 1;
        }

        .sidebar-bottom {
          padding: 16px 20px;
          border-top: 1px solid var(--border-light);
        }

        .sidebar-bottom-link {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          padding: 6px 4px;
          cursor: pointer;
          transition: color 0.15s ease;
          text-decoration: none;
        }

        .sidebar-bottom-link:hover,
        .sidebar-bottom-link.active {
          color: var(--accent);
        }

        /* Mobile nav */
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--mobile-nav-height);
          background: var(--surface);
          border-top: 1px solid var(--border);
          z-index: 100;
          padding: 0 8px;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        @media (max-width: 768px) {
          .sidebar-desktop {
            display: none;
          }

          .mobile-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 6px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
          min-width: 52px;
        }

        .mobile-nav-item.active {
          color: var(--accent);
        }

        .mobile-nav-icon {
          font-size: 16px;
        }

        .mobile-nav-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
      `}</style>
    </>
  );
}
