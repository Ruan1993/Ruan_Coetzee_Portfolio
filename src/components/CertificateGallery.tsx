import type { CertificateGroup } from '../types/portfolio';

interface CertificateGalleryProps {
  groups: readonly CertificateGroup[];
}

export function CertificateGallery({ groups }: CertificateGalleryProps) {
  return (
    <section className="section" id="certificates" aria-labelledby="certificates-heading">
      <p className="eyebrow">Legacy certificate catalog</p>
      <h2 id="certificates-heading">Certificates</h2>
      <div className="certificate-grid">
        {groups.map((group) => (
          <article className="certificate-card" key={group.id}>
            <p className="certificate-status">{group.status}</p>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            {group.records.length === 1 ? (
              <a className="text-link" href={group.records[0].href} target="_blank" rel="noopener noreferrer">View Certificate<span aria-hidden="true"> ↗</span></a>
            ) : (
              <details>
                <summary>View all {group.title} certificates</summary>
                <ol className="certificate-list">
                  {group.records.map((record) => (
                    <li key={record.id}><a href={record.href} target="_blank" rel="noopener noreferrer">{record.title}<span aria-hidden="true"> ↗</span></a></li>
                  ))}
                </ol>
              </details>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
