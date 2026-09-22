'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatINR, formatDate } from '@/lib/formatters';
import styles from './page.module.css';

interface SavedItem {
  id: string;
  property_id: string;
  created_at: string;
}

interface SearchItem {
  id: string;
  query_params: Record<string, unknown>;
  result_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [savedProperties, setSavedProperties] = useState<SavedItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        api.get<{ data: SavedItem[] }>('/saved-properties').catch(() => ({ data: [] })),
        api.get<{ data: SearchItem[] }>('/search-history').catch(() => ({ data: [] })),
      ]).then(([saved, history]) => {
        setSavedProperties(saved.data);
        setSearchHistory(history.data);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={`skeleton ${styles.skeleton}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className={styles.subtitle}>Your property intelligence dashboard</p>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💾</span>
            <div>
              <span className={styles.statNumber}>{savedProperties.length}</span>
              <span className={styles.statLabel}>Saved Properties</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔍</span>
            <div>
              <span className={styles.statNumber}>{searchHistory.length}</span>
              <span className={styles.statLabel}>Recent Searches</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🤖</span>
            <div>
              <span className={styles.statNumber}>Active</span>
              <span className={styles.statLabel}>AI Valuation</span>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Saved Properties */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Saved Properties</h2>
            {savedProperties.length === 0 ? (
              <div className={styles.empty}>
                <p>No saved properties yet. Browse and save properties you&apos;re interested in.</p>
                <a href="/properties" className="btn btn-primary btn-sm">
                  Browse Properties
                </a>
              </div>
            ) : (
              <div className={styles.list}>
                {savedProperties.map((item) => (
                  <a
                    key={item.id}
                    href={`/properties/${item.property_id}`}
                    className={styles.listItem}
                  >
                    <span className={styles.listIcon}>🏠</span>
                    <div>
                      <span className={styles.listTitle}>Property</span>
                      <span className={styles.listMeta}>Saved {formatDate(item.created_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* Search History */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Searches</h2>
            {searchHistory.length === 0 ? (
              <div className={styles.empty}>
                <p>No search history yet. Start exploring Delhi-NCR properties.</p>
                <a href="/properties" className="btn btn-primary btn-sm">
                  Start Searching
                </a>
              </div>
            ) : (
              <div className={styles.list}>
                {searchHistory.map((item) => (
                  <div key={item.id} className={styles.listItem}>
                    <span className={styles.listIcon}>🔍</span>
                    <div>
                      <span className={styles.listTitle}>
                        {item.result_count} results
                      </span>
                      <span className={styles.listMeta}>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Quick actions */}
        <div className={styles.actions}>
          <a href="/properties" className="btn btn-primary">
            🔍 Search Properties
          </a>
          <a href="/properties" className="btn btn-secondary">
            📊 Get AI Valuations
          </a>
        </div>
      </div>
    </div>
  );
}
