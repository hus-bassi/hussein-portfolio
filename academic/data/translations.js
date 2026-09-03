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
    navWork: 'Work',
    navCertificates: 'Certificates',
    navVolunteering: 'Volunteering',
    navJourney: 'Journey',
    navGoals: 'Goals',
    navProjects: 'Projects',
    navResearch: 'Research',
    navSkills: 'Skills',
    navCv: 'CV',
    navPortal: 'Portal',
    navVolleyball: 'Volleyball',
    navAcademic: 'Academic',

    // Global identity — site / personal name, localized (one source
    // of truth). Used via data-i18n="siteName" on the logo, hero h1,
    // footer brand and copyright, so the name follows the language
    // automatically with no refresh re-typing anywhere.
    siteName: 'Hussein ElBassiouni',

    // Hero
    heroEyebrow: 'Current Journey',
    heroSubtitle: 'Aspiring Data Scientist — with a Vision for Astronomy',
    heroLead: 'Building my path from strong foundations to Data Science, and, eventually, toward Astroinformatics.',
    heroCtaPrimary: 'Explore My Journey',
    heroCtaSecondary: 'View Certificates',

    // Short Introduction
    aboutEyebrow: 'About',
    aboutHeading: 'A clear starting point, aimed at a defined direction.',
    aboutPara1: "Hussein is a 2022 Egyptian high-school graduate, currently pursuing a university scholarship in Russia — in business, economics, statistics, or any field that serves the bigger goal. No specific scholarship is secured yet; it's a deliberate first step, not the destination — the foundation he's using to build real strength in programming, mathematics, statistics, and data science, while collecting certificates toward the goal before specializing further.",
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
    visionPara1: "From foundations, to Data Science, to Astronomy — that's the direction, not a claim of having arrived.",
    visionPara2: "The long-term ambition is real: contributing to serious research in Astroinformatics, and one day working alongside international scientific institutions — with NASA as a distant, honest reach rather than a promise. It's approached one deliberate stage at a time, starting from exactly where things stand today.",
    readFullVision: 'Read the Full Vision',

    // Final CTA
    finalCtaEyebrow: 'Get In Touch',
    finalCtaHeading: 'Follow the journey from here',
    finalCtaLead: 'Certificates, volunteer experience, and the academic path ahead — all in one place, growing as the journey does.',
    finalCtaContact: 'Contact Me',

    // Footer
    footerMission: 'Building a path from strong foundations to Data Science, and eventually toward Astroinformatics.',

    // ---- Internal pages (Phase 12.2) ----

    // Common (shared across internal pages)
    skipToContent: 'Skip to main content',
    ctaAcademicJourney: 'Academic Journey',
    viewCertificates: 'View Certificates',

    // About page
    aboutPageTitle: 'The story so far',
    aboutPageLead: 'Not a finished résumé — a clear account of where things stand today, and how Hussein is approaching the path ahead.',
    aboutStory1Title: 'Where it started',
    aboutStory1Body: "Hussein graduated Egyptian high school in 2022. Since then, the focus has been on building — deliberately and honestly — toward a long-term goal that's still years away: working at the intersection of data science and astronomy.",
    aboutStory2Title: 'Why foundations first',
    aboutStory2Body: "The next academic step is a university scholarship in Russia — in business, economics, statistics, or any field that serves the bigger goal. No specific scholarship is secured yet, and it isn't the destination — it's chosen deliberately as a foundation: a structured environment to build real strength in programming, mathematics, statistics, and analytical thinking, alongside English, Russian, and the language requirements the path ahead calls for. In the meantime, the work continues — preparing and collecting certificates toward that goal.",
    aboutStory3Title: 'Why Astroinformatics',
    aboutStory3Body: "Data science is a broad field. Astronomy is where curiosity has consistently pulled toward — the scale of the questions it asks, and the amount of real, complex data behind every answer. Astroinformatics sits exactly at that intersection: using data science methods to actually do astronomy. That's the long-term direction, approached one honest stage at a time rather than claimed in advance.",
    aboutValuesEyebrow: 'How I Work',
    aboutValuesHeading: 'What guides the process',
    aboutValue1Title: 'Curiosity',
    aboutValue1Body: 'Asking why something works, not just learning that it does.',
    aboutValue2Title: 'Discipline',
    aboutValue2Body: 'Consistent, unglamorous effort over long periods of time.',
    aboutValue3Title: 'Academic Excellence',
    aboutValue3Body: 'Taking the fundamentals seriously before rushing toward specialization.',
    aboutValue4Title: 'Exploration',
    aboutValue4Body: 'Staying open to what a field actually needs, not just what looks impressive.',
    aboutCtaEyebrow: 'Keep Exploring',
    aboutCtaHeading: 'See the journey in more detail',

    // Goals page
    goalsEyebrow: 'Future Goals',
    goalsTitle: 'Beyond the Stars',
    goalsLead: 'Ambitious, honestly stated, and not yet achieved. This page is a direction, not a résumé line.',
    goalsMissionEyebrow: 'My Mission',
    goalsMissionHeading: 'From Foundations, to Data Science, to Astronomy',
    goalsMissionPara1: "That's the direction stated as plainly as possible — not a claim of having arrived anywhere on it yet. Every stage before this one exists to make the next stage possible.",
    goalsMissionPara2: 'The long-term aim is to do real, meaningful work in Astroinformatics: using data science methods to help answer genuine astronomical questions, at a level serious enough to matter to the field itself.',
    goalsAimEyebrow: "What I'm Aiming For",
    goalsAimHeading: 'Long-term, not yet reached',
    goalsAimLead: "Stated as goals because that's what they are — not achievements, not credentials, not promises.",
    goalsAim1Title: 'Contribute to Astroinformatics Research',
    goalsAim1Body: 'Do work that genuinely helps answer real astronomical questions using data science methods.',
    goalsAim2Title: 'Work Alongside Serious Institutions',
    goalsAim2Body: 'Collaborate with research groups and universities doing real work in this space — earned, not assumed.',
    goalsAim3Title: 'Reach for NASA-Adjacent Research',
    goalsAim3Body: 'A distant, honestly-stated reach — a direction to grow toward, not a claim being made today.',
    goalsAim4Title: 'Publish Meaningful Work',
    goalsAim4Body: "Contribute research that holds up on its own merit, once there's something real to contribute.",
    goalsCtaEyebrow: 'See the Full Picture',
    goalsCtaHeading: 'None of this happens without the steps before it',

    // Journey page
    journeyPageTitle: 'The Full Path — Past, Present, and Planned',
    journeyPageLead: 'One stage is complete. One is happening right now. Everything else is a stated plan, shown honestly as a plan — not as something already achieved.',
    statusCompleted: 'Completed',
    statusInProgress: 'In Progress',
    statusPlanned: 'Planned',
    statusVision: 'Vision',
    dateNow: 'Now',
    dateNext: 'Next',
    dateAlongside: 'Alongside',
    dateGoal: 'Goal',
    dateLongTerm: 'Long-Term',
    journeyItem1Title: 'High School Graduation',
    journeyItem1Body: 'Graduated from an Egyptian high school, closing out secondary education and opening the question of what comes next.',
    journeyItem2Title: 'Building the Academic Foundation',
    journeyItem2Body: 'Actively preparing ahead of starting university — not waiting for a formal program to begin before doing the work.',
    journeyItem3Title: 'University Scholarship — Russia',
    journeyItem3Body: 'A deliberate first academic step, not the destination — a university scholarship in business, economics, statistics, or any field that builds real analytical and quantitative strength toward the bigger goal. No specific scholarship is secured yet; I am actively preparing for it and collecting certificates toward it.',
    journeyItem4Title: 'Skills Development',
    journeyItem4Body: 'Python, Mathematics, Statistics, English, and Russian — developed in parallel with the degree itself, not deferred until after it.',
    journeyItem5Title: "Master's in Data Science",
    journeyItem5Body: 'Formal specialization in the field this whole path has been building toward.',
    journeyItem6Title: 'Research in Astroinformatics',
    journeyItem6Body: 'Applying data science methods directly to astronomy — the specific intersection this entire journey is aimed at.',
    journeyItem7Title: 'PhD — Astronomy & Data Science',
    journeyItem7Body: 'A distant, honestly-stated ambition, not a certainty — pursued only if the path up to this point earns it.',
    journeyItem8Title: 'Research Career — Global Scientific Research',
    journeyItem8Body: 'Contributing to serious international research, potentially alongside institutions like NASA — the farthest point on this map, and the reason for every step before it.',
    homeTlBody1: 'Graduated from an Egyptian high school.',
    homeTlBody2: 'Actively developing the skills covered in the Current Mission section above.',
    homeTlBody3: 'A scholarship for university study — business, economics, statistics, or any field that serves the bigger goal. Not secured yet; actively preparing and collecting certificates toward it.',
    homeTlBody4: 'Specializing formally in the field this whole path is building toward.',
    homeTlBody5: 'Applying data science to astronomy, and contributing to research alongside serious scientific institutions.',

    // Certificates page
    certificatesPageTitle: 'All Certificates',
    certificatesPageLead: 'A growing, honest record — this list gets longer over time, not all at once.',
    certificatesSearchLabel: 'Search certificates',
    certificatesSearchPlaceholder: 'Search by title, provider, or keyword...',
    certificatesEmpty: 'No certificates match your search.',
    certModalNoImage: 'Certificate image not added yet',
    certModalCredential: 'View Credential',
    certModalClose: 'Close',

    // Volunteering page
    volunteeringPageTitle: 'Contributing Beyond the Classroom',
    volunteeringPageLead: 'Every entry below is real experience, presented with what it actually involved — not padded to look bigger than it was.',

    // Projects page
    projectsPageLead: 'This section will grow as real, substantial work exists to show — nothing is placed here just to fill space.',
    projectsEmpty: 'No projects yet — check back as this section grows.',

    // Research page
    researchPageLead: 'Nothing published yet — this page exists for when there is.',
    researchEmpty: 'No research published yet — check back as this section grows.',

    // Skills page
    skillsPageLead: 'Honest self-assessment, not a sales pitch — levels here are text labels, never invented percentages.',
    skillsEmpty: 'No skill levels recorded yet.',

    // CV page
    cvPageTitle: 'Curriculum Vitae',
    cvPageLead: 'Stays current automatically — pulled from the same data as the rest of the site.',
    cvPrintBtn: 'Print / Save as PDF',
    cvProfile: 'Profile',
    cvProfileBody: "2022 Egyptian high-school graduate, pursuing a university scholarship in Russia — in business, economics, or statistics — as a deliberate first step toward Data Science, and eventually Astroinformatics. No specific scholarship is secured yet; actively preparing and collecting certificates toward the goal.",
    cvEducation: 'Education',
    cvEduHsTitle: 'High School Diploma',
    cvEduHsBody: 'Egyptian high school — completed.',
    cvEduBscTitle: 'Undergraduate Scholarship',
    cvEduBscBody: 'Russia — business, economics, or statistics; not yet secured.',

    // Volunteering empty state (shared: homepage preview + page)
    volunteeringEmpty: 'More volunteering experiences are on the way.',

    // Portal (gateway) — the site-root choice screen
    portalPrompt: 'Which side are you here for?',
    portalConnect: 'Connect with me',
    portalAcademicEyebrow: 'Academic & Professional',
    portalAcademicTitle: 'Data Science & Astronomy',
    portalAcademicDesc: 'Certificates, academic journey, projects, research, and the long-term path toward Astroinformatics.',
    portalSportsEyebrow: 'Volleyball & Sports',
    portalSportsTitle: 'Volleyball',
    portalSportsDesc: 'Training, matches, and progress — starting soon in Russia.',
    portalEnter: 'Enter',

    // Digital Presence (homepage) + Discord community CTA
    digitalEyebrow: 'Digital Presence',
    digitalHeading: 'Where the journey is shared',
    digitalLead: 'The same path, shared across the places I create and connect in — academic work, projects, and everyday content.',
    digitalCreatorLine: 'Academic by direction. Creative by practice.',
    discordTitle: 'Join the Community',
    discordSubtitle: 'A relaxed Discord server for the journey — say hi.',
    discordButton: 'Join the Server',
    opensNewTab: 'opens in a new tab',

    // Volleyball (sports) page
    volleyballEyebrow: 'Beyond Academics',
    volleyballTitle: 'Volleyball',
    volleyballLead: 'A part of the story off the screen — teamwork, discipline, and play. This space grows as there are real moments to show.',
    volleyballEmpty: 'More volleyball stories coming soon.',

    // --- Premium Volleyball universe (page-volleyball skin) ---
    volleyKicker: 'A developing player. A love for attacking and blocking. An honest journey.',
    volleyTitleA: 'Volleyball',
    volleyTitleB: 'Journey',
    volleySub: 'A developing volleyball player with a grassroots background, a preference for Middle Blocker, and a long-term commitment to the road ahead.',
    volleyCtaStory: 'The journey',
    volleyCtaAcademic: 'Academic journey',
    volleyTicker: 'First tournament · Third place · Next chapter',

    // Athlete profile
    volleyProfileTitle: 'Player profile',
    volleyPosLabel: 'Position',
    volleyPos: 'Middle Blocker',
    volleyNameLabel: 'Identity',
    volleyName: 'Hussein',
    volleyDobLabel: 'Born',
    volleyDob: 'June 9, 2004',
    volleyHeightLabel: 'Height',
    volleyHeight: '188 cm',
    volleyStyleLabel: 'Preference',
    volleyStyle: 'Versatile — at home anywhere except Libero. I especially enjoy attacking and blocking.',
    volleyRoleLine: 'A developing player with a grassroots background — not on any professional team. The story is told as it is.',

    // Grassroots
    volleyGrassTitle: 'Where it began',
    volleyGrassLead: 'My journey did not begin in a professional club. It began on local courts, in youth centers, with friends, informal teams, and a genuine love for volleyball.',

    // First tournament
    volleyFirstEyebrow: 'First tournament',
    volleyFirstTitle: 'My First Friendly Volleyball Tournament',
    volleyFirstYear: 'Ramadan 2023',
    volleyFirstTeamLabel: 'Team',
    volleyFirstTeam: 'Al Taawoon Sporting Club — Al Haram',
    volleyFirstVenueLabel: 'Venue',
    volleyFirstVenue: 'Engineering Syndicate Club',
    volleyFirstPosLabel: 'Position',
    volleyFirstPos: 'Middle Blocker',
    volleyFirstResLabel: 'Result',
    volleyFirstRes: 'Third Place',
    volleyFirstStory: 'I played this first tournament with a knee injury. For me it was a personal challenge more than a win — and a memory I keep. After the tournament we gathered and shared Iftar together during Ramadan.',
    volleyGallery: 'View gallery',
    volleyCertificate: 'View certificate',

    // Honest numbers
    volleyStatsTitle: 'In real numbers',
    volleyStatFirstNum: '01',
    volleyStatFirstLabel: 'First tournament',
    volleyStatPlaceNum: '03',
    volleyStatPlaceLabel: 'Third place',
    volleyStatPosNum: 'MB',
    volleyStatPosLabel: 'Middle blocker',

    // Timeline — six honest stages
    volleyTimelineTitle: 'The road so far',
    volleyTl1Time: 'Grassroots beginnings',
    volleyTl1Title: 'The beginning',
    volleyTl1Sub: 'Local courts, youth centers, friends, and informal teams.',
    volleyTl2Time: '2023',
    volleyTl2Title: 'First friendly tournament',
    volleyTl2Sub: 'Third Place — played with a knee injury, Iftar together after.',
    volleyTl3Time: '2023–2025',
    volleyTl3Title: 'Local & community play',
    volleyTl3Sub: 'Booked games with friends and community teams — the love of the game kept growing.',
    volleyTl4Time: 'After 2025',
    volleyTl4Title: 'A turning point',
    volleyTl4Sub: 'I stepped back after an eye injury and travel circumstances. The goal did not change.',
    volleyTl5Time: 'Current',
    volleyTl5Title: 'Athletic development',
    volleyTl5Sub: 'In progress — building strength, mobility, conditioning, and craft.',
    volleyTl6Time: 'Future',
    volleyTl6Title: 'Continue volleyball',
    volleyTl6Sub: 'A long-term commitment to keep playing outside Egypt.',

    // Turning point
    volleyTurnTitle: 'A turning point',
    volleyTurnMsg: 'The path changed after 2025, but the goal did not.',
    volleyTurnSub: 'After 2025 I stepped back from competitive play because of an eye injury and my travel circumstances. The goal — to keep growing as a player and continue the journey — did not change.',

    // Athletic development
    volleyDevTitle: 'Athletic development',
    volleyDevStatus: 'Status',
    volleyDevStatusVal: 'In progress',
    volleyDevBody: 'Building the foundation for the next chapter — strength, mobility, conditioning, plyometrics, and volleyball-specific training. No claims yet, just steady work.',

    // Next chapter
    volleyNextTitle: 'The next chapter',
    volleyNextLead: 'Continue volleyball outside Egypt. The journey is not over — it is simply taking a new route.',
    volleyFollowing: 'Developing athlete · Middle Blocker · Long-haul commitment',

    // Memories
    volleyMemTitle: 'Memories',
    volleyMemLead: 'Early memories from the first tournament — kept as they were.',

    // Media viewer & event controls (built in JS by media-system.js —
    // these can't be reached by data-i18n, so the labels are resolved
    // from this table at build/switch time instead)
    mvLabel: 'Media viewer',
    mvClose: 'Close viewer',
    mvPrev: 'Previous image',
    mvNext: 'Next image',
    mvUnavailable: 'Image not available.',
    eventClose: 'Close',
    eventViewCert: 'View certificate',
    eventViewFull: 'View image full screen',
    eventOpenImage: 'Open image',
    eventWatchVideo: 'Watch video',
    eventWhatIDid: 'What I did',
    eventWhatILearned: 'What I learned',
    eventSkills: 'Skills',
    eventPeople: 'People',
    eventGallery: 'Gallery',
    eventVideo: 'Video',
    eventLinks: 'Links',
    eventViewExperience: 'View experience',
    eventPhotos: 'Photos',
    eventCertificate: 'Certificate',
    eventPosition: 'Position',
    eventVlog: 'Vlog',
    eventVs: 'vs',
    eventResult: 'Result',
    eventStats: 'Stats',
    eventNotes: 'Notes',
  },

  ar: {
    // Navigation
    navHome: 'الرئيسية',
    navAbout: 'نبذة عني',
    navWork: 'الأعمال',
    navCertificates: 'الشهادات',
    navVolunteering: 'التطوع',
    navJourney: 'المسار الأكاديمي',
    navGoals: 'الأهداف',
    navProjects: 'المشاريع',
    navResearch: 'الأبحاث',
    navSkills: 'المهارات',
    navCv: 'السيرة الذاتية',
    navPortal: 'البوابة',
    navVolleyball: 'الكرة الطائرة',
    navAcademic: 'الأكاديمي',
    siteName: 'حسين البسيوني',

    // Hero
    heroEyebrow: 'المسار الحالي',
    heroSubtitle: 'طموح ليكون عالِم بيانات — برؤية نحو الفلك',
    heroLead: 'أبني مساري من أساسٍ متين إلى علم البيانات، وصولًا — يومًا ما — إلى علم البيانات الفلكية.',
    heroCtaPrimary: 'اكتشف مساري',
    heroCtaSecondary: 'اطّلع على الشهادات',

    // Short Introduction
    aboutEyebrow: 'نبذة عني',
    aboutHeading: 'نقطة بداية واضحة، باتجاه محدد.',
    aboutPara1: 'حسين خريج ثانوية عامة مصرية عام 2022، ويسعى حاليًا للحصول على منحة دراسية جامعية في روسيا — في إدارة الأعمال أو الاقتصاد أو الإحصاء أو أي مجال يخدم الهدف الأكبر. لم تُحسم منحة بعينها بعد؛ وهي خطوة أولى مقصودة وليست الوجهة النهائية — الأساس الذي يستخدمه لبناء قوة حقيقية في البرمجة والرياضيات والإحصاء وعلم البيانات، مع جمع الشهادات نحو الهدف قبل التخصص أكثر.',
    aboutPara2: 'الاتجاه بعيد المدى هو علم البيانات الفلكية: تطبيق علم البيانات على الفلك. هدف طموح، يقترب منه على مراحل مدروسة، بدءًا من حيث يقف فعليًا اليوم.',

    // Current Mission
    missionEyebrow: 'المهمة الحالية',
    missionHeading: 'ما أبنيه الآن',
    missionLead: 'قبل التخصص، الأولوية هي أساس قوي وصادق في المهارات التي يتطلبها علم البيانات وعلم البيانات الفلكية فعليًا.',
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
    visionPara1: 'من الأساس، إلى علم البيانات، إلى الفلك — هذا هو الاتجاه، وليس ادّعاء بأنني وصلت إليه.',
    visionPara2: 'الطموح بعيد المدى حقيقي: المساهمة في أبحاث جادة في علم البيانات الفلكية، والعمل يومًا ما مع مؤسسات علمية دولية — مع اعتبار NASA هدفًا بعيدًا وصادقًا وليس وعدًا. يُقترب منه على مراحل مدروسة، بدءًا من حيث تقف الأمور بالضبط اليوم.',
    readFullVision: 'اقرأ الرؤية الكاملة',

    // Final CTA
    finalCtaEyebrow: 'تواصل معي',
    finalCtaHeading: 'تابع المسار من هنا',
    finalCtaLead: 'الشهادات، تجربة التطوع، والمسار الأكاديمي القادم — كلها في مكان واحد، تنمو مع نمو المسار.',
    finalCtaContact: 'تواصل معي',

    // Footer
    footerMission: 'أبني مسارًا من أساسٍ متين إلى علم البيانات، وصولًا — يومًا ما — إلى علم البيانات الفلكية.',

    // ---- Internal pages (Phase 12.2) ----

    // Common (shared across internal pages)
    skipToContent: 'تخطَّ إلى المحتوى الرئيسي',
    ctaAcademicJourney: 'المسار الأكاديمي',
    viewCertificates: 'عرض الشهادات',

    // About page
    aboutPageTitle: 'القصة حتى الآن',
    aboutPageLead: 'ليست سيرة ذاتية مكتملة — بل وصف واضح لأين تقف الأمور اليوم، وكيف يتعامل حسين مع الطريق أمامه.',
    aboutStory1Title: 'من أين بدأت',
    aboutStory1Body: 'تخرّج حسين من الثانوية العامة المصرية عام 2022. ومنذ ذلك الحين، انصبّ التركيز على البناء — بعناية وصدق — نحو هدف بعيد المدى لا يزال يبعد سنوات: العمل عند تقاطع علم البيانات وعلم الفلك.',
    aboutStory2Title: 'لماذا الأساس أولًا',
    aboutStory2Body: 'الخطوة الأكاديمية التالية هي منحة دراسية جامعية في روسيا — في إدارة الأعمال أو الاقتصاد أو الإحصاء أو أي مجال يخدم الهدف الأكبر. لم تُحسم منحة بعينها بعد، وهي ليست الوجهة النهائية — اختيرت عن قصد كأساس: بيئة منظّمة لبناء قوة حقيقية في البرمجة والرياضيات والإحصاء والتفكير التحليلي، إلى جانب الإنجليزية والروسية ومتطلبات اللغة التي يستلزمها الطريق أمامه. وفي هذه الأثناء يستمر العمل — الاستعداد وجمع الشهادات نحو ذلك الهدف.',
    aboutStory3Title: 'لماذا علم البيانات الفلكية',
    aboutStory3Body: 'علم البيانات مجال واسع. وعلم الفلك هو ما جذب الفضول إليه باستمرار — حجم الأسئلة التي يطرحها، وكمّ البيانات الحقيقية والمعقّدة خلف كل إجابة. ويقع علم البيانات الفلكية عند هذا التقاطع تمامًا: استخدام أساليب علم البيانات لممارسة الفلك فعليًا. هذا هو الاتجاه بعيد المدى، يُقترب منه مرحلة صادقة تلو الأخرى بدلًا من ادّعائه مسبقًا.',
    aboutValuesEyebrow: 'أسلوبي في العمل',
    aboutValuesHeading: 'ما الذي يوجّه العملية',
    aboutValue1Title: 'الفضول',
    aboutValue1Body: 'السؤال عن سبب عمل الشيء، لا مجرد معرفة أنه يعمل.',
    aboutValue2Title: 'الانضباط',
    aboutValue2Body: 'جهد ثابت وغير برّاق على مدى فترات طويلة.',
    aboutValue3Title: 'التميّز الأكاديمي',
    aboutValue3Body: 'أخذ الأساسيات على محمل الجدّ قبل الاندفاع نحو التخصص.',
    aboutValue4Title: 'الاستكشاف',
    aboutValue4Body: 'البقاء منفتحًا على ما يحتاجه المجال فعلًا، لا ما يبدو مبهرًا فحسب.',
    aboutCtaEyebrow: 'واصل الاستكشاف',
    aboutCtaHeading: 'اطّلع على المسار بمزيد من التفصيل',

    // Goals page
    goalsEyebrow: 'الأهداف المستقبلية',
    goalsTitle: 'ما وراء النجوم',
    goalsLead: 'طموحة، ومُصرَّح بها بصدق، ولم تتحقق بعد. هذه الصفحة اتجاه، وليست سطرًا في سيرة ذاتية.',
    goalsMissionEyebrow: 'مهمّتي',
    goalsMissionHeading: 'من الأساس، إلى علم البيانات، إلى الفلك',
    goalsMissionPara1: 'هذا هو الاتجاه مذكورًا بأوضح ما يمكن — وليس ادّعاءً بالوصول إلى أي نقطة عليه بعد. كل مرحلة قبل هذه موجودة لتجعل المرحلة التالية ممكنة.',
    goalsMissionPara2: 'الهدف بعيد المدى هو القيام بعمل حقيقي وذي قيمة في علم البيانات الفلكية: استخدام أساليب علم البيانات للمساعدة في الإجابة عن أسئلة فلكية حقيقية، بمستوى جادّ بما يكفي ليكون مهمًّا للمجال نفسه.',
    goalsAimEyebrow: 'ما أطمح إليه',
    goalsAimHeading: 'أهداف بعيدة المدى، لم تتحقق بعد',
    goalsAimLead: 'مذكورة كأهداف لأن هذا ما هي عليه — ليست إنجازات، ولا مؤهلات، ولا وعودًا.',
    goalsAim1Title: 'المساهمة في أبحاث علم البيانات الفلكية',
    goalsAim1Body: 'القيام بعمل يساعد فعلًا في الإجابة عن أسئلة فلكية حقيقية باستخدام أساليب علم البيانات.',
    goalsAim2Title: 'العمل إلى جانب مؤسسات جادّة',
    goalsAim2Body: 'التعاون مع مجموعات بحثية وجامعات تقوم بعمل حقيقي في هذا المجال — يُكتسب، ولا يُفترض.',
    goalsAim3Title: 'السعي نحو أبحاث قريبة من ناسا',
    goalsAim3Body: 'مسعى بعيد ومُصرَّح به بصدق — اتجاه للنمو نحوه، وليس ادّعاءً يُطرح اليوم.',
    goalsAim4Title: 'نشر أعمال ذات قيمة',
    goalsAim4Body: 'الإسهام بأبحاث تصمد بجدارتها الخاصة، حين يوجد شيء حقيقي يُسهم به.',
    goalsCtaEyebrow: 'شاهد الصورة الكاملة',
    goalsCtaHeading: 'لا شيء من هذا يحدث دون الخطوات التي تسبقه',

    // Journey page
    journeyPageTitle: 'المسار الكامل — الماضي والحاضر والمُخطَّط',
    journeyPageLead: 'مرحلة واحدة مكتملة. وواحدة تجري الآن. وكل ما عدا ذلك خطة مُعلنة، مُعروضة بصدق كخطة — لا كشيء تحقق بالفعل.',
    statusCompleted: 'مكتمل',
    statusInProgress: 'قيد التنفيذ',
    statusPlanned: 'مُخطَّط له',
    statusVision: 'رؤية',
    dateNow: 'الآن',
    dateNext: 'التالي',
    dateAlongside: 'بالتوازي',
    dateGoal: 'هدف',
    dateLongTerm: 'بعيد المدى',
    journeyItem1Title: 'التخرّج من الثانوية العامة',
    journeyItem1Body: 'التخرّج من ثانوية عامة مصرية، ليُغلق مرحلة التعليم الثانوي ويفتح سؤال ما القادم.',
    journeyItem2Title: 'بناء الأساس الأكاديمي',
    journeyItem2Body: 'استعداد فعّال قبل بدء الجامعة — دون انتظار برنامج رسمي كي يبدأ العمل.',
    journeyItem3Title: 'منحة دراسية جامعية — روسيا',
    journeyItem3Body: 'خطوة أكاديمية أولى مقصودة، وليست الوجهة — منحة دراسية جامعية في إدارة الأعمال أو الاقتصاد أو الإحصاء أو أي مجال يبني قوة تحليلية وكمّية حقيقية تخدم الهدف الأكبر. لم تُحسم منحة بعينها بعد؛ أستعدّ لها فعليًا وأجمع الشهادات من أجلها.',
    journeyItem4Title: 'تطوير المهارات',
    journeyItem4Body: 'Python والرياضيات والإحصاء والإنجليزية والروسية — تُطوَّر بالتوازي مع الدرجة نفسها، لا مؤجَّلة إلى ما بعدها.',
    journeyItem5Title: 'ماجستير في علم البيانات',
    journeyItem5Body: 'تخصص رسمي في المجال الذي كان هذا المسار كله يبني نحوه.',
    journeyItem6Title: 'البحث في علم البيانات الفلكية',
    journeyItem6Body: 'تطبيق أساليب علم البيانات مباشرة على الفلك — التقاطع المحدَّد الذي يهدف إليه هذا المسار بأكمله.',
    journeyItem7Title: 'دكتوراه — الفلك وعلم البيانات',
    journeyItem7Body: 'طموح بعيد ومُصرَّح به بصدق، لا يقين به — يُسعى إليه فقط إذا استحقّه المسار حتى هذه النقطة.',
    journeyItem8Title: 'مسار بحثي — بحث علمي عالمي',
    journeyItem8Body: 'الإسهام في بحث دولي جادّ، وربما إلى جانب مؤسسات مثل ناسا — أبعد نقطة على هذه الخريطة، وسبب كل خطوة قبلها.',
    homeTlBody1: 'التخرّج من ثانوية عامة مصرية.',
    homeTlBody2: 'تطوير فعلي للمهارات المذكورة في قسم المهمة الحالية بالأعلى.',
    homeTlBody3: 'منحة دراسية جامعية — في إدارة الأعمال أو الاقتصاد أو الإحصاء أو أي مجال يخدم الهدف الأكبر. لم تُحسم بعد؛ استعداد فعلي وجمع للشهادات من أجلها.',
    homeTlBody4: 'تخصص رسمي في المجال الذي يبني نحوه هذا المسار بأكمله.',
    homeTlBody5: 'تطبيق علم البيانات على الفلك، والإسهام في البحث إلى جانب مؤسسات علمية جادّة.',

    // Certificates page
    certificatesPageTitle: 'كل الشهادات',
    certificatesPageLead: 'سجل متنامٍ وصادق — تطول هذه القائمة مع الوقت، لا دفعة واحدة.',
    certificatesSearchLabel: 'ابحث في الشهادات',
    certificatesSearchPlaceholder: 'ابحث بالعنوان أو الجهة أو كلمة مفتاحية...',
    certificatesEmpty: 'لا توجد شهادات مطابقة لبحثك.',
    certModalNoImage: 'لم تُضَف صورة الشهادة بعد',
    certModalCredential: 'عرض بيانات الاعتماد',
    certModalClose: 'إغلاق',

    // Volunteering page
    volunteeringPageTitle: 'المساهمة خارج قاعة الدراسة',
    volunteeringPageLead: 'كل مُدخَل أدناه تجربة حقيقية، معروضة بما تضمّنته فعلًا — دون تضخيم لتبدو أكبر مما كانت.',

    // Projects page
    projectsPageLead: 'سينمو هذا القسم مع وجود عمل حقيقي وجوهري يُعرض — لا شيء يُوضع هنا لمجرد ملء الفراغ.',
    projectsEmpty: 'لا مشاريع بعد — عُد لاحقًا مع نمو هذا القسم.',

    // Research page
    researchPageLead: 'لا شيء منشور بعد — هذه الصفحة موجودة لأجل حين يوجد.',
    researchEmpty: 'لا أبحاث منشورة بعد — عُد لاحقًا مع نمو هذا القسم.',

    // Skills page
    skillsPageLead: 'تقييم ذاتي صادق، لا عرض تسويقي — المستويات هنا وصوف نصية، وليست نسبًا مُختلَقة.',
    skillsEmpty: 'لم تُسجَّل مستويات مهارات بعد.',

    // CV page
    cvPageTitle: 'السيرة الذاتية',
    cvPageLead: 'تبقى محدَّثة تلقائيًا — مسحوبة من البيانات نفسها التي يستخدمها بقية الموقع.',
    cvPrintBtn: 'طباعة / حفظ كـ PDF',
    cvProfile: 'نبذة',
    cvProfileBody: 'خريج ثانوية عامة مصرية عام 2022، يسعى للحصول على منحة دراسية جامعية في روسيا — في إدارة الأعمال أو الاقتصاد أو الإحصاء — كخطوة أولى مقصودة نحو علم البيانات، وصولًا إلى علم البيانات الفلكية. لم تُحسم منحة بعينها بعد؛ استعداد فعلي وجمع للشهادات نحو الهدف.',
    cvEducation: 'التعليم',
    cvEduHsTitle: 'شهادة الثانوية العامة',
    cvEduHsBody: 'ثانوية عامة مصرية — مكتملة.',
    cvEduBscTitle: 'منحة دراسية جامعية (بكالوريوس)',
    cvEduBscBody: 'روسيا — إدارة أعمال أو اقتصاد أو إحصاء؛ لم تُحسم بعد.',

    // Volunteering empty state (shared: homepage preview + page)
    volunteeringEmpty: 'المزيد من تجارب التطوع في الطريق.',

    // Portal (gateway) — the site-root choice screen
    portalPrompt: 'لأي جانب أتيت؟',
    portalConnect: 'تواصل معي',
    portalAcademicEyebrow: 'أكاديمي ومهني',
    portalAcademicTitle: 'علم البيانات والفلك',
    portalAcademicDesc: 'الشهادات، والمسيرة الأكاديمية، والمشاريع، والبحث، والطريق طويل المدى نحو علم البيانات الفلكية.',
    portalSportsEyebrow: 'الكرة الطائرة والرياضة',
    portalSportsTitle: 'الكرة الطائرة',
    portalSportsDesc: 'تدريب ومباريات وتطوّر — قريبًا في روسيا.',
    portalEnter: 'ادخل',

    // Digital Presence (homepage) + Discord community CTA
    digitalEyebrow: 'الحضور الرقمي',
    digitalHeading: 'حيث تُشارَك رحلة المسار',
    digitalLead: 'المسار نفسه، مُشارَكًا عبر الأماكن التي أُبدع وأتواصل فيها — العمل الأكاديمي، والمشاريع، والمحتوى اليومي.',
    digitalCreatorLine: 'أكاديمي في الاتجاه. مُبدِع في الممارسة.',
    discordTitle: 'انضم إلى المجتمع',
    discordSubtitle: 'سيرفر Discord ودود يرافق المسار — مرحبًا بك.',
    discordButton: 'انضم إلى السيرفر',
    opensNewTab: 'يفتح في تبويب جديد',

    // Volleyball (sports) page
    volleyballEyebrow: 'خارج الأكاديميا',
    volleyballTitle: 'الكرة الطائرة',
    volleyballLead: 'جزء من القصة بعيدًا عن الشاشة — عمل جماعي وانضباط ولعب. تنمو هذه المساحة مع وجود لحظات حقيقية لعرضها.',
    volleyballEmpty: 'المزيد من قصص الكرة الطائرة قريبًا.',

    // --- Premium Volleyball universe (page-volleyball skin) ---
    volleyKicker: 'لاعب في طور التطور. حب للهجوم والصد. رحلة صادقة.',
    volleyTitleA: 'الكرة',
    volleyTitleB: 'الطائرة',
    volleySub: 'لاعب كرة طائرة في طور التطور بخلفية بدأت من القواعد الشعبية، مركزه المفضل حائط الصد، والتزام طويل المدى باستكمال الرحلة.',
    volleyCtaStory: 'الرحلة',
    volleyCtaAcademic: 'الرحلة الأكاديمية',
    volleyTicker: 'أول بطولة · المركز الثالث · الفصل القادم',

    // Profile
    volleyProfileTitle: 'ملف اللاعب',
    volleyPosLabel: 'المركز',
    volleyPos: 'حائط الصد',
    volleyNameLabel: 'الهوية',
    volleyName: 'حسين',
    volleyDobLabel: 'تاريخ الميلاد',
    volleyDob: '9 يونيو 2004',
    volleyHeightLabel: 'الطول',
    volleyHeight: '188 سم',
    volleyStyleLabel: 'التفضيل',
    volleyStyle: 'مرن — مرتاح في أي مركز باستثناء الليبرو. أستمتع بشكل خاص بالهجوم والصد.',
    volleyRoleLine: 'لاعب في طور التطور بخلفية بدأت من القواعد الشعبية — وليس ضمن أي فريق محترف. القصة تُروى كما هي.',

    // Grassroots
    volleyGrassTitle: 'أين بدأت الرحلة',
    volleyGrassLead: 'لم تبدأ رحلتي في نادٍ محترف. بدأت في الملاعب القريبة ومراكز الشباب، مع الأصدقاء والفرق غير الرسمية، وحب حقيقي للكرة الطائرة.',

    // First tournament
    volleyFirstEyebrow: 'أول بطولة',
    volleyFirstTitle: 'أول بطولة ودية في مسيرتي مع الكرة الطائرة',
    volleyFirstYear: 'رمضان 2023',
    volleyFirstTeamLabel: 'الفريق',
    volleyFirstTeam: 'نادي التعاون الرياضي — الهرم',
    volleyFirstVenueLabel: 'المكان',
    volleyFirstVenue: 'نادي نقابة المهندسين',
    volleyFirstPosLabel: 'المركز',
    volleyFirstPos: 'حائط الصد',
    volleyFirstResLabel: 'النتيجة',
    volleyFirstRes: 'المركز الثالث',
    volleyFirstStory: 'لعبت هذه البطولة الأولى وأنا أعاني من إصابة في الركبة. بالنسبة لي كانت تجربة شخصية أكثر من كونها فوزًا — وذكري أحتفظ بها. وبعد انتهاء البطولة اجتمعنا على مائدة الإفطار معًا خلال رمضان.',
    volleyGallery: 'عرض المعرض',
    volleyCertificate: 'عرض الشهادة',

    // Numbers
    volleyStatsTitle: 'أرقام حقيقية',
    volleyStatFirstNum: '01',
    volleyStatFirstLabel: 'أول بطولة',
    volleyStatPlaceNum: '03',
    volleyStatPlaceLabel: 'المركز الثالث',
    volleyStatPosNum: 'MB',
    volleyStatPosLabel: 'حائط الصد',

    // Timeline
    volleyTimelineTitle: 'المسار حتى الآن',
    volleyTl1Time: 'بدايات شعبية',
    volleyTl1Title: 'البداية',
    volleyTl1Sub: 'ملاعب قريبة، مراكز شباب، أصدقاء، وفرق غير رسمية.',
    volleyTl2Time: '2023',
    volleyTl2Title: 'أول بطولة ودية',
    volleyTl2Sub: 'المركز الثالث — لعب بإصابة في الركبة، وإفطار معًا بعدها.',
    volleyTl3Time: '2023–2025',
    volleyTl3Title: 'اللعب المحلي والمجتمعي',
    volleyTl3Sub: 'مباريات محجوزة مع الأصدقاء وفرق محلية — واستمر حب اللعبة في النمو.',
    volleyTl4Time: 'بعد 2025',
    volleyTl4Title: 'نقطة تحول',
    volleyTl4Sub: 'ابتعدت مؤقتًا بعد إصابة في العين وظروف سفر. الهدف لم يتغير.',
    volleyTl5Time: 'الآن',
    volleyTl5Title: 'التطور الرياضي',
    volleyTl5Sub: 'قيد التقدم — بناء القوة والمرونة واللياقة والمهارة.',
    volleyTl6Time: 'المستقبل',
    volleyTl6Title: 'مواصلة الكرة الطائرة',
    volleyTl6Sub: 'التزام طويل المدى بمواصلة اللعب خارج مصر.',

    // Turning point
    volleyTurnTitle: 'نقطة تحول',
    volleyTurnMsg: 'تغيّر المسار بعد 2025، لكن الهدف لم يتغير.',
    volleyTurnSub: 'بعد 2025 ابتعدت عن اللعب التنافسي بسبب إصابة في العين وظروف سفري. الهدف — الاستمرار في التطور كلاعب ومواصلة الرحلة — لم يتغير.',

    // Athletic development
    volleyDevTitle: 'التطور الرياضي',
    volleyDevStatus: 'الحالة',
    volleyDevStatusVal: 'قيد التقدم',
    volleyDevBody: 'بناء الأساس للفصل القادم — قوة، مرونة، لياقة، تمارين قفز، وتدريبات خاصة بالكرة الطائرة. بلا ادعاءات بعد، فقط عمل ثابت.',

    // Next chapter
    volleyNextTitle: 'الفصل القادم',
    volleyNextLead: 'مواصلة الكرة الطائرة خارج مصر. الرحلة لم تنتهِ — بل تسلك طريقًا جديدًا.',
    volleyFollowing: 'لاعب في طور التطور · حائط الصد · التزام بعيد المدى',

    // Memories
    volleyMemTitle: 'ذكريات',
    volleyMemLead: 'ذكريات البدايات من أول بطولة — محفوظة كما كانت.',

    // Media viewer & event controls (built in JS by media-system.js —
    // these can't be reached by data-i18n, so the labels are resolved
    // from this table at build/switch time instead)
    mvLabel: 'عارض الوسائط',
    mvClose: 'إغلاق العارض',
    mvPrev: 'الصورة السابقة',
    mvNext: 'الصورة التالية',
    mvUnavailable: 'الصورة غير متاحة.',
    eventClose: 'إغلاق',
    eventViewCert: 'عرض الشهادة',
    eventViewFull: 'عرض الصورة بملء الشاشة',
    eventOpenImage: 'افتح الصورة',
    eventWatchVideo: 'مشاهدة الفيديو',
    eventWhatIDid: 'ما الذي قمت به',
    eventWhatILearned: 'ما الذي تعلمته',
    eventSkills: 'المهارات',
    eventPeople: 'الأشخاص',
    eventGallery: 'المعرض',
    eventVideo: 'الفيديو',
    eventLinks: 'الروابط',
    eventViewExperience: 'عرض التجربة',
    eventPhotos: 'الصور',
    eventCertificate: 'الشهادة',
    eventPosition: 'المركز',
    eventVlog: 'فلوج',
    eventVs: 'ضد',
    eventResult: 'النتيجة',
    eventStats: 'الإحصائيات',
    eventNotes: 'ملاحظات',
  },

  ru: {
    // Navigation
    navHome: 'Главная',
    navAbout: 'Обо мне',
    navWork: 'Работы',
    navCertificates: 'Сертификаты',
    navVolunteering: 'Волонтёрство',
    navJourney: 'Путь',
    navGoals: 'Цели',
    navProjects: 'Проекты',
    navResearch: 'Исследования',
    navSkills: 'Навыки',
    navCv: 'Резюме',
    navPortal: 'Портал',
    navVolleyball: 'Волейбол',
    navAcademic: 'Учёба',
    siteName: 'Хусейн Эльбассиуни',

    // Hero
    heroEyebrow: 'Текущий путь',
    heroSubtitle: 'Будущий специалист по данным — со взглядом на астрономию',
    heroLead: 'Строю свой путь от прочного фундамента к науке о данных и, в перспективе, к астроинформатике.',
    heroCtaPrimary: 'Мой путь',
    heroCtaSecondary: 'Сертификаты',

    // Short Introduction
    aboutEyebrow: 'Обо мне',
    aboutHeading: 'Чёткая отправная точка, направленная к ясной цели.',
    aboutPara1: 'Хусейн — выпускник египетской школы 2022 года, сейчас добивается университетской стипендии в России — по бизнесу, экономике, статистике или любому направлению, ведущему к большой цели. Конкретная стипендия пока не получена; это осознанный первый шаг, а не конечная цель — основа для развития реальных навыков в программировании, математике, статистике и науке о данных, с параллельным сбором сертификатов на пути к цели, перед дальнейшей специализацией.',
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
    visionPara1: 'От фундамента — к науке о данных — к астрономии. Это направление, а не заявление о том, что цель уже достигнута.',
    visionPara2: 'Долгосрочная амбиция реальна: внести вклад в серьёзные исследования в области астроинформатики и однажды работать вместе с международными научными организациями — рассматривая NASA как далёкую, честно обозначенную цель, а не обещание. Путь к ней — поэтапный, начиная ровно с того места, где всё находится сегодня.',
    readFullVision: 'Читать полностью',

    // Final CTA
    finalCtaEyebrow: 'Связаться',
    finalCtaHeading: 'Следите за моим путём',
    finalCtaLead: 'Сертификаты, волонтёрский опыт и предстоящий академический путь — всё в одном месте, растёт вместе с этим путём.',
    finalCtaContact: 'Связаться со мной',

    // Footer
    footerMission: 'Строю путь от прочного фундамента к науке о данных и, в перспективе, к астроинформатике.',

    // ---- Internal pages (Phase 12.2) ----

    // Common (shared across internal pages)
    skipToContent: 'Перейти к основному содержанию',
    ctaAcademicJourney: 'Академический путь',
    viewCertificates: 'Смотреть сертификаты',

    // About page
    aboutPageTitle: 'История на данный момент',
    aboutPageLead: 'Это не готовое резюме, а честное описание того, где всё находится сегодня и как Хусейн подходит к пути впереди.',
    aboutStory1Title: 'С чего всё началось',
    aboutStory1Body: 'Хусейн окончил египетскую среднюю школу в 2022 году. С тех пор всё внимание сосредоточено на том, чтобы аккуратно и честно двигаться к долгосрочной цели, до которой ещё годы пути: работать на стыке науки о данных и астрономии.',
    aboutStory2Title: 'Почему сначала фундамент',
    aboutStory2Body: 'Следующий академический шаг — университетская стипендия в России, по бизнесу, экономике, статистике или любому направлению, ведущему к большой цели. Конкретная стипендия пока не получена, и это не конечная точка — она выбрана осознанно как фундамент: структурированная среда, чтобы выстроить реальную силу в программировании, математике, статистике и аналитическом мышлении, наряду с английским, русским и языковыми требованиями, которые ставит путь впереди. А тем временем работа продолжается — подготовка и сбор сертификатов на пути к этой цели.',
    aboutStory3Title: 'Почему астроинформатика',
    aboutStory3Body: 'Наука о данных обширна. Именно астрономия всё время притягивала любопытство — масштаб её вопросов и объём реальных, сложных данных за каждым ответом. Астроинформатика лежит ровно на этом стыке: применение методов науки о данных, чтобы заниматься астрономией по-настоящему. Это и есть долгосрочное направление, к которому идут честными этапами, а не заявляют о нём заранее.',
    aboutValuesEyebrow: 'Как я работаю',
    aboutValuesHeading: 'Что направляет процесс',
    aboutValue1Title: 'Любопытство',
    aboutValue1Body: 'Спрашивать, почему что-то работает, а не просто знать, что оно работает.',
    aboutValue2Title: 'Дисциплина',
    aboutValue2Body: 'Ровное, неброское усилие на длинных дистанциях.',
    aboutValue3Title: 'Академическая основательность',
    aboutValue3Body: 'Серьёзно относиться к основам, прежде чем спешить к специализации.',
    aboutValue4Title: 'Открытость',
    aboutValue4Body: 'Оставаться открытым к тому, что области действительно нужно, а не к тому, что просто эффектно выглядит.',
    aboutCtaEyebrow: 'Продолжайте изучать',
    aboutCtaHeading: 'Посмотрите путь подробнее',

    // Goals page
    goalsEyebrow: 'Будущие цели',
    goalsTitle: 'За пределами звёзд',
    goalsLead: 'Амбициозные, честно заявленные и ещё не достигнутые. Эта страница — направление, а не строка в резюме.',
    goalsMissionEyebrow: 'Моя миссия',
    goalsMissionHeading: 'От фундамента к науке о данных и к астрономии',
    goalsMissionPara1: 'Это направление, изложенное максимально ясно, — а не заявление о том, что какая-либо его точка уже достигнута. Каждый этап до него существует, чтобы сделать возможным следующий.',
    goalsMissionPara2: 'Долгосрочная цель — вести настоящую, значимую работу в астроинформатике: применять методы науки о данных, чтобы помогать отвечать на реальные астрономические вопросы, на уровне серьёзном настолько, чтобы это было важно самой области.',
    goalsAimEyebrow: 'К чему я стремлюсь',
    goalsAimHeading: 'Долгосрочные цели, ещё не достигнутые',
    goalsAimLead: 'Названы целями, потому что именно ими они и являются — не достижения, не квалификации, не обещания.',
    goalsAim1Title: 'Вносить вклад в исследования по астроинформатике',
    goalsAim1Body: 'Вести работу, которая действительно помогает отвечать на реальные астрономические вопросы методами науки о данных.',
    goalsAim2Title: 'Работать рядом с серьёзными институтами',
    goalsAim2Body: 'Сотрудничать с исследовательскими группами и университетами, ведущими настоящую работу в этой области, — это заслуживается, а не предполагается.',
    goalsAim3Title: 'Стремиться к исследованиям уровня NASA',
    goalsAim3Body: 'Далёкое, честно заявленное устремление — направление для роста, а не заявление, выдвигаемое сегодня.',
    goalsAim4Title: 'Публиковать значимые работы',
    goalsAim4Body: 'Вносить вклад исследованиями, которые выдерживают проверку по собственным заслугам, когда будет что-то настоящее для вклада.',
    goalsCtaEyebrow: 'Увидеть полную картину',
    goalsCtaHeading: 'Ничего из этого не случится без шагов, что идут перед ним',

    // Journey page
    journeyPageTitle: 'Полный путь — прошлое, настоящее и планируемое',
    journeyPageLead: 'Один этап завершён. Один идёт сейчас. Всё остальное — заявленный план, честно показанный как план, а не как то, что уже произошло.',
    statusCompleted: 'Завершено',
    statusInProgress: 'В процессе',
    statusPlanned: 'Запланировано',
    statusVision: 'Перспектива',
    dateNow: 'Сейчас',
    dateNext: 'Далее',
    dateAlongside: 'Параллельно',
    dateGoal: 'Цель',
    dateLongTerm: 'Долгосрочно',
    journeyItem1Title: 'Окончание средней школы',
    journeyItem1Body: 'Окончание египетской средней школы — закрытие ступени среднего образования и открытие вопроса о том, что дальше.',
    journeyItem2Title: 'Построение академического фундамента',
    journeyItem2Body: 'Активная подготовка до начала университета — без ожидания официальной программы, чтобы начать работать.',
    journeyItem3Title: 'Университетская стипендия — Россия',
    journeyItem3Body: 'Осознанный первый академический шаг, а не конечная точка, — университетская стипендия по бизнесу, экономике, статистике или любому направлению, дающему реальную аналитическую и количественную силу для большой цели. Конкретная стипендия пока не получена; идёт активная подготовка и сбор сертификатов.',
    journeyItem4Title: 'Развитие навыков',
    journeyItem4Body: 'Python, математика, статистика, английский и русский — развиваются параллельно с самой учёбой, а не откладываются на потом.',
    journeyItem5Title: 'Магистратура по науке о данных',
    journeyItem5Body: 'Официальная специализация в области, к которой этот путь всё время шёл.',
    journeyItem6Title: 'Исследования по астроинформатике',
    journeyItem6Body: 'Применение методов науки о данных напрямую к астрономии — тот самый стык, на который нацелен весь этот путь.',
    journeyItem7Title: 'Докторантура — астрономия и наука о данных',
    journeyItem7Body: 'Далёкое, честно заявленное устремление без гарантий — к нему идут, только если путь до этой точки его заслужит.',
    journeyItem8Title: 'Исследовательский путь — мировая наука',
    journeyItem8Body: 'Вклад в серьёзные международные исследования, возможно, рядом с институтами вроде NASA, — самая дальняя точка на этой карте и причина каждого шага перед ней.',
    homeTlBody1: 'Окончание египетской средней школы.',
    homeTlBody2: 'Активное развитие навыков из раздела «Текущая миссия» выше.',
    homeTlBody3: 'Университетская стипендия — по бизнесу, экономике, статистике или любому направлению, ведущему к большой цели. Пока не получена; идёт подготовка и сбор сертификатов.',
    homeTlBody4: 'Формальная специализация в области, к которой ведёт весь этот путь.',
    homeTlBody5: 'Применение науки о данных к астрономии и вклад в исследования рядом с серьёзными научными институтами.',

    // Certificates page
    certificatesPageTitle: 'Все сертификаты',
    certificatesPageLead: 'Растущая, честная запись — этот список удлиняется со временем, а не разом.',
    certificatesSearchLabel: 'Поиск по сертификатам',
    certificatesSearchPlaceholder: 'Поиск по названию, организации или ключевому слову...',
    certificatesEmpty: 'Нет сертификатов, соответствующих вашему запросу.',
    certModalNoImage: 'Изображение сертификата ещё не добавлено',
    certModalCredential: 'Смотреть удостоверение',
    certModalClose: 'Закрыть',

    // Volunteering page
    volunteeringPageTitle: 'Вклад за пределами аудитории',
    volunteeringPageLead: 'Каждая запись ниже — реальный опыт, показанный таким, каким он был на самом деле, без преувеличения его масштаба.',

    // Projects page
    projectsPageLead: 'Этот раздел будет расти по мере появления настоящей, значимой работы для показа — сюда ничего не ставится просто для заполнения.',
    projectsEmpty: 'Пока нет проектов — загляните позже, по мере роста этого раздела.',

    // Research page
    researchPageLead: 'Пока ничего не опубликовано — эта страница существует для того момента, когда появится.',
    researchEmpty: 'Пока нет опубликованных исследований — загляните позже, по мере роста этого раздела.',

    // Skills page
    skillsPageLead: 'Честная самооценка, а не рекламная витрина — уровни здесь описаны словами, а не выдуманными процентами.',
    skillsEmpty: 'Уровни навыков ещё не зафиксированы.',

    // CV page
    cvPageTitle: 'Резюме',
    cvPageLead: 'Остаётся актуальным автоматически — берётся из тех же данных, что использует остальной сайт.',
    cvPrintBtn: 'Печать / Сохранить как PDF',
    cvProfile: 'О себе',
    cvProfileBody: 'Выпускник египетской средней школы 2022 года, добивается университетской стипендии в России — по бизнесу, экономике или статистике — как осознанный первый шаг к науке о данных и, в перспективе, к астроинформатике. Конкретная стипендия пока не получена; идёт активная подготовка и сбор сертификатов на пути к цели.',
    cvEducation: 'Образование',
    cvEduHsTitle: 'Аттестат о среднем образовании',
    cvEduHsBody: 'Египетская средняя школа — завершено.',
    cvEduBscTitle: 'Университетская стипендия (бакалавриат)',
    cvEduBscBody: 'Россия — бизнес, экономика или статистика; пока не получена.',

    // Volunteering empty state (shared: homepage preview + page)
    volunteeringEmpty: 'Скоро будет больше волонтёрского опыта.',

    // Portal (gateway) — the site-root choice screen
    portalPrompt: 'За какой стороной вы пришли?',
    portalConnect: 'Связаться со мной',
    portalAcademicEyebrow: 'Академическое и профессиональное',
    portalAcademicTitle: 'Наука о данных и астрономия',
    portalAcademicDesc: 'Сертификаты, академический путь, проекты, исследования и долгосрочная дорога к астроинформатике.',
    portalSportsEyebrow: 'Волейбол и спорт',
    portalSportsTitle: 'Волейбол',
    portalSportsDesc: 'Тренировки, матчи и прогресс — скоро в России.',
    portalEnter: 'Войти',

    // Digital Presence (homepage) + Discord community CTA
    digitalEyebrow: 'Цифровое присутствие',
    digitalHeading: 'Где я делюсь этим путём',
    digitalLead: 'Тот же путь — в местах, где я создаю и общаюсь: академическая работа, проекты и повседневный контент.',
    digitalCreatorLine: 'Академичен по направлению. Творческий на практике.',
    discordTitle: 'Присоединяйтесь к сообществу',
    discordSubtitle: 'Уютный сервер Discord для этого пути — заходите.',
    discordButton: 'Зайти на сервер',
    opensNewTab: 'открывается в новой вкладке',

    // Volleyball (sports) page
    volleyballEyebrow: 'За рамками учёбы',
    volleyballTitle: 'Волейбол',
    volleyballLead: 'Часть истории вне экрана — командная игра, дисциплина и спорт. Этот раздел растёт по мере появления реальных моментов.',
    volleyballEmpty: 'Скоро больше волейбольных историй.',

    // --- Premium Volleyball universe (page-volleyball skin) ---
    volleyKicker: 'Развивающийся игрок. Любовь к атаке и блоку. Честный путь.',
    volleyTitleA: 'Волейбольный',
    volleyTitleB: 'Путь',
    volleySub: 'Развивающийся волейболист с любительскими корнями, предпочтением позиции центрального блокирующего и долгосрочным обязательством продолжать путь.',
    volleyCtaStory: 'Путь',
    volleyCtaAcademic: 'Учебный путь',
    volleyTicker: 'Первый турнир · 3-е место · Следующая глава',

    // Profile
    volleyProfileTitle: 'Профиль игрока',
    volleyPosLabel: 'Позиция',
    volleyPos: 'Центральный блокирующий',
    volleyNameLabel: 'Личность',
    volleyName: 'Хусейн',
    volleyDobLabel: 'Дата рождения',
    volleyDob: '9 июня 2004',
    volleyHeightLabel: 'Рост',
    volleyHeight: '188 см',
    volleyStyleLabel: 'Предпочтение',
    volleyStyle: 'Универсал — комфортно на любой позиции, кроме либеро. Особенно мне нравятся атака и блок.',
    volleyRoleLine: 'Развивающийся игрок с любительскими корнями — не входит ни в одну профессиональную команду. История рассказана как есть.',

    // Grassroots
    volleyGrassTitle: 'Где всё началось',
    volleyGrassLead: 'Мой путь начался не в профессиональном клубе. Он начался на местных площадках, в молодёжных центрах, с друзьями, неформальными командами и искренней любовью к волейболу.',

    // First tournament
    volleyFirstEyebrow: 'Первый турнир',
    volleyFirstTitle: 'Мой первый товарищеский турнир по волейболу',
    volleyFirstYear: 'Рамадан 2023',
    volleyFirstTeamLabel: 'Команда',
    volleyFirstTeam: 'Спортивный клуб Аль-Таавун — Аль-Харам',
    volleyFirstVenueLabel: 'Место',
    volleyFirstVenue: 'Инженерный синдикат',
    volleyFirstPosLabel: 'Позиция',
    volleyFirstPos: 'Центральный блокирующий',
    volleyFirstResLabel: 'Результат',
    volleyFirstRes: 'Третье место',
    volleyFirstStory: 'Я сыграл этот первый турнир с травмой колена. Для меня это был личный вызов больше, чем победа, — и воспоминание, которое я храню. После турнира мы собрались и разделили ифтар вместе во время Рамадана.',
    volleyGallery: 'Смотреть галерею',
    volleyCertificate: 'Смотреть сертификат',

    // Numbers
    volleyStatsTitle: 'В реальных цифрах',
    volleyStatFirstNum: '01',
    volleyStatFirstLabel: 'Первый турнир',
    volleyStatPlaceNum: '03',
    volleyStatPlaceLabel: 'Третье место',
    volleyStatPosNum: 'MB',
    volleyStatPosLabel: 'Центральный блокирующий',

    // Timeline
    volleyTimelineTitle: 'Путь к настоящему моменту',
    volleyTl1Time: 'Любительские начала',
    volleyTl1Title: 'Начало',
    volleyTl1Sub: 'Местные площадки, молодёжные центры, друзья и неформальные команды.',
    volleyTl2Time: '2023',
    volleyTl2Title: 'Первый товарищеский турнир',
    volleyTl2Sub: 'Третье место — сыграно с травмой колена, ифтар вместе после.',
    volleyTl3Time: '2023–2025',
    volleyTl3Title: 'Локальная игра',
    volleyTl3Sub: 'Согласованные игры с друзьями и местными командами — любовь к игре росла.',
    volleyTl4Time: 'После 2025',
    volleyTl4Title: 'Поворотный момент',
    volleyTl4Sub: 'Я сделал паузу после травмы глаза и обстоятельств. Цель не изменилась.',
    volleyTl5Time: 'Сейчас',
    volleyTl5Title: 'Физическое развитие',
    volleyTl5Sub: 'В процессе — сила, подвижность, кондиция и мастерство.',
    volleyTl6Time: 'Будущее',
    volleyTl6Title: 'Продолжить волейбол',
    volleyTl6Sub: 'Долгосрочное обязательство продолжать играть за пределами Египта.',

    // Turning point
    volleyTurnTitle: 'Поворотный момент',
    volleyTurnMsg: 'Путь изменился после 2025, но цель — нет.',
    volleyTurnSub: 'После 2025 я сделал паузу в соревновательной игре из-за травмы глаза и обстоятельств переезда. Цель — продолжать развиваться как игрок и идти дальше — не изменилась.',

    // Athletic development
    volleyDevTitle: 'Физическое развитие',
    volleyDevStatus: 'Статус',
    volleyDevStatusVal: 'В процессе',
    volleyDevBody: 'Создание основы для следующей главы — сила, подвижность, кондиция, плиометрика и специализированные тренировки. Пока без заявлений, просто постоянная работа.',

    // Next chapter
    volleyNextTitle: 'Следующая глава',
    volleyNextLead: 'Продолжить волейбол за пределами Египта. Путь не окончен — он просто выбирает новый маршрут.',
    volleyFollowing: 'Развивающийся игрок · Центральный блокирующий · Долгий путь',

    // Memories
    volleyMemTitle: 'Воспоминания',
    volleyMemLead: 'Ранние воспоминания с первого турнира — сохранённые как есть.',

    // Media viewer & event controls (built in JS by media-system.js —
    // these can't be reached by data-i18n, so the labels are resolved
    // from this table at build/switch time instead)
    mvLabel: 'Просмотр медиа',
    mvClose: 'Закрыть просмотр',
    mvPrev: 'Предыдущее изображение',
    mvNext: 'Следующее изображение',
    mvUnavailable: 'Изображение недоступно.',
    eventClose: 'Закрыть',
    eventViewCert: 'Посмотреть сертификат',
    eventViewFull: 'Открыть изображение на весь экран',
    eventOpenImage: 'Открыть изображение',
    eventWatchVideo: 'Смотреть видео',
    eventWhatIDid: 'Что я делал',
    eventWhatILearned: 'Чему я научился',
    eventSkills: 'Навыки',
    eventPeople: 'Люди',
    eventGallery: 'Галерея',
    eventVideo: 'Видео',
    eventLinks: 'Ссылки',
    eventViewExperience: 'Подробнее',
    eventPhotos: 'Фото',
    eventCertificate: 'Сертификат',
    eventPosition: 'Позиция',
    eventVlog: 'Влог',
    eventVs: 'против',
    eventResult: 'Результат',
    eventStats: 'Статистика',
    eventNotes: 'Заметки',
  },
};
