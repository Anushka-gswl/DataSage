import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>◆ DataSage</span>
          <p className={styles.tagline}>The AI Behind Better Buys</p>
        </div>
        <div className={styles.links}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Product</h4>
            <Link href="/properties">Search Properties</Link>
            <Link href="/register">Get Started</Link>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Resources</h4>
            <a href="/docs" target="_blank">API Docs</a>
            <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} DataSage. All data is synthetic — for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
