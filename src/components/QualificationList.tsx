import type { Qualification } from '../types/portfolio';

interface QualificationListProps {
  items: readonly Qualification[];
}

export function QualificationList({ items }: QualificationListProps) {
  return (
    <div className="qualification-list">
      {items.map((item) => (
        <article className="qualification" key={item.title}>
          <span className={`status status--${item.status}`}>{item.status === 'in-progress' ? 'In progress' : 'Completed'}</span>
          <h3>{item.title}</h3>
          <p className="institution">{item.institution}</p>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}
