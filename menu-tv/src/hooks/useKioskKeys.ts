import { useEffect } from 'react';

export interface KioskKeyHandlers {
  categoryCount: number;
  jumpTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  togglePause: () => void;
  onReplayIntro?: () => void;
}

/** يمنع تكبير الصفحة ويوفّر تحكماً كامل بالمنيو من لوحة مفاتيح/ريموت التلفزيون */
export async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    /* بعض أجهزة التلفزيون لا تسمح بذلك — نتجاهل الخطأ */
  }
}

export function useKioskKeys({
  categoryCount,
  jumpTo,
  next,
  prev,
  togglePause,
  onReplayIntro,
}: KioskKeyHandlers) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const { code, key } = event;

      if (code === 'Space') {
        event.preventDefault();
        togglePause();
        return;
      }
      // In the LTR menu, right advances and left goes back.
      if (code === 'ArrowRight') return next();
      if (code === 'ArrowLeft') return prev();
      if (code === 'KeyF') return void toggleFullscreen();
      if (code === 'KeyI') return onReplayIntro?.();

      const num = Number(key);
      if (Number.isInteger(num) && num >= 1 && num <= categoryCount) jumpTo(num - 1);
    };

    const blockContextMenu = (event: MouseEvent) => event.preventDefault();

    window.addEventListener('keydown', onKey);
    window.addEventListener('contextmenu', blockContextMenu);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('contextmenu', blockContextMenu);
    };
  }, [categoryCount, jumpTo, next, prev, togglePause, onReplayIntro]);
}
