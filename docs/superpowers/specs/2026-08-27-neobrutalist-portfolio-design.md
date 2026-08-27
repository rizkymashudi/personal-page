# Neobrutalist Portfolio Rebuild — Design

**Date:** 2026-08-27
**Owner:** Rizky Mashudi
**Status:** Approved, ready for implementation planning

---

## 1. Goal

Rebuild `rizkym.netlify.app` as a new site in neobrutalist style with a tactile,
playground-style interaction layer. Content ports 1:1 from the existing React
portfolio. Design system and every component's presentation are rewritten.

The current site is a terminal/hacker-minimal dark page driven by scroll-jacking.
The rebuild inverts both: bright cream ground, loud color, and visitor-controlled
interaction instead of choreographed scroll.

## 2. Non-goals

- No copy rewriting. Text ports verbatim.
- No project screenshots. Work cards stay text + tags.
- No dark mode. Single committed light look.
- No blog migration off Medium.
- No scroll-jacking, no pinned sections, no smooth-scroll interpolation.

## 3. Location and stack

New project at `/Users/rizkym/Desktop/Personal Project/personal page/`.
The existing `rm dev` project is left untouched and stays live as fallback.

- React 19 + Vite
- CSS Modules + global token file
- Framer Motion (only animation dependency)
- Fonts via `@fontsource`
- Deploy target: Vercel

**Dependencies dropped from the current site:** GSAP, `@gsap/react`,
ScrollTrigger, Lenis. No scroll-jacking means no ScrollTrigger. Lenis is removed
deliberately — smooth-scroll interpolation reads as mush, and this design wants
hard and instant. Native scroll is snappier and ~90KB gzipped lighter.

Final dependency list: `react`, `react-dom`, `framer-motion`, `@fontsource/*`.

## 4. Design system

Sourced from the neubrutalism.com canon, with palette and ornament choices from
the approved mockups.

### 4.1 Stroke

Single canonical stroke: **3px solid `#000000`**. Deviations only for deliberate
hierarchy (2px on small tag pills). Never mixed arbitrarily — inconsistent stroke
width is what makes neobrutalism read as accidental rather than intentional.

### 4.2 Shadow

Zero blur, offset only, always `#000000`.

| Token | Desktop | Mobile |
|---|---|---|
| `--sh-s` | `3px 3px 0 0` | `3px 3px 0 0` |
| `--sh-m` | `5px 5px 0 0` | `4px 4px 0 0` |
| `--sh-l` | `8px 8px 0 0` | `5px 5px 0 0` |
| `--sh-xl` | `12px 12px 0 0` | `8px 8px 0 0` |

Mobile steps down because a 12px offset consumes ~3% of a 375px viewport and
forces cards narrower.

### 4.3 Border radius

`0` everywhere. No exceptions.

### 4.4 Color

Cream is the constant page ground. Color arrives as *objects* on top of it —
chips, stickers, cards — not as section grounds. The one place color-blocking is
used is the mobile menu panel, where there is no content to compete with.

| Token | Hex | Text on it | Role |
|---|---|---|---|
| `--cream` | `#FFFDF5` | black | page ground, quiet cards |
| `--ink` | `#000000` | cream | all strokes, shadows, ticker bar |
| `--lime` | `#B8FF00` | black | chips, nav logo cell, cards |
| `--cyan` | `#00D4D4` | black | cards, ornaments |
| `--yellow` | `#FFD600` | black | cards, small ornaments |
| `--magenta` | `#FF2E88` | **black** | primary CTA, active nav, scrollbar handle |
| `--red` | `#FF3B00` | **black** | secondary accent |
| `--violet` | `#7B2FFF` | **white** | badges, one work card |

**Contrast constraint — this is load-bearing, not a preference.** Measured
against the WCAG 4.5:1 floor for normal text:

| Fill | vs white | vs black | Legal text |
|---|---|---|---|
| `#FF2E88` | 3.50:1 ✗ | 6.00:1 ✓ | black only |
| `#FF3B00` | 3.57:1 ✗ | 5.88:1 ✓ | black only |
| `#7B2FFF` | 5.60:1 ✓ | 3.75:1 ✗ | white only |
| `#B8FF00` | — | 17.4:1 ✓ | black |
| `#00D4D4` | — | 11.3:1 ✓ | black |
| `#FFD600` | — | 15.3:1 ✓ | black |

