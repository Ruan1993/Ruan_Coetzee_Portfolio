import type { PortfolioFocus } from '../types/portfolio';

interface FocusCardProps {
  focus: PortfolioFocus;
  priority?: boolean;
}

export function FocusCard({ focus, priority = false }: FocusCardProps) {
  return (
    <article className={priority ? 'focus-card focus-card--priority' : 'focus-card'}>
      <p className="eyebrow">{focus.eyebrow}</p>
      <h2>{focus.title}</h2>
      <p>{focus.description}</p>
      <ul>{focus.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      {focus.link ? <a className="text-link" href={focus.link.href}>{focus.link.label}</a> : null}
    </article>
  );
}
