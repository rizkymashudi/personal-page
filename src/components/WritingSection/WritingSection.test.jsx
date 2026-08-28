import { render, screen } from '@testing-library/react';
import WritingSection from './WritingSection.jsx';
import { ARTICLES } from '../../data/blog.js';

test('renders every article as an external link', () => {
  render(<WritingSection />);
  for (const a of ARTICLES) {
    const link = screen.getByRole('link', { name: new RegExp(a.title.slice(0, 24), 'i') });
    expect(link).toHaveAttribute('href', a.url);
    expect(link).toHaveAttribute('target', '_blank');
  }
});

test('shows a human readable date and read time', () => {
  render(<WritingSection />);
  expect(screen.getByText(/Jun 2025/)).toBeInTheDocument();
  expect(screen.getByText(/6 min read/)).toBeInTheDocument();
});
