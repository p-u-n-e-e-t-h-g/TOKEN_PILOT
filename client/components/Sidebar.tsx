import React from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Activity, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>TP</div>
        <span className={styles.logoText}>TokenPilot</span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navItem}>
          <Home className={styles.icon} size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/chat" className={styles.navItem}>
          <MessageSquare className={styles.icon} size={20} />
          <span>Playground</span>
        </Link>
        <Link href="/analytics" className={styles.navItem}>
          <Activity className={styles.icon} size={20} />
          <span>Analytics</span>
        </Link>
      </nav>
      
      <div className={styles.footer}>
        <Link href="/settings" className={styles.navItem}>
          <Settings className={styles.icon} size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
