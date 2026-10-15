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
