/* ============================================================
   DATA/VOLLEYBALL.JS  —  Volleyball activity data (sports side)
   ------------------------------------------------------------
   Same unified shape as data/events.js (see that file for the full
   schema: title/date/location/description/whatIDid/whatILearned/
   skills/image/images/certificate/videoUrl/people/links, plus the
   volleyball extras team/opponent/result/stats/notes). One reader:
   js/media-system.js. The sports page grid points at this array via
   data-events-source="volleyballData".

   INTENTIONALLY EMPTY (§28 / GOLDEN RULE — never invent progress).
   Hussein hasn't started training or matches yet; that begins after
   the move to Russia. No fake matches, scores, teams, photos, or
   stats live here. Add real activities (type: 'volleyball') and each
   one renders automatically — same premium card, detail modal,
   fullscreen viewer and gallery used everywhere else — with zero
   markup changes. Until then the page shows an honest empty state.

   IMAGE PATHS: write them relative to the academic/ folder
   (e.g. 'assets/volleyball/first-training.jpg'). media-system.js
   resolveMediaPath() adds the right hop for the sports/ page
   automatically, so the same path works everywhere.

   Example (add only when real):
   {
     id: 'first-training',
     type: 'volleyball',
     title:  { en: '…', ar: '…', ru: '…' },
     date:   { en: '…', ar: '…', ru: '…' },
     location: { en: 'City, Country', ar: '…', ru: '…' },
     description:  { en: '…', ar: '…', ru: '…' },
     whatILearned: { en: '…', ar: '…', ru: '…' },
     team: 'My team', opponent: 'Opponent', result: 'Won 3–1',
     image: 'assets/volleyball/first-training.jpg',
     images: [ { src: 'assets/volleyball/1.jpg', caption: { en: '…', ar: '…', ru: '…' } } ],
   }
   ============================================================ */

