import type { Dish, IconName } from '../types';
import { restaurant } from '../data/menu';
import { CategoryIcon } from './CategoryIcon';
import { Price } from './Price';
import { TagBadges } from './TagBadges';
import { formatPrice } from '../lib/cn';

/** One menu item card in the rotating category grid. */
export function DishCard({
  dish,
  accent,
  icon,
}: {
  dish: Dish;
  accent: string;
  icon: IconName;
}) {
  return (
    <article
      className="dish-card card-hover glass flex min-h-0 flex-col overflow-hidden rounded-[26px]"
      style={{ boxShadow: `0 30px 60px -44px rgba(0,0,0,1), 0 0 0 1px ${accent}14` }}
    >
      <div className="relative h-[186px] shrink-0 overflow-hidden">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `radial-gradient(70% 80% at 50% 30%, ${accent}2e, #111b29 78%)`,
            }}
          >
            <CategoryIcon name={icon} className="size-20" />
            <span className="sr-only">{dish.name}</span>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(10,7,5,0.92))' }}
        />
        <div className="absolute top-3 right-3">
          <TagBadges tags={dish.tags?.slice(0, 2)} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-5 pt-3.5 pb-4">
        <h4 className="font-kufi text-[22px] leading-snug font-bold text-cream">{dish.name}</h4>
        {dish.desc ? <p className="line-clamp-2 text-[14.5px] leading-relaxed text-cream/55">{dish.desc}</p> : null}

        {dish.priceOptions?.length ? (
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-white/8 pt-2">
            {dish.priceOptions.map((option) => (
              <div key={option.label} className="flex min-w-0 items-center justify-between gap-1 text-[12.5px]">
                <span className="truncate font-semibold text-cream/55">{option.label}</span>
                <span className="shrink-0 font-price font-bold tabular-nums text-cream/90" dir="ltr">
                  {restaurant.currency}{formatPrice(option.price)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between pt-2">
          <Price dish={dish} size="md" />
          {dish.kcal ? <span className="mb-1 text-[13.5px] text-cream/40">{dish.kcal} kcal</span> : null}
        </div>
      </div>
    </article>
  );
}
