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
