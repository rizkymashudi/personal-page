import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PALETTE } from './palette.js';
import { contrastRatio } from './contrast.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = path.join(__dirname, '../styles/tokens.css');

function readRootHexTokens() {
  const css = readFileSync(TOKENS_PATH, 'utf8');
  const rootBlock = css.match(/:root\s*{([^}]*)}/);
  if (!rootBlock) throw new Error('Could not find a :root block in tokens.css');

  const tokens = {};
  const re = /--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let match;
  while ((match = re.exec(rootBlock[1])) !== null) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

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

// The browser only ever paints the colours declared in tokens.css — PALETTE
// itself is never imported by anything that renders (only CARD_FILLS is
// consumed). Without this test, editing a hex in tokens.css cannot make the
// contrast guard above fail, so it isn't actually guarding what ships.
test('PALETTE hex values match the custom properties tokens.css actually declares', () => {
  const declared = readRootHexTokens();

  for (const [name, { hex }] of Object.entries(PALETTE)) {
    expect(declared[name], `--${name} is missing from tokens.css :root`).toBeDefined();
    expect(declared[name].toLowerCase()).toBe(hex.toLowerCase());
  }

  // --white is declared in tokens.css but intentionally has no PALETTE
  // entry: it is only ever used as a foreground text color (e.g. on the
  // violet fill), never as a background fill needing its own contrast
  // pairing, so there is nothing for it to be checked against here.
  expect(declared.white).toBe('#FFFFFF');
});
