/* ============================================================
   DATA/RESEARCH.JS
   Same philosophy as data/projects.js — this array is EMPTY ON
   PURPOSE. No research exists yet, so nothing is invented to fill
   the page. pages/research.html shows an honest empty state until
   this array has real entries.

   ------------------------------------------------------------
   TO ADD YOUR FIRST REAL RESEARCH ENTRY:
   1. Add an object to the array below with this shape:

      {
        title: 'Paper or Research Title',
        abstract: 'A short summary of what the work covers.',
        authors: ['Hussein ElBassiouni'],   // array of strings
        journal: '',                         // publication venue, or '' if none yet
        date: 'YOUR_DATE',
        link: '',                            // URL to the publication, or ''
        pdf: '',                             // path in assets/documents/, or ''
      }

   2. Save the file. pages/research.html picks it up automatically.
   ------------------------------------------------------------ */

const researchData = [];
