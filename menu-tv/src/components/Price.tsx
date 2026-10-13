import NumberFlow from '@number-flow/react';
import type { Dish } from '../types';
import { restaurant } from '../data/menu';
import { cn, formatPrice } from '../lib/cn';

const sizes = {
  sm: 'text-[24px]',
  md: 'text-[32px]',
  lg: 'text-[50px]',
} as const;

/** Animated NumberFlow price with a clear prefix for starting prices. */
export function Price({
  dish,
  size = 'md',
  className,
}: {
  dish: Dish;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const discount =
    dish.oldPrice && dish.oldPrice > dish.price
      ? Math.round(((dish.oldPrice - dish.price) / dish.oldPrice) * 100)
      : 0;
  const currencyBefore = restaurant.currency === '$';

  return (
    <div className={cn('flex items-end gap-2', className)}>
      {dish.pricePrefix ? (
        <span className="mb-1 text-[12px] font-extrabold tracking-[0.12em] text-brand/75">{dish.pricePrefix}</span>
      ) : null}

      <div className="flex items-end gap-1" dir="ltr">
        {currencyBefore ? <span className="mb-0.5 text-[15px] font-bold text-brand/80">{restaurant.currency}</span> : null}
        <NumberFlow
          value={dish.price}
          locales="en-US"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          className={cn('font-price leading-none font-extrabold tabular-nums text-brand', sizes[size])}
        />
        {!currencyBefore ? <span className="mb-0.5 text-[14px] font-bold text-brand/70">{restaurant.currency}</span> : null}
      </div>

      {dish.oldPrice ? (
        <span className="mb-1 text-[15px] text-cream/35 line-through" dir="ltr">
          {currencyBefore ? `${restaurant.currency}${formatPrice(dish.oldPrice)}` : `${formatPrice(dish.oldPrice)} ${restaurant.currency}`}
        </span>
      ) : null}

      {discount > 0 ? (
        <span className="mb-1 rounded-full bg-ember/85 px-2.5 py-0.5 text-[12px] font-bold text-white">−{discount}%</span>
      ) : null}
    </div>
  );
}
