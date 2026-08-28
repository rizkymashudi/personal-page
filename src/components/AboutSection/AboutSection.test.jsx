import { render, screen } from '@testing-library/react';
import AboutSection from './AboutSection.jsx';

test('renders all three bio paragraphs', () => {
  const { container } = render(<AboutSection />);
  expect(container.querySelectorAll('[data-bio]')).toHaveLength(3);
});

test('external links open safely in a new tab', () => {
  render(<AboutSection />);
  const linkedin = screen.getByRole('link', { name: /linkedin/i });
  expect(linkedin).toHaveAttribute('target', '_blank');
  expect(linkedin).toHaveAttribute('rel', 'noreferrer noopener');
});

test('email link is not treated as external', () => {
  render(<AboutSection />);
  const email = screen.getByRole('link', { name: /email/i });
  expect(email).toHaveAttribute('href', 'mailto:eremism1@gmail.com');
  expect(email).not.toHaveAttribute('target');
});
