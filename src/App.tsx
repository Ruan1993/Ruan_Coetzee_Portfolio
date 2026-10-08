import heroImage from '../images/IMG-20231219-WA0021 (1).jpg';
import { FocusCard } from './components/FocusCard';
import { QualificationList } from './components/QualificationList';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { gallerySummaries, navigationItems, portfolioFocuses, qualifications } from './data/portfolio';

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

        <section className="section" id="qualifications" aria-labelledby="qualifications-heading">
          <p className="eyebrow">Verified academic foundation</p>
          <h2 id="qualifications-heading">Qualifications</h2>
          <QualificationList items={qualifications} />
          <a className="text-link" href="/index.html#certificates">View the existing certificates section</a>
        </section>

        <section className="section" aria-labelledby="gallery-heading">
          <p className="eyebrow">Migration inventory</p>
          <h2 id="gallery-heading">Existing galleries retained</h2>
          <p>The original galleries remain available while each dataset and interaction is migrated into reusable React components.</p>
          <div className="gallery-summary">
            {gallerySummaries.map((gallery) => (
              <a key={gallery.name} href={gallery.legacyAnchor}>
                <strong>{gallery.itemCount}</strong>
                <span>{gallery.name}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
