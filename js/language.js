/* ============================================================
   JS/LANGUAGE.JS
   Handles everything about which language the page is shown in:

   1. Detects a language on first visit (saved choice > browser
      language > English fallback).
   2. Applies it: walks every [data-i18n] element and fills in the
      matching string from data/translations.js, and sets <html
      lang> + <html dir> for correct RTL layout.
   3. Wires up the AR / EN / RU switcher buttons in the nav, and
      remembers the choice in localStorage.

   Runs on every page that includes data/translations.js and has
   a language switcher in its header — pages not yet migrated
   (see the note at the top of data/translations.js) simply won't
   have matching data-i18n attributes yet, so this script safely
   does nothing to their untranslated content.
   ============================================================= */

const SUPPORTED_LANGUAGES = ['ar', 'en', 'ru'];
const RTL_LANGUAGES = ['ar'];
const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
});

/**
 * WHAT:  Figures out which language to show, then applies it and
 *        wires up the switcher buttons.
 * WHY:   Single entry point so every page just needs to call this
 *        once, instead of repeating the detection logic everywhere.
 */
function initLanguage() {
  const language = detectLanguage();
  applyLanguage(language);
  initLanguageSwitcher();
}

/**
 * WHAT:  Decides which language to use, in priority order:
 *        1. A language the person already chose (saved in localStorage)
 *        2. Their browser/device language, if it's one we support
 *        3. English, as the fallback for everything else
 * WHY:   Matches the exact priority order from the original brief —
 *        a manual choice always wins, then browser language, then English.
 */
function detectLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }

  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }

  return 'en';
}

/**
 * WHAT:  Applies one language to the whole page.
 * WHY:   Single place that touches the DOM for language changes,
 *        called both on page load and whenever the person clicks
 *        a switcher button.
 * HOW:   Sets <html lang> and <html dir> (dir="rtl" only for
 *        Arabic — this is what flips every inset-inline-*,
 *        margin-inline-*, border-inline-* rule in css/main.css
 *        automatically, no separate RTL stylesheet needed), fills
 *        in every [data-i18n] element's text, and saves the choice.
 */
function applyLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) language = 'en';

  const strings = translations[language];
  document.documentElement.lang = language;
  document.documentElement.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (strings[key] !== undefined) {
      el.textContent = strings[key];
    }
  });

  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  updateSwitcherState(language);
}

/**
 * WHAT:  Attaches click handlers to the AR / EN / RU buttons.
 * WHERE: Called once by initLanguage().
 */
function initLanguageSwitcher() {
  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.langSwitch));
  });
}

/**
 * WHAT:  Marks the currently-active language button, so the person
 *        can see which language they're on.
 */
function updateSwitcherState(language) {
  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.langSwitch === language);
  });
}
