/* ============================================================
   DATA/CERTIFICATES.JS
   Pure data. No HTML, no styling, no logic beyond the array
   itself — js/certificates.js (and the CV page) are the only
   files that read this.

   MULTILINGUAL FIELDS (AR / EN / RU)
   A certificate's fields may each be EITHER:
     • a plain string  — shown as-is in every language, or
     • an object { en, ar, ru }  — the matching language is shown,
       falling back to English. This lets a certificate read
       naturally in Arabic and Russian, matching the rest of the
       trilingual site.
   `provider`, `date` and `category` are localised objects too. This
   matters: the Arabic version of the site must contain NO Latin
   characters at all, so "July 13, 2026" cannot stay in English — it has
   to read "13 يوليو 2026", and the provider "MinnaLearn · University
   of Helsinki" has to read "ميناليرن · جامعة هلسنكي".

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
    provider: {
      en: 'MinnaLearn · University of Helsinki',
      ar: 'ميناليرن · جامعة هلسنكي',
      ru: 'MinnaLearn · Хельсинкский университет',
    },
    date: {
      en: 'July 13, 2026',
      ar: '13 يوليو 2026',
      ru: '13 июля 2026',
    },
    category: {
      en: 'Artificial Intelligence & Business',
      ar: 'الذكاء الاصطناعي والأعمال',
      ru: 'Искусственный интеллект и бизнес',
    },
    image: 'assets/certificates/elements-of-ai-for-business.jpg',
    credentialUrl:
      'https://courses.minnalearn.com/certificate/ar/elements-of-ai-for-business/253fbdeb-e4cc-4d4a-b668-ceb4056df15e',
    description: {
      en: 'Completed the 4-week Elements of AI for Business program, developing a practical understanding of artificial intelligence and exploring how modern AI tools can be applied to learning, productivity, content creation, and business-related tasks.',
      ar: 'أتممت برنامج «عناصر الذكاء الاصطناعي للأعمال» لمدة أربعة أسابيع، واكتسبت فهمًا عمليًا لأساسيات الذكاء الاصطناعي وتطبيقاته، مع التدريب على استخدام مجموعة متنوعة من أدوات الذكاء الاصطناعي في التعلّم والإنتاجية وصناعة المحتوى والمهام المرتبطة بالأعمال.',
      ru: 'Завершил четырёхнедельную программу Elements of AI for Business, получив практическое понимание искусственного интеллекта и изучив применение современных AI-инструментов для обучения, продуктивности, создания контента и решения бизнес-задач.',
    },
    isDemo: false,
    /* Concept tags — the controlled vocabulary used by the filter buttons
       on the site. Reuse an existing slug when the concept already exists;
       only introduce a genuinely new one. See "The Tagging Rule" in AGENTS.md.
       Current vocabulary: ai · first-aid · data · python · excel */
    tags: ['ai'],
  },
  {
    // First Aid certificate from Edraak — one certificate, two PDF versions (AR/EN)
    title: {
      en: 'First Aid',
      ar: 'الإسعافات الأولية',
      ru: 'Первая помощь',
    },
    provider: {
      en: 'Edraak',
      ar: 'إدراك',
      ru: 'Edraak',
    },
    date: {
      en: 'September 15, 2026',
      ar: '15 سبتمبر 2026',
      ru: '15 сентября 2026',
    },
    category: {
      en: 'Health & Safety',
      ar: 'الصحة والسلامة',
      ru: 'Здоровье и безопасность',
    },
    image: {
      en: 'assets/certificates/first-aid-edraak-en.jpg',
      ar: 'assets/certificates/first-aid-edraak-ar.jpg',
      ru: 'assets/certificates/first-aid-edraak-en.jpg',
    },
    pdf: {
      en: 'assets/certificates/first-aid-edraak-en.pdf',
      ar: 'assets/certificates/first-aid-edraak-ar.pdf',
      ru: 'assets/certificates/first-aid-edraak-en.pdf',
    },
    verificationUrl: {
      en: 'https://programs.edraak.org/learn/verify-certificate/ee26434337f74d3c962cc82c93aa7c33/?lang=en',
      ar: 'https://programs.edraak.org/learn/verify-certificate/ee26434337f74d3c962cc82c93aa7c33/?lang=ar',
      ru: 'https://programs.edraak.org/learn/verify-certificate/ee26434337f74d3c962cc82c93aa7c33/?lang=en',
    },
    description: {
      en: 'Successfully completed the First Aid course on Edraak, covering essential emergency response skills including CPR, wound care, choking relief, and basic life support techniques.',
      ar: 'أتممت بنجاح دورة الإسعافات الأولية على منصة إدراك، وتغطي مهارات الاستجابة للطوارئ الأساسية بما في ذلك الإنعاش القلبي الرئوي، ورعاية الجروح، وتخفيف الاختناق، وتقنيات الدعم الأساسي للحياة.',
      ru: 'Успешно завершил курс Первой помощи на Edraak, охватывающий основные навыки экстренной реагирования, включая КЛР, уход за ранами, помощь при удушье и базовые методы поддержания жизни.',
    },
    isDemo: false,
    /* Concept tags — the controlled vocabulary used by the filter buttons
       on the site. Add an existing slug when the concept already exists;
       only introduce a genuinely new one. See "The Tagging Rule" in AGENTS.md.
       Current vocabulary: ai · first-aid · data · python · excel */
    tags: ['first-aid'],
  },
];

// Expose for the site renderer (assets/js/site.js).
if (typeof window !== 'undefined') window.certificatesData = certificatesData;

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
