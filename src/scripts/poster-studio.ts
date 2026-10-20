/* PosterKit Kilat — studio logic (client island).
   Form -> live SVG preview, localStorage, deep-link, export PNG/SVG/text. */
import type { PosterData, LayoutId, InkId, PairingId } from './poster-svg';
import {
  INKS,
  PAIRINGS,
  LAYOUTS,
  KATEGORI,
  renderPoster,
  buildAnnouncement,
  isTanggalLampau,
  isLayout,
  isInk,
  isPairing,
  getInk,
} from './poster-svg';
import { animateLayoutFlip } from './motion-e';

const STORE_KEY = 'posterkit.v1';

interface StoreShape {
  version: 1;
  data: PosterData;
  layout: LayoutId;
  ink: InkId;
  pairing: PairingId;
}

const DEFAULTS: StoreShape = {
  version: 1,
  data: { judul: '', tanggal: '', lokasi: '', penyelenggara: '', kategori: '', deskripsi: '', kontak: '' },
  layout: 'raksasa',
  ink: 'ungu',
  pairing: 'klasik',
};

function readStore(): StoreShape {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const s = JSON.parse(raw) as Partial<StoreShape>;
    if (s.version !== 1 || typeof s.data !== 'object' || s.data === null) return structuredClone(DEFAULTS);
    const d = s.data as Partial<PosterData>;
    return {
      version: 1,
      data: {
        judul: typeof d.judul === 'string' ? d.judul : '',
        tanggal: typeof d.tanggal === 'string' ? d.tanggal : '',
        lokasi: typeof d.lokasi === 'string' ? d.lokasi : '',
        penyelenggara: typeof d.penyelenggara === 'string' ? d.penyelenggara : '',
        kategori: typeof d.kategori === 'string' ? d.kategori : '',
        deskripsi: typeof d.deskripsi === 'string' ? d.deskripsi : '',
        kontak: typeof d.kontak === 'string' ? d.kontak : '',
      },
      layout: typeof s.layout === 'string' && isLayout(s.layout) ? s.layout : 'raksasa',
      ink: typeof s.ink === 'string' && isInk(s.ink) ? s.ink : 'ungu',
      pairing: typeof s.pairing === 'string' && isPairing(s.pairing) ? s.pairing : 'klasik',
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

function writeStore(state: StoreShape): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage penuh / mode privat — jalan tanpa simpan */
  }
}

function readDeepLink(state: StoreShape): void {
  try {
    const q = new URLSearchParams(location.search);
    const get = (k: string) => (q.get(k) ?? '').slice(0, 500);
    if (get('judul')) state.data.judul = get('judul');
    if (get('tanggal')) state.data.tanggal = get('tanggal');
    if (get('lokasi')) state.data.lokasi = get('lokasi');
    if (get('penyelenggara')) state.data.penyelenggara = get('penyelenggara');
    if (get('kategori') && KATEGORI.includes(get('kategori'))) state.data.kategori = get('kategori');
    if (get('deskripsi')) state.data.deskripsi = get('deskripsi');
    if (get('kontak')) state.data.kontak = get('kontak');
    if (get('layout') && isLayout(get('layout'))) state.layout = get('layout') as LayoutId;
    if (get('tinta') && isInk(get('tinta'))) state.ink = get('tinta') as InkId;
    if (get('pairing') && isPairing(get('pairing'))) state.pairing = get('pairing') as PairingId;
  } catch {
    /* abaikan deep-link rusak */
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Collect @font-face CSS for the families used, with absolute URLs, for PNG export. */
function fontFaceCss(): string {
  const want = ['Tiro Bangla', 'Brawler', 'Flow Rounded'];
  const out: string[] = [];
  try {
    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin
      }
      for (const r of Array.from(rules)) {
        if (r instanceof CSSFontFaceRule) {
          const fam = r.style.getPropertyValue('font-family').replace(/['"]/g, '');
          if (want.some((w) => fam.includes(w))) {
            const css = r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, (_m, _q, u: string) => {
              try {
                return `url("${new URL(u, location.origin).href}")`;
              } catch {
                return `url("${u}")`;
              }
            });
            out.push(css);
          }
        }
      }
    }
  } catch {
    /* tanpa font embed — export pakai fallback serif */
  }
  return out.join('\n');
}

function svgToPngBlob(svgEl: SVGSVGElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', '2160');
    clone.setAttribute('height', '2700');
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = fontFaceCss();
    clone.insertBefore(style, clone.firstChild);
    const svgText = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 2160;
        canvas.height = 2700;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no-2d');
        ctx.drawImage(img, 0, 0, 2160, 2700);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob gagal'))), 'image/png');
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('render SVG gagal'));
    };
    img.src = url;
  });
}

