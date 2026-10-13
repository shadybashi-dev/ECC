import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '../lib/cn';

/** شريط الأقسام السفلي: يتنقّل تلقائياً ويعرض تقدّم القسم الحالي */
export function CategoryRail({
  categories,
  activeIdx,
  onSelect,
  catProgressRef,
}: {
  categories: Category[];
  activeIdx: number;
  onSelect: (index: number) => void;
  catProgressRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <footer className="relative z-20 flex h-[150px] shrink-0 items-stretch gap-2.5 px-10 pt-1.5 pb-6">
      {categories.map((category, index) => {
        const active = index === activeIdx;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[24px] border transition-all duration-500 outline-none',
              active
                ? 'border-transparent'
                : 'border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/8',
            )}
            style={
              active
                ? {
                    background: `linear-gradient(165deg, ${category.accent}30, rgba(255,255,255,0.05) 70%)`,
                    boxShadow: `0 0 44px -14px ${category.accent}cc, inset 0 1px 0 rgba(255,255,255,0.14)`,
                  }
                : undefined
            }
          >
            <CategoryIcon
              name={category.icon}
              className={cn(
                'size-[26px] transition-colors duration-500',
                active ? 'text-cream' : 'text-cream/45',
              )}
            />
            <span
              className={cn(
                'font-kufi text-[16.5px] font-bold transition-colors duration-500',
                active ? 'text-cream' : 'text-cream/60',
              )}
            >
              {category.name}
            </span>
            <span className="text-[12px] text-cream/35">
              {category.pizzaBuilder
                ? `${category.pizzaBuilder.sizes.length} sizes`
                : `${category.items.length} ${category.items.length === 1 ? 'item' : 'items'}`}
            </span>

            {active ? (
              <span className="prog-track absolute bottom-0 left-0 h-[3.5px] w-full !rounded-none">
                <span ref={catProgressRef} className="prog-fill" />
              </span>
            ) : null}
          </button>
        );
      })}
    </footer>
  );
}
