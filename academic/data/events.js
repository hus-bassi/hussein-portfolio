/* ============================================================
   DATA/EVENTS.JS  —  Universal Media & Event Data Model
   ------------------------------------------------------------
   Pure data + schema documentation. This is the ONE shared shape
   for every rich item on the site — certificate, course,
   volunteering experience, volunteer event, competition,
   achievement, project, research, future activity, and every
   volleyball activity (tournament / match / training / team day).
   js/media-system.js (EventSystem) is the only reader.

   IMPORTANT — this file is intentionally EMPTY.
   It ships the SYSTEM, not the content. No fake events, photos,
   people, videos, or results are invented here. Add real items to
   the `eventsData` array below when you have them, and they render
   automatically — with a card, a detail modal, a fullscreen media
   viewer, and a gallery — with zero extra code.

   ------------------------------------------------------------
   THE UNIFIED EVENT SHAPE
   Every field is OPTIONAL except `title`. Anything you omit simply
   doesn't show — no empty rows, no blank galleries, no dead
   buttons. Text fields (title, description, location, …) may be a
   plain string OR a { en, ar, ru } object, exactly like the
   certificate data, so an event reads naturally in all three
   languages.

   {
     id: 'unique-slug',                // optional, for future linking

     // --- identity ---
     type: 'certificate',              // certificate | course | volunteering |
                                       // volunteer-event | competition |
                                       // achievement | project | research |
                                       // volleyball | activity  (free text; shown as a badge)
     title: 'Event title',             // REQUIRED (string or { en, ar, ru })

     // --- when & where ---
     date: 'July 13, 2026',            // string or { en, ar, ru }
     time: '18:00',                    // optional
     location: 'City, Country',        // optional
     organization: 'Organizer / Host', // optional

     // --- narrative (never fabricated; shown only if present) ---
     description: 'Short summary.',
     whatIDid: 'What I actually did / my role.',
     whatILearned: 'What I took away from it.',
     skills: ['Teamwork', 'Python'],   // array of strings or { en, ar, ru }

     // --- media ---
     image: '../assets/events/cover.jpg',   // single cover; string OR
                                             // { src, alt, caption, type } object
     images: [                               // gallery — any length
       { src: '../assets/events/1.jpg', alt: 'Alt text', caption: 'Caption', type: 'image' },
       '../assets/events/2.jpg',             // bare strings are fine too
     ],
     certificate: '../assets/certificates/cert.jpg',  // string OR { image, credentialUrl }
                                             // → adds a "View certificate" button that
                                             //   opens the SAME fullscreen viewer
     videoUrl: 'https://youtu.be/XXXXXXXXXXX',  // YouTube → safe embed; anything else
                                                //   → a "Watch video" link. Button only
                                                //   appears if a URL exists.

     // --- people (build-ready; no real people invented) ---
     people: [
       { name: 'Full Name', role: 'Coach', image: '../assets/people/x.jpg', note: 'Optional note' },
     ],

     // --- links ---
     externalLinks: [
       { label: 'Project repo', url: 'https://…' },
       'https://…',                      // bare URL is fine
     ],

     tags: ['ai', 'community'],          // optional, for future filtering
   }

   ------------------------------------------------------------
   VOLLEYBALL-READY (type: 'volleyball')
   The same shape covers every volleyball activity. Use the fields
   above plus these optional extras (rendered when present, still
   nothing faked):

     team: 'My team',
     opponent: 'Opponent team',
     result: 'Won 3–1',                 // or { en, ar, ru }
     stats: { points: 12, aces: 3, blocks: 2 },   // free-form key/value
     notes: 'Anything else worth noting.'

   The volleyball side may stay "Coming Soon" in its own page — this
   model is ready the moment real matches/trainings are added, using
   the exact same card + viewer + gallery as everything else.
   ------------------------------------------------------------

   HOW TO USE (when a real events page is built):
   1. Add real objects to `eventsData` below.
   2. Give the page a container:  <div data-events-grid></div>
      (optionally a sibling  <p data-events-empty hidden>…</p>).
   3. Include this file, then js/media-system.js — the grid renders
      itself, cards open the detail modal, images open the viewer.
   No per-item HTML, ever.
   ============================================================= */

/* ------------------------------------------------------------
   IMAGE PATHS — write them relative to the academic/ folder
   (e.g. 'assets/volunteering/russian-house/certificate.jpg').
   js/media-system.js resolveMediaPath() adds the right hop for
   whatever page renders them (homepage, pages/, or sports/), so a
   single path works everywhere with no per-page edits.
   ------------------------------------------------------------ */

