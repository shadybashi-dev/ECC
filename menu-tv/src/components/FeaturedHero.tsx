import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Keyboard, Pagination } from 'swiper/modules';
import { Sparkles } from 'lucide-react';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Price } from './Price';
import { TagBadges } from './TagBadges';

/**
 * الواجهة المميزة: معرض دوّار (Swiper) بأجمل أطباق القسم الحالي،
 * بحركة effect-creative وسلّم أسعار متحرك.
 */
export function FeaturedHero({ category }: { category: Category }) {
  const slides = category.items.filter((dish) => dish.image);
  const gallery = slides.length > 0 ? slides : category.items;

  return (
    <section
      className="glass-deep hero-mask relative h-[552px] shrink-0 overflow-hidden rounded-[30px]"
      style={{ boxShadow: `0 50px 90px -60px rgba(0,0,0,1), 0 0 70px -34px ${category.accent}66` }}
    >
      <Swiper
        key={category.id}
        dir="ltr"
        className="h-full w-full"
        modules={[Autoplay, EffectCreative, Keyboard, Pagination]}
        slidesPerView={1}
        loop={gallery.length > 1}
        speed={950}
        effect="creative"
        creativeEffect={{
          limitProgress: 1,
          prev: { translate: ['-16%', 0, -1], opacity: 0.25, scale: 0.93 },
          next: { translate: ['16%', 0, -1], opacity: 0.25, scale: 0.93 },
        }}
        autoplay={{ delay: 5600, disableOnInteraction: false, pauseOnMouseEnter: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
      >
        {gallery.map((dish) => (
          <SwiperSlide key={dish.id}>
            <article className="relative h-full w-full">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: `radial-gradient(60% 60% at 50% 35%, ${category.accent}33, #0b111b 75%)` }}
                >
                  <CategoryIcon name={category.icon} className="size-40 text-cream/10" />
                </div>
              )}

              <div className="scrim-soft absolute inset-0" />
              <div className="scrim absolute inset-0" />

              <div className="relative flex h-full flex-col justify-end gap-2.5 p-8 pb-14">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full border px-3.5 py-1 text-[14px] font-bold"
                    style={{
                      background: `${category.accent}26`,
                      borderColor: `${category.accent}66`,
                      color: category.accent,
                    }}
                  >
                    {category.name}
                  </span>
                  <TagBadges tags={dish.tags} />
                </div>

                <h3 className="title-glow font-kufi text-[44px] leading-tight font-bold text-cream">
                  {dish.name}
                </h3>
                {dish.desc ? (
                  <p className="line-clamp-2 max-w-[94%] text-[18px] leading-relaxed text-cream/70">
                    {dish.desc}
                  </p>
                ) : null}

                <div className="flex items-end justify-between pt-1">
                  <Price dish={dish} size="lg" />
                  {dish.kcal ? (
                    <span className="mb-1 text-[15px] text-cream/45">{dish.kcal} kcal</span>
                  ) : null}
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="glass pointer-events-none absolute top-6 left-6 flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-bold text-cream">
        <Sparkles className="size-4 text-brand" strokeWidth={2.2} />
        Featured
      </div>
    </section>
  );
}
