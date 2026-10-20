/* Motion E — GSAP Flip saat kartu layout bertukar status di tool. */
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Jalankan mutate() di antara Flip state capture agar kartu beranimasi. */
export function animateLayoutFlip(scope: ParentNode, mutate: () => void): void {
  const cards = scope.querySelectorAll('.pk-layout-card');
  if (!cards.length || reduced()) {
    mutate();
    return;
  }
  const state = Flip.getState(cards);
  mutate();
  Flip.from(state, { duration: 0.45, ease: 'power2.inOut', absolute: true });
}
