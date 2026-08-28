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

// jsdom does not implement pointer capture on elements; stub it on the
// scroller rather than changing the component.
function stubPointerCapture(scroller) {
  scroller.setPointerCapture = vi.fn();
  scroller.hasPointerCapture = vi.fn(() => true);
  scroller.releasePointerCapture = vi.fn();
}

// jsdom has no global PointerEvent constructor, so @testing-library/dom's
// fireEvent.pointerDown/Move/Up fall back to a plain `Event` and silently
// drop non-standard init fields (pointerId, pointerType, clientX) — the
// handler would see them as undefined. Build the event by hand and assign
// those fields as own properties instead, then dispatch it with fireEvent.
function firePointer(node, type, props) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, props);
  fireEvent(node, event);
}

test('a drag swallows the click', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  const card = screen.getAllByRole('article')[0];
  stubPointerCapture(scroller);
  const onClick = vi.fn();
  card.addEventListener('click', onClick);

  firePointer(scroller, 'pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 200 });
  firePointer(scroller, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 150 });
  firePointer(scroller, 'pointerup', { pointerId: 1, pointerType: 'mouse' });
  fireEvent.click(card);

  expect(onClick).not.toHaveBeenCalled();
});

test('a genuine click right after a drag still fires', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  const card = screen.getAllByRole('article')[0];
  stubPointerCapture(scroller);
  const onClick = vi.fn();
  card.addEventListener('click', onClick);

  // First, a drag that gets swallowed — this is what could leave `moved` latched.
  firePointer(scroller, 'pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 200 });
  firePointer(scroller, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 150 });
  firePointer(scroller, 'pointerup', { pointerId: 1, pointerType: 'mouse' });
  fireEvent.click(card);

  // Then a genuine click, with no movement, right after.
  firePointer(scroller, 'pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 200 });
  firePointer(scroller, 'pointerup', { pointerId: 1, pointerType: 'mouse' });
  fireEvent.click(card);

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('touch does not engage the synthetic drag', () => {
  render(<WorkStrip />);
  const scroller = screen.getByRole('region', { name: /featured work/i });
  const card = screen.getAllByRole('article')[0];
  const onClick = vi.fn();
  card.addEventListener('click', onClick);

  firePointer(scroller, 'pointerdown', { pointerId: 2, pointerType: 'touch', clientX: 200 });
  firePointer(scroller, 'pointermove', { pointerId: 2, pointerType: 'touch', clientX: 150 });
  firePointer(scroller, 'pointerup', { pointerId: 2, pointerType: 'touch' });
  fireEvent.click(card);

  expect(onClick).toHaveBeenCalledTimes(1);
});
