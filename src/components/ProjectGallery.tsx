import { useState } from 'react';
import type { LegacyProjectCategory, LegacyProjectRecord, ProjectCategoryDefinition } from '../types/portfolio';

interface ProjectGalleryProps {
  categories: readonly ProjectCategoryDefinition[];
  projects: readonly LegacyProjectRecord[];
}

interface ProjectCardProps {
  project: LegacyProjectRecord;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      {project.media ? (
        <a className="project-media-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.actionLabel}: ${project.title}`}>
          <img
            className={`project-image project-image--${project.media.fit}`}
            src={project.media.src}
            alt={project.media.alt}
            loading="lazy"
            decoding="async"
            width="640"
            height="384"
          />
        </a>
      ) : (
        <div className="document-mark" aria-hidden="true">PDF</div>
      )}
      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-card-footer">
          {project.tag ? <span className="project-tag">{project.tag}</span> : <span />}
          <a href={project.href} target="_blank" rel="noopener noreferrer">
            {project.actionLabel}<span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProjectGallery({ categories, projects }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<LegacyProjectCategory>(categories[0].id);
  const visibleProjects = projects.filter((project) => project.category === activeCategory);
  const activeLabel = categories.find((category) => category.id === activeCategory)?.label ?? '';

  return (
    <section className="section" id="projects" aria-labelledby="projects-heading">
      <p className="eyebrow">Complete legacy catalog</p>
      <h2 id="projects-heading">Projects and galleries</h2>
      <p>Every public project and gallery record from the existing portfolio is represented here.</p>
      <div className="filter-list" role="group" aria-label="Filter projects by category">
        {categories.map((category) => {
          const count = projects.filter((project) => project.category === category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              className={activeCategory === category.id ? 'filter-button is-active' : 'filter-button'}
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label} <span aria-label={`${count} items`}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="result-count" aria-live="polite">Showing {visibleProjects.length} {activeLabel.toLowerCase()} records</p>
      <div className="project-grid">
        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </section>
  );
}
