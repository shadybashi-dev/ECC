import NumberFlow from '@number-flow/react';
import { Sparkles } from 'lucide-react';
import { promo, restaurant } from '../data/menu';
import { useNow } from '../hooks/useNow';
import { Logo } from './Logo';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

function Ticker() {
  const lines = [...promo, ...promo];

  return (
    <div className="glass relative mx-3 h-[58px] flex-1 overflow-hidden rounded-full">
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#101a29] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#101a29] to-transparent" />
      <div className="marquee h-full items-center">
        {lines.map((line, index) => (
          <span
            key={`${line.id}-${index}`}
            className="flex h-full shrink-0 items-center gap-3 px-7 text-[20px] font-medium whitespace-nowrap text-cream/85"
          >
            <Sparkles className="size-4 shrink-0 text-brand" strokeWidth={2} />
            {line.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TopBar() {
  const now = useNow(1000);

  return (
    <header className="relative z-20 flex h-[104px] shrink-0 items-center gap-5 px-10">
      <div className="flex shrink-0 items-center gap-3.5">
        <Logo className="size-[54px]" />
        <div className="leading-tight">
          <div className="font-kufi text-[27px] font-extrabold tracking-wide text-cream">{restaurant.name}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] tracking-wide text-brand-soft/75">
            <Sparkles className="size-3.5" strokeWidth={2} />
            {restaurant.tagline}
          </div>
        </div>
      </div>

      <Ticker />

      <div className="flex shrink-0 items-center gap-5">
        <div className="text-left">
          <div
            className="flex items-center justify-start gap-1 font-price text-[36px] leading-none font-bold tabular-nums text-cream"
            dir="ltr"
          >
            <NumberFlow value={now.getHours()} format={{ minimumIntegerDigits: 2 }} />
            <span className="breathe text-brand">:</span>
            <NumberFlow value={now.getMinutes()} format={{ minimumIntegerDigits: 2 }} />
          </div>
          <div className="mt-1.5 text-[12.5px] text-cream/45">{dateFormatter.format(now)}</div>
        </div>

        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3">
          <Sparkles className="size-4 text-brand" strokeWidth={2} />
          <span className="text-[12px] font-bold tracking-[0.14em] text-cream/75">MENU BOARD</span>
        </div>
      </div>
    </header>
  );
}
