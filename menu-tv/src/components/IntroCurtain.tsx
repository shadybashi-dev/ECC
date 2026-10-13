import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import SplitText from 'gsap/SplitText';
import { restaurant } from '../data/menu';

/** Animated opening curtain: draw the pizza mark, reveal the title and tagline, then open. */
export function IntroCurtain({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    const root = rootRef.current;
    if (!root) return;

    let timeline: gsap.core.Timeline | null = null;

    try {
      gsap.registerPlugin(DrawSVGPlugin, SplitText);

      const titleSplit = new SplitText('.intro-name', { type: 'words' });
      const taglineSplit = new SplitText('.intro-tagline', { type: 'words' });

      timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      });

      timeline
        .fromTo(
          '.intro-petal',
          { drawSVG: '0%', opacity: 0.2, scale: 0.88 },
          { drawSVG: '100%', opacity: 1, scale: 1, duration: 1.15 },
          0,
        )
        .fromTo('.intro-core', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55 }, 0.65)
        .fromTo(
          titleSplit.words,
          { opacity: 0, y: 34, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, stagger: 0.09 },
          0.7,
        )
        .fromTo('.intro-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 1.15)
        .fromTo(
          taglineSplit.words,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
          1.3,
        )
        .fromTo('.intro-progress span', { scaleX: 0 }, { scaleX: 1, duration: 1.45, ease: 'power1.inOut' }, 1.55)
        .to('.intro-name, .intro-tagline, .intro-mark, .intro-progress', { opacity: 0, y: -18, duration: 0.45 }, 3.15)
        .to('.intro-curtain-top', { yPercent: -100, duration: 0.85, ease: 'power3.inOut' }, 3.4)
        .to('.intro-curtain-bottom', { yPercent: 100, duration: 0.85, ease: 'power3.inOut' }, 3.4)
        .to(root, { autoAlpha: 0, duration: 0.35 }, 4.05);
    } catch {
      // If the animation plugins are unavailable, reveal the menu without blocking.
      finish();
      return;
    }

    const skip = () => {
      if (doneRef.current) return;
      setLeaving(true);
      timeline?.kill();
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.45,
        onComplete: finish,
      });
    };

    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      timeline?.kill();
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="absolute inset-0 z-50" aria-hidden>
      <div className="intro-curtain-top absolute inset-x-0 top-0 h-1/2 bg-[#080d15]" />
      <div className="intro-curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#080d15]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7">
        <svg viewBox="0 0 100 100" width={170} height={170} className="intro-mark overflow-visible">
          <path
            className="intro-petal"
            d="M15 22 C35 8 65 8 85 22 L50 88 Z"
            fill="#f5b544"
            stroke="#fff1d7"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path d="M15 22 C35 8 65 8 85 22" fill="none" stroke="#ad4e32" strokeWidth={8} strokeLinecap="round" />
          <circle className="intro-core" cx={39} cy={34} r={5.5} fill="#d7483e" />
          <circle className="intro-core" cx={63} cy={35} r={5.5} fill="#d7483e" />
          <circle className="intro-core" cx={51} cy={58} r={5.5} fill="#d7483e" />
          <path d="M31 50 C36 43 42 44 43 51 C39 56 34 55 31 50Z" fill="#51855a" />
        </svg>

        <h1
          className="intro-name font-kufi text-[92px] leading-none font-extrabold tracking-wide text-cream"
          style={{ textShadow: '0 0 40px rgba(232,80,72,0.35)' }}
        >
          {restaurant.name}
        </h1>

        <div
          className="intro-rule h-px w-[520px] origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(232,80,72,0.9), transparent)' }}
        />

        <p className="intro-tagline text-[26px] tracking-wide text-cream/70">{restaurant.tagline}</p>

        <div className="intro-progress mt-4 h-[3px] w-[260px] overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-full origin-left scale-x-0 rounded-full bg-brand" />
        </div>

        {leaving ? null : (
          <p className="absolute bottom-10 text-[15px] text-cream/35">Press any key to skip · F for fullscreen</p>
        )}
      </div>
    </div>
  );
}
