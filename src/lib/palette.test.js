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
