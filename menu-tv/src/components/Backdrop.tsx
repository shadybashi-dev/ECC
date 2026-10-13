import { useEffect } from 'react';
import { animate, stagger } from 'animejs';

/**
 * خلفية متحركة: كرات ضوء ناعمة (anime.js) تتنفّس ببطء خلف المنيو
 * + طبقة حبيبات عبر CSS لتعطي إحساس الشاشة الفخمة.
 */
export function Backdrop({ animated = true }: { animated?: boolean }) {
  useEffect(() => {
    if (!animated) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const orbs = document.querySelectorAll('.orb');
    if (orbs.length === 0) return;

    const motion = animate(orbs, {
      translateX: () => Math.random() * 170 - 85,
      translateY: () => Math.random() * 130 - 65,
      scale: () => 0.88 + Math.random() * 0.4,
      duration: () => 12000 + Math.random() * 9000,
      delay: stagger(650),
      loop: true,
      alternate: true,
      ease: 'inOutSine',
    });

    return () => {
      motion.revert();
    };
  }, [animated]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="orb"
        style={{ width: 780, height: 780, top: -220, right: -140, background: 'rgba(232,80,72,0.5)' }}
      />
      <div
        className="orb"
        style={{ width: 620, height: 620, bottom: -180, left: -120, background: 'rgba(87,148,95,0.42)' }}
      />
      <div
        className="orb"
        style={{ width: 520, height: 520, top: 380, left: 460, background: 'rgba(127,208,216,0.3)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(5,8,13,0.55) 100%)',
        }}
      />
    </div>
  );
}
