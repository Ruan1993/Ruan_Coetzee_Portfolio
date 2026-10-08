import { useState } from 'react';
import type { NavigationItem } from '../types/portfolio';

interface SiteHeaderProps {
  items: readonly NavigationItem[];
}

export function SiteHeader({ items }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Ruan Coetzee portfolio home">RC<span>.</span></a>
      <button className="menu-button" type="button" aria-expanded={isMenuOpen} aria-controls="primary-navigation" onClick={() => setIsMenuOpen((isOpen) => !isOpen)}>
        <span className="sr-only">Toggle navigation</span>
        <span aria-hidden="true">{isMenuOpen ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="primary-navigation" aria-label="Primary navigation" className={isMenuOpen ? 'navigation is-open' : 'navigation'}>
        {items.map((item) => <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>{item.label}</a>)}
      </nav>
    </header>
  );
}
