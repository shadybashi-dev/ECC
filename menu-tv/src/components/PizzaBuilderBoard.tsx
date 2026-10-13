import type { PizzaBuilderOptions } from '../types';

function ChoicePanel({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="glass flex min-h-0 flex-col overflow-hidden rounded-[22px] p-4">
      <h3 className="font-kufi text-[20px] font-bold tracking-wide text-brand-soft">{title}</h3>
      <div className="mt-3 flex flex-wrap content-start gap-2 overflow-hidden">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[14px] font-semibold text-cream/85"
          >
            {value}
          </span>
        ))}
      </div>
    </section>
  );
}

function dollars(amount: number) {
  return `$${amount.toFixed(2)}`;
}

/** The dedicated build-your-own screen keeps the menu's full option and size table readable on TV. */
export function PizzaBuilderBoard({ options }: { options: PizzaBuilderOptions }) {
  const priceRows = [
    { key: 'cheese' as const, label: 'CHEESE', color: 'text-cream' },
    { key: 'extras' as const, label: 'EXTRA TOPPINGS', color: 'text-brand-soft' },
    { key: 'gourmet' as const, label: 'GOURMET', color: 'text-mint' },
  ];

  return (
    <div className="pizza-builder-board grid h-full min-h-0 grid-rows-[minmax(0,0.9fr)_minmax(0,1fr)] gap-3.5">
      <div className="grid min-h-0 grid-cols-[1fr_0.74fr_1.5fr] gap-3.5">
        <ChoicePanel title="Crust Options" values={options.crusts} />
        <ChoicePanel title="Sauces" values={options.sauces} />
        <ChoicePanel title="Toppings" values={options.toppings} />
      </div>

      <section className="glass flex min-h-0 flex-col overflow-hidden rounded-[22px] px-4 py-3.5">
        <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
          <h3 className="font-kufi text-[20px] font-bold tracking-wide text-brand-soft">Size Options</h3>
          <p className="text-[13px] font-semibold tracking-[0.13em] text-cream/40">CHEESE · EXTRAS · GOURMET</p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[136px_repeat(7,minmax(0,1fr))] grid-rows-[1.05fr_repeat(3,1fr)] items-center gap-x-1.5">
          <div />
          {options.sizes.map((size) => (
            <div key={size.size} className="flex flex-col items-center justify-center text-center">
              <span className="font-price text-[23px] leading-none font-extrabold text-brand">{size.size}</span>
              <span className="mt-1 text-[13px] font-bold text-cream/65">{size.label}</span>
            </div>
          ))}

          {priceRows.map((row) => (
            <div key={row.key} className="contents">
              <div className={`text-[13px] font-extrabold tracking-[0.12em] ${row.color}`}>{row.label}</div>
              {options.sizes.map((size) => (
                <div
                  key={`${row.key}-${size.size}`}
                  className={`text-center font-price text-[21px] font-bold tabular-nums ${row.color}`}
                >
                  {dollars(size[row.key])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
