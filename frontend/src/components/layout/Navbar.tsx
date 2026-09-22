'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>DataSage</span>
        </Link>

        <div className={styles.links}>
          <Link href="/properties" className={styles.navLink}>
            Search
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user?.name}</span>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
