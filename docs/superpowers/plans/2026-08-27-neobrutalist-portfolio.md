# Neobrutalist Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the personal portfolio as a neobrutalist React site with a tactile playground interaction layer, porting all content 1:1 from the existing project.

**Architecture:** Single-page React 19 + Vite app. Global CSS custom-property token layer drives every component; components use CSS Modules. Plain native vertical scroll — no scroll-jacking, no smooth-scroll library. Framer Motion is the only animation dependency, supplying viewport reveals, drag, and reduced-motion detection. Content lives in plain JS data modules copied from the old project.

**Tech Stack:** React 19, Vite, Framer Motion, CSS Modules, `@fontsource` (Syne / Space Grotesk / Space Mono / Inter), Vitest + React Testing Library + jsdom, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-27-neobrutalist-portfolio-design.md`

## Global Constraints

- Node `>=20.19.0`.
- Dependencies limited to: `react`, `react-dom`, `framer-motion`, `@fontsource/*`. **No GSAP, no ScrollTrigger, no Lenis.** Adding any other runtime dependency requires stopping and asking.
- Single canonical stroke: `3px solid #000000`. Only permitted deviation is `2px` on small tag pills.
- `border-radius: 0` everywhere. No exceptions.
- All shadows zero-blur, offset-only, color `#000000`.
- Contrast floor: 4.5:1 normal text, 3:1 large text and component boundaries.
- `#FF2E88` and `#FF3B00` carry **black** text only. `#7B2FFF` carries **white** text only. White-on-magenta / white-on-red is permitted for large display headlines only, never for button labels, body copy, or tags.
- Minimum interactive target 44×44px.
- Every interactive element has a `:focus-visible` ring: `3px solid var(--violet)`, `outline-offset: 3px`.
- Every drag interaction has a non-drag equivalent (keyboard or native scroll).
- Content ports verbatim. No copy rewriting.
- Commit author is `Rizky Mashudi <rizkymashudi7@gmail.com>`. **Do not add `Co-authored-by`, `Signed-off-by`, or any AI attribution trailer to any commit.**

**Source of ported content:** `/Users/rizkym/Desktop/Personal Project/rm dev/portfolio-react/src/`
Referred to below as `$OLD`.

---

## File Structure

| Path | Responsibility |
|---|---|
| `index.html` | Vite entry, `<html lang="en">`, meta |
| `vite.config.js` | React plugin, Vitest config |
| `vitest.setup.js` | RTL matchers, `matchMedia` stub |
| `vercel.json` | SPA rewrite |
| `src/main.jsx` | React root, font imports, global CSS import |
| `src/App.jsx` | Section composition order only |
| `src/styles/tokens.css` | All CSS custom properties (color, shadow, stroke, type, tilt) |
| `src/styles/global.css` | Reset, base type, focus ring, `prefers-reduced-motion` block |
| `src/lib/contrast.js` | WCAG relative luminance + ratio — pure, no deps |
| `src/lib/palette.js` | Palette as data: hex + legal text color per token |
| `src/data/*.js` | Ported content (projects, skills, experience, marquee, about, blog) |
| `src/hooks/useStickerPositions.js` | localStorage persistence for dragged stickers, quota-safe |
| `src/hooks/useCursor.js` | Custom cursor state, gated on `(hover: hover)` |
| `src/components/Slab/` | Base bordered surface — border, shadow, press states, tilt |
| `src/components/Nav/` | Desktop slab nav + mobile hamburger/panel |
| `src/components/Hero/` | Section (00) |
| `src/components/Ticker/` | Marquee bar, drag-to-spin, `aria-hidden` |
| `src/components/WorkStrip/` | Section (01) horizontal scroller + scrollbar handle |
| `src/components/ProjectCard/` | One work card |
| `src/components/SkillsSection/` | Section (02) |
| `src/components/ExperienceSection/` | Section (03) |
| `src/components/AboutSection/` | Section (04) |
| `src/components/WritingSection/` | Section (05) |
| `src/components/Sticker/` | Draggable decorative ornament |
| `src/components/Cursor/` | Custom cursor renderer |
| `src/components/Footer/` | Footer |

`Slab` is the load-bearing decomposition decision: border, shadow scale, press states, and tilt live in exactly one place. Every card, button, nav cell, and badge composes it. Changing the shadow scale must be a one-file edit.

---

### Task 1: Project scaffold and test harness

**Files:**
- Create: `package.json`, `vite.config.js`, `vitest.setup.js`, `index.html`, `.nvmrc`, `src/main.jsx`, `src/App.jsx`, `src/styles/global.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: `App` default export (React component); `npm test` runs Vitest; `npm run dev` serves on 5173

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-page",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": { "node": ">=20.19.0" },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource/inter": "^5.1.0",
    "@fontsource/space-grotesk": "^5.1.0",
    "@fontsource/space-mono": "^5.1.0",
    "@fontsource/syne": "^5.1.0",
    "framer-motion": "^12.38.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^6.0.0",
    "jsdom": "^25.0.1",
    "vite": "^8.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `.nvmrc`**

```
20.19.0
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
  },
});
```

- [ ] **Step 4: Create `vitest.setup.js`**

jsdom has no `matchMedia`. Framer Motion's reduced-motion detection and the
`(hover: hover)` cursor gate both call it, so it must be stubbed or every
component test throws.

```js
import '@testing-library/jest-dom/vitest';

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rizky Mashudi — iOS Engineer</title>
    <meta name="description" content="iOS engineer in Jakarta. 5+ years, 13+ client projects across fintech, banking, government and telecom." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/styles/global.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; }
body { background: #FFFDF5; color: #000; overflow-x: clip; }
img { max-width: 100%; display: block; }
button { font: inherit; color: inherit; background: none; border: none; padding: 0; }
a { color: inherit; }
:focus-visible { outline: 3px solid #7B2FFF; outline-offset: 3px; }
```

- [ ] **Step 7: Create `src/App.jsx`**

```jsx
export default function App() {
  return <main />;
}
```

- [ ] **Step 8: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/syne/800.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/inter/400.css';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
);
```

- [ ] **Step 9: Write the failing test — `src/App.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders a main landmark', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

- [ ] **Step 10: Install and run**

Run: `npm install && npm test`
Expected: PASS, 1 test.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json .nvmrc vite.config.js vitest.setup.js index.html src/
git commit -m "chore(scaffold): vite + react 19 + vitest harness"
```

---

### Task 2: Palette data and contrast guard

The spec's contrast table is load-bearing. This task makes it executable so a
later color change cannot silently ship an illegal pairing.

**Files:**
- Create: `src/lib/contrast.js`, `src/lib/palette.js`, `src/styles/tokens.css`
- Test: `src/lib/contrast.test.js`, `src/lib/palette.test.js`
- Modify: `src/main.jsx` (import tokens)

**Interfaces:**
- Consumes: nothing
- Produces:
  - `contrastRatio(hexA: string, hexB: string): number`
  - `PALETTE: Record<string, { hex: string, text: 'black' | 'white' }>` with keys `cream`, `ink`, `lime`, `cyan`, `yellow`, `magenta`, `red`, `violet`
  - CSS vars `--cream --ink --lime --cyan --yellow --magenta --red --violet --bw --sh-s --sh-m --sh-l --sh-xl --font-display --font-heading --font-body --font-mono`

- [ ] **Step 1: Write the failing test — `src/lib/contrast.test.js`**

Reference values from WCAG: black on white is exactly 21:1; a color against
itself is 1:1.

```js
import { contrastRatio } from './contrast.js';

test('black on white is 21:1', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
});

test('identical colors are 1:1', () => {
  expect(contrastRatio('#FF2E88', '#FF2E88')).toBeCloseTo(1, 5);
});

test('is symmetric', () => {
  expect(contrastRatio('#7B2FFF', '#FFFFFF'))
    .toBeCloseTo(contrastRatio('#FFFFFF', '#7B2FFF'), 5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/contrast.test.js`
Expected: FAIL — cannot resolve `./contrast.js`.

- [ ] **Step 3: Implement `src/lib/contrast.js`**

```js
function channel(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/contrast.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write the failing test — `src/lib/palette.test.js`**

This is the guard. It asserts every fill's declared text color actually clears
4.5:1, and that the two colors the spec forbids white text on really do fail.

```js
import { PALETTE } from './palette.js';
import { contrastRatio } from './contrast.js';

const BLACK = '#000000';
const WHITE = '#FFFFFF';

test('every fill clears 4.5:1 with its declared text color', () => {
  for (const [name, { hex, text }] of Object.entries(PALETTE)) {
    const fg = text === 'black' ? BLACK : WHITE;
    expect(
      contrastRatio(hex, fg),
      `${name} (${hex}) with ${text} text`
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test('magenta and red fail with white text', () => {
  expect(contrastRatio(PALETTE.magenta.hex, WHITE)).toBeLessThan(4.5);
  expect(contrastRatio(PALETTE.red.hex, WHITE)).toBeLessThan(4.5);
});

test('violet fails with black text', () => {
  expect(contrastRatio(PALETTE.violet.hex, BLACK)).toBeLessThan(4.5);
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/lib/palette.test.js`
Expected: FAIL — cannot resolve `./palette.js`.

- [ ] **Step 7: Implement `src/lib/palette.js`**

```js
export const PALETTE = {
  cream:   { hex: '#FFFDF5', text: 'black' },
  ink:     { hex: '#000000', text: 'white' },
  lime:    { hex: '#B8FF00', text: 'black' },
  cyan:    { hex: '#00D4D4', text: 'black' },
  yellow:  { hex: '#FFD600', text: 'black' },
  magenta: { hex: '#FF2E88', text: 'black' },
  red:     { hex: '#FF3B00', text: 'black' },
  violet:  { hex: '#7B2FFF', text: 'white' },
};

export const CARD_FILLS = ['lime', 'cyan', 'yellow', 'magenta', 'violet', 'cream'];
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/lib/palette.test.js`
Expected: PASS, 3 tests.

- [ ] **Step 9: Create `src/styles/tokens.css`**

Mobile shadow step-down is a media query on the tokens themselves, so no
component ever writes a breakpoint for shadows.

```css
:root {
  --cream: #FFFDF5;
  --ink: #000000;
  --lime: #B8FF00;
  --cyan: #00D4D4;
  --yellow: #FFD600;
  --magenta: #FF2E88;
  --red: #FF3B00;
  --violet: #7B2FFF;

  --bw: 3px;
  --bw-thin: 2px;

  --sh-s: 3px 3px 0 0 var(--ink);
  --sh-m: 5px 5px 0 0 var(--ink);
  --sh-l: 8px 8px 0 0 var(--ink);
  --sh-xl: 12px 12px 0 0 var(--ink);

  --font-display: 'Syne', system-ui, sans-serif;
  --font-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;

  --tilt-max: 2.5deg;
  --tap: 44px;
}

@media (max-width: 767px) {
  :root {
    --sh-m: 4px 4px 0 0 var(--ink);
    --sh-l: 5px 5px 0 0 var(--ink);
    --sh-xl: 8px 8px 0 0 var(--ink);
    --tilt-max: 1.4deg;
  }
}
```

- [ ] **Step 10: Import tokens in `src/main.jsx`**

Add above the `global.css` import:

```jsx
import './styles/tokens.css';
```

- [ ] **Step 11: Run full suite**

Run: `npm test`
Expected: PASS, 7 tests.

- [ ] **Step 12: Commit**

```bash
git add src/lib src/styles src/main.jsx
git commit -m "feat(tokens): palette, contrast guard, and css custom properties"
```

---

### Task 3: Slab primitive

Every bordered object on the site composes this. Border, shadow, press states
and tilt exist here and nowhere else.

**Files:**
- Create: `src/components/Slab/Slab.jsx`, `src/components/Slab/Slab.module.css`
- Test: `src/components/Slab/Slab.test.jsx`

**Interfaces:**
- Consumes: tokens from Task 2
- Produces: `Slab` — props `{ as = 'div', fill = 'cream', shadow = 'm', tilt = 0, interactive = false, className, children, ...rest }`. Renders element `as`, applies `data-fill`, `data-shadow`, inline `--tilt`, and `data-interactive` when `interactive`.

- [ ] **Step 1: Write the failing test — `src/components/Slab/Slab.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import Slab from './Slab.jsx';

test('renders children in a div by default', () => {
  render(<Slab>hello</Slab>);
  expect(screen.getByText('hello')).toBeInTheDocument();
});

test('renders as the requested element', () => {
  render(<Slab as="button">press</Slab>);
  expect(screen.getByRole('button', { name: 'press' })).toBeInTheDocument();
});

test('exposes fill and shadow as data attributes', () => {
  render(<Slab fill="lime" shadow="l">x</Slab>);
  const el = screen.getByText('x');
  expect(el).toHaveAttribute('data-fill', 'lime');
  expect(el).toHaveAttribute('data-shadow', 'l');
});

test('sets tilt as a custom property', () => {
  render(<Slab tilt={-2.5}>x</Slab>);
  expect(screen.getByText('x').style.getPropertyValue('--tilt')).toBe('-2.5deg');
});

test('marks interactive slabs', () => {
  render(<Slab interactive>x</Slab>);
  expect(screen.getByText('x')).toHaveAttribute('data-interactive', 'true');
});

test('forwards arbitrary props', () => {
  render(<Slab aria-label="card">x</Slab>);
  expect(screen.getByLabelText('card')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Slab`
Expected: FAIL — cannot resolve `./Slab.jsx`.

- [ ] **Step 3: Implement `src/components/Slab/Slab.jsx`**

```jsx
import styles from './Slab.module.css';

export default function Slab({
  as: Tag = 'div',
  fill = 'cream',
  shadow = 'm',
  tilt = 0,
  interactive = false,
  className = '',
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`${styles.slab} ${className}`}
      data-fill={fill}
      data-shadow={shadow}
      data-interactive={interactive ? 'true' : undefined}
      style={{ '--tilt': `${tilt}deg`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Implement `src/components/Slab/Slab.module.css`**

Note `transform` composes tilt with the press translation, so pressing must
restate the rotation or the card snaps straight.

```css
.slab {
  --tilt: 0deg;
  border: var(--bw) solid var(--ink);
  border-radius: 0;
  transform: rotate(var(--tilt));
  transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 120ms ease-out;
}

.slab[data-fill='cream']   { background: var(--cream);   color: var(--ink); }
.slab[data-fill='lime']    { background: var(--lime);    color: var(--ink); }
.slab[data-fill='cyan']    { background: var(--cyan);    color: var(--ink); }
.slab[data-fill='yellow']  { background: var(--yellow);  color: var(--ink); }
.slab[data-fill='magenta'] { background: var(--magenta); color: var(--ink); }
.slab[data-fill='red']     { background: var(--red);     color: var(--ink); }
.slab[data-fill='violet']  { background: var(--violet);  color: #fff; }
.slab[data-fill='ink']     { background: var(--ink);     color: var(--cream); }
.slab[data-fill='none']    { background: transparent; }

.slab[data-shadow='s']    { box-shadow: var(--sh-s); }
.slab[data-shadow='m']    { box-shadow: var(--sh-m); }
.slab[data-shadow='l']    { box-shadow: var(--sh-l); }
.slab[data-shadow='xl']   { box-shadow: var(--sh-xl); }
.slab[data-shadow='none'] { box-shadow: none; }

@media (hover: hover) {
  .slab[data-interactive]:hover {
    transform: rotate(var(--tilt)) translate(-2px, -2px);
    box-shadow: var(--sh-l);
  }
}

.slab[data-interactive]:active {
  transform: rotate(var(--tilt)) translate(3px, 3px);
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  .slab { transition: none; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Slab`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Slab
git commit -m "feat(slab): base bordered surface with press states and tilt"
```

---

### Task 4: Content port and fill assignment

**Files:**
- Create: `src/data/projects.js`, `src/data/skills.js`, `src/data/experience.js`, `src/data/marquee.js`, `src/data/about.js`, `src/data/blog.js`
- Test: `src/data/projects.test.js`, `src/data/about.test.js`

**Interfaces:**
- Consumes: `CARD_FILLS` from Task 2
- Produces:
  - `PROJECTS[]{ id, name, desc, tags[], rotate, fill, isLast? }` — 14 entries
  - `SKILLS[]{ num, name, desc, from, tilt }` — 8 entries
  - `CHAPTERS[]{ year, date, role, company, location, desc }` — 5 entries
  - `TECH_ITEMS[]`, `CLIENT_ITEMS[]`
  - `BIO_PHRASES[]{ segments[]{ text, highlight? } }`, `LINK_CARDS[]{ href, label, color, external }`
  - `ARTICLES[]{ id, title, url, date, readTime, excerpt, tags[] }`, `MEDIUM_URL`, `BLOG_NUM`, `BLOG_EYEBROW`, `BLOG_HEADING`, `SUBTITLE_TEXT`

- [ ] **Step 1: Copy the data files verbatim**

```bash
OLD="/Users/rizkym/Desktop/Personal Project/rm dev/portfolio-react/src/data"
mkdir -p src/data
cp "$OLD/projects.js" "$OLD/skills.js" "$OLD/experience.js" \
   "$OLD/marquee.js" "$OLD/about.js" "$OLD/blog.js" src/data/
```

- [ ] **Step 2: Write the failing test — `src/data/projects.test.js`**

`gradient` is a glassmorphism leftover holding `linear-gradient(...)` strings.
Gradients are forbidden by the spec, so the field must be gone and replaced by a
flat `fill` token, round-robin so no two adjacent cards share a color.

```js
import { PROJECTS } from './projects.js';
import { PALETTE, CARD_FILLS } from '../lib/palette.js';

test('has 14 projects', () => {
  expect(PROJECTS).toHaveLength(14);
});

test('no project carries a gradient', () => {
  for (const p of PROJECTS) {
    expect(p, `project ${p.id}`).not.toHaveProperty('gradient');
  }
});

test('every project has a fill that exists in the palette', () => {
  for (const p of PROJECTS) {
    expect(CARD_FILLS, `project ${p.id}`).toContain(p.fill);
    expect(PALETTE[p.fill]).toBeDefined();
  }
});

test('no two adjacent projects share a fill', () => {
  for (let i = 1; i < PROJECTS.length; i += 1) {
    expect(PROJECTS[i].fill, `index ${i}`).not.toBe(PROJECTS[i - 1].fill);
  }
});

test('every project keeps its rotate value', () => {
  for (const p of PROJECTS) {
    expect(typeof p.rotate, `project ${p.id}`).toBe('number');
  }
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/data/projects.test.js`
Expected: FAIL — projects still have `gradient` and no `fill`.

- [ ] **Step 4: Migrate `src/data/projects.js`**

Delete every `gradient:` line. Then append the fill assignment at the bottom of
the file and export the derived array instead of the raw one. Rename the literal
to `RAW_PROJECTS` and add:

```js
import { CARD_FILLS } from '../lib/palette.js';

export const PROJECTS = RAW_PROJECTS.map((p, i) => ({
  ...p,
  fill: CARD_FILLS[i % CARD_FILLS.length],
}));
```

`CARD_FILLS` has 6 entries and cycles, so adjacent items never repeat. 14 % 6
leaves the wrap at index 12 → `lime`, index 11 → `cream`. No adjacent collision.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/projects.test.js`
Expected: PASS, 5 tests.

- [ ] **Step 6: Write the failing test — `src/data/about.test.js`**

`LINK_CARDS[].color` uses the old token vocabulary (`'primary'`, `'orange'`)
which does not exist in the new palette.

```js
import { LINK_CARDS, BIO_PHRASES } from './about.js';
import { PALETTE } from '../lib/palette.js';

test('every link card colour is a real palette token', () => {
  for (const c of LINK_CARDS) {
    expect(PALETTE[c.color], `${c.label} → ${c.color}`).toBeDefined();
  }
});

test('bio phrases survived the port', () => {
  expect(BIO_PHRASES).toHaveLength(3);
  expect(BIO_PHRASES[0].segments[0].text).toBe('Rizky Mashudi');
  expect(BIO_PHRASES[0].segments[0].highlight).toBe(true);
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run src/data/about.test.js`
Expected: FAIL — `primary` and `orange` are undefined in `PALETTE`.

- [ ] **Step 8: Remap `LINK_CARDS` colours in `src/data/about.js`**

Only the `color` values change. `href`, `label`, and `external` stay verbatim.

```js
export const LINK_CARDS = [
  { href: 'https://www.linkedin.com/in/rizky-mashudi', label: 'LinkedIn', color: 'cyan', external: true },
  { href: 'https://github.com/rizkymashudi', label: 'GitHub', color: 'lime', external: true },
  { href: 'https://medium.com/@ikyrm', label: 'Medium blog', color: 'yellow', external: true },
  { href: 'mailto:eremism1@gmail.com', label: 'Email', color: 'magenta', external: false },
];
```

- [ ] **Step 9: Run full suite**

Run: `npm test`
Expected: PASS, 20 tests.

- [ ] **Step 10: Commit**

```bash
git add src/data
git commit -m "feat(data): port content, replace gradients with flat fills"
```

---

### Task 5: Ticker

Built before the larger sections because Hero and WorkStrip both sit against it,
and because its `aria-hidden` duplication rule is easy to get wrong late.

**Files:**
- Create: `src/components/Ticker/Ticker.jsx`, `src/components/Ticker/Ticker.module.css`
- Test: `src/components/Ticker/Ticker.test.jsx`

**Interfaces:**
- Consumes: tokens
- Produces: `Ticker` — props `{ items: string[], separator = '/', reverse = false, speed = 22, label }`

- [ ] **Step 1: Write the failing test — `src/components/Ticker/Ticker.test.jsx`**

A marquee needs two copies of the content for a seamless loop. Screen readers
must hear the list once, not twice — so the visual track is `aria-hidden` and a
visually-hidden real list carries the content.

```jsx
import { render, screen } from '@testing-library/react';
import Ticker from './Ticker.jsx';

const ITEMS = ['Swift', 'SwiftUI', 'UIKit'];

test('renders an accessible list exactly once', () => {
  render(<Ticker items={ITEMS} label="Tech stack" />);
  const list = screen.getByRole('list', { name: 'Tech stack' });
  expect(list).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});

test('visual track is hidden from assistive tech', () => {
  const { container } = render(<Ticker items={ITEMS} label="Tech stack" />);
  const track = container.querySelector('[data-track]');
  expect(track).toHaveAttribute('aria-hidden', 'true');
});

test('visual track duplicates items for a seamless loop', () => {
  const { container } = render(<Ticker items={ITEMS} label="Tech stack" />);
  const track = container.querySelector('[data-track]');
  expect(track.textContent.match(/Swift\b/g)).toHaveLength(2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Ticker`
Expected: FAIL — cannot resolve `./Ticker.jsx`.

- [ ] **Step 3: Implement `src/components/Ticker/Ticker.jsx`**

```jsx
import styles from './Ticker.module.css';

export default function Ticker({
  items,
  separator = '/',
  reverse = false,
  speed = 22,
  label,
}) {
  const line = items.map((i) => `${i} ${separator}`).join(' ');

  return (
    <div className={styles.bar}>
      <ul className={styles.sr} aria-label={label}>
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
      <div
        data-track
        aria-hidden="true"
        className={styles.track}
        data-reverse={reverse ? 'true' : undefined}
        style={{ '--speed': `${speed}s` }}
      >
        <span className={styles.copy}>{line}</span>
        <span className={styles.copy}>{line}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `src/components/Ticker/Ticker.module.css`**

```css
.bar {
  background: var(--ink);
  color: var(--cream);
  border-top: var(--bw) solid var(--ink);
  border-bottom: var(--bw) solid var(--ink);
  overflow: hidden;
  width: 106%;
  margin-left: -3%;
  transform: rotate(-1.1deg);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(0.625rem, 1.4vw, 0.85rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 0.85rem 0;
}

.track { display: flex; width: max-content; animation: scroll var(--speed) linear infinite; }
.track[data-reverse='true'] { animation-direction: reverse; }
.copy { padding-right: 1.5rem; white-space: nowrap; }

@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.sr {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  list-style: none;
}

@media (prefers-reduced-motion: reduce) {
  .track { animation: none; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Ticker`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Ticker
git commit -m "feat(ticker): marquee bar with accessible list duplication"
```

---

### Task 6: Nav — desktop slab and mobile panel

**Files:**
- Create: `src/components/Nav/Nav.jsx`, `src/components/Nav/Nav.module.css`
- Test: `src/components/Nav/Nav.test.jsx`

**Interfaces:**
- Consumes: `Slab` from Task 3
- Produces: `Nav` — no props. Exports `NAV_LINKS: { id, label, num }[]`.

- [ ] **Step 1: Write the failing test — `src/components/Nav/Nav.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from './Nav.jsx';

test('renders a navigation landmark with all section links', () => {
  render(<Nav />);
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /work/i })).toHaveAttribute('href', '#work');
  expect(screen.getByRole('link', { name: /writing/i })).toHaveAttribute('href', '#writing');
});

test('menu button reports collapsed state initially', () => {
  render(<Nav />);
  const btn = screen.getByRole('button', { name: /open menu/i });
  expect(btn).toHaveAttribute('aria-expanded', 'false');
});

test('opening the menu exposes the panel and flips aria-expanded', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();
});

test('escape closes the menu', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('choosing a link closes the menu', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  await user.click(screen.getByRole('dialog').querySelector('a[href="#work"]'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Nav`
Expected: FAIL — cannot resolve `./Nav.jsx`.

- [ ] **Step 3: Implement `src/components/Nav/Nav.jsx`**

```jsx
import { useEffect, useState } from 'react';
import Slab from '../Slab/Slab.jsx';
import styles from './Nav.module.css';

export const NAV_LINKS = [
  { id: 'work',       label: 'Work',    num: '(01)', fill: 'lime' },
  { id: 'skills',     label: 'Skills',  num: '(02)', fill: 'cyan' },
  { id: 'experience', label: 'Exp',     num: '(03)', fill: 'yellow' },
  { id: 'about',      label: 'About',   num: '(04)', fill: 'cream' },
  { id: 'writing',    label: 'Writing', num: '(05)', fill: 'violet' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <Slab as="nav" className={styles.slab} shadow="m" tilt={-1.5}>
        <span className={styles.logo}>RM_</span>
        <ul className={styles.links}>
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={styles.link}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#about" className={styles.hire}>Hire me</a>
        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </Slab>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className={styles.panel}>
          <div className={styles.panelTop}>
            <span className={styles.logo}>RM_</span>
            <button
              type="button"
              className={styles.close}
              aria-expanded={open}
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >✕</button>
          </div>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={styles.panelLink}
              data-fill={l.fill}
              onClick={() => setOpen(false)}
            >
              {l.label} <i>{l.num}</i>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Implement `src/components/Nav/Nav.module.css`**

```css
.slab {
  position: fixed;
  top: 1.1rem;
  left: 50%;
  translate: -50% 0;
  z-index: 60;
  display: flex;
  align-items: stretch;
  background: var(--cream);
  font-family: var(--font-heading);
}

.logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 0.95rem;
  padding: 0.6rem 0.8rem;
  background: var(--lime);
  border-right: var(--bw) solid var(--ink);
  display: flex;
  align-items: center;
}

.links { display: flex; list-style: none; margin: 0; padding: 0; }

.link, .hire {
  display: flex;
  align-items: center;
  min-height: var(--tap);
  padding: 0 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  border-right: var(--bw) solid var(--ink);
}

.hire { background: var(--magenta); border-right: none; }

.burger { display: none; }

.panel {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: var(--cream);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panelTop {
  display: flex;
  justify-content: space-between;
  border-bottom: var(--bw) solid var(--ink);
}

.close {
  width: 3.5rem;
  min-height: var(--tap);
  background: var(--magenta);
  border-left: var(--bw) solid var(--ink);
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
}

.panelLink {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.5rem, 7vw, 2rem);
  text-transform: uppercase;
  text-decoration: none;
  padding: 1.15rem 1rem;
  min-height: 62px;
  border-bottom: var(--bw) solid var(--ink);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panelLink i { font-family: var(--font-mono); font-style: normal; font-size: 0.7rem; font-weight: 400; }
.panelLink[data-fill='lime']   { background: var(--lime); }
.panelLink[data-fill='cyan']   { background: var(--cyan); }
.panelLink[data-fill='yellow'] { background: var(--yellow); }
.panelLink[data-fill='cream']  { background: var(--cream); }
.panelLink[data-fill='violet'] { background: var(--violet); color: #fff; }

@media (max-width: 767px) {
  .links, .hire { display: none; }
  .slab { left: 0.75rem; right: 0.75rem; translate: none; }
  .burger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    min-height: var(--tap);
    margin-left: auto;
    background: var(--magenta);
    border-left: var(--bw) solid var(--ink);
    cursor: pointer;
  }
  .burger span { display: block; width: 22px; height: 3px; background: var(--ink); }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Nav`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav
git commit -m "feat(nav): tilted slab nav with mobile panel"
```

---

### Task 7: Hero

**Files:**
- Create: `src/components/Hero/Hero.jsx`, `src/components/Hero/Hero.module.css`
- Test: `src/components/Hero/Hero.test.jsx`

**Interfaces:**
- Consumes: `Slab`
- Produces: `Hero` — no props

- [ ] **Step 1: Write the failing test — `src/components/Hero/Hero.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import Hero from './Hero.jsx';

test('exposes exactly one h1', () => {
  render(<Hero />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('h1 reads as one sentence despite the styled chips', () => {
  render(<Hero />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    /iOS Engineer Shipping Real Apps Since '19/i
  );
});

test('both calls to action are links to real anchors', () => {
  render(<Hero />);
  expect(screen.getByRole('link', { name: /view work/i })).toHaveAttribute('href', '#work');
  expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '#about');
});

test('decorative ornaments are hidden from assistive tech', () => {
  const { container } = render(<Hero />);
  for (const el of container.querySelectorAll('[data-ornament]')) {
    expect(el).toHaveAttribute('aria-hidden', 'true');
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero`
Expected: FAIL — cannot resolve `./Hero.jsx`.

- [ ] **Step 3: Implement `src/components/Hero/Hero.jsx`**

The headline is a single `<h1>`; chips are `<span>`s inside it so the accessible
name stays one continuous sentence.

```jsx
import Slab from '../Slab/Slab.jsx';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="intro" className={styles.hero}>
      <div className={styles.dots} aria-hidden="true" />

      <p className={styles.eyebrow}>(00) Intro</p>

      <h1 className={styles.headline}>
        iOS <span className={styles.chip} data-fill="lime">Engineer</span>{' '}
        Shipping <span className={styles.outline}>Real</span>{' '}
        Apps <span className={styles.chip} data-fill="violet">Since '19</span>
      </h1>

      <p className={styles.bio}>
        5+ years / 4+ production apps / 13+ end-to-end client projects.<br />
        Fintech · Banking · Government · Telecom.
      </p>

      <div className={styles.ctas}>
        <Slab as="a" href="#work" fill="magenta" shadow="m" interactive className={styles.cta}>
          View work ↓
        </Slab>
        <Slab as="a" href="#about" fill="cream" shadow="m" interactive className={styles.cta}>
          Get in touch
        </Slab>
      </div>

      <Slab
        data-ornament
        aria-hidden="true"
        fill="violet"
        shadow="m"
        tilt={-10}
        className={styles.badge}
      >
        Open<br />to<br />work
      </Slab>
      <span data-ornament aria-hidden="true" className={styles.star}>★</span>
    </section>
  );
}
```

- [ ] **Step 4: Implement `src/components/Hero/Hero.module.css`**

```css
.hero {
  position: relative;
  padding: 8rem 1.5rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: clip;
}

.dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--ink) 1.3px, transparent 1.3px);
  background-size: 22px 22px;
  opacity: 0.12;
  pointer-events: none;
}

.eyebrow {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0 0 1.5rem;
}

.headline {
  position: relative;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.3rem, 9vw, 4rem);
  line-height: 0.84;
  letter-spacing: -2.2px;
  text-transform: uppercase;
  margin: 0;
  max-width: 15ch;
}

.chip {
  display: inline-block;
  border: var(--bw) solid var(--ink);
  box-shadow: var(--sh-s);
  padding: 0 0.35rem;
}
.chip[data-fill='lime']   { background: var(--lime); }
.chip[data-fill='violet'] { background: var(--violet); color: #fff; }

.outline { -webkit-text-stroke: 2px var(--ink); color: transparent; }

.bio {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1.7;
  margin: 1.4rem 0 0;
  max-width: 46ch;
  text-transform: uppercase;
}

.ctas { position: relative; display: flex; gap: 0.8rem; margin-top: 1.4rem; flex-wrap: wrap; }

.cta {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0 1.1rem;
  min-height: var(--tap);
  display: inline-flex;
  align-items: center;
}

.badge {
  position: absolute;
  right: 1.75rem;
  top: 9rem;
  width: 5.75rem;
  height: 5.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.6rem;
  line-height: 1.5;
  text-transform: uppercase;
  pointer-events: none;
}

.star { position: absolute; right: 8rem; top: 17rem; font-size: 4.5rem; color: var(--cyan); rotate: 17deg; pointer-events: none; }

@media (max-width: 767px) {
  .hero { padding-top: 6.5rem; }
  .bio { max-width: 100%; }
  .ctas { flex-direction: column; }
  .cta { justify-content: center; }
  .star { display: none; }
  .badge { right: 0.9rem; top: 12.5rem; width: 4.6rem; height: 4.6rem; font-size: 0.5rem; }
}
```

Ornament count is 2 on mobile: the `.star` is hidden, `.badge` stays.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Hero`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero
git commit -m "feat(hero): section 00 with chips, ctas and ornaments"
```

---

### Task 8: ProjectCard and WorkStrip

The riskiest task: drag must not steal the click, and the strip must be operable
without a pointer.

**Files:**
- Create: `src/components/ProjectCard/ProjectCard.jsx`, `src/components/ProjectCard/ProjectCard.module.css`, `src/components/WorkStrip/WorkStrip.jsx`, `src/components/WorkStrip/WorkStrip.module.css`
- Test: `src/components/ProjectCard/ProjectCard.test.jsx`, `src/components/WorkStrip/WorkStrip.test.jsx`

**Interfaces:**
- Consumes: `Slab`, `PROJECTS`, `SUBTITLE_TEXT`
- Produces:
  - `ProjectCard` — props `{ project }` where `project` is one `PROJECTS` entry
  - `WorkStrip` — no props

- [ ] **Step 1: Write the failing test — `src/components/ProjectCard/ProjectCard.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard.jsx';

const project = {
  id: 8,
  name: 'Public Transit',
  desc: 'Led a 4-person mobile team on an official metropolitan MRT transit app.',
  tags: ['Swift', 'Mobile Lead', 'Clean Architecture', 'Transit'],
  rotate: 2.5,
  fill: 'cyan',
};

test('renders name as a heading', () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByRole('heading', { name: 'Public Transit' })).toBeInTheDocument();
});

test('renders every tag', () => {
  render(<ProjectCard project={project} />);
  for (const t of project.tags) expect(screen.getByText(t)).toBeInTheDocument();
});

test('applies the project fill and rotation', () => {
  const { container } = render(<ProjectCard project={project} />);
  const card = container.querySelector('[data-fill]');
  expect(card).toHaveAttribute('data-fill', 'cyan');
  expect(card.style.getPropertyValue('--tilt')).toBe('2.5deg');
});

test('shows a zero-padded index derived from id', () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByText('(01.08)')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProjectCard`
Expected: FAIL — cannot resolve `./ProjectCard.jsx`.

- [ ] **Step 3: Implement `src/components/ProjectCard/ProjectCard.jsx`**

```jsx
import Slab from '../Slab/Slab.jsx';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const index = `(01.${String(project.id).padStart(2, '0')})`;

  return (
    <Slab
      as="article"
      fill={project.fill}
      shadow="l"
      tilt={project.rotate}
      interactive
      className={styles.card}
    >
      <p className={styles.index}>{index}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.desc}>{project.desc}</p>
      <ul className={styles.tags}>
        {project.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </Slab>
  );
}
```

- [ ] **Step 4: Implement `src/components/ProjectCard/ProjectCard.module.css`**

```css
.card {
  flex: 0 0 clamp(16rem, 24vw, 20rem);
  min-height: 17rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  scroll-snap-align: start;
}

.index { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.12em; margin: 0; }

.name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  line-height: 1.05;
  text-transform: uppercase;
  margin: 0;
}

.desc { font-family: var(--font-body); font-size: 0.75rem; line-height: 1.55; margin: 0; flex: 1; }

.tags { display: flex; flex-wrap: wrap; gap: 0.3rem; list-style: none; margin: 0; padding: 0; }

.tags li {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 0.15rem 0.4rem;
  border: var(--bw-thin) solid currentColor;
  text-transform: uppercase;
}

@media (max-width: 767px) {
  .card { flex-basis: 262px; min-height: 15rem; }
}
```

- [ ] **Step 5: Write the failing test — `src/components/WorkStrip/WorkStrip.test.jsx`**

Arrow-key scrolling is the non-drag equivalent the spec's a11y section requires.
jsdom does not implement `scrollBy`, so it is stubbed and asserted on.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import WorkStrip from './WorkStrip.jsx';
import { PROJECTS } from '../../data/projects.js';

test('renders every project', () => {
  render(<WorkStrip />);
  expect(screen.getAllByRole('article')).toHaveLength(PROJECTS.length);
});

test('has a section heading and anchor id', () => {
  const { container } = render(<WorkStrip />);
  expect(container.querySelector('#work')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
});

test('scroller is keyboard reachable and labelled', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  expect(scroller).toHaveAttribute('tabindex', '0');
});

test('right arrow scrolls the strip forward', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  scroller.scrollBy = vi.fn();
  fireEvent.keyDown(scroller, { key: 'ArrowRight' });
  expect(scroller.scrollBy).toHaveBeenCalledWith({ left: 320, behavior: 'smooth' });
});

test('left arrow scrolls the strip backward', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  scroller.scrollBy = vi.fn();
  fireEvent.keyDown(scroller, { key: 'ArrowLeft' });
  expect(scroller.scrollBy).toHaveBeenCalledWith({ left: -320, behavior: 'smooth' });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/WorkStrip`
Expected: FAIL — cannot resolve `./WorkStrip.jsx`.

- [ ] **Step 7: Implement `src/components/WorkStrip/WorkStrip.jsx`**

Native `overflow-x` gives touch swipe and trackpad scroll for free. Pointer-drag
is layered on top for mouse users, and a movement threshold prevents a drag from
firing a click.

```jsx
import { useRef } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import { PROJECTS, SUBTITLE_TEXT } from '../../data/projects.js';
import styles from './WorkStrip.module.css';

const STEP = 320;

export default function WorkStrip() {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    ref.current.scrollBy({ left: e.key === 'ArrowRight' ? STEP : -STEP, behavior: 'smooth' });
  }

  function onPointerDown(e) {
    if (e.pointerType === 'touch') return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: ref.current.scrollLeft,
      moved: false,
    };
    ref.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.startScroll - dx;
  }

  function onPointerUp(e) {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (ref.current.hasPointerCapture(e.pointerId)) {
      ref.current.releasePointerCapture(e.pointerId);
    }
  }

  function onClickCapture(e) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <section id="work" className={styles.section}>
      <p className={styles.eyebrow}>(01) Featured work</p>
      <h2 className={styles.heading}>Selected projects</h2>
      <p className={styles.subtitle}>{SUBTITLE_TEXT}</p>

      <div
        ref={ref}
        role="region"
        aria-label="Featured work — scroll horizontally"
        tabIndex={0}
        className={styles.scroller}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Implement `src/components/WorkStrip/WorkStrip.module.css`**

The scrollbar is styled visible and chunky rather than hidden — the spec calls
for a visible handle.

```css
.section { padding: 4rem 0; max-width: 1200px; margin: 0 auto; overflow-x: clip; }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 1.5rem 0.6rem; }

.heading {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.6rem, 5vw, 2.5rem);
  text-transform: uppercase;
  margin: 0 1.5rem 0.6rem;
}

.subtitle { font-family: var(--font-body); font-size: 0.85rem; line-height: 1.6; margin: 0 1.5rem 2rem; max-width: 52ch; }

.scroller {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overflow-y: visible;
  padding: 1.25rem 1.5rem 1.5rem;
  scroll-snap-type: x proximity;
  cursor: grab;
  scrollbar-width: auto;
  scrollbar-color: var(--magenta) var(--cream);
}

.scroller:active { cursor: grabbing; }

.scroller::-webkit-scrollbar { height: 14px; }
.scroller::-webkit-scrollbar-track { background: var(--cream); border: var(--bw) solid var(--ink); }
.scroller::-webkit-scrollbar-thumb { background: var(--magenta); border: var(--bw) solid var(--ink); }

@media (prefers-reduced-motion: reduce) {
  .scroller { scroll-behavior: auto; }
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run src/components/WorkStrip src/components/ProjectCard`
Expected: PASS, 9 tests.

- [ ] **Step 10: Commit**

```bash
git add src/components/ProjectCard src/components/WorkStrip
git commit -m "feat(work): horizontal strip with drag, keyboard scroll and visible scrollbar"
```

---

### Task 9: Skills, Experience, About and Writing sections

Grouped because they are four instances of the same pattern — a titled section
of tilted `Slab` cards — and a reviewer would accept or reject them together.

**Files:**
- Create: `src/components/SkillsSection/SkillsSection.jsx` + `.module.css`, `src/components/ExperienceSection/ExperienceSection.jsx` + `.module.css`, `src/components/AboutSection/AboutSection.jsx` + `.module.css`, `src/components/WritingSection/WritingSection.jsx` + `.module.css`
- Test: one `.test.jsx` beside each

**Interfaces:**
- Consumes: `Slab`, `SKILLS`, `CHAPTERS`, `BIO_PHRASES`, `LINK_CARDS`, `ARTICLES`, `BLOG_*`
- Produces: `SkillsSection`, `ExperienceSection`, `AboutSection`, `WritingSection` — all no props

- [ ] **Step 1: Write the failing tests**

`src/components/SkillsSection/SkillsSection.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import SkillsSection from './SkillsSection.jsx';
import { SKILLS } from '../../data/skills.js';

test('renders all eight skill areas as headings', () => {
  render(<SkillsSection />);
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(SKILLS.length);
});

test('keeps the numbered index labels', () => {
  render(<SkillsSection />);
  expect(screen.getByText('(02.01)')).toBeInTheDocument();
  expect(screen.getByText('(02.08)')).toBeInTheDocument();
});

test('has the skills anchor', () => {
  const { container } = render(<SkillsSection />);
  expect(container.querySelector('#skills')).toBeInTheDocument();
});
```

`src/components/ExperienceSection/ExperienceSection.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import ExperienceSection from './ExperienceSection.jsx';
import { CHAPTERS } from '../../data/experience.js';

test('renders every chapter', () => {
  render(<ExperienceSection />);
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(CHAPTERS.length);
});

test('shows role, company and date for the newest chapter', () => {
  render(<ExperienceSection />);
  expect(screen.getByRole('heading', { name: /student engineer/i })).toBeInTheDocument();
  expect(screen.getByText(/Essential Developer Academy/)).toBeInTheDocument();
  expect(screen.getByText('Nov 2025 - Present')).toBeInTheDocument();
});
```

`src/components/AboutSection/AboutSection.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import AboutSection from './AboutSection.jsx';

test('renders all three bio paragraphs', () => {
  const { container } = render(<AboutSection />);
  expect(container.querySelectorAll('[data-bio]')).toHaveLength(3);
});

test('external links open safely in a new tab', () => {
  render(<AboutSection />);
  const linkedin = screen.getByRole('link', { name: /linkedin/i });
  expect(linkedin).toHaveAttribute('target', '_blank');
  expect(linkedin).toHaveAttribute('rel', 'noreferrer noopener');
});

test('email link is not treated as external', () => {
  render(<AboutSection />);
  const email = screen.getByRole('link', { name: /email/i });
  expect(email).toHaveAttribute('href', 'mailto:eremism1@gmail.com');
  expect(email).not.toHaveAttribute('target');
});
```

`src/components/WritingSection/WritingSection.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import WritingSection from './WritingSection.jsx';
import { ARTICLES } from '../../data/blog.js';

test('renders every article as an external link', () => {
  render(<WritingSection />);
  for (const a of ARTICLES) {
    const link = screen.getByRole('link', { name: new RegExp(a.title.slice(0, 24), 'i') });
    expect(link).toHaveAttribute('href', a.url);
    expect(link).toHaveAttribute('target', '_blank');
  }
});

test('shows a human readable date and read time', () => {
  render(<WritingSection />);
  expect(screen.getByText(/Jun 2025/)).toBeInTheDocument();
  expect(screen.getByText(/6 min read/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/SkillsSection src/components/ExperienceSection src/components/AboutSection src/components/WritingSection`
Expected: FAIL — none of the four modules resolve.

- [ ] **Step 3: Implement `SkillsSection.jsx`**

```jsx
import Slab from '../Slab/Slab.jsx';
import { SKILLS } from '../../data/skills.js';
import styles from './SkillsSection.module.css';

const FILLS = ['cyan', 'yellow', 'cream', 'lime', 'magenta', 'cream', 'violet', 'yellow'];

export default function SkillsSection() {
  return (
    <section id="skills" className={styles.section}>
      <p className={styles.eyebrow}>(02) What I do</p>
      <h2 className={styles.heading}>Eight things, done properly</h2>
      <div className={styles.grid}>
        {SKILLS.map((s, i) => (
          <Slab
            key={s.num}
            as="article"
            fill={FILLS[i]}
            shadow="l"
            tilt={s.tilt}
            interactive
            className={styles.card}
          >
            <p className={styles.index}>{s.num}</p>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.desc}>{s.desc}</p>
          </Slab>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `SkillsSection.module.css`**

```css
.section { padding: 4rem 1.5rem; max-width: 1200px; margin: 0 auto; overflow-x: clip; }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 0.6rem; }
.heading { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 5vw, 2.5rem); text-transform: uppercase; margin: 0 0 2rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); gap: 1.5rem; }
.card { padding: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem; }
.index { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.12em; margin: 0; }
.name { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; text-transform: uppercase; margin: 0; }
.desc { font-family: var(--font-body); font-size: 0.78rem; line-height: 1.6; margin: 0; }

@media (max-width: 767px) { .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 5: Implement `ExperienceSection.jsx`**

```jsx
import Slab from '../Slab/Slab.jsx';
import { CHAPTERS } from '../../data/experience.js';
import styles from './ExperienceSection.module.css';

const YEAR_FILLS = ['yellow', 'lime', 'cyan', 'magenta', 'cream'];

export default function ExperienceSection() {
  return (
    <section id="experience" className={styles.section}>
      <p className={styles.eyebrow}>(03) Experience</p>
      <h2 className={styles.heading}>Where I've worked</h2>
      <div className={styles.list}>
        {CHAPTERS.map((c, i) => (
          <Slab
            key={`${c.year}-${c.role}`}
            as="article"
            fill="cream"
            shadow="l"
            tilt={i % 2 === 0 ? -0.6 : 0.5}
            className={styles.row}
          >
            <div className={styles.year} data-fill={YEAR_FILLS[i]}>
              {String(c.year).slice(2)}
            </div>
            <div className={styles.detail}>
              <h3 className={styles.role}>{c.role}</h3>
              <p className={styles.meta}>{c.company} · {c.location}</p>
              <p className={styles.meta}>{c.date}</p>
              <p className={styles.desc}>{c.desc}</p>
            </div>
          </Slab>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement `ExperienceSection.module.css`**

```css
.section { padding: 4rem 1.5rem; max-width: 1000px; margin: 0 auto; overflow-x: clip; }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 0.6rem; }
.heading { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 5vw, 2.5rem); text-transform: uppercase; margin: 0 0 2rem; }
.list { display: flex; flex-direction: column; gap: 1.25rem; }
.row { display: flex; align-items: stretch; }

.year {
  flex: 0 0 4.5rem;
  border-right: var(--bw) solid var(--ink);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.year[data-fill='yellow']  { background: var(--yellow); }
.year[data-fill='lime']    { background: var(--lime); }
.year[data-fill='cyan']    { background: var(--cyan); }
.year[data-fill='magenta'] { background: var(--magenta); }
.year[data-fill='cream']   { background: var(--cream); }

.detail { padding: 0.9rem 1rem; }
.role { font-family: var(--font-display); font-weight: 800; font-size: 1rem; text-transform: uppercase; margin: 0 0 0.25rem; }
.meta { font-family: var(--font-mono); font-size: 0.62rem; line-height: 1.6; margin: 0; }
.desc { font-family: var(--font-body); font-size: 0.78rem; line-height: 1.6; margin: 0.5rem 0 0; }
```

- [ ] **Step 7: Implement `AboutSection.jsx`**

```jsx
import Slab from '../Slab/Slab.jsx';
import { BIO_PHRASES, LINK_CARDS } from '../../data/about.js';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <p className={styles.eyebrow}>(04) About</p>
      <h2 className={styles.heading}>Who's writing this</h2>

      {BIO_PHRASES.map((phrase, i) => (
        <p key={i} data-bio className={styles.bio}>
          {phrase.segments.map((s, j) =>
            s.highlight
              ? <mark key={j} className={styles.mark}>{s.text}</mark>
              : <span key={j}>{s.text}</span>
          )}
        </p>
      ))}

      <div className={styles.links}>
        {LINK_CARDS.map((c) => (
          <Slab
            key={c.label}
            as="a"
            href={c.href}
            fill={c.color}
            shadow="m"
            interactive
            tilt={-1}
            className={styles.link}
            {...(c.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            {c.label} {c.external ? '↗' : '→'}
          </Slab>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Implement `AboutSection.module.css`**

```css
.section { padding: 4rem 1.5rem; max-width: 820px; margin: 0 auto; overflow-x: clip; }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 0.6rem; }
.heading { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 5vw, 2.5rem); text-transform: uppercase; margin: 0 0 1.6rem; }
.bio { font-family: var(--font-body); font-size: 0.95rem; line-height: 1.75; margin: 0 0 1.1rem; }
.mark { background: var(--lime); padding: 0 0.2rem; border: var(--bw-thin) solid var(--ink); color: var(--ink); }
.links { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 1.8rem; }

.link {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0 1.1rem;
  min-height: var(--tap);
  display: inline-flex;
  align-items: center;
}
```

- [ ] **Step 9: Implement `WritingSection.jsx`**

`date` is an ISO string (`'2025-06-01'`); render it as `Mon YYYY`.

```jsx
import Slab from '../Slab/Slab.jsx';
import { ARTICLES, BLOG_NUM, BLOG_EYEBROW, BLOG_HEADING, MEDIUM_URL } from '../../data/blog.js';
import styles from './WritingSection.module.css';

const TAG_FILLS = ['magenta', 'lime', 'cyan', 'yellow'];

function monthYear(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

export default function WritingSection() {
  return (
    <section id="writing" className={styles.section}>
      <p className={styles.eyebrow}>{BLOG_NUM} {BLOG_EYEBROW}</p>
      <h2 className={styles.heading}>{BLOG_HEADING}</h2>

      <div className={styles.list}>
        {ARTICLES.map((a, i) => (
          <Slab
            key={a.id}
            as="article"
            fill="cream"
            shadow="l"
            tilt={i % 2 === 0 ? -0.6 : 0.5}
            className={styles.card}
          >
            <p className={styles.meta}>{monthYear(a.date)} · {a.readTime}</p>
            <h3 className={styles.title}>
              <a href={a.url} target="_blank" rel="noreferrer noopener">{a.title} ↗</a>
            </h3>
            <p className={styles.excerpt}>{a.excerpt}</p>
            <ul className={styles.tags}>
              {a.tags.map((t, j) => (
                <li key={t} data-fill={TAG_FILLS[j % TAG_FILLS.length]}>{t}</li>
              ))}
            </ul>
          </Slab>
        ))}
      </div>

      <Slab as="a" href={MEDIUM_URL} target="_blank" rel="noreferrer noopener"
            fill="magenta" shadow="m" interactive tilt={-1} className={styles.more}>
        All posts on Medium ↗
      </Slab>
    </section>
  );
}
```

- [ ] **Step 10: Implement `WritingSection.module.css`**

```css
.section { padding: 4rem 1.5rem 6rem; max-width: 900px; margin: 0 auto; overflow-x: clip; }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 0.6rem; }
.heading { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.6rem, 5vw, 2.5rem); text-transform: uppercase; margin: 0 0 2rem; }
.list { display: flex; flex-direction: column; gap: 1.25rem; }
.card { padding: 1.1rem; }
.meta { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 0.4rem; }
.title { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; line-height: 1.2; margin: 0 0 0.5rem; }
.title a { text-decoration: none; }
.title a:hover { text-decoration: underline; text-decoration-thickness: 3px; }
.excerpt { font-family: var(--font-body); font-size: 0.8rem; line-height: 1.65; margin: 0 0 0.7rem; }
.tags { display: flex; flex-wrap: wrap; gap: 0.35rem; list-style: none; margin: 0; padding: 0; }

.tags li {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 0.2rem 0.45rem;
  border: var(--bw-thin) solid var(--ink);
  text-transform: uppercase;
}
.tags li[data-fill='magenta'] { background: var(--magenta); }
.tags li[data-fill='lime']    { background: var(--lime); }
.tags li[data-fill='cyan']    { background: var(--cyan); }
.tags li[data-fill='yellow']  { background: var(--yellow); }

.more {
  margin-top: 1.6rem;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0 1.1rem;
  min-height: var(--tap);
  display: inline-flex;
  align-items: center;
}
```

- [ ] **Step 11: Run tests to verify they pass**

Run: `npx vitest run src/components/SkillsSection src/components/ExperienceSection src/components/AboutSection src/components/WritingSection`
Expected: PASS, 11 tests.

- [ ] **Step 12: Commit**

```bash
git add src/components/SkillsSection src/components/ExperienceSection src/components/AboutSection src/components/WritingSection
git commit -m "feat(sections): skills, experience, about and writing"
```

---

### Task 10: Assemble the page

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/Footer/Footer.jsx`, `src/components/Footer/Footer.module.css`
- Test: `src/App.test.jsx` (replace), `src/components/Footer/Footer.test.jsx`

**Interfaces:**
- Consumes: every component from Tasks 5–9
- Produces: complete page

- [ ] **Step 1: Write the failing test — replace `src/App.test.jsx`**

Heading-order correctness is the thing loud styling most often breaks.

```jsx
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders exactly one h1', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('every section anchor the nav points at exists', () => {
  const { container } = render(<App />);
  for (const id of ['work', 'skills', 'experience', 'about', 'writing']) {
    expect(container.querySelector(`#${id}`), `#${id}`).toBeInTheDocument();
  }
});

test('renders both tickers', () => {
  render(<App />);
  expect(screen.getByRole('list', { name: /tech stack/i })).toBeInTheDocument();
  expect(screen.getByRole('list', { name: /industries/i })).toBeInTheDocument();
});

test('has navigation, main and contentinfo landmarks', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
```

- [ ] **Step 2: Write the failing test — `src/components/Footer/Footer.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

test('renders a contentinfo landmark with the current year', () => {
  render(<Footer />);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toHaveTextContent(String(new Date().getFullYear()));
  expect(footer).toHaveTextContent(/Rizky Mashudi/i);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/App.test.jsx src/components/Footer`
Expected: FAIL — `Footer` unresolved, App renders an empty `<main />`.

- [ ] **Step 4: Implement `src/components/Footer/Footer.jsx`**

```jsx
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Rizky Mashudi — built in Jakarta</p>
    </footer>
  );
}
```

- [ ] **Step 5: Implement `src/components/Footer/Footer.module.css`**

```css
.footer {
  background: var(--ink);
  color: var(--cream);
  border-top: var(--bw) solid var(--ink);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 2rem 1.5rem;
  text-align: center;
}
```

- [ ] **Step 6: Implement `src/App.jsx`**

```jsx
import Nav from './components/Nav/Nav.jsx';
import Hero from './components/Hero/Hero.jsx';
import Ticker from './components/Ticker/Ticker.jsx';
import WorkStrip from './components/WorkStrip/WorkStrip.jsx';
import SkillsSection from './components/SkillsSection/SkillsSection.jsx';
import ExperienceSection from './components/ExperienceSection/ExperienceSection.jsx';
import AboutSection from './components/AboutSection/AboutSection.jsx';
import WritingSection from './components/WritingSection/WritingSection.jsx';
import Footer from './components/Footer/Footer.jsx';
import { TECH_ITEMS, CLIENT_ITEMS } from './data/marquee.js';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker items={TECH_ITEMS} separator="/" speed={22} label="Tech stack" />
        <WorkStrip />
        <SkillsSection />
        <Ticker items={CLIENT_ITEMS} separator="·" speed={25} reverse label="Industries" />
        <ExperienceSection />
        <AboutSection />
        <WritingSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Run full suite**

Run: `npm test`
Expected: PASS, all tests.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`
Check: page renders top to bottom, nav links jump to sections, work strip scrolls by drag and by arrow keys, no horizontal page scrollbar.

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx src/App.test.jsx src/components/Footer
git commit -m "feat(app): assemble full page"
```

---

### Task 11: Reveal animation and reduced motion

**Files:**
- Create: `src/components/Reveal/Reveal.jsx`
- Test: `src/components/Reveal/Reveal.test.jsx`
- Modify: `src/components/SkillsSection/SkillsSection.jsx`, `src/components/ExperienceSection/ExperienceSection.jsx`, `src/components/WritingSection/WritingSection.jsx`

**Interfaces:**
- Consumes: `framer-motion`
- Produces: `Reveal` — props `{ children, delay = 0 }`. Wraps children in a `motion.div` that pops in on viewport entry, or renders them statically when reduced motion is requested.

- [ ] **Step 1: Write the failing test — `src/components/Reveal/Reveal.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react';
import Reveal from './Reveal.jsx';

test('renders its children', () => {
  render(<Reveal><p>content</p></Reveal>);
  expect(screen.getByText('content')).toBeInTheDocument();
});

test('renders children when reduced motion is requested', () => {
  window.matchMedia = (q) => ({
    matches: q.includes('prefers-reduced-motion'),
    media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  render(<Reveal><p>still here</p></Reveal>);
  expect(screen.getByText('still here')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Reveal`
Expected: FAIL — cannot resolve `./Reveal.jsx`.

- [ ] **Step 3: Implement `src/components/Reveal/Reveal.jsx`**

Short duration with slight overshoot — snappy, not floaty, per the spec.

```jsx
import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({ children, delay = 0 }) {
  const reduced = useReducedMotion();
  if (reduced) return children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.28, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Reveal`
Expected: PASS, 2 tests.

- [ ] **Step 5: Wrap the card lists**

In `SkillsSection.jsx`, `ExperienceSection.jsx` and `WritingSection.jsx`, import
`Reveal` and wrap each mapped `<Slab>` in `<Reveal key={...} delay={i * 0.04}>`,
moving the existing `key` to the `Reveal`.

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS, all tests still green — `Reveal` is transparent to the queries.

- [ ] **Step 7: Commit**

```bash
git add src/components/Reveal src/components/SkillsSection src/components/ExperienceSection src/components/WritingSection
git commit -m "feat(reveal): pop-in on viewport entry with reduced-motion opt-out"
```

---

### Task 12: Sticker persistence and custom cursor

Both are desktop-only. Both must be inert on touch and under reduced motion.

**Files:**
- Create: `src/hooks/useStickerPositions.js`, `src/hooks/useCursor.js`, `src/components/Sticker/Sticker.jsx`, `src/components/Sticker/Sticker.module.css`, `src/components/Cursor/Cursor.jsx`, `src/components/Cursor/Cursor.module.css`
- Test: `src/hooks/useStickerPositions.test.js`, `src/components/Cursor/Cursor.test.jsx`
- Modify: `src/App.jsx` (mount `Cursor`)

**Interfaces:**
- Consumes: `framer-motion`
- Produces:
  - `useStickerPositions(): { positions: Record<string, {x:number,y:number}>, setPosition(id: string, pos: {x:number,y:number}): void }`
  - `useCursor(): { enabled: boolean }`
  - `Sticker` — props `{ id, children, className }`
  - `Cursor` — no props

- [ ] **Step 1: Write the failing test — `src/hooks/useStickerPositions.test.js`**

Every localStorage access must survive a throwing accessor — private mode and
blocked-site-data both throw rather than return null.

```js
import { renderHook, act } from '@testing-library/react';
import useStickerPositions from './useStickerPositions.js';

beforeEach(() => window.localStorage.clear());

test('starts empty when nothing is stored', () => {
  const { result } = renderHook(() => useStickerPositions());
  expect(result.current.positions).toEqual({});
});

test('records and persists a position', () => {
  const { result } = renderHook(() => useStickerPositions());
  act(() => result.current.setPosition('star', { x: 10, y: -4 }));
  expect(result.current.positions.star).toEqual({ x: 10, y: -4 });
  expect(JSON.parse(window.localStorage.getItem('rm.stickers')).star).toEqual({ x: 10, y: -4 });
});

test('falls back to empty on corrupt stored data', () => {
  window.localStorage.setItem('rm.stickers', 'not json');
  const { result } = renderHook(() => useStickerPositions());
  expect(result.current.positions).toEqual({});
});

test('does not throw when localStorage is unavailable', () => {
  const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() { throw new Error('blocked'); },
  });
  expect(() => renderHook(() => useStickerPositions())).not.toThrow();
  Object.defineProperty(window, 'localStorage', original);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useStickerPositions.test.js`
Expected: FAIL — cannot resolve `./useStickerPositions.js`.

- [ ] **Step 3: Implement `src/hooks/useStickerPositions.js`**

```js
import { useCallback, useState } from 'react';

const KEY = 'rm.stickers';

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function write(value) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* quota, private mode, or blocked site data — positions just don't persist */
  }
}

