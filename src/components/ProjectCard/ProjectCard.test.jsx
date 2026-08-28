import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard.jsx';

const project = {
  id: 8,
  name: 'Public Transit',
  desc: 'Led a 4-person mobile team on an official metropolitan MRT transit app.',
  tags: ['Swift', 'Mobile Lead', 'Clean Architecture', 'Transit'],
  rotate: 2.5,
  fill: 'cyan',
};

test('renders name as a heading', () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByRole('heading', { name: 'Public Transit' })).toBeInTheDocument();
});

test('renders every tag', () => {
  render(<ProjectCard project={project} />);
  for (const t of project.tags) expect(screen.getByText(t)).toBeInTheDocument();
});

test('applies the project fill and rotation', () => {
  const { container } = render(<ProjectCard project={project} />);
  const card = container.querySelector('[data-fill]');
  expect(card).toHaveAttribute('data-fill', 'cyan');
  expect(card.style.getPropertyValue('--tilt')).toBe('2.5deg');
});

test('shows a zero-padded index derived from id', () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByText('(01.08)')).toBeInTheDocument();
});
