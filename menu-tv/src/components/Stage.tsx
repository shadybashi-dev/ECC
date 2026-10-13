import type { ReactNode } from 'react';
import { useStageScale } from '../hooks/useStageScale';

/**
 * مسرح ثابت بمقاس 1920×1080 يتحجّم تلقائياً ليملأ أي شاشة تلفزيون
 * دون تشويه النِسَب.
 */
export function Stage({ children }: { children: ReactNode }) {
  const { scale, x, y } = useStageScale();

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#080d15' }}>
      <div
        className="screen grain"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
