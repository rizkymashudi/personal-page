import { render, screen, fireEvent } from '@testing-library/react';
import WorkStrip from './WorkStrip.jsx';
import { PROJECTS } from '../../data/projects.js';

test('renders every project', () => {
  render(<WorkStrip />);
  expect(screen.getAllByRole('article')).toHaveLength(PROJECTS.length);
});

test('has a section heading and anchor id', () => {
  const { container } = render(<WorkStrip />);
  expect(container.querySelector('#work')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
});

test('scroller is keyboard reachable and labelled', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  expect(scroller).toHaveAttribute('tabindex', '0');
});

test('right arrow scrolls the strip forward', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  scroller.scrollBy = vi.fn();
  fireEvent.keyDown(scroller, { key: 'ArrowRight' });
  expect(scroller.scrollBy).toHaveBeenCalledWith({ left: 320, behavior: 'smooth' });
});

test('left arrow scrolls the strip backward', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  scroller.scrollBy = vi.fn();
  fireEvent.keyDown(scroller, { key: 'ArrowLeft' });
  expect(scroller.scrollBy).toHaveBeenCalledWith({ left: -320, behavior: 'smooth' });
});
