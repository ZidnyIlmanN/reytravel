'use client';
import { useState, useEffect } from 'react';
import { TravelPackage, AvailableCar, createBooking, BookingInput } from '@/lib/supabase';
import styles from './BookingForm.module.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props {
  packages: TravelPackage[];
  cars: AvailableCar[];
  selectedPackageId: string | null;
  selectedCarId: string | null;
}

export default function BookingForm({ packages, cars, selectedPackageId, selectedCarId }: Props) {
  // Countdown timer — resets to midnight every day
  // Initialize with zeros to match SSR, then populate on client via useEffect
  const getTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Set real time immediately on mount, then tick every second
    setTimeLeft(getTimeLeft());
    const tick = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(tick);
  }, []);

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    pickup: '', destination: '',
    date: '',
    serviceType: selectedPackageId?.startsWith('charter') ? 'charter' : 'reguler',
    packageId: selectedPackageId || '',
    carId: selectedCarId || '',
    message: '',
  });

  useEffect(() => {
    if (selectedPackageId !== null) {
      setForm(prev => ({
        ...prev,
        packageId: selectedPackageId,
        serviceType: selectedPackageId.startsWith('charter') ? 'charter' : 'reguler'
      }));
    }
  }, [selectedPackageId]);

  useEffect(() => {
    if (selectedCarId !== null) {
      setForm(prev => ({ ...prev, carId: selectedCarId }));
    }
  }, [selectedCarId]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.pickup || !form.destination || !form.date) {
      setError('Harap lengkapi semua kolom bertanda bintang (*).');
      return;
    }
    setError('');
    setSubmitting(true);

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const serviceLabel = form.serviceType === 'charter' ? 'Charter Privat' : 'Travel Reguler';
    const carObj = cars.find(c => c.id === form.carId);
    const pkgObj = packages.find(p => p.id === form.packageId);

    // If ID is not a valid UUID (e.g. mock data 'calya'), we set foreign key to null to avoid SQL error
    const cleanCarId = form.carId && isUUID(form.carId) ? form.carId : null;
    const cleanPackageId = form.packageId && isUUID(form.packageId) ? form.packageId : null;

    // Append mock name metadata to message if UUID wasn't saved in DB relations
    let finalMessage = `[Tipe Layanan: ${serviceLabel}]`;
    if (carObj && !cleanCarId) {
      finalMessage += ` [Mobil: ${carObj.name}]`;
    }
    if (pkgObj && !cleanPackageId) {
      finalMessage += ` [Paket: ${pkgObj.title}]`;
    }
    if (form.message) {
      finalMessage += ` ${form.message}`;
    }

    const booking: BookingInput = {
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      pickup_point: form.pickup,
      destination: form.destination,
      travel_date: form.date,
      package_id: cleanPackageId,
      car_id: cleanCarId,
      message: finalMessage.trim(),
    };

    try {
      const res = await createBooking(booking);
      if (res.success) {
        setSuccess(true);
        setForm({
          name: '', phone: '', email: '',
          pickup: '', destination: '',
          date: '', serviceType: 'reguler', packageId: '', carId: '',
          message: '',
        });
      } else {
        setError(res.error || 'Terjadi kesalahan, silakan coba lagi.');
      }
    } catch (err) {
      setError('Gagal mengirim pesanan. Silakan hubungi kami via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWA = () => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400';
    const serviceLabel = form.serviceType === 'charter' ? 'Charter Privat' : 'Travel Reguler';
    const carObj = cars.find(c => c.id === form.carId);
    const pkgObj = packages.find(p => p.id === form.packageId);

    let text = `Halo Reytrans! Saya *${form.name || 'Pelanggan'}* ingin konfirmasi pesanan.\n\n`;
    text += `- *Tipe Layanan*: ${serviceLabel}\n`;
    if (carObj) text += `- *Armada*: ${carObj.name}\n`;
    if (pkgObj) text += `- *Layanan/Paket*: ${pkgObj.title}\n`;
    text += `- *Jemput*: ${form.pickup || '-'}\n`;
    text += `- *Tujuan*: ${form.destination || '-'}\n`;
    text += `- *Tanggal*: ${form.date || '-'}`;
    if (form.message) text += `\n- *Catatan*: ${form.message}`;

    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const headerRef = useScrollReveal<HTMLDivElement>();
  const infoPanelRef = useScrollReveal<HTMLDivElement>({ visibleClass: 'is-visible' });
  const formPanelRef = useScrollReveal<HTMLDivElement>({ visibleClass: 'is-visible' });

  return (
    <section id="booking" className="section">
      <div className="container">
        <div className="section-header reveal-up" ref={headerRef}>
          <span className="section-label">BOOKING</span>
          <h2 className="section-title">Formulir Pemesanan</h2>
          <div className="section-bar" />
          <p className="section-desc">Isi formulir berikut dan tim kami akan menghubungi Anda dalam 5 menit.</p>
        </div>

        <div className={styles.liveCounterContainer}>
          <div className={styles.liveCounter}>
            <span className={styles.liveDot} />
            48 armada &amp; paket telah terbooking dalam 24 jam terakhir
          </div>
        </div>

        <div className={styles.layout}>
          {/* Info panel */}
          <div className={`${styles.infoPanel} reveal-left`} ref={infoPanelRef}>
            <div className={styles.promoTag}>
              <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              DISKON MUSIM LIBURAN
            </div>
            <h3 className={styles.promoTitle}>Dapatkan Diskon 20% untuk Booking Hari Ini!</h3>
            <p className={styles.promoDesc}>
              Mudahkan perjalanan wisata Anda dengan memesan lebih awal. Isi formulir, dan CS kami akan segera merespons dalam 5 menit.
            </p>

            {/* FOMO Countdown */}
            <div className={styles.countdown}>
              <div className={styles.countdownLabel}>
                <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Promo berakhir dalam:
              </div>
              <div className={styles.countdownBlocks}>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNum}>{String(timeLeft.h).padStart(2,'0')}</span>
                  <span className={styles.countdownSub}>JAM</span>
                </div>
                <span className={styles.countdownColon}>:</span>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNum}>{String(timeLeft.m).padStart(2,'0')}</span>
                  <span className={styles.countdownSub}>MENIT</span>
                </div>
                <span className={styles.countdownColon}>:</span>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNum}>{String(timeLeft.s).padStart(2,'0')}</span>
                  <span className={styles.countdownSub}>DETIK</span>
                </div>
              </div>
              <p className={styles.countdownNote}>
                <svg viewBox="0 0 24 24" fill="none" width="11" height="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                Slot terbatas — hanya tersisa beberapa tempat hari ini
              </p>
            </div>
            <div className={styles.steps}>
              {[
                { n: '1', title: 'Isi Formulir', desc: 'Lengkapi detail perjalanan Anda.' },
                { n: '2', title: 'Konfirmasi WA', desc: 'Hubungi CS via WhatsApp untuk verifikasi & promo.' },
                { n: '3', title: 'Berangkat!', desc: 'Sopir kami menjemput tepat waktu.' },
              ].map(s => (
                <div key={s.n} className={styles.step}>
                  <div className={styles.stepNum}>{s.n}</div>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className={`${styles.formPanel} reveal-right`} ref={formPanelRef}>
            {success ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>
                  <svg viewBox="0 0 24 24" fill="none" width="48" height="48" stroke="var(--clr-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Booking Berhasil Terkirim!</h3>
                <p>Permintaan Anda sedang diproses. Klik tombol di bawah untuk mempercepat konfirmasi via WhatsApp.</p>
                <button className="btn btn-primary" onClick={handleWA} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.67 19.79 19.79 0 0 1 .46 2.1 2 2 0 0 1 2.42 0h3.08a2 2 0 0 1 2 1.72 12.84 12.84 0 00.7 2.81 2 2 0 0 1-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 002.81.7A2 2 0 0 1 22 14.92z"/>
                  </svg>
                  Konfirmasi via WhatsApp
                </button>
                <button className={`btn btn-ghost ${styles.resetBtn}`} onClick={() => setSuccess(false)}>
                  Isi Formulir Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>Detail Perjalanan</h3>

                {/* Price Lock Banner */}
                <div className={styles.priceLockBanner}>
                  <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span>Isi formulir sekarang untuk mengunci Diskon 20% Anda.</span>
                </div>

                {error && <div className={styles.errorBox}>{error}</div>}

                <div className={styles.row2}>
                  <div className="input-group">
                    <label className="input-label">Nama Lengkap *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input type="text" placeholder="Masukkan nama Anda" value={form.name} onChange={set('name')} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nomor WhatsApp *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                          <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                      </span>
                      <input 
                        type="tel" 
                        placeholder="08xxxxxxxxxx" 
                        value={form.phone} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ''); // Hanya angka
                          setForm(prev => ({ ...prev, phone: val }));
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className="input-group">
                    <label className="input-label">Email (Opsional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input type="email" placeholder="nama@email.com" value={form.email} onChange={set('email')} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tanggal Keberangkatan *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </span>
                      <input type="date" value={form.date} onChange={set('date')} />
                    </div>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className="input-group">
                    <label className="input-label">Titik Penjemputan *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </span>
                      <input type="text" placeholder="Hotel, Stasiun, Bandara..." value={form.pickup} onChange={set('pickup')} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Titik Tujuan *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 20l9-15 9 15H3z"/>
                          <path d="M8 12l4-5 4 5"/>
                        </svg>
                      </span>
                      <input type="text" placeholder="Jakarta, Cirebon, Depok..." value={form.destination} onChange={set('destination')} />
                    </div>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className="input-group">
                    <label className="input-label">Tipe Layanan *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          <path d="M2 12h20"/>
                        </svg>
                      </span>
                      <select value={form.serviceType} onChange={set('serviceType')}>
                        <option value="reguler">Travel Reguler (Per Kursi)</option>
                        <option value="charter">Charter Privat (Satu Mobil / Drop Off)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Pilih Mobil (Opsional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 00.7 12.3C.3 12.5 0 13 0 13.5V16c0 .6.4 1 1 1h2"/>
                          <circle cx="7" cy="17" r="3"/>
                          <circle cx="15" cy="17" r="3"/>
                        </svg>
                      </span>
                      <select value={form.carId} onChange={set('carId')}>
                        <option value="">-- Pilih Mobil --</option>
                        {cars.map(c => (
                          <option key={c.id} value={c.id} disabled={!c.is_available}>
                            {c.name} {!c.is_available ? '(Penuh)' : form.serviceType === 'charter' ? '(Charter - Sesuai Rute)' : `(Rp ${c.price_per_day.toLocaleString('id-ID')})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Charter WA note */}
                    {form.serviceType === 'charter' && form.carId && (
                      <div style={{
                        marginTop: '8px',
                        padding: '10px 14px',
                        background: 'var(--clr-primary-ghost)',
                        border: '1px solid rgba(0,100,210,0.2)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--clr-primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0, color: '#25d366' }}>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>
                          Harga charter sesuai rute & armada.{' '}
                          <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285702710400'}?text=${encodeURIComponent(`Halo Reytrans, saya mau tanya harga sewa charter privat untuk *${cars.find(c => c.id === form.carId)?.name || 'Charter'}*. Boleh info tarif rutenya?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'underline' }}
                          >
                            Chat Admin WhatsApp →
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="input-group">
                    {/* Empty placeholder */}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Catatan Tambahan (Opsional)</label>
                  <div className="input-wrapper">
                    <textarea
                      rows={3}
                      placeholder="Misal: butuh kursi bayi, vegetarian, dll."
                      value={form.message}
                      onChange={set('message')}
                    />
                  </div>
                </div>

                {/* Trust badges near submit */}
                <div className={styles.trustBadges}>
                  <span className={styles.trustBadgeItem}>
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Data Aman
                  </span>
                  <span className={styles.trustBadgeItem}>
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    No Spam
                  </span>
                  <span className={styles.trustBadgeItem}>
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Bayar Setelah Konfirmasi
                  </span>
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting}>
                  {submitting ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/>
                        <path d="M21 12a9 9 0 00-9-9" />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Kirim Formulir Pemesanan
                    </>
                  )}
                </button>

                <p className={styles.reversalText}>
                  <svg viewBox="0 0 24 24" fill="none" width="11" height="11" stroke="var(--clr-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Jaminan Bebas Resiko: Batal H-3 Uang Kembali 100% · Layanan Prima
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
