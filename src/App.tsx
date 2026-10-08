import heroImage from '../images/IMG-20231219-WA0021 (1).jpg';
import { CertificateGallery } from './components/CertificateGallery';
import { FocusCard } from './components/FocusCard';
import { ProjectGallery } from './components/ProjectGallery';
import { QualificationList } from './components/QualificationList';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { certificateGroups } from './data/certificates';
import { legacyProjects, projectCategories } from './data/legacyPortfolio';
import { navigationItems, portfolioFocuses, qualifications } from './data/portfolio';

export function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader items={navigationItems} />
      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">Educator · Geographer · Digital creator</p>
            <h1 id="hero-heading">Ruan Coetzee</h1>
            <p className="hero-lead">Building a teaching career in Geography, History and Social Sciences, backed by research, GIS and web development experience.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#teaching">Explore teaching profile</a>
              <a className="button button--secondary" href="/index.html">Open current portfolio</a>
            </div>
          </div>
          <img className="portrait" src={heroImage} alt="Ruan Coetzee" width="640" height="640" />
        </section>

        <section className="focus-grid" aria-label="Career focus areas">
          {portfolioFocuses.map((focus, index) => (
            <div id={focus.area} key={focus.area}>
              <FocusCard focus={focus} priority={index === 0} />
            </div>
          ))}
        </section>

        <ProjectGallery categories={projectCategories} projects={legacyProjects} />

        <section className="section" id="qualifications" aria-labelledby="qualifications-heading">
          <p className="eyebrow">Verified academic foundation</p>
          <h2 id="qualifications-heading">Qualifications</h2>
          <QualificationList items={qualifications} />
        </section>

        <CertificateGallery groups={certificateGroups} />
      </main>
      <SiteFooter />
    </div>
  );
}
