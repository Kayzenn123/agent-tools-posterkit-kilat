/* Motion C — divider teks melengkung (SVG textPath "PILIH — RACIK — CETAK").
   Masuk dengan reveal + melayang pelan mengikuti scroll. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotionC(): () => void {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-curve-divider]').forEach((el) => {
    const reveal = gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
    const drift = gsap.to(el, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
    cleanups.push(() => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      drift.scrollTrigger?.kill();
      drift.kill();
      gsap.set(el, { clearProps: 'all' });
    });
  });
  return () => cleanups.forEach((c) => c());
}