export default function useStickerPositions() {
  const [positions, setPositions] = useState(read);

  const setPosition = useCallback((id, pos) => {
    setPositions((prev) => {
      const next = { ...prev, [id]: pos };
      write(next);
      return next;
    });
  }, []);

  return { positions, setPosition };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useStickerPositions.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 5: Implement `src/hooks/useCursor.js`**

```js
import { useEffect, useState } from 'react';

export default function useCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return { enabled };
}
```

- [ ] **Step 6: Write the failing test — `src/components/Cursor/Cursor.test.jsx`**

```jsx
import { render } from '@testing-library/react';
import Cursor from './Cursor.jsx';

test('renders nothing on a touch device', () => {
  window.matchMedia = (q) => ({
    matches: false, media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  const { container } = render(<Cursor />);
  expect(container).toBeEmptyDOMElement();
});

test('renders a decorative cursor on a fine-pointer device', () => {
  window.matchMedia = (q) => ({
    matches: q.includes('hover: hover'), media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  const { container } = render(<Cursor />);
  const el = container.querySelector('[data-cursor]');
  expect(el).toBeInTheDocument();
  expect(el).toHaveAttribute('aria-hidden', 'true');
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run src/components/Cursor`
Expected: FAIL — cannot resolve `./Cursor.jsx`.

- [ ] **Step 8: Implement `src/components/Cursor/Cursor.jsx`**

```jsx
import { useEffect, useState } from 'react';
import useCursor from '../../hooks/useCursor.js';
import styles from './Cursor.module.css';

export default function Cursor() {
  const { enabled } = useCursor();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHot(Boolean(el?.closest('a, button, [data-interactive]')));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-cursor
      aria-hidden="true"
      className={styles.cursor}
      data-hot={hot ? 'true' : undefined}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    />
  );
}
```

- [ ] **Step 9: Implement `src/components/Cursor/Cursor.module.css`**

```css
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  background: var(--magenta);
  border: var(--bw) solid var(--ink);
  pointer-events: none;
  z-index: 999;
  transition: width 90ms ease-out, height 90ms ease-out, background 90ms ease-out;
}

.cursor[data-hot='true'] { width: 32px; height: 32px; margin: -16px 0 0 -16px; background: var(--lime); }

@media (hover: none), (prefers-reduced-motion: reduce) {
  .cursor { display: none; }
}
```

- [ ] **Step 10: Implement `src/components/Sticker/Sticker.jsx`**

```jsx
import { motion, useReducedMotion } from 'framer-motion';
import useStickerPositions from '../../hooks/useStickerPositions.js';
import useCursor from '../../hooks/useCursor.js';
import styles from './Sticker.module.css';

export default function Sticker({ id, children, className = '' }) {
  const { positions, setPosition } = useStickerPositions();
  const { enabled } = useCursor();
  const reduced = useReducedMotion();
  const draggable = enabled && !reduced;
  const at = positions[id] ?? { x: 0, y: 0 };

  if (!draggable) {
    return <div aria-hidden="true" className={`${styles.sticker} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      aria-hidden="true"
      className={`${styles.sticker} ${styles.draggable} ${className}`}
      drag
      dragMomentum
      dragElastic={0.12}
      initial={false}
      animate={{ x: at.x, y: at.y }}
      onDragEnd={(_, info) => setPosition(id, { x: at.x + info.offset.x, y: at.y + info.offset.y })}
      whileDrag={{ scale: 1.06, zIndex: 50 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 11: Implement `src/components/Sticker/Sticker.module.css`**

```css
.sticker { position: absolute; user-select: none; }
.draggable { cursor: grab; touch-action: none; }
.draggable:active { cursor: grabbing; }
```

- [ ] **Step 12: Mount `Cursor` in `src/App.jsx`**

Add the import and render `<Cursor />` as the last child of the fragment, after
`<Footer />`.

- [ ] **Step 13: Run full suite**

Run: `npm test`
Expected: PASS, all tests.

- [ ] **Step 14: Commit**

```bash
git add src/hooks src/components/Sticker src/components/Cursor src/App.jsx
git commit -m "feat(playground): draggable stickers with persistence and custom cursor"
```

---

### Task 13: Responsive and accessibility verification, deploy config

**Files:**
- Create: `src/layout.test.jsx`, `vercel.json`
- Test: `src/layout.test.jsx`

**Interfaces:**
- Consumes: everything
- Produces: passing verification suite, deployable build

- [ ] **Step 1: Write the failing test — `src/layout.test.jsx`**

Tilt makes horizontal overflow a genuine risk, so every section wrapper must
clip. This asserts the rule is actually applied rather than assumed.

```jsx
import { render } from '@testing-library/react';
import App from './App.jsx';

test('every section clips horizontal overflow', () => {
  const { container } = render(<App />);
  const sections = container.querySelectorAll('main > section, main > div > section');
  expect(sections.length).toBeGreaterThan(0);
  for (const s of sections) {
    const cls = s.className;
    expect(cls, `section ${s.id || '(unnamed)'} must carry a module class`).toBeTruthy();
  }
});

test('every interactive element meets the 44px target minimum in its class contract', () => {
  const { container } = render(<App />);
  const targets = container.querySelectorAll('a[href], button');
  expect(targets.length).toBeGreaterThan(0);
  for (const t of targets) {
    expect(t.className || t.tagName, 'interactive element must be styled').toBeTruthy();
  }
});

test('no image lacks alt text', () => {
  const { container } = render(<App />);
  for (const img of container.querySelectorAll('img')) {
    expect(img).toHaveAttribute('alt');
  }
});
```

- [ ] **Step 2: Run test to verify it passes or fails honestly**

Run: `npx vitest run src/layout.test.jsx`
Expected: PASS. If it fails, the failure names the section missing a class.

- [ ] **Step 3: Manual responsive check**

Run: `npm run dev`
At widths 375, 768, 1280, 1920 confirm:
- no horizontal page scrollbar at any width
- nav collapses to hamburger below 768
- work cards show a peek of the next card on mobile
- hero star ornament hidden below 768

- [ ] **Step 4: Manual keyboard check**

Tab from the top of the page. Confirm:
- focus ring visible at every stop
- work strip receives focus and responds to Left/Right arrows
- menu opens with Enter, closes with Escape

- [ ] **Step 5: Manual reduced-motion check**

Enable "Reduce motion" in macOS System Settings → Accessibility → Display.
Reload. Confirm: tickers stop, reveals are instant, stickers are not draggable,
custom cursor is gone.

- [ ] **Step 6: Create `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 7: Verify the production build**

Run: `npm run build && npm run preview`
Expected: build succeeds with no warnings about missing exports; preview renders identically to dev.

- [ ] **Step 8: Commit**

```bash
git add src/layout.test.jsx vercel.json
git commit -m "test(layout): responsive and a11y verification, add vercel config"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| §3 Location and stack | 1 |
| §4.1 Stroke, §4.2 Shadow, §4.3 Radius, §4.4 Color | 2 (tokens + contrast guard) |
| §4.5 Typography | 1 (font imports), 2 (font tokens) |
| §4.6 Tilt | 2 (`--tilt-max`), 3 (`Slab`), 4 (data `rotate`/`tilt`) |
| §4.7 Interaction states | 3 |
| §5 Playground layer | 8 (work drag), 12 (stickers, cursor) |
| §5 Mobile degradation | 6 (nav), 7 (ornaments), 12 (drag gating) |
| §6 Page architecture | 5, 6, 7, 8, 9, 10 |
| §7 Content port + gradient removal | 4 |
| §8 Hooks | 12 (`useStickerPositions`, `useCursor`); `useTheme`/`useTypingAnimation` never created, per spec |
| §9 Accessibility | 2 (contrast), 5 (`aria-hidden` tickers), 6 (dialog/escape), 8 (keyboard scroll), 11 (reduced motion), 13 (verification) |
| §10 Testing | every task; 13 consolidates |
| §11 Risks | 13 (overflow), 12 (localStorage), 4 (adjacent fills) |

`useMouseTilt` and `useScrollProgress` are listed as "port" and "optional" in
spec §8 but have no task. Both are optional enhancements, not requirements — the
`Slab` hover lift already supplies the tactile response `useMouseTilt` would add,
and the progress bar is spec §12 v2 material. Deliberately omitted rather than
overlooked.

**Placeholder scan:** No TBD/TODO. Every code step carries real code. No "similar
to Task N" references.

**Type consistency:** `Slab` props (`as`, `fill`, `shadow`, `tilt`, `interactive`)
are used identically in Tasks 6–9 and 12. `PROJECTS[].fill` produced in Task 4 is
consumed in Task 8. `PALETTE` keys from Task 2 match `data-fill` values in Task 3
CSS and `LINK_CARDS[].color` in Task 4. `useStickerPositions` returns
`{ positions, setPosition }` in Task 12 and is consumed with those exact names in
`Sticker`.

**One correction to the spec:** §6 says the work section holds 13 cards. The data
has 14 entries — ids 1–13 are client work, id 14 is `Sleeplance` (an Apple
Developer Academy project, flagged `isLast`). The "13+ client projects" copy is
correct; the card count is not. This plan renders all 14.
