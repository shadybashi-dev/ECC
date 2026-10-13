import { useEffect, useState } from 'react';

export interface StageTransform {
  scale: number;
  x: number;
  y: number;
}

/**
 * يحوّل الواجهة المصممة بمقاس 1920×1080 إلى أي شاشة تلفزيون
 * مع الحفاظ على النِسَب (letterbox) — يعمل على 4K و Full HD والعمودي.
 */
export function useStageScale(width = 1920, height = 1080): StageTransform {
  const [t, setT] = useState<StageTransform>({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.min(vw / width, vh / height);
      setT({
        scale,
        x: Math.round((vw - width * scale) / 2),
        y: Math.round((vh - height * scale) / 2),
      });
    };

    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    document.addEventListener('fullscreenchange', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
      document.removeEventListener('fullscreenchange', fit);
    };
  }, [width, height]);

  return t;
}
