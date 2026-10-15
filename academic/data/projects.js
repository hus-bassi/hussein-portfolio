/* ============================================================
   DATA/PROJECTS.JS
   Pure data, same philosophy as data/certificates.js.

   سوق المجد الطبي / Souq Elmajde Medical
   A comprehensive, production medical-supplies e-commerce platform,
   operations ERP, and mobile ecosystem architected and engineered
   end-to-end by Hussein ElBassiouni (https://elmajde.com).

   ------------------------------------------------------------
   SHAPE

     {
       id:       'slug',
       featured: true,
       title:    { ar, en, ru },
       brand:    'Latin brand',   // shown under title with RTL isolation
       summary:  { ar, en, ru },  // concise card text
       tags:     [{ ar, en, ru }],// controlled vocabulary
       url:      'https://…',
       image:    '',
       details:  {
         intro:  { ar, en, ru },
         blocks: [{
           h:     { ar, en, ru },
           p:     { ar, en, ru },
           items: [{ ar, en, ru }]
         }]
       }
     }
   ============================================================ */

const projectsData = [
  {
    id: 'elmajd-medical-store',
    slug: 'souq-elmajde-medical',
    featured: true,
    title: {
      ar: 'سوق المجد الطبي',
      en: 'Souq Elmajde Medical',
      ru: 'Souq Elmajde Medical',
    },
    brand: 'Souq Elmajde Medical',
    summary: {
      ar: 'منظومة تجارة إلكترونية متكاملة ونظام إدارة موارد مؤسسية وتطبيق هاتف لقطاع المستلزمات الطبية في مصر، تشمل معمارية مستودع موحد، ومحرك شحن يغطي كافة المحافظات المصرية الـ 27، ونمذجة أكثر من 25 نموذجاً علائقياً، وتتبعاً إعلانياً خادمياً، وتشفير بيانات متقدماً، ونشراً ذرياً مؤتمتاً بدون انقطاع.',
      en: 'A production full-stack medical supplies e-commerce ecosystem, operations ERP, and native mobile application covering Egypt\'s 27 governorates. Engineered with a Next.js 15 monorepo, 25+ PostgreSQL/Prisma models, a dedicated Egyptian logistics engine, server-side Meta CAPI tracking, AES-256-GCM encryption, and zero-downtime atomic deployment pipelines.',
      ru: 'Комплексная программная экосистема интернет-торговли медицинскими товарами, ERP-система управления операциями и мобильное приложение для 27 губернаторств Египта. Построена на монорепозитории Next.js 15, базе данных PostgreSQL/Prisma (25+ моделей), собственном логистическом движке, серверном трекинге Meta CAPI, шифровании AES-256-GCM и атомарном развёртывании.',
    },
    tags: [
      { ar: 'تطوير متكامل', en: 'Full-Stack', ru: 'Полный стек' },
      { ar: 'معمارية النظم', en: 'System Architecture', ru: 'Архитектура систем' },
      { ar: 'Next.js', en: 'Next.js', ru: 'Next.js' },
      { ar: 'TypeScript', en: 'TypeScript', ru: 'TypeScript' },
      { ar: 'PostgreSQL', en: 'PostgreSQL', ru: 'PostgreSQL' },
      { ar: 'Prisma ORM', en: 'Prisma ORM', ru: 'Prisma ORM' },
      { ar: 'Tailwind CSS', en: 'Tailwind CSS', ru: 'Tailwind CSS' },
      { ar: 'أندرويد', en: 'Android', ru: 'Android' },
      { ar: 'تخطيط الموارد (ERP)', en: 'Enterprise ERP', ru: 'ERP-системы' },
      { ar: 'محرك اللوجستيات', en: 'Logistics Engine', ru: 'Логистический движок' },
      { ar: 'أمن المعلومات والتشفير', en: 'Security & Cryptography', ru: 'Безопасность и криптография' },
      { ar: 'تحسين محركات البحث', en: 'SEO', ru: 'SEO' },
      { ar: 'أتمتة العمليات', en: 'Automation', ru: 'Автоматизация' },
      { ar: 'تكاملات Google و Meta', en: 'API Integrations', ru: 'Интеграции API' },
      { ar: 'عمليات النشر (DevOps)', en: 'DevOps', ru: 'DevOps' },
    ],
    url: 'https://elmajde.com',
    image: '',
    details: {
      intro: {
        ar: 'منظومة برمجية حية ومتكاملة قمت بهندستها وتطويرها بالكامل لمنصة سوق المجد الطبي، وهي شركة تجارية لتوريد وتوزيع المستلزمات الطبية والرعاية المنزلية في جمهورية مصر العربية. تشمل المنظومة متجراً إلكترونياً عالي الأداء، ولوحة تحكم لإدارة موارد المؤسسة، وتطبيق هاتف أصلي خفيف، وقاعدة بيانات علائقية متطورة، مع تغطية لوجستية كاملة لكافة المحافظات المصرية الـ 27، وتشفير بيانات متقدم، وخط نشر مؤتمت بدون أي انقطاع للخدمة.',
        en: 'A production software ecosystem architected and engineered end-to-end for Souq Elmajde Medical (https://elmajde.com), an enterprise medical supplies and home healthcare distributor in Egypt. The system unites a high-performance customer storefront, an operations ERP console, a lightweight native mobile app, and a sophisticated relational database, featuring 100% geographic logistics coverage across all 27 Egyptian governorates, advanced cryptography, and zero-downtime deployment pipelines.',
        ru: 'Действующая программная экосистема, полностью спроектированная и разработанная для платформы медицинских товаров и домашнего ухода «Сук Аль-Маджд» (https://elmajde.com) в Египте. Системное решение объединяет высокопроизводительную витрину магазина, операционную ERP-панель управления, нативное мобильное приложение и масштабируемую реляционную базу данных со 100% логистическим охватом всех 27 губернаторств Египта, современным шифрованием и атомарным конвейером развёртывания без простоев.',
      },
      blocks: [
        {
          h: {
            ar: 'المعمارية الهندسية والمستودع الموحد',
            en: 'System Architecture & Monorepo',
            ru: 'Архитектура системы и монорепозиторий',
          },
          p: {
            ar: 'بناء المنظومة وفق معمارية المستودع الموحد لضمان التوافق التام ومشاركة النماذج والأنواع وثوابت الأعمال بين تطبيقات المتجر ولوحة الإدارة وتطبيق الهاتف وحزم قواعد البيانات والتكاملات.',
            en: 'Engineered as an NPM workspaces monorepo to ensure type safety, shared validation models, and unified business constants across the storefront, admin console, mobile application, and data packages.',
            ru: 'Построена как монорепозиторий на базе рабочих пространств NPM для сквозной типизации, общих моделей валидации и единых бизнес-констант между витриной, панелью управления, мобильным клиентом и пакетами данных.',
          },
          items: [
            {
              ar: 'تطبيق المتجر الرئيسي المبني على معمارية موجه التطبيقات ومكونات الخادم الحديثة في إطار عمل نيكست دوت جي إس مع فحص صارم للأنواع عبر تايب سكريبت.',
              en: 'Storefront application powered by Next.js 15 App Router, React 19 Server Components, and Server Actions with strict TypeScript verification.',
              ru: 'Основное приложение витрины на Next.js 15 (App Router, React 19 Server Components и Server Actions) со строгим контролем типов в TypeScript.',
            },
            {
              ar: 'تطبيق لوحة التحكم وإدارة العمليات كمنظومة منفصلة ومحمية لإدارة المبيعات والمخزون وحسابات الأرباح.',
              en: 'Operations and ERP admin console running as an isolated, protected application managing sales, inventory, and margin analytics.',
              ru: 'Операционная панель управления и ERP, функционирующая как изолированное защищённое приложение для заказов, склада и аналитики маржинальности.',
            },
            {
              ar: 'حزم بيانات مشتركة تشمل محرك قاعدة البيانات ومخططات التحقق البرمجي ووحدة مزامنة مركز تجار جوجل ومحدد السيو ومحرك البحث.',
              en: 'Shared monorepo packages including the Prisma/PostgreSQL database client, validation schemas, Google Merchant Content API sync, and Search Console indexing modules.',
              ru: 'Общие пакеты монорепозитория: клиент базы данных Prisma/PostgreSQL, схемы валидации, интеграция с Google Merchant Content API и модуль аналитики Search Console.',
            },
          ],
        },
        {
          h: {
            ar: 'متجر العملاء والواجهة الأمامية',
            en: 'Storefront & Customer Experience',
            ru: 'Витрина магазина и клиентский опыт',
          },
          p: {
            ar: 'واجهة مستخدم عربية موجهة من اليمين إلى اليسار مصممة خصيصاً لتناسب المرضى وكبار السن في مصر مع تحقيق أعلى معايير الأداء والسرعة وسهولة الاستخدام.',
            en: 'An Arabic-first RTL storefront engineered specifically for patient care, seniors, and clinical purchasers, achieving high rendering speeds and intuitive ergonomics.',
            ru: 'Витрина с интерфейсом справа налево (RTL), созданная с учётом потребностей пациентов, пожилых людей и клиник, с высокими показателями скорости и удобства.',
          },
          items: [
            {
              ar: 'رندرة خادمة كاملة للصفحات تحقق سرعة تحميل أولي فائقة تقل عن ثانية ونصف حتى على الهواتف الاقتصادية وشبكات الاتصال المحدودة.',
              en: 'Full Server-Side Rendering (SSR) achieving an initial Largest Contentful Paint (LCP) under 1.1s, minimal client JavaScript bundle, and smooth operation on entry-level devices.',
              ru: 'Полный серверный рендеринг (SSR) со временем отрисовки LCP менее 1,1 с, минимальным бандлом JavaScript и плавной работой даже на бюджетных устройствах.',
            },
            {
              ar: 'شجرة تصنيفات طبية تفاعلية تغطي الكراسي المتحركة ومولدات الأكسجين وكراسي الحمام الطبية وأجهزة العلاج الطبيعي والمشدات المعتمدة والمراتب الهوائية.',
              en: 'Hierarchical medical category tree covering wheelchairs, oxygen concentrators, medical commodes, physiotherapy devices, orthopedic braces, and anti-bedsore mattresses.',
              ru: 'Иерархический медицинский каталог: инвалидные коляски, кислородные концентраторы, санитарные кресла, физиотерапевтические аппараты, ортопедические бандажи и противопролежневые матрасы.',
            },
            {
              ar: 'دعم المنتجات متعددة الخيارات مع تحديث فوري للأسعار والباركود الدولي الحقيقي، والتمييز البرمجي بين الصور الواقعية والصور التوضيحية.',
              en: 'Support for product variations (size, color, capacity) with instant SKU and GTIN/EAN updates, plus metadata distinguishing genuine warehouse photos from illustrations.',
              ru: 'Поддержка вариантов товаров (размер, цвет, объём) с мгновенным обновлением SKU и штрихкодов GTIN/EAN, а также метаданные разделения реальных фото и иллюстраций.',
            },
            {
              ar: 'محرك بحث فوري يدعم الإكمال التلقائي والأخطاء الإملائية الشائعة والمرادفات الطبية باللغة العربية دون إرهاق خادم البيانات.',
              en: 'Instant autocomplete search supporting Arabic medical synonyms and typo tolerance without placing heavy loads on the database.',
              ru: 'Быстрый поиск с автодополнением, поддерживающий арабские медицинские синонимы и опечатки без перегрузки базы данных.',
            },
            {
              ar: 'بنية بيانات منظمة متوافقة مع محركات البحث تضمن ظهور المنتجات الطبية والأسعار والتقييمات وحالة التوفر في نتائج البحث بشكل ثري ودقيق.',
              en: 'Comprehensive Schema.org structured data (MedicalDevice, Product, BreadcrumbList, FAQPage) delivering verified rich snippets in Google search results.',
              ru: 'Разметка структурированных данных Schema.org (MedicalDevice, Product, BreadcrumbList, FAQPage), обеспечивающая расширенные сниппеты в поисковой выдаче Google.',
            },
          ],
        },
        {
          h: {
            ar: 'محرك الشحن واللوجستيات لمحافظات مصر',
            en: 'Egyptian Logistics Engine',
            ru: 'Логистический движок по губернаторатам Египта',
          },
          p: {
            ar: 'محرك حسابات وتحقق لوجستي مبني برمجياً في صلب النظام لحل معضلة التجارة الإلكترونية وضمان وصول الأجهزة الطبية الحساسة إلى أقصى نقاط الجمهورية.',
            en: 'A purpose-built logistics and validation engine engineered directly into the core code to manage delivery operations across all regions of Egypt.',
            ru: 'Специализированный модуль логистики и валидации, встроенный в ядро системы для организации доставки медицинского оборудования по всей территории Египта.',
          },
          items: [
            {
              ar: 'تغطية جغرافية شاملة بنسبة مائة بالمائة لكافة محافظات جمهورية مصر العربية السبع والعشرين مقسمة على ثلاث مناطق تسعير لوجستية.',
              en: 'Complete coverage of all 27 Egyptian governorates partitioned into 3 distinct operational shipping tiers (Central Capital, Delta & Canal & Upper Egypt, Remote Border governorates).',
              ru: 'Полный охват всех 27 губернаторств Египта, разделённых на 3 логистические зоны (столичный регион, Дельта и Верхний Египет, отдалённые приграничные территории).',
            },
            {
              ar: 'فحص نمطي صارم لأرقام الهواتف المحمولة المصرية مع التحويل التلقائي للأرقام المدخلة بالأرقام العربية أو بالترميز الدولي إلى الصيغة القياسية.',
              en: 'Strict regex validation for Egyptian mobile networks (Vodafone, Orange, Etisalat, WE) with automated normalization of Eastern Arabic numerals and international country codes.',
              ru: 'Строгая проверка египетских номеров телефонов с автоматической нормализацией арабских цифр и международных телефонных кодов.',
            },
            {
              ar: 'نموذج الدفع نقداً عند الاستلام بعد فحص الجهاز الطبي، مع تبسيط خطوات إتمام الطلب إلى أقل من ثلاثين ثانية لدعم كبار السن.',
              en: 'Cash on Delivery (COD) workflow with inspection upon receipt, optimized into an ultra-streamlined checkout completed in under 30 seconds.',
              ru: 'Сценарий оплаты наличными при получении после осмотра медицинского прибора, с упрощённым оформлением заказа менее чем за 30 секунд.',
            },
          ],
        },
        {
          h: {
            ar: 'تصميم ونمذجة قاعدة البيانات العلائقية',
            en: 'Relational Database Modeling & Integrity',
            ru: 'Моделирование реляционной базы данных',
          },
          p: {
            ar: 'قاعدة بيانات علائقية متقدمة على محرك بوستغريس كيو إل تضم أكثر من 25 نموذجاً مصممة بالمعيار الثالث الطبيعي لمنع تكرار البيانات وضمان اتساقها المالي والتشغيلي.',
            en: 'A normalized PostgreSQL 16 schema comprising 25+ relational models engineered in 3NF to guarantee data integrity, financial auditability, and query performance.',
            ru: 'Нормализованная схема PostgreSQL 16 из более чем 25 реляционных моделей в третьей нормальной форме для обеспечения целостности данных и скорости запросов.',
          },
          items: [
            {
              ar: 'حماية تاريخية لسجلات الفواتير عبر أخذ لقطة غير قابلة للتعديل لاسم المنتج والتنويعة وسعر الشراء وقت الطلب لمنع تأثر السجلات التاريخية بأي تعديل مستقبلي للأسعار.',
              en: 'Immutable historical order snapshots (nameSnapshot, variantSnapshot, unitPrice, lineTotal) preserving accounting and audit records against future product or price changes.',
              ru: 'Неизменяемые исторические снимки позиций заказа (nameSnapshot, variantSnapshot, unitPrice), защищающие бухгалтерскую отчётность от будущих изменений цен.',
            },
            {
              ar: 'محرك مخصص لتتبع الأثر التسويقي على مستوى الخادم يسجل مصادر الزيارات وروابط الإحالة ومعرفات النقرات الإعلانية المشفرة دون الاعتماد على ملفات تعريف الارتباط الخارجية.',
              en: 'Custom server-side attribution engine recording traffic channels, landing paths, and marketing click identifiers (gclid, fbclid, ttclid, msclkid) directly in the database.',
              ru: 'Собственный серверный модуль атрибуции, сохраняющий рекламные идентификаторы переходов (gclid, fbclid, ttclid, msclkid) и пути посадочных страниц прямо в базе данных.',
            },
            {
              ar: 'تتبع السلات المتروكة وتسجيل لقطات تفاعلها دورياً لإتاحة أتمتة إعادة الاستهداف مع منع تكرار المراسلات البرمجية عبر مفاتيح فريدة مركبة.',
              en: 'Automated cart snapshot engine tracking abandoned sessions and enabling automated recovery workflows with composite unique keys preventing duplicate notifications.',
              ru: 'Фиксация снимков брошенных корзин для автоматических сценариев возврата клиентов с составными уникальными ключами для защиты от дублирования сообщений.',
            },
          ],
        },
        {
          h: {
            ar: 'لوحة التحكم ونظام إدارة موارد المؤسسة (ERP)',
            en: 'Admin ERP & Operations Console',
            ru: 'Панель управления и ERP-система операций',
          },
          p: {
            ar: 'منظومة إدارة تشغيلية متكاملة تخدم إدارة العمليات اليومية ومتابعة دورة حياة الطلبات بدقة من خلال مسار إداري مستقل ومحمي.',
            en: 'A full-featured operations console and ERP system managing daily commerce logistics, order state machines, and inventory economics via a protected admin surface.',
            ru: 'Полнофункциональная панель управления и ERP-система, контролирующая повседневную логистику, состояния заказов и складскую экономику.',
          },
          items: [
            {
              ar: 'آلة حالة محكمة لدورة حياة الطلب تتيح الفرز والبحث الفوري وتحديث الحالات بنقرة واحدة مع إنقاص المخزون تلقائياً عند تأكيد الطلب.',
              en: 'Strict order lifecycle state machine with instant search, filtering by governorate or customer phone, and single-click state transitions with automated stock decrement.',
              ru: 'Конечный автомат жизненного цикла заказов с мгновенным поиском, фильтрацией по губернаторатам и номерам телефонов, и автоматическим списанием остатков.',
            },
            {
              ar: 'تكامل مباشر للتواصل مع العملاء عبر الهاتف وتطبيق واتساب برسائل معدة مسبقاً تشمل تفاصيل الطلب وعنوان الشحن لتسريع التأكيد والتسليم.',
              en: 'One-click phone dialing and direct WhatsApp messaging integration with pre-filled order and address confirmation templates.',
              ru: 'Интеграция телефонных звонков и прямых сообщений в WhatsApp в один клик с готовыми шаблонами подтверждения адреса и состава заказа.',
            },
            {
              ar: 'إدارة المخزون وهامش الربحية عبر مقارنة أسعار التكلفة الحقيقية بأسعار البيع، مع تنبيهات استباقية لنفاد الكميات وربط التصنيفات الطبية الرسمية لجوجل.',
              en: 'Real-time margin and cost-price tracking, automated low-stock threshold alerts, and official Google Product Category taxonomy mapping.',
              ru: 'Учёт себестоимости и маржинальности в реальном времени, автоматические оповещения о снижении остатков и сопоставление с официальными категориями Google.',
            },
          ],
        },
        {
          h: {
            ar: 'منظومة تعدد اللغات والترجمة الطبية (i18n)',
            en: 'i18n Medical Localization Engine',
            ru: 'Движок мультиязычности и медицинской локализации',
          },
          p: {
            ar: 'محرك ترجمة مخصص يدعم العربية والإنجليزية والروسية مبني وفق مبدأ الحقيقة الواحدة لمنع أي تضارب في الأسعار أو المواصفات الطبية الدقيقة.',
            en: 'A custom localization architecture supporting Arabic, English, and Russian, built on a Single Source of Truth philosophy where clinical specifications and prices are never duplicated.',
            ru: 'Собственная архитектура локализации (арабский, английский, русский), основанная на принципе единого источника истины, исключающем расхождение цен и характеристик.',
          },
          items: [
            {
              ar: 'فصل جداول الترجمة عن البيانات الحسابية واللوجستية الأساسية لضمان عدم تأثر أسعار البيع أو المخزون بتغير لغة العرض.',
              en: 'Clean separation of multilingual translation models from operational product records, guaranteeing that prices, stock levels, and SKUs remain invariant across languages.',
              ru: 'Чёткое разделение моделей переводов и операционных данных товаров, гарантирующее неизменность цен, остатков и артикулов при смене языка.',
            },
            {
              ar: 'آلية حفظ لغة الزائر عبر كعكة آمنة مع تجنب التوجيه التلقائي عبر الموقع الجغرافي لحماية الفهرسة العربية للمتجر في محركات البحث من أي هبوط.',
              en: 'Cookie-based locale persistence (NEXT_LOCALE) avoiding disruptive IP auto-redirects, safeguarding Googlebot indexing of the primary Arabic storefront.',
              ru: 'Сохранение языка в защищённых cookie без агрессивных IP-перенаправлений, что сохраняет стабильную индексацию арабской витрины в поисковых системах.',
            },
          ],
        },
        {
          h: {
            ar: 'التتبع الإعلاني المتقدم والربط الخارجي',
            en: 'Server-Side Tracking & External APIs',
            ru: 'Серверный трекинг и внешние интеграции',
          },
          p: {
            ar: 'بنية ربط خادمي متطورة مع المنصات الإعلانية ومحركات البحث تضمن دقة قياس العائد وتفادي تقييدات برامج حجب الإعلانات والتحديثات الأمنية للمتصفحات.',
            en: 'Advanced server-side tracking pipelines and direct API integrations with ad platforms and search engines, ensuring full conversion visibility and attribution accuracy.',
            ru: 'Прямые серверные интеграции с рекламными платформами и поисковыми системами, обеспечивающие точную атрибуцию конверсий в обход блокировщиков рекламы.',
          },
          items: [
            {
              ar: 'تتبع عمليات الشراء خادمياً عبر واجهة تحويلات ميتا مباشرة من خادم المنظومة، مع منع التكرار القطعي عبر توليد معرف ثابت ومشتق لكل طلب شراء.',
              en: 'Server-side Meta Conversions API (CAPI) sending purchase events directly from Node.js with deterministic deduplication keys matching client-side events.',
              ru: 'Серверный Meta Conversions API (CAPI), передающий события покупок напрямую из Node.js с детерминированной дедупликацией по идентификатору заказа.',
            },
            {
              ar: 'توليد تلقائي لخلاصة منتجات متوافقة مع مركز تجار جوجل، مع ربط مشفر عبر واجهة برمجة المحتوى لتحديث الأسعار وتوافر الأجهزة الطبية تلقائياً.',
              en: 'Automated XML product feeds and OAuth-secured Google Merchant Content API synchronization updating stock and prices without manual intervention.',
              ru: 'Автоматическая генерация XML-фидов и синхронизация через Google Merchant Content API по протоколу OAuth для актуализации цен и наличия медицинских товаров.',
            },
            {
              ar: 'تنبيهات فهرسة لحظية لمحركات البحث فور نشر أو تعديل المنتجات والمقالات الطبية عبر واجهة فهرسة جوجل لضمان سرعة الظهور في نتائج البحث.',
              en: 'Real-time indexing dispatch to Google Search Console Indexing API immediately upon publishing or updating medical product pages and guides.',
              ru: 'Мгновенная отправка сигналов индексации в Google Search Console Indexing API при публикации или обновлении карточек товаров и медицинских статей.',
            },
          ],
        },
        {
          h: {
            ar: 'تطبيق الهاتف ومحاكي التطوير الخفيف',
            en: 'Mobile App & Lightweight Dev Simulator',
            ru: 'Мобильное приложение и лёгкий симулятор разработки',
          },
          p: {
            ar: 'تطبيق أندرويد فائق الخفة وسريع الاستجابة يضمن تزامن المنتجات والأسعار لحظياً مع المتجر، مصحوباً بمحاكي تطوير مكتبي خفيف ومسار بناء سحابي مؤتمت.',
            en: 'An ultra-lightweight native Android client (~2.5MB) delivering real-time storefront synchronization, complemented by a low-footprint desktop development simulator and automated cloud CI/CD.',
            ru: 'Сверхлёгкое нативное Android-приложение (~2,5 МБ) с мгновенной синхронизацией витрины, дополненное локальным симулятором разработки и облачным CI/CD.',
          },
          items: [
            {
              ar: 'تطبيق أندرويد أصلي خفيف الحجم يدعم التزامن اللحظي، والسحب للتحديث، والتوجيه التلقائي لمحادثات واتساب والاتصال، مع واجهة طوارئ مخصصة عند انقطاع الاتصال.',
              en: 'Native Android WebView bridge (~2.5MB) with SwipeRefreshLayout, deep-linking for WhatsApp/phone calls, and a tailored offline emergency shell.',
              ru: 'Нативное приложение Android WebView (~2,5 МБ) с поддержкой SwipeRefreshLayout, диплинками для WhatsApp и звонков, и автономным экраном при потере сети.',
            },
            {
              ar: 'محاكي تطوير محلي للأجهزة المكتبية يستهلك 40 ميجابايت فقط من الذاكرة العشوائية مع خادم وسيط يعكس المتجر داخل مجسم هاتف تفاعلي ثلاثي الأبعاد.',
              en: 'Lightweight desktop dev simulator consuming just ~40MB of RAM via an internal reverse proxy that strips frame restrictions for rapid testing inside a 3D device shell.',
              ru: 'Локальный симулятор разработки для ПК, потребляющий всего ~40 МБ ОЗУ благодаря встроенному обратному прокси, снимающему ограничения фреймов для тестов в 3D-оболочке.',
            },
            {
              ar: 'خط بناء سحابي مؤتمت عبر إجراءات غيت هب لتجميع وبناء حزم التثبيت للأندرويد آلياً عند كل تحديث دون استهلاك موارد جهاز المطور.',
              en: 'Automated GitHub Actions CI/CD workflow compiling production Android APK packages in the cloud on every release trigger.',
              ru: 'Автоматизированный конвейер GitHub Actions CI/CD для сборки установочных пакетов APK в облаке при каждом релизе без нагрузки на локальный ПК.',
            },
          ],
        },
        {
          h: {
            ar: 'الأمن السيبراني والتشفير وحماية البيانات',
            en: 'Cybersecurity, Encryption & Data Protection',
            ru: 'Кибербезопасность и криптографическая защита',
          },
          p: {
            ar: 'تطبيق مبادئ الدفاع في العمق لحماية بيانات المرضى والعملاء وأسرار التكاملات الخارجية عبر التشفير المتقدم وسياسات الأمان الصارمة.',
            en: 'Defense-in-depth principles implemented across every layer to safeguard customer records, authentication tokens, and administrative credentials.',
            ru: 'Многоуровневая эшелонированная защита данных пациентов, учётных записей клиентов и токенов внешних интеграций с применением современной криптографии.',
          },
          items: [
            {
              ar: 'تشفير المفاتيح السرية ورموز الربط الحساسة وأسرار التحقق الثنائي بخوارزمية التشفير المتماثل المتقدم بمفتاح 256 بت مع التحقق من سلامة البيانات.',
              en: 'AES-256-GCM authenticated encryption for API integration tokens, external secrets, and TOTP two-factor authentication secrets.',
              ru: 'Аутентифицированное шифрование AES-256-GCM для токенов внешних API, секретных ключей интеграций и двухфакторной аутентификации TOTP.',
            },
            {
              ar: 'تجزئة كلمات المرور باستخدام خوارزميات التجزئة الحديثة مع إضافة قيم عشوائية فريدة لكل مستخدم لمنع هجمات الجداول المسبقة.',
              en: 'Modern salted password hashing via Bcrypt/Argon2 securing customer accounts and operations console credentials.',
              ru: 'Надёжное хеширование паролей с уникальной солью на базе Bcrypt/Argon2 для защиты клиентских и административных аккаунтов.',
            },
            {
              ar: 'سياسة أمان محتوى صارمة مع توليد رمز أمان عشوائي ديناميكي لكل طلب صفحة لمنع هجمات حقن السكربتات الخبيثة وتفعيل ترويسات الأمان المتقدمة.',
              en: 'Dynamic Content Security Policy (CSP) with per-request cryptographic nonces, Strict-Transport-Security (HSTS), and clickjacking prevention headers.',
              ru: 'Строгая политика безопасности контента (CSP) с криптографическими одноразовыми кодами (nonces) для каждого запроса, заголовками HSTS и защитой от кликджекинга.',
            },
            {
              ar: 'أداة حماية خادمة مخصصة تفحص تغييرات قواعد البيانات قبل تطبيقها وتمنع تنفيذ أي أوامر إسقاط جداول أو فقد بيانات غير مقصود على الخادم الحي.',
              en: 'Automated database migration guard (db-deploy-guarded.mjs) pre-auditing schema diffs to prohibit destructive drops or unintended data loss on production.',
              ru: 'Скрипт защиты миграций (db-deploy-guarded.mjs), анализирующий изменения схемы и блокирующий опасные команды удаления таблиц на рабочем сервере.',
            },
          ],
        },
        {
          h: {
            ar: 'البنية التحتية والنشر الذري بدون انقطاع',
            en: 'Infrastructure & Zero-Downtime Deployment',
            ru: 'Инфраструктура и атомарное развёртывание',
          },
          p: {
            ar: 'بنية تشغيل سحابية قائمة على نظام لينكس مع سكربت نشر ذري يضمن تحديث التطبيق دون توقف الخدمة لثانية واحدة مع إمكانية التراجع الفوري عند الطوارئ.',
            en: 'A Linux cloud deployment architecture driven by an automated atomic symlink pipeline ensuring zero-downtime releases and instantaneous automated rollback.',
            ru: 'Облачная инфраструктура на базе Linux с автоматизированным конвейером атомарного переключения симлинков без единой секунды простоя сервиса.',
          },
          items: [
            {
              ar: 'بيئة تشغيل خادمة متطورة تعتمد محرك فيوجن باسنجر لتشغيل تطبيقات نود دوت جي إس على خوادم سحابية بكفاءة استهلاك موارد عالية.',
              en: 'Production runtime powered by Phusion Passenger orchestrating Node.js 20+ instances on Linux cloud servers for high resource efficiency.',
              ru: 'Производственная среда на базе Phusion Passenger, управляющая экземплярами Node.js 20+ на облачных серверах Linux с высокой ресурсоэффективностью.',
            },
            {
              ar: 'نشر ذري مؤتمت يقوم ببناء الإصدار الجديد في مجلد مستقل وفحصه أمنياً، ثم تحويل الرابط الرمزي في أجزاء من الثانية دون انقطاع تجربة التسوق.',
              en: 'Atomic deployment pipeline building releases in timestamped directories, executing security verification, and switching symlinks in milliseconds with zero downtime.',
              ru: 'Атомарный конвейер развёртывания, выполняющий сборку в изолированных директориях и переключающий символические ссылки за миллисекунды без простоя витрины.',
            },
            {
              ar: 'عزل معماري وتشغيلي كامل بين متجر العملاء ولوحة إدارة الموارد المشتركة لنفس قاعدة البيانات لضمان عدم تأثر العمليات الإدارية بكثافة الزيارات.',
              en: 'Complete process isolation between storefront and administrative ERP services sharing the PostgreSQL cluster, preventing operational degradation under peak traffic.',
              ru: 'Полная изоляция процессов витрины и административной ERP-системы, использующих общий кластер PostgreSQL, исключающая влияние пиковых нагрузок на работу склада.',
            },
          ],
        },
      ],
    },
  },
];

// Expose for assets/js/site.js — every other data file does the same.
if (typeof window !== 'undefined') {
  window.projectsData = projectsData;
}