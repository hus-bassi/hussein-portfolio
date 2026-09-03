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
      en: 'Al Taawoon Sporting Club, Al Haram',
      ar: 'نادي التعاون الرياضي، الهرم',
      ru: 'Спортивный клуб Аль-Таавун, Аль-Харам',
    },
    team: {
      en: 'Al Taawoon Sporting Club',
      ar: 'نادي التعاون الرياضي',
      ru: 'Спортивный клуб Аль-Таавун',
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
];

// Expose for js/media-system.js (read via data-events-source="volleyballData").
if (typeof window !== 'undefined') {
  window.volleyballData = volleyballData;
}
