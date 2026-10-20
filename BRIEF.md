# BRIEF — PosterKit Kilat — 2026-10-20

## Masalah/usecase

Panitia lomba tingkat RT/RW, kampus, dan komunitas butuh poster pengumuman yang jadi dalam hitungan menit tanpa desainer; template Canva generik terlihat pasaran dan sering gagal memenuhi kriteria juri (tipografi rapi, kesesuaian tema).

## Konsep visual

"Meja percetakan kilat bergaya Swiss": generator poster lomba 100% client-side yang murni tipografi + bentuk geometris (tanpa satu pun gambar raster), landing bertransisi zoom-through lewat huruf raksasa, dan halaman tool berupa meja cetak dengan preview poster hidup 1080×1350.

## Hasil seed (ringkas, dari builds/2026-10-20/seed.json)

- Domain: desain poster lomba · Layout: scene zoom-through berantai · Referensi: Swiss/International Style
- Constraint: tanpa gambar, murni tipografi dan bentuk
- Motion A: kamera "terbang" lewat scroll (scale+translate+rotate) · B: 2 marquee band berlawanan + skew velocity · C: teks di path melengkung · D: cursor senter/spotlight mask · E: GSAP Flip layout
- Font: display Tiro Bangla · body Brawler · aksen Flow Rounded
- Palet mid/monochrome hue 263: bg oklch(0.70 0.126 263) · surface oklch(0.60 0.110 263) · text oklch(0.16 0.030 263) · muted oklch(0.32 0.040 263) · accent oklch(0.64 0.194 263) · accent2 oklch(0.65 0.247 263) · pop oklch(0.82 0.236 119)
- Ikon: garis putus-putus, custom hand-built SVG

## 3 arah desain + arah terpilih

1. Swiss grid kaku + stempel miring "KILAT": grid 12 kolom, judul raksasa, satu stempel pop-lime miring 8°. Paling jauh dari default SaaS, nyambung constraint tanpa-gambar.
2. Struk thermal vertikal: halaman = struk panjang, tool = isi form struk. Unik tapi mirip build 2026-10-09 (struk belanja) — DITOLAK anti-seragam.
3. Papan pengumuman penuh stiker: mirip build 2026-10-18 (pasar loak) — DITOLAK anti-seragam.
   TERPILIH: arah 1.

## Keputusan berani

Seluruh situs tanpa satu pun gambar raster — poster, ilustrasi, ikon, og-image semuanya SVG/tipografi murni. Hero landing BUKAN headline marketing: hero = mini meja cetak hidup (poster kecil yang berubah saat pengunjung klik palet).

## Persona/suara

"Mas Cetak" — tukang percetakan kilat yang satset. Copy: "Pilih layout", "Tinta siap", "Poster dicetak!", error: "Judulnya kosong — tulis dulu biar bisa dicetak.", empty: "Ketik judul lomba untuk mulai."

## Palet

Harmoni monochrome hue 263 (ungu), mode mid. Psikologi: ungu keabuan = tinta cetak modern yang tenang tapi tegas; pop lime dipakai <5% area hanya untuk stempel "KILAT" (kejutan energi).
Token CSS: --bg #b9aec9 (oklch .70/.126/263) · --surface #9d92b8 · --text #2b2536 · --muted #565064 · --accent #8f7fd6 · --accent-2 #9a6ee0 · --pop #c8e64a.
Cek kontras AA: text di bg = 8.4:1 LULUS; muted di bg = 4.9:1 LULUS; accent/accent-2 HANYA untuk bentuk/garis besar, dilarang untuk teks kecil (kontras < 4.5:1).

## Font

Display: Tiro Bangla (serif Bengali berotot, judul poster) · Body: Brawler (slab tegas, terbaca di 390px) · Aksen: Flow Rounded (label stempel/kecil). Alasan: ketiganya belum dipakai 30 build terakhir; Tiro Bangla memberi karakter "cetak" yang tidak generik. Fontsource id: tiro-bangla, brawler, flow-rounded — verifikasi di fontsource.org/fonts/<id>, fallback: reroll body bila gagal 2x.

