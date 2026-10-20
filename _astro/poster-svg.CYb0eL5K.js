var e=[{id:`ungu`,nama:`Tinta ungu`,paper:`#efeaf7`,ink:`#2b2536`,accent:`#8f7fd6`,stamp:`#c8e64a`,stampText:`#2b2536`},{id:`malam`,nama:`Tinta malam`,paper:`#232030`,ink:`#f2eefa`,accent:`#9a6ee0`,stamp:`#c8e64a`,stampText:`#2b2536`},{id:`kusam`,nama:`Kertas kusam`,paper:`#e9e3d1`,ink:`#3a3428`,accent:`#7c6fd0`,stamp:`#c8e64a`,stampText:`#2b2536`},{id:`biru`,nama:`Segel biru`,paper:`#dde7f2`,ink:`#20304a`,accent:`#4a7fd6`,stamp:`#c8e64a`,stampText:`#2b2536`},{id:`bata`,nama:`Bata`,paper:`#f2e3d6`,ink:`#3a2a24`,accent:`#c96a4a`,stamp:`#2b2536`,stampText:`#f2e3d6`},{id:`arang`,nama:`Arang`,paper:`#26262b`,ink:`#f4f1e8`,accent:`#8f7fd6`,stamp:`#c8e64a`,stampText:`#2b2536`}],t=[{id:`klasik`,nama:`Klasik cetak`,display:`'Tiro Bangla', Georgia, serif`,body:`'Brawler', Georgia, serif`},{id:`jalanan`,nama:`Poster jalanan`,display:`'Flow Rounded', cursive`,body:`'Brawler', Georgia, serif`},{id:`arsip`,nama:`Arsip`,display:`'Brawler', Georgia, serif`,body:`'Brawler', Georgia, serif`}],n=[{id:`raksasa`,nama:`Raksasa`,deskripsi:`Judul sebesar-besarnya, satu pesan.`},{id:`grid-swiss`,nama:`Grid Swiss`,deskripsi:`Kotak-kotak rapi ala cetakan.`},{id:`diagonal`,nama:`Diagonal`,deskripsi:`Garis miring penuh energi.`},{id:`kartu`,nama:`Kartu`,deskripsi:`Pengumuman klasik berbingkai.`}],r=[`Desain Poster`,`Fotografi`,`Esai`,`Debat`,`Hackathon`,`E-Sport`,`Futsal`,`Badminton`,`Memasak`,`Menyanyi`,`Cerdas Cermat`,`Mewarnai Anak`],i=1080,a=1350;function o(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function s(e,t,n=.52){return e.length*t*n}function c(e,t,n,r=24,i=.52){let a=n;for(;a>r&&s(e,a,i)>t;)a-=4;return a}function l(e,t,n,r=.5){let i=e.split(/\s+/).filter(Boolean),a=[],o=``;for(let e of i){let i=o?o+` `+e:e;s(i,n,r)<=t||!o?o=i:(a.push(o),o=e)}return o&&a.push(o),a}function u(e){if(!e)return``;let t=new Date(e+`T00:00:00`);if(isNaN(t.getTime()))return e;try{return new Intl.DateTimeFormat(`id-ID`,{day:`numeric`,month:`long`,year:`numeric`}).format(t)}catch{return e}}function d(e){if(!e)return!1;let t=new Date(e+`T00:00:00`);if(isNaN(t.getTime()))return!1;let n=new Date;return n.setHours(0,0,0,0),t<n}function f(e,t,n,r,i,a=3,o=`14 10`){return`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="${i}" stroke-width="${a}" stroke-dasharray="${o}" />`}function p(e,t,n,r=1){let i=120*r;return`<g transform="translate(${e} ${t}) rotate(-8)">
    <circle r="${i}" fill="${n.stamp}" />
    <circle r="${i-10*r}" fill="none" stroke="${n.stampText}" stroke-width="${4*r}" stroke-dasharray="10 7" />
    <text text-anchor="middle" dy="${-8*r}" font-family="'Brawler', Georgia, serif" font-weight="700" font-size="${44*r}" fill="${n.stampText}">KILAT</text>
    <text text-anchor="middle" dy="${34*r}" font-family="'Flow Rounded', cursive" font-size="${30*r}" fill="${n.stampText}">cetak cepat</text>
  </g>`}function m(e,t,n,r,i,a){let s=o(r);return`<text x="${e}" y="${t}" font-family="'Flow Rounded', cursive" font-size="26" letter-spacing="4" fill="${i.accent}">${o(n)}</text>
  <text x="${e}" y="${t+44}" font-family="${a.body}" font-size="34" fill="${i.ink}">${s}</text>`}function h(e,t,n,r,i,a,s,c=`start`){return l(e.slice(0,200),r,i).slice(0,4).map((e,r)=>`<text x="${t}" y="${n+r*i*1.45}" text-anchor="${c}" font-family="${s.body}" font-size="${i}" fill="${a.ink}">${o(e)}</text>`).join(`
`)}function g(e,t,n,r,i,a,s=`start`,c=1.04){return e.map((e,l)=>`<text x="${t}" y="${n+l*r*c}" text-anchor="${s}" font-family="${a.display}" font-size="${r}" fill="${i.ink}">${o(e)}</text>`).join(`
`)}function _(e,t,n){let r=e.judul.trim().split(/\s+/),i=170;for(let e of r)i=Math.min(i,c(e,960,170,60,.56));let a=i*1.02,s=r.length*a,l=Math.min(300+s+90,1080),d=u(e.tanggal),m=``;return d&&(m+=`<text x="60" y="${l}" font-family="${n.body}" font-size="36" fill="${t.ink}">${o(d)}</text>`),e.lokasi&&(m+=`<text x="60" y="${l+52}" font-family="${n.body}" font-size="36" fill="${t.ink}">${o(e.lokasi)}</text>`),e.penyelenggara&&(m+=`<text x="60" y="${l+104}" font-family="'Flow Rounded', cursive" font-size="28" fill="${t.accent}">oleh ${o(e.penyelenggara)}</text>`),e.kontak&&(m+=`<text x="60" y="${l+152}" font-family="${n.body}" font-size="30" fill="${t.ink}">${o(e.kontak)}</text>`),`
  ${f(60,120,1020,120,t.accent)}
  <text x="60" y="92" font-family="'Flow Rounded', cursive" font-size="30" letter-spacing="6" fill="${t.accent}">${o(e.kategori||`Lomba`)}</text>
  <circle cx="950" cy="330" r="150" fill="none" stroke="${t.accent}" stroke-width="4" stroke-dasharray="16 12" opacity="0.7"/>
  ${g(r,60,300,i,t,n)}
  ${m}
  ${e.deskripsi?h(e.deskripsi,60,l+196,560,28,t,n):``}
  ${p(880,1150,t,1)}`}function v(e,t,n){let r=``;for(let e=0;e<=12;e++){let n=60+e*80;r+=`<line x1="${n}" y1="60" x2="${n}" y2="1290" stroke="${t.accent}" stroke-width="2" stroke-dasharray="8 8" opacity="0.45"/>`}let i=l(e.judul,560,92),a=i.length>3?72:92,s=u(e.tanggal);return`
  ${r}
  ${f(60,120,1020,120,t.accent,3)}
  <text x="60" y="100" font-family="'Flow Rounded', cursive" font-size="30" letter-spacing="6" fill="${t.accent}">${o(e.kategori||`Lomba`)}</text>
  ${g(i,60,420,a,t,n)}
  <rect x="700" y="220" width="320" height="320" fill="${t.accent}" opacity="0.16"/>
  ${m(700,640,`Tanggal`,s||`—`,t,n)}
  ${m(700,760,`Lokasi`,e.lokasi||`—`,t,n)}
  ${m(700,880,`Penyelenggara`,e.penyelenggara||`—`,t,n)}
  ${m(700,1e3,`Kontak`,e.kontak||`—`,t,n)}
  ${e.deskripsi?h(e.deskripsi,60,990,560,30,t,n):``}
  ${f(60,1230,1020,1230,t.accent,3)}
  <text x="60" y="1272" font-family="'Flow Rounded', cursive" font-size="26" fill="${t.accent}">dicetak kilat · posterkilat</text>
  ${p(880,250,t,.62)}`}function y(e,t,n){let r=l(e.judul,880,120),i=r.length>3?96:120,a=u(e.tanggal);return`
  <g transform="rotate(-16 540 675)">
    <rect x="-200" y="880" width="1500" height="220" fill="${t.accent}" opacity="0.9"/>
    <text x="60" y="1020" font-family="'Flow Rounded', cursive" font-size="64" letter-spacing="10" fill="${t.paper}">${o((e.kategori||`Lomba`).toUpperCase())}</text>
  </g>
  <g transform="rotate(-16 540 675)">
    ${f(-200,860,1300,860,t.ink,4)}
  </g>
  ${g(r,80,300,i,t,n)}
  <g>
    ${a?`<text x="80" y="1080" font-family="${n.body}" font-size="40" font-weight="700" fill="${t.ink}">${o(a)}</text>`:``}
    ${e.lokasi?`<text x="80" y="1136" font-family="${n.body}" font-size="36" fill="${t.ink}">${o(e.lokasi)}</text>`:``}
    ${e.penyelenggara?`<text x="80" y="1192" font-family="'Flow Rounded', cursive" font-size="30" fill="${t.accent}">oleh ${o(e.penyelenggara)}</text>`:``}
    ${e.kontak?`<text x="80" y="1244" font-family="${n.body}" font-size="32" fill="${t.ink}">${o(e.kontak)}</text>`:``}
  </g>
  ${e.deskripsi?h(e.deskripsi,80,720,600,30,t,n):``}
  ${p(860,320,t,.85)}`}function b(e,t,n){let r=l(e.judul,760,88),i=r.length>3?72:88,a=[[`Tanggal`,u(e.tanggal)],[`Lokasi`,e.lokasi],[`Penyelenggara`,e.penyelenggara],[`Kontak`,e.kontak]].filter(([,e])=>e),s=640+r.length*i*1.04,c=s-60,d=a.map(([e,r],i)=>`<text x="200" y="${s+i*74}" font-family="'Flow Rounded', cursive" font-size="26" letter-spacing="4" fill="${t.accent}">${o(e)}</text>
         <text x="470" y="${s+i*74}" font-family="${n.body}" font-size="32" fill="${t.ink}">${o(r)}</text>`).join(`
`);return`
  <rect x="70" y="70" width="940" height="1210" fill="none" stroke="${t.ink}" stroke-width="5"/>
  <rect x="92" y="92" width="896" height="1166" fill="none" stroke="${t.ink}" stroke-width="2" stroke-dasharray="14 10"/>
  <text x="540" y="220" text-anchor="middle" font-family="'Flow Rounded', cursive" font-size="32" letter-spacing="8" fill="${t.accent}">${o(e.kategori||`Lomba`)}</text>
  ${f(200,260,880,260,t.accent,3)}
  ${g(r,540,360,i,t,n,`middle`)}
  ${f(200,c,880,c,t.accent,3)}
  ${d}
  ${e.deskripsi?h(e.deskripsi,540,s+a.length*74+20,680,28,t,n,`middle`):``}
  ${p(540,1140,t,.55)}`}function x(t){return e.find(e=>e.id===t)??e[0]}function S(e){return t.find(t=>t.id===e)??t[0]}function C(e){return n.some(t=>t.id===e)}function w(t){return e.some(e=>e.id===t)}function T(e){return t.some(t=>t.id===e)}function E(e=`ungu`){let t=x(e);return`<svg viewBox="0 0 ${i} ${a}" width="${i}" height="${a}" role="img" aria-label="Pratinjau poster kosong" xmlns="http://www.w3.org/2000/svg" class="pk-poster-svg">
  <rect width="${i}" height="${a}" fill="${t.paper}"/>
  <rect x="70" y="70" width="940" height="1210" fill="none" stroke="${t.accent}" stroke-width="4" stroke-dasharray="20 14" opacity="0.8"/>
  <text x="540" y="640" text-anchor="middle" font-family="'Brawler', Georgia, serif" font-size="44" fill="${t.ink}">Ketik judul lomba untuk mulai.</text>
  <text x="540" y="700" text-anchor="middle" font-family="'Flow Rounded', cursive" font-size="30" fill="${t.accent}">meja cetak siap</text>
</svg>`}function D(e,t,n,r){let s=x(n),c=S(r);if(!e.judul.trim())return E(n);let l=t===`raksasa`?_(e,s,c):t===`grid-swiss`?v(e,s,c):t===`diagonal`?y(e,s,c):b(e,s,c);return`<svg viewBox="0 0 ${i} ${a}" width="${i}" height="${a}" role="img" aria-label="Pratinjau poster: ${o(e.judul)}" xmlns="http://www.w3.org/2000/svg" class="pk-poster-svg">
  <rect width="${i}" height="${a}" fill="${s.paper}"/>
  ${l}
</svg>`}function O(e){let t=[`${e.kategori?e.kategori+` — `:``}${e.judul}`.trim()],n=u(e.tanggal);return n&&t.push(`Tanggal: ${n}`),e.lokasi&&t.push(`Lokasi: ${e.lokasi}`),e.penyelenggara&&t.push(`Penyelenggara: ${e.penyelenggara}`),e.deskripsi&&t.push(``,e.deskripsi),e.kontak&&t.push(``,`Info & pendaftaran: ${e.kontak}`),t.push(``,`Dibuat dengan PosterKit Kilat`),t.join(`
`)}var k={judul:`Lomba mewarnai anak`,tanggal:``,lokasi:`Balai warga [contoh]`,penyelenggara:`Panitia [contoh]`,kategori:`Mewarnai Anak`,deskripsi:`Ayo warnai gambar hewan favoritmu. Bawa krayon sendiri ya!`,kontak:`Hubungi panitia [contoh]`};export{x as a,T as c,O as i,d as l,n,w as o,k as r,C as s,r as t,D as u};