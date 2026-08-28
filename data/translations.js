/* ============================================================
   DATA/TRANSLATIONS.JS
   All translatable text lives here, keyed by language then by a
   dot-free key. js/language.js reads this object and writes the
   matching string into any element with a matching data-i18n
   attribute — see js/language.js for exactly how.

   ------------------------------------------------------------
   SCOPE RIGHT NOW (Phase 12.1):
   Only the strings actually used on index.html (nav, footer, and
   every homepage section) are filled in for all 3 languages.
   Later phases add the keys for About, Certificates, Volunteering,
   Journey, Goals, Projects, Research, Skills and CV as each page
   is migrated — this file just grows, nothing here needs to change
   structurally when that happens.

   ------------------------------------------------------------
   TO ADD A NEW TRANSLATABLE STRING:
   1. Pick a key, e.g. "heroTitle".
   2. Add it under all three languages below.
   3. In the HTML, add data-i18n="heroTitle" to the element.
   4. js/language.js does the rest automatically.
   ------------------------------------------------------------ */

const translations = {
  en: {
    // Navigation
    navHome: 'Home',
    navAbout: 'About',
    navCertificates: 'Certificates',
    navVolunteering: 'Volunteering',
    navJourney: 'Journey',
    navGoals: 'Goals',
    navProjects: 'Projects',
    navResearch: 'Research',
    navSkills: 'Skills',
    navCv: 'CV',

    // Hero
    heroEyebrow: 'Current Journey',
    heroSubtitle: 'Aspiring Data Scientist — with a Vision for Astronomy',
    heroLead: 'Building my path from Economics to Data Science, and, eventually, toward Astroinformatics.',
    heroCtaPrimary: 'Explore My Journey',
    heroCtaSecondary: 'View Certificates',

    // Short Introduction
    aboutEyebrow: 'About',
    aboutHeading: 'A clear starting point, aimed at a defined direction.',
    aboutPara1: "Hussein is a 2022 Egyptian high-school graduate, currently preparing to begin a Bachelor's degree in Economics in Russia. Economics is a deliberate first step, not the destination — it's the foundation he's using to build real strength in programming, mathematics, statistics, and data science before specializing further.",
    aboutPara2: "The long-term direction is Astroinformatics: applying data science to astronomy. It's an ambitious goal, and one he's approaching one deliberate stage at a time, starting from where he actually stands today.",

    // Current Mission
    missionEyebrow: 'Current Mission',
    missionHeading: "What I'm building right now",
    missionLead: 'Before specializing, the priority is a strong, honest foundation across the skills that Data Science and Astroinformatics actually require.',
    missionItem1Title: 'Programming & Python',
    missionItem1Body: 'Building core programming fluency as the base for everything that follows.',
    missionItem2Title: 'Mathematics & Statistics',
    missionItem2Body: 'Strengthening the quantitative foundation data science is built on.',
    missionItem3Title: 'Data Analysis & Data Science',
    missionItem3Body: 'Learning to work with real data — from cleaning it to drawing conclusions from it.',
    missionItem4Title: 'English & Russian',
    missionItem4Body: 'Preparing for academic study in Russia, and for research communicated in English.',
    missionItem5Title: 'IELTS Preparation',
    missionItem5Body: 'Working toward the language certification his academic path requires.',
    missionItem6Title: 'Academic Research Skills',
    missionItem6Body: 'Learning how research actually works, ahead of doing any of his own.',

    // Certificates Preview
    certificatesEyebrow: 'Certificates',
    certificatesHeading: 'Evidence of the work, not the whole story',
    certificatesLead: 'A growing record of completed courses and certifications. The full list — with filtering and search — lives on the Certificates page.',
    viewAllCertificates: 'View All Certificates',

    // Volunteering Preview
    volunteeringEyebrow: 'Volunteer Experience',
    volunteeringHeading: 'Contributing beyond the classroom',
    viewAllVolunteering: 'View All Volunteer Experience',

    // Academic Journey (preview)
    journeyEyebrow: 'Academic Journey',
    journeyHeading: "Where I've been, and where I'm going",
    journeyLead: 'Everything after "now" below is a plan, not a completed step — shown honestly as one.',
    viewFullJourney: 'View Full Academic Journey',

    // Future Vision
    visionEyebrow: 'Beyond the Stars',
    visionHeading: 'My Mission',
    visionPara1: "From Economics, to Data Science, to Astronomy — that's the direction, not a claim of having arrived.",
    visionPara2: "The long-term ambition is real: contributing to serious research in Astroinformatics, and one day working alongside international scientific institutions — with NASA as a distant, honest reach rather than a promise. It's approached one deliberate stage at a time, starting from exactly where things stand today.",
    readFullVision: 'Read the Full Vision',

    // Final CTA
    finalCtaEyebrow: 'Get In Touch',
    finalCtaHeading: 'Follow the journey from here',
    finalCtaLead: 'Certificates, volunteer experience, and the academic path ahead — all in one place, growing as the journey does.',
    finalCtaContact: 'Contact Me',

    // Footer
    footerMission: 'Building a path from Economics to Data Science, and eventually toward Astroinformatics.',
  },

  ar: {
    // Navigation
    navHome: 'الرئيسية',
    navAbout: 'نبذة عني',
    navCertificates: 'الشهادات',
    navVolunteering: 'التطوع',
    navJourney: 'المسار الأكاديمي',
    navGoals: 'الأهداف',
    navProjects: 'المشاريع',
    navResearch: 'الأبحاث',
    navSkills: 'المهارات',
    navCv: 'السيرة الذاتية',

    // Hero
    heroEyebrow: 'المسار الحالي',
    heroSubtitle: 'طموح ليكون عالِم بيانات — برؤية نحو الفلك',
    heroLead: 'أبني مساري من الاقتصاد إلى علم البيانات، وصولًا — يومًا ما — إلى علم البيانات الفلكية.',
    heroCtaPrimary: 'اكتشف مساري',
    heroCtaSecondary: 'اطّلع على الشهادات',

    // Short Introduction
    aboutEyebrow: 'نبذة عني',
    aboutHeading: 'نقطة بداية واضحة، باتجاه محدد.',
    aboutPara1: 'حسين خريج ثانوية عامة مصرية عام 2022، ويستعد حاليًا لبدء دراسة بكالوريوس الاقتصاد في روسيا. الاقتصاد خطوة أولى مقصودة، وليس الوجهة النهائية — إنه الأساس الذي يستخدمه لبناء قوة حقيقية في البرمجة والرياضيات والإحصاء وعلم البيانات قبل التخصص أكثر.',
    aboutPara2: 'الاتجاه بعيد المدى هو علم البيانات الفلكية: تطبيق علم البيانات على الفلك. هدف طموح، يقترب منه على مراحل مدروسة، بدءًا من حيث يقف فعليًا اليوم.',

    // Current Mission
    missionEyebrow: 'المهمة الحالية',
    missionHeading: 'ما أبنيه الآن',
    missionLead: 'قبل التخصص، الأولوية هي أساس قوي وصادق في المهارات التي يتطلبها علم البيانات وعلم الفلك البياناتي فعليًا.',
    missionItem1Title: 'البرمجة وPython',
    missionItem1Body: 'بناء طلاقة برمجية أساسية كقاعدة لكل ما سيأتي بعدها.',
    missionItem2Title: 'الرياضيات والإحصاء',
    missionItem2Body: 'تقوية الأساس الكمي الذي يُبنى عليه علم البيانات.',
    missionItem3Title: 'تحليل البيانات وعلم البيانات',
    missionItem3Body: 'تعلّم التعامل مع بيانات حقيقية — من تنظيفها إلى استخلاص النتائج منها.',
    missionItem4Title: 'الإنجليزية والروسية',
    missionItem4Body: 'الاستعداد للدراسة الأكاديمية في روسيا، وللأبحاث المكتوبة بالإنجليزية.',
    missionItem5Title: 'التحضير لاختبار IELTS',
    missionItem5Body: 'العمل نحو شهادة اللغة التي يتطلبها مساره الأكاديمي.',
    missionItem6Title: 'مهارات البحث الأكاديمي',
    missionItem6Body: 'تعلّم كيف يعمل البحث العلمي فعليًا، قبل القيام بأي بحث خاص به.',

    // Certificates Preview
    certificatesEyebrow: 'الشهادات',
    certificatesHeading: 'دليل على العمل، وليس القصة كاملة',
    certificatesLead: 'سجل متنامٍ من الدورات والشهادات المكتملة. القائمة الكاملة — مع الفلترة والبحث — موجودة في صفحة الشهادات.',
    viewAllCertificates: 'عرض كل الشهادات',

    // Volunteering Preview
    volunteeringEyebrow: 'تجربة التطوع',
    volunteeringHeading: 'المساهمة خارج نطاق الدراسة',
    viewAllVolunteering: 'عرض كل تجارب التطوع',

    // Academic Journey (preview)
    journeyEyebrow: 'المسار الأكاديمي',
    journeyHeading: 'أين كنت، وإلى أين أتجه',
    journeyLead: 'كل ما بعد "الآن" أدناه هو خطة، وليس خطوة مكتملة — مُعروضة بصدق على هذا الأساس.',
    viewFullJourney: 'عرض المسار الأكاديمي الكامل',

    // Future Vision
    visionEyebrow: 'ما وراء النجوم',
    visionHeading: 'مهمّتي',
    visionPara1: 'من الاقتصاد، إلى علم البيانات، إلى الفلك — هذا هو الاتجاه، وليس ادّعاء بأنني وصلت إليه.',
    visionPara2: 'الطموح بعيد المدى حقيقي: المساهمة في أبحاث جادة في علم البيانات الفلكية، والعمل يومًا ما مع مؤسسات علمية دولية — مع اعتبار NASA هدفًا بعيدًا وصادقًا وليس وعدًا. يُقترب منه على مراحل مدروسة، بدءًا من حيث تقف الأمور بالضبط اليوم.',
    readFullVision: 'اقرأ الرؤية الكاملة',

    // Final CTA
    finalCtaEyebrow: 'تواصل معي',
    finalCtaHeading: 'تابع المسار من هنا',
    finalCtaLead: 'الشهادات، تجربة التطوع، والمسار الأكاديمي القادم — كلها في مكان واحد، تنمو مع نمو المسار.',
    finalCtaContact: 'تواصل معي',

    // Footer
    footerMission: 'أبني مسارًا من الاقتصاد إلى علم البيانات، وصولًا — يومًا ما — إلى علم البيانات الفلكية.',
  },

  ru: {
    // Navigation
    navHome: 'Главная',
    navAbout: 'Обо мне',
    navCertificates: 'Сертификаты',
    navVolunteering: 'Волонтёрство',
    navJourney: 'Путь',
    navGoals: 'Цели',
    navProjects: 'Проекты',
    navResearch: 'Исследования',
    navSkills: 'Навыки',
    navCv: 'Резюме',

    // Hero
    heroEyebrow: 'Текущий путь',
    heroSubtitle: 'Будущий специалист по данным — со взглядом на астрономию',
    heroLead: 'Строю свой путь от экономики к науке о данных и, в перспективе, к астроинформатике.',
    heroCtaPrimary: 'Мой путь',
    heroCtaSecondary: 'Сертификаты',

    // Short Introduction
    aboutEyebrow: 'Обо мне',
    aboutHeading: 'Чёткая отправная точка, направленная к ясной цели.',
    aboutPara1: 'Хусейн — выпускник египетской школы 2022 года, готовится начать обучение по специальности "Экономика" в России. Экономика — осознанный первый шаг, а не конечная цель: это основа для развития реальных навыков в программировании, математике, статистике и науке о данных перед дальнейшей специализацией.',
    aboutPara2: 'Долгосрочное направление — астроинформатика: применение науки о данных в астрономии. Амбициозная цель, к которой он подходит поэтапно, начиная с того, где он находится сегодня.',

    // Current Mission
    missionEyebrow: 'Текущая задача',
    missionHeading: 'Над чем я работаю сейчас',
    missionLead: 'Перед специализацией приоритет — прочная, честная основа в навыках, которые реально требуются в науке о данных и астроинформатике.',
    missionItem1Title: 'Программирование и Python',
    missionItem1Body: 'Формирование базовой уверенности в программировании как основы для всего последующего.',
    missionItem2Title: 'Математика и статистика',
    missionItem2Body: 'Укрепление количественной базы, на которой строится наука о данных.',
    missionItem3Title: 'Анализ данных и Data Science',
    missionItem3Body: 'Обучение работе с реальными данными — от очистки до выводов.',
    missionItem4Title: 'Английский и русский языки',
    missionItem4Body: 'Подготовка к обучению в России и к исследованиям на английском языке.',
    missionItem5Title: 'Подготовка к IELTS',
    missionItem5Body: 'Работа над языковым сертификатом, необходимым для учёбы.',
    missionItem6Title: 'Навыки академических исследований',
    missionItem6Body: 'Изучение того, как устроены исследования, прежде чем проводить собственные.',

    // Certificates Preview
    certificatesEyebrow: 'Сертификаты',
    certificatesHeading: 'Свидетельство работы, а не вся история',
    certificatesLead: 'Растущий список пройденных курсов и сертификатов. Полный список — с фильтрами и поиском — на странице сертификатов.',
    viewAllCertificates: 'Все сертификаты',

    // Volunteering Preview
    volunteeringEyebrow: 'Волонтёрский опыт',
    volunteeringHeading: 'Вклад за пределами учёбы',
    viewAllVolunteering: 'Весь волонтёрский опыт',

    // Academic Journey (preview)
    journeyEyebrow: 'Академический путь',
    journeyHeading: 'Где я был и куда иду',
    journeyLead: 'Всё после "сейчас" ниже — это план, а не завершённый шаг, честно представленный именно так.',
    viewFullJourney: 'Полный академический путь',

    // Future Vision
    visionEyebrow: 'За звёздами',
    visionHeading: 'Моя миссия',
    visionPara1: 'От экономики — к науке о данных — к астрономии. Это направление, а не заявление о том, что цель уже достигнута.',
    visionPara2: 'Долгосрочная амбиция реальна: внести вклад в серьёзные исследования в области астроинформатики и однажды работать вместе с международными научными организациями — рассматривая NASA как далёкую, честно обозначенную цель, а не обещание. Путь к ней — поэтапный, начиная ровно с того места, где всё находится сегодня.',
    readFullVision: 'Читать полностью',

    // Final CTA
    finalCtaEyebrow: 'Связаться',
    finalCtaHeading: 'Следите за моим путём',
    finalCtaLead: 'Сертификаты, волонтёрский опыт и предстоящий академический путь — всё в одном месте, растёт вместе с этим путём.',
    finalCtaContact: 'Связаться со мной',

    // Footer
    footerMission: 'Строю путь от экономики к науке о данных и, в перспективе, к астроинформатике.',
  },
};
