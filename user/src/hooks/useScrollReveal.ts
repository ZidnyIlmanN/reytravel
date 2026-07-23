/**
 * useScrollReveal — lightweight IntersectionObserver hook
 * Supports bidirectional animation: entry AND exit.
 * Zero dependencies, pure browser API.
 */
'use client';
import { useEffect, useRef } from 'react';

interface Options {
  /** CSS class added when element enters viewport. Default: 'is-visible' */
  visibleClass?: string;
  /** Root margin (same syntax as IntersectionObserver). Default: '0px 0px -60px 0px' */
  rootMargin?: string;
  /** Threshold. Default: 0.12 */
  threshold?: number;
  /**
   * Fire once then disconnect (no exit animation).
   * Set false for bidirectional entry+exit. Default: false
   */
  once?: boolean;
}

/**
 * Returns a ref to attach to the container element.
 * When visible: adds `visibleClass`. When out of view: removes it (exit anim).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: Options = {}
) {
  const {
    visibleClass = 'is-visible',
    rootMargin = '0px 0px -60px 0px',
    threshold = 0.12,
    once = false,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add(visibleClass);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            if (once) observer.unobserve(entry.target);
          } else {
            if (!once) entry.target.classList.remove(visibleClass);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleClass, rootMargin, threshold, once]);

  return ref;
}

/**
 * useScrollRevealChildren — applies stagger reveal to each direct child.
 * Bidirectional: adds class on enter, removes on exit (re-animates on re-enter).
 */
export function useScrollRevealChildren<T extends HTMLElement = HTMLElement>(
  options: Options & { staggerMs?: number } = {}
) {
  const {
    visibleClass = 'is-visible',
    rootMargin = '0px 0px -40px 0px',
    threshold = 0.08,
    once = false,
    staggerMs = 100,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            if (once) observer.unobserve(entry.target);
          } else {
            if (!once) entry.target.classList.remove(visibleClass);
          }
        });
      },
      { rootMargin, threshold }
    );

    const observeChildren = () => {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child, i) => {
        child.style.setProperty('--stagger-i', String(i));
        if (prefersReduced) {
          child.classList.add(visibleClass);
        } else if (!child.classList.contains(visibleClass)) {
          observer.observe(child);
        }
      });
    };

    observeChildren();

    // Re-observe when children change or class list is overwritten by React
    const mutation = new MutationObserver((mutations) => {
      const hasMeaningfulChange = mutations.some(m => {
        if (m.type === 'childList') return true;
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const target = m.target as HTMLElement;
          return !target.classList.contains(visibleClass);
        }
        return false;
      });
      if (hasMeaningfulChange) {
        observeChildren();
      }
    });
    mutation.observe(container, { childList: true, attributes: true, subtree: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [visibleClass, rootMargin, threshold, once, staggerMs]);

  return ref;
}

/**
 * Helper: create a one-off bidirectional IntersectionObserver for a single element.
 * Used inline in components that manage their own refs.
 */
export function observeReveal(
  el: Element,
  options: { visibleClass?: string; rootMargin?: string; threshold?: number; once?: boolean } = {}
): () => void {
  const {
    visibleClass = 'is-visible',
    rootMargin = '0px 0px -60px 0px',
    threshold = 0.1,
    once = false,
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          if (once) observer.unobserve(entry.target);
        } else {
          if (!once) entry.target.classList.remove(visibleClass);
        }
      });
    },
    { rootMargin, threshold }
  );

  observer.observe(el);
  return () => observer.disconnect();
}
