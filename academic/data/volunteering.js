/* ============================================================
   DATA/VOLUNTEERING.JS
   Pure data — same philosophy as data/certificates.js. No HTML,
   no styling, no logic beyond the array itself.

   ⚠ DEMO DATA — every entry below is a placeholder to preview
   the UI. Replace with real volunteer experience whenever ready.
   `isDemo: true` drives the visible "Demo" badge on each card.

   ------------------------------------------------------------
   TO ADD A REAL EXPERIENCE LATER:
   1. Copy one of the objects below.
   2. Fill in the real organization, role, event, date, description
      and skillsGained.
   3. If you have a certificate for it, set certificateUrl to the
      file path (e.g. 'assets/documents/my-certificate.pdf').
      Leave it as an empty string if there isn't one — the "View
      Certificate" link simply won't show up.
   4. Set `isDemo` to `false`.
   5. Save the file. No other file needs to change — both the
      homepage preview and the full Volunteering page read from
      this same array automatically.
   ------------------------------------------------------------ */

const volunteeringData = [
  {
    organization: 'YOUR_VOLUNTEER_ORGANIZATION',
    role: 'YOUR_ROLE',
    event: 'YOUR_EVENT_NAME',
    date: 'YOUR_DATE',
    description: 'A short, honest description of what you did and why it mattered.',
    skillsGained: ['Teamwork', 'Communication'],
    certificateUrl: '',
    isDemo: true,
  },
  {
    organization: 'YOUR_VOLUNTEER_ORGANIZATION',
    role: 'YOUR_ROLE',
    event: 'YOUR_EVENT_NAME',
    date: 'YOUR_DATE',
    description: 'A short, honest description of what you did and why it mattered.',
    skillsGained: ['Organization', 'Public Speaking'],
    certificateUrl: '',
    isDemo: true,
  },
];
