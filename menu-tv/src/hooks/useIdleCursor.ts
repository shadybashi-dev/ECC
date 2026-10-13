import { useEffect, useState } from 'react';

/** يخفي مؤشر الفأرة بعد فترة خمول (مهم لشاشات العرض في المطاعم) */
export function useIdleCursor(delay = 3000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), delay);

    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), delay);
    };

    window.addEventListener('mousemove', wake);
    window.addEventListener('mousedown', wake);
    window.addEventListener('touchstart', wake);
    window.addEventListener('keydown', wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('mousedown', wake);
      window.removeEventListener('touchstart', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [delay]);

  useEffect(() => {
    document.body.classList.toggle('cursor-hidden', idle);
    return () => document.body.classList.remove('cursor-hidden');
  }, [idle]);

  return idle;
}
