/* PosterKit Kilat — pure-typography poster SVG builder (1080x1350).
   Shared by the full studio and the landing mini press. No raster images. */

export interface PosterData {
  judul: string;
  tanggal: string; // ISO yyyy-mm-dd or ''
  lokasi: string;
  penyelenggara: string;
  kategori: string;
  deskripsi: string;
  kontak: string;
}

export type LayoutId = 'raksasa' | 'grid-swiss' | 'diagonal' | 'kartu';
export type InkId = 'ungu' | 'malam' | 'kusam' | 'biru' | 'bata' | 'arang';
export type PairingId = 'klasik' | 'jalanan' | 'arsip';

export interface Ink {
  id: InkId;
  nama: string;
  paper: string;
  ink: string;
  accent: string;
  stamp: string;
  stampText: string;
}

export const INKS: Ink[] = [
  {
    id: 'ungu',
    nama: 'Tinta ungu',
    paper: '#efeaf7',
    ink: '#2b2536',
    accent: '#8f7fd6',
    stamp: '#c8e64a',
    stampText: '#2b2536',
  },
  {
    id: 'malam',
    nama: 'Tinta malam',
    paper: '#232030',
    ink: '#f2eefa',
    accent: '#9a6ee0',
    stamp: '#c8e64a',
    stampText: '#2b2536',
  },
  {
    id: 'kusam',
    nama: 'Kertas kusam',
    paper: '#e9e3d1',
    ink: '#3a3428',
    accent: '#7c6fd0',
    stamp: '#c8e64a',
    stampText: '#2b2536',
  },
  {
    id: 'biru',
    nama: 'Segel biru',
    paper: '#dde7f2',
    ink: '#20304a',
    accent: '#4a7fd6',
    stamp: '#c8e64a',
    stampText: '#2b2536',
  },
  {
    id: 'bata',
    nama: 'Bata',
    paper: '#f2e3d6',
    ink: '#3a2a24',
    accent: '#c96a4a',
    stamp: '#2b2536',
    stampText: '#f2e3d6',
  },
  {
    id: 'arang',
    nama: 'Arang',
    paper: '#26262b',
    ink: '#f4f1e8',
    accent: '#8f7fd6',
    stamp: '#c8e64a',
    stampText: '#2b2536',
  },
];

export interface Pairing {
  id: PairingId;
  nama: string;
  display: string;
  body: string;
}

export const PAIRINGS: Pairing[] = [
  { id: 'klasik', nama: 'Klasik cetak', display: "'Tiro Bangla', Georgia, serif", body: "'Brawler', Georgia, serif" },
  { id: 'jalanan', nama: 'Poster jalanan', display: "'Flow Rounded', cursive", body: "'Brawler', Georgia, serif" },
  { id: 'arsip', nama: 'Arsip', display: "'Brawler', Georgia, serif", body: "'Brawler', Georgia, serif" },
];

export const LAYOUTS: { id: LayoutId; nama: string; deskripsi: string }[] = [
  { id: 'raksasa', nama: 'Raksasa', deskripsi: 'Judul sebesar-besarnya, satu pesan.' },
  { id: 'grid-swiss', nama: 'Grid Swiss', deskripsi: 'Kotak-kotak rapi ala cetakan.' },
  { id: 'diagonal', nama: 'Diagonal', deskripsi: 'Garis miring penuh energi.' },
  { id: 'kartu', nama: 'Kartu', deskripsi: 'Pengumuman klasik berbingkai.' },
];

export const KATEGORI = [
  'Desain Poster',
  'Fotografi',
  'Esai',
  'Debat',
  'Hackathon',
  'E-Sport',
  'Futsal',
  'Badminton',
  'Memasak',
  'Menyanyi',
  'Cerdas Cermat',
  'Mewarnai Anak',
];

export const W = 1080;
export const H = 1350;

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Rough width estimate for fitting text (avg glyph ~0.52em for display faces). */
function estWidth(text: string, size: number, factor = 0.52): number {
  return text.length * size * factor;
}

function fitSize(text: string, maxWidth: number, base: number, min = 24, factor = 0.52): number {
  let size = base;
  while (size > min && estWidth(text, size, factor) > maxWidth) size -= 4;
  return size;
}

/** Greedy word wrap by estimated width. */
export function wrapLines(text: string, maxWidth: number, size: number, factor = 0.5): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (estWidth(next, size, factor) <= maxWidth || !cur) cur = next;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function formatTanggal(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    return iso;
  }
}

