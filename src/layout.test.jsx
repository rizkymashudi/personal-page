import { render } from '@testing-library/react';
import App from './App.jsx';

test('every in-page anchor resolves to a real element', () => {
  const { container } = render(<App />);
  const anchors = container.querySelectorAll('a[href^="#"]');
  expect(anchors.length).toBeGreaterThan(0);
  for (const a of anchors) {
    const id = a.getAttribute('href').slice(1);
    expect(container.querySelector(`#${id}`), `href="#${id}" (link text: "${a.textContent}")`).toBeTruthy();
  }
});

test('every external link is safe', () => {
  const { container } = render(<App />);
  const externalLinks = container.querySelectorAll('a[target="_blank"]');
  expect(externalLinks.length).toBeGreaterThan(0);
  for (const a of externalLinks) {
    const rel = a.getAttribute('rel') || '';
    expect(rel, `link to "${a.getAttribute('href')}" must have rel containing noopener`).toMatch(/noopener/);
  }
});

test('heading levels never skip', () => {
  const { container } = render(<App />);
  const headings = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  expect(headings.length).toBeGreaterThan(0);

  const levels = headings.map((h) => Number(h.tagName.slice(1)));
  expect(levels[0], 'the first heading on the page must be an h1').toBe(1);

  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];
    expect(
      curr,
      `heading "${headings[i].textContent}" is h${curr} but follows h${prev} (heading levels must not skip)`
    ).toBeLessThanOrEqual(prev + 1);
  }
});

test('no image lacks alt text', () => {
  const { container } = render(<App />);
  for (const img of container.querySelectorAll('img')) {
    expect(img).toHaveAttribute('alt');
  }
});
