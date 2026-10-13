import {
  CakeSlice,
  Coffee,
  Drumstick,
  Flame,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  BadgePercent,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../types';

const icons: Record<IconName, LucideIcon> = {
  salad: Salad,
  flame: Flame,
  sandwich: Sandwich,
  pizza: Pizza,
  dessert: CakeSlice,
  drink: Coffee,
  offers: BadgePercent,
  soup: Soup,
  breakfast: Drumstick,
};

export function CategoryIcon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name] ?? Flame;
  return <Cmp className={className} strokeWidth={1.8} aria-hidden />;
}
