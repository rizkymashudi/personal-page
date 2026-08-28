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
