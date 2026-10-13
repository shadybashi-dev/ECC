import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Keyboard, Pause, Play } from 'lucide-react';
import { categories, restaurant } from './data/menu';
import { Stage } from './components/Stage';
import { Backdrop } from './components/Backdrop';
import { ParticlesBg } from './components/ParticlesBg';
import { IntroCurtain } from './components/IntroCurtain';
import { TopBar } from './components/TopBar';
import { FeaturedHero } from './components/FeaturedHero';
import { GuestPanel } from './components/GuestPanel';
import { DishBoard, ITEMS_PER_PAGE } from './components/DishBoard';
import { CategoryRail } from './components/CategoryRail';
import { SafeLayer } from './components/SafeLayer';
import { useRotation } from './hooks/useRotation';
import { useIdleCursor } from './hooks/useIdleCursor';
import { useKioskKeys } from './hooks/useKioskKeys';
import { cn } from './lib/cn';

/** المدة الكاملة لعرض القسم قبل الانتقال للقسم التالي */
const CATEGORY_MS = 22000;
const INTRO_KEY = 'pizzeria-menu-intro-played';

export default function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const lite = useMemo(
    () =>
      params.get('lite') === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [params],
  );

  // بعض متصفحات التلفزيون لا تدعم OffscreenCanvas — نوقف الجزيئات عليها بدل أي خطأ
  const canParticles = useMemo(
    () => !lite && 'transferControlToOffscreen' in window.HTMLCanvasElement.prototype,
    [lite],
  );

  const [introDone, setIntroDone] = useState(() => {
    if (params.get('intro') === '1') return false;
    if (params.get('intro') === '0') return true;
    try {
      return window.sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      return false;
    }
  });

  const getPageCount = useCallback(
    (index: number) => Math.max(1, Math.ceil(categories[index].items.length / ITEMS_PER_PAGE)),
    [],
  );

  const rotation = useRotation({
    count: categories.length,
    categoryMs: CATEGORY_MS,
    getPageCount,
  });

  const category = categories[rotation.activeIdx];
  const pageCount = getPageCount(rotation.activeIdx);

  useIdleCursor(3200);

  const finishIntro = useCallback(() => {
    setIntroDone(true);
    try {
      window.sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* تجاهل */
    }
  }, []);

  const replayIntro = useCallback(() => setIntroDone(false), []);

  useKioskKeys({
    categoryCount: categories.length,
    jumpTo: rotation.jumpTo,
    next: rotation.next,
    prev: rotation.prev,
    togglePause: rotation.togglePause,
    onReplayIntro: replayIntro,
  });

  // إيقاف الدوران عندما تكون النافذة مخفية (توفير طاقة شاشة العرض)
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const [showHints, setShowHints] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowHints(false), 14000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Stage>
      <Backdrop animated={!lite} />
      <SafeLayer>
        <ParticlesBg enabled={canParticles} />
      </SafeLayer>

      <div className={cn('relative z-10 flex h-full select-none flex-col', hidden && 'opacity-90')}>
        <TopBar />

        <main
          className="grid min-h-0 flex-1 gap-5 px-10 pb-3"
          style={{ gridTemplateColumns: '664px 1fr' }}
        >
          <div className="flex min-h-0 flex-col gap-5">
            <FeaturedHero category={category} />
            <GuestPanel />
          </div>

          <DishBoard
            category={category}
            page={rotation.page}
            pageCount={pageCount}
            pageProgressRef={rotation.pageProgressRef}
            paused={rotation.paused}
          />
        </main>

        <CategoryRail
          categories={categories}
          activeIdx={rotation.activeIdx}
          onSelect={rotation.jumpTo}
          catProgressRef={rotation.catProgressRef}
        />
      </div>

      {/* شارات الحالة + تلميحات التحكم */}
      <div className="pointer-events-none absolute bottom-[158px] left-10 z-30 flex items-center gap-2.5">
        <AnimatePresence>
          {rotation.paused ? (
            <motion.span
              key="paused"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-bold text-ember"
            >
              <Pause className="size-4" strokeWidth={2.4} />
              Paused — press Space to resume
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showHints && introDone ? (
          <motion.div
            key="hints"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass pointer-events-none absolute bottom-[158px] left-1/2 z-30 -translate-x-1/2 rounded-full px-5 py-2.5"
          >
            <div className="flex items-center gap-5 text-[14px] text-cream/70">
              <span className="flex items-center gap-1.5">
                <Keyboard className="size-4 text-brand/80" strokeWidth={2} />
                Controls
              </span>
              <span className="flex items-center gap-1.5">
                <ArrowLeft className="size-3.5" strokeWidth={2.4} />
                <ArrowRight className="size-3.5" strokeWidth={2.4} />
                Browse
              </span>
              <span className="flex items-center gap-1.5">
                <Play className="size-3.5" strokeWidth={2.4} />
                Space: Pause
              </span>
              <span>1–7: Sections</span>
              <span>F: Fullscreen</span>
              <span>I: Replay intro</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!introDone ? <IntroCurtain onDone={finishIntro} /> : null}

      <span className="sr-only">{restaurant.tagline}</span>
    </Stage>
  );
}
