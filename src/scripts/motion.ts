/* Orkestrator gerak PosterKit Kilat.
   - prefers-reduced-motion -> semua mati, halaman statis
   - toggle footer "Gerak: nyala/mati" (tersimpan di localStorage)
   - mode ringan otomatis: hardwareConcurrency<=4 / deviceMemory<=4 / Save-Data / FPS<40 selama 2 detik
     -> D mati, A disederhanakan, marquee statis */
import { initMotionA } from './motion-a';
import { initMotionB } from './motion-b';
import { initMotionC } from './motion-c';
import { initMotionD } from './motion-d';

const PREF_KEY = 'posterkit.motion';

type Destroy = () => void;
let destroys: Destroy[] = [];

function detectLite(): boolean {
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
    const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (dm && dm <= 4) return true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return true;
  } catch {
    /* abaikan */
  }
  return false;
}

/** Ukur FPS 2 detik; kalau <40, nyalakan mode ringan. */
function watchFps(onSlow: () => void): void {
  let frames = 0;
  const start = performance.now();
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    frames++;
    const elapsed = performance.now() - start;
    if (elapsed >= 2000) {
      stopped = true;
      if (frames / (elapsed / 1000) < 40) onSlow();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  destroys.push(() => {
    stopped = true;
  });
}

function teardown(): void {
  destroys.forEach((d) => {
    try {
      d();
    } catch {
      /* abaikan */
    }
  });
  destroys = [];
}

function boot(lite: boolean): void {
  teardown();
  destroys.push(initMotionA({ lite }));
  destroys.push(initMotionB({ lite }));
  if (!lite) {
    destroys.push(initMotionC());
    destroys.push(initMotionD());
  }
}

export function initMotion(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle = document.querySelector<HTMLButtonElement>('#pk-motion-toggle');

  let pref: string | null = null;
  try {
    pref = localStorage.getItem(PREF_KEY);
  } catch {
    /* abaikan */
  }
  const userOff = pref === 'off';

  const paintToggle = (on: boolean) => {
    if (toggle) {
      toggle.textContent = on ? 'Gerak: nyala' : 'Gerak: mati';
      toggle.setAttribute('aria-pressed', String(on));
    }
  };

  if (reduced || userOff) {
    paintToggle(false);
    // pastikan marquee statis + tombol jeda tetap jalan
    destroys.push(initMotionB({ lite: true }));
  } else {
    const lite = detectLite();
    paintToggle(true);
    boot(lite);
    if (!lite) {
      watchFps(() => {
        // turun ke mode ringan di tengah jalan
        boot(true);
      });
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOn = toggle.getAttribute('aria-pressed') === 'true';
      const willBe = !isOn;
      const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try {
        localStorage.setItem(PREF_KEY, willBe ? 'on' : 'off');
      } catch {
        /* abaikan */
      }
      if (willBe && !osReduced) {
        boot(detectLite());
        paintToggle(true);
      } else {
        // mati: hentikan semua, marquee jadi statis
        teardown();
        destroys.push(initMotionB({ lite: true }));
        paintToggle(false);
      }
    });
  }

  // hormati perubahan preferensi OS saat halaman terbuka
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      teardown();
      destroys.push(initMotionB({ lite: true }));
      paintToggle(false);
    }
  });
}
