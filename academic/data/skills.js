/* ============================================================
   DATA/SKILLS.JS
   Every skill's percentage/level below is either:
   1. `null` — not self-rated yet (shown as "Not yet rated" instead
      of a ring, never as 0%, since 0% would falsely imply no
      ability at all rather than "not measured yet"), or
   2. A real number YOU provided via an UPDATE SKILL command.

   Claude never invents a percentage. Every number here traces back
   to something you explicitly said.

   ------------------------------------------------------------
   SCHEMA:
   {
     name: 'Skill Name',
     category: 'Category',       // groups automatically on the page
     percentage: 72,              // 0-100, or null if not rated yet
     level: 'Intermediate',       // free text, your own words, or null
     description: 'Short honest note about this skill.',
   }

   ------------------------------------------------------------
   TO ADD A NEW SKILL:
     Send: NEW SKILL — Name / Percentage / Level / Category / Description

   TO UPDATE AN EXISTING SKILL'S PROGRESS:
     Send: UPDATE SKILL — Skill name, old% → new%
     (e.g. "UPDATE SKILL Python 72 → 78")
   ------------------------------------------------------------ */

const skillsData = [
  { name: 'Python', category: 'Programming', percentage: null, level: null, description: '' },
  { name: 'Mathematics', category: 'Mathematics & Statistics', percentage: null, level: null, description: '' },
  { name: 'Statistics', category: 'Mathematics & Statistics', percentage: null, level: null, description: '' },
  { name: 'Data Analysis', category: 'Data Science', percentage: null, level: null, description: '' },
  { name: 'English', category: 'Languages', percentage: null, level: null, description: '' },
  { name: 'Russian', category: 'Languages', percentage: null, level: null, description: '' },
  { name: 'Academic Research', category: 'Research', percentage: null, level: null, description: '' },
];
