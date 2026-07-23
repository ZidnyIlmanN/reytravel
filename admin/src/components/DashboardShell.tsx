'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import styles from './DashboardShell.module.css';

interface Props {
  userEmail: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userEmail, children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync initial state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={`${styles.shell} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
      {/* Overlay to close mobile sidebar when clicking outside */}
      {isMobileOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main layout container */}
      <div className={styles.main}>
        <header className={styles.header}>
          {/* Hamburger menu button for mobile/tablet */}
          <button
            className={styles.menuBtn}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* User Profile Area */}
          <div className={styles.headerRight}>
            <div className={styles.avatar}>
              {userEmail?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userEmail}>{userEmail}</p>
              <p className={styles.userRole}>Administrator</p>
            </div>
          </div>
        </header>

        {/* Content body wrapper - fluid layout without right margin gaps */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
