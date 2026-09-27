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

## Motion: he asked for it three times

He reported "there is no animation on the site", then "لا انا عايز انيميشن",
then — after the layer came back — "مافيش استعجال، كل حاجة بتتحرك بسرعة".
Three rounds, and the first two rounds I got the direction backwards.

1. The reduced-motion block answered with `animation-duration: .001ms` on
   everything, which freezes the whole cinematic layer into a single frame. A
   headless browser reports `prefers-reduced-motion: reduce` by default, so I
   read that as evidence about *his* machine and told him to change an OS
   setting. Wrong — it was a bug in my CSS, and the signal came from the test
   browser, not from him. Never diagnose a visitor's environment from headless.
2. The loops were 38s, 46s, 30s, 16s. I concluded from that that nothing above
   ~12s is perceived as motion, and wrote the rule into `css-audit`. **That
   rule was wrong in the other direction** and it is now the opposite: he wants
   the deep end. 4s to 60s, slow is good. A check that encodes a guess about
   what he wants will eventually forbid the thing he asked for, so the bound
   belongs to the site's own token vocabulary, not to a number I picked.
3. The real reason everything felt fast was a one-line trap in the stylesheet:
   `animation-duration: calc(var(--real-dur, 1s) * (1 - var(--still)))` at the
   TOP level. `var(--real-dur)` is only declared for the panes, so every other
   loop on the site was silently running at **1 second** — the button aura, the
   marquee, the stars, the name's gleam, the rail. A reduced-motion rule that
   is not inside its media query is not a reduced-motion rule. The fix was to
   put the whole layer in the query, and the audit now refuses that arithmetic
   by name.

The header's circular motion switch is **gone**, at his instruction: it
duplicated a decision he had already made in his system settings. That took
`Motion.set`, the localStorage override and the `--still` property with it.
`assets/js/motion.js` is now a single question asked of the OS media query.

He also had a real bug pointed out to me in passing: `index.html` never loaded
`scroll.js` or `reveal.js`, so the home page had no reveals at all and no
back-to-top button, while the other two pages did. Two script tags. Verify that
a page loads the scripts it needs rather than assuming it does.

And the environment lied twice more: a **cached `site.css`** was served after I
had already changed a rule, and I spent a round chasing a "bug" that was not
in the file. Confirm the bytes (fetch with a cache-buster) before believing a
strange computed style.

Fourth round: I put a **white band and a 3D tilt on every card** to "prove"
the new motion system, and he sent it back twice — the pale patch was the
`rgba(255,255,255,.55)` layer in the pane recipe, not anything pointer-driven.
Lesson, now in the audit: **a surface must never paint a light inside
itself.** If an effect needs the pointer's position inside an element, it
needs a layout read per frame, and it will be read as a flashlight rather
than as polish. Lift + border + glow is enough, and it is a CSS `:hover`.

The same round found that **`index.html` never loaded `scroll.js` or
`reveal.js`**, so the home page had no reveals and no back-to-top button while
the other two pages did — two script tags. And that **three copies of the
header/nav/to-top code** (one per page script) had drifted. Verify that a page
loads what it needs; and when the same furniture appears in three files, that
is one implementation that has not been written yet.

Fifth round, on the buttons: he said the hover "is too weak / too static", and
two CSS mechanics explained it completely. The `aura` keyframe animates
`box-shadow`, and **an animation beats a normal declaration for the same
property**, so every hover shadow written into the button rules had been
silently discarded — the rule was there, the effect was not. And the light
sweep was a *background layer* 220% wide: a background position is a
percentage of (container − layer), so it moved the bright band 288% of a
button-width in the **wrong direction**, leaving it off-screen for almost the
whole second. The fixes are both worth remembering: a hover glow belongs in
`filter: drop-shadow()` (resting at zero alpha so two shadows interpolate),
and a travelling highlight belongs in a pseudo-element at `z-index: -1` —
negative, because the default puts it over the label.

Sixth: the big ghost section numerals were reported as "colliding with the
heading", and the real fault was geometric rather than a paint one — they were
`position: absolute` at `-0.06em` from the heading's own start edge, so a 104px
numeral sat in the same box as the first 38px of a heading, and the logical
mirroring made Arabic collide with denser glyphs. The lesson generalises: **a
decorative thing positioned over content is a collision in one of the two
writing directions, guaranteed.** Put it in the flow, give it a gap token, and
make any reveal travel point AWAY from the content — a 14px downward arrival
ate the entire 8–14px gap. Measuring `getBoundingClientRect` on every pair,
in both the pre-reveal and settled states, found what reading the CSS did not:
216 pairs looked fine in the stylesheet and 108 of them were overlapping at
1–3px in the browser.

## Still open

1. **WhatsApp number** for the contact section (`wa.me`).
2. **The empty «مشاريعي» section** — stays honestly empty until he decides
   whether to add a real project or remove the section.
3. **Russian copy needs a native-speaker review** before the scholarship
   committee sees it. This one matters and is easy to forget.
