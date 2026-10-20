/* Motion A — kamera "terbang" lewat huruf raksasa (scroll scrub).
   Narasi: pengunjung masuk ke dalam mesin cetak; huruf KILAT jadi pintu antar section. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotionA(opts: { lite: boolean }): () => void {
  const word = document.querySelector<HTMLElement>('[data-fly-word]');
  const start = document.querySelector<HTMLElement>('[data-fly-start]');
  const end = document.querySelector<HTMLElement>('[data-fly-end]');
  if (!word || !start || !end) return () => {};

  const cleanups: (() => void)[] = [];

  if (opts.lite) {
    // mode ringan: hanya fade, tanpa scale/rotate besar
    const tween = gsap.fromTo(
      word,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: start, start: 'bottom center', end: 'bottom top', scrub: 0.5 },
      }
    );
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(word, { clearProps: 'all' });
    });
    return () => cleanups.forEach((c) => c());
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: start,
      start: 'bottom 70%',
      endTrigger: end,
      end: 'top 60%',
      scrub: 0.5,
    },
  });
  // fase 1: huruf KILAT membesar memenuhi layar (pintu masuk)
  tl.fromTo(
    word,
    { scale: 0.6, yPercent: 30, rotation: -4, opacity: 0 },
    { scale: 1.6, yPercent: -10, rotation: 4, opacity: 1, ease: 'none', duration: 0.5 }
  );
  // fase 2: kamera "masuk" lewat huruf — membesar lalu memudar
  tl.to(word, { scale: 2.2, yPercent: -40, rotation: -2, opacity: 0, ease: 'none', duration: 0.5 });
  cleanups.push(() => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(word, { clearProps: 'all' });
  });

  // seksi di dalam "ruang" huruf ikut melayang pelan
  document.querySelectorAll<HTMLElement>('[data-fly-drift]').forEach((el) => {
    const tw = gsap.to(el, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
    cleanups.push(() => {
      tw.scrollTrigger?.kill();
      tw.kill();
      gsap.set(el, { clearProps: 'all' });
    });
  });

  return () => cleanups.forEach((c) => c());
}
