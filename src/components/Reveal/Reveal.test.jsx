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
