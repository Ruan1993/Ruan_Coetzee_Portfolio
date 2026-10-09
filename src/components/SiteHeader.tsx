import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { NavigationItem } from '../types/portfolio';


interface SiteHeaderProps {
  items: readonly NavigationItem[];
}

const primaryLinks = [
  { href: '#home', label: 'Home' },
  { href: '#journey', label: 'My Journey' },
] as const;

const exploreLinks = [
  { href: '#teaching', label: 'Teaching' },
  { href: '#geography', label: 'Geography & GIS' },
  { href: '#development', label: 'Web Development' },
  { href: '#projects', label: 'Projects' },
  { href: '#qualifications', label: 'Qualifications' },
  { href: '#certificates', label: 'Certificates' },
] as const;

export function SiteHeader({ items: _items }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);

  const dropdownId = useId();

  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsExploreOpen(false);
  }, []);



  // Close dropdown on outside click
  useEffect(() => {
    if (!isExploreOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        exploreRef.current &&
        !exploreRef.current.contains(target) &&
        exploreButtonRef.current &&
        !exploreButtonRef.current.contains(target)
      ) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isExploreOpen]);

  // Close Explore / mobile menu on Escape (Atlas has its own handler)
  useEffect(() => {
    if (!isExploreOpen && !isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isExploreOpen) {
          setIsExploreOpen(false);
          exploreButtonRef.current?.focus();
        } else if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExploreOpen, isMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Ruan Coetzee portfolio home">
          RC<span>.</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setIsMenuOpen((open) => !open);
            setIsExploreOpen(false);
          }}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true">{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>

        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={isMenuOpen ? 'navigation is-open' : 'navigation'}
        >
          <div className="nav-primary">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={closeAll}
              >
                {link.label}
              </a>
            ))}

            <div className="nav-explore" ref={exploreRef}>
              <button
                ref={exploreButtonRef}
                type="button"
                className={`nav-link nav-explore-trigger${isExploreOpen ? ' is-open' : ''}`}
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
                aria-controls={dropdownId}
                onClick={() => setIsExploreOpen((open) => !open)}
              >
                Explore
                <span className="nav-explore-chevron" aria-hidden="true"></span>
              </button>

              <div
                id={dropdownId}
                className={`nav-dropdown${isExploreOpen ? ' is-open' : ''}`}
                role="menu"
                hidden={!isExploreOpen}
              >
                {exploreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-dropdown-link"
                    role="menuitem"
                    onClick={closeAll}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <span className="nav-globe" aria-label="Atlas Navigator coming soon" role="img">🌍</span>

            <a href="#contact" className="nav-contact" onClick={closeAll}>
              Contact
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
