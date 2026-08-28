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

test('one instance does not clobber another instance\'s saved position', () => {
  const a = renderHook(() => useStickerPositions());
  const b = renderHook(() => useStickerPositions());

  act(() => a.result.current.setPosition('badge', { x: 10, y: 10 }));
  act(() => b.result.current.setPosition('star', { x: 20, y: 20 }));

  const stored = JSON.parse(window.localStorage.getItem('rm.stickers'));
  expect(stored.badge).toEqual({ x: 10, y: 10 });
  expect(stored.star).toEqual({ x: 20, y: 20 });
});