const eventsData = [
  /* ==========================================================
     Hussein's FIRST real volunteering experience.
     Russian House in Cairo — honest and un-padded.

     ✔ DATE: June 2, 2026 (provided by Hussein). Rendered trilingually
       below. Only the day/month/year were given — no weekday is added
       (not invented).

     ⚠ PERSON NOT NAMED. The lady who handed over the certificate is
       intentionally NOT named or titled (not invented). She appears
       only in the gallery photo, with an honest caption. Add a
       `people: [...]` entry later ONLY with real, confirmed details.

     ⚠ ASSETS — drop these 3 image files into
       academic/assets/volunteering/russian-house/ and everything
       lights up automatically (the video is already live):
         • certificate.jpg           — the certificate / diploma
         • receiving-certificate.jpg — receiving the certificate
         • event.jpg                 — another photo from the event
     ========================================================== */
  {
    id: 'russian-house-cairo',
    type: 'volunteering',
    title: {
      en: 'Volunteering at the Russian House in Cairo',
      ar: 'تطوّع في البيت الروسي بالقاهرة',
      ru: 'Волонтёрство в Русском доме в Каире',
    },
    role: {
      en: 'Volunteer · Event Setup & Coordination',
      ar: 'متطوّع · إعداد الفعالية والتنسيق',
      ru: 'Волонтёр · Подготовка и координация мероприятия',
    },
    date: { en: 'June 2, 2026', ar: '2 يونيو 2026', ru: '2 июня 2026' },
    location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر', ru: 'Каир, Египет' },
    organization: {
      en: 'Russian House in Cairo',
      ar: 'البيت الروسي في القاهرة',
      ru: 'Русский дом в Каире',
    },
    description: {
      en: 'A volunteering experience at the Russian House in Cairo, where I helped prepare and organize the stage, arrange chairs and microphones, guide young participants, and support the event setup and coordination.',
      ar: 'تجربة تطوّعية في البيت الروسي بالقاهرة، حيث ساعدتُ في تجهيز المسرح وتنظيمه، وترتيب الكراسي والميكروفونات، وإرشاد المشاركين الصغار، ودعم إعداد الفعالية وتنسيقها.',
      ru: 'Волонтёрский опыт в Русском доме в Каире: я помогал готовить и оформлять сцену, расставлять стулья и микрофоны, направлять юных участников и поддерживать подготовку и координацию мероприятия.',
    },
    whatIDid: {
      en: 'Helped set up and arrange the stage, positioned chairs and microphones, guided young participants, and supported the overall event setup and coordination.',
      ar: 'ساعدتُ في تجهيز المسرح وترتيبه، ووضع الكراسي والميكروفونات، وإرشاد المشاركين الصغار، ودعم إعداد الفعالية وتنسيقها بشكل عام.',
      ru: 'Помогал устанавливать и оформлять сцену, расставлял стулья и микрофоны, направлял юных участников и поддерживал общую подготовку и координацию мероприятия.',
    },
    whatILearned: {
      en: 'How much steady, behind-the-scenes coordination a live event needs — and how small, reliable contributions keep the whole day running smoothly.',
      ar: 'مدى ما تحتاجه الفعالية الحيّة من تنسيق ثابت خلف الكواليس — وكيف تُبقي المساهماتُ الصغيرة الموثوقة اليومَ كلَّه منتظمًا.',
      ru: 'Насколько живому мероприятию нужна постоянная закулисная координация — и как небольшие, надёжные вклады помогают всему дню проходить гладко.',
    },
    skills: [
      { en: 'Teamwork', ar: 'العمل الجماعي', ru: 'Командная работа' },
      { en: 'Event Setup', ar: 'إعداد الفعاليات', ru: 'Подготовка мероприятий' },
      { en: 'Coordination', ar: 'التنسيق', ru: 'Координация' },
      { en: 'Communication', ar: 'التواصل', ru: 'Коммуникация' },
    ],
    image: 'assets/volunteering/russian-house/event.jpg',
    images: [
      {
        src: 'assets/volunteering/russian-house/receiving-certificate.jpg',
        caption: {
          en: 'Receiving the certificate after the volunteering experience.',
          ar: 'استلام الشهادة بعد التجربة التطوّعية.',
          ru: 'Вручение сертификата после волонтёрского опыта.',
        },
      },
      {
        src: 'assets/volunteering/russian-house/event.jpg',
        caption: {
          en: 'During the event at the Russian House.',
          ar: 'أثناء الفعالية في البيت الروسي.',
          ru: 'Во время мероприятия в Русском доме.',
        },
      },
    ],
    certificate: 'assets/volunteering/russian-house/certificate.jpg',
    videoUrl: 'https://youtu.be/8UQIpYbBo7I',
  },

  {
    id: 'chess-tournament-russian-house',
    type: 'volunteering',
    title: {
      en: 'Chess Tournament Volunteering at the Russian House in Cairo',
      ar: 'التطوّع في بطولة الشطرنج في البيت الروسي بالقاهرة',
      ru: 'Волонтёрство на шахматном турнире в Русском доме в Каире',
    },
    role: {
      en: 'Volunteer · Event Support',
      ar: 'متطوّع · دعم الفعالية',
      ru: 'Волонтёр · Поддержка мероприятия',
    },
    date: { en: 'June 14, 2026', ar: '14 يونيو 2026', ru: '14 июня 2026' },
    location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر', ru: 'Каир, Египет' },
    organization: {
      en: 'Russian House in Cairo',
      ar: 'البيت الروسي في القاهرة',
      ru: 'Русский дом в Каире',
    },
    description: {
      en: 'I volunteered in the organization of a chess tournament at the Russian House in Cairo. My responsibilities included preparing the library hall, arranging chess tables and chairs, setting up chessboards and chess clocks, responding to organizational needs during the tournament, calling the referee when match-related issues arose, assisting participants and visitors, and helping direct people to designated photo and commemorative areas.',
      ar: 'شاركتُ كمتطوع في تنظيم بطولة شطرنج داخل البيت الروسي في القاهرة. شملت مهامي تجهيز قاعة المكتبة، وترتيب طاولات وكراسي الشطرنج، وتجهيز رقع الشطرنج وساعات اللعب، ومتابعة الاحتياجات التنظيمية أثناء البطولة، واستدعاء الحكم عند حدوث مشكلات مرتبطة بالمباريات، ومساعدة المشاركين والزوار، وتوجيه الأشخاص إلى أماكن التصوير والتذكارات داخل الفعالية.',
      ru: 'Я участвовал как волонтёр в организации шахматного турнира в Русском доме в Каире. Мои обязанности включали подготовку зала библиотеки, расстановку столов и стульев для шахмат, подготовку шахматных досок и часов, отклик на организационные потребности во время турнира, вызов судьи при возникновении проблем, связанных с партиями, помощь участникам и гостям, а также направление людей в специально отведённые зоны для фотографий и памятных мест.',
    },
    whatIDid: {
      en: 'Prepared the library hall by arranging chess tables and chairs, set up chessboards and chess clocks, monitored organizational needs during the tournament, called the referee when match-related issues arose, assisted participants and visitors, and directed people to designated photo and commemorative areas within the venue.',
      ar: 'جهّزتُ قاعة المكتبة بترتيب طاولات وكراسي الشطرنج، ووضعتُ رقع الشطرنج وساعات اللعب، وتابعتُ الاحتياجات التنظيمية أثناء البطولة، واستدعيتُ الحكم عند حدوث مشكلات في المباريات، وساعدتُ المشاركين والزوار، ووجّهتُ الأشخاص إلى أماكن التصوير والتذكارات في الفعالية.',
      ru: 'Подготовил зал библиотеки, расставив шахматные столы и стулья, подготовил шахматные доски и часы, следил за организационными потребностями во время турнира, вызывал судью при возникновении проблем в партиях, помогал участникам и гостям, направлял людей в отведённые зоны для фотографий и памятных мест.',
    },
    whatILearned: {
      en: 'Event organization basics, attention to detail, on-site coordination, clear communication, taking responsibility, responding to unexpected situations, and working effectively with participants and event staff.',
      ar: 'أساسيات تنظيم الفعاليات، الاهتمام بالتفاصيل، التنسيق الميداني، التواصل الواضح، تحمل المسؤولية، الاستجابة للمواقف غير المتوقعة، والعمل الفعّال مع المشاركين وطاقم الفعالية.',
      ru: 'Основы организации мероприятий, внимательность к деталям, координация на месте, чёткая коммуникация, ответственность, реакция на непредвиденные ситуации и эффективная работа с участниками и сотрудниками мероприятия.',
    },
    skills: [
      { en: 'Event Organization', ar: 'تنظيم الفعاليات', ru: 'Организация мероприятий' },
      { en: 'Attention to Detail', ar: 'الاهتمام بالتفاصيل', ru: 'Внимание к деталям' },
      { en: 'On-site Coordination', ar: 'التنسيق الميداني', ru: 'Координация на месте' },
      { en: 'Communication', ar: 'التواصل', ru: 'Коммуникация' },
      { en: 'Responsibility', ar: 'المسؤولية', ru: 'Ответственность' },
      { en: 'Problem Response', ar: 'الاستجابة للمشكلات', ru: 'Реагирование на проблемы' },
    ],
    videoUrl: 'https://youtube.com/shorts/uv0J2AN1NxU',
  },
];

// Expose for js/media-system.js (which reads window.eventsData).
if (typeof window !== 'undefined') {
  window.eventsData = eventsData;
}
