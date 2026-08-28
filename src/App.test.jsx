import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders exactly one h1', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('every section anchor the nav points at exists', () => {
  const { container } = render(<App />);
  for (const id of ['work', 'skills', 'experience', 'about', 'writing']) {
    expect(container.querySelector(`#${id}`), `#${id}`).toBeInTheDocument();
  }
});

test('renders both tickers', () => {
  render(<App />);
  expect(screen.getByRole('list', { name: /tech stack/i })).toBeInTheDocument();
  expect(screen.getByRole('list', { name: /industries/i })).toBeInTheDocument();
});

test('has navigation, main and contentinfo landmarks', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
