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
