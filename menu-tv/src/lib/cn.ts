import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** دمج أصناف Tailwind بذكاء */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تنسيق السعر بالأرقام اللاتينية مع رقمين عشريين عند الحاجة */
export function formatPrice(value: number) {
  return value.toFixed(2);
}

export const cx = cn;