export function isTanggalLampau(iso: string): boolean {
  if (!iso) return false;
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

function dashedLine(x1: number, y1: number, x2: number, y2: number, color: string, w = 3, dash = '14 10'): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" />`;
}

function stamp(cx: number, cy: number, ink: Ink, size = 1): string {
  const r = 120 * size;
  return `<g transform="translate(${cx} ${cy}) rotate(-8)">
    <circle r="${r}" fill="${ink.stamp}" />
    <circle r="${r - 10 * size}" fill="none" stroke="${ink.stampText}" stroke-width="${4 * size}" stroke-dasharray="10 7" />
    <text text-anchor="middle" dy="${-8 * size}" font-family="'Brawler', Georgia, serif" font-weight="700" font-size="${44 * size}" fill="${ink.stampText}">KILAT</text>
    <text text-anchor="middle" dy="${34 * size}" font-family="'Flow Rounded', cursive" font-size="${30 * size}" fill="${ink.stampText}">cetak cepat</text>
  </g>`;
}

function metaRow(x: number, y: number, label: string, value: string, ink: Ink, p: Pairing): string {
  const v = esc(value);
  return `<text x="${x}" y="${y}" font-family="'Flow Rounded', cursive" font-size="26" letter-spacing="4" fill="${ink.accent}">${esc(label)}</text>
  <text x="${x}" y="${y + 44}" font-family="${p.body}" font-size="34" fill="${ink.ink}">${v}</text>`;
}

function descBlock(
  text: string,
  x: number,
  y: number,
  maxW: number,
  size: number,
  ink: Ink,
  p: Pairing,
  anchor: 'start' | 'middle' = 'start'
): string {
  const lines = wrapLines(text.slice(0, 200), maxW, size).slice(0, 4);
  return lines
    .map(
      (ln, i) =>
        `<text x="${x}" y="${y + i * size * 1.45}" text-anchor="${anchor}" font-family="${p.body}" font-size="${size}" fill="${ink.ink}">${esc(ln)}</text>`
    )
    .join('\n');
}

function titleBlock(
  lines: string[],
  x: number,
  y: number,
  size: number,
  ink: Ink,
  p: Pairing,
  anchor: 'start' | 'middle' = 'start',
  lh = 1.04
): string {
  return lines
    .map(
      (ln, i) =>
        `<text x="${x}" y="${y + i * size * lh}" text-anchor="${anchor}" font-family="${p.display}" font-size="${size}" fill="${ink.ink}">${esc(ln)}</text>`
    )
    .join('\n');
}

/* ---------------- layouts ---------------- */

function layoutRaksasa(d: PosterData, ink: Ink, p: Pairing): string {
  const words = d.judul.trim().split(/\s+/);
  // one word per line, giant
  let size = 170;
  const maxW = 960;
  for (const w of words) size = Math.min(size, fitSize(w, maxW, 170, 60, 0.56));
  const lh = size * 1.02;
  const startY = 300;
  const totalH = words.length * lh;
  const metaY = Math.min(startY + totalH + 90, 1080);

  const tanggal = formatTanggal(d.tanggal);
  let meta = '';
  if (tanggal)
    meta += `<text x="60" y="${metaY}" font-family="${p.body}" font-size="36" fill="${ink.ink}">${esc(tanggal)}</text>`;
  if (d.lokasi)
    meta += `<text x="60" y="${metaY + 52}" font-family="${p.body}" font-size="36" fill="${ink.ink}">${esc(d.lokasi)}</text>`;
  if (d.penyelenggara)
    meta += `<text x="60" y="${metaY + 104}" font-family="'Flow Rounded', cursive" font-size="28" fill="${ink.accent}">oleh ${esc(d.penyelenggara)}</text>`;
  if (d.kontak)
    meta += `<text x="60" y="${metaY + 152}" font-family="${p.body}" font-size="30" fill="${ink.ink}">${esc(d.kontak)}</text>`;

  return `
  ${dashedLine(60, 120, 1020, 120, ink.accent)}
  <text x="60" y="92" font-family="'Flow Rounded', cursive" font-size="30" letter-spacing="6" fill="${ink.accent}">${esc(d.kategori || 'Lomba')}</text>
  <circle cx="950" cy="330" r="150" fill="none" stroke="${ink.accent}" stroke-width="4" stroke-dasharray="16 12" opacity="0.7"/>
  ${titleBlock(words, 60, startY, size, ink, p)}
  ${meta}
  ${d.deskripsi ? descBlock(d.deskripsi, 60, metaY + 196, 560, 28, ink, p) : ''}
  ${stamp(880, 1150, ink, 1)}`;
}

