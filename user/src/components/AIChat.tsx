'use client';
import React, { useState, useRef, useEffect } from 'react';
import { askGroqAI, ChatMessage } from '@/lib/groq';
import { TravelPackage, AvailableCar, FAQ } from '@/lib/supabase';
import styles from './AIChat.module.css';

interface Props {
  packages: TravelPackage[];
  cars: AvailableCar[];
  faqs: FAQ[];
  isOpenExternally: boolean;
  onCloseExternal: () => void;
}

export default function AIChat({ packages, cars, faqs, isOpenExternally, onCloseExternal }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Halo! Saya Reytrans AI Assistant. Ada yang bisa saya bantu terkait layanan travel Ciayumajakuning-Jabodetabek, sewa armada, atau rental charter?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpenExternally) {
      setIsOpen(true);
    }
  }, [isOpenExternally]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleChat = () => {
    if (isOpen && onCloseExternal) {
      onCloseExternal();
    }
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) {
      onCloseExternal();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const reply = await askGroqAI(userText, newMessages, packages, cars, faqs);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Trigger CS nudge tooltip after 3 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if chat window and menu are closed
      if (!isOpen && !showMenu) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, showMenu]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowTooltip(false); // Dismiss tooltip on click
  };

  const handleOpenAI = () => {
    setIsOpen(true);
    setShowMenu(false);
    setShowTooltip(false);
  };

  const handleOpenWA = () => {
    setShowMenu(false);
    setShowTooltip(false);
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const msg = encodeURIComponent('Halo Reytrans, saya mau tanya paket wisata / sewa mobil');
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  // Close menu on click outside
  const menuContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showMenu && menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMenu]);

  return (
    <div ref={menuContainerRef} className={styles.container}>
      {/* Floating Menu options */}
      {!isOpen && showMenu && (
        <div className={styles.menuOptions}>
          <button onClick={handleOpenWA} className={`${styles.menuBtn} ${styles.waBtn}`} aria-label="Hubungi WhatsApp">
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </span>
            <span className={styles.menuText}>WhatsApp</span>
          </button>
          <button onClick={handleOpenAI} className={`${styles.menuBtn} ${styles.aiBtn}`} aria-label="Tanya AI">
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4M8 16h.01M16 16h.01"/>
              </svg>
            </span>
            <span className={styles.menuText}>Reytrans AI</span>
          </button>
        </div>
      )}

      {/* Main trigger button */}
      {!isOpen && (
        <>
          {showTooltip && !showMenu && (
            <div className={styles.tooltipNudge} onClick={toggleMenu}>
              <span className={styles.tooltipText}>Tanya Paket/Mobil? Chat CS (Respon 5 mnt)</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className={styles.tooltipCloseBtn}
                aria-label="Tutup petunjuk"
              >
                <svg viewBox="0 0 24 24" fill="none" width="10" height="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}
          <button onClick={toggleMenu} className={`${styles.floatingButton} ${showMenu ? styles.active : ''}`} aria-label="Layanan Pelanggan">
            <span className={styles.floatingIcon}>
              {showMenu ? (
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </span>
            {!showMenu && <span className={styles.pulseRing} />}
          </button>
        </>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.headerIcon}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <path d="M12 7v4M8 16h.01M16 16h.01"/>
                </svg>
              </span>
              <div>
                <h4 className={styles.headerTitle}>AI Travel Assistant</h4>
                <div className={styles.statusRow}>
                  <span className={styles.statusDot} />
                  <span className={styles.statusText}>Aktif &amp; Pintar</span>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className={styles.closeBtn} aria-label="Tutup Chat">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages list */}
          <div ref={scrollRef} className={styles.messagesList}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.messageRow} ${
                  msg.role === 'assistant' ? styles.messageAssistant : styles.messageUser
                }`}
              >
                {msg.role === 'assistant' && (
                  <span className={styles.msgAvatar}>
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2"/>
                      <circle cx="12" cy="5" r="2"/>
                      <path d="M12 7v4M8 16h.01M16 16h.01"/>
                    </svg>
                  </span>
                )}
                <div className={styles.bubble}>
                  <p className={styles.msgText}>{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <span className={styles.msgAvatarUser}>
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className={`${styles.messageRow} ${styles.messageAssistant}`}>
                <span className={styles.msgAvatar}>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="M12 7v4M8 16h.01M16 16h.01"/>
                  </svg>
                </span>
                <div className={styles.bubble}>
                  <div className={styles.loadingDots}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer input form */}
          <form onSubmit={handleSend} className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Tanyakan tarif mobil, jadwal, rute..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || loading} aria-label="Kirim">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
