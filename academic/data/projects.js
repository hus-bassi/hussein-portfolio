/* ============================================================
   DATA/PROJECTS.JS
   Pure data, same philosophy as data/certificates.js.

   This array is EMPTY ON PURPOSE. Unlike the certificates and
   volunteering data, no demo entries are included here — a fake
   project is a much bigger claim than a placeholder certificate,
   and Hussein was explicit that there are no strong projects yet.
   The page this feeds (pages/projects.html) shows an honest
   "no projects yet" message when this array is empty — nothing
   is invented to fill the space.

   ------------------------------------------------------------
   TO ADD YOUR FIRST REAL PROJECT:
   1. Add an object to the array below with this shape:

      {
        title: 'Project Name',
        description: 'What it does and why you built it.',
        technologies: ['Python', 'Pandas'],   // array of strings
        github: '',                            // repo URL, or '' if none
        liveDemo: '',                          // live URL, or '' if none
        image: 'assets/images/YOUR_IMAGE.jpg', // screenshot, or '' for none
        category: 'Data Science',
        date: 'YOUR_DATE',
      }

   2. Save the file. pages/projects.html picks it up automatically
      — no other file needs to change, and the "no projects yet"
      message disappears on its own once this array isn't empty.
   ------------------------------------------------------------ */

const projectsData = [];
