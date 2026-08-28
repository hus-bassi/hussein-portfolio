/* ============================================================
   DATA/CERTIFICATES.JS
   Pure data. No HTML, no styling, no logic beyond the array
   itself — js/certificates.js is the only file that reads this.

   ⚠ DEMO DATA — every entry below is a placeholder to preview
   the UI. None of it is a real certificate Hussein has earned.
   Each entry is flagged `isDemo: true` for exactly this reason:
   the rendering code in js/certificates.js shows a visible
   "Demo" badge on any card where that flag is true, so a real
   visitor is never misled into thinking these are genuine.

   ------------------------------------------------------------
   TO ADD A REAL CERTIFICATE LATER:
   1. Copy one of the objects below.
   2. Fill in your real title, provider, date, category,
      description and credentialUrl.
   3. Set `isDemo` to `false`.
   4. Put the certificate image file in assets/certificates/
      and point `image` at it.
   5. Save the file. No other file needs to change — the preview
      grid on the homepage, and the full Certificates page built
      in Phase 04, both read from this same array automatically.
   ------------------------------------------------------------ */

const certificatesData = [
  {
    title: 'YOUR_CERTIFICATE_TITLE (e.g. Introduction to Python)',
    provider: 'YOUR_PROVIDER',
    date: 'YOUR_DATE',
    category: 'Programming',
    image: 'assets/certificates/YOUR_CERTIFICATE_IMAGE.jpg',
    credentialUrl: '',
    description: 'A short, honest description of what this certificate covers.',
    isDemo: true,
  },
  {
    title: 'YOUR_CERTIFICATE_TITLE (e.g. Statistics Fundamentals)',
    provider: 'YOUR_PROVIDER',
    date: 'YOUR_DATE',
    category: 'Mathematics',
    image: 'assets/certificates/YOUR_CERTIFICATE_IMAGE.jpg',
    credentialUrl: '',
    description: 'A short, honest description of what this certificate covers.',
    isDemo: true,
  },
  {
    title: 'YOUR_CERTIFICATE_TITLE (e.g. English for Academic Purposes)',
    provider: 'YOUR_PROVIDER',
    date: 'YOUR_DATE',
    category: 'English',
    image: 'assets/certificates/YOUR_CERTIFICATE_IMAGE.jpg',
    credentialUrl: '',
    description: 'A short, honest description of what this certificate covers.',
    isDemo: true,
  },
];