Violet is the only fill in the palette that takes white text. White-on-magenta and
white-on-red clear 3:1, so they are permitted for large display headlines only —
never for button labels, body copy, or tags.

### 4.5 Typography

| Role | Family | Weight | Used for |
|---|---|---|---|
| Display | Syne | 800 | hero headline, card titles, section headings |
| Heading | Space Grotesk | 700 | buttons, nav links, UI labels |
| Body | Inter | 400 | paragraph copy |
| Mono | Space Mono | 400/700 | section indices `(02.01)`, tags, tickers, meta |

Rule carried from the reference: extreme typographic gestures are reserved for
headline, hero, and CTAs. Everything else stays conventionally readable.

The `(00)`–`(05)` zero-padded section indices from the current site are kept —
they are an existing personality asset and they survive the restyle in Space Mono.

Hero headline: `clamp(2.3rem, 9vw, 4rem)`, line-height `0.84`,
letter-spacing `-2.2px`, uppercase.

### 4.6 Tilt

Cards and stickers sit at a slight rotation. This is not decoration — it is the
affordance that signals *this object is loose and can be picked up*. Flat cards
read as fixed panels and undercut the drag layer.

- Desktop: ±2.5°
- Mobile: ±1.4° (at 2.5° a full-bleed card clips the viewport edge and triggers
  horizontal page scroll — a real bug, not a taste call)

Per-item rotation values already exist in the ported data as `PROJECTS[].rotate`
and `SKILLS[].tilt`. Reuse them; do not randomize at runtime, or positions will
shift between renders.

### 4.7 Interaction states

Three-stage, applied to every interactive object:

```css
/* rest */    box-shadow: var(--sh-m);
/* hover */   transform: translate(-2px, -2px); box-shadow: var(--sh-l);
/* active */  transform: translate(3px, 3px);   box-shadow: none;
/* focus-visible */ outline: 3px solid var(--violet); outline-offset: 3px;
```

Hover *lifts* (shadow grows), press *collapses* (shadow gone). Two stages, not
one. Transitions are short and slightly overshooting — no long easing.

## 5. Interaction model — the playground layer

The site is a plain vertical scroll spine with an optional tactile layer on top.
Content is never hostage to an animation. A visitor who scrolls straight down
reads everything and leaves; a visitor who pokes gets rewarded.

**Spine (always):** native vertical scroll, snappy `whileInView` pop-in reveals,
no pinning, no scroll hijacking.

**Playground layer (desktop):**

- Custom chunky cursor, inverts over interactive zones
- Every card presses per §4.7
- Work cards are draggable stickers with momentum and rest-rotation
- Decorative stickers (`✱`, `★`, badges) draggable; positions persist to
  `localStorage` so a return visit remembers the mess
- Tickers grab-draggable; flick to spin faster

**Mobile degradation:**

| Behavior | Desktop | Mobile | Why |
|---|---|---|---|
| free-drag stickers | yes, persisted | **off** | drag on touch fights vertical page scroll; no clean fix without hijacking scroll |
| custom cursor | yes | **off** | gated behind `(hover: hover)` |
| work strip drag | yes | **yes, native** | touch swipe on `overflow-x`; better here than desktop |
| press states | hover lift → press | press only | no hover on touch; `:active` gives the full clunk |
| ornament count | 4 per screen | 2 per screen | they compete with content in a one-card column |

Free-drag stickers on mobile are the one genuine loss. Deferred alternatives:
long-press to pick up (unambiguous against a scroll gesture), or a tap-to-scatter
button. Both additive, both out of scope for v1.

## 6. Page architecture

Order and content identical to the current site.

| ID | Section | Treatment |
|---|---|---|
| (00) | Intro / hero | Syne headline with inline color chips, violet OPEN-TO-WORK badge, stacked CTAs, dot-grid ground |
| — | Skills ticker | Black full-bleed bar, rotated −1.1°, Space Mono, `/` separated, drag to spin |
| (01) | Featured work | Horizontal drag-scroll strip, 14 tilted color cards (13 client projects + 1 academy project), visible chunky scrollbar handle |
| (02) | What I do | 8 stacked tilted cards, `(02.01)`–`(02.08)`, pop-in on view |
| — | Industry ticker | Black bar, reverse direction, `·` separated |
| (03) | Experience | 5 bordered rows, year in a colored left cell |
| (04) | About | Prose block + social links with `↗` |
| (05) | Writing | 3 post cards, date · read-time meta, colored tag pills |

