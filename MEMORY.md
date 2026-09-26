# MEMORY.md — long-term memory

## Hussein — who he is and what he wants

Building a trilingual (AR default/RTL, EN, RU) personal site: data science +
astronomy, aiming at a **Russian state scholarship** (Business Informatics →
MSc Data Science → PhD in Data Science in Astronomy).

His story, in his own terms: 63% in the arts track (he was not trying),
depression, «هايكيو», three years of volleyball (nearly made a third-division
team), a left-eye injury at مركز شباب السلام that ended it, and the decision
not to give up. He collects certificates. He wants to study in Russia.

**How he works:** he reviews text and spacing as strictly as his own name. He
prefers discussion before building but is impatient with long question rounds.
He gives direction in feeling, not in specification — "عايزه فخامة رهيبه" is a
real brief, and it is my job to translate it, not to interrogate him about it.

## Standing rules (also in AGENTS.md — read that file first)

1. **The No-Stacking Rule.** On a design change: rewrite, never stack. Delete
   whatever the change made pointless. `node tools/check.js` enforces it.
2. **The Design Rule.** Dark by default, black base. One spectrum — violet →
   gold → azure — in two tiers, running through the entire site. Always-lit
   UI, not hover-only. Motion never delays content. Reduced motion stops the
   movement and keeps the spectrum.
3. **The Link-Colour Trap.** `a:hover` (0,1,1) beats `.x` (0,1,0). Any link
   with its own colour re-states it on hover, type-qualified.
4. **The Language Rule.** Arabic is pure فصحى, zero Latin characters except
   approved brand names; the switcher reads ع / EN / RU in every language.
5. **The CV Rule.** `CV.md` is the single source of truth; add every new
   credential in all three languages and log it. Never invent one.

## What I have learned the hard way

- **Diagnose before fixing.** I "fixed" a vanishing button label twice: the
  first attempt (a `::after` overlay) was a real but unrelated defect, and the
  actual cause was a CSS specificity trap. Read the cascade, don't guess.
- **A check that cannot fail is worse than no check.** An audit that read zero
  rules and reported "clean" hid a bug for several rounds. Every audit now
  fails loudly when it reads nothing.
- **This environment lies.** The browser window cannot be made visible: no
  rendering steps, so `getComputedStyle` returns stale values, `:hover` never
  engages, and `IntersectionObserver` stays silent. Screenshots are impossible;
  Hussein has to eyeball the site himself. Force a reflow, re-fetch, and
  confirm bytes before believing any odd reading.
- **Verify what I claim.** Hussein checks. A confident summary with a broken
  detail costs more trust than admitting uncertainty.

## Still open

1. **WhatsApp number** for the contact section (`wa.me`).
2. **The empty «مشاريعي» section** — stays honestly empty until he decides
   whether to add a real project or remove the section.
3. **Russian copy needs a native-speaker review** before the scholarship
   committee sees it. This one matters and is easy to forget.
