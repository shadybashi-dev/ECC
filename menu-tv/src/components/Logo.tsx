import { cn } from '../lib/cn';

/** A small, neutral pizza-mark used until a restaurant logo is supplied. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('shrink-0', className)} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="rgba(245,181,68,0.11)" />
      <path
        d="M15 22 C35 8 65 8 85 22 L50 88 Z"
        fill="#f5b544"
        stroke="#fff1d7"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M15 22 C35 8 65 8 85 22" fill="none" stroke="#ad4e32" strokeWidth="8" strokeLinecap="round" />
      <circle cx="39" cy="34" r="5.5" fill="#d7483e" />
      <circle cx="63" cy="35" r="5.5" fill="#d7483e" />
      <circle cx="51" cy="58" r="5.5" fill="#d7483e" />
      <path d="M31 50 C36 43 42 44 43 51 C39 56 34 55 31 50Z" fill="#51855a" />
      <path d="M59 70 C64 62 71 64 71 71 C66 75 62 75 59 70Z" fill="#51855a" />
    </svg>
  );
}
