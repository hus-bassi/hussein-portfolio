/* ============================================================
   DATA/SOCIAL.JS  —  Digital Presence & Community data
   ------------------------------------------------------------
   Pure data. assets/js/site.js is the only reader. Editing this one
   file updates the homepage contact panel — nothing is hardcoded in
   the HTML (§41).

   Each platform:
     key   — matches an inline SVG icon in assets/js/site.js. A brand
             with no official glyph there renders as a monogram instead
             of a borrowed mark.
     name  — the platform's own name (proper noun, not translated)
     url   — the profile / channel / server link
     label — a short { en, ar, ru } role shown under the name

   ORDER MATTERS: this is the order they appear in, so the
   professional links come first and the rest follow.

   TO ADD / CHANGE A LINK later: edit a `url`, or add a platform object
   (and, for a new brand, its icon in assets/js/site.js) — it appears
   automatically.
   ============================================================ */

const socialData = {
  platforms: [
    {
      key: 'github',
      name: 'GitHub',
      url: 'https://github.com/hus-bassi',
      label: { en: 'Projects & Code', ar: 'مشاريع وأكواد', ru: 'Проекты и код' },
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hus-bassi',
      label: { en: 'Professional / Academic', ar: 'مهني / أكاديمي', ru: 'Профессиональное / академическое' },
    },
    {
      key: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCmh6wrbfJ-0VYL1e7kl8nMw',
      label: { en: 'Videos & Vlogs', ar: 'فيديوهات ومدوّنات مرئية', ru: 'Видео и влоги' },
    },
    {
      // A Telegram CHANNEL (broadcast), not a group or a bot.
      key: 'telegram',
      name: 'Telegram',
      url: 'https://t.me/ElBassiouniBeyond',
      label: { en: 'Channel & Updates', ar: 'قناة وتحديثات', ru: 'Канал и обновления' },
    },
    {
      // A Discord COMMUNITY SERVER invite, not a direct profile.
      key: 'discord',
      name: 'Discord',
      url: 'https://discord.gg/hywgCBEZPv',
      label: { en: 'Community / Server', ar: 'مجتمع / سيرفر', ru: 'Сообщество / сервер' },
    },
    {
      key: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/hus_bassi',
      label: { en: 'Photos & Stories', ar: 'صور وقصص', ru: 'Фото и истории' },
    },
    {
      key: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/hus.bassi',
      label: { en: 'Community / Content', ar: 'مجتمع / محتوى', ru: 'Сообщество / контент' },
    },
    {
      key: 'x',
      name: 'X',
      url: 'https://x.com/Hus_Bassi',
      label: { en: 'Posts & Updates', ar: 'منشورات وتحديثات', ru: 'Посты и обновления' },
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      url: 'https://www.tiktok.com/@hus_bassi',
      label: { en: 'Content & Short Videos', ar: 'محتوى وفيديوهات قصيرة', ru: 'Контент и короткие видео' },
    },
    {
      // Russian social network profile.
      key: 'vk',
      name: 'VK',
      url: 'https://vk.ru/hus.bassi',
      label: { en: 'Russian Social Presence', ar: 'حضور اجتماعي روسي', ru: 'Российское присутствие' },
    },
    {
      // Qabilah is an Arabic professional network with no official glyph
      // in the icon set, so it renders as a monogram rather than a mark
      // that would misrepresent the brand.
      key: 'qabilah',
      name: 'Qabilah',
      url: 'https://qabilah.com/profile/hus-bassi',
      label: { en: 'Professional / Profile', ar: 'مهني / ملف تعريفي', ru: 'Профиль / профессиональное' },
    },
  ],
};

// Expose for assets/js/site.js.
if (typeof window !== 'undefined') {
  window.socialData = socialData;
}