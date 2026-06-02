'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/calendar', label: 'Planner' },
  { href: '/wellness', label: 'Wellness' },
  { href: '/gre-mba', label: 'Goals' },
  { href: '/awards', label: 'Awards' },
];

const MORE_ITEMS = [
  { href: '/reminders', label: 'Reminders' },
  { href: '/vacation', label: 'Vacation' },
  { href: '/review', label: 'Weekly Review' },
  { href: '/feedback', label: 'Feedback' },
];

const MOBILE_NAV = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/calendar', label: 'Planner', icon: 'planner' },
  { href: '/wellness', label: 'Wellness', icon: 'wellness' },
  { href: '/gre-mba', label: 'Goals', icon: 'goals' },
  { href: '/more', label: 'More', icon: 'more' },
];

function NavIcon({ type, active }) {
  const color = active ? 'var(--accent-dark)' : 'var(--text-muted)';
  const stroke = color;
  const size = 22;
  
  const icons = {
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
    planner: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
      </svg>
    ),
    wellness: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    goals: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    more: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="6" r="1.5"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="12" cy="18" r="1.5"/>
      </svg>
    ),
  };

  return icons[type] || null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Desktop Top Navigation ── */}
      <header className="topnav">
        <div className="topnav-inner">
          <Link href="/" className="topnav-brand">
            <span className="brand-text">BOOKED & PAIGED</span>
          </Link>

          <nav className="topnav-links">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`topnav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="topnav-more">
              <button className="topnav-link topnav-more-btn">More</button>
              <div className="topnav-dropdown">
                {MORE_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} className="topnav-dropdown-item">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="topnav-actions">
            <button className="topnav-icon-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            <div className="topnav-avatar">P</div>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="mobile-nav">
        {MOBILE_NAV.map((item) => {
          if (item.href === '/more') {
            return (
              <button
                key="more"
                className={`mobile-nav-item ${mobileMoreOpen ? 'active' : ''}`}
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              >
                <NavIcon type={item.icon} active={mobileMoreOpen} />
                <span className="mobile-nav-label">{item.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setMobileMoreOpen(false)}
            >
              <NavIcon type={item.icon} active={isActive(item.href)} />
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile More Menu Overlay ── */}
      {mobileMoreOpen && (
        <div className="mobile-more-overlay" onClick={() => setMobileMoreOpen(false)}>
          <div className="mobile-more-sheet" onClick={(e) => e.stopPropagation()}>
            {[...NAV_ITEMS.slice(3), ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-more-item"
                onClick={() => setMobileMoreOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        /* ── Desktop Top Nav ── */
        .topnav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: rgba(246, 241, 235, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
        }

        .topnav-inner {
          max-width: 1320px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
        }

        .topnav-brand {
          text-decoration: none;
        }

        .brand-text {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--text);
        }

        .topnav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .topnav-link {
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--text-soft);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s ease;
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font-body);
        }

        .topnav-link:hover {
          color: var(--text);
          background: var(--accent-glow);
        }

        .topnav-link.active {
          color: var(--text);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }

        .topnav-more {
          position: relative;
        }

        .topnav-more-btn {
          cursor: pointer;
        }

        .topnav-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg);
          min-width: 180px;
          padding: 8px;
          z-index: 200;
        }

        .topnav-more:hover .topnav-dropdown {
          display: block;
        }

        .topnav-dropdown-item {
          display: block;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 400;
          color: var(--text-soft);
          border-radius: 6px;
          transition: all 0.12s;
          text-decoration: none;
        }

        .topnav-dropdown-item:hover {
          background: var(--bg);
          color: var(--text);
        }

        .topnav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topnav-icon-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.15s;
        }

        .topnav-icon-btn:hover {
          background: var(--accent-glow);
          color: var(--text);
        }

        .topnav-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* ── Mobile Nav ── */
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
          padding: 0 12px;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 4px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
          min-width: 56px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .mobile-nav-item.active {
          color: var(--accent-dark);
        }

        .mobile-nav-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* ── Mobile More Overlay ── */
        .mobile-more-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(61, 46, 34, 0.3);
          z-index: 99;
        }

        .mobile-more-sheet {
          position: absolute;
          bottom: var(--mobile-nav-height);
          left: 12px;
          right: 12px;
          background: var(--surface);
          border-radius: var(--radius) var(--radius) 0 0;
          padding: 16px;
          box-shadow: var(--shadow-lg);
        }

        .mobile-more-item {
          display: block;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 400;
          color: var(--text);
          border-radius: var(--radius-sm);
          text-decoration: none;
          transition: background 0.12s;
        }

        .mobile-more-item:hover {
          background: var(--bg);
        }

        @media (max-width: 768px) {
          .topnav {
            display: none;
          }

          .mobile-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }

          .mobile-more-overlay {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-more-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
