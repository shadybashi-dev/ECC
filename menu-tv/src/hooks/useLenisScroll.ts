import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * تمرير ناعم (Lenis) على قائمة الأطباق — يعمل بالعجلة واللمس
 * ويسمح بإرجاع القائمة لأعلى فوراً عند تبديل الصفحة.
 */
export function useLenisScroll<T extends HTMLElement>() {
  const wrapperRef = useRef<T | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      autoRaf: true,
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTop = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, []);

  return { wrapperRef, contentRef, scrollToTop };
}
