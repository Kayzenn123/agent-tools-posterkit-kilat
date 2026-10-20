/* Motion D — cursor spotlight mask. Hanya pointer: fine (desktop). */
export function initMotionD(): () => void {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};
  const layer = document.querySelector<HTMLElement>('.pk-spotlight');
  if (!layer) return () => {};

  let raf = 0;
  let shown = false;
  const onMove = (e: PointerEvent) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      layer.style.setProperty('--mx', `${e.clientX}px`);
      layer.style.setProperty('--my', `${e.clientY}px`);
      if (!shown) {
        shown = true;
        layer.classList.add('on');
      }
    });
  };
  const onLeave = () => {
    shown = false;
    layer.classList.remove('on');
  };
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(raf);
    layer.classList.remove('on');
  };
}
