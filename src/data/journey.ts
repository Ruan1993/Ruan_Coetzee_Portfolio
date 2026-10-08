export type JourneyMilestone = {
  id: string;
  period: string;
  title: string;
  category: 'education' | 'geospatial' | 'teaching' | 'creation';
  summary: string;
  detail: string;
  href?: string;
  linkLabel?: string;
};

// Milestones may overlap: the route describes development, not exclusive employment periods.
export const journeyMilestones: readonly JourneyMilestone[] = [
  { id: 'ba', period: '2021', title: 'A foundation in people and places', category: 'education', summary: 'BA Humanities · Geography & History', detail: 'North-West University awarded my BA in Humanities on 9 June 2021. Geography and History shaped the way I understand places, people and change.', href: '#certificates', linkLabel: 'View qualifications' },
  { id: 'honours', period: '2022', title: 'Learning to read the landscape', category: 'education', summary: 'BSc Honours Geography · With distinction', detail: 'Awarded by North-West University on 9 June 2022, with distinction. My research explored land-use and land-cover change in the Western Cape.', href: '#projects', linkLabel: 'Explore research' },
  { id: 'geospatial', period: '2022–2024', title: 'From maps to the field', category: 'geospatial', summary: 'Geospatial work · Remote sensing & aerial survey', detail: 'Professional experience in geospatial technology, LiDAR and aerial survey strengthened my practical understanding of how geographic data is captured and interpreted.', href: '#projects-gis-maps', linkLabel: 'Explore GIS maps' },
  { id: 'digital', period: 'Ongoing', title: 'Building useful digital worlds', category: 'creation', summary: 'RC Digital Creations · Websites & digital tools', detail: 'Alongside my geographical and educational interests, I design and develop websites and practical digital experiences. This is a complementary creative focus rather than my primary teaching direction.', href: '#projects-websites', linkLabel: 'Explore websites' },
  { id: 'classroom', period: '2026', title: 'Bringing the world into the classroom', category: 'teaching', summary: 'Teaching practice · Geography & Social Sciences', detail: 'School teaching practice across Geography and Social Sciences connects my subject knowledge with real lessons, learners and classroom experiences.', href: '#teaching', linkLabel: 'Explore teaching' },
  { id: 'pgce', period: '2026 · In progress', title: 'The next chapter: education', category: 'teaching', summary: 'STADIO · Postgraduate Certificate in Education', detail: 'I am currently studying towards my PGCE at STADIO, with a focus on becoming a Geography, History and Social Sciences educator. The qualification is not yet completed.', href: '#qualifications', linkLabel: 'View academic pathway' },
];
