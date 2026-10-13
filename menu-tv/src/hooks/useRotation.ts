import { useCallback, useEffect, useRef, useState } from 'react';

export interface RotationOptions {
  /** عدد الأقسام الكلي */
  count: number;
  /** المدة الكاملة لعرض القسم بالمللي ثانية */
  categoryMs: number;
  /** عدد الصفحات في قسم معيّن */
  getPageCount: (index: number) => number;
}

export interface Rotation {
  activeIdx: number;
  page: number;
  paused: boolean;
  /** شريط تقدّم القسم داخل شريط الأقسام */
  catProgressRef: React.RefObject<HTMLSpanElement | null>;
  /** شريط تقدّم الصفحة داخل لوحة الأطباق */
  pageProgressRef: React.RefObject<HTMLSpanElement | null>;
  jumpTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  togglePause: () => void;
}

/**
 * محرّك التدوير التلقائي: ينتقل بين الأقسام والصفحات، ويعرض تقدّماً سلساً
 * يُكتب مباشرة على عناصر DOM (بدون إعادة رسم React كل إطار).
 */
export function useRotation({ count, categoryMs, getPageCount }: RotationOptions): Rotation {
  const [activeIdx, setActiveIdx] = useState(0);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const elapsedRef = useRef(0);
  const activeRef = useRef(0);
  const pageRef = useRef(0);
  const pausedRef = useRef(false);
  const catProgressRef = useRef<HTMLSpanElement | null>(null);
  const pageProgressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    activeRef.current = activeIdx;
  }, [activeIdx]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const pages = Math.max(1, getPageCount(activeRef.current));
      const pageMs = categoryMs / pages;

      if (!pausedRef.current) {
        elapsedRef.current += dt;

        if (elapsedRef.current >= categoryMs) {
          elapsedRef.current = 0;
          const nextIdx = (activeRef.current + 1) % count;
          activeRef.current = nextIdx;
          pageRef.current = 0;
          setActiveIdx(nextIdx);
          setPage(0);
        } else {
          const p = Math.min(pages - 1, Math.floor(elapsedRef.current / pageMs));
          if (p !== pageRef.current) {
            pageRef.current = p;
            setPage(p);
          }
        }
      }

      const catP = Math.min(1, elapsedRef.current / categoryMs);
      const pageP = Math.min(
        1,
        Math.max(0, (elapsedRef.current - pageRef.current * pageMs) / pageMs),
      );
      if (catProgressRef.current) catProgressRef.current.style.transform = `scaleX(${catP})`;
      if (pageProgressRef.current) pageProgressRef.current.style.transform = `scaleX(${pageP})`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, categoryMs, getPageCount]);

  const jumpTo = useCallback(
    (index: number) => {
      const safe = ((index % count) + count) % count;
      elapsedRef.current = 0;
      pageRef.current = 0;
      activeRef.current = safe;
      setActiveIdx(safe);
      setPage(0);
    },
    [count],
  );

  const next = useCallback(() => jumpTo(activeRef.current + 1), [jumpTo]);
  const prev = useCallback(() => jumpTo(activeRef.current - 1), [jumpTo]);
  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    activeIdx,
    page,
    paused,
    catProgressRef,
    pageProgressRef,
    jumpTo,
    next,
    prev,
    togglePause,
  };
}
