import type { LegacyProjectRecord, ProjectCategoryDefinition } from '../types/portfolio';

export const projectCategories: readonly ProjectCategoryDefinition[] = [
  { id: 'websites', label: 'Website Designs' },
  { id: 'gis-maps', label: 'GIS Maps' },
  { id: 'research', label: 'Research Projects' },
  { id: 'logos', label: 'Logo Designs' },
  { id: 'posters-stickers', label: 'Poster & Sticker Designs' },
  { id: 'qr-designs', label: 'QR Designs' },
];

const stillGreenLogoRecords = [
  { id: 'still-green-8', title: 'Still Green (Design 8)', file: 'Still Green 8.png', alt: 'Still Green Logo Design 8', href: new URL('../../Portfolio Content (For Website)/Logo Designs/Still Green 8.png', import.meta.url).href },
  { id: 'still-green-7', title: 'Still Green (Design 7)', file: 'Still Green 7.png', alt: 'Still Green Logo Design 7', href: new URL('../../Portfolio Content (For Website)/Logo Designs/Still Green 7.png', import.meta.url).href },
  { id: 'still-green-6', title: 'Still Green (Design 6)', file: 'Still Green 6.png', alt: 'Still Green Logo Design 6', href: new URL('../../Portfolio Content (For Website)/Logo Designs/Still Green 6.png', import.meta.url).href },
] as const;

const logoConceptRecords = [
  { id: 'logo-concept-1', title: 'Logo Concept 1', file: 'WhatsApp Image 2024-04-24 at 10.05.26 (1).jpeg', href: new URL('../../Portfolio Content (For Website)/Logo Designs/WhatsApp Image 2024-04-24 at 10.05.26 (1).jpeg', import.meta.url).href },
  { id: 'logo-concept-2', title: 'Logo Concept 2', file: 'WhatsApp Image 2024-04-24 at 10.05.26.jpeg', href: new URL('../../Portfolio Content (For Website)/Logo Designs/WhatsApp Image 2024-04-24 at 10.05.26.jpeg', import.meta.url).href },
  { id: 'logo-concept-3', title: 'Logo Concept 3', file: 'WhatsApp Image 2024-04-24 at 10.05.27.jpeg', href: new URL('../../Portfolio Content (For Website)/Logo Designs/WhatsApp Image 2024-04-24 at 10.05.27.jpeg', import.meta.url).href },
] as const;

const stillGreenStickerRecords = [
  { id: 'still-green-beetroot', title: 'Still Green (Beetroot)', file: 'Still Green - Beetroot.png', alt: 'Still Green Beetroot Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Beetroot.png', import.meta.url).href },
  { id: 'still-green-chai', title: 'Still Green (Chai)', file: 'Still Green - Chai.png', alt: 'Still Green Chai Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Chai.png', import.meta.url).href },
  { id: 'still-green-pea-shoots', title: 'Still Green (Pea Shoots)', file: 'Still Green - Pea Shoots.png', alt: 'Still Green Pea Shoots Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Pea Shoots.png', import.meta.url).href },
  { id: 'still-green-salad-mix', title: 'Still Green (Salad Mix)', file: 'Still Green - Salad Mix.png', alt: 'Still Green Salad Mix Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Salad Mix.png', import.meta.url).href },
  { id: 'still-green-sunflower', title: 'Still Green (Sunflower)', file: 'Still Green - Sunflower.png', alt: 'Still Green Sunflower Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Sunflower.png', import.meta.url).href },
  { id: 'still-green-broccoli', title: 'Still Green (Broccoli)', file: 'Still Green - Broccoli.png', alt: 'Still Green Broccoli Sticker', href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Still Green - Broccoli.png', import.meta.url).href },
] as const;

