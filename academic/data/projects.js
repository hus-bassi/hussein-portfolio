/* ============================================================
   DATA/PROJECTS.JS
   Pure data, same philosophy as data/certificates.js.

   Hussein has no software projects of his own yet — a fake side
   project would be a much bigger claim than a placeholder
   certificate. What IS real is his family's business: سوق المجد
   الطبي / Elmajd Medical Store, a production medical-supplies
   e-commerce platform. It is shown here honestly as a real-world
   family-business project, with the engineering depth it actually
   has — not as something he personally wrote every line of.

   ------------------------------------------------------------
   SHAPE

     {
       title:    { ar, en, ru }   // or a plain string
       brand:    'Latin brand',   // optional; shown under the title
                                  // only when it differs from the
                                  // localised title (i.e. in Arabic)
       summary:  { ar, en, ru },  // the CONCISE card text
       tags:     [{ ar, en, ru }],// controlled vocabulary, one label
                                  // per language (Latin brand names
                                  // stay Latin in all three)
       url:      'https://…',     // public link, or ''
       featured: true,            // renders the featured treatment
       image:    'assets/images/…'// screenshot, or ''
       details:  {                // optional — rendered on the page
                                  // project.html?id=<id>. The card
                                  // itself stays concise.
         intro:  { ar, en, ru },
         blocks: [{
           h:     { ar, en, ru }, // group heading
           p:     { ar, en, ru }, // optional paragraph
           items: [{ ar, en, ru }]// optional list of points
         }]
       }
     }

   ------------------------------------------------------------
   WHAT NOT TO CLAIM

   · No business result: no revenue, users, orders, traffic,
     ranking or conversion claim. Technical implementation only.
   · No sensitive detail: no credentials, usernames, keys,
     tokens, database URLs or private admin addresses.
   · Historical numbers are labelled by the stage they belong to.
     The platform evolved, so an early audit and a later Search
     Console analysis report DIFFERENT snapshots — they are never
     merged into one.

   Two pages feed from this array:
     · index.html — the "مشاريعي" section (the featured card, which
       opens project.html?id=<id>), plus a link to the list page;
     · projects.html — the projects list, with the count derived from
       projectsData.length;
     · project.html?id=<id> — the full engineering detail page.
   When the array is empty they show an honest "no projects yet"
   message — nothing is invented to fill the space.
   ============================================================ */

