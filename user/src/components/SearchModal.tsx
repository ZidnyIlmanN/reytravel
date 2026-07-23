'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAvailableCars, getPublishedArticles, AvailableCar, Article } from '@/lib/supabase';
import styles from './SearchModal.module.css';

interface SearchRoute {
  id: string;
  name: string;
  price: string;
  type: string;
}

const STATIC_ROUTES: SearchRoute[] = [
  { id: 'jkt-crb', name: 'Jakarta ↔ Cirebon', price: 'Rp 250.000', type: 'Travel Reguler' },
  { id: 'jkt-imy', name: 'Jakarta ↔ Indramayu', price: 'Rp 250.000', type: 'Travel Reguler' },
  { id: 'bgr-crb-imy', name: 'Bogor ↔ Cirebon / Indramayu', price: 'Rp 250.000', type: 'Travel Reguler' },
  { id: 'tgr-crb-imy', name: 'Tangerang ↔ Cirebon / Indramayu', price: 'Rp 250.000', type: 'Travel Reguler' },
  { id: 'sutta-crb-imy', name: 'Bandara Soekarno-Hatta (Sutta) ↔ Cirebon / Indramayu', price: 'Rp 250.000', type: 'Travel Reguler' },
  { id: 'dpk-bks-crb-imy', name: 'Depok / Bekasi ↔ Cirebon / Indramayu', price: 'Rp 250.000', type: 'Travel Reguler' },
];

const MOCK_CARS_FALLBACK: AvailableCar[] = [
  { id: 'calya', name: 'Toyota Calya', type: 'City Car (Manual)', capacity: 6, price_per_day: 250000, image_url: '/assets/calya.webp', is_available: true },
  { id: 'avanza', name: 'Toyota Avanza', type: 'MPV (Manual/Matic)', capacity: 6, price_per_day: 250000, image_url: '/assets/avanza.jpg', is_available: true },
  { id: 'innova', name: 'Toyota Innova', type: 'Premium MPV (Matic)', capacity: 6, price_per_day: 250000, image_url: '/assets/innova.jpg', is_available: true },
  { id: 'hiace', name: 'Toyota Hiace Commuter', type: 'Microbus — AC & Karaoke', capacity: 15, price_per_day: 250000, image_url: '/assets/hiace.png', is_available: true },
  { id: 'elf-long', name: 'Elf Long', type: 'Microbus — AC & Karaoke', capacity: 20, price_per_day: 250000, image_url: '/assets/elf.png', is_available: true },
];

interface Props {
  onClose: () => void;
}

type TabType = 'semua' | 'mobil' | 'rute' | 'artikel';

export default function SearchModal({ onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('semua');
  
  const [cars, setCars] = useState<AvailableCar[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cars & articles data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedCars, fetchedArticles] = await Promise.all([
          getAvailableCars(),
          getPublishedArticles(),
        ]);
        setCars(fetchedCars.length > 0 ? fetchedCars : MOCK_CARS_FALLBACK);
        setArticles(fetchedArticles);
      } catch (err) {
        console.warn('Failed to load search data:', err);
        setCars(MOCK_CARS_FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // Focus search input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Filter logic
  const normalizedQuery = query.toLowerCase().trim();
  const hasSearched = normalizedQuery.length > 0;

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(normalizedQuery) ||
    car.type.toLowerCase().includes(normalizedQuery)
  );

  const filteredRoutes = STATIC_ROUTES.filter(route => 
    route.name.toLowerCase().includes(normalizedQuery) ||
    route.type.toLowerCase().includes(normalizedQuery)
  );

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(normalizedQuery) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(normalizedQuery))
  );

  const totalResultsCount = filteredCars.length + filteredRoutes.length + filteredArticles.length;

  const handleResultClick = (targetId: string, type: 'cars' | 'routes' | 'artikel') => {
    onClose();
    if (type === 'artikel') {
      router.push(`/artikel/${targetId}`);
    } else {
      if (pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          const yOffset = -68; // height of Header
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        router.push(`/#${targetId}`);
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header search bar */}
        <div className={styles.header}>
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2.5" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Cari armada, rute tujuan, atau artikel..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            &times;
          </button>
        </div>

        {/* Tab filters (Only show when user is searching) */}
        {hasSearched && (
          <div className={styles.tabs}>
            {(['semua', 'mobil', 'rute', 'artikel'] as const).map(tab => {
              let count = 0;
              if (tab === 'semua') count = totalResultsCount;
              if (tab === 'mobil') count = filteredCars.length;
              if (tab === 'rute') count = filteredRoutes.length;
              if (tab === 'artikel') count = filteredArticles.length;

              return (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className={styles.tabLabel}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span className={styles.tabCount}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Container */}
        <div className={styles.resultsContainer}>
          {!hasSearched ? (
            <div className={styles.placeholderState}>
              <svg viewBox="0 0 24 24" fill="none" width="48" height="48" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--clr-text-muted)' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>Ketik kata kunci untuk mulai mencari...</p>
              <div className={styles.suggestions}>
                <span>Coba cari:</span>
                <button onClick={() => setQuery('Hiace')}>Hiace</button>
                <button onClick={() => setQuery('Jakarta')}>Jakarta</button>
                <button onClick={() => setQuery('Tips')}>Tips</button>
              </div>
            </div>
          ) : loading ? (
            <div className={styles.loadingState}>Memuat data...</div>
          ) : totalResultsCount === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" width="48" height="48" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--clr-error)' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {/* Mobil Tab or Semua */}
              {(activeTab === 'semua' || activeTab === 'mobil') && filteredCars.length > 0 && (
                <div className={styles.resultGroup}>
                  <h4 className={styles.groupTitle}>Armada & Mobil</h4>
                  {filteredCars.map(car => (
                    <div
                      key={car.id}
                      className={styles.resultItem}
                      onClick={() => handleResultClick('cars', 'cars')}
                    >
                      <div className={styles.resultIcon}>🚐</div>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{car.name}</div>
                        <div className={styles.resultMeta}>
                          {car.type} &bull; Kapasitas {car.capacity} orang
                        </div>
                      </div>
                      <div className={styles.resultAction}>Pesan &rarr;</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rute Tab or Semua */}
              {(activeTab === 'semua' || activeTab === 'rute') && filteredRoutes.length > 0 && (
                <div className={styles.resultGroup}>
                  <h4 className={styles.groupTitle}>Rute Perjalanan</h4>
                  {filteredRoutes.map(route => (
                    <div
                      key={route.id}
                      className={styles.resultItem}
                      onClick={() => handleResultClick('routes', 'routes')}
                    >
                      <div className={styles.resultIcon}>📍</div>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{route.name}</div>
                        <div className={styles.resultMeta}>
                          {route.type} &bull; Mulai {route.price}
                        </div>
                      </div>
                      <div className={styles.resultAction}>Detail &rarr;</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Artikel Tab or Semua */}
              {(activeTab === 'semua' || activeTab === 'artikel') && filteredArticles.length > 0 && (
                <div className={styles.resultGroup}>
                  <h4 className={styles.groupTitle}>Artikel & Berita</h4>
                  {filteredArticles.map(article => (
                    <div
                      key={article.id}
                      className={styles.resultItem}
                      onClick={() => handleResultClick(article.slug, 'artikel')}
                    >
                      <div className={styles.resultIcon}>📰</div>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{article.title}</div>
                        <div className={styles.resultMeta}>
                          {article.excerpt || 'Baca artikel selengkapnya'}
                        </div>
                      </div>
                      <div className={styles.resultAction}>Baca &rarr;</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
