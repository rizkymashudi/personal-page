import { render } from '@testing-library/react';
import Cursor from './Cursor.jsx';

test('renders nothing on a touch device', () => {
  window.matchMedia = (q) => ({
    matches: false, media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  const { container } = render(<Cursor />);
  expect(container).toBeEmptyDOMElement();
});

test('renders a decorative cursor on a fine-pointer device', () => {
  window.matchMedia = (q) => ({
    matches: q.includes('hover: hover'), media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  const { container } = render(<Cursor />);
  const el = container.querySelector('[data-cursor]');
  expect(el).toBeInTheDocument();
  expect(el).toHaveAttribute('aria-hidden', 'true');
});
