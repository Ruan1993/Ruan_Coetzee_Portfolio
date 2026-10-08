import type { NavigationItem, PortfolioFocus, Qualification } from '../types/portfolio';

export const navigationItems: readonly NavigationItem[] = [
  { href: '#home', label: 'Home' },
  { href: '#journey', label: 'Journey' },
  { href: '#teaching', label: 'Teaching' },
  { href: '#development', label: 'Web development' },
  { href: '#geography', label: 'Geography & GIS' },
  { href: '#projects', label: 'Projects' },
  { href: '#qualifications', label: 'Qualifications' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
];

export const portfolioFocuses: readonly PortfolioFocus[] = [
  {
    area: 'teaching',
    eyebrow: 'Primary career direction',
    title: 'Teaching Geography, History and Social Sciences',
    description: 'Preparing for classroom practice through a PGCE that is currently in progress, supported by subject knowledge in Geography and History.',
    highlights: ['FET Geography and History', 'Senior Phase Social Sciences', 'Teaching practice and professional development'],
  },
  {
    area: 'development',
    eyebrow: 'Secondary professional focus',
    title: 'Web development and applied AI',
    description: 'Designing and building practical websites and digital tools through RC Digital Creations, including client work and AI integrations.',
    highlights: ['Responsive websites', 'Client portfolio projects', 'Applications and AI integrations'],
    link: { href: '#projects-websites', label: 'Explore web development projects' },
  },
  {
    area: 'geography',
    eyebrow: 'Research and technical foundation',
    title: 'Geography, GIS and research',
    description: 'A geography background grounded in spatial thinking, research, remote sensing and cartographic work.',
    highlights: ['GIS and remote sensing', 'Academic research', 'Maps and visual communication'],
    link: { href: '#projects-gis-maps', label: 'Explore GIS maps and research' },
  },
];

export const qualifications: readonly Qualification[] = [
  {
    title: 'Postgraduate Certificate in Education (PGCE)',
    institution: 'In progress',
    status: 'in-progress',
    detail: 'Teaching qualification currently underway; completion is not claimed.',
  },
  {
    title: 'BSc Honours in Geography and Environmental Sciences',
    institution: 'North-West University',
    status: 'completed',
    detail: 'Completed in 2021 and awarded with distinction in 2022.',
  },
  {
    title: 'BA in Humanities: Geography and History',
    institution: 'North-West University',
    status: 'completed',
    detail: 'Completed in 2021.',
  },
];