const volleyballData = [
  {
    id: 'first-friendly-tournament',
    type: 'volleyball',
    badge: { en: 'Al-Taawoon', ar: 'نادي التعاون', ru: 'Ат-Тааун' },
    title: {
      en: 'My First Friendly Volleyball Tournament',
      ar: 'أول بطولة ودية للكرة الطائرة',
      ru: 'Мой первый товарищеский волейбольный турнир',
    },
    role: {
      en: 'Middle Blocker',
      ar: 'حائط الصد',
      ru: 'Центральный блокирующий',
    },
    position: {
      en: 'Middle Blocker',
      ar: 'حائط الصد',
      ru: 'Центральный блокирующий',
    },
    date: { en: 'Ramadan 2023', ar: 'رمضان 2023', ru: 'Рамадан 2023' },
    location: { en: 'Engineering Syndicate Club, Cairo', ar: 'نادي نقابة المهندسين، القاهرة', ru: 'Клуб Инженерного союза, Каир' },
    organization: {
      en: 'Al-Taawoon Sporting Club — Al Haram',
      ar: 'نادي التعاون الرياضي بالهرم',
      ru: 'Спортивный клуб «Ат-Тааун» — Аль-Харам',
    },
    team: {
      en: 'Al-Taawoon Sporting Club (Al-Taawoon)',
      ar: 'نادي التعاون الرياضي بالهرم (نادي التعاون)',
      ru: 'Спортивный клуб «Ат-Тааун»',
    },
    result: {
      en: '3rd Place',
      ar: 'المركز الثالث',
      ru: '3-е место',
    },
    description: {
      en: 'My first competitive volleyball experience — a friendly tournament during Ramadan, where I played as a Middle Blocker and earned 3rd place.',
      ar: 'أول تجربة تنافسية في الكرة الطائرة — بطولة ودية في رمضان، لعبت فيها كحاجز مركزي وحصلنا على المركز الثالث.',
      ru: 'Мой первый соревновательный опыт в волейболе — товарищеский турнир в Рамадан, где я играл центральным блокирующим и занял 3-е место.',
    },
    whatIDid: {
      en: 'Played as a Middle Blocker, contributed to the team\'s defensive and offensive blocks, and helped the team achieve 3rd place in the tournament.',
      ar: 'لعبتُ كحاجز مركزي، وساهمتُ في الدفاع والهجوم بالحجب مع الفريق، وساعدتُ الفريق في الحصول على المركز الثالث في البطولة.',
      ru: 'Играл центральным блокирующим, вносил вклад в оборонительные и атакующие блоки команды и помог команде занять 3-е место на турнире.',
    },
    whatILearned: {
      en: 'The value of teamwork under pressure, reading opponents\' attacks, and staying composed during competitive play.',
      ar: 'قيمة العمل الجماعي تحت الضغط، وقراءة هجمات الخصوم، والحفاظ على الهدوء أثناء اللعب التنافسي.',
      ru: 'Ценность командной игры под давлением, умение читать атаки соперников и сохранять спокойствие во время соревновательной игры.',
    },
    skills: [
      { en: 'Teamwork', ar: 'العمل الجماعي', ru: 'Командная работа' },
      { en: 'Blocking', ar: 'الحجب', ru: 'Блокирование' },
      { en: 'Competitive Play', ar: 'اللعب التنافسي', ru: 'Соревновательная игра' },
      { en: 'Communication', ar: 'التواصل', ru: 'Коммуникация' },
    ],
    notes: {
      en: 'Played under the name of Al-Taawoon Sporting Club in Al Haram — a grassroots club, not registered with the Federation. I have never joined an official federation-registered team; that is the dream I could not realize in Egypt, and the one I intend to achieve in Russia.',
      ar: 'لعبتُ باسم نادي التعاون الرياضي بالهرم — نادٍ شعبي غير مسجَّل في الاتحاد. لم أنضمّ يومًا لفريق رسمي مسجَّل في الاتحاد؛ هذا هو الحلم الذي لم أستطع تحقيقه في مصر، وأنوي تحقيقه في روسيا.',
      ru: 'Играл под именем спортивного клуба «Ат-Тааун» в Аль-Хараме — это любительский клуб, не зарегистрированный в Федерации. Я никогда не состоял в официальной команде, зарегистрированной в Федерации; это мечта, которую я не смог осуществить в Египте и намерен воплотить в России.',
    },
    image: 'assets/volleyball/tournaments/first-friendly-tournament/cover.jpg',
    certificate: 'assets/volleyball/tournaments/first-friendly-tournament/certificate.jpg',
    images: [
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-01.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-02.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-03.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-04.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-05.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-06.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-07.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-08.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
      { src: 'assets/volleyball/tournaments/first-friendly-tournament/photo-09.jpg', caption: { en: 'Tournament moment', ar: 'لحظة من البطولة', ru: 'Момент турнира' } },
    ],
  },
  {
    id: 'activation-tournament-2023',
    type: 'volleyball',
    badge: { en: 'Al-Safa Center', ar: 'مركز شباب الصفا', ru: 'Центр Ас-Сафа' },
    title: {
      en: 'Volleyball Activation Tournament',
      ar: 'الدورة التنشيطية للكرة الطائرة',
      ru: 'Активационный волейбольный турнир',
    },
    role: {
      en: 'Middle Blocker',
      ar: 'حائط الصد',
      ru: 'Центральный блокирующий',
    },
    position: {
      en: 'Middle Blocker',
      ar: 'حائط الصد',
      ru: 'Центральный блокирующий',
    },
    date: { en: 'Thursday, 19 October 2023', ar: 'الخميس 19 أكتوبر 2023', ru: 'Четверг, 19 октября 2023' },
    organization: {
      en: 'Al-Safa Youth Center — Al Haram',
      ar: 'مركز شباب الصفا بالهرم',
      ru: 'Молодёжный центр «Ас-Сафа» — Аль-Харам',
    },
    team: {
      en: 'Al-Safa Youth Center — Al Haram (Boys)',
      ar: 'مركز شباب الصفا بالهرم (بنين)',
      ru: 'Молодёжный центр «Ас-Сафа» — Аль-Харам (юноши)',
    },
    opponent: {
      en: 'Al-Taawoon Sporting Club (Boys)',
      ar: 'نادي التعاون الرياضي (بنين)',
      ru: 'Спортивный клуб «Ат-Тааун» (юноши)',
    },
    result: {
      en: 'Won 3–0',
      ar: 'فوز 3–صفر',
      ru: 'Победа 3–0',
    },
    description: {
      en: 'A friendly volleyball activation event between Al-Safa Youth Development Center, Al-Talbeya Club, and Al-Taawoon Club. Playing Middle Blocker for the Al-Safa boys\' team, we won our match 3–0.',
      ar: 'دورة تنشيطية ودية للكرة الطائرة بين مركز الصفا للتنمية الشبابية ونادي الطالبية ونادي التعاون. لعبتُ حائط صد مع فريق الصفا (بنين)، وفاز فريقنا بالمباراة 3–صفر.',
      ru: 'Товарищеский активационный турнир по волейболу между молодёжным центром «Ас-Сафа», клубом «Ат-Тальбия» и клубом «Ат-Тааун». Играя центральным блокирующим за команду юношей «Ас-Сафа», мы выиграли наш матч со счётом 3–0.',
    },
    whatIDid: {
      en: 'Played as a Middle Blocker for the Al-Safa boys\' team and helped secure a clean 3–0 win over Al-Taawoon.',
      ar: 'لعبتُ كحائط صد مع فريق الصفا (بنين) وساهمتُ في تحقيق فوز نظيف 3–صفر على نادي التعاون.',
      ru: 'Играл центральным блокирующим за команду юношей «Ас-Сафа» и помог одержать чистую победу 3–0 над «Ат-Тааун».',
    },
    whatILearned: {
      en: 'Reading opponents\' attacks at the net, timing blocks, and keeping the team\'s rhythm across a full clean-sweep match.',
      ar: 'قراءة هجمات الخصم عند الشبكة، وضبط توقيت الصد، والحفاظ على إيقاع الفريق طوال مباراة فوز كامل.',
      ru: 'Чтение атак соперника у сетки, тайминг блоков и удержание ритма команды на протяжении матча, выигранного всухую.',
    },
    skills: [
      { en: 'Blocking', ar: 'الحجب', ru: 'Блокирование' },
      { en: 'Net Reading', ar: 'قراءة الشبكة', ru: 'Чтение у сетки' },
      { en: 'Teamwork', ar: 'العمل الجماعي', ru: 'Командная работа' },
      { en: 'Competitive Play', ar: 'اللعب التنافسي', ru: 'Соревновательная игра' },
    ],
    notes: {
      en: 'Played under the name of Al-Safa Youth Center in Al Haram — a grassroots center, not registered with the Federation. Held under technical director Captain Ibrahim Fawzy Abdel-Meguid, and supervised by Ms. Nahad Gad, the center\'s volleyball coordinator.',
      ar: 'لعبتُ باسم مركز شباب الصفا بالهرم — مركز شعبي غير مسجَّل في الاتحاد. أُقيمت تحت قيادة المدير الفني كابتن إبراهيم فوزي عبد المجيد، وإشراف الأستاذة نهاد جاد مسؤولة رياضة الكرة الطائرة بالمركز.',
      ru: 'Играл под именем молодёжного центра «Ас-Сафа» в Аль-Хараме — это любительский центр, не зарегистрированный в Федерации. Проведён под руководством технического директора капитана Ибрагима Фаузи Абдель-Меджида и под наблюдением г-жи Нахад Гад, координатора волейбола центра.',
    },
    image: 'assets/volleyball/tournaments/activation-tournament-2023/cover.jpg',
    images: [
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-01.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-02.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-03.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-04.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-05.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
      { src: 'assets/volleyball/tournaments/activation-tournament-2023/photo-06.jpg', caption: { en: 'Activation tournament', ar: 'الدورة التنشيطية', ru: 'Активационный турнир' } },
    ],
  },
];

// Expose for js/media-system.js (read via data-events-source="volleyballData").
if (typeof window !== 'undefined') {
  window.volleyballData = volleyballData;
}
