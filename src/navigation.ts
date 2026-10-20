import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Beranda', href: getPermalink('/') },
    { text: 'Buat poster', href: getPermalink('/buat') },
    { text: 'Contoh', href: getPermalink('/#contoh') },
    { text: 'FAQ', href: getPermalink('/#faq') },
  ],
  actions: [{ text: 'Buka meja cetak', href: getPermalink('/buat') }],
};

export const footerData = {
  links: [
    {
      title: 'Meja cetak',
      links: [
        { text: 'Buat poster', href: getPermalink('/buat') },
        { text: 'Contoh poster', href: getPermalink('/#contoh') },
        { text: 'Cara pakai', href: getPermalink('/#cara') },
      ],
    },
    {
      title: 'Buat juri senang',
      links: [
        { text: '8 syarat juri', href: getPermalink('/#syarat') },
        { text: '5 tips kilat', href: getPermalink('/#tips') },
        { text: 'Tanya jawab', href: getPermalink('/#faq') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `PosterKit Kilat — meja cetak kilat untuk panitia lomba. Semua poster murni tipografi, tanpa gambar.`,
};
