import { useEffect, useMemo } from 'react';
import { animate, stagger } from 'animejs';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { DishCard } from './DishCard';
import { PizzaBuilderBoard } from './PizzaBuilderBoard';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { cn } from '../lib/cn';

/** Number of regular menu cards on one screen (three columns by two rows). */
export const ITEMS_PER_PAGE = 6;

export function DishBoard({
  category,
  page,
  pageCount,
  pageProgressRef,
  paused,
}: {
  category: Category;
  page: number;
  pageCount: number;
  pageProgressRef: React.RefObject<HTMLSpanElement | null>;
  paused: boolean;
}) {
  const { wrapperRef, contentRef, scrollToTop } = useLenisScroll<HTMLDivElement>();

  const items = useMemo(
    () => category.items.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE),
    [category, page],
  );

  useEffect(() => {
    scrollToTop();
  }, [page, category.id, scrollToTop]);

  // Stagger card entrances when the category/page changes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = contentRef.current?.querySelectorAll('.dish-card');
    if (!cards || cards.length === 0) return;

    const intro = animate(cards, {
      opacity: [0, 1],
      translateY: [26, 0],
      scale: [0.97, 1],
      duration: 680,
      delay: stagger(70),
      ease: 'out(3)',
    });

    return () => {
      intro.revert();
    };
  }, [category.id, page]);

  const countLabel = category.pizzaBuilder
    ? `${category.pizzaBuilder.sizes.length} sizes`
    : `${category.items.length} ${category.items.length === 1 ? 'item' : 'items'}`;

  const gridColumns = items.length === 1 ? 'grid-cols-1' : items.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <section className="flex h-full min-h-0 flex-col gap-3.5">
      <header className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="flex size-[58px] items-center justify-center rounded-2xl border"
            style={{
              background: `${category.accent}22`,
              borderColor: `${category.accent}55`,
              boxShadow: `0 0 34px -12px ${category.accent}`,
            }}
          >
            <CategoryIcon name={category.icon} className="size-7" />
          </span>
          <div>
            <h2 className="font-kufi text-[38px] leading-none font-bold text-cream">{category.name}</h2>
            <p className="mt-1.5 text-[15.5px] text-cream/50">{category.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <span className="glass rounded-full px-4 py-2 text-[14.5px] font-bold text-cream/75">
            {countLabel}
          </span>

          {pageCount > 1 ? (
            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <span
                  key={index}
                  className={cn('page-dot', index === page ? 'text-brand' : 'text-transparent')}
                >
                  {index === page ? <span ref={pageProgressRef} /> : null}
                </span>
              ))}
            </div>
          ) : null}

          {paused ? (
            <span className="glass rounded-full px-4 py-2 text-[14.5px] font-bold text-ember">⏸ Paused</span>
          ) : null}
        </div>
      </header>

      <div ref={wrapperRef} className="no-scrollbar h-full min-h-0 overflow-y-auto">
        <div ref={contentRef} className="h-full min-h-0">
          {category.pizzaBuilder ? (
            <PizzaBuilderBoard options={category.pizzaBuilder} />
          ) : (
            <div
              className={cn(
                'grid h-full min-h-0 auto-rows-fr gap-4 pb-1',
                gridColumns,
                items.length === 1 && 'mx-auto w-full max-w-[720px]',
              )}
            >
              {items.map((dish) => (
                <DishCard key={dish.id} dish={dish} accent={category.accent} icon={category.icon} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
