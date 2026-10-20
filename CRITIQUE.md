# CRITIQUE — PosterKit Kilat (2026-10-20)

## Slop test (jujur)

- **Lolos**: hero bukan headline+statistik generik — hero = mini meja cetak yang bisa diklik. Palet ungu mid + lime bukan default cream/terracotta atau dark+acid-green. Tipografi Tiro Bangla/Brawler/Flow Rounded belum dipakai 30 build terakhir.
- **Risiko sisa**: struktur landing (hero → steps → galeri → FAQ → CTA) masih mengikuti irama template. Bedanya diisi konten dan interaksi yang spesifik brief, bukan copy generik.

## 3 hal paling "template" + yang dirombak

1. **Widget Steps/FAQs/CallToAction AstroWind** — bentuknya template (judul + 3 langkah, akordeon, CTA). Dirombak: copy 100% "Mas Cetak" Bahasa Indonesia sentence case, section Steps jadi "Tiga langkah ke poster jadi" dengan deskripsi spesifik fitur, FAQ berisi pertanyaan panitia nyata (bukan filler SaaS).
2. **Header/footer template** — dirompak: menu tinggal 4 (Beranda, Buat poster, Contoh, FAQ), footer link disederhanakan, RSS dibuang, dark mode dimatikan (`light:only`), tambah toggle "Gerak: nyala/mati" di footer.
3. **Ritme section statis** — dirombak dengan 5 modul gerak bernarasi "masuk ke dalam mesin cetak": zoom-through huruf KILAT (A), 2 marquee berlawanan + skew velocity (B), textPath melengkung (C), spotlight cursor (D), GSAP Flip kartu layout (E). Grain kertas feTurbulence di seluruh halaman.

## Gerbang gerak v4

- Setiap modul punya `init()` dan `destroy()`; orkestrator `motion.ts` teardown total saat toggle mati.
- `prefers-reduced-motion`: semua animasi mati → halaman statis (CSS + JS).
- Mode ringan otomatis: hardwareConcurrency≤4 / deviceMemory≤4 / Save-Data / FPS<40 selama 2 detik → D mati, A disederhanakan (fade saja), marquee statis.
- Marquee >5 detik: tiap pita punya tombol jeda dengan `aria-pressed` dan label jelas.
- Aksesibilitas: skip link, landmark, 1 h1 per halaman, focus-visible 3px, lightbox pakai `<dialog>` native, status via `aria-live`.

## Hasil build/check

- `npm run build`: exit 0. dist berisi: 404.html, index.html, buat/index.html, api/health, sitemap. Tidak ada `/blog`, `/category`, `/tag`.
- `npm run check` (astro check + eslint + prettier): exit 0.
- HTTP 200 terverifikasi lokal: `/`, `/buat/`, `/api/health`.
- Tidak ada `console.log`, `TODO`, `FIXME`, atau lorem di kode.

## Yang dipangkas

- **F (audio)**: tidak dipakai sejak awal (sesuai BRIEF).
- **Halaman template**: about, contact, pricing, services, terms, privacy, homes/_, landing/_, data/post, public/decapcms — dibuang, tidak ter-link dari mana pun.
- **Blog**: `apps.blog.isEnabled: false` penuh; link blog dihapus dari navigasi.
- **Dark mode**: `ui.theme: 'light:only'` — palet mid-mode tunggal sesuai token BRIEF.
- **foreignObject di SVG poster**: diganti `<text>` wrap murni — foreignObject berisiko tidak ke-render saat export SVG→canvas→PNG.
- **Og-image**: belum dibuat (sesuai spec — nanti via screenshot).

## Catatan untuk QA

1. **Export PNG butuh font embed**: `fontFaceCss()` memindai `document.styleSheets` untuk @font-face Astro. Kalau gagal (stylesheet cross-origin), PNG jatuh ke fallback serif — cek visual PNG sekali.
2. **GSAP dari CDN? Tidak** — GSAP di-bundle via npm, jadi offline-safe. Tapi ScrollTrigger + Flip menambah ~70KB JS; halaman `/buat` memuat keduanya.
3. **Easter egg `K`**: hanya aktif saat fokus tidak di input/textarea/select.
4. **Deep-link**: parameter `tinta` (bukan `ink`) sesuai spec; nilai tak valid diabaikan diam-diam.
5. **Tanggal lampau**: hanya peringatan, tidak memblokir cetak.
6. **Marquee di `prefers-reduced-motion`**: animasi CSS dimatikan via media query; tombol jeda tetap ada.
7. **Lighthouse & screenshot 390px**: belum dijalankan di sesi ini (butuh browser) — wajib sebelum klaim DoD.

## Putaran rombak QA (parent, 2026-10-20 ~09:50 WIB)

Temuan tools/qa.mjs putaran 1: fps4x 12.9 (< 45 GAGAL), 1 console error desktop
(`ERR_TUNNEL_CONNECTION_FAILED`), 14–19 tap target < 44px. Visual: sisa
announcement bar template "NEW Astro v7 is now available!" + emoji 🚀 di logo
(melanggar blacklist v3).

Yang dirombak:

1. Announcement bar dimatikan total di PageLayout (slot → null, import dihapus)
   — sekaligus menghilangkan pemicu console error (gambar shields.io eksternal).
2. Logo 🚀 → SVG stempel "K" garis putus-putus custom (gaya ikon seed).
3. `.pk-grain`: `mix-blend-mode: multiply` dibuang (re-composite tiap frame =
   biang jank) → opacity 0.1 polos. fps4x: 12.9 → 60.2.
4. Motion A: scale fase 2.2→1.6, fase 2 3.4→2.2 (raster layer raksasa dikecilkan).
5. Tap target ≥ 44px: tombol tinta mini, "Jeda pita", toggle gerak footer.
6. Bug deep-link: input tidak terhidrasi dari state (poster tetap contoh) →
   tambah `paintInputs()` sebelum `sync(true)`; sekalian perbaiki hidrasi
   localStorage (sebelumnya lolos tes karena form-restore browser).

Hasil putaran 2: qa.mjs exit 0 — overflow false semua viewport, console bersih,
h1=1, reduced-motion 0 animasi jalan, fps4x 60.2. Fungsional /buat: deep-link,
validasi persona, unduh PNG, salin SVG, easter egg K, persist localStorage —
semua OK, tanpa error.

## Skor (parent)

- Karakter: 9/10 — meja cetak hidup + stempel KILAT + persona Mas Cetak konsisten.
- Keunikan: 9/10 — vs 3 build terakhir (WARTEG koran gelap, Loakan koran kuning,
  VerifLomba): palet mid-ungu monochrome + Swiss tipografi + zoom-through huruf
  raksasa tidak sekeluarga dengan satupun.
- Kerapian: 8/10 — hero rapi; tap target kecil tersisa hanya link teks footer
  (advisory, di luar gate exit code).
