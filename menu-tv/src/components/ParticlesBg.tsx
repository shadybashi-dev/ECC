import { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

/**
 * غبار ذهبي خفيف يطفو للأعلى — tsParticles (محرّك الجزيئات الأشهر على GitHub).
 * مُعطّل تلقائياً في وضع «lite» أو عند تفضيل تقليل الحركة لتوفير موارد التلفزيون.
 */
export function ParticlesBg({ enabled }: { enabled: boolean }) {
  const init = useMemo(() => async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 45,
      detectRetina: true,
      background: { color: { value: 'transparent' } },
      particles: {
        number: { value: 26, density: { enable: true, width: 1920, height: 1080 } },
        color: { value: ['#f5b544', '#ffdca6', '#ef8f6b'] },
        shape: { type: 'circle' },
        opacity: { value: { min: 0.04, max: 0.26 } },
        size: { value: { min: 1, max: 2.8 } },
        move: {
          enable: true,
          speed: 0.35,
          direction: 'top',
          straight: false,
          outModes: { default: 'out' },
        },
        wobble: { enable: true, distance: 14, speed: 4.5 },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: { enable: true },
        },
      },
    }),
    [],
  );

  if (!enabled) return null;

  return (
    <ParticlesProvider init={init}>
      <Particles
        id="menu-dust"
        className="pointer-events-none absolute inset-0"
        style={{ position: 'absolute', inset: 0 }}
        options={options}
      />
    </ParticlesProvider>
  );
}
