/* ============================================================
   DATA/SKILLS.JS
   Pure data. Unlike Projects and Research, this isn't left empty —
   these are the real skill areas already stated on the homepage's
   Current Mission section, just organized here by category.

   Levels are honest text labels, NOT fake percentages. Nobody can
   truthfully claim "Python: 85%" — a level is a fair, defensible
   claim; a made-up number isn't. Valid levels, roughly in order:
     'Learning'    — actively building this skill right now
     'Familiar'    — comfortable with the basics
     'Comfortable' — can use this independently for real work

   ------------------------------------------------------------
   TO ADD OR UPDATE A SKILL:
   1. Add or edit an object below:
      { name: 'Skill Name', category: 'Category', level: 'Learning' }
   2. Move a skill to a higher level only when it's honestly true —
      there's no rush, and no one's checking but you.
   3. Save the file. pages/skills.html groups everything by
      category automatically.
   ------------------------------------------------------------ */

const skillsData = [
  { name: 'Python', category: 'Programming', level: 'Learning' },
  { name: 'Mathematics', category: 'Mathematics & Statistics', level: 'Learning' },
  { name: 'Statistics', category: 'Mathematics & Statistics', level: 'Learning' },
  { name: 'Data Analysis', category: 'Data Science', level: 'Learning' },
  { name: 'English', category: 'Languages', level: 'Learning' },
  { name: 'Russian', category: 'Languages', level: 'Learning' },
  { name: 'Academic Research', category: 'Research', level: 'Learning' },
];
