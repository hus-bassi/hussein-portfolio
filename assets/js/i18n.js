/* ============================================================
   i18n — Arabic / English / Russian
   Single source of truth for every static string on the site.
   - default language: Arabic (ar), RTL
   - English (en) and Russian (ru) are LTR
   - persisted in localStorage so it survives page navigation
   - switching dispatches `site-lang-change` so dynamic lists re-render
   ============================================================ */
(function () {
  'use strict';

  var SUPPORTED = ['ar', 'en', 'ru'];
  var DEFAULT = 'ar';
  var KEY = 'site-lang';

  var STR = {
    /* ---------- chrome ---------- */
    'skip': {
      ar: 'تخطّي إلى المحتوى الرئيسي',
      en: 'Skip to main content',
      ru: 'Перейти к основному содержанию'
    },
    'brand.name': {
      ar: 'حسين البسيوني',
      en: 'Hussein ElBassiouni',
      ru: 'Хусейн Эль-Басьюни'
    },
    /* Hero name only. Russian is long enough that it wraps on its own
       and the break lands badly — so the line break is deliberate:
       first name over last name, both flush to the same side.
       The \n is rendered by `white-space: pre-line` on .hero-name. */
    'brand.nameLines': {
      ar: 'حسين البسيوني',
      en: 'Hussein ElBassiouni',
      ru: 'Хусейн\nЭль-Басьюни'
    },
    'nav.label': {
      ar: 'التنقل الرئيسي',
      en: 'Primary navigation',
      ru: 'Основная навигация'
    },
    'nav.open': {
      ar: 'فتح قائمة التنقل',
      en: 'Open navigation menu',
      ru: 'Открыть меню навигации'
    },
    'nav.close': {
      ar: 'إغلاق قائمة التنقل',
      en: 'Close navigation menu',
      ru: 'Закрыть меню навигации'
    },
    'nav.home': { ar: 'الرئيسية', en: 'Home', ru: 'Главная' },
    'nav.story': { ar: 'قصتي', en: 'My story', ru: 'Моя история' },
    'nav.plan': { ar: 'خطتي', en: 'My plan', ru: 'Мой план' },
    'nav.interests': { ar: 'اهتماماتي', en: 'Interests', ru: 'Интересы' },
    'nav.projects': { ar: 'مشاريعي', en: 'Projects', ru: 'Проекты' },
    'nav.learning': { ar: 'التعلم والشهادات', en: 'Learning & certificates', ru: 'Обучение' },
    'nav.contact': { ar: 'التواصل', en: 'Contact', ru: 'Контакты' },
    'nav.portal': { ar: 'البوابة', en: 'Gateway', ru: 'Портал' },
    'footer.navLabel': {
      ar: 'روابط التذييل',
      en: 'Footer links',
      ru: 'Ссылки в подвале'
    },
    'footer.rights': {
      ar: 'جميع الحقوق محفوظة لحسين البسيوني',
      en: 'All rights reserved to Hussein ElBassiouni',
      ru: 'Все права защищены — Хусейн Эль-Басьюни'
    },
    'toTop': {
      ar: 'العودة إلى أعلى الصفحة',
      en: 'Back to top',
      ru: 'Наверх'
    },
    'lang.label': {
      ar: 'اللغة',
      en: 'Language',
      ru: 'Язык'
    },
    /* Accessible names for the three switcher buttons. Their VISIBLE text
       stays ع / EN / RU in every language (approved exception), so each
       one carries a real name in the language currently on screen — a
       screen reader must never announce a bare "ع". */
    'lang.name.ar': { ar: 'العربية', en: 'Arabic', ru: 'Арабский' },
    'lang.name.en': { ar: 'الإنجليزية', en: 'English', ru: 'Английский' },
    'lang.name.ru': { ar: 'الروسية', en: 'Russian', ru: 'Русский' },

    /* ---------- meta (per page) ---------- */
    'meta.index.title': {
      ar: 'حسين البسيوني | علوم البيانات والفلك',
      en: 'Hussein ElBassiouni | Data Science & Astronomy',
      ru: 'Хусейн Эль-Басьюни | Наука о данных и астрономия'
    },
    'meta.index.desc': {
      ar: 'الموقع الشخصي لحسين البسيوني: اهتمامات بعلوم البيانات والبرمجة وعلم الفلك، وقصته الشخصية، وخطته الدراسية نحو علوم البيانات الفلكي والدراسة في روسيا.',
      en: 'Personal website of Hussein ElBassiouni: interests in data science, programming and astronomy, his personal story, and his study plan toward astronomical data science and studying in Russia.',
      ru: 'Личный сайт Хусейна Эль-Басьюни: интересы в науке о данных, программировании и астрономии, личная история и учебный план — анализ астрономических данных и учёба в России.'
    },
    'meta.records.title': {
      ar: 'التعلم والشهادات | حسين البسيوني',
      en: 'Learning & Certificates | Hussein ElBassiouni',
      ru: 'Обучение и сертификаты | Хусейн Эль-Басьюни'
    },
    'meta.records.desc': {
      ar: 'شهادات الدورات والتطوّع الموثّقة لحسين البسيوني، مع البحث الفوري والتصفية حسب المجال.',
      en: 'Verified course and volunteering certificates of Hussein ElBassiouni, with instant search and filtering by field.',
      ru: 'Подтверждённые сертификаты курсов и волонтёрства Хусейна Эль-Басьюни, с мгновенным поиском и фильтром по направлениям.'
    },
    'meta.story.title': {
      ar: 'قصتي | حسين البسيوني',
      en: 'My Story | Hussein ElBassiouni',
      ru: 'Моя история | Хусейн Эль-Басьюни'
    },
    'meta.story.desc': {
      ar: 'قصة حسين البسيوني: من الثانوية العامة إلى الكرة الطائرة، ثم الإصابة، ثم الطريق نحو علوم البيانات وعلم الفلك والدراسة في روسيا.',
      en: 'The story of Hussein ElBassiouni: from secondary school to volleyball, then the injury, then the path toward data science, astronomy and studying in Russia.',
      ru: 'История Хусейна Эль-Басьюни: от старшей школы к волейболу, затем травма, затем путь к науке о данных, астрономии и учёбе в России.'
    },
    'meta.projects.title': {
      ar: 'المشاريع | حسين البسيوني',
      en: 'Projects | Hussein ElBassiouni',
      ru: 'Проекты | Хусейн Эль-Басьюни'
    },
    'meta.projects.desc': {
      ar: 'مشاريع حسين البسيوني: منصّة التجارة الإلكترونية الحقيقية «سوق المجد الطبي» مع تفاصيل الهندسة الكاملة في صفحاتها الخاصة.',
      en: 'The projects of Hussein ElBassiouni: the real-world Elmajd Medical Store e-commerce platform, with full engineering details on its own page.',
      ru: 'Проекты Хусейна Эль-Басьюни: реальная платформа интернет-торговли Elmajd Medical Store с полными инженерными деталями на отдельной странице.'
    },
    'meta.project.title': {
      ar: 'تفاصيل المشروع | حسين البسيوني',
      en: 'Project details | Hussein ElBassiouni',
      ru: 'Проект | Хусейн Эль-Басьюни'
    },
    'meta.project.desc': {
      ar: 'تفاصيل الهندسة الكاملة لمشروع «سوق المجد الطبي»: التجارة، الإدارة، تجربة العميل، الأتمتة، البحث، الأمان، والاختبار.',
      en: 'The full engineering details of the Elmajd Medical Store project: commerce, operations, customer experience, automation, search, security and testing.',
      ru: 'Полные инженерные детали проекта Elmajd Medical Store: торговля, управление, клиентский опыт, автоматизация, поиск, безопасность и тестирование.'
    },
    'meta.volleyball.title': {
      ar: 'رحلة الكرة الطائرة | حسين البسيوني',
      en: 'The Volleyball Journey | Hussein ElBassiouni',
      ru: 'Путь в волейболе | Хусейн Эль-Басьюни'
    },
    'meta.volleyball.desc': {
      ar: 'جانب الرياضي من حسين البسيوني: لاعب حائط صد بدأ من الملاعب الشعبية، وشارك في بطولتين وديتين حقيقيتين، وقصته تُروى كما حدثت دون مبالغة.',
      en: 'The athlete side of Hussein ElBassiouni: a middle blocker from grassroots courts with two real friendly tournaments, told as it happened.',
      ru: 'Спортивная сторона Хусейна Эль-Басьюни: центральный блокирующий с любительских площадок, два реальных товарищеских турнира — история рассказана честно.'
    },
    'meta.academic.title': {
      ar: 'المسار الأكاديمي والمهني | حسين البسيوني',
      en: 'The Academic & Professional Journey | Hussein ElBassiouni',
      ru: 'Академический путь | Хусейн Эль-Басьюни'
    },
    'meta.academic.desc': {
      ar: 'الجانب الأكاديمي والمهني من حسين البسيوني: ما يتعلمه الآن، وما أتمه من شهادات، والمسار الذي يبنيه من بيزنس إنفورماتكس إلى علم البيانات الفلكي مع الدراسة في روسيا.',
      en: 'The academic and professional side of Hussein ElBassiouni: what he is learning now, what he has completed, and the path from Business Informatics to astroinformatics with study in Russia.',
      ru: 'Академическая и профессиональная сторона Хусейна Эль-Басьюни: что он осваивает сейчас, что завершил, и путь от бизнес-информатики к астроинформатике с учёбой в России.'
    },
    'meta.portal.title': {
      ar: 'البوابة | حسين البسيوني',
      en: 'Gateway | Hussein ElBassiouni',
      ru: 'Портал | Хусейн Эль-Басьюни'
    },
    'meta.portal.desc': {
      ar: 'بوابة حسين البسيوني بين عالميه: اختر عالم الكرة الطائرة أو العالم الأكاديمي والمهني، وادخل إليه.',
      en: 'The gateway between Hussein ElBassiouni\u2019s two worlds: choose the volleyball world or the academic and professional world.',
      ru: 'Врата между двумя мирами Хусейна Эль-Басьюни: выберите мир волейбола или академический мир.'
    },

    /* ---------- home: the identity hero. Its only way out is ONE link ---------- */
    'hero.eyebrow': { ar: 'من يتطلع إلى عالمين', en: 'One person, two worlds', ru: 'Один человек — два мира' },
    'hero.lead': {
      ar: 'أطمح إلى الجمع بين علوم البيانات وعلم الفلك',
      en: 'I aim to combine data science and astronomy',
      ru: 'Я стремлюсь соединить науку о данных и астрономию'
    },
    'hero.quote': {
      ar: 'لم أستسلم، وما زلت أعمل على بناء طريقي.',
      en: 'I did not give up, and I am still building my path.',
      ru: 'Я не сдался и продолжаю строить свой путь.'
    },
    /* decorative scroll cue at the bottom of the hero */
    'hero.scroll': {
      ar: 'مرّر للأسفل',
      en: 'Scroll to explore',
      ru: 'Листайте вниз'
    },
    /* the single CTA into portal.html — the homepage's only portal entry */
    'hero.enterPortal': {
      ar: 'استكشف عالمي',
      en: 'Explore my world',
      ru: 'Исследуйте мой мир'
    },

    /* ---------- portal.html — the gateway's own copy ----------
       Minimal on purpose: a welcome, a question, two doorways. فصحى in
       the brief's own wording; Russian written to the same standard. */
    'portal.eyebrow': {
      ar: 'بوابة إلى عالمين',
      en: 'A gateway between two worlds',
      ru: 'Врата между двумя мирами'
    },
    'portal.welcome': {
      ar: 'مرحبًا بك في عالمي',
      en: 'Welcome to my world',
      ru: 'Добро пожаловать в мой мир'
    },
    'portal.ask': {
      ar: 'أي عالم تريد أن تستكشف؟',
      en: 'Which world would you like to explore?',
      ru: 'Какой мир вы хотели бы исследовать?'
    },
    'portal.pathsLabel': {
      ar: 'اختر العالم الذي تريد أن تدخل إليه',
      en: 'Choose the world you want to enter',
      ru: 'Выберите мир, в который хотите войти'
    },
    /* the two doorways — destinations, not pills */
    'portal.pathVolley': {
      ar: 'عالم الكرة الطائرة',
      en: 'Volleyball world',
      ru: 'Мир волейбола'
    },
    'portal.pathVolleySub': {
      ar: 'حسين — الرياضي',
      en: 'Hussein — the athlete',
      ru: 'Хусейн — спортсмен'
    },
    'portal.pathAcad': {
      ar: 'العالم الأكاديمي والمهني',
      en: 'Academic & professional world',
      ru: 'Академический мир'
    },
    'portal.pathAcadSub': {
      ar: 'حسين — الأكاديمي',
      en: 'Hussein — the academic',
      ru: 'Хусейн — учёба и карьера'
    },
    /* the doorway links' screen-reader labels — each one CONTAINS its
       visible text, so the label-in-name rule holds */
    'portal.enterVolley': {
      ar: 'ادخل عالم الكرة الطائرة',
      en: 'Enter the volleyball world',
      ru: 'Войти в мир волейбола'
    },
    'portal.enterAcad': {
      ar: 'ادخل العالم الأكاديمي والمهني',
      en: 'Enter the academic and professional world',
      ru: 'Войти в академический мир'
    },

    /* ---------- shared world-page furniture ---------- */
    'world.backPortal': {
      ar: 'العودة إلى البوابة',
      en: 'Back to the portal',
      ru: 'Назад к порталу'
    },
    'world.switch': {
      ar: 'بدّل المسار',
      en: 'Switch path',
      ru: 'Сменить путь'
    },
    'world.volley': {
      ar: 'الكرة الطائرة',
      en: 'Volleyball',
      ru: 'Волейбол'
    },
    'world.academic': {
      ar: 'الأكاديمي والمهني',
      en: 'Academic',
      ru: 'Академический'
    },

    /* ---------- volleyball page (volleyball.html) ---------- */
    'vp.eyebrow': {
      ar: 'العالم الرياضي',
      en: "The athlete's world",
      ru: 'Мир спортсмена'
    },
    'vp.title': {
      ar: 'رحلة الكرة الطائرة',
      en: 'The Volleyball Journey',
      ru: 'Путь волейболиста'
    },
    'vp.lead': {
      ar: 'لاعب في طور التكوين، بدأ من الملاعب الشعبية، ومكانه الطبيعي قرب الشبكة. رحلة تُروى كما حدثت — دون مبالغة.',
      en: 'A developing player with a grassroots start, whose place is at the net. A journey told as it happened — without exaggeration.',
      ru: 'Игрок в процессе становления, начинавший на любительских площадках, чьё место — у сетки. История, рассказанная честно, без преувеличений.'
    },
    'vp.profile.title': {
      ar: 'ملف اللاعب',
      en: 'Player profile',
      ru: 'Профиль игрока'
    },
    'vp.profile.pos': {
      ar: 'المركز',
      en: 'Position',
      ru: 'Позиция'
    },
    'vp.profile.posVal': {
      ar: 'حائط الصد',
      en: 'Middle Blocker',
      ru: 'Центральный блокирующий'
    },
    'vp.profile.clubs': {
      ar: 'النوادي',
      en: 'Clubs',
      ru: 'Клубы'
    },
    'vp.profile.clubsVal': {
      ar: 'نادٍ شعبيّان — التعاون والصّفا؛ غير مسجَّلَين في الاتحاد',
      en: 'Two grassroots clubs — Al-Taawoon and Al-Safa; neither registered with the federation',
      ru: 'Два любительских клуба — «Ат-Тааун» и «Ас-Сафа»; ни один не зарегистрирован в федерации'
    },
    'vp.profile.status': {
      ar: 'الوضع',
      en: 'Status',
      ru: 'Статус'
    },
    'vp.profile.statusVal': {
      ar: 'توقّفتُ عن اللعب التنافسي بعد إصابة في عيني اليسرى؛ الهدف لم يتغيّر',
      en: 'Stepped back from competitive play after an injury to my left eye; the goal did not change',
      ru: 'Отошёл от соревновательной игры после травмы левого глаза; цель не изменилась'
    },
    'vp.role.note': {
      ar: 'لم أنضمّ يومًا لفريق رسمي مسجَّل في الاتحاد؛ هذا حلمٌ لم أستطع تحقيقه في مصر، وأنوي تحقيقه في روسيا.',
      en: 'I have never been on a federation-registered team. That is the dream I could not realise in Egypt — and the one I intend to achieve in Russia.',
      ru: 'Я никогда не состоял в команде, зарегистрированной в федерации. Это мечта, которую я не смог осуществить в Египте, — и именно её я намерен осуществить в России.'
    },
    'vp.timeline.title': {
      ar: 'الطريق حتى الآن',
      en: 'The road so far',
      ru: 'Путь до сих пор'
    },
    'vp.tl1': {
      ar: 'البدايات الشعبية',
      en: 'Grassroots beginnings',
      ru: 'Любительские площадки'
    },
    'vp.tl1Sub': {
      ar: 'ملاعب شعبية، ومراكز شباب، وأصدقاء، وفرق غير رسمية — مع حبٍّ حقيقي للكرة الطائرة.',
      en: 'Local courts, youth centres, friends and informal teams — with a genuine love for volleyball.',
      ru: 'Локальные площадки, молодёжные центры, друзья и неформальные команды — с настоящей любовью к волейболу.'
    },
    'vp.tl2': {
      ar: 'أول بطولة ودية — رمضان 2023',
      en: 'First friendly tournament — Ramadan 2023',
      ru: 'Первый товарищеский турнир — Рамадан 2023'
    },
    'vp.tl2Sub': {
      ar: 'حائط صد مع نادي التعاون بالهرم — المركز الثالث.',
      en: 'Middle Blocker with Al-Taawoon in Al Haram — third place.',
      ru: 'Центральный блокирующий в клубе «Ат-Тааун» в Аль-Хараме — 3-е место.'
    },
    'vp.tl3': {
      ar: 'الدورة التنشيطية — أكتوبر 2023',
      en: 'Activation tournament — October 2023',
      ru: 'Активационный турнир — октябрь 2023'
    },
    'vp.tl3Sub': {
      ar: 'فوز 3–0 مع فريق مركز شباب الصفا (بنين).',
      en: 'Won 3–0 with the Al-Safa youth centre boys\' team.',
      ru: 'Победа 3–0 с командой юношей молодёжного центра «Ас-Сафа».'
    },
    'vp.tl4': {
      ar: 'الإصابة والاعتزال',
      en: 'The injury and stepping back',
      ru: 'Травма и пауза'
    },
    'vp.tl4Sub': {
      ar: 'بعد نحو ثلاث سنوات من اللعب، توقّفتُ عن اللعب التنافسي — لكنني لم أترك الحلم.',
      en: 'After about three years of play I stepped back from competitive play — but I never left the dream.',
      ru: 'После примерно трёх лет игры я отошёл от соревновательного спорта — но не от мечты.'
    },
    'vp.tl5': {
      ar: 'اليوم',
      en: 'Today',
      ru: 'Сегодня'
    },
    'vp.tl5Sub': {
      ar: 'الهدف لم يتغيّر: مواصلة الكرة الطائرة بجدّية ريثما تتاح الفرصة.',
      en: 'The goal has not changed: to pursue volleyball seriously when the chance comes.',
      ru: 'Цель не изменилась: серьёзно продолжить волейбол, когда представится возможность.'
    },
    'vp.tournaments.title': {
      ar: 'البطولات التي لعبتها',
      en: 'Tournaments played',
      ru: 'Сыгранные турниры'
    },
    'vp.numbers.title': {
      ar: 'في أرقام صادقة',
      en: 'In real numbers',
      ru: 'Честные цифры'
    },
    'vp.num1': {
      ar: 'أول بطولة',
      en: 'first tournament',
      ru: 'первый турнир'
    },
    'vp.num3': {
      ar: 'المركز الثالث',
      en: 'third place',
      ru: '3-е место'
    },
    'vp.numYears': {
      ar: 'سنوات من اللعب',
      en: 'years of play',
      ru: 'лет игры'
    },
    'vp.next.title': {
      ar: 'الفصل القادم',
      en: 'The next chapter',
      ru: 'Следующая глава'
    },
    'vp.next.lead': {
      ar: 'مواصلة الكرة الطائرة خارج مصر — الرحلة لم تنتهِ، بل اتخذت طريقًا جديدًا.',
      en: 'Continue volleyball outside Egypt — the journey is not over; it is taking a new route.',
      ru: 'Продолжить волейбол за пределами Египта — путь не закончен, он просто меняет маршрут.'
    },
    'vp.certView': {
      ar: 'شهادة البطولة',
      en: 'Tournament certificate',
      ru: 'Сертификат турнира'
    },

    /* ---------- academic page (academic.html) ---------- */
    'ap.eyebrow': {
      ar: 'العالم الفكري والمهني',
      en: 'The academic world',
      ru: 'Академический мир'
    },
    'ap.title': {
      ar: 'المسار الأكاديمي والمهني',
      en: 'The Academic & Professional Journey',
      ru: 'Академический и профессиональный путь'
    },
    'ap.lead': {
      ar: 'من أساسٍ متين في البيانات والبرمجة إلى طموحٍ في علم البيانات الفلكي — مع خطة للدراسة في روسيا.',
      en: 'From a solid foundation in data and programming toward a goal in astroinformatics — with a plan to study in Russia.',
      ru: 'От прочной основы в данных и программировании — к цели в астроинформатике, с планом учиться в России.'
    },
    'ap.path.title': {
      ar: 'المسار الذي أعمل على بنائه',
      en: 'The path I am building',
      ru: 'Путь, который я строю'
    },
    'ap.learning.title': {
      ar: 'ما أتعلّمه الآن',
      en: 'Currently learning',
      ru: 'Что я осваиваю сейчас'
    },
    'ap.learning.lead': {
      ar: 'اتجاهات دراسة — ليست مؤهلات، ولا أرقامًا وهمية: أطوّرها خطوة بخطوة.',
      en: 'Directions of study, not qualifications: developing them step by step.',
      ru: 'Направления обучения, а не квалификации: развиваю их шаг за шагом.'
    },
    'ap.learning.python': { ar: 'بايثون', en: 'Python', ru: 'Python' },
    'ap.learning.math': { ar: 'الرياضيات', en: 'Mathematics', ru: 'Математика' },
    'ap.learning.stat': { ar: 'الإحصاء', en: 'Statistics', ru: 'Статистика' },
    'ap.learning.data': { ar: 'تحليل البيانات', en: 'Data analysis', ru: 'Анализ данных' },
    'ap.learning.research': { ar: 'البحث الأكاديمي', en: 'Academic research', ru: 'Академические исследования' },
    'ap.learning.english': { ar: 'الإنجليزية', en: 'English', ru: 'Английский язык' },
    'ap.learning.russian': { ar: 'الروسية', en: 'Russian', ru: 'Русский язык' },
    'ap.certs.title': {
      ar: 'ما أتممته',
      en: 'What I have completed',
      ru: 'Что я завершил'
    },
    'ap.certs.lead': {
      ar: 'شهادات ووثائق تعلّم موثّقة بالمصادر المتاحة لكل سجل — السجل الكامل في صفحة مستقلة.',
      en: 'Verified certificates and records of learning, each with its sources — the full record lives on its own page.',
      ru: 'Подтверждённые сертификаты и записи об обучении с указанием источников — полный реестр на отдельной странице.'
    },
    'ap.certs.open': {
      ar: 'افتح سجل الشهادات',
      en: 'Open the records page',
      ru: 'Открыть страницу записей'
    },
    'ap.certOpen': {
      ar: 'عرض الشهادة',
      en: 'View certificate',
      ru: 'Смотреть сертификат'
    },
    'ap.projects.title': {
      ar: 'ما أبنيه',
      en: 'What I am building',
      ru: 'Что я создаю'
    },
    'ap.future.title': {
      ar: 'إلى أين أتجه',
      en: 'Where I am heading',
      ru: 'Куда я иду'
    },
    'ap.future.lead': {
      ar: 'أطمح إلى بكالوريوس في بيزنس إنفورماتكس، ثم ماجستير في علوم البيانات، ثم دكتوراه في علم البيانات الفلكي — مع الدراسة في روسيا.',
      en: 'A Bachelor\'s in Business Informatics, then a Master\'s in Data Science, then a PhD in Astroinformatics — with study in Russia.',
      ru: 'Бакалавриат по бизнес-информатике, затем магистратура по науке о данных, затем докторантура по астроинформатике — с учёбой в России.'
    },

    /* The keyword strip under the hero. Words only — each one is already
       an interest or a field he really studies; `|` separates items and
       JS duplicates the row to make the loop seamless. */
    'marquee.items': {
      ar: 'تحليل البيانات|بايثون|إكسل|الذكاء الاصطناعي|علم الفلك|الكواكب|التعلم المستمر',
      en: 'Data analysis|Python|Excel|Artificial intelligence|Astronomy|Planets|Continuous learning',
      ru: 'Анализ данных|Python|Искусственный интеллект|Астрономия|Планеты|Непрерывное обучение'
    },

    /* ---------- home: about ---------- */
    'about.title': { ar: 'نبذة عني', en: 'About me', ru: 'Обо мне' },
    'about.text': {
      ar: 'أنا حسين البسيوني. أهتم بعلوم البيانات والبرمجة وعلم الفلك، وأحب استكشاف طرق استخدام البيانات لفهم الكواكب والظواهر الفلكية. أعمل على تطوير مهاراتي والاستعداد لمسار دراسي يقرّبني من هذا الهدف.',
      en: 'I am Hussein ElBassiouni. I am interested in data science, programming and astronomy, and I enjoy exploring how data can help us understand planets and astronomical phenomena. I am developing my skills and preparing for a course of study that brings me closer to this goal.',
      ru: 'Меня зовут Хусейн Эль-Басьюни. Меня интересуют наука о данных, программирование и астрономия, мне нравится изучать, как данные помогают понять планеты и астрономические явления. Я развиваю свои навыки и готовлюсь к учёбе, которая приблизит меня к этой цели.'
    },

    /* ---------- home: story summary ---------- */
    'story.title': { ar: 'قصتي', en: 'My story', ru: 'Моя история' },
    'story.more': {
      ar: 'اقرأ القصة كاملة',
      en: 'Read the full story',
      ru: 'Читать историю полностью'
    },
    'story.p1': {
      ar: 'بدأتُ في الثانوية العامة وأهملتُ الدراسة، فكانت النتيجة 63% — وهي لا تعبّر عن قدراتي بقدر ما تعبّر عن إهمالي. بعدها مررتُ بفترة صعبة، وشاهدتُ أنمي “هايكيو” لأحبّ الكرة الطائرة، فمارستها ثلاث سنوات حتى اقتربتُ من أول انضمام رسمي لي إلى فريق. ثم تعرّضتُ لإصابة في عيني اليسرى أثناء مباراة ودية في مركز شباب السلام، ففقدتُ البصر فيها واعتزلتُ الكرة.',
      en: 'In secondary school I neglected my studies, and the result was 63% — a number that reflects my neglect more than my ability. Afterwards I went through a difficult period, watched the anime “Haikyu!!” and fell in love with volleyball. I played for three years until I was close to my first official registration with a team. Then, during a friendly match at the Al-Salam Youth Center, I injured my left eye, lost the sight in it, and retired from the sport.',
      ru: 'В старшей школе я запустил учёбу, и результатом стали 63% — цифра, которая говорит скорее о моей небрежности, чем о способностях. Затем был трудный период, я посмотрел аниме «Хайкю!!» и полюбил волейбол. Я играл три года и был близок к первому официальному зачислению в команду. Затем в товарищеском матче в молодёжном центре «Аль-Салам» я травмировал левый глаз, потерял в нём зрение и ушёл из спорта.'
    },
    'story.p2': {
      ar: 'لكنني لم أستسلم. انتقلتُ إلى البيانات والبرمجة، وبقي الفلك والكواكب شغفًا من طفولتي. أعمل الآن على تطوير نفسي وجمع الشهادات، وأطمح إلى بكالوريوس في بزنس إنفورماتكس ثم ماجستير في علوم البيانات ثم دكتوراه في علم البيانات الفلكي، مع الدراسة في روسيا بإذن الله.',
      en: 'But I did not give up. I turned to data and programming, while astronomy and planets remained a childhood passion. I am now developing myself and collecting certificates, aiming for a bachelor’s in Business Informatics, then a master’s in Data Science, then a PhD in astronomical data science — with study in Russia, God willing.',
      ru: 'Но я не сдался. Я перешёл к данным и программированию, а астрономия и планеты остались страстью с детства. Сейчас я развиваюсь и собираю сертификаты. Моя цель — бакалавриат по бизнес-информатике, затем магистратура по науке о данных, затем докторантура по анализу астрономических данных, — и учёба в России, если Бог даст.'
    },
    'story.cta': {
      ar: 'اقرأ قصتي كاملة',
      en: 'Read my full story',
      ru: 'Читать мою историю полностью'
    },

    /* ---------- home: plan ---------- */
    'plan.title': {
      ar: 'الطريق الذي أعمل على بنائه',
      en: 'The path I am building',
      ru: 'Путь, который я строю'
    },
    'plan.s1t': { ar: 'تطوير الأساس', en: 'Building the foundation', ru: 'Фундамент' },
    'plan.s1d': {
      ar: 'أعمل على تقوية معرفتي بالبرمجة وتحليل البيانات، وأحرص على التعلم المستمر وإضافة مهارات جديدة.',
      en: 'I am strengthening my knowledge of programming and data analysis, learning continuously and adding new skills.',
      ru: 'Я укрепляю знания в программировании и анализе данных, постоянно учусь и осваиваю новые навыки.'
    },
    'plan.s2t': {
      ar: 'دراسة مجال يرتبط بالأعمال والتقنية',
      en: 'Studying a field that connects business and technology',
      ru: 'Учёба на стыке бизнеса и технологий'
    },
    'plan.s2d': {
      ar: 'أطمح إلى اختيار دراسة جامعية تمنحني أساسًا مناسبًا في الأعمال والتقنية، بما يتوافق مع اهتماماتي وخطتي المستقبلية.',
      en: 'I aim to choose university studies that give me a solid foundation in business and technology, matching my interests and future plan.',
      ru: 'Я хочу выбрать университетскую программу, которая даст прочную основу в бизнесе и технологиях и будет соответствовать моим интересам и будущему плану.'
    },
    'plan.s3t': {
      ar: 'التخصص في علوم البيانات',
      en: 'Specialising in data science',
      ru: 'Специализация в науке о данных'
    },
    'plan.s3d': {
      ar: 'أطمح إلى التعمق في علوم البيانات وتعلم الأدوات والأساليب اللازمة لتحليل البيانات وبناء المشاريع.',
      en: 'I aim to go deeper into data science and learn the tools and methods needed to analyse data and build projects.',
      ru: 'Я хочу углубиться в науку о данных и освоить инструменты и методы анализа данных и создания проектов.'
    },
    'plan.s4t': {
      ar: 'تطبيق البيانات في علم الفلك',
      en: 'Applying data to astronomy',
      ru: 'Применение данных в астрономии'
    },
    'plan.s4d': {
      ar: 'هدفي البعيد هو استخدام علوم البيانات والبرمجة في دراسة البيانات الفلكية والكواكب والظواهر المرتبطة بالفضاء.',
      en: 'My long-term goal is to use data science and programming to study astronomical data, planets and space-related phenomena.',
      ru: 'Моя дальняя цель — использовать науку о данных и программирование для изучения астрономических данных, планет и космических явлений.'
    },
    'plan.s5t': { ar: 'الدراسة في روسيا', en: 'Studying in Russia', ru: 'Учёба в России' },
    'plan.s5d': {
      ar: 'أحلم بالدراسة في روسيا، وأسعى إلى الاستعداد والتقديم للجامعات والفرص المناسبة.',
      en: 'I dream of studying in Russia, and I am preparing and applying to suitable universities and opportunities.',
      ru: 'Я мечтаю учиться в России, готовлюсь и подаюсь в подходящие университеты и на конкурсы.'
    },
    'plan.note': {
      ar: 'هذه خطة طموحة قابلة للتطوير، وتعتمد تفاصيلها على متطلبات الجامعات والفرص الدراسية المتاحة.',
      en: 'This is an ambitious plan open to development; its details depend on university requirements and available study opportunities.',
      ru: 'Это амбициозный план, который будет развиваться; детали зависят от требований университетов и доступных возможностей.'
    },

    /* ---------- home: why ---------- */
    'why.title': {
      ar: 'عندما يلتقي الفلك بالبيانات',
      en: 'When astronomy meets data',
      ru: 'Когда астрономия встречается с данными'
    },
    'why.lead': {
      ar: 'أحببتُ الفلك والكواكب منذ طفولتي، وأهتم بالبيانات والبرمجة. يجذبني احتمال استخدام الأدوات الحاسوبية لتحليل البيانات الفلكية واكتشاف الأنماط وفهم المعلومات التي تقدمها لنا.',
      en: 'I have loved astronomy and planets since childhood, and I am interested in data and programming. I am drawn to the possibility of using computational tools to analyse astronomical data, discover patterns and understand the information it gives us.',
      ru: 'Я люблю астрономию и планеты с детства и интересуюсь данными и программированием. Меня привлекает возможность использовать вычислительные инструменты для анализа астрономических данных, поиска закономерностей и понимания информации, которую они дают.'
    },
    'why.chainLabel': {
      ar: 'العلاقة بين البيانات والبرمجة والفلك',
      en: 'How data, programming and astronomy connect',
      ru: 'Как связаны данные, программирование и астрономия'
    },
    'why.data': { ar: 'البيانات', en: 'Data', ru: 'Данные' },
    'why.code': { ar: 'البرمجة', en: 'Programming', ru: 'Программирование' },
    'why.astro': { ar: 'الفلك', en: 'Astronomy', ru: 'Астрономия' },
    'why.planets': { ar: 'الكواكب', en: 'Planets', ru: 'Планеты' },

    /* ---------- home: interests ---------- */
    'interests.title': { ar: 'اهتماماتي', en: 'My interests', ru: 'Мои интересы' },
    'int.ds.t': { ar: 'علوم البيانات', en: 'Data science', ru: 'Наука о данных' },
    'int.ds.d': {
      ar: 'مجال أطمح إلى التعمق فيه واستخدامه في مشروعات ذات معنى.',
      en: 'A field I aim to explore deeply and use in meaningful projects.',
      ru: 'Область, в которую я хочу углубиться и применять в значимых проектах.'
    },
    'int.code.t': { ar: 'البرمجة', en: 'Programming', ru: 'Программирование' },
    'int.code.d': {
      ar: 'مهارة أعمل على تطويرها لدعم أفكاري ومشروعاتي.',
      en: 'A skill I am developing to support my ideas and projects.',
      ru: 'Навык, который я развиваю, чтобы поддерживать свои идеи и проекты.'
    },
    'int.astro.t': { ar: 'علم الفلك', en: 'Astronomy', ru: 'Астрономия' },
    'int.astro.d': {
      ar: 'شغف قديم أطمح إلى ربطه بالبيانات والتحليل.',
      en: 'An old passion I aim to connect with data and analysis.',
      ru: 'Давняя страсть, которую я хочу связать с данными и анализом.'
    },
    'int.planets.t': { ar: 'الكواكب والفضاء', en: 'Planets and space', ru: 'Планеты и космос' },
    'int.planets.d': {
      ar: 'اهتمام مبكر بالفضاء والكواكب، أطمح إلى استكشافه بعين علمية قائمة على البيانات.',
      en: 'An early interest in space and planets, which I aim to explore with a scientific, data-driven eye.',
      ru: 'Ранний интерес к космосу и планетам, который я хочу изучать научным взглядом, опираясь на данные.'
    },
    'int.volley.t': { ar: 'الكرة الطائرة', en: 'Volleyball', ru: 'Волейбол' },
    'int.volley.d': {
      ar: 'رياضة شكلت جزءًا مهمًا من رحلتي الشخصية.',
      en: 'A sport that shaped an important part of my personal journey.',
      ru: 'Спорт, который стал важной частью моего личного пути.'
    },
    'int.learn.t': { ar: 'التعلم المستمر', en: 'Continuous learning', ru: 'Непрерывное обучение' },
    'int.learn.d': {
      ar: 'أعمل على تطوير معرفتي من خلال الدراسة والدورات والتطبيق.',
      en: 'I develop my knowledge through study, courses and practice.',
      ru: 'Я развиваю знания через учёбу, курсы и практику.'
    },

    /* ---------- home: projects ---------- */
    'projects.title': { ar: 'مشاريعي', en: 'My projects', ru: 'Мои проекты' },
    'projects.empty': {
      ar: 'أعمل حاليًا على تطوير مهاراتي، وسيتم عرض مشاريعي هنا عند اكتمالها.',
      en: 'I am currently developing my skills; my projects will appear here when they are complete.',
      ru: 'Сейчас я развиваю навыки; мои проекты появятся здесь, когда будут готовы.'
    },
    'projects.featured': {
      ar: 'مشروع حقيقي مميّز',
      en: 'Featured real-world project',
      ru: 'Избранный реальный проект'
    },
    /* The projects LIST page (projects.html) and the detail page
       (project.html?id=<id>). The card on the home page opens the detail
       page; the engineering story lives there, never in the card. */
    'projects.pageTitle': { ar: 'المشاريع', en: 'Projects', ru: 'Проекты' },
    'projects.eyebrow': {
      ar: 'مشاريع المحفظة',
      en: 'Portfolio projects',
      ru: 'Проекты портфолио'
    },
    'projects.lead': {
      ar: 'مشاريع حقيقية معروضة هنا، ولكلٍّ قصته الهندسية الكاملة في صفحة مستقلة. اضغط على أي بطاقة لفتح تفاصيل المشروع.',
      en: 'The real-world projects presented in this portfolio; each one has its full engineering story on a page of its own. Open a card to read the details.',
      ru: 'Реальные проекты, представленные в портфолио; у каждого — полная инженерная история на отдельной странице. Откройте карточку, чтобы прочитать детали.'
    },
    'projects.viewAll': {
      ar: 'الانتقال إلى المشاريع',
      en: 'View all projects',
      ru: 'Смотреть все проекты'
    },
    'projects.back': {
      ar: 'العودة إلى المشاريع',
      en: 'Back to projects',
      ru: 'Назад к проектам'
    },
    'projects.backHome': {
      ar: 'العودة إلى الرئيسية',
      en: 'Back to home',
      ru: 'Назад на главную'
    },
    'projects.viewProject': {
      ar: 'عرض تفاصيل المشروع',
      en: 'View project details',
      ru: 'Открыть детали проекта'
    },
    'projects.notFound.title': {
      ar: 'المشروع غير موجود',
      en: 'Project not found',
      ru: 'Проект не найден'
    },
    'projects.notFound.text': {
      ar: 'لم يُعثر على مشروع بهذا المعرّف. يمكنك العودة إلى قائمة المشاريع.',
      en: 'No project with that identifier was found. You can return to the projects list.',
      ru: 'Проект с таким идентификатором не найден. Вы можете вернуться к списку проектов.'
    },
    'projects.visit': {
      ar: 'زيارة الموقع',
      en: 'Visit website',
      ru: 'Посетить сайт'
    },

    /* ---------- home: learning summary ---------- */
    'learning.title': {
      ar: 'التعلم والشهادات',
      en: 'Learning & certificates',
      ru: 'Обучение и сертификаты'
    },
    /* Same trap as `rec.lead` below, and the same correction. This sentence
       promised a verification link for EVERY certificate, which stopped being
       true the moment the International Dictation participation certificate was
       published: its credential is the document itself, and no verified address
       for that campaign exists. It now says what is actually true — each entry
       is documented with the evidence that exists for it. */
    'learning.lead': {
      ar: 'شهاداتي ووثائق تعلّمي موثّقة بالمصادر المتاحة لكل سجل. السجل كامل — مع البحث الفوري والتصفية حسب المجال — في صفحة مستقلة.',
      en: 'My certificates and learning records are documented with the available evidence for each entry. The full record — with instant search and filtering by field — is on a dedicated page.',
      ru: 'Мои сертификаты и учебные записи подтверждены доступными материалами по каждому пункту. Полный список — с мгновенным поиском и фильтром по направлениям — на отдельной странице.'
    },
    'learning.open': {
      ar: 'افتح سجل التعلم والشهادات',
      en: 'Open the learning & certificates record',
      ru: 'Открыть список обучения и сертификатов'
    },
    'stat.view': { ar: 'عرض', en: 'View', ru: 'Смотреть' },
    'learning.statsLabel': {
      ar: 'ملخص السجل',
      en: 'Record summary',
      ru: 'Кратко о списке'
    },
    'stat.viewRecord': {
      ar: 'عرض السجل',
      en: 'View the record',
      ru: 'Смотреть список'
    },
    'projects.screenshot': {
      ar: 'لقطة شاشة',
      en: 'screenshot',
      ru: 'скриншот'
    },
    'projects.screenshotDefault': {
      ar: 'لقطة شاشة للمشروع',
      en: 'Project screenshot',
      ru: 'Скриншот проекта'
    },

    /* ---------- home: volleyball ---------- */
    'volley.title': {
      ar: 'الكرة الطائرة في رحلتي',
      en: 'Volleyball in my journey',
      ru: 'Волейбол в моём пути'
    },
    'volley.lead': {
      ar: 'كانت الكرة الطائرة جزءًا مهمًا من حياتي لمدة ثلاث سنوات. ساعدتني هذه التجربة على اكتشاف شغفي بالرياضة، والعمل على تطوير نفسي، وتعلم معنى الاستمرار. بعد إصابة عيني اليسرى توقفت عن اللعب، لكنني ما زلت أطمح إلى العودة إلى أجواء الفرق الرياضية إذا أتيحت لي الفرصة، بما يتناسب مع ظروفي.',
      en: 'Volleyball was an important part of my life for three years. The experience helped me discover my passion for sport, work on developing myself and learn what perseverance means. After injuring my left eye I stopped playing, but I still hope to return to a team environment if the opportunity arises, as my circumstances allow.',
      ru: 'Волейбол был важной частью моей жизни в течение трёх лет. Этот опыт помог мне открыть страсть к спорту, работать над собой и понять, что такое настойчивость. После травмы левого глаза я перестал играть, но всё ещё надеюсь вернуться в командную среду, если появится возможность и позволят обстоятельства.'
    },
    'volley.viewImage': {
      ar: 'عرض الصورة',
      en: 'View image',
      ru: 'Смотреть фото'
    },

    /* ---------- home: vision ---------- */
    'vision.title': {
      ar: 'رؤيتي للمستقبل',
      en: 'My vision for the future',
      ru: 'Моё видение будущего'
    },
    'vision.text': {
      ar: 'أطمح، بإذن الله، إلى إنجاز مشاريع في علم البيانات الفلكي، ومواصلة دراستي في روسيا، وبناء مستقبل يجمع بين البيانات والبرمجة وشغفي بعلم الفلك.',
      en: 'God willing, I aspire to complete projects in astronomical data science, continue my studies in Russia, and build a future that combines data, programming and my passion for astronomy.',
      ru: 'Я стремлюсь, если Бог даст, выполнить проекты в области анализа астрономических данных, продолжить учёбу в России и построить будущее, соединяющее данные, программирование и мою любовь к астрономии.'
    },
    'vision.sub': {
      ar: 'هذا هدف أعمل على الاقتراب منه خطوة بخطوة.',
      en: 'This is a goal I am approaching step by step.',
      ru: 'Это цель, к которой я иду шаг за шагом.'
    },

    /* ---------- home: contact ---------- */
    'contact.title': {
      ar: 'لنبقَ على تواصل',
      en: 'Let’s stay in touch',
      ru: 'Остаёмся на связи'
    },
    'contact.lead': {
      ar: 'للتواصل بشأن الدراسة أو المشاريع أو فرص التعلّم، هذه قنواتي على المنصّات المختلفة.',
      en: 'For study, projects or learning opportunities, these are the platforms where you can reach me.',
      ru: 'По вопросам учёбы, проектов или возможностей обучения — вот площадки, где со мной можно связаться.'
    },
    'contact.pending': {
      ar: 'ستُضاف بيانات التواصل قريبًا.',
      en: 'Contact details will be added soon.',
      ru: 'Контакты будут добавлены скоро.'
    },

    /* ---------- records page ---------- */
    'rec.eyebrow': { ar: 'السجل', en: 'Record', ru: 'Список' },
    'rec.title': {
      ar: 'التعلم والشهادات',
      en: 'Learning & certificates',
      ru: 'Обучение и сертификаты'
    },
    /* The lead used to promise a verification link for EVERY certificate.
       Two records have none — the DataCamp course, whose credential is the
       PDF itself, and the International Dictation participation certificate,
       which is evidenced by the document itself — so the sentence was
       promising something the page does not deliver. It now says what is
       actually true: each record is documented with the evidence that exists
       for it, and some of that evidence is a verification link. */
    'rec.lead': {
      ar: 'شهاداتي ووثائق تعلّمي ومشاركتي موثّقة بالمصادر المتاحة لكل سجل. ابحث أو صفِّ حسب المجال.',
      en: 'Certificates and learning records are documented with the available evidence for each entry. Search or filter by field.',
      ru: 'Здесь собраны сертификаты и учебные записи с доступными подтверждающими материалами. Используйте поиск или фильтры.'
    },
    'search.srLabel': {
      ar: 'البحث في السجلات',
      en: 'Search the records',
      ru: 'Поиск по списку'
    },
    'search.placeholder': {
      ar: 'اكتب للبحث… مثال: ذكاء، إسعاف، 2026',
      en: 'Type to search… e.g. AI, first aid, 2026',
      ru: 'Введите для поиска… например: ИИ, помощь, 2026'
    },
    'search.aria': {
      ar: 'اكتب للبحث في الشهادات والتطوّع',
      en: 'Type to search certificates and volunteering',
      ru: 'Введите для поиска по сертификатам и волонтёрству'
    },
    'search.clear': { ar: 'مسح البحث', en: 'Clear search', ru: 'Очистить поиск' },
    'search.tagLabel': {
      ar: 'تصفية حسب المجال',
      en: 'Filter by field',
      ru: 'Фильтр по направлениям'
    },
    'search.all': { ar: 'الكل', en: 'All', ru: 'Все' },
    'certs.title': { ar: 'الشهادات', en: 'Certificates', ru: 'Сертификаты' },
    'certs.none': {
      ar: 'لا توجد نتائج مطابقة.',
      en: 'No matching results.',
      ru: 'Совпадений нет.'
    },
    'vol.title': { ar: 'التطوّع', en: 'Volunteering', ru: 'Волонтёрство' },
    'vol.none': {
      ar: 'لا توجد نتائج مطابقة.',
      en: 'No matching results.',
      ru: 'Совпадений нет.'
    },
    'rec.viewCert': {
      ar: 'عرض الشهادة',
      en: 'View certificate',
      ru: 'Смотреть сертификат'
    },
    'rec.openCert': {
      ar: 'فتح المستند الأصلي',
      en: 'Open the original document',
      ru: 'Открыть исходный документ'
    },
    'rec.openPdf': {
      ar: 'فتح PDF في تبويب جديد',
      en: 'Open the PDF in a new tab',
      ru: 'Открыть PDF в новой вкладке'
    },
    'rec.downloadPdf': {
      ar: 'تنزيل المستند',
      en: 'Download the document',
      ru: 'Скачать документ'
    },
    'rec.closeCert': {
      ar: 'إغلاق المستند',
      en: 'Close the document',
      ru: 'Закрыть документ'
    },
    'rec.duration': { ar: 'المدة', en: 'Duration', ru: 'Длительность' },
    'rec.credential': { ar: 'رقم الشهادة', en: 'Credential', ru: 'Номер документа' },
    'rec.watchVideo': {
      ar: 'شاهد الفيديو',
      en: 'Watch video',
      ru: 'Смотреть видео'
    },
    'rec.viewImage': {
      ar: 'عرض الصورة بالحجم الكامل',
      en: 'View the image full size',
      ru: 'Открыть изображение полностью'
    },
    'rec.downloadImage': {
      ar: 'تنزيل الصورة',
      en: 'Download image',
      ru: 'Скачать изображение'
    },
    'rec.zoomIn': { ar: 'تكبير', en: 'Zoom in', ru: 'Приблизить' },
    'rec.zoomOut': { ar: 'تصغير', en: 'Zoom out', ru: 'Отдалить' },
    'rec.zoomReset': { ar: 'إعادة الحجم', en: 'Reset zoom', ru: 'Сбросить масштаб' },
    'rec.noMedia': {
      ar: 'لا توجد وسائط',
      en: 'No media available',
      ru: 'Нет медиа'
    },
    'rec.kind.certificate': { ar: 'شهادة', en: 'Certificate', ru: 'Сертификат' },
    'rec.kind.volunteering': { ar: 'تطوّع', en: 'Volunteering', ru: 'Волонтёрство' },
    'rec.kind.course': { ar: 'دورة', en: 'Course', ru: 'Курс' },
    'rec.kind.activity': { ar: 'نشاط', en: 'Activity', ru: 'Активность' },
    'rec.kind.event': { ar: 'فعالية', en: 'Event', ru: 'Мероприятие' },

    /* The details view. NEUTRAL by design: "topics covered", never
       "what I learned" — a personal takeaway only ever appears when the
       record's own data says so, under its own heading. */
    'rec.d.overview': { ar: 'نظرة عامة', en: 'Overview', ru: 'Обзор' },
    'rec.d.provider': { ar: 'الجهة', en: 'Provider', ru: 'Провайдер' },
    'rec.d.date': { ar: 'التاريخ', en: 'Date', ru: 'Дата' },
    'rec.d.role': { ar: 'الدور', en: 'Role', ru: 'Роль' },
    'rec.d.location': { ar: 'المكان', en: 'Location', ru: 'Место' },
    'rec.d.event': { ar: 'الفعالية', en: 'Event', ru: 'Мероприятие' },
    'rec.d.nomination': { ar: 'الفئة', en: 'Nomination', ru: 'Номинация' },
    'rec.d.languages': { ar: 'اللغات', en: 'Languages', ru: 'Языки' },
    'rec.d.did': { ar: 'ما قمت به', en: 'What I did', ru: 'Что я делал' },
    'rec.d.takeaway': { ar: 'ما استفدته', en: 'What I took away', ru: 'Что я вынес' },
    'rec.d.topics': { ar: 'الموضوعات التي تناولها الدورة', en: 'Topics covered', ru: 'Темы курса' },
    'rec.d.skills': { ar: 'المهارات', en: 'Skills', ru: 'Навыки' },
    'rec.d.chapters': { ar: 'محتويات الدورة', en: 'Course structure', ru: 'Структура курса' },
    'rec.d.resources': { ar: 'الموارد', en: 'Resources', ru: 'Материалы' },
    'rec.d.collaborators': { ar: 'المتعاونون', en: 'Collaborators', ru: 'Соавторы' },
    'rec.d.gallery': { ar: 'الصور', en: 'Gallery', ru: 'Галерея' },
    'rec.viewVolCert': {
      ar: 'شهادة التطوّع',
      en: 'Volunteering certificate',
      ru: 'Сертификат волонтёра'
    },

    /* ---------- story page ---------- */
    'storyPage.eyebrow': { ar: 'السيرة', en: 'Biography', ru: 'Биография' },
    'storyPage.lead': {
      ar: 'خمس محطات: الثانوية العامة، ثم اكتشاف الكرة الطائرة، ثم الإصابة والتغيير، ثم الاهتمام بالبيانات والفلك، ثم العمل نحو الدراسة في روسيا.',
      en: 'Five stations: secondary school, discovering volleyball, the injury and the change, the interest in data and astronomy, and working toward study in Russia.',
      ru: 'Пять этапов: старшая школа, открытие волейбола, травма и перемены, интерес к данным и астрономии, путь к учёбе в России.'
    },
    'storyPage.stationsSr': {
      ar: 'محطات القصة',
      en: 'Story stations',
      ru: 'Этапы истории'
    },
    'storyPage.s1t': { ar: 'الثانوية العامة', en: 'Secondary school', ru: 'Старшая школа' },
    'storyPage.s1d': {
      ar: 'كنتُ في الثانوية العامة قليل الاهتمام بالدراسة، منشغلًا بالألعاب وإضاعة الوقت. حصلتُ على 63%، وكنت أظن أنني سأتعلم تحليل البيانات وأعمل، من دون أن أعرف إلى أين أريد أن أصل. هذه النتيجة لا تعبّر عن قدراتي بقدر ما تعبّر عن مقدار إهمالي للدراسة آنذاك.',
      en: 'In secondary school I paid little attention to my studies and spent my time on games and wasted hours. I scored 63%, thinking I would simply learn data analysis and work, without knowing where I wanted to go. That result reflects my neglect of study at the time more than it reflects my abilities.',
      ru: 'В старшей школе я почти не уделял внимания учёбе, увлекался играми и тратил время впустую. Я получил 63% и думал, что просто выучу анализ данных и пойду работать, не зная, куда хочу прийти. Этот результат говорит скорее о моей тогдашней небрежности в учёбе, чем о моих способностях.'
    },
    'storyPage.s2t': {
      ar: 'اكتشاف الكرة الطائرة',
      en: 'Discovering volleyball',
      ru: 'Открытие волейбола'
    },
    'storyPage.s2d': {
      ar: 'بعد انتهاء الثانوية، مررتُ بفترة نفسية صعبة، ثم شاهدتُ أنمي “هايكيو”، فأحببتُ الكرة الطائرة وبدأتُ ممارستها. استمررتُ فيها ثلاث سنوات، وتطور مستواي كثيرًا، حتى اقتربتُ من التسجيل في فريق رسمي من الدرجة الثالثة، للمرة الأولى في حياتي.',
      en: 'After finishing secondary school I went through a difficult psychological period, then watched the anime “Haikyu!!”, fell in love with volleyball and started playing it. I kept at it for three years, my level improved greatly, and I came close to registering with an official third-division team for the first time in my life.',
      ru: 'После окончания школы у меня был тяжёлый психологический период, затем я посмотрел аниме «Хайкю!!», полюбил волейбол и начал им заниматься. Я играл три года, мой уровень сильно вырос, и я был близок к первому в жизни зачислению в официальную команду третьей лиги.'
    },
    'storyPage.s3t': {
      ar: 'الإصابة والتغيير',
      en: 'The injury and the change',
      ru: 'Травма и перемены'
    },
    'storyPage.s3d': {
      ar: 'خلال مباراة ودية مع فريقي في مركز شباب السلام، تعرّضتُ لإصابة في عيني اليسرى. أدت الإصابة إلى انفصال الشبكية، ثم الإصابة بالمياه البيضاء وضمور العصب البصري، وفقدتُ البصر في تلك العين. بعد ذلك اعتزلتُ الكرة الطائرة، لكنني لم أستسلم.',
      en: 'During a friendly match with my team at the Al-Salam Youth Center, I injured my left eye. The injury led to a detached retina, then cataract and optic nerve atrophy, and I lost the sight in that eye. Afterwards I retired from volleyball, but I did not give up.',
      ru: 'Во время товарищеского матча с моей командой в молодёжном центре «Аль-Салам» я травмировал левый глаз. Травма привела к отслоению сетчатки, затем к катаракте и атрофии зрительного нерва, и я потерял зрение в этом глазу. После этого я ушёл из волейбола, но не сдался.'
    },
    'storyPage.s4t': {
      ar: 'الاهتمام بالبيانات والفلك',
      en: 'The interest in data and astronomy',
      ru: 'Интерес к данным и астрономии'
    },
    'storyPage.s4d': {
      ar: 'لطالما أحببتُ الفلك والكواكب، كما أحب البيانات والبرمجة. لذلك أطمح إلى دراسة مجال يفيدني في الأعمال، ثم التخصص في علوم البيانات، وصولًا إلى العمل في تطبيقها على علم الفلك. وأحلم بالدراسة في روسيا، البلد الذي أحبّه منذ زمن، وبأن أعود يومًا إلى ممارسة الكرة الطائرة ضمن فريق جامعي.',
      en: 'I have always loved astronomy and planets, as well as data and programming. That is why I aspire to study a field useful for business, then specialise in data science, and finally apply it to astronomy. I dream of studying in Russia, a country I have loved for a long time, and of one day returning to volleyball with a university team.',
      ru: 'Я всегда любил астрономию и планеты, а также данные и программирование. Поэтому я хочу изучать направление, полезное для бизнеса, затем специализироваться в науке о данных и в итоге применять её в астрономии. Я мечтаю учиться в России — стране, которую давно люблю, — и однажды вернуться в волейбол в составе университетской команды.'
    },
    'storyPage.s5t': {
      ar: 'العمل نحو الدراسة في روسيا',
      en: 'Working toward study in Russia',
      ru: 'Путь к учёбе в России'
    },
    'storyPage.s5d': {
      ar: 'أعمل الآن على تطوير نفسي، وأدرس وأجمع الشهادات لأثبت قدراتي وأزيد فرص قبولي في جامعة روسية. هدفي، بإذن الله، أن أدرس في روسيا بتفوق، وأن أنجز مشاريع في علم البيانات الفلكي.',
      en: 'I am now working on developing myself, studying and collecting certificates to prove my abilities and improve my chances of admission to a Russian university. My goal, God willing, is to study in Russia with excellence and to complete projects in astronomical data science.',
      ru: 'Сейчас я работаю над собой, учусь и собираю сертификаты, чтобы доказать свои способности и повысить шансы на поступление в российский университет. Моя цель, если Бог даст, — учиться в России с отличием и выполнить проекты в области анализа астрономических данных.'
    },
    'storyPage.endSr': {
      ar: 'خلاصة القصة',
      en: 'Story conclusion',
      ru: 'Вывод истории'
    },
    'storyPage.btnCerts': {
      ar: 'تصفّح شهاداتي',
      en: 'Browse my certificates',
      ru: 'Смотреть мои сертификаты'
    },
    'storyPage.btnPlan': {
      ar: 'الطريق الذي أعمل على بنائه',
      en: 'The path I am building',
      ru: 'Путь, который я строю'
    }
  };

  var LOCALES = { ar: 'ar_AR', en: 'en_US', ru: 'ru_RU' };

  function getLang() {
    try {
      var saved = localStorage.getItem(KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* private mode — fall through */ }
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* old browser */ }
    if (SUPPORTED.indexOf(q) !== -1) return q;
    return DEFAULT;
  }

  function t(key, lang) {
    lang = lang || getLang();
    var entry = STR[key];
    if (!entry) return '';
    return entry[lang] || entry.ar || '';
  }

  /* read a { en, ar, ru } data value in the current language */
  function tVal(v, lang) {
    lang = lang || getLang();
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v.en || v.ar || '';
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
    apply(lang);
    try {
      document.dispatchEvent(new CustomEvent('site-lang-change', { detail: { lang: lang } }));
    } catch (e) {
      /* very old browser — pages re-read the language on next render anyway */
    }
  }

  function apply(lang) {
    lang = lang || getLang();
    var dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    /* static text */
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      var val = t(key, lang);
      if (val) nodes[i].textContent = val;
    }
    var ph = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) {
      var pk = ph[j].getAttribute('data-i18n-ph');
      var pv = t(pk, lang);
      if (pv) ph[j].setAttribute('placeholder', pv);
    }
    var al = document.querySelectorAll('[data-i18n-aria]');
    for (var k = 0; k < al.length; k++) {
      var ak = al[k].getAttribute('data-i18n-aria');
      var av = t(ak, lang);
      if (av) al[k].setAttribute('aria-label', av);
    }

    /* document head — one table, so a new page is one row, not two
       parallel ternaries that can drift apart */
    var page = document.body ? document.body.getAttribute('data-page') : null;
    var META = {
      index: 'meta.index', records: 'meta.records', story: 'meta.story',
      projects: 'meta.projects', project: 'meta.project',
      volleyball: 'meta.volleyball', academic: 'meta.academic',
      portal: 'meta.portal'
    };
    var metaStem = META[page] || META.index;
    var titleKey = metaStem + '.title';
    var descKey = metaStem + '.desc';
    document.title = t(titleKey, lang);
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t(descKey, lang));
    var ogT = document.querySelector('meta[property="og:title"]');
    if (ogT) ogT.setAttribute('content', t(titleKey, lang));
    var ogD = document.querySelector('meta[property="og:description"]');
    if (ogD) ogD.setAttribute('content', t(descKey, lang));
    var ogL = document.querySelector('meta[property="og:locale"]');
    if (ogL) ogL.setAttribute('content', LOCALES[lang] || LOCALES.ar);

    /* switcher state */
    var btns = document.querySelectorAll('.lang-btn');
    for (var b = 0; b < btns.length; b++) {
      var active = btns[b].getAttribute('data-lang') === lang;
      btns[b].setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) btns[b].classList.add('is-active');
      else btns[b].classList.remove('is-active');
    }

    /* nav toggle keeps a dynamic open/close label */
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (toggle && nav) {
      var open = nav.classList.contains('is-open');
      toggle.setAttribute('aria-label', open ? t('nav.close', lang) : t('nav.open', lang));
    }
  }

  function initSwitcher() {
    var bar = document.querySelectorAll('.lang-switch');
    for (var i = 0; i < bar.length; i++) {
      (function (root) {
        root.addEventListener('click', function (e) {
          var btn = e.target.closest ? e.target.closest('[data-lang]') : null;
          if (!btn) return;
          setLang(btn.getAttribute('data-lang'));
        });
      })(bar[i]);
    }
  }

  window.I18N = {
    STR: STR,
    SUPPORTED: SUPPORTED,
    getLang: getLang,
    setLang: setLang,
    apply: apply,
    t: t,
    tVal: tVal,
    initSwitcher: initSwitcher
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply(getLang());
      initSwitcher();
    });
  } else {
    apply(getLang());
    initSwitcher();
  }
})();
