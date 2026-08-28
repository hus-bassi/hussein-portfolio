/* ============================================================
   DATA/SOCIAL.JS  —  Digital Presence & Community data
   ------------------------------------------------------------
   Pure data. js/social.js is the only reader. Editing this one
   file updates the homepage "Digital Presence" panel, the Discord
   community CTA, and every footer's social links at once — nothing
   is hardcoded in the HTML (§41).

   Each platform:
     key   — matches an inline SVG icon in js/social.js
     name  — the platform's own name (proper noun, not translated)
     url   — the profile/channel link ('' → the platform is kept
             here but renders NO active button until a real URL is
             added; see VK below)
     label — a short { en, ar, ru } role/description shown under the
             name; trilingual like the rest of the site.

   TO ADD / CHANGE A LINK later: edit a `url`, add a new platform
   object (and, if new, an icon in js/social.js) — it appears
   everywhere automatically.
   ============================================================ */

const socialData = {
  platforms: [
    {
      key: 'tiktok',
      name: 'TikTok',
      url: 'https://www.tiktok.com/@hus_bassi',
      label: { en: 'Content & Short Videos', ar: 'محتوى وفيديوهات قصيرة', ru: 'Контент и короткие видео' },
    },
    {
      key: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCmh6wrbfJ-0VYL1e7kl8nMw',
      label: { en: 'Videos & Vlogs', ar: 'فيديوهات ومدوّنات مرئية', ru: 'Видео и влоги' },
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hus-bassi',
      label: { en: 'Professional / Academic', ar: 'مهني / أكاديمي', ru: 'Профессиональное / академическое' },
    },
    {
      key: 'github',
      name: 'GitHub',
      url: 'https://github.com/hus-bassi',
      label: { en: 'Projects & Code', ar: 'مشاريع وأكواد', ru: 'Проекты и код' },
    },
    {
      key: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/hus.bassi/',
      label: { en: 'Community / Content', ar: 'مجتمع / محتوى', ru: 'Сообщество / контент' },
    },
    {
      key: 'qabilah',
      name: 'Qabilah',
      url: 'https://qabilah.com/profile/hus-bassi',
      label: { en: 'Professional / Profile', ar: 'مهني / ملف تعريفي', ru: 'Профиль / профессиональное' },
    },
    {
      // VK — Russian social network profile.
      key: 'vk',
      name: 'VK',
      url: 'https://vk.ru/hus.bassi',
      label: { en: 'Russian Social Presence', ar: 'حضور اجتماعي روسي', ru: 'Российское присутствие' },
    },
  ],

  // Premium community call-to-action — a Discord SERVER invite, shown
  // as its own distinct card (not a plain link), yet not bigger than
  // the CV / Journey / Certificates identity (§24/§36).
  discord: {
    key: 'discord',
    name: 'Discord',
    url: 'https://discord.gg/hywgCBEZPv',
    label: { en: 'Community / Server', ar: 'مجتمع / سيرفر', ru: 'Сообщество / сервер' },
  },
};

// Expose for js/social.js.
if (typeof window !== 'undefined') {
  window.socialData = socialData;
}
