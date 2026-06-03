'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

var NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/calendar', label: 'Planner' },
  { href: '/wellness', label: 'Wellness' },
  { href: '/gre-mba', label: 'Goals' },
  { href: '/awards', label: 'Awards' },
];

var MORE_ITEMS = [
  { href: '/reminders', label: 'Reminders' },
  { href: '/review', label: 'Weekly Review' },
  { href: '/vacation', label: 'Vacation' },
  { href: '/feedback', label: 'Feedback' },
];

var MOBILE_NAV = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/calendar', label: 'Planner', icon: 'planner' },
  { href: '/wellness', label: 'Wellness', icon: 'wellness' },
  { href: '/gre-mba', label: 'Goals', icon: 'goals' },
  { href: '/more', label: 'More', icon: 'more' },
];

function NavIcon(props) {
  var color = props.active ? '#6B4F3E' : 'rgba(61,46,34,0.35)';
  var size = 22;
  var icons = {
    home: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>),
    planner: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>),
    wellness: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>),
    goals: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>),
    more: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>),
  };
  return icons[props.type] || null;
}

export default function Sidebar() {
  var pathname = usePathname();
  var mobileMoreState = useState(false);
  var mobileMoreOpen = mobileMoreState[0];
  var setMobileMoreOpen = mobileMoreState[1];

  function isActive(href) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        {/* Banner */}
        <div style={{ background: '#EDE5DA', padding: '12px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(61,46,34,0.06)' }}>
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '0.22em', color: '#3D2E22' }}>BOOKED </span>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '0.22em', color: '#9C7B65' }}>&amp; </span>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '0.22em', color: '#3D2E22' }}>PAIGED</span>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: '8px', fontWeight: 500, letterSpacing: '0.22em', color: 'rgba(61,46,34,0.4)', marginTop: '2px' }}>YOUR LIFE. INTENTIONALLY MANAGED.</p>
            </div>
          </Link>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid rgba(156,123,101,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: '#9C7B65', fontWeight: 500 }}>BP</span>
          </div>
        </div>
        {/* Nav */}
        <div style={{ background: 'rgba(246,241,235,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(61,46,34,0.06)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 48px', gap: '36px' }}>
            {NAV_ITEMS.map(function(item) {
              var active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} style={{
                  padding: active ? '8px 18px' : '8px 2px',
                  fontSize: '13px', fontWeight: active ? 600 : 400,
                  color: active ? '#3D2E22' : 'rgba(61,46,34,0.5)',
                  textDecoration: 'none', borderRadius: '8px',
                  background: active ? '#FFFFFF' : 'transparent',
                  boxShadow: active ? '0 1px 4px rgba(61,46,34,0.06)' : 'none',
                  fontFamily: "'Satoshi', sans-serif", transition: 'all 0.15s',
                }}>{item.label}</Link>
              );
            })}
            <div style={{ position: 'relative' }} className="topnav-more-wrap">
              <button style={{
                padding: '8px 2px', fontSize: '13px', fontWeight: 400,
                color: 'rgba(61,46,34,0.5)', background: 'none', border: 'none',
                fontFamily: "'Satoshi', sans-serif", cursor: 'pointer',
              }}>More</button>
              <div className="topnav-dropdown">
                {MORE_ITEMS.map(function(item) {
                  return (
                    <Link key={item.href} href={item.href} style={{
                      display: 'block', padding: '10px 16px',
                      fontSize: '12px', fontWeight: 400, color: 'rgba(61,46,34,0.55)',
                      borderRadius: '8px', textDecoration: 'none',
                      fontFamily: "'Satoshi', sans-serif",
                    }}>{item.label}</Link>
                  );
                })}
              </div>
            </div>
            <div style={{ position: 'absolute', right: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', background: 'transparent', color: 'rgba(61,46,34,0.45)', cursor: 'pointer' }} aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </button>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#9C7B65', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>P</div>
            </div>
          </div>
        </div>
      </header>

      <nav className="mobile-nav">
        {MOBILE_NAV.map(function(item) {
          if (item.href === '/more') {
            return (
              <button key="more" className={'mobile-nav-item' + (mobileMoreOpen ? ' active' : '')} onClick={function() { setMobileMoreOpen(!mobileMoreOpen); }}>
                <NavIcon type={item.icon} active={mobileMoreOpen} />
                <span className="mobile-nav-label">{item.label}</span>
              </button>
            );
          }
          return (
            <Link key={item.href} href={item.href} className={'mobile-nav-item' + (isActive(item.href) ? ' active' : '')} onClick={function() { setMobileMoreOpen(false); }}>
              <NavIcon type={item.icon} active={isActive(item.href)} />
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {mobileMoreOpen && (
        <div className="mobile-more-overlay" onClick={function() { setMobileMoreOpen(false); }}>
          <div className="mobile-more-sheet" onClick={function(e) { e.stopPropagation(); }}>
            {[].concat(NAV_ITEMS.slice(3), MORE_ITEMS).map(function(item) {
              return <Link key={item.href} href={item.href} className="mobile-more-item" onClick={function() { setMobileMoreOpen(false); }}>{item.label}</Link>;
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .topnav-more-wrap .topnav-dropdown {
          display: none; position: absolute;
          top: calc(100% + 14px); left: 50%; transform: translateX(-50%);
          background: #FFFFFF; border: 1px solid rgba(61,46,34,0.06);
          border-radius: 14px; box-shadow: 0 8px 32px rgba(61,46,34,0.1);
          min-width: 180px; padding: 6px; z-index: 200;
        }
        .topnav-more-wrap:hover .topnav-dropdown { display: block; }
        .topnav-dropdown-item {
          display: block; padding: 10px 16px;
          font-size: 12px; font-weight: 400; color: rgba(61,46,34,0.55);
          border-radius: 8px; transition: all 0.12s; text-decoration: none;
          font-family: 'Satoshi', sans-serif;
        }
        .topnav-dropdown-item:hover { background: #F6F1EB; color: #3D2E22; }
        .mobile-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0;
          height: 76px; background: #FFFFFF;
          border-top: 1px solid rgba(61,46,34,0.06); z-index: 100;
          padding: 0 12px; padding-bottom: env(safe-area-inset-bottom, 0);
        }
        .mobile-nav-item {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 4px; padding: 8px 4px;
          color: rgba(61,46,34,0.35); text-decoration: none;
          min-width: 56px; background: none; border: none; cursor: pointer;
          font-family: 'Satoshi', sans-serif;
        }
        .mobile-nav-item.active { color: #6B4F3E; }
        .mobile-nav-label { font-size: 10px; font-weight: 500; }
        .mobile-more-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(61,46,34,0.3); z-index: 99;
        }
        .mobile-more-sheet {
          position: absolute; bottom: 76px; left: 12px; right: 12px;
          background: #FFFFFF; border-radius: 16px 16px 0 0;
          padding: 16px; box-shadow: 0 -8px 32px rgba(61,46,34,0.1);
        }
        .mobile-more-item {
          display: block; padding: 14px 16px; font-size: 15px; font-weight: 400;
          color: #3D2E22; border-radius: 10px; text-decoration: none;
        }
        .mobile-more-item:hover { background: #F6F1EB; }
        @media (max-width: 768px) {
          .mobile-nav { display: flex; align-items: center; justify-content: space-around; }
          .mobile-more-overlay { display: block; }
        }
        @media (min-width: 769px) {
          .mobile-more-overlay { display: none !important; }
        }
      `}</style>
      <style jsx global>{`
        @media (max-width: 768px) {
          header { display: none !important; }
        }
      `}</style>
    </>
  );
}
