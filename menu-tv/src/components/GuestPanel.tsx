import { QRCodeSVG } from 'qrcode.react';
import { Pizza, QrCode, Sparkles } from 'lucide-react';
import { pizzaBuilder, restaurant } from '../data/menu';

const builderStats = [
  { value: pizzaBuilder.crusts.length, label: 'crusts' },
  { value: pizzaBuilder.sauces.length, label: 'sauces' },
  { value: pizzaBuilder.sizes.length, label: 'sizes' },
];

/** A useful build-your-own promo by default; a real order QR appears when a URL is configured. */
export function GuestPanel() {
  if (restaurant.orderUrl) {
    return (
      <section className="glass flex flex-1 items-center gap-6 overflow-hidden rounded-[30px] px-6 py-5">
        <div className="shrink-0 rounded-[22px] bg-[#fdf6ea] p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]">
          <QRCodeSVG
            value={restaurant.orderUrl}
            size={132}
            level="M"
            bgColor="#fdf6ea"
            fgColor="#17110c"
            marginSize={0}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.17em] text-brand-soft">
            <QrCode className="size-4" />
            SCAN TO ORDER
          </div>
          <h3 className="font-kufi text-[26px] font-bold text-cream">Order online</h3>
          <p className="mt-1 break-all text-[14px] leading-relaxed text-cream/55">{restaurant.orderUrl}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass flex flex-1 flex-col justify-center gap-4 overflow-hidden rounded-[30px] px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="flex size-[70px] shrink-0 items-center justify-center rounded-[22px] border border-brand/25 bg-brand/10">
          <Pizza className="size-10 text-brand" strokeWidth={1.7} />
        </div>
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-[12px] font-extrabold tracking-[0.17em] text-brand-soft">
            <Sparkles className="size-3.5" />
            YOUR PIZZA, YOUR WAY
          </div>
          <h3 className="font-kufi text-[25px] font-bold text-cream">Make it yours</h3>
          <p className="mt-1 text-[14.5px] leading-relaxed text-cream/55">Choose a crust, sauce and toppings—or explore a gourmet favorite.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/8 pt-3">
        {builderStats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-center gap-2 rounded-xl bg-white/[0.035] py-2">
            <span className="font-price text-[26px] font-extrabold tabular-nums text-brand">{stat.value}</span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-cream/50">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
