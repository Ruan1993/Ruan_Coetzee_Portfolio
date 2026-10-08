import { useState } from 'react';
import portrait from '../images/IMG-20231219-WA0021 (1).jpg';
import { OrbitGlobe } from './components/OrbitGlobe';
import { BlopChat } from './components/BlopChat';
import { CertificateGallery } from './components/CertificateGallery';
import { ContactForm } from './components/ContactForm';
import { FocusCard } from './components/FocusCard';
import { ProjectGallery } from './components/ProjectGallery';
import { QualificationList } from './components/QualificationList';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { certificateGroups } from './data/certificates';
import { legacyProjects, projectCategories } from './data/legacyPortfolio';
import { navigationItems, portfolioFocuses, qualifications } from './data/portfolio';

const perspectives = [
  { title: 'Education', kicker: 'TEACHING & LEARNING', body: 'I am studying towards a PGCE at STADIO, building on classroom experience in Geography and Social Sciences. I want to help learners see the world with curiosity and confidence.', link: '#teaching', action: 'Explore teaching' },
  { title: 'Geography & GIS', kicker: 'SPATIAL THINKING', body: 'My Geography background includes geospatial analysis, remote sensing and aerial survey work. I bring practical spatial thinking into the way I explore and explain our world.', link: '#geography', action: 'Explore GIS experience' },
  { title: 'Digital creation', kicker: 'BUILDING FOR THE WEB', body: 'Through RC Digital Creations, I build digital experiences that make complex information approachable, useful and engaging.', link: '#web-development', action: 'Explore digital work' },
] as const;

export function App() {
  const [activePerspective, setActivePerspective] = useState(0);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader items={navigationItems} />
      <main id="main-content">
        <section className="hero hero--cinematic" id="home" aria-labelledby="hero-heading">
          <div className="hero__stars" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-kicker"><span className="hero-kicker__line" /> THE WORLD IS MY CLASSROOM <span className="hero-kicker__index">PORTFOLIO / 2026</span></p>
            <p className="hero-intro">HELLO, I'M</p>
            <h1 id="hero-heading"><span>RUAN</span><span className="hero-heading__accent">COETZEE<span className="hero-heading__dot">.</span></span></h1>
            <p className="hero-identity">EDUCATOR <span>/</span> GEOGRAPHER <span>/</span> DIGITAL CREATOR</p>
            <p className="hero-lead">Exploring the world. Inspiring curious minds. Bringing geography, education and technology together.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#teaching">EXPLORE MY JOURNEY <span aria-hidden="true">↗</span></a>
              <a className="button button--secondary" href="#contact">LET'S CONNECT <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-footnote"><span className="hero-footnote__marker" /> CURRENTLY STUDYING TOWARDS A PGCE · STADIO</div>
          </div>
          <div className="hero-visual"><OrbitGlobe /><a className="hero-portrait" href="#about" aria-label="Meet Ruan Coetzee"><img src={portrait} alt="Portrait of Ruan Coetzee" /><span>MEET RUAN <span aria-hidden="true">↗</span></span></a><span className="hero-visual__caption">THINK BEYOND BORDERS. TEACH BEYOND THE CLASSROOM.</span></div>
          <a className="hero-scroll" href="#teaching">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-heading">
          <div className="about-photo-panel"><div className="about-photo-frame"><img src={portrait} alt="Ruan Coetzee seated outdoors" loading="lazy" /></div><span className="about-photo-label"><span className="about-status" /> THE PERSON BEHIND THE PORTFOLIO</span></div>
          <div className="about-content"><p className="about-eyebrow">02 / GET TO KNOW ME</p><h2 id="about-heading">Curiosity is where <em>everything begins.</em></h2><p className="about-intro">I'm Ruan — an educator in training, a geographer at heart and a creator who loves connecting people, places and ideas.</p><p className="about-helper">Choose a perspective to explore my journey.</p>
            <div className="about-tabs" role="tablist" aria-label="Explore Ruan's background">{perspectives.map((item, index) => <button key={item.title} type="button" role="tab" id={`about-tab-${index}`} aria-controls="about-tab-panel" aria-selected={activePerspective === index} className={activePerspective === index ? 'about-tab is-active' : 'about-tab'} onClick={() => setActivePerspective(index)}>{item.title}<span aria-hidden="true">↗</span></button>)}</div>
            <div className="about-panel" id="about-tab-panel" role="tabpanel" aria-labelledby={`about-tab-${activePerspective}`} key={activePerspective}><p className="about-panel-kicker">{perspectives[activePerspective].kicker}</p><p>{perspectives[activePerspective].body}</p><a href={perspectives[activePerspective].link}>{perspectives[activePerspective].action} <span aria-hidden="true">↗</span></a></div>
          </div>
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
        <ContactForm />
      </main>
      <SiteFooter />
      <BlopChat />
    </div>
  );
}
