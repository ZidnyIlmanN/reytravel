'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './Sidebar.module.css';

const NAV = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: '/articles',
    label: 'Artikel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({ isCollapsed, isMobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();

  // When drawer is open (mobile/tablet), always show full expanded view
  const showExpanded = isMobileOpen || !isCollapsed;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed && !isMobileOpen ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
      {/* Brand area — always full height matching app bar */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Reytrans Logo" className={styles.logoImg} />
        </div>

        {/* Brand text — visible when expanded or drawer open */}
        {showExpanded && (
          <div className={styles.brandText}>
            <p className={styles.brandName}>Reytrans</p>
            <p className={styles.brandSub}>Admin Panel</p>
          </div>
        )}

        {/* Close button — only visible in drawer mode (mobile/tablet) */}
        {isMobileOpen && (
          <button className={styles.closeBtn} onClick={onCloseMobile} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {showExpanded && <p className={styles.navLabel}>Menu</p>}
        {NAV.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              title={!showExpanded ? item.label : undefined}
              onClick={onCloseMobile}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {showExpanded && <span className={styles.navText}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Controls and Logout */}
      <div className={styles.bottom}>
        {/* Toggle Collapse Button — Desktop only, not in drawer */}
        {!isMobileOpen && (
          <button onClick={onToggleCollapse} className={styles.toggleBtn} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <span className={styles.navIcon}>
              {isCollapsed ? (
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              )}
            </span>
            {showExpanded && <span className={styles.navText}>Sembunyikan Menu</span>}
          </button>
        )}

        <div className={styles.divider} />

        <button onClick={handleLogout} className={styles.logoutBtn} title={!showExpanded ? 'Keluar' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {showExpanded && <span className={styles.navText}>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
