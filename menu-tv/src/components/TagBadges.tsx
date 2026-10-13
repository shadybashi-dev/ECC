import { ChefHat, Flame, Leaf, Sparkles, Star, type LucideIcon } from 'lucide-react';
import type { Tag } from '../types';
import { cn } from '../lib/cn';

export const tagMeta: Record<Tag, { label: string; icon: LucideIcon; className: string }> = {
  spicy: {
    label: 'Spicy',
    icon: Flame,
    className: 'border-ember/40 bg-ember/20 text-[#ffc2b8]',
  },
  veg: {
    label: 'Vegetarian',
    icon: Leaf,
    className: 'border-mint/40 bg-mint/20 text-[#ccefd4]',
  },
  new: {
    label: 'New',
    icon: Sparkles,
    className: 'border-aqua/40 bg-aqua/20 text-[#c8f0f4]',
  },
  chef: {
    label: "Chef's Pick",
    icon: ChefHat,
    className: 'border-brand/40 bg-brand/20 text-brand-soft',
  },
  bestseller: {
    label: 'Popular',
    icon: Star,
    className: 'border-white/25 bg-white/12 text-cream/90',
  },
};

export function TagBadges({ tags, compact = false }: { tags?: Tag[]; compact?: boolean }) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => {
        const meta = tagMeta[tag];
        const Icon = meta.icon;
        return (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-bold backdrop-blur-sm',
              meta.className,
            )}
          >
            <Icon className="size-[13px]" strokeWidth={2.2} />
            <span className={compact ? 'sr-only' : undefined}>{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}