export const legacyProjects: readonly LegacyProjectRecord[] = [
  {
    id: 'albertinia-pavers-website', category: 'websites', title: 'Albertinia Pavers',
    description: 'Professional website for a manufacturing company featuring product showcases, service details, and contact forms.',
    tag: 'Web Development', legacyPath: 'https://albertiniapavers.co.za/', href: 'https://albertiniapavers.co.za/', actionLabel: 'Visit Website',
    media: { src: new URL('../../images/Albertinia_Pavers_Website.png', import.meta.url).href, alt: 'Albertinia Pavers', fit: 'cover' },
  },
  {
    id: 'nails-by-wilma-website', category: 'websites', title: 'Nails by Wilma',
    description: 'An elegant website for a nail salon featuring services, pricing, and booking information.',
    tag: 'Web Design', legacyPath: 'https://nailsbywilma.netlify.app', href: 'https://nailsbywilma.netlify.app', actionLabel: 'Visit Website',
    media: { src: new URL('../../images/Nails_by_Wilma_Website.png', import.meta.url).href, alt: 'Nails by Wilma', fit: 'cover' },
  },
  {
    id: 'cc-auto-repairs-website', category: 'websites', title: 'CC Auto Repairs',
    description: 'A professional website for an auto repair shop with service information and contact details.',
    tag: 'Web Development', legacyPath: 'https://ccautorepairs.netlify.app', href: 'https://ccautorepairs.netlify.app', actionLabel: 'Visit Website',
    media: { src: new URL('../../images/CC_Auto_Repairs_Website.png', import.meta.url).href, alt: 'CC Auto Repairs', fit: 'cover' },
  },
  {
    id: 'de-brakke-guest-house-website', category: 'websites', title: 'De Brakke Guest House',
    description: 'A comprehensive website for a guesthouse. The site is live while final client updates are being completed.',
    tag: 'Web Development', legacyPath: 'https://debrakke.netlify.app/', href: 'https://debrakke.netlify.app/', actionLabel: 'Visit Website',
    media: { src: new URL('../../images/De_Brakke_Guest_House_Website.png', import.meta.url).href, alt: 'De Brakke Guest House Website', fit: 'cover' },
  },
  {
    id: 'cities-of-the-world', category: 'gis-maps', title: 'Cities of the World', description: 'GEOG 321 project map.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/GEOG 321 Cities of the World (Ruan, 30195543).png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/GEOG 321 Cities of the World (Ruan, 30195543).png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/GEOG 321 Cities of the World (Ruan, 30195543).png', import.meta.url).href, alt: 'Cities of the World Map', fit: 'cover' },
  },
  {
    id: 'land-cover-2020', category: 'gis-maps', title: 'Land Cover Types (2020)', description: 'A map showing land cover classifications for 2020.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types 2020.png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types 2020.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types 2020.png', import.meta.url).href, alt: 'Land Cover Types 2020', fit: 'cover' },
  },
  {
    id: 'western-cape-land-cover-2014', category: 'gis-maps', title: 'Western Cape Land Cover (2014)', description: 'Land cover types found in the Western Cape (2014).', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types found in the Western Cape 2014.png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types found in the Western Cape 2014.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Land cover types found in the Western Cape 2014.png', import.meta.url).href, alt: 'Western Cape Land Cover 2014', fit: 'cover' },
  },
  {
    id: 'map-of-overberg', category: 'gis-maps', title: 'Map of Overberg', description: 'A detailed map of the Overberg region.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Map of Overberg.png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Map of Overberg.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Map of Overberg.png', import.meta.url).href, alt: 'Map of Overberg', fit: 'cover' },
  },
  {
    id: 'mossel-bay-rivers', category: 'gis-maps', title: 'Mossel Bay Rivers', description: 'Map showcasing the river systems in Mossel Bay.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Mossel Bay Rivers.png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Mossel Bay Rivers.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Mossel Bay Rivers.png', import.meta.url).href, alt: 'Mossel Bay Rivers', fit: 'cover' },
  },
  {
    id: 'rainfall-2005', category: 'gis-maps', title: 'Yearly Rainfall Data (2005)', description: 'Geospatial representation of rainfall data for 2005.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005).jpg',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005).jpg', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005).jpg', import.meta.url).href, alt: 'Rainfall Data 2005', fit: 'cover' },
  },
  {
    id: 'rainfall-2005-2020', category: 'gis-maps', title: 'Yearly Rainfall Data (2005-2020)', description: 'Comparative rainfall data from 2005 to 2020.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005-2020).png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005-2020).png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2005-2020).png', import.meta.url).href, alt: 'Rainfall Data 2005-2020', fit: 'cover' },
  },
  {
    id: 'rainfall-2020', category: 'gis-maps', title: 'Yearly Rainfall Data (2020)', description: 'Geospatial representation of rainfall data for 2020.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2020).jpg',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2020).jpg', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Rainfall yearly data (2020).jpg', import.meta.url).href, alt: 'Rainfall Data 2020', fit: 'cover' },
  },
  {
    id: 'western-cape-study-area', category: 'gis-maps', title: 'Western Cape Study Area', description: 'Map of District Municipalities in the Western Cape.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Study Area (Western Cape - District Municipalities).png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Study Area (Western Cape - District Municipalities).png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Study Area (Western Cape - District Municipalities).png', import.meta.url).href, alt: 'Western Cape District Municipalities', fit: 'cover' },
  },
  {
    id: 'summer-vs-winter', category: 'gis-maps', title: 'Summer vs Winter (2010-2020)', description: 'Seasonal comparison map from 2010 to 2020.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Summer vs Winter, 2010 to 2020.png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Summer vs Winter, 2010 to 2020.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Summer vs Winter, 2010 to 2020.png', import.meta.url).href, alt: 'Summer vs Winter 2010-2020', fit: 'cover' },
  },
  {
    id: 'vaal-river-research-map', category: 'gis-maps', title: 'Vaal River Research Project', description: 'Final focus area map for the Vaal River project.', tag: 'GIS Map', actionLabel: 'View Full Map',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Vaal River Research Project (Focus Area Final).png',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Vaal River Research Project (Focus Area Final).png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Maps Created by Ruan Coetzee/Vaal River Research Project (Focus Area Final).png', import.meta.url).href, alt: 'Vaal River Research Project', fit: 'cover' },
  },
  {
    id: 'geog-321-research', category: 'research', title: 'GEOG 321 Research Project', description: 'A collaborative research project on Liveable Cities.', actionLabel: 'View PDF',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Research Projects/GEOG 321 Research Project, Liveable Cities (Ruan, Avee & Viper).pdf',
    href: new URL('../../Portfolio Content (For Website)/GIS & Remote Sensing Projects/Research Projects/GEOG 321 Research Project, Liveable Cities (Ruan, Avee & Viper).pdf', import.meta.url).href,
  },
  {
    id: 'geog-671-dissertation', category: 'research', title: 'GEOG 671 Mini Dissertation', description: 'Honours level mini-dissertation research.', actionLabel: 'View PDF',
    legacyPath: 'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Research Projects/GEOG 671 Mini Dissertation - R. Coetzee 30195543.pdf',
    href: '/Portfolio%20Content%20(For%20Website)/GIS%20&%20Remote%20Sensing%20Projects/Research%20Projects/GEOG%20671%20Mini%20Dissertation%20-%20R.%20Coetzee%2030195543.pdf',
  },
  {
    id: 'cc-auto-repairs-logo', category: 'logos', title: 'CC Auto Repairs', description: 'Logo design for auto repair business.', tag: 'Logo Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\Logo Designs\\CC Auto Repairs Logo.png',
    href: new URL('../../Portfolio Content (For Website)/Logo Designs/CC Auto Repairs Logo.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/Logo Designs/CC Auto Repairs Logo.png', import.meta.url).href, alt: 'CC Auto Repairs Logo', fit: 'contain' },
  },
  {
    id: 'nails-by-wilma-logo', category: 'logos', title: 'Nails by Wilma', description: 'Logo design for nail salon.', tag: 'Logo Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\Logo Designs\\Nails_by_Wilma_Logo.png',
    href: new URL('../../Portfolio Content (For Website)/Logo Designs/Nails_by_Wilma_Logo.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/Logo Designs/Nails_by_Wilma_Logo.png', import.meta.url).href, alt: 'Nails by Wilma Logo', fit: 'contain' },
  },
  {
    id: 'albertinia-pavers-logo', category: 'logos', title: 'Albertinia Pavers', description: 'Logo design for manufacturing company.', tag: 'Logo Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\Logo Designs\\Albertinia Pavers Logo.png',
    href: new URL('../../Portfolio Content (For Website)/Logo Designs/Albertinia Pavers Logo.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/Logo Designs/Albertinia Pavers Logo.png', import.meta.url).href, alt: 'Albertinia Pavers Logo', fit: 'contain' },
  },
  ...stillGreenLogoRecords.map(({ id, title, file, alt, href }) => ({
    id, category: 'logos' as const, title, description: 'Logo concept for Still Green.', tag: 'Logo Design', actionLabel: 'View Full Image',
    legacyPath: `Portfolio Content (For Website)\\Logo Designs\\${file}`,
    href,
    media: { src: href, alt, fit: 'contain' as const },
  })),
  ...logoConceptRecords.map(({ id, title, file, href }) => ({
    id, category: 'logos' as const, title, description: 'Additional logo concept design.', tag: 'Logo Design', actionLabel: 'View Full Image',
    legacyPath: `Portfolio Content (For Website)\\Logo Designs\\${file}`,
    href,
    media: { src: href, alt: title, fit: 'contain' as const },
  })),
  {
    id: 'nails-by-wilma-poster', category: 'posters-stickers', title: 'Nails by Wilma (Poster)', description: 'Promotional poster design.', tag: 'Poster Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\Poster & Sticker Designs\\Nails_by_Wilma_Poster.png',
    href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Nails_by_Wilma_Poster.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Nails_by_Wilma_Poster.png', import.meta.url).href, alt: 'Nails by Wilma Poster', fit: 'contain' },
  },
  {
    id: 'nails-by-wilma-sticker', category: 'posters-stickers', title: 'Nails by Wilma (Sticker)', description: 'Sticker design for branding.', tag: 'Sticker Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\Poster & Sticker Designs\\Nails By Wilma.png',
    href: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Nails By Wilma.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/Poster & Sticker Designs/Nails By Wilma.png', import.meta.url).href, alt: 'Nails by Wilma Sticker Design', fit: 'contain' },
  },
  ...stillGreenStickerRecords.map(({ id, title, file, alt, href }) => ({
    id, category: 'posters-stickers' as const, title, description: 'Product sticker design.', tag: 'Sticker Design', actionLabel: 'View Full Image',
    legacyPath: `Portfolio Content (For Website)\\Poster & Sticker Designs\\${file}`,
    href,
    media: { src: href, alt, fit: 'contain' as const },
  })),
  {
    id: 'nails-by-wilma-maps-qr', category: 'qr-designs', title: 'Nails by Wilma (Maps QR)', description: 'Custom QR code for Google Maps location.', tag: 'QR Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\QR Designs\\Nails_by_Wilma_Google_Maps_QR-1024.png',
    href: new URL('../../Portfolio Content (For Website)/QR Designs/Nails_by_Wilma_Google_Maps_QR-1024.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/QR Designs/Nails_by_Wilma_Google_Maps_QR-1024.png', import.meta.url).href, alt: 'Nails by Wilma Google Maps QR Code', fit: 'contain' },
  },
  {
    id: 'nails-by-wilma-website-qr', category: 'qr-designs', title: 'Nails by Wilma (Website QR)', description: 'Custom QR code for the business website.', tag: 'QR Design', actionLabel: 'View Full Image',
    legacyPath: 'Portfolio Content (For Website)\\QR Designs\\Nails_by_Wilma_Website_QR-1024.png',
    href: new URL('../../Portfolio Content (For Website)/QR Designs/Nails_by_Wilma_Website_QR-1024.png', import.meta.url).href,
    media: { src: new URL('../../Portfolio Content (For Website)/QR Designs/Nails_by_Wilma_Website_QR-1024.png', import.meta.url).href, alt: 'Nails by Wilma Website QR Code', fit: 'contain' },
  },
];