const projectsData = [
  {
    /* the route a card opens: project.html?id=elmajd-medical-store */
    id: 'elmajd-medical-store',
    featured: true,
    title: {
      ar: 'سوق المجد الطبي',
      en: 'Elmajd Medical Store',
      ru: 'Elmajd Medical Store',
    },
    /* The store's own Latin name, shown under the Arabic title as a brand
       name — Latin like LinkedIn / GitHub, with the same RTL isolation. */
    brand: 'Elmajd Medical Store',
    summary: {
      ar: 'منصّة تجارة إلكترونية حقيقية لمشروع عائلي لتوريد المستلزمات الطبية في مصر، تجمع مسارات الشراء للعملاء، ولوحة إدارة تشغيلية، ونظامًا قائمًا على قاعدة بيانات، وبنيةً لتحسين محركات البحث، وتكاملات مع خدمات Google، وتقويةً أمنية، وأتمتةً لدورة حياة العملاء.',
      en: 'A production e-commerce platform for a real medical-supplies family business in Egypt, combining customer shopping workflows, an operational admin console, a database-backed system, SEO infrastructure, Google integrations, security hardening and customer-lifecycle automation.',
      ru: 'Рабочая платформа интернет-торговли для реального семейного бизнеса по поставке медицинских товаров в Египте: покупательские сценарии, операционная админ-панель, система на базе данных, инфраструктура SEO, интеграции с сервисами Google, усиление безопасности и автоматизация жизненного цикла клиентов.',
    },
    /* Controlled vocabulary. The concept is what is tagged, not the
       provider, and a brand or product name stays in Latin in every
       language — the same rule the certificates follow. */
    tags: [
      { ar: 'تجارة إلكترونية', en: 'E-commerce', ru: 'Электронная коммерция' },
      { ar: 'تطوير متكامل', en: 'Full-Stack', ru: 'Полный стек' },
      { ar: 'Next.js', en: 'Next.js', ru: 'Next.js' },
      { ar: 'Prisma', en: 'Prisma', ru: 'Prisma' },
      { ar: 'PostgreSQL', en: 'PostgreSQL', ru: 'PostgreSQL' },
      { ar: 'تحسين محركات البحث', en: 'SEO', ru: 'SEO' },
      { ar: 'أتمتة', en: 'Automation', ru: 'Автоматизация' },
      { ar: 'أمن المعلومات', en: 'Security', ru: 'Безопасность' },
      { ar: 'تكاملات Google', en: 'Google Integrations', ru: 'Интеграции Google' },
    ],
    url: 'https://elmajde.com',
    image: '',
    details: {
      intro: {
        ar: 'منصّة تجارة إلكترونية حقيقية لمشروع عائلي متخصص في بيع المستلزمات الطبية في مصر. طوّرت أجزاءً جوهرية من المنصّة وهندستها باستمرار: المعمارية، ومسارات التجارة، والأتمتة، وتحسين محركات البحث، والأمن، والتكاملات، والتحسين المستمر في بيئة الإنتاج. المتجر عربي أولًا ويعمل من اليمين إلى اليسار.',
        en: 'A real e-commerce platform for a family business that sells medical supplies in Egypt. Major parts of the platform were developed and continuously engineered: architecture, commerce workflows, automation, SEO, security, integrations and ongoing production optimisation. The storefront is Arabic-first and fully RTL.',
        ru: 'Реальная платформа интернет-торговли для семейного бизнеса по продаже медицинских товаров в Египте. Существенные части платформы разработаны и постоянно развивались: архитектура, торговые сценарии, автоматизация, SEO, безопасность, интеграции и постоянная оптимизация в рабочей среде. Витрина ориентирована на арабский язык и работает справа налево.',
      },
      blocks: [
        {
          h: { ar: 'التجارة الأساسية', en: 'Core commerce', ru: 'Основная торговля' },
          items: [
            {
              ar: 'كتالوج منتجات وفئات متعدّدة المستويات: أجهزة المساج، والدعامات والمشدّات الطبية، ومنتجات التخسيس والحرارة، والأحذية الطبية ومساعدات الحركة، وأجهزة القياس الطبية، وأجهزة التنفّس، والمستلزمات الطبية العامة، وأجهزة العلاج الطبيعي.',
              en: 'A product catalogue with a multi-level category hierarchy: massage devices, medical supports and braces, weight-loss and thermal products, medical footwear and mobility aids, medical measuring devices, respiratory devices, general medical supplies and physiotherapy equipment.',
              ru: 'Каталог товаров с многоуровневой иерархией категорий: массажные приборы, медицинские бандажи и ортезы, товары для снижения веса и тепловые изделия, медицинская обувь и средства передвижения, медицинские измерительные приборы, аппараты для дыхания, общие медицинские товары и физиотерапевтическое оборудование.',
            },
            {
              ar: 'صفحات منتج تعرض الخصائص والصور والسعر والتوافر، مع دعم أشكال المنتج المتعددة عند وجودها.',
              en: 'Product pages that present specifications, images, price and availability, with support for product variations where they exist.',
              ru: 'Страницы товаров с характеристиками, изображениями, ценой и наличием, с поддержкой вариантов товара там, где они есть.',
            },
            {
              ar: 'في مرحلة موثّقة من التطوير احتوت المنصّة على نحو 70 منتجًا؛ ومن أمثلة ذلك دعامة سقوط القدم بعدة أشكال، ودعامة الكاحل الطبي بأربعة أشكال. هذه أرقام مرحلة موثّقة، لا حصيلة اليوم.',
              en: 'At one documented development stage the platform held around 70 products; examples included a foot-drop brace with several variations and an ankle-support brace with four variations. These are documented-stage figures, not today\'s count.',
              ru: 'На одном из задокументированных этапов на платформе было около 70 товаров; среди примеров — ортез при отвисании стопы с несколькими вариантами и бандаж на голеностоп с четырьмя вариантами. Это цифры задокументированного этапа, а не сегодняшнее количество.',
            },
            {
              ar: 'سلة تسوّق وإتمام شراء وطلبات ومراجعات، إلى جانب حساب العميل ومسارات الطلب.',
              en: 'A shopping cart, checkout, orders and reviews, alongside customer accounts and order workflows.',
              ru: 'Корзина, оформление заказа, заказы и отзывы, а также клиентские аккаунты и сценарии работы с заказами.',
            },
            {
              ar: 'شحن محسوب في مصر مع الدفع عند الاستلام، وتأكيد هاتفي، وتقدير مدة التسليم بنحو 48 ساعة. ووفق أسعار موثّقة: 60 جنيهًا للقاهرة والجيزة، و80 جنيهًا لبقية المحافظات، و120 جنيهًا للمحافظات الحدودية.',
              en: 'Shipping calculated for Egypt with cash on delivery, phone confirmation and an estimated delivery of about 48 hours. Under documented rates: 60 EGP for Cairo and Giza, 80 EGP for other governorates and 120 EGP for border governorates.',
              ru: 'Расчёт доставки по Египту с оплатой при получении, подтверждением по телефону и ориентировочным сроком около 48 часов. По задокументированным тарифам: 60 египетских фунтов для Каира и Гизы, 80 — для остальных губернаторств и 120 — для пограничных.',
            },
          ],
        },
        {
          h: { ar: 'لوحة الإدارة والتشغيل', en: 'Admin and operations', ru: 'Администрирование и операции' },
          items: [
            {
              ar: 'لوحة إدارة تشغيلية تشمل الطلبات والمنتجات والعملاء والمراجعات والمقالات والتسويق، مع الوصول إلى واجهة المتجر.',
              en: 'An operational admin console covering orders, products, customers, reviews, articles and marketing, with access to the storefront.',
              ru: 'Операционная админ-панель: заказы, товары, клиенты, отзывы, статьи и маркетинг, с доступом к витрине.',
            },
            {
              ar: 'إدارة المنتج على مستوى الاسم والفئة والنوع (منتج بسيط أو بأشكال متعددة) والوسوم والتوافر والتمييز والجديد والسعر والصور.',
              en: 'Product management at the level of name, category, type (simple or with variations), tags, availability, featured and new flags, price and images.',
              ru: 'Управление товаром на уровне названия, категории, типа (простой или с вариантами), тегов, наличия, отметок «избранное» и «новинка», цены и изображений.',
            },
            {
              ar: 'تكامل أدوات Google (Search Console و Merchant Center و Analytics) داخل سير عمل الإدارة والتسويق.',
              en: 'Google tools (Search Console, Merchant Center and Analytics) integrated into the administrative and marketing workflow.',
              ru: 'Инструменты Google (Search Console, Merchant Center и Analytics) интегрированы в административный и маркетинговый процесс.',
            },
            {
              ar: 'بنية بيانات مشتركة تغطي العملاء والطلبات وعناصر الطلب والمراجعات والمفضّلة وأشكال المنتج والتوافر وسجلات دورة الحياة.',
              en: 'A shared data layer covering customers, orders, order items, reviews, favourites, product variations, availability and lifecycle records.',
              ru: 'Общий слой данных: клиенты, заказы, позиции заказа, отзывы, избранное, варианты товара, наличие и записи жизненного цикла.',
            },
          ],
        },
        {
          h: { ar: 'تجربة العميل', en: 'Customer experience', ru: 'Клиентский опыт' },
          items: [
            {
              ar: 'حساب العميل وتسجيل الدخول وإعدادات الحساب ومسارات الطلب، مع دعم سلوك الزائر غير المسجّل أيضًا.',
              en: 'Customer accounts, sign-in, account settings and order workflows, with support for guest behaviour as well.',
              ru: 'Клиентские аккаунты, вход, настройки аккаунта и сценарии заказов, а также поддержка поведения гостя.',
            },
            {
              ar: 'المفضّلة للعملاء المسجّلين وللزوار: تُحفظ مفضّلة الزائر محليًا ثم تُدمج في الحساب عند تسجيل الدخول، مع صفحة مخصّصة تعرض السعر والتوافر وإمكانية الإزالة.',
              en: 'Favourites for signed-in customers and for guests: a guest list is kept locally and merged into the account on sign-in, with a dedicated page that shows price and availability and allows removal.',
              ru: 'Избранное для авторизованных клиентов и гостей: гостевой список хранится локально и объединяется с аккаунтом при входе, с отдельной страницей, где показаны цена и наличие и есть возможность удаления.',
            },
            {
              ar: 'واجهة عربية أولًا RTL ورسائل تواصل مع العميل بالعربية.',
              en: 'An Arabic-first RTL storefront and customer communication in Arabic.',
              ru: 'Витрина на арабском языке с направлением справа налево и общение с клиентом на арабском.',
            },
            {
              ar: 'رحلة متصلة من اكتشاف المنتج إلى السلة والإتمام والشحن والدفع عند الاستلام والتأكيد الهاتفي ثم إدارة الطلب ثم المتابعة بعد الشراء.',
              en: 'A connected journey from product discovery through cart, checkout, shipping, cash on delivery and phone confirmation, to order management and post-purchase follow-up.',
              ru: 'Связный путь от поиска товара до корзины, оформления, доставки, оплаты при получении, подтверждения по телефону, управления заказом и сопровождения после покупки.',
            },
          ],
        },
        {
          h: { ar: 'الأتمتة ودورة حياة العميل', en: 'Automation and the customer lifecycle', ru: 'Автоматизация и жизненный цикл клиента' },
          items: [
            {
              ar: 'أتمتة دورة حياة العملاء تُشغَّل وفق جدول زمني من نقطة نهاية محمية، وتغطي سبعة أنواع من رسائل دورة الحياة دون تدخّل يدوي.',
              en: 'Customer-lifecycle automation runs on a schedule from a protected endpoint and covers seven lifecycle message types without manual work.',
              ru: 'Автоматизация жизненного цикла клиентов запускается по расписанию из защищённой конечной точки и охватывает семь типов сообщений жизненного цикла без ручного участия.',
            },
            {
              ar: 'تنبيه السلة المتروكة: يكتشف الأتمتة السلال غير النشطة خلال نافذة زمنية محددة (نحو ثلاث ساعات) ثم يرسل رسالة تذكير واحدة لمن تنطبق عليه الشروط، مع حماية من التكرار.',
              en: 'Abandoned-cart reminders: the automation detects inactive carts after a defined window (about three hours) and sends a single eligible reminder, protected against duplicates.',
              ru: 'Напоминания о брошенной корзине: автоматизация выявляет неактивные корзины по истечении заданного окна (около трёх часов) и отправляет одно подходящее напоминание с защитой от повторов.',
            },
            {
              ar: 'تذكير بالمفضّلة، وتذكير بالعميل غير النشط، ومتابعة بعد الشراء، وتنبيهات إتمام الشراء المتروك، وكلها مبنية على شروط الأهلية نفسها.',
              en: 'Favourite reminders, inactive-customer reminders, post-purchase follow-up and abandoned-checkout reminders, all built on the same eligibility conditions.',
              ru: 'Напоминания об избранном, напоминания неактивным клиентам, сопровождение после покупки и напоминания о брошенном оформлении — всё на одних и тех же условиях допуска.',
            },
            {
              ar: 'إشعارات توفّر المنتج: يشترك العميل في تنبيه عند نفاد المنتج، فيصل الإشعار عند عودته للمخزون؛ وتنبيهات انخفاض السعر تُبنى على تغيّر سعر حقيقي لا على تقدير.',
              en: 'Back-in-stock notifications: a customer subscribes while a product is out of stock and is notified when it returns; price-drop notifications are based on a real price decrease, not on an estimate.',
              ru: 'Уведомления о поступлении: клиент подписывается, пока товара нет в наличии, и получает уведомление при его возвращении; уведомления о снижении цены основаны на реальном снижении, а не на оценке.',
            },
            {
              ar: 'موافقة التسويق شرط مسبق: لا تُرسَل رسالة تسويقية إلا بموافقة مسجّلة، ويحمل كل بريد رابط إلغاء اشتراك موقّعًا يمكن المستلم من إيقاف الرسائل.',
              en: 'Marketing consent is a precondition: no marketing message is sent without recorded consent, and every email carries a signed unsubscribe link that lets the recipient opt out.',
              ru: 'Согласие на маркетинг — обязательное условие: маркетинговое письмо не отправляется без зафиксированного согласия, и каждое письмо содержит подписанную ссылку для отписки.',
            },
            {
              ar: 'حماية من التكرار: رسالة واحدة لكل حدث، مع نافذة كبح عامة تمنع إزعاج العميل برسائل متتابعة.',
              en: 'Duplicate protection: one message per event, with a global suppression window that keeps a customer from being contacted repeatedly.',
              ru: 'Защита от повторов: одно сообщение на событие и общее окно подавления, чтобы клиент не получал письма подряд.',
            },
          ],
        },
        {
          h: { ar: 'تحسين محركات البحث والظهور', en: 'SEO and search visibility', ru: 'SEO и видимость в поиске' },
          items: [
            {
              ar: 'تحسين تقني: روابط أساسية ثابتة، وملف robots.txt، وخريطة موقع، ووسوم وصفية، وعناوين وأوصاف، وبنية عناوين صحيحة، وربط داخلي، واستبعاد الصفحات الخاصة من الفهرسة.',
              en: 'Technical SEO: canonical URLs, a robots.txt file, a sitemap, metadata, titles and descriptions, correct heading structure, internal linking and exclusion of private surfaces from indexing.',
              ru: 'Техническое SEO: канонические адреса, файл robots.txt, карта сайта, метаданные, заголовки и описания, корректная структура заголовков, внутренние ссылки и исключение приватных разделов из индексации.',
            },
            {
              ar: 'بيانات منظّمة لصفحات المنتج تشمل المنتج والعرض ومسار التنقّل والأسئلة الشائعة، وبيانات منظّمة للمقالات، ومعلومات المتجر والعلامة.',
              en: 'Structured data for product pages including Product, Offer and BreadcrumbList, plus FAQ, article structure, and store and brand information.',
              ru: 'Структурированные данные для страниц товаров: Product, Offer и BreadcrumbList, а также FAQ, разметка статей и сведения о магазине и бренде.',
            },
            {
              ar: 'نظام مقالات وأدلة متكامل مع بنية تحسين محركات البحث (نحو 70 مقالًا في مرحلة موثّقة، ثم نحو 87 في تحليل لاحق).',
              en: 'An articles and guides system integrated with the SEO structure (about 70 articles at one documented stage, later about 87 in a subsequent analysis).',
              ru: 'Система статей и руководств, интегрированная со структурой SEO (около 70 статей на одном задокументированном этапе, позднее около 87 в последующем анализе).',
            },
            {
              ar: 'في مرحلة تدقيق موثّقة غطّى التدقيق 177 رابطًا و15 صفحة ثابتة و22 فئة و70 منتجًا و70 مقالًا و39 مكوّنًا، مع 13 ملفًا معدّلًا و185 إضافة و27 حذفًا و43 اختبارًا ناجحًا. هذه أرقام مرحلة موثّقة.',
              en: 'At one documented audit stage the audit covered 177 URLs, 15 static pages, 22 categories, 70 products, 70 articles and 39 components, with 13 files changed, 185 additions, 27 deletions and 43 passing tests. These are documented-stage figures.',
              ru: 'На одном задокументированном этапе аудита было охвачено 177 адресов, 15 статических страниц, 22 категории, 70 товаров, 70 статей и 39 компонентов, изменено 13 файлов, 185 добавлений, 27 удалений и 43 успешных теста. Это цифры задокументированного этапа.',
            },
            {
              ar: 'تحليل لاحق في Search Console أعاد لقطة مختلفة: نحو 200 رابط، منها 75 رابط منتج، و23 فئة، و87 مقالًا، و15 صفحة ثابتة، مع 36 نقرة و464 ظهورًا ونسبة نقر 7.76% ومتوسط ترتيب 4.0. هذه لقطة من تاريخ تحليل محدد، وليست حركة اليوم ولا نتيجة دائمة.',
              en: 'A later Search Console analysis reported a different snapshot: about 200 URLs, 75 product URLs, 23 categories, 87 articles and 15 static pages, with 36 clicks, 464 impressions, a 7.76% click-through rate and an average position of 4.0. This is a snapshot from one analysis date, not current traffic and not a permanent result.',
              ru: 'Более поздний анализ в Search Console дал другую картину: около 200 адресов, из них 75 страниц товаров, 23 категории, 87 статей и 15 статических страниц, 36 переходов, 464 показа, доля переходов 7,76% и средняя позиция 4,0. Это снимок на конкретную дату анализа, а не сегодняшний трафик и не постоянный результат.',
            },
          ],
        },
        {
          h: { ar: 'الأمن', en: 'Security', ru: 'Безопасность' },
          items: [
            {
              ar: 'مرّت المنصّة بمرحلة تدقيق أمني وتقوية مخصّصة، لا مجرد إعدادات افتراضية.',
              en: 'The platform went through a dedicated security-audit and hardening phase, not just default settings.',
              ru: 'Платформа прошла отдельный этап аудита безопасности и усиления защиты, а не только настройки по умолчанию.',
            },
            {
              ar: 'مصادقة مخصّصة للمتجر وللإدارة عبر رموز موقّعة داخل كوكيز HttpOnly، وكلمات مرور الإدارة مُجزّأة بـ bcrypt، مع تحقق ثنائي اختياري للعميل.',
              en: 'Custom authentication for storefront and admin using signed tokens in HttpOnly cookies, with admin passwords hashed by bcrypt and an optional second factor for customers.',
              ru: 'Собственная аутентификация для витрины и административной части на подписанных токенах в HttpOnly-куки, с хешированием паролей администратора через bcrypt и необязательным вторым фактором для клиентов.',
            },
            {
              ar: 'حماية مسارات وواجهات الإدارة وتحديد معدّل الطلبات، وإبقاء الأسرار على الخادم فقط، وتفويض نقطة تشغيل الأتمتة.',
              en: 'Protected admin routes and APIs, request rate limiting, secrets kept server-side only, and authorisation for the automation endpoint.',
              ru: 'Защита административных маршрутов и API, ограничение частоты запросов, хранение секретов только на сервере и авторизация конечной точки автоматизации.',
            },
            {
              ar: 'رموز إلغاء اشتراك موقّعة بخوارزمية HMAC-SHA256، وجلب خارجي يراعي مخاطر الطلبات المزوّرة، ومعالجة حذرة للبيانات الحساسة، واستبعاد الأسطح الخاصة من محركات البحث.',
              en: 'Unsubscribe tokens signed with HMAC-SHA256, external fetching that accounts for request-forgery risk, careful handling of sensitive data, and search-engine exclusion for private surfaces.',
              ru: 'Токены отписки, подписанные по HMAC-SHA256, внешние запросы с учётом риска подделки, осторожная обработка чувствительных данных и исключение приватных разделов из поиска.',
            },
            {
              ar: 'لا تُنشَر هنا أي بيانات دخول أو مفاتيح أو رموز أو عناوين قاعدة بيانات أو تفاصيل بنية تحتية خاصة.',
              en: 'No credentials, keys, tokens, database addresses or private infrastructure details are published here.',
              ru: 'Здесь не публикуются учётные данные, ключи, токены, адреса базы данных или сведения о приватной инфраструктуре.',
            },
          ],
        },
        {
          h: { ar: 'الهندسة والاختبار', en: 'Engineering and testing', ru: 'Разработка и тестирование' },
          items: [
            {
              ar: 'معمارية مستودع واحد يضم واجهة المتجر وتطبيق الإدارة منفصلين، مع حزمة بيانات مشتركة، حتى تتطوّر تجربة العميل وتشغيل الإدارة كلٌّ على حدة.',
              en: 'A single repository holding the storefront and the admin application separately, with a shared data package, so the customer experience and operations evolve independently.',
              ru: 'Единый репозиторий, где витрина и административное приложение разделены, с общим пакетом данных, чтобы клиентский опыт и операции развивались независимо.',
            },
            {
              ar: 'التقنيات الأساسية: Next.js و Node.js و Prisma و PostgreSQL و Supabase (مع التخزين لصور المنتجات)، والنشر على Hostinger.',
              en: 'Core stack: Next.js, Node.js, Prisma, PostgreSQL and Supabase (with Storage for product images), deployed on Hostinger.',
              ru: 'Основной стек: Next.js, Node.js, Prisma, PostgreSQL и Supabase (включая хранилище изображений товаров), развёрнутый на Hostinger.',
            },
            {
              ar: 'البريد عبر Brevo لدورة الحياة والمعاملات، بإعداد يبقى على الخادم.',
              en: 'Email through Brevo for lifecycle and transactional messages, with configuration kept on the server.',
              ru: 'Почта через Brevo для писем жизненного цикла и транзакционных писем, с конфигурацией на сервере.',
            },
            {
              ar: 'اختبارات لقاعدة البيانات عبر Prisma وللأمن وللتحقق الثنائي ولتحسين محركات البحث وللصور ولإعداد البريد؛ في مرحلة موثّقة: 3/3 و27/27 و8/8 و8/8 و17/17، وأضافت مرحلة لاحقة 37/37 و12/12 مع نجاح بناء المتجر والإدارة واجتياز فحص الأنواع.',
              en: 'Tests for the database through Prisma, security, the second factor, SEO, images and email configuration; at one documented stage 3/3, 27/27, 8/8, 8/8 and 17/17, and a later phase added 37/37 and 12/12 with successful storefront and admin builds and passing type checks.',
              ru: 'Тесты базы данных через Prisma, безопасности, второго фактора, SEO, изображений и настройки почты; на одном задокументированном этапе 3/3, 27/27, 8/8, 8/8 и 17/17, а более поздний этап добавил 37/37 и 12/12 при успешных сборках витрины и админ-панели и пройденной проверке типов.',
            },
            {
              ar: 'تحقّق في بيئة الإنتاج يغطي البناء والصفحات المُصيَّرة وخريطة الموقع وروابط ممثّلة وحالة الاستجابة والعنوان والوصف والرابط الأساسي ووسوم robots والعناوين والبيانات المنظّمة ومسار التنقّل والروابط الداخلية والاستجابة والشاشة والأخطاء في الطرفية.',
              en: 'Production verification covering builds, rendered pages, the sitemap, representative URLs, response status, title, description, canonical, robots, headings, structured data, breadcrumbs, internal links, responsiveness and console errors.',
              ru: 'Проверка в рабочей среде: сборка, отрендеренные страницы, карта сайта, характерные адреса, код ответа, заголовок, описание, канонический адрес, robots, заголовки, структурированные данные, хлебные крошки, внутренние ссылки, адаптивность и ошибки в консоли.',
            },
            {
              ar: 'المنصّة تُطوَّر وتُحسَّن باستمرار بدل أن تُبنى مرة واحدة ثم تُترك.',
              en: 'The platform is improved and optimised continuously rather than built once and abandoned.',
              ru: 'Платформа постоянно улучшается и оптимизируется, а не создаётся один раз и забрасывается.',
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