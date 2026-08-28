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
