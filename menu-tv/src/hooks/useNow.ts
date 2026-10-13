import { useEffect, useState } from 'react';

/** ساعة حيّة تتحدّث كل ثانية (تتوقف تلقائياً عند إخفاء الصفحة توفيراً للمعالج) */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id = 0;
    const tick = () => setNow(new Date());
    const start = () => {
      stop();
      id = window.setInterval(tick, intervalMs);
    };
    const stop = () => window.clearInterval(id);

    const onVisibility = () => {
      tick();
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs]);

  return now;
}
