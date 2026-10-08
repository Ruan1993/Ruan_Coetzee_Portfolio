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

export type LegacyProjectCategory = 'websites' | 'gis-maps' | 'research' | 'logos' | 'posters-stickers' | 'qr-designs';

export interface LegacyProjectRecord {
  id: string;
  category: LegacyProjectCategory;
  title: string;
  description: string;
  tag?: string;
  legacyPath: string;
  href: string;
  actionLabel: string;
  media?: {
    src: string;
    alt: string;
    fit: 'cover' | 'contain';
  };
}

export interface ProjectCategoryDefinition {
  id: LegacyProjectCategory;
  label: string;
}

export type CertificateCategory = 'degree' | 'ai-engineering' | 'web-development-sql';

export interface CertificateRecord {
  id: string;
  category: CertificateCategory;
  title: string;
  legacyPath: string;
  href: string;
}

export interface CertificateGroup {
  id: CertificateCategory;
  title: string;
  status: string;
  description: string;
  records: readonly CertificateRecord[];
}
