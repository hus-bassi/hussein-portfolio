/* ============================================================
   DATA/VOLUNTEERING.JS
   Pure data — same philosophy as data/certificates.js. No HTML,
   no styling, no logic beyond the array itself.

   ------------------------------------------------------------
   ⚠ SOURCE OF TRUTH: data/events.js
   The live Volunteering page and the CV both render the real
   type:'volunteering' entries from data/events.js (through the
   EventSystem / cv.js). This array is now only a lightweight,
   English-only FALLBACK that cv.js reads if events.js hasn't
   loaded — so keep the two in sync when adding an experience,
   but treat events.js as canonical (it also holds AR/RU, images,
   galleries, video and certificate paths).
   ------------------------------------------------------------ */

const volunteeringData = [
  {
    organization: 'Russian House in Cairo',
    role: 'Volunteer · Event Setup & Coordination',
    event: 'Volunteering at the Russian House in Cairo',
    date: 'June 2, 2026',
    description:
      'A volunteering experience at the Russian House in Cairo, where I helped prepare and organize the stage, arrange chairs and microphones, guide young participants, and support the event setup and coordination.',
    skillsGained: ['Teamwork', 'Event Setup', 'Coordination', 'Communication'],
    certificateUrl: 'assets/volunteering/russian-house/certificate.jpg',
    isDemo: false,
  },
  {
    organization: 'Russian House in Cairo',
    role: 'Volunteer · Event Support',
    event: 'Chess Tournament Volunteering at the Russian House in Cairo',
    date: 'June 14, 2026',
    description:
      'I volunteered in the organization of a chess tournament at the Russian House in Cairo. My responsibilities included preparing the library hall, arranging chess tables and chairs, setting up chessboards and chess clocks, responding to organizational needs during the tournament, calling the referee when match-related issues arose, assisting participants and visitors, and helping direct people to designated photo and commemorative areas.',
    skillsGained: [
      'Event Organization',
      'Attention to Detail',
      'On-site Coordination',
      'Communication',
      'Responsibility',
      'Problem Response',
    ],
    certificateUrl: '',
    isDemo: false,
  },
];