function layoutGridSwiss(d: PosterData, ink: Ink, p: Pairing): string {
  let grid = '';
  for (let i = 0; i <= 12; i++) {
    const x = 60 + i * 80;
    grid += `<line x1="${x}" y1="60" x2="${x}" y2="1290" stroke="${ink.accent}" stroke-width="2" stroke-dasharray="8 8" opacity="0.45"/>`;
  }
  const lines = wrapLines(d.judul, 560, 92);
  const size = lines.length > 3 ? 72 : 92;
  const titleY = 420;
  const tanggal = formatTanggal(d.tanggal);

  return `
  ${grid}
  ${dashedLine(60, 120, 1020, 120, ink.accent, 3)}
  <text x="60" y="100" font-family="'Flow Rounded', cursive" font-size="30" letter-spacing="6" fill="${ink.accent}">${esc(d.kategori || 'Lomba')}</text>
  ${titleBlock(lines, 60, titleY, size, ink, p)}
  <rect x="700" y="220" width="320" height="320" fill="${ink.accent}" opacity="0.16"/>
  ${metaRow(700, 640, 'Tanggal', tanggal || '—', ink, p)}
  ${metaRow(700, 760, 'Lokasi', d.lokasi || '—', ink, p)}
  ${metaRow(700, 880, 'Penyelenggara', d.penyelenggara || '—', ink, p)}
  ${metaRow(700, 1000, 'Kontak', d.kontak || '—', ink, p)}
  ${d.deskripsi ? descBlock(d.deskripsi, 60, 990, 560, 30, ink, p) : ''}
  ${dashedLine(60, 1230, 1020, 1230, ink.accent, 3)}
  <text x="60" y="1272" font-family="'Flow Rounded', cursive" font-size="26" fill="${ink.accent}">dicetak kilat · posterkilat</text>
  ${stamp(880, 250, ink, 0.62)}`;
}

function layoutDiagonal(d: PosterData, ink: Ink, p: Pairing): string {
  const lines = wrapLines(d.judul, 880, 120);
  const size = lines.length > 3 ? 96 : 120;
  const tanggal = formatTanggal(d.tanggal);
  return `
  <g transform="rotate(-16 540 675)">
    <rect x="-200" y="880" width="1500" height="220" fill="${ink.accent}" opacity="0.9"/>
    <text x="60" y="1020" font-family="'Flow Rounded', cursive" font-size="64" letter-spacing="10" fill="${ink.paper}">${esc((d.kategori || 'Lomba').toUpperCase())}</text>
  </g>
  <g transform="rotate(-16 540 675)">
    ${dashedLine(-200, 860, 1300, 860, ink.ink, 4)}
  </g>
  ${titleBlock(lines, 80, 300, size, ink, p)}
  <g>
    ${tanggal ? `<text x="80" y="1080" font-family="${p.body}" font-size="40" font-weight="700" fill="${ink.ink}">${esc(tanggal)}</text>` : ''}
    ${d.lokasi ? `<text x="80" y="1136" font-family="${p.body}" font-size="36" fill="${ink.ink}">${esc(d.lokasi)}</text>` : ''}
    ${d.penyelenggara ? `<text x="80" y="1192" font-family="'Flow Rounded', cursive" font-size="30" fill="${ink.accent}">oleh ${esc(d.penyelenggara)}</text>` : ''}
    ${d.kontak ? `<text x="80" y="1244" font-family="${p.body}" font-size="32" fill="${ink.ink}">${esc(d.kontak)}</text>` : ''}
  </g>
  ${d.deskripsi ? descBlock(d.deskripsi, 80, 720, 600, 30, ink, p) : ''}
  ${stamp(860, 320, ink, 0.85)}`;
}