## Ikon (gaya: garis putus-putus, custom hand-built SVG, 12+)

trofi, medali, kalender, jam dinding, megafon, stempel KILAT (custom), rol kertas poster (custom), palet tinta, gunting, penggaris, pin lokasi, amplop, checklist juri (custom), ikon unduh. 3 custom domain: stempel KILAT, rol kertas, checklist juri. Ikon UI kecil (menu/tutup) boleh tabler.

## Gerak (kategori A–F, narasi: "masuk ke dalam mesin cetak")

- A kamera: scroll = terbang lewat huruf raksasa (scale 1→2.2 + translate + rotate ±4°) antar section landing, scrub 0.5.
- B marquee: 2 band berlawanan ("LOMBA • CETAK • KILAT • POSTER •"), skew mengikuti velocity scroll.
- C teks: divider section = teks melengkung (SVG textPath) "PILIH — RACIK — CETAK".
- D input: cursor spotlight mask (hanya pointer:fine, desktop).
- E reveal: GSAP Flip saat ganti layout poster di tool (kartu layout bertukar posisi dengan animasi).
- F: tidak dipakai (dipangkas).
- MODE RINGAN (hardwareConcurrency ≤4 / deviceMemory ≤4 / Save-Data / FPS <40 2 dtk): matikan D + kurangi parallax A, marquee jadi statis.
- Narasi penyatu: pengunjung "masuk ke dalam mesin cetak" — huruf raksasa adalah pintu antar section.

## Storyboard hero moment

| Scroll | Terlihat                                             | Kamera                     | Marquee         | Teks                 | Interaksi                          |
| ------ | ---------------------------------------------------- | -------------------------- | --------------- | -------------------- | ---------------------------------- |
| 0%     | Mini meja cetak hidup: poster kecil + 3 tombol tinta | —                          | band 1 jalan    | judul split per kata | klik tinta → poster berubah <200ms |
| 25%    | Huruf "KILAT" raksasa memenuhi layar                 | zoom masuk ke huruf K      | band 1+2        | —                    | —                                  |
| 50%    | Section Steps di dalam "ruang" huruf                 | terbang (translate+rotate) | skew saat cepat | textPath melengkung  | —                                  |
| 75%    | Gallery hasil poster (SVG murni)                     | keluar zoom                | band berlawanan | —                    | lightbox                           |
| 100%   | CTA "Buka Meja Cetak" + stempel pop                  | settle                     | —               | —                    | klik → /buat                       |

Pertunjukan utama di 0–25%: huruf raksasa jadi pintu. 5 detik pertama: pengunjung paham ini alat bikin poster + bisa klik tintanya langsung.

## Konten (15+ item nyata)

- 4 layout poster: Raksasa, Grid Swiss, Diagonal, Kartu.
- 6 tinta (palet): Tinta Ungu (default), Tinta Malam, Kertas Kusam, Segel Biru, Bata, Arang.
- 3 pairing font: Klasik Cetak (default), Poster Jalanan, Arsip.
- 12 kategori lomba: Desain Poster, Fotografi, Esai, Debat, Hackathon, E-Sport, Futsal, Badminton, Memasak, Menyanyi, Cerdas Cermat, Mewarnai Anak.
- 8 checklist syarat juri: kesesuaian tema, orisinalitas, tipografi terbaca, komposisi, logo penyelenggara, sumber/kredit, format file, deadline pengumpulan.
- Tips: 5 tips kilat (kontras, satu pesan, dsb).
- Easter egg: tekan tombol "K" di halaman tool → stempel KILAT jatuh dari atas poster.

## Teknik visual orisinal (2+)

1. Grain kertas via SVG feTurbulence overlay (tekstur cetak).
2. Pola garis putus-putus generatif sebagai divider/ornamen (gaya ikon seed).
3. Tipografi raksasa sebagai "pintu" zoom-through (ilustrasi = huruf itu sendiri).

## Suara

Tidak (dipangkas — fokus ke inti tool).
