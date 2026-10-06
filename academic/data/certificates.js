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
   (e.g. `assets/certificates/x.jpg`), NOT to any one page. mediaPath() in
   assets/js/records.js adds the `academic/` hop when records.html renders
   them, so the SAME data works with no build step. Don't prefix them
   with `../`.

   ONE EXCEPTION: a path that starts with `../` marks a file that lives
   outside academic/ — at the PROJECT ROOT, where the DataCamp images and
   PDF and the dictation scan were left exactly where they were placed
   rather than being copied or moved. mediaPath() strips the leading `../`,
   because records.html sits at the root itself: keeping it would climb
   above a site deployed under a subpath (GitHub Pages serves the repo at
   /hussein-portfolio/, so `../x` 404s — measured) and above the project
   folder under file://.
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
  {
    /* ============================================================
       INTERNATIONAL DICTATION 2026 — A PARTICIPATION CERTIFICATE.
       The word that matters in this record is PARTICIPATION, and every
       language says it.
       ------------------------------------------------------------
       WHAT THE DOCUMENT ITSELF SAYS, read off the certificate:
         · "This certificate is proudly presented to Hussein Mohamed
           Mostafa Ahmed ElBassiouni"
         · "in recognition of (his\her) participation in the annual
           international educational campaign «International dictation»
           2026 in the nomination Arabic Language"
         · signed by Zakharenko M. P., General Director
         · dated September 18, 2026 — Moscow

       WHAT IT DOES NOT SAY, and what may therefore never be written
       anywhere: no place, no rank, no prize, no award, no shortlist.
       This is not a win and it is not a 1st/2nd/3rd place; it is a
       certificate of having taken part. "حصلتُ على شهادة مشاركة" is
       the strongest true sentence this record is allowed to contain,
       and `category` below carries exactly that word in all three
       languages so no reader can mistake it for one.

       MOSCOW IS NOT WHERE HE WAS. It is printed under the date, which
       is where the organisation signed it — the issuer's line. He took
       part in Cairo, and `location` says Cairo. The two are different
       facts and they are deliberately not merged into one field.

       THE CAMPAIGN NAME is printed in English on the document, so EN
       and RU keep that exact wording; the Arabic version carries it in
       Arabic script, like every other Arabic string on this site. The
       NOMINATION is the document's own wording too: Latin in EN and
       RU, Arabic in AR.

       THE FILE sits at the project root, where it was placed, so its
       path starts with `../` exactly like the DataCamp certificate's —
       see the path note at the top of this file. Nothing was renamed,
       copied or moved. */
    title: {
      en: 'International Dictation 2026 — Participation Certificate',
      ar: 'شهادة مشاركة في الإملاء متعدد القوميات 2026',
      ru: 'Межнациональный диктант 2026 — Сертификат участника',
    },
    /* THE EVENT the certificate was issued for — the campaign, which is not
       the same fact as the organisation that hosted it below, and not the
       same fact as the title either. Its name is printed on the document. */
    event: {
      en: 'International Dictation 2026',
      ar: 'الإملاء متعدد القوميات 2026',
      ru: 'Межнациональный диктант 2026',
    },
    /* the organisation that ran the campaign Hussein took part in */
    provider: {
      en: 'Russian House in Cairo',
      ar: 'البيت الروسي بالقاهرة',
      ru: 'Русский дом в Каире',
    },
    date: {
      en: 'September 18, 2026',
      ar: '18 سبتمبر 2026',
      ru: '18 сентября 2026',
    },
    /* the credential TYPE, in the words the document itself uses —
       the same slot the DataCamp record fills with "Statement of
       Accomplishment", and the reason the card reads "شهادة مشاركة"
       rather than anything that sounds like a prize */
    category: {
      en: 'Participation certificate',
      ar: 'شهادة مشاركة',
      ru: 'Сертификат участника',
    },
    /* the part he took in it: he participated. That is the whole claim. */
    role: {
      en: 'Participant',
      ar: 'مشارك',
      ru: 'Участник',
    },
    /* where the ACTIVITY happened — Cairo, never Moscow */
    location: {
      en: 'Russian House in Cairo, Cairo, Egypt',
      ar: 'البيت الروسي بالقاهرة — القاهرة، مصر',
      ru: 'Русский дом в Каире, Каир, Египет',
    },
    /* the category the certificate was issued under */
    nomination: {
      en: 'Arabic Language',
      ar: 'اللغة العربية',
      ru: 'Arabic Language',
    },
    /* the languages the dictation itself was written in */
    languages: {
      en: 'Arabic and Russian',
      ar: 'العربية والروسية',
      ru: 'Арабский и русский',
    },
    image: '../شهادة مشاركة في يوم الإملاء العالمي بالبيت الروسي.jpeg',
    /* no credentialUrl and no verificationUrl: the document itself is the
       credential, and no verified address for this campaign exists in the
       project. Inventing one would be fabricating a link. */
    description: {
      en: 'On September 18, 2026, International Dictation 2026 was held at the Russian House in Cairo with the participation of Youth Club members. Participants completed the dictation in Arabic and Russian as part of the international educational campaign. I received a participation certificate in the Arabic Language nomination.',
      ar: 'في 18 سبتمبر 2026، أُقيمت فعاليات الإملاء متعدد القوميات في البيت الروسي بالقاهرة بمشاركة أعضاء نادي الشباب. شارك الحضور في كتابة الإملاء باللغتين العربية والروسية، ضمن الحملة التعليمية الدولية «الإملاء متعدد القوميات 2026». حصلتُ على شهادة مشاركة ضمن فئة اللغة العربية.',
      ru: '18 сентября 2026 года в Русском доме в Каире состоялся Межнациональный диктант 2026 с участием членов Молодёжного клуба. Участники писали диктант на арабском и русском языках в рамках международной просветительской акции. Я получил сертификат участника в номинации «Arabic Language».',
    },
    /* the sentence a screen reader is given instead of a filename: what the
       document is, whose it is, and under which nomination — written in the
       visitor's own language. */
    alt: {
      en: "Hussein ElBassiouni's participation certificate for International Dictation 2026 in the Arabic Language nomination",
      ar: 'شهادة مشاركة لحسين البسيوني في الإملاء متعدد القوميات 2026 ضمن فئة اللغة العربية',
      ru: 'Сертификат участника Хусейна Эльбасьюни в Межнациональном диктанте 2026 в номинации «Arabic Language»',
    },
    isDemo: false,
    /* Concept tags — the controlled vocabulary used by the filter buttons on
       the site. ONE slug, because the concept this record teaches is the
       LANGUAGE and nothing in the vocabulary covered it. Everything else a
       visitor might type — الإملاء، البيت الروسي, Cairo, Русский дом, 2026,
       the nomination, the two languages — is already text on the record and
       is matched by the search index, so no near-duplicate slug was created
       to carry it. See "The Tagging Rule" in AGENTS.md.
       Current vocabulary: ai · first-aid · data · python · excel ·
       language · volunteering */
    tags: ['language'],
  },
   {
    // A DataCamp Statement of Accomplishment for a completed course.
    //
    // WHAT THIS IS NOT, deliberately: it is not a "DataCamp certification",
    // not a "Google certification", and completing it does not make anyone
    // a "Google Sheets expert". It is a course completion, and the record
    // says so in the credential type and nowhere else. The only claim made
    // anywhere here is the one printed on the document itself.
    //
    // The course title is NOT translated. A credential's title is the exact
    // string on the certificate, and the certificate in the preview is in
    // English — translating it would put a title on the page that the
    // document does not carry. The provider "DataCamp" is a brand and stays
    // in Latin in all three languages, like LinkedIn and GitHub.
    //
    // The two files are the two halves of ONE credential: the JPEG is the
    // card's preview, the PDF is the official document that "view
    // certificate" opens. Hussein placed both at the PROJECT ROOT and
    // nothing has been moved, copied, renamed or re-exported, so their
    // paths start with `../` — see the path note at the top of this file.
    // There is deliberately NO credentialUrl: the PDF is the official
    // document and no verification URL was invented for it.
    title: 'Introduction to Google Sheets',
    provider: 'DataCamp',
    date: {
      en: '27 Sep 2026',
      ar: '27 سبتمبر 2026',
      ru: '27 сентября 2026',
    },
    /* the credential TYPE, printed exactly as the certificate prints it */
    category: {
      en: 'Statement of Accomplishment',
      ar: 'بيان إتمام',
      ru: 'Подтверждение о прохождении курса',
    },
    duration: {
      en: '2 hrs',
      ar: 'ساعتان',
      ru: '2 часа',
    },
    /* printed verbatim, commas and all, exactly as the document shows it */
    credentialId: '#47,542,476',
    image: '../Introduction to Google Sheets_page-0001.jpg',
    pdf: '../Introduction to Google Sheets.pdf',
    description: {
      en: 'A two-hour DataCamp course on spreadsheet fundamentals: entering and formatting data, writing formulas and calculations, using comparison operators, and referencing cells correctly.',
      ar: 'دورة من ساعتين على منصة DataCamp تتناول أساسيات الجداول: إدخال البيانات وتنسيقها، وكتابة الصيغ والحسابات، واستخدام معاملات المقارنة، والإشارة إلى الخلايا بشكل صحيح.',
      ru: 'Двухчасовой курс DataCamp по основам работы с таблицами: ввод и форматирование данных, написание формул и вычислений, использование операторов сравнения и корректные ссылки на ячейки.',
    },
    isDemo: false,
    /* THE DETAIL VIEW, and the ONLY record on the site that has one.

       Everything here is optional: a record without a `details` block gets
       no such sections and no empty headings. The blocks are rendered only
       where the data has them.

       PROVENANCE, because this is the part that matters: these items were
       supplied by Hussein for this course. Nothing was inferred from the
       course name and nothing was invented — in particular there is no
       "learning outcome" and no personal takeaway here, because he has not
       written one, and a completed course is still not a certification.

       The items are kept in English on purpose, for the same reason the
       course title is: they are the course's own terminology. The
       description above IS translated, because that text is the project's
       and not the provider's. */
    details: {
      topics: {
        en: [
          'Spreadsheet fundamentals',
          'Cells and formulas',
          'Calculations',
          'Comparison operators',
          'Cell references',
          'Working with tabular data',
          'Creating formulas',
          'Applying calculations at scale',
          'Organizing spreadsheet data',
          'Communicating insights with spreadsheets',
        ],
      },
      /* chapter titles only — no description was supplied for either, so
         neither is written here and the chapter renders as a title only */
      chapters: {
        en: [
          { title: 'Cells and Formulas' },
          { title: 'Cell References' },
        ],
      },
      /* the practice files that ship with the course. NAMES only: no URL
         was supplied, and inventing one would be fabricating a link. */
      resources: {
        en: [
          { label: 'Food Ingredients' },
          { label: 'Most Populous Countries' },
          { label: 'Bank Accounts' },
        ],
      },
      /* named in the course material. Their relationship to the course is
         not stated in any source the project holds, so this is labelled
         "collaborators" and nothing more is claimed about them. */
      collaborators: {
        en: ['Amy Peterson', 'James Chapman'],
      },
    },
    /* Concept tags — the controlled vocabulary used by the filter buttons on
       the site. `data` is the existing slug that covers the subject area.
       A dedicated `spreadsheets` slug is PROPOSED in the report rather than
       invented here: every new tag has to be translated into three
       languages, and that is Hussein's call. See "The Tagging Rule" in
       AGENTS.md. Current vocabulary: ai · first-aid · data · python · excel */
    tags: ['data'],
  },
  {
    /* ============================================================
       A SECOND DATACAMP STATEMENT — same issuer, same credential
       type as the record above, a different course. Everything here
       was read off the certificate image itself before anything was
       written:
         · "STATEMENT OF ACCOMPLISHMENT"
         · "#50,161,411"
         · "HAS BEEN AWARDED TO Hussein Mohamed Mostafa Ahmed
            ElBassiouni"
         · "FOR SUCCESSFULLY COMPLETING Data Analysis in Google Sheets"
         · "LENGTH 3 HRS"
         · "COMPLETED ON OCT 06, 2026"
         · signed Jonathan Cornelissen, CEO, DataCamp
       ------------------------------------------------------------
       NOT A CERTIFICATION, exactly like the record above: this is a
       course completion and it claims nothing beyond the words
       printed on the document. In particular there is NO XP figure
       anywhere — the document prints none, so none is written, no
       matter what the learner account may show.
       ------------------------------------------------------------
       The course title is the document's exact English string and
       is not translated, for the reason given above; "DataCamp"
       stays in Latin in all three languages as a brand, like
       LinkedIn and GitHub.
       ------------------------------------------------------------
       NO PDF WAS SUPPLIED for this one — only the JPEG — so there is
       deliberately no `pdf` field and, with no verification URL
       published, no `credentialUrl` either: the image is the whole
       of the credential here, and inventing a link would be
       fabricating one. The file sits at the project root exactly as
       it was placed (nothing renamed, copied or moved), so its path
       starts with `../` like its sibling's — see the path note at
       the top of this file. */
    title: 'Data Analysis in Google Sheets',
    provider: 'DataCamp',
    date: {
      en: '6 Oct 2026',
      ar: '6 أكتوبر 2026',
      ru: '6 октября 2026',
    },
    /* the credential TYPE, printed exactly as the document prints it */
    category: {
      en: 'Statement of Accomplishment',
      ar: 'بيان إتمام',
      ru: 'Подтверждение о прохождении курса',
    },
    duration: {
      en: '3 hrs',
      ar: 'ثلاث ساعات',
      ru: '3 часа',
    },
    /* printed verbatim, commas and all, exactly as the document shows it */
    credentialId: '#50,161,411',
    image: '../Data Analysis in Google Sheets_page-0001.jpg',
    description: {
      en: 'A three-hour DataCamp course on data analysis in Google Sheets: looking values up across tables with VLOOKUP, sorting and filtering data, and cleaning spreadsheet data before analysing it.',
      ar: 'دورة من ثلاث ساعات على منصة DataCamp لتحليل البيانات في الجداول الإلكترونية: البحث عن القيم داخل الجداول، وترتيب البيانات وتصفيتها، وتنظيف بيانات الجداول قبل التحليل.',
      ru: 'Трёхчасовой курс DataCamp по анализу данных в Google Sheets: поиск значений по таблицам с помощью VLOOKUP, сортировка и фильтрация данных, а также очистка табличных данных перед анализом.',
    },
    /* the sentence a screen reader is given instead of a filename, in the
       visitor's own language — same recipe as the participation record */
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing Data Analysis in Google Sheets",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام دورة تحليل البيانات في الجداول الإلكترونية',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании курса анализа данных в Google Sheets',
    },
    isDemo: false,
    /* THE DETAIL VIEW — only what was supplied: three course topics, in
       the course's own English terminology, kept English in every
       language for the reason the record above gives. No chapters, no
       resources and no collaborators were given for this course, so
       none are written — the block renders its one section and nothing
       is invented to fill the gap. */
    details: {
      topics: {
        en: [
          'VLOOKUP',
          'Sorting and filtering data',
          'Data cleaning in spreadsheets',
        ],
      },
    },
    /* Concept tags — ONE slug: the concept this course teaches is data
       analysis, which the existing `data` slug already covers — the same
       slug its sibling spreadsheet course carries. Tag the concept, not
       the tool: no near-duplicate was created for "Sheets", and no new
       translation was invented. See "The Tagging Rule" in AGENTS.md.
        Current vocabulary: ai · first-aid · data · python · excel ·
        language · volunteering */
    tags: ['data'],
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
