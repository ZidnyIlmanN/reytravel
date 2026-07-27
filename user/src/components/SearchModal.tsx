'use client';
import { useState, useEffect } from 'react';
import { AvailableCar, Article } from '@/lib/supabase';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cars: AvailableCar[];
  articles: Article[];
};

const MOCK_ROUTES = [
  { id: 'r1', name: 'Jakarta ↔ Cirebon', desc: 'Door-to-Door • Rp 250.000' },
  { id: 'r2', name: 'Jakarta ↔ Indramayu', desc: 'Door-to-Door • Rp 250.000' },
  { id: 'r3', name: 'Bogor ↔ Cirebon / Indramayu', desc: 'Door-to-Door • Rp 250.000' },
  { id: 'r4', name: 'Tangerang ↔ Cirebon / Indramayu', desc: 'Door-to-Door • Rp 250.000' },
  { id: 'r5', name: 'Bandara Soekarno-Hatta (Sutta) ↔ Cirebon / Indramayu', desc: 'Door-to-Door • Rp 250.000' },
  { id: 'r6', name: 'Depok / Bekasi ↔ Cirebon / Indramayu', desc: 'Door-to-Door • Rp 250.000' },
];

export default function SearchModal({ isOpen, onClose, cars, articles }: SearchModalProps) {
  const [filter, setFilter] = useState('Semua');
  const [query, setQuery] = useState('');
  
  // States for smooth mount/unmount animation
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the element is in DOM before triggering transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
      setQuery('');
      setFilter('Semua');
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => setShouldRender(false), 300); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // tell parent to actually close after animation
  };

  // Search Logic
  const filteredCars = cars.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.type.toLowerCase().includes(query.toLowerCase()));
  const filteredRoutes = MOCK_ROUTES.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  const totalResults = filteredCars.length + filteredRoutes.length + filteredArticles.length;

  const isInitialState = filter === 'Semua' && query === '';
  
  const displayCars = isInitialState ? filteredCars.slice(0, 3) : filteredCars;
  const displayRoutes = isInitialState ? filteredRoutes.slice(0, 3) : filteredRoutes;
  const displayArticles = isInitialState ? filteredArticles.slice(0, 3) : filteredArticles;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-12 px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden transform transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        
        {/* Header / Search Input */}
        <div className="flex items-center px-6 py-4 border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-[24px]">search</span>
          <input 
            type="text" 
            placeholder="Cari armada, rute tujuan, atau artikel..." 
            className="flex-1 bg-transparent border-none outline-none px-4 text-base md:text-lg text-on-surface placeholder:text-outline-variant font-medium"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-surface-container transition-colors ml-2 text-outline shrink-0">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 px-6 py-4 overflow-x-auto scrollbar-hide border-b border-outline-variant/20 bg-surface-bright">
          <button 
            onClick={() => setFilter('Semua')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${filter === 'Semua' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Semua <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'Semua' ? 'bg-white/20 text-white' : 'bg-white text-on-surface'}`}>{totalResults}</span>
          </button>
          <button 
            onClick={() => setFilter('Mobil')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 border ${filter === 'Mobil' ? 'bg-primary border-primary text-white' : 'bg-transparent border-outline-variant/50 text-on-surface-variant hover:bg-surface-container'}`}
          >
            Mobil <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'Mobil' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'}`}>{filteredCars.length}</span>
          </button>
          <button 
            onClick={() => setFilter('Rute')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 border ${filter === 'Rute' ? 'bg-primary border-primary text-white' : 'bg-transparent border-outline-variant/50 text-on-surface-variant hover:bg-surface-container'}`}
          >
            Rute <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'Rute' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'}`}>{filteredRoutes.length}</span>
          </button>
          <button 
            onClick={() => setFilter('Artikel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 border ${filter === 'Artikel' ? 'bg-primary border-primary text-white' : 'bg-transparent border-outline-variant/50 text-on-surface-variant hover:bg-surface-container'}`}
          >
            Artikel <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'Artikel' ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface'}`}>{filteredArticles.length}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {isInitialState && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-fixed/50 text-primary-container rounded-lg text-xs font-bold w-fit mb-2">
              <span className="material-symbols-outlined text-[14px]">star</span> Rekomendasi Terpopuler untuk Anda
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 text-outline-variant/50">search_off</span>
              <p>Tidak ada hasil untuk "{query}"</p>
            </div>
          )}

          {(filter === 'Semua' || filter === 'Mobil') && displayCars.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-outline">Armada & Mobil</h4>
              <div className="space-y-2">
                {displayCars.map((car, idx) => (
                  <div key={car.id || idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group" onClick={() => {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      handleClose();
                    }}>
                    <div className="w-12 h-12 rounded-xl border border-outline-variant/30 flex items-center justify-center shrink-0 bg-white group-hover:border-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">directions_car</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface text-sm md:text-base">{car.name}</h5>
                      <p className="text-xs md:text-sm text-on-surface-variant">{car.type} • Kapasitas {car.capacity} orang</p>
                    </div>
                  </div>
                ))}
              </div>
              {isInitialState && filteredCars.length > 3 && (
                <div className="pt-2 flex justify-center">
                  <button onClick={() => setFilter('Mobil')} className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors">
                    Tampilkan Armada Lainnya ({filteredCars.length - 3} lagi) <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {(filter === 'Semua' || filter === 'Rute') && displayRoutes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-outline">Rute Perjalanan</h4>
              <div className="space-y-2">
                {displayRoutes.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group" onClick={() => {
                    document.getElementById('route')?.scrollIntoView({ behavior: 'smooth' });
                    handleClose();
                  }}>
                    <div className="w-12 h-12 rounded-xl border border-outline-variant/30 flex items-center justify-center shrink-0 bg-white group-hover:border-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">route</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface text-sm md:text-base">{r.name}</h5>
                      <p className="text-xs md:text-sm text-on-surface-variant">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
               {isInitialState && filteredRoutes.length > 3 && (
                <div className="pt-2 flex justify-center">
                  <button onClick={() => setFilter('Rute')} className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors">
                    Tampilkan Rute Lainnya ({filteredRoutes.length - 3} lagi) <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {(filter === 'Semua' || filter === 'Artikel') && displayArticles.length > 0 && (
             <div className="space-y-4">
             <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-outline">Artikel Perjalanan</h4>
             <div className="space-y-2">
               {displayArticles.map((a) => (
                 <div key={a.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group" onClick={handleClose}>
                   <div className="w-14 h-12 rounded-xl border border-outline-variant/30 overflow-hidden shrink-0 bg-white group-hover:border-primary/30 transition-colors relative">
                     <img src={a.thumbnail_url || ''} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h5 className="font-bold text-on-surface text-sm md:text-base capitalize truncate">{a.title.replace(/-/g, ' ')}</h5>
                     <p className="text-xs md:text-sm text-on-surface-variant truncate">{a.excerpt}</p>
                   </div>
                 </div>
               ))}
             </div>
             {isInitialState && filteredArticles.length > 3 && (
                <div className="pt-2 flex justify-center">
                  <button onClick={() => setFilter('Artikel')} className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors">
                    Tampilkan Artikel Lainnya ({filteredArticles.length - 3} lagi) <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                </div>
              )}
           </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
