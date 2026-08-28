import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

test('renders a contentinfo landmark with the current year', () => {
  render(<Footer />);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toHaveTextContent(String(new Date().getFullYear()));
  expect(footer).toHaveTextContent(/Rizky Mashudi/i);
});
