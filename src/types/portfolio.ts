export type PortfolioArea = 'teaching' | 'development' | 'geography';

export interface NavigationItem {
  href: `#${string}` | `/${string}`;
  label: string;
}

export interface PortfolioFocus {
  area: PortfolioArea;
  eyebrow: string;
  title: string;
  description: string;
  highlights: readonly string[];
  link?: { href: string; label: string };
}

export interface Qualification {
  title: string;
  institution: string;
  status: 'in-progress' | 'completed';
  detail: string;
}

export interface GallerySummary {
  name: string;
  itemCount: number;
  legacyAnchor: string;
}