function layoutKartu(d: PosterData, ink: Ink, p: Pairing): string {
  const lines = wrapLines(d.judul, 760, 88);
  const size = lines.length > 3 ? 72 : 88;
  const tanggal = formatTanggal(d.tanggal);
  const rows: [string, string][] = [
    ['Tanggal', tanggal],
    ['Lokasi', d.lokasi],
    ['Penyelenggara', d.penyelenggara],
    ['Kontak', d.kontak],
  ].filter(([, v]) => v) as [string, string][];
  const rowY = 640 + lines.length * size * 1.04;
  const divY = rowY - 60;
  const rowsSvg = rows
    .map(
      ([label, val], i) =>
        `<text x="200" y="${rowY + i * 74}" font-family="'Flow Rounded', cursive" font-size="26" letter-spacing="4" fill="${ink.accent}">${esc(label)}</text>
         <text x="470" y="${rowY + i * 74}" font-family="${p.body}" font-size="32" fill="${ink.ink}">${esc(val)}</text>`
    )
    .join('\n');

  return `
  <rect x="70" y="70" width="940" height="1210" fill="none" stroke="${ink.ink}" stroke-width="5"/>
  <rect x="92" y="92" width="896" height="1166" fill="none" stroke="${ink.ink}" stroke-width="2" stroke-dasharray="14 10"/>
  <text x="540" y="220" text-anchor="middle" font-family="'Flow Rounded', cursive" font-size="32" letter-spacing="8" fill="${ink.accent}">${esc(d.kategori || 'Lomba')}</text>
  ${dashedLine(200, 260, 880, 260, ink.accent, 3)}
  ${titleBlock(lines, 540, 360, size, ink, p, 'middle')}
  ${dashedLine(200, divY, 880, divY, ink.accent, 3)}
  ${rowsSvg}
  ${d.deskripsi ? descBlock(d.deskripsi, 540, rowY + rows.length * 74 + 20, 680, 28, ink, p, 'middle') : ''}
  ${stamp(540, 1140, ink, 0.55)}`;
}

/* ---------------- public API ---------------- */

export function getInk(id: string): Ink {
  return INKS.find((i) => i.id === id) ?? INKS[0];
}
export function getPairing(id: string): Pairing {
  return PAIRINGS.find((p) => p.id === id) ?? PAIRINGS[0];
}
export function isLayout(id: string): id is LayoutId {
  return LAYOUTS.some((l) => l.id === id);
}
export function isInk(id: string): id is InkId {
  return INKS.some((i) => i.id === id);
}
export function isPairing(id: string): id is PairingId {
  return PAIRINGS.some((p) => p.id === id);
}

export function renderEmptyPoster(inkId: InkId = 'ungu'): string {
  const ink = getInk(inkId);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Pratinjau poster kosong" xmlns="http://www.w3.org/2000/svg" class="pk-poster-svg">
  <rect width="${W}" height="${H}" fill="${ink.paper}"/>
  <rect x="70" y="70" width="940" height="1210" fill="none" stroke="${ink.accent}" stroke-width="4" stroke-dasharray="20 14" opacity="0.8"/>
  <text x="540" y="640" text-anchor="middle" font-family="'Brawler', Georgia, serif" font-size="44" fill="${ink.ink}">Ketik judul lomba untuk mulai.</text>
  <text x="540" y="700" text-anchor="middle" font-family="'Flow Rounded', cursive" font-size="30" fill="${ink.accent}">meja cetak siap</text>
</svg>`;
}

export function renderPoster(d: PosterData, layout: LayoutId, inkId: InkId, pairingId: PairingId): string {
  const ink = getInk(inkId);
  const p = getPairing(pairingId);
  if (!d.judul.trim()) return renderEmptyPoster(inkId);
  const body =
    layout === 'raksasa'
      ? layoutRaksasa(d, ink, p)
      : layout === 'grid-swiss'
        ? layoutGridSwiss(d, ink, p)
        : layout === 'diagonal'
          ? layoutDiagonal(d, ink, p)
          : layoutKartu(d, ink, p);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Pratinjau poster: ${esc(d.judul)}" xmlns="http://www.w3.org/2000/svg" class="pk-poster-svg">
  <rect width="${W}" height="${H}" fill="${ink.paper}"/>
  ${body}
</svg>`;
}

/** Plain-text announcement for clipboard sharing. */
export function buildAnnouncement(d: PosterData): string {
  const lines = [`${d.kategori ? d.kategori + ' — ' : ''}${d.judul}`.trim()];
  const t = formatTanggal(d.tanggal);
  if (t) lines.push(`Tanggal: ${t}`);
  if (d.lokasi) lines.push(`Lokasi: ${d.lokasi}`);
  if (d.penyelenggara) lines.push(`Penyelenggara: ${d.penyelenggara}`);
  if (d.deskripsi) lines.push('', d.deskripsi);
  if (d.kontak) lines.push('', `Info & pendaftaran: ${d.kontak}`);
  lines.push('', 'Dibuat dengan PosterKit Kilat');
  return lines.join('\n');
}

export const SAMPLE_DATA: PosterData = {
  judul: 'Lomba mewarnai anak',
  tanggal: '',
  lokasi: 'Balai warga [contoh]',
  penyelenggara: 'Panitia [contoh]',
  kategori: 'Mewarnai Anak',
  deskripsi: 'Ayo warnai gambar hewan favoritmu. Bawa krayon sendiri ya!',
  kontak: 'Hubungi panitia [contoh]',
};
