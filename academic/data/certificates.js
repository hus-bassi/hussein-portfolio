/* ============================================================
   DATA/CERTIFICATES.JS
   Pure data. No HTML, no styling, no logic beyond the array
   itself — js/certificates.js (and the CV page) are the only
   files that read this.

   MULTILINGUAL FIELDS (AR / EN / RU)
   A certificate's `title` and `description` may each be EITHER:
     • a plain string  — shown as-is in every language, or
     • an object { en, ar, ru }  — the matching language is shown,
       falling back to English. This lets a certificate read
       naturally in Arabic and Russian, matching the rest of the
       trilingual site.
   `provider`, `date` and `category` stay single strings for now
   (proper nouns / a shared filter key) — see CHANGELOG v1.6.0 for
   why, and what the next honest localisation step would be.

   IMAGE PATHS are written relative to the academic/ folder itself
   (e.g. `assets/certificates/x.jpg`), NOT to any one page. js/certificates.js
   resolves them per page through EventSystem.resolveMediaPath, so the SAME
   data renders correctly on the homepage preview, the full Certificates page,
   and the root mirror — with no build step. Don't prefix them with `../`.

   ------------------------------------------------------------
   TO ADD A REAL CERTIFICATE:
   1. Copy the object below (the real one is a good template).
   2. Fill in title, provider, date, category, description and
      credentialUrl. Use a { en, ar, ru } object for title/description
      if you have translations, or a plain string if you don't.
   3. Keep `isDemo: false`.
   4. Put the image file in academic/assets/certificates/ and point
      `image` at it (`assets/certificates/your-file.jpg`, academic-relative —
      no `../`). If the file isn't there yet, the card just hides its media
      frame and the viewer shows a clean placeholder — nothing breaks.
   5. Save the file — nothing else needs to change.
   ------------------------------------------------------------ */

const certificatesData = [
  {
    // Hussein's first real, earned certificate.
    // Framed honestly as PRACTICAL AI LITERACY and hands-on exposure to
    // modern AI tools and workflows — deliberately NOT as AI expertise
    // or AI engineering.
    title: {
      en: 'Elements of AI for Business',
      ar: 'عناصر الذكاء الاصطناعي للأعمال',
      ru: 'Основы искусственного интеллекта для бизнеса',
    },
    provider: 'MinnaLearn · University of Helsinki',
    date: 'July 13, 2026',
    category: 'Artificial Intelligence & Business',
    image: 'assets/certificates/elements-of-ai-for-business.jpg',
    credentialUrl:
      'https://courses.minnalearn.com/certificate/ar/elements-of-ai-for-business/253fbdeb-e4cc-4d4a-b668-ceb4056df15e',
    description: {
      en: 'Completed the 4-week Elements of AI for Business program, developing a practical understanding of artificial intelligence and exploring how modern AI tools can be applied to learning, productivity, content creation, and business-related tasks.',
      ar: 'أتممت برنامج Elements of AI for Business لمدة أربعة أسابيع، واكتسبت فهمًا عمليًا لأساسيات الذكاء الاصطناعي وتطبيقاته، مع التدريب على استخدام مجموعة متنوعة من أدوات الذكاء الاصطناعي في التعلّم والإنتاجية وصناعة المحتوى والمهام المرتبطة بالأعمال.',
      ru: 'Завершил четырёхнедельную программу Elements of AI for Business, получив практическое понимание искусственного интеллекта и изучив применение современных AI-инструментов для обучения, продуктивности, создания контента и решения бизнес-задач.',
    },
    isDemo: false,
  },
];

/* ------------------------------------------------------------
   PARKED DEMO ENTRIES — kept, not deleted (nothing is ever lost).

   These were placeholder stubs used to preview the UI before any
   real certificate existed. Now that a real one is in place they are
   commented out, so visitors only ever see genuine certificates.
   To reuse one as a starting point, copy it up into the array above
   and fill it in with real details.
   ------------------------------------------------------------
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
------------------------------------------------------------ */
