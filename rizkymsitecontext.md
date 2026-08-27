# rizkym.netlify.app — Site Context File
> Source of truth for redesigning this portfolio in **Neobrutalism** style.

---

## 1. Identity & Content

**Owner:** Rizky Mashudi — iOS Engineer, Jakarta, Indonesia  
**Tagline:** "iOS engineer crafting scalable mobile experiences with a focus on clean architecture and thoughtful interfaces"  
**Summary:** 5+ years, 4+ production iOS apps (fintech, banking, government, telecom), 13+ end-to-end client projects, Apple Developer Academy & Essential Developer Academy alumni.

### Sections (in order)
| ID | Label | Purpose |
|----|-------|---------|
| (00) | INTRO | Hero — headline + bio summary + CTAs |
| — | SKILLS TICKER | Auto-scrolling marquee of all tech skills |
| (01) | FEATURED WORK | Horizontal-scroll project cards |
| (02) | WHAT I DO | 8 skill area cards (02.01–02.08) |
| — | INDUSTRY TICKER | Auto-scrolling marquee of industries |
| (03) | EXPERIENCE | Chronological timeline of roles |
| (04) | ABOUT | Prose bio + social links |
| (05) | WRITING | Blog post previews (Medium) |

---

## 2. Current Design Language

### 2.1 Aesthetic
**Terminal / Hacker-Minimal.** The whole site reads like a beautiful developer's terminal — monospace everywhere, numbered section IDs, uppercase labels, blinking cursor. Dark and deliberately understated.

### 2.2 Color Palette (Current)
| Role | Value / Description |
|------|-------------------|
| Background | Near-black `#0d0d0d` |
| Primary text | Off-white `#e5e5e5` |
| Muted text | Dark gray `#555–#666` |
| Accent red | Coral/salmon `#f04f30` (used in hero inline swatch + primary CTA button) |
| Accent cyan | `#00c8c8` (used in hero inline swatch + some card titles) |
| Accent amber | Warm yellow `#e8b84b` (hero inline swatch) |
| Card backgrounds | Very dark with subtle hue shifts (near-black with teal, purple, or neutral tint) |
| Nav border | Dark gray stroke on pill container |

The three accent colors appear literally as **small colored rectangles** inline inside the hero headline — functioning like emoji slots between words — giving the only burst of color on an otherwise monochrome page.

### 2.3 Typography
- **Typeface:** 100% monospace throughout — appears to be a system monospace or a web monospace (Courier-style or JetBrains Mono equivalent)
- **Hero headline:** Very large (clamp ~48–72px), normal weight, line-height tight
- **Section labels:** Small, spaced uppercase `(00) INTRO` — acts as an index marker
- **Body text:** 14–16px monospace, muted color, low contrast intentionally
- **Nav links:** Small uppercase tracking-wide
- **Tags/pills on cards:** Small monospace, outlined pill shape

### 2.4 Layout
- **Max-width:** Roughly 1200px, left-padded
- **Hero:** Two-column — left text, right decorative "hello" sticker illustration (colorful gradient lettering)
- **Navbar:** Centered pill floating at top — contains logo `RM_` + nav links + dark/light toggle icon
- **Work section:** Horizontal scroll container — cards side by side, overflow scrolls left/right
- **Skills section:** Single card centered vertically in viewport, driven by scroll (one skill category revealed per scroll step)
- **Experience:** Vertical timeline — year on left, role details on right
- **Writing:** Blog post rows with date, read time, title, excerpt, and tags

### 2.5 Component Details

**Navbar pill**
- Rounded-rectangle container (border-radius ~999px)
- Dark background, thin border
- Centered horizontally, sticky at top
- Logo `RM_` with blinking underscore cursor on the left
- Light/dark toggle button (sun ☀️ icon) on the right end

**Hero headline**
- Multi-line large text with colored square swatches (`■`) placed inline between words
- Blinking cursor `|` at the end of the last word (terminal blink animation)

**CTA buttons (hero)**
- Primary: filled red button, uppercase monospace label — `VIEW WORK ↓`
- Secondary: ghost/outline style — `GET IN TOUCH`

**Skills ticker**
- Full-width horizontal marquee, auto-scrolling left
- Items separated by `/` — `SWIFT/ SWIFTUI/ UIKIT/…`
- Infinite loop, two copies for seamless scroll

**Work cards**
- Rounded corners (~16px), dark backgrounds with subtle color variation
- Some cards have a faint hue (teal wash, purple wash, neutral) for differentiation
- Card title in monospace, colored on highlighted/active card
- Description body text, small
- Tech tags as outlined pills at the bottom
- Horizontal scroll container — no scroll bar visible (custom or hidden)

**Skill area cards (02)**
- Displayed one at a time, centered in viewport
- Small numbered label `(02.01)` in accent cyan
- Title in bold monospace
- Description below in muted body text
- Card has rounded corners, dark border

**Experience timeline**
- Year markers on the left in muted monospace
- Role title, company, location on the right
- Date range in small text
- Description paragraph below each entry

**Writing cards**
- Date · read-time on top
- Title as a link (with ↗ external icon)
- Excerpt below
- Inline tag pills (Psychology, iOS, Agile…)

---

## 3. UX Behaviors

