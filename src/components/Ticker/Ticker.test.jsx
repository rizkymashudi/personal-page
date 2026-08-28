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
