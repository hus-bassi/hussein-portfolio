/* ============================================================
   The 20 Cinematic Animation Styles & Visual Studio Engine
   assets/js/cinematic.js

   Orchestrates the 20 signature animation styles across Hussein's website:
   Trilingual (Arabic RTL, English LTR, Russian LTR)
   Supports full accessibility and reduced motion.
   ============================================================ */
(function () {
  'use strict';

  function lang() {
    return (window.I18N && window.I18N.getLang()) || 'ar';
  }
  function t(key) {
    return (window.I18N && window.I18N.t(key, lang())) || '';
  }
  function tv(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    var l = lang();
    return v[l] || v.en || v.ar || '';
  }

  var STYLES_DATA = [
    {
      num: '01',
      code: 'particles',
      cat: 'space',
      name: {
        ar: 'الجسيمات النجمية',
        en: 'Cosmic Particles',
        ru: 'Космические частицы'
      },
      desc: {
        ar: 'محاكاة ديناميكية لغبار النجوم الكوني المتلألئ مع استجابة ناعمة لحركة المؤشر وعمق سديمي.',
        en: 'Dynamic celestial stardust and interactive stellar particle field reacting smoothly to pointer movement.',
        ru: 'Динамическое звездное поле с интерактивными частицами, плавно реагирующими на курсор.'
      },
      loc: {
        ar: 'سماء البوابة والصفحة الرئيسية',
        en: 'Gateway & Academic Sky',
        ru: 'Небо портала и главной страницы'
      },
      target: '#home, .gateway, #vw-arena'
    },
    {
      num: '02',
      code: 'liquid-morph',
      cat: 'space',
      name: {
        ar: 'التشكل السائل',
        en: 'Liquid Morph',
        ru: 'Жидкий морфинг'
      },
      desc: {
        ar: 'سديم كوني عضوي متحول وسلس يتنفس في دورات بطيئة تشبه الموائع النجمية في الفضاء.',
        en: 'Fluid, organic morphing celestial orb with continuous shifting boundary cycles.',
        ru: 'Плавный органический морфинг космической туманности с непрерывным перетеканием форм.'
      },
      loc: {
        ar: 'نواة بوابة العوالم',
        en: 'Central Gateway Core',
        ru: 'Ядро портала миров'
      },
      target: '.portal, .door-world'
    },
    {
      num: '03',
      code: 'holographic',
      cat: 'space',
      name: {
        ar: 'البريق الهولوغرافي',
        en: 'Holographic Shimmer',
        ru: 'Голографический перелив'
      },
      desc: {
        ar: 'انعكاس قزحي طيفي يتحرك فوق بطاقات الشهادات وأوسمة التميز ببريق لوني متألق.',
        en: 'Prismatic iridescent chromatic sheen with shifting spectrum highlights on credentials.',
        ru: 'Радужный призматический перелив с динамическими цветовыми бликами на карточках.'
      },
      loc: {
        ar: 'بطاقات الشهادات والأوسمة',
        en: 'Certificates & Milestone Cards',
        ru: 'Сертификаты и карточки достижений'
      },
      target: '#learning, #certificates'
    },
    {
      num: '04',
      code: 'neon-glow',
      cat: 'athletics',
      name: {
        ar: 'التوهج النيوني',
        en: 'Neon Glow',
        ru: 'Неоновое свечение'
      },
      desc: {
        ar: 'هالة نيونية نابضة بجهد كهربائي عالي على خطوط الملعب الرياضية وأزرار التفاعل الرئيسية.',
        en: 'Vibrant multi-layered electric glow pulsing on court boundaries and primary actions.',
        ru: 'Многослойное неоновое свечение линий волейбольной площадки и ключевых кнопок.'
      },
      loc: {
        ar: 'أزرار الإجراءات وخطوط الملعب',
        en: 'Court Lines & Action CTAs',
        ru: 'Линии площадки и кнопки действий'
      },
      target: '#vw-arena, .btn-primary'
    },
    {
      num: '05',
      code: 'wireframe-3d',
      cat: 'space',
      name: {
        ar: 'الشبكة الفراغية ثلاثية الأبعاد',
        en: 'Wireframe 3D',
        ru: '3D Каркасная сфера'
      },
      desc: {
        ar: 'مجسم فراغي ثلاثي الأبعاد يدور بحلقات مدارية تمثل إحداثيات الأجرام السماوية وحركة البيانات.',
        en: 'Rotating 3D celestial wireframe sphere with orbital coordinate rings in space.',
        ru: 'Вращающаяся трехмерная каркасная сфера с координатными кольцами планетных орбит.'
      },
      loc: {
        ar: 'قسم الفلك والبيانات',
        en: 'Astronomy & Data Section',
        ru: 'Раздел астрономии и данных'
      },
      target: '#why, #interests'
    },
    {
      num: '06',
      code: 'glassmorphism',
      cat: 'architecture',
      name: {
        ar: 'الزجاج المصقول المعتم',
        en: 'Glassmorphism',
        ru: 'Стекломорфизм'
      },
      desc: {
        ar: 'أسطح زجاجية بلورية معتمة مع تمويه عميق وحواف انعكاسية مضيئة تحاكي ألواح المراقبة الفضائية.',
        en: 'Translucent frosted glass with deep backdrop blur and specular rim lighting.',
        ru: 'Матовое полупрозрачное стекло с глубоким размытием фона и световыми гранями.'
      },
      loc: {
        ar: 'شريط التنقل وقوائم المعلومات',
        en: 'Header Navigation & Panels',
        ru: 'Шапка сайта и информационные панели'
      },
      target: '#site-header, .card'
    },
    {
      num: '07',
      code: 'kinetic-type',
      cat: 'architecture',
      name: {
        ar: 'الطباعة الحركية',
        en: 'Kinetic Typography',
        ru: 'Кинетическая типографика'
      },
      desc: {
        ar: 'نصوص تفاعلية حية تتغير مسافاتها وانعكاساتها بمرونة استجابةً للحركة وتدفق القراءة.',
        en: 'Expressive variable typography with responsive letter tracking and kinetic speed marquee.',
        ru: 'Живая выразительная типографика с адаптивным трекингом и бегущей строкой.'
      },
      loc: {
        ar: 'العناوين وشريط الكلمات المتحرك',
        en: 'Hero Headings & Ticker Marquee',
        ru: 'Заголовки и бегущая строка'
      },
      target: '#marquee, .hero-name, #vw-name'
    },
    {
      num: '08',
      code: 'isometric',
      cat: 'architecture',
      name: {
        ar: 'المنظور الآيزومتري',
        en: 'Isometric Projection',
        ru: 'Изометрическая проекция'
      },
      desc: {
        ar: 'إسقاط معماري بزاوية هندسية شبه ثلاثية الأبعاد يمنح خطة المراحل الخمس والتكتيك الرياضي عمقاً مجسماً.',
        en: '2.5D spatial architectural projection elevating the 5-Stage Plan and court tactics.',
        ru: 'Изометрическая 2.5D проекция, придающая архитектурную глубину плану и тактике.'
      },
      loc: {
        ar: 'خطة المراحل والتكتيك',
        en: '5-Stage Plan & Court Tactics',
        ru: 'План из 5 этапов и тактика'
      },
      target: '#plan, #vw-tactics'
    },
    {
      num: '09',
      code: 'clay-3d',
      cat: 'architecture',
      name: {
        ar: 'التجسيم اللمسي الطيني',
        en: 'Clay 3D',
        ru: 'Тактильный клейморфизм'
      },
      desc: {
        ar: 'بروز حجمي ملموس بظلال داخلية وإضاءة علوية ناعمة تعطي الأزرار وزناً فيزيائياً فاخراً.',
        en: 'Smooth extruded tactile volume with soft inner highlights and physical depth.',
        ru: 'Объемные тактильные кнопки с мягкими внутренними тенями и физической глубиной.'
      },
      loc: {
        ar: 'أزرار التبديل وأقراص اللغات',
        en: 'World Switches & Controls',
        ru: 'Переключатели миров и языков'
      },
      target: '.lang-switch, .world-switch'
    },
    {
      num: '10',
      code: 'ascii-art',
      cat: 'space',
      name: {
        ar: 'فن الآسكي النصي',
        en: 'ASCII Astronomy Terminal',
        ru: 'ASCII Астро-терминал'
      },
      desc: {
        ar: 'واجهة طرفية برمجية ترسم كوكبة فلكية وشعاراً هندسياً بنصوص الحواسيب الكلاسيكية.',
        en: 'Retro terminal console rendering celestial constellations and code emblems in ASCII.',
        ru: 'Терминальная консоль, отображающая созвездия и астрономические символы в ASCII.'
      },
      loc: {
        ar: 'منطقة البرمجة والبيانات',
        en: 'Programming & Data Hub',
        ru: 'Блок программирования и данных'
      },
      target: '#about, #why'
    },
    {
      num: '11',
      code: 'gradient-mesh',
      cat: 'space',
      name: {
        ar: 'الشبكة اللونية السديمية',
        en: 'Gradient Mesh Nebula',
        ru: 'Градиентная сетка туманности'
      },
      desc: {
        ar: 'تدرج لوني متعدد المراكز ينساب ببطء كالشفق القطبي بين البنفسجي، والأزرق السماوي، والذهب.',
        en: 'Multi-point cosmic aurora gradient mesh shifting organically across the dark atmosphere.',
        ru: 'Многоточечная градиентная сетка, плавно колышущаяся подобно космическому сиянию.'
      },
      loc: {
        ar: 'الخلفية الجوية العامة',
        en: 'Global Atmosphere Background',
        ru: 'Глобальный атмосферный фон'
      },
      target: 'body, .hero'
    },
    {
      num: '12',
      code: 'comic-action',
      cat: 'athletics',
      name: {
        ar: 'خطوط الحركة الحماسية',
        en: 'Action Impact Lines',
        ru: 'Линии динамического удара'
      },
      desc: {
        ar: 'أشعة حركية متفجرة مستوحاة من أنمي الكرة الطائرة تخلد لحظة الفوز 3–0 وضربات حائط الصد.',
        en: 'Radial action speed rays framing the 3–0 clean sheet victory and match-point spikes.',
        ru: 'Радиальные динамические лучи в стиле спортивного аниме в честь победы 3–0.'
      },
      loc: {
        ar: 'لوحة الفوز 3–0 بالكرة الطائرة',
        en: 'Volleyball 3–0 Scoreboard',
        ru: 'Табло победы 3–0 в волейболе'
      },
      target: '#vw-scoreboard, #vw-tournaments'
    },
    {
      num: '13',
      code: 'split-flap',
      cat: 'athletics',
      name: {
        ar: 'اللوحات الميكانيكية القلابة',
        en: 'Split-Flap Display',
        ru: 'Перекидное механическое табло'
      },
      desc: {
        ar: 'محاكاة ميكانيكية دقيقة للوحات الملاعب والمطارات الدوارة لتقليب الأرقام والنتائج الرسمية.',
        en: 'Mechanical airport and stadium split-flap board flipping scores and statistics.',
        ru: 'Механическое перекидное табло стадионного типа для отображения счета и статистики.'
      },
      loc: {
        ar: 'عدادات النتائج والشهادات',
        en: 'Score Counters & Stat Boards',
        ru: 'Счетчики матчей и сертификатов'
      },
      target: '#vw-scoreboard, #stat-row'
    },
    {
      num: '14',
      code: 'retro-vhs',
      cat: 'athletics',
      name: {
        ar: 'شريط الفيديو الكلاسيكي',
        en: 'Retro VHS Camcorder',
        ru: 'Ретро VHS видеокассета'
      },
      desc: {
        ar: 'خطوط مسح تلفزيونية كلاسيكية مع ختم التسجيل التاريخي لتوثيق مباريات 2023 والأنشطة.',
        en: 'Analog CRT scanlines, tracking jitter, and REC timestamp overlay on archival footage.',
        ru: 'Аналоговые строки развертки и индикатор записи REC на архивных видеозаписях.'
      },
      loc: {
        ar: 'أرشيف المقاطع والمباريات',
        en: 'Tournament Videos & Memories',
        ru: 'Архив турниров и видеозаписей'
      },
      target: '#volunteering, #vw-tournaments'
    },
    {
      num: '15',
      code: 'halftone',
      cat: 'architecture',
      name: {
        ar: 'التنقيط الشبكي الطباعي',
        en: 'Halftone Screen Pattern',
        ru: 'Полутоновый растровый паттерн'
      },
      desc: {
        ar: 'شبكة نقطية دقيقة تمنح خلفيات الأرقام التوثيقية والرموز طابعاً طباعياً وهندسياً أنيقاً.',
        en: 'Precision dot-matrix halftone texture layered beneath section numerals and emblems.',
        ru: 'Точечный полутоновый растр, создающий эффект полиграфической и инженерной печати.'
      },
      loc: {
        ar: 'أرقام الأقسام والعلامات الخلفية',
        en: 'Section Numerals & Watermarks',
        ru: 'Номера разделов и фоновые знаки'
      },
      target: '.sec-index, .band'
    },
    {
      num: '16',
      code: 'bauhaus',
      cat: 'architecture',
      name: {
        ar: 'التكوين الهندسي الباوهاوسي',
        en: 'Bauhaus Constructivism',
        ru: 'Конструктивизм Баухаус'
      },
      desc: {
        ar: 'تكوين حركي مبني على الأشكال الأولية: الدائرة، والمربع، والمثلث باتزان بصري رصين.',
        en: 'Minimalist geometric balance uniting the primary circle, square, and triangle.',
        ru: 'Минималистичный баланс первичных геометрических фигур: круга, квадрата и треугольника.'
      },
      loc: {
        ar: 'فواصل الأقسام والأيقونات الهندسية',
        en: 'Section Accents & Geometry',
        ru: 'Разделители разделов и акценты'
      },
      target: '#interests, .sec-head'
    },
    {
      num: '17',
      code: 'pixel-art',
      cat: 'athletics',
      name: {
        ar: 'فن البكسل الرياضي',
        en: '8-Bit Pixel Sports',
        ru: '8-битный пиксель-арт'
      },
      desc: {
        ar: 'كرة طائرة وكأس بطولة مصممان بنمط البكسل الكلاسيكي 8 بت بأسلوب ألعاب الأركيد المحبوبة.',
        en: 'Retro 8-bit arcade volleyball and trophy sprite animated with stepped frames.',
        ru: 'Пиксельный 8-битный волейбольный мяч и кубок в стиле классических аркадных игр.'
      },
      loc: {
        ar: 'شارات إنجازات اللاعب',
        en: 'Athlete Achievements & Badge',
        ru: 'Бейджи и спортивные достижения'
      },
      target: '#vw-profile, .vw-fact'
    },
    {
      num: '18',
      code: 'blueprint',
      cat: 'space',
      name: {
        ar: 'المخطط الهندسي المعماري',
        en: 'Technical Blueprint',
        ru: 'Инженерный чертеж'
      },
      desc: {
        ar: 'شبكة هندسية بلون سيان تقني تتضمن محاور قياس وإحداثيات توضح المسار من الإدارة إلى الفلك.',
        en: 'Architectural drafting grid with cyan coordinates mapping the academic trajectory.',
        ru: 'Инженерная координатная сетка, визуализирующая академическую траекторию.'
      },
      loc: {
        ar: 'مخطط المسار الأكاديمي',
        en: 'Academic Roadmap Grid',
        ru: 'Сетка академического плана'
      },
      target: '#plan, .stages'
    },
    {
      num: '19',
      code: 'art-deco',
      cat: 'architecture',
      name: {
        ar: 'الزخرفة الذهبية الفاخرة',
        en: 'Art Deco Luxury Geometry',
        ru: 'Геометрия Ар-деко'
      },
      desc: {
        ar: 'إطارات هندسية متدرجة بخطوط ذهبية ملكية تؤطر الشهادات الرسمية والإنجازات المعتمدة.',
        en: 'Stepped symmetrical golden borders and luxury chevron brackets framing milestones.',
        ru: 'Ступенчатые золотые рамки и шевроны, обрамляющие официальные достижения.'
      },
      loc: {
        ar: 'إطارات الشهادات والأوسمة',
        en: 'Certificate Frames & Awards',
        ru: 'Рамки сертификатов и наград'
      },
      target: '#learning, #vw-tournaments'
    },
    {
      num: '20',
      code: 'neo-brutalism',
      cat: 'architecture',
      name: {
        ar: 'البروز المعماري الجريء',
        en: 'Neo-Brutalism',
        ru: 'Необратулизм'
      },
      desc: {
        ar: 'كتل معلوماتية عالية التباين بحدود معمارية صلبة وظلال حادة تسلط الضوء على المهارات المثبتة.',
        en: 'High-contrast architectural tags with bold solid offset drop-shadows and thick borders.',
        ru: 'Контрастные архитектурные блоки с четкими тенями и выразительными гранями.'
      },
      loc: {
        ar: 'أوسمة المهارات والوسوم التفاعلية',
        en: 'Skill Pills & Record Tags',
        ru: 'Теги навыков и фильтры записей'
      },
      target: '.tagbar, #records'
    }
  ];

  /* ---------- DOM Helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Floating Action Button (FAB) ---------- */
  function mountFAB() {
    if (document.getElementById('cinema-fab')) return;
    var btn = el('button', 'cinema-fab', '');
    btn.id = 'cinema-fab';
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', tv({
      ar: 'استوديو الأنماط البصرية الـ 20',
      en: '20 Visual Styles Studio',
      ru: 'Студия 20 визуальных стилей'
    }));

    var sparkIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    btn.innerHTML = sparkIcon +
      '<span class="cinema-fab-text">' + tv({
        ar: 'الأنماط البصرية',
        en: 'Visual Styles',
        ru: 'Стили анимации'
      }) + '</span>' +
      '<span class="cinema-fab-badge">20</span>';

    btn.addEventListener('click', openCinemaStudio);
    document.body.appendChild(btn);
  }

  /* ---------- Dialog / Studio Modal ---------- */
  var cinemaDialog = null;
  var activeCategory = 'all';

  function buildCinemaStudio() {
    if (cinemaDialog) return cinemaDialog;

    cinemaDialog = el('dialog', 'cinema-dialog');
    cinemaDialog.id = 'cinema-dialog';

    var panel = el('div', 'cinema-panel');

    // Header
    var head = el('header', 'cinema-head');
    var titleWrap = el('div', 'cinema-title-wrap');
    var title = el('h2', 'cinema-title',
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '<span>' + tv({
        ar: 'استوديو الأنماط البصرية الـ 20',
        en: 'The 20 Cinematic Animation Styles',
        ru: 'Студия 20 кинематографических стилей'
      }) + '</span>'
    );
    var subtitle = el('p', 'cinema-subtitle', tv({
      ar: 'تقنيات تحريك سينمائية احترافية مدمجة بتناغم كامل داخل عوالم الموقع.',
      en: '20 high-fidelity visual motion styles orchestrated seamlessly across the website.',
      ru: '20 высококлассных стилей визуальной анимации, встроенных в миры сайта.'
    }));
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    var closeBtn = el('button', 'cinema-close',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
    );
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', tv({ ar: 'إغلاق', en: 'Close', ru: 'Закрыть' }));
    closeBtn.addEventListener('click', function () { cinemaDialog.close(); });

    head.appendChild(titleWrap);
    head.appendChild(closeBtn);
    panel.appendChild(head);

    // Filter Bar
    var filters = el('div', 'cinema-filters');
    var cats = [
      { id: 'all', label: { ar: 'الكل (20)', en: 'All (20)', ru: 'Все (20)' } },
      { id: 'space', label: { ar: 'الفضاء والبيانات', en: 'Space & Data', ru: 'Космос и данные' } },
      { id: 'athletics', label: { ar: 'الكرة الطائرة والرياضة', en: 'Volleyball & Athletics', ru: 'Волейбол и спорт' } },
      { id: 'architecture', label: { ar: 'التصميم المعماري', en: 'UI & Architecture', ru: 'Архитектурный дизайн' } }
    ];

    cats.forEach(function (cat) {
      var fb = el('button', 'cinema-filter-btn' + (cat.id === activeCategory ? ' is-active' : ''), tv(cat.label));
      fb.type = 'button';
      fb.dataset.cat = cat.id;
      fb.addEventListener('click', function () {
        activeCategory = cat.id;
        filters.querySelectorAll('.cinema-filter-btn').forEach(function (b) {
          b.classList.toggle('is-active', b.dataset.cat === activeCategory);
        });
        renderGrid();
      });
      filters.appendChild(fb);
    });
    panel.appendChild(filters);

    // Body Grid
    var body = el('div', 'cinema-body');
    var grid = el('ul', 'cinema-grid');
    body.appendChild(grid);
    panel.appendChild(body);

    cinemaDialog.appendChild(panel);
    document.body.appendChild(cinemaDialog);

    cinemaDialog.addEventListener('click', function (e) {
      if (e.target === cinemaDialog) cinemaDialog.close();
    });

    return cinemaDialog;
  }

  function renderMiniPreview(code, container) {
    container.innerHTML = '';
    switch (code) {
      case 'particles':
        var pbox = el('div', 'style-particles', '<div class="particle-spark"></div><div class="particle-spark"></div><div class="particle-spark"></div>');
        pbox.style.width = '100%';
        pbox.style.height = '70px';
        container.appendChild(pbox);
        break;
      case 'liquid-morph':
        var lorb = el('div', 'liquid-morph-orb');
        lorb.style.width = '64px';
        lorb.style.height = '64px';
        container.appendChild(lorb);
        break;
      case 'holographic':
        var hcard = el('div', 'style-holographic', '<span style="font-size:0.8rem; font-weight:700; color:#fff;">HOLO SHIMMER</span>');
        hcard.style.padding = '12px 20px';
        hcard.style.borderRadius = '8px';
        container.appendChild(hcard);
        break;
      case 'neon-glow':
        var nbtn = el('div', 'style-neon-glow', '<span style="font-size:0.8rem; font-weight:700; color:var(--azure);">NEON VOLT</span>');
        nbtn.style.padding = '8px 16px';
        nbtn.style.borderRadius = '9999px';
        container.appendChild(nbtn);
        break;
      case 'wireframe-3d':
        var wcage = el('div', 'wireframe-cage', '<div class="wireframe-ring"></div><div class="wireframe-ring"></div><div class="wireframe-ring"></div><div class="wireframe-ring"></div>');
        wcage.style.width = '56px';
        wcage.style.height = '56px';
        container.appendChild(wcage);
        break;
      case 'glassmorphism':
        var gcard = el('div', 'style-glassmorphism', '<span style="font-size:0.75rem; color:var(--fg-2);">Frosted Blur 16px</span>');
        gcard.style.padding = '10px 18px';
        gcard.style.borderRadius = '8px';
        container.appendChild(gcard);
        break;
      case 'kinetic-type':
        var ktext = el('div', 'style-kinetic-type kinetic-badge', '<span>KINETIC MOTION</span> <span style="color:var(--gold)">»</span>');
        container.appendChild(ktext);
        break;
      case 'isometric':
        var isobox = el('div', 'style-isometric iso-pedestal', '<div style="padding:10px 16px; background:#182036; color:var(--azure); font-size:0.75rem; font-weight:700;">2.5D GRID</div>');
        container.appendChild(isobox);
        break;
      case 'clay-3d':
        var cbtn = el('div', 'style-clay-3d', '<span style="font-size:0.78rem; font-weight:600; color:var(--fg-2); padding:6px 14px; display:inline-block;">Tactile Pill</span>');
        container.appendChild(cbtn);
        break;
      case 'ascii-art':
        var aterm = el('div', 'style-ascii-art', '  /\\  * .  +\n /__\\ ASTRONOMY\n/    \\ DATA SCI<span class="ascii-cursor"></span>');
        container.appendChild(aterm);
        break;
      case 'gradient-mesh':
        var gmesh = el('div', 'style-gradient-mesh', '<span style="font-size:0.72rem; color:var(--gold); font-weight:700;">NEBULA MESH</span>');
        gmesh.style.width = '100%';
        gmesh.style.height = '64px';
        gmesh.style.display = 'flex';
        gmesh.style.alignItems = 'center';
        gmesh.style.justifyContent = 'center';
        gmesh.style.borderRadius = '6px';
        container.appendChild(gmesh);
        break;
      case 'comic-action':
        var caction = el('div', 'style-comic-action', '<div class="comic-rays"></div><span style="position:relative; z-index:2; font-weight:900; color:var(--ember); font-size:0.9rem;">MATCH POINT 3–0!</span>');
        caction.style.padding = '12px 20px';
        caction.style.borderRadius = '6px';
        caction.style.background = '#1a0e08';
        container.appendChild(caction);
        break;
      case 'split-flap':
        var sflap = el('div', 'style-split-flap', '<div class="split-flap-digit">0</div><div class="split-flap-digit">3</div><span style="color:var(--fg-3); font-weight:700; align-self:center;">:</span><div class="split-flap-digit">0</div><div class="split-flap-digit">0</div>');
        container.appendChild(sflap);
        break;
      case 'retro-vhs':
        var vhs = el('div', 'style-retro-vhs', '<div class="vhs-scanlines"></div><div class="vhs-rec-badge"><span class="vhs-rec-dot"></span>REC</div><div style="font-size:0.72rem; color:#fff; font-family:monospace; padding:14px 18px; background:#111;">OCT.19.2023 // SPK</div>');
        vhs.style.borderRadius = '4px';
        container.appendChild(vhs);
        break;
      case 'halftone':
        var hscreen = el('div', 'style-halftone', '<div class="halftone-screen"></div><span style="position:relative; z-index:2; font-size:0.8rem; font-weight:700; color:var(--gold);">DOT MATRIX 10px</span>');
        hscreen.style.padding = '12px 20px';
        hscreen.style.background = '#0d101a';
        hscreen.style.borderRadius = '6px';
        container.appendChild(hscreen);
        break;
      case 'bauhaus':
        var bhaus = el('div', 'style-bauhaus', '<div class="bauhaus-circle"></div><div class="bauhaus-square"></div><div class="bauhaus-triangle"></div><span style="font-size:0.75rem; font-weight:700; color:var(--fg);">FORM</span>');
        container.appendChild(bhaus);
        break;
      case 'pixel-art':
        var part = el('div', 'style-pixel-art', '<div class="pixel-volleyball"></div>');
        container.appendChild(part);
        break;
      case 'blueprint':
        var bprint = el('div', 'style-blueprint', '<div style="padding:10px 16px; font-size:0.72rem; color:var(--azure); font-family:monospace;">GRID SPEC: DS-2026<div class="blueprint-axis">X: 12.4 Y: 88.1</div></div>');
        container.appendChild(bprint);
        break;
      case 'art-deco':
        var adeco = el('div', 'style-art-deco', '<div class="art-deco-corner art-deco-corner--tl"></div><div class="art-deco-corner art-deco-corner--tr"></div><div class="art-deco-corner art-deco-corner--bl"></div><div class="art-deco-corner art-deco-corner--br"></div><span style="font-size:0.75rem; font-weight:700; color:var(--gold); letter-spacing:0.1em;">HONOR ROLL</span>');
        container.appendChild(adeco);
        break;
      case 'neo-brutalism':
        var nbrut = el('div', 'style-neo-brutalism', '<span style="font-size:0.75rem; padding:6px 12px; display:inline-block; color:var(--fg);">DATA SCIENCE</span>');
        container.appendChild(nbrut);
        break;
      default:
        container.textContent = code;
    }
  }

  function renderGrid() {
    if (!cinemaDialog) return;
    var grid = cinemaDialog.querySelector('.cinema-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var filtered = STYLES_DATA.filter(function (s) {
      return activeCategory === 'all' || s.cat === activeCategory;
    });

    filtered.forEach(function (s) {
      var li = el('li', 'cinema-card');

      var head = el('div', 'cinema-card-head');
      var num = el('span', 'cinema-card-num', s.num);
      var cat = el('span', 'cinema-card-cat', tv(
        s.cat === 'space' ? { ar: 'الفضاء والبيانات', en: 'Space & Data', ru: 'Космос и данные' }
        : s.cat === 'athletics' ? { ar: 'الرياضة', en: 'Athletics', ru: 'Спорт' }
        : { ar: 'معماري', en: 'Architecture', ru: 'Архитектура' }
      ));
      head.appendChild(num);
      head.appendChild(cat);
      li.appendChild(head);

      var title = el('h3', 'cinema-card-title', tv(s.name));
      li.appendChild(title);

      var desc = el('p', 'cinema-card-desc', tv(s.desc));
      li.appendChild(desc);

      var preview = el('div', 'cinema-card-preview');
      renderMiniPreview(s.code, preview);
      li.appendChild(preview);

      var foot = el('div', 'cinema-card-foot');
      var loc = el('span', 'cinema-card-loc', tv(s.loc));
      var jumpBtn = el('button', 'cinema-jump-btn', tv({
        ar: 'معاينة في الصفحة',
        en: 'Jump on page',
        ru: 'Показать на странице'
      }));
      jumpBtn.type = 'button';
      jumpBtn.addEventListener('click', function () {
        cinemaDialog.close();
        jumpToStyle(s);
      });

      foot.appendChild(loc);
      foot.appendChild(jumpBtn);
      li.appendChild(foot);

      grid.appendChild(li);
    });
  }

  function jumpToStyle(style) {
    var targets = document.querySelectorAll(style.target);
    var found = null;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].offsetParent !== null) {
        found = targets[i];
        break;
      }
    }
    if (found) {
      found.scrollIntoView({ behavior: 'smooth', block: 'center' });
      found.classList.remove('cinema-spotlight-active');
      void found.offsetWidth; // reflow
      found.classList.add('cinema-spotlight-active');
      setTimeout(function () {
        found.classList.remove('cinema-spotlight-active');
      }, 4500);
    }
  }

  function openCinemaStudio() {
    var d = buildCinemaStudio();
    renderGrid();
    if (typeof d.showModal === 'function') {
      d.showModal();
    } else {
      d.setAttribute('open', '');
    }
  }

  /* Listen for language change */
  window.addEventListener('site-lang-change', function () {
    var fab = document.getElementById('cinema-fab');
    if (fab) {
      var txt = fab.querySelector('.cinema-fab-text');
      if (txt) {
        txt.textContent = tv({
          ar: 'الأنماط البصرية',
          en: 'Visual Styles',
          ru: 'Стили анимации'
        });
      }
    }
    if (cinemaDialog && cinemaDialog.open) {
      renderGrid();
    }
  });

  /* Auto-mount on load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFAB);
  } else {
    mountFAB();
  }

  window.CinemaStudio = {
    open: openCinemaStudio,
    styles: STYLES_DATA
  };
})();