| Behavior | Description |
|----------|-------------|
| **Sticky floating nav** | Pill navbar stays fixed at top-center on scroll |
| **Blinking cursor** | `RM_` logo and hero text last word have CSS blink animation |
| **Scroll-triggered reveals** | Sections fade/slide in as user scrolls into them |
| **Horizontal scroll (work)** | Project cards scroll horizontally; container overflows |
| **Scroll-driven skill cards** | What I Do cards animate in one-by-one tied to scroll position |
| **Auto-scroll marquees** | Two tickers (skills + industries) play on loop, no interaction needed |
| **Light/dark toggle** | Sun icon in nav toggles between dark (default) and light mode |
| **External link arrows** | Blog posts and social links use `→` or `↗` to signal external |
| **Section IDs** | Each major section has a zero-padded number prefix `(00)`, `(01)`… used as anchors |
| **Generous spacing** | Very large vertical rhythm between sections — creates breathing room |
| **No images/screenshots** | Work section uses text + tags only — no project screenshots |

---

## 4. Content Architecture (for Neobrutalism Redesign)

Keep all content 1:1. These are the content blocks to port:

```
Hero
  ├── Name / role
  ├── Multi-line headline with color accent swatches
  ├── Short bio paragraph (5+ years, 13+ projects…)
  └── CTAs: [VIEW WORK] [GET IN TOUCH]

Skills Ticker
  └── Tech stack, separated by /

Work Grid (13 projects)
  ├── Project name + industry
  ├── Description (1–3 sentences)
  └── Tech tags (Swift, MVVM, Clean Architecture…)

What I Do (8 categories: 02.01–02.08)
  ├── iOS development
  ├── Architecture & design patterns
  ├── Team leadership
  ├── SDK development
  ├── Wearable & companion
  ├── Engineering culture
  ├── Web development
  └── Writing & sharing

Experience Timeline (5 entries, 2019–present)
  ├── Student Engineer @ Essential Developer Academy
  ├── iOS Engineer @ Nusantara Beta Studio
  ├── iOS Developer (Contract) @ NBS
  ├── Learner @ Apple Developer Academy
  └── Junior Web Developer @ PT Asta Satria Investama

About
  ├── Bio paragraph
  └── Social links: LinkedIn, GitHub, Medium, Email

Writing (3 posts shown)
  ├── Jun 2025 — Kenapa pas liat saldo asli jadi males belanja?
  ├── Nov 2024 — Leveling Up Your iOS Dev Game
  └── Nov 2024 — Navigating Unclear Requirements in Scrum
```

---

## 5. Neobrutalism Translation Notes

Use these mappings when rebuilding in Neobrutalism style:

| Current (Minimal Dark) | → Neobrutalism |
|------------------------|----------------|
| Near-black bg | → Bright off-white or bold flat color bg (e.g. `#FFFBE6`, `#F5F0E8`) |
| Subtle card borders | → Heavy 3–4px solid black borders |
| Rounded pill nav | → Hard rectangular nav bar, flat black border |
| Soft card shadows | → Offset solid-color shadows (`4px 4px 0px #000`) |
| Muted monospace | → Bold monospace or display sans — loud, high contrast |
| Small colored swatches | → Large color blocks, stickers, or brutalist highlight bars |
| Hidden scrollbar | → Styled scrollbar or drag-scroll with visible handle |
| Smooth fade-in reveals | → Snappy slide-in or pop-in (short duration, slight overshoot) |
| Monochrome tags/pills | → Filled color tag blocks with black borders |
| Ghost CTA button | → Solid fill + thick black border + offset shadow hover state |
| Floating pill navbar | → Full-width top bar OR docked left sidebar with thick borders |
| Subtle color differentiation on cards | → Loud card background colors per category (red, yellow, blue, green…) |
| Centered blinking cursor | → Big decorative asterisk `*` or sticker-style callout |
| Horizontal scroll (work) | → Scrollable horizontal strip OR bento-style grid with thick gutters |
| Auto-scroll tickers | → Keep — works great in neobrutalism; make the ticker bar bold |
| Timeline (experience) | → Vertical ruled list, numbered with large index numbers |

### Suggested Neobrutalism Color Palette
| Role | Value |
|------|-------|
| Background | `#FFFBE6` warm cream |
| Primary text | `#0D0D0D` near-black |
| Accent 1 | `#FF3B00` vivid red-orange |
| Accent 2 | `#00D4D4` cyan |
| Accent 3 | `#FFD600` vivid yellow |
| Accent 4 | `#0066FF` electric blue |
| Card bg (work) | Alternating accent fills or white |
| Border / shadow | `#0D0D0D` pure black |

### Key Neobrutalism Rules to Apply
1. **Every card and button gets a thick black border** (3–4px solid)
2. **Offset box-shadow** — `4px 4px 0 #000` on cards; remove on hover → creates "press" effect
3. **No border-radius** (or max 2px) — sharp corners everywhere
4. **Font weight is heavy** — use bold or extrabold for headings
5. **Color is used loudly** — section backgrounds, card fills, highlight bars
6. **Whitespace stays generous** — brutalism ≠ cramped; keep the breathing room
7. **Tickers get a thick-bordered strip** with high-contrast text
8. **CTA buttons: filled color + border + offset shadow + hover shifts shadow to 0**