export function initPosterStudio(root: HTMLElement): () => void {
  const state = readStore();
  readDeepLink(state);

  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const preview = $('#pk-preview') as HTMLElement;
  const stampLayer = $('#pk-stamp-layer') as HTMLElement;
  const status = $('#pk-status') as HTMLElement;
  const judulError = $('#pk-judul-error') as HTMLElement;
  const tanggalWarning = $('#pk-tanggal-warning') as HTMLElement;

  const inputs = {
    judul: $('#pk-judul') as HTMLInputElement,
    tanggal: $('#pk-tanggal') as HTMLInputElement,
    lokasi: $('#pk-lokasi') as HTMLInputElement,
    penyelenggara: $('#pk-penyelenggara') as HTMLInputElement,
    kategori: $('#pk-kategori') as HTMLSelectElement,
    deskripsi: $('#pk-deskripsi') as HTMLTextAreaElement,
    kontak: $('#pk-kontak') as HTMLInputElement,
  };

  const say = (msg: string) => {
    status.textContent = msg;
  };

  // isi form dari state
  inputs.judul.value = state.data.judul;
  inputs.tanggal.value = state.data.tanggal;
  inputs.lokasi.value = state.data.lokasi;
  inputs.penyelenggara.value = state.data.penyelenggara;
  inputs.deskripsi.value = state.data.deskripsi;
  inputs.kontak.value = state.data.kontak;
  if (state.data.kategori && KATEGORI.includes(state.data.kategori)) inputs.kategori.value = state.data.kategori;

  const paintPickers = () => {
    root.querySelectorAll<HTMLButtonElement>('.pk-layout-card').forEach((b) => {
      const active = b.dataset.layout === state.layout;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('is-active', active);
    });
    root.querySelectorAll<HTMLButtonElement>('.pk-ink').forEach((b) => {
      const active = b.dataset.ink === state.ink;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('is-active', active);
    });
    root.querySelectorAll<HTMLButtonElement>('.pk-pairing').forEach((b) => {
      const active = b.dataset.pairing === state.pairing;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('is-active', active);
    });
  };

  const validate = (): boolean => {
    const empty = !state.data.judul.trim();
    judulError.hidden = !empty;
    inputs.judul.setAttribute('aria-invalid', String(empty));
    const past = isTanggalLampau(state.data.tanggal);
    tanggalWarning.hidden = !past;
    return !empty;
  };

  const render = () => {
    const t0 = performance.now();
    preview.innerHTML = renderPoster(state.data, state.layout, state.ink, state.pairing);
    const ms = performance.now() - t0;
    if (ms > 200) say(`Pratinjau diperbarui (${Math.round(ms)} mdtk — agak lambat).`);
  };

  const paintInputs = () => {
    inputs.judul.value = state.data.judul;
    inputs.tanggal.value = state.data.tanggal;
    inputs.lokasi.value = state.data.lokasi;
    inputs.penyelenggara.value = state.data.penyelenggara;
    inputs.kategori.value = state.data.kategori;
    inputs.deskripsi.value = state.data.deskripsi;
    inputs.kontak.value = state.data.kontak;
  };

  const sync = (fromDeepLink = false) => {
    state.data.judul = inputs.judul.value;
    state.data.tanggal = inputs.tanggal.value;
    state.data.lokasi = inputs.lokasi.value;
    state.data.penyelenggara = inputs.penyelenggara.value;
    state.data.kategori = inputs.kategori.value;
    state.data.deskripsi = inputs.deskripsi.value;
    state.data.kontak = inputs.kontak.value;
    validate();
    render();
    if (!fromDeepLink) writeStore(state);
  };

  const onInput = () => sync();
  Object.values(inputs).forEach((el) => el.addEventListener('input', onInput));

  root.querySelectorAll<HTMLButtonElement>('.pk-layout-card').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.layout ?? '';
      if (!isLayout(id) || id === state.layout) return;
      animateLayoutFlip(root, () => {
        state.layout = id;
        paintPickers();
      });
      render();
      writeStore(state);
      say(`Layout ${LAYOUTS.find((l) => l.id === id)?.nama} dipakai.`);
    })
  );

  root.querySelectorAll<HTMLButtonElement>('.pk-ink').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.ink ?? '';
      if (!isInk(id)) return;
      state.ink = id;
      paintPickers();
      render();
      writeStore(state);
      say(`Tinta ${getInk(id).nama.toLowerCase()} dipakai.`);
    })
  );

  root.querySelectorAll<HTMLButtonElement>('.pk-pairing').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.pairing ?? '';
      if (!isPairing(id)) return;
      state.pairing = id;
      paintPickers();
      render();
      writeStore(state);
    })
  );

  // unduh PNG
  ($('#pk-download') as HTMLButtonElement).addEventListener('click', async () => {
    if (!validate()) {
      say('Judulnya kosong — tulis dulu biar bisa dicetak.');
      inputs.judul.focus();
      return;
    }
    const svgEl = preview.querySelector('svg.pk-poster-svg');
    if (!svgEl) return;
    const btn = $('#pk-download') as HTMLButtonElement;
    btn.disabled = true;
    say('Mencetak PNG…');
    try {
      const blob = await svgToPngBlob(svgEl as SVGSVGElement);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'posterkilat-poster.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      say('Poster dicetak! File PNG sudah diunduh.');
    } catch {
      say('Gagal mencetak PNG — coba lagi.');
    } finally {
      btn.disabled = false;
    }
  });

  // salin SVG
  ($('#pk-copy-svg') as HTMLButtonElement).addEventListener('click', async () => {
    if (!validate()) {
      say('Judulnya kosong — tulis dulu biar bisa dicetak.');
      inputs.judul.focus();
      return;
    }
    const svgEl = preview.querySelector('svg.pk-poster-svg');
    if (!svgEl) return;
    const ok = await copyText(new XMLSerializer().serializeToString(svgEl));
    say(ok ? 'Kode SVG tersalin.' : 'Gagal menyalin — browser menolak akses clipboard.');
  });

  // salin teks pengumuman
  ($('#pk-copy-text') as HTMLButtonElement).addEventListener('click', async () => {
    if (!validate()) {
      say('Judulnya kosong — tulis dulu biar bisa dicetak.');
      inputs.judul.focus();
      return;
    }
    const ok = await copyText(buildAnnouncement(state.data));
    say(ok ? 'Teks pengumuman tersalin.' : 'Gagal menyalin — browser menolak akses clipboard.');
  });

  // easter egg: tekan K -> stempel KILAT jatuh
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.matches('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.toLowerCase() !== 'k') return;
    const ink = getInk(state.ink);
    const el = document.createElement('div');
    el.className = 'pk-stamp-drop';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="-140 -140 280 280" width="180" height="180">
      <circle r="120" fill="${ink.stamp}"/>
      <circle r="110" fill="none" stroke="${ink.stampText}" stroke-width="4" stroke-dasharray="10 7"/>
      <text text-anchor="middle" dy="-8" font-family="'Brawler', Georgia, serif" font-weight="700" font-size="44" fill="${ink.stampText}">KILAT</text>
      <text text-anchor="middle" dy="34" font-family="'Flow Rounded', cursive" font-size="30" fill="${ink.stampText}">cetak cepat</text>
    </svg>`;
    stampLayer.appendChild(el);
    setTimeout(() => el.remove(), 4000);
    say('Stempel KILAT mendarat.');
  };
  document.addEventListener('keydown', onKey);

  paintPickers();
  paintInputs();
  sync(true);

  return () => {
    document.removeEventListener('keydown', onKey);
    Object.values(inputs).forEach((el) => el.removeEventListener('input', onInput));
  };
}

export { INKS, PAIRINGS, LAYOUTS, KATEGORI };
