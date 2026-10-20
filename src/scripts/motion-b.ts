/* Motion B — 2 pita marquee berlawanan arah + skew mengikuti kecepatan scroll.
   Pita berjalan >5 detik wajib punya tombol jeda (aria). */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotionB(opts: { lite: boolean }): () => void {
  const cleanups: (() => void)[] = [];

  // tombol jeda selalu aktif (bahkan saat gerak mati total, pita statis)
  document.querySelectorAll<HTMLElement>('.pk-marquee').forEach((band) => {
    const btn = band.querySelector<HTMLButtonElement>('.pk-marquee-pause');
    if (!btn) return;
    const onClick = () => {
      const paused = band.classList.toggle('pk-marquee-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.textContent = paused ? 'Jalankan pita' : 'Jeda pita';
    };
    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  });

  if (opts.lite) {
    document.querySelectorAll('.pk-marquee').forEach((b) => b.classList.add('pk-marquee-paused'));
    return () => cleanups.forEach((c) => c());
  }

  // skew mengikuti velocity scroll
  const tracks = [...document.querySelectorAll<HTMLElement>('.pk-marquee-track')];
  const clamp = gsap.utils.clamp(-12, 12);
  let raf = 0;
  const st = ScrollTrigger.create({
    onUpdate: (self) => {
      const v = clamp(self.getVelocity() / 250);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tracks.forEach((track) => {
          gsap.set(track, { skewX: v });
          gsap.to(track, { skewX: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
        });
      });
    },
  });
  cleanups.push(() => {
    st.kill();
    cancelAnimationFrame(raf);
    tracks.forEach((track) => gsap.set(track, { clearProps: 'transform' }));
  });

  return () => cleanups.forEach((c) => c());
}