**Nav:** floating slab — hard corners, 3px stroke, `--sh-m`, rotated −1.5°,
sticky at top-center. `RM_` logo on a lime cell, links as bordered cells, magenta
`HIRE ME` cell at the end. On mobile: compact slab + hamburger opening a
full-screen panel where each link is its own color band with its section index.
Panel rows 62px, above the 44px touch minimum.

## 7. Content port

All content ports 1:1 from `rm dev/portfolio-react/src/data/`. Copy the files
unchanged:

| File | Shape |
|---|---|
| `projects.js` | `PROJECTS[]{id, name, desc, tags[], gradient, rotate}` |
| `skills.js` | `SKILLS[]{num, name, desc, from, tilt}` |
| `experience.js` | `CHAPTERS[]{year, date, role, company, location, desc}` |
| `marquee.js` | `TECH_ITEMS[]`, `CLIENT_ITEMS[]` |
| `about.js`, `blog.js` | prose + post metadata |

Two notes:

- `PROJECTS[].gradient` is dead on arrival — it holds `linear-gradient(...)`
  strings for the glassmorphism cards. Neobrutalism forbids gradients. Replace the
  field with a flat `color` token key (`'lime' | 'cyan' | 'yellow' | 'magenta' |
  'violet' | 'cream'`), assigned round-robin so no two adjacent cards share a fill.
- `rotate` and `tilt` port directly into §4.6. No new authoring needed.
- Projects are industry-named (`Banking`, `Telecom`, `Precious Metals
  Marketplace`), not client-named — no NDA exposure.

## 8. Hooks

| Hook | Fate |
|---|---|
| `useMouseTilt` | port — tilt-on-hover suits the style |
| `useTypingAnimation` | **delete** — the blinking cursor was the terminal identity being replaced |
| `useScrollProgress` | optional — feeds a chunky progress bar |
| `useTheme` | **delete** — single theme |
| `useStickerPositions` | **new** — localStorage persistence, quota-safe |
| `useCursor` | **new** — gated behind `(hover: hover)` |

## 9. Accessibility

Non-negotiable floor:

- 4.5:1 for normal text, 3:1 for large text and component boundaries (§4.4)
- Minimum target 44×44px (above the 24px WCAG 2.5.8 floor)
- `focus-visible` ring on every interactive element: 3px solid, 3px offset
- Full keyboard path. Every drag interaction has a keyboard or non-drag
  equivalent — the work strip scrolls with arrow keys, not drag alone
- `prefers-reduced-motion`: pop-in reveals become instant, tickers stop,
  momentum drag becomes plain scroll. Tilt is static transform, so it stays
- Tickers are `aria-hidden` decorative duplicates; the real list is readable
- Semantic landmarks and heading order preserved; loud styling never replaces
  a real `<h2>`

## 10. Testing

- Contrast: automated check of every fill/text token pair against §4.4's table.
  Fails the build on regression.
- Reduced-motion: snapshot with the media feature forced on.
- Responsive: 375 / 768 / 1280 / 1920. Assert no horizontal page scroll at any
  width — the tilt makes this a real risk, not a formality.
- Keyboard: tab through the full page, assert focus ring visible at every stop
  and that the work strip is reachable and scrollable without a pointer.
- Persistence: sticker positions survive reload; corrupt or absent
  `localStorage` falls back to defaults without throwing.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Tilt causes horizontal overflow | `overflow-x: clip` on section wrappers; explicit test at four widths |
| Eight loud colors read as noise | Cream ground is constant; color only on objects; round-robin prevents adjacent clashes |
| Drag layer fights page scroll | Desktop-only for free-drag; work strip uses native `overflow-x` |
| localStorage unavailable | Wrap every read/write in try/catch; render correctly with no stored value |
| Palette is widely used | Magenta as the single reserved CTA color, plus the mono index system, differentiates |

## 12. Deferred to v2

- Long-press sticker drag on touch
- Click sounds
- Project screenshots
- Scroll progress bar
- Tap-to-scatter
