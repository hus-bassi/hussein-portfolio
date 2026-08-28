/* ============================================================
   JS/SOCIAL.JS  —  Digital Presence, Discord CTA & footer links
   ------------------------------------------------------------
   Data-driven renderer for data/social.js. Framework-free vanilla
   JS in one IIFE. It fills, wherever they exist on a page:

     • [data-social-grid]   — the premium "Digital Presence" panel
                              (one card per platform: icon, name,
                              short trilingual label, external link).
     • [data-discord-cta]   — the premium community call-to-action.
     • [data-footer-socials]— the compact footer social row (every
                              page), replacing the old hardcoded
                              placeholder links.

   Platform brand colours are used only as a SMALL accent (icon +
   hover border) so no loud logo colour dominates the calm cosmic /
   warm-sunrise theme (§22). A platform with an empty url (e.g. VK
   until its link is provided) is skipped — no dead button (§45).
   Re-renders on i18n:languagechange so labels follow the language.
   Inert on any page that has none of the containers above.
   ============================================================ */

(function () {
  'use strict';

  /* ---- language helpers (same contract as the rest of the site) ---- */

  function activeLang() {
    try {
      var saved = localStorage.getItem('preferredLanguage');
      if (saved === 'ar' || saved === 'en' || saved === 'ru') return saved;
    } catch (e) { /* storage blocked */ }
    var htmlLang = document.documentElement.lang;
    if (htmlLang === 'ar' || htmlLang === 'en' || htmlLang === 'ru') return htmlLang;
    return 'en';
  }

  function localize(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      var lang = activeLang();
      return value[lang] || value.en || Object.values(value)[0] || '';
    }
    return value == null ? '' : value;
  }

  // UI-label translations for the built-in chrome (Discord card, aria).
  function t(key, fallback) {
    try {
      if (typeof translations !== 'undefined' && translations) {
        var lang = activeLang();
        if (translations[lang] && translations[lang][key] != null) return translations[lang][key];
        if (translations.en && translations.en[key] != null) return translations.en[key];
      }
    } catch (e) { /* fall through */ }
    return fallback != null ? fallback : key;
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---- icons (single-path, 24×24, currentColor) ---- */

  var ICONS = {
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    qabilah: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    vk: 'M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.863-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.457 2.27 4.607 2.847 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.406.44-.406h2.744c.373 0 .508.203.508.643v3.473c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.559 1.473 2.049.17.491-.085.745-.576.745z',
    discord: 'M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z',
  };

  // Small accent per platform (icon tint + hover border only). Kept
  // muted; the card body stays on the site theme (§22).
  var ACCENTS = {
    tiktok: '#EE1D52',
    youtube: '#FF3D3D',
    linkedin: '#3B8BEB',
    github: '#8A63D2',
    facebook: '#3B7DF2',
    qabilah: 'var(--color-accent-secondary)',
    vk: '#4C82EB',
    discord: '#5865F2',
  };

  function iconSvg(key) {
    var d = ICONS[key];
    if (!d) return '';
    return '<svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false" fill="currentColor">' +
      '<path d="' + d + '" /></svg>';
  }

  /* ---- renderers ---- */

  // Only platforms that actually have a link render (VK stays silent
  // until its url is provided).
  function activePlatforms() {
    if (typeof socialData === 'undefined' || !socialData.platforms) return [];
    return socialData.platforms.filter(function (p) { return p && p.url; });
  }

  function renderGrid(grid) {
    var cards = activePlatforms().map(function (p) {
      var label = esc(localize(p.label));
      var name = esc(p.name);
      return (
        '<a class="social-card" href="' + esc(p.url) + '" target="_blank" rel="noopener" ' +
        'style="--platform-accent:' + ACCENTS[p.key] + '" ' +
        'aria-label="' + name + ' — ' + label + ' (' + esc(t('opensNewTab', 'opens in a new tab')) + ')">' +
          '<span class="social-card-icon" aria-hidden="true">' + iconSvg(p.key) + '</span>' +
          '<span class="social-card-text">' +
            '<span class="social-card-name">' + name + '</span>' +
            '<span class="social-card-label">' + label + '</span>' +
          '</span>' +
        '</a>'
      );
    }).join('');
    grid.innerHTML = cards;
  }

  function renderDiscord(container) {
    if (typeof socialData === 'undefined' || !socialData.discord || !socialData.discord.url) {
      container.innerHTML = '';
      return;
    }
    var d = socialData.discord;
    container.innerHTML =
      '<a class="discord-card" href="' + esc(d.url) + '" target="_blank" rel="noopener" ' +
      'style="--platform-accent:' + ACCENTS.discord + '">' +
        '<span class="discord-icon" aria-hidden="true">' + iconSvg('discord') + '</span>' +
        '<span class="discord-text">' +
          '<span class="discord-title">' + esc(t('discordTitle', 'Join the Community')) + '</span>' +
          '<span class="discord-sub">' + esc(t('discordSubtitle', 'A relaxed Discord server for the journey — say hi.')) + '</span>' +
        '</span>' +
        '<span class="btn btn-primary discord-btn" aria-hidden="true">' + esc(t('discordButton', 'Join the Server')) + '</span>' +
      '</a>';
  }

  // Compact footer row: icon + name, same active-platform list.
  function renderFooter(nav) {
    nav.innerHTML = activePlatforms().map(function (p) {
      return (
        '<a class="social-link" href="' + esc(p.url) + '" target="_blank" rel="noopener" ' +
        'style="--platform-accent:' + ACCENTS[p.key] + '">' +
          '<span class="social-link-icon" aria-hidden="true">' + iconSvg(p.key) + '</span>' +
          esc(p.name) +
        '</a>'
      );
    }).join('');
  }

  function renderAll() {
    document.querySelectorAll('[data-social-grid]').forEach(renderGrid);
    document.querySelectorAll('[data-discord-cta]').forEach(renderDiscord);
    document.querySelectorAll('[data-footer-socials]').forEach(renderFooter);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof socialData === 'undefined') return; // data file not loaded → inert
    renderAll();
    // Follow runtime language switches (labels + aria + Discord chrome).
    document.addEventListener('i18n:languagechange', renderAll);
  });
})();
