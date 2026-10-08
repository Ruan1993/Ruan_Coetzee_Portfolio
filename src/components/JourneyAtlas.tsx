import { useEffect, useRef, useState } from 'react';
import { journeyMilestones } from '../data/journey';

export function JourneyAtlas() {
  const [active, setActive] = useState<string>('ba');
  const [visible, setVisible] = useState<string[]>([]);
  const root = useRef<HTMLElement>(null);
  const selected = journeyMilestones.find((item) => item.id === active) ?? journeyMilestones[0];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(journeyMilestones.map((item) => item.id));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      setVisible((previous) => [...new Set([...previous, ...entries.filter((entry) => entry.isIntersecting).map((entry) => (entry.target as HTMLElement).dataset.milestone ?? '')])]);
    }, { threshold: 0.2 });
    root.current?.querySelectorAll('[data-milestone]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="journey-atlas" id="journey" aria-labelledby="journey-heading" ref={root}>
      <div className="journey-atlas__intro">
        <p className="journey-atlas__eyebrow">03 / PROFESSIONAL ATLAS · ROUTE 001</p>
        <h2 id="journey-heading">Every path leads <em>somewhere.</em></h2>
        <p>From reading landscapes to inspiring learners. Follow the milestones that shaped how I explore, create and teach.</p>
      </div>
      <div className="journey-atlas__layout">
        <div className="journey-atlas__route" aria-label="Career milestones">
          <svg className="journey-atlas__contours" viewBox="0 0 440 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {[0,1,2,3,4,5].map((i) => <ellipse key={i} cx="270" cy="350" rx={240 - i * 26} ry={310 - i * 32} fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-18 270 350)" />)}
          </svg>
          <div className="journey-atlas__track" aria-hidden="true" />
          {journeyMilestones.map((item, index) => (
            <button key={item.id} type="button" data-milestone={item.id}
              className={`journey-stop ${active === item.id ? 'is-active' : ''} ${visible.includes(item.id) ? 'is-visible' : ''}`}
              aria-pressed={active === item.id} aria-controls="journey-detail"
              onClick={() => setActive(item.id)}>
              <span className="journey-stop__node"><span>{String(index + 1).padStart(2, '0')}</span></span>
              <span className="journey-stop__copy"><span className="journey-stop__date">{item.period} / {item.category}</span><strong>{item.title}</strong><span className="journey-stop__summary">{item.summary}</span></span>
              <span className="journey-stop__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <aside className="journey-atlas__detail" id="journey-detail" aria-live="polite" aria-atomic="true">
          <div className="journey-atlas__detail-top"><span>FIELD NOTES / {selected.category.toUpperCase()}</span><span>◈ {String(journeyMilestones.findIndex((item) => item.id === active) + 1).padStart(2, '0')} / 06</span></div>
          <div className="journey-atlas__compass" aria-hidden="true"><span>N</span><div>✧</div><span>EXPLORE · DISCOVER · TEACH</span></div>
          <p className="journey-atlas__detail-date">{selected.period}</p>
          <h3>{selected.title}</h3>
          <p className="journey-atlas__detail-summary">{selected.summary}</p>
          <p className="journey-atlas__detail-body">{selected.detail}</p>
          {selected.href && <a href={selected.href}>{selected.linkLabel} <span aria-hidden="true">↗</span></a>}
          <div className="journey-atlas__detail-bottom">THE WORLD IS MY CLASSROOM <span>RC / 2026</span></div>
        </aside>
      </div>
      <p className="journey-atlas__note">Milestones represent overlapping areas of experience, not a strictly sequential employment history.</p>
    </section>
  );
}
