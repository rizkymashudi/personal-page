import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders a main landmark', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
