import { render, screen } from '@testing-library/react';
import ExperienceSection from './ExperienceSection.jsx';
import { CHAPTERS } from '../../data/experience.js';

test('renders every chapter', () => {
  render(<ExperienceSection />);
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(CHAPTERS.length);
});

test('shows role, company and date for the newest chapter', () => {
  render(<ExperienceSection />);
  expect(screen.getByRole('heading', { name: /student engineer/i })).toBeInTheDocument();
  expect(screen.getByText(/Essential Developer Academy/)).toBeInTheDocument();
  expect(screen.getByText('Nov 2025 - Present')).toBeInTheDocument();
});
