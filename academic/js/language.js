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

  // Attributes can't be filled with textContent, so a couple of them
  // get their own hooks: placeholder (the certificates search box) and
  // aria-label (e.g. the certificate modal's Close button). Same idea
  // as the loop above — look the key up, write it if we have it.
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (strings[key] !== undefined) {
      el.setAttribute('placeholder', strings[key]);
    }
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (strings[key] !== undefined) {
      el.setAttribute('aria-label', strings[key]);
    }
  });

  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  updateSwitcherState(language);

  // Let data-driven, JS-rendered sections react to a language change and
  // re-render themselves — the certificate cards, for example, aren't
  // [data-i18n] elements, so the loops above can't reach them. Fired on
  // first load and on every switch.
  document.dispatchEvent(new CustomEvent('i18n:languagechange', { detail: { language } }));
}

/**
 * WHAT:  Attaches click handlers to the AR / EN / RU buttons.
 * WHERE: Called once by initLanguage().
 */
function initLanguageSwitcher() {
  ensureLanguageSwitcher();

  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.langSwitch));
  });

  // applyLanguage() already ran (in initLanguage) before the switcher
  // was injected on internal pages, so sync the active button now.
  updateSwitcherState(document.documentElement.lang || detectLanguage());
}

/**
 * WHAT:  Makes sure the AR / EN / RU switcher exists in the header.
 * WHY:   index.html hard-codes the switcher in its nav, but the
 *        internal pages don't — rather than paste the same markup
 *        into every one, this injects it once (a single source of
 *        truth, the same approach js/theme.js takes for the theme
 *        toggle). A page that already has a switcher is left alone,
 *        so index.html is untouched.
 * HOW:   Appends it to .primary-nav, mirroring index.html's structure
 *        so the existing .lang-switcher CSS applies with no changes.
 */
function ensureLanguageSwitcher() {
  if (document.querySelector('[data-lang-switch]')) return;

  const nav = document.querySelector('.primary-nav');
  if (!nav) return;

  const switcher = document.createElement('div');
  switcher.className = 'lang-switcher';
  switcher.setAttribute('aria-label', 'Language switcher');
  switcher.innerHTML = [
    '<button type="button" data-lang-switch="ar" aria-label="العربية">AR</button>',
    '<button type="button" data-lang-switch="en" aria-label="English">EN</button>',
    '<button type="button" data-lang-switch="ru" aria-label="Русский">RU</button>',
  ].join('');
  nav.appendChild(switcher);
}

/**
 * WHAT:  Marks the currently-active language button, so the person
 *        can see which language they're on.
 */
function updateSwitcherState(language) {
  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    const isActive = btn.dataset.langSwitch === language;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}
