# PosterKit Kilat

Meja cetak kilat untuk panitia lomba: bikin poster pengumuman dalam hitungan menit, 100% di browser. Tanpa desainer, tanpa daftar, tanpa satu pun gambar raster — semua poster murni tipografi + bentuk geometris (SVG).

## Fitur

- **Meja cetak** (`/buat`): form isi pengumuman → pratinjau poster hidup 1080×1350, update <200 mdtk
- **4 layout**: Raksasa, Grid Swiss, Diagonal, Kartu
- **6 tinta**: Tinta ungu, Tinta malam, Kertas kusam, Segel biru, Bata, Arang
- **3 pasangan huruf**: Klasik cetak, Poster jalanan, Arsip (Tiro Bangla / Brawler / Flow Rounded)
- **Unduh PNG** 2160×2700 (font di-embed otomatis), **Salin SVG**, **Salin teks pengumuman**
- **Auto-simpan** ke localStorage (`posterkit.v1`, versioned + validasi skema)
- **Deep-link**: `/buat?judul=…&tanggal=…&lokasi=…&layout=…&tinta=…` — bagikan isian form ke panitia lain
- **Validasi ala Mas Cetak**: judul kosong ditolak dengan pesan jelas; tanggal lampau diberi peringatan
- **Easter egg**: tekan `K` di halaman tool → stempel KILAT jatuh ke poster
- **Landing**: hero = mini meja cetak yang bisa diklik tintanya, zoom-through huruf KILAT raksasa antar section, 2 pita marquee berlawanan, divider teks melengkung, 6 contoh poster (semua data [contoh]), 8 syarat juri, 5 tips kilat, FAQ
- **Gerak**: 5 modul (A terbang scroll, B marquee+skew, C textPath, D spotlight cursor, E GSAP Flip) + mode ringan otomatis + toggle "Gerak: nyala/mati" di footer + `prefers-reduced-motion` penuh

## Teknologi

Astro 5 (static) · Tailwind CSS v4 · TypeScript · GSAP 3 (ScrollTrigger + Flip) · Astro Fonts API (self-host font) · template dasar AstroWind (dirombak total: blog dimatikan, halaman template dibuang)

## Cara menjalankan

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output ke dist/
npm run check    # astro check + eslint + prettier (harus hijau)
```

## Status QA

- `npm run build`: hijau (exit 0)
- `npm run check`: hijau (exit 0)
- HTTP 200: `/`, `/buat/`, `/api/health` — terverifikasi via server lokal
- Tidak ada `/blog` di dist; tidak ada console.log / TODO / lorem di kode
- Skor Lighthouse (setelah optimasi perf 2026-10-20 10:40 WIB): mobile 90/96/100/100,
  desktop 97/96/100/100 (perf/acc/bp/seo). Median 6 run mobile: 90.5 (terbaik 97).
  Optimasi: motion+GSAP hanya dimuat di desktop (dynamic import, min-width 1024px),
  overlay grain feTurbulence dimatikan di <1024px, content-visibility di section
  bawah layar, font italic tak terpakai dibuang. Skor perf mobile fluktuatif ±4
  poin karena CPU VM dipakai bersama (emulasi CPU 4x).
- FPS uji CPU throttle 4x (scroll): 60.2 (target ≥ 45).
- URL live: https://kayzenn123.github.io/agent-tools-posterkit-kilat/
