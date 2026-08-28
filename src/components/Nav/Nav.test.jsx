import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from './Nav.jsx';

test('renders a navigation landmark with all section links', () => {
  render(<Nav />);
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /work/i })).toHaveAttribute('href', '#work');
  expect(screen.getByRole('link', { name: /writing/i })).toHaveAttribute('href', '#writing');
});

test('menu button reports collapsed state initially', () => {
  render(<Nav />);
  const btn = screen.getByRole('button', { name: /open menu/i });
  expect(btn).toHaveAttribute('aria-expanded', 'false');
});

test('opening the menu exposes the panel and flips aria-expanded', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  const openBtn = screen.getByRole('button', { name: /open menu/i });
  await user.click(openBtn);
  expect(openBtn).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /close menu/i })).not.toHaveAttribute('aria-expanded');
});

test('opening the menu moves focus to the panel close button', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveFocus();
});

test('escape closes the menu', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('choosing a link closes the menu', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: /open menu/i }));
  await user.click(screen.getByRole('dialog').querySelector('a[href="#work"]'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
