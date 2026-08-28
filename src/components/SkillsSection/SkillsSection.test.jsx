import { render, screen } from '@testing-library/react';
import SkillsSection from './SkillsSection.jsx';
import { SKILLS } from '../../data/skills.js';

test('renders all eight skill areas as headings', () => {
  render(<SkillsSection />);
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(SKILLS.length);
});

test('keeps the numbered index labels', () => {
  render(<SkillsSection />);
  expect(screen.getByText('(02.01)')).toBeInTheDocument();
  expect(screen.getByText('(02.08)')).toBeInTheDocument();
});

test('has the skills anchor', () => {
  const { container } = render(<SkillsSection />);
  expect(container.querySelector('#skills')).toBeInTheDocument();
});
