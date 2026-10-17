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
    alt: {
      en: "Hussein ElBassiouni's certificate for completing Elements of AI for Business, MinnaLearn and University of Helsinki",
      ar: 'شهادة إتمام برنامج عناصر الذكاء الاصطناعي للأعمال لحسين البسيوني، ميناليرن وجامعة هلسنكي',
      ru: 'Сертификат Хусейна Эльбасьюни об окончании программы Основы искусственного интеллекта для бизнеса, MinnaLearn и Хельсинкский университет',
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
    alt: {
      en: "Hussein ElBassiouni's certificate for completing the First Aid course on Edraak",
      ar: 'شهادة إتمام دورة الإسعافات الأولية لحسين البسيوني من منصة إدراك',
      ru: 'Сертификат Хусейна Эльбасьюни об окончании курса Первой помощи на платформе Edraak',
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
    parentTrack: 'google-sheets-fundamentals',
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
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing Introduction to Google Sheets",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام دورة أساسيات الجداول الإلكترونية',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании курса основ работы с Google Sheets',
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
       A THIRD DATACAMP STATEMENT — the Intermediate Google Sheets
       course. Same issuer (DataCamp), same credential type, read off
       the certificate image before anything was written:
         · "STATEMENT OF ACCOMPLISHMENT"
         · "#50,277,774"
         · "HAS BEEN AWARDED TO Hussein Mohamed Mostafa Ahmed
            ElBassiouni"
         · "FOR SUCCESSFULLY COMPLETING Intermediate Google Sheets"
         · "LENGTH 4 HRS"
         · "COMPLETED ON OCT 08, 2026"
       ------------------------------------------------------------
       NOT A CERTIFICATION, exactly like its two siblings: this is a
       course completion and claims nothing beyond the words printed
       on the document. The XP figure (4,150 XP) comes from the
       DataCamp learner account, not from the document — so, following
       the Data Analysis record's precedent, it is recorded in the CV
       ledger with its provenance and deliberately NOT shown on the
       card or in the details view.
       ------------------------------------------------------------
       The course title is the document's exact English string and is
       not translated, for the reason given above; "DataCamp" stays in
       Latin in all three languages as a brand, like LinkedIn and
       GitHub.
       ------------------------------------------------------------
       The two files sit at the project root exactly as Hussein placed
       them — nothing renamed, copied or moved — so their paths start
       with `../` like their siblings' — see the path note at the top
       of this file. The PDF is the official document that "view
       certificate" opens, so no credentialUrl was invented. */
    title: 'Intermediate Google Sheets',
    parentTrack: 'google-sheets-fundamentals',
    provider: 'DataCamp',
    date: {
      en: '8 Oct 2026',
      ar: '8 أكتوبر 2026',
      ru: '8 октября 2026',
    },
    /* the credential TYPE, printed exactly as the document prints it */
    category: {
      en: 'Statement of Accomplishment',
      ar: 'بيان إتمام',
      ru: 'Подтверждение о прохождении курса',
    },
    duration: {
      en: '4 hrs',
      ar: 'أربع ساعات',
      ru: '4 часа',
    },
    /* printed verbatim, commas and all, exactly as the document shows it */
    credentialId: '#50,277,774',
    image: '../Intermediate Google Sheets_page-0001.jpg',
    pdf: '../Intermediate Google Sheets.pdf',
    description: {
      en: 'A four-hour DataCamp course on intermediate spreadsheets: advanced data types and manipulation, numeric and logical data, missing data and errors, summary statistics on real-world datasets, positional matching, sorting and filtering, and simple imputation.',
      ar: 'دورة من أربع ساعات على منصة DataCamp في المستوى المتوسط للجداول الإلكترونية: أنواع البيانات المتقدمة ومعالجة البيانات، والبيانات الرقمية والمنطقية، والبيانات المفقودة والأخطاء، والإحصاءات الوصفية على بيانات من الواقع، والمطابقة الموضعية، والترتيب والتصفية، وتعبئة القيم المفقودة بطرق بسيطة.',
      ru: 'Четырёхчасовой курс DataCamp по таблицам продвинутого уровня: продвинутые типы данных и работа с ними, числовые и логические данные, пропущенные данные и ошибки, описательная статистика на реальных наборах данных, позиционное сопоставление, сортировка и фильтрация, а также простое восстановление пропущенных значений.',
    },
    /* the sentence a screen reader is given instead of a filename */
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing Intermediate Google Sheets",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام دورة الجداول الإلكترونية المستوى المتوسط',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании курса Intermediate Google Sheets',
    },
    isDemo: false,
    /* THE DETAIL VIEW, mirroring the two sibling Statements. All of it
       came from the brief Hussein supplied for this course, in the
       course's own English terminology, kept English for the same
       reason the siblings give: these are the provider's words, not
       the project's. */
    details: {
      /* the brief's "covers" list — what the course teaches, folded
         into `topics` exactly as the Data Analysis record folds its
         skill list: a completed course is not a claim of mastery */
      topics: {
        en: [
          'Advanced data types and manipulation',
          'Numeric and logical data',
          'Missing data and errors',
          'Summary statistics',
          'Real-world datasets',
          'Positional matching',
          'Sorting and filtering',
          'Simple imputation',
        ],
      },
      /* chapter titles only — no chapter description was supplied, so
         each chapter renders as a title only, like the siblings' */
      chapters: {
        en: [
          { title: "What's in a cell?" },
          { title: 'Working with numbers' },
          { title: 'Logic & Errors' },
          { title: 'Positional Matching' },
        ],
      },
      /* the one person named by DataCamp for this course — its
         instructor/contributor, labelled no more strongly than the
         siblings label their collaborators */
      collaborators: {
        en: ['Richie Cotton'],
      },
    },
    /* Concept tags — ONE slug, exactly like its two spreadsheet
       siblings: the concept this course teaches is data analysis,
       which the existing `data` slug already covers. No near-duplicate
       was created for "Sheets", "Spreadsheets" or "DataCamp", and no
       new translation was invented. See "The Tagging Rule" in AGENTS.md.
       Current vocabulary: ai · first-aid · data · python · excel ·
       language · volunteering */
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
    parentTrack: 'google-sheets-fundamentals',
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
    /* THE DETAIL VIEW. Everything here came from Hussein's course
       payload for this course, in the course's own English terminology,
       kept English in every language for the same reason the record
       above gives: these are the provider's words, not the project's.
       The four blocks are the same four the sibling DataCamp record
       carries, so the two Statements of Accomplishment read alike.
       Nothing was inferred from the course name and nothing invented:
         · chapters — titles only; no chapter description was supplied, so
           none is written and each chapter renders as its title;
         · resources — the practice files that ship with the course, NAMES
           only; no URL was supplied, and inventing one would fabricate a
           link, so they render as plain labels;
         · two collaborators named in the course material, labelled no more
           strongly than the sibling record labels its own.
       The brief's skill list is folded into `topics` (what the course
       covers), deliberately NOT written as a `skills` claim: a completed
       course is not a claim of a skill level — see the sibling record's
       note and the ⚠ claiming note in CV.md. */
    details: {
      topics: {
        en: [
          'Data analysis in spreadsheets',
          'Data cleaning',
          'Data preparation',
          'Data exploration',
          'Summary statistics',
          'Sorting and filtering',
          'Unique values',
          'Conditional functions',
          'Logical expressions',
          'Conditional aggregation',
          'VLOOKUP',
          'Combining data from different tables',
          'Text data cleaning',
          'Date and time data cleaning',
          'Spreadsheet workflows',
          'Data manipulation',
        ],
      },
      chapters: {
        en: [
          { title: 'Exploring Data' },
          { title: 'Cleaning and Preparing Data' },
          { title: 'Analyzing Data' },
        ],
      },
      resources: {
        en: [
          { label: 'Educational Programs' },
          { label: 'Moons of the Solar System' },
          { label: 'Kickstarter Games' },
          { label: 'Employee Expenses' },
          { label: 'Manufacturing Costs' },
          { label: 'Highest Grossing Films' },
        ],
      },
      collaborators: {
        en: ['Amy Peterson', 'James Chapman'],
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
  {
    /* ============================================================
       LINKEDIN LEARNING — You Need a Career Development Plan
       Completed Dec 1, 2025. Created by Macmillan Publishers and
       Modern Mentor (Rachel Cooke).
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "You Need a Career Development Plan"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 01, 2025 at 01:28PM UTC · 8 minutes"
         · "Top skills covered: Career Path Planning"
         · "Certificate ID: 5d3ca142f5d6b9413e77fc9ebc7e7b9414d016e546694e1c2b5a593d7a050329"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) for the Arabic strings with
       zero Latin characters (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'You Need a Career Development Plan',
      ar: 'خطة التطوير المهني',
      ru: 'План карьерного развития',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '1 Dec 2025',
      ar: '1 ديسمبر 2025',
      ru: '1 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '8 min',
      ar: '8 دقائق',
      ru: '8 мин',
    },
    credentialId: '5d3ca142f5d6b9413e77fc9ebc7e7b9414d016e546694e1c2b5a593d7a050329',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/5d3ca142f5d6b9413e77fc9ebc7e7b9414d016e546694e1c2b5a593d7a050329',
    image: 'assets/certificates/you-need-a-career-development-plan.jpg',
    pdf: 'assets/certificates/you-need-a-career-development-plan.pdf',
    description: {
      en: 'A LinkedIn Learning course by Macmillan Publishers and Modern Mentor on strategic career roadmapping: establishing actionable professional milestones, seeking mentorship, building foundational skills, and maintaining flexibility.',
      ar: 'دورة على منصة LinkedIn Learning بالتعاون مع ماكميلان للنشر وبودكاست مودرن مينتور، تتناول وضع خطة استراتيجية للتطوير المهني: تحديد الأهداف المرحلية، والاستفادة من التوجيه والإرشاد، واكتساب المهارات الأساسية، وبناء المرونة المهنية.',
      ru: 'Курс LinkedIn Learning от Macmillan Publishers и Modern Mentor по стратегическому карьерному планированию: постановка целей, поиск наставников, развитие ключевых навыков и гибкость в профессии.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for You Need a Career Development Plan",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة خطة التطوير المهني',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса You Need a Career Development Plan',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Career path planning',
          'Professional development roadmapping',
          'Goal setting and milestones',
          'Finding and engaging mentors',
          'Skill cultivation and self-investment',
          'Accountability and career flexibility',
        ],
      },
      collaborators: {
        en: ['Rachel Cooke (Modern Mentor)', 'Macmillan Publishers'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — Job Skills: Learning the Basics
       Completed Dec 1, 2025. Partner: Project Management Institute (PMI).
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Job Skills: Learning the Basics"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 01, 2025 at 06:05PM UTC"
         · "Top skills covered: Soft Skills"
         · "PMI Authorized Training Partner"
         · "Program: PMI® Registered Education Provider | Provider ID: #4101 | Activity #: 4101B70OGE | PDUs: 0.25"
         · "Certificate ID: 6d0f10881ba0ae205f7aac12f1942b62113b4933a80710986e7cc7f61949400f"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Job Skills: Learning the Basics',
      ar: 'مهارات العمل: تعلم الأساسيات',
      ru: 'Профессиональные навыки: базовый курс',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '1 Dec 2025',
      ar: '1 ديسمبر 2025',
      ru: '1 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '19 min',
      ar: '19 دقيقة',
      ru: '19 мин',
    },
    credentialId: '6d0f10881ba0ae205f7aac12f1942b62113b4933a80710986e7cc7f61949400f',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/6d0f10881ba0ae205f7aac12f1942b62113b4933a80710986e7cc7f61949400f',
    image: 'assets/certificates/job-skills-learning-the-basics.jpg',
    pdf: 'assets/certificates/job-skills-learning-the-basics.pdf',
    description: {
      en: 'A 19-minute LinkedIn Learning course approved by the Project Management Institute (PMI) covering 12 essential workplace soft skills: effective communication, decision-making, task prioritization, time management, and constructive conflict resolution.',
      ar: 'دورة من 19 دقيقة على منصة LinkedIn Learning معتمدة من معهد إدارة المشاريع (PMI)، تتناول أهم 12 مهارة شخصية ومهنية للنجاح في بيئة العمل: التواصل الفعّال، واتخاذ القرار، وترتيب أولويات المهام، وإدارة الوقت، والتعامل مع النزاعات وحل المشكلات.',
      ru: '19-минутный курс LinkedIn Learning, одобренный Project Management Institute (PMI), охватывающий 12 ключевых гибких навыков (soft skills) для работы: эффективные коммуникации, принятие решений, расстановка приоритетов, тайм-менеджмент и разрешение конфликтов.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for Job Skills: Learning the Basics",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة مهارات العمل: تعلم الأساسيات',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса Job Skills: Learning the Basics',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Workplace soft skills',
          'Effective communication in customer service',
          'Decision-making fundamentals',
          'Task prioritization and focus',
          'Time management',
          'Constructive conflict resolution',
        ],
      },
      collaborators: {
        en: ['LinkedIn Learning Staff', 'Project Management Institute (PMI)'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — Building Your Career
       Completed Dec 1, 2025. Authors: Patrick Kilner & Pete Mockaitis.
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Building Your Career"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 01, 2025 at 02:11PM UTC · 18 minutes"
         · "Top skills covered: Professional Networking, Career Development"
         · "Certificate ID: 1fc215c5e96c73e9da3cb8027902c0800223f9e6cb837062fe6f260dd048fe57"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Building Your Career',
      ar: 'بناء مسارك المهني',
      ru: 'Построение карьеры',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '1 Dec 2025',
      ar: '1 ديسمبر 2025',
      ru: '1 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '18 min',
      ar: '18 دقيقة',
      ru: '18 мин',
    },
    credentialId: '1fc215c5e96c73e9da3cb8027902c0800223f9e6cb837062fe6f260dd048fe57',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/1fc215c5e96c73e9da3cb8027902c0800223f9e6cb837062fe6f260dd048fe57',
    image: 'assets/certificates/building-your-career.jpg',
    pdf: 'assets/certificates/building-your-career.pdf',
    description: {
      en: 'An 18-minute LinkedIn Learning course by Patrick Kilner and Pete Mockaitis focusing on strategic relationship-building: cultivating influential mentors, replacing loose networking with high-impact connections, and preparing meaningful professional conversations.',
      ar: 'دورة من 18 دقيقة على منصة LinkedIn Learning يقدمها باتريك كيلنر وبيت موكايتيس، تركز على بناء العلاقات المهنية الاستراتيجية: اختيار الموجهين والمرشدين المؤثرين، واستبدال شبكات المعارف التقليدية بروابط مهنية وثيقة ذات أثر مباشر في النمو والتطور.',
      ru: '18-минутный курс LinkedIn Learning от Патрика Килнера и Пита Мокайтиса, посвящённый стратегическому нетворкингу: выстраиванию отношений с ключевыми наставниками и созданию устойчивых профессиональных связей для карьерного роста.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for Building Your Career",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة بناء مسارك المهني',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса Building Your Career',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Professional networking',
          'Strategic relationship building',
          'Finding great mentors',
          'Preparing high-value meetings',
          'Asking key career questions',
        ],
      },
      collaborators: {
        en: ['Patrick Kilner', 'Pete Mockaitis (How to Be Awesome at Your Job)'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — Making Your Next Career Move Your Best Move
       Completed Dec 2, 2025. Authors: Kimberly Brown & Pete Mockaitis.
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Making Your Next Career Move Your Best Move"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 02, 2025 at 03:07PM UTC · 15 minutes"
         · "Top skills covered: Career Management"
         · "Certificate ID: e70c27c273a173f02ea7a95ecf221ae6534686f8fdc8d83422702fc92a0e92a3"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Making Your Next Career Move Your Best Move',
      ar: 'الخطوة المهنية القادمة: خيارك الأفضل',
      ru: 'Следующий карьерный шаг: лучший выбор',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '2 Dec 2025',
      ar: '2 ديسمبر 2025',
      ru: '2 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '15 min',
      ar: '15 دقيقة',
      ru: '15 мин',
    },
    credentialId: 'e70c27c273a173f02ea7a95ecf221ae6534686f8fdc8d83422702fc92a0e92a3',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/e70c27c273a173f02ea7a95ecf221ae6534686f8fdc8d83422702fc92a0e92a3',
    image: 'assets/certificates/making-your-next-career-move-your-best-move.jpg',
    pdf: 'assets/certificates/making-your-next-career-move-your-best-move.pdf',
    description: {
      en: 'A 15-minute LinkedIn Learning course by leadership expert Kimberly Brown and Pete Mockaitis focusing on strategic career transitions: evaluating core strengths, cultivating in-demand capabilities, planning professional progression, and unlocking new opportunities.',
      ar: 'دورة من 15 دقيقة على منصة LinkedIn Learning تقدمها خبيرة القيادة كيمبرلي براون وبيت موكايتيس، تتناول التخطيط للانتقال المهني الناجح: تقييم نقاط القوة الذاتية، وتطوير المهارات المطلوبة، ورسم الرؤية المستقبلية للمسار الوظيفي، واقتناص الفرص النوعية.',
      ru: '15-минутный курс LinkedIn Learning от эксперта по лидерству Кимберли Браун и Пита Мокайтиса о планировании успешного карьерного перехода: оценка сильных сторон, развитие востребованных навыков и стратегическое видение карьеры.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for Making Your Next Career Move Your Best Move",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة الخطوة المهنية القادمة: خيارك الأفضل',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса Making Your Next Career Move Your Best Move',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Career management',
          'Assessing strengths and growth areas',
          'Transition planning',
          'Future vision mapping',
          'Connecting with opportunity drivers',
        ],
      },
      collaborators: {
        en: ['Kimberly Brown', 'Pete Mockaitis (How to Be Awesome at Your Job)'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — Nano Tips for Closing the Soft Skills Gap
       with Gen Z with Watchen Nyanue
       Completed Dec 2, 2025. Author: Watchen Nyanue (I Choose The Ladder).
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Nano Tips for Closing the Soft Skills Gap with Gen Z with Watchen Nyanue"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 02, 2025 at 05:58PM UTC · 12 minutes"
         · "Top skills covered: Interpersonal Skills, Soft Skills"
         · "Certificate ID: 35d9ca0110946dae3a8657175b805e6d36510ca6fbce6f86f4e23ac80cfbac0d"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Nano Tips for Closing the Soft Skills Gap with Gen Z with Watchen Nyanue',
      ar: 'نصائح سريعة: سد فجوة المهارات الشخصية للجيل Z مع واتشن نيانو',
      ru: 'Краткие советы: развитие гибких навыков для поколения Z с Уотчен Ньянуэ',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '2 Dec 2025',
      ar: '2 ديسمبر 2025',
      ru: '2 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '12 min',
      ar: '12 دقيقة',
      ru: '12 мин',
    },
    credentialId: '35d9ca0110946dae3a8657175b805e6d36510ca6fbce6f86f4e23ac80cfbac0d',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/35d9ca0110946dae3a8657175b805e6d36510ca6fbce6f86f4e23ac80cfbac0d',
    image: 'assets/certificates/nano-tips-closing-soft-skills-gap-gen-z.jpg',
    pdf: 'assets/certificates/nano-tips-closing-soft-skills-gap-gen-z.pdf',
    description: {
      en: 'A 12-minute LinkedIn Learning Nano Tips course by career strategist Watchen Nyanue focusing on core interpersonal and professional competencies: effective communication, critical thinking, managing workplace ambiguity, handling conflict constructively, and stress resilience.',
      ar: 'دورة مكثفة من 12 دقيقة على منصة LinkedIn Learning تقدمها خبيرة التطوير المهني واتشن نيانو، تركز على المهارات الشخصية والتواصلية الأساسية في بيئة العمل: التواصل المهني، والتفكير النقدي، والتعامل مع الغموض، وحل النزاعات بأسلوب بنّاء، وإدارة ضغوط العمل.',
      ru: '12-минутный экспресс-курс LinkedIn Learning от эксперта по карьере Уотчен Ньянуэ, посвящённый ключевым межличностным навыкам: деловое общение, критическое мышление, работа в условиях неопределённости, конструктивное разрешение конфликтов и стрессоустойчивость.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for Nano Tips for Closing the Soft Skills Gap with Gen Z with Watchen Nyanue",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة نصائح سريعة لسد فجوة المهارات الشخصية مع واتشن نيانو',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса Nano Tips for Closing the Soft Skills Gap with Gen Z with Watchen Nyanue',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Professional communication',
          'Critical thinking and independent analysis',
          'Managing up and workplace etiquette',
          'Navigating ambiguity',
          'Constructive conflict resolution',
          'Workplace stress management and active listening',
        ],
      },
      collaborators: {
        en: ['Watchen Nyanue (I Choose The Ladder)'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — Nano Tips for Building Soft Skills
       with Elayne Fluker
       Completed Dec 9, 2025. Author: Elayne Fluker.
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Nano Tips for Building Soft Skills with Elayne Fluker"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 09, 2025 at 07:56PM UTC · 9 minutes"
         · "Top skills covered: Soft Skills"
         · "Certificate ID: a5673704798d9b374b2db85f580f0017808fb95ba9cc4faeb35f84c76a0e3f8f"
         · signed Shea Hanson, Head of Learning Content Strategy
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand LinkedIn Learning).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Nano Tips for Building Soft Skills with Elayne Fluker',
      ar: 'نصائح سريعة: بناء المهارات الشخصية مع إيلين فلوكر',
      ru: 'Краткие советы: развитие гибких навыков с Элейн Флюкер',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '9 Dec 2025',
      ar: '9 ديسمبر 2025',
      ru: '9 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '9 min',
      ar: '9 دقائق',
      ru: '9 мин',
    },
    credentialId: 'a5673704798d9b374b2db85f580f0017808fb95ba9cc4faeb35f84c76a0e3f8f',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/a5673704798d9b374b2db85f580f0017808fb95ba9cc4faeb35f84c76a0e3f8f',
    image: 'assets/certificates/nano-tips-building-soft-skills-elayne-fluker.jpg',
    pdf: 'assets/certificates/nano-tips-building-soft-skills-elayne-fluker.pdf',
    description: {
      en: 'A 9-minute LinkedIn Learning Nano Tips course by executive coach Elayne Fluker covering vital durable soft skills: verbal communication, critical thinking, executive presence, teamwork and collaboration, emotional intelligence, and cultivating a growth mindset.',
      ar: 'دورة مكثفة من 9 دقائق على منصة LinkedIn Learning تقدمها المدربة التنفيذية إيلين فلوكر، تتناول المهارات الشخصية المستدامة الأساسية: التواصل الشفهي الفعّال، والتفكير النقدي، والسمات القيادية، والعمل الجماعي والتعاون، والذكاء العاطفي، وتنمية عقلية النمو والابتكار.',
      ru: '9-минутный экспресс-курс LinkedIn Learning от коуча для руководителей Элейн Флюкер, охватывающий ключевые устойчивые гибкие навыки: устное общение, критическое мышление, лидерские качества, командная работа, эмоциональный интеллект и мышление роста.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for Nano Tips for Building Soft Skills with Elayne Fluker",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة نصائح سريعة لبناء المهارات الشخصية مع إيلين فلوكر',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса Nano Tips for Building Soft Skills with Elayne Fluker',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Durable soft skills fundamentals',
          'Verbal communication and presentation skills',
          'Critical thinking and evidence-based inquiry',
          'Leadership style and executive presence',
          'Inclusive teamwork and collaboration',
          'Emotional intelligence (EQ) in the workplace',
          'Growth mindset and resilience',
          'Creativity and innovative problem solving',
        ],
      },
      collaborators: {
        en: ['Elayne Fluker'],
      },
    },
    tags: ['career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING — The Non-Technical Skills of Effective
       Data Scientists with Keith McCormick (KNIME)
       Completed Dec 13, 2025. Author: Keith McCormick.
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "The Non-Technical Skills of Effective Data Scientists"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 13, 2025 at 02:54PM UTC · 50 minutes"
         · "Top skills covered: Data Science, Soft Skills"
         · "Certificate ID: a15152c0317cc1de77bbfaa0352b47c4c740e7a08e942f69e6911e5fbb9a5023"
         · signed Shea Hanson, Head of Learning Content Strategy
         · NASBA CPE 1.6 Credits (Sponsor ID #140940)
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand names like LinkedIn Learning and KNIME).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'The Non-Technical Skills of Effective Data Scientists',
      ar: 'المهارات غير التقنية لعلماء البيانات الفعّالين مع كيث ماكورميك',
      ru: 'Нетехнические навыки эффективных специалистов по науке о данных с Китом Маккормиком',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '13 Dec 2025',
      ar: '13 ديسمبر 2025',
      ru: '13 декабря 2025',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    duration: {
      en: '50 min',
      ar: '50 دقيقة',
      ru: '50 мин',
    },
    credentialId: 'a15152c0317cc1de77bbfaa0352b47c4c740e7a08e942f69e6911e5fbb9a5023',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/a15152c0317cc1de77bbfaa0352b47c4c740e7a08e942f69e6911e5fbb9a5023',
    image: 'assets/certificates/non-technical-skills-effective-data-scientists.jpg',
    pdf: 'assets/certificates/non-technical-skills-effective-data-scientists.pdf',
    description: {
      en: 'A 50-minute LinkedIn Learning course by veteran analytics consultant Keith McCormick (part of the KNIME Data Science curriculum) focusing on essential non-technical skills for data professionals: bridging analytics with business objectives, stakeholder persuasion, organizational diplomacy, defending predictive models, and driving business transformation.',
      ar: 'دورة من 50 دقيقة على منصة LinkedIn Learning يقدمها خبير استشارات تحليل البيانات كيث ماكورميك (ضمن مسار علوم البيانات المعتمد من KNIME)، تركز على المهارات غير التقنية الأساسية للمتخصصين في البيانات: الربط بين النماذج التحليلية وأهداف الأعمال، والتواصل الدبلوماسي مع الإدارة، والإقناع، وقيادة التحول المؤسسي المبني على البيانات.',
      ru: '50-минутный курс LinkedIn Learning от эксперта по аналитике Кита Маккормика (в рамках сертификационной программы KNIME), посвящённый ключевым нетехническим компетенциям в науке о данных: соотнесение аналитики с бизнес-целями, убеждение стейкхолдеров, организационная дипломатия и внедрение моделей для трансформации бизнеса.',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning Certificate of Completion for The Non-Technical Skills of Effective Data Scientists",
      ar: 'شهادة إتمام من LinkedIn Learning لحسين البسيوني عن دورة المهارات غير التقنية لعلماء البيانات الفعّالين',
      ru: 'Сертификат LinkedIn Learning Хусейна Эльбасьюни об окончании курса The Non-Technical Skills of Effective Data Scientists',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Bridging data science models with business transformation',
          'Translating analytics to executive and business terminology',
          'Stakeholder empathy, persuasion, and influence',
          'Organizational diplomacy and defending analytical methodology',
          'Continuous curiosity and dedication to the analytical craft',
          'Overcoming institutional resistance to predictive solutions',
        ],
      },
      collaborators: {
        en: ['Keith McCormick', 'KNIME'],
      },
    },
    tags: ['data', 'career'],
  },
  {
    /* ============================================================
       LINKEDIN LEARNING & NASBA — Statistics Foundations 1:
       The Basics with Eddie Davila (Wolfram Research)
       Completed Dec 22, 2025. Author: Eddie Davila.
       Accreditation: NASBA Registry ID #140940 · 1.80 CPE Credits
       Everything here was read off the certificate image and PDF:
         · "LinkedIn Learning"
         · "Statistics Foundations 1: The Basics"
         · "Course completed by Hussein ElBassiouni"
         · "Dec 22, 2025 at 10:04PM UTC"
         · "Top skills covered: Statistics"
         · "Field of Study: Statistics"
         · "Program: National Association of State Boards of Accountancy (NASBA)"
         · "Registry ID: #140940"
         · "Continuing Professional Education Credit (CPE): 1.80"
         · "Certificate ID: c56817a44b6b01f38c57ed99268b7514495e7ece1dd0fac425804406213ff33b"
         · signed Shea Hanson, Head of Learning Content Strategy
       Standard completion document also retained:
         · Certificate ID: b3483377f8cfcc055edd7ad040510331a862cd6eb52924289554f104b6bead7d
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand names like LinkedIn Learning and NASBA).
       Files live cleanly in academic/assets/certificates/ (no ../).
       Official verification link verified (HTTP 200).
       ============================================================ */
    title: {
      en: 'Statistics Foundations 1: The Basics',
      ar: 'أساسيات الإحصاء 1: المبادئ الأساسية مع إيدي دافيلا',
      ru: 'Основы статистики 1: базовые принципы с Эдди Давилой',
    },
    provider: 'LinkedIn Learning',
    date: {
      en: '22 Dec 2025',
      ar: '22 ديسمبر 2025',
      ru: '22 декабря 2025',
    },
    category: {
      en: 'Continuing Professional Education (CPE)',
      ar: 'تعليم مهني مستمر (CPE)',
      ru: 'Непрерывное профессиональное образование (CPE)',
    },
    duration: {
      en: '36 min · 1.8 CPE',
      ar: '36 دقيقة · 1.8 ساعة معتمدة',
      ru: '36 мин · 1.8 CPE',
    },
    credentialId: 'c56817a44b6b01f38c57ed99268b7514495e7ece1dd0fac425804406213ff33b',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/c56817a44b6b01f38c57ed99268b7514495e7ece1dd0fac425804406213ff33b',
    image: 'assets/certificates/statistics-foundations-1-the-basics.jpg',
    pdf: 'assets/certificates/statistics-foundations-1-the-basics.pdf',
    description: {
      en: 'An accredited continuing professional education course on foundational statistics by Eddie Davila (part of the Wolfram Research Statistics Foundations curriculum), certified by NASBA for 1.80 CPE credits. Covers data classification, graphical representations, measures of central tendency (mean, median, mode), and dispersion analysis (variance, standard deviation, and outliers).',
      ar: 'دورة تعليم مهني مستمر معتمدة في مبادئ علم الإحصاء يقدمها المحاضر إيدي دافيلا، معتمدة من الجمعية الوطنية لمجالس المحاسبة بالولايات المتحدة بواقع 1.80 وحدة تعليم مهني مستمر. تتناول تصنيف البيانات، والتمثيل البياني، ومقاييس النزعة المركزية، ومقاييس التشتت والتباين والانحراف المعياري ورصد القيم الشاذة.',
      ru: 'Аккредитованный курс непрерывного профессионального образования по основам статистики от Эдди Давилы (в рамках программы Wolfram Research), сертифицированный NASBA с присуждением 1.80 баллов CPE. Охватывает классификацию данных, графические методы, меры центральной тенденции (среднее, медиана, мода) и меры вариации (дисперсия, стандартное отклонение, выбросы).',
    },
    alt: {
      en: "Hussein ElBassiouni's LinkedIn Learning and NASBA Accredited Certificate for Statistics Foundations 1: The Basics",
      ar: 'شهادة إتمام معتمدة من LinkedIn Learning وNASBA لحسين البسيوني في أساسيات الإحصاء 1: المبادئ الأساسية',
      ru: 'Сертификат LinkedIn Learning и NASBA Хусейна Эльбасьюни об окончании курса Statistics Foundations 1: The Basics',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Data types and classification (nominal, ordinal, interval, ratio)',
          'Graphical representations and chart interpretation',
          'Measures of central tendency (mean, median, mode)',
          'Measures of variability and spread',
          'Standard deviation and variance calculation',
          'Identifying and handling outliers',
        ],
      },
      collaborators: {
        en: [
          'Eddie Davila (Arizona State University)',
          'Anaconda',
          'Wolfram Research',
          'National Association of State Boards of Accountancy (NASBA)',
        ],
      },
    },
    tags: ['data'],
  },
  {
    /* ============================================================
       DATACAMP — Data Visualization in Google Sheets
       Completed Oct 16, 2026.
       Everything here was read off the Statement of Accomplishment
       PDF and image provided by Hussein:
         · "STATEMENT OF ACCOMPLISHMENT"
         · "#50,345,577"
         · "HAS BEEN AWARDED TO Hussein Mohamed Mostafa Ahmed ElBassiouni"
         · "FOR SUCCESSFULLY COMPLETING Data Visualization in Google Sheets"
         · "LENGTH 4 HRS"
         · "COMPLETED ON OCT 16, 2026"
         · signed Jonathan Cornelissen, CEO, DataCamp
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand name DataCamp).
       Official credential PDF and JPEG preview reside in
       academic/assets/certificates/data-visualization-in-google-sheets.{pdf,jpg}.
       XP (4,700 XP) recorded in CV ledger and kept off the card per
       the established precedent.
       ============================================================ */
    title: {
      en: 'Data Visualization in Google Sheets',
      ar: 'تمثيل البيانات في الجداول الإلكترونية',
      ru: 'Визуализация данных в Google Sheets',
    },
    parentTrack: 'google-sheets-fundamentals',
    provider: 'DataCamp',
    date: {
      en: '16 Oct 2026',
      ar: '16 أكتوبر 2026',
      ru: '16 октября 2026',
    },
    category: {
      en: 'Statement of Accomplishment',
      ar: 'بيان إتمام',
      ru: 'Подтверждение о прохождении курса',
    },
    duration: {
      en: '4 hrs',
      ar: 'أربع ساعات',
      ru: '4 часа',
    },
    credentialId: '#50,345,577',
    image: 'assets/certificates/data-visualization-in-google-sheets.jpg',
    pdf: 'assets/certificates/data-visualization-in-google-sheets.pdf',
    description: {
      en: 'A four-hour DataCamp course on data visualization in Google Sheets: mastering chart creation techniques (bar charts, histograms, scatter plots, sparkline and candlestick charts), data management with validation and VLOOKUP, conditional formatting, and building comprehensive real-world dashboards.',
      ar: 'دورة من أربع ساعات على منصة DataCamp في تمثيل البيانات وتصورها في الجداول الإلكترونية: إتقان أساليب إنشاء المخططات البيانية (الأعمدة، والمدرجات، والتشتت، والمخططات المصغرة، والشموع اليابانية)، وإدارة البيانات بالتحقق وصيغ البحث، والتنسيق الشرطي، وبناء لوحات بيانات تفاعلية لمشاريع واقعية.',
      ru: 'Четырёхчасовой курс DataCamp по визуализации данных в Google Sheets: создание различных типов диаграмм (столбчатые, гистограммы, точечные, спарклайны, свечные графики), управление данными с проверкой и VLOOKUP, условное форматирование и построение аналитических дашбордов.',
    },
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing Data Visualization in Google Sheets",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام دورة تمثيل البيانات في الجداول الإلكترونية',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании курса Data Visualization in Google Sheets',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Chart creation techniques',
          'Bar charts and histograms',
          'Scatter plots',
          'Sparkline and candlestick charts',
          'Data management and analysis',
          'Data preparation',
          'Data validation',
          'VLOOKUP formulas',
          'Conditional formatting',
          'Dashboard creation and architecture',
          'Real-world business applications',
        ],
      },
      chapters: {
        en: [
          { title: 'Chart Creation Techniques' },
          { title: 'Data Management and Analysis' },
          { title: 'Dashboard Creation and Real-world Applications' },
        ],
      },
      resources: {
        en: [
          { label: 'Olympics Dataset' },
          { label: 'Shark Attack Records' },
          { label: 'ASX Marine Technology Data' },
        ],
      },
    },
    tags: ['data'],
  },
  {
    /* ============================================================
       DATACAMP — Google Sheets Fundamentals (15-Hour Skill Track)
       Completed Oct 16, 2026.
       Comprehensive track combining 5 foundational courses (15 hours).
       Everything here was read off the Statement of Accomplishment
       PDF and image provided by Hussein:
         · "STATEMENT OF ACCOMPLISHMENT"
         · "#967,410"
         · "HAS BEEN AWARDED TO Hussein Mohamed Mostafa Ahmed ElBassiouni"
         · "FOR SUCCESSFULLY COMPLETING Google Sheets Fundamentals"
         · "LENGTH 15 HR"
         · "COMPLETED ON OCT 16, 2026"
         · signed Jonathan Cornelissen, CEO, DataCamp
       ------------------------------------------------------------
       Pure Modern Standard Arabic (فصحى) with zero Latin characters
       (except brand name DataCamp).
       Official credential PDF and JPEG preview reside in
       academic/assets/certificates/google-sheets-fundamentals.{pdf,jpg}.
       ============================================================ */
    title: {
      en: 'Google Sheets Fundamentals',
      ar: 'أساسيات الجداول الإلكترونية — مسار متكامل',
      ru: 'Google Sheets Fundamentals — комплексный трек',
    },
    provider: 'DataCamp',
    date: {
      en: '16 Oct 2026',
      ar: '16 أكتوبر 2026',
      ru: '16 октября 2026',
    },
    category: {
      en: 'Skill Track Statement of Accomplishment',
      ar: 'بيان إتمام مسار مهني متكامل',
      ru: 'Подтверждение о прохождении трека навыков',
    },
    duration: {
      en: '15 hrs',
      ar: '15 ساعة',
      ru: '15 часов',
    },
    credentialId: '#967,410',
    credentialUrl:
      'https://www.datacamp.com/statement-of-accomplishment/track/3cee210eb30f190f056caaf9324a87e9185cdc46',
    image: 'assets/certificates/google-sheets-fundamentals.jpg',
    pdf: 'assets/certificates/google-sheets-fundamentals.pdf',
    description: {
      en: 'A comprehensive 15-hour DataCamp Skill Track unifying 5 foundational courses: Introduction to Google Sheets, Data Analysis in Google Sheets, Intermediate Google Sheets, Pivot Tables in Google Sheets, and Data Visualization in Google Sheets.',
      ar: 'مسار مهارات متكامل من 15 ساعة على منصة DataCamp يجمع 5 دورات متخصصة: مقدمة في الجداول الإلكترونية، وتحليل البيانات، والمستوى المتوسط، والجداول المحورية، وتمثيل البيانات وتصورها.',
      ru: 'Комплексный 15-часовой трек навыков на платформе DataCamp, объединяющий 5 специализированных курсов: введение в Google Sheets, анализ данных, промежуточный уровень, сводные таблицы и визуализация данных.',
    },
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing the Google Sheets Fundamentals Skill Track",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام مسار أساسيات الجداول الإلكترونية المتكامل',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании трека навыков Google Sheets Fundamentals',
    },
    isDemo: false,
    details: {
      trackCourses: [
        {
          order: 1,
          title: {
            en: 'Introduction to Google Sheets',
            ar: 'مقدمة في الجداول الإلكترونية',
            ru: 'Введение в Google Sheets',
          },
          duration: {
            en: '2 hrs',
            ar: 'ساعتان',
            ru: '2 ч',
          },
          instructor: {
            en: 'James Chapman (AI Curriculum Team Lead, DataCamp)',
            ar: 'جيمس تشابمان (رئيس فريق مناهج الذكاء الاصطناعي في DataCamp)',
            ru: 'Джеймс Чепмен (руководитель направления ИИ, DataCamp)',
          },
          credentialId: '#47,542,476',
          image: 'assets/certificates/introduction-to-google-sheets.jpg',
          alt: {
            en: 'Statement of Accomplishment for Introduction to Google Sheets',
            ar: 'بيان إتمام دورة مقدمة في الجداول الإلكترونية',
            ru: 'Сертификат об окончании курса введения в Google Sheets',
          },
        },
        {
          order: 2,
          title: {
            en: 'Data Analysis in Google Sheets',
            ar: 'تحليل البيانات في الجداول الإلكترونية',
            ru: 'Анализ данных в Google Sheets',
          },
          duration: {
            en: '3 hrs',
            ar: '3 ساعات',
            ru: '3 ч',
          },
          instructor: {
            en: 'James Chapman (AI Curriculum Team Lead, DataCamp)',
            ar: 'جيمس تشابمان (رئيس فريق مناهج الذكاء الاصطناعي في DataCamp)',
            ru: 'Джеймс Чепмен (руководитель направления ИИ, DataCamp)',
          },
          credentialId: '#50,161,411',
          image: 'assets/certificates/data-analysis-in-google-sheets.jpg',
          alt: {
            en: 'Statement of Accomplishment for Data Analysis in Google Sheets',
            ar: 'بيان إتمام دورة تحليل البيانات في الجداول الإلكترونية',
            ru: 'Сертификат об окончании курса анализа данных в Google Sheets',
          },
        },
        {
          order: 3,
          title: {
            en: 'Intermediate Google Sheets',
            ar: 'المستوى المتوسط للجداول الإلكترونية',
            ru: 'Продвинутый уровень Google Sheets',
          },
          duration: {
            en: '4 hrs',
            ar: '4 ساعات',
            ru: '4 ч',
          },
          instructor: {
            en: 'Richie Cotton (Data Evangelist, DataCamp)',
            ar: 'ريتشي كوتون (خبير نشر ثقافة البيانات في DataCamp)',
            ru: 'Ричи Коттон (евангелист данных, DataCamp)',
          },
          credentialId: '#50,277,774',
          image: 'assets/certificates/intermediate-google-sheets.jpg',
          alt: {
            en: 'Statement of Accomplishment for Intermediate Google Sheets',
            ar: 'بيان إتمام دورة المستوى المتوسط للجداول الإلكترونية',
            ru: 'Сертификат об окончании курса промежуточного уровня Google Sheets',
          },
        },
        {
          order: 4,
          title: {
            en: 'Pivot Tables in Google Sheets',
            ar: 'الجداول المحورية في الجداول الإلكترونية',
            ru: 'Сводные таблицы в Google Sheets',
          },
          duration: {
            en: '2 hrs',
            ar: 'ساعتان',
            ru: '2 ч',
          },
          instructor: {
            en: 'Frank Sumanski (Founder, SpreadsheetAllstars.com)',
            ar: 'فرانك سومانفسكي (مؤسس SpreadsheetAllstars.com)',
            ru: 'Фрэнк Сумански (основатель SpreadsheetAllstars.com)',
          },
          badge: {
            en: 'Integrated Track Course',
            ar: 'دورة معتمدة ضمن المسار',
            ru: 'Интегрированный курс трека',
          },
        },
        {
          order: 5,
          title: {
            en: 'Data Visualization in Google Sheets',
            ar: 'تمثيل البيانات وتصورها في الجداول الإلكترونية',
            ru: 'Визуализация данных в Google Sheets',
          },
          duration: {
            en: '4 hrs',
            ar: '4 ساعات',
            ru: '4 ч',
          },
          instructor: {
            en: 'Raina Hawley (Owner/Instructor, OzGrid Business Applications)',
            ar: 'رينا هاولي (مالكة ومدربة OzGrid Business Applications)',
            ru: 'Райна Хоули (руководитель и инструктор, OzGrid)',
          },
          credentialId: '#50,345,577',
          image: 'assets/certificates/data-visualization-in-google-sheets.jpg',
          alt: {
            en: 'Statement of Accomplishment for Data Visualization in Google Sheets',
            ar: 'بيان إتمام دورة تمثيل البيانات وتصورها في الجداول الإلكترونية',
            ru: 'Сертификат об окончании курса визуализации данных в Google Sheets',
          },
        },
      ],
      topics: {
        en: [
          'Spreadsheet fundamentals & cell formulas',
          'Data cleaning, transformation & validation',
          'Exploratory data analysis & summary statistics',
          'VLOOKUP & cross-table data lookups',
          'Logical functions & error handling',
          'Positional matching & simple imputation',
          'Pivot tables & multi-dimensional aggregation',
          'Chart design: bar, histogram, scatter, sparkline, candlestick',
          'Conditional formatting & dashboard architecture',
          'Real-world business and operational workflows',
        ],
      },
      chapters: {
        en: [
          { title: 'Introduction to Google Sheets', note: '2 hrs · James Chapman' },
          { title: 'Data Analysis in Google Sheets', note: '3 hrs · James Chapman' },
          { title: 'Intermediate Google Sheets', note: '4 hrs · Richie Cotton' },
          { title: 'Pivot Tables in Google Sheets', note: '2 hrs · Frank Sumanski' },
          { title: 'Data Visualization in Google Sheets', note: '4 hrs · Raina Hawley' },
        ],
      },
      collaborators: {
        en: [
          'James Chapman (AI Curriculum Team Lead, DataCamp)',
          'Richie Cotton (Data Evangelist, DataCamp)',
          'Frank Sumanski (Founder, SpreadsheetAllstars.com)',
          'Raina Hawley (Owner/Instructor, OzGrid Business Applications)',
        ],
      },
    },
    tags: ['data'],
  },
  {
    /* ============================================================
       ASEAN FOUNDATION & LINKEDIN — AI Career Readiness Training
       Completed Oct 16, 2026.
       Platform: ASEAN Digital Academy (ada.aseanfoundation.org).
       Program: ASEAN AHEAD.
       Signed by: Dr. Piti Srisangnam, Executive Director, ASEAN Foundation.
       Organised by ASEAN Foundation, supported by LinkedIn.
       Pure Modern Standard Arabic (فصحى) with 0 Latin characters
       (except brand name LinkedIn).
       ============================================================ */
    title: {
      en: 'AI Career Readiness Training',
      ar: 'التدريب على الجاهزية المهنية بالذكاء الاصطناعي',
      ru: 'AI Career Readiness Training',
    },
    provider: {
      en: 'ASEAN Foundation · LinkedIn',
      ar: 'مؤسسة الآسيان · LinkedIn',
      ru: 'Фонд АСЕАН · LinkedIn',
    },
    date: {
      en: '16 Oct 2026',
      ar: '16 أكتوبر 2026',
      ru: '16 октября 2026',
    },
    category: {
      en: 'Certificate of Completion',
      ar: 'شهادة إتمام',
      ru: 'Сертификат об окончании',
    },
    image: 'assets/certificates/ai-career-readiness.jpg',
    description: {
      en: 'A comprehensive 5-module training program organized by the ASEAN Foundation and supported by LinkedIn via the ASEAN Digital Academy. Covers AI-powered career clarity, personal branding, LinkedIn profile optimization, smart job search, and AI-assisted CV and interview preparation.',
      ar: 'برنامج تدريبي متكامل من 5 وحدات نظمته مؤسسة الآسيان بدعم من LinkedIn عبر الأكاديمية الرقمية للآسيان، يركز على استغلال أدوات الذكاء الاصطناعي في تحديد المسار المهني، وتطوير العلامة الشخصية والملف على LinkedIn، والبحث الذكي عن الوظائف، وإعداد السيرة الذاتية والمقابلات.',
      ru: 'Комплексная 5-модульная программа обучения, организованная Фондом АСЕАН при поддержке LinkedIn на платформе Цифровой академии АСЕАН. Охватывает определение карьерного пути с помощью ИИ, развитие личного бренда, оптимизацию профиля в LinkedIn, умный поиск работы и подготовку к собеседованиям.',
    },
    alt: {
      en: "Hussein ElBassiouni's Certificate of Completion for AI Career Readiness Training from ASEAN Foundation and LinkedIn",
      ar: 'شهادة إتمام لحسين البسيوني في التدريب على الجاهزية المهنية بالذكاء الاصطناعي من مؤسسة الآسيان و LinkedIn',
      ru: 'Сертификат об окончании Хусейна Эльбасьюни по программе AI Career Readiness Training от Фонда АСЕАН и LinkedIn',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'AI for Career Clarity & Professional Pathway',
          'AI-Powered Personal Branding & LinkedIn Optimization',
          'AI for Smart Job Search, Networking & Opportunity',
          'AI for CV, Cover Letter & Portfolio Applications',
          'AI for Interview Preparation & Confidence Building',
        ],
      },
      chapters: {
        en: [
          { title: 'Module 01: AI for Career Clarity & Professional Pathway', note: 'Parts 01 – 03' },
          { title: 'Module 02: AI-Powered Personal Branding & LinkedIn Optimization', note: 'Parts 01 – 03' },
          { title: 'Module 03: AI for Job Search, Networking & Opportunity', note: 'Parts 01 – 03' },
          { title: 'Module 04: AI for CV, Portfolio & Strong Applications', note: 'Parts 01 – 03' },
          { title: 'Module 05: AI for Interview Preparation & Confidence Building', note: 'Parts 01 – 03' },
        ],
      },
      collaborators: {
        en: [
          'Dr. Piti Srisangnam (Executive Director, ASEAN Foundation)',
          'Belinda Rahmadara',
          'Irvandias Sanjaya',
          'Haekal Adha Al Ghiffari',
          'Noppon Chhim',
          'Jolly Nguyen',
          'KTM Solutions',
        ],
      },
    },
    tags: ['ai', 'career'],
  },
  {
    /* ============================================================
       DATACAMP — Introduction to Python
       Completed Oct 17, 2026.
       Credential #47,542,030.
       Official verification link confirmed (HTTP 200).
       Pure Modern Standard Arabic (فصحى) with 0 Latin characters
       (except brand DataCamp).
       ============================================================ */
    title: {
      en: 'Introduction to Python',
      ar: 'مقدمة في لغة بايثون',
      ru: 'Введение в Python',
    },
    provider: 'DataCamp',
    date: {
      en: '17 Oct 2026',
      ar: '17 أكتوبر 2026',
      ru: '17 октября 2026',
    },
    category: {
      en: 'Statement of Accomplishment',
      ar: 'بيان إتمام',
      ru: 'Подтверждение о прохождении курса',
    },
    duration: {
      en: '4 hrs',
      ar: '4 ساعات',
      ru: '4 ч',
    },
    credentialId: '#47,542,030',
    credentialUrl:
      'https://www.datacamp.com/statement-of-accomplishment/course/ccd0142ba432ca8dfefadd4ed58f88aefd0f530c',
    image: 'assets/certificates/introduction-to-python.jpg',
    pdf: 'assets/certificates/introduction-to-python.pdf',
    description: {
      en: 'A 4-hour foundational DataCamp course on Python for data analysis: covers variables, data types, list operations and slicing, built-in functions, methods, packages, and 2D array analysis with NumPy.',
      ar: 'دورة تأسيسية من 4 ساعات على منصة DataCamp في لغة بايثون لتحليل البيانات: تغطي المتغيرات، وأنواع البيانات، والعمليات على القوائم وتقطيعها، والدوال والمناهج البرمجية المدمجة، واستيراد الحزم، والتعامل مع المصفوفات ثنائية الأبعاد عبر مكتبة نيمباي.',
      ru: '4-часовой базовый курс на платформе DataCamp по Python для анализа данных: изучение переменных, типов данных, операций со списками и срезами, встроенных функций, методов, пакетов и анализа двумерных массивов с помощью NumPy.',
    },
    alt: {
      en: "Hussein ElBassiouni's DataCamp Statement of Accomplishment for completing Introduction to Python",
      ar: 'بيان إتمام من DataCamp لحسين البسيوني عن إتمام دورة مقدمة في لغة بايثون',
      ru: 'Подтверждение DataCamp Хусейна Эльбасьюни об окончании курса введения в Python',
    },
    isDemo: false,
    details: {
      topics: {
        en: [
          'Python syntax, variables & primitive types',
          'List creation, sub-setting & slicing',
          'Manipulating lists & copying behavior',
          'Built-in functions (print, type, sorted, round)',
          'String and list methods (upper, count, index, append)',
          'Package management & imports (math, scipy)',
          'NumPy array creation & vector arithmetic',
          '2D NumPy arrays & matrix slicing',
          'Basic statistics (mean, median, standard deviation)',
          'Data correlation analysis (Pearson correlation coefficient)',
        ],
      },
      chapters: {
        en: [
          { title: 'Python Basics', note: 'Variables, types & operations' },
          { title: 'Python Lists', note: 'Lists, indexing & slicing' },
          { title: 'Functions and Packages', note: 'Functions, methods & packages' },
          { title: 'NumPy', note: 'NumPy arrays, 2D arrays & statistics' },
        ],
      },
      collaborators: {
        en: [
          'Jonathan Cornelissen (CEO, DataCamp)',
          'Hugo Bowne-Anderson (DataCamp Curriculum)',
        ],
      },
    },
    tags: ['python', 'data'],
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
