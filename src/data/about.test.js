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
